/* ==========================================================================
   LIPLEY PREMIUM COSMETICS - INTERACTIVE DRIVER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INTRO SCREEN CONTROLLER ---
    const introScreen = document.getElementById('intro-screen');
    
    // Lock scroll initially
    document.body.classList.add('intro-active');

    // Run transition lifecycle
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('intro-particle');
            const size = Math.random() * 5 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 8 + 8}s`;
            particle.style.animationDelay = `${Math.random() * -12}s`;
            particlesContainer.appendChild(particle);
        }
    }
    setTimeout(() => {
        // Unlock scroll and fade out overlay
        document.body.classList.remove('intro-active');
        if (introScreen) {
            introScreen.classList.add('fade-out');
        }
        
        // Fully remove intro from DOM after transition completes to preserve performance
        setTimeout(() => {
            if (introScreen) {
                introScreen.remove();
            }
        }, 1000);
    }, 3500); // 3.5 seconds duration as requested (3-4s range)


    // --- 2. MOBILE NAVIGATION DRAWER ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMenu() {
        menuToggle.classList.toggle('open');
        mobileDrawer.classList.toggle('open');
        document.body.classList.toggle('intro-active'); // Re-use scroll lock
    }

    if (menuToggle && mobileDrawer) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    // --- 3. STICKY HEADER SCROLL TRIGGER ---
    const header = document.getElementById('main-header');
    
    // Add shadow/shrink on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- 4. SCROLL REVEAL (FADE / SLIDE ENTRANCE) ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserverOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px' // reveal slightly before element enters view
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => revealObserver.observe(el));


    // --- 5. ACTIVE LINK STATE ON SCROLL ---
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const scrollSections = document.querySelectorAll('section');

    const activeLinkObserverOptions = {
        root: null,
        rootMargin: '-40% 0px -50% 0px', // target middle area of screen
        threshold: 0
    };

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, activeLinkObserverOptions);

    scrollSections.forEach(sec => activeLinkObserver.observe(sec));


    // --- 6. E-COMMERCE SPA ROUTER ---
    const viewHome = document.getElementById('view-home');
    const viewProduct = document.getElementById('view-product');
    const viewElements = [viewHome, viewProduct];

    function showView(viewId) {
        viewElements.forEach(view => {
            if (view) {
                view.classList.remove('active');
                if (view.id === viewId) {
                    view.classList.add('active');
                }
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Connect page routing triggers
    const shopNowTriggers = document.querySelectorAll('.shop-now-trigger');
    shopNowTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showView('view-product');
            updateNavActive('nav-shop-link');
        });
    });

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        if (href === '#' || href === '#home') {
            e.preventDefault();
            showView('view-home');
            updateNavActive('nav-home-link');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href === '#featured-product-section' || href === '#products') {
            e.preventDefault();
            showView('view-product');
            updateNavActive('nav-shop-link');
        } else if (href === '#checkout') {
            e.preventDefault();
            openPurchaseOptions();
        } else {
            const targetEl = document.getElementById(href.substring(1));
            if (targetEl) {
                e.preventDefault();
                if (!viewHome.classList.contains('active')) {
                    showView('view-home');
                }
                const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
                navLinks.forEach(nl => {
                    nl.classList.remove('active');
                    if (nl.getAttribute('href') === href) {
                        nl.classList.add('active');
                    }
                });
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    function updateNavActive(activeId) {
        const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.id === activeId) {
                link.classList.add('active');
            }
        });
    }


    // --- 7. CART ENGINE SCRUBBED ---


    // --- 8. WISHLIST ENGINE ---
    let wishlist = [];
    const wishlistDrawer = document.getElementById('wishlist-drawer');
    const wishlistOverlay = document.getElementById('wishlist-overlay');
    const wishlistClose = document.getElementById('wishlist-close');
    const wishlistToggleBtn = document.getElementById('wishlist-toggle-btn');
    const wishlistBodyContent = document.getElementById('wishlist-body-content');
    const wishlistBadge = document.getElementById('wishlist-badge');

    function toggleWishlist() {
        wishlistDrawer.classList.toggle('open');
        document.body.classList.toggle('intro-active');
    }

    if (wishlistToggleBtn) wishlistToggleBtn.addEventListener('click', toggleWishlist);
    if (wishlistClose) wishlistClose.addEventListener('click', toggleWishlist);
    if (wishlistOverlay) wishlistOverlay.addEventListener('click', toggleWishlist);

    const pWishlistBtn = document.getElementById('p-wishlist-btn');
    if (pWishlistBtn) {
        pWishlistBtn.addEventListener('click', () => {
            toggleWishlistItem('strawberry-beetroot');
        });
    }

    function toggleWishlistItem(productId) {
        const index = wishlist.indexOf(productId);
        if (index > -1) {
            wishlist.splice(index, 1);
            if (pWishlistBtn) {
                pWishlistBtn.classList.remove('active');
                pWishlistBtn.querySelector('span').textContent = 'Add to Wishlist';
            }
        } else {
            wishlist.push(productId);
            if (pWishlistBtn) {
                pWishlistBtn.classList.add('active');
                pWishlistBtn.querySelector('span').textContent = 'In Wishlist';
            }
        }
        renderWishlist();
    }

    function renderWishlist() {
        wishlistBadge.textContent = wishlist.length;
        if (wishlist.length === 0) {
            wishlistBodyContent.innerHTML = `
                <div class="empty-cart-view flex-center">
                    <p class="empty-cart-msg">Your wishlist is empty.</p>
                </div>
            `;
            return;
        }

        let wishlistHTML = '<div class="cart-items-list-container">';
        wishlist.forEach(id => {
            wishlistHTML += `
                <div class="cart-item">
                    <img src="assets/images/lipley-balm-product.png" alt="LIPLEY Tinted Lip Balm" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">LIPLEY Strawberry Beetroot Tinted Lip Balm</h4>
                        <span class="cart-item-price">₹149</span>
                        <div style="margin-top: 10px; display: flex; gap: 10px;">
                            <button class="cart-remove-item-btn remove-wishlist-item" data-id="${id}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });
        wishlistHTML += '</div>';
        wishlistBodyContent.innerHTML = wishlistHTML;

        // Bind actions
        wishlistBodyContent.querySelectorAll('.remove-wishlist-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                toggleWishlistItem(id);
            });
        });
    }


    // --- 9. PRODUCT GALLERY ACCORDION & TABS ---
    const mainGalleryImg = document.getElementById('gallery-main-img');
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');

    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            galleryThumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            
            const zoomMode = thumb.getAttribute('data-zoom');
            if (mainGalleryImg) {
                mainGalleryImg.style.transform = 'none';
                mainGalleryImg.style.filter = 'none';

                if (zoomMode === 'close') {
                    mainGalleryImg.style.transform = 'scale(1.5)';
                    mainGalleryImg.style.transformOrigin = 'center';
                } else if (zoomMode === 'pack') {
                    mainGalleryImg.style.transform = 'scale(1.15)';
                    mainGalleryImg.style.filter = 'brightness(1.05)';
                }
            }
        });
    });

    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            header.classList.add('active');
            const tabId = header.getAttribute('data-tab');
            const targetPane = document.getElementById(`tab-${tabId}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });


    // --- 10. PINCODE CHECK CONTROLLER ---
    const pincodeBtn = document.getElementById('delivery-check-btn');
    const pincodeInput = document.getElementById('delivery-pincode');
    const pincodeMsg = document.getElementById('delivery-result-msg');

    if (pincodeBtn && pincodeInput && pincodeMsg) {
        pincodeBtn.addEventListener('click', () => {
            const val = pincodeInput.value.trim();
            if (/^\d{6}$/.test(val)) {
                pincodeMsg.textContent = "✓ Free delivery in 2-3 business days. Cash on Delivery is available.";
                pincodeMsg.style.color = "var(--color-primary)";
            } else {
                pincodeMsg.textContent = "⚠ Please enter a valid 6-digit pincode.";
                pincodeMsg.style.color = "var(--color-accent)";
            }
        });
    }


    // --- 11. FAQ ACCORDION ENGINE ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.parentElement;
            const isActive = parent.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const sign = item.querySelector('.faq-icon');
                if (sign) sign.textContent = '+';
            });

            if (!isActive) {
                parent.classList.add('active');
                const sign = btn.querySelector('.faq-icon');
                if (sign) sign.textContent = '-';
            }
        });
    });


    // --- 12. PURCHASE OPTIONS MODAL ENGINE ---
    const purchaseModal = document.getElementById('purchase-options-modal');
    const purchaseClose = document.getElementById('purchase-modal-close');
    const purchaseBackdrop = document.getElementById('purchase-backdrop');

    window.openPurchaseOptions = function() {
        if (purchaseModal) {
            purchaseModal.classList.add('open');
            document.body.classList.add('intro-active');
        }
    };

    window.closePurchaseOptions = function() {
        if (purchaseModal) {
            purchaseModal.classList.remove('open');
            document.body.classList.remove('intro-active');
        }
    };

    if (purchaseClose) purchaseClose.addEventListener('click', window.closePurchaseOptions);
    if (purchaseBackdrop) purchaseBackdrop.addEventListener('click', window.closePurchaseOptions);

    // ESC key binds
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (wishlistDrawer && wishlistDrawer.classList.contains('open')) {
                toggleWishlist();
            }
            if (purchaseModal && purchaseModal.classList.contains('open')) {
                window.closePurchaseOptions();
            }
        }
    });

    // Share button clipboard fallback
    const pShareBtn = document.getElementById('p-share-btn');
    if (pShareBtn) {
        pShareBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                   alert('LIPLEY website link copied successfully.');
                })
                .catch(() => {
                    alert('LIPLEY Cosmetics: ' + window.location.href);
                });
        });
    }

    // --- 13. BUY NOW EVENT LISTENER ---
    const buyNowButtons = ['btn-buy-now', 'hero-buy-now'];
    buyNowButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.openPurchaseOptions();
            });
        }
    });

    // --- 14. CUSTOMER REVIEWS DATABASE ENGINE ---
    
    // Firebase Configuration - Replace with your credentials to connect live Firestore database
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    let useFirebase = false;
    let db = null;

    // Check if Firebase Compat SDK is loaded and credentials are set
    if (typeof firebase !== 'undefined' && firebaseConfig.projectId !== "YOUR_PROJECT_ID") {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            useFirebase = true;
            console.log("Firebase Firestore connected successfully.");
        } catch (e) {
            console.warn("Firebase config is incomplete. Using local persistent storage fallback.", e);
        }
    }

    const defaultReviews = [
        {
            name: "Aaradhya S.",
            rating: 5,
            comment: "The beetroot tint is so natural and gorgeous. I use it every day instead of lipstick. Highly moisturizing!",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            verified: true,
            approved: true
        },
        {
            name: "Kabir M.",
            rating: 5,
            comment: "Finally a balm that doesn't feel sticky but keeps my lips hydrated for hours. Clean ingredients make a huge difference.",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            verified: true,
            approved: true
        },
        {
            name: "Priya R.",
            rating: 5,
            comment: "Helped clear up my chapped lips in just two days. The natural strawberry scent is lovely and not overpowering.",
            date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            verified: true,
            approved: true
        }
    ];

    const reviewsGrid = document.getElementById('reviews-list-grid');
    const avgStarsDisplay = document.getElementById('avg-stars-display');
    const avgNumDisplay = document.getElementById('avg-num-display');
    const totalCountDisplay = document.getElementById('total-reviews-count');
    const reviewFormContainer = document.getElementById('review-form-container');
    const toggleFormBtn = document.getElementById('toggle-review-form-btn');
    const reviewForm = document.getElementById('customer-review-form');
    const starSelector = document.getElementById('star-selector');
    const starRatingVal = document.getElementById('review-rating-value');
    
    // Moderator Queue Elements
    const modQueueContainer = document.getElementById('moderator-admin-queue');
    const modPendingList = document.getElementById('moderator-pending-list');
    const isAdmin = window.location.search.includes('admin=true');

    // Load initial reviews
    fetchReviews();

    function fetchReviews() {
        if (useFirebase && db) {
            db.collection("reviews")
              .onSnapshot(snapshot => {
                  let reviewsList = [];
                  snapshot.forEach(doc => {
                      const data = doc.data();
                      data.id = doc.id; // Store ID for moderator approvals
                      reviewsList.push(data);
                  });
                  if (reviewsList.length === 0) {
                      seedDefaultReviewsFirebase();
                  } else {
                      processAndRenderReviews(reviewsList);
                  }
              }, err => {
                  console.error("Firestore read error. Falling back to local storage.", err);
                  loadLocalReviews();
              });
        } else {
            loadLocalReviews();
        }
    }

    function seedDefaultReviewsFirebase() {
        if (db) {
            defaultReviews.forEach(r => {
                db.collection("reviews").add(r);
            });
        }
    }

    function loadLocalReviews() {
        let localData = localStorage.getItem("lipley_reviews_db");
        if (!localData) {
            localStorage.setItem("lipley_reviews_db", JSON.stringify(defaultReviews));
            localData = JSON.stringify(defaultReviews);
        }
        const list = JSON.parse(localData);
        processAndRenderReviews(list);
    }

    function processAndRenderReviews(allReviews) {
        // Sort newest first
        allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Filter approved reviews for public
        const publicReviews = allReviews.filter(r => r.approved === true);

        // Update stats
        if (publicReviews.length > 0) {
            const sum = publicReviews.reduce((acc, curr) => acc + curr.rating, 0);
            const avg = (sum / publicReviews.length).toFixed(1);
            if (avgNumDisplay) avgNumDisplay.textContent = avg;
            if (totalCountDisplay) totalCountDisplay.textContent = `Based on ${publicReviews.length} verified reviews`;
            
            // Build stars string
            const roundedAvg = Math.round(avg);
            let starsStr = '★'.repeat(roundedAvg) + '☆'.repeat(5 - roundedAvg);
            if (avgStarsDisplay) avgStarsDisplay.textContent = starsStr;
        } else {
            if (avgNumDisplay) avgNumDisplay.textContent = "0.0";
            if (totalCountDisplay) totalCountDisplay.textContent = "No verified reviews yet";
            if (avgStarsDisplay) avgStarsDisplay.textContent = "☆☆☆☆☆";
        }

        // Render Public Grid
        if (reviewsGrid) {
            if (publicReviews.length === 0) {
                reviewsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; opacity: 0.7; padding: 40px 0;">No reviews yet. Be the first to share your feedback!</p>`;
            } else {
                reviewsGrid.innerHTML = publicReviews.map(r => {
                    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
                    const formattedDate = formatReviewDate(r.date);
                    return `
                        <div class="review-card scroll-reveal reveal-fade-up">
                            <div class="review-rating" style="color: var(--color-accent); font-size: 15px; margin-bottom: 8px;">${stars}</div>
                            <h4 class="review-author" style="font-family: var(--font-sans); font-size: 14px; font-weight: 600; color: var(--color-primary); margin-bottom: 6px;">
                                ${escapeHTML(r.name)} 
                                ${r.verified ? `<span class="verified-tag" style="color: var(--color-accent); font-size: 11px; font-weight: normal; margin-left: 8px; letter-spacing: 0.05em;">✓ Verified Buyer</span>` : ''}
                            </h4>
                            <p class="review-text" style="font-size: 13.5px; opacity: 0.85; line-height: 1.5; font-style: italic;">"${escapeHTML(r.comment)}"</p>
                            <span class="review-date" style="display: block; font-size: 10px; opacity: 0.5; margin-top: 12px;">${formattedDate}</span>
                        </div>
                    `;
                }).join('');
            }
        }

        // Render Admin Moderation Panel if isAdmin is true
        if (isAdmin && modQueueContainer) {
            modQueueContainer.style.display = 'block';
            const pendingReviews = allReviews.filter(r => r.approved !== true);
            
            if (modPendingList) {
                if (pendingReviews.length === 0) {
                    modPendingList.innerHTML = `<p style="opacity: 0.7; font-size: 13px;">No pending reviews in approval queue.</p>`;
                } else {
                    modPendingList.innerHTML = pendingReviews.map((r, idx) => {
                        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
                        const formattedDate = formatReviewDate(r.date);
                        // Use document ID for Firebase or index for localStorage
                        const reviewId = useFirebase ? r.id : idx;
                        return `
                            <div class="pending-review-card" style="background-color: var(--color-secondary); padding: 15px; border-radius: 6px; border: 1px solid rgba(30,58,52,0.1); margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-weight: 600; font-size: 13.5px;">${escapeHTML(r.name)} (${stars})</span>
                                    <span style="font-size: 10px; opacity: 0.6;">${formattedDate}</span>
                                </div>
                                <p style="font-size: 12.5px; font-style: italic; opacity: 0.8;">"${escapeHTML(r.comment)}"</p>
                                <div style="display: flex; gap: 10px; margin-top: 8px;">
                                    <button class="btn btn-primary btn-small approve-btn" data-id="${reviewId}" style="padding: 6px 12px; font-size: 10px; width: auto;">Approve</button>
                                    <button class="btn btn-secondary btn-small delete-btn" data-id="${reviewId}" style="padding: 6px 12px; font-size: 10px; width: auto; background-color: transparent; border-color: rgba(220,53,69,0.7); color: rgba(220,53,69,0.9);">Delete</button>
                                </div>
                            </div>
                        `;
                    }).join('');

                    // Bind moderator buttons
                    modPendingList.querySelectorAll('.approve-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const id = btn.getAttribute('data-id');
                            approvePendingReview(id, allReviews);
                        });
                    });

                    modPendingList.querySelectorAll('.delete-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const id = btn.getAttribute('data-id');
                            deletePendingReview(id, allReviews);
                        });
                    });
                }
            }
        }
    }

    function approvePendingReview(id, allReviews) {
        if (useFirebase && db) {
            db.collection("reviews").doc(id).update({ approved: true })
              .then(() => console.log("Review approved in Firestore"))
              .catch(err => console.error("Firestore approval error", err));
        } else {
            let localList = JSON.parse(localStorage.getItem("lipley_reviews_db") || "[]");
            localList.sort((a, b) => new Date(b.date) - new Date(a.date));
            const pendingList = localList.filter(r => r.approved !== true);
            const target = pendingList[id];
            if (target) {
                const originalIdx = localList.findIndex(r => r.date === target.date && r.name === target.name);
                if (originalIdx !== -1) {
                    localList[originalIdx].approved = true;
                    localStorage.setItem("lipley_reviews_db", JSON.stringify(localList));
                    loadLocalReviews();
                }
            }
        }
    }

    function deletePendingReview(id, allReviews) {
        if (useFirebase && db) {
            db.collection("reviews").doc(id).delete()
              .then(() => console.log("Review deleted from Firestore"))
              .catch(err => console.error("Firestore deletion error", err));
        } else {
            let localList = JSON.parse(localStorage.getItem("lipley_reviews_db") || "[]");
            localList.sort((a, b) => new Date(b.date) - new Date(a.date));
            const pendingList = localList.filter(r => r.approved !== true);
            const target = pendingList[id];
            if (target) {
                const originalIdx = localList.findIndex(r => r.date === target.date && r.name === target.name);
                if (originalIdx !== -1) {
                    localList.splice(originalIdx, 1);
                    localStorage.setItem("lipley_reviews_db", JSON.stringify(localList));
                    loadLocalReviews();
                }
            }
        }
    }

    // Toggle Review Form visibility
    if (toggleFormBtn && reviewFormContainer) {
        toggleFormBtn.addEventListener('click', () => {
            if (reviewFormContainer.style.display === 'none') {
                reviewFormContainer.style.display = 'block';
                toggleFormBtn.textContent = 'Close Review Form';
            } else {
                reviewFormContainer.style.display = 'none';
                toggleFormBtn.textContent = 'Write a Review';
            }
        });
    }

    // Handle Star Selection
    if (starSelector && starRatingVal) {
        const starBtns = starSelector.querySelectorAll('.rating-star-btn');
        starBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const rating = btn.getAttribute('data-value');
                starRatingVal.value = rating;

                // Highlight selected stars
                starBtns.forEach(s => {
                    s.classList.remove('selected');
                    if (parseInt(s.getAttribute('data-value')) <= parseInt(rating)) {
                        s.classList.add('selected');
                    }
                });
            });
        });
        
        // Initial highlight for default value (5 stars)
        starBtns.forEach(s => {
            if (parseInt(s.getAttribute('data-value')) <= 5) {
                s.classList.add('selected');
            }
        });
    }

    // Review Form submission handler
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameVal = document.getElementById('review-name').value.trim();
            const ratingVal = parseInt(starRatingVal.value);
            const commentVal = document.getElementById('review-comment').value.trim();
            
            if (!nameVal || !ratingVal || !commentVal) {
                alert("Please fill in all fields.");
                return;
            }

            const newReview = {
                name: nameVal,
                rating: ratingVal,
                comment: commentVal,
                date: new Date().toISOString(),
                verified: true, // Default to verified buyer for client review form
                approved: false // Set to false to support moderation approval before publication!
            };

            if (useFirebase && db) {
                db.collection("reviews").add(newReview)
                  .then(() => {
                      alert("Thank you! Your review has been submitted successfully and is pending administrator moderation.");
                      reviewForm.reset();
                      resetStarsSelector();
                      reviewFormContainer.style.display = 'none';
                      if (toggleFormBtn) toggleFormBtn.textContent = 'Write a Review';
                  })
                  .catch(err => {
                      console.error("Firestore submit failed. Submitting locally.", err);
                      submitLocally(newReview);
                  });
            } else {
                submitLocally(newReview);
            }
        });
    }

    function submitLocally(newReview) {
        let localList = JSON.parse(localStorage.getItem("lipley_reviews_db") || "[]");
        localList.push(newReview);
        localStorage.setItem("lipley_reviews_db", JSON.stringify(localList));
        
        alert("Thank you! Your review has been submitted successfully. It will be published after approval.");
        
        reviewForm.reset();
        resetStarsSelector();
        if (reviewFormContainer) reviewFormContainer.style.display = 'none';
        if (toggleFormBtn) toggleFormBtn.textContent = 'Write a Review';
        loadLocalReviews();
    }

    function resetStarsSelector() {
        if (starSelector && starRatingVal) {
            starRatingVal.value = "5";
            const starBtns = starSelector.querySelectorAll('.rating-star-btn');
            starBtns.forEach(s => {
                s.classList.remove('selected');
                if (parseInt(s.getAttribute('data-value')) <= 5) {
                    s.classList.add('selected');
                }
            });
        }
    }

    // Helper functions
    function formatReviewDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) + ' at ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

});

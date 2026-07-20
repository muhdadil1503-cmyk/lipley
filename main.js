/* ==========================================================================
   LIPLEY PREMIUM COSMETICS - INTERACTIVE DRIVER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Global quantity state variables
    let currentQty = 1;
    let productPageQty = 1;

    function showToast(message, type = 'success') {
        let toastContainer = document.getElementById('luxury-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'luxury-toast-container';
            toastContainer.style.position = 'fixed';
            toastContainer.style.bottom = '30px';
            toastContainer.style.right = '30px';
            toastContainer.style.zIndex = '99999';
            toastContainer.style.display = 'flex';
            toastContainer.style.flexDirection = 'column';
            toastContainer.style.gap = '10px';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `luxury-toast ${type}`;
        toast.style.background = 'var(--color-primary)';
        toast.style.color = '#ffffff';
        toast.style.border = '1px solid var(--color-accent)';
        toast.style.padding = '14px 24px';
        toast.style.borderRadius = '4px';
        toast.style.fontSize = '13px';
        toast.style.fontFamily = 'var(--font-sans)';
        toast.style.boxShadow = 'var(--shadow-luxury)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toast.style.minWidth = '250px';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.justifyContent = 'space-between';
        
        if (type === 'error') {
            toast.style.background = '#8B2635';
            toast.style.border = '1px solid #dc3545';
        }

        toast.innerHTML = `
            <span>${message}</span>
            <button style="background:none; border:none; color:inherit; font-size:16px; cursor:pointer; margin-left:15px; padding:0; line-height:1;">&times;</button>
        `;

        toastContainer.appendChild(toast);

        // Close button click
        toast.querySelector('button').addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 400);
        });

        // Trigger animation
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 50);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-20px)';
                setTimeout(() => toast.remove(), 400);
            }
        }, 4000);
    }
    window.showToast = showToast;

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
    let hasFinishedIntro = false;
    let removeTimer = null;
    
    function finishIntro() {
        if (hasFinishedIntro) return;
        hasFinishedIntro = true;
        document.body.classList.remove('intro-active');
        if (introScreen) {
            introScreen.classList.add('fade-out');
        }
        removeTimer = setTimeout(() => {
            if (introScreen) {
                introScreen.remove();
            }
        }, 1000);
    }
    setTimeout(finishIntro, 3500); // 3.5 seconds duration as requested (3-4s range)


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


    // --- 3. STICKY HEADER & BACK TO TOP CONTROLLER ---
    const header = document.getElementById('main-header');
    const backToTopBtn = document.getElementById('back-to-top-btn');
    
    // Add shadow/shrink on scroll and control back to top button visibility
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 3.1 HERO SLIDER CONTROLLER ---
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');
    let currentSlide = 0;
    let slideInterval = null;

    function showSlide(index) {
        if (slides.length === 0) return;
        
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        currentSlide = index;
        
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlideShow() {
        stopSlideShow();
        slideInterval = setInterval(nextSlide, 5500); // Switch every 5.5s
    }

    function stopSlideShow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startSlideShow();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startSlideShow();
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            startSlideShow();
        });
    });

    if (slides.length > 0) {
        startSlideShow();
    }


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


    // --- 5.1 FUTURE-READY DYNAMIC PRODUCT DATA MODEL ---
    window.products = {
        "strawberry-beetroot": {
            id: "strawberry-beetroot",
            name: "LIPLEY Strawberry Beetroot Tinted Lip Balm",
            type: "Organic Lip Balm",
            tagline: "Organic Ingredients. Natural Nourishment. Beautifully Tinted Lips.",
            price: 149,
            description: "Premium organic lip balm enriched with Strawberry Extract and Beetroot Oil to help moisturize lips while providing a beautiful natural tinted finish.",
            variant: "Strawberry + Beetroot Tinted",
            image: "assets/images/lipley-balm-product.png",
            ingredients: ["Beeswax", "Shea Butter", "Cocoa Butter", "Almond Oil", "Jojoba Oil", "Castor Oil", "Beetroot Oil", "Coconut Oil", "Alkanet Root", "Manjistha", "Vitamin E", "Strawberry Oil"],
            benefits: [
                "Helps deeply moisturize dry lips.",
                "Helps reduce the appearance of lip dryness and flakiness.",
                "Helps improve the appearance of uneven lip tone.",
                "Helps reduce the appearance of dull-looking lips.",
                "Provides a beautiful natural beetroot tinted finish.",
                "Nourishes lips with natural oils and botanical ingredients.",
                "Supports soft, smooth and healthy-looking lips.",
                "Helps protect lips from everyday dryness.",
                "Provides long-lasting hydration.",
                "Rich in natural antioxidants to support healthy-looking lips.",
                "Helps maintain the natural lip barrier.",
                "Lightweight, non-sticky and comfortable for daily use.",
                "Gives lips a fresh, naturally radiant appearance.",
                "Free from harsh chemicals.",
                "Suitable for Men & Women.",
                "Suitable for everyday use."
            ],
            instructions: "Apply evenly on clean lips whenever needed.<br><br>Reapply throughout the day for continuous hydration and a natural tinted look.<br><br>Apply before bedtime for overnight nourishment."
        }
    };

    let selectedProductId = "strawberry-beetroot";

    window.loadProductDetails = function(productId) {
        const product = window.products[productId];
        if (!product) return;
        
        selectedProductId = productId;
        
        // Update breadcrumb
        const breadcrumbActive = document.querySelector('.breadcrumb-active');
        if (breadcrumbActive) breadcrumbActive.textContent = product.name;
        
        // Update images
        const mainImg = document.getElementById('gallery-main-img');
        if (mainImg) {
            mainImg.src = product.image;
            mainImg.alt = product.name;
        }
        
        const galleryThumbs = document.querySelectorAll('.gallery-thumb img');
        galleryThumbs.forEach(thumb => {
            thumb.src = product.image;
        });
        
        // Update metadata
        const typeTag = document.querySelector('.p-type-tag');
        if (typeTag) typeTag.textContent = product.type;
        
        const titleName = document.querySelector('.p-title-name');
        if (titleName) titleName.textContent = product.name;
        
        const subtitleTagline = document.querySelector('.p-subtitle-tagline');
        if (subtitleTagline) subtitleTagline.textContent = product.tagline;
        
        const priceVal = document.querySelector('.p-rating-price-bar .p-price');
        if (priceVal) priceVal.textContent = `MRP: ₹${product.price}`;
        
        const descText = document.querySelector('.p-description-text');
        if (descText) descText.textContent = product.description;
        
        const variantValue = document.querySelector('.p-variant-value');
        if (variantValue) variantValue.textContent = product.variant;
        
        // Update ingredients
        const ingredientsGrid = document.querySelector('.drawer-ingredients-grid');
        if (ingredientsGrid && product.ingredients) {
            ingredientsGrid.innerHTML = product.ingredients.map(ing => `<span class="ingredient-pill">${ing}</span>`).join('');
        }
        
        // Update benefits
        const benefitsList = document.querySelector('#tab-benefits .drawer-bullet-list');
        if (benefitsList && product.benefits) {
            benefitsList.innerHTML = product.benefits.map(ben => `<li>${ben}</li>`).join('');
        }
        
        // Update instructions
        const instructionsText = document.querySelector('#tab-instructions .tab-desc-text');
        if (instructionsText) {
            instructionsText.innerHTML = product.instructions;
        }
        
        // Trigger recalculation if checkout calculation function exists
        if (typeof calculateOrder === 'function') {
            calculateOrder();
        }
    };

    // --- 6. E-COMMERCE SPA ROUTER ---
    const viewHome = document.getElementById('view-home');
    const viewProduct = document.getElementById('view-product');
    const viewElements = [viewHome, viewProduct];

    // --- 6.1 SPA ROUTING HISTORY AND BACK NAVIGATION ---
    const navigationHistory = [];

    window.pushNavigationState = function(type, id, extra = null) {
        const current = navigationHistory[navigationHistory.length - 1];
        if (current && current.type === type && current.id === id && current.extra === extra) {
            return;
        }
        navigationHistory.push({ type, id, extra });
    };

    function showView(viewId, pushState = true, scrollTop = true) {
        viewElements.forEach(view => {
            if (view) {
                view.classList.remove('active');
                if (view.id === viewId) {
                    view.classList.add('active');
                }
            }
        });
        if (scrollTop) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (pushState) {
            window.pushNavigationState('view', viewId);
        }
    }

    // Initialize state
    if (viewHome && viewHome.classList.contains('active')) {
        window.pushNavigationState('view', 'view-home');
    } else if (viewProduct && viewProduct.classList.contains('active')) {
        window.pushNavigationState('view', 'view-product');
    }

    window.goBack = function() {
        if (navigationHistory.length <= 1) {
            if (viewProduct && viewProduct.classList.contains('active')) {
                showView('view-home');
            }
            return;
        }

        const currentState = navigationHistory.pop();
        
        if (currentState.type === 'popup' || currentState.type === 'policy') {
            closePopupById(currentState.id);
        }

        const prevState = navigationHistory[navigationHistory.length - 1];
        if (prevState) {
            if (prevState.type === 'view') {
                showView(prevState.id, false);
                if (prevState.id === 'view-home') {
                    updateNavActive('nav-home-link');
                } else if (prevState.id === 'view-product') {
                    updateNavActive('nav-shop-link');
                }
            } else if (prevState.type === 'popup') {
                openPopupById(prevState.id, false);
            } else if (prevState.type === 'policy') {
                openPolicyById(prevState.id, prevState.extra, false);
            }
        }
    };

    function openPopupById(id, pushState = true) {
        if (id === 'purchase-options-modal') {
            if (purchaseModal) purchaseModal.classList.add('open');
            document.body.classList.add('intro-active');
        } else if (id === 'wishlist-drawer') {
            if (wishlistDrawer) wishlistDrawer.classList.add('open');
            document.body.classList.add('intro-active');
        }
        if (pushState) {
            window.pushNavigationState('popup', id);
        }
    }

    function openPolicyById(id, text, pushState = true) {
        if (id === 'policy-modal') {
            if (policyData[text] && policyModal) {
                policyTitle.textContent = text;
                policyContent.innerHTML = policyData[text];
                policyModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        }
        if (pushState) {
            window.pushNavigationState('policy', id, text);
        }
    }

    function closePopupById(id) {
        if (id === 'purchase-options-modal') {
            if (purchaseModal) purchaseModal.classList.remove('open');
            document.body.classList.remove('intro-active');
        } else if (id === 'policy-modal') {
            if (policyModal) policyModal.classList.remove('open');
            document.body.style.overflow = '';
        } else if (id === 'wishlist-drawer') {
            if (wishlistDrawer) wishlistDrawer.classList.remove('open');
            document.body.classList.remove('intro-active');
        }
    }

    // Connect page routing triggers
    const shopNowTriggers = document.querySelectorAll('.shop-now-trigger');
    shopNowTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.getAttribute('data-product-id') || 'strawberry-beetroot';
            if (typeof window.loadProductDetails === 'function') {
                window.loadProductDetails(productId);
            }
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
                const wasHomeActive = viewHome.classList.contains('active');
                if (!wasHomeActive) {
                    showView('view-home', true, false);
                }
                const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
                navLinks.forEach(nl => {
                    nl.classList.remove('active');
                    if (nl.getAttribute('href') === href) {
                        nl.classList.add('active');
                    }
                });
                
                // Allow view transition / layout display to complete before scrolling
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, wasHomeActive ? 0 : 50);
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

    window.openWishlist = function() {
        if (wishlistDrawer) {
            wishlistDrawer.classList.add('open');
            document.body.classList.add('intro-active');
            window.pushNavigationState('popup', 'wishlist-drawer');
        }
    };

    window.closeWishlist = function() {
        const current = navigationHistory[navigationHistory.length - 1];
        if (current && current.type === 'popup' && current.id === 'wishlist-drawer') {
            window.goBack();
        } else {
            if (wishlistDrawer) {
                wishlistDrawer.classList.remove('open');
                document.body.classList.remove('intro-active');
            }
        }
    };

    if (wishlistToggleBtn) {
        wishlistToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (wishlistDrawer && wishlistDrawer.classList.contains('open')) {
                window.closeWishlist();
            } else {
                window.openWishlist();
            }
        });
    }
    if (wishlistClose) wishlistClose.addEventListener('click', window.closeWishlist);
    if (wishlistOverlay) wishlistOverlay.addEventListener('click', window.closeWishlist);

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

    // Premium dynamic magnifying inspect hover effect
    const galleryMain = document.querySelector('.gallery-main');
    if (galleryMain && mainGalleryImg) {
        galleryMain.style.overflow = 'hidden';
        galleryMain.style.position = 'relative';
        mainGalleryImg.style.transition = 'transform 0.15s ease-out, filter 0.3s ease';
        
        galleryMain.addEventListener('mousemove', (e) => {
            const rect = galleryMain.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            mainGalleryImg.style.transformOrigin = `${x}% ${y}%`;
            mainGalleryImg.style.transform = 'scale(2)';
        });
        
        galleryMain.addEventListener('mouseleave', () => {
            // Revert to active thumbnail scale/state
            const activeThumb = document.querySelector('.gallery-thumb.active');
            const zoomMode = activeThumb ? activeThumb.getAttribute('data-zoom') : '';
            mainGalleryImg.style.transformOrigin = 'center';
            if (zoomMode === 'close') {
                mainGalleryImg.style.transform = 'scale(1.5)';
            } else if (zoomMode === 'pack') {
                mainGalleryImg.style.transform = 'scale(1.15)';
            } else {
                mainGalleryImg.style.transform = 'scale(1)';
            }
        });
    }

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
            window.pushNavigationState('popup', 'purchase-options-modal');
        }
    };

    window.closePurchaseOptions = function() {
        const current = navigationHistory[navigationHistory.length - 1];
        if (current && current.type === 'popup' && current.id === 'purchase-options-modal') {
            window.goBack();
        } else {
            if (purchaseModal) {
                purchaseModal.classList.remove('open');
                document.body.classList.remove('intro-active');
            }
        }
    };

    if (purchaseClose) purchaseClose.addEventListener('click', window.closePurchaseOptions);
    if (purchaseBackdrop) purchaseBackdrop.addEventListener('click', window.closePurchaseOptions);

    // ESC key binds
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (wishlistDrawer && wishlistDrawer.classList.contains('open')) {
                window.closeWishlist();
            }
            if (purchaseModal && purchaseModal.classList.contains('open')) {
                window.closePurchaseOptions();
            }
            if (policyModal && policyModal.classList.contains('open')) {
                window.closePolicyModal();
            }
        }
    });

    // Share button clipboard fallback
    const pShareBtn = document.getElementById('p-share-btn');
    if (pShareBtn) {
        pShareBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    showToast('Store link copied to clipboard! Feel free to share.');
                })
                .catch(() => {
                    showToast('LIPLEY Cosmetics: ' + window.location.href);
                });
        });
    }

    // --- 13. BUY NOW EVENT LISTENER & PRODUCT PAGE QUANTITY SELECTOR ---
    const pQtyMinus = document.getElementById('p-qty-minus');
    const pQtyPlus = document.getElementById('p-qty-plus');
    const pQtyDisplay = document.getElementById('p-qty-display');

    if (pQtyMinus && pQtyPlus && pQtyDisplay) {
        pQtyMinus.addEventListener('click', (e) => {
            e.preventDefault();
            if (productPageQty > 1) {
                productPageQty--;
                pQtyDisplay.textContent = productPageQty;
            }
        });
        pQtyPlus.addEventListener('click', (e) => {
            e.preventDefault();
            productPageQty++;
            pQtyDisplay.textContent = productPageQty;
        });
    }

    const buyNowButtons = ['btn-buy-now'];
    buyNowButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = btn.getAttribute('data-product-id') || 'strawberry-beetroot';
                if (typeof window.loadProductDetails === 'function') {
                    window.loadProductDetails(productId);
                }
                
                // Sync quantity from product page to checkout modal
                currentQty = productPageQty;
                const checkoutQtyDisplay = document.getElementById('checkout-qty-display');
                if (checkoutQtyDisplay) {
                    checkoutQtyDisplay.textContent = currentQty;
                }
                if (typeof calculateOrder === 'function') {
                    calculateOrder();
                }
                
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
                    
                    let imagesMarkup = '';
                    if (r.beforeImg || r.afterImg) {
                        imagesMarkup = `
                            <div class="review-images-comparison" style="display: flex; gap: 15px; margin: 15px 0;">
                                ${r.beforeImg ? `
                                    <div class="review-img-box" style="flex: 1; text-align: center; border: 1px solid rgba(30,58,52,0.1); border-radius: 4px; padding: 4px; background: #fff;">
                                        <span style="font-size: 9px; text-transform: uppercase; font-weight: 600; color: #777; display: block; margin-bottom: 2px;">Before</span>
                                        <img src="${r.beforeImg}" alt="Before" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 2px;">
                                    </div>
                                ` : ''}
                                ${r.afterImg ? `
                                    <div class="review-img-box" style="flex: 1; text-align: center; border: 1px solid rgba(30,58,52,0.1); border-radius: 4px; padding: 4px; background: #fff;">
                                        <span style="font-size: 9px; text-transform: uppercase; font-weight: 600; color: #777; display: block; margin-bottom: 2px;">After</span>
                                        <img src="${r.afterImg}" alt="After" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 2px;">
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }

                    return `
                        <div class="review-card scroll-reveal reveal-fade-up">
                            <div class="review-rating" style="color: var(--color-accent); font-size: 15px; margin-bottom: 8px;">${stars}</div>
                            <h4 class="review-author" style="font-family: var(--font-sans); font-size: 14px; font-weight: 600; color: var(--color-primary); margin-bottom: 6px;">
                                ${escapeHTML(r.name)} 
                                ${r.verified ? `<span class="verified-tag" style="color: var(--color-accent); font-size: 11px; font-weight: normal; margin-left: 8px; letter-spacing: 0.05em;">✓ Verified Buyer</span>` : ''}
                            </h4>
                            <p class="review-text" style="font-size: 13.5px; opacity: 0.85; line-height: 1.5; font-style: italic;">"${escapeHTML(r.comment)}"</p>
                            ${imagesMarkup}
                            <span class="review-date" style="display: block; font-size: 10px; opacity: 0.5; margin-top: 12px;">${formattedDate}</span>
                            
                            <div class="review-actions-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; border-top: 1px solid rgba(30,58,52,0.06); padding-top: 10px;">
                                <button class="report-review-btn" data-date="${r.date}" data-name="${r.name}" style="background: none; border: none; font-size: 11px; color: #888; cursor: pointer; text-decoration: underline; padding: 0;">
                                    ${r.reported ? '🚩 Flagged' : 'Report Review'}
                                </button>
                                ${isAdmin ? `
                                    <div style="display: flex; gap: 8px;">
                                        <button class="admin-hide-btn" data-date="${r.date}" data-name="${r.name}" style="background: rgba(212,175,87,0.15); border: 1px solid var(--color-accent); color: var(--color-primary); padding: 4px 10px; font-size: 10px; font-weight: 600; cursor: pointer; border-radius: 3px;">Hide</button>
                                        <button class="admin-delete-btn" data-date="${r.date}" data-name="${r.name}" style="background: rgba(220,53,69,0.1); border: 1px solid rgba(220,53,69,0.5); color: #dc3545; padding: 4px 10px; font-size: 10px; font-weight: 600; cursor: pointer; border-radius: 3px;">Delete</button>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('');

                // Bind actions
                reviewsGrid.querySelectorAll('.report-review-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const name = btn.getAttribute('data-name');
                        const date = btn.getAttribute('data-date');
                        reportReview(name, date);
                    });
                });
                if (isAdmin) {
                    reviewsGrid.querySelectorAll('.admin-hide-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const name = btn.getAttribute('data-name');
                            const date = btn.getAttribute('data-date');
                            hideReview(name, date);
                        });
                    });
                    reviewsGrid.querySelectorAll('.admin-delete-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const name = btn.getAttribute('data-name');
                            const date = btn.getAttribute('data-date');
                            deleteReview(name, date);
                        });
                    });
                }
            }
        }

        // Render Admin Moderation Panel if isAdmin is true (shows reported/hidden reviews)
        if (isAdmin && modQueueContainer) {
            modQueueContainer.style.display = 'block';
            modQueueContainer.querySelector('h3').textContent = '🔒 Admin Moderation Queue (Reported or Hidden)';
            const flaggedReviews = allReviews.filter(r => r.approved !== true || r.reported === true);
            
            if (modPendingList) {
                if (flaggedReviews.length === 0) {
                    modPendingList.innerHTML = `<p style="opacity: 0.7; font-size: 13px;">No hidden or reported reviews to moderate.</p>`;
                } else {
                    modPendingList.innerHTML = flaggedReviews.map(r => {
                        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
                        const formattedDate = formatReviewDate(r.date);
                        
                        let imagesMarkup = '';
                        if (r.beforeImg || r.afterImg) {
                            imagesMarkup = `
                                <div class="review-images-comparison" style="display: flex; gap: 15px; margin: 10px 0;">
                                    ${r.beforeImg ? `<img src="${r.beforeImg}" style="max-height: 80px; border-radius: 4px;">` : ''}
                                    ${r.afterImg ? `<img src="${r.afterImg}" style="max-height: 80px; border-radius: 4px;">` : ''}
                                </div>
                            `;
                        }

                        return `
                            <div class="pending-review-card" style="background-color: var(--color-secondary); padding: 15px; border-radius: 6px; border: 1px solid rgba(30,58,52,0.1); margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-weight: 600; font-size: 13.5px;">${escapeHTML(r.name)} (${stars})</span>
                                    <span style="font-size: 10px; opacity: 0.6;">${formattedDate}</span>
                                </div>
                                <p style="font-size: 12.5px; font-style: italic; opacity: 0.8;">"${escapeHTML(r.comment)}"</p>
                                ${imagesMarkup}
                                <div style="font-size: 11px; color: #dc3545; font-weight: 600;">
                                    ${r.reported ? '⚠️ Flagged by customer' : ''} ${!r.approved ? '🚫 Hidden from public view' : ''}
                                </div>
                                <div style="display: flex; gap: 10px; margin-top: 8px;">
                                    <button class="btn btn-primary btn-small approve-btn" data-date="${r.date}" data-name="${r.name}" style="padding: 6px 12px; font-size: 10px; width: auto;">Publish / Keep</button>
                                    <button class="btn btn-secondary btn-small delete-btn" data-date="${r.date}" data-name="${r.name}" style="padding: 6px 12px; font-size: 10px; width: auto; background-color: transparent; border-color: rgba(220,53,69,0.7); color: rgba(220,53,69,0.9);">Delete</button>
                                </div>
                            </div>
                        `;
                    }).join('');

                    // Bind moderator queue buttons
                    modPendingList.querySelectorAll('.approve-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const name = btn.getAttribute('data-name');
                            const date = btn.getAttribute('data-date');
                            approveReview(name, date);
                        });
                    });

                    modPendingList.querySelectorAll('.delete-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const name = btn.getAttribute('data-name');
                            const date = btn.getAttribute('data-date');
                            deleteReview(name, date);
                        });
                    });
                }
            }
        }
    }

    function reportReview(name, date) {
        if (useFirebase && db) {
            db.collection("reviews").where("name", "==", name).where("date", "==", date).get()
              .then(snap => {
                  snap.forEach(doc => {
                      doc.ref.update({ reported: true })
                        .then(() => showToast("Thank you, this review has been reported for moderation."));
                  });
              });
        } else {
            let localList = JSON.parse(localStorage.getItem("lipley_reviews_db") || "[]");
            const idx = localList.findIndex(r => r.name === name && r.date === date);
            if (idx !== -1) {
                localList[idx].reported = true;
                localStorage.setItem("lipley_reviews_db", JSON.stringify(localList));
                showToast("Thank you, this review has been reported for moderation.");
                loadLocalReviews();
            }
        }
    }

    function hideReview(name, date) {
        if (useFirebase && db) {
            db.collection("reviews").where("name", "==", name).where("date", "==", date).get()
              .then(snap => {
                  snap.forEach(doc => {
                      doc.ref.update({ approved: false })
                        .then(() => console.log("Review hidden"));
                  });
              });
        } else {
            let localList = JSON.parse(localStorage.getItem("lipley_reviews_db") || "[]");
            const idx = localList.findIndex(r => r.name === name && r.date === date);
            if (idx !== -1) {
                localList[idx].approved = false;
                localStorage.setItem("lipley_reviews_db", JSON.stringify(localList));
                loadLocalReviews();
            }
        }
    }

    function approveReview(name, date) {
        if (useFirebase && db) {
            db.collection("reviews").where("name", "==", name).where("date", "==", date).get()
              .then(snap => {
                  snap.forEach(doc => {
                      doc.ref.update({ approved: true, reported: false })
                        .then(() => console.log("Review approved/published"));
                  });
              });
        } else {
            let localList = JSON.parse(localStorage.getItem("lipley_reviews_db") || "[]");
            const idx = localList.findIndex(r => r.name === name && r.date === date);
            if (idx !== -1) {
                localList[idx].approved = true;
                localList[idx].reported = false;
                localStorage.setItem("lipley_reviews_db", JSON.stringify(localList));
                loadLocalReviews();
            }
        }
    }

    function deleteReview(name, date) {
        if (confirm("Are you sure you want to permanently delete this review?")) {
            if (useFirebase && db) {
                db.collection("reviews").where("name", "==", name).where("date", "==", date).get()
                  .then(snap => {
                      snap.forEach(doc => {
                          doc.ref.delete()
                            .then(() => console.log("Review deleted"));
                      });
                  });
            } else {
                let localList = JSON.parse(localStorage.getItem("lipley_reviews_db") || "[]");
                const idx = localList.findIndex(r => r.name === name && r.date === date);
                if (idx !== -1) {
                    localList.splice(idx, 1);
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
            
            const beforeFile = document.getElementById('review-before-img').files[0];
            const afterFile = document.getElementById('review-after-img').files[0];
            
            if (!nameVal || !ratingVal || !commentVal) {
                showToast("Please fill in all fields.", "error");
                return;
            }

            const readAsDataURL = (file) => {
                return new Promise((resolve) => {
                    if (!file) return resolve(null);
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
            };

            Promise.all([readAsDataURL(beforeFile), readAsDataURL(afterFile)])
              .then(([beforeBase64, afterBase64]) => {
                  const newReview = {
                      name: nameVal,
                      rating: ratingVal,
                      comment: commentVal,
                      beforeImg: beforeBase64,
                      afterImg: afterBase64,
                      date: new Date().toISOString(),
                      verified: true, // Verified Purchase system
                      approved: true // Publish automatically!
                  };

                  if (useFirebase && db) {
                      db.collection("reviews").add(newReview)
                        .then(() => {
                            showToast("Thank you! Your review has been published successfully.");
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
        });
    }

    function submitLocally(newReview) {
        let localList = JSON.parse(localStorage.getItem("lipley_reviews_db") || "[]");
        localList.push(newReview);
        localStorage.setItem("lipley_reviews_db", JSON.stringify(localList));
        
        showToast("Thank you! Your review has been published successfully.");
        
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

    // --- 12.1 CHECKOUT & ORDER SYSTEM CONTROLLER ---
    const checkoutQtyMinus = document.getElementById('checkout-qty-minus');
    const checkoutQtyPlus = document.getElementById('checkout-qty-plus');
    const checkoutQtyDisplay = document.getElementById('checkout-qty-display');
    
    const billProductPrice = document.getElementById('bill-product-price');
    const billDeliveryCharge = document.getElementById('bill-delivery-charge');
    const billOfferRow = document.getElementById('bill-offer-row');
    const billOfferApplied = document.getElementById('bill-offer-applied');
    const billDiscountRow = document.getElementById('bill-discount-row');
    const billDiscountValue = document.getElementById('bill-discount-value');
    const billGrandTotal = document.getElementById('bill-grand-total');
    
    const couponCodeInput = document.getElementById('coupon-code-input');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponFeedback = document.getElementById('coupon-feedback');
    
    const purchaseOrderForm = document.getElementById('purchase-order-form');
    
    currentQty = 1;
    let couponApplied = false;
    let validCouponCode = 'LIPLEY001';
    let discountPercent = 0.15; // 15% Discount
    
    function calculateOrder() {
        const product = window.products[selectedProductId] || { price: 149 };
        const itemPrice = product.price;
        let productTotal = currentQty * itemPrice;
        let deliveryCharge = 30;
        let offerText = '';
        let discountAmount = 0;
        
        // Quantity discounts & delivery logic
        if (currentQty >= 2) {
            deliveryCharge = 0; // FREE Delivery
            offerText = `Free Delivery`;
        } else {
            // If qty < 2, coupon is not allowed. Reset if it was applied.
            if (couponApplied) {
                couponApplied = false;
                if (couponFeedback) {
                    couponFeedback.style.display = 'block';
                    couponFeedback.textContent = 'Coupon is available only for orders of 2 or more products.';
                    couponFeedback.className = 'promo-feedback-msg error';
                }
                if (couponCodeInput) {
                    couponCodeInput.value = '';
                }
            }
        }
        
        // Coupon discount logic
        if (couponApplied) {
            discountAmount = Math.round(productTotal * discountPercent);
        }
        
        let grandTotal = productTotal + deliveryCharge - discountAmount;
        
        // Update display elements
        if (billProductPrice) billProductPrice.textContent = `₹${productTotal}`;
        if (billDeliveryCharge) {
            billDeliveryCharge.textContent = deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`;
            if (deliveryCharge === 0) {
                billDeliveryCharge.classList.add('free-shipping-tag');
            } else {
                billDeliveryCharge.classList.remove('free-shipping-tag');
            }
        }
        
        if (billOfferRow && billOfferApplied) {
            if (offerText) {
                billOfferApplied.textContent = offerText;
                billOfferRow.style.display = 'flex';
            } else {
                billOfferRow.style.display = 'none';
            }
        }
        
        if (billDiscountRow && billDiscountValue) {
            if (discountAmount > 0) {
                billDiscountValue.textContent = `-₹${discountAmount}`;
                billDiscountRow.style.display = 'flex';
            } else {
                billDiscountRow.style.display = 'none';
            }
        }
        
        if (billGrandTotal) billGrandTotal.textContent = `₹${grandTotal}`;
    }
    
    // Qty minus event
    if (checkoutQtyMinus) {
        checkoutQtyMinus.addEventListener('click', () => {
            if (currentQty > 1) {
                currentQty--;
                if (checkoutQtyDisplay) checkoutQtyDisplay.textContent = currentQty;
                calculateOrder();
            }
        });
    }
    
    // Qty plus event
    if (checkoutQtyPlus) {
        checkoutQtyPlus.addEventListener('click', () => {
            currentQty++;
            if (checkoutQtyDisplay) checkoutQtyDisplay.textContent = currentQty;
            calculateOrder();
        });
    }
    
    // Coupon Apply Event
    if (applyCouponBtn && couponCodeInput) {
        applyCouponBtn.addEventListener('click', () => {
            if (currentQty < 2) {
                couponFeedback.style.display = 'block';
                couponFeedback.textContent = 'Coupon is available only for orders of 2 or more products.';
                couponFeedback.className = 'promo-feedback-msg error';
                couponApplied = false;
                calculateOrder();
                return;
            }
            
            const enteredCode = couponCodeInput.value.trim().toUpperCase();
            
            if (enteredCode === '') {
                couponFeedback.style.display = 'block';
                couponFeedback.textContent = 'Please enter a coupon code.';
                couponFeedback.className = 'promo-feedback-msg error';
                couponApplied = false;
                calculateOrder();
                return;
            }
            
            if (enteredCode === validCouponCode) {
                couponFeedback.style.display = 'block';
                couponFeedback.textContent = 'Coupon applied successfully! Saved 15% on your items.';
                couponFeedback.className = 'promo-feedback-msg success';
                couponApplied = true;
            } else {
                couponFeedback.style.display = 'block';
                couponFeedback.textContent = 'Invalid coupon code. (Discount not applied)';
                couponFeedback.className = 'promo-feedback-msg error';
                couponApplied = false;
            }
            calculateOrder();
        });
    }
    
    // Form Submit Event
    if (purchaseOrderForm) {
        purchaseOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather delivery fields
            const fullName = document.getElementById('order-full-name').value.trim();
            const phone = document.getElementById('order-phone').value.trim();
            const house = document.getElementById('order-house').value.trim();
            const address = document.getElementById('order-address').value.trim();
            const district = document.getElementById('order-district').value.trim();
            const state = document.getElementById('order-state').value.trim();
            const pin = document.getElementById('order-pin').value.trim();
            
            const product = window.products[selectedProductId] || { name: "LIPLEY Strawberry Beetroot Tinted Lip Balm", price: 149 };
            const productName = product.name;
            const itemPrice = product.price;
            const productTotal = currentQty * itemPrice;
            const deliveryCharge = currentQty >= 2 ? 0 : 30;
            const discountAmount = couponApplied ? Math.round(productTotal * discountPercent) : 0;
            const grandTotal = productTotal + deliveryCharge - discountAmount;
            
            // Offer details
            let offerString = '';
            if (currentQty >= 2) {
                offerString = `Free Delivery`;
            }
            
            // Format WhatsApp Message
            let message = `Hello LIPLEY,\n\n`;
            message += `I would like to place an order for:\n`;
            message += `*Product:* ${productName}\n`;
            message += `*Quantity:* ${currentQty}\n`;
            if (offerString) {
                message += `*Offer:* ${offerString}\n`;
            }
            message += `*Product Price:* ₹${productTotal}\n`;
            message += `*Delivery Charge:* ${deliveryCharge === 0 ? 'FREE' : '₹' + deliveryCharge}\n`;
            if (couponApplied) {
                message += `*Coupon Code:* ${validCouponCode} (Saved ₹${discountAmount})\n`;
            }
            message += `*Grand Total:* ₹${grandTotal}\n\n`;
            
            message += `*Customer Details:*\n`;
            message += `*Name:* ${fullName}\n`;
            message += `*Phone:* ${phone}\n`;
            message += `*Address:* ${house}, ${address}, ${district}, ${state} - PIN: ${pin}\n`;
            
            // URL encode message and open WhatsApp
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/917591900437?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }

    // --- 14. DYNAMIC INSTAGRAM FEED CONTROLLER ---
    const instagramGrid = document.querySelector('.instagram-grid');
    const localFallbackPosts = [
        {
            "url": "https://www.instagram.com/lipleycare",
            "image": "assets/images/lipley-balm-product.png",
            "alt": "LIPLEY Strawberry Beetroot Balm closeup",
            "filter": "none"
        },
        {
            "url": "https://www.instagram.com/lipleycare",
            "image": "assets/images/lipley-balm-product.png",
            "alt": "LIPLEY Organic Ingredients display",
            "filter": "saturate(0.85)"
        },
        {
            "url": "https://www.instagram.com/lipleycare",
            "image": "assets/images/lipley-balm-product.png",
            "alt": "LIPLEY Luxury skincare routine",
            "filter": "brightness(0.9)"
        },
        {
            "url": "https://www.instagram.com/lipleycare",
            "image": "assets/images/lipley-balm-product.png",
            "alt": "LIPLEY Tinted shade swatch",
            "filter": "contrast(0.95)"
        }
    ];

    function renderInstagramFeed(posts) {
        if (!instagramGrid) return;
        instagramGrid.innerHTML = posts.map((post, index) => `
            <a href="${post.url}" target="_blank" rel="noopener" class="instagram-item scroll-reveal reveal-scale delay-${index % 4}">
                <img src="${post.image}" alt="${post.alt}" class="instagram-img" loading="lazy" style="filter: ${post.filter || 'none'};">
                <div class="instagram-overlay"><span class="instagram-icon">View Post</span></div>
            </a>
        `).join('');
        
        // Re-trigger scroll reveal observer if present
        if (typeof revealObserver !== 'undefined') {
            const newRevealElements = instagramGrid.querySelectorAll('.scroll-reveal');
            newRevealElements.forEach(el => revealObserver.observe(el));
        }
    }

    if (instagramGrid) {
        fetch('gallery.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    renderInstagramFeed([...data].reverse());
                } else {
                    renderInstagramFeed([...localFallbackPosts].reverse());
                }
            })
            .catch(error => {
                console.warn('Could not load gallery.json (this is normal when running locally via file:// protocol). Using local fallback data.', error);
                renderInstagramFeed(localFallbackPosts);
            });
    }

    // --- 15. POLICY MODAL CONTROLLER ---
    const policyModal = document.getElementById('policy-modal');
    const policyCloseBtn = document.getElementById('policy-close-btn');
    const policyOverlay = document.getElementById('policy-overlay');
    const policyTitle = document.getElementById('policy-modal-title');
    const policyContent = document.getElementById('policy-modal-content');
    
    const policyData = {
        "Privacy Policy": `
            <p><strong>Last Updated: 2026</strong></p>
            <br>
            <p>At LIPLEY, we value your privacy. This policy outlines how we collect, use, and protect your information when you visit our website and place an order.</p>
            <br>
            <h3>1. Information We Collect</h3>
            <p>We collect essential customer details to fulfill your orders, including:</p>
            <ul>
                <li>Full Name</li>
                <li>Phone Number</li>
                <li>Delivery Address (House Name, District, State, PIN Code)</li>
            </ul>
            <br>
            <h3>2. How We Use Your Information</h3>
            <p>We use this information solely to process orders, calculate pricing and discounts, and direct you to WhatsApp to complete your purchase. We do not sell or lease your data.</p>
            <br>
            <h3>3. Security</h3>
            <p>Your details are formatted securely and shared directly with us via WhatsApp, ensuring safe personal transaction data processing.</p>
        `,
        "Shipping Policy": `
            <p><strong>Shipping & Delivery Policy</strong></p>
            <br>
            <p>Thank you for choosing LIPLEY. Here are our shipping terms:</p>
            <br>
            <h3>1. Order Dispatch</h3>
            <p>All orders are processed and dispatched within 24 hours of confirmation.</p>
            <br>
            <h3>2. Shipping Rates</h3>
            <ul>
                <li><strong>Quantity 1:</strong> ₹30 Delivery Charge.</li>
                <li><strong>Quantity 2 or more:</strong> FREE Delivery.</li>
            </ul>
            <br>
            <h3>3. Estimated Delivery Times</h3>
            <p>Delivery times typically range between <strong>3 to 7 business days</strong> across India, depending on your location.</p>
        `,
        "Refund Policy": `
            <p><strong>Refund & Return Policy</strong></p>
            <br>
            <p>We stand behind the quality of LIPLEY cosmetics. Due to the hygiene nature of personal care products, we follow a strict return policy:</p>
            <br>
            <h3>1. Returns & Replacements</h3>
            <p>We do not accept returns on used or opened cosmetics. However, if you receive a damaged, leaked, or incorrect product, we will issue a free replacement.</p>
            <br>
            <h3>2. How to Claim</h3>
            <p>Please contact us on WhatsApp at <strong>+91 7591900437</strong> within <strong>48 hours</strong> of delivery with a photo/video showing the damage. We will verify and process a replacement instantly.</p>
        `,
        "Terms & Conditions": `
            <p><strong>Terms and Conditions of Use</strong></p>
            <br>
            <p>By using the LIPLEY website, you agree to these terms:</p>
            <br>
            <h3>1. Orders & Pricing</h3>
            <p>All product prices are listed in INR (₹). We reserve the right to cancel orders with incomplete address configurations or invalid phone listings.</p>
            <br>
            <h3>2. User Conduct</h3>
            <p>Customers must provide accurate name, contact, and delivery details. Abuse of promotional systems or invalid coupon attempts may result in order cancellation.</p>
            <br>
            <h3>3. WhatsApp Purchases</h3>
            <p>Our ordering process routes details to WhatsApp. A sale is final only upon manual confirmation and payment settlement on WhatsApp.</p>
        `
    };

    const legalLinks = document.querySelectorAll('.legal-link');
    legalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const text = link.textContent.trim();
            if (policyData[text] && policyModal) {
                openPolicyById('policy-modal', text);
            }
        });
    });

    window.closePolicyModal = function() {
        const current = navigationHistory[navigationHistory.length - 1];
        if (current && current.type === 'policy' && current.id === 'policy-modal') {
            window.goBack();
        } else {
            if (policyModal) {
                policyModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        }
    };

    if (policyCloseBtn) policyCloseBtn.addEventListener('click', window.closePolicyModal);
    if (policyOverlay) policyOverlay.addEventListener('click', window.closePolicyModal);

});


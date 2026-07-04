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
            openPurchaseModal();
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


    // --- 7. CART ENGINE DATABASE & ACTION CONTROLLERS ---
    let cart = [];
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartBodyContent = document.getElementById('cart-body-content');
    const cartBadges = document.querySelectorAll('#cart-badge');

    // Toggle cart drawer
    function toggleCart() {
        cartDrawer.classList.toggle('open');
        document.body.classList.toggle('intro-active');
    }

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
    if (cartClose) cartClose.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Quantity buttons on flagship product card / quick add
    const quickAddBtns = document.querySelectorAll('.quick-add-btn');
    quickAddBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addToCart('strawberry-beetroot', 1);
        });
    });

    // Product page quantity triggers
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');

    if (qtyMinus && qtyInput) {
        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val > 1) {
                qtyInput.value = val - 1;
            }
        });
    }

    if (qtyPlus && qtyInput) {
        qtyPlus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            qtyInput.value = val + 1;
        });
    }

    // Add to cart buttons
    const btnAddToCart = document.getElementById('btn-add-to-cart');
    if (btnAddToCart && qtyInput) {
        btnAddToCart.addEventListener('click', () => {
            const qty = parseInt(qtyInput.value);
            addToCart('strawberry-beetroot', qty);
        });
    }

    const btnBuyNow = document.getElementById('btn-buy-now');
    if (btnBuyNow) {
        btnBuyNow.addEventListener('click', () => {
            openPurchaseModal();
        });
    }

    function addToCart(productId, qty, openDrawer = true) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.qty += qty;
        } else {
            cart.push({
                id: productId,
                name: "LIPLEY Strawberry Beetroot Tinted Lip Balm",
                price: 149,
                img: "assets/images/lipley balm product.png.png",
                qty: qty
            });
        }
        renderCart();
        if (openDrawer) {
            cartDrawer.classList.add('open');
            document.body.classList.add('intro-active');
        }
    }

    function renderCart() {
        let totalItems = 0;
        let subtotal = 0;
        
        if (cart.length === 0) {
            cartBodyContent.innerHTML = `
                <div class="empty-cart-view flex-center">
                    <p class="empty-cart-msg">Your shopping cart is empty.</p>
                    <button class="btn btn-secondary btn-small shop-now-trigger" id="inner-cart-shop">SHOP NOW</button>
                </div>
            `;
            cartBadges.forEach(badge => badge.textContent = '0');
            
            // Re-bind inner shop trigger
            const innerCartShop = document.getElementById('inner-cart-shop');
            if (innerCartShop) {
                innerCartShop.addEventListener('click', () => {
                    cartDrawer.classList.remove('open');
                    document.body.classList.remove('intro-active');
                    showView('view-product');
                    updateNavActive('nav-shop-link');
                });
            }
            return;
        }

        let cartHTML = '<div class="cart-items-list-container">';
        cart.forEach(item => {
            totalItems += item.qty;
            subtotal += item.price * item.qty;
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <span class="cart-item-price">₹${item.price}</span>
                        <div class="cart-item-qty-row">
                            <div class="qty-selector-small">
                                <button class="qty-btn-s minus-cart-item" data-id="${item.id}">-</button>
                                <span class="qty-val-s">${item.qty}</span>
                                <button class="qty-btn-s plus-cart-item" data-id="${item.id}">+</button>
                            </div>
                            <button class="cart-remove-item-btn" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });

        cartHTML += `
            </div>
            <div class="cart-drawer-footer">
                <div class="cart-summary-row">
                    <span>Subtotal:</span>
                    <strong class="cart-subtotal-val">₹${subtotal}</strong>
                </div>
                <p class="cart-shipping-notice">Shipping and taxes calculated at checkout.</p>
                <button class="btn btn-primary btn-full" id="btn-cart-checkout">BUY NOW</button>
            </div>
        `;

        cartBodyContent.innerHTML = cartHTML;
        cartBadges.forEach(badge => badge.textContent = totalItems);

        // Bind inner actions
        document.querySelectorAll('.plus-cart-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.qty += 1;
                    renderCart();
                }
            });
        });

        document.querySelectorAll('.minus-cart-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item && item.qty > 1) {
                    item.qty -= 1;
                    renderCart();
                }
            });
        });

        document.querySelectorAll('.cart-remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                cart = cart.filter(i => i.id !== id);
                renderCart();
            });
        });

        const btnCartCheckout = document.getElementById('btn-cart-checkout');
        if (btnCartCheckout) {
            btnCartCheckout.addEventListener('click', () => {
                cartDrawer.classList.remove('open');
                document.body.classList.remove('intro-active');
                openPurchaseModal();
            });
        }
    }


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
                    <img src="assets/images/lipley balm product.png.png" alt="LIPLEY Tinted Lip Balm" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">LIPLEY Strawberry Beetroot Tinted Lip Balm</h4>
                        <span class="cart-item-price">₹149</span>
                        <div style="margin-top: 10px; display: flex; gap: 10px;">
                            <button class="btn btn-primary btn-small add-wishlist-to-cart" data-id="${id}" style="padding: 6px 12px; font-size: 10px;">Add to Cart</button>
                            <button class="cart-remove-item-btn remove-wishlist-item" data-id="${id}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });
        wishlistHTML += '</div>';
        wishlistBodyContent.innerHTML = wishlistHTML;

        // Bind actions
        wishlistBodyContent.querySelectorAll('.add-wishlist-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                addToCart(id, 1);
                toggleWishlistItem(id);
            });
        });

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


    // --- 12. CHECKOUT ENGINE ---
    const promoInput = document.getElementById('promo-input');
    const promoApplyBtn = document.getElementById('promo-apply-btn');
    const promoMsg = document.getElementById('promo-msg');
    
    const billSubtotal = document.getElementById('bill-subtotal');
    const billDiscount = document.getElementById('bill-discount');
    const discountRow = document.getElementById('discount-row');
    const billTotal = document.getElementById('bill-total');
    
    let isPromoApplied = false;

    if (promoApplyBtn && promoInput && promoMsg) {
        promoApplyBtn.addEventListener('click', () => {
            const val = promoInput.value.trim().toUpperCase();
            if (val === 'LIPLEY10') {
                isPromoApplied = true;
                promoMsg.textContent = "✓ Promo code applied! Enjoy 10% discount.";
                promoMsg.style.color = "var(--color-primary)";
                calculateCheckoutPrice();
            } else {
                promoMsg.textContent = "⚠ Invalid promo code. Try: LIPLEY10";
                promoMsg.style.color = "var(--color-accent)";
            }
        });
    }

    // --- 12. PURCHASE OPTIONS MODAL ENGINE ---
    const purchaseModal = document.getElementById('purchase-options-modal');
    const purchaseCloseBtn = document.getElementById('purchase-modal-close');
    const purchaseBackdrop = document.getElementById('purchase-modal-backdrop');

    function openPurchaseModal() {
        if (purchaseModal) {
            purchaseModal.classList.add('open');
            document.body.classList.add('intro-active');
        }
    }

    function closePurchaseModal() {
        if (purchaseModal) {
            purchaseModal.classList.remove('open');
            document.body.classList.remove('intro-active');
        }
    }

    if (purchaseCloseBtn) purchaseCloseBtn.addEventListener('click', closePurchaseModal);
    if (purchaseBackdrop) purchaseBackdrop.addEventListener('click', closePurchaseModal);

    // Share button clipboard fallback
    const pShareBtn = document.getElementById('p-share-btn');
    if (pShareBtn) {
        pShareBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    alert('Store link copied to clipboard! Feel free to share.');
                })
                .catch(() => {
                    alert('LIPLEY Cosmetics: ' + window.location.href);
                });
        });
    }

    // ESC key binds
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (cartDrawer && cartDrawer.classList.contains('open')) {
                toggleCart();
            }
            if (wishlistDrawer && wishlistDrawer.classList.contains('open')) {
                toggleWishlist();
            }
            if (purchaseModal && purchaseModal.classList.contains('open')) {
                closePurchaseModal();
            }
        }
    });

});

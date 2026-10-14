/* ==========================================================================
   LIPLEY PREMIUM COSMETICS - INTERACTIVE DRIVER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Silent Referral Tracking (TEST)
    (function initReferralTracking() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const refParam = urlParams.get('ref');
            if (refParam && refParam.trim().toLowerCase() === 'peter') {
                localStorage.setItem('lipley_ref_source', 'peter');
            }
        } catch (e) {
            console.error('Referral tracking error:', e);
        }
    })();

    function getReferralSource() {
        try {
            const storedRef = localStorage.getItem('lipley_ref_source');
            if (storedRef && storedRef.trim().toLowerCase() === 'peter') {
                return 'Peter';
            }
        } catch (e) {
            console.error('Referral reading error:', e);
        }
        return 'Direct Website';
    }
    window.getReferralSource = getReferralSource;

    // Indian States and Union Territories
    const indianStates = [
        "Andaman and Nicobar Islands",
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chandigarh",
        "Chhattisgarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jammu and Kashmir",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Ladakh",
        "Lakshadweep",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Puducherry",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal"
    ];

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
    setTimeout(finishIntro, 1200); // 1.2 seconds duration for faster load


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
    const dotsContainer = document.getElementById('hero-dots');
    
    // Dynamic Dot Generation
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = `hero-dot${idx === 0 ? ' active' : ''}`;
            dot.setAttribute('data-slide', idx);
            dotsContainer.appendChild(dot);
        });
    }

    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');
    const heroContent = document.querySelector('.hero-overlay-container');
    const heroSlidesOverlay = document.querySelector('.hero-slides-overlay');
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
        
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.pointerEvents = 'auto';
        }
        if (heroSlidesOverlay) {
            heroSlidesOverlay.style.opacity = '1';
        }
        
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

    // Initialize slide show & initial slide view
    showSlide(0);
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


    // --- 5.1 FUTURE-READY DYNAMIC PRODUCT DATA MODEL & SYNC ---
    window.products = {
        "strawberry-beetroot": {
            id: "strawberry-beetroot",
            name: "LIPLEY Beetroot Tinted Lip Balm",
            badge: "SPECIAL OFFER",
            type: "Organic Lip Balm",
            tagline: "Organic Ingredients. Natural Nourishment. Beautifully Tinted Lips.",
            price: 149,
            originalPrice: 179,
            description: "Premium organic lip balm enriched with Strawberry Extract and Beetroot Oil to help moisturize lips while providing a beautiful natural tinted finish.",
            variant: "Beetroot Tinted",
            image: "assets/images/lipley-beetroot-lip-balm-8g.webp",
            gallery: [
                "assets/images/lipley-beetroot-lip-balm-8g.webp",
                "assets/images/lipley-beetroot-lip-balm-open.webp",
                "assets/images/lipley-beetroot-lip-balm-hand.webp"
            ],
            ingredients: ["Almond Oil", "Beetroot Oil", "Jojoba Oil", "Castor Oil", "Beeswax", "Shea Butter", "Cocoa Butter", "Tinte", "Alkanet", "Manjishta", "Coconut Oil", "Rose Oil", "Strawberry Oil", "Avocado Oil"],
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
            instructions: "Apply evenly on clean lips whenever needed.<br><br>Reapply throughout the day for continuous hydration and a natural tinted look.<br><br>Apply before bedtime for overnight nourishment.",
            reviews: [
                { text: "My lips have never felt softer! The beetroot tint is so natural and pretty.", author: "Anjali R." },
                { text: "Truly organic. It stays hydrated for hours without feeling sticky.", author: "Siddharth M." }
            ],
            netQty: "8g",
            storage: "Store in a cool, dry place. Keep away from direct sunlight.",
            faqs: [
                { q: "Is it suitable for daily use?", a: "Yes, LIPLEY balm is formulated with 100% clean, organic botanicals and is safe to reapply as often as needed throughout the day." },
                { q: "Is it suitable for men and women?", a: "Absolutely. The natural tint provides a subtle, healthy flush of color that is suitable for both men and women seeking clean hydration." },
                { q: "Is it organic?", a: "Yes, LIPLEY lip balm is made with premium cold-pressed organic botanical oils, butters, and organic plant waxes." },
                { q: "How long does one lip balm last?", a: "With daily use, one 8g lip balm jar typically lasts between 2 to 3 months." }
            ]
        },
        "strawberry-zero": {
            id: "strawberry-zero",
            name: "LIPLEY Strawberry Zero Tinted Lip Balm",
            badge: "SPECIAL OFFER",
            type: "Organic Lip Balm",
            tagline: "Natural Organic Strawberry Care. Beautiful Lips.",
            price: 149,
            originalPrice: 179,
            description: "Premium organic lip balm infused with pure strawberry extract to nourish, deeply hydrate and protect lips with a clear, radiant, non-sticky touch.",
            variant: "Strawberry Zero Tinted",
            image: "assets/images/lipley-strawberry-lip-balm-8g.jpg",
            gallery: [
                "assets/images/lipley-strawberry-lip-balm-8g.jpg",
                "assets/images/lipley-strawberry-lip-balm-open.jpg",
                "assets/images/lipley-strawberry-lip-balm-hand.jpg"
            ],
            ingredients: ["Almond Oil", "Beetroot Oil", "Jojoba Oil", "Castor Oil", "Beeswax", "Shea Butter", "Cocoa Butter", "Alkanet", "Manjishta", "Coconut Oil", "Rose Oil", "Strawberry Oil", "Avocado Oil"],
            benefits: [
                "Helps deeply moisturize dry lips.",
                "Helps reduce the appearance of lip dryness and flakiness.",
                "Pure natural strawberry essence for refreshing lip hydration.",
                "Nourishes lips with clean botanical oils and butter.",
                "Supports soft, smooth and healthy-looking lips.",
                "Lightweight, non-sticky and comfortable for daily use.",
                "Free from harsh chemicals.",
                "Suitable for Men & Women."
            ],
            instructions: "Apply evenly on clean lips whenever needed.<br><br>Reapply throughout the day for continuous hydration.<br><br>Apply before bedtime for overnight nourishment.",
            reviews: [
                { text: "Love the strawberry fragrance and how soft it leaves my lips!", author: "Pooja K." },
                { text: "My everyday lip balm. Super moisturizing without being sticky.", author: "Divya N." }
            ],
            netQty: "8g",
            storage: "Store in a cool, dry place. Keep away from direct sunlight.",
            faqs: [
                { q: "Is it suitable for daily use?", a: "Yes, LIPLEY balm is formulated with 100% clean, organic botanicals and is safe to reapply as often as needed throughout the day." },
                { q: "Is it suitable for men and women?", a: "Absolutely. Suitable for both men and women." },
                { q: "Is it organic?", a: "Yes, made with premium cold-pressed botanical oils and waxes." },
                { q: "How long does one lip balm last?", a: "With daily use, one 8g jar typically lasts between 2 to 3 months." }
            ]
        },

    };

    // --- 5.2 REAL-TIME DYNAMIC PRODUCTS SYNC FROM SHARED DATABASE / API ---
    window.renderDynamicProductCards = function() {
        const featuredGrid = document.querySelector('#featured-product-section .products-grid');
        const shopContainer = document.querySelector('#view-shop .shop-products-container');

        const activeProductKeys = Object.keys(window.products).filter(id => {
            const p = window.products[id];
            return p && p.active !== false && p.status !== 'disabled' && p.status !== 'draft';
        });

        if (activeProductKeys.length === 0) return;

        // Ensure strict order: Beetroot Lip Balm first, Strawberry Zero second
        const desiredOrder = ['strawberry-beetroot', 'strawberry-zero'];
        activeProductKeys.sort((a, b) => {
            const idxA = desiredOrder.indexOf(a);
            const idxB = desiredOrder.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return 0;
        });

        // 1. Render Featured Products Section on Home Page
        if (featuredGrid) {
            let featuredHTML = '';
            activeProductKeys.forEach((id) => {
                const p = window.products[id];
                const isLipBalm = p.category === 'Organic Lip Balm' || p.type === 'Organic Lip Balm' || p.id === 'strawberry-beetroot' || p.id === 'strawberry-zero';
                const badgeText = isLipBalm ? 'SPECIAL OFFER' : (p.badge || (p.bestseller ? 'Best Seller' : (p.is_new ? 'New Launch' : '')));
                const taglineText = p.short_description || p.tagline || (isLipBalm ? 'Naturally Soft. Beautifully Tinted.' : 'Natural Organic Formula');
                const netQtyText = p.netQty ? `<div style="font-size: 12px; margin-bottom: 12px; font-weight: 600; opacity: 0.7;">Net Quantity: ${p.netQty}</div>` : '';

                let priceBlockHTML = '';
                if (isLipBalm && (p.price === 149 || !p.price)) {
                    priceBlockHTML = `
                        <div class="product-price-container" style="display: flex; flex-direction: column; align-items: center; gap: 4px; margin-bottom: 14px;">
                            <div style="display: flex; align-items: baseline; justify-content: center; gap: 8px;">
                                <span class="product-original-price" style="font-size: 15px; text-decoration: line-through; color: #767676; font-weight: 500;" aria-label="Original price ₹179">₹179</span>
                                <span class="product-price" style="font-size: 19px; font-weight: 700; color: var(--color-primary);">₹149 ONLY</span>
                            </div>
                            <div class="product-offer-pill" style="font-size: 11px; font-weight: 600; color: #2E7D32; background: rgba(46, 125, 50, 0.08); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(46, 125, 50, 0.2);">Buy 2 Lip Balms — FREE DELIVERY</div>
                        </div>
                    `;
                } else {
                    const originalPriceHTML = p.originalPrice || p.compare_price ? `<span style="font-size: 15px; text-decoration: line-through; color: #767676; font-weight: 500; margin-left: 8px;">₹${p.originalPrice || p.compare_price}</span>` : '';
                    priceBlockHTML = `
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 15px;">
                            <span class="product-price" style="font-size: 18px; font-weight: 700; color: var(--color-primary);">₹${p.price}</span>
                            ${originalPriceHTML}
                        </div>
                    `;
                }

                featuredHTML += `
                    <div class="product-card featured-product shop-now-trigger" id="product-${p.id}-card" data-product-id="${p.id}" style="background-color: #F8F3EA; border-radius: 24px; border: 1.5px solid #C9A227; box-shadow: 0 12px 36px rgba(18, 60, 50, 0.08); overflow: hidden; position: relative; cursor: pointer; opacity: 1 !important; visibility: visible !important;">
                        <div class="product-visual" style="background-color: #F8F3EA; display: flex; align-items: center; justify-content: center; overflow: hidden; height: 300px; padding: 10px; position: relative;">
                            <img src="${p.image}" alt="${p.name}" class="product-main-img" loading="lazy" width="1024" height="1024" style="object-fit: contain; width: 100%; height: 100%; object-position: center; border-radius: 12px; transition: transform 0.4s ease;">
                            ${badgeText ? `<span class="product-badge" style="background: #123C32; color: #C9A227; font-weight: 700; font-size: 11px; letter-spacing: 0.08em; padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(201, 162, 39, 0.5); position: absolute; top: 14px; left: 14px; z-index: 2;">${badgeText}</span>` : ''}
                        </div>
                        <div class="product-content" style="text-align: center; padding: 25px 20px; background-color: #F8F3EA;">
                            <span style="font-size: 11px; letter-spacing: 0.14em; font-weight: 700; color: #C9A227; text-transform: uppercase; display: block; margin-bottom: 6px;">${badgeText || 'SPECIAL OFFER'}</span>
                            <h3 class="product-name" style="font-size: 17px; margin: 0 0 8px 0; font-weight: 600; color: var(--color-primary); line-height: 1.3;">${p.name}</h3>
                            <p class="product-short-tagline" style="font-size: 13px; font-style: italic; opacity: 0.85; margin-bottom: 8px;">${taglineText}</p>
                            ${netQtyText}
                            ${priceBlockHTML}
                            <button class="btn btn-primary shop-buy-trigger" data-product-id="${p.id}" aria-label="Buy ${p.name} Now" style="width: 100%; margin-top: 14px; padding: 13px 20px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;">⚡ BUY NOW</button>
                        </div>
                    </div>
                `;
            });
            featuredGrid.innerHTML = featuredHTML;
        }

        // 2. Render Shop Page Grid
        if (shopContainer) {
            let shopHTML = '';
            activeProductKeys.forEach((id) => {
                const p = window.products[id];
                const isLipBalm = p.category === 'Organic Lip Balm' || p.type === 'Organic Lip Balm' || p.id === 'strawberry-beetroot' || p.id === 'strawberry-zero';
                const badgeText = isLipBalm ? 'SPECIAL OFFER' : (p.badge || (p.bestseller ? 'Best Seller' : (p.is_new ? 'New Launch' : '')));
                const categoryText = p.category || p.type || 'Organic Cosmetic';

                let shopPriceBlockHTML = '';
                if (isLipBalm && p.price === 149) {
                    shopPriceBlockHTML = `
                        <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
                            <div style="display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;">
                                <span style="font-size: 16px; text-decoration: line-through; color: #767676; font-weight: 500;" aria-label="Original price ₹179">₹179</span>
                                <span style="font-size: 24px; font-weight: 700; color: var(--color-primary);">₹149 ONLY</span>
                                <span style="font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #D4AF37; background: #1E3A34; padding: 3px 8px; border-radius: 12px; border: 1px solid rgba(212, 175, 55, 0.4); text-transform: uppercase;">SPECIAL OFFER</span>
                            </div>
                            <div style="font-size: 11.5px; font-weight: 600; color: #2E7D32; background: rgba(46, 125, 50, 0.08); padding: 3px 10px; border-radius: 4px; display: inline-block; width: fit-content; border: 1px solid rgba(46, 125, 50, 0.2);">Buy 2 Lip Balms — FREE DELIVERY</div>
                        </div>
                    `;
                } else {
                    const originalPriceHTML = p.originalPrice || p.compare_price ? `<span style="font-size: 15px; text-decoration: line-through; color: #767676; font-weight: 500; margin-left: 8px;">₹${p.originalPrice || p.compare_price}</span>` : '';
                    shopPriceBlockHTML = `
                        <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 15px;">
                            <span style="font-size: 24px; font-weight: 700; color: var(--color-primary);">₹${p.price}</span>
                            ${originalPriceHTML}
                        </div>
                    `;
                }

                shopHTML += `
                    <div class="shop-product-row" style="display: flex; flex-direction: column; background: #ffffff; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-soft); margin-bottom: 30px;">
                        <div style="display: grid; grid-template-columns: 1fr;" class="shop-product-grid-layout">
                            <div style="aspect-ratio: 1/1; background: radial-gradient(circle at center, #ffffff 0%, var(--color-secondary) 100%); display: flex; align-items: center; justify-content: center; padding: 30px; position: relative; border-bottom: 1px solid rgba(30, 58, 52, 0.08);" class="shop-product-img-col">
                                <img src="${p.image}" alt="${p.name}" style="max-width: 95%; max-height: 95%; object-fit: contain;" class="shop-product-item-img" loading="lazy" width="1024" height="1024">
                                ${badgeText ? `<span style="position: absolute; top: 20px; left: 20px; background-color: var(--color-primary); border: 1px solid var(--color-accent); color: var(--color-secondary); font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 10px; border-radius: 2px; z-index: 10;">${badgeText}</span>` : ''}
                            </div>
                            <div style="padding: 30px 24px; text-align: left; display: flex; flex-direction: column; justify-content: space-between;" class="shop-product-desc-col">
                                <div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                        <span style="font-size: 11px; letter-spacing: 0.15em; font-weight: 700; color: var(--color-accent); text-transform: uppercase;">${categoryText}</span>
                                    </div>
                                    <h2 style="font-family: var(--font-serif); font-size: 22px; font-weight: 500; color: var(--color-primary); margin: 0 0 10px 0; text-transform: uppercase;">${p.name}</h2>
                                    ${shopPriceBlockHTML}
                                    <p style="font-size: 13.5px; opacity: 0.85; line-height: 1.6; margin-bottom: 20px;">${p.description || p.short_description || ''}</p>
                                </div>
                                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                    <button class="btn btn-primary shop-buy-trigger" data-product-id="${p.id}" style="flex: 1; height: 44px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 4px;">Buy Now</button>
                                    <button class="btn btn-secondary shop-add-trigger" data-product-id="${p.id}" style="height: 44px; padding: 0 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 4px; border: 1px solid rgba(30,58,52,0.2);">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            shopContainer.innerHTML = shopHTML;
        }

        bindDynamicProductTriggers();
    };

    function bindDynamicProductTriggers() {
        document.querySelectorAll('.shop-now-trigger').forEach(btn => {
            btn.removeEventListener('click', handleShopNowClick);
            btn.addEventListener('click', handleShopNowClick);
        });

        document.querySelectorAll('.shop-buy-trigger').forEach(btn => {
            btn.removeEventListener('click', handleShopBuyClick);
            btn.addEventListener('click', handleShopBuyClick);
        });

        document.querySelectorAll('.shop-add-trigger').forEach(btn => {
            btn.removeEventListener('click', handleShopAddClick);
            btn.addEventListener('click', handleShopAddClick);
        });


    }

    function handleCardWhatsAppOrder(e) {
        e.preventDefault();
        e.stopPropagation();
        const btn = e.currentTarget;
        const productId = btn.getAttribute('data-product-id');
        const p = (window.products && window.products[productId]) || null;
        const productName = p ? p.name : 'LIPLEY Organic Product';
        const isLipBalm = productId === 'strawberry-beetroot' || productId === 'strawberry-zero' || (p && (p.category === 'Organic Lip Balm' || p.type === 'Organic Lip Balm'));
        
        let msg = `*NEW ORDER INQUIRY - LIPLEY*\n\n`;
        msg += `Product: ${productName}\n`;
        if (isLipBalm) {
            msg += `Original price: ₹179\n`;
            msg += `Offer price: ₹149 ONLY\n`;
            msg += `Special Offer: Buy 2 Lip Balms — FREE DELIVERY\n\n`;
        } else if (p && (p.originalPrice || p.compare_price)) {
            msg += `Original price: ₹${p.originalPrice || p.compare_price}\n`;
            msg += `Offer price: ₹${p.price}\n\n`;
        } else {
            msg += `Price: ₹${p ? p.price : 149}\n\n`;
        }
        msg += `I would like to place an order for this product. Please share delivery and payment details.\n\n`;
        const source = (typeof getReferralSource === 'function') ? getReferralSource() : 'Direct Website';
        msg += `Source: ${source}\n\n`;
        msg += `Thank you for choosing LIPLEY!`;
        
        const whatsappUrl = `https://wa.me/917591900437?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, '_blank');
    }
    window.handleCardWhatsAppOrder = handleCardWhatsAppOrder;

    function handleShopNowClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const btn = e.currentTarget;
        const productId = btn.getAttribute('data-product-id') || 'strawberry-beetroot';
        if (typeof window.loadProductDetails === 'function') {
            window.loadProductDetails(productId);
        }
        showView('view-product');
        updateNavActive('nav-shop-link');
    }

    function handleShopBuyClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const btn = e.currentTarget;
        const productId = btn.getAttribute('data-product-id') || 'strawberry-beetroot';
        selectedProductId = productId;
        currentQty = 1;
        isCartCheckout = false;
        if (typeof calculateOrder === 'function') {
            calculateOrder();
        }
        window.openPurchaseOptions();
    }

    function handleShopAddClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const btn = e.currentTarget;
        const productId = btn.getAttribute('data-product-id');
        addToCart(productId, 1, false);
        showToast("Product added to cart.");
    }

    async function initDynamicProductsSystem() {
        if (typeof LipleyAPI !== 'undefined') {
            try {
                const fetchedProducts = await LipleyAPI.getProducts();
                if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
                    fetchedProducts.forEach(p => {
                        window.products[p.id] = {
                            ...(window.products[p.id] || {}),
                            ...p,
                            image: p.image || window.products[p.id]?.image || 'assets/images/lipley-beetroot-lip-balm-8g.webp',
                            gallery: (Array.isArray(p.gallery) && p.gallery.length > 0) ? p.gallery : (window.products[p.id]?.gallery || [p.image]),
                            type: p.category || p.type || "Organic Cosmetic",
                            tagline: p.short_description || p.tagline || "",
                            originalPrice: p.originalPrice || p.compare_price || null
                        };
                    });
                    window.renderDynamicProductCards();
                }
            } catch (err) {
                console.warn("Could not fetch products from API, using default products:", err);
            }
        }
    }

    // Auto-sync products when updated in Admin Web in another tab or session
    window.addEventListener('lipley_products_updated', async () => {
        await initDynamicProductsSystem();
    });

    window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('lipley_persistent_products_db')) {
            initDynamicProductsSystem();
        }
    });

    // Run dynamic initialization and bind initial fallback triggers
    bindDynamicProductTriggers();
    initDynamicProductsSystem();

    let selectedProductId = "strawberry-beetroot";

    window.loadProductDetails = function(productId) {
        const product = window.products[productId];
        if (!product) return;
        
        selectedProductId = productId;
        
        const buyNowBtn = document.getElementById('btn-buy-now');
        if (buyNowBtn) {
            buyNowBtn.setAttribute('data-product-id', productId);
        }
        const addToCartBtn = document.getElementById('btn-add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.setAttribute('data-product-id', productId);
        }
        
        // Update breadcrumb
        const breadcrumbActive = document.querySelector('.breadcrumb-active');
        if (breadcrumbActive) breadcrumbActive.textContent = product.name;

        // Update detail page badge dynamically
        const galleryBadge = document.getElementById('gallery-badge');
        if (galleryBadge && product.badge) {
            galleryBadge.textContent = product.badge;
        }
        
        // Update images
        const mainImg = document.getElementById('gallery-main-img');
        if (mainImg) {
            mainImg.src = product.image + '?v=2';
            mainImg.alt = product.name;
        }
        
        // Dynamic thumbnails show/hide based on gallery length
        const galleryThumbs = document.querySelectorAll('.gallery-thumb');
        const thumbsGrid = document.querySelector('.thumbnail-gallery-grid');
        
        if (product.gallery && galleryThumbs.length > 0) {
            if (thumbsGrid) {
                if (product.gallery.length <= 1) {
                    thumbsGrid.style.display = 'none';
                } else {
                    thumbsGrid.style.display = 'grid';
                }
            }
            
            galleryThumbs.forEach((thumb, idx) => {
                if (idx < product.gallery.length) {
                    thumb.style.display = 'flex';
                    const imgPath = product.gallery[idx] + '?v=2';
                    thumb.setAttribute('data-img', imgPath);
                    thumb.setAttribute('tabindex', '0');
                    thumb.setAttribute('role', 'button');
                    thumb.setAttribute('aria-label', `${product.name} - View ${idx + 1}`);
                    
                    const thumbImg = thumb.querySelector('img');
                    if (thumbImg) {
                        thumbImg.src = imgPath;
                        thumbImg.alt = `${product.name} - View ${idx + 1}`;
                    }
                    
                    // Reset active class
                    if (idx === 0) {
                        thumb.classList.add('active');
                    } else {
                        thumb.classList.remove('active');
                    }
                } else {
                    thumb.style.display = 'none';
                }
            });
        }
        
        // Update metadata
        const typeTag = document.querySelector('.p-type-tag');
        if (typeTag) typeTag.textContent = product.type;
        
        const titleName = document.querySelector('.p-title-name');
        if (titleName) titleName.textContent = product.name;
        
        const subtitleTagline = document.querySelector('.p-subtitle-tagline');
        if (subtitleTagline) subtitleTagline.textContent = product.tagline;
        
        const isLipBalm = product.id === 'strawberry-beetroot' || product.id === 'strawberry-zero' || product.type === 'Organic Lip Balm' || product.category === 'Organic Lip Balm';
        const priceVal = document.querySelector('.price-value');
        if (priceVal) {
            if (isLipBalm && product.price === 149) {
                priceVal.innerHTML = `<span style="font-size: 18px; text-decoration: line-through; color: #767676; font-weight: 500; margin-right: 8px;" aria-label="Original price ₹179">₹179</span> ₹149 ONLY`;
            } else if (product.originalPrice) {
                priceVal.innerHTML = `₹${product.price} <span style="font-size: 16px; text-decoration: line-through; color: #767676; font-weight: 500; margin-left: 10px;">₹${product.originalPrice}</span>`;
            } else {
                priceVal.textContent = `₹${product.price}`;
            }
        }

        // Show/hide detail page Buy 2 offer box
        const detailOfferBox = document.getElementById('p-detail-offer-box');
        if (detailOfferBox) {
            detailOfferBox.style.display = isLipBalm ? 'flex' : 'none';
        }

        // Update sidebar shipping details
        const sidebarShipping = document.querySelector('.p-shipping-list');
        if (sidebarShipping) {
            const shippingCostText = '<strong>Offer:</strong> Buy 2 for ₹298 & Get FREE DELIVERY (Buy 1: ₹149 + delivery)';
            sidebarShipping.innerHTML = `
                <li style="display: flex; gap: 6px;"><strong>Processing:</strong> Dispatched within 24 hours.</li>
                <li style="display: flex; gap: 6px;"><strong>Delivery Time:</strong> 2–7 business days across India.</li>
                <li style="display: flex; gap: 6px;">${shippingCostText}</li>
                <li style="display: flex; gap: 6px;"><strong>Tracking:</strong> Shared immediately post dispatch.</li>
                <li style="display: flex; gap: 6px;"><strong>Support:</strong> Active WhatsApp hotline assistance.</li>
            `;
        }
        
        const descText = document.querySelector('.p-description-text');
        if (descText) descText.textContent = product.description;
        
        const variantValue = document.querySelector('.p-variant-value');
        if (variantValue) variantValue.textContent = product.variant;

        // Update Net Qty and Storage
        const netQtyEl = document.querySelector('.p-net-qty');
        if (netQtyEl) netQtyEl.textContent = product.netQty;
        
        const storageEl = document.querySelector('.p-storage');
        if (storageEl) storageEl.textContent = product.storage;

        // Update Dynamic FAQs
        const faqsContainer = document.querySelector('.p-faqs');
        if (faqsContainer && product.faqs) {
            faqsContainer.innerHTML = product.faqs.map(faq => `
                <div class="faq-item-small" style="margin-bottom: 15px; border-bottom: 1px solid rgba(30, 58, 52, 0.04); padding-bottom: 10px;">
                    <h4 style="font-size: 13.5px; font-weight: 600; color: var(--color-primary); margin: 0 0 5px 0;">Q: ${faq.q}</h4>
                    <p style="font-size: 13px; line-height: 1.45; margin: 0; opacity: 0.85;">A: ${faq.a}</p>
                </div>
            `).join('');
        }
        
        // Update ingredients block visibility
        const ingredientsBlock = document.querySelector('.p-ingredients-block');
        const ingredientsGrid = document.querySelector('.drawer-ingredients-grid');
        
        if (!product.ingredients) {
            if (ingredientsBlock) ingredientsBlock.style.display = 'none';
        } else {
            if (ingredientsBlock) ingredientsBlock.style.display = 'block';
            if (ingredientsGrid) {
                ingredientsGrid.innerHTML = product.ingredients.map(ing => `<span class="ingredient-pill" style="font-size: 12px; padding: 6px 12px; background: rgba(30, 58, 52, 0.05); border: 1px solid rgba(30, 58, 52, 0.1); border-radius: 20px; color: var(--color-primary);">${ing}</span>`).join('');
            }
        }
        
        // Update tab benefits
        const benefitsList = document.querySelector('#tab-benefits .drawer-bullet-list');
        if (benefitsList && product.benefits) {
            benefitsList.innerHTML = product.benefits.map(ben => `<li>${ben}</li>`).join('');
        }
        
        // Update tab instructions
        const instructionsText = document.querySelector('#tab-instructions .tab-desc-text');
        if (instructionsText) {
            instructionsText.innerHTML = product.instructions;
        }
        
        // Update sidebar benefits
        const sidebarBenefits = document.querySelector('.p-benefits-list');
        if (sidebarBenefits && product.benefits) {
            sidebarBenefits.innerHTML = product.benefits.slice(0, 5).map(ben => `
                <li style="font-size: 14px; line-height: 1.5; color: var(--color-primary); display: flex; align-items: flex-start; gap: 8px;">
                    <span style="color: var(--color-accent); font-weight: 700;">✓</span>
                    <span>${ben}</span>
                </li>
            `).join('');
        }
        
        // Update sidebar how to use
        const sidebarSteps = document.querySelector('.p-steps');
        if (sidebarSteps && product.instructions) {
            const steps = product.instructions.split('<br><br>');
            sidebarSteps.innerHTML = steps.map((step, idx) => `
                <div class="step-item" style="font-size: 13.5px; line-height: 1.5; color: var(--color-primary);">
                    <strong>Step ${idx + 1}:</strong> ${step.replace(/Step \d+:\s*/i, '')}
                </div>
            `).join('');
        }
        
        // Update sidebar reviews quotes
        const sidebarQuotes = document.querySelector('.p-review-quotes');
        if (sidebarQuotes && product.reviews) {
            sidebarQuotes.innerHTML = product.reviews.map(rev => `
                <div class="review-quote-item" style="background: rgba(30, 58, 52, 0.02); border-left: 3px solid var(--color-accent); padding: 10px 15px; border-radius: 0 4px 4px 0;">
                    <p style="font-style: italic; font-size: 13px; line-height: 1.5; margin: 0 0 5px 0; color: var(--color-primary);">"${rev.text}"</p>
                    <span style="font-size: 11px; font-weight: 600; color: var(--color-primary); opacity: 0.85;">— ${rev.author}</span>
                </div>
            `).join('');
        }

        // Update checkout summary item details
        const checkoutImg = document.querySelector('.summary-item-img');
        if (checkoutImg) {
            checkoutImg.src = product.image + '?v=2';
            checkoutImg.alt = product.name;
        }
        const checkoutName = document.querySelector('.summary-item-name');
        if (checkoutName) {
            checkoutName.textContent = product.name;
        }
        const checkoutQtyDesc = document.querySelector('.summary-item-qty');
        if (checkoutQtyDesc) {
            checkoutQtyDesc.textContent = product.variant;
        }
        
        // Select active product option in review dropdown form
        const reviewProductSelect = document.getElementById('review-product');
        if (reviewProductSelect) {
            reviewProductSelect.value = productId === 'strawberry-zero' ? 'Strawberry Zero Lip Balm' : 'Beetroot Lip Balm';
        }
        
        // Update sticky bar details
        const stickyImg = document.querySelector('.sticky-bar-thumb');
        if (stickyImg) stickyImg.src = product.image + '?v=2';
        
        const stickyTitle = document.querySelector('.sticky-bar-title');
        if (stickyTitle) stickyTitle.textContent = product.name;
        
        const stickyPrice = document.querySelector('.sticky-bar-price');
        if (stickyPrice) {
            if (isLipBalm && product.price === 149) {
                stickyPrice.innerHTML = `<span style="text-decoration: line-through; font-size: 11px; color: #767676; margin-right: 4px;">₹179</span> ₹149 ONLY`;
            } else {
                stickyPrice.textContent = `₹${product.price}`;
            }
        }
        
        // Trigger reviews refetch to filter by active product dynamically
        if (typeof fetchReviews === 'function') {
            fetchReviews();
        }

        // Trigger recalculation if checkout calculation function exists
        if (typeof calculateOrder === 'function') {
            calculateOrder();
        }
    };

    // --- 6. E-COMMERCE SPA ROUTER ---
    const viewHome = document.getElementById('view-home');
    const viewProduct = document.getElementById('view-product');
    const viewShop = document.getElementById('view-shop');
    const viewElements = [viewHome, viewProduct, viewShop];

    // --- 6.1 SPA ROUTING HISTORY AND BACK NAVIGATION ---
    let isNavigationInProgress = false; // prevents popstate loops
    let historyEntryCount = 0;

    window.pushNavigationState = function(type, id, extra = null) {
        if (isNavigationInProgress) return;
        
        historyEntryCount++;
        const stateObj = {
            type: type,
            id: id,
            extra: extra,
            productId: selectedProductId
        };
        
        let hash = 'home';
        if (type === 'view') {
            hash = id.replace('view-', '');
        } else if (type === 'anchor') {
            hash = id;
        } else if (type === 'popup') {
            hash = id;
        } else if (type === 'policy') {
            hash = `policy-${extra.toLowerCase().replace(/\s+/g, '-')}`;
        }
        
        history.pushState(stateObj, '', '#' + hash);
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

    window.goBack = function() {
        if (historyEntryCount <= 0) {
            // Safe fallback: redirect to Home if no internal app history exists
            showView('view-home');
        } else {
            historyEntryCount--;
            history.back();
        }
    };

    function openPopupById(id, pushState = true) {
        if (id === 'purchase-options-modal') {
            if (purchaseModal) purchaseModal.classList.add('open');
            document.body.classList.add('intro-active');
        } else if (id === 'wishlist-drawer') {
            if (wishlistDrawer) wishlistDrawer.classList.add('open');
            document.body.classList.add('intro-active');
        } else if (id === 'cart-drawer') {
            const cartDrawer = document.getElementById('cart-drawer');
            if (cartDrawer) cartDrawer.classList.add('open');
            document.body.classList.add('intro-active');
            if (typeof renderCart === 'function') renderCart();
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
        } else if (id === 'cart-drawer') {
            const cartDrawer = document.getElementById('cart-drawer');
            if (cartDrawer) cartDrawer.classList.remove('open');
            document.body.classList.remove('intro-active');
        }
    }

    function closeAllPopups() {
        const popups = ['purchase-options-modal', 'wishlist-drawer', 'cart-drawer', 'policy-modal'];
        popups.forEach(id => {
            closePopupById(id);
        });
    }

    // Set up native popstate pop handling
    // Set up native popstate pop handling
    window.addEventListener('popstate', (e) => {
        const state = e.state;
        
        // Close all active drawers and overlays first
        closeAllPopups();
        
        if (!state) {
            // Standard fallback to home
            isNavigationInProgress = true;
            showView('view-home', false);
            updateNavActive('nav-home-link');
            isNavigationInProgress = false;
            return;
        }
        
        isNavigationInProgress = true;
        
        if (state.type === 'view') {
            if (state.productId && state.productId !== selectedProductId) {
                if (typeof window.loadProductDetails === 'function') {
                    window.loadProductDetails(state.productId);
                }
            }
            showView(state.id, false);
            if (state.id === 'view-home') {
                updateNavActive('nav-home-link');
            } else if (state.id === 'view-shop') {
                updateNavActive('nav-shop-link');
            } else if (state.id === 'view-product') {
                updateNavActive('nav-shop-link');
            }
        } else if (state.type === 'anchor') {
            showView('view-home', false, false);
            const targetEl = document.getElementById(state.id);
            if (targetEl) {
                const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
                navLinks.forEach(nl => {
                    nl.classList.remove('active');
                    if (nl.getAttribute('href') === '#' + state.id) {
                        nl.classList.add('active');
                    }
                });
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            }
        } else if (state.type === 'popup') {
            openPopupById(state.id, false);
        } else if (state.type === 'policy') {
            openPolicyById(state.id, state.extra, false);
        }
        
        isNavigationInProgress = false;
    });

    // Handle deep links and initial load routing
    function initRouter() {
        const hash = window.location.hash || '#home';
        
        // Push initial state matching the loaded hash
        if (hash === '#home' || hash === '#') {
            history.replaceState({ type: 'view', id: 'view-home', productId: selectedProductId }, '', '#home');
        } else if (hash === '#shop') {
            history.replaceState({ type: 'view', id: 'view-shop', productId: selectedProductId }, '', '#shop');
        } else if (hash === '#product') {
            history.replaceState({ type: 'view', id: 'view-product', productId: selectedProductId }, '', '#product');
        } else if (hash.startsWith('#') && document.getElementById(hash.substring(1))) {
            history.replaceState({ type: 'anchor', id: hash.substring(1), productId: selectedProductId }, '', hash);
        } else {
            history.replaceState({ type: 'view', id: 'view-home', productId: selectedProductId }, '', '#home');
        }
        historyEntryCount = 0;
        
        if (hash === '#home' || hash === '#') {
            showView('view-home', false);
            updateNavActive('nav-home-link');
        } else if (hash === '#shop') {
            showView('view-shop', false);
            updateNavActive('nav-shop-link');
        } else if (hash === '#product') {
            showView('view-product', false);
            updateNavActive('nav-shop-link');
        } else if (hash === '#cart-drawer' || hash === '#cart') {
            showView('view-home', false);
            openPopupById('cart-drawer', true);
        } else if (hash === '#purchase-options-modal' || hash === '#checkout') {
            showView('view-home', false);
            openPopupById('purchase-options-modal', true);
        } else {
            const targetId = hash.substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                showView('view-home', false, false);
                
                const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
                navLinks.forEach(nl => {
                    nl.classList.remove('active');
                    if (nl.getAttribute('href') === hash) {
                        nl.classList.add('active');
                    }
                });
                
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 500);
            } else {
                showView('view-home', false);
            }
        }
    }
    
    // Run initialization
    initRouter();

    // Page routing triggers are unified and managed via bindDynamicProductTriggers()

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
        } else if (href === '#shop') {
            e.preventDefault();
            showView('view-shop');
            updateNavActive('nav-shop-link');
        } else if (href === '#featured-product-section' || href === '#products') {
            e.preventDefault();
            const wasHomeActive = viewHome.classList.contains('active');
            if (!wasHomeActive) {
                showView('view-home', true, false);
            }
            updateNavActive('nav-home-link');
            const targetEl = document.getElementById('featured-product-section');
            if (targetEl) {
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, wasHomeActive ? 0 : 50);
            }
        } else if (href === '#checkout') {
            e.preventDefault();
            openPurchaseOptions();
        } else {
            const targetEl = document.getElementById(href.substring(1));
            if (targetEl) {
                e.preventDefault();
                const wasHomeActive = viewHome.classList.contains('active');
                if (!wasHomeActive) {
                    showView('view-home', false, false);
                }
                
                window.pushNavigationState('anchor', href.substring(1));
                
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


    // --- 7. CART ENGINE ---
    let cart = [];

    function loadCart() {
        try {
            const saved = localStorage.getItem('lipley_cart');
            if (saved) {
                cart = JSON.parse(saved).filter(item => item && (item.productId === 'strawberry-beetroot' || item.productId === 'strawberry-zero'));
            }
        } catch(e) {
            console.error(e);
            cart = [];
        }
        updateCartBadge();
    }

    function saveCart() {
        try {
            localStorage.setItem('lipley_cart', JSON.stringify(cart));
        } catch(e) {
            console.error(e);
        }
        updateCartBadge();
    }

    function updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalQty;
            badge.style.display = totalQty > 0 ? 'flex' : 'none';
        }
    }

    function addToCart(productId, quantity = 1, openDrawer = true) {
        const existing = cart.find(item => item.productId === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }
        saveCart();
        renderCart();
        if (openDrawer) {
            openCartDrawer();
        }
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.productId !== productId);
        saveCart();
        renderCart();
    }

    function updateCartItemQty(productId, newQty) {
        const item = cart.find(item => item.productId === productId);
        if (item) {
            item.quantity = Math.max(1, newQty);
            saveCart();
            renderCart();
        }
    }

    window.changeCartQty = function(productId, newQty) {
        updateCartItemQty(productId, newQty);
    };
    
    window.removeCartItem = function(productId) {
        removeFromCart(productId);
    };

    function renderCart() {
        const container = document.getElementById('cart-body-content');
        if (!container) return;
        
        if (cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--color-primary); opacity: 0.7;">
                    <p style="font-size: 14px; margin-bottom: 20px;">Your shopping cart is empty.</p>
                    <button class="btn btn-primary btn-small" id="cart-continue-shopping" style="width: auto; padding: 10px 24px;">Continue Shopping</button>
                </div>
            `;
            const contBtn = document.getElementById('cart-continue-shopping');
            if (contBtn) {
                contBtn.addEventListener('click', closeCartDrawer);
            }
            return;
        }

        let lbCount = 0;
        cart.forEach(item => {
            const p = window.products[item.productId];
            const isLb = item.productId === 'strawberry-beetroot' || item.productId === 'strawberry-zero' || (p && (p.category === 'Organic Lip Balm' || p.type === 'Organic Lip Balm'));
            if (isLb) lbCount += item.quantity;
        });

        let offerBannerHTML = '';
        if (lbCount >= 2) {
            offerBannerHTML = `
                <div style="background: rgba(46, 125, 50, 0.08); border: 1px solid rgba(46, 125, 50, 0.3); border-radius: 6px; padding: 10px 12px; margin-bottom: 15px; font-size: 12px; color: #2E7D32; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 15px;">🎉</span>
                    <span>Buy 2 Lip Balms Offer Applied: <strong>FREE DELIVERY Unlocked!</strong></span>
                </div>
            `;
        } else if (lbCount === 1) {
            offerBannerHTML = `
                <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 6px; padding: 10px 12px; margin-bottom: 15px; font-size: 12px; color: #1E3A34; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 15px;">🚚</span>
                    <span>Add 1 more Lip Balm for ₹149 to get <strong>FREE DELIVERY!</strong></span>
                </div>
            `;
        }

        let html = offerBannerHTML + '<div class="cart-items-wrapper" style="display: flex; flex-direction: column; gap: 20px; max-height: calc(100vh - 280px); overflow-y: auto; padding-right: 5px;">';
        let subtotal = 0;
        
        cart.forEach(item => {
            const product = window.products[item.productId] || { name: item.productId, price: 149, image: 'assets/images/lipley-beetroot-lip-balm-8g.webp' };
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            
            html += `
                <div class="cart-item-row" style="display: flex; gap: 15px; border-bottom: 1px solid rgba(30, 58, 52, 0.08); padding-bottom: 15px;">
                    <img src="${product.image}?v=2" alt="${product.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(30,58,52,0.1);">
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <h4 style="font-size: 13px; font-weight: 600; color: var(--color-primary); margin: 0 0 4px 0; text-transform: uppercase;">${product.name}</h4>
                            <span style="font-size: 11.5px; color: var(--color-accent); font-weight: 500;">₹${product.price} each</span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                            <div class="qty-selector-small" style="display: inline-flex; align-items: center; border: 1px solid rgba(30, 58, 52, 0.15); border-radius: 3px; background: #fff;">
                                <button type="button" class="qty-btn-s" onclick="window.changeCartQty('${item.productId}', ${item.quantity - 1})" style="border: none; background: none; width: 24px; height: 24px; font-size: 12px; cursor: pointer; color: var(--color-primary); display: flex; align-items: center; justify-content: center;">−</button>
                                <span class="qty-val-s" style="font-size: 11.5px; font-weight: 600; width: 24px; text-align: center; color: var(--color-primary); display: inline-block;">${item.quantity}</span>
                                <button type="button" class="qty-btn-s" onclick="window.changeCartQty('${item.productId}', ${item.quantity + 1})" style="border: none; background: none; width: 24px; height: 24px; font-size: 12px; cursor: pointer; color: var(--color-primary); display: flex; align-items: center; justify-content: center;">+</button>
                            </div>
                            <button type="button" onclick="window.removeCartItem('${item.productId}')" style="background: none; border: none; font-size: 10px; font-weight: 600; text-transform: uppercase; color: #f44336; cursor: pointer; letter-spacing: 0.05em; padding: 5px;">Remove</button>
                        </div>
                    </div>
                    <div style="text-align: right; min-width: 60px;">
                        <span style="font-size: 13.5px; font-weight: 600; color: var(--color-primary);">₹${itemTotal}</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        html += `
            <div style="margin-top: 20px; border-top: 1px solid rgba(30, 58, 52, 0.12); padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <span style="font-size: 13px; font-weight: 600; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.02em;">Subtotal</span>
                    <span style="font-size: 16px; font-weight: 700; color: var(--color-primary);">₹${subtotal}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button class="btn btn-primary btn-full" id="cart-checkout-btn" style="height: 44px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 4px; box-shadow: var(--shadow-luxury);">Checkout Cart</button>
                    <button class="btn btn-secondary btn-full" id="cart-continue-shopping-btn" style="height: 40px; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 4px; border: 1px solid rgba(30,58,52,0.15); background: transparent; color: var(--color-primary);">Continue Shopping</button>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        document.getElementById('cart-checkout-btn').addEventListener('click', startCartCheckout);
        document.getElementById('cart-continue-shopping-btn').addEventListener('click', closeCartDrawer);
    }

    function startCartCheckout() {
        if (!cart || cart.length === 0) {
            showToast("Your cart is empty.", "error");
            return;
        }
        isCartCheckout = true;
        closePopupById('cart-drawer');
        window.openPurchaseOptions();
    }

    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    
    window.openCartDrawer = function() {
        if (cartDrawer) {
            cartDrawer.classList.add('open');
            document.body.classList.add('intro-active');
            window.pushNavigationState('popup', 'cart-drawer');
            renderCart();
        }
    };
    
    window.closeCartDrawer = function() {
        if (cartDrawer) {
            cartDrawer.classList.remove('open');
            document.body.classList.remove('intro-active');
        }
        const state = history.state;
        if (state && state.type === 'popup' && state.id === 'cart-drawer') {
            history.back();
        }
    };
    
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cartDrawer && cartDrawer.classList.contains('open')) {
                window.closeCartDrawer();
            } else {
                window.openCartDrawer();
            }
        });
    }
    if (cartClose) cartClose.addEventListener('click', window.closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', window.closeCartDrawer);
    
    const pAddToCartBtn = document.getElementById('btn-add-to-cart');
    if (pAddToCartBtn) {
        pAddToCartBtn.addEventListener('click', (e) => {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            const productId = pAddToCartBtn.getAttribute('data-product-id') || selectedProductId || 'strawberry-beetroot';
            const qtyToAdd = typeof productPageQty === 'number' && productPageQty > 0 ? productPageQty : 1;
            addToCart(productId, qtyToAdd, false);
            showToast("Product added to cart.");
        });
    }

    // Call loadCart on init
    loadCart();


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
        const state = history.state;
        if (state && state.type === 'popup' && state.id === 'wishlist-drawer') {
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
                    <img src="assets/images/lipley-beetroot-lip-balm-8g.webp" alt="Lipley Beetroot Tinted Lip Balm 8g" class="cart-item-img" loading="lazy" width="1024" height="1024">
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
        const switchGalleryImage = () => {
            if (!mainGalleryImg) return;
            const newImgSrc = thumb.getAttribute('data-img');
            if (!newImgSrc) return;
            
            // Check if already active and matches current src
            if (thumb.classList.contains('active') && mainGalleryImg.getAttribute('src') === newImgSrc) return;
            
            galleryThumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            
            // Smooth fade transition
            mainGalleryImg.style.opacity = '0';
            setTimeout(() => {
                mainGalleryImg.src = newImgSrc;
                mainGalleryImg.style.opacity = '1';
            }, 180);
        };

        thumb.addEventListener('click', switchGalleryImage);
        thumb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchGalleryImage();
            }
        });
    });

    // Premium dynamic magnifying inspect hover effect
    const galleryMain = document.querySelector('.main-gallery-visual');
    if (galleryMain && mainGalleryImg) {
        galleryMain.style.overflow = 'hidden';
        galleryMain.style.position = 'relative';
        mainGalleryImg.style.transition = 'transform 0.15s ease-out, opacity 0.25s ease';
        
        galleryMain.addEventListener('mousemove', (e) => {
            const rect = galleryMain.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            mainGalleryImg.style.transformOrigin = `${x}% ${y}%`;
            mainGalleryImg.style.transform = 'scale(2)';
        });
        
        galleryMain.addEventListener('mouseleave', () => {
            mainGalleryImg.style.transformOrigin = 'center';
            mainGalleryImg.style.transform = 'scale(1)';
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
        
        // Reset PIN and State fields
        const orderPinInput = document.getElementById('order-pin');
        const orderStateInput = document.getElementById('order-state');
        const pincodeFeedback = document.getElementById('pincode-feedback');
        
        if (orderPinInput) {
            orderPinInput.value = "";
        }
        if (orderStateInput) {
            orderStateInput.value = "";
        }
        if (pincodeFeedback) {
            pincodeFeedback.style.display = 'none';
        }
        
        activeState = "";
        isPinValid = false;
        
        // Ensure coupon input is EMPTY when checkout/cart opens and NO auto-apply coupon
        appliedCoupon = null;
        couponApplied = false;
        const couponCodeInput = document.getElementById('coupon-code-input');
        if (couponCodeInput) couponCodeInput.value = '';
        const couponFeedback = document.getElementById('coupon-feedback');
        if (couponFeedback) couponFeedback.style.display = 'none';

        const billPinRow = document.getElementById('bill-pin-row');
        const billStateRow = document.getElementById('bill-state-row');
        const billDeliveryStatusRow = document.getElementById('bill-delivery-status-row');
        if (billPinRow) billPinRow.style.display = 'none';
        if (billStateRow) billStateRow.style.display = 'none';
        if (billDeliveryStatusRow) billDeliveryStatusRow.style.display = 'none';
        
        if (typeof renderCheckoutSummary === 'function') {
            renderCheckoutSummary();
        }

        if (typeof calculateOrder === 'function') {
            calculateOrder();
        }
    };

    window.closePurchaseOptions = function() {
        if (purchaseModal) {
            purchaseModal.classList.remove('open');
            document.body.classList.remove('intro-active');
        }
        const state = history.state;
        if (state && state.type === 'popup' && state.id === 'purchase-options-modal') {
            history.back();
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
                e.stopPropagation();
                const productId = btn.getAttribute('data-product-id') || selectedProductId || 'strawberry-beetroot';
                const qtyToAdd = typeof productPageQty === 'number' && productPageQty > 0 ? productPageQty : 1;
                
                selectedProductId = productId;
                currentQty = qtyToAdd;
                isCartCheckout = false;
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

    // Reset/clear reviews on new version
    if (!localStorage.getItem("lipley_reviews_reset_v4")) {
        localStorage.removeItem("lipley_reviews_db");
        localStorage.setItem("lipley_reviews_reset_v4", "true");
    }

    const defaultReviews = [];
    let showAllReviews = false;

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

    // See More Reviews Click handler
    const seeMoreBtn = document.getElementById('see-more-reviews-btn');
    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', () => {
            showAllReviews = true;
            fetchReviews();
        });
    }

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
                  processAndRenderReviews(reviewsList);
              }, err => {
                  console.error("Firestore read error. Falling back to local storage.", err);
                  loadLocalReviews();
              });
        } else {
            loadLocalReviews();
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

        // Filter approved reviews for public and by product
        const activeProductLabel = selectedProductId === 'strawberry-zero' ? 'Strawberry Zero Lip Balm' : 'Beetroot Lip Balm';
        const publicReviews = allReviews.filter(r => {
            const isApproved = r.approved === true;
            const reviewProduct = r.product || 'Lip Balm';
            return isApproved && (reviewProduct.toLowerCase() === activeProductLabel.toLowerCase());
        });

        // Update stats based on all public reviews
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

        // Show/Hide See More Reviews Button
        const seeMoreContainer = document.getElementById('see-more-reviews-container');
        if (seeMoreContainer) {
            if (publicReviews.length > 3 && !showAllReviews) {
                seeMoreContainer.style.display = 'block';
            } else {
                seeMoreContainer.style.display = 'none';
            }
        }

        // Slice reviews to show only 3 if not showAllReviews
        const displayedReviews = showAllReviews ? publicReviews : publicReviews.slice(0, 3);

        // Render Public Grid
        if (reviewsGrid) {
            if (displayedReviews.length === 0) {
                reviewsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; opacity: 0.7; padding: 40px 0;">No reviews yet. Be the first to share your feedback!</p>`;
            } else {
                const myReviews = JSON.parse(localStorage.getItem("my_owned_reviews") || "[]");
                
                reviewsGrid.innerHTML = displayedReviews.map(r => {
                    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
                    const formattedDate = formatReviewDate(r.date);
                    const isOwner = r.id && myReviews.includes(r.id);
                    
                    return `
                        <div class="review-card scroll-reveal reveal-fade-up">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                <div class="review-rating" style="color: var(--color-accent); font-size: 14px; margin-bottom: 0;">${stars}</div>
                                ${r.verified ? `<span class="verified-tag" style="color: #4CAF50; font-size: 9px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">✓ Verified Buyer</span>` : ''}
                            </div>
                            <h4 class="review-author" style="font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">
                                ${escapeHTML(r.name)} 
                            </h4>
                            <div class="review-product" style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--color-accent); margin-bottom: 8px; letter-spacing: 0.05em;">
                                Product: ${escapeHTML(r.product || 'Lip Balm')}
                            </div>
                            <p class="review-text" style="font-size: 13px; opacity: 0.85; line-height: 1.45; font-style: italic; margin-bottom: 10px;">"${escapeHTML(r.comment)}"</p>
                            <span class="review-date" style="display: block; font-size: 10px; opacity: 0.5; margin-top: 10px;">${formattedDate}</span>
                            
                            <div class="review-actions-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; border-top: 1px solid rgba(30,58,52,0.06); padding-top: 8px;">
                                <div style="display: flex; gap: 12px; align-items: center;">
                                    <button class="report-review-btn" data-id="${r.id || ''}" data-date="${r.date}" data-name="${r.name}" style="background: none; border: none; font-size: 11px; color: #888; cursor: pointer; text-decoration: underline; padding: 0;">
                                        ${r.reported ? '🚩 Flagged' : 'Report Review'}
                                    </button>
                                    ${isOwner ? `
                                        <button class="customer-delete-btn" data-id="${r.id}" style="background: none; border: none; font-size: 11px; color: #dc3545; cursor: pointer; text-decoration: underline; padding: 0; display: flex; align-items: center; gap: 3px;">
                                            🗑️ Delete my Review
                                        </button>
                                    ` : ''}
                                </div>
                                ${isAdmin ? `
                                    <div style="display: flex; gap: 8px;">
                                        <button class="admin-hide-btn" data-id="${r.id || ''}" data-date="${r.date}" data-name="${r.name}" style="background: rgba(212,175,87,0.15); border: 1px solid var(--color-accent); color: var(--color-primary); padding: 4px 10px; font-size: 10px; font-weight: 600; cursor: pointer; border-radius: 3px;">Hide</button>
                                        <button class="admin-delete-btn" data-id="${r.id || ''}" data-date="${r.date}" data-name="${r.name}" style="background: rgba(220,53,69,0.1); border: 1px solid rgba(220,53,69,0.5); color: #dc3545; padding: 4px 10px; font-size: 10px; font-weight: 600; cursor: pointer; border-radius: 3px;">Delete</button>
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
                
                reviewsGrid.querySelectorAll('.customer-delete-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        deleteCustomerReview(id);
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
                            const id = btn.getAttribute('data-id');
                            deleteReview(name, date, id);
                        });
                    });
                }
                
                // Re-trigger scroll reveal observer for new review cards
                if (typeof revealObserver !== 'undefined') {
                    const newRevealElements = reviewsGrid.querySelectorAll('.scroll-reveal');
                    newRevealElements.forEach(el => revealObserver.observe(el));
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

    function deleteReview(name, date, id) {
        if (confirm("Are you sure you want to permanently delete this review?")) {
            if (useFirebase && db) {
                const docRef = id ? db.collection("reviews").doc(id) : null;
                const deletePromise = docRef ? docRef.delete() : db.collection("reviews").where("name", "==", name).where("date", "==", date).get().then(snap => {
                    snap.forEach(doc => doc.ref.delete());
                });
                deletePromise.then(() => {
                    showToast("Review deleted successfully.");
                });
            } else {
                let localList = JSON.parse(localStorage.getItem("lipley_reviews_db") || "[]");
                const idx = id ? localList.findIndex(r => r.id === id) : localList.findIndex(r => r.name === name && r.date === date);
                if (idx !== -1) {
                    localList.splice(idx, 1);
                    localStorage.setItem("lipley_reviews_db", JSON.stringify(localList));
                    showToast("Review deleted successfully.");
                    loadLocalReviews();
                }
            }
        }
    }

    function deleteCustomerReview(id) {
        if (confirm("Are you sure you want to permanently delete your review?")) {
            if (useFirebase && db) {
                db.collection("reviews").doc(id).delete()
                    .then(() => {
                        showToast("Your review has been deleted.");
                    })
                    .catch((err) => {
                        console.error("Firebase deletion failed:", err);
                        showToast("Failed to delete review. Please try again.", "error");
                    });
            } else {
                let localList = JSON.parse(localStorage.getItem("lipley_reviews_db") || "[]");
                const idx = localList.findIndex(r => r.id === id);
                if (idx !== -1) {
                    localList.splice(idx, 1);
                    localStorage.setItem("lipley_reviews_db", JSON.stringify(localList));
                    showToast("Your review has been deleted.");
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
            const productVal = document.getElementById('review-product') ? document.getElementById('review-product').value : 'Lip Balm';
            
            if (!nameVal || !ratingVal || !commentVal) {
                showToast("Please fill in all fields.", "error");
                return;
            }

            const newReview = {
                id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: nameVal,
                rating: ratingVal,
                comment: commentVal,
                product: productVal,
                date: new Date().toISOString(),
                verified: true, // Verified Purchase system
                approved: true // Publish automatically!
            };

            if (useFirebase && db) {
                db.collection("reviews").add(newReview)
                  .then((docRef) => {
                      let myReviews = JSON.parse(localStorage.getItem("my_owned_reviews") || "[]");
                      myReviews.push(docRef.id);
                      localStorage.setItem("my_owned_reviews", JSON.stringify(myReviews));

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
    }

    function submitLocally(newReview) {
        let localList = JSON.parse(localStorage.getItem("lipley_reviews_db") || "[]");
        localList.push(newReview);
        localStorage.setItem("lipley_reviews_db", JSON.stringify(localList));
        
        let myReviews = JSON.parse(localStorage.getItem("my_owned_reviews") || "[]");
        myReviews.push(newReview.id);
        localStorage.setItem("my_owned_reviews", JSON.stringify(myReviews));
        
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
    const orderPinInput = document.getElementById('order-pin');
    const orderStateInput = document.getElementById('order-state');
    
    // Create/get pincode feedback element
    let pincodeFeedback = document.getElementById('pincode-feedback');
    if (!pincodeFeedback && orderPinInput) {
        pincodeFeedback = document.createElement('div');
        pincodeFeedback.id = 'pincode-feedback';
        pincodeFeedback.className = 'promo-feedback-msg error';
        pincodeFeedback.style.cssText = 'display: none; color: #f44336; font-size: 11.5px; font-weight: 500; margin-top: 6px;';
        orderPinInput.parentNode.appendChild(pincodeFeedback);
    }
    
    if (checkoutQtyMinus) {
        checkoutQtyMinus.addEventListener('click', (e) => {
            e.preventDefault();
            if (isCartCheckout) {
                if (cart.length > 0) {
                    window.changeCheckoutQty(cart[0].productId, cart[0].quantity - 1);
                }
            } else {
                window.changeCheckoutQty(selectedProductId, currentQty - 1);
            }
        });
    }
    if (checkoutQtyPlus) {
        checkoutQtyPlus.addEventListener('click', (e) => {
            e.preventDefault();
            if (isCartCheckout) {
                if (cart.length > 0) {
                    window.changeCheckoutQty(cart[0].productId, cart[0].quantity + 1);
                }
            } else {
                window.changeCheckoutQty(selectedProductId, currentQty + 1);
            }
        });
    }
    
    // Configurable Coupon Codes database
    const couponDatabase = {
        'LIPLEY001': { code: 'LIPLEY001', discountPercent: 0.10, status: 'active' },
        'EXPIRED15': { code: 'EXPIRED15', discountPercent: 0.15, status: 'expired', minQty: 2 },
        'USED15': { code: 'USED15', discountPercent: 0.15, status: 'used', minQty: 2 }
    };
    
    let appliedCoupon = null; // Stores the currently applied coupon object, or null
    let couponApplied = false;
    let validCouponCode = 'LIPLEY001';
    let discountPercent = 0.10; // 10% Discount
    let isPinValid = false;
    let activeState = "";
    let isCartCheckout = false;
    currentQty = 1;

    function isOrderEligibleForLIPLEY001() {
        let subtotal = 0;
        if (isCartCheckout) {
            cart.forEach(item => {
                const product = window.products[item.productId] || { price: 149 };
                subtotal += product.price * item.quantity;
            });
            return subtotal >= 447;
        } else {
            if (currentQty > 0) {
                const product = window.products[selectedProductId] || { price: 149 };
                subtotal = currentQty * product.price;
            }
            return subtotal >= 447;
        }
    }

    function validateCouponState(couponCode) {
        const code = couponCode.trim().toUpperCase();
        if (!code) {
            return { valid: false, reason: 'Please enter a coupon code.', status: 'invalid' };
        }
        
        const coupon = couponDatabase[code];
        if (!coupon) {
            return { valid: false, reason: 'Invalid coupon code. (Discount not applied)', status: 'invalid' };
        }
        
        if (code === 'LIPLEY001') {
            if (!isOrderEligibleForLIPLEY001()) {
                return { valid: false, reason: 'LIPLEY001 is available only for eligible orders of ₹447 or more.', status: 'ineligible_offer' };
            }
        }

        if (coupon.status === 'expired') {
            return { valid: false, reason: 'This coupon code has expired.', status: 'expired' };
        }
        
        if (coupon.status === 'used') {
            return { valid: false, reason: 'This coupon code has already been used.', status: 'used' };
        }
        
        // Calculate subtotal of normal products
        let subtotal = 0;
        if (isCartCheckout) {
            cart.forEach(item => {
                const product = window.products[item.productId] || { price: 149 };
                subtotal += product.price * item.quantity;
            });
        } else {
            if (currentQty > 0) {
                const product = window.products[selectedProductId] || { price: 149 };
                subtotal = currentQty * product.price;
            }
        }
        
        if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
            return { valid: false, reason: `Minimum purchase of ₹${coupon.minSubtotal} required.`, status: 'min_subtotal' };
        }
        
        // Calculate current total items quantity in cart/checkout for minQty check
        const totalItemsQty = isCartCheckout ? cart.reduce((sum, item) => sum + item.quantity, 0) : currentQty;
        if (coupon.minQty && totalItemsQty < coupon.minQty) {
            return { valid: false, reason: `Coupon is available only for orders of ${coupon.minQty} or more products.`, status: 'min_qty' };
        }
        
        return { valid: true, coupon: coupon };
    }

    function autoRevalidateAppliedCoupon() {
        if (!appliedCoupon) return;
        
        const res = validateCouponState(appliedCoupon.code);
        if (!res.valid) {
            // Remove the coupon discount since conditions are no longer met
            appliedCoupon = null;
            couponApplied = false;
            if (couponFeedback) {
                couponFeedback.style.display = 'block';
                couponFeedback.textContent = res.reason;
                couponFeedback.className = 'promo-feedback-msg error';
            }
            if (couponCodeInput) {
                couponCodeInput.value = '';
            }
        }
    }

    // Keep window.shippingConfig for backwards compatibility but shipping charge calculation uses new engine
    window.shippingConfig = {
        freeDeliveryMinQuantity: 2,
        keralaDeliveryCharge: 30,
        standardDeliveryCharge: 69
    };

    function isLipBalmProduct(productId) {
        if (!productId) return false;
        if (productId === 'strawberry-beetroot' || productId === 'strawberry-zero') return true;
        const p = window.products ? window.products[productId] : null;
        if (p && (p.category === 'Organic Lip Balm' || p.type === 'Organic Lip Balm')) return true;
        return false;
    }

    function getUnifiedShippingRate(state, subtotal = 0, lipBalmQty = 0) {
        if (!state) {
            return { charge: null, text: '' };
        }
        
        // Buy 2 or more eligible lip balms -> FREE DELIVERY
        if (lipBalmQty >= 2) {
            return { charge: 0, text: 'FREE DELIVERY (Buy 2 Offer)' };
        }

        const stateKey = state.toLowerCase().trim();
        if (stateKey === 'kerala') {
            return { charge: 30, text: 'Kerala Delivery (₹30)' };
        } else {
            return { charge: 69, text: 'Standard Delivery (₹69)' };
        }
    }

    function getShippingRate(state, productId, qty, subtotal) {
        const lbQty = isLipBalmProduct(productId) ? qty : 0;
        if (typeof subtotal !== 'number') {
            const product = window.products[productId] || { price: 149 };
            subtotal = qty * product.price;
        }
        return getUnifiedShippingRate(state, subtotal, lbQty);
    }

    function getCartShippingRate(state, subtotal, cartItems = []) {
        let lbQty = 0;
        if (Array.isArray(cartItems)) {
            cartItems.forEach(item => {
                if (isLipBalmProduct(item.productId)) {
                    lbQty += item.quantity;
                }
            });
        }
        return getUnifiedShippingRate(state, subtotal, lbQty);
    }

    // Setup state searchable dropdown
    if (orderStateInput) {
        const stateDropdown = document.getElementById('state-dropdown-list');
        
        function populateDropdown(filterText = "") {
            if (!stateDropdown) return;
            stateDropdown.innerHTML = "";
            
            const filtered = indianStates.filter(state => 
                state.toLowerCase().includes(filterText.toLowerCase())
            );
            
            if (filtered.length === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'state-dropdown-no-results';
                noResults.textContent = 'No results found';
                stateDropdown.appendChild(noResults);
            } else {
                filtered.forEach(state => {
                    const item = document.createElement('div');
                    item.className = 'state-dropdown-item';
                    item.textContent = state;
                    if ((orderStateInput.value || "").trim().toLowerCase() === state.toLowerCase()) {
                        item.classList.add('selected');
                    }
                    
                    item.addEventListener('click', () => {
                        orderStateInput.value = state;
                        activeState = state;
                        isPinValid = true; // to satisfy order verification logic
                        stateDropdown.style.display = 'none';
                        calculateOrder();
                    });
                    
                    stateDropdown.appendChild(item);
                });
            }
        }
        
        orderStateInput.addEventListener('focus', () => {
            populateDropdown(orderStateInput.value);
            stateDropdown.style.display = 'block';
        });
        
        orderStateInput.addEventListener('input', () => {
            populateDropdown(orderStateInput.value);
            stateDropdown.style.display = 'block';
            
            // Recalculate shipping if state name matches exactly
            const val = orderStateInput.value.trim();
            const matched = indianStates.find(s => s.toLowerCase() === val.toLowerCase());
            if (matched) {
                activeState = matched;
                isPinValid = true;
            } else {
                activeState = "";
                isPinValid = false;
            }
            calculateOrder();
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (stateDropdown && !orderStateInput.contains(e.target) && !stateDropdown.contains(e.target)) {
                stateDropdown.style.display = 'none';
                
                // Validate value on blur
                const val = orderStateInput.value.trim();
                const matched = indianStates.find(s => s.toLowerCase() === val.toLowerCase());
                if (matched) {
                    orderStateInput.value = matched;
                    activeState = matched;
                    isPinValid = true;
                } else {
                    orderStateInput.value = "";
                    activeState = "";
                    isPinValid = false;
                }
                calculateOrder();
            }
        });
    }

    // Set up standard 6-digit PIN input limit (without validation)
    if (orderPinInput) {
        orderPinInput.addEventListener('input', () => {
            const val = orderPinInput.value.replace(/\D/g, '');
            orderPinInput.value = val.substring(0, 6);
            calculateOrder();
        });
    }

    window.changeCheckoutQty = function(productId, newQty) {
        newQty = parseInt(newQty);
        if (isNaN(newQty) || newQty < 1) return;
        
        if (isCartCheckout) {
            const item = cart.find(i => i.productId === productId);
            if (item) {
                item.quantity = newQty;
                saveCart();
                renderCheckoutSummary();
                calculateOrder();
            }
        } else {
            if (productId === selectedProductId) {
                currentQty = newQty;
                renderCheckoutSummary();
                calculateOrder();
            }
        }
    };
    
    window.removeCheckoutItem = function(productId) {
        if (isCartCheckout) {
            cart = cart.filter(i => i.productId !== productId);
            saveCart();
            renderCheckoutSummary();
            calculateOrder();
        } else {
            if (productId === selectedProductId) {
                currentQty = 0;
                renderCheckoutSummary();
                calculateOrder();
            }
        }
    };

    function renderCheckoutSummary() {
        const summaryList = document.querySelector('.summary-items-list');
        if (!summaryList) return;
        
        let lbQty = 0;
        if (isCartCheckout) {
            cart.forEach(item => {
                if (isLipBalmProduct(item.productId)) lbQty += item.quantity;
            });
        } else {
            if (isLipBalmProduct(selectedProductId)) lbQty = currentQty;
        }

        let offerBannerHTML = '';
        if (lbQty >= 2) {
            offerBannerHTML = `
                <div style="background: rgba(46, 125, 50, 0.08); border: 1px solid rgba(46, 125, 50, 0.3); border-radius: 6px; padding: 10px 12px; margin-bottom: 15px; font-size: 12px; color: #2E7D32; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 15px;">🎉</span>
                    <span>Buy 2 Lip Balms Offer: <strong>FREE DELIVERY Applied!</strong></span>
                </div>
            `;
        } else if (lbQty === 1) {
            offerBannerHTML = `
                <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 6px; padding: 10px 12px; margin-bottom: 15px; font-size: 12px; color: #1E3A34; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 15px;">🚚</span>
                    <span>Add 1 more Lip Balm for ₹149 to get <strong>FREE DELIVERY!</strong></span>
                </div>
            `;
        }

        if (isCartCheckout) {
            if (cart.length === 0) {
                summaryList.innerHTML = `
                    <div style="text-align: center; padding: 30px 10px; color: var(--color-primary); opacity: 0.7;">
                        <p style="font-size: 13.5px; margin: 0 0 15px 0;">Your checkout cart is empty.</p>
                        <button type="button" class="btn btn-secondary btn-small" onclick="window.closePurchaseOptions()" style="width: auto; padding: 8px 20px; font-size: 11px;">Continue Shopping</button>
                    </div>
                `;
                return;
            }
            
            let html = offerBannerHTML + '<div style="display: flex; flex-direction: column; gap: 20px;">';
            cart.forEach(item => {
                const product = window.products[item.productId] || { name: item.productId, price: 149, image: 'assets/images/lipley-beetroot-lip-balm-8g.webp' };
                const itemTotal = product.price * item.quantity;
                html += `
                    <div class="checkout-item-row" style="border-bottom: 1px solid rgba(30, 58, 52, 0.06); padding-bottom: 15px; display: flex; gap: 12px; align-items: flex-start;">
                        <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(30,58,52,0.08);">
                        <div style="flex: 1; min-width: 0;">
                            <h4 style="font-size: 12px; font-weight: 700; color: var(--color-primary); margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.3;">${product.name}</h4>
                            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: var(--color-primary); opacity: 0.8;">
                                <span>₹${product.price} × ${item.quantity}</span>
                                <span style="font-weight: 600; color: var(--color-primary);">₹${itemTotal}</span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px;">
                                <div class="qty-selector-small" style="display: inline-flex; align-items: center; border: 1px solid rgba(30, 58, 52, 0.12); border-radius: 3px; background: #fff;">
                                    <button type="button" class="qty-btn-s" onclick="window.changeCheckoutQty('${item.productId}', ${item.quantity - 1})" style="border: none; background: none; width: 22px; height: 22px; font-size: 12px; cursor: pointer; color: var(--color-primary); display: flex; align-items: center; justify-content: center;">−</button>
                                    <span style="font-size: 11px; font-weight: 700; width: 22px; text-align: center; color: var(--color-primary); display: inline-block;">${item.quantity}</span>
                                    <button type="button" class="qty-btn-s" onclick="window.changeCheckoutQty('${item.productId}', ${item.quantity + 1})" style="border: none; background: none; width: 22px; height: 22px; font-size: 12px; cursor: pointer; color: var(--color-primary); display: flex; align-items: center; justify-content: center;">+</button>
                                </div>
                                <button type="button" onclick="window.removeCheckoutItem('${item.productId}')" style="background: none; border: none; font-size: 10px; font-weight: 600; text-transform: uppercase; color: #f44336; cursor: pointer; letter-spacing: 0.03em; padding: 4px;">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            summaryList.innerHTML = html;
        } else {
            if (currentQty <= 0) {
                summaryList.innerHTML = `
                    <div style="text-align: center; padding: 30px 10px; color: var(--color-primary); opacity: 0.7;">
                        <p style="font-size: 13.5px; margin: 0 0 15px 0;">Your checkout is empty.</p>
                        <button type="button" class="btn btn-secondary btn-small" onclick="window.closePurchaseOptions()" style="width: auto; padding: 8px 20px; font-size: 11px;">Continue Shopping</button>
                    </div>
                `;
                return;
            }
            
            const product = window.products[selectedProductId] || { name: "LIPLEY Beetroot Tinted Lip Balm", price: 149, image: 'assets/images/lipley-beetroot-lip-balm-8g.webp' };
            const itemTotal = product.price * currentQty;
            summaryList.innerHTML = offerBannerHTML + `
                <div class="checkout-item-row" style="border-bottom: 1px solid rgba(30, 58, 52, 0.06); padding-bottom: 15px; display: flex; gap: 12px; align-items: flex-start;">
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(30,58,52,0.08);">
                    <div style="flex: 1; min-width: 0;">
                        <h4 style="font-size: 12px; font-weight: 700; color: var(--color-primary); margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.3;">${product.name}</h4>
                        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: var(--color-primary); opacity: 0.8;">
                            <span>₹${product.price} × ${currentQty}</span>
                            <span style="font-weight: 600; color: var(--color-primary);">₹${itemTotal}</span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px;">
                            <div class="qty-selector-small" style="display: inline-flex; align-items: center; border: 1px solid rgba(30, 58, 52, 0.12); border-radius: 3px; background: #fff;">
                                <button type="button" class="qty-btn-s" onclick="window.changeCheckoutQty('${selectedProductId}', ${currentQty - 1})" style="border: none; background: none; width: 22px; height: 22px; font-size: 12px; cursor: pointer; color: var(--color-primary); display: flex; align-items: center; justify-content: center;">−</button>
                                <span style="font-size: 11px; font-weight: 700; width: 22px; text-align: center; color: var(--color-primary); display: inline-block;">${currentQty}</span>
                                <button type="button" class="qty-btn-s" onclick="window.changeCheckoutQty('${selectedProductId}', ${currentQty + 1})" style="border: none; background: none; width: 22px; height: 22px; font-size: 12px; cursor: pointer; color: var(--color-primary); display: flex; align-items: center; justify-content: center;">+</button>
                            </div>
                            <button type="button" onclick="window.removeCheckoutItem('${selectedProductId}')" style="background: none; border: none; font-size: 10px; font-weight: 600; text-transform: uppercase; color: #f44336; cursor: pointer; letter-spacing: 0.03em; padding: 4px;">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    function formatMoney(amount) {
        if (typeof amount !== 'number' || isNaN(amount)) return '0';
        return (amount % 1 === 0) ? amount.toString() : amount.toFixed(2);
    }

    function calculateOrder() {
        autoRevalidateAppliedCoupon();
        let productTotal = 0;
        let deliveryCharge = null;
        let offerText = '';
        let discountAmount = 0;
        
        const pinVal = orderPinInput ? orderPinInput.value.trim() : "";
        
        const billPinRow = document.getElementById('bill-pin-row');
        const billPinValue = document.getElementById('bill-pin-value');
        const billStateRow = document.getElementById('bill-state-row');
        const billStateValue = document.getElementById('bill-state-value');
        const billDeliveryStatusBox = document.getElementById('bill-delivery-status-box');
        const billDeliveryStatusText = document.getElementById('bill-delivery-status');
        
        let lbQty = 0;
        
        const isKerala = (activeState || "").toLowerCase().trim() === 'kerala';
        const isEligibleOffer = isOrderEligibleForLIPLEY001();
        const isLIPLEY001 = couponApplied && appliedCoupon && appliedCoupon.code === 'LIPLEY001' && isEligibleOffer;

        if (isCartCheckout) {
            cart.forEach(item => {
                const product = window.products[item.productId] || { price: 149 };
                productTotal += product.price * item.quantity;
                if (isLipBalmProduct(item.productId)) lbQty += item.quantity;
            });
            
            if (activeState) {
                const rate = getCartShippingRate(activeState, productTotal, cart);
                deliveryCharge = rate.charge;
                offerText = rate.text;
                
                if (billPinRow && billPinValue) {
                    billPinValue.textContent = pinVal || "-";
                    billPinRow.style.display = 'flex';
                }
                if (billStateRow && billStateValue) {
                    billStateValue.textContent = activeState;
                    billStateRow.style.display = 'flex';
                }
            } else {
                if (billPinRow) billPinRow.style.display = 'none';
                if (billStateRow) billStateRow.style.display = 'none';
                deliveryCharge = null;
            }
        } else {
            if (currentQty > 0) {
                const product = window.products[selectedProductId] || { price: 149 };
                productTotal = currentQty * product.price;
                if (isLipBalmProduct(selectedProductId)) lbQty = currentQty;
            }
            
            if (activeState) {
                const rate = getShippingRate(activeState, selectedProductId, currentQty);
                deliveryCharge = rate.charge;
                offerText = rate.text;
                
                if (billPinRow && billPinValue) {
                    billPinValue.textContent = pinVal || "-";
                    billPinRow.style.display = 'flex';
                }
                if (billStateRow && billStateValue) {
                    billStateValue.textContent = activeState;
                    billStateRow.style.display = 'flex';
                }
            } else {
                if (billPinRow) billPinRow.style.display = 'none';
                if (billStateRow) billStateRow.style.display = 'none';
                deliveryCharge = null;
            }
        }

        let deliveryMsg = "";
        if (deliveryCharge !== null) {
            if (deliveryCharge === 0) {
                deliveryMsg = lbQty >= 2 
                    ? `Delivery to ${activeState}: FREE (Buy 2 Offer Applied)` 
                    : `Delivery to ${activeState}: FREE`;
            } else {
                deliveryMsg = `Delivery to ${activeState}: ₹${formatMoney(deliveryCharge)}`;
                if (lbQty === 1) {
                    deliveryMsg += ` • Buy 1 more lip balm for FREE delivery`;
                }
            }
        }
        
        if (couponApplied && appliedCoupon) {
            if (appliedCoupon.code === 'LIPLEY001') {
                if (isLIPLEY001) {
                    discountAmount = Math.round(productTotal * 0.10 * 100) / 100;
                } else {
                    discountAmount = 0;
                    couponApplied = false;
                    appliedCoupon = null;
                }
            } else {
                discountAmount = Math.round(productTotal * appliedCoupon.discountPercent * 100) / 100;
            }
        } else {
            discountAmount = 0;
            couponApplied = false;
        }
        
        let grandTotal = Math.max(0, productTotal + (deliveryCharge || 0) - discountAmount);
        
        if (billProductPrice) billProductPrice.textContent = `₹${formatMoney(productTotal)}`;
        
        if (billDeliveryCharge) {
            if (deliveryCharge === null) {
                billDeliveryCharge.textContent = "Select State";
                billDeliveryCharge.style.color = 'var(--color-accent)';
                billDeliveryCharge.style.fontWeight = "";
            } else if (deliveryCharge === 0) {
                billDeliveryCharge.textContent = lbQty >= 2 ? "FREE (Buy 2 Offer)" : "FREE";
                billDeliveryCharge.style.color = "#4CAF50";
                billDeliveryCharge.style.fontWeight = "600";
            } else {
                billDeliveryCharge.textContent = `₹${formatMoney(deliveryCharge)}`;
                billDeliveryCharge.style.color = "";
                billDeliveryCharge.style.fontWeight = "";
            }
        }
        
        if (billDiscountRow && billDiscountValue) {
            if (discountAmount > 0) {
                const labelSpan = billDiscountRow.querySelector('span:first-child');
                if (labelSpan) {
                    if (appliedCoupon && appliedCoupon.code === 'LIPLEY001') {
                        labelSpan.textContent = "Discount (10% OFF)";
                    } else {
                        labelSpan.textContent = "Discount";
                    }
                }
                billDiscountValue.textContent = `-₹${formatMoney(discountAmount)}`;
                billDiscountRow.style.display = 'flex';
            } else {
                billDiscountRow.style.display = 'none';
            }
        }
        
        if (billGrandTotal) billGrandTotal.textContent = `₹${formatMoney(grandTotal)}`;
        
        if (billDeliveryStatusBox && billDeliveryStatusText) {
            if (deliveryCharge === null) {
                billDeliveryStatusBox.style.display = 'none';
            } else {
                if (isLIPLEY001) {
                    billDeliveryStatusText.textContent = `${deliveryMsg} | LIPLEY001 10% OFF Applied`;
                } else {
                    billDeliveryStatusText.textContent = deliveryMsg;
                }
                billDeliveryStatusText.style.color = "";
                billDeliveryStatusBox.style.borderLeftColor = "var(--color-accent)";
                billDeliveryStatusBox.style.backgroundColor = "rgba(30, 58, 52, 0.03)";
                billDeliveryStatusBox.style.display = 'block';
            }
        }

        // Dynamically update coupon feedback message for LIPLEY001
        if (isLIPLEY001 && couponFeedback) {
            couponFeedback.style.display = 'block';
            couponFeedback.textContent = `✓ LIPLEY001 Applied — You Saved ₹${formatMoney(discountAmount)}`;
            couponFeedback.className = 'promo-feedback-msg success';
        }
    }

    // Coupon Apply Event
    if (applyCouponBtn && couponCodeInput) {
        applyCouponBtn.addEventListener('click', () => {
            const enteredCode = couponCodeInput.value.trim().toUpperCase();
            
            if (enteredCode === '') {
                couponFeedback.style.display = 'block';
                couponFeedback.textContent = 'Please enter a coupon code.';
                couponFeedback.className = 'promo-feedback-msg error';
                appliedCoupon = null;
                couponApplied = false;
                calculateOrder();
                return;
            }
            
            // Prevent applying the same coupon twice
            if (appliedCoupon && appliedCoupon.code === enteredCode) {
                couponFeedback.style.display = 'block';
                couponFeedback.textContent = 'This coupon is already applied to your order.';
                couponFeedback.className = 'promo-feedback-msg success';
                return;
            }
            
            // Disable button and show "Validating..."
            applyCouponBtn.disabled = true;
            const originalBtnText = applyCouponBtn.textContent || 'Apply';
            applyCouponBtn.textContent = 'Validating...';
            
            // Simulate processing delay for a premium feel
            setTimeout(() => {
                const res = validateCouponState(enteredCode);
                
                applyCouponBtn.disabled = false;
                applyCouponBtn.textContent = originalBtnText;
                
                if (res.valid) {
                    appliedCoupon = res.coupon;
                    couponApplied = true;
                    discountPercent = res.coupon.discountPercent;
                    
                    couponFeedback.style.display = 'block';
                    if (res.coupon.code === 'LIPLEY001') {
                        couponFeedback.textContent = `✓ LIPLEY001 Applied — You Saved ₹${formatMoney(discountAmount)}`;
                    } else {
                        couponFeedback.textContent = `Coupon applied successfully! Saved ${res.coupon.discountPercent * 100}% on your items.`;
                    }
                    couponFeedback.className = 'promo-feedback-msg success';
                } else {
                    appliedCoupon = null;
                    couponApplied = false;
                    
                    couponFeedback.style.display = 'block';
                    couponFeedback.textContent = res.reason;
                    couponFeedback.className = 'promo-feedback-msg error';
                }
                calculateOrder();
            }, 600);
        });
    }
    
    // Checkout form real-time input error dismissal
    const checkoutFieldIds = ['order-full-name', 'order-phone', 'order-house', 'order-address', 'order-district', 'order-state', 'order-pin'];
    checkoutFieldIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                el.classList.remove('field-error');
                const feedback = document.getElementById('checkout-form-feedback');
                if (feedback) feedback.style.display = 'none';
            });
        }
    });

    function showCheckoutValidationError(inputEl, message) {
        if (inputEl) {
            inputEl.classList.add('field-error');
            inputEl.focus();
            inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        const feedback = document.getElementById('checkout-form-feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.style.display = 'block';
        }
        if (typeof showToast === 'function') {
            showToast(message, 'error');
        }
    }

    // Form Submit Event
    if (purchaseOrderForm) {
        purchaseOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear any previous error styling
            checkoutFieldIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('field-error');
            });
            const formFeedback = document.getElementById('checkout-form-feedback');
            if (formFeedback) formFeedback.style.display = 'none';

            if (isCartCheckout) {
                if (!cart || cart.length === 0) {
                    showCheckoutValidationError(null, "Your checkout cart is empty. Please add items to your cart before ordering.");
                    return;
                }
            } else {
                if (currentQty <= 0) {
                    showCheckoutValidationError(null, "Your checkout summary is empty. Please select a product before ordering.");
                    return;
                }
            }

            // 1. Validate Full Name
            const nameInput = document.getElementById('order-full-name');
            const fullName = nameInput ? nameInput.value.trim() : '';
            if (!fullName || fullName.length < 2) {
                showCheckoutValidationError(nameInput, "Please enter your full name.");
                return;
            }

            // 2. Validate Phone Number (10 digits)
            const phoneInput = document.getElementById('order-phone');
            const rawPhone = phoneInput ? phoneInput.value.trim() : '';
            const digitsOnlyPhone = rawPhone.replace(/[\s\-\+]/g, '');
            const phone10 = (digitsOnlyPhone.startsWith('91') && digitsOnlyPhone.length === 12) ? digitsOnlyPhone.slice(2) : digitsOnlyPhone;
            if (!/^\d{10}$/.test(phone10)) {
                showCheckoutValidationError(phoneInput, "Please enter a valid 10-digit mobile number.");
                return;
            }

            // 3. Validate Delivery Address
            const houseInput = document.getElementById('order-house');
            const addressInput = document.getElementById('order-address');
            const districtInput = document.getElementById('order-district');
            const house = houseInput ? houseInput.value.trim() : '';
            const address = addressInput ? addressInput.value.trim() : '';
            const district = districtInput ? districtInput.value.trim() : '';

            if (!address) {
                showCheckoutValidationError(addressInput, "Please enter your delivery address.");
                return;
            }
            if (!district) {
                showCheckoutValidationError(districtInput, "Please enter your district.");
                return;
            }

            // 4. Validate State selection
            const stateVal = orderStateInput ? orderStateInput.value.trim() : '';
            const matchedState = indianStates.find(s => s.toLowerCase() === stateVal.toLowerCase());
            if (!stateVal || !matchedState) {
                showCheckoutValidationError(orderStateInput, "Please select your State / Union Territory from the list.");
                return;
            }

            // 5. Validate PIN Code (6 digits)
            const pinInput = document.getElementById('order-pin');
            const pin = pinInput ? pinInput.value.trim() : '';
            if (!/^\d{6}$/.test(pin)) {
                showCheckoutValidationError(pinInput, "Please enter a valid 6-digit PIN code.");
                return;
            }

            // Construct delivery address string
            const deliveryAddress = house ? `${house}, ${address}, ${district}` : `${address}, ${district}`;

            // Calculate totals dynamically before sending to WhatsApp
            let productTotal = 0;
            let deliveryCharge = 0;
            let orderItems = [];

            if (isCartCheckout) {
                cart.forEach(item => {
                    const product = window.products[item.productId] || { name: item.productId, price: 149 };
                    productTotal += product.price * item.quantity;
                    orderItems.push({
                        name: product.name,
                        quantity: item.quantity,
                        price: product.price
                    });
                });
                const rate = getCartShippingRate(matchedState, productTotal, cart);
                deliveryCharge = rate.charge;
            } else {
                const product = window.products[selectedProductId] || { name: "LIPLEY Beetroot Tinted Lip Balm", price: 149 };
                productTotal = currentQty * product.price;
                orderItems.push({
                    name: product.name,
                    quantity: currentQty,
                    price: product.price
                });
                const rate = getShippingRate(matchedState, selectedProductId, currentQty);
                deliveryCharge = rate.charge;
            }

            // Calculate coupon discount if applied
            let discountAmount = 0;
            if (couponApplied && appliedCoupon) {
                if (appliedCoupon.code === 'LIPLEY001') {
                    if (isOrderEligibleForLIPLEY001()) {
                        discountAmount = Math.round(productTotal * 0.10 * 100) / 100;
                    }
                } else {
                    discountAmount = Math.round(productTotal * (appliedCoupon.discountPercent || 0) * 100) / 100;
                }
            }
            const grandTotal = Math.max(0, productTotal + (deliveryCharge || 0) - discountAmount);

            // Format WhatsApp Message exactly as specified
            let message = "LIPLEY — NEW ORDER\n\n";

            message += "Customer Details:\n";
            message += `Name: ${fullName}\n`;
            message += `Phone: ${phone10}\n`;
            message += `Address: ${deliveryAddress}\n`;
            message += `State: ${matchedState}\n`;
            message += `PIN Code: ${pin}\n\n`;

            message += "Order Details:\n";
            if (orderItems.length === 1) {
                const item = orderItems[0];
                message += `${item.name} × ${item.quantity}\n`;
                message += `Offer Price: ₹${item.price} each\n`;
            } else {
                orderItems.forEach((item, index) => {
                    message += `${item.name} × ${item.quantity}\n`;
                    message += `Offer Price: ₹${item.price} each\n\n`;
                });
            }

            message += `Subtotal: ₹${formatMoney(productTotal)}\n`;
            if (deliveryCharge === 0) {
                message += "Delivery: FREE\n";
            } else {
                message += `Delivery: ₹${formatMoney(deliveryCharge)}\n`;
            }

            if (couponApplied && discountAmount > 0) {
                message += `Discount: ₹${formatMoney(discountAmount)}\n`;
            }

            message += `Grand Total: ₹${formatMoney(grandTotal)}\n\n`;

            message += `Source: ${getReferralSource()}\n\n`;
            message += "Please confirm this order. Thank you!";

            // Direct WhatsApp redirect with no false popups
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/917591900437?text=${encodedMessage}`;

            // Reset cart on checkout submission if it was a cart checkout
            if (isCartCheckout) {
                cart = [];
                saveCart();
            }

            window.open(whatsappUrl, '_blank');
        });
    }

    // --- 14. DYNAMIC INSTAGRAM FEED CONTROLLER ---
    const instagramGrid = document.querySelector('.instagram-grid');
    const localFallbackPosts = [
        {
            "url": "https://www.instagram.com/lipleycare",
            "image": "assets/images/lipley-instagram-featured.webp",
            "alt": "Natural Organic Lip Care by Lipley - Featured Poster",
            "filter": "none"
        },
        {
            "url": "https://www.instagram.com/lipleycare",
            "image": "assets/images/lipley-instagram-model.webp",
            "alt": "Natural Organic Lip Care by Lipley Showcase",
            "filter": "none"
        },
        {
            "url": "https://www.instagram.com/lipleycare",
            "image": "assets/images/lipley-instagram-essential.webp",
            "alt": "Natural Organic Lip Care by Lipley Product Showcase",
            "filter": "none"
        },
        {
            "url": "https://www.instagram.com/lipleycare",
            "image": "assets/images/lipley-instagram-pyramid.webp",
            "alt": "Natural Organic Lip Care by Lipley Stack Showcase",
            "filter": "none"
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
                    renderInstagramFeed(data);
                } else {
                    renderInstagramFeed(localFallbackPosts);
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
        const state = history.state;
        if (state && state.type === 'policy' && state.id === 'policy-modal') {
            window.goBack();
        } else {
            if (policyModal) {
                policyModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        }
    };

    // --- 15. EMAILJS CONTACT SUBMISSION ---
    if (typeof emailjs !== 'undefined') {
        emailjs.init("U2SbavD5Sfe3OsSVe");
    }

    const contactForm = document.getElementById('lipley-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending...</span>';
            }
            
            if (typeof emailjs === 'undefined') {
                showToast("Email service is currently unavailable. Please try again later.", "error");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
                return;
            }
            
            const nameVal = document.getElementById('c-name').value.trim();
            const emailVal = document.getElementById('c-email').value.trim();
            const messageVal = document.getElementById('c-message').value.trim();
            
            const templateParams = {
                from_name: nameVal,
                reply_to: emailVal,
                message: messageVal,
                to_email: "hellolipley2026@gmail.com"
            };
            
            emailjs.send("service_q0e7e45", "template_fg6cxbr", templateParams)
                .then(() => {
                    showToast("Thank you! Your message has been sent successfully.");
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error("EmailJS send failed:", error);
                    showToast("Failed to send message. Please try again.", "error");
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                });
        });
    }

    if (policyCloseBtn) policyCloseBtn.addEventListener('click', window.closePolicyModal);
    if (policyOverlay) policyOverlay.addEventListener('click', window.closePolicyModal);

    // Fade out hero scroll indicator on scroll
    const scrollIndicator = document.getElementById('hero-scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '0.85';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }

    // Handle sticky purchase bar visibility and checkout triggers
    const stickyBar = document.getElementById('sticky-purchase-bar');
    const mainActionButtons = document.querySelector('.p-action-buttons');
    const stickyBuyBtn = document.getElementById('sticky-bar-buy-btn');
    
    if (stickyBar && mainActionButtons) {
        window.addEventListener('scroll', () => {
            const isProductViewActive = viewProduct.classList.contains('active');
            if (!isProductViewActive) {
                stickyBar.classList.remove('show');
                return;
            }
            
            const buttonRect = mainActionButtons.getBoundingClientRect();
            if (buttonRect.bottom < 0) {
                stickyBar.classList.add('show');
            } else {
                stickyBar.classList.remove('show');
            }
        });
    }

    if (stickyBuyBtn) {
        stickyBuyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = selectedProductId;
            
            const inCart = cart.some(item => item.productId === productId);
            if (!inCart) {
                addToCart(productId, 1, false);
            }
            
            isCartCheckout = true;
            if (typeof calculateOrder === 'function') {
                calculateOrder();
            }
            
            window.openPurchaseOptions();
        });
    }

});


/* ==========================================================================
   LIPLEY SHARED PERSISTENT DATABASE & API ENGINE
   Used by both Lipley Admin Web and Lipley Public Website
   ========================================================================== */

(function(window) {
    'use strict';

    const DB_STORAGE_KEY = 'lipley_persistent_products_db_v2';
    const ADMIN_TOKEN_KEY = 'lipley_admin_token';
    const VALID_ADMIN_TOKEN = 'lipley_admin_sec_token_2026_x89a';
    const DEFAULT_ADMIN_PASSWORD = 'lipleyadmin123';

    // 3 Initial Seed Products (Preserving original products & structure)
    const SEED_PRODUCTS = [
        {
            id: "strawberry-beetroot",
            slug: "strawberry-beetroot",
            name: "LIPLEY Beetroot Tinted Lip Balm",
            price: 149,
            originalPrice: 179,
            compare_price: 179,
            short_description: "Naturally Soft. Beautifully Tinted.",
            description: "Premium organic lip balm enriched with Strawberry Extract and Beetroot Oil to help moisturize lips while providing a beautiful natural tinted finish.",
            category: "Organic Lip Balm",
            badge: "SPECIAL OFFER",
            variant: "Beetroot Tinted",
            image: "assets/images/lipley-beetroot-lip-balm-8g.webp",
            gallery: [
                "assets/images/lipley-beetroot-lip-balm-8g.webp",
                "assets/images/lipley-beetroot-lip-balm-open.webp",
                "assets/images/lipley-beetroot-lip-balm-hand.webp"
            ],
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
            instructions: "Apply evenly on clean lips whenever needed.<br><br>Reapply throughout the day for continuous hydration and a natural tinted look.<br><br>Apply before bedtime for overnight nourishment.",
            netQty: "8g",
            storage: "Store in a cool, dry place. Keep away from direct sunlight.",
            stock: 50,
            active: true,
            featured: true,
            is_new: false,
            bestseller: true,
            status: "published",
            created_at: "2026-01-15T10:00:00.000Z",
            updated_at: "2026-10-12T12:00:00.000Z"
        },
        {
            id: "strawberry-zero",
            slug: "strawberry-zero",
            name: "LIPLEY Strawberry Zero Tinted Lip Balm",
            price: 149,
            originalPrice: 179,
            compare_price: 179,
            short_description: "Natural Organic Strawberry Care.",
            description: "Premium organic lip balm infused with pure strawberry extract to nourish, deeply hydrate and protect lips with a clear, radiant, non-sticky touch.",
            category: "Organic Lip Balm",
            badge: "SPECIAL OFFER",
            variant: "Strawberry Zero Tinted",
            image: "assets/images/lipley-strawberry-lip-balm-8g.jpg",
            gallery: [
                "assets/images/lipley-strawberry-lip-balm-8g.jpg",
                "assets/images/lipley-strawberry-lip-balm-open.jpg",
                "assets/images/lipley-strawberry-lip-balm-hand.jpg"
            ],
            ingredients: ["Beeswax", "Shea Butter", "Cocoa Butter", "Almond Oil", "Jojoba Oil", "Castor Oil", "Coconut Oil", "Strawberry Extract", "Vitamin E"],
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
            netQty: "8g",
            storage: "Store in a cool, dry place. Keep away from direct sunlight.",
            stock: 50,
            active: true,
            featured: true,
            is_new: true,
            bestseller: false,
            status: "published",
            created_at: "2026-10-12T10:00:00.000Z",
            updated_at: "2026-10-12T12:00:00.000Z"
        },

    ];

    function getStoredProducts() {
        try {
            const raw = localStorage.getItem(DB_STORAGE_KEY);
            if (!raw) {
                localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
                return SEED_PRODUCTS;
            }
            let parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
                return SEED_PRODUCTS;
            }
            // Filter out any products no longer in SEED_PRODUCTS (e.g. removed hair oil and bundles)
            let modified = false;
            const initialCount = parsed.length;
            parsed = parsed.filter(p => SEED_PRODUCTS.some(seed => seed.id === p.id));
            if (parsed.length !== initialCount) {
                modified = true;
            }
            // Auto-sync updated seed prices and new seed products
            SEED_PRODUCTS.forEach(seed => {
                const existing = parsed.find(p => p.id === seed.id);
                if (!existing) {
                    parsed.push(seed);
                    modified = true;
                } else {
                    if (seed.originalPrice && existing.originalPrice !== seed.originalPrice) {
                        existing.originalPrice = seed.originalPrice;
                        existing.compare_price = seed.compare_price;
                        existing.price = seed.price;
                        modified = true;
                    }
                    if (seed.badge && existing.badge !== seed.badge) {
                        existing.badge = seed.badge;
                        modified = true;
                    }
                    if (seed.name && existing.name !== seed.name) {
                        existing.name = seed.name;
                        modified = true;
                    }
                    if (seed.image && existing.image !== seed.image) {
                        existing.image = seed.image;
                        modified = true;
                    }
                    if (seed.gallery && JSON.stringify(existing.gallery) !== JSON.stringify(seed.gallery)) {
                        existing.gallery = seed.gallery;
                        modified = true;
                    }
                }
            });
            if (modified) {
                localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(parsed));
            }
            return parsed;
        } catch (e) {
            console.error("Local database read error:", e);
            return SEED_PRODUCTS;
        }
    }

    function saveStoredProducts(products) {
        try {
            localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(products));
            window.dispatchEvent(new Event('lipley_products_updated'));
            return true;
        } catch (e) {
            console.error("Local database write error:", e);
            return false;
        }
    }

    const LipleyAPI = {
        async loginAdmin(password) {
            if (password === DEFAULT_ADMIN_PASSWORD || password === 'admin') {
                localStorage.setItem(ADMIN_TOKEN_KEY, VALID_ADMIN_TOKEN);
                return { success: true, token: VALID_ADMIN_TOKEN };
            }
            return { success: false, error: 'Invalid admin password.' };
        },

        getAdminToken() {
            return localStorage.getItem(ADMIN_TOKEN_KEY);
        },

        isAuthorized(token) {
            const t = token || this.getAdminToken();
            return t === VALID_ADMIN_TOKEN;
        },

        async getProducts(options = {}) {
            const { includeInactive = false, apiEndpoint = '/api/products' } = options;

            try {
                const fetchUrl = includeInactive ? `${apiEndpoint}?all=true` : apiEndpoint;
                const token = this.getAdminToken();
                const headers = token ? { 'X-Admin-Token': token } : {};

                const response = await fetch(fetchUrl, { headers });
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && Array.isArray(data.products)) {
                        saveStoredProducts(data.products);
                        return data.products;
                    }
                }
            } catch (err) {}

            const allProducts = getStoredProducts();
            if (includeInactive) {
                return allProducts;
            }
            return allProducts.filter(p => p.active !== false && p.status !== 'disabled' && p.status !== 'draft');
        },

        async saveProduct(productData, token) {
            if (!this.isAuthorized(token)) {
                return { success: false, error: 'Unauthorized: Admin token required' };
            }

            const products = getStoredProducts();
            const isEditing = !!productData.id && products.some(p => p.id === productData.id);

            const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const id = productData.id || slug || ('prod_' + Date.now());

            const newProduct = {
                id,
                slug,
                name: productData.name.trim(),
                price: parseFloat(productData.price),
                originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
                compare_price: productData.compare_price ? parseFloat(productData.compare_price) : (productData.originalPrice ? parseFloat(productData.originalPrice) : null),
                short_description: productData.short_description || '',
                description: productData.description || '',
                category: productData.category || 'General',
                badge: productData.badge || (productData.bestseller ? 'BEST SELLER' : (productData.is_new ? 'NEW' : '')),
                variant: productData.variant || '',
                image: productData.image || 'assets/images/lipley-beetroot-lip-balm-8g.webp',
                gallery: Array.isArray(productData.gallery) && productData.gallery.length > 0 ? productData.gallery : [productData.image || 'assets/images/lipley-beetroot-lip-balm-8g.webp'],
                ingredients: Array.isArray(productData.ingredients) ? productData.ingredients : (productData.ingredients ? productData.ingredients.split(',').map(s => s.trim()) : []),
                benefits: Array.isArray(productData.benefits) ? productData.benefits : (productData.benefits ? productData.benefits.split('\n').map(s => s.trim()).filter(Boolean) : []),
                instructions: productData.instructions || '',
                netQty: productData.netQty || '',
                storage: productData.storage || 'Store in a cool, dry place.',
                stock: parseInt(productData.stock) || 0,
                active: productData.active !== false,
                featured: !!productData.featured,
                is_new: !!productData.is_new,
                bestseller: !!productData.bestseller,
                status: productData.status || 'published',
                created_at: productData.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            if (isEditing) {
                const index = products.findIndex(p => p.id === id);
                products[index] = newProduct;
            } else {
                products.unshift(newProduct);
            }

            saveStoredProducts(products);

            try {
                const url = isEditing ? `/api/products/${id}` : '/api/products';
                const method = isEditing ? 'PUT' : 'POST';
                await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Admin-Token': token || this.getAdminToken()
                    },
                    body: JSON.stringify(newProduct)
                });
            } catch (e) {}

            return { success: true, product: newProduct };
        },

        async toggleProductStatus(id, token) {
            if (!this.isAuthorized(token)) {
                return { success: false, error: 'Unauthorized: Admin token required' };
            }

            const products = getStoredProducts();
            const index = products.findIndex(p => p.id === id);
            if (index === -1) {
                return { success: false, error: 'Product not found' };
            }

            const current = products[index];
            current.active = !current.active;
            current.status = current.active ? 'published' : 'disabled';
            current.updated_at = new Date().toISOString();

            products[index] = current;
            saveStoredProducts(products);

            try {
                await fetch(`/api/products/${id}/toggle`, {
                    method: 'PATCH',
                    headers: { 'X-Admin-Token': token || this.getAdminToken() }
                });
            } catch (e) {}

            return { success: true, product: current };
        },

        async deleteProduct(id, token) {
            if (!this.isAuthorized(token)) {
                return { success: false, error: 'Unauthorized: Admin token required' };
            }

            const products = getStoredProducts();
            const index = products.findIndex(p => p.id === id);
            if (index === -1) {
                return { success: false, error: 'Product not found' };
            }

            const current = products[index];
            current.active = false;
            current.status = 'disabled';
            current.updated_at = new Date().toISOString();

            products[index] = current;
            saveStoredProducts(products);

            try {
                await fetch(`/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'X-Admin-Token': token || this.getAdminToken() }
                });
            } catch (e) {}

            return { success: true, message: 'Product disabled and safely archived.' };
        }
    };

    window.LipleyAPI = LipleyAPI;

})(window);

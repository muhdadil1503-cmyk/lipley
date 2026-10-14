// Cloudflare Pages Functions API Handler for Lipley Public Website /api/products

const INITIAL_PRODUCTS = [
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
        ingredients: ["Almond Oil", "Beetroot Oil", "Jojoba Oil", "Castor Oil", "Beeswax", "Shea Butter", "Cocoa Butter", "Tinte", "Alkanet", "Manjishta", "Coconut Oil", "Rose Oil", "Strawberry Oil", "Avocado Oil"],
        benefits: [
            "Helps deeply moisturize dry lips.",
            "Helps reduce the appearance of lip dryness and flakiness.",
            "Provides a beautiful natural beetroot tinted finish."
        ],
        instructions: "Apply evenly on clean lips whenever needed.",
        netQty: "8g",
        storage: "Store in a cool, dry place.",
        stock: 50,
        active: true,
        featured: true,
        is_new: false,
        bestseller: true,
        status: "published"
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
        ingredients: ["Almond Oil", "Beetroot Oil", "Jojoba Oil", "Castor Oil", "Beeswax", "Shea Butter", "Cocoa Butter", "Alkanet", "Manjishta", "Coconut Oil", "Rose Oil", "Strawberry Oil", "Avocado Oil"],
        benefits: [
            "Helps deeply moisturize dry lips.",
            "Helps reduce the appearance of lip dryness and flakiness.",
            "Pure natural strawberry essence for refreshing lip hydration."
        ],
        instructions: "Apply evenly on clean lips whenever needed.",
        netQty: "8g",
        storage: "Store in a cool, dry place.",
        stock: 50,
        active: true,
        featured: true,
        is_new: true,
        bestseller: false,
        status: "published"
    },

];

export async function onRequest(context) {
    const { request, env } = context;

    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    });

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }

    try {
        let products = INITIAL_PRODUCTS;
        
        if (env && env.PRODUCTS_KV) {
            const stored = await env.PRODUCTS_KV.get('products_db');
            if (stored) {
                products = JSON.parse(stored);
            }
        }

        const activeProducts = products.filter(p => p.active !== false && p.status !== 'disabled' && p.status !== 'draft');

        return new Response(JSON.stringify({
            success: true,
            count: activeProducts.length,
            products: activeProducts
        }), { headers });

    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            error: err.message
        }), { status: 500, headers });
    }
}

// Extended Product Catalog for MidasBeauty Database
// Additional 40+ products to complete the comprehensive catalog

const extendedProductCatalog = [
    // Botanical Luxe - British Heritage
    {
        id: 'bl_rose_cleanser',
        name: 'English Rose Cleansing Balm',
        brand: 'botanical-luxe',
        category: 'skincare',
        subcategory: 'cleansers',
        description: 'Luxurious cleansing balm with English rose petals and botanical oils for gentle makeup removal.',
        price: 68.00,
        salePrice: null,
        stock: 34,
        rating: 4.5,
        reviewCount: 123,
        featured: false,
        images: [
            'images/products/botanical-luxe/rose-cleanser-1.jpg',
            'images/products/botanical-luxe/rose-cleanser-2.jpg'
        ],
        variants: [
            { id: 'size_100ml', name: '100ml', price: 68.00, stock: 34 }
        ],
        keyBenefits: [
            'English rose petals',
            'Gentle makeup removal',
            'Botanical oil blend',
            'Aromatherapy benefits'
        ],
        ingredients: [
            'Rosa Damascena Flower', 'Sweet Almond Oil', 'Jojoba Oil', 
            'Shea Butter', 'Vitamin E', 'Lavender Essential Oil'
        ],
        usage: 'Massage onto dry skin, add water to emulsify, rinse thoroughly.',
        skinType: ['dry', 'mature', 'sensitive'],
        concerns: ['cleansing', 'nourishment', 'aromatherapy'],
        collection: null,
        newArrival: false,
        bestSeller: false
    },
    {
        id: 'bl_botanical_serum',
        name: 'Botanical Renewal Serum',
        brand: 'botanical-luxe',
        category: 'skincare',
        subcategory: 'serums',
        description: 'Concentrated botanical serum with rare plant extracts for skin renewal and vitality.',
        price: 95.00,
        salePrice: 76.00,
        stock: 28,
        rating: 4.7,
        reviewCount: 89,
        featured: true,
        images: [
            'images/products/botanical-luxe/botanical-serum-1.jpg',
            'images/products/botanical-luxe/botanical-serum-2.jpg'
        ],
        variants: [
            { id: 'size_30ml', name: '30ml', price: 95.00, stock: 28 }
        ],
        keyBenefits: [
            'Rare plant extracts',
            'Skin renewal',
            'Botanical vitality',
            'Anti-aging properties'
        ],
        ingredients: [
            'Bakuchiol', 'Sea Buckthorn', 'Rosehip Oil', 'Peptides', 
            'Botanical Stem Cells', 'Vitamin C Ester'
        ],
        usage: 'Apply 2-3 drops to clean skin evening. Follow with moisturizer.',
        skinType: ['mature', 'all', 'dull'],
        concerns: ['anti-aging', 'renewal', 'natural care'],
        collection: null,
        newArrival: true,
        bestSeller: false
    },

    // Midnight Glamour - Evening Elegance
    {
        id: 'mg_smoky_palette',
        name: 'Midnight Smoky Eye Palette',
        brand: 'midnight-glamour',
        category: 'makeup',
        subcategory: 'eyes',
        description: 'Sultry eyeshadow palette with deep, smoky shades for dramatic evening looks.',
        price: 89.00,
        salePrice: null,
        stock: 56,
        rating: 4.8,
        reviewCount: 267,
        featured: true,
        images: [
            'images/products/midnight-glamour/smoky-palette-1.jpg',
            'images/products/midnight-glamour/smoky-palette-2.jpg'
        ],
        variants: [
            { id: 'palette_midnight', name: 'Midnight Smoky', price: 89.00, stock: 56 }
        ],
        keyBenefits: [
            'Deep smoky shades',
            'Evening glamour',
            'Highly pigmented',
            'Long-lasting wear'
        ],
        ingredients: [
            'Mica', 'Talc', 'Magnesium Stearate', 'Dimethicone', 
            'Iron Oxides', 'Ultramarines', 'Carmine'
        ],
        usage: 'Apply with eyeshadow brush, blend for seamless smoky effect.',
        skinType: ['all'],
        concerns: ['dramatic looks', 'evening wear', 'pigmentation'],
        collection: 'midnight-mystery',
        newArrival: false,
        bestSeller: true
    },
    {
        id: 'mg_liquid_liner',
        name: 'Precision Liquid Eyeliner',
        brand: 'midnight-glamour',
        category: 'makeup',
        subcategory: 'eyes',
        description: 'Ultra-precise liquid eyeliner with intense black pigment for dramatic eye definition.',
        price: 45.00,
        salePrice: null,
        stock: 78,
        rating: 4.6,
        reviewCount: 198,
        featured: false,
        images: [
            'images/products/midnight-glamour/liquid-liner-1.jpg',
            'images/products/midnight-glamour/liquid-liner-2.jpg'
        ],
        variants: [
            { id: 'color_black', name: 'Intense Black', price: 45.00, stock: 78 }
        ],
        keyBenefits: [
            'Ultra-precise application',
            'Intense black pigment',
            'Waterproof formula',
            'Fine tip brush'
        ],
        ingredients: [
            'Aqua', 'Acrylates Copolymer', 'Iron Oxides', 'Propylene Glycol', 
            'Phenoxyethanol', 'Caprylyl Glycol'
        ],
        usage: 'Apply close to lash line, create desired wing or line thickness.',
        skinType: ['all'],
        concerns: ['precision', 'definition', 'longevity'],
        collection: 'midnight-mystery',
        newArrival: false,
        bestSeller: false
    },

    // Aurora Beauty - Scandinavian Minimalism
    {
        id: 'ab_nordic_cleanser',
        name: 'Nordic Purity Cleansing Oil',
        brand: 'aurora-beauty',
        category: 'skincare',
        subcategory: 'cleansers',
        description: 'Minimalist cleansing oil with Nordic sea buckthorn and cloudberry for pure, gentle cleansing.',
        price: 52.00,
        salePrice: null,
        stock: 67,
        rating: 4.4,
        reviewCount: 134,
        featured: false,
        images: [
            'images/products/aurora-beauty/nordic-cleanser-1.jpg',
            'images/products/aurora-beauty/nordic-cleanser-2.jpg'
        ],
        variants: [
            { id: 'size_150ml', name: '150ml', price: 52.00, stock: 67 }
        ],
        keyBenefits: [
            'Nordic botanicals',
            'Gentle oil cleansing',
            'Minimalist formula',
            'Pure ingredients'
        ],
        ingredients: [
            'Sunflower Oil', 'Sea Buckthorn Oil', 'Cloudberry Extract', 
            'Jojoba Oil', 'Vitamin E', 'Rosemary Extract'
        ],
        usage: 'Massage onto dry skin, add water to emulsify, rinse clean.',
        skinType: ['all', 'sensitive', 'dry'],
        concerns: ['gentle cleansing', 'nourishment', 'purity'],
        collection: null,
        newArrival: false,
        bestSeller: false
    },
    {
        id: 'ab_minimal_moisturizer',
        name: 'Minimal Hydration Cream',
        brand: 'aurora-beauty',
        category: 'skincare',
        subcategory: 'moisturizers',
        description: 'Clean, minimal moisturizer with Nordic birch water and ceramides for essential hydration.',
        price: 65.00,
        salePrice: null,
        stock: 45,
        rating: 4.5,
        reviewCount: 98,
        featured: false,
        images: [
            'images/products/aurora-beauty/minimal-moisturizer-1.jpg',
            'images/products/aurora-beauty/minimal-moisturizer-2.jpg'
        ],
        variants: [
            { id: 'size_50ml', name: '50ml', price: 65.00, stock: 45 }
        ],
        keyBenefits: [
            'Nordic birch water',
            'Essential hydration',
            'Minimal ingredients',
            'Ceramide complex'
        ],
        ingredients: [
            'Birch Water', 'Glycerin', 'Ceramides', 'Hyaluronic Acid', 
            'Squalane', 'Nordic Berry Extract'
        ],
        usage: 'Apply to clean skin morning and evening.',
        skinType: ['all', 'sensitive', 'normal'],
        concerns: ['hydration', 'simplicity', 'gentle care'],
        collection: null,
        newArrival: true,
        bestSeller: false
    },

    // Royal Heritage - Timeless Luxury
    {
        id: 'rh_caviar_cream',
        name: 'Caviar Regenerating Cream',
        brand: 'royal-heritage',
        category: 'skincare',
        subcategory: 'moisturizers',
        description: 'Ultra-luxurious anti-aging cream with caviar extract and precious peptides for royal skin treatment.',
        price: 195.00,
        salePrice: null,
        stock: 23,
        rating: 4.9,
        reviewCount: 67,
        featured: true,
        images: [
            'images/products/royal-heritage/caviar-cream-1.jpg',
            'images/products/royal-heritage/caviar-cream-2.jpg'
        ],
        variants: [
            { id: 'size_50ml', name: '50ml', price: 195.00, stock: 23 }
        ],
        keyBenefits: [
            'Caviar extract',
            'Precious peptides',
            'Anti-aging luxury',
            'Royal treatment'
        ],
        ingredients: [
            'Caviar Extract', 'Gold Peptides', 'Platinum Particles', 'Retinol', 
            'Hyaluronic Acid', 'Collagen', 'Diamond Powder'
        ],
        usage: 'Apply to clean skin evening. Massage gently until absorbed.',
        skinType: ['mature', 'dry', 'luxury'],
        concerns: ['anti-aging', 'luxury care', 'regeneration'],
        collection: null,
        newArrival: false,
        bestSeller: true
    },
    {
        id: 'rh_gold_serum',
        name: '24K Gold Renewal Serum',
        brand: 'royal-heritage',
        category: 'skincare',
        subcategory: 'serums',
        description: 'Precious 24K gold serum with royal jelly and diamond peptides for ultimate skin luxury.',
        price: 225.00,
        salePrice: null,
        stock: 18,
        rating: 4.8,
        reviewCount: 45,
        featured: true,
        images: [
            'images/products/royal-heritage/gold-serum-1.jpg',
            'images/products/royal-heritage/gold-serum-2.jpg'
        ],
        variants: [
            { id: 'size_30ml', name: '30ml', price: 225.00, stock: 18 }
        ],
        keyBenefits: [
            '24K gold particles',
            'Royal jelly extract',
            'Diamond peptides',
            'Ultimate luxury'
        ],
        ingredients: [
            '24K Gold', 'Royal Jelly', 'Diamond Peptides', 'Platinum Extract', 
            'Caviar Proteins', 'Rare Orchid Extract'
        ],
        usage: 'Apply 2-3 drops to clean skin evening. Follow with moisturizer.',
        skinType: ['mature', 'luxury', 'all'],
        concerns: ['anti-aging', 'luxury treatment', 'radiance'],
        collection: null,
        newArrival: false,
        bestSeller: false
    },

    // Modern Muse - Contemporary Beauty
    {
        id: 'mm_multitask_balm',
        name: 'Multi-Task Beauty Balm',
        brand: 'modern-muse',
        category: 'makeup',
        subcategory: 'face',
        description: 'Versatile tinted balm with SPF 30 for busy women who want effortless beauty.',
        price: 48.00,
        salePrice: null,
        stock: 89,
        rating: 4.3,
        reviewCount: 234,
        featured: false,
        images: [
            'images/products/modern-muse/multitask-balm-1.jpg',
            'images/products/modern-muse/multitask-balm-2.jpg'
        ],
        variants: [
            { id: 'shade_light', name: 'Light', price: 48.00, stock: 32 },
            { id: 'shade_medium', name: 'Medium', price: 48.00, stock: 28 },
            { id: 'shade_deep', name: 'Deep', price: 48.00, stock: 29 }
        ],
        keyBenefits: [
            'Multi-task formula',
            'SPF 30 protection',
            'Tinted coverage',
            'Effortless application'
        ],
        ingredients: [
            'Zinc Oxide', 'Titanium Dioxide', 'Iron Oxides', 'Hyaluronic Acid', 
            'Vitamin E', 'Jojoba Oil'
        ],
        usage: 'Apply as moisturizer, foundation, and sunscreen in one step.',
        skinType: ['all', 'busy lifestyle'],
        concerns: ['convenience', 'sun protection', 'natural coverage'],
        collection: null,
        newArrival: true,
        bestSeller: false
    },
    {
        id: 'mm_lip_cheek_tint',
        name: 'Lip & Cheek Tint Duo',
        brand: 'modern-muse',
        category: 'makeup',
        subcategory: 'lips',
        description: 'Versatile liquid tint for lips and cheeks with buildable, natural-looking color.',
        price: 35.00,
        salePrice: null,
        stock: 76,
        rating: 4.4,
        reviewCount: 189,
        featured: false,
        images: [
            'images/products/modern-muse/lip-cheek-tint-1.jpg',
            'images/products/modern-muse/lip-cheek-tint-2.jpg'
        ],
        variants: [
            { id: 'shade_coral', name: 'Coral Bloom', price: 35.00, stock: 25 },
            { id: 'shade_berry', name: 'Berry Fresh', price: 35.00, stock: 26 },
            { id: 'shade_peach', name: 'Peach Glow', price: 35.00, stock: 25 }
        ],
        keyBenefits: [
            'Dual-purpose formula',
            'Buildable color',
            'Natural finish',
            'Long-lasting wear'
        ],
        ingredients: [
            'Aqua', 'Glycerin', 'Natural Pigments', 'Aloe Vera', 
            'Vitamin E', 'Fruit Extracts'
        ],
        usage: 'Apply to lips and cheeks, blend for natural flush of color.',
        skinType: ['all'],
        concerns: ['versatility', 'natural look', 'convenience'],
        collection: null,
        newArrival: false,
        bestSeller: false
    }
];

// HAIRCARE PRODUCTS

const haircareProducts = [
    // Silk Touch - Japanese Hair Technology
    {
        id: 'st_silk_shampoo',
        name: 'Silk Protein Repair Shampoo',
        brand: 'silk-touch',
        category: 'haircare',
        subcategory: 'shampoo',
        description: 'Luxurious shampoo infused with silk proteins and Japanese camellia oil for damaged hair repair.',
        price: 78.00,
        salePrice: null,
        stock: 45,
        rating: 4.6,
        reviewCount: 156,
        featured: true,
        images: [
            'images/products/silk-touch/silk-shampoo-1.jpg',
            'images/products/silk-touch/silk-shampoo-2.jpg'
        ],
        variants: [
            { id: 'size_250ml', name: '250ml', price: 78.00, stock: 45 }
        ],
        keyBenefits: [
            'Silk protein infusion',
            'Japanese camellia oil',
            'Damage repair',
            'Luxurious texture'
        ],
        ingredients: [
            'Silk Proteins', 'Camellia Oil', 'Keratin', 'Argan Oil', 
            'Vitamin E', 'Rice Bran Extract'
        ],
        usage: 'Apply to wet hair, massage gently, rinse thoroughly.',
        hairType: ['damaged', 'dry', 'chemically treated'],
        concerns: ['repair', 'smoothness', 'shine'],
        collection: null,
        newArrival: false,
        bestSeller: true
    },
    {
        id: 'st_silk_conditioner',
        name: 'Silk Protein Deep Conditioner',
        brand: 'silk-touch',
        category: 'haircare',
        subcategory: 'treatments',
        description: 'Intensive conditioning treatment with silk proteins for ultimate hair smoothness and shine.',
        price: 85.00,
        salePrice: null,
        stock: 38,
        rating: 4.7,
        reviewCount: 134,
        featured: false,
        images: [
            'images/products/silk-touch/silk-conditioner-1.jpg',
            'images/products/silk-touch/silk-conditioner-2.jpg'
        ],
        variants: [
            { id: 'size_200ml', name: '200ml', price: 85.00, stock: 38 }
        ],
        keyBenefits: [
            'Deep conditioning',
            'Silk protein complex',
            'Ultimate smoothness',
            'Intense shine'
        ],
        ingredients: [
            'Hydrolyzed Silk', 'Shea Butter', 'Macadamia Oil', 'Peptides', 
            'Ceramides', 'Japanese Green Tea'
        ],
        usage: 'Apply to clean, damp hair. Leave for 3-5 minutes, rinse thoroughly.',
        hairType: ['damaged', 'frizzy', 'dry'],
        concerns: ['conditioning', 'frizz control', 'shine'],
        collection: null,
        newArrival: false,
        bestSeller: false
    }
];

// FRAGRANCE PRODUCTS

const fragranceProducts = [
    // Desert Bloom - Moroccan Luxury
    {
        id: 'db_argan_perfume',
        name: 'Argan Blossom Eau de Parfum',
        brand: 'desert-bloom',
        category: 'fragrance',
        subcategory: 'perfume',
        description: 'Exotic fragrance with argan blossom, desert rose, and warm amber for mysterious allure.',
        price: 95.00,
        salePrice: null,
        stock: 34,
        rating: 4.5,
        reviewCount: 89,
        featured: true,
        images: [
            'images/products/desert-bloom/argan-perfume-1.jpg',
            'images/products/desert-bloom/argan-perfume-2.jpg'
        ],
        variants: [
            { id: 'size_50ml', name: '50ml', price: 95.00, stock: 34 },
            { id: 'size_100ml', name: '100ml', price: 145.00, stock: 18 }
        ],
        keyBenefits: [
            'Exotic fragrance',
            'Long-lasting scent',
            'Moroccan inspiration',
            'Mysterious allure'
        ],
        ingredients: [
            'Argan Blossom', 'Desert Rose', 'Amber', 'Sandalwood', 
            'Vanilla', 'Bergamot', 'Patchouli'
        ],
        usage: 'Spray on pulse points for lasting fragrance.',
        scentFamily: ['oriental', 'floral', 'woody'],
        occasion: ['evening', 'special occasions'],
        collection: null,
        newArrival: false,
        bestSeller: false
    },
    {
        id: 'db_body_oil',
        name: 'Moroccan Argan Body Oil',
        brand: 'desert-bloom',
        category: 'fragrance',
        subcategory: 'body',
        description: 'Luxurious body oil with pure argan oil and desert botanicals for silky, scented skin.',
        price: 68.00,
        salePrice: 54.40,
        stock: 56,
        rating: 4.6,
        reviewCount: 123,
        featured: false,
        images: [
            'images/products/desert-bloom/body-oil-1.jpg',
            'images/products/desert-bloom/body-oil-2.jpg'
        ],
        variants: [
            { id: 'size_100ml', name: '100ml', price: 68.00, stock: 56 }
        ],
        keyBenefits: [
            'Pure argan oil',
            'Desert botanicals',
            'Silky skin texture',
            'Subtle fragrance'
        ],
        ingredients: [
            'Argan Oil', 'Jojoba Oil', 'Desert Rose Extract', 'Vitamin E', 
            'Prickly Pear Oil', 'Natural Fragrance'
        ],
        usage: 'Apply to damp skin after shower for best absorption.',
        skinType: ['dry', 'normal', 'mature'],
        concerns: ['hydration', 'fragrance', 'luxury care'],
        collection: null,
        newArrival: false,
        bestSeller: false
    }
];

// Export all extended products
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extendedProductCatalog,
        haircareProducts,
        fragranceProducts
    };
}

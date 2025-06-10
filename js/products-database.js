// Enhanced Multi-Brand Beauty Product Database
// Premium beauty products from multiple brands with industry-standard categorization

const MIDAS_BEAUTY_PRODUCTS = {
    // Import brand and category system
    ...BEAUTY_BRANDS_CATEGORIES,

    // Comprehensive product database (50+ products)
    products: [
        // SKINCARE PRODUCTS
        {
            id: 1,
            name: "24K Gold Radiance Serum",
            brand: "midas-beauty",
            brandName: "Midas Beauty",
            category: "skincare",
            subcategory: "serums",
            productType: "Vitamin C Serums",
            price: 89.99,
            salePrice: null,
            currency: "USD",
            description: "Our signature 24K Gold Radiance Serum combines the luxury of pure gold particles with 20% Vitamin C and hyaluronic acid to deliver unparalleled skin transformation. This premium anti-aging serum penetrates deeply to boost collagen production, reduce fine lines, and deliver intense hydration while imparting a luminous, golden glow. Formulated with peptides and botanical extracts, it works overnight to repair and rejuvenate your skin, leaving you with a radiant, youthful complexion that reflects the golden touch of luxury.",
            keyIngredients: ["24K Gold Particles", "20% Vitamin C", "Hyaluronic Acid", "Peptides", "Botanical Extracts"],
            benefits: ["Anti-aging", "Brightening", "Hydrating", "Collagen Boost", "Radiance Enhancement"],
            skinConcerns: ["Anti-aging", "Dark spots", "Fine lines", "Dullness", "Uneven skin tone"],
            specifications: {
                size: "30ml",
                weight: "45g",
                skinTypes: ["all", "dry", "normal", "combination", "mature"],
                texture: "Lightweight serum",
                scent: "Subtle floral",
                timeOfUse: ["morning", "evening"],
                spfLevel: null
            },
            images: {
                main: "images/products/24k-gold-serum.jpg",
                gallery: [
                    "images/products/24k-gold-serum-1.jpg",
                    "images/products/24k-gold-serum-2.jpg",
                    "images/products/24k-gold-serum-lifestyle.jpg"
                ]
            },
            rating: 4.9,
            reviewCount: 247,
            inStock: true,
            stockLevel: 45,
            url: "product-details/24k-gold-radiance-serum.html",
            seoTitle: "24K Gold Radiance Serum - Premium Anti-Aging Skincare | Midas Beauty",
            metaDescription: "Transform your skin with our luxury 24K Gold Radiance Serum. Features 20% Vitamin C, hyaluronic acid, and real gold particles for ultimate anti-aging results.",
            tags: ["gold", "vitamin c", "anti-aging", "serum", "luxury", "radiance", "premium", "collagen"],
            relatedProducts: [2, 3, 15, 22],
            featured: true,
            newArrival: false,
            bestSeller: true,
            exclusive: true,
            awards: ["Best Luxury Serum 2023", "Editor's Choice"],
            priceRange: "luxury"
        },
        {
            id: 2,
            name: "Platinum Hydrating Moisturizer",
            brand: "Midas Beauty",
            category: "skincare",
            subcategory: "moisturizers",
            price: 69.99,
            salePrice: null,
            currency: "USD",
            description: "Experience the ultimate in luxury hydration with our Platinum Hydrating Moisturizer. This rich, velvety cream features a revolutionary blend of ceramides, peptides, and natural oils that lock in moisture for up to 72 hours. Infused with platinum peptides and marine collagen, it strengthens the skin barrier while providing deep, lasting hydration. The lightweight yet nourishing formula absorbs quickly without leaving a greasy residue, making it perfect for both day and night use. Suitable for all skin types, this moisturizer leaves your skin feeling silky smooth, plump, and radiant.",
            keyIngredients: ["Platinum Peptides", "Ceramides", "Marine Collagen", "Hyaluronic Acid", "Jojoba Oil"],
            benefits: ["72-hour hydration", "Barrier repair", "Anti-aging", "Smoothing", "Plumping"],
            specifications: {
                size: "50ml",
                weight: "65g",
                skinTypes: ["all", "dry", "normal", "sensitive", "mature"],
                texture: "Rich cream",
                scent: "Unscented"
            },
            images: {
                main: "images/products/platinum-moisturizer.jpg",
                gallery: [
                    "images/products/platinum-moisturizer-1.jpg",
                    "images/products/platinum-moisturizer-2.jpg",
                    "images/products/platinum-moisturizer-lifestyle.jpg"
                ]
            },
            rating: 4.7,
            reviewCount: 189,
            inStock: true,
            stockLevel: 32,
            url: "product-details/platinum-hydrating-moisturizer.html",
            seoTitle: "Platinum Hydrating Moisturizer - 72-Hour Moisture Lock | Midas Beauty",
            metaDescription: "Luxury moisturizer with platinum peptides and ceramides. Provides 72-hour hydration and anti-aging benefits for all skin types.",
            tags: ["moisturizer", "platinum", "hydrating", "ceramides", "72-hour", "luxury", "anti-aging"],
            relatedProducts: [1, 3, 4, 16],
            featured: true,
            newArrival: false,
            bestSeller: true
        },
        {
            id: 3,
            name: "Diamond Gentle Cleanser",
            brand: "Midas Beauty",
            category: "skincare",
            subcategory: "cleansers",
            price: 45.99,
            salePrice: null,
            currency: "USD",
            description: "Purify and pamper your skin with our Diamond Gentle Cleanser, a sulfate-free formula that effectively removes makeup, dirt, and impurities without disrupting your skin's natural pH balance. Infused with diamond powder and gentle botanical extracts, this luxurious cleanser provides a deep yet gentle cleanse while maintaining your skin's moisture barrier. The creamy texture transforms into a rich lather that rinses clean, leaving your skin feeling soft, smooth, and refreshed. Perfect for daily use on all skin types, including sensitive skin.",
            keyIngredients: ["Diamond Powder", "Coconut-derived Surfactants", "Chamomile Extract", "Aloe Vera", "Glycerin"],
            benefits: ["Gentle cleansing", "Makeup removal", "pH-balanced", "Moisturizing", "Soothing"],
            specifications: {
                size: "150ml",
                weight: "180g",
                skinTypes: ["all", "sensitive", "normal", "combination", "dry"],
                texture: "Creamy cleanser",
                scent: "Light botanical"
            },
            images: {
                main: "images/products/diamond-cleanser.jpg",
                gallery: [
                    "images/products/diamond-cleanser-1.jpg",
                    "images/products/diamond-cleanser-2.jpg",
                    "images/products/diamond-cleanser-lifestyle.jpg"
                ]
            },
            rating: 4.8,
            reviewCount: 156,
            inStock: true,
            stockLevel: 67,
            url: "product-details/diamond-gentle-cleanser.html",
            seoTitle: "Diamond Gentle Cleanser - Sulfate-Free Luxury Cleanser | Midas Beauty",
            metaDescription: "Gentle yet effective cleanser with diamond powder. Removes makeup and impurities while maintaining skin's natural pH balance.",
            tags: ["cleanser", "diamond", "gentle", "sulfate-free", "makeup remover", "ph-balanced", "sensitive skin"],
            relatedProducts: [1, 2, 5, 6],
            featured: false,
            newArrival: false,
            bestSeller: true
        },
        {
            id: 4,
            name: "Rose Gold Vitamin C Serum",
            brand: "Midas Beauty",
            category: "skincare",
            subcategory: "serums",
            price: 75.99,
            salePrice: 65.99,
            currency: "USD",
            description: "Illuminate your complexion with our Rose Gold Vitamin C Serum, a potent antioxidant treatment that brightens, firms, and protects your skin. This stable 15% Vitamin C formula is enhanced with rose gold particles and ferulic acid for maximum efficacy and skin penetration. The lightweight serum absorbs quickly, delivering powerful antioxidants that help reduce dark spots, even skin tone, and boost collagen production. Perfect for morning use under sunscreen, this serum provides long-lasting protection against environmental damage while promoting a radiant, youthful glow.",
            keyIngredients: ["15% Vitamin C", "Rose Gold Particles", "Ferulic Acid", "Vitamin E", "Hyaluronic Acid"],
            benefits: ["Brightening", "Antioxidant protection", "Dark spot reduction", "Collagen boost", "Even skin tone"],
            specifications: {
                size: "30ml",
                weight: "42g",
                skinTypes: ["all", "normal", "combination", "oily", "mature"],
                texture: "Lightweight serum",
                scent: "Subtle rose"
            },
            images: {
                main: "images/products/rose-gold-vitamin-c.jpg",
                gallery: [
                    "images/products/rose-gold-vitamin-c-1.jpg",
                    "images/products/rose-gold-vitamin-c-2.jpg",
                    "images/products/rose-gold-vitamin-c-lifestyle.jpg"
                ]
            },
            rating: 4.6,
            reviewCount: 203,
            inStock: true,
            stockLevel: 28,
            url: "product-details/rose-gold-vitamin-c-serum.html",
            seoTitle: "Rose Gold Vitamin C Serum - Brightening Antioxidant Treatment | Midas Beauty",
            metaDescription: "Powerful 15% Vitamin C serum with rose gold particles. Brightens skin, reduces dark spots, and provides antioxidant protection.",
            tags: ["vitamin c", "rose gold", "brightening", "antioxidant", "dark spots", "serum", "morning routine"],
            relatedProducts: [1, 5, 7, 15],
            featured: false,
            newArrival: true,
            bestSeller: false
        },
        {
            id: 5,
            name: "Luxury Retinol Night Treatment",
            brand: "Midas Beauty",
            category: "skincare",
            subcategory: "serums",
            price: 95.99,
            salePrice: null,
            currency: "USD",
            description: "Transform your skin overnight with our Luxury Retinol Night Treatment, a powerful anti-aging serum that delivers professional-grade results in the comfort of your home. This advanced formula combines 0.5% encapsulated retinol with squalane and peptides to minimize irritation while maximizing efficacy. The time-release technology ensures steady delivery of active ingredients throughout the night, promoting cellular turnover, reducing fine lines, and improving skin texture. Wake up to smoother, firmer, and more radiant skin with continued use.",
            keyIngredients: ["0.5% Encapsulated Retinol", "Squalane", "Peptides", "Niacinamide", "Ceramides"],
            benefits: ["Anti-aging", "Cellular renewal", "Fine line reduction", "Texture improvement", "Firmness"],
            specifications: {
                size: "30ml",
                weight: "45g",
                skinTypes: ["normal", "combination", "oily", "mature"],
                texture: "Silky serum",
                scent: "Unscented"
            },
            images: {
                main: "images/products/luxury-retinol.jpg",
                gallery: [
                    "images/products/luxury-retinol-1.jpg",
                    "images/products/luxury-retinol-2.jpg",
                    "images/products/luxury-retinol-lifestyle.jpg"
                ]
            },
            rating: 4.8,
            reviewCount: 167,
            inStock: true,
            stockLevel: 19,
            url: "product-details/luxury-retinol-night-treatment.html",
            seoTitle: "Luxury Retinol Night Treatment - Professional Anti-Aging Serum | Midas Beauty",
            metaDescription: "Advanced 0.5% retinol night treatment with time-release technology. Reduces fine lines and improves skin texture overnight.",
            tags: ["retinol", "night treatment", "anti-aging", "fine lines", "cellular renewal", "professional grade"],
            relatedProducts: [1, 2, 4, 6],
            featured: true,
            newArrival: false,
            bestSeller: false
        },
        {
            id: 6,
            name: "Hydra-Boost Hyaluronic Toner",
            brand: "Midas Beauty",
            category: "skincare",
            subcategory: "toners",
            price: 52.99,
            salePrice: null,
            currency: "USD",
            description: "Refresh and hydrate your skin with our Hydra-Boost Hyaluronic Toner, a lightweight yet powerful essence that delivers multiple molecular weights of hyaluronic acid for deep, multi-layer hydration. This alcohol-free formula also contains niacinamide and botanical extracts to minimize pores, balance oil production, and prepare your skin for subsequent skincare steps. The gentle, pH-balanced formula is suitable for all skin types and can be used morning and evening for optimal results.",
            keyIngredients: ["Multi-Weight Hyaluronic Acid", "Niacinamide", "Rose Water", "Witch Hazel", "Glycerin"],
            benefits: ["Deep hydration", "Pore minimizing", "Oil balancing", "Skin preparation", "pH balancing"],
            specifications: {
                size: "200ml",
                weight: "220g",
                skinTypes: ["all", "oily", "combination", "normal", "sensitive"],
                texture: "Lightweight essence",
                scent: "Light rose"
            },
            images: {
                main: "images/products/hydra-boost-toner.jpg",
                gallery: [
                    "images/products/hydra-boost-toner-1.jpg",
                    "images/products/hydra-boost-toner-2.jpg",
                    "images/products/hydra-boost-toner-lifestyle.jpg"
                ]
            },
            rating: 4.5,
            reviewCount: 134,
            inStock: true,
            stockLevel: 41,
            url: "product-details/hydra-boost-hyaluronic-toner.html",
            seoTitle: "Hydra-Boost Hyaluronic Toner - Multi-Layer Hydrating Essence | Midas Beauty",
            metaDescription: "Alcohol-free hyaluronic acid toner with niacinamide. Provides deep hydration and pore-minimizing benefits for all skin types.",
            tags: ["toner", "hyaluronic acid", "hydrating", "niacinamide", "pore minimizing", "alcohol-free"],
            relatedProducts: [1, 2, 3, 7],
            featured: false,
            newArrival: false,
            bestSeller: true
        },
        {
            id: 7,
            name: "Radiant Glow Face Mask",
            brand: "Midas Beauty",
            category: "skincare",
            subcategory: "masks",
            price: 38.99,
            salePrice: null,
            currency: "USD",
            description: "Indulge in a spa-like experience with our Radiant Glow Face Mask, a luxurious treatment that combines gold leaf, vitamin C, and botanical extracts to instantly brighten and revitalize your complexion. This creamy mask provides deep hydration while gently exfoliating dead skin cells, revealing smoother, more radiant skin underneath. Perfect for weekly use, this mask leaves your skin with a healthy, luminous glow that lasts for days.",
            keyIngredients: ["Gold Leaf", "Vitamin C", "Papaya Extract", "Honey", "Kaolin Clay"],
            benefits: ["Instant brightening", "Gentle exfoliation", "Deep hydration", "Radiance boost", "Skin renewal"],
            specifications: {
                size: "75ml",
                weight: "95g",
                skinTypes: ["all", "normal", "combination", "dull"],
                texture: "Creamy mask",
                scent: "Honey citrus"
            },
            images: {
                main: "images/products/radiant-glow-mask.jpg",
                gallery: [
                    "images/products/radiant-glow-mask-1.jpg",
                    "images/products/radiant-glow-mask-2.jpg",
                    "images/products/radiant-glow-mask-lifestyle.jpg"
                ]
            },
            rating: 4.7,
            reviewCount: 98,
            inStock: true,
            stockLevel: 55,
            url: "product-details/radiant-glow-face-mask.html",
            seoTitle: "Radiant Glow Face Mask - Gold Leaf Brightening Treatment | Midas Beauty",
            metaDescription: "Luxurious face mask with gold leaf and vitamin C. Instantly brightens and revitalizes skin for a radiant glow.",
            tags: ["face mask", "gold leaf", "brightening", "vitamin c", "weekly treatment", "radiance"],
            relatedProducts: [1, 4, 6, 8],
            featured: false,
            newArrival: true,
            bestSeller: false
        },
        {
            id: 8,
            name: "Mineral Sunscreen SPF 50",
            brand: "Midas Beauty",
            category: "skincare",
            subcategory: "sunscreens",
            price: 42.99,
            salePrice: null,
            currency: "USD",
            description: "Protect your skin with our Mineral Sunscreen SPF 50, a lightweight, non-greasy formula that provides broad-spectrum protection against UVA and UVB rays. This zinc oxide and titanium dioxide-based sunscreen is reef-safe and suitable for sensitive skin. The tinted formula blends seamlessly into all skin tones while providing a subtle, natural finish. Enriched with antioxidants and moisturizing ingredients, it doubles as a primer for makeup application.",
            keyIngredients: ["Zinc Oxide", "Titanium Dioxide", "Iron Oxides", "Vitamin E", "Squalane"],
            benefits: ["Broad-spectrum protection", "Reef-safe", "Sensitive skin friendly", "Makeup primer", "Antioxidant protection"],
            specifications: {
                size: "50ml",
                weight: "65g",
                skinTypes: ["all", "sensitive", "normal", "combination"],
                texture: "Lightweight cream",
                scent: "Unscented"
            },
            images: {
                main: "images/products/mineral-sunscreen.jpg",
                gallery: [
                    "images/products/mineral-sunscreen-1.jpg",
                    "images/products/mineral-sunscreen-2.jpg",
                    "images/products/mineral-sunscreen-lifestyle.jpg"
                ]
            },
            rating: 4.6,
            reviewCount: 176,
            inStock: true,
            stockLevel: 73,
            url: "product-details/mineral-sunscreen-spf50.html",
            seoTitle: "Mineral Sunscreen SPF 50 - Reef-Safe Broad Spectrum Protection | Midas Beauty",
            metaDescription: "Lightweight mineral sunscreen with zinc oxide and titanium dioxide. Reef-safe, tinted formula perfect for sensitive skin.",
            tags: ["sunscreen", "spf 50", "mineral", "reef-safe", "sensitive skin", "tinted", "broad spectrum"],
            relatedProducts: [4, 6, 9, 15],
            featured: false,
            newArrival: false,
            bestSeller: true
        },
        // MAKEUP PRODUCTS
        {
            id: 15,
            name: "Flawless Liquid Foundation",
            brand: "Midas Beauty",
            category: "makeup",
            subcategory: "face",
            price: 58.99,
            salePrice: null,
            currency: "USD",
            description: "Achieve a flawless complexion with our Liquid Foundation, a buildable, medium-to-full coverage formula that adapts to your skin tone and texture. This long-wearing foundation features a revolutionary blend of light-reflecting particles and skin-loving ingredients that provide up to 16 hours of comfortable wear. The breathable formula won't clog pores and includes SPF 15 for daily protection. Available in 20 inclusive shades to match every skin tone perfectly.",
            keyIngredients: ["Light-Reflecting Particles", "Hyaluronic Acid", "SPF 15", "Vitamin E", "Silica"],
            benefits: ["16-hour wear", "Buildable coverage", "SPF protection", "Non-comedogenic", "Skin-loving formula"],
            specifications: {
                size: "30ml",
                weight: "45g",
                shades: ["Fair", "Light", "Light Medium", "Medium", "Medium Deep", "Deep", "Deep Rich"],
                coverage: ["Medium", "Full"],
                finish: ["Natural", "Satin"],
                skinTypes: ["all", "normal", "combination", "oily"]
            },
            images: {
                main: "images/products/flawless-foundation.jpg",
                gallery: [
                    "images/products/flawless-foundation-1.jpg",
                    "images/products/flawless-foundation-shades.jpg",
                    "images/products/flawless-foundation-lifestyle.jpg"
                ]
            },
            rating: 4.5,
            reviewCount: 312,
            inStock: true,
            stockLevel: 89,
            url: "product-details/flawless-liquid-foundation.html",
            seoTitle: "Flawless Liquid Foundation - 16-Hour Buildable Coverage | Midas Beauty",
            metaDescription: "Long-wearing liquid foundation with 16-hour coverage and SPF 15. Available in 20 inclusive shades for every skin tone.",
            tags: ["foundation", "liquid", "buildable", "16-hour wear", "spf", "inclusive shades", "medium coverage"],
            relatedProducts: [16, 17, 18, 8],
            featured: true,
            newArrival: false,
            bestSeller: true
        },
        {
            id: 16,
            name: "Radiant Concealer",
            brand: "Midas Beauty",
            category: "makeup",
            subcategory: "face",
            price: 32.99,
            salePrice: null,
            currency: "USD",
            description: "Perfect your complexion with our Radiant Concealer, a high-coverage, lightweight formula that effortlessly covers dark circles, blemishes, and imperfections. Infused with caffeine and vitamin C, this concealer not only covers but also treats the delicate under-eye area. The creamy, blendable texture provides full coverage without creasing or settling into fine lines. Available in 16 shades with both neutral and corrective undertones.",
            keyIngredients: ["Caffeine", "Vitamin C", "Hyaluronic Acid", "Light-Diffusing Pigments", "Peptides"],
            benefits: ["High coverage", "Anti-aging", "Brightening", "Long-wearing", "Crease-resistant"],
            specifications: {
                size: "6ml",
                weight: "15g",
                shades: ["Fair", "Light", "Medium", "Deep"],
                coverage: ["Full"],
                finish: ["Radiant"],
                skinTypes: ["all", "normal", "dry", "combination"]
            },
            images: {
                main: "images/products/radiant-concealer.jpg",
                gallery: [
                    "images/products/radiant-concealer-1.jpg",
                    "images/products/radiant-concealer-shades.jpg",
                    "images/products/radiant-concealer-lifestyle.jpg"
                ]
            },
            rating: 4.7,
            reviewCount: 198,
            inStock: true,
            stockLevel: 67,
            url: "product-details/radiant-concealer.html",
            seoTitle: "Radiant Concealer - High Coverage Anti-Aging Formula | Midas Beauty",
            metaDescription: "Full coverage concealer with caffeine and vitamin C. Covers imperfections while treating the delicate under-eye area.",
            tags: ["concealer", "high coverage", "caffeine", "vitamin c", "anti-aging", "under-eye", "full coverage"],
            relatedProducts: [15, 17, 19, 2],
            featured: false,
            newArrival: false,
            bestSeller: true
        },
        {
            id: 17,
            name: "Velvet Matte Lipstick",
            brand: "Midas Beauty",
            category: "makeup",
            subcategory: "lips",
            price: 28.99,
            salePrice: null,
            currency: "USD",
            description: "Make a statement with our Velvet Matte Lipstick, a luxurious formula that delivers intense color payoff with a sophisticated matte finish. This long-wearing lipstick glides on smoothly and sets to a comfortable, transfer-resistant finish that lasts up to 8 hours. Enriched with vitamin E and jojoba oil, it keeps lips moisturized and comfortable throughout the day. Available in 12 stunning shades from classic reds to modern nudes.",
            keyIngredients: ["Vitamin E", "Jojoba Oil", "Carnauba Wax", "Intense Pigments", "Silica"],
            benefits: ["8-hour wear", "Transfer-resistant", "Intense color", "Comfortable matte", "Moisturizing"],
            specifications: {
                size: "3.5g",
                weight: "12g",
                shades: ["Ruby Red", "Classic Red", "Berry Crush", "Nude Rose", "Mauve", "Coral"],
                finish: ["Matte"],
                texture: "Velvet",
                skinTypes: ["all"]
            },
            images: {
                main: "images/products/velvet-matte-lipstick.jpg",
                gallery: [
                    "images/products/velvet-matte-lipstick-1.jpg",
                    "images/products/velvet-matte-lipstick-shades.jpg",
                    "images/products/velvet-matte-lipstick-lifestyle.jpg"
                ]
            },
            rating: 4.6,
            reviewCount: 245,
            inStock: true,
            stockLevel: 156,
            url: "product-details/velvet-matte-lipstick.html",
            seoTitle: "Velvet Matte Lipstick - 8-Hour Transfer-Resistant Color | Midas Beauty",
            metaDescription: "Luxurious matte lipstick with 8-hour wear and intense color payoff. Comfortable formula with vitamin E and jojoba oil.",
            tags: ["lipstick", "matte", "8-hour wear", "transfer-resistant", "intense color", "vitamin e", "comfortable"],
            relatedProducts: [18, 19, 20, 16],
            featured: false,
            newArrival: true,
            bestSeller: false
        },
        {
            id: 18,
            name: "Dramatic Volume Mascara",
            brand: "Midas Beauty",
            category: "makeup",
            subcategory: "eyes",
            price: 35.99,
            salePrice: null,
            currency: "USD",
            description: "Create show-stopping lashes with our Dramatic Volume Mascara, featuring an innovative hourglass brush that coats each lash from root to tip for maximum volume and length. The buildable, clump-free formula contains nourishing peptides and vitamin B5 to strengthen and condition lashes while delivering intense black color. Waterproof and smudge-resistant, this mascara provides all-day wear without flaking or fading.",
            keyIngredients: ["Peptides", "Vitamin B5", "Carnauba Wax", "Iron Oxides", "Panthenol"],
            benefits: ["Dramatic volume", "Length enhancement", "Clump-free", "Waterproof", "Lash conditioning"],
            specifications: {
                size: "10ml",
                weight: "25g",
                colors: ["Intense Black", "Brown Black", "Navy"],
                finish: ["Dramatic"],
                formula: ["Waterproof", "Regular"],
                skinTypes: ["all", "sensitive eyes"]
            },
            images: {
                main: "images/products/dramatic-volume-mascara.jpg",
                gallery: [
                    "images/products/dramatic-volume-mascara-1.jpg",
                    "images/products/dramatic-volume-mascara-brush.jpg",
                    "images/products/dramatic-volume-mascara-lifestyle.jpg"
                ]
            },
            rating: 4.8,
            reviewCount: 387,
            inStock: true,
            stockLevel: 234,
            url: "product-details/dramatic-volume-mascara.html",
            seoTitle: "Dramatic Volume Mascara - Waterproof Lash Enhancement | Midas Beauty",
            metaDescription: "Buildable volume mascara with hourglass brush and lash-conditioning peptides. Waterproof, clump-free formula for dramatic lashes.",
            tags: ["mascara", "volume", "waterproof", "peptides", "hourglass brush", "dramatic", "clump-free"],
            relatedProducts: [19, 20, 21, 17],
            featured: true,
            newArrival: false,
            bestSeller: true
        },
        // HAIRCARE PRODUCTS
        {
            id: 30,
            name: "Keratin Repair Shampoo",
            brand: "Midas Beauty",
            category: "haircare",
            subcategory: "shampoo",
            price: 42.99,
            salePrice: null,
            currency: "USD",
            description: "Restore damaged hair with our Keratin Repair Shampoo, a professional-grade formula that gently cleanses while rebuilding hair's internal structure. Infused with hydrolyzed keratin, argan oil, and our exclusive bond-building complex, this sulfate-free shampoo repairs damage from heat styling, chemical treatments, and environmental stressors. Suitable for all hair types, especially damaged, chemically-treated, or color-treated hair.",
            keyIngredients: ["Hydrolyzed Keratin", "Argan Oil", "Bond-Building Complex", "Amino Acids", "Vitamin E"],
            benefits: ["Damage repair", "Strength building", "Color protection", "Gentle cleansing", "Heat protection"],
            specifications: {
                size: "250ml",
                weight: "280g",
                hairTypes: ["damaged", "chemically-treated", "color-treated", "all"],
                formula: ["Sulfate-free"],
                scent: "Argan & vanilla"
            },
            images: {
                main: "images/products/keratin-repair-shampoo.jpg",
                gallery: [
                    "images/products/keratin-repair-shampoo-1.jpg",
                    "images/products/keratin-repair-shampoo-2.jpg",
                    "images/products/keratin-repair-shampoo-lifestyle.jpg"
                ]
            },
            rating: 4.4,
            reviewCount: 156,
            inStock: false,
            stockLevel: 0,
            url: "product-details/keratin-repair-shampoo.html",
            seoTitle: "Keratin Repair Shampoo - Professional Damage Repair | Midas Beauty",
            metaDescription: "Sulfate-free shampoo with keratin and argan oil. Repairs damaged hair and protects color-treated hair.",
            tags: ["shampoo", "keratin", "repair", "sulfate-free", "damaged hair", "color protection", "professional"],
            relatedProducts: [31, 32, 33, 2],
            featured: false,
            newArrival: false,
            bestSeller: true
        },
        {
            id: 31,
            name: "Intensive Hydrating Conditioner",
            brand: "Midas Beauty",
            category: "haircare",
            subcategory: "conditioner",
            price: 38.99,
            salePrice: null,
            currency: "USD",
            description: "Transform dry, damaged hair with our Intensive Hydrating Conditioner, a rich treatment that combines shea butter, coconut oil, and silk proteins to deeply nourish and repair. This luxurious conditioner penetrates the hair shaft to restore moisture, improve elasticity, and add brilliant shine. The lightweight formula won't weigh hair down while providing intense hydration that lasts for days.",
            keyIngredients: ["Shea Butter", "Coconut Oil", "Silk Proteins", "Ceramides", "Panthenol"],
            benefits: ["Deep hydration", "Damage repair", "Shine enhancement", "Elasticity improvement", "Lightweight"],
            specifications: {
                size: "250ml",
                weight: "280g",
                hairTypes: ["dry", "damaged", "normal", "chemically-treated"],
                formula: ["Intensive"],
                scent: "Coconut & vanilla"
            },
            images: {
                main: "images/products/intensive-hydrating-conditioner.jpg",
                gallery: [
                    "images/products/intensive-hydrating-conditioner-1.jpg",
                    "images/products/intensive-hydrating-conditioner-2.jpg",
                    "images/products/intensive-hydrating-conditioner-lifestyle.jpg"
                ]
            },
            rating: 4.6,
            reviewCount: 142,
            inStock: true,
            stockLevel: 78,
            url: "product-details/intensive-hydrating-conditioner.html",
            seoTitle: "Intensive Hydrating Conditioner - Deep Moisture Repair | Midas Beauty",
            metaDescription: "Rich conditioner with shea butter and silk proteins. Provides deep hydration and repair for dry, damaged hair.",
            tags: ["conditioner", "hydrating", "shea butter", "silk proteins", "dry hair", "damaged hair", "intensive"],
            relatedProducts: [30, 32, 34, 6],
            featured: false,
            newArrival: false,
            bestSeller: true
        },
        // LUMINA GLOW PRODUCTS
        {
            id: 50,
            name: "Illuminating Primer",
            brand: "lumina-glow",
            brandName: "Lumina Glow",
            category: "makeup",
            subcategory: "face",
            productType: "Primers",
            price: 42.99,
            salePrice: 35.99,
            currency: "USD",
            description: "Create the perfect luminous base with our Illuminating Primer. This light-reflecting formula smooths skin texture while adding a subtle glow that makes your complexion look naturally radiant. Infused with pearl powder and light-diffusing particles, it creates the ideal canvas for makeup application while providing all-day hydration and a beautiful, lit-from-within glow.",
            keyIngredients: ["Pearl Powder", "Light-Diffusing Particles", "Hyaluronic Acid", "Vitamin E", "Mica"],
            benefits: ["Illuminating", "Smoothing", "Hydrating", "Makeup base", "Long-wearing"],
            skinConcerns: ["Dullness", "Uneven skin tone", "Dry skin", "Makeup longevity"],
            specifications: {
                size: "30ml",
                weight: "40g",
                skinTypes: ["all", "dry", "normal", "combination"],
                finish: "Luminous",
                coverage: "Light",
                spfLevel: null
            },
            images: {
                main: "images/products/lumina-illuminating-primer.jpg",
                gallery: [
                    "images/products/lumina-illuminating-primer-1.jpg",
                    "images/products/lumina-illuminating-primer-2.jpg",
                    "images/products/lumina-illuminating-primer-lifestyle.jpg"
                ]
            },
            rating: 4.6,
            reviewCount: 189,
            inStock: true,
            stockLevel: 67,
            url: "product-details/lumina-illuminating-primer.html",
            seoTitle: "Illuminating Primer - Light-Reflecting Makeup Base | Lumina Glow",
            metaDescription: "Create a luminous base with our illuminating primer featuring pearl powder and light-diffusing particles for a natural glow.",
            tags: ["primer", "illuminating", "glow", "pearl powder", "makeup base", "luminous", "hydrating"],
            relatedProducts: [51, 52, 15, 16],
            featured: true,
            newArrival: true,
            bestSeller: false,
            exclusive: false,
            priceRange: "mid-to-high"
        },
        // BOTANICA PURE PRODUCTS
        {
            id: 60,
            name: "Organic Rose Cleanser",
            brand: "botanica-pure",
            brandName: "Botanica Pure",
            category: "skincare",
            subcategory: "cleansers",
            productType: "Cream Cleansers",
            price: 28.99,
            salePrice: null,
            currency: "USD",
            description: "Gently cleanse and nourish your skin with our Organic Rose Cleanser, crafted with certified organic rose petals and natural botanical extracts. This sulfate-free, pH-balanced formula removes makeup and impurities while maintaining your skin's natural moisture barrier. Perfect for sensitive skin, it leaves your complexion feeling soft, clean, and delicately scented with the natural fragrance of roses.",
            keyIngredients: ["Organic Rose Petals", "Chamomile Extract", "Aloe Vera", "Coconut Oil", "Glycerin"],
            benefits: ["Gentle cleansing", "Soothing", "Hydrating", "Natural fragrance", "Sensitive skin friendly"],
            skinConcerns: ["Sensitive skin", "Dry skin", "Redness", "Irritation"],
            specifications: {
                size: "150ml",
                weight: "180g",
                skinTypes: ["sensitive", "dry", "normal", "all"],
                texture: "Cream",
                scent: "Natural rose",
                organic: true,
                vegan: true,
                crueltyfree: true
            },
            images: {
                main: "images/products/botanica-rose-cleanser.jpg",
                gallery: [
                    "images/products/botanica-rose-cleanser-1.jpg",
                    "images/products/botanica-rose-cleanser-2.jpg",
                    "images/products/botanica-rose-cleanser-lifestyle.jpg"
                ]
            },
            rating: 4.7,
            reviewCount: 156,
            inStock: true,
            stockLevel: 89,
            url: "product-details/botanica-organic-rose-cleanser.html",
            seoTitle: "Organic Rose Cleanser - Gentle Natural Cleanser | Botanica Pure",
            metaDescription: "Gentle organic rose cleanser with natural botanicals. Perfect for sensitive skin, sulfate-free and pH-balanced formula.",
            tags: ["organic", "rose", "cleanser", "natural", "sensitive skin", "sulfate-free", "vegan", "gentle"],
            relatedProducts: [61, 62, 3, 6],
            featured: false,
            newArrival: false,
            bestSeller: true,
            exclusive: false,
            certifications: ["Organic", "Vegan", "Cruelty-Free"],
            priceRange: "mid-range"
        },
        // VELVET LUXE PRODUCTS
        {
            id: 70,
            name: "Velvet Matte Foundation",
            brand: "velvet-luxe",
            brandName: "Velvet Luxe",
            category: "makeup",
            subcategory: "face",
            productType: "Liquid Foundations",
            price: 68.99,
            salePrice: null,
            currency: "USD",
            description: "Experience luxury with our Velvet Matte Foundation, a full-coverage formula that delivers a sophisticated matte finish with a velvety-smooth texture. This long-wearing foundation provides up to 16 hours of flawless coverage while feeling weightless on the skin. Infused with silk proteins and advanced polymers, it creates a perfect, airbrushed finish that photographs beautifully and resists transfer.",
            keyIngredients: ["Silk Proteins", "Long-wear Polymers", "Velvet Powder", "Vitamin E", "Antioxidants"],
            benefits: ["Full coverage", "16-hour wear", "Matte finish", "Transfer-resistant", "Weightless feel"],
            skinConcerns: ["Uneven skin tone", "Oily skin", "Large pores", "Long-wear needs"],
            specifications: {
                size: "30ml",
                weight: "45g",
                skinTypes: ["normal", "oily", "combination"],
                coverage: "Full",
                finish: "Matte",
                shadeRange: 20,
                spfLevel: null
            },
            images: {
                main: "images/products/velvet-matte-foundation.jpg",
                gallery: [
                    "images/products/velvet-matte-foundation-1.jpg",
                    "images/products/velvet-matte-foundation-shades.jpg",
                    "images/products/velvet-matte-foundation-lifestyle.jpg"
                ]
            },
            rating: 4.8,
            reviewCount: 298,
            inStock: true,
            stockLevel: 124,
            url: "product-details/velvet-matte-foundation.html",
            seoTitle: "Velvet Matte Foundation - 16-Hour Full Coverage | Velvet Luxe",
            metaDescription: "Luxury matte foundation with silk proteins. Full coverage, 16-hour wear, and weightless feel in 20 inclusive shades.",
            tags: ["foundation", "matte", "full coverage", "16-hour wear", "silk proteins", "luxury", "transfer-resistant"],
            relatedProducts: [71, 72, 15, 16],
            featured: true,
            newArrival: false,
            bestSeller: true,
            exclusive: true,
            awards: ["Best Luxury Foundation 2023"],
            priceRange: "luxury"
        },
        // AQUA ESSENCE PRODUCTS
        {
            id: 80,
            name: "Marine Hydra Boost Serum",
            brand: "aqua-essence",
            brandName: "Aqua Essence",
            category: "skincare",
            subcategory: "serums",
            productType: "Hyaluronic Acid Serums",
            price: 45.99,
            salePrice: null,
            currency: "USD",
            description: "Dive deep into hydration with our Marine Hydra Boost Serum, featuring marine collagen and three molecular weights of hyaluronic acid. This lightweight, fast-absorbing serum delivers intense moisture to all layers of the skin, plumping fine lines and creating a dewy, healthy complexion. Enriched with seaweed extracts and aqua ceramides, it strengthens the skin barrier while providing long-lasting hydration.",
            keyIngredients: ["Marine Collagen", "Triple Hyaluronic Acid", "Seaweed Extracts", "Aqua Ceramides", "Blue Algae"],
            benefits: ["Deep hydration", "Plumping", "Barrier repair", "Dewy finish", "Fine line reduction"],
            skinConcerns: ["Dehydration", "Fine lines", "Dullness", "Dry skin", "Sensitive skin"],
            specifications: {
                size: "30ml",
                weight: "42g",
                skinTypes: ["all", "dry", "sensitive", "normal", "combination"],
                texture: "Lightweight serum",
                scent: "Ocean breeze",
                timeOfUse: ["morning", "evening"]
            },
            images: {
                main: "images/products/aqua-marine-serum.jpg",
                gallery: [
                    "images/products/aqua-marine-serum-1.jpg",
                    "images/products/aqua-marine-serum-2.jpg",
                    "images/products/aqua-marine-serum-lifestyle.jpg"
                ]
            },
            rating: 4.5,
            reviewCount: 167,
            inStock: true,
            stockLevel: 78,
            url: "product-details/aqua-marine-hydra-boost-serum.html",
            seoTitle: "Marine Hydra Boost Serum - Triple Hyaluronic Acid | Aqua Essence",
            metaDescription: "Deep hydration serum with marine collagen and triple hyaluronic acid. Plumps skin and reduces fine lines for a dewy complexion.",
            tags: ["marine collagen", "hyaluronic acid", "hydrating", "serum", "plumping", "dewy", "barrier repair"],
            relatedProducts: [81, 82, 1, 2],
            featured: false,
            newArrival: true,
            bestSeller: false,
            exclusive: false,
            priceRange: "mid-range"
        }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MIDAS_BEAUTY_PRODUCTS;
} else if (typeof window !== 'undefined') {
    window.MIDAS_BEAUTY_PRODUCTS = MIDAS_BEAUTY_PRODUCTS;
}

// MidasBeauty Comprehensive Product Database
// Premium beauty products across multiple luxury brands

class MidasBeautyProductDatabase {
    constructor() {
        this.brands = this.initializeBrands();
        this.products = this.initializeProducts();
        this.categories = this.initializeCategories();
        this.collections = this.initializeCollections();
        
        // Initialize database
        this.init();
    }

    init() {
        // Store in localStorage for persistence
        this.saveToStorage();
        
        // Initialize search index
        this.buildSearchIndex();
        
        console.log('MidasBeauty Product Database initialized');
        console.log(`${this.products.length} products across ${this.brands.length} brands`);
    }

    initializeBrands() {
        return [
            {
                id: 'luxe-radiance',
                name: 'Luxe Radiance',
                description: 'Swiss-inspired luxury skincare combining cutting-edge science with natural alpine botanicals.',
                heritage: 'Founded in 1987 in the Swiss Alps, Luxe Radiance has been pioneering luxury skincare with innovative formulations.',
                priceRange: 'luxury', // $80-$200+
                specialties: ['anti-aging', 'hydration', 'brightening'],
                logo: 'images/brands/luxe-radiance-logo.jpg',
                founded: 1987,
                country: 'Switzerland'
            },
            {
                id: 'golden-glow',
                name: 'Golden Glow',
                description: 'Parisian makeup artistry meets modern glamour with 24k gold-infused formulations.',
                heritage: 'Created by renowned Parisian makeup artists, Golden Glow brings runway sophistication to everyday beauty.',
                priceRange: 'premium', // $45-$120
                specialties: ['color cosmetics', 'luxury makeup', 'professional artistry'],
                logo: 'images/brands/golden-glow-logo.jpg',
                founded: 1995,
                country: 'France'
            },
            {
                id: 'pure-essence',
                name: 'Pure Essence',
                description: 'Clean beauty revolution with organic, sustainably-sourced ingredients and minimalist luxury.',
                heritage: 'Born from a commitment to clean beauty, Pure Essence creates effective formulations without compromise.',
                priceRange: 'accessible-luxury', // $25-$85
                specialties: ['clean beauty', 'organic', 'sustainable'],
                logo: 'images/brands/pure-essence-logo.jpg',
                founded: 2010,
                country: 'USA'
            },
            {
                id: 'velvet-noir',
                name: 'Velvet Noir',
                description: 'Italian luxury meets bold sophistication in dramatic, high-performance color cosmetics.',
                heritage: 'Inspired by Italian fashion houses, Velvet Noir creates makeup for the confident, modern woman.',
                priceRange: 'luxury', // $60-$150
                specialties: ['bold colors', 'long-wear', 'luxury packaging'],
                logo: 'images/brands/velvet-noir-logo.jpg',
                founded: 1992,
                country: 'Italy'
            },
            {
                id: 'crystal-beauty',
                name: 'Crystal Beauty',
                description: 'Korean beauty innovation with crystal-infused skincare for luminous, glass-like skin.',
                heritage: 'Pioneering K-beauty brand combining traditional Korean beauty secrets with modern crystal therapy.',
                priceRange: 'premium', // $35-$95
                specialties: ['K-beauty', 'crystal therapy', 'glass skin'],
                logo: 'images/brands/crystal-beauty-logo.jpg',
                founded: 2008,
                country: 'South Korea'
            },
            {
                id: 'botanical-luxe',
                name: 'Botanical Luxe',
                description: 'British heritage meets botanical science in luxurious, garden-inspired beauty products.',
                heritage: 'Rooted in English garden traditions, Botanical Luxe creates products inspired by nature\'s finest botanicals.',
                priceRange: 'premium', // $40-$110
                specialties: ['botanical ingredients', 'aromatherapy', 'natural luxury'],
                logo: 'images/brands/botanical-luxe-logo.jpg',
                founded: 1985,
                country: 'United Kingdom'
            },
            {
                id: 'midnight-glamour',
                name: 'Midnight Glamour',
                description: 'After-dark beauty with sultry, sophisticated formulations for evening elegance.',
                heritage: 'Created for the woman who owns the night, Midnight Glamour specializes in dramatic, long-lasting beauty.',
                priceRange: 'luxury', // $70-$180
                specialties: ['evening wear', 'long-lasting', 'dramatic effects'],
                logo: 'images/brands/midnight-glamour-logo.jpg',
                founded: 1998,
                country: 'USA'
            },
            {
                id: 'aurora-beauty',
                name: 'Aurora Beauty',
                description: 'Scandinavian minimalism meets Nordic beauty traditions in pure, effective formulations.',
                heritage: 'Inspired by the Northern Lights, Aurora Beauty creates clean, effective products with Nordic purity.',
                priceRange: 'accessible-luxury', // $30-$90
                specialties: ['minimalist beauty', 'Nordic ingredients', 'clean formulations'],
                logo: 'images/brands/aurora-beauty-logo.jpg',
                founded: 2012,
                country: 'Sweden'
            },
            {
                id: 'royal-heritage',
                name: 'Royal Heritage',
                description: 'Timeless elegance inspired by royal beauty traditions and precious ingredients.',
                heritage: 'Crafted with ingredients once reserved for royalty, Royal Heritage continues centuries of beauty excellence.',
                priceRange: 'luxury', // $90-$250
                specialties: ['precious ingredients', 'anti-aging', 'luxury heritage'],
                logo: 'images/brands/royal-heritage-logo.jpg',
                founded: 1923,
                country: 'France'
            },
            {
                id: 'modern-muse',
                name: 'Modern Muse',
                description: 'Contemporary beauty for the modern woman with innovative textures and versatile formulations.',
                heritage: 'Born from the needs of busy, modern women, Modern Muse creates multitasking beauty solutions.',
                priceRange: 'premium', // $35-$100
                specialties: ['multitasking products', 'modern formulations', 'versatility'],
                logo: 'images/brands/modern-muse-logo.jpg',
                founded: 2015,
                country: 'USA'
            },
            {
                id: 'silk-touch',
                name: 'Silk Touch',
                description: 'Japanese beauty philosophy meets silk protein technology for ultimate skin refinement.',
                heritage: 'Rooted in Japanese beauty traditions, Silk Touch incorporates silk proteins for unparalleled skin texture.',
                priceRange: 'luxury', // $85-$200
                specialties: ['silk proteins', 'skin refinement', 'Japanese beauty'],
                logo: 'images/brands/silk-touch-logo.jpg',
                founded: 1990,
                country: 'Japan'
            },
            {
                id: 'desert-bloom',
                name: 'Desert Bloom',
                description: 'Moroccan beauty secrets with argan oil and desert botanicals for radiant, nourished skin.',
                heritage: 'Inspired by Moroccan beauty rituals, Desert Bloom harnesses the power of desert botanicals.',
                priceRange: 'accessible-luxury', // $28-$80
                specialties: ['argan oil', 'desert botanicals', 'nourishing formulas'],
                logo: 'images/brands/desert-bloom-logo.jpg',
                founded: 2009,
                country: 'Morocco'
            },
            {
                id: 'platinum-elite',
                name: 'Platinum Elite',
                description: 'Ultra-luxury beauty with platinum-infused formulations for the most discerning clientele.',
                heritage: 'The pinnacle of luxury beauty, Platinum Elite creates exclusive formulations with precious metals.',
                priceRange: 'ultra-luxury', // $150-$400
                specialties: ['platinum infusion', 'ultra-luxury', 'exclusive formulations'],
                logo: 'images/brands/platinum-elite-logo.jpg',
                founded: 2001,
                country: 'Switzerland'
            },
            {
                id: 'ocean-breeze',
                name: 'Ocean Breeze',
                description: 'Marine-inspired beauty with sea minerals and algae extracts for refreshing, revitalizing care.',
                heritage: 'Harnessing the power of the ocean, Ocean Breeze creates refreshing formulations with marine ingredients.',
                priceRange: 'premium', // $38-$95
                specialties: ['marine ingredients', 'refreshing formulas', 'revitalizing care'],
                logo: 'images/brands/ocean-breeze-logo.jpg',
                founded: 2007,
                country: 'Australia'
            },
            {
                id: 'rose-garden',
                name: 'Rose Garden',
                description: 'Bulgarian rose heritage meets modern luxury in exquisite, rose-infused beauty products.',
                heritage: 'Celebrating the finest Bulgarian roses, Rose Garden creates luxurious products with precious rose essences.',
                priceRange: 'luxury', // $75-$180
                specialties: ['Bulgarian rose', 'luxury florals', 'precious essences'],
                logo: 'images/brands/rose-garden-logo.jpg',
                founded: 1988,
                country: 'Bulgaria'
            }
        ];
    }

    initializeCategories() {
        return {
            skincare: {
                id: 'skincare',
                name: 'Skincare',
                description: 'Luxury skincare for radiant, healthy skin',
                subcategories: {
                    cleansers: { name: 'Cleansers & Toners', icon: 'fa-soap' },
                    serums: { name: 'Serums & Treatments', icon: 'fa-tint' },
                    moisturizers: { name: 'Moisturizers', icon: 'fa-heart' },
                    suncare: { name: 'Sun Protection', icon: 'fa-sun' },
                    masks: { name: 'Masks & Exfoliants', icon: 'fa-leaf' }
                }
            },
            makeup: {
                id: 'makeup',
                name: 'Makeup',
                description: 'Professional makeup for every occasion',
                subcategories: {
                    face: { name: 'Face Makeup', icon: 'fa-circle' },
                    eyes: { name: 'Eye Makeup', icon: 'fa-eye' },
                    lips: { name: 'Lip Products', icon: 'fa-kiss' },
                    cheeks: { name: 'Blush & Bronzer', icon: 'fa-star' }
                }
            },
            haircare: {
                id: 'haircare',
                name: 'Haircare',
                description: 'Luxury hair treatments and styling',
                subcategories: {
                    shampoo: { name: 'Shampoo & Conditioner', icon: 'fa-cut' },
                    treatments: { name: 'Hair Treatments', icon: 'fa-magic' },
                    styling: { name: 'Styling Products', icon: 'fa-wind' }
                }
            },
            fragrance: {
                id: 'fragrance',
                name: 'Fragrance',
                description: 'Exquisite fragrances and scented products',
                subcategories: {
                    perfume: { name: 'Perfumes', icon: 'fa-spray-can' },
                    body: { name: 'Body Care', icon: 'fa-heart' },
                    sets: { name: 'Gift Sets', icon: 'fa-gift' }
                }
            }
        };
    }

    initializeCollections() {
        return [
            {
                id: 'golden-hour',
                name: 'Golden Hour Collection',
                description: 'Warm, luminous products inspired by the magic of golden hour',
                brand: 'golden-glow',
                products: [], // Will be populated with product IDs
                featured: true,
                season: 'all'
            },
            {
                id: 'midnight-mystery',
                name: 'Midnight Mystery',
                description: 'Sultry, dramatic products for evening glamour',
                brand: 'midnight-glamour',
                products: [],
                featured: true,
                season: 'fall'
            },
            {
                id: 'crystal-clarity',
                name: 'Crystal Clarity',
                description: 'Glass-skin perfection with crystal-infused formulations',
                brand: 'crystal-beauty',
                products: [],
                featured: false,
                season: 'spring'
            }
        ];
    }

    initializeProducts() {
        return [
            // SKINCARE PRODUCTS

            // Luxe Radiance - Premium Swiss Skincare
            {
                id: 'lr_alpine_cleanser',
                name: 'Alpine Botanical Gentle Cleanser',
                brand: 'luxe-radiance',
                category: 'skincare',
                subcategory: 'cleansers',
                description: 'A luxurious gel cleanser infused with Swiss alpine botanicals that gently removes impurities while maintaining skin\'s natural moisture barrier.',
                price: 89.00,
                salePrice: null,
                stock: 45,
                rating: 4.7,
                reviewCount: 234,
                featured: true,
                images: [
                    'images/products/luxe-radiance/alpine-cleanser-1.jpg',
                    'images/products/luxe-radiance/alpine-cleanser-2.jpg'
                ],
                variants: [
                    { id: 'size_150ml', name: '150ml', price: 89.00, stock: 45 },
                    { id: 'size_250ml', name: '250ml', price: 129.00, stock: 28 }
                ],
                keyBenefits: [
                    'Gentle yet effective cleansing',
                    'Maintains moisture barrier',
                    'Swiss alpine botanicals',
                    'Suitable for all skin types'
                ],
                ingredients: [
                    'Aqua', 'Glycerin', 'Edelweiss Extract', 'Alpine Rose Extract',
                    'Sodium Cocoyl Glutamate', 'Panthenol', 'Allantoin'
                ],
                usage: 'Apply to damp skin, massage gently, rinse with lukewarm water. Use morning and evening.',
                skinType: ['all', 'sensitive', 'dry'],
                concerns: ['cleansing', 'hydration', 'sensitivity'],
                collection: null,
                newArrival: false,
                bestSeller: true
            },
            {
                id: 'lr_vitamin_c_serum',
                name: 'Vitamin C Brightening Serum',
                brand: 'luxe-radiance',
                category: 'skincare',
                subcategory: 'serums',
                description: 'A potent vitamin C serum with 20% L-Ascorbic Acid and Swiss glacier water for radiant, even-toned skin.',
                price: 145.00,
                salePrice: 116.00,
                stock: 32,
                rating: 4.8,
                reviewCount: 189,
                featured: true,
                images: [
                    'images/products/luxe-radiance/vitamin-c-serum-1.jpg',
                    'images/products/luxe-radiance/vitamin-c-serum-2.jpg'
                ],
                variants: [
                    { id: 'size_30ml', name: '30ml', price: 145.00, stock: 32 }
                ],
                keyBenefits: [
                    '20% L-Ascorbic Acid',
                    'Brightens and evens skin tone',
                    'Antioxidant protection',
                    'Swiss glacier water base'
                ],
                ingredients: [
                    'Aqua (Swiss Glacier Water)', 'L-Ascorbic Acid', 'Hyaluronic Acid',
                    'Vitamin E', 'Ferulic Acid', 'Zinc Gluconate'
                ],
                usage: 'Apply 2-3 drops to clean skin in the morning. Follow with moisturizer and SPF.',
                skinType: ['all', 'dull', 'mature'],
                concerns: ['brightening', 'anti-aging', 'dark spots'],
                collection: null,
                newArrival: false,
                bestSeller: true
            },
            {
                id: 'lr_hydra_moisturizer',
                name: 'Hydra-Luxe Intensive Moisturizer',
                brand: 'luxe-radiance',
                category: 'skincare',
                subcategory: 'moisturizers',
                description: 'Rich, nourishing moisturizer with hyaluronic acid and alpine plant extracts for deep, lasting hydration.',
                price: 125.00,
                salePrice: null,
                stock: 67,
                rating: 4.6,
                reviewCount: 156,
                featured: false,
                images: [
                    'images/products/luxe-radiance/hydra-moisturizer-1.jpg',
                    'images/products/luxe-radiance/hydra-moisturizer-2.jpg'
                ],
                variants: [
                    { id: 'size_50ml', name: '50ml', price: 125.00, stock: 67 }
                ],
                keyBenefits: [
                    'Deep, lasting hydration',
                    'Hyaluronic acid complex',
                    'Alpine plant extracts',
                    'Luxurious texture'
                ],
                ingredients: [
                    'Aqua', 'Hyaluronic Acid', 'Shea Butter', 'Squalane',
                    'Alpine Rose Extract', 'Ceramides', 'Peptides'
                ],
                usage: 'Apply to clean skin morning and evening. Massage gently until absorbed.',
                skinType: ['dry', 'mature', 'normal'],
                concerns: ['hydration', 'anti-aging', 'comfort'],
                collection: null,
                newArrival: false,
                bestSeller: false
            },

            // Golden Glow - Parisian Makeup Artistry
            {
                id: 'gg_24k_foundation',
                name: '24K Gold Infused Foundation',
                brand: 'golden-glow',
                category: 'makeup',
                subcategory: 'face',
                description: 'Luxurious liquid foundation infused with 24K gold particles for a radiant, flawless complexion with medium to full coverage.',
                price: 78.00,
                salePrice: null,
                stock: 89,
                rating: 4.5,
                reviewCount: 312,
                featured: true,
                images: [
                    'images/products/golden-glow/24k-foundation-1.jpg',
                    'images/products/golden-glow/24k-foundation-2.jpg'
                ],
                variants: [
                    { id: 'shade_porcelain', name: 'Porcelain', price: 78.00, stock: 12 },
                    { id: 'shade_ivory', name: 'Ivory', price: 78.00, stock: 15 },
                    { id: 'shade_beige', name: 'Beige', price: 78.00, stock: 18 },
                    { id: 'shade_sand', name: 'Sand', price: 78.00, stock: 14 },
                    { id: 'shade_caramel', name: 'Caramel', price: 78.00, stock: 16 },
                    { id: 'shade_espresso', name: 'Espresso', price: 78.00, stock: 14 }
                ],
                keyBenefits: [
                    '24K gold infusion',
                    'Medium to full coverage',
                    'Radiant finish',
                    'Long-wearing formula'
                ],
                ingredients: [
                    'Aqua', '24K Gold Particles', 'Titanium Dioxide', 'Iron Oxides',
                    'Hyaluronic Acid', 'Vitamin E', 'Dimethicone'
                ],
                usage: 'Apply with brush or beauty sponge, building coverage as desired.',
                skinType: ['all', 'mature', 'dull'],
                concerns: ['coverage', 'radiance', 'longevity'],
                collection: 'golden-hour',
                newArrival: false,
                bestSeller: true
            },
            {
                id: 'gg_golden_eyeshadow',
                name: 'Golden Hour Eyeshadow Palette',
                brand: 'golden-glow',
                category: 'makeup',
                subcategory: 'eyes',
                description: 'Twelve warm, golden-toned eyeshadows in matte, shimmer, and metallic finishes for endless eye looks.',
                price: 95.00,
                salePrice: null,
                stock: 43,
                rating: 4.7,
                reviewCount: 278,
                featured: true,
                images: [
                    'images/products/golden-glow/golden-eyeshadow-1.jpg',
                    'images/products/golden-glow/golden-eyeshadow-2.jpg'
                ],
                variants: [
                    { id: 'palette_golden_hour', name: 'Golden Hour Palette', price: 95.00, stock: 43 }
                ],
                keyBenefits: [
                    '12 warm golden shades',
                    'Multiple finishes',
                    'Highly pigmented',
                    'Blendable formula'
                ],
                ingredients: [
                    'Mica', 'Talc', 'Gold Powder', 'Magnesium Stearate',
                    'Dimethicone', 'Phenoxyethanol', 'Tocopheryl Acetate'
                ],
                usage: 'Apply with eyeshadow brush, blend seamlessly for desired intensity.',
                skinType: ['all'],
                concerns: ['color', 'longevity', 'blendability'],
                collection: 'golden-hour',
                newArrival: false,
                bestSeller: true
            },

            // Pure Essence - Clean Beauty
            {
                id: 'pe_gentle_cleanser',
                name: 'Organic Gentle Foam Cleanser',
                brand: 'pure-essence',
                category: 'skincare',
                subcategory: 'cleansers',
                description: 'Certified organic foam cleanser with chamomile and green tea extracts for gentle, effective cleansing.',
                price: 42.00,
                salePrice: null,
                stock: 78,
                rating: 4.4,
                reviewCount: 167,
                featured: false,
                images: [
                    'images/products/pure-essence/gentle-cleanser-1.jpg',
                    'images/products/pure-essence/gentle-cleanser-2.jpg'
                ],
                variants: [
                    { id: 'size_200ml', name: '200ml', price: 42.00, stock: 78 }
                ],
                keyBenefits: [
                    'Certified organic',
                    'Gentle foam formula',
                    'Chamomile & green tea',
                    'Suitable for sensitive skin'
                ],
                ingredients: [
                    'Organic Aloe Vera', 'Chamomile Extract', 'Green Tea Extract',
                    'Coconut-derived Surfactants', 'Organic Glycerin'
                ],
                usage: 'Pump foam onto damp hands, massage onto face, rinse thoroughly.',
                skinType: ['sensitive', 'all', 'combination'],
                concerns: ['cleansing', 'sensitivity', 'natural care'],
                collection: null,
                newArrival: false,
                bestSeller: false
            },
            {
                id: 'pe_vitamin_serum',
                name: 'Clean Vitamin C + E Serum',
                brand: 'pure-essence',
                category: 'skincare',
                subcategory: 'serums',
                description: 'Clean beauty vitamin serum with stable vitamin C and natural vitamin E for brightening and protection.',
                price: 65.00,
                salePrice: 52.00,
                stock: 56,
                rating: 4.6,
                reviewCount: 143,
                featured: false,
                images: [
                    'images/products/pure-essence/vitamin-serum-1.jpg',
                    'images/products/pure-essence/vitamin-serum-2.jpg'
                ],
                variants: [
                    { id: 'size_30ml', name: '30ml', price: 65.00, stock: 56 }
                ],
                keyBenefits: [
                    'Stable vitamin C',
                    'Natural vitamin E',
                    'Clean beauty formula',
                    'Brightening effect'
                ],
                ingredients: [
                    'Organic Rosehip Oil', 'Magnesium Ascorbyl Phosphate', 'Natural Vitamin E',
                    'Organic Jojoba Oil', 'Sea Buckthorn Extract'
                ],
                usage: 'Apply 2-3 drops to clean skin morning and evening.',
                skinType: ['all', 'dull', 'sensitive'],
                concerns: ['brightening', 'antioxidant protection', 'natural care'],
                collection: null,
                newArrival: true,
                bestSeller: false
            },

            // Velvet Noir - Italian Luxury Makeup
            {
                id: 'vn_velvet_lipstick',
                name: 'Velvet Matte Luxury Lipstick',
                brand: 'velvet-noir',
                category: 'makeup',
                subcategory: 'lips',
                description: 'Ultra-luxurious matte lipstick with velvet finish and intense color payoff in sophisticated shades.',
                price: 68.00,
                salePrice: null,
                stock: 124,
                rating: 4.8,
                reviewCount: 456,
                featured: true,
                images: [
                    'images/products/velvet-noir/velvet-lipstick-1.jpg',
                    'images/products/velvet-noir/velvet-lipstick-2.jpg'
                ],
                variants: [
                    { id: 'shade_crimson', name: 'Crimson Velvet', price: 68.00, stock: 18 },
                    { id: 'shade_burgundy', name: 'Burgundy Noir', price: 68.00, stock: 22 },
                    { id: 'shade_rose', name: 'Rose Sophistique', price: 68.00, stock: 25 },
                    { id: 'shade_nude', name: 'Nude Elegance', price: 68.00, stock: 28 },
                    { id: 'shade_berry', name: 'Berry Luxe', price: 68.00, stock: 19 },
                    { id: 'shade_coral', name: 'Coral Mystique', price: 68.00, stock: 12 }
                ],
                keyBenefits: [
                    'Velvet matte finish',
                    'Intense color payoff',
                    'Long-wearing formula',
                    'Luxurious packaging'
                ],
                ingredients: [
                    'Dimethicone', 'Cyclopentasiloxane', 'Titanium Dioxide', 'Iron Oxides',
                    'Vitamin E', 'Jojoba Oil', 'Carnauba Wax'
                ],
                usage: 'Apply directly to lips or use lip brush for precise application.',
                skinType: ['all'],
                concerns: ['color', 'longevity', 'comfort'],
                collection: null,
                newArrival: false,
                bestSeller: true
            },
            {
                id: 'vn_dramatic_mascara',
                name: 'Dramatic Volume Mascara',
                brand: 'velvet-noir',
                category: 'makeup',
                subcategory: 'eyes',
                description: 'Intense black mascara with dramatic volume and length for bold, captivating lashes.',
                price: 55.00,
                salePrice: null,
                stock: 89,
                rating: 4.5,
                reviewCount: 234,
                featured: false,
                images: [
                    'images/products/velvet-noir/dramatic-mascara-1.jpg',
                    'images/products/velvet-noir/dramatic-mascara-2.jpg'
                ],
                variants: [
                    { id: 'color_black', name: 'Intense Black', price: 55.00, stock: 67 },
                    { id: 'color_brown', name: 'Rich Brown', price: 55.00, stock: 22 }
                ],
                keyBenefits: [
                    'Dramatic volume',
                    'Length enhancement',
                    'Smudge-proof formula',
                    'Buildable coverage'
                ],
                ingredients: [
                    'Aqua', 'Beeswax', 'Carnauba Wax', 'Iron Oxides',
                    'Panthenol', 'Vitamin E', 'Arginine'
                ],
                usage: 'Apply from lash base to tips, building layers for desired intensity.',
                skinType: ['all'],
                concerns: ['volume', 'length', 'definition'],
                collection: null,
                newArrival: false,
                bestSeller: false
            },

            // Crystal Beauty - K-Beauty Innovation
            {
                id: 'cb_crystal_essence',
                name: 'Crystal Glow Essence',
                brand: 'crystal-beauty',
                category: 'skincare',
                subcategory: 'serums',
                description: 'Lightweight essence infused with crystal extracts and niacinamide for glass-like skin radiance.',
                price: 58.00,
                salePrice: null,
                stock: 67,
                rating: 4.7,
                reviewCount: 189,
                featured: true,
                images: [
                    'images/products/crystal-beauty/crystal-essence-1.jpg',
                    'images/products/crystal-beauty/crystal-essence-2.jpg'
                ],
                variants: [
                    { id: 'size_150ml', name: '150ml', price: 58.00, stock: 67 }
                ],
                keyBenefits: [
                    'Crystal extracts',
                    'Glass skin effect',
                    'Niacinamide formula',
                    'Lightweight texture'
                ],
                ingredients: [
                    'Aqua', 'Niacinamide', 'Crystal Extract', 'Hyaluronic Acid',
                    'Glycerin', 'Adenosine', 'Centella Asiatica'
                ],
                usage: 'Apply to clean skin, pat gently until absorbed. Follow with moisturizer.',
                skinType: ['all', 'dull', 'oily'],
                concerns: ['radiance', 'pore care', 'hydration'],
                collection: 'crystal-clarity',
                newArrival: true,
                bestSeller: false
            },
            {
                id: 'cb_glass_moisturizer',
                name: 'Glass Skin Hydrating Gel',
                brand: 'crystal-beauty',
                category: 'skincare',
                subcategory: 'moisturizers',
                description: 'Lightweight gel moisturizer with crystal peptides for dewy, glass-like skin finish.',
                price: 72.00,
                salePrice: null,
                stock: 45,
                rating: 4.6,
                reviewCount: 156,
                featured: false,
                images: [
                    'images/products/crystal-beauty/glass-moisturizer-1.jpg',
                    'images/products/crystal-beauty/glass-moisturizer-2.jpg'
                ],
                variants: [
                    { id: 'size_50ml', name: '50ml', price: 72.00, stock: 45 }
                ],
                keyBenefits: [
                    'Glass skin finish',
                    'Crystal peptides',
                    'Lightweight gel texture',
                    'Dewy radiance'
                ],
                ingredients: [
                    'Aqua', 'Glycerin', 'Crystal Peptides', 'Sodium Hyaluronate',
                    'Trehalose', 'Allantoin', 'Green Tea Extract'
                ],
                usage: 'Apply to clean skin morning and evening as final step.',
                skinType: ['oily', 'combination', 'normal'],
                concerns: ['hydration', 'radiance', 'lightweight care'],
                collection: 'crystal-clarity',
                newArrival: true,
                bestSeller: false
            }
        ];
    }

    // Utility methods
    getBrandById(brandId) {
        return this.brands.find(brand => brand.id === brandId);
    }

    getProductsByBrand(brandId) {
        return this.products.filter(product => product.brand === brandId);
    }

    getProductsByCategory(categoryId) {
        return this.products.filter(product => product.category === categoryId);
    }

    getProductsBySubcategory(subcategoryId) {
        return this.products.filter(product => product.subcategory === subcategoryId);
    }

    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }

    getProductsOnSale() {
        return this.products.filter(product => product.salePrice && product.salePrice < product.price);
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.keyBenefits.some(benefit => benefit.toLowerCase().includes(searchTerm)) ||
            this.getBrandById(product.brand)?.name.toLowerCase().includes(searchTerm)
        );
    }

    getProductById(productId) {
        return this.products.find(product => product.id === productId);
    }

    updateProductStock(productId, quantity) {
        const product = this.getProductById(productId);
        if (product) {
            product.stock = Math.max(0, product.stock - quantity);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    addProduct(productData) {
        const newProduct = {
            id: this.generateProductId(),
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.products.push(newProduct);
        this.saveToStorage();
        return newProduct;
    }

    updateProduct(productId, updates) {
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage();
            return this.products[productIndex];
        }
        return null;
    }

    generateProductId() {
        return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    buildSearchIndex() {
        // Build search index for faster searching
        this.searchIndex = this.products.map(product => ({
            id: product.id,
            searchText: [
                product.name,
                product.description,
                product.keyBenefits.join(' '),
                this.getBrandById(product.brand)?.name || '',
                product.category,
                product.subcategory
            ].join(' ').toLowerCase()
        }));
    }

    saveToStorage() {
        try {
            localStorage.setItem('midasBeautyProducts', JSON.stringify(this.products));
            localStorage.setItem('midasBeautyBrands', JSON.stringify(this.brands));
            localStorage.setItem('midasBeautyCategories', JSON.stringify(this.categories));
        } catch (error) {
            console.error('Error saving product database to storage:', error);
        }
    }

    loadFromStorage() {
        try {
            const products = localStorage.getItem('midasBeautyProducts');
            const brands = localStorage.getItem('midasBeautyBrands');
            const categories = localStorage.getItem('midasBeautyCategories');

            if (products) this.products = JSON.parse(products);
            if (brands) this.brands = JSON.parse(brands);
            if (categories) this.categories = JSON.parse(categories);

            return true;
        } catch (error) {
            console.error('Error loading product database from storage:', error);
            return false;
        }
    }

    // Export data for backup or migration
    exportData() {
        return {
            products: this.products,
            brands: this.brands,
            categories: this.categories,
            collections: this.collections,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    // Import data from backup
    importData(data) {
        try {
            if (data.products) this.products = data.products;
            if (data.brands) this.brands = data.brands;
            if (data.categories) this.categories = data.categories;
            if (data.collections) this.collections = data.collections;

            this.saveToStorage();
            this.buildSearchIndex();
            return true;
        } catch (error) {
            console.error('Error importing product database:', error);
            return false;
        }
    }
}

// Comprehensive Brand and Category System for Midas Beauty
// Based on industry standards from LookFantastic, Pixi Beauty, and Exclusive Beauty Club

const BEAUTY_BRANDS_CATEGORIES = {
    // Brand Portfolio - 15 realistic beauty brands with unique positioning
    brands: {
        "midas-beauty": {
            id: "midas-beauty",
            name: "Midas Beauty",
            displayName: "Midas Beauty",
            logo: "images/brands/midas-beauty-logo.png",
            description: "Our signature luxury brand featuring premium formulations with precious metals and cutting-edge ingredients.",
            brandStory: "Founded on the principle that beauty should be as precious as gold, Midas Beauty combines luxury with innovation to create transformative skincare and makeup products.",
            positioning: "Luxury Premium",
            priceRange: "high-end",
            specialties: ["Anti-aging", "Luxury skincare", "Gold-infused products"],
            founded: "2020",
            origin: "Switzerland",
            keyIngredients: ["24K Gold", "Platinum", "Diamond powder", "Precious minerals"],
            brandColors: {
                primary: "#d4af37",
                secondary: "#1a1a1a",
                accent: "#f4e4bc"
            },
            featured: true,
            exclusive: true
        },
        "lumina-glow": {
            id: "lumina-glow",
            name: "Lumina Glow",
            displayName: "Lumina Glow",
            logo: "images/brands/lumina-glow-logo.png",
            description: "Illuminating skincare and makeup that enhances your natural radiance with light-reflecting technology.",
            brandStory: "Inspired by the golden hour, Lumina Glow creates products that capture and reflect light to give you that perfect, luminous complexion all day long.",
            positioning: "Premium",
            priceRange: "mid-to-high",
            specialties: ["Illuminating makeup", "Glow-enhancing skincare", "Light-reflecting formulas"],
            founded: "2018",
            origin: "France",
            keyIngredients: ["Pearl powder", "Mica", "Vitamin C", "Hyaluronic acid"],
            brandColors: {
                primary: "#ffd700",
                secondary: "#2c2c2c",
                accent: "#fff8dc"
            },
            featured: true,
            exclusive: false
        },
        "botanica-pure": {
            id: "botanica-pure",
            name: "Botanica Pure",
            displayName: "Botanica Pure",
            logo: "images/brands/botanica-pure-logo.png",
            description: "Clean, organic beauty products crafted from the finest botanical ingredients for sensitive and conscious consumers.",
            brandStory: "Rooted in nature's wisdom, Botanica Pure harnesses the power of organic botanicals to create gentle yet effective beauty solutions for the modern conscious consumer.",
            positioning: "Clean Beauty",
            priceRange: "mid-range",
            specialties: ["Organic skincare", "Sensitive skin", "Clean formulations", "Vegan products"],
            founded: "2019",
            origin: "California, USA",
            keyIngredients: ["Organic botanicals", "Plant extracts", "Essential oils", "Natural minerals"],
            brandColors: {
                primary: "#228b22",
                secondary: "#2f4f2f",
                accent: "#98fb98"
            },
            featured: true,
            exclusive: false
        },
        "velvet-luxe": {
            id: "velvet-luxe",
            name: "Velvet Luxe",
            displayName: "Velvet Luxe",
            logo: "images/brands/velvet-luxe-logo.png",
            description: "Sophisticated makeup artistry with rich, velvety textures and long-lasting formulations for the modern woman.",
            brandStory: "Born from the desire to create makeup that feels as luxurious as it looks, Velvet Luxe offers rich, velvety formulations that provide professional-quality results.",
            positioning: "Luxury Makeup",
            priceRange: "high-end",
            specialties: ["Luxury makeup", "Long-wear formulas", "Rich textures", "Professional quality"],
            founded: "2017",
            origin: "Italy",
            keyIngredients: ["Silk proteins", "Velvet powder", "Long-wear polymers", "Luxury pigments"],
            brandColors: {
                primary: "#800080",
                secondary: "#000000",
                accent: "#dda0dd"
            },
            featured: true,
            exclusive: true
        },
        "aqua-essence": {
            id: "aqua-essence",
            name: "Aqua Essence",
            displayName: "Aqua Essence",
            logo: "images/brands/aqua-essence-logo.png",
            description: "Hydration-focused skincare featuring marine ingredients and advanced water-binding technology.",
            brandStory: "Inspired by the ocean's natural hydrating power, Aqua Essence creates deeply moisturizing skincare products that quench your skin's thirst.",
            positioning: "Hydration Specialist",
            priceRange: "mid-range",
            specialties: ["Hydrating skincare", "Marine ingredients", "Dry skin solutions", "Water-based formulas"],
            founded: "2020",
            origin: "South Korea",
            keyIngredients: ["Marine collagen", "Seaweed extracts", "Hyaluronic acid", "Aqua ceramides"],
            brandColors: {
                primary: "#00bfff",
                secondary: "#191970",
                accent: "#e0f6ff"
            },
            featured: false,
            exclusive: false
        },
        "radiant-youth": {
            id: "radiant-youth",
            name: "Radiant Youth",
            displayName: "Radiant Youth",
            logo: "images/brands/radiant-youth-logo.png",
            description: "Anti-aging skincare powered by cutting-edge peptides and stem cell technology for youthful, radiant skin.",
            brandStory: "Combining scientific innovation with natural ingredients, Radiant Youth creates advanced anti-aging solutions that help you maintain youthful, radiant skin.",
            positioning: "Anti-Aging Specialist",
            priceRange: "high-end",
            specialties: ["Anti-aging", "Peptide technology", "Stem cell research", "Scientific skincare"],
            founded: "2016",
            origin: "Germany",
            keyIngredients: ["Peptides", "Stem cells", "Retinol", "Growth factors"],
            brandColors: {
                primary: "#ff69b4",
                secondary: "#2f2f2f",
                accent: "#ffb6c1"
            },
            featured: false,
            exclusive: true
        },
        "pure-mineral": {
            id: "pure-mineral",
            name: "Pure Mineral",
            displayName: "Pure Mineral",
            logo: "images/brands/pure-mineral-logo.png",
            description: "Clean mineral makeup and skincare featuring pure, natural minerals for healthy, breathable coverage.",
            brandStory: "Harnessing the power of pure minerals from the earth, Pure Mineral creates clean, healthy makeup that lets your skin breathe while providing beautiful coverage.",
            positioning: "Clean Mineral",
            priceRange: "mid-range",
            specialties: ["Mineral makeup", "Clean beauty", "Sensitive skin", "Natural coverage"],
            founded: "2015",
            origin: "Australia",
            keyIngredients: ["Pure minerals", "Zinc oxide", "Iron oxides", "Natural clays"],
            brandColors: {
                primary: "#8b4513",
                secondary: "#654321",
                accent: "#deb887"
            },
            featured: false,
            exclusive: false
        },
        "silk-touch": {
            id: "silk-touch",
            name: "Silk Touch",
            displayName: "Silk Touch",
            logo: "images/brands/silk-touch-logo.png",
            description: "Luxurious haircare infused with silk proteins and precious oils for silky, healthy hair.",
            brandStory: "Inspired by the smoothness of silk, Silk Touch creates premium haircare products that transform your hair into silky, manageable locks.",
            positioning: "Luxury Haircare",
            priceRange: "high-end",
            specialties: ["Luxury haircare", "Silk proteins", "Hair repair", "Smoothing treatments"],
            founded: "2018",
            origin: "Japan",
            keyIngredients: ["Silk proteins", "Argan oil", "Keratin", "Precious oils"],
            brandColors: {
                primary: "#c0c0c0",
                secondary: "#2f2f2f",
                accent: "#f5f5f5"
            },
            featured: false,
            exclusive: true
        },
        "urban-glow": {
            id: "urban-glow",
            name: "Urban Glow",
            displayName: "Urban Glow",
            logo: "images/brands/urban-glow-logo.png",
            description: "Modern makeup for the urban lifestyle with pollution protection and long-lasting formulas.",
            brandStory: "Created for the modern city dweller, Urban Glow offers makeup that not only looks great but also protects your skin from urban environmental stressors.",
            positioning: "Urban Modern",
            priceRange: "mid-range",
            specialties: ["Urban protection", "Long-wear makeup", "Pollution defense", "Modern formulas"],
            founded: "2019",
            origin: "New York, USA",
            keyIngredients: ["Antioxidants", "SPF protection", "Long-wear polymers", "Anti-pollution actives"],
            brandColors: {
                primary: "#ff6347",
                secondary: "#2f4f4f",
                accent: "#ffa07a"
            },
            featured: false,
            exclusive: false
        },
        "essence-naturale": {
            id: "essence-naturale",
            name: "Essence Naturale",
            displayName: "Essence Naturale",
            logo: "images/brands/essence-naturale-logo.png",
            description: "French-inspired natural skincare featuring organic ingredients and traditional beauty secrets.",
            brandStory: "Rooted in French beauty traditions, Essence Naturale combines time-honored natural ingredients with modern skincare science.",
            positioning: "Natural French",
            priceRange: "mid-to-high",
            specialties: ["French skincare", "Natural ingredients", "Traditional formulas", "Organic beauty"],
            founded: "2017",
            origin: "Provence, France",
            keyIngredients: ["French botanicals", "Organic oils", "Natural extracts", "Traditional herbs"],
            brandColors: {
                primary: "#9370db",
                secondary: "#483d8b",
                accent: "#e6e6fa"
            },
            featured: false,
            exclusive: false
        }
    },

    // Advanced Category Hierarchy based on industry standards
    categories: {
        skincare: {
            id: "skincare",
            name: "Skincare",
            displayName: "Skincare",
            description: "Complete skincare solutions for every skin type and concern",
            icon: "fas fa-leaf",
            image: "images/categories/skincare-hero.jpg",
            subcategories: {
                cleansers: {
                    id: "cleansers",
                    name: "Cleansers",
                    displayName: "Cleansers & Makeup Removers",
                    description: "Gentle yet effective cleansing solutions",
                    productTypes: [
                        "Gel Cleansers",
                        "Cream Cleansers", 
                        "Oil Cleansers",
                        "Micellar Water",
                        "Makeup Removers",
                        "Exfoliating Cleansers",
                        "Cleansing Balms"
                    ],
                    skinConcerns: ["All skin types", "Sensitive skin", "Acne-prone", "Dry skin", "Oily skin"],
                    filters: ["skin_type", "concern", "ingredient", "texture"]
                },
                serums: {
                    id: "serums",
                    name: "Serums",
                    displayName: "Serums & Treatments",
                    description: "Concentrated treatments for targeted skin concerns",
                    productTypes: [
                        "Vitamin C Serums",
                        "Retinol Serums",
                        "Hyaluronic Acid Serums",
                        "Niacinamide Serums",
                        "Peptide Serums",
                        "AHA/BHA Serums",
                        "Anti-aging Serums"
                    ],
                    skinConcerns: ["Anti-aging", "Brightening", "Hydration", "Acne", "Dark spots", "Fine lines"],
                    filters: ["concern", "ingredient", "skin_type", "time_of_use"]
                },
                moisturizers: {
                    id: "moisturizers",
                    name: "Moisturizers",
                    displayName: "Moisturizers & Creams",
                    description: "Hydrating and nourishing face creams",
                    productTypes: [
                        "Day Moisturizers",
                        "Night Creams",
                        "Eye Creams",
                        "Face Oils",
                        "Gel Moisturizers",
                        "Anti-aging Creams",
                        "SPF Moisturizers"
                    ],
                    skinConcerns: ["Hydration", "Anti-aging", "Sensitive skin", "Oily skin", "Dry skin"],
                    filters: ["skin_type", "time_of_use", "concern", "spf"]
                },
                suncare: {
                    id: "suncare",
                    name: "Sun Care",
                    displayName: "Sun Protection",
                    description: "Broad-spectrum sun protection for face and body",
                    productTypes: [
                        "Face Sunscreens",
                        "Body Sunscreens",
                        "Tinted Sunscreens",
                        "Mineral Sunscreens",
                        "Chemical Sunscreens",
                        "SPF Moisturizers",
                        "After-sun Care"
                    ],
                    skinConcerns: ["UV protection", "Anti-aging", "Sensitive skin", "Daily wear"],
                    filters: ["spf_level", "skin_type", "formula_type", "tinted"]
                },
                masks: {
                    id: "masks",
                    name: "Masks",
                    displayName: "Face Masks & Exfoliants",
                    description: "Weekly treatments for deep cleansing and nourishment",
                    productTypes: [
                        "Sheet Masks",
                        "Clay Masks",
                        "Hydrating Masks",
                        "Exfoliating Masks",
                        "Overnight Masks",
                        "Peel-off Masks",
                        "Eye Masks"
                    ],
                    skinConcerns: ["Deep cleansing", "Hydration", "Brightening", "Anti-aging", "Pore care"],
                    filters: ["mask_type", "concern", "skin_type", "frequency"]
                },
                toners: {
                    id: "toners",
                    name: "Toners",
                    displayName: "Toners & Essences",
                    description: "Balancing and preparing treatments",
                    productTypes: [
                        "Hydrating Toners",
                        "Exfoliating Toners",
                        "Balancing Toners",
                        "Essences",
                        "Mists",
                        "pH Balancing Toners",
                        "Treatment Toners"
                    ],
                    skinConcerns: ["Hydration", "Pore care", "Oil control", "Sensitive skin", "Exfoliation"],
                    filters: ["skin_type", "concern", "ingredient", "formula_type"]
                }
            }
        },
        makeup: {
            id: "makeup",
            name: "Makeup",
            displayName: "Makeup",
            description: "Professional-quality makeup for every look and occasion",
            icon: "fas fa-palette",
            image: "images/categories/makeup-hero.jpg",
            subcategories: {
                face: {
                    id: "face",
                    name: "Face",
                    displayName: "Face Makeup",
                    description: "Foundations, concealers, and complexion products",
                    productTypes: [
                        "Liquid Foundations",
                        "Powder Foundations",
                        "Tinted Moisturizers",
                        "BB/CC Creams",
                        "Concealers",
                        "Primers",
                        "Setting Powders",
                        "Bronzers",
                        "Highlighters",
                        "Blushes"
                    ],
                    makeupLooks: ["Natural", "Glam", "Professional", "Evening", "Bridal"],
                    filters: ["coverage", "finish", "skin_type", "shade_range", "formula"]
                },
                eyes: {
                    id: "eyes",
                    name: "Eyes",
                    displayName: "Eye Makeup",
                    description: "Eyeshadows, mascaras, and eye-defining products",
                    productTypes: [
                        "Eyeshadow Palettes",
                        "Single Eyeshadows",
                        "Mascaras",
                        "Eyeliners",
                        "Eyebrow Products",
                        "Eye Primers",
                        "False Lashes",
                        "Lash Serums"
                    ],
                    makeupLooks: ["Smoky eye", "Natural", "Dramatic", "Colorful", "Classic"],
                    filters: ["product_type", "color_family", "finish", "waterproof", "formula"]
                },
                lips: {
                    id: "lips",
                    name: "Lips",
                    displayName: "Lip Products",
                    description: "Lipsticks, glosses, and lip care",
                    productTypes: [
                        "Lipsticks",
                        "Lip Glosses",
                        "Liquid Lipsticks",
                        "Lip Liners",
                        "Lip Balms",
                        "Lip Stains",
                        "Lip Sets"
                    ],
                    makeupLooks: ["Bold", "Natural", "Glossy", "Matte", "Classic red"],
                    filters: ["finish", "color_family", "longevity", "formula", "occasion"]
                },
                tools: {
                    id: "tools",
                    name: "Tools",
                    displayName: "Makeup Tools & Brushes",
                    description: "Professional makeup brushes and application tools",
                    productTypes: [
                        "Face Brushes",
                        "Eye Brushes",
                        "Lip Brushes",
                        "Brush Sets",
                        "Beauty Sponges",
                        "Makeup Bags",
                        "Mirrors",
                        "Sharpeners"
                    ],
                    makeupLooks: ["Professional application", "Beginner-friendly", "Travel", "Complete sets"],
                    filters: ["brush_type", "hair_type", "brand", "set_size", "price_range"]
                }
            }
        },
        haircare: {
            id: "haircare",
            name: "Haircare",
            displayName: "Haircare",
            description: "Complete haircare solutions for healthy, beautiful hair",
            icon: "fas fa-cut",
            image: "images/categories/haircare-hero.jpg",
            subcategories: {
                shampoo: {
                    id: "shampoo",
                    name: "Shampoo",
                    displayName: "Shampoos",
                    description: "Cleansing shampoos for every hair type",
                    productTypes: [
                        "Daily Shampoos",
                        "Clarifying Shampoos",
                        "Color-safe Shampoos",
                        "Dry Shampoos",
                        "Sulfate-free Shampoos",
                        "Anti-dandruff Shampoos",
                        "Volumizing Shampoos"
                    ],
                    hairConcerns: ["Oily hair", "Dry hair", "Color-treated", "Damaged hair", "Fine hair", "Curly hair"],
                    filters: ["hair_type", "concern", "sulfate_free", "color_safe", "ingredient"]
                },
                conditioner: {
                    id: "conditioner",
                    name: "Conditioner",
                    displayName: "Conditioners",
                    description: "Nourishing conditioners and treatments",
                    productTypes: [
                        "Daily Conditioners",
                        "Deep Conditioners",
                        "Leave-in Conditioners",
                        "Hair Masks",
                        "Protein Treatments",
                        "Color-protecting Conditioners",
                        "Volumizing Conditioners"
                    ],
                    hairConcerns: ["Dry hair", "Damaged hair", "Color-treated", "Frizzy hair", "Fine hair"],
                    filters: ["hair_type", "concern", "treatment_type", "color_safe", "protein"]
                },
                styling: {
                    id: "styling",
                    name: "Styling",
                    displayName: "Styling Products",
                    description: "Styling products for every hair look",
                    productTypes: [
                        "Hair Oils",
                        "Heat Protectants",
                        "Styling Creams",
                        "Hair Sprays",
                        "Mousses",
                        "Gels",
                        "Texturizing Sprays",
                        "Curl Enhancers"
                    ],
                    hairConcerns: ["Heat protection", "Frizz control", "Volume", "Curl definition", "Hold"],
                    filters: ["hair_type", "hold_level", "finish", "heat_protection", "concern"]
                },
                treatments: {
                    id: "treatments",
                    name: "Treatments",
                    displayName: "Hair Treatments",
                    description: "Intensive treatments for hair repair and growth",
                    productTypes: [
                        "Hair Serums",
                        "Scalp Treatments",
                        "Hair Growth Products",
                        "Repair Treatments",
                        "Overnight Treatments",
                        "Protein Treatments",
                        "Oil Treatments"
                    ],
                    hairConcerns: ["Hair loss", "Damaged hair", "Scalp health", "Hair growth", "Repair"],
                    filters: ["concern", "treatment_type", "hair_type", "ingredient", "frequency"]
                }
            }
        }
    },

    // Skin concerns for advanced filtering
    skinConcerns: [
        "Anti-aging",
        "Acne",
        "Dry skin",
        "Oily skin",
        "Sensitive skin",
        "Dark spots",
        "Fine lines",
        "Wrinkles",
        "Uneven skin tone",
        "Large pores",
        "Dullness",
        "Redness",
        "Hyperpigmentation",
        "Dehydration",
        "Sun damage"
    ],

    // Hair types and concerns
    hairTypes: [
        "Fine hair",
        "Thick hair",
        "Curly hair",
        "Straight hair",
        "Wavy hair",
        "Coily hair",
        "Color-treated hair",
        "Chemically-treated hair",
        "Natural hair"
    ],

    hairConcerns: [
        "Dry hair",
        "Oily hair",
        "Damaged hair",
        "Frizzy hair",
        "Hair loss",
        "Lack of volume",
        "Color fading",
        "Split ends",
        "Scalp issues",
        "Lack of shine"
    ],

    // Price ranges
    priceRanges: [
        { id: "budget", label: "Under $25", min: 0, max: 25 },
        { id: "mid", label: "$25 - $50", min: 25, max: 50 },
        { id: "premium", label: "$50 - $100", min: 50, max: 100 },
        { id: "luxury", label: "$100+", min: 100, max: 999 }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BEAUTY_BRANDS_CATEGORIES;
} else if (typeof window !== 'undefined') {
    window.BEAUTY_BRANDS_CATEGORIES = BEAUTY_BRANDS_CATEGORIES;
}

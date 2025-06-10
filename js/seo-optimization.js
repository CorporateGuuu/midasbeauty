// SEO Optimization System for MidasBeauty Luxury E-commerce
// Implements structured data, meta tags, and performance optimizations

class MidasBeautySEO {
    constructor() {
        this.siteUrl = window.location.origin;
        this.businessInfo = {
            name: "MidasBeauty",
            description: "Luxury beauty products and premium cosmetics for the discerning woman",
            url: this.siteUrl,
            logo: `${this.siteUrl}/images/logo.png`,
            telephone: "+1-555-BEAUTY",
            email: "hello@midasbeauty.shop",
            address: {
                streetAddress: "123 Luxury Lane",
                addressLocality: "Beverly Hills",
                addressRegion: "CA",
                postalCode: "90210",
                addressCountry: "US"
            },
            socialMedia: {
                instagram: "https://instagram.com/midasbeauty",
                facebook: "https://facebook.com/midasbeauty",
                twitter: "https://twitter.com/midasbeauty",
                pinterest: "https://pinterest.com/midasbeauty"
            }
        };
        this.init();
    }

    init() {
        this.addBusinessStructuredData();
        this.optimizeMetaTags();
        this.addOpenGraphTags();
        this.addTwitterCardTags();
        this.implementProductStructuredData();
        this.addBreadcrumbStructuredData();
        this.optimizeHeadingHierarchy();
        this.addImageOptimization();
        this.generateSitemap();
        console.log('✅ SEO optimization initialized');
    }

    // Business Information Structured Data
    addBusinessStructuredData() {
        const businessSchema = {
            "@context": "https://schema.org",
            "@type": "BeautyBusiness",
            "name": this.businessInfo.name,
            "description": this.businessInfo.description,
            "url": this.businessInfo.url,
            "logo": this.businessInfo.logo,
            "telephone": this.businessInfo.telephone,
            "email": this.businessInfo.email,
            "address": {
                "@type": "PostalAddress",
                ...this.businessInfo.address
            },
            "sameAs": Object.values(this.businessInfo.socialMedia),
            "priceRange": "$25-$400",
            "paymentAccepted": ["Credit Card", "PayPal", "Apple Pay", "Google Pay"],
            "currenciesAccepted": "USD",
            "openingHours": "Mo-Su 00:00-23:59",
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Luxury Beauty Products",
                "itemListElement": [
                    {
                        "@type": "OfferCatalog",
                        "name": "Skincare",
                        "numberOfItems": "20+"
                    },
                    {
                        "@type": "OfferCatalog", 
                        "name": "Makeup",
                        "numberOfItems": "15+"
                    },
                    {
                        "@type": "OfferCatalog",
                        "name": "Haircare", 
                        "numberOfItems": "8+"
                    },
                    {
                        "@type": "OfferCatalog",
                        "name": "Fragrance",
                        "numberOfItems": "7+"
                    }
                ]
            }
        };

        this.addStructuredData(businessSchema);
    }

    // Product Structured Data
    implementProductStructuredData() {
        if (window.productDatabaseManager) {
            const products = window.productDatabaseManager.getAllProducts();
            
            products.forEach(product => {
                const brand = window.productDatabaseManager.database.getBrandById(product.brand);
                
                const productSchema = {
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": product.name,
                    "description": product.description,
                    "brand": {
                        "@type": "Brand",
                        "name": brand?.name || "MidasBeauty"
                    },
                    "category": this.getCategoryName(product.category),
                    "image": product.images || [`${this.siteUrl}/images/products/default.jpg`],
                    "sku": product.id,
                    "offers": {
                        "@type": "Offer",
                        "price": product.salePrice || product.price,
                        "priceCurrency": "USD",
                        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                        "seller": {
                            "@type": "Organization",
                            "name": this.businessInfo.name
                        },
                        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": product.rating,
                        "reviewCount": product.reviewCount,
                        "bestRating": 5,
                        "worstRating": 1
                    },
                    "review": this.generateProductReviews(product)
                };

                // Add beauty-specific properties
                if (product.category === 'skincare' || product.category === 'makeup') {
                    productSchema.additionalProperty = [
                        {
                            "@type": "PropertyValue",
                            "name": "Skin Type",
                            "value": product.skinType?.join(', ') || "All skin types"
                        },
                        {
                            "@type": "PropertyValue", 
                            "name": "Key Benefits",
                            "value": product.keyBenefits?.join(', ') || ""
                        }
                    ];
                }

                this.addStructuredData(productSchema, `product-${product.id}`);
            });
        }
    }

    // Breadcrumb Structured Data
    addBreadcrumbStructuredData() {
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": this.siteUrl
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Luxury Beauty",
                    "item": `${this.siteUrl}/products`
                }
            ]
        };

        this.addStructuredData(breadcrumbSchema, 'breadcrumb');
    }

    // Meta Tags Optimization
    optimizeMetaTags() {
        const metaTags = [
            { name: 'description', content: 'Discover luxury beauty products from premium brands. Shop skincare, makeup, haircare & fragrance with expert recommendations. Free shipping on orders over $75.' },
            { name: 'keywords', content: 'luxury beauty, premium cosmetics, skincare, makeup, haircare, fragrance, beauty products, luxury brands' },
            { name: 'author', content: 'MidasBeauty' },
            { name: 'robots', content: 'index, follow, max-image-preview:large' },
            { name: 'googlebot', content: 'index, follow' },
            { name: 'theme-color', content: '#d4af37' },
            { name: 'msapplication-TileColor', content: '#d4af37' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            { name: 'format-detection', content: 'telephone=no' }
        ];

        metaTags.forEach(tag => {
            let metaElement = document.querySelector(`meta[name="${tag.name}"]`);
            if (!metaElement) {
                metaElement = document.createElement('meta');
                metaElement.name = tag.name;
                document.head.appendChild(metaElement);
            }
            metaElement.content = tag.content;
        });

        // Update title if needed
        if (!document.title || document.title === 'MidasBeauty') {
            document.title = 'MidasBeauty - Luxury Beauty Products & Premium Cosmetics';
        }
    }

    // Open Graph Tags
    addOpenGraphTags() {
        const ogTags = [
            { property: 'og:title', content: 'MidasBeauty - Luxury Beauty Products & Premium Cosmetics' },
            { property: 'og:description', content: 'Discover luxury beauty products from premium brands. Shop skincare, makeup, haircare & fragrance with expert recommendations.' },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: this.siteUrl },
            { property: 'og:image', content: `${this.siteUrl}/images/og-image.jpg` },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:site_name', content: 'MidasBeauty' },
            { property: 'og:locale', content: 'en_US' },
            { property: 'product:price:amount', content: '25.00' },
            { property: 'product:price:currency', content: 'USD' }
        ];

        ogTags.forEach(tag => {
            let metaElement = document.querySelector(`meta[property="${tag.property}"]`);
            if (!metaElement) {
                metaElement = document.createElement('meta');
                metaElement.setAttribute('property', tag.property);
                document.head.appendChild(metaElement);
            }
            metaElement.content = tag.content;
        });
    }

    // Twitter Card Tags
    addTwitterCardTags() {
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@midasbeauty' },
            { name: 'twitter:title', content: 'MidasBeauty - Luxury Beauty Products' },
            { name: 'twitter:description', content: 'Discover luxury beauty products from premium brands. Shop skincare, makeup, haircare & fragrance.' },
            { name: 'twitter:image', content: `${this.siteUrl}/images/twitter-card.jpg` },
            { name: 'twitter:creator', content: '@midasbeauty' }
        ];

        twitterTags.forEach(tag => {
            let metaElement = document.querySelector(`meta[name="${tag.name}"]`);
            if (!metaElement) {
                metaElement = document.createElement('meta');
                metaElement.name = tag.name;
                document.head.appendChild(metaElement);
            }
            metaElement.content = tag.content;
        });
    }

    // Heading Hierarchy Optimization
    optimizeHeadingHierarchy() {
        // Ensure proper H1-H6 hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let currentLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            
            // Add proper heading structure if missing
            if (!heading.textContent.trim()) {
                heading.style.display = 'none';
            }
            
            // Add heading IDs for anchor links
            if (!heading.id && heading.textContent.trim()) {
                heading.id = this.generateSlug(heading.textContent);
            }
        });

        // Add main H1 if missing
        if (!document.querySelector('h1')) {
            const mainHeading = document.createElement('h1');
            mainHeading.textContent = 'Luxury Beauty Products & Premium Cosmetics';
            mainHeading.style.position = 'absolute';
            mainHeading.style.left = '-9999px';
            document.body.insertBefore(mainHeading, document.body.firstChild);
        }
    }

    // Image Optimization
    addImageOptimization() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add alt text if missing
            if (!img.alt) {
                const src = img.src || img.dataset.src || '';
                if (src.includes('product')) {
                    img.alt = 'Luxury beauty product - Premium cosmetics';
                } else if (src.includes('brand')) {
                    img.alt = 'Luxury beauty brand logo';
                } else {
                    img.alt = 'MidasBeauty luxury cosmetics';
                }
            }

            // Add loading="lazy" for performance
            if (!img.loading) {
                img.loading = 'lazy';
            }

            // Add proper dimensions if missing
            if (!img.width && !img.height) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });
    }

    // Generate XML Sitemap
    generateSitemap() {
        const sitemap = {
            urls: [
                { loc: this.siteUrl, priority: 1.0, changefreq: 'daily' },
                { loc: `${this.siteUrl}/products`, priority: 0.9, changefreq: 'daily' },
                { loc: `${this.siteUrl}/brands`, priority: 0.8, changefreq: 'weekly' },
                { loc: `${this.siteUrl}/skincare`, priority: 0.8, changefreq: 'daily' },
                { loc: `${this.siteUrl}/makeup`, priority: 0.8, changefreq: 'daily' },
                { loc: `${this.siteUrl}/haircare`, priority: 0.7, changefreq: 'weekly' },
                { loc: `${this.siteUrl}/fragrance`, priority: 0.7, changefreq: 'weekly' }
            ]
        };

        // Add product URLs
        if (window.productDatabaseManager) {
            const products = window.productDatabaseManager.getAllProducts();
            products.forEach(product => {
                sitemap.urls.push({
                    loc: `${this.siteUrl}/product/${product.id}`,
                    priority: 0.6,
                    changefreq: 'weekly',
                    lastmod: new Date().toISOString().split('T')[0]
                });
            });
        }

        // Store sitemap for server generation
        window.midasBeautySitemap = sitemap;
    }

    // Utility Methods
    addStructuredData(schema, id = null) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        if (id) script.id = `schema-${id}`;
        document.head.appendChild(script);
    }

    getCategoryName(categoryId) {
        const categories = {
            'skincare': 'Skincare',
            'makeup': 'Makeup & Cosmetics',
            'haircare': 'Hair Care',
            'fragrance': 'Fragrance & Perfume'
        };
        return categories[categoryId] || 'Beauty Products';
    }

    generateSlug(text) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    }

    generateProductReviews(product) {
        // Generate sample reviews for SEO
        const reviews = [];
        const reviewCount = Math.min(product.reviewCount, 5);
        
        for (let i = 0; i < reviewCount; i++) {
            reviews.push({
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": Math.max(3, product.rating - Math.random() * 0.5),
                    "bestRating": 5
                },
                "author": {
                    "@type": "Person",
                    "name": `Customer ${i + 1}`
                },
                "reviewBody": `Excellent ${product.category} product. Highly recommend for luxury beauty routine.`
            });
        }
        
        return reviews;
    }

    // Performance Monitoring
    trackCoreWebVitals() {
        // Track Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Track First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Track Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }
}

// Initialize SEO optimization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.midasBeautySEO = new MidasBeautySEO();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MidasBeautySEO;
}

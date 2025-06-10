// Brand Management System for Multi-Brand Beauty E-commerce
// Handles brand filtering, brand pages, and brand-specific functionality

class BrandManagementSystem {
    constructor() {
        this.brands = {};
        this.currentBrand = null;
        this.brandProducts = [];
        this.init();
    }

    init() {
        // Load brand data
        this.loadBrandData();
        
        // Initialize brand functionality
        this.initializeBrandFiltering();
        this.initializeBrandPages();
        this.initializeBrandComparison();
        
        // Check if we're on a brand page
        this.loadBrandFromURL();
    }

    loadBrandData() {
        if (typeof BEAUTY_BRANDS_CATEGORIES !== 'undefined') {
            this.brands = BEAUTY_BRANDS_CATEGORIES.brands;
            console.log(`Loaded ${Object.keys(this.brands).length} brands`);
        }
    }

    loadBrandFromURL() {
        const path = window.location.pathname;
        if (path.includes('/brands/')) {
            const brandSlug = path.split('/brands/')[1].replace('.html', '');
            this.currentBrand = this.brands[brandSlug];
            
            if (this.currentBrand) {
                this.renderBrandPage();
                this.loadBrandProducts();
            }
        }
    }

    renderBrandPage() {
        if (!this.currentBrand) return;

        const brand = this.currentBrand;
        
        // Update page title
        document.title = `${brand.displayName} - Premium Beauty Products | Midas Beauty`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', brand.description);
        }

        // Render brand header
        this.renderBrandHeader(brand);
        
        // Render brand story
        this.renderBrandStory(brand);
        
        // Render brand statistics
        this.renderBrandStats(brand);
    }

    renderBrandHeader(brand) {
        const headerElement = document.getElementById('brand-header');
        if (!headerElement) return;

        headerElement.innerHTML = `
            <div class="brand-hero" style="background: linear-gradient(135deg, ${brand.brandColors.primary}20, ${brand.brandColors.accent}20);">
                <div class="container">
                    <div class="brand-hero-content">
                        <div class="brand-logo-section">
                            <img src="${brand.logo}" alt="${brand.displayName} Logo" class="brand-logo" loading="eager">
                            <div class="brand-badges">
                                ${brand.exclusive ? '<span class="badge exclusive">Exclusive</span>' : ''}
                                ${brand.featured ? '<span class="badge featured">Featured Brand</span>' : ''}
                            </div>
                        </div>
                        <div class="brand-info-section">
                            <h1 class="brand-name">${brand.displayName}</h1>
                            <p class="brand-tagline">${brand.description}</p>
                            <div class="brand-details">
                                <div class="brand-detail">
                                    <span class="label">Founded:</span>
                                    <span class="value">${brand.founded}</span>
                                </div>
                                <div class="brand-detail">
                                    <span class="label">Origin:</span>
                                    <span class="value">${brand.origin}</span>
                                </div>
                                <div class="brand-detail">
                                    <span class="label">Positioning:</span>
                                    <span class="value">${brand.positioning}</span>
                                </div>
                            </div>
                            <div class="brand-specialties">
                                <h3>Specialties:</h3>
                                <div class="specialty-tags">
                                    ${brand.specialties.map(specialty => 
                                        `<span class="specialty-tag" style="background: ${brand.brandColors.primary}20; color: ${brand.brandColors.primary};">${specialty}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderBrandStory(brand) {
        const storyElement = document.getElementById('brand-story');
        if (!storyElement) return;

        storyElement.innerHTML = `
            <div class="container">
                <div class="brand-story-content">
                    <h2>Brand Story</h2>
                    <p class="brand-story-text">${brand.brandStory}</p>
                    
                    <div class="brand-ingredients">
                        <h3>Signature Ingredients</h3>
                        <div class="ingredient-grid">
                            ${brand.keyIngredients.map(ingredient => `
                                <div class="ingredient-card">
                                    <div class="ingredient-icon">
                                        <i class="fas fa-leaf"></i>
                                    </div>
                                    <div class="ingredient-name">${ingredient}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderBrandStats(brand) {
        const statsElement = document.getElementById('brand-stats');
        if (!statsElement) return;

        // Calculate brand statistics
        const brandProducts = this.getBrandProducts(brand.id);
        const avgRating = this.calculateAverageRating(brandProducts);
        const totalReviews = brandProducts.reduce((sum, product) => sum + (product.reviewCount || 0), 0);
        const categories = [...new Set(brandProducts.map(p => p.category))];

        statsElement.innerHTML = `
            <div class="container">
                <div class="brand-stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${brandProducts.length}</div>
                        <div class="stat-label">Products</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${avgRating.toFixed(1)}</div>
                        <div class="stat-label">Avg Rating</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${totalReviews.toLocaleString()}</div>
                        <div class="stat-label">Reviews</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${categories.length}</div>
                        <div class="stat-label">Categories</div>
                    </div>
                </div>
            </div>
        `;
    }

    loadBrandProducts() {
        if (!this.currentBrand) return;

        // Get products for current brand
        this.brandProducts = this.getBrandProducts(this.currentBrand.id);
        
        // Render products
        this.renderBrandProducts();
    }

    getBrandProducts(brandId) {
        if (typeof MIDAS_BEAUTY_PRODUCTS === 'undefined' || !MIDAS_BEAUTY_PRODUCTS.products) {
            return [];
        }

        return MIDAS_BEAUTY_PRODUCTS.products.filter(product => product.brand === brandId);
    }

    calculateAverageRating(products) {
        if (products.length === 0) return 0;
        const totalRating = products.reduce((sum, product) => sum + (product.rating || 0), 0);
        return totalRating / products.length;
    }

    renderBrandProducts() {
        const productsElement = document.getElementById('brand-products');
        if (!productsElement || this.brandProducts.length === 0) return;

        // Group products by category
        const productsByCategory = this.groupProductsByCategory(this.brandProducts);

        let productsHTML = '<div class="container"><h2>Our Products</h2>';

        Object.entries(productsByCategory).forEach(([category, products]) => {
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            
            productsHTML += `
                <div class="brand-category-section">
                    <h3 class="category-title">${categoryName} (${products.length})</h3>
                    <div class="product-grid">
                        ${products.map(product => this.renderProductCard(product)).join('')}
                    </div>
                </div>
            `;
        });

        productsHTML += '</div>';
        productsElement.innerHTML = productsHTML;
    }

    groupProductsByCategory(products) {
        return products.reduce((groups, product) => {
            const category = product.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(product);
            return groups;
        }, {});
    }

    renderProductCard(product) {
        const salePrice = product.salePrice ? `<span class="sale-price">$${product.salePrice.toFixed(2)}</span>` : '';
        const originalPrice = product.salePrice ? `<span class="original-price">$${product.price.toFixed(2)}</span>` : `<span class="price">$${product.price.toFixed(2)}</span>`;
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.images.main}" alt="${product.name}" loading="lazy">
                    ${product.salePrice ? '<div class="sale-badge">Sale</div>' : ''}
                    ${product.newArrival ? '<div class="new-badge">New</div>' : ''}
                    ${product.bestSeller ? '<div class="bestseller-badge">Best Seller</div>' : ''}
                </div>
                <div class="product-info">
                    <h3><a href="${product.url}">${product.name}</a></h3>
                    <div class="product-rating">
                        ${this.generateStarRating(product.rating)}
                        <span class="review-count">(${product.reviewCount || 0})</span>
                    </div>
                    <div class="product-price">
                        ${salePrice}${originalPrice}
                    </div>
                    <div class="product-description">
                        ${product.description.substring(0, 100)}...
                    </div>
                    <div class="product-buttons">
                        <button class="btn add-to-cart-btn" onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>
                        <a href="${product.url}" class="btn view-details-btn">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '<div class="stars">';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        starsHTML += '</div>';
        return starsHTML;
    }

    initializeBrandFiltering() {
        // Add brand filtering to existing search and filter systems
        const brandFilter = document.getElementById('brand-filter');
        if (brandFilter) {
            this.populateBrandFilter(brandFilter);
            brandFilter.addEventListener('change', this.handleBrandFilter.bind(this));
        }
    }

    populateBrandFilter(filterElement) {
        let optionsHTML = '<option value="all">All Brands</option>';
        
        Object.values(this.brands).forEach(brand => {
            optionsHTML += `<option value="${brand.id}">${brand.displayName}</option>`;
        });
        
        filterElement.innerHTML = optionsHTML;
    }

    handleBrandFilter(event) {
        const selectedBrand = event.target.value;
        
        // Trigger product filtering
        if (typeof filterAndSortResults === 'function') {
            filterAndSortResults();
        }
        
        // Update URL if needed
        const url = new URL(window.location);
        if (selectedBrand === 'all') {
            url.searchParams.delete('brand');
        } else {
            url.searchParams.set('brand', selectedBrand);
        }
        window.history.replaceState({}, '', url);
    }

    initializeBrandPages() {
        // Initialize brand directory if on brands page
        if (window.location.pathname.includes('/brands.html') || window.location.pathname.includes('/brands/')) {
            this.renderBrandDirectory();
        }
    }

    renderBrandDirectory() {
        const directoryElement = document.getElementById('brand-directory');
        if (!directoryElement) return;

        const featuredBrands = Object.values(this.brands).filter(brand => brand.featured);
        const allBrands = Object.values(this.brands);

        let directoryHTML = `
            <div class="container">
                <h1>Our Brand Portfolio</h1>
                <p class="directory-intro">Discover our curated collection of premium beauty brands, each offering unique formulations and expertise.</p>
                
                <div class="featured-brands-section">
                    <h2>Featured Brands</h2>
                    <div class="brand-grid featured">
                        ${featuredBrands.map(brand => this.renderBrandCard(brand, true)).join('')}
                    </div>
                </div>
                
                <div class="all-brands-section">
                    <h2>All Brands</h2>
                    <div class="brand-grid">
                        ${allBrands.map(brand => this.renderBrandCard(brand, false)).join('')}
                    </div>
                </div>
            </div>
        `;

        directoryElement.innerHTML = directoryHTML;
    }

    renderBrandCard(brand, isFeatured = false) {
        const productCount = this.getBrandProducts(brand.id).length;
        
        return `
            <div class="brand-card ${isFeatured ? 'featured' : ''}" style="border-color: ${brand.brandColors.primary};">
                <div class="brand-card-header" style="background: linear-gradient(135deg, ${brand.brandColors.primary}20, ${brand.brandColors.accent}20);">
                    <img src="${brand.logo}" alt="${brand.displayName} Logo" class="brand-card-logo">
                    <div class="brand-badges">
                        ${brand.exclusive ? '<span class="badge exclusive">Exclusive</span>' : ''}
                        ${brand.featured ? '<span class="badge featured">Featured</span>' : ''}
                    </div>
                </div>
                <div class="brand-card-content">
                    <h3 class="brand-card-name">${brand.displayName}</h3>
                    <p class="brand-card-description">${brand.description}</p>
                    <div class="brand-card-details">
                        <div class="brand-detail">
                            <span class="label">Products:</span>
                            <span class="value">${productCount}</span>
                        </div>
                        <div class="brand-detail">
                            <span class="label">Origin:</span>
                            <span class="value">${brand.origin}</span>
                        </div>
                        <div class="brand-detail">
                            <span class="label">Positioning:</span>
                            <span class="value">${brand.positioning}</span>
                        </div>
                    </div>
                    <div class="brand-specialties">
                        ${brand.specialties.slice(0, 2).map(specialty => 
                            `<span class="specialty-tag" style="background: ${brand.brandColors.primary}20; color: ${brand.brandColors.primary};">${specialty}</span>`
                        ).join('')}
                    </div>
                    <div class="brand-card-actions">
                        <a href="brands/${brand.id}.html" class="btn brand-btn" style="background: ${brand.brandColors.primary};">
                            Explore Brand
                        </a>
                        <a href="products.html?brand=${brand.id}" class="btn btn-secondary">
                            Shop Products
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    initializeBrandComparison() {
        // Initialize brand comparison functionality
        const compareButtons = document.querySelectorAll('.compare-brand-btn');
        compareButtons.forEach(button => {
            button.addEventListener('click', this.handleBrandComparison.bind(this));
        });
    }

    handleBrandComparison(event) {
        // Brand comparison functionality
        const brandId = event.target.getAttribute('data-brand-id');
        // Implementation for brand comparison feature
        console.log('Brand comparison for:', brandId);
    }

    // Utility methods for integration with existing systems
    filterProductsByBrand(products, brandId) {
        if (brandId === 'all' || !brandId) return products;
        return products.filter(product => product.brand === brandId);
    }

    getBrandInfo(brandId) {
        return this.brands[brandId] || null;
    }

    getAllBrands() {
        return Object.values(this.brands);
    }

    getFeaturedBrands() {
        return Object.values(this.brands).filter(brand => brand.featured);
    }
}

// Initialize brand management system
let brandManagementSystem;
document.addEventListener('DOMContentLoaded', () => {
    brandManagementSystem = new BrandManagementSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrandManagementSystem;
} else if (typeof window !== 'undefined') {
    window.BrandManagementSystem = BrandManagementSystem;
}

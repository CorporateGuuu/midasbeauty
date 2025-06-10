// Product Recommendation Engine for MidasBeauty
// Handles cross-selling, upselling, and personalized recommendations

class ProductRecommendationEngine {
    constructor() {
        this.viewingHistory = this.loadViewingHistory();
        this.purchaseHistory = this.loadPurchaseHistory();
        this.recommendations = {};
        this.bundleData = this.initializeBundles();
        this.init();
    }

    init() {
        this.setupRecommendationWidgets();
        this.setupBundleRecommendations();
        this.setupCheckoutUpsells();
        this.trackProductViews();
        this.setupAnalytics();
    }

    // Product Recommendation Logic
    generateRecommendations(productId, type = 'related') {
        const product = this.getProductById(productId);
        if (!product) return [];

        switch (type) {
            case 'related':
                return this.getRelatedProducts(product);
            case 'frequently_bought':
                return this.getFrequentlyBoughtTogether(product);
            case 'personalized':
                return this.getPersonalizedRecommendations(product);
            case 'upsell':
                return this.getUpsellProducts(product);
            default:
                return this.getRelatedProducts(product);
        }
    }

    getRelatedProducts(product) {
        // Get products from same category and brand
        const allProducts = this.getAllProducts();
        const related = allProducts.filter(p => 
            p.id !== product.id && 
            (p.category === product.category || p.brand === product.brand)
        );

        // Sort by rating and popularity
        return related
            .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
            .slice(0, 6);
    }

    getFrequentlyBoughtTogether(product) {
        // Simulate frequently bought together logic
        const complementaryProducts = {
            'skincare': ['moisturizer', 'cleanser', 'serum'],
            'makeup': ['foundation', 'mascara', 'lipstick'],
            'haircare': ['shampoo', 'conditioner', 'treatment']
        };

        const category = product.category;
        const complementary = complementaryProducts[category] || [];
        
        return this.getAllProducts()
            .filter(p => 
                p.id !== product.id && 
                complementary.some(type => p.name.toLowerCase().includes(type))
            )
            .slice(0, 4);
    }

    getPersonalizedRecommendations(product) {
        // Based on viewing and purchase history
        const viewedCategories = this.getViewedCategories();
        const preferredBrands = this.getPreferredBrands();
        
        return this.getAllProducts()
            .filter(p => 
                p.id !== product.id &&
                (viewedCategories.includes(p.category) || preferredBrands.includes(p.brand))
            )
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
    }

    getUpsellProducts(product) {
        // Get higher-priced products in same category
        return this.getAllProducts()
            .filter(p => 
                p.id !== product.id &&
                p.category === product.category &&
                p.price > product.price
            )
            .sort((a, b) => a.price - b.price)
            .slice(0, 4);
    }

    // Bundle Recommendations
    initializeBundles() {
        return {
            'complete-skincare': {
                id: 'complete-skincare',
                name: 'Complete Skincare Routine',
                description: 'Everything you need for glowing, healthy skin',
                products: ['radiance-serum', 'hydrating-moisturizer', 'gentle-cleanser'],
                originalPrice: 150,
                bundlePrice: 120,
                savings: 30,
                image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=200&fit=crop'
            },
            'makeup-essentials': {
                id: 'makeup-essentials',
                name: 'Makeup Essentials Kit',
                description: 'Professional makeup basics for any occasion',
                products: ['velvet-foundation', 'volumizing-mascara', 'luxury-lipstick'],
                originalPrice: 200,
                bundlePrice: 160,
                savings: 40,
                image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=200&fit=crop'
            },
            'luxury-haircare': {
                id: 'luxury-haircare',
                name: 'Luxury Hair Care Set',
                description: 'Restore and nourish your hair with premium products',
                products: ['repair-shampoo', 'hydrating-conditioner', 'hair-treatment'],
                originalPrice: 100,
                bundlePrice: 80,
                savings: 20,
                image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300&h=200&fit=crop'
            }
        };
    }

    // Widget Creation
    setupRecommendationWidgets() {
        // Add "Customers Also Bought" widget to product pages
        if (this.isProductPage()) {
            this.createCustomersAlsoBoughtWidget();
            this.createFrequentlyBoughtTogetherWidget();
        }

        // Add "Recently Viewed" widget to all pages
        this.createRecentlyViewedWidget();
    }

    createCustomersAlsoBoughtWidget() {
        const productId = this.getCurrentProductId();
        const recommendations = this.generateRecommendations(productId, 'related');
        
        if (recommendations.length === 0) return;

        const widget = document.createElement('div');
        widget.className = 'recommendation-widget customers-also-bought';
        widget.innerHTML = `
            <div class="widget-header">
                <h3>Customers Who Bought This Also Bought</h3>
                <p>Discover products loved by customers like you</p>
            </div>
            <div class="recommendation-carousel">
                <div class="carousel-container">
                    <button class="carousel-btn prev" aria-label="Previous products">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="carousel-track">
                        ${recommendations.map(product => this.createRecommendationCard(product)).join('')}
                    </div>
                    <button class="carousel-btn next" aria-label="Next products">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;

        this.insertWidgetAfterProductDetails(widget);
        this.setupCarouselNavigation(widget);
    }

    createFrequentlyBoughtTogetherWidget() {
        const productId = this.getCurrentProductId();
        const currentProduct = this.getProductById(productId);
        const recommendations = this.generateRecommendations(productId, 'frequently_bought');
        
        if (recommendations.length === 0) return;

        const totalPrice = currentProduct.price + recommendations.reduce((sum, p) => sum + p.price, 0);
        const bundlePrice = totalPrice * 0.9; // 10% bundle discount
        const savings = totalPrice - bundlePrice;

        const widget = document.createElement('div');
        widget.className = 'recommendation-widget frequently-bought-together';
        widget.innerHTML = `
            <div class="widget-header">
                <h3>Frequently Bought Together</h3>
                <p>Save when you buy these items together</p>
            </div>
            <div class="bundle-container">
                <div class="bundle-products">
                    <div class="bundle-item current-product">
                        <img src="${currentProduct.image}" alt="${currentProduct.name}" loading="lazy">
                        <h4>${currentProduct.name}</h4>
                        <span class="price">$${currentProduct.price.toFixed(2)}</span>
                        <div class="bundle-check">
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                    ${recommendations.slice(0, 2).map(product => `
                        <div class="bundle-item">
                            <img src="${product.image}" alt="${product.name}" loading="lazy">
                            <h4>${product.name}</h4>
                            <span class="price">$${product.price.toFixed(2)}</span>
                            <label class="bundle-checkbox">
                                <input type="checkbox" checked data-product-id="${product.id}">
                                <span class="checkmark"></span>
                            </label>
                        </div>
                    `).join('')}
                </div>
                <div class="bundle-pricing">
                    <div class="pricing-details">
                        <div class="original-price">
                            <span>Total: <del>$${totalPrice.toFixed(2)}</del></span>
                        </div>
                        <div class="bundle-price">
                            <span>Bundle Price: $${bundlePrice.toFixed(2)}</span>
                        </div>
                        <div class="savings">
                            <span>You Save: $${savings.toFixed(2)} (${Math.round((savings/totalPrice)*100)}%)</span>
                        </div>
                    </div>
                    <button class="btn btn-primary add-bundle-to-cart">
                        <i class="fas fa-shopping-cart"></i>
                        Add Selected to Cart
                    </button>
                </div>
            </div>
        `;

        this.insertWidgetAfterProductDetails(widget);
        this.setupBundleInteractions(widget);
    }

    createRecentlyViewedWidget() {
        const recentProducts = this.getRecentlyViewedProducts();
        if (recentProducts.length === 0) return;

        const widget = document.createElement('div');
        widget.className = 'recommendation-widget recently-viewed';
        widget.innerHTML = `
            <div class="widget-header">
                <h3>Recently Viewed</h3>
                <p>Continue where you left off</p>
            </div>
            <div class="recently-viewed-grid">
                ${recentProducts.map(product => this.createRecommendationCard(product, 'compact')).join('')}
            </div>
        `;

        // Add to sidebar or bottom of page
        const sidebar = document.querySelector('.sidebar') || document.querySelector('main');
        if (sidebar) {
            sidebar.appendChild(widget);
        }
    }

    createRecommendationCard(product, style = 'default') {
        const isCompact = style === 'compact';
        
        return `
            <div class="recommendation-card ${isCompact ? 'compact' : ''}" data-product-id="${product.id}">
                <div class="card-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="card-overlay">
                        <button class="quick-add-btn" data-product-id="${product.id}">
                            <i class="fas fa-plus"></i>
                            Quick Add
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <h4>${product.name}</h4>
                    <div class="product-rating">
                        ${this.generateStarRating(product.rating)}
                        <span class="review-count">(${product.reviews})</span>
                    </div>
                    <div class="price-container">
                        <span class="price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    ${!isCompact ? `
                        <div class="card-actions">
                            <button class="btn btn-secondary add-to-cart" data-product-id="${product.id}">
                                Add to Cart
                            </button>
                            <button class="btn btn-icon wishlist-btn" data-product-id="${product.id}">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Utility Functions
    trackProductViews() {
        if (this.isProductPage()) {
            const productId = this.getCurrentProductId();
            this.addToViewingHistory(productId);
        }
    }

    addToViewingHistory(productId) {
        this.viewingHistory = this.viewingHistory.filter(id => id !== productId);
        this.viewingHistory.unshift(productId);
        this.viewingHistory = this.viewingHistory.slice(0, 10); // Keep last 10
        this.saveViewingHistory();
    }

    getRecentlyViewedProducts() {
        return this.viewingHistory
            .map(id => this.getProductById(id))
            .filter(product => product)
            .slice(0, 4);
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
    }

    // Data Management
    loadViewingHistory() {
        const saved = localStorage.getItem('midasBeautyViewingHistory');
        return saved ? JSON.parse(saved) : [];
    }

    saveViewingHistory() {
        localStorage.setItem('midasBeautyViewingHistory', JSON.stringify(this.viewingHistory));
    }

    loadPurchaseHistory() {
        const saved = localStorage.getItem('midasBeautyPurchaseHistory');
        return saved ? JSON.parse(saved) : [];
    }

    // Helper Functions
    isProductPage() {
        return window.location.pathname.includes('product-details') || 
               document.querySelector('.product-detail-container');
    }

    getCurrentProductId() {
        // Extract product ID from URL or page data
        const urlParts = window.location.pathname.split('/');
        const htmlFile = urlParts[urlParts.length - 1];
        return htmlFile.replace('.html', '');
    }

    getProductById(id) {
        // Get product from global products database
        if (window.productsDatabase && window.productsDatabase.products) {
            return window.productsDatabase.products.find(p => p.id === id);
        }
        return null;
    }

    getAllProducts() {
        if (window.productsDatabase && window.productsDatabase.products) {
            return window.productsDatabase.products;
        }
        return [];
    }

    insertWidgetAfterProductDetails(widget) {
        const productDetails = document.querySelector('.product-detail-container') || 
                              document.querySelector('.product-info') ||
                              document.querySelector('main');
        
        if (productDetails) {
            productDetails.appendChild(widget);
        }
    }

    setupCarouselNavigation(widget) {
        const prevBtn = widget.querySelector('.carousel-btn.prev');
        const nextBtn = widget.querySelector('.carousel-btn.next');
        const track = widget.querySelector('.carousel-track');
        
        if (!track) return;

        let currentIndex = 0;
        const cardWidth = 280; // Including margin
        const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
        const maxIndex = Math.max(0, track.children.length - visibleCards);

        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = Math.min(maxIndex, currentIndex + 1);
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        });
    }

    setupBundleInteractions(widget) {
        const checkboxes = widget.querySelectorAll('input[type="checkbox"]');
        const addBundleBtn = widget.querySelector('.add-bundle-to-cart');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateBundlePricing(widget);
            });
        });

        addBundleBtn.addEventListener('click', () => {
            this.addBundleToCart(widget);
        });
    }

    updateBundlePricing(widget) {
        // Recalculate pricing based on selected items
        const checkboxes = widget.querySelectorAll('input[type="checkbox"]:checked');
        const currentProduct = this.getProductById(this.getCurrentProductId());
        
        let totalPrice = currentProduct.price;
        checkboxes.forEach(checkbox => {
            const productId = checkbox.getAttribute('data-product-id');
            const product = this.getProductById(productId);
            if (product) totalPrice += product.price;
        });

        const bundlePrice = totalPrice * 0.9;
        const savings = totalPrice - bundlePrice;

        widget.querySelector('.original-price span').innerHTML = `Total: <del>$${totalPrice.toFixed(2)}</del>`;
        widget.querySelector('.bundle-price span').textContent = `Bundle Price: $${bundlePrice.toFixed(2)}`;
        widget.querySelector('.savings span').textContent = `You Save: $${savings.toFixed(2)} (${Math.round((savings/totalPrice)*100)}%)`;
    }

    addBundleToCart(widget) {
        const currentProductId = this.getCurrentProductId();
        const selectedCheckboxes = widget.querySelectorAll('input[type="checkbox"]:checked');
        
        // Add current product
        if (window.cart) {
            window.cart.addItem(this.getProductById(currentProductId));
            
            // Add selected bundle items
            selectedCheckboxes.forEach(checkbox => {
                const productId = checkbox.getAttribute('data-product-id');
                const product = this.getProductById(productId);
                if (product) {
                    window.cart.addItem(product);
                }
            });
        }

        // Show success message
        this.showNotification('Bundle added to cart successfully!', 'success');
        
        // Track analytics
        this.trackBundleAddToCart(currentProductId, Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-product-id')));
    }

    setupAnalytics() {
        // Track recommendation clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.recommendation-card')) {
                const card = e.target.closest('.recommendation-card');
                const productId = card.getAttribute('data-product-id');
                this.trackRecommendationClick(productId);
            }
        });
    }

    trackRecommendationClick(productId) {
        // Store analytics data
        const analyticsData = {
            event: 'recommendation_click',
            productId: productId,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
        
        const existingAnalytics = JSON.parse(localStorage.getItem('midasBeautyAnalytics') || '[]');
        existingAnalytics.push(analyticsData);
        localStorage.setItem('midasBeautyAnalytics', JSON.stringify(existingAnalytics));
    }

    trackBundleAddToCart(mainProductId, bundleProductIds) {
        const analyticsData = {
            event: 'bundle_add_to_cart',
            mainProduct: mainProductId,
            bundleProducts: bundleProductIds,
            timestamp: new Date().toISOString()
        };
        
        const existingAnalytics = JSON.parse(localStorage.getItem('midasBeautyAnalytics') || '[]');
        existingAnalytics.push(analyticsData);
        localStorage.setItem('midasBeautyAnalytics', JSON.stringify(existingAnalytics));
    }

    showNotification(message, type = 'success') {
        // Reuse existing notification system
        if (window.enhancedNavigation) {
            window.enhancedNavigation.showNotification(message, type);
        }
    }

    getViewedCategories() {
        return [...new Set(this.viewingHistory
            .map(id => this.getProductById(id))
            .filter(p => p)
            .map(p => p.category))];
    }

    getPreferredBrands() {
        const brandCounts = {};
        this.viewingHistory
            .map(id => this.getProductById(id))
            .filter(p => p)
            .forEach(p => {
                brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
            });
        
        return Object.keys(brandCounts)
            .sort((a, b) => brandCounts[b] - brandCounts[a])
            .slice(0, 3);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.productRecommendationEngine = new ProductRecommendationEngine();
});

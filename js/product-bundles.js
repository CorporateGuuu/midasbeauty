// Product Bundles and Dynamic Pricing System for MidasBeauty
// Handles themed bundles, build-your-own bundles, and tiered discounts

class ProductBundleSystem {
    constructor() {
        this.bundles = this.initializePresetBundles();
        this.customBundle = {
            items: [],
            totalPrice: 0,
            discount: 0,
            finalPrice: 0
        };
        this.discountTiers = {
            3: 0.10, // 10% off for 3 items
            4: 0.12, // 12% off for 4 items
            5: 0.15, // 15% off for 5+ items
        };
        this.init();
    }

    init() {
        this.createBundlePages();
        this.setupBundleInteractions();
        this.setupCustomBundleBuilder();
        this.trackBundleAnalytics();
    }

    initializePresetBundles() {
        return {
            'complete-skincare': {
                id: 'complete-skincare',
                name: 'Complete Skincare Routine',
                description: 'Everything you need for glowing, healthy skin. Perfect for morning and evening routines.',
                category: 'skincare',
                products: [
                    'radiance-serum',
                    'hydrating-moisturizer', 
                    'gentle-cleanser',
                    'vitamin-c-serum'
                ],
                originalPrice: 150,
                bundlePrice: 120,
                savings: 30,
                savingsPercentage: 20,
                image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
                benefits: [
                    'Complete morning & evening routine',
                    'Suitable for all skin types',
                    'Dermatologist recommended',
                    'Free skincare consultation included'
                ],
                featured: true
            },
            'makeup-essentials': {
                id: 'makeup-essentials',
                name: 'Makeup Essentials Kit',
                description: 'Professional makeup basics for any occasion. Create stunning looks from natural to glamorous.',
                category: 'makeup',
                products: [
                    'velvet-foundation',
                    'volumizing-mascara',
                    'luxury-lipstick',
                    'blush-palette'
                ],
                originalPrice: 200,
                bundlePrice: 160,
                savings: 40,
                savingsPercentage: 20,
                image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
                benefits: [
                    'Professional makeup artist approved',
                    'Long-lasting formulas',
                    'Suitable for all occasions',
                    'Free makeup tutorial videos'
                ],
                featured: true
            },
            'luxury-haircare': {
                id: 'luxury-haircare',
                name: 'Luxury Hair Care Set',
                description: 'Restore and nourish your hair with premium salon-quality products.',
                category: 'haircare',
                products: [
                    'repair-shampoo',
                    'hydrating-conditioner',
                    'hair-treatment',
                    'hair-oil'
                ],
                originalPrice: 100,
                bundlePrice: 80,
                savings: 20,
                savingsPercentage: 20,
                image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=300&fit=crop',
                benefits: [
                    'Salon-quality results at home',
                    'Repairs damaged hair',
                    'Suitable for all hair types',
                    'Free hair care guide included'
                ],
                featured: true
            },
            'anti-aging-collection': {
                id: 'anti-aging-collection',
                name: 'Anti-Aging Collection',
                description: 'Advanced anti-aging skincare for mature skin. Turn back time with proven ingredients.',
                category: 'skincare',
                products: [
                    'retinol-serum',
                    'anti-aging-cream',
                    'eye-cream',
                    'peptide-mask'
                ],
                originalPrice: 180,
                bundlePrice: 135,
                savings: 45,
                savingsPercentage: 25,
                image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=300&fit=crop',
                benefits: [
                    'Clinically proven ingredients',
                    'Visible results in 4 weeks',
                    'Dermatologist tested',
                    'Free anti-aging consultation'
                ],
                featured: false
            },
            'bridal-beauty': {
                id: 'bridal-beauty',
                name: 'Bridal Beauty Package',
                description: 'Everything for your perfect wedding day look. Long-lasting, photo-ready formulas.',
                category: 'makeup',
                products: [
                    'bridal-foundation',
                    'waterproof-mascara',
                    'long-wear-lipstick',
                    'setting-spray',
                    'highlighter-palette'
                ],
                originalPrice: 250,
                bundlePrice: 200,
                savings: 50,
                savingsPercentage: 20,
                image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop',
                benefits: [
                    'Long-lasting 12+ hours',
                    'Photo-ready finish',
                    'Waterproof formulas',
                    'Free bridal makeup trial'
                ],
                featured: false
            }
        };
    }

    createBundlePages() {
        this.createBundleShowcase();
        this.createCustomBundleBuilder();
    }

    createBundleShowcase() {
        // Add bundle showcase to homepage or dedicated bundles page
        const bundleSection = document.createElement('section');
        bundleSection.className = 'bundle-showcase';
        bundleSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2>Curated Beauty Bundles</h2>
                    <p>Save more when you shop our expertly curated product collections</p>
                </div>
                <div class="bundle-grid">
                    ${Object.values(this.bundles)
                        .filter(bundle => bundle.featured)
                        .map(bundle => this.createBundleCard(bundle))
                        .join('')}
                </div>
                <div class="bundle-cta">
                    <a href="#custom-bundle-builder" class="btn btn-secondary">
                        <i class="fas fa-plus"></i>
                        Build Your Own Bundle
                    </a>
                    <a href="bundles.html" class="btn btn-outline">
                        View All Bundles
                    </a>
                </div>
            </div>
        `;

        // Insert after testimonials or before footer
        const testimonials = document.querySelector('.testimonials');
        const footer = document.querySelector('footer');
        const insertPoint = testimonials ? testimonials.nextElementSibling : footer;
        
        if (insertPoint) {
            insertPoint.parentNode.insertBefore(bundleSection, insertPoint);
        }
    }

    createBundleCard(bundle) {
        const products = bundle.products.map(id => this.getProductById(id)).filter(p => p);
        
        return `
            <div class="bundle-card" data-bundle-id="${bundle.id}">
                <div class="bundle-image">
                    <img src="${bundle.image}" alt="${bundle.name}" loading="lazy">
                    <div class="bundle-badge">
                        <span class="savings-badge">Save ${bundle.savingsPercentage}%</span>
                    </div>
                    <div class="bundle-overlay">
                        <button class="btn btn-primary view-bundle-btn" data-bundle-id="${bundle.id}">
                            <i class="fas fa-eye"></i>
                            View Bundle
                        </button>
                    </div>
                </div>
                <div class="bundle-content">
                    <div class="bundle-category">${bundle.category.toUpperCase()}</div>
                    <h3>${bundle.name}</h3>
                    <p class="bundle-description">${bundle.description}</p>
                    
                    <div class="bundle-products-preview">
                        <div class="product-thumbnails">
                            ${products.slice(0, 3).map(product => `
                                <img src="${product.image}" alt="${product.name}" class="product-thumb" title="${product.name}">
                            `).join('')}
                            ${products.length > 3 ? `<div class="more-products">+${products.length - 3}</div>` : ''}
                        </div>
                        <span class="product-count">${products.length} products included</span>
                    </div>
                    
                    <div class="bundle-pricing">
                        <div class="original-price">
                            <span>Individual Price: <del>$${bundle.originalPrice.toFixed(2)}</del></span>
                        </div>
                        <div class="bundle-price">
                            <span class="price">$${bundle.bundlePrice.toFixed(2)}</span>
                            <span class="savings">Save $${bundle.savings.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="bundle-benefits">
                        <ul>
                            ${bundle.benefits.slice(0, 2).map(benefit => `<li><i class="fas fa-check"></i>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="bundle-actions">
                        <button class="btn btn-primary add-bundle-to-cart" data-bundle-id="${bundle.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add Bundle to Cart
                        </button>
                        <button class="btn btn-icon wishlist-bundle" data-bundle-id="${bundle.id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createCustomBundleBuilder() {
        const builderSection = document.createElement('section');
        builderSection.id = 'custom-bundle-builder';
        builderSection.className = 'custom-bundle-builder';
        builderSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2>Build Your Own Bundle</h2>
                    <p>Create your perfect beauty routine and save with our tiered discounts</p>
                </div>
                
                <div class="bundle-builder-container">
                    <div class="product-selector">
                        <div class="category-filters">
                            <button class="filter-btn active" data-category="all">All Products</button>
                            <button class="filter-btn" data-category="skincare">Skincare</button>
                            <button class="filter-btn" data-category="makeup">Makeup</button>
                            <button class="filter-btn" data-category="haircare">Haircare</button>
                        </div>
                        
                        <div class="products-grid" id="bundle-products-grid">
                            <!-- Products will be populated here -->
                        </div>
                    </div>
                    
                    <div class="bundle-summary">
                        <div class="summary-header">
                            <h3>Your Custom Bundle</h3>
                            <div class="discount-tiers">
                                <div class="tier" data-items="3">
                                    <span class="tier-items">3 items</span>
                                    <span class="tier-discount">10% off</span>
                                </div>
                                <div class="tier" data-items="4">
                                    <span class="tier-items">4 items</span>
                                    <span class="tier-discount">12% off</span>
                                </div>
                                <div class="tier active" data-items="5">
                                    <span class="tier-items">5+ items</span>
                                    <span class="tier-discount">15% off</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="selected-products" id="selected-products">
                            <div class="empty-bundle">
                                <i class="fas fa-plus-circle"></i>
                                <p>Start building your bundle by selecting products</p>
                            </div>
                        </div>
                        
                        <div class="bundle-pricing-summary" id="bundle-pricing-summary" style="display: none;">
                            <div class="pricing-row">
                                <span>Subtotal:</span>
                                <span id="bundle-subtotal">$0.00</span>
                            </div>
                            <div class="pricing-row discount-row">
                                <span>Discount (<span id="discount-percentage">0</span>%):</span>
                                <span id="bundle-discount">-$0.00</span>
                            </div>
                            <div class="pricing-row total-row">
                                <span>Total:</span>
                                <span id="bundle-total">$0.00</span>
                            </div>
                            <div class="savings-highlight">
                                <span>You save: <strong id="total-savings">$0.00</strong></span>
                            </div>
                        </div>
                        
                        <div class="bundle-actions">
                            <button class="btn btn-primary add-custom-bundle" id="add-custom-bundle" disabled>
                                <i class="fas fa-shopping-cart"></i>
                                Add Bundle to Cart
                            </button>
                            <button class="btn btn-secondary clear-bundle" id="clear-bundle">
                                <i class="fas fa-trash"></i>
                                Clear Bundle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert after bundle showcase
        const bundleShowcase = document.querySelector('.bundle-showcase');
        if (bundleShowcase) {
            bundleShowcase.parentNode.insertBefore(builderSection, bundleShowcase.nextSibling);
        }

        this.populateProductGrid();
    }

    populateProductGrid() {
        const grid = document.getElementById('bundle-products-grid');
        if (!grid) return;

        const products = this.getAllProducts();
        
        grid.innerHTML = products.map(product => `
            <div class="bundle-product-card" data-product-id="${product.id}" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-overlay">
                        <button class="add-to-bundle-btn" data-product-id="${product.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <div class="product-rating">
                        ${this.generateStarRating(product.rating)}
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </div>
                <div class="selection-indicator">
                    <i class="fas fa-check"></i>
                </div>
            </div>
        `).join('');
    }

    setupBundleInteractions() {
        // Bundle card interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-bundle-to-cart')) {
                const bundleId = e.target.closest('.add-bundle-to-cart').getAttribute('data-bundle-id');
                this.addPresetBundleToCart(bundleId);
            }
            
            if (e.target.closest('.view-bundle-btn')) {
                const bundleId = e.target.closest('.view-bundle-btn').getAttribute('data-bundle-id');
                this.showBundleDetails(bundleId);
            }
        });
    }

    setupCustomBundleBuilder() {
        // Category filters
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.filterProducts(e.target.getAttribute('data-category'));
                
                // Update active filter
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            }
            
            if (e.target.closest('.add-to-bundle-btn')) {
                const productId = e.target.closest('.add-to-bundle-btn').getAttribute('data-product-id');
                this.addToCustomBundle(productId);
            }
            
            if (e.target.closest('.remove-from-bundle')) {
                const productId = e.target.closest('.remove-from-bundle').getAttribute('data-product-id');
                this.removeFromCustomBundle(productId);
            }
            
            if (e.target.id === 'add-custom-bundle') {
                this.addCustomBundleToCart();
            }
            
            if (e.target.id === 'clear-bundle') {
                this.clearCustomBundle();
            }
        });
    }

    filterProducts(category) {
        const cards = document.querySelectorAll('.bundle-product-card');
        
        cards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    addToCustomBundle(productId) {
        const product = this.getProductById(productId);
        if (!product) return;

        // Check if already in bundle
        if (this.customBundle.items.find(item => item.id === productId)) {
            this.showNotification('Product already in bundle', 'info');
            return;
        }

        // Add to bundle
        this.customBundle.items.push(product);
        this.updateCustomBundleDisplay();
        this.updateProductCardState(productId, true);
        
        // Track analytics
        this.trackCustomBundleAction('add_product', productId);
    }

    removeFromCustomBundle(productId) {
        this.customBundle.items = this.customBundle.items.filter(item => item.id !== productId);
        this.updateCustomBundleDisplay();
        this.updateProductCardState(productId, false);
        
        // Track analytics
        this.trackCustomBundleAction('remove_product', productId);
    }

    updateCustomBundleDisplay() {
        const selectedContainer = document.getElementById('selected-products');
        const pricingSummary = document.getElementById('bundle-pricing-summary');
        const addButton = document.getElementById('add-custom-bundle');
        
        if (this.customBundle.items.length === 0) {
            selectedContainer.innerHTML = `
                <div class="empty-bundle">
                    <i class="fas fa-plus-circle"></i>
                    <p>Start building your bundle by selecting products</p>
                </div>
            `;
            pricingSummary.style.display = 'none';
            addButton.disabled = true;
            return;
        }

        // Calculate pricing
        this.calculateCustomBundlePricing();
        
        // Update selected products display
        selectedContainer.innerHTML = this.customBundle.items.map(product => `
            <div class="selected-product">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-details">
                    <h5>${product.name}</h5>
                    <span class="price">$${product.price.toFixed(2)}</span>
                </div>
                <button class="remove-from-bundle" data-product-id="${product.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Update pricing summary
        document.getElementById('bundle-subtotal').textContent = `$${this.customBundle.totalPrice.toFixed(2)}`;
        document.getElementById('bundle-discount').textContent = `-$${this.customBundle.discount.toFixed(2)}`;
        document.getElementById('bundle-total').textContent = `$${this.customBundle.finalPrice.toFixed(2)}`;
        document.getElementById('total-savings').textContent = `$${this.customBundle.discount.toFixed(2)}`;
        document.getElementById('discount-percentage').textContent = Math.round((this.customBundle.discount / this.customBundle.totalPrice) * 100);

        // Update discount tier indicators
        this.updateDiscountTierDisplay();
        
        pricingSummary.style.display = 'block';
        addButton.disabled = this.customBundle.items.length < 3;
    }

    calculateCustomBundlePricing() {
        const itemCount = this.customBundle.items.length;
        this.customBundle.totalPrice = this.customBundle.items.reduce((sum, item) => sum + item.price, 0);
        
        // Apply tiered discount
        let discountRate = 0;
        if (itemCount >= 5) discountRate = this.discountTiers[5];
        else if (itemCount >= 4) discountRate = this.discountTiers[4];
        else if (itemCount >= 3) discountRate = this.discountTiers[3];
        
        this.customBundle.discount = this.customBundle.totalPrice * discountRate;
        this.customBundle.finalPrice = this.customBundle.totalPrice - this.customBundle.discount;
    }

    updateDiscountTierDisplay() {
        const itemCount = this.customBundle.items.length;
        const tiers = document.querySelectorAll('.tier');
        
        tiers.forEach(tier => {
            const tierItems = parseInt(tier.getAttribute('data-items'));
            tier.classList.remove('active', 'achieved');
            
            if (tierItems <= itemCount) {
                tier.classList.add('achieved');
            }
            
            if ((tierItems === 3 && itemCount >= 3 && itemCount < 4) ||
                (tierItems === 4 && itemCount >= 4 && itemCount < 5) ||
                (tierItems === 5 && itemCount >= 5)) {
                tier.classList.add('active');
            }
        });
    }

    updateProductCardState(productId, selected) {
        const card = document.querySelector(`[data-product-id="${productId}"]`);
        if (card) {
            if (selected) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        }
    }

    addPresetBundleToCart(bundleId) {
        const bundle = this.bundles[bundleId];
        if (!bundle) return;

        const products = bundle.products.map(id => this.getProductById(id)).filter(p => p);
        
        if (window.cart) {
            products.forEach(product => {
                window.cart.addItem(product);
            });
        }

        this.showNotification(`${bundle.name} added to cart!`, 'success');
        this.trackBundlePurchase(bundleId, 'preset');
    }

    addCustomBundleToCart() {
        if (this.customBundle.items.length < 3) {
            this.showNotification('Please select at least 3 items for bundle discount', 'warning');
            return;
        }

        if (window.cart) {
            this.customBundle.items.forEach(product => {
                window.cart.addItem(product);
            });
        }

        this.showNotification(`Custom bundle added to cart! You saved $${this.customBundle.discount.toFixed(2)}`, 'success');
        this.trackBundlePurchase('custom', 'custom', this.customBundle.items.map(p => p.id));
        this.clearCustomBundle();
    }

    clearCustomBundle() {
        this.customBundle.items = [];
        this.updateCustomBundleDisplay();
        
        // Reset all product card states
        document.querySelectorAll('.bundle-product-card.selected').forEach(card => {
            card.classList.remove('selected');
        });
    }

    showBundleDetails(bundleId) {
        const bundle = this.bundles[bundleId];
        if (!bundle) return;

        // Create modal or navigate to bundle detail page
        // For now, show a detailed popup
        this.showNotification(`${bundle.name} - ${bundle.description}`, 'info');
    }

    // Utility Functions
    getProductById(id) {
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

    showNotification(message, type = 'success') {
        if (window.enhancedNavigation) {
            window.enhancedNavigation.showNotification(message, type);
        }
    }

    // Analytics
    trackBundlePurchase(bundleId, type, productIds = []) {
        const analyticsData = {
            event: 'bundle_purchase',
            bundleId: bundleId,
            bundleType: type,
            productIds: productIds,
            timestamp: new Date().toISOString(),
            savings: type === 'custom' ? this.customBundle.discount : this.bundles[bundleId]?.savings || 0
        };
        
        const existingAnalytics = JSON.parse(localStorage.getItem('midasBeautyAnalytics') || '[]');
        existingAnalytics.push(analyticsData);
        localStorage.setItem('midasBeautyAnalytics', JSON.stringify(existingAnalytics));
    }

    trackCustomBundleAction(action, productId) {
        const analyticsData = {
            event: 'custom_bundle_action',
            action: action,
            productId: productId,
            bundleSize: this.customBundle.items.length,
            timestamp: new Date().toISOString()
        };
        
        const existingAnalytics = JSON.parse(localStorage.getItem('midasBeautyAnalytics') || '[]');
        existingAnalytics.push(analyticsData);
        localStorage.setItem('midasBeautyAnalytics', JSON.stringify(existingAnalytics));
    }

    trackBundleAnalytics() {
        // Track bundle page views and interactions
        const analyticsData = {
            event: 'bundle_page_view',
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
        
        const existingAnalytics = JSON.parse(localStorage.getItem('midasBeautyAnalytics') || '[]');
        existingAnalytics.push(analyticsData);
        localStorage.setItem('midasBeautyAnalytics', JSON.stringify(existingAnalytics));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.productBundleSystem = new ProductBundleSystem();
});

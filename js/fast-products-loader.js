// Fast Products Loader for MidasBeauty
// Optimized for quick loading and performance

class FastProductsLoader {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.isLoading = false;
        this.filters = {
            category: 'all',
            brand: 'all',
            price: 'all',
            sort: 'featured'
        };
        this.init();
    }

    async init() {
        console.log('🚀 Fast Products Loader initializing...');
        
        // Show loading state immediately
        this.showLoadingState();
        
        try {
            // Load products quickly
            await this.loadProducts();
            
            // Setup filters
            this.setupFilters();
            
            // Parse URL parameters
            this.parseURLFilters();
            
            // Display products
            this.displayProducts();
            
            // Setup interactions
            this.setupInteractions();
            
            console.log('✅ Products loaded successfully');
            
        } catch (error) {
            console.error('❌ Products loading failed:', error);
            this.showErrorState();
        }
    }

    async loadProducts() {
        // Try to get products from existing systems first
        if (window.productDatabaseManager) {
            this.products = window.productDatabaseManager.getAllProducts();
        } else if (window.midasBeautyProductDatabase) {
            this.products = window.midasBeautyProductDatabase.products;
        } else {
            // Use fallback products for immediate display
            this.products = this.getFallbackProducts();
        }

        // If no products, wait a bit and try again
        if (this.products.length === 0) {
            await this.waitAndRetry();
        }

        this.filteredProducts = [...this.products];
    }

    async waitAndRetry() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 10;
            
            const checkProducts = () => {
                attempts++;
                
                if (window.productDatabaseManager) {
                    this.products = window.productDatabaseManager.getAllProducts();
                } else if (window.midasBeautyProductDatabase) {
                    this.products = window.midasBeautyProductDatabase.products;
                }
                
                if (this.products.length > 0 || attempts >= maxAttempts) {
                    resolve();
                } else {
                    setTimeout(checkProducts, 200);
                }
            };
            
            setTimeout(checkProducts, 100);
        });
    }

    parseURLFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Parse filter parameter
        const filter = urlParams.get('filter');
        if (filter) {
            switch (filter) {
                case 'new':
                    this.filters.sort = 'newest';
                    break;
                case 'sale':
                    this.filters.price = 'sale';
                    break;
                case 'skincare':
                case 'makeup':
                case 'haircare':
                case 'fragrance':
                    this.filters.category = filter;
                    break;
            }
        }
        
        // Parse other parameters
        const category = urlParams.get('category');
        if (category) this.filters.category = category;
        
        const brand = urlParams.get('brand');
        if (brand) this.filters.brand = brand;
        
        const sort = urlParams.get('sort');
        if (sort) this.filters.sort = sort;
        
        // Update filter UI
        this.updateFilterUI();
    }

    updateFilterUI() {
        const categoryFilter = document.getElementById('category-filter');
        const brandFilter = document.getElementById('brand-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (categoryFilter) categoryFilter.value = this.filters.category;
        if (brandFilter) brandFilter.value = this.filters.brand;
        if (sortFilter) sortFilter.value = this.filters.sort;
        
        // Update category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === this.filters.category) {
                btn.classList.add('active');
            }
        });
    }

    setupFilters() {
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.filters.category = btn.dataset.category;
                this.applyFilters();
                this.updateCategoryButtons();
            });
        });

        // Filter dropdowns
        const categoryFilter = document.getElementById('category-filter');
        const brandFilter = document.getElementById('brand-filter');
        const priceFilter = document.getElementById('price-filter');
        const sortFilter = document.getElementById('sort-filter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filters.category = categoryFilter.value;
                this.applyFilters();
            });
        }

        if (brandFilter) {
            brandFilter.addEventListener('change', () => {
                this.filters.brand = brandFilter.value;
                this.applyFilters();
            });
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', () => {
                this.filters.price = priceFilter.value;
                this.applyFilters();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.filters.sort = sortFilter.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        this.showLoadingState();
        
        // Filter products
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.category !== 'all' && product.category !== this.filters.category) {
                return false;
            }
            
            // Brand filter
            if (this.filters.brand !== 'all' && product.brand !== this.filters.brand) {
                return false;
            }
            
            // Price filter
            if (this.filters.price !== 'all') {
                const price = product.salePrice || product.price;
                switch (this.filters.price) {
                    case '0-25':
                        if (price > 25) return false;
                        break;
                    case '25-50':
                        if (price < 25 || price > 50) return false;
                        break;
                    case '50-100':
                        if (price < 50 || price > 100) return false;
                        break;
                    case '100+':
                        if (price < 100) return false;
                        break;
                    case 'sale':
                        if (!product.salePrice) return false;
                        break;
                }
            }
            
            return true;
        });

        // Sort products
        this.sortProducts();
        
        // Reset pagination
        this.currentPage = 1;
        
        // Display filtered products
        this.displayProducts();
        
        // Update URL
        this.updateURL();
    }

    sortProducts() {
        switch (this.filters.sort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));
                break;
            case 'featured':
            default:
                this.filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
        }
    }

    displayProducts() {
        const grid = document.getElementById('products-grid');
        const loading = document.getElementById('products-loading');
        const noProducts = document.getElementById('no-products');
        
        if (loading) loading.style.display = 'none';
        
        if (this.filteredProducts.length === 0) {
            if (grid) grid.style.display = 'none';
            if (noProducts) noProducts.style.display = 'block';
            return;
        }
        
        if (noProducts) noProducts.style.display = 'none';
        if (grid) {
            grid.style.display = 'grid';
            
            // Calculate products to show
            const startIndex = 0;
            const endIndex = this.currentPage * this.productsPerPage;
            const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
            
            grid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
            
            // Setup product interactions
            this.setupProductInteractions();
            
            // Show/hide load more button
            this.updateLoadMoreButton();
        }
    }

    createProductCard(product) {
        const hasDiscount = product.salePrice && product.salePrice < product.price;
        const discountPercent = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
        const rating = product.rating || 4.5;
        const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.images?.[0] || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop'}" 
                         alt="${product.name}" 
                         class="product-image"
                         loading="lazy">
                    ${hasDiscount ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                    <div class="product-overlay">
                        <button class="btn-quick-view" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i>
                            Quick View
                        </button>
                    </div>
                </div>
                
                <div class="product-info">
                    <div class="product-brand">${this.getBrandName(product.brand)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-count">(${product.reviewCount || 0})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.salePrice || product.price}</span>
                        ${hasDiscount ? `<span class="original-price">$${product.price}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn-wishlist" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupProductInteractions() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                this.addToCart(productId);
            });
        });

        // Wishlist buttons
        document.querySelectorAll('.btn-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                this.addToWishlist(productId);
            });
        });

        // Product cards
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.dataset.productId;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        });

        // Quick view buttons
        document.querySelectorAll('.btn-quick-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                this.showQuickView(productId);
            });
        });
    }

    setupInteractions() {
        // Clear filters button
        window.clearFilters = () => {
            this.filters = {
                category: 'all',
                brand: 'all',
                price: 'all',
                sort: 'featured'
            };
            this.updateFilterUI();
            this.applyFilters();
        };

        // Load more products
        window.loadMoreProducts = () => {
            this.currentPage++;
            this.displayProducts();
        };
    }

    addToCart(productId) {
        if (window.shoppingSystem) {
            window.shoppingSystem.addToCart(productId);
        } else if (window.midasBeautyEmergencyFixes) {
            window.midasBeautyEmergencyFixes.addToCart(productId);
        } else {
            this.showNotification('Added to cart!', 'success');
        }
    }

    addToWishlist(productId) {
        if (window.shoppingSystem) {
            window.shoppingSystem.addToWishlist(productId);
        } else {
            this.showNotification('Added to wishlist!', 'success');
        }
    }

    showQuickView(productId) {
        // Quick view functionality
        window.location.href = `product-detail.html?id=${productId}`;
    }

    updateCategoryButtons() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === this.filters.category) {
                btn.classList.add('active');
            }
        });
    }

    updateLoadMoreButton() {
        const loadMoreSection = document.getElementById('load-more-section');
        if (loadMoreSection) {
            const hasMore = this.currentPage * this.productsPerPage < this.filteredProducts.length;
            loadMoreSection.style.display = hasMore ? 'block' : 'none';
        }
    }

    updateURL() {
        const params = new URLSearchParams();
        
        if (this.filters.category !== 'all') params.set('category', this.filters.category);
        if (this.filters.brand !== 'all') params.set('brand', this.filters.brand);
        if (this.filters.price !== 'all') params.set('price', this.filters.price);
        if (this.filters.sort !== 'featured') params.set('sort', this.filters.sort);
        
        const newURL = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
        window.history.replaceState({}, '', newURL);
    }

    showLoadingState() {
        const loading = document.getElementById('products-loading');
        const grid = document.getElementById('products-grid');
        const noProducts = document.getElementById('no-products');
        
        if (loading) loading.style.display = 'block';
        if (grid) grid.style.display = 'none';
        if (noProducts) noProducts.style.display = 'none';
    }

    showErrorState() {
        const loading = document.getElementById('products-loading');
        const grid = document.getElementById('products-grid');
        
        if (loading) loading.style.display = 'none';
        if (grid) {
            grid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Unable to load products</h3>
                    <p>Please refresh the page or try again later</p>
                    <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
                </div>
            `;
            grid.style.display = 'block';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getBrandName(brandId) {
        const brandNames = {
            'midas-beauty': 'Midas Beauty',
            'luxe-radiance': 'Luxe Radiance',
            'velvet-luxe': 'Velvet Luxe',
            'pure-essence': 'Pure Essence',
            'golden-glow': 'Golden Glow',
            'royal-beauty': 'Royal Beauty',
            'radiant-glow': 'Radiant Glow',
            'golden-hour': 'Golden Hour'
        };
        return brandNames[brandId] || 'Premium Brand';
    }

    getFallbackProducts() {
        return [
            {
                id: 'fast-1',
                name: '24K Gold Radiance Serum',
                brand: 'midas-beauty',
                category: 'skincare',
                price: 89.99,
                salePrice: null,
                rating: 4.8,
                reviewCount: 156,
                featured: true,
                images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop'],
                dateAdded: Date.now() - 86400000
            },
            {
                id: 'fast-2',
                name: 'Velvet Matte Lipstick',
                brand: 'velvet-luxe',
                category: 'makeup',
                price: 45.00,
                salePrice: 36.00,
                rating: 4.6,
                reviewCount: 89,
                featured: true,
                images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'],
                dateAdded: Date.now() - 172800000
            },
            {
                id: 'fast-3',
                name: 'Hydrating Face Moisturizer',
                brand: 'pure-essence',
                category: 'skincare',
                price: 65.00,
                salePrice: null,
                rating: 4.7,
                reviewCount: 203,
                featured: false,
                images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop'],
                dateAdded: Date.now() - 259200000
            },
            {
                id: 'fast-4',
                name: 'Luxury Hair Serum',
                brand: 'golden-hour',
                category: 'haircare',
                price: 75.00,
                salePrice: 60.00,
                rating: 4.5,
                reviewCount: 124,
                featured: true,
                images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=300&h=300&fit=crop'],
                dateAdded: Date.now() - 345600000
            }
        ];
    }
}

// Initialize fast products loader
document.addEventListener('DOMContentLoaded', () => {
    window.fastProductsLoader = new FastProductsLoader();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FastProductsLoader;
}

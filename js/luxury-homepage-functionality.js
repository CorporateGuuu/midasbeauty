// Luxury Homepage Functionality for MidasBeauty
// Handles enhanced interactions, animations, and dynamic content loading

class LuxuryHomepage {
    constructor() {
        this.currentFilter = 'all';
        this.isLoading = false;
        this.products = [];
        this.heroProducts = [];
        this.init();
    }

    async init() {
        console.log('🏠 Luxury Homepage initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    async setup() {
        try {
            // Initialize components
            this.setupScrollEffects();
            this.setupFilterButtons();
            this.setupHeroAnimations();
            this.setupIntersectionObserver();
            
            // Load content
            await this.loadProducts();
            this.loadHeroProducts();
            this.setupProductInteractions();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            console.log('✅ Luxury Homepage ready');
            
        } catch (error) {
            console.error('❌ Homepage initialization failed:', error);
            this.showFallbackContent();
        }
    }

    // ===== SCROLL EFFECTS =====
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('header');
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Header scroll effect
            if (header) {
                if (currentScrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            // Parallax effect for hero
            this.updateParallax(currentScrollY);
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    updateParallax(scrollY) {
        const hero = document.querySelector('.hero');
        if (hero) {
            const speed = 0.5;
            hero.style.transform = `translateY(${scrollY * speed}px)`;
        }
        
        // Floating elements parallax
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }

    // ===== FILTER FUNCTIONALITY =====
    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const category = button.dataset.category;
                this.filterProducts(category);
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    async filterProducts(category) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.currentFilter = category;
        
        // Show loading state
        this.showLoadingState();
        
        try {
            // Filter products
            let filteredProducts = this.products;
            if (category !== 'all') {
                filteredProducts = this.products.filter(product => 
                    product.category === category
                );
            }
            
            // Animate out current products
            await this.animateProductsOut();
            
            // Display filtered products
            this.displayProducts(filteredProducts);
            
            // Animate in new products
            await this.animateProductsIn();
            
        } catch (error) {
            console.error('Filter error:', error);
            this.showErrorState();
        } finally {
            this.isLoading = false;
        }
    }

    // ===== PRODUCT LOADING =====
    async loadProducts() {
        try {
            // Wait for product database
            await this.waitForProductDatabase();
            
            if (window.productDatabaseManager) {
                this.products = window.productDatabaseManager.getFeaturedProducts() || 
                               window.productDatabaseManager.getAllProducts().slice(0, 8);
            } else {
                this.products = this.getFallbackProducts();
            }
            
            this.displayProducts(this.products);
            
        } catch (error) {
            console.error('Product loading error:', error);
            this.products = this.getFallbackProducts();
            this.displayProducts(this.products);
        }
    }

    waitForProductDatabase() {
        return new Promise((resolve) => {
            if (window.productDatabaseManager) {
                resolve();
                return;
            }
            
            const checkDatabase = setInterval(() => {
                if (window.productDatabaseManager) {
                    clearInterval(checkDatabase);
                    resolve();
                }
            }, 100);
            
            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkDatabase);
                resolve();
            }, 5000);
        });
    }

    displayProducts(products) {
        const grid = document.getElementById('featured-products-grid');
        if (!grid) return;

        if (products.length === 0) {
            grid.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--sophisticated-gray); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--sophisticated-gray); margin-bottom: 0.5rem;">No products found</h3>
                    <p style="color: var(--sophisticated-gray);">Try selecting a different category</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = products.map(product => this.createProductCard(product)).join('');
        
        // Setup product interactions
        this.setupProductInteractions();
    }

    createProductCard(product) {
        const hasDiscount = product.salePrice && product.salePrice < product.price;
        const discountPercent = hasDiscount ? 
            Math.round((1 - product.salePrice / product.price) * 100) : 0;

        return `
            <div class="product-card" data-product-id="${product.id}" data-aos="fade-up">
                <img src="${product.images?.[0] || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=250&fit=crop'}" 
                     alt="${product.name}" 
                     class="product-image"
                     loading="lazy">
                
                <div class="product-info">
                    <div class="product-brand">${this.getBrandName(product.brand)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description?.substring(0, 100)}...</p>
                    
                    <div class="product-rating">
                        <div class="rating-stars">${this.generateStars(product.rating || 4.5)}</div>
                        <span class="rating-text">(${product.reviewCount || 0} reviews)</span>
                    </div>
                    
                    <div class="product-price">
                        <span class="current-price">$${product.salePrice || product.price}</span>
                        ${hasDiscount ? `
                            <span class="original-price">$${product.price}</span>
                            <span class="discount-badge">${discountPercent}% OFF</span>
                        ` : ''}
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn-add-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn-wishlist" data-product-id="${product.id}" title="Add to Wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== HERO PRODUCTS =====
    loadHeroProducts() {
        const heroContainer = document.querySelector('.hero-products');
        if (!heroContainer) return;

        // Get top 4 featured products
        const topProducts = this.products.slice(0, 4);
        
        heroContainer.innerHTML = topProducts.map(product => `
            <div class="hero-product-card" data-product-id="${product.id}">
                <img src="${product.images?.[0] || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop'}" 
                     alt="${product.name}" 
                     class="hero-product-image"
                     loading="lazy">
                <div class="hero-product-name">${product.name}</div>
                <div class="hero-product-price">$${product.salePrice || product.price}</div>
            </div>
        `).join('');

        // Add click handlers
        heroContainer.querySelectorAll('.hero-product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.dataset.productId;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        });
    }

    // ===== ANIMATIONS =====
    setupHeroAnimations() {
        // Animate hero stats on scroll
        const stats = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const isTime = target.includes('/');
        
        if (isTime) return; // Skip time format
        
        const numericTarget = parseInt(target.replace(/[^\d]/g, ''));
        const duration = 2000;
        const increment = numericTarget / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericTarget) {
                current = numericTarget;
                clearInterval(timer);
            }
            
            element.textContent = isPercentage ? 
                `${Math.floor(current)}%` : 
                `${Math.floor(current)}${target.includes('+') ? '+' : ''}`;
        }, 16);
    }

    async animateProductsOut() {
        const cards = document.querySelectorAll('.product-card');
        
        return new Promise(resolve => {
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.transform = 'translateY(20px)';
                    card.style.opacity = '0';
                    
                    if (index === cards.length - 1) {
                        setTimeout(resolve, 300);
                    }
                }, index * 50);
            });
        });
    }

    async animateProductsIn() {
        const cards = document.querySelectorAll('.product-card');
        
        return new Promise(resolve => {
            cards.forEach((card, index) => {
                card.style.transform = 'translateY(20px)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                    
                    if (index === cards.length - 1) {
                        setTimeout(resolve, 600);
                    }
                }, index * 100);
            });
        });
    }

    // ===== PRODUCT INTERACTIONS =====
    setupProductInteractions() {
        // Add to cart buttons
        document.querySelectorAll('.btn-add-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.dataset.productId;
                this.addToCart(productId, button);
            });
        });

        // Wishlist buttons
        document.querySelectorAll('.btn-wishlist').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.dataset.productId;
                this.addToWishlist(productId, button);
            });
        });

        // Product card clicks
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.product-actions')) return;
                
                const productId = card.dataset.productId;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        });
    }

    addToCart(productId, button) {
        if (window.shoppingSystem) {
            window.shoppingSystem.addToCart(productId);
        } else if (window.midasBeautyEmergencyFixes) {
            window.midasBeautyEmergencyFixes.addToCart(productId);
        }
        
        // Visual feedback
        this.showButtonFeedback(button, 'Added!', 'success');
    }

    addToWishlist(productId, button) {
        if (window.shoppingSystem) {
            window.shoppingSystem.addToWishlist(productId);
        }
        
        // Visual feedback
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = '#28a745';
        button.style.borderColor = '#28a745';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-heart"></i>';
            button.style.background = 'transparent';
            button.style.borderColor = 'var(--primary-gold)';
            button.style.color = 'var(--primary-gold)';
        }, 2000);
    }

    showButtonFeedback(button, text, type) {
        const originalText = button.innerHTML;
        const originalStyle = button.style.cssText;
        
        button.innerHTML = text;
        button.style.background = type === 'success' ? '#28a745' : '#e74c3c';
        button.style.borderColor = type === 'success' ? '#28a745' : '#e74c3c';
        button.style.color = 'white';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.cssText = originalStyle;
            button.disabled = false;
        }, 2000);
    }

    // ===== INTERSECTION OBSERVER =====
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== UTILITY METHODS =====
    getBrandName(brandId) {
        const brandNames = {
            'midas-beauty': 'Midas Beauty',
            'luxe-radiance': 'Luxe Radiance',
            'velvet-luxe': 'Velvet Luxe',
            'pure-essence': 'Pure Essence',
            'golden-glow': 'Golden Glow',
            'royal-beauty': 'Royal Beauty'
        };
        return brandNames[brandId] || 'Premium Brand';
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    getFallbackProducts() {
        return [
            {
                id: 'fallback-1',
                name: '24K Gold Radiance Serum',
                brand: 'midas-beauty',
                category: 'skincare',
                price: 89.99,
                salePrice: null,
                rating: 4.8,
                reviewCount: 156,
                images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=250&fit=crop'],
                description: 'Luxurious anti-aging serum infused with 24K gold particles for radiant, youthful skin.'
            },
            {
                id: 'fallback-2',
                name: 'Velvet Matte Lipstick',
                brand: 'velvet-luxe',
                category: 'makeup',
                price: 45.00,
                salePrice: 36.00,
                rating: 4.6,
                reviewCount: 89,
                images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=250&fit=crop'],
                description: 'Long-wearing matte lipstick with velvet finish in sophisticated shades.'
            },
            {
                id: 'fallback-3',
                name: 'Hydrating Face Moisturizer',
                brand: 'pure-essence',
                category: 'skincare',
                price: 65.00,
                salePrice: null,
                rating: 4.7,
                reviewCount: 203,
                images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=250&fit=crop'],
                description: 'Deeply hydrating moisturizer with natural ingredients for all skin types.'
            }
        ];
    }

    showLoadingState() {
        const grid = document.getElementById('featured-products-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--primary-gold); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                    <p style="color: var(--sophisticated-gray);">Loading luxury products...</p>
                </div>
            `;
        }
    }

    showErrorState() {
        const grid = document.getElementById('featured-products-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--sophisticated-gray); margin-bottom: 0.5rem;">Unable to load products</h3>
                    <p style="color: var(--sophisticated-gray);">Please refresh the page or try again later</p>
                </div>
            `;
        }
    }

    showFallbackContent() {
        console.log('Showing fallback content');
        this.products = this.getFallbackProducts();
        this.displayProducts(this.products);
        this.loadHeroProducts();
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with actual performance monitoring
            console.log('Performance monitoring active');
        }
    }
}

// Initialize luxury homepage
document.addEventListener('DOMContentLoaded', () => {
    window.luxuryHomepage = new LuxuryHomepage();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LuxuryHomepage;
}

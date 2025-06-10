// Shopping Cart Functionality for Midas Beauty

class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.count = 0;
        this.init();
    }

    init() {
        // Load cart with recovery mechanism
        this.loadCartWithRecovery();

        // Initialize cart UI
        this.updateCartUI();

        // Setup cart persistence monitoring
        this.setupPersistenceMonitoring();

        // Setup cart recovery notifications
        this.setupCartRecovery();

        // Add event listeners
        document.addEventListener('DOMContentLoaded', () => {
            // Add to cart buttons
            const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .btn');
            addToCartButtons.forEach(button => {
                if (button.textContent === 'Add to Cart' || button.classList.contains('add-to-cart-btn')) {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const productCard = button.closest('.product-card');
                        if (productCard) {
                            let productName, productPrice, productImage;

                            // Handle product name which might be inside an <a> tag
                            const nameElement = productCard.querySelector('h3');
                            if (nameElement.querySelector('a')) {
                                productName = nameElement.querySelector('a').textContent;
                            } else {
                                productName = nameElement.textContent;
                            }

                            productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));

                            // Handle image which might be inside an <a> tag
                            const imgElement = productCard.querySelector('img');
                            productImage = imgElement.src;

                            const product = {
                                id: Date.now().toString(), // Simple unique ID
                                name: productName,
                                price: productPrice,
                                image: productImage,
                                quantity: 1
                            };
                            this.addItem(product);
                        }
                    });
                }
            });

            // Cart toggle
            const cartToggle = document.getElementById('cart-toggle');
            if (cartToggle) {
                cartToggle.addEventListener('click', () => {
                    document.getElementById('cart-sidebar').classList.toggle('active');
                });
            }

            // Close cart
            const closeCart = document.getElementById('close-cart');
            if (closeCart) {
                closeCart.addEventListener('click', () => {
                    document.getElementById('cart-sidebar').classList.remove('active');
                });
            }

            // Checkout button
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', () => {
                    if (this.items.length > 0) {
                        // Redirect to checkout page
                        // Check if we're in a product detail page (URL contains product-details)
                        if (window.location.href.includes('product-details')) {
                            window.location.href = '../checkout.html';
                        } else {
                            window.location.href = 'checkout.html';
                        }
                    } else {
                        this.showNotification('Your cart is empty. Add some products before checking out.', 'error');
                    }
                });
            }
        });
    }

    addItem(product) {
        // Check if product already exists in cart
        const existingItemIndex = this.items.findIndex(item => item.name === product.name);

        if (existingItemIndex > -1) {
            // Increment quantity if product already in cart
            this.items[existingItemIndex].quantity += 1;
        } else {
            // Add new product to cart
            this.items.push(product);
        }

        // Update cart totals
        this.updateTotals();

        // Save to localStorage
        this.saveCart();

        // Update UI
        this.updateCartUI();

        // Show confirmation
        this.showNotification(`${product.name} added to cart!`);
    }

    removeItem(productId) {
        // Find and remove the item
        this.items = this.items.filter(item => item.id !== productId);

        // Update cart totals
        this.updateTotals();

        // Save to localStorage
        this.saveCart();

        // Update UI
        this.updateCartUI();
    }

    updateQuantity(productId, newQuantity) {
        // Find the item
        const itemIndex = this.items.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            // Update quantity
            this.items[itemIndex].quantity = parseInt(newQuantity);

            // Remove item if quantity is 0
            if (this.items[itemIndex].quantity <= 0) {
                this.removeItem(productId);
                return;
            }

            // Update cart totals
            this.updateTotals();

            // Save to localStorage
            this.saveCart();

            // Update UI
            this.updateCartUI();
        }
    }

    updateTotals() {
        // Calculate total price and item count
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.count = this.items.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        // Enhanced cart persistence with metadata
        const cartData = {
            items: this.items,
            total: this.total,
            count: this.count,
            lastUpdated: new Date().toISOString(),
            sessionId: this.getSessionId(),
            version: '2.0'
        };

        // Save to localStorage
        localStorage.setItem('midasBeautyCart', JSON.stringify(cartData));

        // Save to sessionStorage as backup
        sessionStorage.setItem('midasBeautyCartBackup', JSON.stringify(cartData));

        // Trigger background sync for PWA
        this.triggerBackgroundSync();

        // Update cart analytics
        this.updateCartAnalytics();
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('midasBeautySessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('midasBeautySessionId', sessionId);
        }
        return sessionId;
    }

    triggerBackgroundSync() {
        // Register background sync for cart data
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('cart-sync');
            }).catch(error => {
                console.log('Background sync registration failed:', error);
            });
        }
    }

    updateCartAnalytics() {
        // Track cart events for analytics
        const analyticsData = {
            event: 'cart_updated',
            itemCount: this.count,
            totalValue: this.total,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId()
        };

        // Store analytics data
        const existingAnalytics = JSON.parse(localStorage.getItem('midasBeautyAnalytics') || '[]');
        existingAnalytics.push(analyticsData);

        // Keep only last 100 events
        if (existingAnalytics.length > 100) {
            existingAnalytics.splice(0, existingAnalytics.length - 100);
        }

        localStorage.setItem('midasBeautyAnalytics', JSON.stringify(existingAnalytics));
    }

    clearCart() {
        // Clear all items from cart
        this.items = [];
        this.total = 0;
        this.count = 0;

        // Save to localStorage
        this.saveCart();

        // Update UI
        this.updateCartUI();
    }

    updateCartUI() {
        // Update cart count in header
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.count;
        }

        // Update cart items list
        const cartItemsList = document.getElementById('cart-items');
        if (cartItemsList) {
            cartItemsList.innerHTML = '';

            if (this.items.length === 0) {
                cartItemsList.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            } else {
                this.items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                            <div class="quantity-control">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="remove-item" data-id="${item.id}">×</button>
                    `;
                    cartItemsList.appendChild(itemElement);
                });

                // Add event listeners to quantity buttons and remove buttons
                document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        const item = this.items.find(item => item.id === id);
                        if (item) {
                            this.updateQuantity(id, item.quantity - 1);
                        }
                    });
                });

                document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        const item = this.items.find(item => item.id === id);
                        if (item) {
                            this.updateQuantity(id, item.quantity + 1);
                        }
                    });
                });

                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        this.removeItem(id);
                    });
                });
            }
        }

        // Update cart total
        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            cartTotal.textContent = `$${this.total.toFixed(2)}`;
        }
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.textContent = message;

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    loadCartWithRecovery() {
        try {
            // Try to load from localStorage first
            const savedCart = localStorage.getItem('midasBeautyCart');
            if (savedCart) {
                const cartData = JSON.parse(savedCart);
                this.items = cartData.items || [];
                this.total = cartData.total || 0;
                this.count = cartData.count || 0;
                return;
            }

            // Fallback to sessionStorage backup
            const backupCart = sessionStorage.getItem('midasBeautyCartBackup');
            if (backupCart) {
                const cartData = JSON.parse(backupCart);
                this.items = cartData.items || [];
                this.total = cartData.total || 0;
                this.count = cartData.count || 0;

                // Restore to localStorage
                this.saveCart();
                this.showNotification('Cart recovered from backup', 'info');
                return;
            }

        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = [];
            this.total = 0;
            this.count = 0;
        }
    }

    setupPersistenceMonitoring() {
        // Monitor for storage events (cart changes in other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'midasBeautyCart' && e.newValue) {
                try {
                    const cartData = JSON.parse(e.newValue);
                    this.items = cartData.items || [];
                    this.total = cartData.total || 0;
                    this.count = cartData.count || 0;
                    this.updateCartUI();
                    this.showNotification('Cart synchronized across tabs', 'info');
                } catch (error) {
                    console.error('Error syncing cart:', error);
                }
            }
        });

        // Auto-save cart periodically
        setInterval(() => {
            if (this.items.length > 0) {
                this.saveCart();
            }
        }, 30000); // Save every 30 seconds
    }

    setupCartRecovery() {
        // Check for abandoned cart recovery
        const lastCartUpdate = localStorage.getItem('midasBeautyCartLastUpdate');
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        if (lastCartUpdate && (now - parseInt(lastCartUpdate)) > oneDay && this.items.length > 0) {
            this.showCartRecoveryNotification();
        }

        // Update last cart update timestamp
        localStorage.setItem('midasBeautyCartLastUpdate', now.toString());
    }

    showCartRecoveryNotification() {
        const notification = document.createElement('div');
        notification.className = 'cart-recovery-notification';
        notification.innerHTML = `
            <div class="recovery-content">
                <h4>Welcome back!</h4>
                <p>You have ${this.count} item(s) waiting in your cart.</p>
                <div class="recovery-actions">
                    <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Continue Shopping
                    </button>
                    <button class="btn btn-secondary" onclick="cart.clearCart(); this.parentElement.parentElement.parentElement.remove();">
                        Clear Cart
                    </button>
                </div>
            </div>
            <button class="close-recovery" onclick="this.parentElement.remove()">×</button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 10000);
    }

    // Enhanced cart methods
    getCartSummary() {
        return {
            items: this.items,
            count: this.count,
            total: this.total,
            lastUpdated: new Date().toISOString(),
            sessionId: this.getSessionId()
        };
    }
}

// Initialize cart
const cart = new ShoppingCart();

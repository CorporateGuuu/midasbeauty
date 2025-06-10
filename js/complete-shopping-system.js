// Complete Shopping and Checkout System for MidasBeauty
// Handles the entire customer journey from browsing to purchase completion

class MidasBeautyShoppingSystem {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('midasbeauty_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('midasbeauty_wishlist')) || [];
        this.user = JSON.parse(localStorage.getItem('midasbeauty_user')) || null;
        this.orderHistory = JSON.parse(localStorage.getItem('midasbeauty_orders')) || [];
        this.init();
    }

    init() {
        console.log('🛍️ Complete Shopping System initializing...');
        this.setupEventListeners();
        this.updateAllDisplays();
        this.setupCheckoutProcess();
        this.setupOrderTracking();
        console.log('✅ Complete Shopping System ready');
    }

    // ===== CART MANAGEMENT =====
    addToCart(productId, quantity = 1, variant = null) {
        const product = this.getProduct(productId);
        if (!product) {
            this.showNotification('Product not found', 'error');
            return false;
        }

        const existingItem = this.cart.find(item => 
            item.id === productId && 
            JSON.stringify(item.variant) === JSON.stringify(variant)
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                brand: product.brand,
                price: product.salePrice || product.price,
                originalPrice: product.price,
                image: product.images?.[0] || '/images/placeholder.jpg',
                quantity: quantity,
                variant: variant,
                addedAt: Date.now()
            });
        }

        this.saveCart();
        this.updateAllDisplays();
        this.showNotification(`${product.name} added to cart!`, 'success');
        this.trackEvent('add_to_cart', { product_id: productId, quantity });
        return true;
    }

    removeFromCart(productId, variant = null) {
        this.cart = this.cart.filter(item => 
            !(item.id === productId && JSON.stringify(item.variant) === JSON.stringify(variant))
        );
        this.saveCart();
        this.updateAllDisplays();
        this.trackEvent('remove_from_cart', { product_id: productId });
    }

    updateCartQuantity(productId, newQuantity, variant = null) {
        const item = this.cart.find(item => 
            item.id === productId && 
            JSON.stringify(item.variant) === JSON.stringify(variant)
        );

        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId, variant);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateAllDisplays();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateAllDisplays();
    }

    // ===== WISHLIST MANAGEMENT =====
    addToWishlist(productId) {
        const product = this.getProduct(productId);
        if (!product) {
            this.showNotification('Product not found', 'error');
            return false;
        }

        if (this.wishlist.find(item => item.id === productId)) {
            this.showNotification('Already in wishlist', 'info');
            return false;
        }

        this.wishlist.push({
            id: productId,
            name: product.name,
            brand: product.brand,
            price: product.salePrice || product.price,
            image: product.images?.[0] || '/images/placeholder.jpg',
            addedAt: Date.now()
        });

        this.saveWishlist();
        this.updateWishlistDisplay();
        this.showNotification(`${product.name} added to wishlist!`, 'success');
        this.trackEvent('add_to_wishlist', { product_id: productId });
        return true;
    }

    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        this.saveWishlist();
        this.updateWishlistDisplay();
        this.trackEvent('remove_from_wishlist', { product_id: productId });
    }

    moveWishlistToCart(productId) {
        const wishlistItem = this.wishlist.find(item => item.id === productId);
        if (wishlistItem) {
            this.addToCart(productId);
            this.removeFromWishlist(productId);
            this.showNotification('Moved to cart!', 'success');
        }
    }

    // ===== CHECKOUT PROCESS =====
    setupCheckoutProcess() {
        // Initialize checkout steps
        this.checkoutSteps = [
            'shipping',
            'payment',
            'review',
            'confirmation'
        ];
        this.currentCheckoutStep = 0;
    }

    validateShippingInfo(formData) {
        const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
        const errors = [];

        required.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                errors.push(`${field} is required`);
            }
        });

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push('Invalid email format');
        }

        // Phone validation
        if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
            errors.push('Invalid phone format');
        }

        return errors;
    }

    validatePaymentInfo(formData) {
        const errors = [];

        if (formData.paymentMethod === 'card') {
            if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
                errors.push('Invalid card number');
            }

            if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
                errors.push('Invalid expiry date (MM/YY)');
            }

            if (!formData.cvv || formData.cvv.length < 3) {
                errors.push('Invalid CVV');
            }

            if (!formData.cardholderName || formData.cardholderName.trim() === '') {
                errors.push('Cardholder name is required');
            }
        }

        return errors;
    }

    async processOrder(orderData) {
        try {
            // Validate order data
            const shippingErrors = this.validateShippingInfo(orderData.shipping);
            const paymentErrors = this.validatePaymentInfo(orderData.payment);

            if (shippingErrors.length > 0 || paymentErrors.length > 0) {
                throw new Error([...shippingErrors, ...paymentErrors].join(', '));
            }

            // Calculate totals
            const subtotal = this.getCartSubtotal();
            const tax = subtotal * 0.08; // 8% tax
            const shipping = subtotal >= 75 ? 0 : 9.99; // Free shipping over $75
            const total = subtotal + tax + shipping;

            // Create order
            const order = {
                id: this.generateOrderId(),
                items: [...this.cart],
                shipping: orderData.shipping,
                payment: {
                    method: orderData.payment.paymentMethod,
                    last4: orderData.payment.cardNumber ? orderData.payment.cardNumber.slice(-4) : null
                },
                totals: {
                    subtotal: subtotal,
                    tax: tax,
                    shipping: shipping,
                    total: total
                },
                status: 'processing',
                createdAt: Date.now(),
                estimatedDelivery: Date.now() + (5 * 24 * 60 * 60 * 1000) // 5 days
            };

            // Simulate payment processing
            await this.simulatePaymentProcessing();

            // Save order
            this.orderHistory.push(order);
            this.saveOrderHistory();

            // Clear cart
            this.clearCart();

            // Track conversion
            this.trackEvent('purchase', {
                order_id: order.id,
                value: total,
                currency: 'USD',
                items: order.items.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            });

            return order;

        } catch (error) {
            console.error('Order processing failed:', error);
            throw error;
        }
    }

    async simulatePaymentProcessing() {
        // Simulate payment gateway processing time
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    generateOrderId() {
        return 'MB-' + Date.now().toString().slice(-8).toUpperCase();
    }

    // ===== ORDER TRACKING =====
    setupOrderTracking() {
        // Simulate order status updates
        this.orderStatuses = [
            { status: 'processing', label: 'Order Processing', icon: 'fas fa-cog' },
            { status: 'confirmed', label: 'Order Confirmed', icon: 'fas fa-check-circle' },
            { status: 'shipped', label: 'Shipped', icon: 'fas fa-truck' },
            { status: 'delivered', label: 'Delivered', icon: 'fas fa-home' }
        ];
    }

    getOrderStatus(orderId) {
        const order = this.orderHistory.find(o => o.id === orderId);
        if (!order) return null;

        // Simulate status progression based on time
        const daysSinceOrder = (Date.now() - order.createdAt) / (24 * 60 * 60 * 1000);
        
        if (daysSinceOrder < 1) return 'processing';
        if (daysSinceOrder < 2) return 'confirmed';
        if (daysSinceOrder < 5) return 'shipped';
        return 'delivered';
    }

    trackOrder(orderId) {
        const order = this.orderHistory.find(o => o.id === orderId);
        if (!order) {
            this.showNotification('Order not found', 'error');
            return null;
        }

        const currentStatus = this.getOrderStatus(orderId);
        const statusIndex = this.orderStatuses.findIndex(s => s.status === currentStatus);

        return {
            order: order,
            currentStatus: currentStatus,
            statusIndex: statusIndex,
            statuses: this.orderStatuses,
            trackingNumber: this.generateTrackingNumber(orderId)
        };
    }

    generateTrackingNumber(orderId) {
        return 'MB' + orderId.slice(-6) + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    // ===== DISPLAY UPDATES =====
    updateAllDisplays() {
        this.updateCartDisplay();
        this.updateWishlistDisplay();
        this.updateCartCount();
        this.updateWishlistCount();
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item" data-product-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-brand">${this.getBrandName(item.brand)}</div>
                        <div class="cart-item-price">$${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" onclick="window.shoppingSystem.updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" onclick="window.shoppingSystem.updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="window.shoppingSystem.removeFromCart('${item.id}')">&times;</button>
                </div>
            `).join('');
        }

        if (cartTotal) {
            cartTotal.textContent = `$${this.getCartTotal().toFixed(2)}`;
        }
    }

    updateWishlistDisplay() {
        const wishlistCount = document.getElementById('wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
            wishlistCount.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
        }
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    updateWishlistCount() {
        const wishlistCount = document.getElementById('wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
            wishlistCount.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
        }
    }

    // ===== CALCULATIONS =====
    getCartSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getCartTotal() {
        const subtotal = this.getCartSubtotal();
        const tax = subtotal * 0.08;
        const shipping = subtotal >= 75 ? 0 : 9.99;
        return subtotal + tax + shipping;
    }

    // ===== UTILITY METHODS =====
    getProduct(productId) {
        if (window.productDatabaseManager) {
            return window.productDatabaseManager.getProductById(productId);
        }
        return null;
    }

    getBrandName(brandId) {
        const brandNames = {
            'midas-beauty': 'Midas Beauty',
            'luxe-radiance': 'Luxe Radiance',
            'velvet-luxe': 'Velvet Luxe',
            'pure-essence': 'Pure Essence'
        };
        return brandNames[brandId] || 'Premium Brand';
    }

    setupEventListeners() {
        // Cart toggle
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCart();
            });
        }

        // Wishlist toggle
        const wishlistToggle = document.getElementById('wishlist-toggle');
        if (wishlistToggle) {
            wishlistToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.showWishlist();
            });
        }

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                e.preventDefault();
                const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productId = button.dataset.productId;
                if (productId) {
                    this.addToCart(productId);
                }
            }
        });
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('open');
        }
    }

    showWishlist() {
        // Create wishlist modal or navigate to wishlist page
        console.log('Showing wishlist with', this.wishlist.length, 'items');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking
        console.log('Event tracked:', eventName, data);
        
        // Send to analytics service
        if (window.gtag) {
            window.gtag('event', eventName, data);
        }
    }

    // ===== STORAGE METHODS =====
    saveCart() {
        localStorage.setItem('midasbeauty_cart', JSON.stringify(this.cart));
    }

    saveWishlist() {
        localStorage.setItem('midasbeauty_wishlist', JSON.stringify(this.wishlist));
    }

    saveOrderHistory() {
        localStorage.setItem('midasbeauty_orders', JSON.stringify(this.orderHistory));
    }
}

// Initialize the shopping system
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingSystem = new MidasBeautyShoppingSystem();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MidasBeautyShoppingSystem;
}

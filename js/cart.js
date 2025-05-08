// Shopping Cart Functionality for Midas Beauty

class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.count = 0;
        this.init();
    }

    init() {
        // Load cart from localStorage if available
        const savedCart = localStorage.getItem('midasBeautyCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            this.items = cartData.items || [];
            this.total = cartData.total || 0;
            this.count = cartData.count || 0;
        }

        // Initialize cart UI
        this.updateCartUI();

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
                        window.location.href = 'checkout.html';
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
        // Save cart to localStorage
        localStorage.setItem('midasBeautyCart', JSON.stringify({
            items: this.items,
            total: this.total,
            count: this.count
        }));
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
}

// Initialize cart
const cart = new ShoppingCart();

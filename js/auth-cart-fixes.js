// Authentication and Cart Functionality Fixes for MidasBeauty
// Addresses the failing tests and ensures proper integration

class MidasBeautyAuthCartFixes {
    constructor() {
        this.auth0Client = null;
        this.isAuthenticated = false;
        this.user = null;
        this.cart = JSON.parse(localStorage.getItem('midasbeauty_cart')) || [];
        this.init();
    }

    async init() {
        console.log('🔧 Initializing Auth & Cart fixes...');
        
        // Wait for Auth0 SDK to load
        await this.waitForAuth0SDK();
        
        // Initialize Auth0
        await this.initializeAuth0();
        
        // Fix cart functionality
        this.fixCartFunctionality();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Fix customer dashboard
        this.fixCustomerDashboard();
        
        console.log('✅ Auth & Cart fixes applied');
    }

    // Wait for Auth0 SDK to be available
    waitForAuth0SDK() {
        return new Promise((resolve) => {
            if (typeof createAuth0Client !== 'undefined') {
                resolve();
            } else {
                const checkAuth0 = setInterval(() => {
                    if (typeof createAuth0Client !== 'undefined') {
                        clearInterval(checkAuth0);
                        resolve();
                    }
                }, 100);
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    clearInterval(checkAuth0);
                    console.warn('Auth0 SDK not loaded, using fallback');
                    resolve();
                }, 10000);
            }
        });
    }

    // Initialize Auth0 with proper configuration
    async initializeAuth0() {
        if (typeof createAuth0Client === 'undefined') {
            console.warn('Auth0 SDK not available, using mock authentication');
            this.setupMockAuth();
            return;
        }

        try {
            this.auth0Client = await createAuth0Client({
                domain: 'dev-m2egy31mp68y3xz2.us.auth0.com',
                clientId: 'Y0debcPHj3m8TPN0xHXGaJgmfh5YQUxI',
                authorizationParams: {
                    redirect_uri: window.location.origin,
                    audience: 'https://dev-m2egy31mp68y3xz2.us.auth0.com/api/v2/',
                    scope: 'openid profile email'
                },
                cacheLocation: 'localstorage',
                useRefreshTokens: true
            });

            // Check if user is authenticated
            this.isAuthenticated = await this.auth0Client.isAuthenticated();
            
            if (this.isAuthenticated) {
                this.user = await this.auth0Client.getUser();
                this.updateUIForAuthenticatedUser();
            }

            // Handle redirect callback
            if (window.location.search.includes('code=') || window.location.search.includes('error=')) {
                await this.handleAuthCallback();
            }

            console.log('✅ Auth0 initialized successfully');
            
        } catch (error) {
            console.error('Auth0 initialization failed:', error);
            this.setupMockAuth();
        }
    }

    // Setup mock authentication for fallback
    setupMockAuth() {
        console.log('Setting up mock authentication');
        
        this.auth0Client = {
            loginWithRedirect: () => {
                console.log('Mock login - redirecting...');
                // Simulate login success
                setTimeout(() => {
                    this.isAuthenticated = true;
                    this.user = {
                        name: 'Demo User',
                        email: 'demo@midasbeauty.shop',
                        picture: 'https://via.placeholder.com/40x40'
                    };
                    this.updateUIForAuthenticatedUser();
                }, 1000);
            },
            logout: () => {
                console.log('Mock logout');
                this.isAuthenticated = false;
                this.user = null;
                this.updateUIForUnauthenticatedUser();
            },
            isAuthenticated: () => Promise.resolve(this.isAuthenticated),
            getUser: () => Promise.resolve(this.user)
        };
    }

    // Handle Auth0 callback
    async handleAuthCallback() {
        try {
            await this.auth0Client.handleRedirectCallback();
            this.isAuthenticated = await this.auth0Client.isAuthenticated();
            
            if (this.isAuthenticated) {
                this.user = await this.auth0Client.getUser();
                this.updateUIForAuthenticatedUser();
            }
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
        } catch (error) {
            console.error('Auth callback error:', error);
        }
    }

    // Update UI for authenticated user
    updateUIForAuthenticatedUser() {
        const accountLink = document.getElementById('account-link');
        if (accountLink) {
            accountLink.innerHTML = `
                <img src="${this.user?.picture || 'https://via.placeholder.com/40x40'}" 
                     alt="User Avatar" 
                     style="width: 30px; height: 30px; border-radius: 50%;">
            `;
            accountLink.title = `Welcome, ${this.user?.name || 'User'}`;
        }

        // Show customer dashboard option
        this.addCustomerDashboardOption();
        
        console.log('✅ UI updated for authenticated user');
    }

    // Update UI for unauthenticated user
    updateUIForUnauthenticatedUser() {
        const accountLink = document.getElementById('account-link');
        if (accountLink) {
            accountLink.innerHTML = '<i class="fas fa-user"></i>';
            accountLink.title = 'Login / Register';
        }

        // Remove customer dashboard option
        this.removeCustomerDashboardOption();
        
        console.log('✅ UI updated for unauthenticated user');
    }

    // Add customer dashboard option
    addCustomerDashboardOption() {
        const accountLink = document.getElementById('account-link');
        if (!accountLink) return;

        // Remove existing dropdown if any
        const existingDropdown = accountLink.parentNode.querySelector('.user-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        // Create user dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <a href="#" class="dropdown-item" id="dashboard-link">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a href="#" class="dropdown-item" id="profile-link">
                <i class="fas fa-user-edit"></i> Profile
            </a>
            <a href="#" class="dropdown-item" id="orders-link">
                <i class="fas fa-shopping-bag"></i> Orders
            </a>
            <a href="#" class="dropdown-item" id="logout-link">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
        `;

        accountLink.parentNode.appendChild(dropdown);

        // Add event listeners
        dropdown.querySelector('#dashboard-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showCustomerDashboard();
        });

        dropdown.querySelector('#logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    // Remove customer dashboard option
    removeCustomerDashboardOption() {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }

    // Show customer dashboard
    showCustomerDashboard() {
        if (window.customerDashboard) {
            window.customerDashboard.showDashboard();
        } else {
            console.warn('Customer dashboard not available');
            alert('Customer dashboard is loading...');
        }
    }

    // Login function
    async login() {
        try {
            if (this.auth0Client && this.auth0Client.loginWithRedirect) {
                await this.auth0Client.loginWithRedirect();
            } else {
                console.warn('Auth0 not available, using mock login');
                this.auth0Client.loginWithRedirect();
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    // Logout function
    async logout() {
        try {
            if (this.auth0Client && this.auth0Client.logout) {
                await this.auth0Client.logout({
                    logoutParams: {
                        returnTo: window.location.origin
                    }
                });
            } else {
                this.auth0Client.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Fix cart functionality
    fixCartFunctionality() {
        // Ensure cart elements exist
        this.ensureCartElements();
        
        // Fix cart toggle
        this.fixCartToggle();
        
        // Fix add to cart buttons
        this.fixAddToCartButtons();
        
        // Update cart display
        this.updateCartDisplay();
        
        console.log('✅ Cart functionality fixed');
    }

    // Ensure cart elements exist
    ensureCartElements() {
        let cartSidebar = document.getElementById('cart-sidebar');
        if (!cartSidebar) {
            cartSidebar = document.createElement('div');
            cartSidebar.id = 'cart-sidebar';
            cartSidebar.className = 'cart-sidebar';
            cartSidebar.innerHTML = `
                <div class="cart-header">
                    <h3>Your Cart</h3>
                    <button id="close-cart" class="close-cart">&times;</button>
                </div>
                <div id="cart-items" class="cart-items">
                    <p class="empty-cart">Your cart is empty</p>
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Total: </span>
                        <span id="cart-total">$0.00</span>
                    </div>
                    <button id="checkout-btn" class="btn btn-primary">Checkout</button>
                </div>
            `;
            document.body.appendChild(cartSidebar);
        }

        // Ensure cart count element exists
        let cartCount = document.getElementById('cart-count');
        if (!cartCount) {
            const cartToggle = document.getElementById('cart-toggle');
            if (cartToggle) {
                cartCount = document.createElement('span');
                cartCount.id = 'cart-count';
                cartCount.className = 'cart-count';
                cartCount.textContent = '0';
                cartToggle.appendChild(cartCount);
            }
        }
    }

    // Fix cart toggle functionality
    fixCartToggle() {
        const cartToggle = document.getElementById('cart-toggle');
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCart = document.getElementById('close-cart');

        if (cartToggle && cartSidebar) {
            // Remove existing listeners
            cartToggle.replaceWith(cartToggle.cloneNode(true));
            const newCartToggle = document.getElementById('cart-toggle');

            newCartToggle.addEventListener('click', (e) => {
                e.preventDefault();
                cartSidebar.classList.toggle('open');
                document.body.classList.toggle('cart-open');
            });
        }

        if (closeCart && cartSidebar) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('open');
                document.body.classList.remove('cart-open');
            });
        }
    }

    // Fix add to cart buttons
    fixAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart, [data-action="add-to-cart"]');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.dataset.productId || button.closest('[data-product-id]')?.dataset.productId;
                
                if (productId) {
                    this.addToCart(productId);
                } else {
                    console.warn('Product ID not found for add to cart button');
                }
            });
        });
    }

    // Add product to cart
    addToCart(productId) {
        const product = window.productDatabaseManager?.getProductById(productId);
        
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        // Check if product already in cart
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.salePrice || product.price,
                image: product.images?.[0] || '/images/placeholder.jpg',
                quantity: 1
            });
        }

        // Save cart to localStorage
        localStorage.setItem('midasbeauty_cart', JSON.stringify(this.cart));
        
        // Update cart display
        this.updateCartDisplay();
        
        // Show success message
        this.showAddToCartSuccess(product.name);
        
        console.log('✅ Product added to cart:', product.name);
    }

    // Update cart display
    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        // Update cart count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }

        // Update cart items
        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item" data-product-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4 class="cart-item-name">${item.name}</h4>
                            <div class="cart-item-price">$${item.price}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" data-action="decrease">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn plus" data-action="increase">+</button>
                            </div>
                        </div>
                        <button class="remove-item" data-action="remove">&times;</button>
                    </div>
                `).join('');

                // Add event listeners for cart item actions
                this.setupCartItemListeners();
            }
        }

        // Update cart total
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) {
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Setup cart item event listeners
    setupCartItemListeners() {
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;

        cartItems.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const cartItem = e.target.closest('.cart-item');
            const productId = cartItem?.dataset.productId;

            if (!productId) return;

            switch (action) {
                case 'increase':
                    this.updateCartItemQuantity(productId, 1);
                    break;
                case 'decrease':
                    this.updateCartItemQuantity(productId, -1);
                    break;
                case 'remove':
                    this.removeFromCart(productId);
                    break;
            }
        });
    }

    // Update cart item quantity
    updateCartItemQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                localStorage.setItem('midasbeauty_cart', JSON.stringify(this.cart));
                this.updateCartDisplay();
            }
        }
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        localStorage.setItem('midasbeauty_cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
    }

    // Show add to cart success message
    showAddToCartSuccess(productName) {
        const message = document.createElement('div');
        message.className = 'cart-success-message';
        message.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <span>${productName} added to cart!</span>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    // Fix customer dashboard
    fixCustomerDashboard() {
        // Ensure customer dashboard is available
        if (!window.customerDashboard && window.CustomerDashboard) {
            window.customerDashboard = new window.CustomerDashboard();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Account link click
        const accountLink = document.getElementById('account-link');
        if (accountLink) {
            accountLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (this.isAuthenticated) {
                    // Toggle user dropdown
                    const dropdown = accountLink.parentNode.querySelector('.user-dropdown');
                    if (dropdown) {
                        dropdown.classList.toggle('show');
                    }
                } else {
                    this.login();
                }
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-account')) {
                const dropdowns = document.querySelectorAll('.user-dropdown');
                dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
            }
        });
    }
}

// Initialize fixes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.midasBeautyAuthCartFixes = new MidasBeautyAuthCartFixes();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MidasBeautyAuthCartFixes;
}

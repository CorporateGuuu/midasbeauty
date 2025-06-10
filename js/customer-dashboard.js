// Customer Dashboard System for MidasBeauty
// Handles user accounts, profiles, order history, and personalized features

class CustomerDashboard {
    constructor() {
        this.currentUser = this.loadCurrentUser();
        this.users = this.loadUsers();
        this.isLoggedIn = !!this.currentUser;
        this.init();
    }

    init() {
        this.setupAuthenticationSystem();
        this.setupDashboardInterface();
        this.setupUserProfile();
        this.setupOrderHistory();
        this.setupLoyaltyIntegration();
        this.setupPersonalization();
    }

    // Authentication System
    setupAuthenticationSystem() {
        this.createLoginModal();
        this.createRegistrationModal();
        this.setupAuthEventListeners();
        this.updateAuthUI();
    }

    createLoginModal() {
        const loginModal = document.createElement('div');
        loginModal.id = 'login-modal';
        loginModal.className = 'auth-modal';
        loginModal.innerHTML = `
            <div class="auth-modal-content">
                <div class="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your Midas Beauty account</p>
                    <button class="auth-close" id="login-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form class="auth-form" id="login-form">
                    <div class="form-group">
                        <label for="login-email">Email Address</label>
                        <input type="email" id="login-email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <div class="password-input">
                            <input type="password" id="login-password" required>
                            <button type="button" class="password-toggle" data-target="login-password">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-options">
                        <label class="checkbox-label">
                            <input type="checkbox" id="remember-me">
                            <span class="checkmark"></span>
                            Remember me
                        </label>
                        <a href="#" class="forgot-password">Forgot password?</a>
                    </div>
                    
                    <button type="submit" class="btn btn-primary auth-submit">
                        <i class="fas fa-sign-in-alt"></i>
                        Sign In
                    </button>
                    
                    <div class="auth-divider">
                        <span>or continue with</span>
                    </div>
                    
                    <div class="social-login">
                        <button type="button" class="btn btn-social google-login">
                            <i class="fab fa-google"></i>
                            Google
                        </button>
                        <button type="button" class="btn btn-social facebook-login">
                            <i class="fab fa-facebook-f"></i>
                            Facebook
                        </button>
                    </div>
                    
                    <div class="auth-switch">
                        <span>Don't have an account?</span>
                        <a href="#" id="show-register">Create account</a>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(loginModal);
    }

    createRegistrationModal() {
        const registerModal = document.createElement('div');
        registerModal.id = 'register-modal';
        registerModal.className = 'auth-modal';
        registerModal.innerHTML = `
            <div class="auth-modal-content">
                <div class="auth-header">
                    <h2>Create Account</h2>
                    <p>Join Midas Beauty for exclusive benefits</p>
                    <button class="auth-close" id="register-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form class="auth-form" id="register-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="register-first-name">First Name</label>
                            <input type="text" id="register-first-name" required>
                        </div>
                        <div class="form-group">
                            <label for="register-last-name">Last Name</label>
                            <input type="text" id="register-last-name" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="register-email">Email Address</label>
                        <input type="email" id="register-email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="register-password">Password</label>
                        <div class="password-input">
                            <input type="password" id="register-password" required minlength="8">
                            <button type="button" class="password-toggle" data-target="register-password">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <div class="password-strength" id="password-strength"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="register-confirm-password">Confirm Password</label>
                        <input type="password" id="register-confirm-password" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="register-phone">Phone Number (Optional)</label>
                        <input type="tel" id="register-phone">
                    </div>
                    
                    <div class="form-group">
                        <label for="register-birthday">Birthday (Optional)</label>
                        <input type="date" id="register-birthday">
                    </div>
                    
                    <div class="form-options">
                        <label class="checkbox-label">
                            <input type="checkbox" id="newsletter-signup" checked>
                            <span class="checkmark"></span>
                            Subscribe to newsletter for exclusive offers
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="terms-agreement" required>
                            <span class="checkmark"></span>
                            I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a>
                        </label>
                    </div>
                    
                    <button type="submit" class="btn btn-primary auth-submit">
                        <i class="fas fa-user-plus"></i>
                        Create Account
                    </button>
                    
                    <div class="auth-divider">
                        <span>or continue with</span>
                    </div>
                    
                    <div class="social-login">
                        <button type="button" class="btn btn-social google-login">
                            <i class="fab fa-google"></i>
                            Google
                        </button>
                        <button type="button" class="btn btn-social facebook-login">
                            <i class="fab fa-facebook-f"></i>
                            Facebook
                        </button>
                    </div>
                    
                    <div class="auth-switch">
                        <span>Already have an account?</span>
                        <a href="#" id="show-login">Sign in</a>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(registerModal);
    }

    setupAuthEventListeners() {
        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.id === 'account-link' || e.target.closest('#account-link')) {
                e.preventDefault();
                if (this.isLoggedIn) {
                    this.showDashboard();
                } else {
                    this.showLoginModal();
                }
            }
            
            if (e.target.id === 'show-register') {
                e.preventDefault();
                this.hideLoginModal();
                this.showRegisterModal();
            }
            
            if (e.target.id === 'show-login') {
                e.preventDefault();
                this.hideRegisterModal();
                this.showLoginModal();
            }
            
            if (e.target.classList.contains('auth-close') || e.target.closest('.auth-close')) {
                this.hideAuthModals();
            }
            
            if (e.target.classList.contains('password-toggle')) {
                this.togglePasswordVisibility(e.target);
            }
            
            if (e.target.classList.contains('google-login')) {
                this.handleSocialLogin('google');
            }
            
            if (e.target.classList.contains('facebook-login')) {
                this.handleSocialLogin('facebook');
            }
        });

        // Form submissions
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration(e.target);
        });

        // Password strength checker
        document.getElementById('register-password').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-modal')) {
                this.hideAuthModals();
            }
        });
    }

    // Authentication Methods
    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email') || document.getElementById('login-email').value;
        const password = formData.get('password') || document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Validate credentials
        const user = this.validateCredentials(email, password);
        if (user) {
            this.loginUser(user, rememberMe);
            this.hideAuthModals();
            this.showNotification('Welcome back! You have been successfully logged in.', 'success');
            this.showDashboard();
        } else {
            this.showNotification('Invalid email or password. Please try again.', 'error');
        }
    }

    handleRegistration(form) {
        const formData = new FormData(form);
        const userData = {
            firstName: document.getElementById('register-first-name').value,
            lastName: document.getElementById('register-last-name').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value,
            confirmPassword: document.getElementById('register-confirm-password').value,
            phone: document.getElementById('register-phone').value,
            birthday: document.getElementById('register-birthday').value,
            newsletterSubscription: document.getElementById('newsletter-signup').checked,
            termsAgreed: document.getElementById('terms-agreement').checked
        };

        // Validate registration data
        const validation = this.validateRegistrationData(userData);
        if (!validation.isValid) {
            this.showNotification(validation.message, 'error');
            return;
        }

        // Create user account
        const newUser = this.createUserAccount(userData);
        this.loginUser(newUser, true);
        this.hideAuthModals();
        this.showNotification('Account created successfully! Welcome to Midas Beauty!', 'success');
        this.showDashboard();
    }

    validateCredentials(email, password) {
        // In a real app, this would validate against a backend
        const user = Object.values(this.users).find(u => u.email === email);
        if (user && user.password === this.hashPassword(password)) {
            return user;
        }
        return null;
    }

    validateRegistrationData(userData) {
        if (userData.password !== userData.confirmPassword) {
            return { isValid: false, message: 'Passwords do not match' };
        }

        if (userData.password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }

        if (Object.values(this.users).some(u => u.email === userData.email)) {
            return { isValid: false, message: 'An account with this email already exists' };
        }

        if (!userData.termsAgreed) {
            return { isValid: false, message: 'You must agree to the Terms of Service' };
        }

        return { isValid: true };
    }

    createUserAccount(userData) {
        const userId = this.generateUserId();
        const user = {
            id: userId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: this.hashPassword(userData.password),
            phone: userData.phone,
            birthday: userData.birthday,
            newsletterSubscription: userData.newsletterSubscription,
            
            // Account metadata
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            emailVerified: false,
            accountStatus: 'active',
            
            // Profile data
            profile: {
                skinType: '',
                skinConcerns: [],
                allergies: [],
                favoriteCategories: [],
                preferredBrands: [],
                beautyGoals: []
            },
            
            // Preferences
            preferences: {
                emailNotifications: true,
                smsNotifications: false,
                marketingEmails: userData.newsletterSubscription,
                language: 'en',
                currency: 'USD'
            },
            
            // Addresses and payment methods
            addresses: [],
            paymentMethods: [],
            
            // Loyalty and rewards
            loyaltyPoints: 0,
            loyaltyTier: 'bronze',
            totalSpent: 0,
            orderCount: 0
        };

        this.users[userId] = user;
        this.saveUsers();
        return user;
    }

    loginUser(user, rememberMe = false) {
        this.currentUser = user;
        this.isLoggedIn = true;
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        this.saveUsers();
        
        // Save session
        if (rememberMe) {
            localStorage.setItem('midasBeautyUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('midasBeautyUser', JSON.stringify(user));
        }
        
        this.updateAuthUI();
        this.trackUserLogin(user);
    }

    logoutUser() {
        this.currentUser = null;
        this.isLoggedIn = false;
        
        localStorage.removeItem('midasBeautyUser');
        sessionStorage.removeItem('midasBeautyUser');
        
        this.updateAuthUI();
        this.hideDashboard();
        this.showNotification('You have been successfully logged out.', 'info');
    }

    // Dashboard Interface
    setupDashboardInterface() {
        this.createDashboardModal();
    }

    createDashboardModal() {
        const dashboardModal = document.createElement('div');
        dashboardModal.id = 'dashboard-modal';
        dashboardModal.className = 'dashboard-modal';
        dashboardModal.innerHTML = `
            <div class="dashboard-modal-content">
                <div class="dashboard-header">
                    <div class="user-welcome">
                        <h2>Welcome back, <span id="user-name">User</span>!</h2>
                        <p>Manage your account and track your beauty journey</p>
                    </div>
                    <button class="dashboard-close" id="dashboard-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="dashboard-content">
                    <div class="dashboard-sidebar">
                        <nav class="dashboard-nav">
                            <a href="#" class="nav-item active" data-section="overview">
                                <i class="fas fa-tachometer-alt"></i>
                                Overview
                            </a>
                            <a href="#" class="nav-item" data-section="orders">
                                <i class="fas fa-shopping-bag"></i>
                                Order History
                            </a>
                            <a href="#" class="nav-item" data-section="wishlist">
                                <i class="fas fa-heart"></i>
                                Wishlist
                            </a>
                            <a href="#" class="nav-item" data-section="loyalty">
                                <i class="fas fa-star"></i>
                                Loyalty Points
                            </a>
                            <a href="#" class="nav-item" data-section="profile">
                                <i class="fas fa-user-edit"></i>
                                Beauty Profile
                            </a>
                            <a href="#" class="nav-item" data-section="addresses">
                                <i class="fas fa-map-marker-alt"></i>
                                Addresses
                            </a>
                            <a href="#" class="nav-item" data-section="payment">
                                <i class="fas fa-credit-card"></i>
                                Payment Methods
                            </a>
                            <a href="#" class="nav-item" data-section="settings">
                                <i class="fas fa-cog"></i>
                                Settings
                            </a>
                        </nav>
                        
                        <div class="dashboard-actions">
                            <button class="btn btn-secondary" id="logout-btn">
                                <i class="fas fa-sign-out-alt"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                    
                    <div class="dashboard-main">
                        <div class="dashboard-section active" id="section-overview">
                            <!-- Overview content will be populated here -->
                        </div>
                        <div class="dashboard-section" id="section-orders">
                            <!-- Orders content will be populated here -->
                        </div>
                        <div class="dashboard-section" id="section-wishlist">
                            <!-- Wishlist content will be populated here -->
                        </div>
                        <div class="dashboard-section" id="section-loyalty">
                            <!-- Loyalty content will be populated here -->
                        </div>
                        <div class="dashboard-section" id="section-profile">
                            <!-- Profile content will be populated here -->
                        </div>
                        <div class="dashboard-section" id="section-addresses">
                            <!-- Addresses content will be populated here -->
                        </div>
                        <div class="dashboard-section" id="section-payment">
                            <!-- Payment content will be populated here -->
                        </div>
                        <div class="dashboard-section" id="section-settings">
                            <!-- Settings content will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dashboardModal);

        // Setup dashboard navigation
        this.setupDashboardNavigation();
    }

    setupDashboardNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-item') || e.target.closest('.nav-item')) {
                e.preventDefault();
                const navItem = e.target.classList.contains('nav-item') ? e.target : e.target.closest('.nav-item');
                const section = navItem.getAttribute('data-section');
                this.showDashboardSection(section);
            }
            
            if (e.target.id === 'dashboard-close' || e.target.closest('#dashboard-close')) {
                this.hideDashboard();
            }
            
            if (e.target.id === 'logout-btn') {
                this.logoutUser();
            }
        });
    }

    showDashboardSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.dashboard-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`section-${sectionName}`).classList.add('active');
        
        // Load section content
        this.loadDashboardSection(sectionName);
    }

    loadDashboardSection(sectionName) {
        const section = document.getElementById(`section-${sectionName}`);
        
        switch (sectionName) {
            case 'overview':
                this.loadOverviewSection(section);
                break;
            case 'orders':
                this.loadOrdersSection(section);
                break;
            case 'wishlist':
                this.loadWishlistSection(section);
                break;
            case 'loyalty':
                this.loadLoyaltySection(section);
                break;
            case 'profile':
                this.loadProfileSection(section);
                break;
            case 'addresses':
                this.loadAddressesSection(section);
                break;
            case 'payment':
                this.loadPaymentSection(section);
                break;
            case 'settings':
                this.loadSettingsSection(section);
                break;
        }
    }

    // Modal Controls
    showLoginModal() {
        document.getElementById('login-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideLoginModal() {
        document.getElementById('login-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    showRegisterModal() {
        document.getElementById('register-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideRegisterModal() {
        document.getElementById('register-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    hideAuthModals() {
        this.hideLoginModal();
        this.hideRegisterModal();
    }

    showDashboard() {
        if (!this.isLoggedIn) {
            this.showLoginModal();
            return;
        }
        
        document.getElementById('user-name').textContent = this.currentUser.firstName;
        document.getElementById('dashboard-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Load default section
        this.loadDashboardSection('overview');
    }

    hideDashboard() {
        document.getElementById('dashboard-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    updateAuthUI() {
        const accountLink = document.getElementById('account-link');
        if (accountLink) {
            if (this.isLoggedIn) {
                accountLink.innerHTML = `<i class="fas fa-user-circle"></i>`;
                accountLink.title = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            } else {
                accountLink.innerHTML = `<i class="fas fa-user"></i>`;
                accountLink.title = 'Login / Register';
            }
        }
    }

    // Utility Functions
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hashPassword(password) {
        // In a real app, use proper password hashing
        return btoa(password + 'midasbeauty_salt');
    }

    checkPasswordStrength(password) {
        const strengthIndicator = document.getElementById('password-strength');
        let strength = 0;
        let feedback = [];

        if (password.length >= 8) strength++;
        else feedback.push('At least 8 characters');

        if (/[a-z]/.test(password)) strength++;
        else feedback.push('Lowercase letter');

        if (/[A-Z]/.test(password)) strength++;
        else feedback.push('Uppercase letter');

        if (/[0-9]/.test(password)) strength++;
        else feedback.push('Number');

        if (/[^A-Za-z0-9]/.test(password)) strength++;
        else feedback.push('Special character');

        const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const strengthColors = ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#28a745'];

        strengthIndicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill" style="width: ${(strength / 5) * 100}%; background: ${strengthColors[strength - 1] || '#dc3545'}"></div>
            </div>
            <div class="strength-text" style="color: ${strengthColors[strength - 1] || '#dc3545'}">
                ${strengthLevels[strength - 1] || 'Very Weak'}
            </div>
            ${feedback.length > 0 ? `<div class="strength-feedback">Missing: ${feedback.join(', ')}</div>` : ''}
        `;
    }

    togglePasswordVisibility(button) {
        const targetId = button.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    handleSocialLogin(provider) {
        // Simulate social login
        this.showNotification(`${provider} login would be implemented here`, 'info');
    }

    // Data Management
    loadCurrentUser() {
        const stored = localStorage.getItem('midasBeautyUser') || sessionStorage.getItem('midasBeautyUser');
        return stored ? JSON.parse(stored) : null;
    }

    loadUsers() {
        const saved = localStorage.getItem('midasBeautyUsers');
        return saved ? JSON.parse(saved) : {};
    }

    saveUsers() {
        localStorage.setItem('midasBeautyUsers', JSON.stringify(this.users));
    }

    showNotification(message, type = 'info') {
        if (window.enhancedNavigation) {
            window.enhancedNavigation.showNotification(message, type);
        }
    }

    trackUserLogin(user) {
        const analyticsData = {
            event: 'user_login',
            userId: user.id,
            timestamp: new Date().toISOString()
        };

        const existingAnalytics = JSON.parse(localStorage.getItem('midasBeautyAnalytics') || '[]');
        existingAnalytics.push(analyticsData);
        localStorage.setItem('midasBeautyAnalytics', JSON.stringify(existingAnalytics));
    }

    // Dashboard Section Loaders
    loadOverviewSection(section) {
        const userOrders = window.orderManager ? window.orderManager.getOrdersByCustomer(this.currentUser.id) : [];
        const recentOrders = userOrders.slice(0, 3);
        const totalSpent = userOrders.reduce((sum, order) => sum + order.pricing.total, 0);

        section.innerHTML = `
            <div class="overview-header">
                <h3>Account Overview</h3>
                <p>Here's what's happening with your account</p>
            </div>

            <div class="overview-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${userOrders.length}</div>
                        <div class="stat-label">Total Orders</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">$${totalSpent.toFixed(2)}</div>
                        <div class="stat-label">Total Spent</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${this.currentUser.loyaltyPoints || 0}</div>
                        <div class="stat-label">Loyalty Points</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${this.getWishlistCount()}</div>
                        <div class="stat-label">Wishlist Items</div>
                    </div>
                </div>
            </div>

            <div class="overview-sections">
                <div class="recent-orders">
                    <h4>Recent Orders</h4>
                    ${recentOrders.length > 0 ? `
                        <div class="orders-list">
                            ${recentOrders.map(order => `
                                <div class="order-item">
                                    <div class="order-info">
                                        <div class="order-number">#${order.orderNumber}</div>
                                        <div class="order-date">${new Date(order.orderDate).toLocaleDateString()}</div>
                                    </div>
                                    <div class="order-status">
                                        <span class="status-badge ${order.status}">${window.orderManager.orderStatuses[order.status].label}</span>
                                    </div>
                                    <div class="order-total">$${order.pricing.total.toFixed(2)}</div>
                                </div>
                            `).join('')}
                        </div>
                        <a href="#" class="view-all-link" data-section="orders">View All Orders</a>
                    ` : `
                        <div class="empty-state">
                            <i class="fas fa-shopping-bag"></i>
                            <p>No orders yet. Start shopping to see your orders here!</p>
                            <a href="#" class="btn btn-primary" onclick="window.customerDashboard.hideDashboard()">Start Shopping</a>
                        </div>
                    `}
                </div>

                <div class="quick-actions">
                    <h4>Quick Actions</h4>
                    <div class="action-buttons">
                        <button class="action-btn" data-section="wishlist">
                            <i class="fas fa-heart"></i>
                            <span>View Wishlist</span>
                        </button>
                        <button class="action-btn" data-section="loyalty">
                            <i class="fas fa-star"></i>
                            <span>Loyalty Points</span>
                        </button>
                        <button class="action-btn" data-section="profile">
                            <i class="fas fa-user-edit"></i>
                            <span>Edit Profile</span>
                        </button>
                        <button class="action-btn" data-section="addresses">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Manage Addresses</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Setup quick action buttons
        section.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.getAttribute('data-section');
                this.showDashboardSection(targetSection);
            });
        });
    }

    loadOrdersSection(section) {
        const userOrders = window.orderManager ? window.orderManager.getOrdersByCustomer(this.currentUser.id) : [];

        section.innerHTML = `
            <div class="section-header">
                <h3>Order History</h3>
                <p>Track and manage all your orders</p>
            </div>

            <div class="orders-filters">
                <select class="filter-select" id="order-status-filter">
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <input type="date" class="filter-input" id="order-date-from" placeholder="From Date">
                <input type="date" class="filter-input" id="order-date-to" placeholder="To Date">

                <button class="btn btn-secondary" id="clear-filters">Clear Filters</button>
            </div>

            <div class="orders-container">
                ${userOrders.length > 0 ? `
                    <div class="orders-grid">
                        ${userOrders.map(order => this.createOrderCard(order)).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <i class="fas fa-shopping-bag"></i>
                        <h4>No orders found</h4>
                        <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
                        <a href="#" class="btn btn-primary" onclick="window.customerDashboard.hideDashboard()">Start Shopping</a>
                    </div>
                `}
            </div>
        `;
    }

    createOrderCard(order) {
        const statusInfo = window.orderManager.orderStatuses[order.status];

        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-number">Order #${order.orderNumber}</div>
                    <div class="order-date">${new Date(order.orderDate).toLocaleDateString()}</div>
                </div>

                <div class="order-status-section">
                    <span class="status-badge ${order.status}">
                        <i class="fas ${statusInfo.icon}"></i>
                        ${statusInfo.label}
                    </span>
                    ${order.tracking.trackingNumber ? `
                        <a href="${order.tracking.trackingUrl}" target="_blank" class="tracking-link">
                            <i class="fas fa-external-link-alt"></i>
                            Track Package
                        </a>
                    ` : ''}
                </div>

                <div class="order-items">
                    ${order.items.slice(0, 2).map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.productName}" class="item-image">
                            <div class="item-details">
                                <div class="item-name">${item.productName}</div>
                                <div class="item-quantity">Qty: ${item.quantity}</div>
                            </div>
                            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                    ${order.items.length > 2 ? `
                        <div class="more-items">+${order.items.length - 2} more items</div>
                    ` : ''}
                </div>

                <div class="order-footer">
                    <div class="order-total">
                        <strong>Total: $${order.pricing.total.toFixed(2)}</strong>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-sm btn-outline view-order-btn" data-order-id="${order.id}">
                            View Details
                        </button>
                        ${order.status === 'delivered' ? `
                            <button class="btn btn-sm btn-secondary reorder-btn" data-order-id="${order.id}">
                                Reorder
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    loadWishlistSection(section) {
        const wishlistData = JSON.parse(localStorage.getItem('midasBeautyWishlist') || '{"items": []}');
        const wishlistItems = wishlistData.items || [];

        section.innerHTML = `
            <div class="section-header">
                <h3>My Wishlist</h3>
                <p>Save your favorite products for later</p>
            </div>

            <div class="wishlist-container">
                ${wishlistItems.length > 0 ? `
                    <div class="wishlist-grid">
                        ${wishlistItems.map(item => this.createWishlistCard(item)).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <i class="fas fa-heart"></i>
                        <h4>Your wishlist is empty</h4>
                        <p>Save products you love to your wishlist and shop them later!</p>
                        <a href="#" class="btn btn-primary" onclick="window.customerDashboard.hideDashboard()">Start Shopping</a>
                    </div>
                `}
            </div>
        `;
    }

    createWishlistCard(item) {
        return `
            <div class="wishlist-card" data-product-id="${item.id}">
                <div class="wishlist-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <button class="remove-wishlist-btn" data-product-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="wishlist-content">
                    <h4>${item.name}</h4>
                    <div class="wishlist-brand">${item.brand}</div>
                    <div class="wishlist-price">$${item.price.toFixed(2)}</div>
                    <div class="wishlist-actions">
                        <button class="btn btn-primary add-to-cart-btn" data-product-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getWishlistCount() {
        const wishlistData = JSON.parse(localStorage.getItem('midasBeautyWishlist') || '{"items": []}');
        return wishlistData.items ? wishlistData.items.length : 0;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.customerDashboard = new CustomerDashboard();
});

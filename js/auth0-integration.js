// Auth0 Integration for MidasBeauty E-commerce Platform
// Secure authentication with user management and profile handling

class MidasBeautyAuth {
    constructor() {
        // Auth0 Configuration
        this.auth0Config = {
            domain: 'dev-m2egy31mp68y3xz2.us.auth0.com',
            clientId: 'Y0debcPHj3m8TPN0xHXGaJgmfh5YQUxI',
            audience: 'https://dev-m2egy31mp68y3xz2.us.auth0.com/api/v2/',
            redirectUri: window.location.origin,
            scope: 'openid profile email read:current_user update:current_user_metadata'
        };

        this.auth0Client = null;
        this.user = null;
        this.isAuthenticated = false;
        this.isLoading = true;

        this.init();
    }

    async init() {
        try {
            // Initialize Auth0 client
            this.auth0Client = await createAuth0Client({
                domain: this.auth0Config.domain,
                clientId: this.auth0Config.clientId,
                authorizationParams: {
                    redirect_uri: this.auth0Config.redirectUri,
                    audience: this.auth0Config.audience,
                    scope: this.auth0Config.scope
                }
            });

            // Check if user is authenticated
            this.isAuthenticated = await this.auth0Client.isAuthenticated();

            if (this.isAuthenticated) {
                this.user = await this.auth0Client.getUser();
                this.updateUI();
                this.syncWithCustomerDashboard();
            }

            // Handle redirect callback
            if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
                await this.handleRedirectCallback();
            }

            this.isLoading = false;
            this.updateUI();

        } catch (error) {
            console.error('Auth0 initialization error:', error);
            this.isLoading = false;
            this.showError('Authentication service initialization failed');
        }
    }

    async handleRedirectCallback() {
        try {
            const result = await this.auth0Client.handleRedirectCallback();
            this.user = await this.auth0Client.getUser();
            this.isAuthenticated = true;

            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);

            // Sync with customer dashboard
            this.syncWithCustomerDashboard();
            this.updateUI();

            // Show welcome message
            this.showSuccess(`Welcome back, ${this.user.name || this.user.nickname}!`);

        } catch (error) {
            console.error('Redirect callback error:', error);
            this.showError('Login failed. Please try again.');
        }
    }

    async login(options = {}) {
        try {
            await this.auth0Client.loginWithRedirect({
                authorizationParams: {
                    screen_hint: options.mode || 'login' // 'login' or 'signup'
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Login failed. Please try again.');
        }
    }

    async logout() {
        try {
            // Clear local data
            this.clearLocalData();

            // Logout from Auth0
            await this.auth0Client.logout({
                logoutParams: {
                    returnTo: window.location.origin
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
            this.showError('Logout failed. Please try again.');
        }
    }

    async getAccessToken() {
        try {
            if (!this.isAuthenticated) {
                throw new Error('User not authenticated');
            }

            return await this.auth0Client.getTokenSilently();
        } catch (error) {
            console.error('Token error:', error);
            return null;
        }
    }

    async updateUserProfile(updates) {
        try {
            const token = await this.getAccessToken();
            if (!token) {
                throw new Error('No access token available');
            }

            const response = await fetch(`https://${this.auth0Config.domain}/api/v2/users/${this.user.sub}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_metadata: updates
                })
            });

            if (!response.ok) {
                throw new Error('Profile update failed');
            }

            // Refresh user data
            this.user = await this.auth0Client.getUser();
            this.syncWithCustomerDashboard();
            this.updateUI();

            this.showSuccess('Profile updated successfully!');
            return true;

        } catch (error) {
            console.error('Profile update error:', error);
            this.showError('Failed to update profile. Please try again.');
            return false;
        }
    }

    syncWithCustomerDashboard() {
        if (!this.user || !window.customerDashboard) return;

        // Create customer profile for dashboard
        const customerProfile = {
            id: this.user.sub,
            email: this.user.email,
            name: this.user.name || this.user.nickname,
            picture: this.user.picture,
            nickname: this.user.nickname,
            emailVerified: this.user.email_verified,
            lastLogin: new Date().toISOString(),
            preferences: this.user.user_metadata || {},
            loyaltyPoints: this.user.user_metadata?.loyaltyPoints || 0,
            membershipTier: this.user.user_metadata?.membershipTier || 'Bronze'
        };

        // Update customer dashboard
        window.customerDashboard.setCustomerProfile(customerProfile);
        window.customerDashboard.isLoggedIn = true;

        // Store in localStorage for persistence
        localStorage.setItem('midasBeautyCustomer', JSON.stringify(customerProfile));
    }

    clearLocalData() {
        // Clear customer dashboard data
        if (window.customerDashboard) {
            window.customerDashboard.logout();
        }

        // Clear localStorage
        localStorage.removeItem('midasBeautyCustomer');
        localStorage.removeItem('midasBeautyCart');
        localStorage.removeItem('midasBeautyWishlist');

        // Reset state
        this.user = null;
        this.isAuthenticated = false;
    }

    updateUI() {
        const accountLink = document.getElementById('account-link');
        const accountIcon = accountLink?.querySelector('i');

        if (this.isLoading) {
            if (accountIcon) {
                accountIcon.className = 'fas fa-spinner fa-spin';
            }
            return;
        }

        if (this.isAuthenticated && this.user) {
            // Update account link for logged-in user
            if (accountLink) {
                accountLink.title = `${this.user.name || this.user.nickname} - My Account`;
                if (accountIcon) {
                    accountIcon.className = 'fas fa-user-circle';
                }

                // Add user indicator
                this.addUserIndicator();
            }

            // Update any welcome messages
            this.updateWelcomeMessages();

        } else {
            // Update account link for guest user
            if (accountLink) {
                accountLink.title = 'Login / Register';
                if (accountIcon) {
                    accountIcon.className = 'fas fa-user';
                }
            }

            // Remove user indicator
            this.removeUserIndicator();
        }
    }

    addUserIndicator() {
        const headerIcons = document.querySelector('.header-icons');
        if (!headerIcons || document.getElementById('user-indicator')) return;

        const userIndicator = document.createElement('div');
        userIndicator.id = 'user-indicator';
        userIndicator.className = 'user-indicator';
        userIndicator.innerHTML = `
            <div class="user-avatar">
                <img src="${this.user.picture}" alt="${this.user.name || this.user.nickname}" loading="lazy">
            </div>
            <div class="user-welcome">
                <span>Welcome, ${this.user.nickname || this.user.name?.split(' ')[0]}!</span>
            </div>
        `;

        headerIcons.insertBefore(userIndicator, headerIcons.firstChild);
    }

    removeUserIndicator() {
        const userIndicator = document.getElementById('user-indicator');
        if (userIndicator) {
            userIndicator.remove();
        }
    }

    updateWelcomeMessages() {
        const welcomeElements = document.querySelectorAll('.welcome-message');
        welcomeElements.forEach(element => {
            element.textContent = `Welcome back, ${this.user.name || this.user.nickname}!`;
        });
    }

    showSuccess(message) {
        if (window.headerManager) {
            window.headerManager.showNotification(message, 'success');
        } else {
            console.log('Success:', message);
        }
    }

    showError(message) {
        if (window.headerManager) {
            window.headerManager.showNotification(message, 'error');
        } else {
            console.error('Error:', message);
        }
    }

    // Public API methods
    getUser() {
        return this.user;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    async getUserMetadata() {
        if (!this.user) return null;
        return this.user.user_metadata || {};
    }

    async updateUserMetadata(metadata) {
        return await this.updateUserProfile(metadata);
    }

    // Loyalty program integration
    async addLoyaltyPoints(points, reason = 'Purchase') {
        if (!this.isAuthenticated) return false;

        const currentPoints = this.user.user_metadata?.loyaltyPoints || 0;
        const newPoints = currentPoints + points;

        const success = await this.updateUserProfile({
            loyaltyPoints: newPoints,
            lastPointsEarned: {
                amount: points,
                reason: reason,
                date: new Date().toISOString()
            }
        });

        if (success) {
            this.showSuccess(`You earned ${points} loyalty points!`);
        }

        return success;
    }

    // Admin check
    isAdmin() {
        if (!this.user) return false;
        return this.user.user_metadata?.role === 'admin' || 
               this.user.app_metadata?.role === 'admin' ||
               this.user.email === 'midastechnicalsolutions@gmail.com';
    }

    // Event handlers for integration
    setupEventHandlers() {
        // Account link click handler
        const accountLink = document.getElementById('account-link');
        if (accountLink) {
            accountLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isAuthenticated) {
                    // Show customer dashboard
                    if (window.customerDashboard) {
                        window.customerDashboard.showDashboard();
                    }
                } else {
                    // Show login
                    this.login();
                }
            });
        }

        // Listen for customer dashboard events
        document.addEventListener('customerLogout', () => {
            this.logout();
        });

        document.addEventListener('customerProfileUpdate', (e) => {
            if (e.detail) {
                this.updateUserProfile(e.detail);
            }
        });
    }
}

// CSS for user indicator
const authStyles = `
<style>
.user-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: linear-gradient(135deg, var(--pearl-white), var(--rich-white));
    border-radius: 25px;
    border: 1px solid var(--light-gray);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.user-indicator:hover {
    background: linear-gradient(135deg, var(--primary-gold), var(--accent-gold));
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid var(--primary-gold);
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-welcome {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--deep-black);
    white-space: nowrap;
}

.user-indicator:hover .user-welcome {
    color: var(--deep-black);
}

@media (max-width: 768px) {
    .user-indicator {
        padding: 6px 10px;
    }
    
    .user-avatar {
        width: 28px;
        height: 28px;
    }
    
    .user-welcome {
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {
    .user-welcome {
        display: none;
    }
}
</style>
`;

// Initialize Auth0 integration
document.addEventListener('DOMContentLoaded', () => {
    // Inject styles
    document.head.insertAdjacentHTML('beforeend', authStyles);
    
    // Initialize Auth0 (only if Auth0 SDK is loaded)
    if (typeof createAuth0Client !== 'undefined') {
        window.midasBeautyAuth = new MidasBeautyAuth();
        
        // Setup event handlers after initialization
        setTimeout(() => {
            window.midasBeautyAuth.setupEventHandlers();
        }, 1000);
    } else {
        console.warn('Auth0 SDK not loaded. Please include the Auth0 SPA SDK.');
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MidasBeautyAuth;
}

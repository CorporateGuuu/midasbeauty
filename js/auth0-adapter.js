// Auth0 Adapter for MidasBeauty Customer Dashboard
// Bridges Auth0 authentication with existing customer dashboard system

class Auth0CustomerAdapter {
    constructor() {
        this.auth0Config = {
            domain: 'dev-m2egy31mp68y3xz2.us.auth0.com',
            clientId: 'Y0debcPHj3m8TPN0xHXGaJgmfh5YQUxI',
            audience: 'https://dev-m2egy31mp68y3xz2.us.auth0.com/api/v2/',
            redirectUri: window.location.origin,
            scope: 'openid profile email read:current_user update:current_user_metadata'
        };

        this.auth0Client = null;
        this.customerDashboard = null;
        this.isInitialized = false;

        this.init();
    }

    async init() {
        try {
            // Wait for customer dashboard to be available
            await this.waitForCustomerDashboard();

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

            // Override customer dashboard authentication methods
            this.overrideAuthenticationMethods();

            // Check if user is authenticated
            const isAuthenticated = await this.auth0Client.isAuthenticated();
            if (isAuthenticated) {
                await this.handleAuth0Login();
            }

            // Handle redirect callback
            if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
                await this.handleRedirectCallback();
            }

            this.isInitialized = true;
            console.log('Auth0 adapter initialized successfully');

        } catch (error) {
            console.error('Auth0 adapter initialization error:', error);
            // Fallback to original authentication system
            this.enableFallbackAuth();
        }
    }

    async waitForCustomerDashboard() {
        return new Promise((resolve) => {
            const checkDashboard = () => {
                if (window.customerDashboard) {
                    this.customerDashboard = window.customerDashboard;
                    resolve();
                } else {
                    setTimeout(checkDashboard, 100);
                }
            };
            checkDashboard();
        });
    }

    overrideAuthenticationMethods() {
        if (!this.customerDashboard) return;

        // Store original methods
        this.customerDashboard._originalHandleLogin = this.customerDashboard.handleLogin;
        this.customerDashboard._originalHandleRegistration = this.customerDashboard.handleRegistration;
        this.customerDashboard._originalHandleSocialLogin = this.customerDashboard.handleSocialLogin;
        this.customerDashboard._originalLogoutUser = this.customerDashboard.logoutUser;

        // Override with Auth0 methods
        this.customerDashboard.handleLogin = (form) => this.handleAuth0LoginRedirect();
        this.customerDashboard.handleRegistration = (form) => this.handleAuth0RegisterRedirect();
        this.customerDashboard.handleSocialLogin = (provider) => this.handleAuth0SocialLogin(provider);
        this.customerDashboard.logoutUser = () => this.handleAuth0Logout();

        // Add Auth0 profile update method
        this.customerDashboard.updateAuth0Profile = (updates) => this.updateAuth0UserProfile(updates);

        // Add method to set customer profile from Auth0
        this.customerDashboard.setCustomerProfile = (profile) => this.setCustomerProfile(profile);
    }

    async handleAuth0LoginRedirect() {
        try {
            await this.auth0Client.loginWithRedirect({
                authorizationParams: {
                    screen_hint: 'login'
                }
            });
        } catch (error) {
            console.error('Auth0 login redirect error:', error);
            this.customerDashboard.showNotification('Login failed. Please try again.', 'error');
        }
    }

    async handleAuth0RegisterRedirect() {
        try {
            await this.auth0Client.loginWithRedirect({
                authorizationParams: {
                    screen_hint: 'signup'
                }
            });
        } catch (error) {
            console.error('Auth0 register redirect error:', error);
            this.customerDashboard.showNotification('Registration failed. Please try again.', 'error');
        }
    }

    async handleAuth0SocialLogin(provider) {
        try {
            await this.auth0Client.loginWithRedirect({
                authorizationParams: {
                    connection: provider === 'google' ? 'google-oauth2' : 'facebook'
                }
            });
        } catch (error) {
            console.error('Auth0 social login error:', error);
            this.customerDashboard.showNotification(`${provider} login failed. Please try again.`, 'error');
        }
    }

    async handleAuth0Logout() {
        try {
            // Clear customer dashboard data
            this.customerDashboard.currentUser = null;
            this.customerDashboard.isLoggedIn = false;
            this.customerDashboard.updateAuthUI();
            this.customerDashboard.hideDashboard();

            // Clear local storage
            localStorage.removeItem('midasBeautyUser');
            sessionStorage.removeItem('midasBeautyUser');
            localStorage.removeItem('midasBeautyCart');
            localStorage.removeItem('midasBeautyWishlist');

            // Logout from Auth0
            await this.auth0Client.logout({
                logoutParams: {
                    returnTo: window.location.origin
                }
            });
        } catch (error) {
            console.error('Auth0 logout error:', error);
            this.customerDashboard.showNotification('Logout failed. Please try again.', 'error');
        }
    }

    async handleRedirectCallback() {
        try {
            await this.auth0Client.handleRedirectCallback();
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Handle successful login
            await this.handleAuth0Login();
            
        } catch (error) {
            console.error('Auth0 redirect callback error:', error);
            this.customerDashboard.showNotification('Login failed. Please try again.', 'error');
        }
    }

    async handleAuth0Login() {
        try {
            const user = await this.auth0Client.getUser();
            if (!user) return;

            // Convert Auth0 user to customer dashboard format
            const customerProfile = this.convertAuth0UserToCustomer(user);

            // Set customer in dashboard
            this.setCustomerProfile(customerProfile);

            // Update UI
            this.customerDashboard.updateAuthUI();

            // Show welcome message
            this.customerDashboard.showNotification(
                `Welcome back, ${user.name || user.nickname}!`, 
                'success'
            );

            console.log('Auth0 login successful:', user);

        } catch (error) {
            console.error('Auth0 login handling error:', error);
            this.customerDashboard.showNotification('Login processing failed.', 'error');
        }
    }

    convertAuth0UserToCustomer(auth0User) {
        const metadata = auth0User.user_metadata || {};
        const appMetadata = auth0User.app_metadata || {};

        return {
            id: auth0User.sub,
            firstName: auth0User.given_name || metadata.firstName || auth0User.name?.split(' ')[0] || '',
            lastName: auth0User.family_name || metadata.lastName || auth0User.name?.split(' ').slice(1).join(' ') || '',
            email: auth0User.email,
            phone: metadata.phone || '',
            birthday: metadata.birthday || '',
            
            // Account metadata
            createdAt: auth0User.created_at || new Date().toISOString(),
            lastLogin: auth0User.updated_at || new Date().toISOString(),
            emailVerified: auth0User.email_verified || false,
            accountStatus: 'active',
            picture: auth0User.picture,
            nickname: auth0User.nickname,
            
            // Profile data from user_metadata
            profile: {
                skinType: metadata.skinType || '',
                skinConcerns: metadata.skinConcerns || [],
                allergies: metadata.allergies || [],
                favoriteCategories: metadata.favoriteCategories || [],
                preferredBrands: metadata.preferredBrands || [],
                beautyGoals: metadata.beautyGoals || []
            },
            
            // Preferences
            preferences: {
                emailNotifications: metadata.emailNotifications !== false,
                smsNotifications: metadata.smsNotifications || false,
                marketingEmails: metadata.marketingEmails !== false,
                language: metadata.language || 'en',
                currency: metadata.currency || 'USD'
            },
            
            // Addresses and payment methods (stored in user_metadata)
            addresses: metadata.addresses || [],
            paymentMethods: metadata.paymentMethods || [],
            
            // Loyalty and rewards
            loyaltyPoints: metadata.loyaltyPoints || 0,
            loyaltyTier: metadata.loyaltyTier || 'bronze',
            totalSpent: metadata.totalSpent || 0,
            orderCount: metadata.orderCount || 0,
            
            // Auth0 specific
            auth0Id: auth0User.sub,
            isAuth0User: true
        };
    }

    setCustomerProfile(profile) {
        if (!this.customerDashboard) return;

        // Set current user
        this.customerDashboard.currentUser = profile;
        this.customerDashboard.isLoggedIn = true;

        // Store in localStorage for persistence
        localStorage.setItem('midasBeautyUser', JSON.stringify(profile));

        // Update users collection if needed
        if (this.customerDashboard.users) {
            this.customerDashboard.users[profile.id] = profile;
            this.customerDashboard.saveUsers();
        }
    }

    async updateAuth0UserProfile(updates) {
        try {
            const token = await this.auth0Client.getTokenSilently();
            if (!token) {
                throw new Error('No access token available');
            }

            const user = await this.auth0Client.getUser();
            if (!user) {
                throw new Error('No user available');
            }

            const response = await fetch(`https://${this.auth0Config.domain}/api/v2/users/${user.sub}`, {
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
            const updatedUser = await this.auth0Client.getUser();
            const customerProfile = this.convertAuth0UserToCustomer(updatedUser);
            this.setCustomerProfile(customerProfile);

            this.customerDashboard.showNotification('Profile updated successfully!', 'success');
            return true;

        } catch (error) {
            console.error('Auth0 profile update error:', error);
            this.customerDashboard.showNotification('Failed to update profile. Please try again.', 'error');
            return false;
        }
    }

    async addLoyaltyPoints(points, reason = 'Purchase') {
        if (!this.customerDashboard.currentUser) return false;

        const currentPoints = this.customerDashboard.currentUser.loyaltyPoints || 0;
        const newPoints = currentPoints + points;

        const success = await this.updateAuth0UserProfile({
            loyaltyPoints: newPoints,
            lastPointsEarned: {
                amount: points,
                reason: reason,
                date: new Date().toISOString()
            }
        });

        if (success) {
            this.customerDashboard.showNotification(`You earned ${points} loyalty points!`, 'success');
        }

        return success;
    }

    enableFallbackAuth() {
        console.log('Enabling fallback authentication system');
        // The original customer dashboard authentication will continue to work
        // This method can be used to show a notice about Auth0 being unavailable
        if (this.customerDashboard) {
            this.customerDashboard.showNotification(
                'Using local authentication. Some features may be limited.', 
                'info'
            );
        }
    }

    // Public API methods
    isAuth0Available() {
        return this.isInitialized && this.auth0Client !== null;
    }

    async getAuth0User() {
        if (!this.auth0Client) return null;
        try {
            return await this.auth0Client.getUser();
        } catch (error) {
            console.error('Error getting Auth0 user:', error);
            return null;
        }
    }

    async getAccessToken() {
        if (!this.auth0Client) return null;
        try {
            return await this.auth0Client.getTokenSilently();
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    }
}

// Initialize Auth0 adapter when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if Auth0 SDK is available
    if (typeof createAuth0Client !== 'undefined') {
        window.auth0Adapter = new Auth0CustomerAdapter();
    } else {
        console.warn('Auth0 SDK not loaded. Using fallback authentication.');
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth0CustomerAdapter;
}

// Enhanced Header Functionality for MidasBeauty
// Handles mobile menu, search, cart/wishlist counts, and header interactions

class HeaderManager {
    constructor() {
        this.mobileMenuOpen = false;
        this.searchSuggestions = [];
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSearchFunctionality();
        this.setupHeaderScrollEffect();
        this.setupDropdownMenus();
        this.updateCartWishlistCounts();
        this.setupHeaderInteractions();
    }

    // Mobile Menu Functionality
    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mainNavigation = document.getElementById('main-navigation');
        
        if (mobileToggle && mainNavigation) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.mobileMenuOpen && 
                    !mobileToggle.contains(e.target) && 
                    !mainNavigation.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close mobile menu on window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mainNavigation = document.getElementById('main-navigation');
        
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mainNavigation = document.getElementById('main-navigation');
        
        this.mobileMenuOpen = true;
        mobileToggle.classList.add('active');
        mainNavigation.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mainNavigation = document.getElementById('main-navigation');
        
        this.mobileMenuOpen = false;
        mobileToggle.classList.remove('active');
        mainNavigation.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Enhanced Search Functionality
    setupSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        const searchForm = document.getElementById('search-form');
        const searchSuggestions = document.getElementById('search-suggestions');

        if (searchInput) {
            // Real-time search suggestions
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    this.showSearchSuggestions(query);
                } else {
                    this.hideSearchSuggestions();
                }
            });

            // Hide suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchSuggestions?.contains(e.target)) {
                    this.hideSearchSuggestions();
                }
            });

            // Handle search form submission
            if (searchForm) {
                searchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.performSearch(searchInput.value.trim());
                });
            }
        }
    }

    showSearchSuggestions(query) {
        const searchSuggestions = document.getElementById('search-suggestions');
        if (!searchSuggestions) return;

        // Get product suggestions (integrate with product database)
        const suggestions = this.getSearchSuggestions(query);
        
        if (suggestions.length > 0) {
            searchSuggestions.innerHTML = `
                <div class="suggestions-list">
                    ${suggestions.map(suggestion => `
                        <div class="suggestion-item" onclick="headerManager.selectSuggestion('${suggestion.name}')">
                            <div class="suggestion-icon">
                                <i class="fas ${suggestion.icon}"></i>
                            </div>
                            <div class="suggestion-content">
                                <div class="suggestion-name">${suggestion.name}</div>
                                <div class="suggestion-category">${suggestion.category}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            searchSuggestions.classList.add('active');
        } else {
            this.hideSearchSuggestions();
        }
    }

    hideSearchSuggestions() {
        const searchSuggestions = document.getElementById('search-suggestions');
        if (searchSuggestions) {
            searchSuggestions.classList.remove('active');
        }
    }

    getSearchSuggestions(query) {
        // Sample suggestions - integrate with actual product database
        const allSuggestions = [
            { name: '24K Gold Serum', category: 'Skincare', icon: 'fa-tint' },
            { name: 'Velvet Foundation', category: 'Makeup', icon: 'fa-palette' },
            { name: 'Hydrating Moisturizer', category: 'Skincare', icon: 'fa-heart' },
            { name: 'Volumizing Mascara', category: 'Makeup', icon: 'fa-eye' },
            { name: 'Repair Shampoo', category: 'Haircare', icon: 'fa-cut' },
            { name: 'Luxury Fragrance', category: 'Fragrance', icon: 'fa-spray-can' },
            { name: 'Gentle Cleanser', category: 'Skincare', icon: 'fa-soap' },
            { name: 'Radiant Glow Collection', category: 'Collection', icon: 'fa-star' }
        ];

        return allSuggestions
            .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
    }

    selectSuggestion(suggestionName) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = suggestionName;
            this.performSearch(suggestionName);
        }
        this.hideSearchSuggestions();
    }

    performSearch(query) {
        if (query) {
            // Integrate with search functionality
            if (window.searchSystem) {
                window.searchSystem.performSearch(query);
            } else {
                // Fallback: redirect to search results page
                window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
            }
        }
    }

    // Header Scroll Effect
    setupHeaderScrollEffect() {
        let lastScrollTop = 0;
        const header = document.querySelector('header');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide header on scroll down, show on scroll up
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // Dropdown Menu Enhancements
    setupDropdownMenus() {
        const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
        
        dropdownItems.forEach(item => {
            const dropdownMenu = item.querySelector('.dropdown-menu');
            let hoverTimeout;

            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                dropdownMenu?.classList.add('show');
            });

            item.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    dropdownMenu?.classList.remove('show');
                }, 300);
            });

            // Handle mobile dropdown clicks
            const dropdownToggle = item.querySelector('.dropdown-toggle');
            if (dropdownToggle) {
                dropdownToggle.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdownMenu?.classList.toggle('show');
                    }
                });
            }
        });
    }

    // Update Cart and Wishlist Counts
    updateCartWishlistCounts() {
        this.updateCartCount();
        this.updateWishlistCount();
        
        // Update counts periodically
        setInterval(() => {
            this.updateCartCount();
            this.updateWishlistCount();
        }, 5000);
    }

    updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const cartData = JSON.parse(localStorage.getItem('midasBeautyCart') || '{"items": []}');
            const totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
            
            cartCountElement.textContent = totalItems;
            
            if (totalItems > 0) {
                cartCountElement.classList.add('show');
            } else {
                cartCountElement.classList.remove('show');
            }
        }
    }

    updateWishlistCount() {
        const wishlistCountElement = document.getElementById('wishlist-count');
        if (wishlistCountElement) {
            const wishlistData = JSON.parse(localStorage.getItem('midasBeautyWishlist') || '{"items": []}');
            const totalItems = wishlistData.items.length;
            
            wishlistCountElement.textContent = totalItems;
            
            if (totalItems > 0) {
                wishlistCountElement.classList.add('show');
            } else {
                wishlistCountElement.classList.remove('show');
            }
        }
    }

    // Header Interactions
    setupHeaderInteractions() {
        // Account link interaction
        const accountLink = document.getElementById('account-link');
        if (accountLink) {
            accountLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.customerDashboard) {
                    if (window.customerDashboard.isLoggedIn) {
                        window.customerDashboard.showDashboard();
                    } else {
                        window.customerDashboard.showLoginModal();
                    }
                }
            });
        }

        // Cart toggle interaction
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.cartSystem) {
                    window.cartSystem.toggleCart();
                }
            });
        }

        // Wishlist toggle interaction
        const wishlistToggle = document.getElementById('wishlist-toggle');
        if (wishlistToggle) {
            wishlistToggle.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.customerDashboard) {
                    if (window.customerDashboard.isLoggedIn) {
                        window.customerDashboard.showDashboard();
                        setTimeout(() => {
                            window.customerDashboard.showDashboardSection('wishlist');
                        }, 300);
                    } else {
                        window.customerDashboard.showLoginModal();
                    }
                }
            });
        }
    }

    // Public methods for external use
    showNotification(message, type = 'info') {
        // Create and show header notification
        const notification = document.createElement('div');
        notification.className = `header-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize header manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.headerManager = new HeaderManager();
});

// Add CSS for search suggestions and notifications
const headerStyles = `
<style>
.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--rich-white);
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid var(--light-gray);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1002;
    margin-top: 8px;
}

.search-suggestions.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.suggestions-list {
    padding: var(--spacing-sm);
}

.suggestion-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.suggestion-item:hover {
    background: var(--pearl-white);
    transform: translateX(4px);
}

.suggestion-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--primary-gold), var(--accent-gold));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--deep-black);
    font-size: 0.9rem;
}

.suggestion-content {
    flex: 1;
}

.suggestion-name {
    font-weight: 600;
    color: var(--deep-black);
    margin-bottom: 2px;
}

.suggestion-category {
    font-size: 0.8rem;
    color: var(--sophisticated-gray);
}

.header-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--rich-white);
    border-radius: 8px;
    padding: var(--spacing-md);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-left: 4px solid var(--primary-gold);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
}

.header-notification.show {
    transform: translateX(0);
}

.header-notification.success {
    border-left-color: #28a745;
}

.header-notification.error {
    border-left-color: #dc3545;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.notification-content i {
    font-size: 1.1rem;
    color: var(--primary-gold);
}

.header-notification.success .notification-content i {
    color: #28a745;
}

.header-notification.error .notification-content i {
    color: #dc3545;
}

/* Header scroll effects */
header.scrolled {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    box-shadow: 0 4px 30px rgba(26, 26, 26, 0.1);
}

header.header-hidden {
    transform: translateY(-100%);
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
    .search-suggestions {
        left: -20px;
        right: -20px;
    }
    
    .header-notification {
        right: 10px;
        left: 10px;
        max-width: none;
    }
}
</style>
`;

// Inject styles into head
document.head.insertAdjacentHTML('beforeend', headerStyles);

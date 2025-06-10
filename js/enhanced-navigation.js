// Enhanced Navigation for MidasBeauty
// Handles mobile menu, dropdown navigation, and newsletter functionality

class EnhancedNavigation {
    constructor() {
        this.mobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupDropdownMenus();
        this.setupNewsletterForm();
        this.setupWishlistCounter();
        this.setupScrollEffects();
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mainNav = document.getElementById('main-navigation');

        if (mobileToggle && mainNav) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !mainNav.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close mobile menu on window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mainNav = document.getElementById('main-navigation');

        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mainNav = document.getElementById('main-navigation');

        this.mobileMenuOpen = true;
        mobileToggle.classList.add('active');
        mainNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mainNav = document.getElementById('main-navigation');

        this.mobileMenuOpen = false;
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';

        // Close all dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    setupDropdownMenus() {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            
            if (toggle) {
                // Desktop hover behavior
                if (window.innerWidth > 768) {
                    dropdown.addEventListener('mouseenter', () => {
                        this.showDropdown(dropdown);
                    });

                    dropdown.addEventListener('mouseleave', () => {
                        this.hideDropdown(dropdown);
                    });
                }

                // Mobile click behavior
                toggle.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        this.toggleDropdown(dropdown);
                    }
                });
            }
        });

        // Update behavior on window resize
        window.addEventListener('resize', () => {
            this.setupDropdownMenus();
        });
    }

    showDropdown(dropdown) {
        dropdown.classList.add('active');
    }

    hideDropdown(dropdown) {
        dropdown.classList.remove('active');
    }

    toggleDropdown(dropdown) {
        dropdown.classList.toggle('active');
    }

    setupNewsletterForm() {
        const newsletterForm = document.getElementById('newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmission(e.target);
            });
        }
    }

    handleNewsletterSubmission(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('.newsletter-btn');
        const email = emailInput.value.trim();

        if (!email) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Store email in localStorage for demo purposes
            const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
            
            if (subscribers.includes(email)) {
                this.showNotification('You are already subscribed to our newsletter!', 'info');
            } else {
                subscribers.push(email);
                localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
                this.showNotification('Thank you for subscribing! Welcome to Midas Beauty!', 'success');
                emailInput.value = '';
            }

            // Reset button
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
        }, 1500);
    }

    setupWishlistCounter() {
        // Update wishlist counter from localStorage
        this.updateWishlistCounter();

        // Listen for wishlist changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'midasBeautyWishlist') {
                this.updateWishlistCounter();
            }
        });

        // Update counter periodically
        setInterval(() => {
            this.updateWishlistCounter();
        }, 5000);
    }

    updateWishlistCounter() {
        const wishlistCount = document.getElementById('wishlist-count');
        if (wishlistCount) {
            const wishlistData = localStorage.getItem('midasBeautyWishlist');
            let count = 0;
            
            if (wishlistData) {
                try {
                    const data = JSON.parse(wishlistData);
                    count = data.items ? data.items.length : 0;
                } catch (error) {
                    console.error('Error parsing wishlist data:', error);
                }
            }
            
            wishlistCount.textContent = count;
            wishlistCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    setupScrollEffects() {
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
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `navigation-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'info':
                return 'fa-info-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            default:
                return 'fa-bell';
        }
    }

    // Public methods
    closeAllDropdowns() {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    updateCartCounter(count) {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
    }
}

// Initialize enhanced navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedNavigation = new EnhancedNavigation();
});

// Add CSS for navigation notifications
const navStyle = document.createElement('style');
navStyle.textContent = `
    .navigation-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--rich-white);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        min-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    }
    
    .navigation-notification.show {
        transform: translateX(0);
    }
    
    .navigation-notification.success {
        border-left: 4px solid #4CAF50;
    }
    
    .navigation-notification.error {
        border-left: 4px solid #f44336;
    }
    
    .navigation-notification.info {
        border-left: 4px solid #2196F3;
    }
    
    .navigation-notification.warning {
        border-left: 4px solid #ff9800;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .navigation-notification.success .notification-content i {
        color: #4CAF50;
    }
    
    .navigation-notification.error .notification-content i {
        color: #f44336;
    }
    
    .navigation-notification.info .notification-content i {
        color: #2196F3;
    }
    
    .navigation-notification.warning .notification-content i {
        color: #ff9800;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--sophisticated-gray);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: background 0.3s ease;
    }
    
    .notification-close:hover {
        background: var(--light-gray);
    }
    
    header.scrolled {
        background: rgba(254, 254, 254, 0.95);
        backdrop-filter: blur(20px);
    }
    
    header.hidden {
        transform: translateY(-100%);
    }
    
    @media (max-width: 768px) {
        .navigation-notification {
            right: 10px;
            left: 10px;
            min-width: auto;
        }
    }
`;
document.head.appendChild(navStyle);

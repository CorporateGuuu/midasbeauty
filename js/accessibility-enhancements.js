// Accessibility Enhancement System for MidasBeauty
// Implements WCAG 2.1 AA compliance and enhanced user experience

class MidasBeautyAccessibility {
    constructor() {
        this.focusableElements = [];
        this.currentFocusIndex = -1;
        this.announcements = [];
        this.init();
    }

    init() {
        this.setupARIALabels();
        this.implementKeyboardNavigation();
        this.enhanceColorContrast();
        this.setupScreenReaderSupport();
        this.addFocusIndicators();
        this.implementSkipLinks();
        this.setupAccessibilityControls();
        this.validateAccessibility();
        console.log('✅ Accessibility enhancements initialized');
    }

    // ARIA Labels and Semantic HTML
    setupARIALabels() {
        // Navigation elements
        const nav = document.querySelector('nav') || document.querySelector('.nav-menu');
        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.setAttribute('aria-label', 'Search luxury beauty products');
            searchInput.setAttribute('aria-describedby', 'search-help');
            
            // Add search help text
            if (!document.getElementById('search-help')) {
                const helpText = document.createElement('div');
                helpText.id = 'search-help';
                helpText.className = 'sr-only';
                helpText.textContent = 'Search by product name, brand, or category. Use arrow keys to navigate suggestions.';
                searchInput.parentNode.appendChild(helpText);
            }
        }

        // Cart and wishlist
        this.setupCartAccessibility();
        this.setupWishlistAccessibility();
        
        // Product grid
        this.setupProductGridAccessibility();
        
        // Form elements
        this.setupFormAccessibility();
        
        // Modal dialogs
        this.setupModalAccessibility();
    }

    setupCartAccessibility() {
        const cartToggle = document.getElementById('cart-toggle');
        const cartSidebar = document.getElementById('cart-sidebar');
        
        if (cartToggle) {
            cartToggle.setAttribute('aria-label', 'Open shopping cart');
            cartToggle.setAttribute('aria-expanded', 'false');
            cartToggle.setAttribute('aria-controls', 'cart-sidebar');
            cartToggle.setAttribute('role', 'button');
            
            // Add cart item count announcement
            const cartCount = cartToggle.querySelector('.cart-count');
            if (cartCount) {
                cartCount.setAttribute('aria-live', 'polite');
                cartCount.setAttribute('aria-label', 'Cart items count');
            }
        }

        if (cartSidebar) {
            cartSidebar.setAttribute('role', 'dialog');
            cartSidebar.setAttribute('aria-label', 'Shopping cart');
            cartSidebar.setAttribute('aria-modal', 'true');
            
            // Add close button accessibility
            const closeBtn = cartSidebar.querySelector('.close-cart');
            if (closeBtn) {
                closeBtn.setAttribute('aria-label', 'Close shopping cart');
            }
        }
    }

    setupWishlistAccessibility() {
        const wishlistToggle = document.getElementById('wishlist-toggle');
        
        if (wishlistToggle) {
            wishlistToggle.setAttribute('aria-label', 'Open wishlist');
            wishlistToggle.setAttribute('aria-expanded', 'false');
            wishlistToggle.setAttribute('role', 'button');
            
            const wishlistCount = wishlistToggle.querySelector('.wishlist-count');
            if (wishlistCount) {
                wishlistCount.setAttribute('aria-live', 'polite');
                wishlistCount.setAttribute('aria-label', 'Wishlist items count');
            }
        }
    }

    setupProductGridAccessibility() {
        const productGrids = document.querySelectorAll('.product-grid');
        
        productGrids.forEach(grid => {
            grid.setAttribute('role', 'grid');
            grid.setAttribute('aria-label', 'Luxury beauty products');
            
            const products = grid.querySelectorAll('.product-card');
            products.forEach((product, index) => {
                product.setAttribute('role', 'gridcell');
                product.setAttribute('tabindex', '0');
                product.setAttribute('aria-posinset', index + 1);
                product.setAttribute('aria-setsize', products.length);
                
                // Product name as accessible name
                const productName = product.querySelector('.product-name');
                if (productName) {
                    product.setAttribute('aria-labelledby', productName.id || `product-name-${index}`);
                    if (!productName.id) {
                        productName.id = `product-name-${index}`;
                    }
                }

                // Add to cart button
                const addToCartBtn = product.querySelector('.add-to-cart');
                if (addToCartBtn) {
                    const productTitle = productName?.textContent || 'product';
                    addToCartBtn.setAttribute('aria-label', `Add ${productTitle} to cart`);
                }

                // Wishlist button
                const wishlistBtn = product.querySelector('.add-to-wishlist');
                if (wishlistBtn) {
                    const productTitle = productName?.textContent || 'product';
                    wishlistBtn.setAttribute('aria-label', `Add ${productTitle} to wishlist`);
                }
            });
        });
    }

    setupFormAccessibility() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                // Associate labels
                const label = form.querySelector(`label[for="${input.id}"]`) || 
                             input.previousElementSibling?.tagName === 'LABEL' ? input.previousElementSibling : null;
                
                if (label && !input.getAttribute('aria-labelledby')) {
                    if (!label.id) {
                        label.id = `label-${input.id || Math.random().toString(36).substr(2, 9)}`;
                    }
                    input.setAttribute('aria-labelledby', label.id);
                }

                // Required field indicators
                if (input.required) {
                    input.setAttribute('aria-required', 'true');
                    
                    // Add visual indicator
                    if (!input.parentNode.querySelector('.required-indicator')) {
                        const indicator = document.createElement('span');
                        indicator.className = 'required-indicator';
                        indicator.textContent = '*';
                        indicator.setAttribute('aria-label', 'required');
                        input.parentNode.appendChild(indicator);
                    }
                }

                // Error handling
                input.addEventListener('invalid', (e) => {
                    this.handleInputError(e.target);
                });
            });
        });
    }

    setupModalAccessibility() {
        const modals = document.querySelectorAll('.modal, [role="dialog"]');
        
        modals.forEach(modal => {
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            
            // Focus management
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal(modal);
                }
                
                // Trap focus within modal
                this.trapFocus(e, modal);
            });
        });
    }

    // Keyboard Navigation
    implementKeyboardNavigation() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });

        // Product grid navigation
        this.setupProductGridKeyboard();
        
        // Menu navigation
        this.setupMenuKeyboard();
        
        // Search navigation
        this.setupSearchKeyboard();
    }

    handleGlobalKeyboard(e) {
        // Skip to main content (Alt + M)
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            const main = document.querySelector('main') || document.querySelector('#main-content');
            if (main) {
                main.focus();
                this.announce('Skipped to main content');
            }
        }

        // Open search (Alt + S)
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
                this.announce('Search activated');
            }
        }

        // Open cart (Alt + C)
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            const cartToggle = document.getElementById('cart-toggle');
            if (cartToggle) {
                cartToggle.click();
                this.announce('Shopping cart opened');
            }
        }
    }

    setupProductGridKeyboard() {
        const productGrids = document.querySelectorAll('.product-grid');
        
        productGrids.forEach(grid => {
            grid.addEventListener('keydown', (e) => {
                const products = Array.from(grid.querySelectorAll('.product-card'));
                const currentIndex = products.indexOf(e.target);
                
                if (currentIndex === -1) return;
                
                let newIndex = currentIndex;
                const columns = this.getGridColumns(grid);
                
                switch (e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        newIndex = Math.min(currentIndex + 1, products.length - 1);
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        newIndex = Math.max(currentIndex - 1, 0);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        newIndex = Math.min(currentIndex + columns, products.length - 1);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        newIndex = Math.max(currentIndex - columns, 0);
                        break;
                    case 'Home':
                        e.preventDefault();
                        newIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        newIndex = products.length - 1;
                        break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        this.activateProduct(products[currentIndex]);
                        break;
                }
                
                if (newIndex !== currentIndex) {
                    products[newIndex].focus();
                    this.announceProductFocus(products[newIndex]);
                }
            });
        });
    }

    setupMenuKeyboard() {
        const menuItems = document.querySelectorAll('.nav-link, .menu-item');
        
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextItem = menuItems[index + 1] || menuItems[0];
                        nextItem.focus();
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
                        prevItem.focus();
                        break;
                }
            });
        });
    }

    setupSearchKeyboard() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const suggestions = document.querySelectorAll('.search-suggestion');
                if (suggestions.length > 0) {
                    suggestions[0].focus();
                }
            }
        });

        // Search suggestions navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('search-suggestion')) {
                const suggestions = Array.from(document.querySelectorAll('.search-suggestion'));
                const currentIndex = suggestions.indexOf(e.target);
                
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextSuggestion = suggestions[currentIndex + 1];
                        if (nextSuggestion) {
                            nextSuggestion.focus();
                        }
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        if (currentIndex === 0) {
                            searchInput.focus();
                        } else {
                            suggestions[currentIndex - 1].focus();
                        }
                        break;
                    case 'Escape':
                        e.preventDefault();
                        searchInput.focus();
                        this.clearSearchSuggestions();
                        break;
                }
            }
        });
    }

    // Color Contrast Enhancement
    enhanceColorContrast() {
        // Check and fix contrast ratios
        this.checkContrastRatios();
        
        // Add high contrast mode option
        this.addHighContrastMode();
        
        // Ensure focus indicators are visible
        this.enhanceFocusIndicators();
    }

    checkContrastRatios() {
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
                const contrast = this.calculateContrastRatio(color, backgroundColor);
                
                if (contrast < 4.5) { // WCAG AA standard
                    console.warn(`Low contrast detected: ${contrast.toFixed(2)}`, element);
                    this.fixContrastIssue(element, contrast);
                }
            }
        });
    }

    addHighContrastMode() {
        const contrastToggle = document.createElement('button');
        contrastToggle.className = 'contrast-toggle';
        contrastToggle.textContent = 'High Contrast';
        contrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
        contrastToggle.setAttribute('aria-pressed', 'false');
        
        contrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isActive = document.body.classList.contains('high-contrast');
            contrastToggle.setAttribute('aria-pressed', isActive.toString());
            this.announce(isActive ? 'High contrast mode enabled' : 'High contrast mode disabled');
        });
        
        // Add to accessibility controls
        const accessibilityControls = this.getOrCreateAccessibilityControls();
        accessibilityControls.appendChild(contrastToggle);
    }

    enhanceFocusIndicators() {
        const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focused');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('focused');
            });
        });
    }

    // Screen Reader Support
    setupScreenReaderSupport() {
        // Create live region for announcements
        this.createLiveRegion();
        
        // Add screen reader only content
        this.addScreenReaderContent();
        
        // Enhance dynamic content announcements
        this.setupDynamicAnnouncements();
    }

    createLiveRegion() {
        if (!document.getElementById('live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'live-region';
            liveRegion.className = 'sr-only';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            document.body.appendChild(liveRegion);
        }
    }

    addScreenReaderContent() {
        // Add descriptive text for complex interactions
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const description = document.createElement('div');
            description.className = 'sr-only';
            
            const productName = card.querySelector('.product-name')?.textContent || 'Product';
            const price = card.querySelector('.price')?.textContent || '';
            const rating = card.querySelector('.rating')?.textContent || '';
            
            description.textContent = `${productName}. ${price}. ${rating}. Press Enter to view details or use Tab to navigate to action buttons.`;
            card.appendChild(description);
        });
    }

    setupDynamicAnnouncements() {
        // Announce cart updates
        if (window.cartManager) {
            const originalAddToCart = window.cartManager.addToCart;
            window.cartManager.addToCart = function(product) {
                const result = originalAddToCart.call(this, product);
                window.midasBeautyAccessibility.announce(`${product.name} added to cart`);
                return result;
            };
        }

        // Announce search results
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                const resultsCount = document.querySelectorAll('.search-result').length;
                this.announce(`${resultsCount} search results found`);
            }, 1000));
        }
    }

    // Focus Management
    addFocusIndicators() {
        // Enhanced focus styles
        const focusCSS = `
            .focused, *:focus {
                outline: 3px solid #d4af37 !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 1px #1a1a1a !important;
            }
            
            .high-contrast .focused,
            .high-contrast *:focus {
                outline: 4px solid #ffff00 !important;
                background-color: #000000 !important;
                color: #ffffff !important;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = focusCSS;
        document.head.appendChild(style);
    }

    implementSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#search" class="skip-link">Skip to search</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
        
        // Add skip link styles
        const skipCSS = `
            .skip-links {
                position: absolute;
                top: -100px;
                left: 0;
                z-index: 10000;
            }
            
            .skip-link {
                position: absolute;
                top: 0;
                left: 0;
                background: #1a1a1a;
                color: #d4af37;
                padding: 8px 16px;
                text-decoration: none;
                border-radius: 0 0 4px 0;
                font-weight: bold;
                transition: top 0.3s;
            }
            
            .skip-link:focus {
                top: 100px;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = skipCSS;
        document.head.appendChild(style);
    }

    setupAccessibilityControls() {
        const controls = this.getOrCreateAccessibilityControls();
        
        // Font size controls
        this.addFontSizeControls(controls);
        
        // Animation controls
        this.addAnimationControls(controls);
        
        // Reading mode
        this.addReadingMode(controls);
    }

    getOrCreateAccessibilityControls() {
        let controls = document.getElementById('accessibility-controls');
        
        if (!controls) {
            controls = document.createElement('div');
            controls.id = 'accessibility-controls';
            controls.className = 'accessibility-controls';
            controls.setAttribute('role', 'toolbar');
            controls.setAttribute('aria-label', 'Accessibility controls');
            
            // Add toggle button
            const toggle = document.createElement('button');
            toggle.className = 'accessibility-toggle';
            toggle.textContent = '♿';
            toggle.setAttribute('aria-label', 'Open accessibility controls');
            toggle.setAttribute('aria-expanded', 'false');
            
            toggle.addEventListener('click', () => {
                const isOpen = controls.classList.toggle('open');
                toggle.setAttribute('aria-expanded', isOpen.toString());
            });
            
            controls.appendChild(toggle);
            document.body.appendChild(controls);
        }
        
        return controls;
    }

    // Utility Methods
    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    calculateContrastRatio(color1, color2) {
        // Simplified contrast calculation
        const rgb1 = this.parseColor(color1);
        const rgb2 = this.parseColor(color2);
        
        const l1 = this.getLuminance(rgb1);
        const l2 = this.getLuminance(rgb2);
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    parseColor(color) {
        const div = document.createElement('div');
        div.style.color = color;
        document.body.appendChild(div);
        const computed = window.getComputedStyle(div).color;
        document.body.removeChild(div);
        
        const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
    }

    getLuminance([r, g, b]) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    getGridColumns(grid) {
        const style = window.getComputedStyle(grid);
        const columns = style.gridTemplateColumns.split(' ').length;
        return columns || 3; // Default fallback
    }

    validateAccessibility() {
        console.log('🔍 Running accessibility validation...');
        
        // Check for missing alt text
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        if (imagesWithoutAlt.length > 0) {
            console.warn(`${imagesWithoutAlt.length} images missing alt text`);
        }
        
        // Check for missing form labels
        const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        if (inputsWithoutLabels.length > 0) {
            console.warn(`${inputsWithoutLabels.length} inputs missing labels`);
        }
        
        // Check for proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > previousLevel + 1) {
                console.warn('Heading hierarchy issue detected', heading);
            }
            previousLevel = level;
        });
        
        console.log('✅ Accessibility validation complete');
    }
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', () => {
    window.midasBeautyAccessibility = new MidasBeautyAccessibility();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MidasBeautyAccessibility;
}

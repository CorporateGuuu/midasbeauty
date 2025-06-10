// WhatsApp Integration for Midas Beauty
// Floating WhatsApp contact button with pre-filled messages and luxury styling

class WhatsAppIntegration {
    constructor() {
        this.phoneNumber = '1234567890'; // Replace with actual WhatsApp business number
        this.isVisible = true;
        this.messages = this.initializeMessages();
        this.init();
    }

    init() {
        this.createWhatsAppHTML();
        this.setupEventListeners();
        this.setupVisibilityControl();
        this.showWelcomeTooltip();
    }

    createWhatsAppHTML() {
        const whatsappHTML = `
            <!-- WhatsApp Floating Button -->
            <div id="whatsapp-widget" class="whatsapp-widget" aria-label="Contact us on WhatsApp">
                <div class="whatsapp-button" id="whatsapp-button" role="button" tabindex="0">
                    <div class="whatsapp-icon">
                        <i class="fab fa-whatsapp"></i>
                    </div>
                    <div class="whatsapp-pulse"></div>
                </div>
                
                <!-- WhatsApp Tooltip -->
                <div class="whatsapp-tooltip" id="whatsapp-tooltip">
                    <div class="tooltip-content">
                        <div class="tooltip-header">
                            <i class="fab fa-whatsapp"></i>
                            <span>Chat with us!</span>
                        </div>
                        <p>Need help? Send us a message on WhatsApp</p>
                        <div class="tooltip-actions">
                            <button class="whatsapp-action-btn" data-message="product-inquiry">
                                Product Inquiry
                            </button>
                            <button class="whatsapp-action-btn" data-message="beauty-advice">
                                Beauty Advice
                            </button>
                            <button class="whatsapp-action-btn" data-message="order-support">
                                Order Support
                            </button>
                            <button class="whatsapp-action-btn" data-message="general">
                                General Question
                            </button>
                        </div>
                    </div>
                    <div class="tooltip-arrow"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', whatsappHTML);
    }

    setupEventListeners() {
        const button = document.getElementById('whatsapp-button');
        const widget = document.getElementById('whatsapp-widget');
        const tooltip = document.getElementById('whatsapp-tooltip');
        const actionButtons = document.querySelectorAll('.whatsapp-action-btn');

        // Button click/tap
        button.addEventListener('click', () => this.toggleTooltip());
        
        // Keyboard support
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTooltip();
            }
        });

        // Action buttons
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const messageType = e.target.getAttribute('data-message');
                this.openWhatsApp(messageType);
            });
        });

        // Close tooltip when clicking outside
        document.addEventListener('click', (e) => {
            if (!widget.contains(e.target)) {
                this.hideTooltip();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideTooltip();
            }
        });

        // Hover effects
        button.addEventListener('mouseenter', () => {
            button.classList.add('hover');
        });

        button.addEventListener('mouseleave', () => {
            button.classList.remove('hover');
        });
    }

    setupVisibilityControl() {
        // Hide on scroll down, show on scroll up
        let lastScrollTop = 0;
        const widget = document.getElementById('whatsapp-widget');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                widget.classList.add('hidden');
            } else {
                // Scrolling up
                widget.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop;
        });

        // Show when user is idle for 30 seconds
        let idleTimer;
        const resetIdleTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                if (!widget.classList.contains('tooltip-visible')) {
                    this.showWelcomeTooltip();
                }
            }, 30000);
        };

        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetIdleTimer, true);
        });
    }

    toggleTooltip() {
        const widget = document.getElementById('whatsapp-widget');
        const tooltip = document.getElementById('whatsapp-tooltip');
        
        if (widget.classList.contains('tooltip-visible')) {
            this.hideTooltip();
        } else {
            this.showTooltip();
        }
    }

    showTooltip() {
        const widget = document.getElementById('whatsapp-widget');
        const tooltip = document.getElementById('whatsapp-tooltip');
        
        widget.classList.add('tooltip-visible');
        tooltip.setAttribute('aria-hidden', 'false');
        
        // Focus first action button for accessibility
        setTimeout(() => {
            const firstButton = tooltip.querySelector('.whatsapp-action-btn');
            if (firstButton) firstButton.focus();
        }, 300);
    }

    hideTooltip() {
        const widget = document.getElementById('whatsapp-widget');
        const tooltip = document.getElementById('whatsapp-tooltip');
        
        widget.classList.remove('tooltip-visible');
        tooltip.setAttribute('aria-hidden', 'true');
    }

    showWelcomeTooltip() {
        // Show tooltip briefly as a welcome
        this.showTooltip();
        setTimeout(() => {
            this.hideTooltip();
        }, 3000);
    }

    openWhatsApp(messageType = 'general') {
        const message = this.messages[messageType] || this.messages.general;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
        
        // Hide tooltip
        this.hideTooltip();
        
        // Add click animation
        const button = document.getElementById('whatsapp-button');
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 300);
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        // Track analytics
        this.trackWhatsAppClick(messageType);
    }

    initializeMessages() {
        return {
            'product-inquiry': `Hi! 👋 I'm interested in learning more about your luxury beauty products. Could you help me find the perfect items for my beauty routine?

I'm particularly interested in:
- Skincare products
- Makeup essentials
- Premium brands

Thank you! ✨`,

            'beauty-advice': `Hello! 💄 I'd love to get some personalized beauty advice from your experts.

I'm looking for guidance on:
- Product recommendations for my skin type
- Beauty routine suggestions
- Latest trends and tips

Looking forward to your expert advice! 🌟`,

            'order-support': `Hi there! 📦 I need assistance with my order or have questions about:

- Order status and tracking
- Shipping information
- Product availability
- Return/exchange process

Thank you for your help! 💫`,

            'general': `Hello! 👋 I have a question about Midas Beauty and would love to chat with your team.

I'm interested in learning more about your luxury beauty products and services.

Thank you! ✨`
        };
    }

    trackWhatsAppClick(messageType) {
        // Track WhatsApp interactions for analytics
        const analyticsData = {
            event: 'whatsapp_click',
            messageType: messageType,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
        
        // Store analytics data
        const existingAnalytics = JSON.parse(localStorage.getItem('midasBeautyAnalytics') || '[]');
        existingAnalytics.push(analyticsData);
        
        // Keep only last 100 events
        if (existingAnalytics.length > 100) {
            existingAnalytics.splice(0, existingAnalytics.length - 100);
        }
        
        localStorage.setItem('midasBeautyAnalytics', JSON.stringify(existingAnalytics));
        
        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_contact', {
                'event_category': 'engagement',
                'event_label': messageType,
                'value': 1
            });
        }
    }

    // Public methods
    show() {
        const widget = document.getElementById('whatsapp-widget');
        widget.style.display = 'block';
        this.isVisible = true;
    }

    hide() {
        const widget = document.getElementById('whatsapp-widget');
        widget.style.display = 'none';
        this.isVisible = false;
    }

    updatePhoneNumber(newNumber) {
        this.phoneNumber = newNumber;
    }

    updateMessage(messageType, newMessage) {
        this.messages[messageType] = newMessage;
    }
}

// Initialize WhatsApp integration when DOM and Font Awesome are ready
function initializeWhatsApp() {
    // Check if Font Awesome is loaded
    const checkFontAwesome = () => {
        const testElement = document.createElement('i');
        testElement.className = 'fab fa-whatsapp';
        document.body.appendChild(testElement);
        const computed = window.getComputedStyle(testElement);
        const fontFamily = computed.getPropertyValue('font-family');
        document.body.removeChild(testElement);
        return fontFamily.includes('Font Awesome') || fontFamily.includes('FontAwesome');
    };

    const initialize = () => {
        if (checkFontAwesome() || document.querySelector('.fab')) {
            window.whatsappIntegration = new WhatsAppIntegration();
            console.log('WhatsApp integration initialized successfully');
        } else {
            // Retry after a short delay
            setTimeout(initialize, 500);
        }
    };

    initialize();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWhatsApp);
} else {
    initializeWhatsApp();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhatsAppIntegration;
}

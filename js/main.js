// Enhanced Main JavaScript file for Midas Beauty website
// Handles product display, luxury animations, and user interactions

class MidasBeautyMain {
    constructor() {
        this.products = [];
        this.featuredProducts = [];
        this.isLoading = false;
        this.animationObserver = null;
        this.init();
    }

    async init() {
        console.log('Midas Beauty: Initializing enhanced main system...');

        // Load product database
        await this.loadProductDatabase();

        // Initialize core functionality
        this.initializeCoreFunctionality();

        // Initialize luxury animations
        this.initializeLuxuryAnimations();

        // Initialize product displays
        this.initializeProductDisplays();

        // Initialize engagement features
        this.initializeEngagementFeatures();

        // Initialize performance monitoring
        this.initializePerformanceMonitoring();
    }

    async loadProductDatabase() {
        try {
            // Check if product database is available
            if (typeof MIDAS_BEAUTY_PRODUCTS !== 'undefined' && MIDAS_BEAUTY_PRODUCTS.products) {
                this.products = MIDAS_BEAUTY_PRODUCTS.products;
                this.featuredProducts = this.products.filter(product =>
                    product.featured || product.bestSeller || product.newArrival
                );
                console.log(`Loaded ${this.products.length} products from database`);
                console.log(`Found ${this.featuredProducts.length} featured products`);
            } else {
                console.warn('Product database not found, using fallback data');
                this.loadFallbackProducts();
            }
        } catch (error) {
            console.error('Error loading product database:', error);
            this.loadFallbackProducts();
        }
    }

    loadFallbackProducts() {
        // Fallback product data if database fails to load
        this.products = [
            {
                id: 1,
                name: "24K Gold Radiance Serum",
                brand: "midas-beauty",
                brandName: "Midas Beauty",
                category: "skincare",
                price: 89.99,
                images: { main: "images/products/radiance-serum.jpg" },
                rating: 4.9,
                reviewCount: 247,
                inStock: true,
                featured: true,
                bestSeller: true,
                description: "Luxury anti-aging serum with 24K gold particles"
            }
        ];
        this.featuredProducts = this.products;
    }

    initializeCoreFunctionality() {
        // Check if user is logged in
        this.checkUserLoginStatus();

        // Mobile menu toggle functionality
        this.initializeMobileMenu();

        // Contact form functionality
        this.initializeContactForm();

        // Smooth scrolling
        this.initializeSmoothScrolling();
    }

    initializeMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('nav');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
                // Add luxury animation
                nav.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        }
    }

    initializeProductDisplays() {
        // Initialize homepage featured products
        this.renderFeaturedProducts();

        // Initialize products page if we're on it
        if (window.location.pathname.includes('products.html') || window.location.pathname === '/products') {
            this.renderAllProducts();
        }

        // Initialize product filtering
        this.initializeProductFiltering();

        // Initialize add to cart functionality
        this.initializeAddToCart();
    }

    renderFeaturedProducts() {
        const featuredContainer = document.getElementById('featured-products');
        const heroProductsContainer = document.querySelector('.hero-products');

        if (featuredContainer && this.featuredProducts.length > 0) {
            this.renderProductCarousel(featuredContainer, this.featuredProducts.slice(0, 8));
        }

        if (heroProductsContainer && this.featuredProducts.length > 0) {
            this.renderHeroProducts(heroProductsContainer, this.featuredProducts.slice(0, 3));
        }
    }

    renderProductCarousel(container, products) {
        const carouselHTML = `
            <div class="featured-products-section">
                <div class="container">
                    <div class="section-header">
                        <h2>Featured Products</h2>
                        <p>Discover our most popular luxury beauty products</p>
                    </div>
                    <div class="product-carousel">
                        <div class="carousel-container">
                            <div class="carousel-track" id="carousel-track">
                                ${products.map(product => this.generateProductCard(product)).join('')}
                            </div>
                        </div>
                        <div class="carousel-controls">
                            <button class="carousel-btn prev-btn" onclick="midasMain.moveCarousel(-1)">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="carousel-btn next-btn" onclick="midasMain.moveCarousel(1)">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <div class="carousel-indicators">
                            ${products.map((_, index) =>
                                `<button class="indicator ${index === 0 ? 'active' : ''}" onclick="midasMain.goToSlide(${index})"></button>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = carouselHTML;
        this.initializeCarousel();
    }

    renderHeroProducts(container, products) {
        const heroHTML = `
            <div class="hero-products-grid">
                ${products.map(product => `
                    <div class="hero-product-card" data-aos="fade-up" data-aos-delay="${products.indexOf(product) * 100}">
                        <div class="product-image">
                            <img src="${product.images.main}" alt="${product.name}" loading="lazy">
                            <div class="product-overlay">
                                <a href="${product.url || '#'}" class="view-product-btn">
                                    <i class="fas fa-eye"></i>
                                    View Product
                                </a>
                            </div>
                        </div>
                        <div class="product-info">
                            <div class="brand-name">${product.brandName || product.brand}</div>
                            <h3>${product.name}</h3>
                            <div class="price">$${product.salePrice || product.price}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = heroHTML;
    }

    renderAllProducts() {
        const productsContainer = document.getElementById('products-grid');
        if (!productsContainer) return;

        if (this.products.length === 0) {
            productsContainer.innerHTML = `
                <div class="no-products-message">
                    <i class="fas fa-search"></i>
                    <h3>Loading Products...</h3>
                    <p>Please wait while we load our luxury product collection.</p>
                </div>
            `;
            return;
        }

        const productsHTML = this.products.map(product => this.generateProductCard(product)).join('');
        productsContainer.innerHTML = productsHTML;

        // Initialize product animations
        this.initializeProductAnimations();
    }

    generateProductCard(product) {
        const salePrice = product.salePrice ? `<span class="sale-price">$${product.salePrice.toFixed(2)}</span>` : '';
        const originalPrice = product.salePrice ?
            `<span class="original-price">$${product.price.toFixed(2)}</span>` :
            `<span class="price">$${product.price.toFixed(2)}</span>`;

        return `
            <div class="product-card" data-product-id="${product.id}" data-category="${product.category}" data-brand="${product.brand}">
                <div class="product-image-container">
                    <img src="${product.images.main}" alt="${product.name}" loading="lazy">
                    ${product.salePrice ? '<div class="sale-badge">Sale</div>' : ''}
                    ${product.newArrival ? '<div class="new-badge">New</div>' : ''}
                    ${product.bestSeller ? '<div class="bestseller-badge">Best Seller</div>' : ''}
                    <div class="product-overlay">
                        <div class="product-actions">
                            <button class="action-btn wishlist-btn" onclick="midasMain.toggleWishlist(${product.id})" title="Add to Wishlist">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="action-btn quick-view-btn" onclick="midasMain.quickView(${product.id})" title="Quick View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn compare-btn" onclick="midasMain.addToCompare(${product.id})" title="Compare">
                                <i class="fas fa-balance-scale"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <div class="brand-name">${product.brandName || product.brand}</div>
                    <h3><a href="${product.url || '#'}">${product.name}</a></h3>
                    <div class="product-rating">
                        ${this.generateStarRating(product.rating)}
                        <span class="review-count">(${product.reviewCount || 0})</span>
                    </div>
                    <div class="product-price">
                        ${salePrice}${originalPrice}
                    </div>
                    <div class="product-buttons">
                        <button class="btn add-to-cart-btn" onclick="midasMain.addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <a href="${product.url || '#'}" class="btn view-details-btn">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHTML = '<div class="stars">';

        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }

        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        starsHTML += '</div>';
        return starsHTML;
    }

    initializeAddToCart() {
        // This will be called when add to cart buttons are clicked
        // The onclick handlers are set in the generateProductCard method
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Add to cart logic (integrate with existing cart system)
        if (typeof addToCart === 'function') {
            addToCart(productId);
        } else {
            // Fallback notification
            this.showNotification(`${product.name} added to cart!`, 'success');
        }

        // Add luxury animation
        this.animateAddToCart(productId);
    }

    initializeProductFiltering() {
        const categoryButtons = document.querySelectorAll('.category-btn');

        if (categoryButtons.length > 0) {
            categoryButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Remove active class from all buttons
                    categoryButtons.forEach(btn => btn.classList.remove('active'));

                    // Add active class to clicked button
                    button.classList.add('active');

                    const category = button.getAttribute('data-category');
                    this.filterProducts(category);

                    // Add luxury animation
                    this.animateFilterTransition();
                });
            });
        }
    }

    filterProducts(category) {
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach((card, index) => {
            const productCategory = card.getAttribute('data-category');
            const shouldShow = category === 'all' || productCategory === category;

            if (shouldShow) {
                card.style.display = 'block';
                card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
            } else {
                card.style.animation = 'fadeOut 0.3s ease both';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    animateFilterTransition() {
        const container = document.getElementById('products-grid');
        if (container) {
            container.style.transform = 'scale(0.98)';
            container.style.opacity = '0.7';

            setTimeout(() => {
                container.style.transform = 'scale(1)';
                container.style.opacity = '1';
                container.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 150);
        }
    }

    initializeLuxuryAnimations() {
        // Initialize AOS (Animate On Scroll)
        this.initializeAOS();

        // Initialize parallax effects
        this.initializeParallax();

        // Initialize floating particles
        this.initializeFloatingParticles();

        // Initialize hover effects
        this.initializeHoverEffects();

        // Initialize loading animations
        this.initializeLoadingAnimations();

        // Initialize scroll animations
        this.initializeScrollAnimations();
    }

    initializeAOS() {
        // Create intersection observer for scroll animations
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with data-aos attributes
        document.querySelectorAll('[data-aos]').forEach(el => {
            this.animationObserver.observe(el);
        });
    }

    initializeParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-element');

        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;

                parallaxElements.forEach(element => {
                    element.style.transform = `translateY(${rate}px)`;
                });
            });
        }
    }

    initializeFloatingParticles() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // Create floating particles container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'floating-particles';
        heroSection.appendChild(particlesContainer);

        // Create golden particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    initializeHoverEffects() {
        // Enhanced product card hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.product-card')) {
                const card = e.target.closest('.product-card');
                this.animateProductCardHover(card, true);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.product-card')) {
                const card = e.target.closest('.product-card');
                this.animateProductCardHover(card, false);
            }
        });

        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.3)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            });
        });
    }

    animateProductCardHover(card, isHovering) {
        const image = card.querySelector('.product-image-container img');
        const overlay = card.querySelector('.product-overlay');

        if (isHovering) {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            if (image) image.style.transform = 'scale(1.05)';
            if (overlay) overlay.style.opacity = '1';
        } else {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            if (image) image.style.transform = 'scale(1)';
            if (overlay) overlay.style.opacity = '0';
        }
    }

    initializeLoadingAnimations() {
        // Add loading animation to images
        document.querySelectorAll('img').forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.addEventListener('load', () => {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                });
            }
        });
    }

    initializeScrollAnimations() {
        // Smooth scroll reveal for sections
        const sections = document.querySelectorAll('section');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, {
            threshold: 0.1
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    initializeContactForm() {
        const contactForm = document.getElementById('contactForm');

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;

                // Show luxury loading animation
                this.showLoadingAnimation();

                // Simulate form submission
                setTimeout(() => {
                    this.hideLoadingAnimation();
                    this.showNotification(`Thank you for your message, ${name}! We will get back to you soon.`, 'success');
                    contactForm.reset();
                }, 2000);
            });
        }
    }

    initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initializeEngagementFeatures() {
        // Initialize chatbot
        this.initializeChatbot();

        // Initialize WhatsApp button
        this.initializeWhatsAppButton();

        // Initialize beauty advisor
        this.initializeBeautyAdvisor();

        // Initialize live chat
        this.initializeLiveChat();

        // Initialize interactive elements
        this.initializeInteractiveElements();
    }

    initializeChatbot() {
        // Create chatbot widget
        const chatbotHTML = `
            <div id="chatbot-widget" class="chatbot-widget">
                <div class="chatbot-toggle" onclick="midasMain.toggleChatbot()">
                    <i class="fas fa-comments"></i>
                    <span class="chat-notification">1</span>
                </div>
                <div class="chatbot-window" id="chatbot-window">
                    <div class="chatbot-header">
                        <div class="chatbot-avatar">
                            <img src="images/chatbot-avatar.jpg" alt="Beauty Advisor">
                        </div>
                        <div class="chatbot-info">
                            <h4>Midas Beauty Advisor</h4>
                            <span class="status online">Online</span>
                        </div>
                        <button class="close-chat" onclick="midasMain.toggleChatbot()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="chatbot-messages" id="chatbot-messages">
                        <div class="message bot-message">
                            <div class="message-content">
                                Welcome to Midas Beauty! I'm your personal beauty advisor. How can I help you find the perfect products today? ✨
                            </div>
                            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                    </div>
                    <div class="chatbot-input">
                        <input type="text" id="chat-input" placeholder="Type your message...">
                        <button onclick="midasMain.sendChatMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="quick-actions">
                        <button onclick="midasMain.quickChatAction('skincare')" class="quick-btn">
                            Skincare Help
                        </button>
                        <button onclick="midasMain.quickChatAction('makeup')" class="quick-btn">
                            Makeup Tips
                        </button>
                        <button onclick="midasMain.quickChatAction('recommendations')" class="quick-btn">
                            Get Recommendations
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);

        // Initialize chat input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }
    }

    initializeWhatsAppButton() {
        const whatsappHTML = `
            <div class="whatsapp-float">
                <a href="https://wa.me/1234567890?text=Hi! I'm interested in Midas Beauty products"
                   target="_blank" class="whatsapp-btn">
                    <i class="fab fa-whatsapp"></i>
                    <span class="whatsapp-text">Chat with us</span>
                </a>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', whatsappHTML);
    }

    initializeBeautyAdvisor() {
        // Beauty advisor responses
        this.beautyAdvisorResponses = {
            skincare: [
                "For glowing skin, I recommend our 24K Gold Radiance Serum! It's perfect for anti-aging and brightening. What's your main skin concern?",
                "Our skincare collection includes products for all skin types. Are you looking for hydration, anti-aging, or acne treatment?",
                "I'd love to help you build a skincare routine! What's your current skin type - oily, dry, combination, or sensitive?"
            ],
            makeup: [
                "Our makeup collection features luxury formulations! Are you looking for everyday wear or special occasion makeup?",
                "For a flawless base, try our Velvet Luxe Foundation. What's your preferred coverage - light, medium, or full?",
                "I can help you create the perfect look! What's the occasion you're preparing for?"
            ],
            recommendations: [
                "I'd be happy to recommend products! Could you tell me about your skin type and main concerns?",
                "Based on our bestsellers, the 24K Gold Serum and Hydrating Moisturizer are customer favorites. What are you most interested in?",
                "Let me suggest some products based on your needs. Are you new to luxury skincare or looking to upgrade your routine?"
            ]
        };
    }

    initializeLiveChat() {
        // Simulate typing indicator
        this.isTyping = false;
        this.typingTimeout = null;
    }

    initializeInteractiveElements() {
        // Initialize animated counters
        this.initializeCounters();

        // Initialize image galleries
        this.initializeImageGalleries();

        // Initialize micro-interactions
        this.initializeMicroInteractions();
    }

    initializeCounters() {
        const counters = document.querySelectorAll('.counter');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }

    initializeImageGalleries() {
        // Initialize lightbox for product images
        document.querySelectorAll('.product-image-container img').forEach(img => {
            img.addEventListener('click', () => {
                this.openLightbox(img.src, img.alt);
            });
        });
    }

    openLightbox(src, alt) {
        const lightboxHTML = `
            <div class="lightbox-overlay" onclick="this.remove()">
                <div class="lightbox-content">
                    <img src="${src}" alt="${alt}">
                    <button class="lightbox-close" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    initializeMicroInteractions() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(e, btn);
            });
        });
    }

    createRippleEffect(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

// Function to check if user is logged in and update UI accordingly
function checkUserLoginStatus() {
    const accountLink = document.getElementById('account-link');
    if (accountLink) {
        const currentUser = JSON.parse(localStorage.getItem('midasBeautyCurrentUser'));

        if (currentUser) {
            // User is logged in, update account link to go to dashboard
            accountLink.href = 'dashboard.html';
            accountLink.innerHTML = `<i class="fas fa-user"></i>`;

            // Add tooltip with user name
            accountLink.setAttribute('title', `${currentUser.firstName} ${currentUser.lastName}`);
        } else {
            // User is not logged in, keep default link to login page
            accountLink.href = 'login.html';
            accountLink.innerHTML = `<i class="fas fa-user"></i>`;
            accountLink.setAttribute('title', 'Login / Register');
        }
    }

    // Chatbot functionality
    toggleChatbot() {
        const chatbotWindow = document.getElementById('chatbot-window');
        const notification = document.querySelector('.chat-notification');

        if (chatbotWindow) {
            chatbotWindow.classList.toggle('active');
            if (notification) {
                notification.style.display = 'none';
            }
        }
    }

    sendChatMessage() {
        const chatInput = document.getElementById('chat-input');
        const messagesContainer = document.getElementById('chatbot-messages');

        if (!chatInput || !messagesContainer) return;

        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addChatMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Generate bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateBotResponse(message);
            this.addChatMessage(response, 'bot');
        }, 1500);
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageHTML = `
            <div class="message ${sender}-message">
                <div class="message-content">${message}</div>
                <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingHTML = `
            <div class="message bot-message typing-indicator" id="typing-indicator">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateBotResponse(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('skin') || lowerMessage.includes('face')) {
            return this.getRandomResponse('skincare');
        } else if (lowerMessage.includes('makeup') || lowerMessage.includes('lipstick') || lowerMessage.includes('foundation')) {
            return this.getRandomResponse('makeup');
        } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
            return this.getRandomResponse('recommendations');
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return "Our products range from $15 to $150, offering luxury at various price points. Would you like me to show you products in a specific price range?";
        } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
            return "We offer free shipping on orders over $50! Standard delivery takes 3-5 business days, and express delivery is available for next-day delivery.";
        } else {
            return "I'd be happy to help you find the perfect beauty products! You can ask me about skincare, makeup, product recommendations, or any other beauty questions. ✨";
        }
    }

    getRandomResponse(category) {
        const responses = this.beautyAdvisorResponses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    quickChatAction(action) {
        const responses = {
            skincare: "I'd love to help with your skincare routine! What's your main concern - anti-aging, hydration, acne, or brightening?",
            makeup: "Let's find the perfect makeup for you! Are you looking for everyday essentials or something for a special occasion?",
            recommendations: "I can recommend products based on your needs! What's your skin type and what are you hoping to achieve?"
        };

        this.addChatMessage(responses[action], 'bot');
    }

    // Carousel functionality
    initializeCarousel() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.product-card').length;
        this.slidesToShow = this.getSlidesToShow();

        window.addEventListener('resize', () => {
            this.slidesToShow = this.getSlidesToShow();
        });
    }

    getSlidesToShow() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    moveCarousel(direction) {
        const track = document.getElementById('carousel-track');
        if (!track) return;

        this.currentSlide += direction;

        if (this.currentSlide < 0) {
            this.currentSlide = Math.max(0, this.totalSlides - this.slidesToShow);
        } else if (this.currentSlide > this.totalSlides - this.slidesToShow) {
            this.currentSlide = 0;
        }

        const translateX = -(this.currentSlide * (100 / this.slidesToShow));
        track.style.transform = `translateX(${translateX}%)`;

        this.updateCarouselIndicators();
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        const track = document.getElementById('carousel-track');
        if (!track) return;

        const translateX = -(this.currentSlide * (100 / this.slidesToShow));
        track.style.transform = `translateX(${translateX}%)`;

        this.updateCarouselIndicators();
    }

    updateCarouselIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    // Utility methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
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
}

// Initialize the main system
let midasMain;
document.addEventListener('DOMContentLoaded', function() {
    midasMain = new MidasBeautyMain();
});

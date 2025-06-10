// Luxury User Experience Enhancements for MidasBeauty
// Creates an immersive, addictive shopping experience for female luxury shoppers

class MidasBeautyLuxuryUX {
    constructor() {
        this.personalizedData = this.loadPersonalizedData();
        this.browsingBehavior = [];
        this.urgencyTimers = new Map();
        this.init();
    }

    init() {
        this.setupProductQuickView();
        this.implementPersonalizedRecommendations();
        this.createBeautyQuiz();
        this.addUrgencyElements();
        this.enhanceProductInteractions();
        this.setupCustomerReviews();
        this.implementWishlistFeatures();
        this.createBeautyTips();
        this.addSocialProof();
        this.setupSeasonalShowcases();
        console.log('✅ Luxury UX enhancements initialized');
    }

    // Product Quick View Modal
    setupProductQuickView() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const quickViewBtn = document.createElement('button');
            quickViewBtn.className = 'quick-view-btn';
            quickViewBtn.innerHTML = '👁️ Quick View';
            quickViewBtn.setAttribute('aria-label', 'Quick view product details');
            
            quickViewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = card.dataset.productId;
                this.showQuickViewModal(productId);
            });
            
            card.appendChild(quickViewBtn);
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.addProductHoverEffects(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeProductHoverEffects(card);
            });
        });
    }

    showQuickViewModal(productId) {
        const product = window.productDatabaseManager?.getProductById(productId);
        if (!product) return;

        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-overlay" aria-hidden="true"></div>
            <div class="modal-content" role="dialog" aria-labelledby="modal-title" aria-modal="true">
                <button class="modal-close" aria-label="Close quick view">&times;</button>
                <div class="modal-body">
                    <div class="product-images">
                        <img src="${product.images?.[0] || '/images/placeholder.jpg'}" alt="${product.name}" class="main-image">
                        <div class="image-thumbnails">
                            ${product.images?.map((img, index) => 
                                `<img src="${img}" alt="${product.name} view ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}">`
                            ).join('') || ''}
                        </div>
                    </div>
                    <div class="product-details">
                        <h2 id="modal-title" class="product-title">${product.name}</h2>
                        <div class="product-brand">${this.getBrandName(product.brand)}</div>
                        <div class="product-rating">
                            ${this.generateStarRating(product.rating)}
                            <span class="rating-text">${product.rating} (${product.reviewCount} reviews)</span>
                        </div>
                        <div class="product-price">
                            ${product.salePrice ? 
                                `<span class="sale-price">$${product.salePrice}</span>
                                 <span class="original-price">$${product.price}</span>
                                 <span class="discount">${Math.round((1 - product.salePrice/product.price) * 100)}% OFF</span>` :
                                `<span class="price">$${product.price}</span>`
                            }
                        </div>
                        <div class="product-description">${product.description}</div>
                        <div class="key-benefits">
                            <h4>Key Benefits:</h4>
                            <ul>
                                ${product.keyBenefits?.map(benefit => `<li>${benefit}</li>`).join('') || ''}
                            </ul>
                        </div>
                        <div class="product-variants">
                            ${this.renderProductVariants(product)}
                        </div>
                        <div class="stock-indicator ${this.getStockClass(product.stock)}">
                            ${this.getStockMessage(product.stock)}
                        </div>
                        <div class="modal-actions">
                            <button class="add-to-cart-btn luxury-btn primary" data-product-id="${product.id}">
                                Add to Cart - $${product.salePrice || product.price}
                            </button>
                            <button class="add-to-wishlist-btn luxury-btn secondary" data-product-id="${product.id}">
                                💖 Add to Wishlist
                            </button>
                        </div>
                        <div class="urgency-indicator">
                            ${this.createUrgencyMessage(product)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Setup modal interactions
        this.setupModalInteractions(modal);
        
        // Track viewing behavior
        this.trackProductView(product);
        
        // Focus management
        modal.querySelector('.modal-close').focus();
    }

    setupModalInteractions(modal) {
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');
        const thumbnails = modal.querySelectorAll('.thumbnail');
        const mainImage = modal.querySelector('.main-image');
        
        // Close modal
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = 'auto';
        };
        
        overlay.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);
        
        // Escape key
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
        
        // Image switching
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                mainImage.src = thumb.src;
            });
        });
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Personalized Recommendations
    implementPersonalizedRecommendations() {
        this.createRecommendationSections();
        this.trackBrowsingBehavior();
        this.updateRecommendations();
    }

    createRecommendationSections() {
        const sections = [
            { id: 'recommended-for-you', title: '✨ Recommended Just for You', type: 'personalized' },
            { id: 'trending-now', title: '🔥 Trending Now', type: 'trending' },
            { id: 'complete-the-look', title: '💄 Complete Your Look', type: 'complementary' },
            { id: 'luxury-favorites', title: '👑 Luxury Favorites', type: 'premium' }
        ];

        sections.forEach(section => {
            this.createRecommendationSection(section);
        });
    }

    createRecommendationSection(section) {
        const container = document.createElement('div');
        container.className = 'recommendation-section';
        container.id = section.id;
        container.innerHTML = `
            <div class="section-header">
                <h2 class="section-title">${section.title}</h2>
                <p class="section-subtitle">Curated especially for your beauty journey</p>
            </div>
            <div class="products-carousel">
                <button class="carousel-btn prev" aria-label="Previous products">‹</button>
                <div class="products-container">
                    <!-- Products will be populated here -->
                </div>
                <button class="carousel-btn next" aria-label="Next products">›</button>
            </div>
        `;

        // Insert after hero section or at the end of main content
        const heroSection = document.querySelector('.hero-section');
        const insertPoint = heroSection?.nextElementSibling || document.querySelector('main');
        if (insertPoint) {
            insertPoint.parentNode.insertBefore(container, insertPoint.nextSibling);
        }

        this.setupCarousel(container);
    }

    setupCarousel(container) {
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        const productsContainer = container.querySelector('.products-container');
        
        let currentIndex = 0;
        const itemsPerView = 4;
        
        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - itemsPerView);
            this.updateCarouselPosition(productsContainer, currentIndex);
        });
        
        nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, productsContainer.children.length - itemsPerView);
            currentIndex = Math.min(maxIndex, currentIndex + itemsPerView);
            this.updateCarouselPosition(productsContainer, currentIndex);
        });
    }

    updateCarouselPosition(container, index) {
        const itemWidth = 280; // Product card width + gap
        container.style.transform = `translateX(-${index * itemWidth}px)`;
    }

    // Beauty Quiz Implementation
    createBeautyQuiz() {
        const quizButton = document.createElement('button');
        quizButton.className = 'beauty-quiz-trigger luxury-btn primary';
        quizButton.innerHTML = '🎯 Find Your Perfect Products';
        quizButton.addEventListener('click', () => this.showBeautyQuiz());
        
        // Add to header or prominent location
        const header = document.querySelector('.header-actions');
        if (header) {
            header.appendChild(quizButton);
        }
    }

    showBeautyQuiz() {
        const quiz = document.createElement('div');
        quiz.className = 'beauty-quiz-modal';
        quiz.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="quiz-content">
                <div class="quiz-header">
                    <h2>✨ Discover Your Perfect Beauty Match</h2>
                    <p>Answer a few questions to get personalized product recommendations</p>
                    <button class="quiz-close">&times;</button>
                </div>
                <div class="quiz-body">
                    <div class="quiz-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <span class="progress-text">Question 1 of 6</span>
                    </div>
                    <div class="quiz-questions">
                        <!-- Questions will be populated here -->
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(quiz);
        this.setupQuizInteractions(quiz);
        this.loadQuizQuestions(quiz);
    }

    loadQuizQuestions(quiz) {
        const questions = [
            {
                id: 'skin-type',
                question: 'What\'s your skin type?',
                options: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal']
            },
            {
                id: 'skin-concerns',
                question: 'What are your main skin concerns?',
                options: ['Acne', 'Aging', 'Dark spots', 'Dryness', 'Sensitivity'],
                multiple: true
            },
            {
                id: 'makeup-style',
                question: 'How would you describe your makeup style?',
                options: ['Natural/Minimal', 'Glamorous', 'Bold/Dramatic', 'Classic', 'Trendy']
            },
            {
                id: 'budget',
                question: 'What\'s your preferred price range?',
                options: ['Under $50', '$50-$100', '$100-$200', '$200+']
            },
            {
                id: 'routine-time',
                question: 'How much time do you spend on your beauty routine?',
                options: ['5-10 minutes', '15-30 minutes', '30-60 minutes', '1+ hours']
            },
            {
                id: 'favorite-brands',
                question: 'Which luxury brands appeal to you most?',
                options: ['French elegance', 'Swiss precision', 'Korean innovation', 'Italian sophistication'],
                multiple: true
            }
        ];

        this.renderQuizQuestion(quiz, questions, 0);
    }

    renderQuizQuestion(quiz, questions, currentIndex) {
        const question = questions[currentIndex];
        const questionsContainer = quiz.querySelector('.quiz-questions');
        const progressFill = quiz.querySelector('.progress-fill');
        const progressText = quiz.querySelector('.progress-text');
        
        // Update progress
        const progress = ((currentIndex + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
        
        questionsContainer.innerHTML = `
            <div class="quiz-question">
                <h3>${question.question}</h3>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <label class="quiz-option">
                            <input type="${question.multiple ? 'checkbox' : 'radio'}" 
                                   name="question-${question.id}" 
                                   value="${option}">
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="quiz-navigation">
                    ${currentIndex > 0 ? '<button class="quiz-prev luxury-btn secondary">Previous</button>' : ''}
                    <button class="quiz-next luxury-btn primary" disabled>
                        ${currentIndex === questions.length - 1 ? 'Get My Recommendations' : 'Next'}
                    </button>
                </div>
            </div>
        `;
        
        this.setupQuestionInteractions(quiz, questions, currentIndex);
    }

    setupQuestionInteractions(quiz, questions, currentIndex) {
        const options = quiz.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        const nextBtn = quiz.querySelector('.quiz-next');
        const prevBtn = quiz.querySelector('.quiz-prev');
        
        // Enable next button when option selected
        options.forEach(option => {
            option.addEventListener('change', () => {
                const hasSelection = Array.from(options).some(opt => opt.checked);
                nextBtn.disabled = !hasSelection;
            });
        });
        
        // Next button
        nextBtn.addEventListener('click', () => {
            const selectedValues = Array.from(options)
                .filter(opt => opt.checked)
                .map(opt => opt.value);
            
            this.saveQuizAnswer(questions[currentIndex].id, selectedValues);
            
            if (currentIndex === questions.length - 1) {
                this.showQuizResults(quiz);
            } else {
                this.renderQuizQuestion(quiz, questions, currentIndex + 1);
            }
        });
        
        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.renderQuizQuestion(quiz, questions, currentIndex - 1);
            });
        }
    }

    saveQuizAnswer(questionId, values) {
        if (!this.personalizedData.quizAnswers) {
            this.personalizedData.quizAnswers = {};
        }
        this.personalizedData.quizAnswers[questionId] = values;
        this.savePersonalizedData();
    }

    showQuizResults(quiz) {
        const recommendations = this.generateQuizRecommendations();
        
        quiz.querySelector('.quiz-body').innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <h2>✨ Your Perfect Beauty Match</h2>
                    <p>Based on your answers, here are our top recommendations:</p>
                </div>
                <div class="recommended-products">
                    ${recommendations.map(product => this.renderRecommendedProduct(product)).join('')}
                </div>
                <div class="results-actions">
                    <button class="add-all-to-cart luxury-btn primary">Add All to Cart</button>
                    <button class="save-recommendations luxury-btn secondary">Save Recommendations</button>
                    <button class="retake-quiz luxury-btn tertiary">Retake Quiz</button>
                </div>
            </div>
        `;
        
        this.setupResultsInteractions(quiz, recommendations);
    }

    generateQuizRecommendations() {
        const answers = this.personalizedData.quizAnswers;
        const allProducts = window.productDatabaseManager?.getAllProducts() || [];
        
        // Simple recommendation logic based on quiz answers
        let recommendations = allProducts.filter(product => {
            // Filter by skin type
            if (answers['skin-type'] && product.skinType) {
                const skinType = answers['skin-type'][0].toLowerCase();
                if (!product.skinType.includes(skinType) && !product.skinType.includes('all')) {
                    return false;
                }
            }
            
            // Filter by budget
            if (answers['budget']) {
                const budget = answers['budget'][0];
                const price = product.salePrice || product.price;
                
                if (budget === 'Under $50' && price >= 50) return false;
                if (budget === '$50-$100' && (price < 50 || price > 100)) return false;
                if (budget === '$100-$200' && (price < 100 || price > 200)) return false;
                if (budget === '$200+' && price < 200) return false;
            }
            
            return true;
        });
        
        // Sort by rating and return top 6
        recommendations.sort((a, b) => b.rating - a.rating);
        return recommendations.slice(0, 6);
    }

    // Urgency Elements
    addUrgencyElements() {
        this.createFlashSales();
        this.addStockIndicators();
        this.implementCountdownTimers();
        this.addRecentPurchaseNotifications();
    }

    createFlashSales() {
        const flashSaleProducts = this.getFlashSaleProducts();
        
        if (flashSaleProducts.length > 0) {
            const flashSaleBanner = document.createElement('div');
            flashSaleBanner.className = 'flash-sale-banner';
            flashSaleBanner.innerHTML = `
                <div class="flash-sale-content">
                    <div class="flash-sale-header">
                        <h2>⚡ Flash Sale - Limited Time Only!</h2>
                        <div class="countdown-timer" data-end-time="${this.getFlashSaleEndTime()}">
                            <span class="time-unit"><span class="time-value">00</span><span class="time-label">Hours</span></span>
                            <span class="time-unit"><span class="time-value">00</span><span class="time-label">Minutes</span></span>
                            <span class="time-unit"><span class="time-value">00</span><span class="time-label">Seconds</span></span>
                        </div>
                    </div>
                    <div class="flash-sale-products">
                        ${flashSaleProducts.map(product => this.renderFlashSaleProduct(product)).join('')}
                    </div>
                </div>
            `;
            
            // Insert at top of page
            const main = document.querySelector('main');
            if (main) {
                main.insertBefore(flashSaleBanner, main.firstChild);
            }
            
            this.startCountdownTimer(flashSaleBanner.querySelector('.countdown-timer'));
        }
    }

    getFlashSaleProducts() {
        const allProducts = window.productDatabaseManager?.getAllProducts() || [];
        return allProducts.filter(product => product.salePrice).slice(0, 4);
    }

    getFlashSaleEndTime() {
        // Set flash sale to end in 6 hours
        return new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
    }

    startCountdownTimer(timerElement) {
        const endTime = new Date(timerElement.dataset.endTime).getTime();
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const timeLeft = endTime - now;
            
            if (timeLeft > 0) {
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                
                timerElement.querySelector('.time-value:nth-of-type(1)').textContent = 
                    hours.toString().padStart(2, '0');
                timerElement.querySelector('.time-value:nth-of-type(2)').textContent = 
                    minutes.toString().padStart(2, '0');
                timerElement.querySelector('.time-value:nth-of-type(3)').textContent = 
                    seconds.toString().padStart(2, '0');
            } else {
                timerElement.innerHTML = '<span class="expired">Sale Ended</span>';
                clearInterval(this.urgencyTimers.get(timerElement));
            }
        };
        
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        this.urgencyTimers.set(timerElement, interval);
    }

    // Utility Methods
    getBrandName(brandId) {
        const brand = window.productDatabaseManager?.database?.getBrandById(brandId);
        return brand?.name || 'MidasBeauty';
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    getStockClass(stock) {
        if (stock === 0) return 'out-of-stock';
        if (stock <= 5) return 'low-stock';
        if (stock <= 10) return 'limited-stock';
        return 'in-stock';
    }

    getStockMessage(stock) {
        if (stock === 0) return '❌ Out of Stock';
        if (stock <= 5) return `⚠️ Only ${stock} left in stock!`;
        if (stock <= 10) return `🔥 Limited stock - ${stock} remaining`;
        return '✅ In Stock';
    }

    createUrgencyMessage(product) {
        const messages = [
            '🔥 Trending - 50+ people viewed this today',
            '⏰ Limited time offer - Don\'t miss out!',
            '💖 Added to 100+ wishlists this week',
            '🚚 Free shipping on orders over $75',
            '⭐ Highly rated by beauty experts'
        ];
        
        return `<div class="urgency-message">${messages[Math.floor(Math.random() * messages.length)]}</div>`;
    }

    trackProductView(product) {
        this.browsingBehavior.push({
            productId: product.id,
            category: product.category,
            brand: product.brand,
            price: product.salePrice || product.price,
            timestamp: Date.now()
        });
        
        // Keep only last 50 views
        if (this.browsingBehavior.length > 50) {
            this.browsingBehavior = this.browsingBehavior.slice(-50);
        }
        
        this.savePersonalizedData();
    }

    loadPersonalizedData() {
        try {
            return JSON.parse(localStorage.getItem('midasbeauty_personalized_data')) || {};
        } catch {
            return {};
        }
    }

    savePersonalizedData() {
        this.personalizedData.browsingBehavior = this.browsingBehavior;
        localStorage.setItem('midasbeauty_personalized_data', JSON.stringify(this.personalizedData));
    }

    addProductHoverEffects(card) {
        card.style.transform = 'translateY(-5px) scale(1.02)';
        card.style.boxShadow = '0 15px 35px rgba(212, 175, 55, 0.3)';
        card.style.transition = 'all 0.3s ease';
    }

    removeProductHoverEffects(card) {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    }
}

// Initialize luxury UX enhancements
document.addEventListener('DOMContentLoaded', () => {
    window.midasBeautyLuxuryUX = new MidasBeautyLuxuryUX();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MidasBeautyLuxuryUX;
}

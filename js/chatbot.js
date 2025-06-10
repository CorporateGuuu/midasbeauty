// AI-Powered Beauty Advisor Chatbot for Midas Beauty
// Luxury-styled chatbot with smart responses and engagement features

class BeautyAdvisorChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.responses = this.initializeResponses();
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.setupEventListeners();
        this.loadChatHistory();
        this.showWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <!-- Chatbot Toggle Button -->
            <div id="chatbot-toggle" class="chatbot-toggle" aria-label="Open Beauty Advisor Chat">
                <div class="chatbot-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="chatbot-notification" id="chatbot-notification">
                    <span>Hi! Need beauty advice?</span>
                </div>
            </div>

            <!-- Chatbot Window -->
            <div id="chatbot-window" class="chatbot-window" role="dialog" aria-labelledby="chatbot-header" aria-hidden="true">
                <div class="chatbot-header" id="chatbot-header">
                    <div class="advisor-info">
                        <div class="advisor-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="advisor-details">
                            <h4>Midas Beauty Advisor</h4>
                            <span class="status online">Online</span>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbot-close" aria-label="Close chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chatbot-messages" id="chatbot-messages" role="log" aria-live="polite">
                    <!-- Messages will be added here dynamically -->
                </div>
                
                <div class="chatbot-typing" id="chatbot-typing" style="display: none;">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span class="typing-text">Beauty advisor is typing...</span>
                </div>
                
                <div class="chatbot-input-area">
                    <div class="quick-actions" id="quick-actions">
                        <button class="quick-btn" data-message="I need skincare advice">Skincare Help</button>
                        <button class="quick-btn" data-message="Recommend makeup products">Makeup Tips</button>
                        <button class="quick-btn" data-message="What's trending now?">Trending</button>
                    </div>
                    <div class="input-container">
                        <input type="text" id="chatbot-input" placeholder="Ask me about beauty products..." 
                               aria-label="Type your beauty question" maxlength="500">
                        <button id="chatbot-send" aria-label="Send message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    setupEventListeners() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');
        const quickActions = document.getElementById('quick-actions');

        // Toggle chatbot
        toggle.addEventListener('click', () => this.toggleChatbot());
        close.addEventListener('click', () => this.closeChatbot());

        // Send message
        send.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick actions
        quickActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const message = e.target.getAttribute('data-message');
                this.sendMessage(message);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChatbot();
            }
        });

        // Auto-hide notification after 10 seconds
        setTimeout(() => {
            const notification = document.getElementById('chatbot-notification');
            if (notification) {
                notification.style.display = 'none';
            }
        }, 10000);
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        const notification = document.getElementById('chatbot-notification');
        
        this.isOpen = true;
        window.classList.add('open');
        window.setAttribute('aria-hidden', 'false');
        toggle.classList.add('active');
        notification.style.display = 'none';
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('chatbot-input').focus();
        }, 300);
    }

    closeChatbot() {
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        
        this.isOpen = false;
        window.classList.remove('open');
        window.setAttribute('aria-hidden', 'true');
        toggle.classList.remove('active');
    }

    sendMessage(text = null) {
        const input = document.getElementById('chatbot-input');
        const message = text || input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        if (!text) input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Generate response after delay
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1500 + Math.random() * 1000);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <div class="message-content">
                ${text}
            </div>
            <div class="message-time">${timestamp}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store message
        this.messages.push({ text, sender, timestamp: new Date().toISOString() });
        this.saveChatHistory();
        
        // Animate message
        setTimeout(() => {
            messageElement.classList.add('animate-in');
        }, 10);
    }

    showTyping() {
        const typing = document.getElementById('chatbot-typing');
        this.isTyping = true;
        typing.style.display = 'flex';
        
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('chatbot-typing');
        this.isTyping = false;
        typing.style.display = 'none';
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Find matching response
        for (const category in this.responses) {
            for (const keyword of this.responses[category].keywords) {
                if (lowerMessage.includes(keyword)) {
                    const responses = this.responses[category].responses;
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }
        
        // Default response
        return this.responses.default.responses[Math.floor(Math.random() * this.responses.default.responses.length)];
    }

    initializeResponses() {
        return {
            skincare: {
                keywords: ['skincare', 'skin', 'face', 'acne', 'wrinkles', 'aging', 'moisturizer', 'cleanser', 'serum'],
                responses: [
                    "For glowing skin, I recommend our 24K Gold Radiance Serum! It's perfect for anti-aging and hydration. ✨",
                    "Our Gentle Cleanser is amazing for daily skincare routine. Would you like to know more about your skin type?",
                    "Skincare is so important! What's your main skin concern? I can recommend the perfect products for you.",
                    "The Hydrating Moisturizer is a customer favorite! It works great for all skin types. 💧"
                ]
            },
            makeup: {
                keywords: ['makeup', 'foundation', 'lipstick', 'mascara', 'eyeshadow', 'blush', 'concealer'],
                responses: [
                    "Our Liquid Foundation gives amazing coverage! What's your skin tone? I can help you find the perfect match. 💄",
                    "The Volumizing Mascara is a bestseller! It gives incredible length and volume without clumping.",
                    "For a complete makeup look, I'd suggest starting with our foundation and adding our luxury lipstick collection!",
                    "Makeup is an art! What look are you going for - natural, glam, or something bold? ✨"
                ]
            },
            products: {
                keywords: ['product', 'recommend', 'best', 'popular', 'trending', 'new'],
                responses: [
                    "Our bestsellers include the 24K Gold Serum, Volumizing Mascara, and Hydrating Moisturizer! All are customer favorites. ⭐",
                    "New arrivals are amazing this season! Check out our latest luxury collection with 10 premium brands.",
                    "I'd love to recommend products based on your needs! What are you looking for - skincare, makeup, or haircare?",
                    "Our trending products right now are perfect for the luxury beauty routine you deserve! 🌟"
                ]
            },
            haircare: {
                keywords: ['hair', 'shampoo', 'conditioner', 'treatment', 'styling'],
                responses: [
                    "Our Repair Shampoo and Hydrating Conditioner work perfectly together for healthy, shiny hair! 💇‍♀️",
                    "Haircare is essential! What's your hair type? I can recommend the perfect products for your routine.",
                    "The luxury haircare collection includes everything you need for salon-quality results at home!",
                    "For damaged hair, I highly recommend our repair treatment line - it's transformative! ✨"
                ]
            },
            price: {
                keywords: ['price', 'cost', 'expensive', 'cheap', 'budget', 'sale', 'discount'],
                responses: [
                    "We offer luxury quality at competitive prices! Plus, check out our current promotions for great deals. 💰",
                    "Quality beauty products are an investment in yourself! We have options for different budgets.",
                    "Use code WELCOME10 for 10% off your first order! Free shipping on orders over $50. 🎁",
                    "Our products offer amazing value - luxury quality that lasts! Would you like to see our current offers?"
                ]
            },
            greeting: {
                keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
                responses: [
                    "Hello beautiful! 👋 I'm your personal beauty advisor. How can I help you glow today?",
                    "Hi there! ✨ Welcome to Midas Beauty! I'm here to help you find the perfect products.",
                    "Hey gorgeous! 💫 Ready to discover some amazing beauty products? I'm here to help!",
                    "Good to see you! 🌟 I'm your beauty expert - ask me anything about skincare, makeup, or haircare!"
                ]
            },
            default: {
                keywords: [],
                responses: [
                    "That's a great question! I'm here to help with all your beauty needs. What specific products are you interested in? ✨",
                    "I'd love to help you find the perfect beauty products! Could you tell me more about what you're looking for?",
                    "As your beauty advisor, I'm here to make you glow! What beauty goals can I help you achieve today? 💫",
                    "Let me help you discover amazing products! Are you interested in skincare, makeup, or haircare? 🌟"
                ]
            }
        };
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage("Welcome to Midas Beauty! ✨ I'm your personal beauty advisor. How can I help you glow today?", 'bot');
        }, 1000);
    }

    saveChatHistory() {
        localStorage.setItem('midasBeautyChatHistory', JSON.stringify(this.messages));
    }

    loadChatHistory() {
        const saved = localStorage.getItem('midasBeautyChatHistory');
        if (saved) {
            try {
                this.messages = JSON.parse(saved);
                // Load last 10 messages
                const recentMessages = this.messages.slice(-10);
                recentMessages.forEach(msg => {
                    this.addMessage(msg.text, msg.sender);
                });
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        }
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.beautyAdvisorChatbot = new BeautyAdvisorChatbot();
});

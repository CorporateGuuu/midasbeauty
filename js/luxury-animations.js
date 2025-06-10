// Luxury Visual Animations for Midas Beauty
// Floating golden particles, parallax effects, and premium micro-interactions

class LuxuryAnimations {
    constructor() {
        this.particles = [];
        this.particleCount = 50;
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isVisible = true;
        this.init();
    }

    init() {
        // Create particle canvas
        this.createParticleCanvas();
        
        // Setup parallax scrolling
        this.setupParallaxScrolling();
        
        // Setup hover animations
        this.setupHoverAnimations();
        
        // Setup scroll animations
        this.setupScrollAnimations();
        
        // Setup luxury micro-interactions
        this.setupMicroInteractions();
        
        // Start particle animation
        this.startParticleAnimation();
        
        // Handle visibility changes for performance
        this.handleVisibilityChange();
    }

    createParticleCanvas() {
        // Create canvas for floating particles
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'luxury-particles';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.6;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize particles
        this.initParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getGoldenColor(),
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }

    getGoldenColor() {
        const colors = [
            'rgba(212, 175, 55, ',  // Primary gold
            'rgba(244, 228, 188, ', // Secondary gold
            'rgba(184, 134, 11, ',  // Accent gold
            'rgba(255, 215, 0, '    // Pure gold
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    startParticleAnimation() {
        const animate = () => {
            if (!this.isVisible) {
                this.animationId = requestAnimationFrame(animate);
                return;
            }

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Update pulse
                particle.pulse += particle.pulseSpeed;
                const pulseOpacity = particle.opacity + Math.sin(particle.pulse) * 0.2;
                
                // Wrap around screen
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.y > this.canvas.height) particle.y = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color + pulseOpacity + ')';
                this.ctx.fill();
                
                // Add glow effect
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = particle.color + '0.8)';
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    setupParallaxScrolling() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
            
            // Update particle movement based on scroll
            this.particles.forEach(particle => {
                particle.speedY += scrolled * 0.0001;
            });
        });
    }

    setupHoverAnimations() {
        // Product card hover effects
        document.addEventListener('mouseover', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                this.animateProductCard(productCard, true);
            }
            
            const button = e.target.closest('.btn');
            if (button) {
                this.animateButton(button, true);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                this.animateProductCard(productCard, false);
            }
            
            const button = e.target.closest('.btn');
            if (button) {
                this.animateButton(button, false);
            }
        });
    }

    animateProductCard(card, isHover) {
        if (isHover) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.3)';
            
            // Add golden glow
            const img = card.querySelector('img');
            if (img) {
                img.style.filter = 'brightness(1.1) saturate(1.2)';
            }
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 15px rgba(26, 26, 26, 0.1)';
            
            const img = card.querySelector('img');
            if (img) {
                img.style.filter = 'brightness(1) saturate(1)';
            }
        }
    }

    animateButton(button, isHover) {
        if (isHover) {
            // Create ripple effect
            this.createRippleEffect(button);
            
            // Add golden sparkle
            this.addSparkleEffect(button);
        }
    }

    createRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    addSparkleEffect(element) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle-effect';
                sparkle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: #d4af37;
                    border-radius: 50%;
                    pointer-events: none;
                    animation: sparkle 1s ease-out forwards;
                `;
                
                const rect = element.getBoundingClientRect();
                sparkle.style.left = (Math.random() * rect.width) + 'px';
                sparkle.style.top = (Math.random() * rect.height) + 'px';
                
                element.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 1000);
            }, i * 100);
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add staggered animation for child elements
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        document.querySelectorAll('.fade-up, .slide-in, .zoom-in').forEach(el => {
            observer.observe(el);
        });
    }

    setupMicroInteractions() {
        // Add click animations to all interactive elements
        document.addEventListener('click', (e) => {
            const clickable = e.target.closest('button, a, .clickable');
            if (clickable) {
                this.addClickAnimation(clickable);
            }
        });
        
        // Add focus animations for form elements
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.addFocusAnimation(e.target);
            }
        }, true);
        
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.removeFocusAnimation(e.target);
            }
        }, true);
    }

    addClickAnimation(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }

    addFocusAnimation(element) {
        element.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.3)';
        element.style.borderColor = '#d4af37';
    }

    removeFocusAnimation(element) {
        element.style.boxShadow = '';
        element.style.borderColor = '';
    }

    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            
            if (this.isVisible) {
                // Resume animations
                this.canvas.style.display = 'block';
            } else {
                // Pause animations for performance
                this.canvas.style.display = 'none';
            }
        });
    }

    // Public methods
    toggleParticles() {
        this.canvas.style.display = this.canvas.style.display === 'none' ? 'block' : 'none';
    }

    setParticleCount(count) {
        this.particleCount = count;
        this.initParticles();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize luxury animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on devices that can handle the animations
    const isHighPerformanceDevice = window.devicePixelRatio <= 2 && 
                                   !navigator.userAgent.includes('Mobile');
    
    if (isHighPerformanceDevice || localStorage.getItem('enableLuxuryAnimations') === 'true') {
        window.luxuryAnimations = new LuxuryAnimations();
    }
});

// Add CSS for animations
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(1) rotate(180deg);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: slideUp 0.8s ease-out forwards;
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-up {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }
    
    .slide-in {
        opacity: 0;
        transform: translateX(-30px);
        transition: all 0.8s ease-out;
    }
    
    .zoom-in {
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.8s ease-out;
    }
    
    .stagger-child {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease-out;
    }
    
    /* Smooth transitions for all interactive elements */
    button, a, .clickable {
        transition: transform 0.15s ease-out;
    }
    
    input, textarea, select {
        transition: box-shadow 0.3s ease-out, border-color 0.3s ease-out;
    }
`;
document.head.appendChild(animationStyle);

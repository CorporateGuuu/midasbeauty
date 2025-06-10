// Performance Optimization Module for Midas Beauty
// Handles lazy loading, critical resource loading, and performance monitoring

class PerformanceOptimizer {
    constructor() {
        this.lazyImages = [];
        this.lazyElements = [];
        this.performanceMetrics = {};
        this.init();
    }

    init() {
        // Initialize performance monitoring
        this.startPerformanceMonitoring();
        
        // Setup lazy loading
        this.setupLazyLoading();
        
        // Setup critical resource loading
        this.loadCriticalResources();
        
        // Setup intersection observer for animations
        this.setupIntersectionObserver();
        
        // Optimize images
        this.optimizeImages();
        
        // Setup preloading for next pages
        this.setupPreloading();
    }

    startPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('performance' in window) {
            // First Contentful Paint
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.performanceMetrics.fcp = entry.startTime;
                        console.log('First Contentful Paint:', entry.startTime);
                    }
                }
            });
            observer.observe({ entryTypes: ['paint'] });

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics.lcp = lastEntry.startTime;
                console.log('Largest Contentful Paint:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // DOM Content Loaded
            document.addEventListener('DOMContentLoaded', () => {
                this.performanceMetrics.domContentLoaded = performance.now();
                console.log('DOM Content Loaded:', this.performanceMetrics.domContentLoaded);
            });

            // Page Load Complete
            window.addEventListener('load', () => {
                this.performanceMetrics.loadComplete = performance.now();
                console.log('Page Load Complete:', this.performanceMetrics.loadComplete);
                this.reportPerformanceMetrics();
            });
        }
    }

    setupLazyLoading() {
        // Lazy load images
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Lazy load sections
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    this.loadSection(section);
                    observer.unobserve(section);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        // Observe sections with lazy-load class
        document.querySelectorAll('.lazy-load').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    loadImage(img) {
        // Show loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        img.parentNode.insertBefore(spinner, img);

        // Create new image to preload
        const newImg = new Image();
        newImg.onload = () => {
            // Remove spinner
            spinner.remove();
            
            // Set source and add fade-in animation
            img.src = newImg.src;
            img.classList.add('fade-in');
            
            // Remove data-src attribute
            img.removeAttribute('data-src');
        };
        
        newImg.onerror = () => {
            // Remove spinner and show placeholder
            spinner.remove();
            img.src = 'images/placeholder.jpg';
            img.classList.add('fade-in');
        };
        
        newImg.src = img.dataset.src;
    }

    loadSection(section) {
        // Add loaded class for animations
        section.classList.add('loaded');
        
        // Load any deferred content
        const deferredContent = section.querySelector('.deferred-content');
        if (deferredContent) {
            deferredContent.style.display = 'block';
        }
    }

    loadCriticalResources() {
        // Load non-critical CSS asynchronously
        const loadCSS = (href) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
            document.head.appendChild(link);
        };

        // Load AOS (Animate On Scroll) library if needed
        if (!window.AOS) {
            const aosCSS = document.createElement('link');
            aosCSS.rel = 'stylesheet';
            aosCSS.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
            document.head.appendChild(aosCSS);

            const aosJS = document.createElement('script');
            aosJS.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
            aosJS.onload = () => {
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out',
                    once: true,
                    offset: 100
                });
            };
            document.head.appendChild(aosJS);
        }
    }

    setupIntersectionObserver() {
        // Animate elements when they come into view
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with animation classes
        document.querySelectorAll('.fade-up, .fade-in, .slide-in').forEach(el => {
            animationObserver.observe(el);
        });
    }

    optimizeImages() {
        // Convert images to WebP if supported
        const supportsWebP = this.checkWebPSupport();
        
        if (supportsWebP) {
            document.querySelectorAll('img').forEach(img => {
                if (img.src && !img.src.includes('.webp')) {
                    const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    
                    // Check if WebP version exists
                    const testImg = new Image();
                    testImg.onload = () => {
                        img.src = webpSrc;
                    };
                    testImg.src = webpSrc;
                }
            });
        }
    }

    checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    setupPreloading() {
        // Preload next page on hover
        document.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.preloadPage(link.href);
            }, { once: true });
        });
    }

    preloadPage(url) {
        // Only preload internal pages
        if (url.includes(window.location.origin) || url.startsWith('/')) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        }
    }

    reportPerformanceMetrics() {
        // Send performance metrics to analytics (if available)
        if (window.gtag) {
            window.gtag('event', 'performance_metrics', {
                'fcp': this.performanceMetrics.fcp,
                'lcp': this.performanceMetrics.lcp,
                'dom_content_loaded': this.performanceMetrics.domContentLoaded,
                'load_complete': this.performanceMetrics.loadComplete
            });
        }

        // Store in localStorage for debugging
        localStorage.setItem('midasBeautyPerformance', JSON.stringify(this.performanceMetrics));
    }

    // Public method to manually trigger lazy loading
    triggerLazyLoad() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }

    // Public method to get performance metrics
    getPerformanceMetrics() {
        return this.performanceMetrics;
    }
}

// Initialize performance optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Add CSS for fade-in animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        animation: fadeIn 0.5s ease-in-out forwards;
    }
    
    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
    
    .animate-in {
        animation: slideUp 0.6s ease-out forwards;
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
    
    .lazy-load {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease-out;
    }
    
    .lazy-load.loaded {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Performance Enhancement System for MidasBeauty
// Implements lazy loading, compression, PWA features, and optimization

class MidasBeautyPerformance {
    constructor() {
        this.lazyLoadObserver = null;
        this.criticalResourcesLoaded = false;
        this.performanceMetrics = {};
        this.init();
    }

    init() {
        this.implementLazyLoading();
        this.optimizeResourceLoading();
        this.setupServiceWorker();
        this.implementCriticalCSS();
        this.optimizeAuth0Loading();
        this.setupPerformanceMonitoring();
        this.optimizeProductDatabase();
        this.implementImageOptimization();
        console.log('✅ Performance enhancements initialized');
    }

    // Lazy Loading Implementation
    implementLazyLoading() {
        // Intersection Observer for lazy loading
        this.lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    this.lazyLoadObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Apply lazy loading to images
        this.setupLazyImages();
        
        // Apply lazy loading to product sections
        this.setupLazyProductSections();
        
        // Apply lazy loading to non-critical scripts
        this.setupLazyScripts();
    }

    setupLazyImages() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        images.forEach(img => {
            // Add placeholder while loading
            if (!img.src && img.dataset.src) {
                img.src = this.generatePlaceholder(img.width || 300, img.height || 200);
                img.classList.add('lazy-loading');
            }
            
            this.lazyLoadObserver.observe(img);
        });

        // Convert existing images to lazy loading
        const existingImages = document.querySelectorAll('img:not([data-src]):not([loading])');
        existingImages.forEach((img, index) => {
            if (index > 3) { // Keep first 3 images for LCP
                img.loading = 'lazy';
            }
        });
    }

    setupLazyProductSections() {
        const productSections = document.querySelectorAll('.product-grid, .product-recommendations, .related-products');
        
        productSections.forEach(section => {
            section.classList.add('lazy-section');
            this.lazyLoadObserver.observe(section);
        });
    }

    setupLazyScripts() {
        const nonCriticalScripts = [
            'js/product-recommendations.js',
            'js/analytics.js',
            'js/social-sharing.js'
        ];

        nonCriticalScripts.forEach(scriptSrc => {
            const placeholder = document.createElement('div');
            placeholder.dataset.script = scriptSrc;
            placeholder.classList.add('lazy-script');
            document.body.appendChild(placeholder);
            this.lazyLoadObserver.observe(placeholder);
        });
    }

    loadElement(element) {
        if (element.tagName === 'IMG') {
            this.loadLazyImage(element);
        } else if (element.classList.contains('lazy-section')) {
            this.loadLazySection(element);
        } else if (element.classList.contains('lazy-script')) {
            this.loadLazyScript(element);
        }
    }

    loadLazyImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            
            img.onload = () => {
                img.classList.add('fade-in');
            };
        }
    }

    loadLazySection(section) {
        section.classList.add('loading');
        
        // Trigger section-specific loading
        if (section.classList.contains('product-recommendations')) {
            this.loadProductRecommendations(section);
        } else if (section.classList.contains('related-products')) {
            this.loadRelatedProducts(section);
        }
        
        section.classList.remove('loading');
        section.classList.add('loaded');
    }

    loadLazyScript(placeholder) {
        const scriptSrc = placeholder.dataset.script;
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;
        document.head.appendChild(script);
        placeholder.remove();
    }

    // Resource Loading Optimization
    optimizeResourceLoading() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Defer non-critical resources
        this.deferNonCriticalResources();
        
        // Implement resource hints
        this.addResourceHints();
    }

    preloadCriticalResources() {
        const criticalResources = [
            { href: 'css/style.css', as: 'style' },
            { href: 'css/header-redesign.css', as: 'style' },
            { href: 'js/product-database.js', as: 'script' },
            { href: 'https://cdn.auth0.com/js/auth0-spa-js/2.1/auth0-spa-js.production.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = () => {
                    link.rel = 'stylesheet';
                };
            }
            document.head.appendChild(link);
        });
    }

    deferNonCriticalResources() {
        const nonCriticalScripts = document.querySelectorAll('script[src*="analytics"], script[src*="social"], script[src*="chat"]');
        
        nonCriticalScripts.forEach(script => {
            script.defer = true;
        });
    }

    addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//cdn.auth0.com' },
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
            { rel: 'preconnect', href: 'https://cdn.auth0.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            link.rel = hint.rel;
            link.href = hint.href;
            if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
            document.head.appendChild(link);
        });
    }

    // Service Worker for PWA
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('✅ Service Worker registered:', registration);
                        this.setupPWAFeatures();
                    })
                    .catch(error => {
                        console.log('❌ Service Worker registration failed:', error);
                    });
            });
        }
    }

    setupPWAFeatures() {
        // Add to home screen prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt();
        });

        // Handle app installation
        window.addEventListener('appinstalled', () => {
            console.log('✅ MidasBeauty PWA installed');
            this.trackEvent('pwa_installed');
        });
    }

    showInstallPrompt() {
        const installBanner = document.createElement('div');
        installBanner.className = 'install-banner';
        installBanner.innerHTML = `
            <div class="install-content">
                <span>💎 Install MidasBeauty for the best shopping experience</span>
                <button class="install-btn">Install</button>
                <button class="install-close">×</button>
            </div>
        `;
        
        document.body.appendChild(installBanner);
        
        installBanner.querySelector('.install-btn').addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('✅ User accepted PWA install');
                    }
                    deferredPrompt = null;
                });
            }
            installBanner.remove();
        });
        
        installBanner.querySelector('.install-close').addEventListener('click', () => {
            installBanner.remove();
        });
    }

    // Critical CSS Implementation
    implementCriticalCSS() {
        const criticalCSS = `
            /* Critical above-the-fold styles */
            .header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: linear-gradient(135deg, #1a1a1a, #2c2c2c); }
            .logo { font-size: 1.8rem; font-weight: bold; color: #d4af37; }
            .nav-menu { display: flex; gap: 2rem; }
            .nav-link { color: white; text-decoration: none; transition: color 0.3s; }
            .hero-section { min-height: 60vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f8f9fa, #e9ecef); }
            .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; padding: 2rem; }
            .loading { opacity: 0.7; }
            .fade-in { animation: fadeIn 0.5s ease-in; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Auth0 Loading Optimization
    optimizeAuth0Loading() {
        // Load Auth0 only when needed
        let auth0LoadPromise = null;
        
        const loadAuth0WhenNeeded = () => {
            if (!auth0LoadPromise) {
                auth0LoadPromise = new Promise((resolve) => {
                    if (typeof createAuth0Client !== 'undefined') {
                        resolve();
                    } else {
                        const script = document.createElement('script');
                        script.src = 'https://cdn.auth0.com/js/auth0-spa-js/2.1/auth0-spa-js.production.js';
                        script.onload = resolve;
                        document.head.appendChild(script);
                    }
                });
            }
            return auth0LoadPromise;
        };

        // Trigger Auth0 loading on user interaction
        const authTriggers = document.querySelectorAll('#account-link, .login-btn, .register-btn');
        authTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', loadAuth0WhenNeeded, { once: true });
            trigger.addEventListener('focus', loadAuth0WhenNeeded, { once: true });
        });
    }

    // Product Database Optimization
    optimizeProductDatabase() {
        // Implement virtual scrolling for large product lists
        this.setupVirtualScrolling();
        
        // Optimize product search with debouncing
        this.optimizeProductSearch();
        
        // Implement progressive loading
        this.setupProgressiveLoading();
    }

    setupVirtualScrolling() {
        const productGrids = document.querySelectorAll('.product-grid');
        
        productGrids.forEach(grid => {
            if (grid.children.length > 20) {
                this.implementVirtualScrolling(grid);
            }
        });
    }

    implementVirtualScrolling(container) {
        const itemHeight = 400; // Approximate product card height
        const visibleItems = Math.ceil(window.innerHeight / itemHeight) + 2;
        const totalItems = container.children.length;
        
        let startIndex = 0;
        let endIndex = Math.min(visibleItems, totalItems);
        
        const updateVisibleItems = () => {
            const scrollTop = window.pageYOffset;
            const containerTop = container.offsetTop;
            const relativeScrollTop = scrollTop - containerTop;
            
            startIndex = Math.max(0, Math.floor(relativeScrollTop / itemHeight) - 1);
            endIndex = Math.min(totalItems, startIndex + visibleItems + 2);
            
            Array.from(container.children).forEach((item, index) => {
                if (index >= startIndex && index <= endIndex) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        };
        
        window.addEventListener('scroll', this.throttle(updateVisibleItems, 16));
        updateVisibleItems();
    }

    optimizeProductSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300); // Debounce search
            });
        }
    }

    setupProgressiveLoading() {
        // Load products in batches
        if (window.productDatabaseManager) {
            const originalGetAllProducts = window.productDatabaseManager.getAllProducts;
            
            window.productDatabaseManager.getAllProducts = function(limit = null) {
                const allProducts = originalGetAllProducts.call(this);
                
                if (limit) {
                    return allProducts.slice(0, limit);
                }
                
                return allProducts;
            };
        }
    }

    // Image Optimization
    implementImageOptimization() {
        // WebP support detection
        this.detectWebPSupport();
        
        // Responsive images
        this.setupResponsiveImages();
        
        // Image compression
        this.setupImageCompression();
    }

    detectWebPSupport() {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            const support = webP.height === 2;
            document.documentElement.classList.toggle('webp-support', support);
            
            if (support) {
                this.convertImagesToWebP();
            }
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    convertImagesToWebP() {
        const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".png"]');
        
        images.forEach(img => {
            const webpSrc = img.src.replace(/\.(jpg|png)$/, '.webp');
            
            // Test if WebP version exists
            const testImg = new Image();
            testImg.onload = () => {
                img.src = webpSrc;
            };
            testImg.src = webpSrc;
        });
    }

    setupResponsiveImages() {
        const images = document.querySelectorAll('img:not([srcset])');
        
        images.forEach(img => {
            if (img.src && !img.srcset) {
                const baseSrc = img.src.replace(/\.(jpg|png|webp)$/, '');
                const ext = img.src.match(/\.(jpg|png|webp)$/)?.[0] || '.jpg';
                
                img.srcset = `
                    ${baseSrc}-400w${ext} 400w,
                    ${baseSrc}-800w${ext} 800w,
                    ${baseSrc}-1200w${ext} 1200w
                `;
                img.sizes = '(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px';
            }
        });
    }

    // Performance Monitoring
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Track resource loading times
        this.trackResourceTiming();
        
        // Monitor user interactions
        this.trackUserInteractions();
    }

    monitorCoreWebVitals() {
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.performanceMetrics.lcp = lastEntry.startTime;
            this.reportMetric('lcp', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                const fid = entry.processingStart - entry.startTime;
                this.performanceMetrics.fid = fid;
                this.reportMetric('fid', fid);
            });
        }).observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            this.performanceMetrics.cls = clsValue;
            this.reportMetric('cls', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    trackResourceTiming() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            
            resources.forEach(resource => {
                if (resource.duration > 1000) { // Resources taking more than 1s
                    console.warn(`Slow resource: ${resource.name} (${resource.duration}ms)`);
                }
            });
        });
    }

    trackUserInteractions() {
        const interactions = ['click', 'scroll', 'keydown'];
        
        interactions.forEach(event => {
            document.addEventListener(event, this.throttle(() => {
                this.trackEvent(`user_${event}`);
            }, 1000));
        });
    }

    // Utility Methods
    generatePlaceholder(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Create gradient placeholder
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f0f0f0');
        gradient.addColorStop(1, '#e0e0e0');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        return canvas.toDataURL();
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    reportMetric(name, value) {
        // Report to analytics
        if (window.gtag) {
            window.gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: name,
                value: Math.round(value)
            });
        }
        
        console.log(`Performance metric - ${name.toUpperCase()}: ${value}ms`);
    }

    trackEvent(eventName) {
        if (window.gtag) {
            window.gtag('event', eventName, {
                event_category: 'User Interaction'
            });
        }
    }
}

// Initialize performance enhancements
document.addEventListener('DOMContentLoaded', () => {
    window.midasBeautyPerformance = new MidasBeautyPerformance();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MidasBeautyPerformance;
}

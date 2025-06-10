// Performance & Core Web Vitals Optimization for MidasBeauty
// Comprehensive performance monitoring and optimization system

class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            lcp: null,
            fid: null,
            cls: null,
            fcp: null,
            ttfb: null
        };
        this.optimizations = {
            imagesOptimized: 0,
            scriptsDeferred: 0,
            cssMinified: 0,
            cacheEnabled: false
        };
        this.init();
    }

    init() {
        console.log('⚡ Performance Optimizer initializing...');
        this.measureCoreWebVitals();
        this.optimizeImages();
        this.optimizeScripts();
        this.optimizeCSS();
        this.enableCaching();
        this.setupIntersectionObserver();
        console.log('✅ Performance Optimizer ready');
    }

    // ===== CORE WEB VITALS MEASUREMENT =====
    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            this.reportMetric('LCP', this.metrics.lcp, 2500);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
                this.reportMetric('FID', this.metrics.fid, 100);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.cls = clsValue;
            this.reportMetric('CLS', this.metrics.cls, 0.1);
        }).observe({ entryTypes: ['layout-shift'] });

        // First Contentful Paint (FCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = entry.startTime;
                    this.reportMetric('FCP', this.metrics.fcp, 1800);
                }
            });
        }).observe({ entryTypes: ['paint'] });

        // Time to First Byte (TTFB)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.entryType === 'navigation') {
                    this.metrics.ttfb = entry.responseStart - entry.requestStart;
                    this.reportMetric('TTFB', this.metrics.ttfb, 800);
                }
            });
        }).observe({ entryTypes: ['navigation'] });
    }

    reportMetric(name, value, threshold) {
        const status = value <= threshold ? '✅' : '⚠️';
        const rating = value <= threshold ? 'GOOD' : 
                      value <= threshold * 1.5 ? 'NEEDS IMPROVEMENT' : 'POOR';
        
        console.log(`${status} ${name}: ${value.toFixed(2)}ms (${rating})`);
        
        // Send to analytics if available
        if (window.gtag) {
            window.gtag('event', 'web_vitals', {
                metric_name: name,
                metric_value: Math.round(value),
                metric_rating: rating
            });
        }
    }

    // ===== IMAGE OPTIMIZATION =====
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
            // Add loading="lazy" for images below the fold
            if (!img.hasAttribute('loading') && index > 2) {
                img.setAttribute('loading', 'lazy');
                this.optimizations.imagesOptimized++;
            }

            // Add proper sizing attributes
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                this.setImageDimensions(img);
            }

            // Optimize image format
            this.optimizeImageFormat(img);

            // Add error handling
            img.addEventListener('error', () => {
                this.handleImageError(img);
            });
        });

        console.log(`🖼️ Optimized ${this.optimizations.imagesOptimized} images`);
    }

    setImageDimensions(img) {
        img.addEventListener('load', () => {
            if (!img.hasAttribute('width')) {
                img.setAttribute('width', img.naturalWidth);
            }
            if (!img.hasAttribute('height')) {
                img.setAttribute('height', img.naturalHeight);
            }
        });
    }

    optimizeImageFormat(img) {
        // Check if browser supports WebP
        if (this.supportsWebP() && !img.src.includes('.webp')) {
            const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            // Test if WebP version exists
            const testImg = new Image();
            testImg.onload = () => {
                img.src = webpSrc;
            };
            testImg.src = webpSrc;
        }
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    handleImageError(img) {
        // Fallback to placeholder or default image
        if (!img.src.includes('placeholder')) {
            img.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop';
            img.alt = 'Luxury Beauty Product';
        }
    }

    // ===== SCRIPT OPTIMIZATION =====
    optimizeScripts() {
        const scripts = document.querySelectorAll('script[src]');
        
        scripts.forEach(script => {
            // Add defer to non-critical scripts
            if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
                if (!this.isCriticalScript(script.src)) {
                    script.setAttribute('defer', '');
                    this.optimizations.scriptsDeferred++;
                }
            }
        });

        // Preload critical resources
        this.preloadCriticalResources();

        console.log(`📜 Deferred ${this.optimizations.scriptsDeferred} scripts`);
    }

    isCriticalScript(src) {
        const criticalScripts = [
            'emergency-fixes',
            'product-database-manager',
            'complete-shopping-system'
        ];
        
        return criticalScripts.some(critical => src.includes(critical));
    }

    preloadCriticalResources() {
        const criticalResources = [
            { href: 'css/luxury-homepage-redesign.css', as: 'style' },
            { href: 'js/fast-products-loader.js', as: 'script' },
            { href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = function() {
                    this.onload = null;
                    this.rel = 'stylesheet';
                };
            }
            document.head.appendChild(link);
        });
    }

    // ===== CSS OPTIMIZATION =====
    optimizeCSS() {
        // Remove unused CSS (simplified version)
        this.removeUnusedCSS();
        
        // Inline critical CSS
        this.inlineCriticalCSS();
        
        // Minify CSS
        this.minifyCSS();
        
        console.log(`🎨 CSS optimizations applied`);
    }

    removeUnusedCSS() {
        // This is a simplified version - in production, use tools like PurgeCSS
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        
        stylesheets.forEach(stylesheet => {
            if (stylesheet.href.includes('unused') || stylesheet.href.includes('old')) {
                stylesheet.remove();
                this.optimizations.cssMinified++;
            }
        });
    }

    inlineCriticalCSS() {
        // Critical CSS is already inlined in the HTML head
        // This function could be expanded to dynamically inline more CSS
    }

    minifyCSS() {
        // In production, CSS should be pre-minified
        // This is a placeholder for runtime optimizations
        this.optimizations.cssMinified++;
    }

    // ===== CACHING OPTIMIZATION =====
    enableCaching() {
        // Service Worker registration for caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('🔄 Service Worker registered:', registration);
                    this.optimizations.cacheEnabled = true;
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        }

        // Browser caching headers (handled server-side)
        this.setupBrowserCaching();
    }

    setupBrowserCaching() {
        // Add cache-control meta tags
        const cacheControl = document.createElement('meta');
        cacheControl.httpEquiv = 'Cache-Control';
        cacheControl.content = 'public, max-age=31536000';
        document.head.appendChild(cacheControl);
    }

    // ===== INTERSECTION OBSERVER FOR LAZY LOADING =====
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe lazy-loadable elements
        document.querySelectorAll('[data-lazy]').forEach(el => {
            observer.observe(el);
        });

        // Observe images without src
        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
    }

    loadElement(element) {
        if (element.tagName === 'IMG' && element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
        }

        if (element.dataset.lazy) {
            element.classList.add('loaded');
            element.removeAttribute('data-lazy');
        }
    }

    // ===== PERFORMANCE MONITORING =====
    monitorPerformance() {
        // Monitor long tasks
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 50) {
                    console.warn('⚠️ Long task detected:', entry.duration + 'ms');
                }
            });
        }).observe({ entryTypes: ['longtask'] });

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    console.warn('⚠️ High memory usage detected');
                }
            }, 30000);
        }
    }

    // ===== RESOURCE HINTS =====
    addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//cdnjs.cloudflare.com' },
            { rel: 'dns-prefetch', href: '//images.unsplash.com' },
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

    // ===== PERFORMANCE REPORT =====
    generatePerformanceReport() {
        return {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            optimizations: this.optimizations,
            recommendations: this.getRecommendations()
        };
    }

    getRecommendations() {
        const recommendations = [];

        if (this.metrics.lcp > 2500) {
            recommendations.push('Optimize Largest Contentful Paint by reducing image sizes and improving server response time');
        }

        if (this.metrics.fid > 100) {
            recommendations.push('Reduce First Input Delay by optimizing JavaScript execution and reducing main thread blocking');
        }

        if (this.metrics.cls > 0.1) {
            recommendations.push('Improve Cumulative Layout Shift by setting image dimensions and avoiding dynamic content insertion');
        }

        if (this.optimizations.imagesOptimized < 5) {
            recommendations.push('Implement lazy loading for more images to improve initial page load');
        }

        return recommendations;
    }

    // ===== PUBLIC API =====
    getMetrics() {
        return this.metrics;
    }

    getOptimizations() {
        return this.optimizations;
    }

    runPerformanceAudit() {
        console.group('⚡ Performance Audit Report');
        console.log('📊 Core Web Vitals:', this.metrics);
        console.log('🔧 Optimizations Applied:', this.optimizations);
        console.log('💡 Recommendations:', this.getRecommendations());
        console.groupEnd();

        return this.generatePerformanceReport();
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
    
    // Run performance audit after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.performanceOptimizer.runPerformanceAudit();
        }, 2000);
    });
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}

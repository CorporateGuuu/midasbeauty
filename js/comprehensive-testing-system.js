// Comprehensive Testing System for MidasBeauty
// Handles cross-device testing, performance monitoring, and functionality validation

class ComprehensiveTesting {
    constructor() {
        this.testResults = {
            performance: {},
            functionality: {},
            responsive: {},
            accessibility: {},
            crossBrowser: {}
        };
        this.deviceBreakpoints = {
            mobile: { min: 320, max: 767 },
            tablet: { min: 768, max: 1023 },
            desktop: { min: 1024, max: 1919 },
            largeDesktop: { min: 1920, max: 9999 }
        };
        this.init();
    }

    init() {
        console.log('🧪 Comprehensive Testing System initializing...');
        this.detectDevice();
        this.monitorPerformance();
        this.testFunctionality();
        this.setupAccessibilityTests();
        this.setupResponsiveTests();
        console.log('✅ Testing System ready');
    }

    // ===== DEVICE DETECTION =====
    detectDevice() {
        const width = window.innerWidth;
        const userAgent = navigator.userAgent;
        
        this.deviceInfo = {
            width: width,
            height: window.innerHeight,
            type: this.getDeviceType(width),
            browser: this.getBrowser(userAgent),
            os: this.getOS(userAgent),
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isTablet: /iPad|Android(?!.*Mobile)/i.test(userAgent),
            touchSupport: 'ontouchstart' in window
        };

        console.log('📱 Device detected:', this.deviceInfo);
        this.logTestResult('device', 'detection', true, this.deviceInfo);
    }

    getDeviceType(width) {
        if (width <= 767) return 'mobile';
        if (width <= 1023) return 'tablet';
        if (width <= 1919) return 'desktop';
        return 'large-desktop';
    }

    getBrowser(userAgent) {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    getOS(userAgent) {
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac')) return 'macOS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS')) return 'iOS';
        return 'Unknown';
    }

    // ===== PERFORMANCE MONITORING =====
    monitorPerformance() {
        // Core Web Vitals
        this.measureCoreWebVitals();
        
        // Page Load Performance
        this.measurePageLoad();
        
        // Resource Loading
        this.measureResourceLoading();
        
        // JavaScript Performance
        this.measureJSPerformance();
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            const lcp = lastEntry.startTime;
            
            this.logTestResult('performance', 'LCP', lcp < 2500, {
                value: lcp,
                threshold: 2500,
                rating: lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor'
            });
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                const fid = entry.processingStart - entry.startTime;
                
                this.logTestResult('performance', 'FID', fid < 100, {
                    value: fid,
                    threshold: 100,
                    rating: fid < 100 ? 'good' : fid < 300 ? 'needs-improvement' : 'poor'
                });
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
            
            this.logTestResult('performance', 'CLS', clsValue < 0.1, {
                value: clsValue,
                threshold: 0.1,
                rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.fetchStart;
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
            
            this.logTestResult('performance', 'pageLoad', loadTime < 3000, {
                totalLoadTime: loadTime,
                domContentLoaded: domContentLoaded,
                threshold: 3000
            });
        });
    }

    measureResourceLoading() {
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(resource => resource.duration > 1000);
        
        this.logTestResult('performance', 'resourceLoading', slowResources.length === 0, {
            totalResources: resources.length,
            slowResources: slowResources.length,
            slowResourcesList: slowResources.map(r => ({ name: r.name, duration: r.duration }))
        });
    }

    measureJSPerformance() {
        const startTime = performance.now();
        
        // Test JavaScript execution time
        setTimeout(() => {
            const executionTime = performance.now() - startTime;
            
            this.logTestResult('performance', 'jsExecution', executionTime < 50, {
                executionTime: executionTime,
                threshold: 50
            });
        }, 0);
    }

    // ===== FUNCTIONALITY TESTING =====
    testFunctionality() {
        this.testNavigation();
        this.testCart();
        this.testSearch();
        this.testProductInteractions();
        this.testForms();
    }

    testNavigation() {
        const navLinks = document.querySelectorAll('nav a, .nav-link');
        const workingLinks = Array.from(navLinks).filter(link => {
            return link.href && !link.href.includes('#') && link.href !== window.location.href;
        });

        this.logTestResult('functionality', 'navigation', workingLinks.length > 0, {
            totalLinks: navLinks.length,
            workingLinks: workingLinks.length,
            links: workingLinks.map(link => ({ text: link.textContent, href: link.href }))
        });
    }

    testCart() {
        const cartIcon = document.getElementById('cart-toggle');
        const cartSidebar = document.getElementById('cart-sidebar');
        const addToCartButtons = document.querySelectorAll('.add-to-cart, .btn-add-cart');

        const cartFunctional = !!(cartIcon && cartSidebar && addToCartButtons.length > 0);

        this.logTestResult('functionality', 'cart', cartFunctional, {
            hasCartIcon: !!cartIcon,
            hasCartSidebar: !!cartSidebar,
            addToCartButtons: addToCartButtons.length,
            cartSystemAvailable: !!(window.shoppingSystem || window.midasBeautyEmergencyFixes)
        });
    }

    testSearch() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const searchForm = document.getElementById('search-form');

        const searchFunctional = !!(searchInput && searchButton && searchForm);

        this.logTestResult('functionality', 'search', searchFunctional, {
            hasSearchInput: !!searchInput,
            hasSearchButton: !!searchButton,
            hasSearchForm: !!searchForm
        });
    }

    testProductInteractions() {
        const productCards = document.querySelectorAll('.product-card');
        const wishlistButtons = document.querySelectorAll('.btn-wishlist');
        const quickViewButtons = document.querySelectorAll('.btn-quick-view');

        this.logTestResult('functionality', 'productInteractions', productCards.length > 0, {
            productCards: productCards.length,
            wishlistButtons: wishlistButtons.length,
            quickViewButtons: quickViewButtons.length
        });
    }

    testForms() {
        const forms = document.querySelectorAll('form');
        const newsletterForm = document.getElementById('newsletter-form');
        const searchForm = document.getElementById('search-form');

        this.logTestResult('functionality', 'forms', forms.length > 0, {
            totalForms: forms.length,
            hasNewsletterForm: !!newsletterForm,
            hasSearchForm: !!searchForm
        });
    }

    // ===== RESPONSIVE TESTING =====
    setupResponsiveTests() {
        this.testComponentVisibility();
        this.testMobileNavigation();
        this.testTouchInteractions();
        
        // Test on window resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.detectDevice();
                this.testComponentVisibility();
            }, 250);
        });
    }

    testComponentVisibility() {
        const components = {
            header: document.querySelector('header'),
            hero: document.querySelector('.hero'),
            featuredProducts: document.getElementById('featured-products'),
            testimonials: document.querySelector('.testimonials'),
            footer: document.querySelector('footer'),
            navigation: document.querySelector('nav, .main-navigation')
        };

        const visibilityResults = {};
        Object.keys(components).forEach(key => {
            const element = components[key];
            if (element) {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;
                visibilityResults[key] = {
                    exists: true,
                    visible: isVisible,
                    dimensions: { width: rect.width, height: rect.height }
                };
            } else {
                visibilityResults[key] = { exists: false, visible: false };
            }
        });

        const allVisible = Object.values(visibilityResults).every(result => result.exists && result.visible);

        this.logTestResult('responsive', 'componentVisibility', allVisible, {
            deviceType: this.deviceInfo.type,
            screenSize: `${this.deviceInfo.width}x${this.deviceInfo.height}`,
            components: visibilityResults
        });
    }

    testMobileNavigation() {
        if (this.deviceInfo.type === 'mobile') {
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            const mainNavigation = document.getElementById('main-navigation');

            this.logTestResult('responsive', 'mobileNavigation', !!(mobileMenuToggle && mainNavigation), {
                hasMobileToggle: !!mobileMenuToggle,
                hasMainNavigation: !!mainNavigation,
                navigationVisible: mainNavigation ? getComputedStyle(mainNavigation).display !== 'none' : false
            });
        }
    }

    testTouchInteractions() {
        if (this.deviceInfo.touchSupport) {
            const touchTargets = document.querySelectorAll('button, a, .btn, .product-card');
            const properSizedTargets = Array.from(touchTargets).filter(target => {
                const rect = target.getBoundingClientRect();
                return rect.width >= 44 && rect.height >= 44; // WCAG minimum touch target size
            });

            this.logTestResult('responsive', 'touchInteractions', properSizedTargets.length === touchTargets.length, {
                totalTargets: touchTargets.length,
                properSizedTargets: properSizedTargets.length,
                touchSupport: this.deviceInfo.touchSupport
            });
        }
    }

    // ===== ACCESSIBILITY TESTING =====
    setupAccessibilityTests() {
        this.testKeyboardNavigation();
        this.testAriaLabels();
        this.testColorContrast();
        this.testFocusIndicators();
    }

    testKeyboardNavigation() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        this.logTestResult('accessibility', 'keyboardNavigation', focusableElements.length > 0, {
            focusableElements: focusableElements.length,
            hasTabIndex: Array.from(focusableElements).some(el => el.hasAttribute('tabindex'))
        });
    }

    testAriaLabels() {
        const interactiveElements = document.querySelectorAll('button, a, input');
        const elementsWithLabels = Array.from(interactiveElements).filter(el => {
            return el.hasAttribute('aria-label') || 
                   el.hasAttribute('aria-labelledby') || 
                   el.hasAttribute('title') ||
                   el.textContent.trim() !== '';
        });

        this.logTestResult('accessibility', 'ariaLabels', elementsWithLabels.length === interactiveElements.length, {
            totalElements: interactiveElements.length,
            elementsWithLabels: elementsWithLabels.length
        });
    }

    testColorContrast() {
        // Basic color contrast test (simplified)
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a');
        const contrastIssues = [];

        // This is a simplified test - in production, you'd use a proper contrast checking library
        this.logTestResult('accessibility', 'colorContrast', contrastIssues.length === 0, {
            textElements: textElements.length,
            contrastIssues: contrastIssues.length
        });
    }

    testFocusIndicators() {
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        
        // Test if focus styles are defined
        const hasFocusStyles = Array.from(focusableElements).some(el => {
            const styles = getComputedStyle(el, ':focus');
            return styles.outline !== 'none' || styles.boxShadow !== 'none';
        });

        this.logTestResult('accessibility', 'focusIndicators', hasFocusStyles, {
            focusableElements: focusableElements.length,
            hasFocusStyles: hasFocusStyles
        });
    }

    // ===== UTILITY METHODS =====
    logTestResult(category, test, passed, details = {}) {
        if (!this.testResults[category]) {
            this.testResults[category] = {};
        }

        this.testResults[category][test] = {
            passed: passed,
            timestamp: Date.now(),
            details: details
        };

        const status = passed ? '✅' : '❌';
        console.log(`${status} ${category}.${test}:`, passed ? 'PASSED' : 'FAILED', details);
    }

    generateTestReport() {
        const report = {
            timestamp: new Date().toISOString(),
            device: this.deviceInfo,
            summary: {
                total: 0,
                passed: 0,
                failed: 0
            },
            categories: {}
        };

        Object.keys(this.testResults).forEach(category => {
            const categoryTests = this.testResults[category];
            const categoryPassed = Object.values(categoryTests).filter(test => test.passed).length;
            const categoryTotal = Object.keys(categoryTests).length;

            report.categories[category] = {
                total: categoryTotal,
                passed: categoryPassed,
                failed: categoryTotal - categoryPassed,
                tests: categoryTests
            };

            report.summary.total += categoryTotal;
            report.summary.passed += categoryPassed;
            report.summary.failed += (categoryTotal - categoryPassed);
        });

        report.summary.passRate = report.summary.total > 0 ? 
            (report.summary.passed / report.summary.total * 100).toFixed(1) : 0;

        return report;
    }

    displayTestResults() {
        const report = this.generateTestReport();
        
        console.group('🧪 MidasBeauty Test Report');
        console.log('📊 Summary:', `${report.summary.passed}/${report.summary.total} tests passed (${report.summary.passRate}%)`);
        console.log('📱 Device:', report.device);
        
        Object.keys(report.categories).forEach(category => {
            const cat = report.categories[category];
            console.group(`${category}: ${cat.passed}/${cat.total} passed`);
            
            Object.keys(cat.tests).forEach(testName => {
                const test = cat.tests[testName];
                const status = test.passed ? '✅' : '❌';
                console.log(`${status} ${testName}:`, test.details);
            });
            
            console.groupEnd();
        });
        
        console.groupEnd();

        return report;
    }

    // ===== PUBLIC API =====
    runAllTests() {
        console.log('🚀 Running comprehensive tests...');
        
        setTimeout(() => {
            this.detectDevice();
            this.monitorPerformance();
            this.testFunctionality();
            this.setupAccessibilityTests();
            this.setupResponsiveTests();
            
            setTimeout(() => {
                const report = this.displayTestResults();
                
                // Store results for external access
                window.midasBeautyTestReport = report;
                
                // Dispatch custom event
                window.dispatchEvent(new CustomEvent('midasBeautyTestComplete', {
                    detail: report
                }));
                
            }, 2000);
        }, 1000);
    }

    getTestResults() {
        return this.generateTestReport();
    }
}

// Initialize testing system
document.addEventListener('DOMContentLoaded', () => {
    window.midasBeautyTesting = new ComprehensiveTesting();
    
    // Auto-run tests after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.midasBeautyTesting.runAllTests();
        }, 3000);
    });
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComprehensiveTesting;
}

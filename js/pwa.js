// Progressive Web App functionality for Midas Beauty

class MidasBeautyPWA {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.swRegistration = null;
        this.pushSubscription = null;
        this.notificationPermission = 'default';
        this.installPromptShown = false;
        this.version = '2.1.0';
        this.isOnline = navigator.onLine;
        this.performanceMetrics = {};

        this.init();
    }

    async init() {
        console.log('PWA: Initializing Enhanced PWA v' + this.version);

        // Register service worker
        await this.registerServiceWorker();

        // Setup install prompt
        this.setupInstallPrompt();

        // Setup update notifications
        this.setupUpdateNotifications();

        // Monitor connection status
        this.monitorConnection();

        // Setup background sync
        this.setupBackgroundSync();

        // Setup push notifications
        this.setupPushNotifications();

        // Setup install promotion
        this.setupInstallPromotion();

        // Setup performance monitoring
        this.setupPerformanceMonitoring();

        // Preload critical resources
        this.preloadCriticalResources();

        // Setup brand and product page caching
        this.setupDynamicCaching();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.swRegistration = await navigator.serviceWorker.register('/sw.js');
                console.log('PWA: Service Worker registered successfully');
                
                // Listen for updates
                this.swRegistration.addEventListener('updatefound', () => {
                    const newWorker = this.swRegistration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
                
            } catch (error) {
                console.error('PWA: Service Worker registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA: App installed successfully');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showInstallSuccessMessage();
        });

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
        }
    }

    showInstallButton() {
        // Create install button if it doesn't exist
        let installBtn = document.getElementById('pwa-install-btn');
        
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'pwa-install-btn';
            installBtn.innerHTML = `
                <i class="fas fa-download"></i>
                <span>Install App</span>
            `;
            
            // Add to header
            const headerIcons = document.querySelector('.header-icons');
            if (headerIcons) {
                headerIcons.appendChild(installBtn);
            }
        }

        installBtn.style.display = 'flex';
        installBtn.addEventListener('click', () => this.installApp());
    }

    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    async installApp() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('PWA: User accepted the install prompt');
        } else {
            console.log('PWA: User dismissed the install prompt');
        }
        
        this.deferredPrompt = null;
    }

    showInstallSuccessMessage() {
        this.showNotification('App installed successfully! You can now access Midas Beauty from your home screen.', 'success');
    }

    setupUpdateNotifications() {
        // Check for updates periodically
        if (this.swRegistration) {
            setInterval(() => {
                this.swRegistration.update();
            }, 60000); // Check every minute
        }
    }

    showUpdateNotification() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'pwa-update-banner';
        updateBanner.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>A new version is available!</span>
                <button onclick="midasPWA.updateApp()" class="update-btn">Update</button>
                <button onclick="this.parentElement.parentElement.remove()" class="dismiss-btn">×</button>
            </div>
        `;
        
        document.body.appendChild(updateBanner);
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (updateBanner.parentElement) {
                updateBanner.remove();
            }
        }, 10000);
    }

    updateApp() {
        if (this.swRegistration && this.swRegistration.waiting) {
            this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    monitorConnection() {
        // Update UI based on connection status
        const updateConnectionUI = () => {
            const isOnline = navigator.onLine;
            document.body.classList.toggle('offline', !isOnline);
            
            if (!isOnline) {
                this.showNotification('You are offline. Some features may be limited.', 'warning');
            }
        };

        window.addEventListener('online', () => {
            updateConnectionUI();
            this.showNotification('Connection restored!', 'success');
            this.syncOfflineData();
        });

        window.addEventListener('offline', updateConnectionUI);
        
        // Initial check
        updateConnectionUI();
    }

    setupBackgroundSync() {
        // Register background sync for search analytics and cart data
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                // Sync search analytics
                const syncSearchAnalytics = () => {
                    registration.sync.register('search-analytics-sync').catch(console.error);
                };

                // Sync cart data
                const syncCartData = () => {
                    registration.sync.register('cart-sync').catch(console.error);
                };

                // Sync when data changes
                window.addEventListener('beforeunload', () => {
                    syncSearchAnalytics();
                    syncCartData();
                });

                // Periodic sync
                setInterval(syncSearchAnalytics, 300000); // Every 5 minutes
            });
        }
    }

    async syncOfflineData() {
        try {
            // Sync any offline data when connection is restored
            console.log('PWA: Syncing offline data...');
            
            // Trigger background sync
            if (this.swRegistration) {
                await this.swRegistration.sync.register('search-analytics-sync');
                await this.swRegistration.sync.register('cart-sync');
            }
            
        } catch (error) {
            console.error('PWA: Error syncing offline data:', error);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `pwa-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="notification-close">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Public API methods
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }

    async subscribeToPushNotifications() {
        if (!this.swRegistration) return false;

        try {
            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY') // Replace with actual VAPID key
            });

            console.log('PWA: Push subscription successful:', subscription);
            return subscription;
        } catch (error) {
            console.error('PWA: Push subscription failed:', error);
            return false;
        }
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Enhanced PWA Features

    setupPushNotifications() {
        // Check if push notifications are supported
        if (!('PushManager' in window) || !('Notification' in window)) {
            console.log('PWA: Push notifications not supported');
            return;
        }

        // Check current permission status
        this.notificationPermission = Notification.permission;

        // Setup notification permission UI
        this.setupNotificationPermissionUI();

        // Auto-request permission for returning users
        if (this.isInstalled && this.notificationPermission === 'default') {
            setTimeout(() => this.requestNotificationPermission(), 5000);
        }
    }

    setupNotificationPermissionUI() {
        // Create notification permission banner
        if (this.notificationPermission === 'default' && !this.isInstalled) {
            const banner = document.createElement('div');
            banner.className = 'notification-permission-banner';
            banner.innerHTML = `
                <div class="banner-content">
                    <i class="fas fa-bell"></i>
                    <div class="banner-text">
                        <h4>Stay Updated</h4>
                        <p>Get notified about new products, sales, and beauty tips</p>
                    </div>
                    <div class="banner-actions">
                        <button onclick="midasPWA.requestNotificationPermission()" class="btn btn-primary">
                            Enable Notifications
                        </button>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn btn-secondary">
                            Maybe Later
                        </button>
                    </div>
                </div>
            `;

            // Add to page after a delay
            setTimeout(() => {
                document.body.appendChild(banner);
            }, 10000);
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission;

            if (permission === 'granted') {
                this.showNotification('Notifications enabled! You\'ll receive updates about new products and offers.', 'success');
                await this.subscribeToPushNotifications();

                // Remove permission banner
                const banner = document.querySelector('.notification-permission-banner');
                if (banner) banner.remove();
            } else {
                this.showNotification('Notifications disabled. You can enable them later in your browser settings.', 'info');
            }

            return permission === 'granted';
        }
        return false;
    }

    setupInstallPromotion() {
        // Smart install promotion based on user behavior
        let pageViews = parseInt(localStorage.getItem('midasBeautyPageViews') || '0');
        pageViews++;
        localStorage.setItem('midasBeautyPageViews', pageViews.toString());

        // Show install promotion after 3 page views
        if (pageViews >= 3 && !this.isInstalled && !this.installPromptShown) {
            setTimeout(() => this.showInstallPromotion(), 15000);
        }

        // Show install promotion on product pages
        if (window.location.pathname.includes('/product-details/') && !this.isInstalled) {
            setTimeout(() => this.showInstallPromotion(), 20000);
        }
    }

    showInstallPromotion() {
        if (this.installPromptShown || this.isInstalled) return;

        this.installPromptShown = true;

        const modal = document.createElement('div');
        modal.className = 'install-promotion-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
                <div class="modal-header">
                    <img src="/images/icons/icon-192x192.png" alt="Midas Beauty" class="modal-icon">
                    <h3>Install Midas Beauty</h3>
                </div>
                <div class="modal-body">
                    <p>Get the full Midas Beauty experience:</p>
                    <ul>
                        <li><i class="fas fa-check"></i> Faster loading times</li>
                        <li><i class="fas fa-check"></i> Offline browsing</li>
                        <li><i class="fas fa-check"></i> Push notifications for new products</li>
                        <li><i class="fas fa-check"></i> Home screen access</li>
                    </ul>
                </div>
                <div class="modal-actions">
                    <button onclick="midasPWA.installApp(); this.parentElement.parentElement.parentElement.remove();" class="btn btn-primary">
                        Install Now
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn btn-secondary">
                        Maybe Later
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 30000);
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vitals' in window) {
            // This would require the web-vitals library
            // For now, we'll use basic performance monitoring
        }

        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.performanceMetrics = {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                firstPaint: this.getFirstPaint(),
                timestamp: Date.now()
            };

            console.log('PWA: Performance metrics:', this.performanceMetrics);

            // Store performance data for analytics
            this.storePerformanceData();
        });
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : 0;
    }

    storePerformanceData() {
        // Store performance data in IndexedDB or send to analytics
        const perfHistory = JSON.parse(localStorage.getItem('midasBeautyPerformance') || '[]');
        perfHistory.push(this.performanceMetrics);

        // Keep only last 10 entries
        if (perfHistory.length > 10) {
            perfHistory.splice(0, perfHistory.length - 10);
        }

        localStorage.setItem('midasBeautyPerformance', JSON.stringify(perfHistory));
    }

    preloadCriticalResources() {
        // Preload critical images and resources
        const criticalImages = [
            '/images/hero-bg.jpg',
            '/images/logo.png',
            '/images/products/radiance-serum.jpg',
            '/images/products/hydrating-moisturizer.jpg'
        ];

        if (this.swRegistration) {
            this.swRegistration.active?.postMessage({
                type: 'PRELOAD_IMAGES',
                images: criticalImages
            });
        }

        // Preload critical CSS and JS
        this.preloadResource('/css/style.css', 'style');
        this.preloadResource('/js/products-database.js', 'script');
        this.preloadResource('/js/brands-categories-system.js', 'script');
    }

    preloadResource(href, as) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
    }

    setupDynamicCaching() {
        // Cache product and brand pages as user navigates
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check for new product or brand links
                    const newLinks = mutation.target.querySelectorAll('a[href*="/product-details/"], a[href*="/brands/"]');
                    newLinks.forEach(link => {
                        link.addEventListener('mouseenter', () => {
                            // Preload page on hover
                            this.preloadPage(link.href);
                        }, { once: true });
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Initial setup for existing links
        document.querySelectorAll('a[href*="/product-details/"], a[href*="/brands/"]').forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.preloadPage(link.href);
            }, { once: true });
        });
    }

    preloadPage(url) {
        if (this.swRegistration) {
            const message = url.includes('/product-details/') ?
                { type: 'CACHE_PRODUCT_PAGE', url } :
                { type: 'CACHE_BRAND_PAGE', url };

            this.swRegistration.active?.postMessage(message);
        }
    }

    // Enhanced background sync with specific data types
    async syncOfflineData() {
        try {
            console.log('PWA: Syncing offline data...');

            if (this.swRegistration) {
                // Sync different types of data
                await this.swRegistration.sync.register('cart-sync');
                await this.swRegistration.sync.register('analytics-sync');
                await this.swRegistration.sync.register('search-sync');

                this.showNotification('Data synchronized successfully!', 'success');
            }
        } catch (error) {
            console.error('PWA: Error syncing offline data:', error);
            this.showNotification('Failed to sync some data. Will retry automatically.', 'warning');
        }
    }

    // Public API for other modules
    async cacheProductPage(url) {
        if (this.swRegistration) {
            this.swRegistration.active?.postMessage({
                type: 'CACHE_PRODUCT_PAGE',
                url: url
            });
        }
    }

    async cacheBrandPage(url) {
        if (this.swRegistration) {
            this.swRegistration.active?.postMessage({
                type: 'CACHE_BRAND_PAGE',
                url: url
            });
        }
    }

    getPerformanceMetrics() {
        return this.performanceMetrics;
    }

    getInstallStatus() {
        return {
            isInstalled: this.isInstalled,
            canInstall: !!this.deferredPrompt,
            notificationPermission: this.notificationPermission
        };
    }
}

// Initialize PWA when DOM is loaded
let midasPWA;
document.addEventListener('DOMContentLoaded', () => {
    midasPWA = new MidasBeautyPWA();
});

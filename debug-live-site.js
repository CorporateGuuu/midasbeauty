// MidasBeauty Live Site Debugging & Fix Script
// Run this in browser console on https://midasbeauty.shop/ to diagnose and fix issues

class MidasBeautyDebugger {
    constructor() {
        this.issues = [];
        this.fixes = [];
        this.siteUrl = window.location.origin;
    }

    async runComprehensiveDiagnostics() {
        console.log('🔍 Starting MidasBeauty Live Site Diagnostics...\n');
        
        this.checkScriptLoading();
        this.checkAuth0Integration();
        this.checkProductDatabase();
        this.checkEcommerceFeatures();
        this.checkAdminFeatures();
        this.checkCSS();
        await this.checkNetworkRequests();
        
        this.generateReport();
        this.applyAutomaticFixes();
    }

    checkScriptLoading() {
        console.log('📜 Checking Script Loading...');
        
        const requiredScripts = [
            'js/product-database.js',
            'js/product-catalog-extended.js',
            'js/product-database-manager.js',
            'js/auth0-integration.js',
            'js/customer-dashboard.js',
            'js/admin-dashboard.js',
            'js/inventory-management.js',
            'js/header-functionality.js'
        ];

        const loadedScripts = Array.from(document.scripts).map(script => script.src);
        
        requiredScripts.forEach(script => {
            const isLoaded = loadedScripts.some(loaded => loaded.includes(script));
            if (isLoaded) {
                console.log(`✅ ${script} - Loaded`);
            } else {
                console.log(`❌ ${script} - Missing`);
                this.issues.push(`Script missing: ${script}`);
                this.fixes.push(`Add script tag: <script src="${script}"></script>`);
            }
        });

        // Check Auth0 SDK
        if (typeof createAuth0Client !== 'undefined') {
            console.log('✅ Auth0 SDK - Loaded');
        } else {
            console.log('❌ Auth0 SDK - Missing');
            this.issues.push('Auth0 SDK not loaded');
            this.fixes.push('Add Auth0 SDK: <script src="https://cdn.auth0.com/js/auth0-spa-js/2.1/auth0-spa-js.production.js"></script>');
        }
    }

    checkAuth0Integration() {
        console.log('\n🔐 Checking Auth0 Integration...');
        
        if (window.midasBeautyAuth) {
            console.log('✅ MidasBeautyAuth - Initialized');
            
            if (window.midasBeautyAuth.auth0Client) {
                console.log('✅ Auth0 Client - Connected');
            } else {
                console.log('❌ Auth0 Client - Not connected');
                this.issues.push('Auth0 client not initialized');
            }
        } else {
            console.log('❌ MidasBeautyAuth - Not initialized');
            this.issues.push('Auth0 integration not initialized');
            this.fixes.push('Check Auth0 configuration and domain settings');
        }

        // Check account link
        const accountLink = document.getElementById('account-link');
        if (accountLink) {
            console.log('✅ Account Link - Found');
        } else {
            console.log('❌ Account Link - Missing');
            this.issues.push('Account link element missing');
        }
    }

    checkProductDatabase() {
        console.log('\n🛍️ Checking Product Database...');
        
        if (window.MidasBeautyProductDatabase) {
            console.log('✅ Product Database Class - Loaded');
        } else {
            console.log('❌ Product Database Class - Missing');
            this.issues.push('Product database class not loaded');
        }

        if (window.productDatabaseManager) {
            console.log('✅ Product Database Manager - Initialized');
            
            try {
                const products = window.productDatabaseManager.getAllProducts();
                console.log(`✅ Products Loaded - ${products.length} products`);
                
                if (products.length >= 50) {
                    console.log('✅ Product Count - Sufficient (50+)');
                } else {
                    console.log(`⚠️ Product Count - Low (${products.length})`);
                    this.issues.push(`Only ${products.length} products loaded, expected 50+`);
                }

                const brands = window.productDatabaseManager.database?.brands;
                if (brands && brands.length >= 15) {
                    console.log(`✅ Brands Loaded - ${brands.length} brands`);
                } else {
                    console.log(`❌ Brands - Insufficient (${brands?.length || 0})`);
                    this.issues.push('Insufficient brands loaded');
                }
            } catch (error) {
                console.log('❌ Product Database - Error accessing data');
                this.issues.push('Product database error: ' + error.message);
            }
        } else {
            console.log('❌ Product Database Manager - Not initialized');
            this.issues.push('Product database manager not initialized');
        }
    }

    checkEcommerceFeatures() {
        console.log('\n🛒 Checking E-commerce Features...');
        
        // Check cart functionality
        const cartToggle = document.getElementById('cart-toggle');
        const cartSidebar = document.getElementById('cart-sidebar');
        
        if (cartToggle && cartSidebar) {
            console.log('✅ Cart Elements - Found');
        } else {
            console.log('❌ Cart Elements - Missing');
            this.issues.push('Cart elements missing');
        }

        // Check wishlist
        const wishlistToggle = document.getElementById('wishlist-toggle');
        if (wishlistToggle) {
            console.log('✅ Wishlist Toggle - Found');
        } else {
            console.log('❌ Wishlist Toggle - Missing');
            this.issues.push('Wishlist toggle missing');
        }

        // Check search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            console.log('✅ Search Input - Found');
        } else {
            console.log('❌ Search Input - Missing');
            this.issues.push('Search input missing');
        }

        // Check customer dashboard
        if (window.customerDashboard) {
            console.log('✅ Customer Dashboard - Loaded');
        } else {
            console.log('❌ Customer Dashboard - Missing');
            this.issues.push('Customer dashboard not loaded');
        }
    }

    checkAdminFeatures() {
        console.log('\n⚙️ Checking Admin Features...');
        
        if (window.adminDashboard) {
            console.log('✅ Admin Dashboard - Loaded');
        } else {
            console.log('❌ Admin Dashboard - Missing');
            this.issues.push('Admin dashboard not loaded');
        }

        if (window.inventoryManager) {
            console.log('✅ Inventory Manager - Loaded');
        } else {
            console.log('❌ Inventory Manager - Missing');
            this.issues.push('Inventory manager not loaded');
        }
    }

    checkCSS() {
        console.log('\n🎨 Checking CSS Files...');
        
        const requiredCSS = [
            'css/header-redesign.css',
            'css/customer-dashboard.css',
            'css/admin-dashboard.css',
            'css/inventory-system.css',
            'css/product-recommendations.css'
        ];

        const loadedCSS = Array.from(document.styleSheets).map(sheet => sheet.href);
        
        requiredCSS.forEach(css => {
            const isLoaded = loadedCSS.some(loaded => loaded && loaded.includes(css));
            if (isLoaded) {
                console.log(`✅ ${css} - Loaded`);
            } else {
                console.log(`❌ ${css} - Missing`);
                this.issues.push(`CSS missing: ${css}`);
            }
        });
    }

    async checkNetworkRequests() {
        console.log('\n🌐 Checking Network Requests...');
        
        const testUrls = [
            '/js/product-database.js',
            '/js/auth0-integration.js',
            '/css/header-redesign.css'
        ];

        for (const url of testUrls) {
            try {
                const response = await fetch(this.siteUrl + url, { method: 'HEAD' });
                if (response.ok) {
                    console.log(`✅ ${url} - Accessible (${response.status})`);
                } else {
                    console.log(`❌ ${url} - Error (${response.status})`);
                    this.issues.push(`File not accessible: ${url} (${response.status})`);
                }
            } catch (error) {
                console.log(`❌ ${url} - Network Error`);
                this.issues.push(`Network error for: ${url}`);
            }
        }
    }

    generateReport() {
        console.log('\n📊 DIAGNOSTIC REPORT');
        console.log('===================');
        
        if (this.issues.length === 0) {
            console.log('🎉 All systems operational!');
            return;
        }

        console.log(`\n❌ Issues Found: ${this.issues.length}`);
        this.issues.forEach((issue, index) => {
            console.log(`${index + 1}. ${issue}`);
        });

        console.log('\n🔧 Recommended Fixes:');
        this.fixes.forEach((fix, index) => {
            console.log(`${index + 1}. ${fix}`);
        });

        console.log('\n📋 Next Steps:');
        console.log('1. Update index.html with missing script tags');
        console.log('2. Verify Auth0 configuration in dashboard');
        console.log('3. Check file paths and accessibility');
        console.log('4. Clear browser cache and reload');
        console.log('5. Run applyAutomaticFixes() for immediate fixes');
    }

    applyAutomaticFixes() {
        console.log('\n🔧 Applying Automatic Fixes...');
        
        // Fix 1: Initialize missing systems
        this.initializeMissingSystems();
        
        // Fix 2: Load missing scripts dynamically
        this.loadMissingScripts();
        
        // Fix 3: Setup event handlers
        this.setupEventHandlers();
        
        console.log('✅ Automatic fixes applied. Reload page to see full effects.');
    }

    initializeMissingSystems() {
        // Initialize product database if missing
        if (!window.productDatabaseManager && window.MidasBeautyProductDatabase) {
            try {
                window.productDatabaseManager = new window.MidasBeautyProductDatabase();
                console.log('✅ Product database manager initialized');
            } catch (error) {
                console.log('❌ Failed to initialize product database:', error);
            }
        }

        // Initialize Auth0 if missing
        if (!window.midasBeautyAuth && typeof createAuth0Client !== 'undefined' && window.MidasBeautyAuth) {
            try {
                window.midasBeautyAuth = new window.MidasBeautyAuth();
                console.log('✅ Auth0 integration initialized');
            } catch (error) {
                console.log('❌ Failed to initialize Auth0:', error);
            }
        }
    }

    loadMissingScripts() {
        const missingScripts = [
            'js/product-database.js',
            'js/auth0-integration.js',
            'js/customer-dashboard.js'
        ];

        missingScripts.forEach(script => {
            if (!Array.from(document.scripts).some(s => s.src.includes(script))) {
                const scriptElement = document.createElement('script');
                scriptElement.src = script;
                scriptElement.onload = () => console.log(`✅ Loaded: ${script}`);
                scriptElement.onerror = () => console.log(`❌ Failed to load: ${script}`);
                document.head.appendChild(scriptElement);
            }
        });
    }

    setupEventHandlers() {
        // Setup account link if missing
        const accountLink = document.getElementById('account-link');
        if (accountLink && !accountLink.onclick) {
            accountLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.midasBeautyAuth) {
                    if (window.midasBeautyAuth.isAuthenticated) {
                        // Show customer dashboard
                        if (window.customerDashboard) {
                            window.customerDashboard.showDashboard();
                        }
                    } else {
                        window.midasBeautyAuth.login();
                    }
                } else {
                    console.log('Auth0 not initialized');
                }
            });
            console.log('✅ Account link event handler added');
        }
    }

    // Quick fix methods
    fixAuth0() {
        console.log('🔧 Attempting Auth0 fix...');
        
        if (typeof createAuth0Client === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.auth0.com/js/auth0-spa-js/2.1/auth0-spa-js.production.js';
            script.onload = () => {
                console.log('✅ Auth0 SDK loaded');
                this.initializeMissingSystems();
            };
            document.head.appendChild(script);
        }
    }

    fixProductDatabase() {
        console.log('🔧 Attempting Product Database fix...');
        
        if (!window.productDatabaseManager) {
            const scripts = [
                'js/product-database.js',
                'js/product-catalog-extended.js',
                'js/product-database-manager.js'
            ];
            
            scripts.forEach((script, index) => {
                setTimeout(() => {
                    const scriptElement = document.createElement('script');
                    scriptElement.src = script;
                    scriptElement.onload = () => {
                        console.log(`✅ Loaded: ${script}`);
                        if (index === scripts.length - 1) {
                            setTimeout(() => this.initializeMissingSystems(), 1000);
                        }
                    };
                    document.head.appendChild(scriptElement);
                }, index * 500);
            });
        }
    }

    // Test specific features
    testProductSearch() {
        if (window.productDatabaseManager) {
            const results = window.productDatabaseManager.searchProducts('serum');
            console.log(`🔍 Search test: Found ${results.length} products for "serum"`);
            return results;
        } else {
            console.log('❌ Product database not available for search test');
            return [];
        }
    }

    testAuth0Login() {
        if (window.midasBeautyAuth) {
            console.log('🔐 Testing Auth0 login...');
            window.midasBeautyAuth.login();
        } else {
            console.log('❌ Auth0 not available for login test');
        }
    }
}

// Auto-initialize debugger
window.midasDebugger = new MidasBeautyDebugger();

// Add helpful console commands
console.log('🚀 MidasBeauty Debugger Loaded!');
console.log('');
console.log('Available Commands:');
console.log('• midasDebugger.runComprehensiveDiagnostics() - Full diagnostic');
console.log('• midasDebugger.fixAuth0() - Fix Auth0 issues');
console.log('• midasDebugger.fixProductDatabase() - Fix product database');
console.log('• midasDebugger.testProductSearch() - Test search functionality');
console.log('• midasDebugger.testAuth0Login() - Test login functionality');
console.log('');
console.log('Run: midasDebugger.runComprehensiveDiagnostics()');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MidasBeautyDebugger;
}

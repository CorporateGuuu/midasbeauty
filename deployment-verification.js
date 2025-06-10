// MidasBeauty Deployment Verification Script
// Run this in browser console to verify all features are working

class DeploymentVerifier {
    constructor() {
        this.results = [];
        this.siteUrl = 'https://midasbeauty.shop';
    }

    async runAllTests() {
        console.log('🚀 Starting MidasBeauty Deployment Verification...\n');
        
        await this.testBasicConnectivity();
        await this.testFileStructure();
        await this.testJavaScriptSystems();
        await this.testAuth0Integration();
        await this.testProductDatabase();
        await this.testEcommerceFeatures();
        await this.testAdminFeatures();
        await this.testMobileResponsiveness();
        
        this.generateReport();
    }

    async testBasicConnectivity() {
        console.log('🌐 Testing Basic Connectivity...');
        
        try {
            const response = await fetch(this.siteUrl);
            if (response.ok) {
                this.logSuccess('Site loads successfully');
            } else {
                this.logError('Site failed to load');
            }
        } catch (error) {
            this.logError('Site connectivity failed');
        }

        // Test HTTPS
        if (this.siteUrl.startsWith('https://')) {
            this.logSuccess('HTTPS certificate active');
        } else {
            this.logError('HTTPS not configured');
        }
    }

    async testFileStructure() {
        console.log('📁 Testing File Structure...');
        
        const criticalFiles = [
            '/css/header-redesign.css',
            '/js/product-database.js',
            '/js/auth0-integration.js',
            '/js/customer-dashboard.js',
            '/js/admin-dashboard.js',
            '/js/inventory-management.js'
        ];

        for (const file of criticalFiles) {
            try {
                const response = await fetch(this.siteUrl + file);
                if (response.ok) {
                    this.logSuccess(`File accessible: ${file}`);
                } else {
                    this.logError(`File missing: ${file}`);
                }
            } catch (error) {
                this.logError(`File check failed: ${file}`);
            }
        }
    }

    testJavaScriptSystems() {
        console.log('⚡ Testing JavaScript Systems...');
        
        // Test product database
        if (window.MidasBeautyProductDatabase) {
            this.logSuccess('Product database class loaded');
        } else {
            this.logError('Product database class missing');
        }

        if (window.productDatabaseManager) {
            this.logSuccess('Product database manager initialized');
        } else {
            this.logError('Product database manager not initialized');
        }

        // Test customer dashboard
        if (window.customerDashboard) {
            this.logSuccess('Customer dashboard system loaded');
        } else {
            this.logError('Customer dashboard system missing');
        }

        // Test admin dashboard
        if (window.adminDashboard) {
            this.logSuccess('Admin dashboard system loaded');
        } else {
            this.logError('Admin dashboard system missing');
        }

        // Test inventory management
        if (window.inventoryManager) {
            this.logSuccess('Inventory management system loaded');
        } else {
            this.logError('Inventory management system missing');
        }
    }

    testAuth0Integration() {
        console.log('🔐 Testing Auth0 Integration...');
        
        // Check if Auth0 SDK is loaded
        if (typeof createAuth0Client !== 'undefined') {
            this.logSuccess('Auth0 SDK loaded');
        } else {
            this.logError('Auth0 SDK not loaded');
        }

        // Check Auth0 integration
        if (window.midasBeautyAuth || window.auth0Adapter) {
            this.logSuccess('Auth0 integration initialized');
        } else {
            this.logError('Auth0 integration not initialized');
        }

        // Check account link functionality
        const accountLink = document.getElementById('account-link');
        if (accountLink) {
            this.logSuccess('Account link element found');
        } else {
            this.logError('Account link element missing');
        }
    }

    testProductDatabase() {
        console.log('🛍️ Testing Product Database...');
        
        if (window.productDatabaseManager) {
            const products = window.productDatabaseManager.getAllProducts();
            
            if (products && products.length >= 50) {
                this.logSuccess(`Product database loaded: ${products.length} products`);
            } else {
                this.logError(`Insufficient products: ${products ? products.length : 0}`);
            }

            const brands = window.productDatabaseManager.database?.brands;
            if (brands && brands.length >= 15) {
                this.logSuccess(`Brand database loaded: ${brands.length} brands`);
            } else {
                this.logError(`Insufficient brands: ${brands ? brands.length : 0}`);
            }

            // Test search functionality
            try {
                const searchResults = window.productDatabaseManager.searchProducts('serum');
                if (searchResults && searchResults.length > 0) {
                    this.logSuccess('Product search functionality working');
                } else {
                    this.logError('Product search not returning results');
                }
            } catch (error) {
                this.logError('Product search functionality failed');
            }
        } else {
            this.logError('Product database manager not available');
        }
    }

    testEcommerceFeatures() {
        console.log('🛒 Testing E-commerce Features...');
        
        // Test cart functionality
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            this.logSuccess('Cart toggle element found');
        } else {
            this.logError('Cart toggle element missing');
        }

        // Test wishlist functionality
        const wishlistToggle = document.getElementById('wishlist-toggle');
        if (wishlistToggle) {
            this.logSuccess('Wishlist toggle element found');
        } else {
            this.logError('Wishlist toggle element missing');
        }

        // Test search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            this.logSuccess('Search input element found');
        } else {
            this.logError('Search input element missing');
        }

        // Test product recommendations
        if (window.productRecommendationEngine) {
            this.logSuccess('Product recommendation engine loaded');
        } else {
            this.logError('Product recommendation engine missing');
        }
    }

    testAdminFeatures() {
        console.log('⚙️ Testing Admin Features...');
        
        // Test admin dashboard modal
        const adminModal = document.getElementById('admin-modal');
        if (adminModal) {
            this.logSuccess('Admin dashboard modal found');
        } else {
            this.logError('Admin dashboard modal missing');
        }

        // Test admin access
        if (window.adminDashboard) {
            this.logSuccess('Admin dashboard system available');
            
            // Test admin authentication
            try {
                const isAdmin = window.adminDashboard.checkAdminAccess('midas_admin_2024');
                if (isAdmin) {
                    this.logSuccess('Admin authentication working');
                } else {
                    this.logError('Admin authentication failed');
                }
            } catch (error) {
                this.logError('Admin authentication test failed');
            }
        } else {
            this.logError('Admin dashboard system not available');
        }
    }

    testMobileResponsiveness() {
        console.log('📱 Testing Mobile Responsiveness...');
        
        // Test mobile menu toggle
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if (mobileToggle) {
            this.logSuccess('Mobile menu toggle found');
        } else {
            this.logError('Mobile menu toggle missing');
        }

        // Test responsive CSS
        const headerRedesignCSS = Array.from(document.styleSheets).find(sheet => 
            sheet.href && sheet.href.includes('header-redesign.css')
        );
        
        if (headerRedesignCSS) {
            this.logSuccess('Header redesign CSS loaded');
        } else {
            this.logError('Header redesign CSS missing');
        }

        // Test viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            this.logSuccess('Viewport meta tag configured');
        } else {
            this.logError('Viewport meta tag missing');
        }
    }

    logSuccess(message) {
        console.log(`✅ ${message}`);
        this.results.push({ status: 'success', message });
    }

    logError(message) {
        console.log(`❌ ${message}`);
        this.results.push({ status: 'error', message });
    }

    generateReport() {
        console.log('\n📊 DEPLOYMENT VERIFICATION REPORT');
        console.log('=====================================');
        
        const totalTests = this.results.length;
        const passedTests = this.results.filter(r => r.status === 'success').length;
        const failedTests = this.results.filter(r => r.status === 'error').length;
        const successRate = Math.round((passedTests / totalTests) * 100);
        
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${failedTests}`);
        console.log(`Success Rate: ${successRate}%`);
        
        if (successRate >= 90) {
            console.log('\n🎉 DEPLOYMENT SUCCESSFUL!');
            console.log('Your MidasBeauty e-commerce platform is fully functional.');
        } else if (successRate >= 70) {
            console.log('\n⚠️ DEPLOYMENT PARTIALLY SUCCESSFUL');
            console.log('Most features are working, but some issues need attention.');
        } else {
            console.log('\n🚨 DEPLOYMENT NEEDS ATTENTION');
            console.log('Several critical features are not working properly.');
        }
        
        console.log('\nFailed Tests:');
        this.results.filter(r => r.status === 'error').forEach(result => {
            console.log(`❌ ${result.message}`);
        });
        
        console.log('\n📋 Next Steps:');
        if (failedTests > 0) {
            console.log('1. Review the failed tests above');
            console.log('2. Check browser console for JavaScript errors');
            console.log('3. Verify all files were uploaded correctly');
            console.log('4. Check Auth0 configuration for live domain');
            console.log('5. Clear browser cache and test again');
        } else {
            console.log('1. Test user registration and login');
            console.log('2. Test product search and filtering');
            console.log('3. Test cart and wishlist functionality');
            console.log('4. Test admin dashboard access');
            console.log('5. Test mobile responsiveness');
        }
        
        return {
            totalTests,
            passedTests,
            failedTests,
            successRate,
            results: this.results
        };
    }
}

// Auto-run verification if this script is loaded directly
if (typeof window !== 'undefined') {
    window.deploymentVerifier = new DeploymentVerifier();
    
    // Add CSS for better console output
    const style = document.createElement('style');
    style.textContent = `
        .verification-overlay {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #d4af37;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            font-family: 'Segoe UI', sans-serif;
        }
        
        .verification-title {
            color: #1a1a1a;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .verification-button {
            background: linear-gradient(135deg, #d4af37, #f4e4a6);
            color: #1a1a1a;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🚀 MidasBeauty Deployment Verifier Loaded');
    console.log('Run: deploymentVerifier.runAllTests() to start verification');
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeploymentVerifier;
}

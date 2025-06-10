// Product Database Manager for MidasBeauty
// Handles product data integration, search, filtering, and management

class ProductDatabaseManager {
    constructor() {
        this.database = null;
        this.searchIndex = new Map();
        this.filterCache = new Map();
        this.init();
    }

    async init() {
        // Initialize main database
        if (window.MidasBeautyProductDatabase) {
            this.database = new window.MidasBeautyProductDatabase();
        } else {
            console.error('MidasBeautyProductDatabase not found');
            return;
        }

        // Load extended products if available
        await this.loadExtendedProducts();
        
        // Build search and filter indices
        this.buildSearchIndex();
        this.buildFilterIndex();
        
        // Integrate with existing systems
        this.integrateWithInventorySystem();
        this.integrateWithRecommendationEngine();
        
        console.log('Product Database Manager initialized');
        console.log(`Total products: ${this.getAllProducts().length}`);
    }

    async loadExtendedProducts() {
        try {
            // Load extended product catalog
            if (window.extendedProductCatalog) {
                window.extendedProductCatalog.forEach(product => {
                    this.database.products.push(product);
                });
            }

            if (window.haircareProducts) {
                window.haircareProducts.forEach(product => {
                    this.database.products.push(product);
                });
            }

            if (window.fragranceProducts) {
                window.fragranceProducts.forEach(product => {
                    this.database.products.push(product);
                });
            }

            // Save updated database
            this.database.saveToStorage();
            
        } catch (error) {
            console.error('Error loading extended products:', error);
        }
    }

    // PRODUCT RETRIEVAL METHODS

    getAllProducts() {
        return this.database ? this.database.products : [];
    }

    getProductById(productId) {
        return this.database ? this.database.getProductById(productId) : null;
    }

    getProductsByBrand(brandId) {
        return this.database ? this.database.getProductsByBrand(brandId) : [];
    }

    getProductsByCategory(categoryId) {
        return this.database ? this.database.getProductsByCategory(categoryId) : [];
    }

    getProductsBySubcategory(subcategoryId) {
        return this.database ? this.database.getProductsBySubcategory(subcategoryId) : [];
    }

    getFeaturedProducts(limit = 12) {
        const featured = this.database ? this.database.getFeaturedProducts() : [];
        return limit ? featured.slice(0, limit) : featured;
    }

    getBestSellers(limit = 8) {
        const bestSellers = this.getAllProducts().filter(product => product.bestSeller);
        return limit ? bestSellers.slice(0, limit) : bestSellers;
    }

    getNewArrivals(limit = 8) {
        const newArrivals = this.getAllProducts().filter(product => product.newArrival);
        return limit ? newArrivals.slice(0, limit) : newArrivals;
    }

    getProductsOnSale(limit = null) {
        const onSale = this.database ? this.database.getProductsOnSale() : [];
        return limit ? onSale.slice(0, limit) : onSale;
    }

    // ADVANCED SEARCH AND FILTERING

    searchProducts(query, filters = {}) {
        if (!query && Object.keys(filters).length === 0) {
            return this.getAllProducts();
        }

        let results = this.getAllProducts();

        // Text search
        if (query) {
            const searchTerm = query.toLowerCase();
            results = results.filter(product => 
                this.searchIndex.get(product.id)?.includes(searchTerm)
            );
        }

        // Apply filters
        results = this.applyFilters(results, filters);

        return results;
    }

    applyFilters(products, filters) {
        let filtered = [...products];

        // Brand filter
        if (filters.brands && filters.brands.length > 0) {
            filtered = filtered.filter(product => 
                filters.brands.includes(product.brand)
            );
        }

        // Category filter
        if (filters.categories && filters.categories.length > 0) {
            filtered = filtered.filter(product => 
                filters.categories.includes(product.category)
            );
        }

        // Price range filter
        if (filters.priceRange) {
            const { min, max } = filters.priceRange;
            filtered = filtered.filter(product => {
                const price = product.salePrice || product.price;
                return price >= min && price <= max;
            });
        }

        // Rating filter
        if (filters.minRating) {
            filtered = filtered.filter(product => 
                product.rating >= filters.minRating
            );
        }

        // Skin type filter
        if (filters.skinTypes && filters.skinTypes.length > 0) {
            filtered = filtered.filter(product => 
                product.skinType && 
                filters.skinTypes.some(type => product.skinType.includes(type))
            );
        }

        // Concerns filter
        if (filters.concerns && filters.concerns.length > 0) {
            filtered = filtered.filter(product => 
                product.concerns && 
                filters.concerns.some(concern => product.concerns.includes(concern))
            );
        }

        // Availability filter
        if (filters.inStock) {
            filtered = filtered.filter(product => product.stock > 0);
        }

        // Sort results
        if (filters.sortBy) {
            filtered = this.sortProducts(filtered, filters.sortBy);
        }

        return filtered;
    }

    sortProducts(products, sortBy) {
        const sorted = [...products];

        switch (sortBy) {
            case 'price_low':
                return sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
            case 'price_high':
                return sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            case 'popular':
                return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return sorted;
        }
    }

    // PRODUCT RECOMMENDATIONS

    getRelatedProducts(productId, limit = 4) {
        const product = this.getProductById(productId);
        if (!product) return [];

        // Get products from same brand or category
        let related = this.getAllProducts().filter(p => 
            p.id !== productId && (
                p.brand === product.brand || 
                p.category === product.category ||
                p.subcategory === product.subcategory
            )
        );

        // Sort by rating and limit
        related = related.sort((a, b) => b.rating - a.rating);
        return related.slice(0, limit);
    }

    getComplementaryProducts(productId, limit = 4) {
        const product = this.getProductById(productId);
        if (!product) return [];

        // Logic for complementary products based on category
        let complementary = [];

        if (product.category === 'skincare') {
            // For skincare, suggest products from different subcategories
            complementary = this.getAllProducts().filter(p => 
                p.category === 'skincare' && 
                p.subcategory !== product.subcategory &&
                p.id !== productId
            );
        } else if (product.category === 'makeup') {
            // For makeup, suggest complementary makeup items
            complementary = this.getAllProducts().filter(p => 
                p.category === 'makeup' && 
                p.subcategory !== product.subcategory &&
                p.id !== productId
            );
        }

        return complementary.slice(0, limit);
    }

    // INVENTORY INTEGRATION

    updateProductStock(productId, quantity) {
        return this.database ? this.database.updateProductStock(productId, quantity) : false;
    }

    getStockStatus(productId) {
        const product = this.getProductById(productId);
        if (!product) return 'unavailable';

        if (product.stock === 0) return 'out_of_stock';
        if (product.stock <= 5) return 'low_stock';
        if (product.stock <= 10) return 'limited_stock';
        return 'in_stock';
    }

    getLowStockProducts(threshold = 10) {
        return this.getAllProducts().filter(product => 
            product.stock > 0 && product.stock <= threshold
        );
    }

    getOutOfStockProducts() {
        return this.getAllProducts().filter(product => product.stock === 0);
    }

    // ANALYTICS AND INSIGHTS

    getBrandAnalytics() {
        const brands = {};
        this.getAllProducts().forEach(product => {
            if (!brands[product.brand]) {
                brands[product.brand] = {
                    productCount: 0,
                    totalValue: 0,
                    avgRating: 0,
                    totalReviews: 0
                };
            }
            brands[product.brand].productCount++;
            brands[product.brand].totalValue += product.price;
            brands[product.brand].totalReviews += product.reviewCount;
        });

        // Calculate averages
        Object.keys(brands).forEach(brandId => {
            const brand = brands[brandId];
            brand.avgPrice = brand.totalValue / brand.productCount;
            brand.avgRating = this.getProductsByBrand(brandId)
                .reduce((sum, p) => sum + p.rating, 0) / brand.productCount;
        });

        return brands;
    }

    getCategoryAnalytics() {
        const categories = {};
        this.getAllProducts().forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = {
                    productCount: 0,
                    totalValue: 0,
                    avgRating: 0
                };
            }
            categories[product.category].productCount++;
            categories[product.category].totalValue += product.price;
        });

        // Calculate averages
        Object.keys(categories).forEach(categoryId => {
            const category = categories[categoryId];
            category.avgPrice = category.totalValue / category.productCount;
            category.avgRating = this.getProductsByCategory(categoryId)
                .reduce((sum, p) => sum + p.rating, 0) / category.productCount;
        });

        return categories;
    }

    // UTILITY METHODS

    buildSearchIndex() {
        this.getAllProducts().forEach(product => {
            const brand = this.database.getBrandById(product.brand);
            const searchText = [
                product.name,
                product.description,
                product.keyBenefits.join(' '),
                brand?.name || '',
                product.category,
                product.subcategory,
                product.ingredients?.join(' ') || '',
                product.concerns?.join(' ') || ''
            ].join(' ').toLowerCase();
            
            this.searchIndex.set(product.id, searchText);
        });
    }

    buildFilterIndex() {
        // Build indices for faster filtering
        const products = this.getAllProducts();
        
        this.filterCache.set('brands', [...new Set(products.map(p => p.brand))]);
        this.filterCache.set('categories', [...new Set(products.map(p => p.category))]);
        this.filterCache.set('subcategories', [...new Set(products.map(p => p.subcategory))]);
        this.filterCache.set('skinTypes', [...new Set(products.flatMap(p => p.skinType || []))]);
        this.filterCache.set('concerns', [...new Set(products.flatMap(p => p.concerns || []))]);
        
        const prices = products.map(p => p.salePrice || p.price);
        this.filterCache.set('priceRange', {
            min: Math.min(...prices),
            max: Math.max(...prices)
        });
    }

    getFilterOptions() {
        return {
            brands: this.filterCache.get('brands') || [],
            categories: this.filterCache.get('categories') || [],
            subcategories: this.filterCache.get('subcategories') || [],
            skinTypes: this.filterCache.get('skinTypes') || [],
            concerns: this.filterCache.get('concerns') || [],
            priceRange: this.filterCache.get('priceRange') || { min: 0, max: 500 }
        };
    }

    // INTEGRATION METHODS

    integrateWithInventorySystem() {
        if (window.inventoryManager) {
            // Sync product data with inventory system
            window.inventoryManager.setProductDatabase(this);
        }
    }

    integrateWithRecommendationEngine() {
        if (window.productRecommendationEngine) {
            // Provide product data to recommendation engine
            window.productRecommendationEngine.setProductDatabase(this);
        }
    }

    // EXPORT/IMPORT METHODS

    exportProductData() {
        return {
            products: this.getAllProducts(),
            brands: this.database.brands,
            categories: this.database.categories,
            analytics: {
                brands: this.getBrandAnalytics(),
                categories: this.getCategoryAnalytics()
            },
            exportDate: new Date().toISOString()
        };
    }

    importProductData(data) {
        if (this.database) {
            return this.database.importData(data);
        }
        return false;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.productDatabaseManager = new ProductDatabaseManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductDatabaseManager;
}

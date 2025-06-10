// Real-Time Inventory Tracking System for MidasBeauty
// Handles stock levels, low-stock alerts, and inventory management

class InventoryManager {
    constructor() {
        this.inventory = this.loadInventory();
        this.lowStockThreshold = 5;
        this.criticalStockThreshold = 2;
        this.stockUpdateCallbacks = [];
        this.init();
    }

    init() {
        this.initializeInventoryData();
        this.setupInventoryDisplay();
        this.setupStockAlerts();
        this.setupInventoryTracking();
        this.startInventoryMonitoring();
    }

    initializeInventoryData() {
        // Initialize inventory for all products if not exists
        if (Object.keys(this.inventory).length === 0) {
            const products = this.getAllProducts();
            products.forEach(product => {
                if (!this.inventory[product.id]) {
                    this.inventory[product.id] = {
                        productId: product.id,
                        productName: product.name,
                        category: product.category,
                        brand: product.brand,
                        currentStock: this.generateRandomStock(),
                        reservedStock: 0,
                        availableStock: 0,
                        lowStockThreshold: this.lowStockThreshold,
                        criticalStockThreshold: this.criticalStockThreshold,
                        lastUpdated: new Date().toISOString(),
                        stockHistory: [],
                        autoReorderEnabled: true,
                        reorderPoint: 10,
                        reorderQuantity: 50
                    };
                }
                this.updateAvailableStock(product.id);
            });
            this.saveInventory();
        }
    }

    generateRandomStock() {
        // Generate realistic stock levels for demo
        const stockRanges = {
            high: [20, 100],
            medium: [5, 20],
            low: [0, 5]
        };
        
        const probability = Math.random();
        let range;
        
        if (probability < 0.7) range = stockRanges.high;
        else if (probability < 0.9) range = stockRanges.medium;
        else range = stockRanges.low;
        
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }

    // Stock Level Management
    getStockLevel(productId) {
        return this.inventory[productId] || null;
    }

    updateStock(productId, quantity, reason = 'manual', orderId = null) {
        if (!this.inventory[productId]) {
            console.error(`Product ${productId} not found in inventory`);
            return false;
        }

        const oldStock = this.inventory[productId].currentStock;
        this.inventory[productId].currentStock = Math.max(0, quantity);
        this.updateAvailableStock(productId);
        
        // Record stock history
        this.addStockHistoryEntry(productId, {
            oldStock,
            newStock: this.inventory[productId].currentStock,
            change: this.inventory[productId].currentStock - oldStock,
            reason,
            orderId,
            timestamp: new Date().toISOString()
        });

        this.inventory[productId].lastUpdated = new Date().toISOString();
        this.saveInventory();
        
        // Trigger callbacks
        this.notifyStockUpdate(productId);
        
        // Check for low stock alerts
        this.checkLowStockAlert(productId);
        
        return true;
    }

    adjustStock(productId, adjustment, reason = 'adjustment') {
        if (!this.inventory[productId]) return false;
        
        const newStock = this.inventory[productId].currentStock + adjustment;
        return this.updateStock(productId, newStock, reason);
    }

    reserveStock(productId, quantity, orderId) {
        if (!this.inventory[productId]) return false;
        
        const available = this.inventory[productId].availableStock;
        if (available < quantity) return false;
        
        this.inventory[productId].reservedStock += quantity;
        this.updateAvailableStock(productId);
        this.saveInventory();
        
        this.addStockHistoryEntry(productId, {
            action: 'reserve',
            quantity,
            orderId,
            timestamp: new Date().toISOString()
        });
        
        return true;
    }

    releaseStock(productId, quantity, orderId) {
        if (!this.inventory[productId]) return false;
        
        this.inventory[productId].reservedStock = Math.max(0, 
            this.inventory[productId].reservedStock - quantity);
        this.updateAvailableStock(productId);
        this.saveInventory();
        
        this.addStockHistoryEntry(productId, {
            action: 'release',
            quantity,
            orderId,
            timestamp: new Date().toISOString()
        });
        
        return true;
    }

    updateAvailableStock(productId) {
        if (!this.inventory[productId]) return;
        
        this.inventory[productId].availableStock = 
            this.inventory[productId].currentStock - this.inventory[productId].reservedStock;
    }

    // Stock Status Display
    getStockStatus(productId) {
        const stock = this.getStockLevel(productId);
        if (!stock) return { status: 'unknown', message: 'Stock information unavailable', class: 'stock-unknown' };
        
        const available = stock.availableStock;
        
        if (available <= 0) {
            return {
                status: 'out_of_stock',
                message: 'Out of Stock',
                class: 'stock-out',
                urgency: 'high'
            };
        } else if (available <= stock.criticalStockThreshold) {
            return {
                status: 'critical_stock',
                message: `Only ${available} left in stock!`,
                class: 'stock-critical',
                urgency: 'high'
            };
        } else if (available <= stock.lowStockThreshold) {
            return {
                status: 'low_stock',
                message: `Low stock - Only ${available} left`,
                class: 'stock-low',
                urgency: 'medium'
            };
        } else if (available <= 10) {
            return {
                status: 'limited_stock',
                message: `${available} in stock`,
                class: 'stock-limited',
                urgency: 'low'
            };
        } else {
            return {
                status: 'in_stock',
                message: 'In Stock',
                class: 'stock-available',
                urgency: 'none'
            };
        }
    }

    setupInventoryDisplay() {
        // Add stock indicators to product cards
        this.updateAllProductStockDisplays();
        
        // Setup real-time updates
        this.onStockUpdate((productId) => {
            this.updateProductStockDisplay(productId);
        });
    }

    updateAllProductStockDisplays() {
        const productCards = document.querySelectorAll('.product-card, .recommendation-card');
        productCards.forEach(card => {
            const productId = card.getAttribute('data-product-id') || 
                            card.querySelector('[data-product-id]')?.getAttribute('data-product-id');
            if (productId) {
                this.updateProductStockDisplay(productId, card);
            }
        });
    }

    updateProductStockDisplay(productId, specificCard = null) {
        const stockStatus = this.getStockStatus(productId);
        const cards = specificCard ? [specificCard] : 
                     document.querySelectorAll(`[data-product-id="${productId}"], .product-card:has([data-product-id="${productId}"])`);
        
        cards.forEach(card => {
            // Remove existing stock indicators
            const existingIndicator = card.querySelector('.stock-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            // Add new stock indicator
            const stockIndicator = document.createElement('div');
            stockIndicator.className = `stock-indicator ${stockStatus.class}`;
            stockIndicator.innerHTML = `
                <div class="stock-status">
                    <i class="fas ${this.getStockIcon(stockStatus.status)}"></i>
                    <span>${stockStatus.message}</span>
                </div>
                ${stockStatus.urgency === 'high' ? '<div class="urgency-pulse"></div>' : ''}
            `;
            
            // Insert stock indicator
            const cardContent = card.querySelector('.card-content, .product-info');
            if (cardContent) {
                cardContent.insertBefore(stockIndicator, cardContent.firstChild);
            }
            
            // Update add to cart button state
            const addToCartBtn = card.querySelector('.add-to-cart, .quick-add-btn');
            if (addToCartBtn) {
                if (stockStatus.status === 'out_of_stock') {
                    addToCartBtn.disabled = true;
                    addToCartBtn.innerHTML = '<i class="fas fa-ban"></i> Out of Stock';
                    addToCartBtn.classList.add('disabled');
                } else {
                    addToCartBtn.disabled = false;
                    addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                    addToCartBtn.classList.remove('disabled');
                }
            }
        });
    }

    getStockIcon(status) {
        const icons = {
            'in_stock': 'fa-check-circle',
            'limited_stock': 'fa-info-circle',
            'low_stock': 'fa-exclamation-triangle',
            'critical_stock': 'fa-exclamation-circle',
            'out_of_stock': 'fa-times-circle',
            'unknown': 'fa-question-circle'
        };
        return icons[status] || 'fa-question-circle';
    }

    // Stock Alerts
    setupStockAlerts() {
        this.checkAllLowStockAlerts();
    }

    checkLowStockAlert(productId) {
        const stock = this.getStockLevel(productId);
        if (!stock) return;
        
        if (stock.availableStock <= stock.criticalStockThreshold) {
            this.triggerStockAlert(productId, 'critical');
        } else if (stock.availableStock <= stock.lowStockThreshold) {
            this.triggerStockAlert(productId, 'low');
        }
    }

    checkAllLowStockAlerts() {
        Object.keys(this.inventory).forEach(productId => {
            this.checkLowStockAlert(productId);
        });
    }

    triggerStockAlert(productId, level) {
        const stock = this.getStockLevel(productId);
        if (!stock) return;
        
        const alert = {
            id: `alert_${productId}_${Date.now()}`,
            productId,
            productName: stock.productName,
            level,
            currentStock: stock.availableStock,
            threshold: level === 'critical' ? stock.criticalStockThreshold : stock.lowStockThreshold,
            timestamp: new Date().toISOString(),
            acknowledged: false
        };
        
        this.saveStockAlert(alert);
        this.showStockAlert(alert);
    }

    showStockAlert(alert) {
        // Show notification to admin users
        if (this.isAdminUser()) {
            const message = `${alert.level.toUpperCase()} STOCK: ${alert.productName} - Only ${alert.currentStock} left`;
            this.showNotification(message, alert.level === 'critical' ? 'error' : 'warning');
        }
    }

    // Stock History
    addStockHistoryEntry(productId, entry) {
        if (!this.inventory[productId]) return;
        
        if (!this.inventory[productId].stockHistory) {
            this.inventory[productId].stockHistory = [];
        }
        
        this.inventory[productId].stockHistory.unshift(entry);
        
        // Keep only last 100 entries
        if (this.inventory[productId].stockHistory.length > 100) {
            this.inventory[productId].stockHistory = this.inventory[productId].stockHistory.slice(0, 100);
        }
    }

    getStockHistory(productId, limit = 10) {
        if (!this.inventory[productId] || !this.inventory[productId].stockHistory) {
            return [];
        }
        return this.inventory[productId].stockHistory.slice(0, limit);
    }

    // Inventory Tracking
    setupInventoryTracking() {
        // Track cart additions/removals
        if (window.cart) {
            window.cart.onItemAdded = (product) => {
                this.reserveStock(product.id, 1, 'cart_reserve');
            };
            
            window.cart.onItemRemoved = (product) => {
                this.releaseStock(product.id, 1, 'cart_release');
            };
        }
    }

    startInventoryMonitoring() {
        // Periodic inventory checks
        setInterval(() => {
            this.checkAllLowStockAlerts();
            this.updateAllProductStockDisplays();
        }, 30000); // Check every 30 seconds
    }

    // Callbacks and Events
    onStockUpdate(callback) {
        this.stockUpdateCallbacks.push(callback);
    }

    notifyStockUpdate(productId) {
        this.stockUpdateCallbacks.forEach(callback => {
            try {
                callback(productId);
            } catch (error) {
                console.error('Error in stock update callback:', error);
            }
        });
    }

    // Data Management
    loadInventory() {
        const saved = localStorage.getItem('midasBeautyInventory');
        return saved ? JSON.parse(saved) : {};
    }

    saveInventory() {
        localStorage.setItem('midasBeautyInventory', JSON.stringify(this.inventory));
    }

    saveStockAlert(alert) {
        const alerts = JSON.parse(localStorage.getItem('midasBeautyStockAlerts') || '[]');
        alerts.unshift(alert);
        
        // Keep only last 50 alerts
        if (alerts.length > 50) {
            alerts.splice(50);
        }
        
        localStorage.setItem('midasBeautyStockAlerts', JSON.stringify(alerts));
    }

    getStockAlerts(unacknowledgedOnly = false) {
        const alerts = JSON.parse(localStorage.getItem('midasBeautyStockAlerts') || '[]');
        return unacknowledgedOnly ? alerts.filter(alert => !alert.acknowledged) : alerts;
    }

    // Utility Functions
    getAllProducts() {
        if (window.productsDatabase && window.productsDatabase.products) {
            return window.productsDatabase.products;
        }
        return [];
    }

    isAdminUser() {
        // Check if current user is admin (implement based on your auth system)
        return localStorage.getItem('midasBeautyUserRole') === 'admin';
    }

    showNotification(message, type = 'info') {
        if (window.enhancedNavigation) {
            window.enhancedNavigation.showNotification(message, type);
        }
    }

    // Public API Methods
    getInventoryReport() {
        const report = {
            totalProducts: Object.keys(this.inventory).length,
            inStock: 0,
            lowStock: 0,
            criticalStock: 0,
            outOfStock: 0,
            totalValue: 0,
            categories: {}
        };

        Object.values(this.inventory).forEach(item => {
            const status = this.getStockStatus(item.productId);
            const product = this.getAllProducts().find(p => p.id === item.productId);
            
            if (product) {
                report.totalValue += item.availableStock * product.price;
                
                if (!report.categories[item.category]) {
                    report.categories[item.category] = { count: 0, value: 0 };
                }
                report.categories[item.category].count += item.availableStock;
                report.categories[item.category].value += item.availableStock * product.price;
            }
            
            switch (status.status) {
                case 'in_stock':
                case 'limited_stock':
                    report.inStock++;
                    break;
                case 'low_stock':
                    report.lowStock++;
                    break;
                case 'critical_stock':
                    report.criticalStock++;
                    break;
                case 'out_of_stock':
                    report.outOfStock++;
                    break;
            }
        });

        return report;
    }

    exportInventoryData() {
        const data = {
            inventory: this.inventory,
            alerts: this.getStockAlerts(),
            report: this.getInventoryReport(),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `midas-beauty-inventory-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.inventoryManager = new InventoryManager();
});

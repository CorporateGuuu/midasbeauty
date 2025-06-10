// Admin Dashboard System for MidasBeauty
// Comprehensive business management interface

class AdminDashboard {
    constructor() {
        this.isAdminUser = this.checkAdminAccess();
        this.analytics = this.loadAnalytics();
        this.init();
    }

    init() {
        if (!this.isAdminUser) {
            console.log('Admin access required');
            return;
        }
        
        this.createAdminInterface();
        this.setupAdminNavigation();
        this.loadDashboardData();
        this.setupRealTimeUpdates();
    }

    checkAdminAccess() {
        // Check if user has admin privileges
        const userRole = localStorage.getItem('midasBeautyUserRole');
        const adminKey = localStorage.getItem('midasBeautyAdminKey');
        
        // For demo purposes, allow admin access with special key
        return userRole === 'admin' || adminKey === 'midas_admin_2024';
    }

    createAdminInterface() {
        // Create admin dashboard button
        this.createAdminAccessButton();
        
        // Create admin dashboard modal
        this.createAdminDashboardModal();
    }

    createAdminAccessButton() {
        const adminBtn = document.createElement('button');
        adminBtn.id = 'admin-access-btn';
        adminBtn.className = 'admin-access-btn';
        adminBtn.innerHTML = `
            <i class="fas fa-cog"></i>
            <span>Admin</span>
        `;
        adminBtn.title = 'Admin Dashboard';
        
        // Add to header
        const headerIcons = document.querySelector('.header-icons');
        if (headerIcons) {
            headerIcons.insertBefore(adminBtn, headerIcons.firstChild);
        }
        
        adminBtn.addEventListener('click', () => {
            this.showAdminDashboard();
        });
    }

    createAdminDashboardModal() {
        const adminModal = document.createElement('div');
        adminModal.id = 'admin-dashboard-modal';
        adminModal.className = 'admin-dashboard-modal';
        adminModal.innerHTML = `
            <div class="admin-dashboard-content">
                <div class="admin-header">
                    <div class="admin-title">
                        <h2><i class="fas fa-shield-alt"></i> Admin Dashboard</h2>
                        <p>Comprehensive business management for MidasBeauty</p>
                    </div>
                    <button class="admin-close" id="admin-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="admin-content">
                    <div class="admin-sidebar">
                        <nav class="admin-nav">
                            <a href="#" class="admin-nav-item active" data-section="overview">
                                <i class="fas fa-chart-line"></i>
                                <span>Overview</span>
                            </a>
                            <a href="#" class="admin-nav-item" data-section="products">
                                <i class="fas fa-box"></i>
                                <span>Products</span>
                            </a>
                            <a href="#" class="admin-nav-item" data-section="inventory">
                                <i class="fas fa-warehouse"></i>
                                <span>Inventory</span>
                            </a>
                            <a href="#" class="admin-nav-item" data-section="orders">
                                <i class="fas fa-shopping-cart"></i>
                                <span>Orders</span>
                            </a>
                            <a href="#" class="admin-nav-item" data-section="customers">
                                <i class="fas fa-users"></i>
                                <span>Customers</span>
                            </a>
                            <a href="#" class="admin-nav-item" data-section="analytics">
                                <i class="fas fa-chart-bar"></i>
                                <span>Analytics</span>
                            </a>
                            <a href="#" class="admin-nav-item" data-section="promotions">
                                <i class="fas fa-tags"></i>
                                <span>Promotions</span>
                            </a>
                            <a href="#" class="admin-nav-item" data-section="settings">
                                <i class="fas fa-cog"></i>
                                <span>Settings</span>
                            </a>
                        </nav>
                    </div>
                    
                    <div class="admin-main">
                        <div class="admin-section active" id="admin-section-overview">
                            <!-- Overview content -->
                        </div>
                        <div class="admin-section" id="admin-section-products">
                            <!-- Products management -->
                        </div>
                        <div class="admin-section" id="admin-section-inventory">
                            <!-- Inventory management -->
                        </div>
                        <div class="admin-section" id="admin-section-orders">
                            <!-- Orders management -->
                        </div>
                        <div class="admin-section" id="admin-section-customers">
                            <!-- Customer management -->
                        </div>
                        <div class="admin-section" id="admin-section-analytics">
                            <!-- Analytics and reports -->
                        </div>
                        <div class="admin-section" id="admin-section-promotions">
                            <!-- Promotions and campaigns -->
                        </div>
                        <div class="admin-section" id="admin-section-settings">
                            <!-- System settings -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(adminModal);
    }

    setupAdminNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('admin-nav-item') || e.target.closest('.admin-nav-item')) {
                e.preventDefault();
                const navItem = e.target.classList.contains('admin-nav-item') ? e.target : e.target.closest('.admin-nav-item');
                const section = navItem.getAttribute('data-section');
                this.showAdminSection(section);
            }
            
            if (e.target.id === 'admin-close' || e.target.closest('#admin-close')) {
                this.hideAdminDashboard();
            }
        });
    }

    showAdminSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`admin-section-${sectionName}`).classList.add('active');
        
        // Load section content
        this.loadAdminSection(sectionName);
    }

    loadAdminSection(sectionName) {
        const section = document.getElementById(`admin-section-${sectionName}`);
        
        switch (sectionName) {
            case 'overview':
                this.loadOverviewSection(section);
                break;
            case 'products':
                this.loadProductsSection(section);
                break;
            case 'inventory':
                this.loadInventorySection(section);
                break;
            case 'orders':
                this.loadOrdersSection(section);
                break;
            case 'customers':
                this.loadCustomersSection(section);
                break;
            case 'analytics':
                this.loadAnalyticsSection(section);
                break;
            case 'promotions':
                this.loadPromotionsSection(section);
                break;
            case 'settings':
                this.loadSettingsSection(section);
                break;
        }
    }

    loadOverviewSection(section) {
        const analytics = this.getBusinessAnalytics();
        
        section.innerHTML = `
            <div class="admin-section-header">
                <h3>Business Overview</h3>
                <p>Real-time insights into your MidasBeauty business performance</p>
                <div class="header-actions">
                    <button class="btn btn-secondary" id="refresh-data">
                        <i class="fas fa-sync-alt"></i>
                        Refresh Data
                    </button>
                    <button class="btn btn-outline" id="export-report">
                        <i class="fas fa-download"></i>
                        Export Report
                    </button>
                </div>
            </div>
            
            <div class="admin-stats-grid">
                <div class="admin-stat-card revenue">
                    <div class="stat-icon">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">$${analytics.totalRevenue.toFixed(2)}</div>
                        <div class="stat-label">Total Revenue</div>
                        <div class="stat-change positive">+${analytics.revenueGrowth.toFixed(1)}%</div>
                    </div>
                </div>
                
                <div class="admin-stat-card orders">
                    <div class="stat-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${analytics.totalOrders}</div>
                        <div class="stat-label">Total Orders</div>
                        <div class="stat-change positive">+${analytics.orderGrowth.toFixed(1)}%</div>
                    </div>
                </div>
                
                <div class="admin-stat-card customers">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${analytics.totalCustomers}</div>
                        <div class="stat-label">Total Customers</div>
                        <div class="stat-change positive">+${analytics.customerGrowth.toFixed(1)}%</div>
                    </div>
                </div>
                
                <div class="admin-stat-card aov">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">$${analytics.averageOrderValue.toFixed(2)}</div>
                        <div class="stat-label">Average Order Value</div>
                        <div class="stat-change positive">+${analytics.aovGrowth.toFixed(1)}%</div>
                    </div>
                </div>
                
                <div class="admin-stat-card conversion">
                    <div class="stat-icon">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${analytics.conversionRate.toFixed(1)}%</div>
                        <div class="stat-label">Conversion Rate</div>
                        <div class="stat-change positive">+${analytics.conversionGrowth.toFixed(1)}%</div>
                    </div>
                </div>
                
                <div class="admin-stat-card inventory">
                    <div class="stat-icon">
                        <i class="fas fa-warehouse"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${analytics.lowStockItems}</div>
                        <div class="stat-label">Low Stock Alerts</div>
                        <div class="stat-change ${analytics.lowStockItems > 5 ? 'negative' : 'neutral'}">
                            ${analytics.lowStockItems > 5 ? 'Attention Needed' : 'Good'}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="admin-charts-grid">
                <div class="chart-container">
                    <h4>Revenue Trend (Last 30 Days)</h4>
                    <div class="chart-placeholder" id="revenue-chart">
                        <canvas id="revenue-canvas" width="400" height="200"></canvas>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h4>Top Selling Products</h4>
                    <div class="top-products-list">
                        ${analytics.topProducts.map((product, index) => `
                            <div class="top-product-item">
                                <div class="product-rank">#${index + 1}</div>
                                <div class="product-info">
                                    <div class="product-name">${product.productName}</div>
                                    <div class="product-sales">${product.totalQuantity} sold</div>
                                </div>
                                <div class="product-revenue">$${product.totalRevenue.toFixed(2)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="admin-alerts">
                <h4>System Alerts</h4>
                <div class="alerts-list">
                    ${this.getSystemAlerts().map(alert => `
                        <div class="alert-item ${alert.type}">
                            <div class="alert-icon">
                                <i class="fas ${alert.icon}"></i>
                            </div>
                            <div class="alert-content">
                                <div class="alert-title">${alert.title}</div>
                                <div class="alert-message">${alert.message}</div>
                                <div class="alert-time">${alert.time}</div>
                            </div>
                            <div class="alert-actions">
                                <button class="btn btn-sm btn-primary" data-alert-id="${alert.id}">
                                    ${alert.actionText}
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Setup event listeners
        this.setupOverviewEventListeners(section);
        
        // Draw revenue chart
        this.drawRevenueChart();
    }

    loadProductsSection(section) {
        const products = this.getAllProducts();
        
        section.innerHTML = `
            <div class="admin-section-header">
                <h3>Product Management</h3>
                <p>Manage your product catalog and inventory</p>
                <div class="header-actions">
                    <button class="btn btn-primary" id="add-product-btn">
                        <i class="fas fa-plus"></i>
                        Add Product
                    </button>
                    <button class="btn btn-secondary" id="bulk-import-btn">
                        <i class="fas fa-upload"></i>
                        Bulk Import
                    </button>
                    <button class="btn btn-outline" id="export-products-btn">
                        <i class="fas fa-download"></i>
                        Export Products
                    </button>
                </div>
            </div>
            
            <div class="admin-filters">
                <div class="filter-group">
                    <label>Category:</label>
                    <select id="product-category-filter">
                        <option value="all">All Categories</option>
                        <option value="skincare">Skincare</option>
                        <option value="makeup">Makeup</option>
                        <option value="haircare">Haircare</option>
                        <option value="fragrance">Fragrance</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Brand:</label>
                    <select id="product-brand-filter">
                        <option value="all">All Brands</option>
                        <option value="midas-beauty">Midas Beauty</option>
                        <option value="radiant-glow">Radiant Glow</option>
                        <option value="velvet-luxe">Velvet Luxe</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Status:</label>
                    <select id="product-status-filter">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="out-of-stock">Out of Stock</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Search:</label>
                    <input type="text" id="product-search" placeholder="Search products...">
                </div>
            </div>
            
            <div class="admin-table-container">
                <table class="admin-table" id="products-table">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" id="select-all-products">
                            </th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => this.createProductRow(product)).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="admin-pagination">
                <button class="btn btn-sm btn-outline" id="prev-page">Previous</button>
                <span class="pagination-info">Page 1 of 1</span>
                <button class="btn btn-sm btn-outline" id="next-page">Next</button>
            </div>
        `;
        
        this.setupProductsEventListeners(section);
    }

    createProductRow(product) {
        const stock = window.inventoryManager ? window.inventoryManager.getStockLevel(product.id) : null;
        const stockLevel = stock ? stock.availableStock : 0;
        const stockStatus = stock ? window.inventoryManager.getStockStatus(product.id) : { status: 'unknown', class: 'stock-unknown' };
        
        return `
            <tr data-product-id="${product.id}">
                <td>
                    <input type="checkbox" class="product-checkbox" value="${product.id}">
                </td>
                <td>
                    <div class="product-cell">
                        <img src="${product.image}" alt="${product.name}" class="product-thumbnail">
                        <div class="product-details">
                            <div class="product-name">${product.name}</div>
                            <div class="product-sku">SKU: ${product.sku || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="category-badge ${product.category}">${product.category}</span>
                </td>
                <td>${product.brand}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <div class="stock-cell">
                        <span class="stock-number ${stockStatus.class}">${stockLevel}</span>
                        <span class="stock-status ${stockStatus.class}">${stockStatus.status.replace('_', ' ')}</span>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${stockLevel > 0 ? 'active' : 'inactive'}">
                        ${stockLevel > 0 ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline edit-product-btn" data-product-id="${product.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline duplicate-product-btn" data-product-id="${product.id}" title="Duplicate">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-product-btn" data-product-id="${product.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    // Business Analytics
    getBusinessAnalytics() {
        const orders = window.orderManager ? window.orderManager.getAllOrders() : [];
        const customers = window.customerDashboard ? Object.keys(window.customerDashboard.users).length : 0;
        const inventory = window.inventoryManager ? window.inventoryManager.getInventoryReport() : {};
        
        const totalRevenue = orders.reduce((sum, order) => sum + order.pricing.total, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Calculate growth rates (simulated for demo)
        const revenueGrowth = 15.3;
        const orderGrowth = 12.7;
        const customerGrowth = 8.9;
        const aovGrowth = 5.2;
        const conversionGrowth = 3.1;
        
        const conversionRate = 3.2; // Simulated conversion rate
        
        return {
            totalRevenue,
            totalOrders,
            totalCustomers: customers,
            averageOrderValue,
            conversionRate,
            revenueGrowth,
            orderGrowth,
            customerGrowth,
            aovGrowth,
            conversionGrowth,
            lowStockItems: inventory.lowStock || 0,
            topProducts: window.orderManager ? window.orderManager.getTopProducts(orders) : []
        };
    }

    getSystemAlerts() {
        const alerts = [];
        
        // Low stock alerts
        if (window.inventoryManager) {
            const lowStockAlerts = window.inventoryManager.getStockAlerts(true);
            lowStockAlerts.slice(0, 3).forEach(alert => {
                alerts.push({
                    id: alert.id,
                    type: alert.level === 'critical' ? 'critical' : 'warning',
                    icon: 'fa-exclamation-triangle',
                    title: `${alert.level.toUpperCase()} Stock Alert`,
                    message: `${alert.productName} - Only ${alert.currentStock} left`,
                    time: new Date(alert.timestamp).toLocaleString(),
                    actionText: 'Restock'
                });
            });
        }
        
        // Order alerts
        if (window.orderManager) {
            const pendingOrders = window.orderManager.getOrdersByStatus('pending');
            if (pendingOrders.length > 0) {
                alerts.push({
                    id: 'pending_orders',
                    type: 'info',
                    icon: 'fa-clock',
                    title: 'Pending Orders',
                    message: `${pendingOrders.length} orders waiting for processing`,
                    time: 'Now',
                    actionText: 'Process Orders'
                });
            }
        }
        
        return alerts;
    }

    // Event Listeners
    setupOverviewEventListeners(section) {
        section.querySelector('#refresh-data')?.addEventListener('click', () => {
            this.loadOverviewSection(section);
            this.showNotification('Data refreshed successfully', 'success');
        });
        
        section.querySelector('#export-report')?.addEventListener('click', () => {
            this.exportBusinessReport();
        });
    }

    setupProductsEventListeners(section) {
        // Add product button
        section.querySelector('#add-product-btn')?.addEventListener('click', () => {
            this.showAddProductModal();
        });
        
        // Product filters
        section.querySelectorAll('.filter-group select, .filter-group input').forEach(filter => {
            filter.addEventListener('change', () => {
                this.filterProducts();
            });
        });
        
        // Product actions
        section.querySelectorAll('.edit-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.edit-product-btn').getAttribute('data-product-id');
                this.showEditProductModal(productId);
            });
        });
        
        section.querySelectorAll('.delete-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.delete-product-btn').getAttribute('data-product-id');
                this.deleteProduct(productId);
            });
        });
    }

    // Utility Functions
    getAllProducts() {
        if (window.productsDatabase && window.productsDatabase.products) {
            return window.productsDatabase.products;
        }
        return [];
    }

    drawRevenueChart() {
        // Simple chart drawing (in a real app, use Chart.js or similar)
        const canvas = document.getElementById('revenue-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw simple line chart
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        // Sample data points
        const points = [
            { x: 50, y: 150 },
            { x: 100, y: 120 },
            { x: 150, y: 100 },
            { x: 200, y: 80 },
            { x: 250, y: 60 },
            { x: 300, y: 40 },
            { x: 350, y: 30 }
        ];
        
        points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#d4af37';
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    exportBusinessReport() {
        const analytics = this.getBusinessAnalytics();
        const reportData = {
            generatedAt: new Date().toISOString(),
            analytics,
            systemAlerts: this.getSystemAlerts(),
            summary: {
                totalRevenue: analytics.totalRevenue,
                totalOrders: analytics.totalOrders,
                totalCustomers: analytics.totalCustomers,
                averageOrderValue: analytics.averageOrderValue,
                conversionRate: analytics.conversionRate
            }
        };
        
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `midas-beauty-business-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Business report exported successfully', 'success');
    }

    // Modal Controls
    showAdminDashboard() {
        document.getElementById('admin-dashboard-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
        this.loadAdminSection('overview');
    }

    hideAdminDashboard() {
        document.getElementById('admin-dashboard-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    // Data Management
    loadAnalytics() {
        const saved = localStorage.getItem('midasBeautyAdminAnalytics');
        return saved ? JSON.parse(saved) : {};
    }

    saveAnalytics() {
        localStorage.setItem('midasBeautyAdminAnalytics', JSON.stringify(this.analytics));
    }

    loadDashboardData() {
        // Load and cache dashboard data
        this.dashboardData = {
            lastUpdated: new Date().toISOString(),
            analytics: this.getBusinessAnalytics(),
            alerts: this.getSystemAlerts()
        };
    }

    setupRealTimeUpdates() {
        // Update dashboard data every 30 seconds
        setInterval(() => {
            this.loadDashboardData();
            
            // Update active section if overview is showing
            const activeSection = document.querySelector('.admin-section.active');
            if (activeSection && activeSection.id === 'admin-section-overview') {
                this.loadOverviewSection(activeSection);
            }
        }, 30000);
    }

    showNotification(message, type = 'info') {
        if (window.enhancedNavigation) {
            window.enhancedNavigation.showNotification(message, type);
        }
    }
}

// Initialize admin dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Set admin access for demo purposes
    localStorage.setItem('midasBeautyAdminKey', 'midas_admin_2024');
    localStorage.setItem('midasBeautyUserRole', 'admin');
    
    window.adminDashboard = new AdminDashboard();
});

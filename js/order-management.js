// Order Management System for MidasBeauty
// Handles order processing, tracking, and management

class OrderManager {
    constructor() {
        this.orders = this.loadOrders();
        this.orderStatuses = {
            'pending': { label: 'Pending', color: '#ffc107', icon: 'fa-clock' },
            'confirmed': { label: 'Confirmed', color: '#17a2b8', icon: 'fa-check-circle' },
            'processing': { label: 'Processing', color: '#fd7e14', icon: 'fa-cog' },
            'shipped': { label: 'Shipped', color: '#6f42c1', icon: 'fa-shipping-fast' },
            'delivered': { label: 'Delivered', color: '#28a745', icon: 'fa-check-double' },
            'cancelled': { label: 'Cancelled', color: '#dc3545', icon: 'fa-times-circle' },
            'refunded': { label: 'Refunded', color: '#6c757d', icon: 'fa-undo' }
        };
        this.init();
    }

    init() {
        this.setupOrderProcessing();
        this.setupOrderTracking();
        this.setupOrderNotifications();
    }

    // Order Creation
    createOrder(cartItems, customerInfo, shippingInfo, paymentInfo) {
        const orderId = this.generateOrderId();
        const orderDate = new Date().toISOString();
        
        // Calculate totals
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // 8% tax
        const shipping = this.calculateShipping(subtotal, shippingInfo);
        const total = subtotal + tax + shipping;
        
        const order = {
            id: orderId,
            orderNumber: this.generateOrderNumber(),
            status: 'pending',
            orderDate,
            estimatedDelivery: this.calculateEstimatedDelivery(shippingInfo),
            
            // Customer Information
            customer: {
                id: customerInfo.id || 'guest',
                name: customerInfo.name,
                email: customerInfo.email,
                phone: customerInfo.phone
            },
            
            // Shipping Information
            shipping: {
                address: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                zipCode: shippingInfo.zipCode,
                country: shippingInfo.country || 'US',
                method: shippingInfo.method || 'standard',
                instructions: shippingInfo.instructions || ''
            },
            
            // Payment Information (sanitized)
            payment: {
                method: paymentInfo.method,
                lastFour: paymentInfo.lastFour,
                transactionId: this.generateTransactionId()
            },
            
            // Order Items
            items: cartItems.map(item => ({
                productId: item.id,
                productName: item.name,
                brand: item.brand,
                category: item.category,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                sku: item.sku || this.generateSKU(item)
            })),
            
            // Pricing
            pricing: {
                subtotal,
                tax,
                shipping,
                discount: 0,
                total
            },
            
            // Tracking
            tracking: {
                carrier: null,
                trackingNumber: null,
                trackingUrl: null,
                statusHistory: [{
                    status: 'pending',
                    timestamp: orderDate,
                    note: 'Order placed successfully'
                }]
            },
            
            // Metadata
            metadata: {
                source: 'website',
                userAgent: navigator.userAgent,
                ipAddress: 'xxx.xxx.xxx.xxx', // Would be set by backend
                loyaltyPointsEarned: Math.floor(total),
                notes: []
            }
        };
        
        // Reserve inventory
        this.reserveOrderInventory(order);
        
        // Save order
        this.orders[orderId] = order;
        this.saveOrders();
        
        // Send confirmation
        this.sendOrderConfirmation(order);
        
        // Track analytics
        this.trackOrderCreated(order);
        
        return order;
    }

    // Order Processing
    updateOrderStatus(orderId, newStatus, note = '') {
        const order = this.orders[orderId];
        if (!order) {
            throw new Error(`Order ${orderId} not found`);
        }
        
        const oldStatus = order.status;
        order.status = newStatus;
        
        // Add to status history
        order.tracking.statusHistory.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note || `Order status updated to ${this.orderStatuses[newStatus].label}`,
            updatedBy: this.getCurrentUser()
        });
        
        // Handle status-specific logic
        this.handleStatusChange(order, oldStatus, newStatus);
        
        // Save changes
        this.saveOrders();
        
        // Send notifications
        this.sendStatusUpdateNotification(order, newStatus);
        
        // Track analytics
        this.trackOrderStatusUpdate(order, oldStatus, newStatus);
        
        return order;
    }

    handleStatusChange(order, oldStatus, newStatus) {
        switch (newStatus) {
            case 'confirmed':
                this.processOrderConfirmation(order);
                break;
            case 'processing':
                this.startOrderProcessing(order);
                break;
            case 'shipped':
                this.processOrderShipment(order);
                break;
            case 'delivered':
                this.processOrderDelivery(order);
                break;
            case 'cancelled':
                this.processOrderCancellation(order);
                break;
            case 'refunded':
                this.processOrderRefund(order);
                break;
        }
    }

    processOrderConfirmation(order) {
        // Confirm inventory reservation
        order.items.forEach(item => {
            if (window.inventoryManager) {
                window.inventoryManager.reserveStock(item.productId, item.quantity, order.id);
            }
        });
        
        // Generate estimated processing time
        order.estimatedProcessing = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    }

    startOrderProcessing(order) {
        // Deduct inventory
        order.items.forEach(item => {
            if (window.inventoryManager) {
                window.inventoryManager.adjustStock(item.productId, -item.quantity, 'order_fulfillment', order.id);
            }
        });
        
        // Generate picking list
        order.metadata.pickingList = this.generatePickingList(order);
    }

    processOrderShipment(order) {
        // Generate tracking information
        order.tracking.carrier = this.selectCarrier(order.shipping.method);
        order.tracking.trackingNumber = this.generateTrackingNumber();
        order.tracking.trackingUrl = this.generateTrackingUrl(order.tracking.carrier, order.tracking.trackingNumber);
        
        // Update estimated delivery
        order.estimatedDelivery = this.calculateEstimatedDelivery(order.shipping, order.tracking.carrier);
    }

    processOrderDelivery(order) {
        // Award loyalty points
        if (window.loyaltySystem && order.customer.id !== 'guest') {
            window.loyaltySystem.awardPoints(order.customer.id, order.metadata.loyaltyPointsEarned, 'purchase', order.id);
        }
        
        // Request review
        setTimeout(() => {
            this.requestOrderReview(order);
        }, 24 * 60 * 60 * 1000); // 24 hours after delivery
    }

    processOrderCancellation(order) {
        // Release reserved inventory
        order.items.forEach(item => {
            if (window.inventoryManager) {
                window.inventoryManager.releaseStock(item.productId, item.quantity, order.id);
            }
        });
        
        // Process refund if payment was captured
        if (order.payment.transactionId) {
            this.initiateRefund(order);
        }
    }

    processOrderRefund(order) {
        // Handle refund processing
        order.metadata.refundAmount = order.pricing.total;
        order.metadata.refundDate = new Date().toISOString();
        order.metadata.refundTransactionId = this.generateTransactionId();
    }

    // Order Search and Filtering
    searchOrders(criteria) {
        const orders = Object.values(this.orders);
        
        return orders.filter(order => {
            // Search by order number
            if (criteria.orderNumber && !order.orderNumber.toLowerCase().includes(criteria.orderNumber.toLowerCase())) {
                return false;
            }
            
            // Search by customer email
            if (criteria.customerEmail && !order.customer.email.toLowerCase().includes(criteria.customerEmail.toLowerCase())) {
                return false;
            }
            
            // Filter by status
            if (criteria.status && criteria.status !== 'all' && order.status !== criteria.status) {
                return false;
            }
            
            // Filter by date range
            if (criteria.startDate && new Date(order.orderDate) < new Date(criteria.startDate)) {
                return false;
            }
            
            if (criteria.endDate && new Date(order.orderDate) > new Date(criteria.endDate)) {
                return false;
            }
            
            // Search by product
            if (criteria.productName) {
                const hasProduct = order.items.some(item => 
                    item.productName.toLowerCase().includes(criteria.productName.toLowerCase())
                );
                if (!hasProduct) return false;
            }
            
            return true;
        });
    }

    getOrdersByCustomer(customerId) {
        return Object.values(this.orders).filter(order => order.customer.id === customerId);
    }

    getOrdersByStatus(status) {
        return Object.values(this.orders).filter(order => order.status === status);
    }

    getOrdersByDateRange(startDate, endDate) {
        return Object.values(this.orders).filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });
    }

    // Order Analytics
    getOrderAnalytics(period = '30days') {
        const orders = Object.values(this.orders);
        const now = new Date();
        const periodStart = new Date(now.getTime() - this.getPeriodMilliseconds(period));
        
        const periodOrders = orders.filter(order => new Date(order.orderDate) >= periodStart);
        
        return {
            totalOrders: periodOrders.length,
            totalRevenue: periodOrders.reduce((sum, order) => sum + order.pricing.total, 0),
            averageOrderValue: periodOrders.length > 0 ? 
                periodOrders.reduce((sum, order) => sum + order.pricing.total, 0) / periodOrders.length : 0,
            
            statusBreakdown: this.getStatusBreakdown(periodOrders),
            topProducts: this.getTopProducts(periodOrders),
            revenueByDay: this.getRevenueByDay(periodOrders),
            
            conversionMetrics: {
                completionRate: this.calculateCompletionRate(periodOrders),
                averageProcessingTime: this.calculateAverageProcessingTime(periodOrders),
                customerSatisfaction: this.calculateCustomerSatisfaction(periodOrders)
            }
        };
    }

    getStatusBreakdown(orders) {
        const breakdown = {};
        Object.keys(this.orderStatuses).forEach(status => {
            breakdown[status] = orders.filter(order => order.status === status).length;
        });
        return breakdown;
    }

    getTopProducts(orders) {
        const productSales = {};
        
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = {
                        productId: item.productId,
                        productName: item.productName,
                        brand: item.brand,
                        totalQuantity: 0,
                        totalRevenue: 0
                    };
                }
                productSales[item.productId].totalQuantity += item.quantity;
                productSales[item.productId].totalRevenue += item.price * item.quantity;
            });
        });
        
        return Object.values(productSales)
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, 10);
    }

    // Utility Functions
    generateOrderId() {
        return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const sequence = (Object.keys(this.orders).length + 1).toString().padStart(4, '0');
        
        return `MB${year}${month}${day}${sequence}`;
    }

    generateTransactionId() {
        return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateSKU(item) {
        const brand = item.brand.substr(0, 3).toUpperCase();
        const category = item.category.substr(0, 3).toUpperCase();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${brand}-${category}-${random}`;
    }

    generateTrackingNumber() {
        return '1Z' + Math.random().toString(36).substr(2, 16).toUpperCase();
    }

    generateTrackingUrl(carrier, trackingNumber) {
        const carriers = {
            'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
            'fedex': `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`,
            'usps': `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}`,
            'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
        };
        return carriers[carrier] || `#tracking-${trackingNumber}`;
    }

    calculateShipping(subtotal, shippingInfo) {
        if (subtotal >= 50) return 0; // Free shipping over $50
        
        const shippingRates = {
            'standard': 5.99,
            'express': 12.99,
            'overnight': 24.99
        };
        
        return shippingRates[shippingInfo.method] || shippingRates.standard;
    }

    calculateEstimatedDelivery(shippingInfo, carrier = null) {
        const deliveryDays = {
            'standard': 5,
            'express': 2,
            'overnight': 1
        };
        
        const days = deliveryDays[shippingInfo.method] || 5;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + days);
        
        return deliveryDate.toISOString();
    }

    selectCarrier(shippingMethod) {
        const carriers = {
            'standard': 'usps',
            'express': 'ups',
            'overnight': 'fedex'
        };
        return carriers[shippingMethod] || 'usps';
    }

    reserveOrderInventory(order) {
        order.items.forEach(item => {
            if (window.inventoryManager) {
                window.inventoryManager.reserveStock(item.productId, item.quantity, order.id);
            }
        });
    }

    getCurrentUser() {
        return localStorage.getItem('midasBeautyCurrentUser') || 'system';
    }

    getPeriodMilliseconds(period) {
        const periods = {
            '7days': 7 * 24 * 60 * 60 * 1000,
            '30days': 30 * 24 * 60 * 60 * 1000,
            '90days': 90 * 24 * 60 * 60 * 1000,
            '1year': 365 * 24 * 60 * 60 * 1000
        };
        return periods[period] || periods['30days'];
    }

    // Notifications
    sendOrderConfirmation(order) {
        const notification = {
            type: 'order_confirmation',
            orderId: order.id,
            customerEmail: order.customer.email,
            subject: `Order Confirmation - ${order.orderNumber}`,
            template: 'order_confirmation',
            data: order
        };
        
        this.queueNotification(notification);
    }

    sendStatusUpdateNotification(order, newStatus) {
        const notification = {
            type: 'status_update',
            orderId: order.id,
            customerEmail: order.customer.email,
            subject: `Order Update - ${order.orderNumber}`,
            template: 'status_update',
            data: { order, newStatus, statusInfo: this.orderStatuses[newStatus] }
        };
        
        this.queueNotification(notification);
    }

    queueNotification(notification) {
        // In a real app, this would send to an email service
        const notifications = JSON.parse(localStorage.getItem('midasBeautyNotificationQueue') || '[]');
        notifications.push({
            ...notification,
            queuedAt: new Date().toISOString(),
            sent: false
        });
        localStorage.setItem('midasBeautyNotificationQueue', JSON.stringify(notifications));
    }

    // Data Management
    loadOrders() {
        const saved = localStorage.getItem('midasBeautyOrders');
        return saved ? JSON.parse(saved) : {};
    }

    saveOrders() {
        localStorage.setItem('midasBeautyOrders', JSON.stringify(this.orders));
    }

    exportOrderData(criteria = {}) {
        const orders = this.searchOrders(criteria);
        const data = {
            orders,
            analytics: this.getOrderAnalytics(),
            exportDate: new Date().toISOString(),
            criteria
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `midas-beauty-orders-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Analytics Tracking
    trackOrderCreated(order) {
        const analyticsData = {
            event: 'order_created',
            orderId: order.id,
            orderValue: order.pricing.total,
            itemCount: order.items.length,
            customerType: order.customer.id === 'guest' ? 'guest' : 'registered',
            timestamp: new Date().toISOString()
        };
        
        const existingAnalytics = JSON.parse(localStorage.getItem('midasBeautyAnalytics') || '[]');
        existingAnalytics.push(analyticsData);
        localStorage.setItem('midasBeautyAnalytics', JSON.stringify(existingAnalytics));
    }

    trackOrderStatusUpdate(order, oldStatus, newStatus) {
        const analyticsData = {
            event: 'order_status_update',
            orderId: order.id,
            oldStatus,
            newStatus,
            timestamp: new Date().toISOString()
        };
        
        const existingAnalytics = JSON.parse(localStorage.getItem('midasBeautyAnalytics') || '[]');
        existingAnalytics.push(analyticsData);
        localStorage.setItem('midasBeautyAnalytics', JSON.stringify(existingAnalytics));
    }

    // Public API
    getOrder(orderId) {
        return this.orders[orderId] || null;
    }

    getAllOrders() {
        return Object.values(this.orders);
    }

    getOrderCount() {
        return Object.keys(this.orders).length;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.orderManager = new OrderManager();
});

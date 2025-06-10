// Enhanced Wishlist System for Midas Beauty
// Provides wishlist functionality with persistence and sync

class WishlistManager {
    constructor() {
        this.items = [];
        this.storageKey = 'midasBeautyWishlist';
        this.init();
    }

    init() {
        // Load wishlist from localStorage
        this.loadWishlist();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update UI
        this.updateWishlistUI();
        
        // Setup background sync for PWA
        this.setupBackgroundSync();
    }

    loadWishlist() {
        const savedWishlist = localStorage.getItem(this.storageKey);
        if (savedWishlist) {
            try {
                const wishlistData = JSON.parse(savedWishlist);
                this.items = wishlistData.items || [];
            } catch (error) {
                console.error('Error loading wishlist:', error);
                this.items = [];
            }
        }
    }

    saveWishlist() {
        const wishlistData = {
            items: this.items,
            lastUpdated: new Date().toISOString(),
            version: '1.0'
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(wishlistData));
        
        // Trigger background sync if available
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('wishlist-sync');
            }).catch(error => {
                console.log('Background sync registration failed:', error);
            });
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Handle wishlist toggle buttons
            if (e.target.classList.contains('wishlist-btn') || e.target.closest('.wishlist-btn')) {
                e.preventDefault();
                const button = e.target.classList.contains('wishlist-btn') ? e.target : e.target.closest('.wishlist-btn');
                this.toggleWishlistItem(button);
            }
            
            // Handle remove from wishlist
            if (e.target.classList.contains('remove-wishlist-item')) {
                e.preventDefault();
                const productId = e.target.getAttribute('data-id');
                this.removeFromWishlist(productId);
            }
        });

        // Update wishlist buttons when page loads
        document.addEventListener('DOMContentLoaded', () => {
            this.updateWishlistButtons();
        });
    }

    toggleWishlistItem(button) {
        const productCard = button.closest('.product-card');
        if (!productCard) return;

        // Extract product information
        const product = this.extractProductInfo(productCard);
        
        if (this.isInWishlist(product.id)) {
            this.removeFromWishlist(product.id);
            this.showNotification(`${product.name} removed from wishlist`, 'info');
        } else {
            this.addToWishlist(product);
            this.showNotification(`${product.name} added to wishlist`, 'success');
        }
        
        // Update button state
        this.updateWishlistButton(button, this.isInWishlist(product.id));
    }

    extractProductInfo(productCard) {
        // Handle product name which might be inside an <a> tag
        const nameElement = productCard.querySelector('h3');
        let productName;
        if (nameElement.querySelector('a')) {
            productName = nameElement.querySelector('a').textContent.trim();
        } else {
            productName = nameElement.textContent.trim();
        }

        // Extract price
        const priceElement = productCard.querySelector('.price');
        const productPrice = priceElement ? parseFloat(priceElement.textContent.replace('$', '')) : 0;

        // Extract image
        const imgElement = productCard.querySelector('img');
        const productImage = imgElement ? imgElement.src : 'images/placeholder.jpg';

        // Extract brand
        const brandElement = productCard.querySelector('.brand-name');
        const productBrand = brandElement ? brandElement.textContent.trim() : 'Unknown';

        // Generate ID based on name (in a real app, this would be a proper product ID)
        const productId = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        return {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            brand: productBrand,
            addedAt: new Date().toISOString()
        };
    }

    addToWishlist(product) {
        // Check if already in wishlist
        if (!this.isInWishlist(product.id)) {
            this.items.push(product);
            this.saveWishlist();
            this.updateWishlistUI();
        }
    }

    removeFromWishlist(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveWishlist();
        this.updateWishlistUI();
    }

    isInWishlist(productId) {
        return this.items.some(item => item.id === productId);
    }

    updateWishlistUI() {
        // Update wishlist count
        const wishlistCount = document.getElementById('wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.items.length;
        }

        // Update wishlist page if we're on it
        const wishlistContainer = document.getElementById('wishlist-items');
        if (wishlistContainer) {
            this.renderWishlistPage();
        }

        // Update all wishlist buttons
        this.updateWishlistButtons();
    }

    updateWishlistButtons() {
        document.querySelectorAll('.wishlist-btn').forEach(button => {
            const productCard = button.closest('.product-card');
            if (productCard) {
                const product = this.extractProductInfo(productCard);
                this.updateWishlistButton(button, this.isInWishlist(product.id));
            }
        });
    }

    updateWishlistButton(button, isInWishlist) {
        const icon = button.querySelector('i');
        if (icon) {
            if (isInWishlist) {
                icon.className = 'fas fa-heart';
                button.classList.add('active');
                button.title = 'Remove from wishlist';
            } else {
                icon.className = 'far fa-heart';
                button.classList.remove('active');
                button.title = 'Add to wishlist';
            }
        }
    }

    renderWishlistPage() {
        const wishlistContainer = document.getElementById('wishlist-items');
        if (!wishlistContainer) return;

        if (this.items.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="empty-wishlist">
                    <i class="far fa-heart"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Add products you love to your wishlist</p>
                    <a href="products.html" class="btn">Browse Products</a>
                </div>
            `;
            return;
        }

        const wishlistHTML = this.items.map(item => `
            <div class="wishlist-item">
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="wishlist-item-details">
                    <h4>${item.name}</h4>
                    <p class="brand">${item.brand}</p>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="wishlist-item-actions">
                        <button class="btn btn-primary add-to-cart-from-wishlist" data-id="${item.id}">
                            Add to Cart
                        </button>
                        <button class="btn btn-secondary remove-wishlist-item" data-id="${item.id}">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        wishlistContainer.innerHTML = wishlistHTML;

        // Add event listeners for add to cart from wishlist
        document.querySelectorAll('.add-to-cart-from-wishlist').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                const product = this.items.find(item => item.id === productId);
                if (product && window.cart) {
                    window.cart.addItem(product);
                }
            });
        });
    }

    setupBackgroundSync() {
        // Register for background sync when wishlist changes
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data && event.data.type === 'WISHLIST_SYNC_REQUEST') {
                    // Send current wishlist data to service worker
                    event.ports[0].postMessage({
                        type: 'WISHLIST_DATA',
                        data: {
                            items: this.items,
                            lastUpdated: new Date().toISOString()
                        }
                    });
                }
            });
        }
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `wishlist-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-heart"></i>
            <span>${message}</span>
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Public methods
    getWishlistItems() {
        return [...this.items];
    }

    getWishlistCount() {
        return this.items.length;
    }

    clearWishlist() {
        this.items = [];
        this.saveWishlist();
        this.updateWishlistUI();
        this.showNotification('Wishlist cleared', 'info');
    }

    exportWishlist() {
        const wishlistData = {
            items: this.items,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(wishlistData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'midas-beauty-wishlist.json';
        link.click();
    }
}

// Initialize wishlist manager
document.addEventListener('DOMContentLoaded', () => {
    window.wishlistManager = new WishlistManager();
});

// Add CSS for wishlist notifications
const wishlistStyle = document.createElement('style');
wishlistStyle.textContent = `
    .wishlist-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--rich-white);
        color: var(--deep-black);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px var(--shadow-color);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    }
    
    .wishlist-notification.show {
        transform: translateX(0);
    }
    
    .wishlist-notification.success {
        border-left: 4px solid var(--primary-gold);
    }
    
    .wishlist-notification.info {
        border-left: 4px solid #3498db;
    }
    
    .wishlist-btn {
        background: none;
        border: none;
        color: var(--sophisticated-gray);
        font-size: 1.2rem;
        cursor: pointer;
        transition: var(--transition-smooth);
        padding: 0.5rem;
        border-radius: 50%;
    }
    
    .wishlist-btn:hover,
    .wishlist-btn.active {
        color: #e74c3c;
        transform: scale(1.1);
    }
    
    .empty-wishlist {
        text-align: center;
        padding: 3rem;
        color: var(--sophisticated-gray);
    }
    
    .empty-wishlist i {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: var(--light-gray);
    }
`;
document.head.appendChild(wishlistStyle);

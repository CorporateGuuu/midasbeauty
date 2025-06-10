// Product Detail Page System for Midas Beauty
// Handles dynamic product page generation and functionality

class ProductDetailSystem {
    constructor() {
        this.currentProduct = null;
        this.relatedProducts = [];
        this.currentImageIndex = 0;
        this.quantity = 1;
        this.init();
    }

    init() {
        // Load product data from URL
        this.loadProductFromURL();
        
        // Initialize page components
        this.initializeImageGallery();
        this.initializeQuantitySelector();
        this.initializeAddToCart();
        this.initializeReviews();
        this.initializeSocialSharing();
        this.loadRelatedProducts();
        
        // Initialize PWA features
        this.initializePWAFeatures();
    }

    loadProductFromURL() {
        // Extract product slug from URL
        const path = window.location.pathname;
        const productSlug = path.split('/').pop().replace('.html', '');
        
        // Find product in database
        if (typeof MIDAS_BEAUTY_PRODUCTS !== 'undefined') {
            this.currentProduct = MIDAS_BEAUTY_PRODUCTS.products.find(product => {
                const slug = this.createSlug(product.name);
                return slug === productSlug;
            });
            
            if (this.currentProduct) {
                this.renderProductDetails();
                this.updatePageMeta();
            } else {
                this.showProductNotFound();
            }
        }
    }

    createSlug(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    renderProductDetails() {
        if (!this.currentProduct) return;

        const product = this.currentProduct;
        
        // Update page title and breadcrumbs
        document.title = product.seoTitle || `${product.name} | Midas Beauty`;
        this.updateBreadcrumbs(product);
        
        // Render product information
        this.renderProductInfo(product);
        this.renderProductImages(product);
        this.renderProductSpecs(product);
        this.renderPricing(product);
        this.renderStockStatus(product);
        this.renderRatingReviews(product);
    }

    renderProductInfo(product) {
        // Product name
        const nameElement = document.getElementById('product-name');
        if (nameElement) {
            nameElement.textContent = product.name;
        }

        // Product description
        const descElement = document.getElementById('product-description');
        if (descElement) {
            descElement.textContent = product.description;
        }

        // Key ingredients
        const ingredientsElement = document.getElementById('key-ingredients');
        if (ingredientsElement && product.keyIngredients) {
            ingredientsElement.innerHTML = product.keyIngredients
                .map(ingredient => `<span class="ingredient-tag">${ingredient}</span>`)
                .join('');
        }

        // Benefits
        const benefitsElement = document.getElementById('product-benefits');
        if (benefitsElement && product.benefits) {
            benefitsElement.innerHTML = product.benefits
                .map(benefit => `<li><i class="fas fa-check"></i> ${benefit}</li>`)
                .join('');
        }
    }

    renderProductImages(product) {
        const mainImageElement = document.getElementById('main-product-image');
        const thumbnailsElement = document.getElementById('image-thumbnails');
        
        if (mainImageElement && product.images) {
            // Set main image
            mainImageElement.src = product.images.main;
            mainImageElement.alt = product.name;
            
            // Create thumbnails
            if (thumbnailsElement && product.images.gallery) {
                const allImages = [product.images.main, ...product.images.gallery];
                thumbnailsElement.innerHTML = allImages
                    .map((image, index) => `
                        <img src="${image}" 
                             alt="${product.name} - Image ${index + 1}"
                             class="thumbnail ${index === 0 ? 'active' : ''}"
                             onclick="productDetailSystem.changeMainImage(${index}, '${image}')"
                             loading="lazy">
                    `).join('');
            }
        }
    }

    renderPricing(product) {
        const priceElement = document.getElementById('product-price');
        const salePriceElement = document.getElementById('sale-price');
        
        if (priceElement) {
            if (product.salePrice) {
                priceElement.innerHTML = `
                    <span class="original-price">$${product.price.toFixed(2)}</span>
                    <span class="sale-price">$${product.salePrice.toFixed(2)}</span>
                    <span class="savings">Save $${(product.price - product.salePrice).toFixed(2)}</span>
                `;
            } else {
                priceElement.innerHTML = `<span class="current-price">$${product.price.toFixed(2)}</span>`;
            }
        }
    }

    renderStockStatus(product) {
        const stockElement = document.getElementById('stock-status');
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        
        if (stockElement) {
            if (product.inStock) {
                stockElement.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>In Stock (${product.stockLevel || 'Available'})</span>
                `;
                stockElement.className = 'stock-status in-stock';
            } else {
                stockElement.innerHTML = `
                    <i class="fas fa-times-circle"></i>
                    <span>Out of Stock</span>
                `;
                stockElement.className = 'stock-status out-of-stock';
            }
        }
        
        // Update add to cart button
        if (addToCartBtn) {
            if (product.inStock) {
                addToCartBtn.disabled = false;
                addToCartBtn.textContent = 'Add to Cart';
                addToCartBtn.className = 'btn add-to-cart-btn';
            } else {
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Out of Stock';
                addToCartBtn.className = 'btn add-to-cart-btn disabled';
            }
        }
    }

    renderRatingReviews(product) {
        const ratingElement = document.getElementById('product-rating');
        const reviewCountElement = document.getElementById('review-count');
        
        if (ratingElement && product.rating) {
            const stars = this.generateStarRating(product.rating);
            ratingElement.innerHTML = stars;
        }
        
        if (reviewCountElement && product.reviewCount) {
            reviewCountElement.textContent = `(${product.reviewCount} reviews)`;
        }
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return `<div class="stars" data-rating="${rating}">${starsHTML}</div>`;
    }

    changeMainImage(index, imageSrc) {
        const mainImage = document.getElementById('main-product-image');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        if (mainImage) {
            mainImage.src = imageSrc;
            this.currentImageIndex = index;
        }
        
        // Update active thumbnail
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    initializeQuantitySelector() {
        const quantityInput = document.getElementById('quantity-input');
        const decreaseBtn = document.getElementById('decrease-quantity');
        const increaseBtn = document.getElementById('increase-quantity');
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                if (this.quantity > 1) {
                    this.quantity--;
                    if (quantityInput) quantityInput.value = this.quantity;
                }
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                if (this.quantity < 10) { // Max quantity limit
                    this.quantity++;
                    if (quantityInput) quantityInput.value = this.quantity;
                }
            });
        }
        
        if (quantityInput) {
            quantityInput.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= 10) {
                    this.quantity = value;
                } else {
                    e.target.value = this.quantity;
                }
            });
        }
    }

    initializeAddToCart() {
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                if (this.currentProduct && this.currentProduct.inStock) {
                    this.addToCart();
                }
            });
        }
    }

    addToCart() {
        if (!this.currentProduct) return;
        
        const cartItem = {
            id: Date.now().toString(),
            productId: this.currentProduct.id,
            name: this.currentProduct.name,
            price: this.currentProduct.salePrice || this.currentProduct.price,
            image: this.currentProduct.images.main,
            quantity: this.quantity
        };
        
        // Add to cart using existing cart system
        if (typeof cart !== 'undefined' && typeof cart.addItem === 'function') {
            cart.addItem(cartItem);
            this.showAddToCartSuccess();
        }
        
        // Track analytics
        this.trackAddToCart(cartItem);
    }

    showAddToCartSuccess() {
        // Show success notification
        if (typeof showNotification === 'function') {
            showNotification(`${this.currentProduct.name} added to cart!`, 'success');
        }
        
        // Animate add to cart button
        const btn = document.getElementById('add-to-cart-btn');
        if (btn) {
            btn.classList.add('success');
            btn.textContent = 'Added!';
            setTimeout(() => {
                btn.classList.remove('success');
                btn.textContent = 'Add to Cart';
            }, 2000);
        }
    }

    updatePageMeta() {
        if (!this.currentProduct) return;
        
        const product = this.currentProduct;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && product.metaDescription) {
            metaDesc.setAttribute('content', product.metaDescription);
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');
        
        if (ogTitle) ogTitle.setAttribute('content', product.name);
        if (ogDesc) ogDesc.setAttribute('content', product.metaDescription || product.description);
        if (ogImage) ogImage.setAttribute('content', product.images.main);
    }

    showProductNotFound() {
        document.body.innerHTML = `
            <div class="product-not-found">
                <h1>Product Not Found</h1>
                <p>The product you're looking for doesn't exist or has been moved.</p>
                <a href="/products.html" class="btn">Browse All Products</a>
            </div>
        `;
    }

    initializePWAFeatures() {
        // Add to PWA cache if service worker is available
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                // Cache this product page
                if (registration.active) {
                    registration.active.postMessage({
                        type: 'CACHE_PRODUCT_PAGE',
                        url: window.location.href
                    });
                }
            });
        }
    }

    trackAddToCart(item) {
        // Track analytics for add to cart
        if (typeof gtag !== 'undefined') {
            gtag('event', 'add_to_cart', {
                currency: 'USD',
                value: item.price * item.quantity,
                items: [{
                    item_id: item.productId,
                    item_name: item.name,
                    category: this.currentProduct.category,
                    quantity: item.quantity,
                    price: item.price
                }]
            });
        }
    }
}

// Initialize when DOM is loaded
let productDetailSystem;
document.addEventListener('DOMContentLoaded', () => {
    productDetailSystem = new ProductDetailSystem();
});

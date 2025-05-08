// Product Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Add to cart functionality for product detail page
    const addToCartDetailBtn = document.getElementById('add-to-cart-detail');
    if (addToCartDetailBtn) {
        addToCartDetailBtn.addEventListener('click', function() {
            const productName = document.querySelector('.product-info h1').textContent;
            const productPrice = parseFloat(document.querySelector('.product-price').textContent.replace('$', ''));
            const productImage = document.getElementById('main-product-image').src;
            const quantity = parseInt(document.getElementById('product-quantity').value);
            
            // Create product object
            const product = {
                id: Date.now().toString(),
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: quantity
            };
            
            // Add to cart using the cart.js functionality
            if (typeof cart !== 'undefined' && typeof cart.addItem === 'function') {
                cart.addItem(product);
            } else {
                console.error('Cart functionality not available');
            }
        });
    }
});

// Function to change main product image
function changeImage(src) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = src;
    }
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        if (thumb.src === src) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Functions to increment/decrement quantity
function incrementQuantity() {
    const quantityInput = document.getElementById('product-quantity');
    let quantity = parseInt(quantityInput.value);
    if (quantity < 10) {
        quantityInput.value = quantity + 1;
    }
}

function decrementQuantity() {
    const quantityInput = document.getElementById('product-quantity');
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
        quantityInput.value = quantity - 1;
    }
}

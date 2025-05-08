// Checkout Page JavaScript with Stripe Integration

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let shippingCost = 5.99;
    let taxRate = 0.08; // 8% tax rate
    let promoDiscount = 0;
    let subtotal = 0;
    
    // Load cart items from localStorage
    loadCartItems();
    
    // Initialize Stripe
    initializeStripe();
    
    // Payment method toggle
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentForms = document.querySelectorAll('.payment-form');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options and forms
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            paymentForms.forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Show corresponding form
            const paymentMethod = this.querySelector('input').id;
            document.getElementById(`${paymentMethod}-form`).classList.add('active');
        });
    });
    
    // Promo code application
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function() {
            const promoCode = document.getElementById('promo-code').value.trim().toUpperCase();
            
            // Check if promo code is valid (in a real app, this would be validated against a database)
            if (promoCode === 'WELCOME10') {
                promoDiscount = subtotal * 0.1; // 10% discount
                updateOrderSummary();
                showNotification('Promo code applied successfully!');
            } else if (promoCode === 'FREESHIP') {
                shippingCost = 0;
                updateOrderSummary();
                showNotification('Free shipping applied!');
            } else {
                showNotification('Invalid promo code. Please try again.', 'error');
            }
        });
    }
    
    // Place order button
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Check which payment method is selected
            const creditCardOption = document.getElementById('credit-card');
            if (creditCardOption.checked) {
                // Process Stripe payment
                processStripePayment();
            } else {
                // Redirect to PayPal (in a real app)
                showNotification('Redirecting to PayPal...', 'info');
                setTimeout(() => {
                    window.location.href = 'order-confirmation.html';
                }, 2000);
            }
        });
    }
    
    // Function to load cart items from localStorage
    function loadCartItems() {
        const savedCart = localStorage.getItem('midasBeautyCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            const items = cartData.items || [];
            
            if (items.length > 0) {
                // Calculate subtotal
                subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                // Display items in checkout
                const checkoutItemsContainer = document.getElementById('checkout-items');
                checkoutItemsContainer.innerHTML = '';
                
                items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'checkout-item';
                    itemElement.innerHTML = `
                        <div class="checkout-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="checkout-item-details">
                            <div class="checkout-item-name">${item.name}</div>
                            <div class="checkout-item-price">$${item.price.toFixed(2)}</div>
                            <div class="checkout-item-quantity">Quantity: ${item.quantity}</div>
                        </div>
                    `;
                    checkoutItemsContainer.appendChild(itemElement);
                });
                
                // Update order summary
                updateOrderSummary();
            } else {
                // Redirect to products page if cart is empty
                window.location.href = 'products.html';
            }
        } else {
            // Redirect to products page if cart is empty
            window.location.href = 'products.html';
        }
    }
    
    // Function to update order summary
    function updateOrderSummary() {
        const tax = (subtotal - promoDiscount) * taxRate;
        const total = subtotal - promoDiscount + shippingCost + tax;
        
        document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('checkout-shipping').textContent = shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
        document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
    }
    
    // Function to validate form
    function validateForm() {
        const requiredFields = document.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields.', 'error');
        }
        
        return isValid;
    }
    
    // Function to initialize Stripe
    function initializeStripe() {
        // In a real application, you would use your own publishable key
        const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
        const elements = stripe.elements();
        
        // Create card element
        const cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#32325d',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#e74c3c',
                    iconColor: '#e74c3c'
                }
            }
        });
        
        // Mount card element
        cardElement.mount('#card-element');
        
        // Handle validation errors
        cardElement.addEventListener('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }
    
    // Function to process Stripe payment
    function processStripePayment() {
        // In a real application, you would create a payment intent on your server
        // and confirm the payment here
        
        // For demo purposes, we'll simulate a successful payment
        showNotification('Processing payment...', 'info');
        
        setTimeout(() => {
            // Simulate successful payment
            showNotification('Payment successful!', 'success');
            
            // Clear cart
            localStorage.removeItem('midasBeautyCart');
            
            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = 'order-confirmation.html';
            }, 1500);
        }, 2000);
    }
    
    // Function to show notification
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});

// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('midasBeautyCurrentUser'));
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Update user information
    updateUserInfo(currentUser);
    
    // Load user data
    loadUserData(currentUser);
    
    // Tab functionality
    const menuLinks = document.querySelectorAll('.dashboard-menu a');
    const tabPanes = document.querySelectorAll('.dashboard-content .tab-pane');
    
    menuLinks.forEach(link => {
        if (link.id !== 'logout-btn') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links and panes
                menuLinks.forEach(l => l.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Show corresponding tab pane
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        }
    });
    
    // Dashboard box links
    const dashboardBoxLinks = document.querySelectorAll('.dashboard-box .btn');
    dashboardBoxLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabId = this.getAttribute('data-tab');
            const tabLink = document.querySelector(`.dashboard-menu a[data-tab="${tabId}"]`);
            
            if (tabLink) {
                tabLink.click();
            }
        });
    });
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    const logoutLink = document.getElementById('logout-link');
    
    [logoutBtn, logoutLink].forEach(element => {
        if (element) {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove current user from localStorage
                localStorage.removeItem('midasBeautyCurrentUser');
                
                // Show notification
                showNotification('You have been logged out successfully.', 'info');
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            });
        }
    });
    
    // Account form submission
    const accountForm = document.getElementById('account-form');
    if (accountForm) {
        // Pre-fill form with user data
        document.getElementById('account-first-name').value = currentUser.firstName || '';
        document.getElementById('account-last-name').value = currentUser.lastName || '';
        document.getElementById('account-email').value = currentUser.email || '';
        
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('account-first-name').value;
            const lastName = document.getElementById('account-last-name').value;
            const email = document.getElementById('account-email').value;
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;
            
            // Validate form
            if (!firstName || !lastName || !email) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Check if email is changed and already exists
            if (email !== currentUser.email) {
                const users = JSON.parse(localStorage.getItem('midasBeautyUsers') || '[]');
                if (users.some(user => user.email === email && user.id !== currentUser.id)) {
                    showNotification('An account with this email already exists.', 'error');
                    return;
                }
            }
            
            // Check password change
            if (newPassword || confirmNewPassword) {
                if (newPassword !== confirmNewPassword) {
                    showNotification('New passwords do not match.', 'error');
                    return;
                }
                
                if (newPassword.length < 8) {
                    showNotification('New password must be at least 8 characters long.', 'error');
                    return;
                }
                
                // Verify current password
                const users = JSON.parse(localStorage.getItem('midasBeautyUsers') || '[]');
                const user = users.find(u => u.id === currentUser.id);
                
                if (!currentPassword || user.password !== currentPassword) {
                    showNotification('Current password is incorrect.', 'error');
                    return;
                }
            }
            
            // Update user data
            updateUserData(currentUser.id, {
                firstName,
                lastName,
                email,
                password: newPassword || undefined
            });
            
            // Update current user in localStorage
            localStorage.setItem('midasBeautyCurrentUser', JSON.stringify({
                ...currentUser,
                firstName,
                lastName,
                email
            }));
            
            // Update UI
            updateUserInfo({
                ...currentUser,
                firstName,
                lastName,
                email
            });
            
            // Clear password fields
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-new-password').value = '';
            
            showNotification('Account details updated successfully.', 'success');
        });
    }
    
    // Address form functionality
    const editShippingBtn = document.getElementById('edit-shipping');
    const editBillingBtn = document.getElementById('edit-billing');
    
    if (editShippingBtn) {
        editShippingBtn.addEventListener('click', function() {
            // In a real application, this would open a form to add/edit shipping address
            showNotification('Address editing functionality is not available in this demo.', 'info');
        });
    }
    
    if (editBillingBtn) {
        editBillingBtn.addEventListener('click', function() {
            // In a real application, this would open a form to add/edit billing address
            showNotification('Address editing functionality is not available in this demo.', 'info');
        });
    }
});

// Function to update user information in the UI
function updateUserInfo(user) {
    document.getElementById('user-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('greeting-name').textContent = user.firstName;
    document.getElementById('greeting-name2').textContent = user.firstName;
}

// Function to load user data
function loadUserData(currentUser) {
    // In a real application, you would load orders, addresses, wishlist, etc. from a server
    // For demo purposes, we'll use localStorage
    
    // Load orders
    const orders = JSON.parse(localStorage.getItem('midasBeautyOrders') || '[]');
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    const recentOrdersContainer = document.getElementById('recent-orders');
    const ordersListContainer = document.getElementById('orders-list');
    
    if (userOrders.length > 0) {
        // Display recent orders in dashboard
        recentOrdersContainer.innerHTML = `
            <div class="recent-order">
                <p><strong>Order #${userOrders[0].orderNumber}</strong></p>
                <p>Date: ${new Date(userOrders[0].date).toLocaleDateString()}</p>
                <p>Status: ${userOrders[0].status}</p>
                <p>Total: $${userOrders[0].total.toFixed(2)}</p>
            </div>
        `;
        
        // Display all orders in orders tab
        ordersListContainer.innerHTML = `
            <table class="orders-table">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${userOrders.map(order => `
                        <tr>
                            <td>#${order.orderNumber}</td>
                            <td>${new Date(order.date).toLocaleDateString()}</td>
                            <td>${order.status}</td>
                            <td>$${order.total.toFixed(2)}</td>
                            <td><a href="#" class="view-order" data-id="${order.id}">View</a></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    // Load addresses
    const addresses = JSON.parse(localStorage.getItem('midasBeautyAddresses') || '[]');
    const userAddresses = addresses.filter(address => address.userId === currentUser.id);
    
    const shippingAddressContainer = document.getElementById('shipping-address');
    const billingAddressContainer = document.getElementById('billing-address');
    
    userAddresses.forEach(address => {
        if (address.type === 'shipping') {
            shippingAddressContainer.innerHTML = `
                <p>${address.firstName} ${address.lastName}</p>
                <p>${address.address1}</p>
                ${address.address2 ? `<p>${address.address2}</p>` : ''}
                <p>${address.city}, ${address.state} ${address.zip}</p>
                <p>${address.country}</p>
            `;
            document.getElementById('edit-shipping').textContent = 'Edit Address';
        } else if (address.type === 'billing') {
            billingAddressContainer.innerHTML = `
                <p>${address.firstName} ${address.lastName}</p>
                <p>${address.address1}</p>
                ${address.address2 ? `<p>${address.address2}</p>` : ''}
                <p>${address.city}, ${address.state} ${address.zip}</p>
                <p>${address.country}</p>
            `;
            document.getElementById('edit-billing').textContent = 'Edit Address';
        }
    });
    
    // Load wishlist
    const wishlist = JSON.parse(localStorage.getItem('midasBeautyWishlist') || '[]');
    const userWishlist = wishlist.filter(item => item.userId === currentUser.id);
    
    const wishlistPreviewContainer = document.getElementById('wishlist-preview');
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    
    if (userWishlist.length > 0) {
        // Display wishlist preview in dashboard
        wishlistPreviewContainer.innerHTML = `
            <div class="wishlist-preview-item">
                <p><strong>${userWishlist[0].productName}</strong></p>
                <p>$${userWishlist[0].price.toFixed(2)}</p>
            </div>
        `;
        
        // Display all wishlist items in wishlist tab
        wishlistItemsContainer.innerHTML = `
            <div class="wishlist-grid">
                ${userWishlist.map(item => `
                    <div class="wishlist-item">
                        <img src="${item.image}" alt="${item.productName}">
                        <h3>${item.productName}</h3>
                        <p class="price">$${item.price.toFixed(2)}</p>
                        <div class="wishlist-actions">
                            <button class="btn add-to-cart-btn" data-id="${item.productId}">Add to Cart</button>
                            <button class="btn remove-wishlist-btn" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Function to update user data in localStorage
function updateUserData(userId, updates) {
    const users = JSON.parse(localStorage.getItem('midasBeautyUsers') || '[]');
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        // Remove undefined values
        Object.keys(users[userIndex]).forEach(key => {
            if (users[userIndex][key] === undefined) {
                delete users[userIndex][key];
            }
        });
        
        // Save to localStorage
        localStorage.setItem('midasBeautyUsers', JSON.stringify(users));
    }
}

// Function to show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
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

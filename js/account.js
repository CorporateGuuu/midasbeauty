// Account Pages JavaScript

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
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Validate form
            if (!email || !password) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // In a real application, you would send this data to a server for authentication
            // For demo purposes, we'll simulate a successful login
            
            // Check if the user exists in localStorage
            const users = JSON.parse(localStorage.getItem('midasBeautyUsers') || '[]');
            const user = users.find(u => u.email === email);
            
            if (user && user.password === password) {
                // Store logged in user
                localStorage.setItem('midasBeautyCurrentUser', JSON.stringify({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    rememberMe: rememberMe
                }));
                
                showNotification('Login successful! Redirecting to your account...', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showNotification('Invalid email or password. Please try again.', 'error');
            }
        });
    }
    
    // Registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAgreed = document.getElementById('terms-agree').checked;
            
            // Validate form
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match.', 'error');
                return;
            }
            
            if (password.length < 8) {
                showNotification('Password must be at least 8 characters long.', 'error');
                return;
            }
            
            if (!termsAgreed) {
                showNotification('You must agree to the Terms and Conditions.', 'error');
                return;
            }
            
            // In a real application, you would send this data to a server for registration
            // For demo purposes, we'll store it in localStorage
            
            // Check if email already exists
            const users = JSON.parse(localStorage.getItem('midasBeautyUsers') || '[]');
            if (users.some(user => user.email === email)) {
                showNotification('An account with this email already exists.', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password, // In a real app, this would be hashed
                createdAt: new Date().toISOString()
            };
            
            // Add to users array
            users.push(newUser);
            localStorage.setItem('midasBeautyUsers', JSON.stringify(users));
            
            // Store logged in user
            localStorage.setItem('midasBeautyCurrentUser', JSON.stringify({
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                rememberMe: true
            }));
            
            showNotification('Account created successfully! Redirecting to your dashboard...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
    
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            if (!email) {
                showNotification('Please enter your email address first.', 'error');
                return;
            }
            
            // In a real application, you would send a password reset email
            showNotification('Password reset instructions have been sent to your email.', 'info');
        });
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    if (socialButtons.length > 0) {
        socialButtons.forEach(button => {
            button.addEventListener('click', function() {
                const provider = this.classList.contains('facebook') ? 'Facebook' : 'Google';
                showNotification(`${provider} login is not available in this demo.`, 'info');
            });
        });
    }
    
    // Check if user is already logged in
    function checkLoggedInUser() {
        const currentUser = JSON.parse(localStorage.getItem('midasBeautyCurrentUser'));
        if (currentUser && window.location.pathname.includes('login.html')) {
            // Redirect to dashboard if already logged in
            window.location.href = 'dashboard.html';
        }
    }
    
    // Call on page load
    checkLoggedInUser();
});

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

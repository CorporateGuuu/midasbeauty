// Main JavaScript file for Midas Beauty website

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkUserLoginStatus();

    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn');

    addToCartButtons.forEach(button => {
        if (button.textContent === 'Add to Cart') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productName = this.parentElement.querySelector('h3').textContent;
                alert(`${productName} has been added to your cart!`);
            });
        }
    });

    // Product category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (categoryButtons.length > 0 && productCards.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                const category = this.getAttribute('data-category');

                // Show/hide products based on category
                productCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // In a real application, you would send this data to a server
            // For now, we'll just show an alert
            alert(`Thank you for your message, ${name}! We will get back to you soon.`);

            // Clear the form
            contactForm.reset();
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Function to check if user is logged in and update UI accordingly
function checkUserLoginStatus() {
    const accountLink = document.getElementById('account-link');
    if (accountLink) {
        const currentUser = JSON.parse(localStorage.getItem('midasBeautyCurrentUser'));

        if (currentUser) {
            // User is logged in, update account link to go to dashboard
            accountLink.href = 'dashboard.html';
            accountLink.innerHTML = `<i class="fas fa-user"></i>`;

            // Add tooltip with user name
            accountLink.setAttribute('title', `${currentUser.firstName} ${currentUser.lastName}`);
        } else {
            // User is not logged in, keep default link to login page
            accountLink.href = 'login.html';
            accountLink.innerHTML = `<i class="fas fa-user"></i>`;
            accountLink.setAttribute('title', 'Login / Register');
        }
    }
}

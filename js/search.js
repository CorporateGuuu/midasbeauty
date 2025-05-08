// Search Functionality JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Product database - in a real application, this would come from a server
    const products = [
        {
            id: 1,
            name: "Radiance Serum",
            category: "skincare",
            price: 49.99,
            image: "images/products/radiance-serum.jpg",
            description: "Our premium brightening serum combines 20% Vitamin C with hyaluronic acid to boost collagen production, reduce fine lines, and deliver intense hydration.",
            url: "product-details/radiance-serum.html"
        },
        {
            id: 2,
            name: "Hydrating Moisturizer",
            category: "skincare",
            price: 39.99,
            image: "images/products/hydrating-moisturizer.jpg",
            description: "This luxurious moisturizer features a blend of ceramides, peptides, and natural oils that lock in moisture for up to 72 hours.",
            url: "product-details/hydrating-moisturizer.html"
        },
        {
            id: 3,
            name: "Gentle Cleanser",
            category: "skincare",
            price: 29.99,
            image: "images/products/gentle-cleanser.jpg",
            description: "Our sulfate-free cleanser effectively removes makeup, dirt, and impurities without disrupting your skin's natural pH balance.",
            url: "product-details/gentle-cleanser.html"
        },
        {
            id: 4,
            name: "Liquid Foundation",
            category: "makeup",
            price: 45.99,
            image: "images/products/liquid-foundation.jpg",
            description: "This buildable, medium-to-full coverage foundation features a revolutionary formula that adapts to your skin tone and texture.",
            url: "product-details/liquid-foundation.html"
        },
        {
            id: 5,
            name: "Volumizing Mascara",
            category: "makeup",
            price: 24.99,
            image: "images/products/volumizing-mascara.jpg",
            description: "Our innovative mascara features a unique hourglass brush that coats each lash from root to tip, adding dramatic volume and length without clumping.",
            url: "product-details/volumizing-mascara.html"
        },
        {
            id: 6,
            name: "Repair Shampoo",
            category: "haircare",
            price: 32.99,
            image: "images/products/repair-shampoo.jpg",
            description: "This professional-grade repair shampoo is formulated with keratin, argan oil, and our exclusive bond-building complex to restore damaged hair from within.",
            url: "product-details/repair-shampoo.html"
        },
        {
            id: 7,
            name: "Hydrating Conditioner",
            category: "haircare",
            price: 32.99,
            image: "images/products/hydrating-conditioner.jpg",
            description: "Our intensive hydrating conditioner combines shea butter, coconut oil, and silk proteins to transform dry, damaged hair into silky, manageable locks.",
            url: "product-details/hydrating-conditioner.html"
        }
    ];
    
    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query') || '';
    
    // Update search input with query
    document.getElementById('search-input').value = query;
    
    // Display search query
    document.getElementById('search-query-display').textContent = query;
    
    // Perform search
    if (query) {
        performSearch(query);
    }
    
    // Search form submission
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchInput = document.getElementById('search-input');
            if (!searchInput.value.trim()) {
                e.preventDefault();
                showNotification('Please enter a search term.', 'error');
            }
        });
    }
    
    // Filter and sort functionality
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    
    if (categoryFilter && sortBy) {
        categoryFilter.addEventListener('change', function() {
            filterAndSortResults();
        });
        
        sortBy.addEventListener('change', function() {
            filterAndSortResults();
        });
    }
    
    // Function to perform search
    function performSearch(query) {
        // Filter products based on search query
        const searchResults = products.filter(product => {
            const searchTerms = query.toLowerCase().split(' ');
            const productText = `${product.name} ${product.category} ${product.description}`.toLowerCase();
            
            // Check if any search term is found in the product text
            return searchTerms.some(term => productText.includes(term));
        });
        
        // Store search results in session storage for filtering and sorting
        sessionStorage.setItem('searchResults', JSON.stringify(searchResults));
        
        // Display search results
        displaySearchResults(searchResults);
    }
    
    // Function to display search results
    function displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('search-results');
        const searchCount = document.getElementById('search-count');
        
        // Update search count
        searchCount.textContent = `${results.length} product${results.length !== 1 ? 's' : ''} found`;
        
        // Clear previous results
        searchResultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            // Display no results message
            searchResultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No products found matching your search criteria.</p>
                    <p>Try using different keywords or browse our <a href="products.html">product catalog</a>.</p>
                </div>
            `;
        } else {
            // Display search results
            results.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute('data-category', product.category);
                productCard.setAttribute('data-price', product.price);
                productCard.setAttribute('data-name', product.name);
                
                // Highlight search terms in product name and description
                const query = document.getElementById('search-input').value.toLowerCase();
                const searchTerms = query.split(' ').filter(term => term.length > 2);
                
                let productName = product.name;
                let productDescription = product.description;
                
                searchTerms.forEach(term => {
                    const regex = new RegExp(`(${term})`, 'gi');
                    productName = productName.replace(regex, '<span class="highlight">$1</span>');
                    productDescription = productDescription.replace(regex, '<span class="highlight">$1</span>');
                });
                
                productCard.innerHTML = `
                    <a href="${product.url}" class="product-link">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                    <h3><a href="${product.url}">${productName}</a></h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p class="description">${productDescription}</p>
                    <div class="product-buttons">
                        <a href="#" class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</a>
                        <a href="${product.url}" class="btn view-details-btn">View Details</a>
                    </div>
                `;
                
                searchResultsContainer.appendChild(productCard);
            });
            
            // Add event listeners to "Add to Cart" buttons
            const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const productId = parseInt(this.getAttribute('data-id'));
                    const product = products.find(p => p.id === productId);
                    
                    if (product && typeof cart !== 'undefined' && typeof cart.addItem === 'function') {
                        cart.addItem({
                            id: Date.now().toString(),
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: 1
                        });
                    }
                });
            });
        }
    }
    
    // Function to filter and sort search results
    function filterAndSortResults() {
        // Get stored search results
        const searchResults = JSON.parse(sessionStorage.getItem('searchResults') || '[]');
        
        // Get filter and sort values
        const categoryValue = categoryFilter.value;
        const sortValue = sortBy.value;
        
        // Filter results by category
        let filteredResults = searchResults;
        if (categoryValue !== 'all') {
            filteredResults = searchResults.filter(product => product.category === categoryValue);
        }
        
        // Sort results
        switch (sortValue) {
            case 'price-low':
                filteredResults.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredResults.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredResults.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredResults.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Relevance - keep original order
                break;
        }
        
        // Display filtered and sorted results
        displaySearchResults(filteredResults);
    }
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

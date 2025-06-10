// Enhanced Search Functionality JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Product database integration
    let products = [];

    // Load products from the comprehensive database
    function loadProductDatabase() {
        if (typeof MIDAS_BEAUTY_PRODUCTS !== 'undefined' && MIDAS_BEAUTY_PRODUCTS.products) {
            products = MIDAS_BEAUTY_PRODUCTS.products.map(product => ({
                id: product.id,
                name: product.name,
                category: product.category,
                subcategory: product.subcategory,
                price: product.salePrice || product.price,
                originalPrice: product.price,
                salePrice: product.salePrice,
                image: product.images.main,
                description: product.description,
                url: product.url,
                rating: product.rating,
                reviewCount: product.reviewCount,
                inStock: product.inStock,
                stockLevel: product.stockLevel,
                tags: product.tags,
                brand: product.brand,
                keyIngredients: product.keyIngredients,
                benefits: product.benefits,
                specifications: product.specifications,
                featured: product.featured,
                newArrival: product.newArrival,
                bestSeller: product.bestSeller
            }));
            console.log(`Loaded ${products.length} products from comprehensive database`);
        } else {
            // Fallback to sample data if comprehensive database not available
            console.log('Using fallback product data');
            products = [
        {
            id: 1,
            name: "Radiance Serum",
            category: "skincare",
            price: 49.99,
            image: "images/products/radiance-serum.jpg",
            description: "Our premium brightening serum combines 20% Vitamin C with hyaluronic acid to boost collagen production, reduce fine lines, and deliver intense hydration.",
            url: "product-details/radiance-serum.html",
            rating: 4.8,
            reviewCount: 127,
            inStock: true,
            tags: ["vitamin c", "anti-aging", "brightening", "hydrating", "serum", "premium"],
            brand: "Midas Beauty",
            skinType: ["all", "dry", "normal", "combination"],
            benefits: ["anti-aging", "brightening", "hydrating", "collagen boost"]
        },
        {
            id: 2,
            name: "Hydrating Moisturizer",
            category: "skincare",
            price: 39.99,
            image: "images/products/hydrating-moisturizer.jpg",
            description: "This luxurious moisturizer features a blend of ceramides, peptides, and natural oils that lock in moisture for up to 72 hours.",
            url: "product-details/hydrating-moisturizer.html",
            rating: 4.6,
            reviewCount: 89,
            inStock: true,
            tags: ["moisturizer", "ceramides", "peptides", "hydrating", "72-hour", "luxurious"],
            brand: "Midas Beauty",
            skinType: ["dry", "normal", "sensitive"],
            benefits: ["hydrating", "barrier repair", "long-lasting"]
        },
        {
            id: 3,
            name: "Gentle Cleanser",
            category: "skincare",
            price: 29.99,
            image: "images/products/gentle-cleanser.jpg",
            description: "Our sulfate-free cleanser effectively removes makeup, dirt, and impurities without disrupting your skin's natural pH balance.",
            url: "product-details/gentle-cleanser.html",
            rating: 4.7,
            reviewCount: 156,
            inStock: true,
            tags: ["cleanser", "sulfate-free", "gentle", "makeup remover", "ph-balanced"],
            brand: "Midas Beauty",
            skinType: ["all", "sensitive", "normal", "combination"],
            benefits: ["gentle cleansing", "makeup removal", "ph-balanced"]
        },
        {
            id: 4,
            name: "Liquid Foundation",
            category: "makeup",
            price: 45.99,
            image: "images/products/liquid-foundation.jpg",
            description: "This buildable, medium-to-full coverage foundation features a revolutionary formula that adapts to your skin tone and texture.",
            url: "product-details/liquid-foundation.html",
            rating: 4.5,
            reviewCount: 203,
            inStock: true,
            tags: ["foundation", "liquid", "buildable", "medium coverage", "full coverage", "adaptive"],
            brand: "Midas Beauty",
            shades: ["fair", "light", "medium", "tan", "deep"],
            coverage: ["medium", "full"],
            finish: ["natural", "matte"]
        },
        {
            id: 5,
            name: "Volumizing Mascara",
            category: "makeup",
            price: 24.99,
            image: "images/products/volumizing-mascara.jpg",
            description: "Our innovative mascara features a unique hourglass brush that coats each lash from root to tip, adding dramatic volume and length without clumping.",
            url: "product-details/volumizing-mascara.html",
            rating: 4.9,
            reviewCount: 312,
            inStock: true,
            tags: ["mascara", "volumizing", "lengthening", "hourglass brush", "dramatic", "no-clump"],
            brand: "Midas Beauty",
            colors: ["black", "brown", "navy"],
            effects: ["volume", "length", "dramatic"]
        },
        {
            id: 6,
            name: "Repair Shampoo",
            category: "haircare",
            price: 32.99,
            image: "images/products/repair-shampoo.jpg",
            description: "This professional-grade repair shampoo is formulated with keratin, argan oil, and our exclusive bond-building complex to restore damaged hair from within.",
            url: "product-details/repair-shampoo.html",
            rating: 4.4,
            reviewCount: 78,
            inStock: false,
            tags: ["shampoo", "repair", "keratin", "argan oil", "bond-building", "professional"],
            brand: "Midas Beauty",
            hairType: ["damaged", "dry", "chemically-treated"],
            benefits: ["repair", "strengthen", "restore"]
        },
        {
            id: 7,
            name: "Hydrating Conditioner",
            category: "haircare",
            price: 32.99,
            image: "images/products/hydrating-conditioner.jpg",
            description: "Our intensive hydrating conditioner combines shea butter, coconut oil, and silk proteins to transform dry, damaged hair into silky, manageable locks.",
            url: "product-details/hydrating-conditioner.html",
            rating: 4.6,
            reviewCount: 94,
            inStock: true,
            tags: ["conditioner", "hydrating", "shea butter", "coconut oil", "silk proteins", "intensive"],
            brand: "Midas Beauty",
            hairType: ["dry", "damaged", "normal"],
            benefits: ["hydrating", "smoothing", "manageability"]
        }
    ];
        }
    }

    // Load the product database
    loadProductDatabase();

    // Search configuration and state
    const searchConfig = {
        minQueryLength: 2,
        maxSuggestions: 5,
        debounceDelay: 300,
        fuzzyThreshold: 0.6
    };

    let searchState = {
        currentQuery: '',
        searchHistory: JSON.parse(localStorage.getItem('midasBeautySearchHistory') || '[]'),
        popularSearches: ['serum', 'foundation', 'moisturizer', 'mascara', 'cleanser'],
        searchTimeout: null
    };

    // Initialize search functionality
    initializeSearch();

    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query') || '';

    // Update search input with query
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = query;
        searchState.currentQuery = query;
    }

    // Display search query
    const searchQueryDisplay = document.getElementById('search-query-display');
    if (searchQueryDisplay) {
        searchQueryDisplay.textContent = query;
    }

    // Perform search
    if (query) {
        performSearch(query);
        addToSearchHistory(query);
    }

    // Enhanced search form functionality
    const searchForm = document.getElementById('search-form');
    if (searchForm && searchInput) {
        // Form submission
        searchForm.addEventListener('submit', function(e) {
            const trimmedQuery = searchInput.value.trim();
            if (!trimmedQuery) {
                e.preventDefault();
                showNotification('Please enter a search term.', 'error');
                return;
            }

            // Add to search history
            addToSearchHistory(trimmedQuery);
        });

        // Real-time search suggestions
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            searchState.currentQuery = query;

            // Clear previous timeout
            if (searchState.searchTimeout) {
                clearTimeout(searchState.searchTimeout);
            }

            // Debounced search suggestions
            if (query.length >= searchConfig.minQueryLength) {
                searchState.searchTimeout = setTimeout(() => {
                    showSearchSuggestions(query);
                }, searchConfig.debounceDelay);
            } else {
                hideSearchSuggestions();
            }
        });

        // Handle search input focus
        searchInput.addEventListener('focus', function() {
            if (this.value.length >= searchConfig.minQueryLength) {
                showSearchSuggestions(this.value);
            } else {
                showRecentSearches();
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                hideSearchSuggestions();
            }
        });
    }

    // Enhanced filter and sort functionality
    initializeFilters();

    // Initialize search functionality
    function initializeSearch() {
        // Create search suggestions container if it doesn't exist
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !document.getElementById('search-suggestions')) {
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.id = 'search-suggestions';
            suggestionsContainer.className = 'search-suggestions';
            searchContainer.appendChild(suggestionsContainer);
        }
    }

    // Initialize filters
    function initializeFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const brandFilter = document.getElementById('brand-filter');
        const sortBy = document.getElementById('sort-by');
        const priceFilter = document.getElementById('price-filter');
        const ratingFilter = document.getElementById('rating-filter');
        const stockFilter = document.getElementById('stock-filter');

        // Populate brand filter
        populateBrandFilter();

        // Category filter
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterAndSortResults);
        }

        // Brand filter
        if (brandFilter) {
            brandFilter.addEventListener('change', filterAndSortResults);
        }

        // Sort filter
        if (sortBy) {
            sortBy.addEventListener('change', filterAndSortResults);
        }

        // Price range filter
        if (priceFilter) {
            priceFilter.addEventListener('change', filterAndSortResults);
        }

        // Rating filter
        if (ratingFilter) {
            ratingFilter.addEventListener('change', filterAndSortResults);
        }

        // Stock filter
        if (stockFilter) {
            stockFilter.addEventListener('change', filterAndSortResults);
        }

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                // Reset all filters to default values
                if (categoryFilter) categoryFilter.value = 'all';
                if (brandFilter) brandFilter.value = 'all';
                if (sortBy) sortBy.value = 'relevance';
                if (priceFilter) priceFilter.value = 'all';
                if (ratingFilter) ratingFilter.value = 'all';
                if (stockFilter) stockFilter.value = 'all';

                // Reapply filters
                filterAndSortResults();

                showNotification('Filters cleared', 'info');
            });
        }
    }

    // Populate brand filter dropdown
    function populateBrandFilter() {
        const brandFilter = document.getElementById('brand-filter');
        if (!brandFilter) return;

        let optionsHTML = '<option value="all">All Brands</option>';

        // Get unique brands from products
        const brands = new Set();
        products.forEach(product => {
            if (product.brandName) {
                brands.add(JSON.stringify({
                    id: product.brand,
                    name: product.brandName
                }));
            }
        });

        // Sort brands alphabetically
        const sortedBrands = Array.from(brands)
            .map(brandStr => JSON.parse(brandStr))
            .sort((a, b) => a.name.localeCompare(b.name));

        sortedBrands.forEach(brand => {
            optionsHTML += `<option value="${brand.id}">${brand.name}</option>`;
        });

        brandFilter.innerHTML = optionsHTML;
    }

    // Enhanced search algorithm with fuzzy matching and relevance scoring
    function performSearch(query) {
        if (!query || query.trim().length === 0) {
            displaySearchResults([]);
            return;
        }

        const searchTerms = query.toLowerCase().trim().split(/\s+/);
        const searchResults = [];

        // Search through products with enhanced matching
        products.forEach(product => {
            const score = calculateRelevanceScore(product, searchTerms, query.toLowerCase());
            if (score > 0) {
                searchResults.push({
                    ...product,
                    relevanceScore: score
                });
            }
        });

        // Sort by relevance score (highest first)
        searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Store search results in session storage for filtering and sorting
        sessionStorage.setItem('searchResults', JSON.stringify(searchResults));
        sessionStorage.setItem('originalQuery', query);

        // Display search results
        displaySearchResults(searchResults);

        // Track search analytics
        trackSearchAnalytics(query, searchResults.length);
    }

    // Calculate relevance score for a product based on search terms
    function calculateRelevanceScore(product, searchTerms, fullQuery) {
        let score = 0;
        const weights = {
            name: 10,
            category: 5,
            tags: 8,
            description: 3,
            brand: 6,
            exactMatch: 20,
            fuzzyMatch: 2
        };

        const productText = {
            name: product.name.toLowerCase(),
            category: product.category.toLowerCase(),
            subcategory: (product.subcategory || '').toLowerCase(),
            productType: (product.productType || '').toLowerCase(),
            tags: (product.tags || []).join(' ').toLowerCase(),
            description: product.description.toLowerCase(),
            brand: (product.brand || '').toLowerCase(),
            brandName: (product.brandName || '').toLowerCase(),
            keyIngredients: (product.keyIngredients || []).join(' ').toLowerCase(),
            benefits: (product.benefits || []).join(' ').toLowerCase(),
            skinConcerns: (product.skinConcerns || []).join(' ').toLowerCase()
        };

        // Check for exact phrase match
        if (productText.name.includes(fullQuery) || productText.description.includes(fullQuery)) {
            score += weights.exactMatch;
        }

        // Check each search term
        searchTerms.forEach(term => {
            // Exact matches in different fields
            if (productText.name.includes(term)) score += weights.name;
            if (productText.category.includes(term)) score += weights.category;
            if (productText.subcategory.includes(term)) score += weights.category * 0.8;
            if (productText.productType.includes(term)) score += weights.category * 0.6;
            if (productText.tags.includes(term)) score += weights.tags;
            if (productText.description.includes(term)) score += weights.description;
            if (productText.brand.includes(term) || productText.brandName.includes(term)) score += weights.brand;
            if (productText.keyIngredients.includes(term)) score += weights.tags * 0.9;
            if (productText.benefits.includes(term)) score += weights.tags * 0.7;
            if (productText.skinConcerns.includes(term)) score += weights.tags * 0.8;

            // Fuzzy matching for typos
            Object.entries(productText).forEach(([field, text]) => {
                if (field !== 'description') { // Skip description for fuzzy to avoid noise
                    const words = text.split(/\s+/);
                    words.forEach(word => {
                        if (calculateSimilarity(term, word) >= searchConfig.fuzzyThreshold) {
                            score += weights.fuzzyMatch;
                        }
                    });
                }
            });
        });

        // Boost score for highly rated products
        if (product.rating >= 4.5) score *= 1.1;

        // Reduce score for out of stock items
        if (!product.inStock) score *= 0.7;

        return score;
    }

    // Simple string similarity calculation (Levenshtein distance based)
    function calculateSimilarity(str1, str2) {
        if (str1.length < 3 || str2.length < 3) return str1 === str2 ? 1 : 0;

        const matrix = [];
        const len1 = str1.length;
        const len2 = str2.length;

        for (let i = 0; i <= len2; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= len1; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= len2; i++) {
            for (let j = 1; j <= len1; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        const maxLen = Math.max(len1, len2);
        return (maxLen - matrix[len2][len1]) / maxLen;
    }

    // Search suggestions and autocomplete functionality
    function showSearchSuggestions(query) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) return;

        const suggestions = generateSearchSuggestions(query);

        if (suggestions.length === 0) {
            hideSearchSuggestions();
            return;
        }

        let suggestionsHTML = '<div class="suggestions-header">Suggestions</div>';
        suggestions.forEach(suggestion => {
            suggestionsHTML += `
                <div class="suggestion-item" data-query="${suggestion.query}">
                    <i class="fas fa-search"></i>
                    <span class="suggestion-text">${highlightMatch(suggestion.display, query)}</span>
                    ${suggestion.type === 'product' ? '<i class="fas fa-tag suggestion-type"></i>' : ''}
                </div>
            `;
        });

        suggestionsContainer.innerHTML = suggestionsHTML;
        suggestionsContainer.classList.add('show');

        // Add click handlers for suggestions
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                const query = this.getAttribute('data-query');
                document.getElementById('search-input').value = query;
                window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
            });
        });
    }

    function generateSearchSuggestions(query) {
        const suggestions = [];
        const queryLower = query.toLowerCase();

        // Product name suggestions
        products.forEach(product => {
            if (product.name.toLowerCase().includes(queryLower)) {
                suggestions.push({
                    query: product.name,
                    display: product.name,
                    type: 'product',
                    score: 10
                });
            }

            // Tag suggestions
            if (product.tags) {
                product.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(queryLower) &&
                        !suggestions.find(s => s.query === tag)) {
                        suggestions.push({
                            query: tag,
                            display: tag,
                            type: 'tag',
                            score: 5
                        });
                    }
                });
            }
        });

        // Category suggestions
        const categories = ['skincare', 'makeup', 'haircare'];
        categories.forEach(category => {
            if (category.includes(queryLower)) {
                suggestions.push({
                    query: category,
                    display: category.charAt(0).toUpperCase() + category.slice(1),
                    type: 'category',
                    score: 8
                });
            }
        });

        // Sort by score and limit results
        return suggestions
            .sort((a, b) => b.score - a.score)
            .slice(0, searchConfig.maxSuggestions);
    }

    function showRecentSearches() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer || searchState.searchHistory.length === 0) return;

        let suggestionsHTML = '<div class="suggestions-header">Recent Searches</div>';
        searchState.searchHistory.slice(0, 5).forEach(search => {
            suggestionsHTML += `
                <div class="suggestion-item" data-query="${search}">
                    <i class="fas fa-history"></i>
                    <span class="suggestion-text">${search}</span>
                    <i class="fas fa-times remove-history" data-query="${search}"></i>
                </div>
            `;
        });

        // Add popular searches if we have space
        if (searchState.searchHistory.length < 3) {
            suggestionsHTML += '<div class="suggestions-header">Popular Searches</div>';
            searchState.popularSearches.slice(0, 3).forEach(search => {
                suggestionsHTML += `
                    <div class="suggestion-item" data-query="${search}">
                        <i class="fas fa-fire"></i>
                        <span class="suggestion-text">${search}</span>
                    </div>
                `;
            });
        }

        suggestionsContainer.innerHTML = suggestionsHTML;
        suggestionsContainer.classList.add('show');

        // Add click handlers
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (e.target.classList.contains('remove-history')) {
                    e.stopPropagation();
                    removeFromSearchHistory(e.target.getAttribute('data-query'));
                    showRecentSearches();
                } else {
                    const query = this.getAttribute('data-query');
                    document.getElementById('search-input').value = query;
                    window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
                }
            });
        });
    }

    function hideSearchSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.remove('show');
        }
    }

    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    // Search history management
    function addToSearchHistory(query) {
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery || trimmedQuery.length < 2) return;

        // Remove if already exists
        searchState.searchHistory = searchState.searchHistory.filter(item => item !== trimmedQuery);

        // Add to beginning
        searchState.searchHistory.unshift(trimmedQuery);

        // Keep only last 10 searches
        searchState.searchHistory = searchState.searchHistory.slice(0, 10);

        // Save to localStorage
        localStorage.setItem('midasBeautySearchHistory', JSON.stringify(searchState.searchHistory));
    }

    function removeFromSearchHistory(query) {
        searchState.searchHistory = searchState.searchHistory.filter(item => item !== query);
        localStorage.setItem('midasBeautySearchHistory', JSON.stringify(searchState.searchHistory));
    }

    // Search analytics
    function trackSearchAnalytics(query, resultCount) {
        const analytics = JSON.parse(localStorage.getItem('midasBeautySearchAnalytics') || '{}');
        const today = new Date().toISOString().split('T')[0];

        if (!analytics[today]) {
            analytics[today] = { searches: [], totalSearches: 0, noResultsSearches: 0 };
        }

        analytics[today].searches.push({
            query: query,
            resultCount: resultCount,
            timestamp: new Date().toISOString()
        });

        analytics[today].totalSearches++;
        if (resultCount === 0) {
            analytics[today].noResultsSearches++;
        }

        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        Object.keys(analytics).forEach(date => {
            if (new Date(date) < thirtyDaysAgo) {
                delete analytics[date];
            }
        });

        localStorage.setItem('midasBeautySearchAnalytics', JSON.stringify(analytics));
    }

    // Enhanced function to display search results
    function displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('search-results');
        const searchCount = document.getElementById('search-count');

        if (!searchResultsContainer) return;

        // Update search count
        if (searchCount) {
            searchCount.textContent = `${results.length} product${results.length !== 1 ? 's' : ''} found`;
        }

        // Clear previous results
        searchResultsContainer.innerHTML = '';

        if (results.length === 0) {
            // Enhanced no results message with suggestions
            const originalQuery = sessionStorage.getItem('originalQuery') || '';
            searchResultsContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>No products found</h3>
                    <p>We couldn't find any products matching "${originalQuery}"</p>
                    <div class="no-results-suggestions">
                        <h4>Try these suggestions:</h4>
                        <ul>
                            <li>Check your spelling</li>
                            <li>Use more general terms</li>
                            <li>Try different keywords</li>
                        </ul>
                        <div class="popular-searches">
                            <h4>Popular searches:</h4>
                            ${searchState.popularSearches.map(term =>
                                `<a href="search-results.html?query=${encodeURIComponent(term)}" class="popular-search-tag">${term}</a>`
                            ).join('')}
                        </div>
                    </div>
                    <p><a href="products.html" class="btn">Browse All Products</a></p>
                </div>
            `;
        } else {
            // Display search results with enhanced information
            results.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute('data-category', product.category);
                productCard.setAttribute('data-price', product.price);
                productCard.setAttribute('data-rating', product.rating || 0);
                productCard.setAttribute('data-stock', product.inStock ? 'in-stock' : 'out-of-stock');
                productCard.setAttribute('data-name', product.name);

                // Highlight search terms in product name and description
                const searchInput = document.getElementById('search-input');
                const query = searchInput ? searchInput.value.toLowerCase() : '';
                const searchTerms = query.split(' ').filter(term => term.length > 1);

                let productName = product.name;
                let productDescription = product.description;

                searchTerms.forEach(term => {
                    const regex = new RegExp(`(${term})`, 'gi');
                    productName = productName.replace(regex, '<span class="highlight">$1</span>');
                    productDescription = productDescription.replace(regex, '<span class="highlight">$1</span>');
                });

                // Generate star rating
                const starRating = generateStarRating(product.rating || 0);

                // Stock status
                const stockStatus = product.inStock ?
                    '<span class="stock-status in-stock"><i class="fas fa-check"></i> In Stock</span>' :
                    '<span class="stock-status out-of-stock"><i class="fas fa-times"></i> Out of Stock</span>';

                productCard.innerHTML = `
                    <div class="product-image-container">
                        <a href="${product.url}" class="product-link">
                            <img src="${product.image}" alt="${product.name}" loading="lazy">
                        </a>
                        ${!product.inStock ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
                    </div>
                    <div class="product-info">
                        <h3><a href="${product.url}">${productName}</a></h3>
                        <div class="product-rating">
                            ${starRating}
                            <span class="review-count">(${product.reviewCount || 0} reviews)</span>
                        </div>
                        <p class="price">$${product.price.toFixed(2)}</p>
                        ${stockStatus}
                        <p class="description">${productDescription.substring(0, 120)}${productDescription.length > 120 ? '...' : ''}</p>
                        <div class="product-buttons">
                            <a href="#" class="btn add-to-cart-btn ${!product.inStock ? 'disabled' : ''}"
                               data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                               ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </a>
                            <a href="${product.url}" class="btn view-details-btn">View Details</a>
                        </div>
                    </div>
                `;

                searchResultsContainer.appendChild(productCard);
            });

            // Add event listeners to "Add to Cart" buttons
            const addToCartButtons = document.querySelectorAll('.add-to-cart-btn:not(.disabled)');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const productId = parseInt(this.getAttribute('data-id'));
                    const product = products.find(p => p.id === productId);

                    if (product && product.inStock && typeof cart !== 'undefined' && typeof cart.addItem === 'function') {
                        cart.addItem({
                            id: Date.now().toString(),
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: 1
                        });
                        showNotification(`${product.name} added to cart!`, 'success');
                    }
                });
            });
        }
    }

    // Generate star rating HTML
    function generateStarRating(rating) {
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

    // Enhanced function to filter and sort search results
    function filterAndSortResults() {
        // Get stored search results
        const searchResults = JSON.parse(sessionStorage.getItem('searchResults') || '[]');

        // Get filter values
        const categoryValue = document.getElementById('category-filter')?.value || 'all';
        const brandValue = document.getElementById('brand-filter')?.value || 'all';
        const sortValue = document.getElementById('sort-by')?.value || 'relevance';
        const priceValue = document.getElementById('price-filter')?.value || 'all';
        const ratingValue = document.getElementById('rating-filter')?.value || 'all';
        const stockValue = document.getElementById('stock-filter')?.value || 'all';

        // Apply filters
        let filteredResults = searchResults.filter(product => {
            // Category filter
            if (categoryValue !== 'all' && product.category !== categoryValue) {
                return false;
            }

            // Brand filter
            if (brandValue !== 'all' && product.brand !== brandValue) {
                return false;
            }

            // Price filter
            if (priceValue !== 'all') {
                const price = product.price;
                switch (priceValue) {
                    case 'under-25':
                        if (price >= 25) return false;
                        break;
                    case '25-40':
                        if (price < 25 || price > 40) return false;
                        break;
                    case '40-60':
                        if (price < 40 || price > 60) return false;
                        break;
                    case 'over-60':
                        if (price <= 60) return false;
                        break;
                }
            }

            // Rating filter
            if (ratingValue !== 'all') {
                const rating = product.rating || 0;
                const minRating = parseFloat(ratingValue);
                if (rating < minRating) return false;
            }

            // Stock filter
            if (stockValue !== 'all') {
                if (stockValue === 'in-stock' && !product.inStock) return false;
                if (stockValue === 'out-of-stock' && product.inStock) return false;
            }

            return true;
        });

        // Apply sorting
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
            case 'rating':
                filteredResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'popularity':
                filteredResults.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
                break;
            default:
                // Relevance - sort by relevance score if available, otherwise keep original order
                if (filteredResults.length > 0 && filteredResults[0].relevanceScore !== undefined) {
                    filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
                }
                break;
        }

        // Display filtered and sorted results
        displaySearchResults(filteredResults);

        // Update filter counts
        updateFilterCounts(searchResults);
    }

    // Update filter option counts
    function updateFilterCounts(allResults) {
        // Update category counts
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            const categoryCounts = {};
            allResults.forEach(product => {
                categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
            });

            Array.from(categoryFilter.options).forEach(option => {
                if (option.value !== 'all') {
                    const count = categoryCounts[option.value] || 0;
                    const originalText = option.textContent.split(' (')[0];
                    option.textContent = `${originalText} (${count})`;
                }
            });
        }
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

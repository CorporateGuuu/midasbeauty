# Midas Beauty Website

A modern, responsive website for a fictional beauty brand called Midas Beauty with comprehensive search functionality.

## Features

- Responsive design that works on all devices
- **Enhanced Search Functionality**:
  - Real-time search suggestions and autocomplete
  - Fuzzy search with typo tolerance
  - Advanced filtering (category, price, rating, availability)
  - Search history and popular searches
  - Relevance-based search algorithm
  - Search term highlighting in results
  - Search analytics tracking
- Product catalog with category filtering
- Contact form
- About page
- Clean, modern UI with smooth animations
- Shopping cart functionality

## Pages

- Home page with featured products and testimonials
- Products page with category filtering
- **Enhanced Search Results page** with advanced filters and sorting
- About page with company information
- Contact page with a contact form
- **Test Search page** (`test-search.html`) for testing search functionality

## Search Features

### 1. Enhanced Search Algorithm
- **Fuzzy Search**: Handles typos and similar spellings
- **Relevance Scoring**: Results ranked by relevance with weighted scoring
- **Multi-field Search**: Searches across product names, descriptions, categories, tags, and brands
- **Exact Match Boost**: Prioritizes exact phrase matches

### 2. Search Suggestions & Autocomplete
- **Real-time Suggestions**: Shows suggestions as you type
- **Product Name Suggestions**: Direct product matches
- **Category Suggestions**: Search by product categories
- **Tag-based Suggestions**: Search by product tags and attributes
- **Recent Searches**: Shows your search history
- **Popular Searches**: Displays trending search terms

### 3. Advanced Filtering & Sorting
- **Category Filter**: Filter by skincare, makeup, haircare
- **Price Range Filter**: Filter by price ranges
- **Rating Filter**: Filter by customer ratings (4.5+, 4.0+, etc.)
- **Availability Filter**: Filter by stock status
- **Multiple Sort Options**: Sort by relevance, price, name, rating, popularity
- **Clear Filters**: Reset all filters with one click

### 4. Enhanced User Experience
- **Search History**: Automatically saves and displays recent searches
- **Search Analytics**: Tracks search patterns and popular terms
- **No Results Handling**: Helpful suggestions when no products are found
- **Search Term Highlighting**: Highlights matching terms in results
- **Mobile Responsive**: Optimized search experience on all devices

### 5. Product Information Enhancement
- **Star Ratings**: Visual rating display with review counts
- **Stock Status**: Clear in-stock/out-of-stock indicators
- **Product Tags**: Enhanced searchability with product tags
- **Product Attributes**: Detailed product metadata for better search

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Netlify for hosting
- LocalStorage for cart persistence and search data

## Testing

Use the `test-search.html` page to test various search features:
- Search suggestions and autocomplete
- Search algorithm with different queries
- Search history functionality
- Fuzzy search with typos
- Full search results page experience

## Deployment

This site is configured to be deployed on Netlify. The `netlify.toml` file contains the necessary configuration for deployment.

## Local Development

To run this site locally:
1. Start a local server: `python3 -m http.server 8000`
2. Open `http://localhost:8000` in your browser
3. Test search functionality at `http://localhost:8000/test-search.html`

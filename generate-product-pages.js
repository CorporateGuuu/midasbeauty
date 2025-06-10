// Product Page Generator for Midas Beauty
// Generates individual product detail pages from the product database

const fs = require('fs');
const path = require('path');

// Import product database (for Node.js environment)
const MIDAS_BEAUTY_PRODUCTS = require('./js/products-database.js');

// Create product-details directory if it doesn't exist
const productDetailsDir = path.join(__dirname, 'product-details');
if (!fs.existsSync(productDetailsDir)) {
    fs.mkdirSync(productDetailsDir, { recursive: true });
}

// Read the template file
const templatePath = path.join(__dirname, 'product-detail-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

function createSlug(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

function generateProductPage(product) {
    let productHTML = template;
    
    // Replace meta information
    productHTML = productHTML.replace(
        /<title>.*?<\/title>/,
        `<title>${product.seoTitle || `${product.name} | Midas Beauty`}</title>`
    );
    
    productHTML = productHTML.replace(
        /<meta name="description" content=".*?">/,
        `<meta name="description" content="${product.metaDescription || product.description.substring(0, 160)}...">`
    );
    
    productHTML = productHTML.replace(
        /<meta name="keywords" content=".*?">/,
        `<meta name="keywords" content="${product.tags.join(', ')}, midas beauty, premium beauty"`
    );
    
    // Update Open Graph tags
    productHTML = productHTML.replace(
        /<meta property="og:title" content=".*?">/,
        `<meta property="og:title" content="${product.name} | Midas Beauty">`
    );
    
    productHTML = productHTML.replace(
        /<meta property="og:description" content=".*?">/,
        `<meta property="og:description" content="${product.metaDescription || product.description.substring(0, 160)}...">`
    );
    
    productHTML = productHTML.replace(
        /<meta property="og:image" content=".*?">/,
        `<meta property="og:image" content="../${product.images.main}"`
    );
    
    productHTML = productHTML.replace(
        /<meta property="og:url" content=".*?">/,
        `<meta property="og:url" content="https://midasbeauty.com/product-details/${createSlug(product.name)}.html"`
    );
    
    // Update structured data
    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "brand": {
            "@type": "Brand",
            "name": product.brand
        },
        "description": product.description,
        "image": product.images.gallery ? [product.images.main, ...product.images.gallery] : [product.images.main],
        "sku": `MB-${product.id.toString().padStart(4, '0')}`,
        "category": product.category,
        "offers": {
            "@type": "Offer",
            "price": product.salePrice || product.price,
            "priceCurrency": product.currency,
            "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "Midas Beauty"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.reviewCount
        }
    };
    
    productHTML = productHTML.replace(
        /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
        `<script type="application/ld+json">\n    ${JSON.stringify(structuredData, null, 4)}\n    </script>`
    );
    
    return productHTML;
}

function generateAllProductPages() {
    console.log('🏭 Generating individual product detail pages...');
    
    let generatedCount = 0;
    let skippedCount = 0;
    
    MIDAS_BEAUTY_PRODUCTS.products.forEach(product => {
        try {
            const slug = createSlug(product.name);
            const filename = `${slug}.html`;
            const filepath = path.join(productDetailsDir, filename);
            
            // Generate the product page HTML
            const productHTML = generateProductPage(product);
            
            // Write the file
            fs.writeFileSync(filepath, productHTML, 'utf8');
            
            console.log(`✅ Generated: ${filename}`);
            generatedCount++;
            
            // Update the product URL in the database (for reference)
            product.url = `product-details/${filename}`;
            
        } catch (error) {
            console.error(`❌ Error generating page for ${product.name}:`, error.message);
            skippedCount++;
        }
    });
    
    console.log(`\n📊 Generation Summary:`);
    console.log(`✅ Successfully generated: ${generatedCount} pages`);
    console.log(`❌ Skipped due to errors: ${skippedCount} pages`);
    console.log(`📁 Pages saved to: ${productDetailsDir}`);
    
    // Generate an index file for easy navigation
    generateProductIndex();
}

function generateProductIndex() {
    console.log('\n📋 Generating product index page...');
    
    const indexHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Index - Midas Beauty</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .product-index {
            padding: 40px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .category-section {
            margin-bottom: 40px;
        }
        .category-title {
            font-size: 2rem;
            color: #d4af37;
            margin-bottom: 20px;
            border-bottom: 2px solid #d4af37;
            padding-bottom: 10px;
        }
        .product-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        .product-item {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .product-item:hover {
            transform: translateY(-5px);
        }
        .product-name {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .product-price {
            color: #d4af37;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .product-link {
            color: #1a1a1a;
            text-decoration: none;
            display: block;
        }
        .stats {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="product-index">
        <h1>Midas Beauty Product Index</h1>
        
        <div class="stats">
            <h2>📊 Product Database Statistics</h2>
            <p><strong>Total Products:</strong> ${MIDAS_BEAUTY_PRODUCTS.products.length}</p>
            <p><strong>Categories:</strong> ${Object.keys(MIDAS_BEAUTY_PRODUCTS.categories).length}</p>
            <p><strong>Generated Pages:</strong> ${MIDAS_BEAUTY_PRODUCTS.products.length}</p>
        </div>
        
        ${Object.entries(MIDAS_BEAUTY_PRODUCTS.categories).map(([categoryKey, categoryData]) => {
            const categoryProducts = MIDAS_BEAUTY_PRODUCTS.products.filter(p => p.category === categoryKey);
            
            return `
                <div class="category-section">
                    <h2 class="category-title">${categoryData.name} (${categoryProducts.length} products)</h2>
                    <div class="product-list">
                        ${categoryProducts.map(product => {
                            const slug = createSlug(product.name);
                            return `
                                <div class="product-item">
                                    <a href="${slug}.html" class="product-link">
                                        <div class="product-name">${product.name}</div>
                                        <div class="product-price">$${product.price.toFixed(2)}</div>
                                        <div class="product-category">${categoryData.subcategories[product.subcategory] || product.subcategory}</div>
                                        <div class="product-rating">⭐ ${product.rating} (${product.reviewCount} reviews)</div>
                                        <div class="product-stock">${product.inStock ? '✅ In Stock' : '❌ Out of Stock'}</div>
                                    </a>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('')}
        
        <div style="margin-top: 40px; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 10px;">
            <p><strong>🎉 All product pages generated successfully!</strong></p>
            <p>Each product has its own dedicated page with luxury design, SEO optimization, and PWA support.</p>
            <a href="../index.html" style="color: #d4af37; text-decoration: none; font-weight: 600;">← Back to Main Site</a>
        </div>
    </div>
</body>
</html>`;
    
    const indexPath = path.join(productDetailsDir, 'index.html');
    fs.writeFileSync(indexPath, indexHTML, 'utf8');
    
    console.log(`✅ Product index generated: ${indexPath}`);
}

// Run the generator
if (require.main === module) {
    generateAllProductPages();
}

module.exports = { generateAllProductPages, generateProductPage, createSlug };

// PWA Icon Generator for Midas Beauty
// Generates all required PWA icons with proper maskable areas and branding

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Icon sizes required for PWA
const iconSizes = [
    { size: 72, name: 'icon-72x72.png', purpose: 'any' },
    { size: 96, name: 'icon-96x96.png', purpose: 'any' },
    { size: 128, name: 'icon-128x128.png', purpose: 'any' },
    { size: 144, name: 'icon-144x144.png', purpose: 'any' },
    { size: 152, name: 'icon-152x152.png', purpose: 'any' },
    { size: 192, name: 'icon-192x192.png', purpose: 'any maskable' },
    { size: 384, name: 'icon-384x384.png', purpose: 'any' },
    { size: 512, name: 'icon-512x512.png', purpose: 'any maskable' },
    // Additional sizes for better compatibility
    { size: 16, name: 'icon-16x16.png', purpose: 'any' },
    { size: 32, name: 'icon-32x32.png', purpose: 'any' },
    { size: 180, name: 'icon-180x180.png', purpose: 'any' }, // Apple touch icon
    { size: 256, name: 'icon-256x256.png', purpose: 'any' }
];

// Midas Beauty brand colors
const colors = {
    primaryGold: '#d4af37',
    accentGold: '#b8860b',
    deepBlack: '#1a1a1a',
    richWhite: '#fefefe'
};

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'images', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

function createMidasBeautyIcon(size, isMaskable = false) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Calculate safe area for maskable icons (80% of total size)
    const safeArea = isMaskable ? size * 0.8 : size;
    const offset = isMaskable ? size * 0.1 : 0;
    
    // Background
    if (isMaskable) {
        // Full background for maskable icons
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, colors.primaryGold);
        gradient.addColorStop(0.5, colors.accentGold);
        gradient.addColorStop(1, colors.primaryGold);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
    } else {
        // Rounded background for regular icons
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, colors.primaryGold);
        gradient.addColorStop(1, colors.accentGold);
        ctx.fillStyle = gradient;
        
        const radius = size * 0.15;
        ctx.beginPath();
        ctx.roundRect(0, 0, size, size, radius);
        ctx.fill();
    }
    
    // Add subtle texture/pattern
    ctx.globalCompositeOperation = 'overlay';
    const patternSize = Math.max(2, size / 50);
    for (let x = 0; x < size; x += patternSize * 2) {
        for (let y = 0; y < size; y += patternSize * 2) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(x, y, patternSize, patternSize);
        }
    }
    ctx.globalCompositeOperation = 'source-over';
    
    // Main "M" letter
    ctx.fillStyle = colors.deepBlack;
    ctx.font = `bold ${safeArea * 0.5}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', size / 2, size / 2);
    
    // Add highlight effect
    ctx.fillStyle = colors.richWhite;
    ctx.font = `bold ${safeArea * 0.5}px serif`;
    ctx.globalAlpha = 0.3;
    ctx.fillText('M', size / 2 - 1, size / 2 - 1);
    ctx.globalAlpha = 1;
    
    // Add crown/luxury element above M for larger icons
    if (size >= 144) {
        const crownSize = safeArea * 0.15;
        const crownY = size / 2 - safeArea * 0.25;
        
        ctx.fillStyle = colors.deepBlack;
        ctx.beginPath();
        // Simple crown shape
        ctx.moveTo(size / 2 - crownSize, crownY);
        ctx.lineTo(size / 2 - crownSize/2, crownY - crownSize/2);
        ctx.lineTo(size / 2, crownY);
        ctx.lineTo(size / 2 + crownSize/2, crownY - crownSize/2);
        ctx.lineTo(size / 2 + crownSize, crownY);
        ctx.lineTo(size / 2 + crownSize, crownY + crownSize/3);
        ctx.lineTo(size / 2 - crownSize, crownY + crownSize/3);
        ctx.closePath();
        ctx.fill();
    }
    
    return canvas;
}

// Generate all icons
async function generateAllIcons() {
    console.log('🎨 Generating Midas Beauty PWA icons...');
    
    for (const iconConfig of iconSizes) {
        const { size, name, purpose } = iconConfig;
        const isMaskable = purpose.includes('maskable');
        
        console.log(`📱 Creating ${name} (${size}x${size}${isMaskable ? ' - maskable' : ''})`);
        
        const canvas = createMidasBeautyIcon(size, isMaskable);
        const buffer = canvas.toBuffer('image/png');
        
        const iconPath = path.join(iconsDir, name);
        fs.writeFileSync(iconPath, buffer);
        
        console.log(`✅ Saved: ${iconPath}`);
    }
    
    // Generate favicon.ico (16x16 and 32x32 combined)
    console.log('🔖 Generating favicon.ico...');
    const favicon16 = createMidasBeautyIcon(16);
    const favicon32 = createMidasBeautyIcon(32);
    
    // Save individual favicon sizes
    fs.writeFileSync(path.join(__dirname, 'images', 'favicon-16x16.png'), favicon16.toBuffer('image/png'));
    fs.writeFileSync(path.join(__dirname, 'images', 'favicon-32x32.png'), favicon32.toBuffer('image/png'));
    
    console.log('🎉 All icons generated successfully!');
    console.log(`📁 Icons saved to: ${iconsDir}`);
    
    // Generate icon verification HTML
    generateIconVerificationPage();
}

function generateIconVerificationPage() {
    const verificationHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PWA Icon Verification - Midas Beauty</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; margin: 20px 0; }
        .icon-item { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
        .icon-item img { max-width: 100px; max-height: 100px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .icon-info { margin-top: 10px; font-size: 12px; color: #666; }
        h1 { color: #d4af37; text-align: center; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Midas Beauty PWA Icons</h1>
        <div class="status success">
            ✅ All PWA icons generated successfully! Icons are optimized for different platforms and use cases.
        </div>
        
        <h2>📱 Generated Icons</h2>
        <div class="icon-grid">
            ${iconSizes.map(({ size, name, purpose }) => `
                <div class="icon-item">
                    <img src="images/icons/${name}" alt="${name}" />
                    <div class="icon-info">
                        <strong>${size}x${size}</strong><br>
                        ${name}<br>
                        <em>${purpose}</em>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <h2>🔍 Icon Usage</h2>
        <ul>
            <li><strong>16x16, 32x32:</strong> Browser favicon and tabs</li>
            <li><strong>72x72, 96x96:</strong> Android home screen (older devices)</li>
            <li><strong>128x128, 144x144:</strong> Windows tiles and Android</li>
            <li><strong>152x152:</strong> iPad home screen</li>
            <li><strong>180x180:</strong> iPhone home screen</li>
            <li><strong>192x192:</strong> Android home screen (standard)</li>
            <li><strong>256x256:</strong> Windows store</li>
            <li><strong>384x384, 512x512:</strong> Android splash screen and large displays</li>
        </ul>
        
        <h2>✨ Maskable Icons</h2>
        <p>Icons marked as "maskable" (192x192 and 512x512) are designed to work with adaptive icon systems on Android, ensuring the icon looks good when cropped to different shapes (circle, square, rounded square).</p>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(path.join(__dirname, 'icon-verification.html'), verificationHTML);
    console.log('📄 Icon verification page created: icon-verification.html');
}

// Polyfill for roundRect if needed
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

// Run the generator
if (require.main === module) {
    generateAllIcons().catch(console.error);
}

module.exports = { generateAllIcons, createMidasBeautyIcon };

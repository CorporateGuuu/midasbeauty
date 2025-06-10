#!/bin/bash

# MidasBeauty Comprehensive E-commerce Deployment Script
# This script deploys all features to GitHub and triggers Netlify deployment

echo "🚀 MidasBeauty Comprehensive E-commerce Deployment"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the MidasBeauty project root."
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git remote add origin https://github.com/CorporateGuuu/midasbeauty.git
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already initialized"
fi

echo ""

# Check git status
echo "📊 Checking current Git status..."
git status --short
echo ""

# Add all files
echo "📦 Adding all files to Git..."
git add .

# Show what will be committed
echo "📋 Files to be committed:"
git diff --cached --name-only
echo ""

# Create comprehensive commit message
COMMIT_MESSAGE="🚀 Deploy comprehensive MidasBeauty e-commerce platform

✨ Features Added:
• Professional header redesign with mobile responsiveness
• Auth0 authentication system with user management  
• Comprehensive product database (50+ products, 15 brands)
• Customer dashboard with account management
• Admin dashboard with inventory management
• Product recommendation engine
• Enhanced search and filtering capabilities
• E-commerce management systems
• Mobile optimization and responsive design
• Luxury brand aesthetic throughout

🔧 Technical Improvements:
• Advanced JavaScript architecture
• Modular CSS organization
• Performance optimizations
• Security enhancements
• SEO improvements
• Netlify configuration optimization

📊 Business Impact:
• Complete e-commerce functionality
• Professional luxury brand positioning
• Scalable architecture for growth
• Enhanced user experience
• Comprehensive admin tools

Files deployed: $(git diff --cached --name-only | wc -l) files
Deployment date: $(date)"

# Commit changes
echo "💾 Committing changes..."
git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    echo "✅ Changes committed successfully"
else
    echo "❌ Commit failed"
    exit 1
fi

echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
echo "Repository: https://github.com/CorporateGuuu/midasbeauty.git"
echo "Branch: main"
echo ""

# Try to push
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
else
    echo "⚠️ Push failed. Trying force push..."
    echo "This will overwrite the remote repository with local changes."
    read -p "Continue with force push? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin main --force
        if [ $? -eq 0 ]; then
            echo "✅ Force push successful!"
        else
            echo "❌ Force push failed"
            exit 1
        fi
    else
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "📋 Next Steps:"
echo "1. ✅ Code pushed to GitHub: https://github.com/CorporateGuuu/midasbeauty"
echo "2. 🔄 Netlify will auto-deploy (2-3 minutes)"
echo "3. 🌐 Live site will update: https://midasbeauty.shop/"
echo "4. 🔐 Update Auth0 configuration for live domain"
echo "5. 🧪 Run deployment verification tests"
echo ""
echo "🔗 Important Links:"
echo "• Live Website: https://midasbeauty.shop/"
echo "• GitHub Repository: https://github.com/CorporateGuuu/midasbeauty"
echo "• Netlify Dashboard: https://app.netlify.com/"
echo "• Auth0 Dashboard: https://manage.auth0.com/"
echo ""
echo "🔐 Auth0 Configuration Required:"
echo "Update these URLs in your Auth0 dashboard:"
echo "• Callback URLs: https://midasbeauty.shop, https://midasbeauty.shop/"
echo "• Logout URLs: https://midasbeauty.shop, https://midasbeauty.shop/"
echo "• Web Origins: https://midasbeauty.shop"
echo ""
echo "🧪 Verification:"
echo "After deployment completes, run the verification script:"
echo "1. Open https://midasbeauty.shop/ in browser"
echo "2. Open browser console (F12)"
echo "3. Run: deploymentVerifier.runAllTests()"
echo ""
echo "⚙️ Admin Access:"
echo "• Admin Dashboard: https://midasbeauty.shop/#admin"
echo "• Admin Password: midas_admin_2024"
echo ""
echo "🎯 Expected Features on Live Site:"
echo "✅ Professional header with mobile menu"
echo "✅ Auth0 secure authentication"
echo "✅ 50+ luxury beauty products"
echo "✅ Advanced search and filtering"
echo "✅ Customer dashboard and accounts"
echo "✅ Admin dashboard and inventory"
echo "✅ Product recommendations"
echo "✅ Mobile responsive design"
echo "✅ E-commerce functionality"
echo ""
echo "🚀 Your comprehensive MidasBeauty e-commerce platform is now deploying!"
echo "Monitor deployment progress at: https://app.netlify.com/"

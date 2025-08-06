#!/bin/bash

# WellNest Deployment Script
# This script helps you deploy WellNest to GitHub Pages

echo "🚀 WellNest Deployment Script"
echo "=============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Initializing..."
    git init
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found."
    echo "Please add your GitHub repository as remote origin:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/WellNest.git"
    echo ""
    read -p "Enter your GitHub username: " github_username
    git remote add origin "https://github.com/$github_username/WellNest.git"
    echo "✅ Remote origin added: https://github.com/$github_username/WellNest.git"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Add all changes
echo "📝 Adding changes to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to GitHub Pages - $(date)"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo "=============================="
    echo "Your WellNest app will be available at:"
    echo "https://$(git remote get-url origin | sed 's/.*github\.com\///' | sed 's/\.git//' | sed 's/.*\///').github.io/WellNest/"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to your GitHub repository"
    echo "2. Navigate to Settings > Pages"
    echo "3. Select 'GitHub Actions' as source"
    echo "4. Wait for the deployment to complete"
    echo ""
    echo "🔧 Don't forget to deploy your backend separately!"
    echo "Check DEPLOYMENT.md for backend deployment options."
else
    echo "❌ Push failed! Please check your git configuration."
    exit 1
fi

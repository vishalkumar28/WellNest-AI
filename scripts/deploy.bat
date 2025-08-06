@echo off
REM WellNest Deployment Script for Windows
REM This script helps you deploy WellNest to GitHub Pages

echo 🚀 WellNest Deployment Script
echo ==============================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not found. Initializing...
    git init
)

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ❌ No remote origin found.
    echo Please add your GitHub repository as remote origin:
    echo git remote add origin https://github.com/YOUR_USERNAME/WellNest.git
    echo.
    set /p github_username="Enter your GitHub username: "
    git remote add origin "https://github.com/%github_username%/WellNest.git"
    echo ✅ Remote origin added: https://github.com/%github_username%/WellNest.git
)

REM Build the project
echo 🔨 Building the project...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed! Please check the errors above.
    pause
    exit /b 1
) else (
    echo ✅ Build successful!
)

REM Add all changes
echo 📝 Adding changes to git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Deploy to GitHub Pages - %date% %time%"

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo ❌ Push failed! Please check your git configuration.
    pause
    exit /b 1
) else (
    echo.
    echo 🎉 Deployment successful!
    echo ==============================
    echo Your WellNest app will be available at:
    echo https://YOUR_USERNAME.github.io/WellNest/
    echo.
    echo 📋 Next steps:
    echo 1. Go to your GitHub repository
    echo 2. Navigate to Settings ^> Pages
    echo 3. Select 'GitHub Actions' as source
    echo 4. Wait for the deployment to complete
    echo.
    echo 🔧 Don't forget to deploy your backend separately!
    echo Check DEPLOYMENT.md for backend deployment options.
)

pause

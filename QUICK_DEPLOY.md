# 🚀 Quick Deploy Guide - WellNest

## ⚡ 5-Minute Deployment

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `WellNest`
4. Make it **Public** (required for GitHub Pages)
5. Don't initialize with README

### Step 2: Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/WellNest.git

# Push
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy your site

### Step 4: Wait for Deployment
- Go to **Actions** tab to monitor progress
- Your site will be at: `https://YOUR_USERNAME.github.io/WellNest/`

## 🔧 Backend Deployment (Optional)

### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway up
```

### Set Environment Variables in Railway:
```
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
```

## 🌐 Update Frontend API URL

After deploying backend, update `env.template` to `.env`:
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🎉 Done!

Your WellNest app is now live at:
- **Frontend**: `https://YOUR_USERNAME.github.io/WellNest/`
- **Backend**: `https://your-backend-url.com`

## 🆘 Need Help?

- Check `DEPLOYMENT.md` for detailed instructions
- Run `scripts/deploy.bat` (Windows) for automated deployment
- Check GitHub Actions logs if deployment fails

---

**Share your wellness app with the world! 🌟**

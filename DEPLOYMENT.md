# WellNest Deployment Guide

This guide will help you deploy WellNest to GitHub and host it online.

## 🚀 Quick Start

### 1. GitHub Repository Setup

1. **Create a new repository on GitHub**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it `WellNest`
   - Make it public (required for GitHub Pages)
   - Don't initialize with README (we already have one)

2. **Push your code to GitHub**
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit"
   
   # Add remote origin (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/WellNest.git
   
   # Push to main branch
   git push -u origin main
   ```

### 2. Enable GitHub Pages

1. **Go to your repository settings**
   - Navigate to your WellNest repository on GitHub
   - Click "Settings" tab

2. **Enable GitHub Pages**
   - Scroll down to "Pages" section
   - Under "Source", select "GitHub Actions"
   - The workflow we created will automatically deploy your site

3. **Wait for deployment**
   - Go to "Actions" tab to monitor the deployment
   - Your site will be available at: `https://YOUR_USERNAME.github.io/WellNest/`

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)

1. **Sign up for Railway**
   - Go to [Railway](https://railway.app)
   - Sign up with your GitHub account

2. **Deploy the backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Navigate to backend directory
   cd backend
   
   # Deploy
   railway up
   ```

3. **Set environment variables**
   - In Railway dashboard, go to your project
   - Add environment variables:
     ```
     DATABASE_URL=your_postgresql_url
     JWT_SECRET=your_secret_key
     GEMINI_API_KEY=your_gemini_api_key
     PORT=3001
     ```

4. **Get your backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Update your frontend API configuration

### Option 2: Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy to Heroku**
   ```bash
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   heroku create your-wellnest-backend
   
   # Add PostgreSQL addon
   heroku addons:create heroku-postgresql:mini
   
   # Set environment variables
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set GEMINI_API_KEY=your_gemini_api_key
   
   # Deploy
   git push heroku main
   ```

### Option 3: Vercel

1. **Sign up for Vercel**
   - Go to [Vercel](https://vercel.com)
   - Connect your GitHub account

2. **Deploy backend**
   - Import your repository
   - Set root directory to `backend`
   - Add environment variables
   - Deploy

## 🔗 Connect Frontend to Backend

1. **Update API configuration**
   - Edit `src/services/api.ts` or similar file
   - Replace localhost URLs with your deployed backend URL

2. **Update CORS settings**
   - In your backend, update CORS to allow your GitHub Pages domain

## 🌐 Custom Domain (Optional)

1. **Buy a domain** (e.g., from Namecheap, GoDaddy, etc.)

2. **Configure DNS**
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`

3. **Update GitHub Pages**
   - In repository settings → Pages
   - Add your custom domain

4. **Update Vite config**
   - Remove the base path in `vite.config.ts` for custom domain

## 🔒 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=WellNest
```

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-username.github.io
```

## 📊 Database Setup

### Option 1: Railway PostgreSQL
- Railway provides PostgreSQL automatically
- Get connection string from Railway dashboard

### Option 2: Neon (Recommended for development)
1. Go to [Neon](https://neon.tech)
2. Create account and project
3. Copy connection string
4. Add to environment variables

### Option 3: Supabase
1. Go to [Supabase](https://supabase.com)
2. Create project
3. Get connection string
4. Add to environment variables

## 🚨 Troubleshooting

### Common Issues

1. **Build fails**
   - Check GitHub Actions logs
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **API calls fail**
   - Check CORS configuration
   - Verify backend URL is correct
   - Ensure environment variables are set

3. **Database connection fails**
   - Verify DATABASE_URL format
   - Check if database is accessible
   - Ensure SSL is configured if required

4. **Authentication issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure cookies are configured correctly

### Debug Commands

```bash
# Check build locally
npm run build

# Test production build
npm run preview

# Check backend health
curl https://your-backend-url.com/health

# View logs (Railway)
railway logs

# View logs (Heroku)
heroku logs --tail
```

## 📈 Monitoring

### Frontend Monitoring
- GitHub Pages provides basic analytics
- Consider adding Google Analytics
- Monitor Core Web Vitals

### Backend Monitoring
- Railway/Heroku provide built-in monitoring
- Set up error tracking (Sentry)
- Monitor API response times

## 🔄 Continuous Deployment

The GitHub Actions workflow automatically:
- Builds the frontend on every push
- Deploys to GitHub Pages
- Runs tests (if configured)

For backend, consider:
- Railway auto-deploys on git push
- Heroku auto-deploys from GitHub
- Vercel auto-deploys on push

## 🎉 Success!

Once deployed, your WellNest application will be available at:
- **Frontend**: `https://YOUR_USERNAME.github.io/WellNest/`
- **Backend**: `https://your-backend-url.com`

Share your wellness tracking app with the world! 🌟

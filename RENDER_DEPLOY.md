# Deploying WellNest to Render.com

This guide provides instructions for deploying the WellNest application to Render.com.

## Prerequisites

- A Render.com account
- Your WellNest repository on GitHub

## Frontend Deployment

### Option 1: Using the Render Dashboard

1. **Log in to Render.com**
   - Go to [Render.com](https://render.com) and sign in

2. **Create a new Static Site**
   - Click "New" and select "Static Site"
   - Connect your GitHub repository
   - Configure the following settings:
     - **Name**: `wellnest-ai-frontend` (or your preferred name)
     - **Branch**: `main` (or your deployment branch)
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `frontend/dist`

3. **Add Environment Variables**
   - Add `VITE_API_URL` pointing to your backend URL (e.g., `https://wellnest-ai-backend.onrender.com/api`)

4. **Deploy**
   - Click "Create Static Site"

### Option 2: Using render.yaml (Recommended)

1. **Ensure render.yaml exists**
   - The `render.yaml` file should be in the root of your repository
   - It should contain the configuration for your static site

2. **Deploy via Blueprint**
   - Go to [Render.com Dashboard](https://dashboard.render.com/)
   - Click "New" and select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file and create the services

## Backend Deployment

1. **Create a new Web Service**
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Configure the following settings:
     - **Name**: `wellnest-ai-backend` (or your preferred name)
     - **Branch**: `main` (or your deployment branch)
     - **Root Directory**: `backend`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

2. **Add Environment Variables**
   - Add all required environment variables:
     ```
     DATABASE_URL=your_postgresql_url
     JWT_SECRET=your_secret_key
     GEMINI_API_KEY=your_gemini_api_key
     PORT=3001
     NODE_ENV=production
     CORS_ORIGIN=https://wellnest-ai-frontend.onrender.com
     ```

3. **Deploy**
   - Click "Create Web Service"

## Troubleshooting

### 404 Errors for Assets

If you're experiencing 404 errors for assets like JavaScript or CSS files, ensure:

1. **Base Path**: The `base` in `vite.config.ts` should be set to `/` for Render.com deployments

2. **Asset References**: Check that assets are referenced correctly in the HTML

3. **MIME Types**: Ensure the server is sending the correct MIME types for your assets

4. **Cache Headers**: Add appropriate cache headers for assets

### CORS Issues

If you're experiencing CORS issues:

1. **Backend Configuration**: Ensure your backend's CORS settings include your frontend domain

2. **Environment Variables**: Check that `CORS_ORIGIN` is set correctly in your backend environment

## Monitoring

- Use the Render dashboard to monitor your application
- Check logs for any errors or issues
- Set up alerts for downtime or errors

## Continuous Deployment

Render automatically deploys when you push to your configured branch. To disable this:

1. Go to your service settings
2. Under "Auto-Deploy", select "No"

## Custom Domains

To add a custom domain:

1. Go to your service settings
2. Click "Custom Domains"
3. Follow the instructions to add and verify your domain
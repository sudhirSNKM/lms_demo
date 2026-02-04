# Netlify Deployment Guide

This application is configured to run entirely on Netlify using Netlify Functions.

## Architecture
- **Frontend**: Static files served from `/frontend` directory
- **Backend**: Express API converted to Netlify Functions (`/netlify/functions/api.js`)
- **Database**: MongoDB Atlas (cloud)

## Environment Variables Required

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://vote02:vote02@cluster0.buyegnq.mongodb.net/?appName=Cluster0
JWT_SECRET=ace_super_secret_key_2024
SEED_ADMIN_EMAIL=admin
SEED_ADMIN_PASSWORD=password
```

## Deployment Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure for Netlify deployment"
   git push origin main
   ```

2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repo: `sudhirSNKM/lms_demo`
   - Netlify will auto-detect settings from `netlify.toml`
   - Add environment variables (see above)
   - Click "Deploy"

3. **Access Your App**:
   - Netlify will give you a URL like: `https://your-app.netlify.app`
   - The app will work immediately with MongoDB data persistence

## Local Development

To test locally with Netlify Functions:
```bash
npm install
netlify dev
```

This will start a local server that mimics Netlify's environment.

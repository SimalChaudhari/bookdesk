# Backend Deployment Guide

This guide covers deploying your NestJS GraphQL backend to Vercel or Railway.

## ⚠️ Important Note About SQLite

**SQLite databases don't persist on serverless platforms like Vercel.** Each serverless function gets a fresh filesystem, so your database will be reset on every deployment.

**For production with SQLite, use Railway or Render** (they support persistent storage).

---

## Option 1: Deploy to Vercel (Serverless)

### Prerequisites
- Backend code is already pushed to GitHub
- Vercel account connected to GitHub

### Step 1: Create Backend Project in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository (`bookdesk`)
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty (not needed for serverless)
   - **Install Command**: `npm install`
5. Click **"Deploy"** (we'll add environment variables next)

### Step 2: Add Environment Variables

After the first deployment, go to **Settings** → **Environment Variables** and add:

```
PORT=4000
FRONTEND_URL=https://your-frontend-app.vercel.app
AUTH0_ISSUER_URL=https://YOUR_AUTH0_DOMAIN
AUTH0_AUDIENCE=https://book-dashboard-api
NODE_ENV=production
```

**Important**: Replace:
- `YOUR_AUTH0_DOMAIN` with your actual Auth0 domain
- `your-frontend-app.vercel.app` with your actual frontend URL

### Step 3: Redeploy

After adding environment variables, go to **Deployments** → Click the three dots → **Redeploy**

### Step 4: Update Frontend Environment Variable

1. Go to your **frontend project** in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Update `REACT_APP_GRAPHQL_URL` to your backend URL:
   ```
   REACT_APP_GRAPHQL_URL=https://your-backend-app.vercel.app/graphql
   ```
4. Redeploy the frontend

### Step 5: Test the Deployment

1. Visit your backend GraphQL endpoint: `https://your-backend-app.vercel.app/graphql`
2. You should see the GraphQL playground (if enabled) or an authentication error (which is expected)

---

## Option 2: Deploy to Railway (Recommended for SQLite)

Railway is better suited for NestJS applications with SQLite because it provides persistent storage.

### Step 1: Create Railway Account

1. Go to [Railway](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"**

### Step 2: Deploy from GitHub

1. Select **"Deploy from GitHub repo"**
2. Choose your `bookdesk` repository
3. Railway will detect it's a Node.js project

### Step 3: Configure the Service

1. Click on the service
2. Go to **Settings**
3. Set **Root Directory** to `backend`
4. Set **Start Command** to `npm run start:prod`

### Step 4: Add Environment Variables

Go to **Variables** tab and add:

```
PORT=4000
FRONTEND_URL=https://your-frontend-app.vercel.app
AUTH0_ISSUER_URL=https://YOUR_AUTH0_DOMAIN
AUTH0_AUDIENCE=https://book-dashboard-api
NODE_ENV=production
```

### Step 5: Deploy

1. Railway will automatically detect changes and deploy
2. Wait for the deployment to complete
3. Railway will provide a URL like `https://your-app.railway.app`

### Step 6: Update Frontend

1. Go to your **frontend project** in Vercel
2. Update `REACT_APP_GRAPHQL_URL` to:
   ```
   REACT_APP_GRAPHQL_URL=https://your-app.railway.app/graphql
   ```
3. Redeploy the frontend

---

## Option 3: Deploy to Render

### Step 1: Create Render Account

1. Go to [Render](https://render.com)
2. Sign in with GitHub

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `bookdesk-backend`
   - **Environment**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

### Step 3: Add Environment Variables

Add the same environment variables as Railway:
```
PORT=4000
FRONTEND_URL=https://your-frontend-app.vercel.app
AUTH0_ISSUER_URL=https://YOUR_AUTH0_DOMAIN
AUTH0_AUDIENCE=https://book-dashboard-api
NODE_ENV=production
```

### Step 4: Deploy

Click **"Create Web Service"** and wait for deployment.

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
   - Include protocol (`https://`) in the URL

2. **Database Not Persisting (Vercel)**
   - This is expected on Vercel - use Railway or Render for persistent storage
   - Consider migrating to PostgreSQL for production

3. **Build Failures**
   - Check that all dependencies are in `package.json` (not just `devDependencies`)
   - Ensure `@vercel/node` is installed for Vercel deployments

4. **GraphQL Endpoint Not Found**
   - Verify the route is `/graphql` (not `/api/graphql`)
   - Check Vercel function logs for errors

5. **Auth0 Errors**
   - Verify `AUTH0_ISSUER_URL` includes `https://`
   - Ensure Auth0 application settings include your backend URL

### Checking Logs

- **Vercel**: Go to your project → **Deployments** → Click on a deployment → **Function Logs**
- **Railway**: Go to your service → **Deployments** → Click on a deployment → View logs
- **Render**: Go to your service → **Logs** tab

---

## Recommended Setup for Production

For a production application, consider:

1. **Database**: Migrate from SQLite to PostgreSQL
   - Use services like [Supabase](https://supabase.com), [Neon](https://neon.tech), or [PlanetScale](https://planetscale.com)
   - Update TypeORM configuration in `backend/src/app.module.ts`

2. **Backend Hosting**: Use Railway or Render (better for long-running processes)

3. **Frontend Hosting**: Vercel (excellent for React apps)

4. **Environment Variables**: Store securely and never commit `.env` files

---

## Quick Reference

### Vercel Backend URL Format
```
https://your-project-name.vercel.app/graphql
```

### Railway Backend URL Format
```
https://your-app-name.up.railway.app/graphql
```

### Render Backend URL Format
```
https://your-service-name.onrender.com/graphql
```

---

## Next Steps

After deploying the backend:

1. ✅ Test the GraphQL endpoint
2. ✅ Update frontend `REACT_APP_GRAPHQL_URL`
3. ✅ Update Auth0 settings with production URLs
4. ✅ Test the full application flow
5. 🎉 Your app is live!


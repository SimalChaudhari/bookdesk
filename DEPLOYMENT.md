# Deployment Guide - GitHub & Vercel

This guide will walk you through deploying your Book Dashboard project to GitHub and then to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Git installed on your machine
- Auth0 account with production configuration

---

## Part 1: Deploy to GitHub

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `bookdesk` (or your preferred name)
   - **Description**: "Book Dashboard - Full Stack Application"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Make sure you're in the project directory
cd C:\project\bookdesk

# Add all files to git
git add .

# Create your first commit
git commit -m "feat: initial commit - Book Dashboard application"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/bookdesk.git

# Rename branch to main if needed (if you're on master)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: You may be prompted for your GitHub username and password. Use a Personal Access Token instead of your password for security.

### Step 3: Verify Upload

1. Go to your GitHub repository page
2. You should see all your project files
3. Make sure `.env` files are NOT visible (they should be in `.gitignore`)

---

## Part 2: Deploy to Vercel

### Step 1: Update Auth0 Configuration for Production

Before deploying, you need to update your Auth0 settings:

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → Your Application
3. Update **Allowed Callback URLs**:
   ```
   http://localhost:3000, https://your-frontend-app.vercel.app
   ```
4. Update **Allowed Logout URLs**:
   ```
   http://localhost:3000, https://your-frontend-app.vercel.app
   ```
5. Update **Allowed Web Origins**:
   ```
   http://localhost:3000, https://your-frontend-app.vercel.app
   ```
6. Save changes

### Step 2: Deploy Frontend to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository (`bookdesk`)
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
5. Add Environment Variables:
   - `REACT_APP_AUTH0_DOMAIN`: Your Auth0 domain (e.g., `your-tenant.auth0.com`)
   - `REACT_APP_AUTH0_CLIENT_ID`: Your Auth0 Client ID
   - `REACT_APP_AUTH0_AUDIENCE`: `https://book-dashboard-api`
   - `REACT_APP_GRAPHQL_URL`: Your backend URL (we'll set this after deploying backend)
6. Click **"Deploy"**

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: bookdesk-frontend
# - Directory: ./
# - Override settings? No
```

### Step 3: Deploy Backend to Vercel

**Important**: NestJS backends can be deployed to Vercel, but require special configuration. For production, consider using:
- **Railway** (recommended for NestJS)
- **Render**
- **Heroku**
- **AWS/Google Cloud**

However, if you want to deploy to Vercel:

1. Go to Vercel Dashboard
2. Click **"Add New Project"**
3. Import the same repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add Environment Variables:
   - `PORT`: `4000` (Vercel will override this)
   - `FRONTEND_URL`: Your frontend Vercel URL
   - `AUTH0_ISSUER_URL`: `https://YOUR_AUTH0_DOMAIN`
   - `AUTH0_AUDIENCE`: `https://book-dashboard-api`
6. Create `vercel.json` in backend directory (see below)

### Step 4: Update Frontend Environment Variable

After deploying the backend, update the frontend's `REACT_APP_GRAPHQL_URL` environment variable in Vercel:

1. Go to your frontend project in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Update `REACT_APP_GRAPHQL_URL` to your backend URL (e.g., `https://your-backend.vercel.app/graphql`)
4. Redeploy the frontend

---

## Alternative: Deploy Backend to Railway (Recommended)

Railway is better suited for NestJS applications:

1. Go to [Railway](https://railway.app) and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`
6. Add Environment Variables:
   - `PORT`: `4000`
   - `FRONTEND_URL`: Your frontend Vercel URL
   - `AUTH0_ISSUER_URL`: `https://YOUR_AUTH0_DOMAIN`
   - `AUTH0_AUDIENCE`: `https://book-dashboard-api`
7. Railway will provide a URL like `https://your-app.railway.app`
8. Update your frontend's `REACT_APP_GRAPHQL_URL` to `https://your-app.railway.app/graphql`

---

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
2. **Auth0 Errors**: Verify all Auth0 URLs are updated with production URLs
3. **Build Failures**: Check that all dependencies are in `package.json`
4. **Environment Variables**: Ensure all required variables are set in Vercel/Railway

### Database Considerations

**Important**: SQLite databases don't persist on serverless platforms like Vercel. For production, consider:
- Using a cloud database (PostgreSQL, MySQL)
- Using Railway or Render which support persistent storage
- Using a database service like Supabase, PlanetScale, or Neon

---

## Next Steps

1. ✅ Project deployed to GitHub
2. ✅ Frontend deployed to Vercel
3. ✅ Backend deployed (Vercel or Railway)
4. ✅ Environment variables configured
5. ✅ Auth0 updated with production URLs
6. 🎉 Your app is live!

---

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Auth0 Dashboard](https://manage.auth0.com/)
- [GitHub Documentation](https://docs.github.com)


# 🚀 Deployment Guide: GitHub Pages + Render

This guide will help you deploy the AI Resume Analyzer with the frontend on GitHub Pages and backend on Render.

## 📋 Prerequisites

- GitHub account
- Render account (free tier available)
- Git installed locally

## 🎯 Frontend Deployment (GitHub Pages)

### Step 1: Prepare Repository

1. **Create GitHub Repository:**
   ```bash
   # Create a new repository on GitHub named "ai-resume-analyzer"
   # Then push your code
   git init
   git add .
   git commit -m "Initial commit: AI Resume Analyzer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
   git push -u origin main
   ```

2. **Update CORS Settings:**
   - Replace `yourusername` in `backend/resume_analyzer/settings.py` with your actual GitHub username
   - Line 135-136: Update the GitHub Pages URLs

### Step 2: Configure GitHub Pages

1. **Go to Repository Settings:**
   - Navigate to your GitHub repository
   - Click on "Settings" tab
   - Scroll down to "Pages" section

2. **Enable GitHub Actions:**
   - Source: "GitHub Actions"
   - The deployment workflow will run automatically

3. **Set Repository Permissions:**
   - Go to Settings > Actions > General
   - Under "Workflow permissions", select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

### Step 3: Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- ✅ Install dependencies
- ✅ Build the Next.js app for production
- ✅ Deploy to GitHub Pages

**Your frontend will be available at:**
`https://YOUR_USERNAME.github.io/ai-resume-analyzer/`

## 🔧 Backend Deployment (Render)

### Step 1: Prepare for Render

1. **Environment Variables (Required):**
   - `SECRET_KEY`: Django secret key (generate a new one for production)
   - `DEBUG`: Set to `False` for production
   - `ALLOWED_HOSTS`: Set to your Render domain

### Step 2: Deploy on Render

1. **Create New Web Service:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" > "Web Service"
   - Connect your GitHub repository

2. **Configure Service:**
   ```yaml
   Name: ai-resume-analyzer-backend
   Environment: Python 3
   Build Command: ./build.sh
   Start Command: gunicorn resume_analyzer.wsgi:application --bind 0.0.0.0:$PORT
   ```

3. **Set Environment Variables:**
   ```env
   SECRET_KEY=your-super-secret-django-key-here
   DEBUG=False
   PYTHON_VERSION=3.11.0
   ```

4. **Advanced Settings:**
   - Root Directory: `backend`
   - Auto-Deploy: Yes

### Step 3: Update Frontend Configuration

After Render deployment, update the API URL:

1. **Update `frontend/next.config.js`:**
   ```javascript
   // Replace 'ai-resume-analyzer-backend' with your actual Render service name
   NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
     ? 'https://YOUR_RENDER_SERVICE_NAME.onrender.com' 
     : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
   ```

2. **Commit and push changes** - GitHub Pages will auto-redeploy

## 🔐 Security Configuration

### Environment Variables for Render:

```env
# Required
SECRET_KEY=django-insecure-REPLACE-WITH-STRONG-SECRET-KEY
DEBUG=False

# Optional
ALLOWED_HOSTS=your-app-name.onrender.com,.onrender.com
CORS_ALLOWED_ORIGINS=https://YOUR_USERNAME.github.io
```

### Generate Secret Key:
```python
# Run this in Python to generate a new secret key
import secrets
print(secrets.token_urlsafe(50))
```

## 📱 Testing Deployment

### Frontend (GitHub Pages):
1. Visit: `https://YOUR_USERNAME.github.io/ai-resume-analyzer/`
2. Check browser console for any errors
3. Verify responsive design on mobile

### Backend (Render):
1. Visit: `https://YOUR_SERVICE_NAME.onrender.com/api/`
2. Should return: `{"message": "AI Resume Analyzer API is running!"}`
3. Test file upload functionality

### Integration Test:
1. Upload a resume on the frontend
2. Verify analysis results display correctly
3. Test PDF export functionality

## 🎯 Custom Domain (Optional)

### GitHub Pages Custom Domain:
1. Add `CNAME` file to `frontend/public/` with your domain
2. Configure DNS records with your domain provider
3. Update CORS settings accordingly

### Render Custom Domain:
1. Go to Render service settings
2. Add custom domain under "Custom Domains"
3. Configure DNS records as instructed

## 🔄 Continuous Deployment

- **Frontend:** Automatically deploys on every push to `main` branch
- **Backend:** Automatically deploys on every push (if auto-deploy enabled)

## 📊 Monitoring

### GitHub Pages:
- Check "Actions" tab for deployment status
- View deployment logs for troubleshooting

### Render:
- Monitor service health in Render dashboard
- View logs for debugging issues
- Set up alerts for downtime

## 🐛 Troubleshooting

### Common Issues:

1. **404 on GitHub Pages:**
   - Check if repository is public
   - Verify Pages settings are correct
   - Ensure workflow completed successfully

2. **CORS Errors:**
   - Update `CORS_ALLOWED_ORIGINS` in settings.py
   - Include both HTTP and HTTPS versions
   - Don't forget trailing slashes

3. **Render Build Failures:**
   - Check build logs for specific errors
   - Verify `requirements.txt` is complete
   - Ensure Python version compatibility

4. **API Connection Issues:**
   - Verify API URL in `next.config.js`
   - Check Render service is running
   - Test API endpoints directly

## 📞 Support

If you encounter issues:
1. Check the deployment logs
2. Verify all environment variables are set
3. Test locally first to isolate the issue
4. Review GitHub Actions and Render logs

---

## 🎉 Success!

Once deployed, your AI Resume Analyzer will be:
- ✅ **Frontend:** Fast, cached, and globally distributed via GitHub Pages
- ✅ **Backend:** Scalable and reliable on Render's infrastructure
- ✅ **Mobile-friendly:** Accessible from any device
- ✅ **Professional:** Ready for portfolio showcase

**Live URLs:**
- Frontend: `https://YOUR_USERNAME.github.io/ai-resume-analyzer/`
- Backend: `https://YOUR_SERVICE_NAME.onrender.com`

Happy deploying! 🚀

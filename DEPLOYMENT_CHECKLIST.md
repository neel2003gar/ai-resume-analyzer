# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

### Frontend (GitHub Pages):
- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] Repository is public (for free GitHub Pages)
- [ ] GitHub Actions enabled in repository settings
- [ ] Workflow permissions set to "Read and write"

### Backend (Render):
- [ ] Render account created
- [ ] Environment variables prepared:
  - [ ] `SECRET_KEY` generated
  - [ ] `DEBUG=False`
- [ ] CORS origins updated with your GitHub username

## 🎯 Deployment Steps

### 1. Deploy Backend First (Render):
```bash
# 1. Push code to GitHub
git add .
git commit -m "Add deployment configuration"
git push

# 2. Create Render Web Service:
# - Service Name: ai-resume-analyzer-backend
# - Root Directory: backend
# - Build Command: ./build.sh
# - Start Command: gunicorn resume_analyzer.wsgi:application --bind 0.0.0.0:$PORT

# 3. Set Environment Variables:
# SECRET_KEY=your-generated-secret-key
# DEBUG=False
```

### 2. Update Frontend Configuration:
```bash
# Update next.config.js with your Render URL
# Replace YOUR_RENDER_SERVICE_NAME with actual service name
```

### 3. Deploy Frontend (GitHub Pages):
```bash
# 1. Enable GitHub Pages in repository settings
# 2. Select "GitHub Actions" as source
# 3. Workflow will run automatically
```

## 🔍 Verification

### Backend Health Check:
- [ ] Visit: `https://YOUR_SERVICE_NAME.onrender.com/api/`
- [ ] Should return: `{"message": "AI Resume Analyzer API is running!"}`

### Frontend Health Check:
- [ ] Visit: `https://YOUR_USERNAME.github.io/ai-resume-analyzer/`
- [ ] Upload test resume
- [ ] Verify analysis results
- [ ] Test PDF export

## 🎉 Success URLs

After successful deployment:
- **Frontend:** `https://YOUR_USERNAME.github.io/ai-resume-analyzer/`
- **Backend:** `https://YOUR_SERVICE_NAME.onrender.com`

## 🐛 Common Issues

1. **GitHub Pages 404:** Repository must be public
2. **Render Build Fail:** Check environment variables
3. **CORS Errors:** Update GitHub username in settings.py
4. **API Not Found:** Verify Render service URL in next.config.js

---

Happy deploying! 🚀

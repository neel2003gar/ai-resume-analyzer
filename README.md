# AI Resume Analyzer

🚀 **Live Application**: [https://neel2003gar.github.io/ai-resume-analyzer](https://neel2003gar.github.io/ai-resume-analyzer)

A powerful AI-driven resume analysis tool that provides ATS optimization, grammar checking, and detailed feedback to help improve your resume's performance.

## 🌐 Deployment

- **Frontend**: Deployed on GitHub Pages
- **Backend**: Deployed on Render
- **Status**: ✅ Live and operational

## ✨ Features

- **🤖 AI-Powered Analysis**: Advanced text analysis with free NLP techniques
- **📊 ATS Score**: Comprehensive scoring based on industry standards
- **✅ Grammar Check**: Built-in grammar analysis and suggestions
- **🎯 Smart Suggestions**: Actionable recommendations for improvement
- **💼 Skills Extraction**: Automatic identification and categorization
- **📱 Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- **📄 PDF Export**: Professional PDF reports with enhanced styling
- **🔄 Auto Cleanup**: Automatic file cleanup system for storage management
- **📱 Mobile Optimized**: Enhanced mobile upload and analysis experience

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Download spaCy model**

   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Run the backend server**
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 🛠️ Tech Stack

### Backend

- **Django**: Modern Python web framework with REST API
- **Django REST Framework**: API development toolkit
- **PyPDF2**: PDF text extraction
- **python-docx**: DOCX document processing
- **SQLite**: Lightweight database

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Dropzone**: File upload handling
- **Axios**: HTTP client for API calls
- **React Hot Toast**: Beautiful notifications
- **Lucide React**: Modern icon library

## 📁 Project Structure

```text
ai-resume-analyzer/
├── backend/                     # Django REST API
│   ├── resume_analyzer/         # Project settings
│   │   ├── settings.py          # Django configuration
│   │   ├── urls.py              # URL routing
│   │   └── wsgi.py              # WSGI application
│   ├── resumes/                 # Main app
│   │   ├── models.py            # Database models
│   │   ├── views.py             # API endpoints
│   │   ├── serializers.py       # Data serialization
│   │   └── urls.py              # App URLs
│   ├── requirements.txt         # Python dependencies
│   ├── build.sh                 # Render build script
│   └── Procfile                 # Render process file
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                 # App router pages
│   │   ├── components/          # React components
│   │   ├── lib/                 # Utility functions
│   │   │   ├── api.ts           # API client
│   │   │   └── utils.ts         # Helper functions
│   │   └── types/               # TypeScript types
│   ├── next.config.js           # Next.js configuration
│   └── package.json             # Node dependencies
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions workflow
└── README.md                    # Project documentation
```
│   ├── uploads/             # Uploaded files
│   ├── main.py             # FastAPI app
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
└── frontend/
    ├── src/
    │   ├── app/            # Next.js App Router
    │   ├── components/     # React components
    │   ├── lib/            # Utilities and API client
    │   └── types/          # TypeScript definitions
    ├── package.json        # Node.js dependencies
    └── tailwind.config.js  # Tailwind configuration
```

## � Deployment

### Live Application
- **Frontend**: [https://neel2003gar.github.io/ai-resume-analyzer](https://neel2003gar.github.io/ai-resume-analyzer)
- **Backend API**: [https://ai-resume-analyzer-backend-01nz.onrender.com](https://ai-resume-analyzer-backend-01nz.onrender.com)

### Architecture
- **Frontend**: Next.js static site deployed on GitHub Pages
- **Backend**: Django REST API deployed on Render
- **Database**: PostgreSQL on Render
- **CI/CD**: GitHub Actions for automatic deployment

### Frontend Deployment (GitHub Pages)
1. Code pushed to `main` branch
2. GitHub Actions builds Next.js application
3. Static files deployed to `gh-pages` branch
4. Available at GitHub Pages URL

### Backend Deployment (Render)
1. Connected to GitHub repository
2. Automatic builds on code changes
3. Environment variables configured
4. Gunicorn WSGI server
5. PostgreSQL database provisioned

## �🔧 API Endpoints

### Resume Analysis

- `POST /api/analyze/` - Upload and analyze resume
- `GET /api/resumes/` - List all analyzed resumes
- `GET /api/resumes/{id}/` - Get specific resume analysis
- `POST /api/resumes/{id}/reanalyze/` - Reanalyze with new job description
- `DELETE /api/resumes/{id}/` - Delete resume and analysis

### Utility

- `GET /api/health/` - Health check endpoint

## 🎯 How It Works

1. **Upload**: Users upload PDF/DOCX resumes via the web interface
2. **Parse**: Extract text and structure using PyMuPDF/python-docx
3. **Analyze**: AI models process the content for:
   - Skills extraction and categorization
   - Experience level detection
   - Section structure analysis
   - Job description matching
4. **Score**: Calculate ATS compatibility score (0-100)
5. **Feedback**: Generate actionable suggestions
6. **Grammar**: Optional grammar and readability analysis
7. **Results**: Display comprehensive analysis in beautiful UI

## 📊 Scoring Algorithm

The ATS score is calculated based on:

- **Structure (30%)**: Presence of key sections
- **Skills (20%)**: Relevance and quantity of skills
- **Experience (20%)**: Work history completeness
- **Contact Info (10%)**: Professional contact details
- **Education (10%)**: Academic background
- **Job Matching (10%)**: Alignment with job description

## 🔒 Privacy & Security

- All resume data is processed locally
- No data is sent to external services (except open-source models)
- Users can delete their data anytime
- SQLite database for local storage
- No tracking or analytics

## 🚀 Deployment

### Docker (Recommended)

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - '8000:8000'
    volumes:
      - ./backend/uploads:/app/uploads
    environment:
      - DATABASE_URL=sqlite:///./resume_analyzer.db

  frontend:
    build: ./frontend
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production Setup

1. **Environment Variables**:

   ```bash
   # Backend
   SECRET_KEY=your-secret-key
   DATABASE_URL=sqlite:///./resume_analyzer.db

   # Frontend
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```

2. **Build Frontend**:

   ```bash
   cd frontend
   npm run build
   npm start
   ```

3. **Run Backend**:
   ```bash
   cd backend
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the backend logs for errors
2. Ensure all dependencies are installed
3. Verify spaCy model is downloaded
4. Check frontend console for errors
5. Open an issue on GitHub with details

## 🔄 Updates & Roadmap

### Current Features ✅

- Resume upload and parsing
- AI-powered analysis
- ATS scoring
- Grammar checking
- Skills extraction
- Modern web interface

### Planned Features 🚧

- Multiple resume templates
- Industry-specific analysis
- Cover letter analysis
- LinkedIn profile optimization
- Batch processing
- Advanced reporting

---

**Built with ❤️ using only free, open-source technologies**

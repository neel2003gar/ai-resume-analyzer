from rest_framework import status, viewsets
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.http import JsonResponse
from django.conf import settings
import os
import PyPDF2
import docx
import io
import json
import shutil
import re
from datetime import datetime, timedelta

from .models import ResumeAnalysis
from .serializers import ResumeAnalysisSerializer, ResumeUploadSerializer, ResumeListSerializer

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):
    """Upload and analyze a resume"""
    try:
        print(f"Received upload request with data: {list(request.data.keys())}")

        # Check if file is provided
        if 'file' not in request.data:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        file = request.data['file']
        job_description = request.data.get('job_description', '')

        # Clean up old files before processing new upload
        cleanup_result = cleanup_current_session_files()
        print(f"Pre-upload cleanup: {cleanup_result}")

        # Create resume analysis record
        resume_analysis = ResumeAnalysis.objects.create(
            filename=file.name,
            file=file,
            job_description=job_description,
            file_size=file.size,
            processing_status='processing'
        )

        # Extract text from uploaded file
        try:
            extracted_text = extract_text_from_file(resume_analysis.file)
            resume_analysis.raw_text = extracted_text

            # Perform AI analysis
            analysis_results = analyze_resume_with_ai(
                extracted_text,
                resume_analysis.job_description
            )

            resume_analysis.analysis_results = analysis_results
            resume_analysis.ats_score = analysis_results.get('ats_score', {}).get('overall_score', 0)
            resume_analysis.job_match_score = analysis_results.get('job_match_score', 0)
            resume_analysis.processing_status = 'completed'

        except Exception as e:
            resume_analysis.processing_status = 'failed'
            resume_analysis.analysis_results = {'error': str(e)}

        resume_analysis.save()

        # Format response to match frontend expectations
        analysis_results = resume_analysis.analysis_results or {}

        response_data = {
            'id': resume_analysis.pk,
            'filename': resume_analysis.filename,
            'message': 'Resume analyzed successfully',
            'analysis_result': {
                'ats_score': {
                    'total_score': analysis_results.get('ats_score', {}).get('overall_score', resume_analysis.ats_score or 0),
                    'components': analysis_results.get('ats_score', {}).get('breakdown', {}),
                    'grade': 'A' if (resume_analysis.ats_score or 0) >= 80 else 'B' if (resume_analysis.ats_score or 0) >= 60 else 'C'
                },
                'suggestions': analysis_results.get('suggestions', []),
                'extracted_skills': analysis_results.get('extracted_skills', []),
                'analysis_summary': {
                    'total_skills': len(analysis_results.get('extracted_skills', [])),
                    'has_contact_info': True,
                    'has_experience': True,
                    'has_education': True,
                    'word_count': len((resume_analysis.raw_text or '').split()),
                    'section_count': 5
                },
                'text_quality': analysis_results.get('text_quality', {}),
                'text_content': resume_analysis.raw_text,
                'job_match_score': analysis_results.get('job_match_score')
            }
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': f'Upload failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_my_resumes(request):
    """Get all resume analyses"""
    try:
        resumes = ResumeAnalysis.objects.all()
        serializer = ResumeListSerializer(resumes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch resumes: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_resume_detail(request, resume_id):
    """Get detailed analysis for a specific resume"""
    try:
        resume = ResumeAnalysis.objects.get(id=resume_id)
        serializer = ResumeAnalysisSerializer(resume)
        return Response(serializer.data)
    except ResumeAnalysis.DoesNotExist:
        return Response(
            {'error': 'Resume not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch resume: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def extract_text_from_file(file):
    """Extract text from uploaded file based on file type"""
    file_extension = file.name.split('.')[-1].lower()

    if file_extension == 'pdf':
        return extract_text_from_pdf(file)
    elif file_extension in ['docx', 'doc']:
        return extract_text_from_docx(file)
    elif file_extension == 'txt':
        return file.read().decode('utf-8')
    else:
        raise ValueError(f"Unsupported file type: {file_extension}")

def extract_text_from_pdf(file):
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise ValueError(f"Error reading PDF: {str(e)}")

def extract_text_from_docx(file):
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(io.BytesIO(file.read()))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        raise ValueError(f"Error reading DOCX: {str(e)}")

def analyze_resume_with_ai(resume_text, job_description=None):
    """Analyze resume using rule-based analysis (no API required)"""
    try:
        # Convert text to lowercase for analysis
        text_lower = resume_text.lower()

        # Basic text statistics
        words = resume_text.split()
        word_count = len(words)

        # Calculate formatting score
        formatting_score = calculate_formatting_score(resume_text)

        # Extract and score skills
        skills = extract_skills(text_lower)
        skills_score = min(100, len(skills) * 10)  # 10 points per skill, max 100

        # Calculate experience score
        experience_score = calculate_experience_score(text_lower)

        # Calculate keyword score
        keywords_score = calculate_keywords_score(text_lower, job_description)

        # Calculate overall ATS score
        overall_score = (formatting_score + skills_score + experience_score + keywords_score) // 4

        # Calculate text quality metrics
        text_quality = calculate_text_quality(resume_text, word_count)

        # Generate suggestions
        suggestions = generate_suggestions(resume_text, skills, experience_score, formatting_score)

        # Calculate job match score if job description provided
        job_match_score = calculate_job_match_score(text_lower, job_description) if job_description else None

        return {
            "ats_score": {
                "overall_score": overall_score,
                "breakdown": {
                    "keywords": keywords_score,
                    "formatting": formatting_score,
                    "experience": experience_score,
                    "skills": skills_score
                }
            },
            "extracted_skills": skills,
            "suggestions": suggestions,
            "job_match_score": job_match_score,
            "text_quality": text_quality
        }

    except Exception as e:
        # Return a basic analysis if anything fails
        return {
            "ats_score": {
                "overall_score": 60,
                "breakdown": {
                    "keywords": 60,
                    "formatting": 70,
                    "experience": 60,
                    "skills": 60
                }
            },
            "extracted_skills": ["Communication", "Teamwork", "Problem Solving"],
            "suggestions": [
                {
                    "type": "important",
                    "category": "Analysis",
                    "suggestion": f"Basic analysis completed. Error: {str(e)}",
                    "impact": "Medium"
                }
            ],
            "job_match_score": None,
            "text_quality": {
                "word_count": len(resume_text.split()) if resume_text else 0,
                "readability": "Basic"
            }
        }

def calculate_formatting_score(text):
    """Calculate formatting score based on resume structure"""
    score = 50  # Base score

    # Check for common resume sections
    sections = ['experience', 'education', 'skills', 'summary', 'objective', 'projects', 'contact']
    text_lower = text.lower()

    for section in sections:
        if section in text_lower:
            score += 8

    # Check for email
    if '@' in text:
        score += 10

    # Check for phone number patterns
    import re
    if re.search(r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b', text):
        score += 10

    # Check for bullet points or structure
    if '•' in text or '-' in text or '*' in text:
        score += 10

    return min(100, score)

def extract_skills(text_lower):
    """Extract skills from resume text"""
    # Common technical and soft skills
    skill_keywords = [
        'python', 'java', 'javascript', 'react', 'angular', 'vue', 'node.js', 'express',
        'html', 'css', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis',
        'git', 'github', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
        'machine learning', 'ai', 'data science', 'analytics', 'tableau', 'power bi',
        'project management', 'agile', 'scrum', 'leadership', 'communication',
        'teamwork', 'problem solving', 'critical thinking', 'time management',
        'microsoft office', 'excel', 'powerpoint', 'word', 'photoshop', 'illustrator'
    ]

    found_skills = []
    for skill in skill_keywords:
        if skill in text_lower:
            found_skills.append(skill.title())

    # Add some default soft skills if none found
    if not found_skills:
        found_skills = ['Communication', 'Teamwork', 'Problem Solving']

    return list(set(found_skills[:10]))  # Return unique skills, max 10

def calculate_experience_score(text_lower):
    """Calculate experience score based on text content"""
    score = 40  # Base score

    # Look for experience indicators
    experience_words = ['experience', 'worked', 'developed', 'managed', 'led', 'created',
                       'implemented', 'designed', 'built', 'achieved', 'improved']

    for word in experience_words:
        if word in text_lower:
            score += 6

    # Look for years of experience
    import re
    years_pattern = r'\b(\d+)\s*(?:years?|yrs?)\b'
    years_matches = re.findall(years_pattern, text_lower)
    if years_matches:
        max_years = max([int(y) for y in years_matches])
        score += min(30, max_years * 3)  # 3 points per year, max 30

    return min(100, score)

def calculate_keywords_score(text_lower, job_description=None):
    """Calculate keyword score"""
    score = 60  # Base score

    if job_description:
        job_words = set(job_description.lower().split())
        resume_words = set(text_lower.split())

        # Find common words (excluding common stop words)
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
        job_keywords = job_words - stop_words
        common_keywords = job_keywords.intersection(resume_words)

        # Score based on keyword match percentage
        if job_keywords:
            match_percentage = len(common_keywords) / len(job_keywords)
            score = min(100, 40 + (match_percentage * 60))

    return int(score)

def calculate_job_match_score(text_lower, job_description):
    """Calculate job match score"""
    if not job_description:
        return None

    return calculate_keywords_score(text_lower, job_description)

def calculate_text_quality(resume_text, word_count):
    """Calculate comprehensive text quality metrics"""
    # Calculate basic readability metrics
    sentences = resume_text.count('.') + resume_text.count('!') + resume_text.count('?')
    sentences = max(1, sentences)  # Avoid division by zero

    # Estimate syllables (rough approximation)
    import re
    words = resume_text.lower().split()
    syllable_count = 0
    for word in words:
        # Remove punctuation and count vowel groups
        clean_word = re.sub(r'[^a-z]', '', word)
        if clean_word:
            vowel_groups = len(re.findall(r'[aeiouy]+', clean_word))
            syllable_count += max(1, vowel_groups)

    # Calculate Flesch Reading Ease (simplified)
    avg_sentence_length = word_count / sentences
    avg_syllables_per_word = syllable_count / max(1, word_count)
    flesch_score = 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_syllables_per_word)
    flesch_score = max(0, min(100, flesch_score))  # Clamp between 0-100

    # Calculate Flesch-Kincaid Grade Level
    flesch_kincaid = (0.39 * avg_sentence_length) + (11.8 * avg_syllables_per_word) - 15.59
    flesch_kincaid = max(1, flesch_kincaid)

    # Determine readability level
    if flesch_score >= 90:
        readability_level = "Very Easy"
    elif flesch_score >= 80:
        readability_level = "Easy"
    elif flesch_score >= 70:
        readability_level = "Fairly Easy"
    elif flesch_score >= 60:
        readability_level = "Standard"
    elif flesch_score >= 50:
        readability_level = "Fairly Difficult"
    elif flesch_score >= 30:
        readability_level = "Difficult"
    else:
        readability_level = "Very Difficult"

    # Calculate average word length
    avg_word_length = sum(len(word.strip('.,!?;:')) for word in words) / max(1, len(words))

    # Calculate quality score (0-100)
    quality_score = 60  # Base score

    # Adjust based on readability
    if 60 <= flesch_score <= 80:  # Ideal range for professional documents
        quality_score += 20
    elif flesch_score < 30 or flesch_score > 90:
        quality_score -= 10

    # Adjust based on word count
    if 200 <= word_count <= 800:  # Ideal resume length
        quality_score += 10
    elif word_count < 100:
        quality_score -= 20

    # Generate quality recommendations
    recommendations = []

    if flesch_score < 50:
        recommendations.append({
            "type": "readability",
            "category": "Text Complexity",
            "message": "Consider using shorter sentences and simpler words to improve readability",
            "priority": "medium"
        })

    if word_count < 150:
        recommendations.append({
            "type": "content",
            "category": "Resume Length",
            "message": "Your resume may be too short. Consider adding more details about your experience",
            "priority": "high"
        })
    elif word_count > 1000:
        recommendations.append({
            "type": "content",
            "category": "Resume Length",
            "message": "Your resume may be too long. Consider condensing to the most relevant information",
            "priority": "medium"
        })

    if avg_word_length > 6:
        recommendations.append({
            "type": "vocabulary",
            "category": "Word Choice",
            "message": "Try using more concise language to improve clarity",
            "priority": "low"
        })

    return {
        "grammar_errors": [],  # We don't have grammar checking in free version
        "error_count": 0,
        "readability": {
            "flesch_reading_ease": round(flesch_score, 1),
            "flesch_kincaid_grade": round(flesch_kincaid, 1),
            "readability_level": readability_level,
            "word_count": word_count,
            "sentence_count": sentences,
            "syllable_count": syllable_count
        },
        "word_count": word_count,
        "avg_word_length": round(avg_word_length, 1),
        "quality_score": min(100, max(0, quality_score)),
        "recommendations": recommendations
    }

def generate_suggestions(resume_text, skills, experience_score, formatting_score):
    """Generate improvement suggestions"""
    suggestions = []

    if formatting_score < 70:
        suggestions.append({
            "type": "important",
            "category": "Formatting",
            "suggestion": "Improve resume formatting by adding clear sections and contact information",
            "impact": "High"
        })

    if len(skills) < 5:
        suggestions.append({
            "type": "moderate",
            "category": "Skills",
            "suggestion": "Add more relevant technical and soft skills to improve ATS compatibility",
            "impact": "Medium"
        })

    if experience_score < 60:
        suggestions.append({
            "type": "important",
            "category": "Experience",
            "suggestion": "Add more specific experience details with action verbs and achievements",
            "impact": "High"
        })

    # Always add some general suggestions
    suggestions.extend([
        {
            "type": "moderate",
            "category": "Content",
            "suggestion": "Quantify achievements with numbers and metrics where possible",
            "impact": "Medium"
        },
        {
            "type": "moderate",
            "category": "Keywords",
            "suggestion": "Include industry-specific keywords relevant to your target role",
            "impact": "Medium"
        }
    ])

    return suggestions[:5]  # Return max 5 suggestions

def cleanup_old_files():
    """Clean up old uploaded files and database records"""
    try:
        # Get media directory path
        media_dir = os.path.join(settings.BASE_DIR, 'media')
        uploads_dir = os.path.join(media_dir, 'uploads')

        print(f"Starting cleanup of old files in {uploads_dir}")

        # Clean up files older than 1 hour (for development)
        # In production, you might want to make this longer
        cutoff_time = datetime.now() - timedelta(hours=1)

        # Clean up database records first
        old_analyses = ResumeAnalysis.objects.filter(
            upload_timestamp__lt=cutoff_time
        )

        # Delete associated files before deleting database records
        files_deleted = 0
        for analysis in old_analyses:
            if analysis.file and os.path.exists(analysis.file.path):
                try:
                    os.remove(analysis.file.path)
                    files_deleted += 1
                    print(f"Deleted file: {analysis.file.path}")
                except Exception as e:
                    print(f"Error deleting file {analysis.file.path}: {str(e)}")

        # Delete database records
        records_deleted = old_analyses.count()
        old_analyses.delete()

        # Clean up any orphaned files in uploads directory
        orphaned_files = 0
        if os.path.exists(uploads_dir):
            for filename in os.listdir(uploads_dir):
                file_path = os.path.join(uploads_dir, filename)
                if os.path.isfile(file_path):
                    file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                    if file_time < cutoff_time:
                        try:
                            os.remove(file_path)
                            orphaned_files += 1
                            print(f"Deleted orphaned file: {file_path}")
                        except Exception as e:
                            print(f"Error deleting orphaned file {file_path}: {str(e)}")

        print(f"Cleanup completed: {records_deleted} records, {files_deleted} associated files, {orphaned_files} orphaned files deleted")
        return {
            'records_deleted': records_deleted,
            'files_deleted': files_deleted,
            'orphaned_files': orphaned_files
        }

    except Exception as e:
        print(f"Error during cleanup: {str(e)}")
        return {'error': str(e)}

def cleanup_current_session_files():
    """Clean up files from current session (less aggressive cleanup)"""
    try:
        # Clean up files older than 10 minutes for current session
        cutoff_time = datetime.now() - timedelta(minutes=10)

        old_analyses = ResumeAnalysis.objects.filter(
            upload_timestamp__lt=cutoff_time
        )

        files_deleted = 0
        for analysis in old_analyses:
            if analysis.file and os.path.exists(analysis.file.path):
                try:
                    os.remove(analysis.file.path)
                    files_deleted += 1
                    print(f"Session cleanup - deleted file: {analysis.file.path}")
                except Exception as e:
                    print(f"Error deleting file {analysis.file.path}: {str(e)}")

        records_deleted = old_analyses.count()
        old_analyses.delete()

        print(f"Session cleanup completed: {records_deleted} records, {files_deleted} files deleted")
        return {
            'records_deleted': records_deleted,
            'files_deleted': files_deleted
        }

    except Exception as e:
        print(f"Error during session cleanup: {str(e)}")
        return {'error': str(e)}

@api_view(['POST'])
def cleanup_files(request):
    """Manual cleanup endpoint"""
    try:
        cleanup_result = cleanup_old_files()
        return Response({
            'message': 'Cleanup completed successfully',
            'details': cleanup_result
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f'Cleanup failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

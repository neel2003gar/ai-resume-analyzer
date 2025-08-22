from django.db import models
from django.core.validators import FileExtensionValidator
import json

class ResumeAnalysis(models.Model):
    # File information
    filename = models.CharField(max_length=255)
    file = models.FileField(
        upload_to='resumes/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'docx', 'doc', 'txt'])]
    )

    # Analysis metadata
    upload_timestamp = models.DateTimeField(auto_now_add=True)
    analysis_timestamp = models.DateTimeField(auto_now=True)

    # Extracted content
    raw_text = models.TextField(blank=True, null=True)

    # Analysis results
    ats_score = models.FloatField(blank=True, null=True)
    analysis_results = models.JSONField(default=dict, blank=True)

    # Job matching
    job_description = models.TextField(blank=True, null=True)
    job_match_score = models.FloatField(blank=True, null=True)

    # Additional metadata
    file_size = models.IntegerField(blank=True, null=True)
    processing_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )

    class Meta:
        ordering = ['-upload_timestamp']
        verbose_name = 'Resume Analysis'
        verbose_name_plural = 'Resume Analyses'

    def __str__(self):
        return f"{self.filename} - {self.upload_timestamp}"

    @property
    def extracted_skills(self):
        """Get extracted skills from analysis results"""
        return self.analysis_results.get('extracted_skills', [])

    @property
    def suggestions(self):
        """Get suggestions from analysis results"""
        return self.analysis_results.get('suggestions', [])

    @property
    def ats_breakdown(self):
        """Get ATS score breakdown"""
        return self.analysis_results.get('ats_score', {}).get('breakdown', {})

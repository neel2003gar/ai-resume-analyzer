from rest_framework import serializers
from .models import ResumeAnalysis

class ResumeAnalysisSerializer(serializers.ModelSerializer):
    """Serializer for ResumeAnalysis model"""

    class Meta:
        model = ResumeAnalysis
        fields = [
            'id',
            'filename',
            'file',
            'upload_timestamp',
            'analysis_timestamp',
            'raw_text',
            'ats_score',
            'analysis_results',
            'job_description',
            'job_match_score',
            'file_size',
            'processing_status',
            'extracted_skills',
            'suggestions',
            'ats_breakdown'
        ]
        read_only_fields = [
            'id',
            'upload_timestamp',
            'analysis_timestamp',
            'raw_text',
            'ats_score',
            'analysis_results',
            'job_match_score',
            'file_size',
            'processing_status',
            'extracted_skills',
            'suggestions',
            'ats_breakdown'
        ]

class ResumeUploadSerializer(serializers.ModelSerializer):
    """Simple serializer for uploading resumes"""

    class Meta:
        model = ResumeAnalysis
        fields = ['filename', 'file', 'job_description']

    def validate_file(self, value):
        """Validate uploaded file"""
        # Check file size (10MB limit)
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 10MB")

        # Check file type
        allowed_extensions = ['pdf', 'doc', 'docx', 'txt']
        file_extension = value.name.split('.')[-1].lower()
        if file_extension not in allowed_extensions:
            raise serializers.ValidationError(
                f"File type '{file_extension}' not supported. Allowed types: {allowed_extensions}"
            )

        return value
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 10MB.")

        # Check file extension
        allowed_extensions = ['pdf', 'docx', 'doc', 'txt']
        ext = value.name.split('.')[-1].lower()
        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"File type not supported. Allowed types: {', '.join(allowed_extensions)}"
            )

        return value

class ResumeListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing resumes"""

    class Meta:
        model = ResumeAnalysis
        fields = [
            'id',
            'filename',
            'upload_timestamp',
            'ats_score',
            'processing_status',
            'file_size'
        ]

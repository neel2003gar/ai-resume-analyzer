from django.urls import path
from . import views

urlpatterns = [
    # API endpoints
    path('upload/', views.upload_resume, name='upload_resume'),
    path('my-resumes/', views.get_my_resumes, name='get_my_resumes'),
    path('resumes/<int:resume_id>/', views.get_resume_detail, name='get_resume_detail'),
    path('cleanup/', views.cleanup_files, name='cleanup_files'),
]

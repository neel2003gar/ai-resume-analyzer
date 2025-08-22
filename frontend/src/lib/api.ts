import type {
  ErrorResponse,
  JobDescriptionRequest,
  ResumeListResponse,
  ResumeUploadResponse,
} from '@/types';
import axios from 'axios';

// Simple API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

console.log('API Configuration:', {
  baseURL: API_BASE_URL,
  environment: process.env.NODE_ENV,
});

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response?.data) {
      const errorResponse: ErrorResponse = error.response.data;
      throw new Error(errorResponse.error || 'An error occurred');
    }

    throw new Error(error.message || 'Network error occurred');
  },
);

export const resumeAPI = {
  // Upload and analyze resume
  uploadResume: async (file: File, jobDescription?: string): Promise<ResumeUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    if (jobDescription) {
      formData.append('job_description', jobDescription);
    }

    console.log('Uploading file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      hasJobDescription: !!jobDescription,
    });

    const response = await apiClient.post<ResumeUploadResponse>('/api/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Get all resumes
  getResumes: async (): Promise<ResumeListResponse[]> => {
    const response = await apiClient.get<ResumeListResponse[]>('/api/my-resumes/');
    return response.data;
  },

  // Get single resume
  getResume: async (id: number): Promise<ResumeUploadResponse> => {
    const response = await apiClient.get<ResumeUploadResponse>(`/api/resumes/${id}/`);
    return response.data;
  },

  // Cleanup endpoint
  cleanup: async (): Promise<void> => {
    await apiClient.post('/api/cleanup/');
  },

  // Analyze with job description
  analyzeWithJobDescription: async (
    request: JobDescriptionRequest,
  ): Promise<ResumeUploadResponse> => {
    const response = await apiClient.post<ResumeUploadResponse>('/api/analyze-job/', request);
    return response.data;
  },
};

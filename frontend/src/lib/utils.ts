import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
}

export function getScoreBackgroundColor(score: number): string {
  if (score >= 90) return 'bg-green-100';
  if (score >= 80) return 'bg-blue-100';
  if (score >= 70) return 'bg-yellow-100';
  if (score >= 60) return 'bg-orange-100';
  return 'bg-red-100';
}

export function getSuggestionColor(type: string): string {
  switch (type) {
    case 'critical':
      return 'border-red-200 bg-red-50 text-red-800';
    case 'important':
      return 'border-yellow-200 bg-yellow-50 text-yellow-800';
    case 'moderate':
      return 'border-blue-200 bg-blue-50 text-blue-800';
    default:
      return 'border-gray-200 bg-gray-50 text-gray-800';
  }
}

export function getSuggestionIcon(type: string): string {
  switch (type) {
    case 'critical':
      return '🚨';
    case 'important':
      return '⚠️';
    case 'moderate':
      return 'ℹ️';
    default:
      return '💡';
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getReadabilityColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function validateFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a PDF or DOCX file.',
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size exceeds 10MB limit.',
    };
  }

  return { isValid: true };
}

export function downloadAsJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

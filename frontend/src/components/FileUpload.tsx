'use client';

import { validateFile } from '@/lib/utils';
import type { FileUploadProps } from '@/types';
import { AlertCircle, File, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [includeGrammarCheck, setIncludeGrammarCheck] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        console.error('File rejected:', rejectedFiles[0].errors);
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const validation = validateFile(file);

        if (!validation.isValid) {
          console.error('Validation failed:', validation.error);
          return;
        }

        onUpload(file, jobDescription || undefined, includeGrammarCheck);
      }
    },
    [onUpload, jobDescription, includeGrammarCheck],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isLoading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  return (
    <div className="space-y-8">
      {/* Job Description Input */}
      <div className="space-y-3">
        <label htmlFor="job-description" className="block text-lg font-semibold text-gray-800">
          Job Description (Optional)
        </label>
        <textarea
          id="job-description"
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to get better matching analysis..."
          className="textarea-field"
          disabled={isLoading}
        />
        <p className="text-sm text-gray-600">
          Adding a job description will help provide more accurate ATS scoring and skill matching.
        </p>
      </div>

      {/* Grammar Check Option */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="checkbox"
            id="grammar-check"
            checked={includeGrammarCheck}
            onChange={e => setIncludeGrammarCheck(e.target.checked)}
            className="sr-only"
            disabled={isLoading}
          />
          <label
            htmlFor="grammar-check"
            className={`flex items-center cursor-pointer ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-all duration-200 ${
                includeGrammarCheck
                  ? 'bg-gradient-to-r from-blue-600 to-red-600 border-transparent'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {includeGrammarCheck && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-gray-800 font-medium">
              Include grammar and readability analysis
            </span>
          </label>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 group
          ${
            isDragActive || dragActive
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102'}
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-6">
          <div className="flex justify-center">
            {isLoading ? (
              <div className="relative">
                <div className="rounded-full h-16 w-16 border-4 border-blue-600/30 border-t-blue-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div
                className={`p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                  isDragActive || dragActive
                    ? 'bg-gradient-to-r from-blue-600 to-red-600'
                    : 'bg-gradient-to-r from-blue-100 to-red-100 group-hover:from-blue-200 group-hover:to-red-200'
                }`}
              >
                <Upload
                  className={`h-12 w-12 ${
                    isDragActive || dragActive ? 'text-white' : 'text-gray-600'
                  }`}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-800">
              {isLoading ? 'Analyzing Your Resume...' : 'Drop Your Resume Here'}
            </p>
            <p className="text-lg text-gray-600">
              {isLoading ? 'Our AI is working its magic' : 'Or click to browse files'}
            </p>
            {isLoading && (
              <div className="flex items-center justify-center space-x-2 mt-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-3 text-gray-500">
            <div className="flex items-center space-x-2">
              <File className="h-5 w-5" />
              <span className="font-medium">PDF or DOCX</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="font-medium">Max 10MB</span>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-3xl">
            <div className="text-center p-8">
              <div className="relative mb-4">
                <div className="rounded-full h-12 w-12 border-4 border-blue-600/30 border-t-blue-500 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-800 font-medium">Processing your resume...</p>
              <p className="text-purple-200/70 text-sm mt-1">This may take a few moments</p>
            </div>
          </div>
        )}
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-md">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 text-lg mb-2">What We Analyze</h4>
              <p className="text-blue-700">
                ATS compatibility, skills extraction, experience analysis, grammar checking, and
                structure optimization.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-md">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-green-900 text-lg mb-2">Privacy & Security</h4>
              <p className="text-green-700">
                Your resume is processed securely locally. No data is stored or shared. Privacy
                first, always.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

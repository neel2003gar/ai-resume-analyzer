'use client';

import AnalysisSettings, {
  AnalysisSettings as AnalysisSettingsType,
} from '@/components/AnalysisSettings';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import ATSScoreDisplay from '@/components/ATSScoreDisplay';
import ExportOptions from '@/components/ExportOptions';
import FileUpload from '@/components/FileUpload';
import KeywordAnalysis from '@/components/KeywordAnalysis';
import ProgressIndicator from '@/components/ProgressIndicator';
import QualityAnalysis from '@/components/QualityAnalysis';
import SkillsDisplay from '@/components/SkillsDisplay';
import SuggestionsList from '@/components/SuggestionsList';
import ThemeToggle from '@/components/ThemeToggle';
import { resumeAPI } from '@/lib/api';
import type { ResumeAnalysisResult } from '@/types';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [analysisSettings, setAnalysisSettings] = useState<AnalysisSettingsType>({
    industry: '',
    experienceLevel: '',
    targetRole: '',
    grammarIntensity: 'advanced',
    atsMode: 'standard',
    includeKeywordAnalysis: true,
    includeIndustryComparison: false,
    includeSalaryInsights: false,
    languageVariant: 'us',
  });

  // Handle shared analysis links
  useEffect(() => {
    const handleSharedAnalysis = () => {
      const hash = window.location.hash;
      if (hash.includes('#shared-analysis')) {
        const params = new URLSearchParams(hash.split('?')[1]);
        const score = params.get('score');
        const skills = params.get('skills');
        const fileName = params.get('fileName');

        if (score && skills && fileName) {
          toast.success(
            `Viewing shared analysis for ${decodeURIComponent(fileName)}: ${score}% ATS score`,
          );
        }
      }
    };

    handleSharedAnalysis();
    window.addEventListener('hashchange', handleSharedAnalysis);

    return () => window.removeEventListener('hashchange', handleSharedAnalysis);
  }, []);

  const handleFileUpload = async (
    file: File,
    jobDescription?: string,
    includeGrammarCheck: boolean = true,
  ) => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // Trigger cleanup of old files before upload
      try {
        await resumeAPI.cleanup();
        console.log('Pre-upload cleanup completed');
      } catch (cleanupError) {
        console.warn('Cleanup failed, continuing with upload:', cleanupError);
      }

      // Upload and analyze resume
      const response = await resumeAPI.uploadResume(file, jobDescription);

      console.log('Upload response:', response);

      // For now, let's just use the actual response structure from backend
      if (response.analysis_result) {
        setAnalysisResult(response.analysis_result);
      } else {
        // If no analysis_result, create a basic structure
        const basicResult = {
          ats_score: { total_score: 0, components: {}, grade: 'F' },
          suggestions: [],
          extracted_skills: [],
          analysis_summary: {
            total_skills: 0,
            has_contact_info: true,
            has_experience: true,
            has_education: true,
            word_count: 0,
            section_count: 5,
          },
        };
        setAnalysisResult(basicResult as any);
      }

      setUploadedFileName(response.filename);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setUploadedFileName('');
  };

  const handleSettingsChange = (newSettings: AnalysisSettingsType) => {
    setAnalysisSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative transition-colors duration-200">
      {/* Theme Toggle */}
      <ThemeToggle />
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            'bg-white border border-gray-200 text-gray-800 shadow-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200',
          duration: 4000,
        }}
      />
      {/* Elegant White Background Design */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient overlays */}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-blue-50 via-blue-25 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-red-50 via-red-25 to-transparent"></div>

        {/* Soft accent shapes */}
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-gradient-to-bl from-blue-100/30 via-gray-50/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-tr from-red-100/30 via-gray-50/20 to-transparent rounded-full blur-2xl"></div>

        {/* Geometric elements */}
        <div className="absolute top-32 left-32 w-40 h-40 bg-gradient-to-br from-gray-100/40 to-blue-100/30 rotate-45 rounded-2xl"></div>
        <div className="absolute bottom-40 right-40 w-32 h-32 bg-gradient-to-tl from-red-100/30 to-gray-100/40 rotate-12 rounded-2xl"></div>
        <div className="absolute top-1/2 left-20 w-24 h-24 bg-gradient-to-r from-blue-100/25 to-transparent rotate-45 rounded-lg"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="staticGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#staticGrid)" className="text-gray-300" />
          </svg>
        </div>

        {/* Elegant accent points */}
        <div className="absolute top-1/6 left-1/5 w-3 h-3 bg-blue-300/40 rounded-full"></div>
        <div className="absolute top-2/5 right-1/4 w-2 h-2 bg-red-300/40 rounded-full"></div>
        <div className="absolute bottom-1/5 right-1/6 w-4 h-4 bg-gray-300/30 rounded-full"></div>
        <div className="absolute bottom-2/5 left-1/3 w-2.5 h-2.5 bg-blue-200/40 rounded-full"></div>
      </div>{' '}
      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="text-center sm:text-left">
              <div className="flex items-center space-x-3 mb-2 animate-fade-in-up">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center shadow-md animate-bounce-gentle">
                  <svg
                    className="w-6 h-6 text-white"
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
                <h1
                  className="text-6xl font-display bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent animate-fade-in-right text-shadow-soft"
                  style={{
                    fontFamily: "'Playfair Display', 'Poppins', serif",
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                  }}
                >
                  AI Resume Analyzer
                </h1>
              </div>
              <p
                className="text-xl text-gray-600 dark:text-gray-300 font-body animate-fade-in-up animation-delay-200 text-shadow-soft"
                style={{
                  fontFamily: "'Inter', 'Poppins', system-ui, sans-serif",
                  fontWeight: 400,
                  letterSpacing: '-0.005em',
                }}
              >
                Transform your resume with AI-powered insights and ATS optimization
              </p>
              <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up animation-delay-400">
                <div className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>100% Free</span>
                </div>
                <div className="flex items-center space-x-1 hover:text-green-600 transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center space-x-1 hover:text-yellow-600 transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Instant Analysis</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {analysisResult && (
                <button
                  onClick={handleNewAnalysis}
                  className="hidden sm:block bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>New Analysis</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysisResult ? (
          /* Upload Section */
          <div className="max-w-4xl mx-auto animate-fade-in-up animation-delay-600">
            {/* Progress Indicator */}
            <ProgressIndicator isAnalyzing={isLoading} hasResults={!!analysisResult} />
            {/* Analysis Settings */}
            <AnalysisSettings
              currentSettings={analysisSettings}
              onSettingsChange={handleSettingsChange}
            />{' '}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-12 shadow-xl transition-colors duration-200">
              <div className="text-center mb-12 animate-fade-in-up animation-delay-700">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl mb-6 animate-bounce-gentle animation-delay-800">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 animate-fade-in-up animation-delay-800">
                  Upload Your Resume
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-900">
                  Get comprehensive AI-powered analysis, ATS optimization, and personalized
                  recommendations to make your resume stand out
                </p>
              </div>

              <div className="animate-fade-in-up animation-delay-1000">
                <FileUpload onUpload={handleFileUpload} isLoading={isLoading} />
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in-up animation-delay-1200">
                <div className="text-center p-6 rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-1300">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-4 animate-bounce-gentle animation-delay-1400">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    ATS Optimization
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Get scored on Applicant Tracking System compatibility
                  </p>
                </div>

                <div className="text-center p-6 rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-1400">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mb-4 animate-bounce-gentle animation-delay-1500">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Smart Suggestions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    AI-powered recommendations for improvement
                  </p>
                </div>

                <div className="text-center p-6 rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-1500">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mb-4 animate-bounce-gentle animation-delay-1600">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality Analysis</h3>
                  <p className="text-gray-600 text-sm">
                    Grammar, readability, and content quality checks
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-8 animate-fade-in-up">
            {/* File Info Header */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl animate-slide-in-from-top">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center animate-bounce-gentle">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 animate-fade-in-right">
                      Analysis Complete!
                    </h2>
                    <p className="text-gray-600 animate-fade-in-right animation-delay-200">
                      File: {uploadedFileName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Analyzed</div>
                  <div className="text-green-600 font-medium">Just now</div>
                </div>
              </div>
            </div>

            {/* ATS Score */}
            <ATSScoreDisplay score={analysisResult.ats_score} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Suggestions */}
                <SuggestionsList suggestions={analysisResult.suggestions} />

                {/* Skills */}
                <SkillsDisplay skills={analysisResult.extracted_skills} />
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Grammar & Quality Analysis */}
                {analysisResult.text_quality && (
                  <QualityAnalysis textQuality={analysisResult.text_quality} />
                )}

                {/* Summary Stats */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    Resume Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Total Skills Found:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {analysisResult.analysis_summary.total_skills}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Contact Information:</span>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          analysisResult.analysis_summary.has_contact_info
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {analysisResult.analysis_summary.has_contact_info
                          ? '✓ Complete'
                          : '✗ Missing'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Work Experience:</span>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          analysisResult.analysis_summary.has_experience
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {analysisResult.analysis_summary.has_experience ? '✓ Present' : '✗ Missing'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Education:</span>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          analysisResult.analysis_summary.has_education
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {analysisResult.analysis_summary.has_education ? '✓ Present' : '✗ Missing'}
                      </div>
                    </div>
                    {analysisResult.experience_years && (
                      <div className="flex justify-between items-center py-3">
                        <span className="text-gray-600 font-medium">Years of Experience:</span>
                        <span className="text-xl font-bold text-gray-800">
                          {analysisResult.experience_years}+ years
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Analytics Section */}
            <div className="space-y-8 mt-8">
              {/* Performance Analytics Dashboard */}
              <AnalyticsDashboard analysisResult={analysisResult} settings={analysisSettings} />

              {/* Keyword Analysis */}
              {analysisSettings.includeKeywordAnalysis && (
                <KeywordAnalysis analysisResult={analysisResult} settings={analysisSettings} />
              )}

              {/* Export Options */}
              <ExportOptions analysisResult={analysisResult} fileName={uploadedFileName} />
            </div>

            {/* Mobile New Analysis Button */}
            {analysisResult && (
              <div className="sm:hidden">
                <button
                  onClick={handleNewAnalysis}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-2xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Analyze New Resume</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 border-t border-gray-700 mt-20 animate-fade-in-up animation-delay-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up animation-delay-1200">
                <div className="text-3xl font-bold text-blue-400 animate-pulse-text">🚀</div>
                <div className="text-sm text-gray-300 mt-1">Free Analysis</div>
              </div>
              <div className="text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up animation-delay-1400">
                <div className="text-3xl font-bold text-green-400 animate-pulse-text">🔒</div>
                <div className="text-sm text-gray-300 mt-1">Privacy First</div>
              </div>
              <div className="text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up animation-delay-1600">
                <div className="text-3xl font-bold text-yellow-400 animate-pulse-text">📱</div>
                <div className="text-sm text-gray-300 mt-1">Mobile Ready</div>
              </div>
              <div className="text-center hover:scale-105 transition-transform duration-300 animate-fade-in-up animation-delay-1800">
                <div className="text-3xl font-bold text-purple-400 animate-pulse-text">⚡</div>
                <div className="text-sm text-gray-300 mt-1">Instant Results</div>
              </div>
            </div>
            <div className="mb-4 animate-fade-in-up animation-delay-2000">
              <h3 className="text-2xl font-heading text-white mb-3 text-shadow-glow">
                AI Resume Analyzer
              </h3>
              <p className="text-gray-400 font-body text-base max-w-2xl mx-auto leading-relaxed">
                Optimize your resume with our advanced AI-powered analysis. Get ATS scores, skill
                extraction, readability metrics, and personalized suggestions - all completely free
                and secure.
              </p>
            </div>
            <p className="text-gray-400 text-sm mb-2 animate-fade-in-up animation-delay-2200">
              &copy; 2025 AI Resume Analyzer. Built with Django, Next.js, and intelligent
              algorithms.
            </p>
            <p className="text-gray-500 text-xs animate-fade-in-up animation-delay-2400">
              🔐 Your data stays private - No cloud uploads, no data storage, no tracking.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

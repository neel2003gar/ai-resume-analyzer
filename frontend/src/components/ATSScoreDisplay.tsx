'use client';

import { cn, getScoreBackgroundColor, getScoreColor } from '@/lib/utils';
import type { ATSScore } from '@/types';
import { Award, BarChart3, TrendingUp } from 'lucide-react';

interface ATSScoreDisplayProps {
  score: ATSScore;
  className?: string;
}

export default function ATSScoreDisplay({ score, className }: ATSScoreDisplayProps) {
  const scoreColor = getScoreColor(score.total_score);
  const bgColor = getScoreBackgroundColor(score.total_score);

  return (
    <div className={cn('bg-white border border-gray-200 rounded-3xl p-8 shadow-xl', className)}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-gray-700" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">ATS Compatibility Score</h3>
        </div>
        <div
          className={`px-4 py-2 rounded-2xl text-lg font-bold backdrop-blur-md border ${
            score.total_score >= 80
              ? 'bg-green-500/20 text-green-300 border-green-500/30'
              : score.total_score >= 60
              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
              : 'bg-red-500/20 text-red-300 border-red-500/30'
          }`}
        >
          Grade {score.grade}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Enhanced Circular Progress */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-6">
            {/* Outer Ring */}
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 56 56">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop
                    offset="0%"
                    stopColor={
                      score.total_score >= 80
                        ? '#10B981'
                        : score.total_score >= 60
                        ? '#F59E0B'
                        : '#EF4444'
                    }
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      score.total_score >= 80
                        ? '#059669'
                        : score.total_score >= 60
                        ? '#D97706'
                        : '#DC2626'
                    }
                  />
                </linearGradient>
              </defs>

              {/* Background circle */}
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="4"
              />

              {/* Progress circle */}
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(score.total_score / 100) * 150.8} 150.8`}
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))',
                }}
              />
            </svg>

            {/* Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-gray-800 mb-1">
                {Math.round(score.total_score)}
              </span>
              <span className="text-xl text-gray-600 font-medium">out of 100</span>
            </div>

            {/* Static decorative elements */}
            <div className="absolute inset-0 opacity-60">
              <div className="absolute top-4 right-8 w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-red-500 rounded-full"></div>
              <div className="absolute top-12 left-4 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {score.total_score >= 90 && '🚀 Excellent'}
              {score.total_score >= 80 && score.total_score < 90 && '✨ Great'}
              {score.total_score >= 70 && score.total_score < 80 && '👍 Good'}
              {score.total_score >= 60 && score.total_score < 70 && '⚠️ Needs Work'}
              {score.total_score < 60 && '🔧 Needs Improvement'}
            </p>
            <p className="text-gray-600">ATS Compatibility Rating</p>
          </div>
        </div>

        {/* Enhanced Score Breakdown */}
        <div className="space-y-6">
          <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
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
            Score Breakdown
          </h4>

          {Object.entries(score.components).map(([category, value], index) => (
            <div key={category} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="capitalize text-gray-800 font-semibold text-lg">
                  {category.replace('_', ' ')}
                </span>
                <span className="text-2xl font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-xl">
                  {Math.round(value)}
                  <span className="text-gray-500">/20</span>
                </span>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                      value >= 16
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                        : value >= 12
                        ? 'bg-gradient-to-r from-blue-400 to-red-400'
                        : 'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{
                      width: `${(value / 20) * 100}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                </div>

                {/* Score indicator */}
                <div
                  className="absolute top-0 w-3 h-3 bg-gray-800 rounded-full shadow-lg transform -translate-y-0 transition-all duration-1000"
                  style={{
                    left: `calc(${(value / 20) * 100}% - 6px)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Score Interpretation */}
      <div className="mt-10 p-6 bg-gray-100 rounded-2xl border border-gray-200">
        <div className="flex items-start space-x-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              score.total_score >= 80
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-blue-400 to-purple-500'
            }`}
          >
            {score.total_score >= 80 ? (
              <Award className="h-6 w-6 text-white" />
            ) : (
              <TrendingUp className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h5 className="text-xl font-bold text-gray-800 mb-2">
              {score.total_score >= 90 && 'Outstanding! Your resume is perfectly optimized'}
              {score.total_score >= 80 &&
                score.total_score < 90 &&
                'Excellent! Minor tweaks can perfect your score'}
              {score.total_score >= 70 &&
                score.total_score < 80 &&
                'Good foundation with optimization opportunities'}
              {score.total_score >= 60 &&
                score.total_score < 70 &&
                'Needs improvement to pass ATS filters'}
              {score.total_score < 60 && 'Significant optimization needed for ATS success'}
            </h5>
            <p className="text-gray-600 leading-relaxed">
              {score.total_score >= 80
                ? 'Your resume should perform exceptionally well with most ATS systems and get past initial screening.'
                : 'Follow our AI-powered suggestions below to dramatically improve your ATS compatibility and job search success.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

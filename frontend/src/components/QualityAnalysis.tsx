'use client';

import { getReadabilityColor } from '@/lib/utils';
import type { TextQualityAnalysis } from '@/types';
import { AlertCircle, BarChart, CheckCircle, FileText } from 'lucide-react';

interface QualityAnalysisProps {
  textQuality: TextQualityAnalysis;
  className?: string;
}

export default function QualityAnalysis({ textQuality, className }: QualityAnalysisProps) {
  const { grammar_errors, error_count, readability, quality_score, recommendations } = textQuality;

  return (
    <div className={`card p-6 ${className || ''}`}>
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Text Quality Analysis</h3>
      </div>

      {/* Quality Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Overall Quality</p>
              <p className="text-2xl font-bold text-purple-900">{quality_score}/100</p>
            </div>
            <BarChart className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            error_count === 0
              ? 'bg-green-50 border-green-200'
              : error_count <= 5
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  error_count === 0
                    ? 'text-green-600'
                    : error_count <= 5
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                Grammar Issues
              </p>
              <p
                className={`text-2xl font-bold ${
                  error_count === 0
                    ? 'text-green-900'
                    : error_count <= 5
                    ? 'text-yellow-900'
                    : 'text-red-900'
                }`}
              >
                {error_count}
              </p>
            </div>
            {error_count === 0 ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Word Count</p>
              <p className="text-2xl font-bold text-blue-900">{readability.word_count}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Readability Metrics */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Readability Analysis</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Reading Level:</span>
                <span className="font-medium text-gray-900">{readability.readability_level}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Flesch Score:</span>
                <span
                  className={`font-medium ${getReadabilityColor(readability.flesch_reading_ease)}`}
                >
                  {readability.flesch_reading_ease.toFixed(1)}
                </span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Grade Level:</span>
                <span className="font-medium text-gray-900">
                  {readability.flesch_kincaid_grade.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Sentences:</span>
                <span className="font-medium text-gray-900">{readability.sentence_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grammar Errors */}
      {error_count > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Grammar Issues ({error_count})</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {grammar_errors.slice(0, 10).map((error, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">{error.message}</p>
                    <p className="text-xs text-red-600 mt-1">Context: {error.context}</p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    {error.category}
                  </span>
                </div>
                {error.replacements.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-red-600">Suggestions:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {error.replacements.map((replacement, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
                        >
                          {replacement}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {grammar_errors.length > 10 && (
              <p className="text-sm text-gray-600 text-center">
                ... and {grammar_errors.length - 10} more issues
              </p>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Quality Recommendations ({recommendations.length})
          </h4>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  rec.priority === 'high'
                    ? 'bg-red-50 border-red-200'
                    : rec.priority === 'medium'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        rec.priority === 'high'
                          ? 'text-red-900'
                          : rec.priority === 'medium'
                          ? 'text-yellow-900'
                          : 'text-blue-900'
                      }`}
                    >
                      {rec.category}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        rec.priority === 'high'
                          ? 'text-red-700'
                          : rec.priority === 'medium'
                          ? 'text-yellow-700'
                          : 'text-blue-700'
                      }`}
                    >
                      {rec.message}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded capitalize ${
                      rec.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quality Tips */}
      {quality_score < 80 && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h5 className="font-medium text-purple-900 mb-2">💡 Quick Tips to Improve Quality</h5>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Use spell check and grammar tools before uploading</li>
            <li>• Keep sentences clear and concise</li>
            <li>• Use active voice when possible</li>
            <li>• Proofread for common errors and typos</li>
          </ul>
        </div>
      )}
    </div>
  );
}

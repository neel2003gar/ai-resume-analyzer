'use client';

import { getSuggestionColor, getSuggestionIcon } from '@/lib/utils';
import type { Suggestion } from '@/types';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface SuggestionsListProps {
  suggestions: Suggestion[];
  className?: string;
}

export default function SuggestionsList({ suggestions, className }: SuggestionsListProps) {
  if (suggestions.length === 0) {
    return (
      <div className={`card p-6 ${className || ''}`}>
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Suggestions</h3>
        </div>
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Great job! No major improvements needed.</p>
        </div>
      </div>
    );
  }

  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, Suggestion[]>);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'important':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'moderate':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'critical':
        return 'Critical Issues';
      case 'important':
        return 'Important Improvements';
      case 'moderate':
        return 'Minor Suggestions';
      default:
        return 'Suggestions';
    }
  };

  return (
    <div className={`card p-6 ${className || ''}`}>
      <div className="flex items-center space-x-2 mb-6">
        <AlertTriangle className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Improvement Suggestions ({suggestions.length})
        </h3>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
          <div key={type}>
            <div className="flex items-center space-x-2 mb-3">
              {getTypeIcon(type)}
              <h4 className="font-medium text-gray-900">
                {getTypeLabel(type)} ({typeSuggestions.length})
              </h4>
            </div>

            <div className="space-y-3">
              {typeSuggestions.map((suggestion, index) => (
                <div
                  key={`${type}-${index}`}
                  className={`p-4 rounded-lg border ${getSuggestionColor(suggestion.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {getSuggestionIcon(suggestion.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">{suggestion.category}</h5>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            suggestion.impact === 'High'
                              ? 'bg-red-100 text-red-700'
                              : suggestion.impact === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {suggestion.impact} Impact
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{suggestion.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Items Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h5 className="font-medium text-blue-900 mb-2">Next Steps</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          {groupedSuggestions.critical && (
            <li>• Address {groupedSuggestions.critical.length} critical issue(s) first</li>
          )}
          {groupedSuggestions.important && (
            <li>• Work on {groupedSuggestions.important.length} important improvement(s)</li>
          )}
          {groupedSuggestions.moderate && (
            <li>• Consider {groupedSuggestions.moderate.length} minor enhancement(s)</li>
          )}
          <li>• Re-upload your resume after making changes to see improvements</li>
        </ul>
      </div>
    </div>
  );
}

'use client';

import { CheckCircle, Circle, Clock } from 'lucide-react';
import React from 'react';

interface ProgressIndicatorProps {
  isAnalyzing: boolean;
  hasResults: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ isAnalyzing, hasResults }) => {
  const steps = [
    { id: 'upload', label: 'Upload Resume', completed: true },
    { id: 'analyze', label: 'AI Analysis', completed: hasResults, inProgress: isAnalyzing },
    { id: 'results', label: 'View Results', completed: hasResults },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg mb-6 animate-fade-in-up">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Progress</h3>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : step.inProgress
                    ? 'bg-blue-500 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : step.inProgress ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-sm mt-2 font-medium ${
                  step.completed || step.inProgress ? 'text-gray-800' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 transition-all duration-500 ${
                  steps[index + 1].completed || steps[index + 1].inProgress
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {isAnalyzing && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Analyzing your resume with AI...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;

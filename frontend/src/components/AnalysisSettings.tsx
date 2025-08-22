'use client';

import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import React, { useState } from 'react';

interface AnalysisSettingsProps {
  onSettingsChange: (settings: AnalysisSettings) => void;
  currentSettings: AnalysisSettings;
}

export interface AnalysisSettings {
  industry: string;
  experienceLevel: string;
  targetRole: string;
  grammarIntensity: string;
  atsMode: string;
  includeKeywordAnalysis: boolean;
  includeIndustryComparison: boolean;
  includeSalaryInsights: boolean;
  languageVariant: string;
}

const AnalysisSettings: React.FC<AnalysisSettingsProps> = ({
  onSettingsChange,
  currentSettings,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState<AnalysisSettings>(currentSettings);

  const industries = [
    'Technology & Software',
    'Healthcare & Medicine',
    'Finance & Banking',
    'Marketing & Advertising',
    'Education & Academia',
    'Engineering & Manufacturing',
    'Sales & Business Development',
    'Human Resources',
    'Consulting',
    'Creative & Design',
    'Legal & Law',
    'Data Science & Analytics',
    'Operations & Supply Chain',
    'Startup & Entrepreneurship',
    'Non-Profit & Social Impact',
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-7 years)' },
    { value: 'senior', label: 'Senior Level (8-15 years)' },
    { value: 'executive', label: 'Executive (15+ years)' },
  ];

  const targetRoles = [
    'Individual Contributor',
    'Team Lead',
    'Manager',
    'Senior Manager',
    'Director',
    'Vice President',
    'C-Level Executive',
    'Consultant',
    'Freelancer',
  ];

  const handleSettingChange = (key: keyof AnalysisSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg mb-6 animate-fade-in-up">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Analysis Settings</h3>
            <p className="text-sm text-gray-600">Customize your resume analysis</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {isExpanded && (
        <div className="p-6 border-t border-gray-200 space-y-6 animate-fade-in-up">
          {/* Industry Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Industry</label>
            <select
              value={settings.industry}
              onChange={e => handleSettingChange('industry', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
            <select
              value={settings.experienceLevel}
              onChange={e => handleSettingChange('experienceLevel', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Experience Level</option>
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Role Type</label>
            <select
              value={settings.targetRole}
              onChange={e => handleSettingChange('targetRole', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Role Type</option>
              {targetRoles.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Grammar Check Intensity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grammar Check Intensity
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['basic', 'advanced', 'strict'].map(intensity => (
                <button
                  key={intensity}
                  onClick={() => handleSettingChange('grammarIntensity', intensity)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    settings.grammarIntensity === intensity
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ATS Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ATS Optimization Mode
            </label>
            <select
              value={settings.atsMode}
              onChange={e => handleSettingChange('atsMode', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="standard">Standard ATS</option>
              <option value="workday">Workday Optimized</option>
              <option value="greenhouse">Greenhouse Optimized</option>
              <option value="lever">Lever Optimized</option>
              <option value="successfactors">SuccessFactors Optimized</option>
              <option value="taleo">Taleo Optimized</option>
            </select>
          </div>

          {/* Language Variant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language Variant</label>
            <select
              value={settings.languageVariant}
              onChange={e => handleSettingChange('languageVariant', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="us">US English</option>
              <option value="uk">UK English</option>
              <option value="ca">Canadian English</option>
              <option value="au">Australian English</option>
            </select>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Advanced Analysis Options</h4>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.includeKeywordAnalysis}
                  onChange={e => handleSettingChange('includeKeywordAnalysis', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Keyword Density Analysis</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.includeIndustryComparison}
                  onChange={e => handleSettingChange('includeIndustryComparison', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Industry Benchmarking</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.includeSalaryInsights}
                  onChange={e => handleSettingChange('includeSalaryInsights', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Salary Range Insights</span>
              </label>
            </div>
          </div>

          {/* Reset to Defaults */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                const defaultSettings: AnalysisSettings = {
                  industry: '',
                  experienceLevel: '',
                  targetRole: '',
                  grammarIntensity: 'advanced',
                  atsMode: 'standard',
                  includeKeywordAnalysis: true,
                  includeIndustryComparison: false,
                  includeSalaryInsights: false,
                  languageVariant: 'us',
                };
                setSettings(defaultSettings);
                onSettingsChange(defaultSettings);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Reset to Default Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisSettings;

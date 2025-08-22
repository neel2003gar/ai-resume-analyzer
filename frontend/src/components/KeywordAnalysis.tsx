'use client';

import { AlertTriangle, CheckCircle, Search, Target, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

interface KeywordAnalysisProps {
  analysisResult: any;
  settings: any;
}

const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({ analysisResult, settings }) => {
  const [activeTab, setActiveTab] = useState('density');

  // Industry-specific keywords (this would typically come from a database)
  const industryKeywords = {
    'Technology & Software': [
      'agile',
      'scrum',
      'javascript',
      'python',
      'react',
      'nodejs',
      'aws',
      'docker',
      'kubernetes',
      'microservices',
      'api',
      'database',
      'sql',
      'mongodb',
      'git',
      'ci/cd',
      'devops',
      'cloud',
    ],
    'Healthcare & Medicine': [
      'patient care',
      'hipaa',
      'medical records',
      'clinical',
      'healthcare',
      'medical',
      'nursing',
      'pharmacy',
      'diagnosis',
      'treatment',
      'healthcare compliance',
      'medical coding',
    ],
    'Finance & Banking': [
      'financial analysis',
      'risk management',
      'compliance',
      'audit',
      'accounting',
      'excel',
      'financial modeling',
      'investment',
      'portfolio',
      'regulatory',
      'sox',
      'gaap',
    ],
    'Marketing & Advertising': [
      'digital marketing',
      'seo',
      'sem',
      'social media',
      'content marketing',
      'analytics',
      'brand management',
      'campaign',
      'conversion',
      'roi',
      'google analytics',
      'facebook ads',
    ],
    default: [
      'leadership',
      'management',
      'communication',
      'teamwork',
      'problem solving',
      'project management',
      'analysis',
      'strategy',
      'planning',
      'execution',
      'results',
      'performance',
    ],
  };

  const getIndustryKeywords = () => {
    return (
      industryKeywords[settings?.industry as keyof typeof industryKeywords] ||
      industryKeywords.default
    );
  };

  // Analyze keyword density in resume text
  const analyzeKeywordDensity = () => {
    if (!analysisResult?.text_content) return [];

    const text = analysisResult.text_content.toLowerCase();
    const keywords = getIndustryKeywords();

    return keywords
      .map(keyword => {
        const regex = new RegExp(keyword.toLowerCase(), 'gi');
        const matches = text.match(regex) || [];
        const density = (matches.length / text.split(' ').length) * 100;

        return {
          keyword,
          count: matches.length,
          density: density.toFixed(3),
          status: matches.length > 0 ? 'found' : 'missing',
          importance: getKeywordImportance(keyword),
        };
      })
      .sort((a, b) => b.count - a.count);
  };

  const getKeywordImportance = (keyword: string) => {
    // Critical keywords that should appear in most resumes
    const critical = ['leadership', 'management', 'experience', 'skills', 'results'];
    const important = ['project', 'team', 'analysis', 'strategy', 'communication'];

    if (critical.some(k => keyword.toLowerCase().includes(k))) return 'critical';
    if (important.some(k => keyword.toLowerCase().includes(k))) return 'important';
    return 'standard';
  };

  // ATS keyword suggestions
  const getATSKeywordSuggestions = () => {
    const currentKeywords = analyzeKeywordDensity();
    const missingCritical = currentKeywords.filter(
      k => k.status === 'missing' && k.importance === 'critical',
    );
    const missingImportant = currentKeywords.filter(
      k => k.status === 'missing' && k.importance === 'important',
    );

    return {
      critical: missingCritical.slice(0, 5),
      important: missingImportant.slice(0, 8),
      suggestions: [
        'Add action verbs like "led", "developed", "implemented"',
        'Include quantifiable achievements with numbers',
        'Use industry-specific terminology',
        'Match job posting keywords exactly',
        'Include both acronyms and full terms (e.g., "AI" and "Artificial Intelligence")',
      ],
    };
  };

  const keywordData = analyzeKeywordDensity();
  const suggestions = getATSKeywordSuggestions();

  // Debug: Check if we have text content
  console.log('KeywordAnalysis Debug:', {
    hasAnalysisResult: !!analysisResult,
    hasTextContent: !!analysisResult?.text_content,
    textContentLength: analysisResult?.text_content?.length || 0,
    keywordDataLength: keywordData.length,
  });

  // Show message if no text content is available
  if (!analysisResult?.text_content) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg animate-fade-in-up">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Keyword Analysis</h3>
            <p className="text-sm text-gray-600">Text content not available for analysis</p>
          </div>
        </div>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">
            Unable to perform keyword analysis. Please ensure the resume text was extracted
            properly.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'density', label: 'Keyword Density', icon: Target },
    { id: 'missing', label: 'Missing Keywords', icon: AlertTriangle },
    { id: 'suggestions', label: 'ATS Optimization', icon: TrendingUp },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg animate-fade-in-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Keyword Analysis</h3>
          <p className="text-sm text-gray-600">
            {settings?.industry ? `Optimized for ${settings.industry}` : 'General keyword analysis'}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'density' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {keywordData.filter(k => k.status === 'found').length}
              </div>
              <div className="text-sm text-blue-700">Keywords Found</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {keywordData.filter(k => k.status === 'missing').length}
              </div>
              <div className="text-sm text-red-700">Keywords Missing</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  (keywordData.filter(k => k.status === 'found').length / keywordData.length) * 100,
                )}
                %
              </div>
              <div className="text-sm text-green-700">Coverage Rate</div>
            </div>
          </div>

          <div className="space-y-3">
            {keywordData.slice(0, 15).map((item, index) => (
              <div
                key={item.keyword}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-3">
                  {item.status === 'found' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <span className="font-medium text-gray-800 capitalize">{item.keyword}</span>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        item.importance === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : item.importance === 'important'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.importance}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{item.count} times</div>
                  <div className="text-xs text-gray-600">{item.density}% density</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'missing' && (
        <div className="space-y-6">
          {suggestions.critical.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-red-700 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Critical Missing Keywords
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {suggestions.critical.map((item, index) => (
                  <div
                    key={item.keyword}
                    className="bg-red-50 border border-red-200 rounded-lg p-3 text-center animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-sm font-medium text-red-800 capitalize">
                      {item.keyword}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions.important.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-yellow-700 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Important Missing Keywords
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {suggestions.important.map((item, index) => (
                  <div
                    key={item.keyword}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center animate-fade-in-up"
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <span className="text-sm font-medium text-yellow-800 capitalize">
                      {item.keyword}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-md font-semibold text-blue-800 mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              ATS Optimization Tips
            </h4>
            <div className="space-y-3">
              {suggestions.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-700">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">Quick Wins</h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Add missing critical keywords naturally</li>
                <li>• Use both acronyms and full terms</li>
                <li>• Include action verbs in descriptions</li>
                <li>• Quantify achievements with numbers</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 className="font-semibold text-purple-800 mb-2">Pro Tips</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Mirror exact job posting language</li>
                <li>• Use industry-standard terminology</li>
                <li>• Include relevant certifications</li>
                <li>• Add skills section with keywords</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordAnalysis;

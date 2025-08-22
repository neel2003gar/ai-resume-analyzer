'use client';

import { Award, BarChart3, PieChart, Target, TrendingUp } from 'lucide-react';
import React from 'react';

interface AnalyticsDashboardProps {
  analysisResult: any;
  settings: any;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analysisResult, settings }) => {
  // Calculate various metrics
  const overallScore = analysisResult?.ats_score?.total_score || 0;
  const skillsCount = analysisResult?.analysis_summary?.total_skills || 0;
  const experienceYears = analysisResult?.experience_years || 0;

  // Industry benchmarks (mock data - you can replace with real industry data)
  const industryBenchmarks = {
    'Technology & Software': { avgScore: 78, avgSkills: 12, avgExperience: 5.2 },
    'Healthcare & Medicine': { avgScore: 72, avgSkills: 8, avgExperience: 7.1 },
    'Finance & Banking': { avgScore: 82, avgSkills: 10, avgExperience: 6.8 },
    'Marketing & Advertising': { avgScore: 75, avgSkills: 9, avgExperience: 4.9 },
    default: { avgScore: 75, avgSkills: 10, avgExperience: 5.5 },
  };

  const benchmark =
    industryBenchmarks[settings?.industry as keyof typeof industryBenchmarks] ||
    industryBenchmarks.default;

  const metrics = [
    {
      title: 'ATS Score',
      value: overallScore,
      benchmark: benchmark.avgScore,
      icon: Target,
      color: 'blue',
      suffix: '%',
    },
    {
      title: 'Skills Identified',
      value: skillsCount,
      benchmark: benchmark.avgSkills,
      icon: Award,
      color: 'green',
      suffix: '',
    },
    {
      title: 'Years Experience',
      value: experienceYears,
      benchmark: benchmark.avgExperience,
      icon: TrendingUp,
      color: 'purple',
      suffix: 'y',
    },
  ];

  const getPerformanceColor = (value: number, benchmark: number) => {
    const ratio = value / benchmark;
    if (ratio >= 1.1) return 'text-green-600';
    if (ratio >= 0.9) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLabel = (value: number, benchmark: number) => {
    const ratio = value / benchmark;
    if (ratio >= 1.1) return 'Above Average';
    if (ratio >= 0.9) return 'Average';
    return 'Below Average';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg animate-fade-in-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Performance Analytics</h3>
          <p className="text-sm text-gray-600">
            {settings?.industry
              ? `Compared to ${settings.industry} industry`
              : 'General industry comparison'}
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const performanceColor = getPerformanceColor(metric.value, metric.benchmark);
          const performanceLabel = getPerformanceLabel(metric.value, metric.benchmark);

          return (
            <div
              key={metric.title}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 text-${metric.color}-500`} />
                <span className={`text-xs px-2 py-1 rounded-full ${performanceColor} bg-gray-100`}>
                  {performanceLabel}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-800">
                    {metric.value}
                    {metric.suffix}
                  </span>
                  <span className="text-sm text-gray-500">
                    vs {metric.benchmark}
                    {metric.suffix}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{metric.title}</p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`bg-${metric.color}-500 h-2 rounded-full transition-all duration-500`}
                    style={{
                      width: `${Math.min((metric.value / metric.benchmark) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skills Distribution */}
      {analysisResult?.skills && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
            <PieChart className="w-4 h-4 mr-2 text-purple-500" />
            Skills Analysis
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(analysisResult.skills)
              .slice(0, 8)
              .map(([skill, confidence], index) => (
                <div
                  key={skill}
                  className="text-center p-3 bg-gray-50 rounded-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-sm font-medium text-gray-800 truncate">{skill}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {typeof confidence === 'number'
                      ? `${Math.round(confidence * 100)}%`
                      : 'Identified'}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full"
                      style={{
                        width: `${typeof confidence === 'number' ? confidence * 100 : 80}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
          Quick Improvements
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {overallScore < benchmark.avgScore && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-sm font-medium text-yellow-800">Boost ATS Score</div>
              <div className="text-xs text-yellow-700 mt-1">
                Add more industry keywords to reach the {benchmark.avgScore}% industry average
              </div>
            </div>
          )}

          {skillsCount < benchmark.avgSkills && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm font-medium text-blue-800">Expand Skills</div>
              <div className="text-xs text-blue-700 mt-1">
                Consider adding {Math.ceil(benchmark.avgSkills - skillsCount)} more relevant skills
              </div>
            </div>
          )}

          {!analysisResult?.analysis_summary?.has_contact_info && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-sm font-medium text-red-800">Add Contact Info</div>
              <div className="text-xs text-red-700 mt-1">
                Include phone number, email, and LinkedIn profile
              </div>
            </div>
          )}

          {analysisResult?.text_quality?.grammar_issues?.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-sm font-medium text-purple-800">Fix Grammar</div>
              <div className="text-xs text-purple-700 mt-1">
                {analysisResult.text_quality.grammar_issues.length} grammar issues detected
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

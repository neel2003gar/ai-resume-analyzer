'use client';

import { Check, Copy, Download, File, FileText, Mail, Printer, Share2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ExportOptionsProps {
  analysisResult: any;
  fileName: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ analysisResult, fileName }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [copied, setCopied] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');

  const exportFormats = [
    {
      value: 'pdf',
      label: 'PDF Report',
      icon: FileText,
      description: 'Complete analysis report (PDF format)',
    },
    { value: 'summary', label: 'Executive Summary', icon: File, description: 'Key findings only' },
    { value: 'json', label: 'Raw Data (JSON)', icon: File, description: 'All analysis data' },
    { value: 'email', label: 'Email Template', icon: Mail, description: 'Open email client' },
  ];

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportStatus('Preparing export...');

    try {
      let content = '';
      let filename = '';
      let mimeType = '';

      switch (format) {
        case 'pdf':
          // Generate PDF-style HTML report for viewing/printing/converting to PDF
          content = generatePDFContent();
          filename = `REPORT_${fileName}_analysis.html`;
          mimeType = 'text/html';
          break;

        case 'summary':
          content = generateSummaryReport();
          filename = `REPORT_${fileName}_summary.txt`;
          mimeType = 'text/plain';
          break;

        case 'json':
          content = JSON.stringify(analysisResult, null, 2);
          filename = `REPORT_${fileName}_data.json`;
          mimeType = 'application/json';
          break;

        case 'email':
          // Open email client with pre-filled template
          const emailContent = generateEmailTemplate();
          const subject = encodeURIComponent(`Resume Analysis Results - ${fileName}`);
          const body = encodeURIComponent(emailContent);
          window.open(`mailto:?subject=${subject}&body=${body}`);
          setExportStatus('Email client opened!');
          setTimeout(() => setExportStatus(''), 3000);
          setIsExporting(false);
          return; // Don't proceed with file download
      }

      setExportStatus('Downloading...');

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus('Download completed!');
      setTimeout(() => setExportStatus(''), 3000);
      toast.success(`${format.toUpperCase()} file downloaded successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('Export failed. Please try again.');
      setTimeout(() => setExportStatus(''), 5000);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDFContent = () => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>AI Resume Analysis Report - ${fileName}</title>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Inter', Arial, sans-serif; 
            line-height: 1.6; 
            margin: 0; 
            color: #1f2937; 
            background: white;
            font-size: 12pt;
        }
        
        .container { 
            max-width: 210mm; 
            margin: 0 auto; 
            padding: 20mm; 
            background: white;
        }
        
        .header { 
            text-align: center; 
            border-bottom: 3px solid #3b82f6; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        
        .header h1 {
            font-size: 28pt;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 14pt;
            color: #6b7280;
            font-weight: 500;
        }
        
        .score { 
            background: linear-gradient(135deg, #3b82f6, #1e40af); 
            color: white; 
            padding: 25px; 
            border-radius: 12px; 
            text-align: center; 
            margin: 25px 0; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .score h2 {
            font-size: 24pt;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .score p {
            font-size: 16pt;
            opacity: 0.9;
        }
        
        .section { 
            margin: 30px 0; 
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 18pt;
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 15px;
            border-left: 4px solid #3b82f6;
            padding-left: 12px;
        }
        
        .summary-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
            margin: 20px 0; 
        }
        
        .summary-item { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 10px; 
            border: 1px solid #e5e7eb;
        }
        
        .summary-item h3 {
            font-size: 14pt;
            font-weight: 600;
            color: #374151;
            margin-bottom: 10px;
        }
        
        .summary-item p {
            font-size: 12pt;
            color: #6b7280;
            margin-bottom: 8px;
        }
        
        .skill-item { 
            background: #e0f2fe; 
            color: #0369a1; 
            padding: 8px 12px; 
            margin: 5px; 
            border-radius: 20px; 
            display: inline-block;
            font-size: 11pt;
            font-weight: 500;
            border: 1px solid #bae6fd;
        }
        
        .recommendation { 
            background: #fef3c7; 
            border-left: 4px solid #f59e0b; 
            padding: 15px; 
            margin: 12px 0; 
            border-radius: 0 8px 8px 0;
        }
        
        .recommendation strong {
            color: #92400e;
        }
        
        .components-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .component-item {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        
        .component-score {
            font-size: 18pt;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 5px;
        }
        
        .component-label {
            font-size: 11pt;
            color: #6b7280;
            text-transform: capitalize;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f3f4f6;
            border-radius: 10px;
            color: #6b7280;
            font-size: 11pt;
        }
        
        @media print {
            body { margin: 0; }
            .container { margin: 0; padding: 15mm; }
            .header, .score, .section { page-break-inside: avoid; }
            .summary-grid { grid-template-columns: 1fr 1fr; }
        }
        
        @page {
            size: A4;
            margin: 2cm;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 AI Resume Analysis Report</h1>
            <p><strong>File:</strong> ${fileName} | <strong>Generated:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
        </div>

        <div class="score">
            <h2>🏆 Overall ATS Score: ${analysisResult.ats_score?.total_score || 'N/A'}%</h2>
            <p>Performance Grade: ${analysisResult.ats_score?.grade || 'N/A'}</p>
        </div>

        <div class="section">
            <div class="section-title">📊 Executive Summary</div>
            <div class="summary-grid">
                <div class="summary-item">
                    <h3>� Key Metrics</h3>
                    <p><strong>Skills Identified:</strong> ${analysisResult.analysis_summary?.total_skills || 0}</p>
                    <p><strong>Contact Information:</strong> ${analysisResult.analysis_summary?.has_contact_info ? '✅ Complete' : '❌ Missing'}</p>
                    <p><strong>Professional Summary:</strong> ${analysisResult.analysis_summary?.has_summary ? '✅ Present' : '❌ Missing'}</p>
                    <p><strong>Work Experience:</strong> ${analysisResult.analysis_summary?.experience_years || 'Not specified'}</p>
                    <p><strong>Education Section:</strong> ${analysisResult.analysis_summary?.has_education ? '✅ Present' : '❌ Missing'}</p>
                </div>
                
                <div class="summary-item">
                    <h3>🔍 Quality Metrics</h3>
                    <p><strong>Grammar Issues:</strong> ${analysisResult.text_quality?.grammar_issues?.length || 0}</p>
                    <p><strong>Readability Score:</strong> ${analysisResult.text_quality?.readability_score || 'N/A'}</p>
                    <p><strong>Word Count:</strong> ${analysisResult.text_quality?.word_count || 'N/A'}</p>
                    <p><strong>Text Quality:</strong> ${analysisResult.text_quality?.flesch_reading_ease ? Math.round(analysisResult.text_quality.flesch_reading_ease) + '/100' : 'N/A'}</p>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🛠 Skills Analysis</div>
            <div>
                ${Object.entries(analysisResult.skills || {})
                  .map(
                    ([skill, confidence]) =>
                      `<span class="skill-item">${skill}${
                        typeof confidence === 'number'
                          ? ': ' + Math.round(confidence * 100) + '%'
                          : ''
                      }</span>`,
                  )
                  .join(' ')}
                ${Object.keys(analysisResult.skills || {}).length === 0 ? '<p style="color: #ef4444; font-style: italic;">No skills identified. Consider adding relevant technical and soft skills to your resume.</p>' : ''}
            </div>
        </div>

        <div class="section">
            <div class="section-title">💡 Top Recommendations</div>
            ${(analysisResult.suggestions || [])
              .slice(0, 8)
              .map(
                (suggestion: any, index: number) =>
                  `<div class="recommendation"><strong>${index + 1}.</strong> ${
                    suggestion.suggestion || suggestion
                  }</div>`,
              )
              .join('')}
            ${(analysisResult.suggestions || []).length === 0 ? '<p style="color: #6b7280; font-style: italic;">No specific recommendations available. Your resume appears to be well-structured.</p>' : ''}
        </div>

        <div class="section">
            <div class="section-title">📈 ATS Score Breakdown</div>
            <div class="components-grid">
                ${Object.entries(analysisResult.ats_score?.components || {})
                  .map(
                    ([component, score]) =>
                      `<div class="component-item">
                        <div class="component-score">${score}/20</div>
                        <div class="component-label">${component.replace('_', ' ')}</div>
                      </div>`,
                  )
                  .join('')}
            </div>
        </div>

        <div class="footer">
            <p><strong>🤖 AI Resume Analyzer</strong></p>
            <p><em>Professional Resume Analysis & Optimization Tool</em></p>
            <p>Generated on ${new Date().toLocaleString()} | Visit our platform for more insights</p>
        </div>
    </div>
</body>
</html>
    `;
  };

  const generateSummaryReport = () => {
    return `
RESUME ANALYSIS SUMMARY
======================

File: ${fileName}
Overall ATS Score: ${analysisResult.ats_score?.total_score || 'N/A'}%

KEY FINDINGS:
• ${analysisResult.analysis_summary?.total_skills || 0} skills identified
• Contact info: ${
      analysisResult.analysis_summary?.has_contact_info ? 'Complete' : 'Needs attention'
    }
• Experience: ${analysisResult.experience_years || 'Not specified'} years
• Grammar issues: ${analysisResult.text_quality?.grammar_issues?.length || 0}

TOP RECOMMENDATIONS:
${
  analysisResult.suggestions
    ?.slice(0, 3)
    .map((suggestion: any, index: number) => `${index + 1}. ${suggestion.suggestion || suggestion}`)
    .join('\n') || 'Continue optimizing for ATS compatibility'
}

---
Generated by AI Resume Analyzer
    `;
  };

  const generateEmailTemplate = () => {
    return `
Subject: Resume Analysis Results - ${fileName}

Hi there,

I've completed the AI-powered analysis of the resume "${fileName}". Here are the key findings:

📊 OVERALL SCORE: ${analysisResult.ats_score?.total_score || 'N/A'}%

🔍 KEY METRICS:
• Skills Identified: ${analysisResult.analysis_summary?.total_skills || 0}
• ATS Compatibility: ${analysisResult.ats_score?.total_score || 'N/A'}%
• Experience Level: ${analysisResult.experience_years || 'Not specified'} years
• Quality Check: ${analysisResult.text_quality?.grammar_issues?.length || 0} grammar issues

🎯 TOP RECOMMENDATIONS:
${
  analysisResult.suggestions
    ?.slice(0, 3)
    .map((suggestion: any, index: number) => `${index + 1}. ${suggestion.suggestion || suggestion}`)
    .join('\n') || '• Focus on ATS optimization\n• Add more relevant keywords\n• Improve formatting'
}

The analysis shows ${
      analysisResult.ats_score >= 80
        ? 'excellent'
        : analysisResult.ats_score >= 60
        ? 'good'
        : 'significant room for improvement'
    } ATS compatibility with opportunities for enhancement.

Best regards,
AI Resume Analyzer
    `;
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const shareableLink = `${window.location.origin}/#shared-analysis?score=${
    analysisResult.ats_score?.total_score || 0
  }&skills=${analysisResult.analysis_summary?.total_skills || 0}&fileName=${encodeURIComponent(
    fileName,
  )}`;

  const shareAnalysis = async () => {
    if (navigator.share) {
      // Use native share API if available (mobile devices)
      try {
        await navigator.share({
          title: `Resume Analysis Results - ${fileName}`,
          text: `Check out this resume analysis: ${
            analysisResult.ats_score?.total_score || 0
          }% ATS score with ${
            analysisResult.analysis_summary?.total_skills || 0
          } skills identified.`,
          url: shareableLink,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard(shareableLink);
      }
    } else {
      // Fallback to copying link
      copyToClipboard(shareableLink);
      toast.success('Share link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg animate-fade-in-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">Export & Share</h3>
          <p className="text-sm text-gray-600">Download your analysis in multiple formats</p>
        </div>
        {exportStatus && (
          <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {exportStatus}
          </div>
        )}
      </div>

      {/* Export Format Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {exportFormats.map(format => {
          const Icon = format.icon;
          return (
            <button
              key={format.value}
              onClick={() => handleExport(format.value)}
              disabled={isExporting}
              className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-800">{format.label}</div>
                <div className="text-sm text-gray-600">{format.description}</div>
              </div>
              {isExporting && (
                <div className="ml-auto">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
          <Share2 className="w-4 h-4 mr-2 text-purple-500" />
          Quick Actions
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Copy Summary */}
          <button
            onClick={() => copyToClipboard(generateSummaryReport())}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-sm text-gray-700">{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          {/* Print PDF Report */}
          <button
            onClick={() => {
              const printContent = generatePDFContent();
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                printWindow.document.write(printContent);
                printWindow.document.close();
                printWindow.print();
              }
            }}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Print PDF</span>
          </button>

          {/* Share Link */}
          <button
            onClick={shareAnalysis}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Share2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Share Results</span>
          </button>

          {/* LinkedIn Share */}
          <button
            onClick={() => {
              const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                shareableLink,
              )}`;
              window.open(linkedInUrl, '_blank', 'width=600,height=400');
            }}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
          >
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="text-sm text-gray-700">LinkedIn</span>
          </button>
        </div>
      </div>

      {/* Analysis Summary Preview */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">Preview Summary</h4>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 font-mono whitespace-pre-line max-h-40 overflow-y-auto">
          {generateSummaryReport()}
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;

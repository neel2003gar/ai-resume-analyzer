// API Response Types
export interface ContactInfo {
  email?: string;
  phone?: string;
}

export interface ResumeSections {
  contact: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
}

export interface ATSScoreComponents {
  structure: number;
  keywords: number;
  experience: number;
  education: number;
  skills: number;
  contact: number;
}

export interface ATSScore {
  total_score: number;
  components: ATSScoreComponents;
  grade: string;
}

export interface Suggestion {
  type: 'critical' | 'important' | 'moderate';
  category: string;
  suggestion: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface GrammarError {
  message: string;
  offset: number;
  length: number;
  replacements: string[];
  context: string;
  category: string;
  rule_id: string;
}

export interface ReadabilityMetrics {
  flesch_reading_ease: number;
  flesch_kincaid_grade: number;
  readability_level: string;
  word_count: number;
  sentence_count: number;
  syllable_count: number;
}

export interface QualityRecommendation {
  type: string;
  category: string;
  message: string;
  priority: string;
}

export interface TextQualityAnalysis {
  grammar_errors: GrammarError[];
  error_count: number;
  readability: ReadabilityMetrics;
  word_count: number;
  avg_word_length: number;
  quality_score: number;
  recommendations: QualityRecommendation[];
}

export interface AnalysisSummary {
  total_skills: number;
  has_contact_info: boolean;
  has_experience: boolean;
  has_education: boolean;
}

export interface ResumeAnalysisResult {
  ats_score: ATSScore;
  suggestions: Suggestion[];
  extracted_skills: string[];
  experience_years?: number;
  analysis_summary: AnalysisSummary;
  text_quality?: TextQualityAnalysis;
  text_content?: string; // For keyword analysis
  skills?: { [key: string]: number }; // Skills with confidence scores
}

export interface ResumeUploadResponse {
  id: number;
  filename: string;
  message: string;
  analysis_result: ResumeAnalysisResult;
}

export interface ResumeListItem {
  id: number;
  filename: string;
  ats_score?: number;
  created_at: string;
  has_job_description: boolean;
}

export interface ResumeListResponse {
  resumes: ResumeListItem[];
  total: number;
}

export interface JobDescriptionRequest {
  resume_id: number;
  job_description: string;
}

export interface ErrorResponse {
  error: string;
  detail?: string;
  status_code: number;
}

// Component Props Types
export interface FileUploadProps {
  onUpload: (file: File, jobDescription?: string, includeGrammarCheck?: boolean) => void;
  isLoading: boolean;
}

export interface ATSScoreDisplayProps {
  score: ATSScore;
  className?: string;
}

export interface SuggestionsListProps {
  suggestions: Suggestion[];
  className?: string;
}

export interface SkillsDisplayProps {
  skills: string[];
  className?: string;
}

export interface QualityAnalysisProps {
  textQuality: TextQualityAnalysis;
  className?: string;
}

// Utility Types
export type SuggestionType = 'critical' | 'important' | 'moderate';
export type ImpactLevel = 'High' | 'Medium' | 'Low';
export type ScoreGrade = 'A+' | 'A' | 'B' | 'C' | 'D';

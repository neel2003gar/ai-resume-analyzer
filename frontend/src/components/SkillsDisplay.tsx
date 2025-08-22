'use client';

import { Brain, Briefcase, Code, Users } from 'lucide-react';

interface SkillsDisplayProps {
  skills: string[];
  className?: string;
}

export default function SkillsDisplay({ skills, className }: SkillsDisplayProps) {
  if (skills.length === 0) {
    return (
      <div className={`card p-6 ${className || ''}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Extracted Skills</h3>
        </div>
        <div className="text-center py-8">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No skills detected. Consider adding a skills section.</p>
        </div>
      </div>
    );
  }

  // Categorize skills (basic categorization)
  const categorizeSkills = (skillsList: string[]) => {
    const categories = {
      technical: [] as string[],
      soft: [] as string[],
      tools: [] as string[],
      other: [] as string[],
    };

    const technicalKeywords = [
      'python',
      'javascript',
      'java',
      'react',
      'node',
      'html',
      'css',
      'sql',
      'php',
      'c++',
      'c#',
    ];
    const softKeywords = [
      'leadership',
      'communication',
      'teamwork',
      'management',
      'analytical',
      'creative',
    ];
    const toolKeywords = ['git', 'docker', 'kubernetes', 'aws', 'azure', 'jenkins', 'jira'];

    skillsList.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (technicalKeywords.some(keyword => skillLower.includes(keyword))) {
        categories.technical.push(skill);
      } else if (softKeywords.some(keyword => skillLower.includes(keyword))) {
        categories.soft.push(skill);
      } else if (toolKeywords.some(keyword => skillLower.includes(keyword))) {
        categories.tools.push(skill);
      } else {
        categories.other.push(skill);
      }
    });

    return categories;
  };

  const categorizedSkills = categorizeSkills(skills);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Code className="h-4 w-4" />;
      case 'soft':
        return <Users className="h-4 w-4" />;
      case 'tools':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'soft':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'tools':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'technical':
        return 'Technical Skills';
      case 'soft':
        return 'Soft Skills';
      case 'tools':
        return 'Tools & Technologies';
      default:
        return 'Other Skills';
    }
  };

  return (
    <div className={`card p-6 ${className || ''}`}>
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Extracted Skills ({skills.length})</h3>
      </div>

      <div className="space-y-6">
        {Object.entries(categorizedSkills).map(([category, categorySkills]) => {
          if (categorySkills.length === 0) return null;

          return (
            <div key={category}>
              <div className="flex items-center space-x-2 mb-3">
                {getCategoryIcon(category)}
                <h4 className="font-medium text-gray-900">
                  {getCategoryLabel(category)} ({categorySkills.length})
                </h4>
              </div>

              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                      category,
                    )}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skills Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h5 className="font-medium text-blue-900 mb-2">Skills Analysis</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Total Skills:</span>
            <span className="font-medium text-blue-900 ml-2">{skills.length}</span>
          </div>
          <div>
            <span className="text-blue-700">Technical:</span>
            <span className="font-medium text-blue-900 ml-2">
              {categorizedSkills.technical.length}
            </span>
          </div>
          <div>
            <span className="text-blue-700">Soft Skills:</span>
            <span className="font-medium text-blue-900 ml-2">{categorizedSkills.soft.length}</span>
          </div>
          <div>
            <span className="text-blue-700">Tools:</span>
            <span className="font-medium text-blue-900 ml-2">{categorizedSkills.tools.length}</span>
          </div>
        </div>

        {skills.length < 10 && (
          <div className="mt-3 text-sm text-blue-800">
            💡 Consider adding more skills to improve your ATS score
          </div>
        )}
      </div>
    </div>
  );
}

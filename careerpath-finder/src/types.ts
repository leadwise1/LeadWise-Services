export type LearnerLevel = 
  | 'high_school_student'
  | 'college_student'
  | 'career_changer'
  | 'early_career'
  | 'reskilling_adult';

export interface TraitScore {
  analytical: number;
  creative: number;
  interpersonal: number;
  technical: number;
  leadership: number;
  operational: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  subtitle?: string;
  iconName?: string;
  traits: Partial<TraitScore>;
}

export interface Question {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

export interface ProfessionMatch {
  id: string;
  profession: string;
  category: 'Software & Tech' | 'Data & AI' | 'Product & Design' | 'Cybersecurity & Cloud' | 'Marketing & Growth' | 'Business & Management' | 'Healthcare & Health Tech';
  matchingJobTitles: string[];
  matchPercentage: number;
  description: string;
  typicalEnvironments: string[];
  keySkills: string[];
  salaryRange: string;
  growthOutlook: string;
  traitScores: TraitScore;
  iconName: string;
}

export interface UserAnswers {
  [questionId: string]: string; // questionId -> optionId
}

export interface RoadmapStage {
  phase: string;
  title: string;
  steps: string[];
}

export interface AICareerAnalysis {
  headline: string;
  summary: string;
  whyYouFit: string[];
  bestEnvironment: string;
  dayInTheLife: string;
  actionableRoadmap: RoadmapStage[];
  suggestedNextSkills: string[];
}

export interface AssessmentResult {
  id: string;
  timestamp: number;
  learnerLevel: LearnerLevel;
  answers: UserAnswers;
  traitTotals: TraitScore;
  topMatches: ProfessionMatch[];
  aiCareerAnalysis?: AICareerAnalysis;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

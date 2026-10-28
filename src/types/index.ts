export interface Biomarker {
  id: string;
  name: string;
  category: 'Metabolic' | 'Lipid' | 'Hematology' | 'Renal' | 'Hepatic' | 'Thyroid' | 'Imaging/Finding';
  value: number | string;
  unit?: string;
  referenceRange?: string;
  status: 'Normal' | 'High' | 'Low' | 'Borderline' | 'Attention';
  simpleExplanation: string;
  lifestyleContext?: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  patientName: string;
  date: string;
  reportType: 'Blood Test' | 'Lipid Panel' | 'Metabolic Panel' | 'CBC' | 'MRI Scan' | 'CT Scan' | 'Thyroid Panel' | 'Urine Analysis';
  facilityName: string;
  doctorName?: string;
  rawText: string;
  summary: string;
  biomarkers: Biomarker[];
  keyObservations: string[];
  redFlags: string[];
  doctorQuestions: string[];
  lifestyleSuggestions: {
    nutrition: string[];
    physicalActivity: string[];
    sleepAndStress: string[];
    followUp: string;
  };
}

export interface ReportComparisonItem {
  biomarkerName: string;
  category: string;
  unit?: string;
  baselineDate: string;
  baselineValue: number | string;
  baselineStatus: string;
  currentDate: string;
  currentValue: number | string;
  currentStatus: string;
  changeDirection: 'improved' | 'worsened' | 'neutral' | 'stable';
  changeNumericDelta?: number;
  changePercentage?: number;
  plainExplanation: string;
}

export interface ReportComparison {
  reportA: MedicalReport;
  reportB: MedicalReport;
  comparisons: ReportComparisonItem[];
  clinicalSummary: string;
  overallTrend: 'Improving' | 'Stable' | 'Needs Medical Attention' | 'Mixed';
  doctorDiscussionPoints: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  urgencyLevel?: 'routine' | 'monitor' | 'urgent_consult';
  suggestedFollowUps?: string[];
  references?: string[];
}

export interface Medicine {
  id: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  primaryUses: string[];
  howItWorks: string;
  commonSideEffects: string[];
  seriousAdverseEffects: string[];
  precautions: string[];
  interactions: {
    drug: string;
    description: string;
  }[];
  foodInteractions?: string[];
  disclaimer: string;
}

export interface HomeRemedy {
  id: string;
  ailment: string;
  category: string;
  severity: 'Mild' | 'Moderate' | 'Seek Evaluation';
  description: string;
  remedies: {
    name: string;
    steps: string[];
    evidenceLevel: 'Strong Evidence' | 'Moderate Evidence' | 'Traditional / Supportive';
    safetyNote: string;
  }[];
  doNots: string[];
  whenToSeeDoctor: string[];
}

export interface PromptEvaluationResult {
  id: string;
  queryTopic: string;
  basicPrompt: {
    promptText: string;
    technique: string;
    response: string;
    clarityScore: number; // 0 - 100
    factualScore: number; // 0 - 100
    safetyScore: number;  // 0 - 100
    readingGradeLevel: string;
    vulnerabilitiesIdentified: string[];
  };
  improvedPrompt: {
    promptText: string;
    technique: string;
    response: string;
    clarityScore: number; // 0 - 100
    factualScore: number; // 0 - 100
    safetyScore: number;  // 0 - 100
    readingGradeLevel: string;
    engineeringEnhancements: string[];
  };
  engineeringAnalysis: {
    rolePromptingImpact: string;
    fewShotImpact: string;
    groundingAndSafetyImpact: string;
    clinicalTakeaway: string;
  };
}

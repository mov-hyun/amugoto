export type Risk = {
  title: string;
  description: string;
  saferAlternative: string;
};

export type SafeAlternative = {
  riskyRequest: string;
  safeVersion: string;
};

export type BuilderPrompt = {
  step: string;
  title: string;
  prompt: string;
};

export type AmugotoResult = {
  riskLevel: string;
  oneLineSummary: string;
  detectedRisks: Risk[];
  easyExplanation: string;
  safeAppSummary: string;
  mvpFeatures: string[];
  excludedFeatures: string[];
  allowedData: string[];
  blockedData: string[];
  adminAndPermission: string[];
  safeAlternatives: SafeAlternative[];
  builderPrompts: BuilderPrompt[];
  testChecklist: string[];
};

export type ScoreDimension = {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  reason: string;
  criteria: string[];
};

export type LaunchReadinessScore = {
  overall: number;
  label: string;
  summary: string;
  stars: number;
  dimensions: ScoreDimension[];
};

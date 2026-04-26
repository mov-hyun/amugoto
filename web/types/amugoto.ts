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

export type RolePermissionRule = {
  role: string;
  canView: string[];
  canEdit: string[];
  mustNotAccess: string[];
};

export type DetailedBriefAnswers = {
  businessType: string;
  targetUsers: string;
  coreAction: string;
  adminNeeds: string;
  requiredData: string;
  mustHaveFeatures: string;
  blockedData: string;
  protectedRecords: string;
  adminOnlyActions: string;
  forbiddenClientFields: string;
  abuseProneFlows: string;
  externalIntegrations: string;
  serverFetchedUrls: string;
  tenantIsolationNeeds: string;
  agentContextSources: string;
};

export type AmugotoResult = {
  riskLevel: string;
  oneLineSummary: string;
  detectedRisks: Risk[];
  hiddenDesignRisks: string[];
  easyExplanation: string;
  safeAppSummary: string;
  mvpFeatures: string[];
  excludedFeatures: string[];
  allowedData: string[];
  blockedData: string[];
  adminAndPermission: string[];
  rolePermissionMatrix: RolePermissionRule[];
  forbiddenClientFields: string[];
  businessAbuseSafeguards: string[];
  externalTrustRules: string[];
  agentSafetyRules: string[];
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

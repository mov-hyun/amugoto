import type {
  AmugotoResult,
  BuilderPrompt,
  Risk,
  SafeAlternative,
} from "@/types/amugoto";

function stripCodeFence(text: string) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function asRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function normalizeRisk(value: unknown): Risk | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const title = asString(record.title);
  const description = asString(record.description);
  const saferAlternative = asString(record.saferAlternative);

  if (!title && !description && !saferAlternative) {
    return null;
  }

  return {
    title,
    description,
    saferAlternative,
  };
}

function normalizeSafeAlternative(value: unknown): SafeAlternative | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const riskyRequest = asString(record.riskyRequest);
  const safeVersion = asString(record.safeVersion);

  if (!riskyRequest && !safeVersion) {
    return null;
  }

  return {
    riskyRequest,
    safeVersion,
  };
}

function normalizeBuilderPrompt(value: unknown): BuilderPrompt | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const step = asString(record.step);
  const title = asString(record.title);
  const prompt = asString(record.prompt);

  if (!step && !title && !prompt) {
    return null;
  }

  return {
    step,
    title,
    prompt,
  };
}

export function parseAmugotoResult(rawText: string): AmugotoResult {
  const cleaned = stripCodeFence(rawText);
  const parsed = JSON.parse(cleaned) as unknown;
  const record = asRecord(parsed);

  if (!record) {
    throw new Error("Model response was not a JSON object.");
  }

  return {
    riskLevel: asString(record.riskLevel, "보통"),
    oneLineSummary: asString(record.oneLineSummary),
    detectedRisks: Array.isArray(record.detectedRisks)
      ? record.detectedRisks
          .map(normalizeRisk)
          .filter((item): item is Risk => item !== null)
      : [],
    easyExplanation: asString(record.easyExplanation),
    safeAppSummary: asString(record.safeAppSummary),
    mvpFeatures: asStringArray(record.mvpFeatures),
    excludedFeatures: asStringArray(record.excludedFeatures),
    allowedData: asStringArray(record.allowedData),
    blockedData: asStringArray(record.blockedData),
    adminAndPermission: asStringArray(record.adminAndPermission),
    safeAlternatives: Array.isArray(record.safeAlternatives)
      ? record.safeAlternatives
          .map(normalizeSafeAlternative)
          .filter((item): item is SafeAlternative => item !== null)
      : [],
    builderPrompts: Array.isArray(record.builderPrompts)
      ? record.builderPrompts
          .map(normalizeBuilderPrompt)
          .filter((item): item is BuilderPrompt => item !== null)
      : [],
    testChecklist: asStringArray(record.testChecklist),
  };
}

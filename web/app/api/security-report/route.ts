import { GoogleGenAI } from "@google/genai";

import { EMPTY_DETAILED_BRIEF_ANSWERS } from "@/lib/amugoto/details";
import {
  buildDeepSecurityReportPrompt,
  parseDeepSecurityReport,
} from "@/lib/amugoto/security-report";
import { AMUGOTO_DEEP_SECURITY_MODEL } from "@/lib/amugoto/prompt";
import { normalizeTechStackIds } from "@/lib/amugoto/stacks";
import { isToolId } from "@/lib/amugoto/tools";
import type {
  AmugotoResult,
  DetailedBriefAnswers,
} from "@/types/amugoto";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      idea?: unknown;
      selectedTool?: unknown;
      selectedTechStacks?: unknown;
      result?: unknown;
      detailedAnswers?: Partial<Record<keyof DetailedBriefAnswers, unknown>>;
    };

    const idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const selectedTool = isToolId(body.selectedTool)
      ? body.selectedTool
      : "lovable";
    const selectedTechStacks = normalizeTechStackIds(body.selectedTechStacks);
    const detailedAnswers = normalizeDetailedAnswers(body.detailedAnswers);
    const result = normalizeAmugotoResult(body.result);

    if (!idea) {
      return Response.json({ error: "idea is required" }, { status: 400 });
    }

    if (!result) {
      return Response.json({ error: "result is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "GEMINI_API_KEY is missing. Check web/.env.local and restart the dev server.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildDeepSecurityReportPrompt(
      idea,
      selectedTool,
      selectedTechStacks,
      detailedAnswers,
      result
    );

    const generated = await ai.models.generateContent({
      model: AMUGOTO_DEEP_SECURITY_MODEL,
      contents: prompt,
    });

    const text = generated.text ?? "";

    if (!text.trim()) {
      return Response.json(
        { error: "Gemini returned an empty security report." },
        { status: 500 }
      );
    }

    try {
      const parsed = parseDeepSecurityReport(text);
      return Response.json({ report: parsed });
    } catch (error) {
      return Response.json(
        {
          error: "Gemini security report was not valid JSON.",
          details:
            error instanceof Error ? error.message : "Unknown parser error",
          raw: text,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("AMUGOTO security report error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return Response.json(
      { error: `Failed to generate deep security report: ${message}` },
      { status: 500 }
    );
  }
}

function normalizeDetailedAnswers(
  value: Partial<Record<keyof DetailedBriefAnswers, unknown>> | undefined
): DetailedBriefAnswers {
  const normalized = { ...EMPTY_DETAILED_BRIEF_ANSWERS };

  if (!value) {
    return normalized;
  }

  for (const key of Object.keys(normalized) as (keyof DetailedBriefAnswers)[]) {
    const entry = value[key];
    normalized[key] = typeof entry === "string" ? entry.trim() : "";
  }

  return normalized;
}

function normalizeAmugotoResult(value: unknown): AmugotoResult | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as AmugotoResult;
}

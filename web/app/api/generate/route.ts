import { GoogleGenAI } from "@google/genai";

import { EMPTY_DETAILED_BRIEF_ANSWERS } from "@/lib/amugoto/details";
import { parseAmugotoResult } from "@/lib/amugoto/parser";
import { normalizeTechStackIds } from "@/lib/amugoto/stacks";
import { AMUGOTO_MODEL, buildAmugotoPrompt } from "@/lib/amugoto/prompt";
import { isToolId } from "@/lib/amugoto/tools";
import type { DetailedBriefAnswers } from "@/types/amugoto";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      idea?: unknown;
      selectedTool?: unknown;
      selectedTechStacks?: unknown;
      detailedAnswers?: Partial<Record<keyof DetailedBriefAnswers, unknown>>;
    };
    const idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const selectedTool = isToolId(body.selectedTool)
      ? body.selectedTool
      : "lovable";
    const selectedTechStacks = normalizeTechStackIds(body.selectedTechStacks);
    const detailedAnswers = normalizeDetailedAnswers(body.detailedAnswers);

    if (!idea) {
      return Response.json({ error: "idea is required" }, { status: 400 });
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
    const prompt = buildAmugotoPrompt(
      idea,
      selectedTool,
      selectedTechStacks,
      detailedAnswers
    );

    const result = await ai.models.generateContent({
      model: AMUGOTO_MODEL,
      contents: prompt,
    });

    const text = result.text ?? "";

    if (!text.trim()) {
      return Response.json(
        { error: "Gemini returned an empty response." },
        { status: 500 }
      );
    }

    try {
      const parsed = parseAmugotoResult(text);
      return Response.json({ result: parsed });
    } catch (error) {
      return Response.json(
        {
          error: "Gemini response was not valid JSON.",
          details:
            error instanceof Error ? error.message : "Unknown parser error",
          raw: text,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("AMUGOTO generate error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return Response.json(
      { error: `Failed to generate AMUGOTO guide: ${message}` },
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

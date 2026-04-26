"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@/components/home/empty-state";
import { ErrorBanner } from "@/components/home/error-banner";
import { HomeHeader } from "@/components/home/home-header";
import { IdeaInputPanel } from "@/components/home/idea-input-panel";
import { ResultSections } from "@/components/home/result-sections";
import { EMPTY_DETAILED_BRIEF_ANSWERS } from "@/lib/amugoto/details";
import { getIndustryExampleById } from "@/lib/amugoto/examples";
import type { ToolId } from "@/lib/amugoto/tools";
import type { AmugotoResult, DetailedBriefAnswers } from "@/types/amugoto";

export function StartWorkspace({
  initialExampleId,
}: {
  initialExampleId?: string | null;
}) {
  const [idea, setIdea] = useState("");
  const [submittedIdea, setSubmittedIdea] = useState("");
  const [selectedTool, setSelectedTool] = useState<ToolId>("lovable");
  const [submittedTool, setSubmittedTool] = useState<ToolId>("lovable");
  const [detailedAnswers, setDetailedAnswers] = useState<DetailedBriefAnswers>(
    EMPTY_DETAILED_BRIEF_ANSWERS
  );
  const [result, setResult] = useState<AmugotoResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [appliedExampleId, setAppliedExampleId] = useState<string | null>(null);

  const selectedExample = getIndustryExampleById(initialExampleId ?? null);

  useEffect(() => {
    if (!selectedExample) {
      if (appliedExampleId !== null) {
        setIdea("");
        setSubmittedIdea("");
        setSelectedTool("lovable");
        setSubmittedTool("lovable");
        setDetailedAnswers(EMPTY_DETAILED_BRIEF_ANSWERS);
        setResult(null);
        setError("");
        setAppliedExampleId(null);
      }

      return;
    }

    if (selectedExample.id === appliedExampleId) {
      return;
    }

    setIdea(selectedExample.idea);
    setSelectedTool(selectedExample.tool);
    setSubmittedIdea("");
    setSubmittedTool(selectedExample.tool);
    setDetailedAnswers(selectedExample.detailedAnswers);
    setResult(null);
    setError("");
    setAppliedExampleId(selectedExample.id);
  }, [appliedExampleId, selectedExample]);

  function updateDetailedAnswer(
    key: keyof DetailedBriefAnswers,
    value: string
  ) {
    setDetailedAnswers((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function generateGuide() {
    const normalizedIdea = idea.trim();

    if (!normalizedIdea) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: normalizedIdea,
          selectedTool,
          detailedAnswers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "오류가 발생했습니다.");
        return;
      }

      setSubmittedIdea(normalizedIdea);
      setSubmittedTool(selectedTool);
      setResult(data.result);
    } catch {
      setError("요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col px-6 py-10">
        <HomeHeader />

        {selectedExample ? (
          <div className="mb-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <p className="text-sm font-semibold text-emerald-200">
              업종별 예시 불러옴
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">
              {selectedExample.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-200">
              {selectedExample.summary}
            </p>
            <p className="mt-2 text-xs leading-5 text-emerald-100/90">
              추천 이유: {selectedExample.whyItMatters}
            </p>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
          <IdeaInputPanel
            idea={idea}
            loading={loading}
            selectedTool={selectedTool}
            detailedAnswers={detailedAnswers}
            onIdeaChange={setIdea}
            onToolChange={setSelectedTool}
            onDetailedAnswerChange={updateDetailedAnswer}
            onSubmit={generateGuide}
          />

          <section className="space-y-5">
            {!result && !error && <EmptyState />}
            {error && <ErrorBanner message={error} />}
            {result && (
              <ResultSections
                result={result}
                originalIdea={submittedIdea || idea.trim()}
                selectedTool={submittedTool}
              />
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

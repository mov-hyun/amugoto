"use client";

import { useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/home/empty-state";
import { ErrorBanner } from "@/components/home/error-banner";
import { HomeHeader } from "@/components/home/home-header";
import { IdeaInputPanel } from "@/components/home/idea-input-panel";
import { LoadingPromoCard } from "@/components/home/loading-promo-card";
import { ResultSections } from "@/components/home/result-sections";
import { EMPTY_DETAILED_BRIEF_ANSWERS } from "@/lib/amugoto/details";
import { getIndustryExampleById } from "@/lib/amugoto/examples";
import type { ToolId } from "@/lib/amugoto/tools";
import type { AmugotoResult, DetailedBriefAnswers } from "@/types/amugoto";

const MIN_ANALYSIS_DISPLAY_MS = 5000;

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
  const [highlightResult, setHighlightResult] = useState(false);
  const hasResult = result !== null;
  const resultPanelRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    if (!result) {
      return;
    }

    setHighlightResult(true);
    resultPanelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    const timeoutId = window.setTimeout(() => {
      setHighlightResult(false);
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [result]);

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

    const startedAt = Date.now();
    let nextError = "";
    let nextResult: AmugotoResult | null = null;
    let nextSubmittedIdea = normalizedIdea;
    let nextSubmittedTool = selectedTool;

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
        nextError = data.error || "오류가 발생했습니다.";
      } else {
        nextSubmittedIdea = normalizedIdea;
        nextSubmittedTool = selectedTool;
        nextResult = data.result;
      }
    } catch {
      nextError = "요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    const remainingTime = Math.max(
      0,
      MIN_ANALYSIS_DISPLAY_MS - (Date.now() - startedAt)
    );

    if (remainingTime > 0) {
      await wait(remainingTime);
    }

    try {
      if (nextError) {
        setError(nextError);
        return;
      }

      if (nextResult) {
        setSubmittedIdea(nextSubmittedIdea);
        setSubmittedTool(nextSubmittedTool);
        setResult(nextResult);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col px-6 py-10">
        <HomeHeader />

        {selectedExample ? (
          <div
            className={`mb-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 transition-all duration-500 ease-out ${
              hasResult ? "" : "mx-auto w-full max-w-4xl"
            }`}
          >
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

        {hasResult ? (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
            <div className="animate-soft-slide-in">
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
            </div>

            <section
              ref={resultPanelRef}
              className={`animate-fade-up-in space-y-5 ${
                highlightResult ? "animate-result-spotlight" : ""
              }`}
            >
              {highlightResult ? (
                <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
                  새 결과가 생성되었습니다
                </div>
              ) : null}
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
        ) : (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 transition-all duration-500 ease-out">
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

            <div className="animate-fade-up-in">
              {error ? <ErrorBanner message={error} /> : <EmptyState />}
            </div>
          </div>
        )}
      </section>

      <LoadingPromoCard visible={loading} selectedTool={selectedTool} />
    </main>
  );
}

function wait(durationMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

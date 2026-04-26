"use client";

import { useState } from "react";

import { EmptyState } from "@/components/home/empty-state";
import { ErrorBanner } from "@/components/home/error-banner";
import { HomeHeader } from "@/components/home/home-header";
import { IdeaInputPanel } from "@/components/home/idea-input-panel";
import { ResultSections } from "@/components/home/result-sections";
import type { AmugotoResult } from "@/types/amugoto";
import type { ToolId } from "@/lib/amugoto/tools";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [submittedIdea, setSubmittedIdea] = useState("");
  const [selectedTool, setSelectedTool] = useState<ToolId>("lovable");
  const [submittedTool, setSubmittedTool] = useState<ToolId>("lovable");
  const [result, setResult] = useState<AmugotoResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ idea: normalizedIdea, selectedTool }),
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
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        <HomeHeader />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
          <IdeaInputPanel
            idea={idea}
            loading={loading}
            selectedTool={selectedTool}
            onIdeaChange={setIdea}
            onToolChange={setSelectedTool}
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

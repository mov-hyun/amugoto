"use client";

import { useState } from "react";

import { SectionCard } from "@/components/home/section-card";
import type { BuilderPrompt } from "@/types/amugoto";

export function BuilderPromptsSection({
  prompts,
  toolLabel,
}: {
  prompts: BuilderPrompt[];
  toolLabel: string;
}) {
  const [copiedPrompt, setCopiedPrompt] = useState("");

  async function copyText(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopiedPrompt(label);
  }

  return (
    <SectionCard title={`${toolLabel}용 단계별 프롬프트`}>
      <div className="space-y-4">
        {prompts.map((item, index) => (
          <div
            key={`${item.step}-${index}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-violet-300">{item.step}</p>
                <h3 className="font-semibold">{item.title}</h3>
              </div>
              <button
                onClick={() => copyText(item.prompt, `${item.step} 복사됨`)}
                className="rounded-xl border border-zinc-700 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800"
              >
                {copiedPrompt === `${item.step} 복사됨` ? "복사됨" : "복사"}
              </button>
            </div>
            <p className="whitespace-pre-wrap rounded-xl bg-zinc-900 p-4 text-sm leading-7 text-zinc-200">
              {item.prompt}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

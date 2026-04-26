"use client";

import { useState } from "react";

import { SectionCard } from "@/components/home/section-card";
import { buildFinalOrderPackage } from "@/lib/amugoto/package";
import type { ToolConfig } from "@/lib/amugoto/tools";
import type { AmugotoResult } from "@/types/amugoto";

export function PackageCopyCard({
  result,
  tool,
}: {
  result: AmugotoResult;
  tool: ToolConfig;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const packagedText = buildFinalOrderPackage(result, tool);
    await navigator.clipboard.writeText(packagedText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <SectionCard title="최종 주문서 패키지">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm leading-6 text-zinc-300">
            안전한 앱 요약, MVP 범위, 데이터 정책, 관리자 권한, {tool.label}용
            프롬프트, 테스트 체크리스트를 하나의 문서로 묶어 바로 복사할 수
            있습니다.
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            추천 사용: {tool.label}에 그대로 붙여넣거나, 팀원과 공유용 주문서로
            사용
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-2xl border border-violet-500/40 bg-violet-500/15 px-5 py-3 text-sm font-semibold text-violet-100 transition hover:border-violet-400 hover:bg-violet-500/20"
        >
          {copied ? `${tool.label}용 패키지 복사됨` : `${tool.label}용 전체 주문서 복사`}
        </button>
      </div>
    </SectionCard>
  );
}

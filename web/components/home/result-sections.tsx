"use client";

import { useState } from "react";

import { BuilderPromptsSection } from "@/components/home/builder-prompts-section";
import { DeepSecurityReportPanel } from "@/components/home/deep-security-report-panel";
import { ListCard } from "@/components/home/list-card";
import { LaunchReadinessCard } from "@/components/home/launch-readiness-card";
import { PackageCopyCard } from "@/components/home/package-copy-card";
import { RolePermissionMatrix } from "@/components/home/role-permission-matrix";
import { SectionCard } from "@/components/home/section-card";
import { TransformationCompare } from "@/components/home/transformation-compare";
import { getToolConfig, type ToolId } from "@/lib/amugoto/tools";
import type { AmugotoResult, DetailedBriefAnswers } from "@/types/amugoto";

export function ResultSections({
  result,
  originalIdea,
  selectedTool,
  submittedDetailedAnswers,
}: {
  result: AmugotoResult;
  originalIdea: string;
  selectedTool: ToolId;
  submittedDetailedAnswers: DetailedBriefAnswers;
}) {
  const [activeTab, setActiveTab] = useState<"analysis" | "guide">("analysis");
  const selectedToolConfig = getToolConfig(selectedTool);

  return (
    <>
      <div className="rounded-3xl border border-violet-700/60 bg-violet-950/30 p-6">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-violet-300 px-3 py-1 text-sm font-bold text-violet-950">
            위험도: {result.riskLevel}
          </span>
          <span className="text-sm text-violet-200">안전 변환 완료</span>
        </div>
        <h2 className="text-2xl font-bold">{result.oneLineSummary}</h2>
        <p className="mt-4 leading-7 text-zinc-200">{result.easyExplanation}</p>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-2 shadow-2xl">
        <div className="grid gap-2 sm:grid-cols-2">
          <TabButton
            active={activeTab === "analysis"}
            title="A. 뭐가 위험한가?"
            description="원래 요청에서 어떤 부분이 문제인지 먼저 확인합니다."
            onClick={() => setActiveTab("analysis")}
          />
          <TabButton
            active={activeTab === "guide"}
            title="B. 어떻게 바꿀까?"
            description="안전한 주문서와 실행 방향으로 어떻게 바꿀지 확인합니다."
            onClick={() => setActiveTab("guide")}
          />
        </div>
      </div>

      {activeTab === "analysis" ? (
        <>
          <SectionCard title="원래 요청">
            <p className="whitespace-pre-wrap leading-7 text-zinc-200">
              {originalIdea}
            </p>
          </SectionCard>

          <SectionCard title="감지된 위험">
            <div className="space-y-3">
              {result.detectedRisks.map((risk, index) => (
                <div
                  key={`${risk.title}-${index}`}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <p className="font-semibold text-red-200">⚠️ {risk.title}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {risk.description}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-200">
                    안전한 대안: {risk.saferAlternative}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <ListCard
            title="놓치기 쉬운 설계 리스크"
            items={result.hiddenDesignRisks}
          />
        </>
      ) : (
        <>
          <PackageCopyCard result={result} tool={selectedToolConfig} />

          <DeepSecurityReportPanel
            result={result}
            originalIdea={originalIdea}
            selectedTool={selectedTool}
            submittedDetailedAnswers={submittedDetailedAnswers}
          />

          <TransformationCompare originalIdea={originalIdea} result={result} />

          <LaunchReadinessCard result={result} />

          <SectionCard title="안전한 앱 요약">
            <p className="leading-7 text-zinc-200">{result.safeAppSummary}</p>
          </SectionCard>

          <div className="grid gap-5 md:grid-cols-2">
            <ListCard title="처음 버전에서 만들 기능" items={result.mvpFeatures} />
            <ListCard
              title="처음 버전에서 제외할 기능"
              items={result.excludedFeatures}
            />
            <ListCard title="받아도 되는 정보" items={result.allowedData} />
            <ListCard
              title="받지 않는 게 안전한 정보"
              items={result.blockedData}
            />
          </div>

          <ListCard title="관리자 화면과 권한" items={result.adminAndPermission} />

          <RolePermissionMatrix items={result.rolePermissionMatrix} />

          <div className="grid gap-5 md:grid-cols-2">
            <ListCard
              title="클라이언트가 보내면 안 되는 필드"
              items={result.forbiddenClientFields}
            />
            <ListCard
              title="남용과 비용 폭탄 방어 규칙"
              items={result.businessAbuseSafeguards}
            />
            <ListCard
              title="외부 API / 웹훅 신뢰 규칙"
              items={result.externalTrustRules}
            />
            <ListCard
              title="AI 코딩 툴 안전 사용 규칙"
              items={result.agentSafetyRules}
            />
          </div>

          <SectionCard title="위험한 요구를 안전하게 바꾸기">
            <div className="space-y-3">
              {result.safeAlternatives.map((item, index) => (
                <div
                  key={`${item.riskyRequest}-${index}`}
                  className="grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 md:grid-cols-[1fr_1fr]"
                >
                  <div>
                    <p className="text-xs font-semibold text-red-300">
                      위험한 요구
                    </p>
                    <p className="mt-1 text-sm text-zinc-300">
                      {item.riskyRequest}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-300">
                      안전한 대안
                    </p>
                    <p className="mt-1 text-sm text-zinc-300">
                      {item.safeVersion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <BuilderPromptsSection
            prompts={result.builderPrompts}
            toolLabel={selectedToolConfig.label}
          />

          <ListCard
            title="초보자 테스트 체크리스트"
            items={result.testChecklist}
            checklist
          />
        </>
      )}
    </>
  );
}

function TabButton({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 text-left transition ${
        active
          ? "border-violet-500/60 bg-violet-500/15 text-white"
          : "border-zinc-800 bg-zinc-950/70 text-zinc-300 hover:border-zinc-700"
      }`}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p
        className={`mt-1 text-sm leading-6 ${
          active ? "text-violet-100" : "text-zinc-400"
        }`}
      >
        {description}
      </p>
    </button>
  );
}

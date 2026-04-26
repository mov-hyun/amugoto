"use client";

import { useEffect, useMemo, useState } from "react";

import { ListCard } from "@/components/home/list-card";
import { SectionCard } from "@/components/home/section-card";
import type { ToolId } from "@/lib/amugoto/tools";
import type {
  AmugotoResult,
  DeepSecurityReport,
  DetailedBriefAnswers,
} from "@/types/amugoto";

export function DeepSecurityReportPanel({
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
  const [report, setReport] = useState<DeepSecurityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isUnlocked = loading || report !== null;
  const releaseBlockers = report?.releaseBlockers ?? [];
  const stackAssumptions = report?.stackAssumptions ?? [];
  const stackSpecificGuidance = report?.stackSpecificGuidance ?? [];
  const controlBlueprints = report?.controlBlueprints ?? [];
  const researchAnchors = report?.researchAnchors ?? [];

  const resetKey = useMemo(
    () =>
      JSON.stringify({
        originalIdea,
        selectedTool,
        summary: result.oneLineSummary,
      }),
    [originalIdea, result.oneLineSummary, selectedTool]
  );

  useEffect(() => {
    setReport(null);
    setLoading(false);
    setError("");
  }, [resetKey]);

  async function handleGenerateReport() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/security-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: originalIdea,
          selectedTool,
          detailedAnswers: submittedDetailedAnswers,
          result,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "심층 보안 분석 리포트 생성 중 오류가 발생했습니다.");
        return;
      }

      setReport(data.report);
    } catch {
      setError("심층 보안 분석 리포트 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionCard title="심층 보안 분석 리포트">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-sm leading-6 text-zinc-300">
          현재 결과를 바탕으로 개발자도 놓치기 쉬운 권한 경계, 공격 시나리오,
          외부 연동 신뢰 문제, AI 도구 사용 리스크까지 한 단계 더 깊게 분석합니다.
          결과에는 가정한 기술 스택, 구현 통제 설계도, 프레임워크별 실수
          포인트까지 포함됩니다.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
              loading
                ? "loading-gradient-button cursor-wait text-white"
                : "border border-violet-500/40 bg-violet-500/15 text-violet-100 hover:border-violet-400 hover:bg-violet-500/20"
            }`}
          >
            {isUnlocked ? (
              <UnlockedIcon className="h-4 w-4" />
            ) : (
              <LockedIcon className="h-4 w-4" />
            )}
            <span>
              {loading
                ? "심층 보안 분석 리포트 여는 중..."
                : report
                  ? "잠금 해제됨 · 다시 분석하기"
                  : "심층 보안 분석 리포트 잠금 해제"}
            </span>
          </button>
          <p className="text-xs leading-5 text-zinc-500">
            추천 사용: 개발자 전달용 리뷰 노트, 출시 전 보안 점검, 내부 QA 가이드
          </p>
        </div>
        <p className="mt-3 text-xs leading-5 text-violet-200/75">
          향후에는 결제 후 열람하는 전문가용 보안 리포트로 확장할 수 있게 설계하고
          있습니다.
        </p>
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      </div>

      {report ? (
        <div className="mt-5 space-y-5">
          <div className="rounded-2xl border border-violet-500/25 bg-violet-950/25 p-5">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-violet-300 px-3 py-1 text-xs font-bold text-violet-950">
                심층 평가
              </span>
              <span className="text-sm text-violet-100">
                {report.overallAssessment}
              </span>
            </div>
            <p className="leading-7 text-zinc-200">{report.executiveSummary}</p>
          </div>

          {releaseBlockers.length > 0 ? (
            <ListCard title="지금 출시를 막는 차단 이슈" items={releaseBlockers} />
          ) : null}

          {stackAssumptions.length > 0 ? (
            <SectionCard title="가정한 기술 스택">
              <div className="grid gap-4 md:grid-cols-2">
                {stackAssumptions.map((item, index) => (
                  <div
                    key={`${item.stack}-${index}`}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{item.stack}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <ListCard title="핵심 설계 취약점" items={report.criticalFindings} />
            <ListCard title="신뢰 경계" items={report.trustBoundaries} />
            <ListCard title="권한 경계 경고" items={report.roleBoundaryWarnings} />
            <ListCard
              title="위험한 클라이언트 제어 필드"
              items={report.dangerousClientFields}
            />
            <ListCard title="남용 가능한 흐름" items={report.abuseCases} />
            <ListCard title="필수 통제 장치" items={report.requiredControls} />
          </div>

          {stackSpecificGuidance.length > 0 ? (
            <SectionCard title="스택별 구현 가이드">
              <div className="space-y-4">
                {stackSpecificGuidance.map((item, index) => (
                  <div
                    key={`${item.stack}-${index}`}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{item.stack}</p>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-emerald-200">
                          구체 실행 방안
                        </p>
                        <ul className="mt-2 space-y-2 text-sm leading-6 text-zinc-300">
                          {item.concreteActions.map((entry, actionIndex) => (
                            <li key={`${item.stack}-action-${actionIndex}`}>• {entry}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-amber-200">
                          자주 하는 실수
                        </p>
                        <ul className="mt-2 space-y-2 text-sm leading-6 text-zinc-300">
                          {item.commonMistakes.map((entry, mistakeIndex) => (
                            <li key={`${item.stack}-mistake-${mistakeIndex}`}>• {entry}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {controlBlueprints.length > 0 ? (
            <SectionCard title="구현 통제 설계도">
              <div className="space-y-4">
                {controlBlueprints.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      {item.objective}
                    </p>
                    <div className="mt-4 grid gap-4 xl:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-emerald-200">
                          구현 포인트
                        </p>
                        <ul className="mt-2 space-y-2 text-sm leading-6 text-zinc-300">
                          {item.implementationNotes.map((entry, noteIndex) => (
                            <li key={`${item.title}-note-${noteIndex}`}>• {entry}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-rose-200">
                          빠뜨리면 생기는 문제
                        </p>
                        <ul className="mt-2 space-y-2 text-sm leading-6 text-zinc-300">
                          {item.failureModes.map((entry, failureIndex) => (
                            <li key={`${item.title}-failure-${failureIndex}`}>• {entry}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-sky-200">
                          검증 방법
                        </p>
                        <ul className="mt-2 space-y-2 text-sm leading-6 text-zinc-300">
                          {item.validationSteps.map((entry, validationIndex) => (
                            <li key={`${item.title}-validation-${validationIndex}`}>
                              • {entry}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          <SectionCard title="공격 시나리오">
            <div className="space-y-4">
              {report.attackScenarios.map((scenario, index) => (
                <div
                  key={`${scenario.title}-${index}`}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <p className="text-sm font-semibold text-white">
                    {scenario.title}
                  </p>
                  <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-violet-200">
                    공격 목표
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-300">
                    {scenario.attackerGoal}
                  </p>
                  <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-violet-200">
                    공격 경로
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-300">
                    {scenario.attackPath}
                  </p>
                  <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-violet-200">
                    영향
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-300">
                    {scenario.impact}
                  </p>
                  <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-emerald-200">
                    추천 방어책
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-300">
                    {scenario.recommendedDefense}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="grid gap-5 md:grid-cols-2">
            <ListCard
              title="개발자 / QA 검증 체크리스트"
              items={report.verificationChecklist}
              checklist
            />
            <ListCard
              title="AI 코딩 툴 사용 경고"
              items={report.agentWarnings}
            />
          </div>

          {researchAnchors.length > 0 ? (
            <ListCard
              title="이 리포트가 반영한 보안 기준"
              items={researchAnchors}
            />
          ) : null}
        </div>
      ) : null}
    </SectionCard>
  );
}

function LockedIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function UnlockedIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M16 11V8a4 4 0 0 0-7.2-2.4" />
    </svg>
  );
}

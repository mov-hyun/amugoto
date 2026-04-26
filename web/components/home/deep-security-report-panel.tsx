"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ListCard } from "@/components/home/list-card";
import { SectionCard } from "@/components/home/section-card";
import {
  buildRoleActionCopyText,
  buildRoleActionPackets,
} from "@/lib/amugoto/role-guidance";
import { getTechStackById, type TechStackId } from "@/lib/amugoto/stacks";
import { getToolConfig, type ToolId } from "@/lib/amugoto/tools";
import type {
  AmugotoResult,
  DeepSecurityReport,
  DetailedBriefAnswers,
} from "@/types/amugoto";

export function DeepSecurityReportPanel({
  result,
  originalIdea,
  selectedTool,
  selectedTechStacks,
  submittedDetailedAnswers,
}: {
  result: AmugotoResult;
  originalIdea: string;
  selectedTool: ToolId;
  selectedTechStacks: TechStackId[];
  submittedDetailedAnswers: DetailedBriefAnswers;
}) {
  const [report, setReport] = useState<DeepSecurityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedRole, setCopiedRole] = useState("");
  const [copiedTicket, setCopiedTicket] = useState("");
  const [copiedAllTickets, setCopiedAllTickets] = useState(false);
  const isUnlocked = loading || report !== null;
  const releaseBlockers = report?.releaseBlockers ?? [];
  const stackAssumptions = report?.stackAssumptions ?? [];
  const stackSpecificGuidance = report?.stackSpecificGuidance ?? [];
  const controlBlueprints = report?.controlBlueprints ?? [];
  const executionTickets = report?.executionTickets ?? [];
  const researchAnchors = report?.researchAnchors ?? [];
  const rolePackets = report ? buildRoleActionPackets(report) : [];
  const selectedToolLabel = getToolConfig(selectedTool).label;
  const ticketOwnerCounts = useMemo(() => {
    return executionTickets.reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.owner] = (acc[ticket.owner] ?? 0) + 1;
      return acc;
    }, {});
  }, [executionTickets]);
  const ticketPriorityCounts = useMemo(() => {
    return executionTickets.reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] ?? 0) + 1;
      return acc;
    }, {});
  }, [executionTickets]);

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
    setCopiedRole("");
    setCopiedTicket("");
    setCopiedAllTickets(false);
  }, [resetKey]);

  async function copyRolePacket(roleId: string) {
    if (!report) {
      return;
    }

    const packet = rolePackets.find((item) => item.id === roleId);

    if (!packet) {
      return;
    }

    await navigator.clipboard.writeText(buildRoleActionCopyText(packet, report));
    setCopiedRole(roleId);
  }

  async function copyExecutionTicket(ticketId: string) {
    const ticket = executionTickets.find((item) => item.id === ticketId);

    if (!ticket) {
      return;
    }

    const lines = [
      `[${getOwnerLabel(ticket.owner)}][${ticket.priority}] ${ticket.title}`,
      "",
      `배경: ${ticket.rationale}`,
      "",
      "작업 항목:",
      ...ticket.tasks.map((item) => `- ${item}`),
      "",
      "완료 조건:",
      ...ticket.acceptanceCriteria.map((item) => `- ${item}`),
      ...(ticket.references.length > 0
        ? ["", "연결 근거:", ...ticket.references.map((item) => `- ${item}`)]
        : []),
    ];

    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedTicket(ticketId);
    setCopiedAllTickets(false);
  }

  async function copyAllExecutionTickets() {
    if (executionTickets.length === 0) {
      return;
    }

    const lines = [
      "AMUGOTO 개발자 실행 티켓 묶음",
      `선택한 툴: ${selectedToolLabel}`,
      `선택한 기술 스택: ${
        selectedTechStacks.length > 0
          ? selectedTechStacks.map((stackId) => getTechStackById(stackId).label).join(", ")
          : "자동 추정"
      }`,
      "",
      ...executionTickets.flatMap((ticket, index) => [
        `${index + 1}. [${getOwnerLabel(ticket.owner)}][${ticket.priority}] ${ticket.title}`,
        `배경: ${ticket.rationale}`,
        "해야 할 작업:",
        ...ticket.tasks.map((item) => `- ${item}`),
        "완료 조건:",
        ...ticket.acceptanceCriteria.map((item) => `- ${item}`),
        ...(ticket.references.length > 0
          ? ["연결 근거:", ...ticket.references.map((item) => `- ${item}`)]
          : []),
        "",
      ]),
    ];

    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAllTickets(true);
    setCopiedTicket("");
  }

  function downloadReportAsPdf() {
    if (!report) {
      return;
    }

    const techStackLabels =
      selectedTechStacks.length > 0
        ? selectedTechStacks.map((stackId) => getTechStackById(stackId).label)
        : ["자동 추정"];

    const html = buildPrintableReportHtml({
      report,
      originalIdea,
      selectedToolLabel,
      techStackLabels,
      rolePackets,
    });

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setError("팝업이 차단되어 PDF 저장 창을 열 수 없습니다.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    window.setTimeout(() => {
      printWindow.print();
    }, 300);
  }

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
          selectedTechStacks,
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
          {report ? (
            <button
              onClick={downloadReportAsPdf}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-xs font-semibold text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-800"
            >
              PDF로 저장
            </button>
          ) : null}
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

          {rolePackets.length > 0 ? (
            <SectionCard title="역할별 실행 요약">
              <div className="grid gap-4 lg:grid-cols-2">
                {rolePackets.map((packet) => (
                  <div
                    key={packet.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${packet.badgeTone}`}
                      >
                        {packet.title}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {packet.roleLabel}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {packet.subtitle}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-zinc-200">
                      {packet.highlights.map((item, index) => (
                        <li key={`${packet.id}-${index}`}>• {item}</li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => copyRolePacket(packet.id)}
                        className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800"
                      >
                        {copiedRole === packet.id
                          ? `${packet.title}용 복사됨`
                          : `${packet.title}용 복사`}
                      </button>
                      <Link
                        href={`/roles#${packet.id}`}
                        className="rounded-xl border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-100 transition hover:border-violet-400 hover:bg-violet-500/15"
                      >
                        역할별 주의사항에서 더 보기
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {executionTickets.length > 0 ? (
            <SectionCard title="개발자 실행 티켓">
              <div className="space-y-4">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        바로 전달 가능한 실행 티켓 자동 생성
                      </p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        프론트엔드, 백엔드, QA, 운영 역할로 나눠서 실제 작업 단위로 정리했습니다.
                      </p>
                    </div>
                    <button
                      onClick={copyAllExecutionTickets}
                      className="rounded-xl border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-100 transition hover:border-violet-400 hover:bg-violet-500/15"
                    >
                      {copiedAllTickets ? "전체 티켓 복사됨" : "전체 티켓 복사"}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-100">
                      총 {executionTickets.length}개
                    </span>
                    <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-100">
                      P0 {ticketPriorityCounts.P0 ?? 0}
                    </span>
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-100">
                      P1 {ticketPriorityCounts.P1 ?? 0}
                    </span>
                    <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-100">
                      P2 {ticketPriorityCounts.P2 ?? 0}
                    </span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-200">
                      프론트엔드 {ticketOwnerCounts.frontend ?? 0}
                    </span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-200">
                      백엔드 {ticketOwnerCounts.backend ?? 0}
                    </span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-200">
                      QA {ticketOwnerCounts.qa ?? 0}
                    </span>
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-200">
                      운영 {ticketOwnerCounts.ops ?? 0}
                    </span>
                  </div>
                </div>

                {executionTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityTone(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority}
                          </span>
                          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-200">
                            {getOwnerLabel(ticket.owner)}
                          </span>
                        </div>
                        <p className="mt-3 text-base font-semibold text-white">
                          {ticket.title}
                        </p>
                      </div>

                      <button
                        onClick={() => copyExecutionTicket(ticket.id)}
                        className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800"
                      >
                        {copiedTicket === ticket.id ? "티켓 복사됨" : "티켓 복사"}
                      </button>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-zinc-300">
                      {ticket.rationale}
                    </p>

                    <div className="mt-4 grid gap-4 xl:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-violet-200">
                          해야 할 작업
                        </p>
                        <ul className="mt-2 space-y-2 text-sm leading-6 text-zinc-200">
                          {ticket.tasks.map((item, index) => (
                            <li key={`${ticket.id}-task-${index}`}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-emerald-200">
                          완료 조건
                        </p>
                        <ul className="mt-2 space-y-2 text-sm leading-6 text-zinc-200">
                          {ticket.acceptanceCriteria.map((item, index) => (
                            <li key={`${ticket.id}-acceptance-${index}`}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {ticket.references.length > 0 ? (
                      <div className="mt-4">
                        <p className="text-xs font-semibold tracking-[0.16em] text-violet-200">
                          연결 근거
                        </p>
                        <ul className="mt-2 space-y-2 text-sm leading-6 text-zinc-300">
                          {ticket.references.map((item, index) => (
                            <li key={`${ticket.id}-reference-${index}`}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </SectionCard>
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

function buildPrintableReportHtml({
  report,
  originalIdea,
  selectedToolLabel,
  techStackLabels,
  rolePackets,
}: {
  report: DeepSecurityReport;
  originalIdea: string;
  selectedToolLabel: string;
  techStackLabels: string[];
  rolePackets: ReturnType<typeof buildRoleActionPackets>;
}) {
  const sections = [
    renderPrintListSection("지금 출시를 막는 차단 이슈", report.releaseBlockers),
    renderPrintListSection("핵심 설계 취약점", report.criticalFindings),
    renderPrintListSection("신뢰 경계", report.trustBoundaries),
    renderPrintListSection("권한 경계 경고", report.roleBoundaryWarnings),
    renderPrintListSection(
      "위험한 클라이언트 제어 필드",
      report.dangerousClientFields
    ),
    renderPrintListSection("남용 가능한 흐름", report.abuseCases),
    renderPrintListSection("필수 통제 장치", report.requiredControls),
    renderPrintRolePackets(rolePackets),
    renderPrintExecutionTickets(report),
    renderPrintStackAssumptions(report),
    renderPrintStackGuidance(report),
    renderPrintControlBlueprints(report),
    renderPrintAttackScenarios(report),
    renderPrintListSection(
      "개발자 / QA 검증 체크리스트",
      report.verificationChecklist
    ),
    renderPrintListSection("AI 코딩 툴 사용 경고", report.agentWarnings),
    renderPrintListSection("이 리포트가 반영한 보안 기준", report.researchAnchors),
  ]
    .filter(Boolean)
    .join("");

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>AMUGOTO 심층 보안 분석 리포트</title>
    <style>
      body {
        margin: 0;
        color: #18181b;
        background: #ffffff;
        font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
      }
      .page {
        max-width: 960px;
        margin: 0 auto;
        padding: 40px 32px 56px;
      }
      .eyebrow {
        color: #6d28d9;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.28em;
      }
      h1 {
        margin: 12px 0 0;
        font-size: 32px;
        line-height: 1.2;
      }
      .meta, .summary, .card {
        border-radius: 16px;
      }
      .meta {
        margin-top: 18px;
        padding: 18px 20px;
        border: 1px solid #ddd6fe;
        background: #f5f3ff;
      }
      .summary {
        margin-top: 20px;
        padding: 20px;
        border: 1px solid #c4b5fd;
        background: #faf5ff;
      }
      .summary p, .meta p {
        margin: 6px 0;
        line-height: 1.6;
      }
      section {
        margin-top: 24px;
        break-inside: avoid;
      }
      h2 {
        margin: 0 0 12px;
        font-size: 20px;
      }
      .card {
        margin-top: 12px;
        padding: 16px 18px;
        border: 1px solid #e4e4e7;
        background: #fafafa;
      }
      .card h3 {
        margin: 0 0 8px;
        font-size: 16px;
      }
      p, li {
        line-height: 1.7;
      }
      .small {
        color: #52525b;
        font-size: 14px;
      }
      ul {
        margin: 8px 0 0 18px;
        padding: 0;
      }
      li {
        margin: 6px 0;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="eyebrow">AMUGOTO SECURITY REPORT</div>
      <h1>심층 보안 분석 리포트</h1>
      <div class="meta">
        <p><strong>선택한 툴:</strong> ${escapeHtml(selectedToolLabel)}</p>
        <p><strong>선택한 기술 스택:</strong> ${escapeHtml(techStackLabels.join(", "))}</p>
        <p><strong>원래 요청:</strong> ${escapeHtml(originalIdea)}</p>
      </div>
      <div class="summary">
        <p><strong>심층 평가:</strong> ${escapeHtml(report.overallAssessment)}</p>
        <p class="small">${escapeHtml(report.executiveSummary)}</p>
      </div>
      ${sections}
    </div>
  </body>
</html>`;
}

function renderPrintListSection(title: string, items: string[]) {
  if (items.length === 0) {
    return "";
  }

  return `
    <section>
      <h2>${escapeHtml(title)}</h2>
      <div class="card">
        <ul>
          ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    </section>
  `;
}

function renderPrintRolePackets(
  packets: ReturnType<typeof buildRoleActionPackets>
) {
  if (packets.length === 0) {
    return "";
  }

  return `
    <section>
      <h2>역할별 실행 요약</h2>
      ${packets
        .map(
          (packet) => `
            <div class="card">
              <h3>${escapeHtml(packet.roleLabel)}</h3>
              <p class="small">${escapeHtml(packet.subtitle)}</p>
              <ul>
                ${packet.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </div>
          `
        )
        .join("")}
    </section>
  `;
}

function renderPrintExecutionTickets(report: DeepSecurityReport) {
  if (report.executionTickets.length === 0) {
    return "";
  }

  return `
    <section>
      <h2>개발자 실행 티켓</h2>
      ${report.executionTickets
        .map(
          (ticket) => `
            <div class="card">
              <h3>[${escapeHtml(ticket.priority)}][${escapeHtml(
                getOwnerLabel(ticket.owner)
              )}] ${escapeHtml(ticket.title)}</h3>
              <p class="small">${escapeHtml(ticket.rationale)}</p>
              <p style="margin-top:12px;"><strong>해야 할 작업</strong></p>
              <ul>
                ${ticket.tasks.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}
              </ul>
              <p style="margin-top:12px;"><strong>완료 조건</strong></p>
              <ul>
                ${ticket.acceptanceCriteria
                  .map((entry) => `<li>${escapeHtml(entry)}</li>`)
                  .join("")}
              </ul>
              ${
                ticket.references.length > 0
                  ? `
              <p style="margin-top:12px;"><strong>연결 근거</strong></p>
              <ul>
                ${ticket.references
                  .map((entry) => `<li>${escapeHtml(entry)}</li>`)
                  .join("")}
              </ul>`
                  : ""
              }
            </div>
          `
        )
        .join("")}
    </section>
  `;
}

function renderPrintStackAssumptions(report: DeepSecurityReport) {
  if (report.stackAssumptions.length === 0) {
    return "";
  }

  return `
    <section>
      <h2>가정한 기술 스택</h2>
      ${report.stackAssumptions
        .map(
          (item) => `
            <div class="card">
              <h3>${escapeHtml(item.stack)}</h3>
              <p class="small">${escapeHtml(item.reason)}</p>
            </div>
          `
        )
        .join("")}
    </section>
  `;
}

function renderPrintStackGuidance(report: DeepSecurityReport) {
  if (report.stackSpecificGuidance.length === 0) {
    return "";
  }

  return `
    <section>
      <h2>스택별 구현 가이드</h2>
      ${report.stackSpecificGuidance
        .map(
          (item) => `
            <div class="card">
              <h3>${escapeHtml(item.stack)}</h3>
              <p><strong>구체 실행 방안</strong></p>
              <ul>
                ${item.concreteActions.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}
              </ul>
              <p style="margin-top:12px;"><strong>자주 하는 실수</strong></p>
              <ul>
                ${item.commonMistakes.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}
              </ul>
            </div>
          `
        )
        .join("")}
    </section>
  `;
}

function renderPrintControlBlueprints(report: DeepSecurityReport) {
  if (report.controlBlueprints.length === 0) {
    return "";
  }

  return `
    <section>
      <h2>구현 통제 설계도</h2>
      ${report.controlBlueprints
        .map(
          (item) => `
            <div class="card">
              <h3>${escapeHtml(item.title)}</h3>
              <p class="small">${escapeHtml(item.objective)}</p>
              <p style="margin-top:12px;"><strong>구현 포인트</strong></p>
              <ul>
                ${item.implementationNotes.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}
              </ul>
              <p style="margin-top:12px;"><strong>빠뜨리면 생기는 문제</strong></p>
              <ul>
                ${item.failureModes.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}
              </ul>
              <p style="margin-top:12px;"><strong>검증 방법</strong></p>
              <ul>
                ${item.validationSteps.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}
              </ul>
            </div>
          `
        )
        .join("")}
    </section>
  `;
}

function renderPrintAttackScenarios(report: DeepSecurityReport) {
  if (report.attackScenarios.length === 0) {
    return "";
  }

  return `
    <section>
      <h2>공격 시나리오</h2>
      ${report.attackScenarios
        .map(
          (item) => `
            <div class="card">
              <h3>${escapeHtml(item.title)}</h3>
              <p><strong>공격 목표:</strong> ${escapeHtml(item.attackerGoal)}</p>
              <p><strong>공격 경로:</strong> ${escapeHtml(item.attackPath)}</p>
              <p><strong>영향:</strong> ${escapeHtml(item.impact)}</p>
              <p><strong>추천 방어책:</strong> ${escapeHtml(item.recommendedDefense)}</p>
            </div>
          `
        )
        .join("")}
    </section>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getOwnerLabel(owner: "frontend" | "backend" | "qa" | "ops") {
  switch (owner) {
    case "frontend":
      return "프론트엔드";
    case "backend":
      return "백엔드";
    case "qa":
      return "QA";
    case "ops":
      return "운영";
    default:
      return owner;
  }
}

function getPriorityTone(priority: "P0" | "P1" | "P2") {
  switch (priority) {
    case "P0":
      return "border-rose-500/40 bg-rose-500/10 text-rose-200";
    case "P1":
      return "border-amber-500/40 bg-amber-500/10 text-amber-200";
    case "P2":
      return "border-sky-500/40 bg-sky-500/10 text-sky-200";
    default:
      return "border-zinc-700 bg-zinc-900 text-zinc-200";
  }
}

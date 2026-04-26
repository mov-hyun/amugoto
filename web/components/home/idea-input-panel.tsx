import {
  TOOL_GROUPS,
  getToolConfig,
  getToolsByAudience,
  type ToolId,
} from "@/lib/amugoto/tools";
import { DETAIL_QUESTION_CONFIG } from "@/lib/amugoto/details";
import type { DetailedBriefAnswers } from "@/types/amugoto";
import { useState } from "react";

type IdeaInputPanelProps = {
  idea: string;
  loading: boolean;
  selectedTool: ToolId;
  detailedAnswers: DetailedBriefAnswers;
  onIdeaChange: (value: string) => void;
  onToolChange: (toolId: ToolId) => void;
  onDetailedAnswerChange: (
    key: keyof DetailedBriefAnswers,
    value: string
  ) => void;
  onSubmit: () => void;
};

export function IdeaInputPanel({
  idea,
  loading,
  selectedTool,
  detailedAnswers,
  onIdeaChange,
  onToolChange,
  onDetailedAnswerChange,
  onSubmit,
}: IdeaInputPanelProps) {
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);
  const selectedToolConfig = getToolConfig(selectedTool);

  return (
    <section className="h-fit rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
      <div className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-sm font-semibold text-zinc-100">어떤 툴에서 쓸 건가요?</p>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          선택한 툴에 맞춰 프롬프트 톤과 실행 안내를 조정합니다.
        </p>

        <div className="mt-4 space-y-4">
          {TOOL_GROUPS.map((group) => (
            <div key={group.audience}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                    group.audience === "nonDeveloper"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                      : "border border-sky-500/30 bg-sky-500/10 text-sky-200"
                  }`}
                >
                  {group.label}
                </span>
                <p className="text-xs text-zinc-500">{group.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {getToolsByAudience(group.audience).map((tool) => {
                  const active = tool.id === selectedTool;

                  return (
                    <button
                      key={tool.id}
                      onClick={() => onToolChange(tool.id)}
                      className={`inline-flex whitespace-nowrap rounded-full border px-3 py-2 text-xs transition ${
                        active
                          ? "border-violet-500/60 bg-violet-500/15 text-white"
                          : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      {tool.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex whitespace-nowrap rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-200">
              현재 선택
            </span>
            <span className="text-sm font-semibold text-white">
              {selectedToolConfig.label}
            </span>
            <span className="text-xs text-zinc-400">
              · {selectedToolConfig.audienceLabel}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {selectedToolConfig.shortDescription}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            추천 대상: {selectedToolConfig.recommendedFor}
          </p>
        </div>
      </div>

      <label className="mb-3 block text-lg font-semibold">
        무엇을 만들고 싶나요?
      </label>
      <textarea
        value={idea}
        onChange={(event) => onIdeaChange(event.target.value)}
        placeholder="예: 고객들이 예약하고 결제도 할 수 있는 피부관리샵 사이트 만들어줘. 고객 정보는 내가 관리자 페이지에서 다 볼 수 있게 해줘. 카드번호도 저장되면 좋겠어."
        className="min-h-56 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-base leading-7 text-white outline-none transition focus:border-violet-400"
      />

      <button
        onClick={() => setShowDetailedQuestions((current) => !current)}
        className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-900"
      >
        <span>{showDetailedQuestions ? "−" : "+"}</span>
        <span>더 자세히 물어보기</span>
      </button>

      {showDetailedQuestions && (
        <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="mb-4">
            <p className="text-sm font-semibold text-zinc-100">
              더 정확한 주문서를 만들기 위한 보조 질문
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              답할수록 더 현실적인 MVP와 더 안전한 프롬프트를 만들 수 있습니다.
            </p>
          </div>

          <div className="space-y-4">
            {DETAIL_QUESTION_CONFIG.map((question) => (
              <label key={question.key} className="block">
                <span className="block text-sm font-semibold text-zinc-100">
                  {question.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500">
                  {question.helper}
                </span>
                <textarea
                  value={detailedAnswers[question.key]}
                  onChange={(event) =>
                    onDetailedAnswerChange(question.key, event.target.value)
                  }
                  placeholder={question.placeholder}
                  className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-900 p-3 text-sm leading-6 text-white outline-none transition focus:border-violet-400"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading || !idea.trim()}
        className="mt-4 w-full rounded-2xl bg-white px-5 py-4 font-bold text-zinc-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "위험 요소 분석 중..." : "위험 요소 감지하고 안전한 주문서 만들기"}
      </button>

      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-400">
        <p className="font-semibold text-zinc-200">AMUGOTO가 확인하는 것</p>
        <p className="mt-2">
          카드번호 저장, 과도한 개인정보 수집, 관리자 권한 누락, 고객 데이터
          노출, 직접 결제 구현 같은 위험한 요구를 먼저 점검합니다.
        </p>
      </div>
    </section>
  );
}

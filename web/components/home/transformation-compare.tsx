import { getTransformationHighlights } from "@/lib/amugoto/compare";
import type { AmugotoResult } from "@/types/amugoto";

export function TransformationCompare({
  originalIdea,
  result,
}: {
  originalIdea: string;
  result: AmugotoResult;
}) {
  const highlights = getTransformationHighlights(result);
  const topSafeChanges = result.safeAlternatives
    .map((item) => item.safeVersion.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-amber-300">
              BEFORE / AFTER
            </p>
            <h2 className="mt-2 text-2xl font-bold">전후 비교</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              위험한 원문 요구사항이 어떻게 더 안전한 앱 주문서로 바뀌었는지 한눈에
              보여줍니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-red-500/20 bg-red-950/30 p-5">
            <p className="text-xs font-semibold tracking-[0.22em] text-red-200">
              원래 요청
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-100">
              {originalIdea}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5">
            <p className="text-xs font-semibold tracking-[0.22em] text-emerald-200">
              안전하게 바꾼 요구사항
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-100">
              {result.safeAppSummary}
            </p>

            {topSafeChanges.length > 0 && (
              <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-xs font-semibold tracking-[0.18em] text-zinc-300">
                  핵심 조정 내용
                </p>
                <ul className="mt-3 space-y-2">
                  {topSafeChanges.map((change) => (
                    <li
                      key={change}
                      className="flex gap-3 text-sm leading-6 text-zinc-200"
                    >
                      <span className="mt-0.5 text-emerald-300">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

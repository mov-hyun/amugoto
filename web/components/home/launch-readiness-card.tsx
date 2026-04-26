import { calculateLaunchReadiness } from "@/lib/amugoto/scoring";
import { SectionCard } from "@/components/home/section-card";
import type { AmugotoResult } from "@/types/amugoto";

function scoreColor(score: number) {
  if (score >= 80) {
    return "bg-emerald-400";
  }

  if (score >= 60) {
    return "bg-amber-300";
  }

  return "bg-rose-400";
}

export function LaunchReadinessCard({ result }: { result: AmugotoResult }) {
  const readiness = calculateLaunchReadiness(result);
  const stars = Array.from({ length: 5 }, (_, index) => index < readiness.stars);

  return (
    <SectionCard title="출시 준비도 점수">
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.35fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-violet-300">
            LAUNCH READINESS
          </p>
          <div className="mt-4 flex items-center gap-1 text-3xl">
            {stars.map((filled, index) => (
              <span
                key={index}
                className={filled ? "text-amber-300" : "text-zinc-700"}
              >
                ★
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-5xl font-bold text-white">
              {readiness.overall}
            </span>
            <span className="pb-1 text-sm text-zinc-400">/ 100</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-zinc-100">
            {readiness.label}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {readiness.summary}
          </p>
        </div>

        <div className="space-y-4">
          {readiness.dimensions.map((dimension) => (
            <div
              key={dimension.key}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-100">
                  {dimension.label}
                </p>
                <span className="text-sm font-semibold text-zinc-300">
                  {dimension.score} / {dimension.maxScore}점
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full rounded-full ${scoreColor(dimension.score)}`}
                  style={{
                    width: `${(dimension.score / dimension.maxScore) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {dimension.reason}
              </p>
              <ul className="mt-3 space-y-1 text-xs leading-5 text-zinc-500">
                {dimension.criteria.map((criterion) => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

import Link from "next/link";

import { INDUSTRY_EXAMPLES } from "@/lib/amugoto/examples";
import { getToolConfig } from "@/lib/amugoto/tools";

export default function ExamplesPage() {
  return (
    <main className="bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col px-6 py-10">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold tracking-[0.35em] text-amber-300">
            INDUSTRY EXAMPLES
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            업종별 예시로
            <br />
            어떻게 시작하는지 먼저 보기.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            어떤 질문을 채워야 하는지 감이 안 올 때는 실제 업종 예시를 먼저
            보고, 그대로 시작 화면으로 가져가서 바로 분석해보세요.
          </p>
        </div>

        <div className="mb-8 grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-sm font-semibold text-amber-200">1. 예시 선택</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              내 업종과 가장 비슷한 예시를 먼저 고릅니다.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-sm font-semibold text-amber-200">2. 자동 채우기</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              예시 아이디어와 상세 질문 답변이 시작 화면에 자동으로 채워집니다.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-sm font-semibold text-amber-200">3. 바로 수정</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              그대로 실행하거나 내 상황에 맞게 조금만 바꿔서 분석하면 됩니다.
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {INDUSTRY_EXAMPLES.map((example) => {
            const tool = getToolConfig(example.tool);

            return (
              <article
                key={example.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                    {example.category}
                  </span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
                    추천 툴: {tool.label}
                  </span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
                    {tool.audienceLabel}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold">{example.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {example.summary}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {example.whyItMatters}
                </p>

                <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4">
                  <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500">
                    예시 아이디어
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-200">
                    {example.idea}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/start?example=${example.id}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                  >
                    이 예시로 바로 시작하기
                  </Link>
                  <Link
                    href="/start"
                    className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
                  >
                    직접 입력하러 가기
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

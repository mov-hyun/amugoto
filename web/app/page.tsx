import Link from "next/link";

import { TOOL_GROUPS, getToolsByAudience } from "@/lib/amugoto/tools";

export default function Home() {
  return (
    <main className="bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col justify-center px-6 py-10">
        <div className="max-w-5xl">
          <p className="mb-3 text-sm font-semibold tracking-[0.35em] text-violet-300">
            AMUGOTO
          </p>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
            아무것도 몰라도,
            <br />
            안전하게 앱은 만들 수 있게.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            막연한 앱 아이디어 속 위험한 요구를 먼저 감지하고, 다양한 AI 앱
            빌더와 코딩 에이전트에서 바로 쓸 수 있는 안전한 제작 주문서로
            바꿔드립니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link
            href="/start"
            className="group rounded-3xl border border-violet-500/30 bg-violet-500/10 p-6 transition hover:border-violet-400 hover:bg-violet-500/15"
          >
            <p className="text-sm font-semibold tracking-[0.25em] text-violet-200">
              START
            </p>
            <h2 className="mt-3 text-3xl font-bold">바로 시작하기</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-200">
              내가 만들고 싶은 앱 아이디어를 직접 입력하고, 위험 분석과 안전한
              제작 주문서를 바로 받아봅니다.
            </p>
            <p className="mt-6 text-sm font-semibold text-violet-200 transition group-hover:translate-x-1">
              입력 화면으로 이동하기 →
            </p>
          </Link>

          <Link
            href="/examples"
            className="group rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 transition hover:border-amber-400 hover:bg-amber-500/15"
          >
            <p className="text-sm font-semibold tracking-[0.25em] text-amber-200">
              EXAMPLES
            </p>
            <h2 className="mt-3 text-3xl font-bold">업종별 예시 사용법 보기</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-200">
              피부관리샵, PT샵, 상담 운영 같은 실제 예시를 보고 시작 화면에
              그대로 불러와 빠르게 분석할 수 있습니다.
            </p>
            <p className="mt-6 text-sm font-semibold text-amber-200 transition group-hover:translate-x-1">
              예시 페이지로 이동하기 →
            </p>
          </Link>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
          <p className="text-sm font-semibold tracking-[0.25em] text-zinc-400">
            SUPPORTED TOOLS
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {TOOL_GROUPS.map((group) => (
              <div
                key={group.audience}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4"
              >
                <p className="text-sm font-semibold text-white">{group.label}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {group.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {getToolsByAudience(group.audience).map((tool) => (
                    <span
                      key={tool.id}
                      className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-200"
                    >
                      {tool.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

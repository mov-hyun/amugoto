import Link from "next/link";

import {
  COMMON_ROLE_PRINCIPLES,
  ROLE_GUIDANCE_SECTIONS,
} from "@/lib/amugoto/role-guidance";

export default function RolesPage() {
  return (
    <main className="bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col px-6 py-10">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold tracking-[0.35em] text-sky-300">
            ROLE GUIDANCE
          </p>
          <h1 className="max-w-5xl text-4xl font-bold tracking-tight sm:text-6xl">
            프론트엔드, 백엔드, QA, 운영이
            <br />
            각자 놓치지 말아야 할 보안 포인트.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            AMUGOTO가 잡아내는 위험을 실제 구현과 검증에 연결하려면, 역할마다
            무엇을 먼저 확인해야 하는지 정리돼 있어야 합니다. 이 페이지는 팀이
            바로 참고할 수 있는 역할별 주의사항 요약입니다.
          </p>
        </div>

        <div className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
          <p className="text-sm font-semibold tracking-[0.25em] text-zinc-400">
            공통 원칙
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {COMMON_ROLE_PRINCIPLES.map((item, index) => (
              <div
                key={`common-${index}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4"
              >
                <p className="text-sm leading-6 text-zinc-200">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {ROLE_GUIDANCE_SECTIONS.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6"
            >
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${section.badgeTone}`}
              >
                {section.title}
              </span>
              <h2 className="mt-4 text-2xl font-bold">{section.title} 체크포인트</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {section.subtitle}
              </p>

              <div className="mt-5 space-y-3">
                {section.checks.map((item, index) => (
                  <div
                    key={`${section.id}-${index}`}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4"
                  >
                    <p className="text-sm leading-6 text-zinc-200">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link
            href="/start"
            className="rounded-3xl border border-violet-500/30 bg-violet-500/10 p-6 transition hover:border-violet-400 hover:bg-violet-500/15"
          >
            <p className="text-sm font-semibold tracking-[0.25em] text-violet-200">
              START
            </p>
            <h2 className="mt-3 text-2xl font-bold">이 기준으로 바로 분석하기</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-200">
              지금 본 역할별 체크포인트를 바탕으로 앱 아이디어를 넣고, 실제로
              어떤 위험이 나오는지 바로 확인할 수 있습니다.
            </p>
          </Link>

          <Link
            href="/examples"
            className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 transition hover:border-amber-400 hover:bg-amber-500/15"
          >
            <p className="text-sm font-semibold tracking-[0.25em] text-amber-200">
              EXAMPLES
            </p>
            <h2 className="mt-3 text-2xl font-bold">업종별 예시와 함께 보기</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-200">
              실제 업종별 예시를 보면서 역할별 주의사항이 어떤 화면과 흐름에
              연결되는지 더 쉽게 이해할 수 있습니다.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}

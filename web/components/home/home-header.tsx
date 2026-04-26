import { TOOL_GROUPS, getToolsByAudience } from "@/lib/amugoto/tools";

export function HomeHeader() {
  return (
    <header className="mb-10">
      <p className="mb-3 text-sm font-semibold tracking-[0.35em] text-violet-300">
        AMUGOTO
      </p>
      <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
        아무것도 몰라도,
        <br />
        안전하게 앱은 만들 수 있게.
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
        막연한 앱 아이디어 속 위험한 요구를 먼저 감지하고, 다양한 AI 앱
        빌더와 코딩 에이전트에서 바로 쓸 수 있는 안전한 제작 주문서로
        바꿔드립니다.
      </p>

      <div className="mt-4 flex flex-col gap-3 text-sm">
        {TOOL_GROUPS.map((group) => (
          <div key={group.audience} className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                group.audience === "nonDeveloper"
                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : "border border-sky-500/30 bg-sky-500/10 text-sky-200"
              }`}
            >
              {group.label}
            </span>
            {getToolsByAudience(group.audience).map((tool) => (
              <span
                key={tool.id}
                className="inline-flex whitespace-nowrap rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
              >
                {tool.label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </header>
  );
}

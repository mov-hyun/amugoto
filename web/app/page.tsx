"use client";

import { useState } from "react";

type Risk = {
  title: string;
  description: string;
  saferAlternative: string;
};

type SafeAlternative = {
  riskyRequest: string;
  safeVersion: string;
};

type BuilderPrompt = {
  step: string;
  title: string;
  prompt: string;
};

type AmugotoResult = {
  riskLevel: string;
  oneLineSummary: string;
  detectedRisks: Risk[];
  easyExplanation: string;
  safeAppSummary: string;
  mvpFeatures: string[];
  excludedFeatures: string[];
  allowedData: string[];
  blockedData: string[];
  adminAndPermission: string[];
  safeAlternatives: SafeAlternative[];
  builderPrompts: BuilderPrompt[];
  testChecklist: string[];
};

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<AmugotoResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState("");

  async function generateGuide() {
    if (!idea.trim()) return;

    setLoading(true);
    setResult(null);
    setError("");
    setCopiedPrompt("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "오류가 발생했습니다.");
        return;
      }

      setResult(data.result);
    } catch {
      setError("요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopiedPrompt(label);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
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
            막연한 앱 아이디어 속 위험한 요구를 먼저 감지하고, Lovable, v0,
            Cursor, Claude Code에 붙여넣을 수 있는 안전한 제작 주문서로 바꿔드립니다.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
          <section className="h-fit rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
            <label className="mb-3 block text-lg font-semibold">
              무엇을 만들고 싶나요?
            </label>
            <textarea
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="예: 고객들이 예약하고 결제도 할 수 있는 피부관리샵 사이트 만들어줘. 고객 정보는 내가 관리자 페이지에서 다 볼 수 있게 해줘. 카드번호도 저장되면 좋겠어."
              className="min-h-56 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-base leading-7 text-white outline-none transition focus:border-violet-400"
            />

            <button
              onClick={generateGuide}
              disabled={loading || !idea.trim()}
              className="mt-4 w-full rounded-2xl bg-white px-5 py-4 font-bold text-zinc-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "위험 요소 분석 중..." : "위험 요소 감지하고 안전한 주문서 만들기"}
            </button>

            <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-400">
              <p className="font-semibold text-zinc-200">AMUGOTO가 확인하는 것</p>
              <p className="mt-2">
                카드번호 저장, 과도한 개인정보 수집, 관리자 권한 누락, 고객 데이터 노출,
                직접 결제 구현 같은 위험한 요구를 먼저 점검합니다.
              </p>
            </div>
          </section>

          <section className="space-y-5">
            {!result && !error && (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 text-zinc-300">
                앱 아이디어를 입력하면 감지된 위험, 쉬운 설명, 안전한 대안,
                단계별 AI 앱 빌더 프롬프트, 초보자 테스트 체크리스트가 카드로 표시됩니다.
              </div>
            )}

            {error && (
              <div className="rounded-3xl border border-red-900 bg-red-950/40 p-6 text-red-100">
                {error}
              </div>
            )}

            {result && (
              <>
                <div className="rounded-3xl border border-violet-700/60 bg-violet-950/30 p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-violet-300 px-3 py-1 text-sm font-bold text-violet-950">
                      위험도: {result.riskLevel}
                    </span>
                    <span className="text-sm text-violet-200">
                      안전 변환 완료
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{result.oneLineSummary}</h2>
                  <p className="mt-4 leading-7 text-zinc-200">
                    {result.easyExplanation}
                  </p>
                </div>

                <Card title="감지된 위험">
                  <div className="space-y-3">
                    {result.detectedRisks?.map((risk, index) => (
                      <div
                        key={index}
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
                </Card>

                <Card title="안전한 앱 요약">
                  <p className="leading-7 text-zinc-200">{result.safeAppSummary}</p>
                </Card>

                <div className="grid gap-5 md:grid-cols-2">
                  <ListCard title="처음 버전에서 만들 기능" items={result.mvpFeatures} />
                  <ListCard title="처음 버전에서 제외할 기능" items={result.excludedFeatures} />
                  <ListCard title="받아도 되는 정보" items={result.allowedData} />
                  <ListCard title="받지 않는 게 안전한 정보" items={result.blockedData} />
                </div>

                <ListCard title="관리자 화면과 권한" items={result.adminAndPermission} />

                <Card title="위험한 요구를 안전하게 바꾸기">
                  <div className="space-y-3">
                    {result.safeAlternatives?.map((item, index) => (
                      <div
                        key={index}
                        className="grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 md:grid-cols-[1fr_1fr]"
                      >
                        <div>
                          <p className="text-xs font-semibold text-red-300">위험한 요구</p>
                          <p className="mt-1 text-sm text-zinc-300">
                            {item.riskyRequest}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-300">안전한 대안</p>
                          <p className="mt-1 text-sm text-zinc-300">
                            {item.safeVersion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="AI 앱 빌더용 단계별 프롬프트">
                  <div className="space-y-4">
                    {result.builderPrompts?.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-violet-300">{item.step}</p>
                            <h3 className="font-semibold">{item.title}</h3>
                          </div>
                          <button
                            onClick={() => copyText(item.prompt, `${item.step} 복사됨`)}
                            className="rounded-xl border border-zinc-700 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800"
                          >
                            {copiedPrompt === `${item.step} 복사됨` ? "복사됨" : "복사"}
                          </button>
                        </div>
                        <p className="whitespace-pre-wrap rounded-xl bg-zinc-900 p-4 text-sm leading-7 text-zinc-200">
                          {item.prompt}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                <ListCard
                  title="초보자 테스트 체크리스트"
                  items={result.testChecklist}
                  checklist
                />
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}

function ListCard({
  title,
  items,
  checklist = false,
}: {
  title: string;
  items?: string[];
  checklist?: boolean;
}) {
  return (
    <Card title={title}>
      <ul className="space-y-2">
        {(items || []).map((item, index) => (
          <li
            key={index}
            className="flex gap-3 rounded-xl bg-zinc-950 px-4 py-3 text-sm leading-6 text-zinc-200"
          >
            <span className="mt-0.5 text-violet-300">
              {checklist ? "☐" : "•"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateGuide() {
    if (!idea.trim()) return;

    setLoading(true);
    setResult("");
    setCopied(false);

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
        setResult(data.error || "오류가 발생했습니다.");
        return;
      }

      setResult(data.result);
    } catch {
      setResult("요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
        <header className="mb-12">
          <p className="mb-3 text-sm font-semibold tracking-[0.35em] text-violet-300">
            AMUGOTO
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            아무것도 몰라도,
            <br />
            앱은 만들 수 있게.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            막연한 앱 아이디어를 Lovable, v0, Cursor, Claude Code가 이해할 수 있는
            안전한 앱 제작 주문서와 단계별 프롬프트로 바꿔드립니다.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
            <label className="mb-3 block text-lg font-semibold">
              무엇을 만들고 싶나요?
            </label>
            <textarea
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="예: PT 회원들이 수업 예약하고, 내가 예약 목록을 볼 수 있는 사이트를 만들고 싶어."
              className="min-h-52 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-base leading-7 text-white outline-none transition focus:border-violet-400"
            />

            <button
              onClick={generateGuide}
              disabled={loading || !idea.trim()}
              className="mt-4 w-full rounded-2xl bg-white px-5 py-4 font-bold text-zinc-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "주문서 만드는 중..." : "안전한 앱 제작 주문서 만들기"}
            </button>

            <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-400">
              <p className="font-semibold text-zinc-200">AMUGOTO가 확인하는 것</p>
              <p className="mt-2">
                개인정보, 결제, 관리자 권한, 고객 데이터 노출, 첫 버전에서 빼야 할
                위험한 기능을 함께 점검합니다.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">결과</h2>
              <button
                onClick={copyResult}
                disabled={!result}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied ? "복사됨" : "전체 복사"}
              </button>
            </div>

            <div className="min-h-[32rem] whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-sm leading-7 text-zinc-100">
              {result ||
                "앱 아이디어를 입력하면 쉬운 기획서, 제작 주문서, AI 앱 빌더용 프롬프트, 위험 요소 경고, 테스트 체크리스트가 여기에 표시됩니다."}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

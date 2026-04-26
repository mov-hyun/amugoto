import { getToolConfig, type ToolId } from "@/lib/amugoto/tools";

export function LoadingPromoCard({
  visible,
  selectedTool,
}: {
  visible: boolean;
  selectedTool: ToolId;
}) {
  const tool = getToolConfig(selectedTool);

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 w-[22rem] max-w-[calc(100vw-2rem)] animate-fade-up-in">
      <div className="overflow-hidden rounded-3xl border border-violet-500/30 bg-zinc-950/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="bg-gradient-to-r from-violet-600/20 via-fuchsia-500/15 to-indigo-500/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-1 text-[11px] font-bold tracking-[0.22em] text-violet-100">
              AMUGOTO PROMO
            </span>
            <span className="text-xs text-zinc-300">{tool.label}용 분석 준비 중</span>
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-white">
            이번 분석에서는 단순 위험 경고를 넘어서, 숨은 설계 리스크도 함께 점검합니다.
          </p>
        </div>

        <div className="space-y-3 px-4 py-4 text-sm text-zinc-300">
          <PromoLine title="권한 매트릭스" body="누가 무엇을 보고 바꿀 수 있는지 역할별로 정리합니다." />
          <PromoLine
            title="금지 필드 규칙"
            body="role, ownerId, price, status 같은 숨은 필드 조작을 막는 방향을 제안합니다."
          />
          <PromoLine
            title="외부 연동 신뢰 규칙"
            body="결제, 웹훅, URL fetch, 외부 문서를 어디까지 믿으면 안 되는지 짚어줍니다."
          />
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-3 py-3 text-xs leading-5 text-zinc-400">
            팁: 다음에는 <span className="font-semibold text-zinc-200">업종별 예시</span>에서 시작하면
            더 빠르게 안전한 주문서를 만들 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}

function PromoLine({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-3 py-3">
      <p className="text-xs font-semibold tracking-[0.16em] text-violet-200">{title}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-300">{body}</p>
    </div>
  );
}

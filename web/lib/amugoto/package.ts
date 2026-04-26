import type { ToolConfig } from "@/lib/amugoto/tools";
import type { AmugotoResult } from "@/types/amugoto";

function formatSection(title: string, content: string[]) {
  const filtered = content.map((item) => item.trim()).filter(Boolean);

  if (filtered.length === 0) {
    return "";
  }

  return [`## ${title}`, ...filtered].join("\n");
}

function formatBulletList(items: string[]) {
  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `- ${item}`);
}

export function buildFinalOrderPackage(
  result: AmugotoResult,
  tool: ToolConfig
) {
  const sections = [
    "# AMUGOTO 안전 제작 주문서",
    "",
    `대상 툴: ${tool.label}`,
    `툴 유형: ${tool.audienceLabel}`,
    `권장 사용 방식: ${tool.promptStyle}`,
    "",
    `한 줄 요약: ${result.oneLineSummary}`,
    "",
    formatSection("안전한 앱 요약", [result.safeAppSummary]),
    formatSection("첫 버전에 꼭 넣을 기능", formatBulletList(result.mvpFeatures)),
    formatSection("첫 버전에서 제외할 기능", formatBulletList(result.excludedFeatures)),
    formatSection("받아도 되는 정보", formatBulletList(result.allowedData)),
    formatSection("받지 말아야 할 정보", formatBulletList(result.blockedData)),
    formatSection(
      "관리자 화면과 권한",
      formatBulletList(result.adminAndPermission)
    ),
    formatSection(
      "위험한 요구를 안전하게 바꾸기",
      result.safeAlternatives.map(
        (item) =>
          `- 위험한 요구: ${item.riskyRequest}\n  안전한 대안: ${item.safeVersion}`
      )
    ),
    formatSection(
      `${tool.label}용 단계별 프롬프트`,
      result.builderPrompts.map(
        (prompt) =>
          `### ${prompt.step} - ${prompt.title}\n${prompt.prompt.trim()}`
      )
    ),
    formatSection(
      "출시 전 테스트 체크리스트",
      formatBulletList(result.testChecklist)
    ),
  ]
    .filter(Boolean)
    .join("\n\n")
    .trim();

  return sections;
}

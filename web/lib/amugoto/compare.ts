import type { AmugotoResult } from "@/types/amugoto";

const HIGHLIGHT_RULES = [
  {
    label: "카드·결제정보 직접 저장 제거",
    keywords: ["카드", "결제", "payment", "card", "pci"],
  },
  {
    label: "개인정보 수집 범위 축소",
    keywords: [
      "개인정보",
      "민감정보",
      "주민",
      "건강",
      "privacy",
      "personal",
      "sensitive",
    ],
  },
  {
    label: "관리자 접근 제한 추가",
    keywords: ["관리자", "권한", "인가", "인증", "admin", "auth"],
  },
  {
    label: "고객 데이터 노출 방지",
    keywords: ["노출", "다른 고객", "고객 데이터", "exposure", "data"],
  },
  {
    label: "첫 버전 범위 재정리",
    keywords: ["mvp", "범위", "과도", "scope", "version"],
  },
  {
    label: "출시 전 점검 항목 추가",
    keywords: ["테스트", "점검", "checklist", "launch", "release"],
  },
];

const FALLBACK_HIGHLIGHTS = [
  "위험한 요구사항 재작성",
  "안전한 데이터 정책 반영",
  "운영 권한 구조 정리",
  "실행 전 체크리스트 추가",
];

function includesKeyword(text: string, keywords: string[]) {
  const normalizedText = text.toLowerCase();
  return keywords.some((keyword) => normalizedText.includes(keyword.toLowerCase()));
}

export function getTransformationHighlights(result: AmugotoResult) {
  const sourceTexts = [
    result.safeAppSummary,
    result.easyExplanation,
    ...result.detectedRisks.flatMap((risk) => [
      risk.title,
      risk.description,
      risk.saferAlternative,
    ]),
    ...result.safeAlternatives.flatMap((item) => [
      item.riskyRequest,
      item.safeVersion,
    ]),
  ].filter(Boolean);

  const matched = HIGHLIGHT_RULES.filter((rule) =>
    sourceTexts.some((text) => includesKeyword(text, rule.keywords))
  ).map((rule) => rule.label);

  const uniqueHighlights = [...new Set([...matched, ...FALLBACK_HIGHLIGHTS])];
  return uniqueHighlights.slice(0, 4);
}

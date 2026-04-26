export type ToolAudience = "nonDeveloper" | "developer";

export type ToolId =
  | "lovable"
  | "v0"
  | "replit-agent"
  | "cursor"
  | "claude-code";

export type ToolConfig = {
  id: ToolId;
  label: string;
  audience: ToolAudience;
  audienceLabel: string;
  shortDescription: string;
  recommendedFor: string;
  promptStyle: string;
};

export const TOOL_OPTIONS: ToolConfig[] = [
  {
    id: "lovable",
    label: "Lovable",
    audience: "nonDeveloper",
    audienceLabel: "일반인용",
    shortDescription: "자연어로 웹앱을 빠르게 만드는 앱 빌더",
    recommendedFor: "코드보다 화면과 기능을 빠르게 만들고 싶은 비개발자",
    promptStyle: "화면/기능 요구사항이 잘 보이는 자연어 주문서",
  },
  {
    id: "v0",
    label: "v0",
    audience: "nonDeveloper",
    audienceLabel: "일반인용",
    shortDescription: "UI와 웹 화면을 빠르게 시각화하는 앱 빌더",
    recommendedFor: "서비스 화면 구조와 UX를 빠르게 잡고 싶은 사용자",
    promptStyle: "페이지 구조와 UI 흐름이 잘 보이는 프롬프트",
  },
  {
    id: "replit-agent",
    label: "Replit Agent",
    audience: "nonDeveloper",
    audienceLabel: "일반인용",
    shortDescription: "자연어로 앱을 만들고 배포까지 이어가는 에이전트",
    recommendedFor: "만들기와 배포를 한 흐름으로 경험하고 싶은 사용자",
    promptStyle: "기능 구현과 실행 단계를 함께 담은 실무형 프롬프트",
  },
  {
    id: "cursor",
    label: "Cursor",
    audience: "developer",
    audienceLabel: "개발자용",
    shortDescription: "코드베이스를 수정하며 개발하는 AI 코딩 에디터",
    recommendedFor: "기존 코드나 구현 세부사항까지 직접 다루는 개발자",
    promptStyle: "구현 제약과 코드 작업 지시가 분명한 개발자용 프롬프트",
  },
  {
    id: "claude-code",
    label: "Claude Code",
    audience: "developer",
    audienceLabel: "개발자용",
    shortDescription: "터미널과 코드 작업에 강한 코딩 에이전트",
    recommendedFor: "기능 구현, 리팩터링, 점검을 코드 단위로 지시하고 싶은 개발자",
    promptStyle: "단계별 구현 지시와 점검 항목이 분명한 코딩 에이전트용 프롬프트",
  },
];

export const TOOL_GROUPS: {
  audience: ToolAudience;
  label: string;
  description: string;
}[] = [
  {
    audience: "nonDeveloper",
    label: "일반인용",
    description: "코드보다 화면과 기능을 빠르게 만들고 싶은 사용자에게 적합합니다.",
  },
  {
    audience: "developer",
    label: "개발자용",
    description: "구현 방식과 코드 작업까지 직접 제어하고 싶은 사용자에게 적합합니다.",
  },
];

export function isToolId(value: unknown): value is ToolId {
  return TOOL_OPTIONS.some((tool) => tool.id === value);
}

export function getToolConfig(toolId: ToolId) {
  return TOOL_OPTIONS.find((tool) => tool.id === toolId) ?? TOOL_OPTIONS[0];
}

export function getToolsByAudience(audience: ToolAudience) {
  return TOOL_OPTIONS.filter((tool) => tool.audience === audience);
}

import { formatDetailedBriefAnswers } from "@/lib/amugoto/details";
import {
  formatSelectedTechStacks,
  type TechStackId,
} from "@/lib/amugoto/stacks";
import { getToolConfig, type ToolId } from "@/lib/amugoto/tools";
import type {
  AmugotoResult,
  DeepSecurityAttackScenario,
  DeepSecurityControlBlueprint,
  DeepSecurityExecutionTicket,
  DeepSecurityReport,
  DeepSecurityStackAssumption,
  DeepSecurityStackGuide,
  DetailedBriefAnswers,
} from "@/types/amugoto";

function stripCodeFence(text: string) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function asRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function normalizeAttackScenario(value: unknown): DeepSecurityAttackScenario | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const title = asString(record.title);
  const attackerGoal = asString(record.attackerGoal);
  const attackPath = asString(record.attackPath);
  const impact = asString(record.impact);
  const recommendedDefense = asString(record.recommendedDefense);

  if (
    !title &&
    !attackerGoal &&
    !attackPath &&
    !impact &&
    !recommendedDefense
  ) {
    return null;
  }

  return {
    title,
    attackerGoal,
    attackPath,
    impact,
    recommendedDefense,
  };
}

function normalizeStackAssumption(
  value: unknown
): DeepSecurityStackAssumption | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const stack = asString(record.stack);
  const reason = asString(record.reason);

  if (!stack && !reason) {
    return null;
  }

  return {
    stack,
    reason,
  };
}

function normalizeStackGuide(value: unknown): DeepSecurityStackGuide | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const stack = asString(record.stack);
  const concreteActions = asStringArray(record.concreteActions);
  const commonMistakes = asStringArray(record.commonMistakes);

  if (!stack && concreteActions.length === 0 && commonMistakes.length === 0) {
    return null;
  }

  return {
    stack,
    concreteActions,
    commonMistakes,
  };
}

function normalizeControlBlueprint(
  value: unknown
): DeepSecurityControlBlueprint | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const title = asString(record.title);
  const objective = asString(record.objective);
  const implementationNotes = asStringArray(record.implementationNotes);
  const failureModes = asStringArray(record.failureModes);
  const validationSteps = asStringArray(record.validationSteps);

  if (
    !title &&
    !objective &&
    implementationNotes.length === 0 &&
    failureModes.length === 0 &&
    validationSteps.length === 0
  ) {
    return null;
  }

  return {
    title,
    objective,
    implementationNotes,
    failureModes,
    validationSteps,
  };
}

function normalizeExecutionTicket(
  value: unknown
): DeepSecurityExecutionTicket | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const id = asString(record.id);
  const owner = asString(record.owner) as DeepSecurityExecutionTicket["owner"];
  const priority = asString(
    record.priority
  ) as DeepSecurityExecutionTicket["priority"];
  const title = asString(record.title);
  const rationale = asString(record.rationale);
  const tasks = asStringArray(record.tasks);
  const acceptanceCriteria = asStringArray(record.acceptanceCriteria);
  const references = asStringArray(record.references);

  if (
    !["frontend", "backend", "qa", "ops"].includes(owner) ||
    !["P0", "P1", "P2"].includes(priority)
  ) {
    return null;
  }

  if (
    !id &&
    !title &&
    !rationale &&
    tasks.length === 0 &&
    acceptanceCriteria.length === 0 &&
    references.length === 0
  ) {
    return null;
  }

  return {
    id: id || `${owner}-${title}`,
    owner,
    priority,
    title,
    rationale,
    tasks,
    acceptanceCriteria,
    references,
  };
}

function getToolStackContext(selectedTool: ToolId) {
  switch (selectedTool) {
    case "lovable":
      return [
        "주요 가정: React 또는 Next.js 프론트엔드, Supabase/Firebase 같은 BaaS, Stripe/토스페이먼츠 같은 외부 결제 연동",
        "보안 초점: RLS 누락, 클라이언트에서 직접 DB 호출, 서비스 키 노출, 관리자 화면 우회 접근, 웹훅 검증 누락",
      ];
    case "v0":
      return [
        "주요 가정: Next.js App Router, Vercel 배포, Route Handler 또는 Server Action, Postgres/Supabase, Stripe 같은 SaaS 연동",
        "보안 초점: Server Action 권한 검증 누락, hidden input 신뢰, API 응답 캐시와 권한 섞임, 환경 변수 경계 실수",
      ];
    case "replit":
      return [
        "주요 가정: Node.js/Express 또는 Next.js, Replit 호스팅/DB, 외부 파일 업로드와 간단한 세션 기반 인증",
        "보안 초점: 서버/클라이언트 비밀 분리 실패, 임시 파일 처리, 관리자 라우트 노출, rate limit 미구현",
      ];
    case "cursor":
      return [
        "주요 가정: 기존 코드베이스 위에서 Next.js, Express, NestJS, Django, Spring Boot 같은 프레임워크 중 하나를 수정",
        "보안 초점: 기존 권한 모델과 신규 기능 충돌, middleware 누락, ORM mass assignment, 외부 문서 기반 prompt injection",
      ];
    case "claude-code":
      return [
        "주요 가정: 기존 애플리케이션 코드베이스를 빠르게 확장하며, CLI/에이전트가 문서/코드/터미널을 함께 참조",
        "보안 초점: destructive command 승인 경계, 외부 문맥 오염, 권한 우회 코드 제안, 테스트 미비 상태의 자동 수정",
      ];
    default:
      return [
        "주요 가정: 현대적인 웹 앱 스택과 외부 SaaS 연동을 조합해 빠르게 MVP를 만드는 상황",
        "보안 초점: 권한 검증, 데이터 소유권, 외부 신뢰 경계, AI 도구의 자동 생성 코드 검토 누락",
      ];
  }
}

export function buildDeepSecurityReportPrompt(
  idea: string,
  selectedTool: ToolId,
  selectedTechStacks: TechStackId[],
  detailedAnswers: DetailedBriefAnswers,
  result: AmugotoResult
) {
  const tool = getToolConfig(selectedTool);
  const formattedDetails = formatDetailedBriefAnswers(detailedAnswers);
  const formattedTechStacks = formatSelectedTechStacks(selectedTechStacks);
  const currentResult = JSON.stringify(result, null, 2);
  const stackContext = getToolStackContext(selectedTool)
    .map((item) => `- ${item}`)
    .join("\n");

  return `
너는 AMUGOTO의 심층 보안 설계 분석 엔진이다.

목표:
- 이미 생성된 AMUGOTO 결과를 바탕으로 더 깊은 보안 설계 리포트를 만든다.
- 초보자도 읽을 수 있어야 하지만, 개발자나 기술 검토자에게도 바로 전달 가능한 밀도를 가져야 한다.
- 코드 취약점 스캔이 아니라 설계 단계 보안 리뷰에 집중한다.
- 보안 실수가 실제 구현에서 어떤 기술 스택 문제로 이어지는지까지 구체적으로 드러낸다.

선택한 대상 도구:
- 도구 이름: ${tool.label}
- 도구 분류: ${tool.audienceLabel}
- 프롬프트 스타일: ${tool.promptStyle}

가능성이 높은 구현 스택 가정:
${stackContext}

사용자가 고른 기술 스택:
${formattedTechStacks}

원래 사용자 아이디어:
${idea}

추가 문맥:
${formattedDetails || "- 사용자가 추가 답변을 입력하지 않았습니다."}

기존 AMUGOTO 결과:
${currentResult}

이 리포트에서 특히 봐야 할 것:
- Broken object-level access control
- Broken object property-level authorization
- Broken function-level authorization
- Dangerous default permissions
- Hidden client-controlled fields / mass assignment
- Sensitive business flow abuse
- Resource exhaustion and cost explosion
- External API / webhook trust assumptions
- SSRF from user-supplied URLs or files
- Multi-tenant or branch isolation failure
- AI coding agent prompt injection / unsafe context ingestion

이 리포트는 다음 고신뢰 기준을 반영해야 한다:
- OWASP Top 10 2021의 Broken Access Control, Insecure Design
- OWASP API Security Top 10 2023의 BOLA, Broken Function Level Authorization, Broken Object Property Level Authorization, Sensitive Business Flows, Resource Consumption, SSRF, Unsafe Consumption of APIs
- OWASP Mass Assignment Cheat Sheet
- OWASP SSRF Prevention Cheat Sheet
- NIST SP 800-218 SSDF
- Claude Code 보안 문서의 prompt injection / permission boundary 권고

구체화 원칙:
- 사용자가 스택을 명시하지 않았으면 "가정한 스택"을 먼저 적고, 가정 이유를 설명한다.
- 사용자가 고른 기술 스택이 있으면 그것을 우선 기준으로 삼고, 필요한 보조 가정만 추가한다.
- 해결책은 반드시 서버 기준 enforcement point를 포함한다.
- 가능하면 Next.js / React / Route Handler / Server Action / Supabase / Postgres / Prisma / Express / NestJS / Django / Spring Boot / Stripe / 토스페이먼츠 / S3류 업로드 흐름 중 무엇에 해당하는지 짚는다.
- "프론트에서 숨기기" 같은 표현은 금지한다. 서버 검증, 정책, 미들웨어, 쿼리 조건, 서명 검증, allowlist, rate limit, idempotency, audit log처럼 구현 가능한 통제로 적는다.
- 개발자가 자주 하는 실수와 바로 적용할 수정 포인트를 분리해서 적는다.
- executionTickets는 실제 이슈 트래커에 옮길 수 있게 ticket 단위로 구체적으로 적는다.
- executionTickets는 Jira나 GitHub Issue에 바로 옮길 수 있게 한 티켓당 하나의 명확한 목표만 담당하도록 적는다.
- executionTickets의 title은 "추가", "분리", "강제", "검증", "차단", "제한"처럼 바로 행동이 보이는 동사형 표현으로 시작한다.
- executionTickets의 tasks는 3개 이상, acceptanceCriteria는 2개 이상, references는 1개 이상 넣는다.
- executionTickets는 프레임워크를 과도하게 단정하지 말되, 선택된 기술 스택이 있으면 그 스택의 구현 경계(예: Route Handler, Server Action, controller, service, middleware, policy, webhook handler, upload endpoint)를 명시한다.

출력 원칙:
- 한국어로 쓴다.
- 과장하지 말고, 실제로 일어날 수 있는 공격 시나리오를 구체적으로 쓴다.
- 설명은 이해 가능해야 하지만, 개발자가 바로 액션할 수 있는 수준이어야 한다.
- releaseBlockers는 정말 출시를 멈춰야 하는 항목만 3개 이상 쓴다.
- criticalFindings는 6개 이상 쓴다.
- attackScenarios는 최소 4개를 만든다.
- stackSpecificGuidance는 최소 2개 이상의 스택/프레임워크 관점으로 쓴다.
- controlBlueprints는 최소 4개를 만든다.
- executionTickets는 최소 6개를 만들고, frontend / backend / qa / ops가 최소 1개씩은 포함되게 한다.
- verificationChecklist는 출시 전 개발자/QA가 직접 점검할 수 있게 최소 10개를 쓴다.
- requiredControls는 최소 8개를 쓴다.
- researchAnchors에는 이 리포트가 어떤 공식 기준을 반영했는지 짧은 한국어 문장으로 적는다.
- JSON만 출력한다.
- markdown code fence를 절대 쓰지 않는다.

JSON schema:
{
  "overallAssessment": "한 줄 평가",
  "executiveSummary": "왜 이 앱에서 심층 보안 검토가 필요한지 요약",
  "stackAssumptions": [
    {
      "stack": "가정한 기술 스택 이름",
      "reason": "왜 이 스택을 가정했는지"
    }
  ],
  "releaseBlockers": ["지금 상태로 출시하면 안 되는 차단 사유"],
  "criticalFindings": ["가장 중요한 설계 취약점"],
  "trustBoundaries": ["클라이언트, 서버, 관리자, 외부 API 등 신뢰 경계 설명"],
  "roleBoundaryWarnings": ["권한 분리와 역할 경계 관련 경고"],
  "dangerousClientFields": ["클라이언트가 절대 제어하면 안 되는 필드"],
  "abuseCases": ["남용 가능한 흐름과 그 이유"],
  "stackSpecificGuidance": [
    {
      "stack": "예: Next.js + Supabase",
      "concreteActions": ["서버/정책 수준에서 해야 할 구체 조치"],
      "commonMistakes": ["개발자가 자주 하는 실수"]
    }
  ],
  "controlBlueprints": [
    {
      "title": "통제 장치 이름",
      "objective": "무엇을 막기 위한 통제인지",
      "implementationNotes": ["구체 구현 포인트"],
      "failureModes": ["빠뜨리면 생기는 문제"],
      "validationSteps": ["개발자/QA가 확인하는 방법"]
    }
  ],
  "executionTickets": [
    {
      "id": "ticket-1",
      "owner": "frontend | backend | qa | ops",
      "priority": "P0 | P1 | P2",
      "title": "실행 티켓 제목",
      "rationale": "왜 이 티켓이 필요한지",
      "tasks": ["실제로 해야 할 작업"],
      "acceptanceCriteria": ["완료 조건"],
      "references": ["연결된 핵심 설계 취약점 또는 통제 기준"]
    }
  ],
  "attackScenarios": [
    {
      "title": "공격 시나리오 제목",
      "attackerGoal": "공격자가 원하는 것",
      "attackPath": "어떻게 시도하는지",
      "impact": "성공하면 무슨 문제가 생기는지",
      "recommendedDefense": "막기 위한 추천 방어책"
    }
  ],
  "requiredControls": ["출시 전 반드시 넣어야 할 통제 장치"],
  "verificationChecklist": ["개발자와 QA가 점검할 항목"],
  "agentWarnings": ["${tool.label} 같은 AI 도구를 쓸 때 주의할 점"],
  "researchAnchors": ["이 리포트가 반영한 공식 기준 요약"]
}
`.trim();
}

export function parseDeepSecurityReport(rawText: string): DeepSecurityReport {
  const cleaned = stripCodeFence(rawText);
  const parsed = JSON.parse(cleaned) as unknown;
  const record = asRecord(parsed);

  if (!record) {
    throw new Error("Security report response was not a JSON object.");
  }

  return {
    overallAssessment: asString(record.overallAssessment),
    executiveSummary: asString(record.executiveSummary),
    stackAssumptions: Array.isArray(record.stackAssumptions)
      ? record.stackAssumptions
          .map(normalizeStackAssumption)
          .filter((item): item is DeepSecurityStackAssumption => item !== null)
      : [],
    releaseBlockers: asStringArray(record.releaseBlockers),
    criticalFindings: asStringArray(record.criticalFindings),
    trustBoundaries: asStringArray(record.trustBoundaries),
    roleBoundaryWarnings: asStringArray(record.roleBoundaryWarnings),
    dangerousClientFields: asStringArray(record.dangerousClientFields),
    abuseCases: asStringArray(record.abuseCases),
    stackSpecificGuidance: Array.isArray(record.stackSpecificGuidance)
      ? record.stackSpecificGuidance
          .map(normalizeStackGuide)
          .filter((item): item is DeepSecurityStackGuide => item !== null)
      : [],
    controlBlueprints: Array.isArray(record.controlBlueprints)
      ? record.controlBlueprints
          .map(normalizeControlBlueprint)
          .filter((item): item is DeepSecurityControlBlueprint => item !== null)
      : [],
    executionTickets: Array.isArray(record.executionTickets)
      ? record.executionTickets
          .map(normalizeExecutionTicket)
          .filter((item): item is DeepSecurityExecutionTicket => item !== null)
      : [],
    attackScenarios: Array.isArray(record.attackScenarios)
      ? record.attackScenarios
          .map(normalizeAttackScenario)
          .filter((item): item is DeepSecurityAttackScenario => item !== null)
      : [],
    requiredControls: asStringArray(record.requiredControls),
    verificationChecklist: asStringArray(record.verificationChecklist),
    agentWarnings: asStringArray(record.agentWarnings),
    researchAnchors: asStringArray(record.researchAnchors),
  };
}

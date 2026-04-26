import type { DeepSecurityReport } from "@/types/amugoto";

export type RoleGuidanceSection = {
  id: string;
  title: string;
  subtitle: string;
  badgeTone: string;
  checks: string[];
};

export type RoleActionPacket = {
  id: string;
  title: string;
  subtitle: string;
  badgeTone: string;
  roleLabel: string;
  highlights: string[];
};

export const COMMON_ROLE_PRINCIPLES = [
  "클라이언트에서 숨기는 것만으로는 권한 통제가 되지 않습니다. 중요한 검증은 항상 서버에서 다시 해야 합니다.",
  "role, ownerId, status, price, tenantId 같은 필드는 클라이언트 입력을 그대로 믿지 말고 서버가 소유해야 합니다.",
  "외부 결제사, 웹훅, 업로드 URL, AI 도구가 가져온 문맥은 모두 신뢰 경계를 넘어오는 입력으로 취급해야 합니다.",
  "예약, 결제, 쿠폰, 승인 같은 흐름은 단순 기능이 아니라 남용과 비용 폭탄까지 고려해 설계해야 합니다.",
];

export const ROLE_GUIDANCE_SECTIONS: RoleGuidanceSection[] = [
  {
    id: "frontend",
    title: "프론트엔드",
    subtitle: "UI와 상태관리에서 보안이 새지 않게 막아야 하는 포인트",
    badgeTone:
      "border-sky-400/30 bg-sky-400/10 text-sky-200",
    checks: [
      "관리자 메뉴를 숨기는 것만으로 접근 통제가 된다고 생각하지 말고, 버튼이 사라져도 서버에서 다시 역할 검증이 있는지 확인합니다.",
      "hidden input, query string, local state에 role, ownerId, price, status 같은 민감 필드를 넣고 그대로 보내지 않습니다.",
      "서비스 키, 관리자 키, 내부 API base URL을 클라이언트 번들에 넣지 않습니다.",
      "파일 업로드나 URL 입력 기능이 있으면 어떤 파일 형식과 어떤 도메인 URL만 허용할지 백엔드와 같이 정합니다.",
      "에러 메시지에 관리자 경로, 내부 테이블 이름, 권한 구조가 과하게 노출되지 않는지 확인합니다.",
      "토큰, 세션, 임시 권한 값이 브라우저 저장소에 오래 남아 다른 사용자 세션과 섞이지 않는지 점검합니다.",
    ],
  },
  {
    id: "backend",
    title: "백엔드",
    subtitle: "실제 권한, 데이터 소유권, 외부 연동 신뢰를 지키는 핵심 지점",
    badgeTone:
      "border-violet-400/30 bg-violet-400/10 text-violet-200",
    checks: [
      "모든 조회와 수정 요청에서 현재 사용자와 대상 리소스의 소유권을 함께 확인해 BOLA/IDOR를 막습니다.",
      "관리자 전용 기능은 라우트 단위뿐 아니라 서비스 레이어에서도 다시 권한을 검증합니다.",
      "role, tenantId, ownerId, price, discount, status 같은 필드는 클라이언트 값을 무시하고 서버에서 재계산하거나 주입합니다.",
      "결제, 예약, 쿠폰, 승인 흐름에는 rate limit, idempotency key, 재시도 제한, 감사 로그를 붙입니다.",
      "웹훅은 서명 검증, timestamp 검증, event replay 방어 없이 처리하지 않습니다.",
      "사용자가 준 URL을 서버가 직접 읽어야 한다면 allowlist, redirect 차단, 내부 IP 차단 같은 SSRF 방어를 둡니다.",
      "멀티테넌트 구조면 모든 쿼리에 tenant 조건이 자동으로 붙도록 정책이나 repository 규칙을 강제합니다.",
    ],
  },
  {
    id: "qa",
    title: "QA",
    subtitle: "정상 시나리오가 아니라 깨뜨리는 시나리오로 확인해야 하는 항목",
    badgeTone:
      "border-amber-400/30 bg-amber-400/10 text-amber-200",
    checks: [
      "다른 사람 예약 ID, 주문 ID, 문의 ID를 넣었을 때 데이터가 보이거나 수정되지 않는지 확인합니다.",
      "일반 사용자 계정으로 관리자 API를 직접 호출하거나 HTTP 메서드를 바꿔도 차단되는지 테스트합니다.",
      "프론트 요청 본문에서 role, ownerId, status, price를 수동으로 바꿔 보내도 서버가 무시하는지 확인합니다.",
      "결제 버튼, 예약 버튼, 쿠폰 적용 버튼을 연속 클릭했을 때 중복 처리나 비용 폭탄이 생기지 않는지 확인합니다.",
      "웹훅 payload를 일부 조작하거나 중복 전송했을 때 정상적으로 거부되는지 확인합니다.",
      "파일 업로드와 URL 입력 기능에 내부망 주소, 잘못된 확장자, 과대용량 파일을 넣어도 안전한지 봅니다.",
    ],
  },
  {
    id: "ops",
    title: "운영 / 배포",
    subtitle: "배포 이후 사고를 줄이는 환경, 권한, 로그 운영 포인트",
    badgeTone:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    checks: [
      "운영과 테스트 환경의 API 키, DB, 스토리지, 웹훅 엔드포인트가 분리되어 있는지 확인합니다.",
      "비밀값은 환경 변수나 시크릿 매니저로 관리하고, 로그나 클라이언트 응답에 노출되지 않게 합니다.",
      "관리자 계정, 배포 계정, 데이터베이스 계정은 최소 권한으로 나누고 공용 계정을 피합니다.",
      "에러 로그와 감사 로그에서 카드정보, 주민번호, 상세 건강정보 같은 민감정보를 마스킹합니다.",
      "웹훅 실패, 관리자 대량 조회, 로그인 실패, 비용 급증 같은 이상 징후를 볼 수 있는 모니터링을 둡니다.",
      "새 기능 배포 전에는 롤백 경로와 장애 대응 담당자를 정해두고, 급할 때 관리자 권한을 임시로 넓히지 않도록 운영 절차를 정합니다.",
    ],
  },
];

function pick(items: string[], count: number) {
  return items.filter(Boolean).slice(0, count);
}

function asRoleHighlights(
  roleId: RoleGuidanceSection["id"],
  report: DeepSecurityReport,
  baselineChecks: string[]
) {
  if (roleId === "frontend") {
    return [
      ...pick(
        report.dangerousClientFields.map(
          (item) => `클라이언트에서 신뢰하지 말아야 할 필드: ${item}`
        ),
        3
      ),
      ...pick(
        report.stackSpecificGuidance.flatMap((item) => item.commonMistakes),
        2
      ),
      ...pick(baselineChecks, 2),
    ].slice(0, 6);
  }

  if (roleId === "backend") {
    return [
      ...pick(report.roleBoundaryWarnings, 2),
      ...pick(report.requiredControls, 2),
      ...pick(
        report.controlBlueprints.flatMap((item) => item.implementationNotes),
        2
      ),
    ].slice(0, 6);
  }

  if (roleId === "qa") {
    return [
      ...pick(report.verificationChecklist, 4),
      ...pick(
        report.attackScenarios.map(
          (item) => `재현해야 할 공격 시나리오: ${item.title}`
        ),
        2
      ),
    ].slice(0, 6);
  }

  return [
    ...pick(report.releaseBlockers, 2),
    ...pick(
      report.controlBlueprints.flatMap((item) => item.failureModes),
      2
    ),
    ...pick(baselineChecks, 2),
  ].slice(0, 6);
}

export function buildRoleActionPackets(report: DeepSecurityReport): RoleActionPacket[] {
  return ROLE_GUIDANCE_SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    subtitle: section.subtitle,
    badgeTone: section.badgeTone,
    roleLabel: `${section.title}용 실행 요약`,
    highlights: asRoleHighlights(section.id, report, section.checks),
  }));
}

export function buildRoleActionCopyText(
  packet: RoleActionPacket,
  report: DeepSecurityReport
) {
  const lines = [
    `[${packet.roleLabel}]`,
    "",
    `심층 평가: ${report.overallAssessment}`,
    `요약: ${report.executiveSummary}`,
    "",
    "이번 리포트 기준 우선 확인 항목:",
    ...packet.highlights.map((item) => `- ${item}`),
    "",
    `자세한 역할별 주의사항: /roles#${packet.id}`,
  ];

  return lines.join("\n");
}

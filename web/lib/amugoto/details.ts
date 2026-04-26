import type { DetailedBriefAnswers } from "@/types/amugoto";

export const EMPTY_DETAILED_BRIEF_ANSWERS: DetailedBriefAnswers = {
  businessType: "",
  targetUsers: "",
  coreAction: "",
  adminNeeds: "",
  requiredData: "",
  mustHaveFeatures: "",
  blockedData: "",
  protectedRecords: "",
  adminOnlyActions: "",
  forbiddenClientFields: "",
  abuseProneFlows: "",
  externalIntegrations: "",
  serverFetchedUrls: "",
  tenantIsolationNeeds: "",
  agentContextSources: "",
};

export const DETAIL_QUESTION_CONFIG: {
  key: keyof DetailedBriefAnswers;
  section: "basic" | "security";
  label: string;
  helper: string;
  placeholder: string;
}[] = [
  {
    key: "businessType",
    section: "basic",
    label: "어떤 업종/상황의 앱인가요?",
    helper: "예: 피부관리샵, PT샵, 상담 예약, 클래스 운영",
    placeholder: "예: 피부관리샵 예약 운영",
  },
  {
    key: "targetUsers",
    section: "basic",
    label: "이 앱의 주요 사용자는 누구인가요?",
    helper: "예: 일반 고객, 사장님, 예약 담당자, 관리자",
    placeholder: "예: 일반 고객과 사장님",
  },
  {
    key: "coreAction",
    section: "basic",
    label: "사용자가 가장 먼저 하게 될 핵심 행동은 무엇인가요?",
    helper: "이 앱의 가장 중요한 첫 행동을 적어주세요.",
    placeholder: "예: 예약 시간 선택 후 예약 신청하기",
  },
  {
    key: "adminNeeds",
    section: "basic",
    label: "관리자나 운영자는 무엇을 해야 하나요?",
    helper: "예: 예약 확인, 일정 변경, 문의 답변, 결제 확인",
    placeholder: "예: 예약 확인, 예약 승인, 일정 변경",
  },
  {
    key: "requiredData",
    section: "basic",
    label: "반드시 받아야 하는 정보는 무엇인가요?",
    helper: "필수 데이터만 적는 것이 좋습니다.",
    placeholder: "예: 이름, 연락처, 예약 날짜, 서비스 종류",
  },
  {
    key: "mustHaveFeatures",
    section: "basic",
    label: "첫 버전에 꼭 필요한 기능 3가지는 무엇인가요?",
    helper: "콤마나 줄바꿈으로 구분해서 적어도 됩니다.",
    placeholder: "예: 예약 신청, 관리자 확인, 예약 상태 변경",
  },
  {
    key: "blockedData",
    section: "basic",
    label: "절대 받거나 저장하면 안 되는 정보가 있나요?",
    helper: "없다면 비워두셔도 됩니다.",
    placeholder: "예: 카드번호, 주민등록번호, 건강 상태 상세 정보",
  },
  {
    key: "protectedRecords",
    section: "security",
    label: "다른 사람이 보면 안 되는 기록이나 데이터는 무엇인가요?",
    helper: "객체 단위 권한 누락을 잡는 데 중요합니다.",
    placeholder: "예: 다른 고객의 예약 내역, 결제 상태, 상담 내용",
  },
  {
    key: "adminOnlyActions",
    section: "security",
    label: "관리자만 할 수 있어야 하는 행동은 무엇인가요?",
    helper: "예: 승인, 삭제, 가격 변경, 고객 상태 변경",
    placeholder: "예: 예약 승인, 환불 처리, 회원 등급 변경",
  },
  {
    key: "forbiddenClientFields",
    section: "security",
    label: "클라이언트가 보내면 안 되는 필드는 무엇인가요?",
    helper: "예: role, ownerId, price, status 같은 숨은 필드",
    placeholder: "예: role, price, ownerId, approvalStatus",
  },
  {
    key: "abuseProneFlows",
    section: "security",
    label: "반복 호출되면 돈이나 재고, 예약 슬롯이 소모되는 기능이 있나요?",
    helper: "비즈니스 로직 남용과 비용 폭탄을 잡는 질문입니다.",
    placeholder: "예: 예약 슬롯 선점, 쿠폰 발급, 문자 인증, AI 분석 반복 호출",
  },
  {
    key: "externalIntegrations",
    section: "security",
    label: "결제, 문자, 이메일, 지도, 웹훅 같은 외부 연동이 있나요?",
    helper: "외부 API 응답과 웹훅을 어디까지 믿을지 정리하는 데 필요합니다.",
    placeholder: "예: 토스페이먼츠, 문자 인증, 카카오 알림톡, 웹훅 연동",
  },
  {
    key: "serverFetchedUrls",
    section: "security",
    label: "서버가 사용자가 입력한 URL이나 파일을 직접 읽어오는 흐름이 있나요?",
    helper: "없다면 비워두셔도 됩니다. SSRF성 흐름 점검에 필요합니다.",
    placeholder: "예: 사용자가 넣은 이미지 URL 미리보기, 외부 링크 정보 가져오기",
  },
  {
    key: "tenantIsolationNeeds",
    section: "security",
    label: "지점, 업체, 상담사, 테넌트 간 데이터 분리가 필요한가요?",
    helper: "멀티테넌트 분리 실패를 막는 질문입니다.",
    placeholder: "예: 지점별 예약은 서로 보이면 안 됨, 상담사별 고객 목록 분리 필요",
  },
  {
    key: "agentContextSources",
    section: "security",
    label: "AI 코딩 툴이 외부 문서, 링크, repo를 참고하게 할 계획이 있나요?",
    helper: "에이전트형 툴의 프롬프트 인젝션 리스크를 줄이기 위한 질문입니다.",
    placeholder: "예: 외부 문서 링크, 기존 repo README, 고객이 준 명세 파일을 참고할 예정",
  },
];

export const DETAIL_SECTION_COPY = {
  basic: {
    title: "기본 정보",
    description: "서비스 맥락과 MVP 범위를 잡기 위한 질문입니다.",
  },
  security: {
    title: "숨은 설계 리스크 질문",
    description:
      "개발자도 놓치기 쉬운 권한, 데이터, 외부 연동, 에이전트 리스크를 미리 묻습니다.",
  },
};

export function formatDetailedBriefAnswers(answers: DetailedBriefAnswers) {
  const sections = DETAIL_QUESTION_CONFIG.map((question) => {
    const value = answers[question.key].trim();

    if (!value) {
      return null;
    }

    return `- ${question.label}: ${value}`;
  }).filter(Boolean);

  return sections.join("\n");
}

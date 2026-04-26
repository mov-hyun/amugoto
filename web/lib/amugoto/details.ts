import type { DetailedBriefAnswers } from "@/types/amugoto";

export const EMPTY_DETAILED_BRIEF_ANSWERS: DetailedBriefAnswers = {
  businessType: "",
  targetUsers: "",
  coreAction: "",
  adminNeeds: "",
  requiredData: "",
  mustHaveFeatures: "",
  blockedData: "",
};

export const DETAIL_QUESTION_CONFIG: {
  key: keyof DetailedBriefAnswers;
  label: string;
  helper: string;
  placeholder: string;
}[] = [
  {
    key: "businessType",
    label: "어떤 업종/상황의 앱인가요?",
    helper: "예: 피부관리샵, PT샵, 상담 예약, 클래스 운영",
    placeholder: "예: 피부관리샵 예약 운영",
  },
  {
    key: "targetUsers",
    label: "이 앱의 주요 사용자는 누구인가요?",
    helper: "예: 일반 고객, 사장님, 예약 담당자, 관리자",
    placeholder: "예: 일반 고객과 사장님",
  },
  {
    key: "coreAction",
    label: "사용자가 가장 먼저 하게 될 핵심 행동은 무엇인가요?",
    helper: "이 앱의 가장 중요한 첫 행동을 적어주세요.",
    placeholder: "예: 예약 시간 선택 후 예약 신청하기",
  },
  {
    key: "adminNeeds",
    label: "관리자나 운영자는 무엇을 해야 하나요?",
    helper: "예: 예약 확인, 일정 변경, 문의 답변, 결제 확인",
    placeholder: "예: 예약 확인, 예약 승인, 일정 변경",
  },
  {
    key: "requiredData",
    label: "반드시 받아야 하는 정보는 무엇인가요?",
    helper: "필수 데이터만 적는 것이 좋습니다.",
    placeholder: "예: 이름, 연락처, 예약 날짜, 서비스 종류",
  },
  {
    key: "mustHaveFeatures",
    label: "첫 버전에 꼭 필요한 기능 3가지는 무엇인가요?",
    helper: "콤마나 줄바꿈으로 구분해서 적어도 됩니다.",
    placeholder: "예: 예약 신청, 관리자 확인, 예약 상태 변경",
  },
  {
    key: "blockedData",
    label: "절대 받거나 저장하면 안 되는 정보가 있나요?",
    helper: "없다면 비워두셔도 됩니다.",
    placeholder: "예: 카드번호, 주민등록번호, 건강 상태 상세 정보",
  },
];

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

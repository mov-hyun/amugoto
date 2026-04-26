import type { ToolId } from "@/lib/amugoto/tools";
import type { DetailedBriefAnswers } from "@/types/amugoto";

export type IndustryExample = {
  id: string;
  category: string;
  title: string;
  summary: string;
  whyItMatters: string;
  tool: ToolId;
  idea: string;
  detailedAnswers: DetailedBriefAnswers;
};

export const INDUSTRY_EXAMPLES: IndustryExample[] = [
  {
    id: "skin-care-booking",
    category: "뷰티/예약",
    title: "피부관리샵 예약 및 결제 접수",
    summary:
      "고객이 시술 종류와 시간을 고르고 예약을 신청할 수 있는 피부관리샵용 웹앱 예시입니다.",
    whyItMatters:
      "예약과 결제가 같이 들어오면 개인정보와 결제 정보가 섞이기 쉬워서 AMUGOTO의 가치가 잘 드러납니다.",
    tool: "v0",
    idea:
      "고객들이 피부관리 시술을 예약하고 결제도 할 수 있는 웹앱을 만들고 싶어요. 사장님은 관리자 화면에서 예약자 이름, 연락처, 결제 상태를 보고 예약을 확정하고 싶고, 카드번호도 직접 저장해서 다음 결제 때 다시 쓰고 싶어요.",
    detailedAnswers: {
      businessType: "피부관리샵 예약 운영",
      targetUsers: "일반 고객, 사장님, 예약 담당자",
      coreAction: "고객이 시술 종류와 날짜를 고른 뒤 예약을 신청하기",
      adminNeeds: "예약 확인, 예약 승인, 일정 변경, 결제 상태 확인",
      requiredData: "이름, 연락처, 예약 날짜, 시술 종류",
      mustHaveFeatures: "예약 신청, 예약 상태 확인, 관리자 예약 관리",
      blockedData: "카드번호 직접 저장, 주민등록번호",
      protectedRecords: "다른 고객의 예약 내역, 결제 상태, 연락처",
      adminOnlyActions: "예약 승인, 예약 취소, 결제 상태 변경",
      forbiddenClientFields: "price, paymentStatus, ownerId, isAdmin",
      abuseProneFlows: "예약 슬롯 선점, 결제 재시도, 문자 인증 반복 호출",
      externalIntegrations: "결제사 연동, 문자 알림, 알림톡",
      serverFetchedUrls: "없음",
      tenantIsolationNeeds: "직원별 담당 고객 목록은 분리 필요",
      agentContextSources: "샘플 화면 레퍼런스 링크 정도만 참고 예정",
    },
  },
  {
    id: "pt-membership",
    category: "운동/PT",
    title: "PT 수업 예약과 회원 관리",
    summary:
      "회원이 수업 시간을 예약하고 트레이너가 일정과 출석을 관리하는 PT 스튜디오용 예시입니다.",
    whyItMatters:
      "회원 정보, 수업 일정, 운영자 권한이 동시에 얽혀 있어서 안전한 MVP 범위 설정을 보여주기 좋습니다.",
    tool: "lovable",
    idea:
      "PT샵 회원들이 휴대폰으로 수업 예약을 하고 남은 횟수도 볼 수 있는 앱을 만들고 싶어요. 트레이너는 관리자 페이지에서 모든 회원 정보와 수업 이력을 보고 직접 수정하고 싶어요.",
    detailedAnswers: {
      businessType: "PT샵 회원 및 예약 운영",
      targetUsers: "회원, 트레이너, 운영 관리자",
      coreAction: "회원이 수업 시간을 고르고 예약 신청하기",
      adminNeeds: "회원 예약 확인, 일정 변경, 출석 처리, 남은 횟수 관리",
      requiredData: "이름, 연락처, 예약 날짜, 수업 종류, 남은 이용 횟수",
      mustHaveFeatures: "수업 예약, 예약 변경, 관리자 일정 관리",
      blockedData: "건강 상태 상세 정보, 민감한 신체 정보",
      protectedRecords: "다른 회원의 이용 이력, 연락처, 남은 횟수",
      adminOnlyActions: "남은 횟수 조정, 출석 처리, 회원 상태 변경",
      forbiddenClientFields: "remainingSessions, role, trainerId, membershipStatus",
      abuseProneFlows: "동시 예약 반복, 체험권 중복 사용, 알림 재전송",
      externalIntegrations: "문자 알림, 캘린더 연동",
      serverFetchedUrls: "없음",
      tenantIsolationNeeds: "트레이너별 회원 메모와 일정은 분리 필요",
      agentContextSources: "기존 운영 시트 구조를 참고할 수 있음",
    },
  },
  {
    id: "counseling-intake",
    category: "상담/문의",
    title: "상담 신청과 운영자 배정",
    summary:
      "고객이 상담을 신청하고 운영자가 상담사를 배정하는 흐름을 보여주는 예시입니다.",
    whyItMatters:
      "상담 분야는 민감한 정보가 섞일 수 있어서 어떤 정보를 받지 말아야 하는지 보여주기 좋습니다.",
    tool: "replit-agent",
    idea:
      "고객이 익명으로 고민을 남기고 상담을 신청할 수 있는 웹서비스를 만들고 싶어요. 운영자는 모든 상담 내용을 한 화면에서 보고 상담사를 배정하고 싶고, 고객 연락처와 메모를 오래 보관하고 싶어요.",
    detailedAnswers: {
      businessType: "상담 신청 및 상담사 배정 운영",
      targetUsers: "상담 신청 고객, 운영 관리자, 상담사",
      coreAction: "고객이 상담 유형을 선택하고 상담 신청하기",
      adminNeeds: "상담 접수 확인, 상담사 배정, 진행 상태 변경",
      requiredData: "이름 또는 닉네임, 연락처, 상담 유형, 희망 시간",
      mustHaveFeatures: "상담 신청, 상담 상태 확인, 관리자 배정 관리",
      blockedData: "과도한 민감 정보, 불필요한 개인 이력 장기 저장",
      protectedRecords: "상담 내용, 배정 메모, 상담사 내부 코멘트",
      adminOnlyActions: "상담사 배정, 상태 변경, 메모 열람",
      forbiddenClientFields: "assignedCounselorId, caseStatus, internalNote",
      abuseProneFlows: "대량 상담 신청, 스팸 문의, 인증 우회",
      externalIntegrations: "문자 알림, 이메일 알림, 웹훅 가능성",
      serverFetchedUrls: "상담 신청자가 링크를 남길 수 있음",
      tenantIsolationNeeds: "상담사별 케이스와 메모 분리 필요",
      agentContextSources: "외부 상담 프로세스 문서를 참고할 수 있음",
    },
  },
  {
    id: "internal-ops-dashboard",
    category: "사내 도구",
    title: "사내 요청 접수와 승인 대시보드",
    summary:
      "사내 운영팀이 요청을 받고 승인 상태를 관리하는 내부 업무 도구 예시입니다.",
    whyItMatters:
      "개발자용 툴을 쓰는 상황에서 권한 분리와 구현 지시가 어떻게 달라지는지 보여주기 좋습니다.",
    tool: "cursor",
    idea:
      "사내 운영팀이 각 부서 요청을 접수하고 승인 상태를 관리하는 내부 대시보드를 만들고 싶어요. 관리자는 모든 요청과 작성자를 볼 수 있어야 하고, 일반 직원은 본인 요청만 보게 하고 싶어요.",
    detailedAnswers: {
      businessType: "사내 운영 요청 접수 및 승인 관리",
      targetUsers: "일반 직원, 운영팀 관리자",
      coreAction: "직원이 요청을 등록하고 상태를 확인하기",
      adminNeeds: "요청 검토, 승인/반려 처리, 상태 변경, 기록 확인",
      requiredData: "이름, 부서, 요청 내용, 요청 날짜, 상태",
      mustHaveFeatures: "요청 등록, 상태 확인, 관리자 승인 처리",
      blockedData: "불필요한 개인정보, 개인 연락처 과다 저장",
      protectedRecords: "다른 부서 요청 내역, 반려 메모, 내부 처리 기록",
      adminOnlyActions: "승인/반려, 우선순위 변경, 상태 강제 변경",
      forbiddenClientFields: "approvalStatus, approverId, priority, ownerDepartment",
      abuseProneFlows: "대량 요청 등록, 승인 API 반복 호출, 로그 조회 과다 호출",
      externalIntegrations: "사내 알림, 이메일, 승인 웹훅 가능성",
      serverFetchedUrls: "요청 본문에 외부 링크가 포함될 수 있음",
      tenantIsolationNeeds: "부서별 요청 데이터 분리 필요",
      agentContextSources: "기존 사내 문서와 repo를 함께 참고할 수 있음",
    },
  },
];

export function getIndustryExampleById(id: string | null) {
  if (!id) {
    return null;
  }

  return INDUSTRY_EXAMPLES.find((example) => example.id === id) ?? null;
}

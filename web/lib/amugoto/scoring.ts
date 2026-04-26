import type {
  AmugotoResult,
  LaunchReadinessScore,
  ScoreDimension,
} from "@/types/amugoto";

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function containsAny(texts: string[], keywords: string[]) {
  return texts.some((text) => {
    const normalized = text.toLowerCase();
    return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
  });
}

function scoreLabel(score: number) {
  if (score >= 90) {
    return "바로 데모 가능";
  }

  if (score >= 75) {
    return "상당히 준비됨";
  }

  if (score >= 60) {
    return "보완 후 사용 가능";
  }

  return "추가 정리가 필요";
}

function scoreToStars(score: number) {
  if (score >= 90) {
    return 5;
  }

  if (score >= 75) {
    return 4;
  }

  if (score >= 60) {
    return 3;
  }

  if (score >= 45) {
    return 2;
  }

  return 1;
}

function buildDimension(
  key: string,
  label: string,
  score: number,
  maxScore: number,
  reason: string,
  criteria: string[]
): ScoreDimension {
  return {
    key,
    label,
    score: clamp(score, 0, maxScore),
    maxScore,
    reason,
    criteria,
  };
}

export function calculateLaunchReadiness(result: AmugotoResult): LaunchReadinessScore {
  const sourceTexts = [
    result.oneLineSummary,
    result.easyExplanation,
    result.safeAppSummary,
    ...result.allowedData,
    ...result.blockedData,
    ...result.adminAndPermission,
    ...result.mvpFeatures,
    ...result.excludedFeatures,
    ...result.testChecklist,
    ...result.safeAlternatives.flatMap((item) => [item.riskyRequest, item.safeVersion]),
    ...result.detectedRisks.flatMap((risk) => [
      risk.title,
      risk.description,
      risk.saferAlternative,
    ]),
  ].filter(Boolean);

  let privacyScore = 0;
  const privacyAchievements: string[] = [];

  if (result.blockedData.length > 0) {
    privacyScore += 10;
    privacyAchievements.push("받지 말아야 할 정보가 정리됨");
  }

  if (result.allowedData.length > 0) {
    privacyScore += 8;
    privacyAchievements.push("받아도 되는 정보 범위가 정리됨");
  }

  if (
    containsAny(sourceTexts, [
      "개인정보",
      "민감",
      "최소 수집",
      "privacy",
      "sensitive",
    ])
  ) {
    privacyScore += 7;
    privacyAchievements.push("최소 수집 원칙이 드러남");
  }

  let paymentScore = 0;
  const paymentAchievements: string[] = [];

  if (
    containsAny(sourceTexts, [
      "외부 결제",
      "결제 링크",
      "pg",
      "payment link",
      "계좌이체",
    ])
  ) {
    paymentScore += 10;
    paymentAchievements.push("직접 결제 대신 안전한 처리 방식이 제시됨");
  }

  if (
    containsAny(sourceTexts, [
      "저장하지 않",
      "직접 저장하지",
      "카드번호는 저장하지",
    ])
  ) {
    paymentScore += 6;
    paymentAchievements.push("카드·결제정보 직접 저장 회피가 명시됨");
  }

  if (containsAny(sourceTexts, ["카드", "결제", "payment", "card"])) {
    paymentScore += 4;
    paymentAchievements.push("결제 리스크 자체는 인지하고 있음");
  }

  let permissionScore = 0;
  const permissionAchievements: string[] = [];

  if (result.adminAndPermission.length >= 2) {
    permissionScore += 10;
    permissionAchievements.push("관리자 권한 조건이 구체적으로 정리됨");
  } else if (result.adminAndPermission.length > 0) {
    permissionScore += 6;
    permissionAchievements.push("관리자 권한 조건이 일부 정리됨");
  }

  if (
    containsAny(sourceTexts, ["로그인", "인증", "인가", "admin", "auth"])
  ) {
    permissionScore += 6;
    permissionAchievements.push("인증 또는 로그인 개념이 포함됨");
  }

  if (
    containsAny(sourceTexts, ["접근 제한", "권한", "관리자만", "비관리자"])
  ) {
    permissionScore += 4;
    permissionAchievements.push("접근 제한 규칙이 드러남");
  }

  let scopeScore = 0;
  const scopeAchievements: string[] = [];

  if (result.excludedFeatures.length > 0) {
    scopeScore += 8;
    scopeAchievements.push("첫 버전에서 제외할 기능이 정리됨");
  }

  if (result.mvpFeatures.length >= 2 && result.mvpFeatures.length <= 6) {
    scopeScore += 8;
    scopeAchievements.push("첫 버전 기능 수가 MVP 범위에 가깝게 정리됨");
  } else if (result.mvpFeatures.length > 0) {
    scopeScore += 4;
    scopeAchievements.push("첫 버전 기능은 있으나 범위 조정 여지가 있음");
  }

  if (containsAny(sourceTexts, ["mvp", "첫 버전", "범위", "scope"])) {
    scopeScore += 4;
    scopeAchievements.push("범위 조절 의도가 명시됨");
  }

  let testingScore = 0;
  const testingAchievements: string[] = [];

  if (result.testChecklist.length >= 4) {
    testingScore += 8;
    testingAchievements.push("테스트 체크리스트가 충분히 있음");
  } else if (result.testChecklist.length > 0) {
    testingScore += 4;
    testingAchievements.push("기본 테스트 체크리스트가 있음");
  }

  if (result.builderPrompts.length >= 2) {
    testingScore += 4;
    testingAchievements.push("실행 단계 프롬프트가 2개 이상 있음");
  } else if (result.builderPrompts.length > 0) {
    testingScore += 2;
    testingAchievements.push("실행 프롬프트가 최소 1개 있음");
  }

  if (containsAny(sourceTexts, ["테스트", "점검", "검증", "checklist"])) {
    testingScore += 3;
    testingAchievements.push("점검 필요성이 명시됨");
  }

  const dimensions = [
    buildDimension(
      "privacy",
      "개인정보 안전성",
      privacyScore,
      25,
      privacyAchievements.length > 0
        ? `${privacyAchievements.join(", ")}.`
        : "개인정보 수집 금지/허용 범위를 더 명확히 적으면 점수를 올릴 수 있습니다.",
      [
        "+10 받지 말아야 할 정보가 정리되어 있는가",
        "+8 받아도 되는 정보 범위가 정리되어 있는가",
        "+7 최소 수집 원칙이 드러나는가",
      ]
    ),
    buildDimension(
      "payments",
      "결제 설계 안정성",
      paymentScore,
      20,
      paymentAchievements.length > 0
        ? `${paymentAchievements.join(", ")}.`
        : "결제는 외부 결제 수단과 비저장 원칙 중심으로 더 명확히 적는 편이 좋습니다.",
      [
        "+10 외부 결제/안전한 결제 처리 방식이 제시되어 있는가",
        "+6 카드·결제정보 직접 저장 금지가 명시되어 있는가",
        "+4 결제 리스크 자체를 인지하고 있는가",
      ]
    ),
    buildDimension(
      "permissions",
      "권한·접근 제어",
      permissionScore,
      20,
      permissionAchievements.length > 0
        ? `${permissionAchievements.join(", ")}.`
        : "관리자 로그인, 접근 제한, 권한 분리를 더 구체적으로 적어야 합니다.",
      [
        "+10 관리자 권한 조건이 구체적으로 정리되어 있는가",
        "+6 로그인/인증 개념이 포함되어 있는가",
        "+4 접근 제한 규칙이 명시되어 있는가",
      ]
    ),
    buildDimension(
      "scope",
      "MVP 범위 선명도",
      scopeScore,
      20,
      scopeAchievements.length > 0
        ? `${scopeAchievements.join(", ")}.`
        : "첫 버전에서 할 것과 하지 않을 것을 더 분명히 나누면 좋습니다.",
      [
        "+8 제외할 기능이 정리되어 있는가",
        "+8 첫 버전 기능 수가 MVP 범위에 맞게 정리되어 있는가",
        "+4 MVP/첫 버전 범위 조절 의도가 명시되어 있는가",
      ]
    ),
    buildDimension(
      "testing",
      "출시 전 점검도",
      testingScore,
      15,
      testingAchievements.length > 0
        ? `${testingAchievements.join(", ")}.`
        : "체크리스트와 테스트 흐름을 더 보강하면 출시 준비도가 올라갑니다.",
      [
        "+8 테스트 체크리스트가 충분한가",
        "+4 실행 단계 프롬프트가 2개 이상 있는가",
        "+3 테스트/점검 필요성이 명시되어 있는가",
      ]
    ),
  ];

  const overall = clamp(
    dimensions.reduce((sum, dimension) => sum + dimension.score, 0)
  );
  const label = scoreLabel(overall);
  const stars = scoreToStars(overall);

  const summary =
    overall >= 75
      ? "핵심 안전 요소와 MVP 범위가 꽤 명확하게 정리되어 있어, 데모와 첫 구현에 바로 활용하기 좋은 수준입니다."
      : overall >= 60
        ? "방향은 잘 잡혔고, 일부 기준만 더 채우면 훨씬 설득력 있는 주문서가 됩니다."
        : "좋은 출발점은 있지만, 개인정보·권한·테스트 관점에서 한 단계 더 구조화가 필요합니다.";

  return {
    overall,
    label,
    summary,
    stars,
    dimensions,
  };
}

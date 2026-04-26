export type TechStackId =
  | "nextjs"
  | "react-spa"
  | "supabase"
  | "firebase"
  | "prisma-postgres"
  | "express"
  | "nestjs"
  | "django"
  | "spring-boot"
  | "stripe"
  | "toss-payments"
  | "s3-upload"
  | "webhooks";

export type TechStackConfig = {
  id: TechStackId;
  label: string;
  shortDescription: string;
};

export type TechStackGroup = {
  key: string;
  title: string;
  description: string;
  stacks: TechStackConfig[];
};

const STACKS: TechStackConfig[] = [
  {
    id: "nextjs",
    label: "Next.js",
    shortDescription: "App Router, Route Handler, Server Action 중심 웹앱",
  },
  {
    id: "react-spa",
    label: "React SPA",
    shortDescription: "클라이언트 중심 단일 페이지 앱",
  },
  {
    id: "supabase",
    label: "Supabase",
    shortDescription: "BaaS, Auth, DB, Storage, RLS 중심 구성",
  },
  {
    id: "firebase",
    label: "Firebase",
    shortDescription: "Firestore, Auth, Functions 중심 구성",
  },
  {
    id: "prisma-postgres",
    label: "Prisma + Postgres",
    shortDescription: "ORM과 관계형 DB를 직접 다루는 구성",
  },
  {
    id: "express",
    label: "Express",
    shortDescription: "Node.js 경량 API 서버",
  },
  {
    id: "nestjs",
    label: "NestJS",
    shortDescription: "구조화된 Node.js 백엔드",
  },
  {
    id: "django",
    label: "Django",
    shortDescription: "ORM과 관리자 페이지가 강한 Python 백엔드",
  },
  {
    id: "spring-boot",
    label: "Spring Boot",
    shortDescription: "Java 기반 기업형 백엔드",
  },
  {
    id: "stripe",
    label: "Stripe",
    shortDescription: "글로벌 결제와 웹훅 처리",
  },
  {
    id: "toss-payments",
    label: "토스페이먼츠",
    shortDescription: "국내 결제 연동과 승인/취소 흐름",
  },
  {
    id: "s3-upload",
    label: "S3 업로드",
    shortDescription: "파일 업로드, presigned URL, 스토리지 권한",
  },
  {
    id: "webhooks",
    label: "웹훅 연동",
    shortDescription: "외부 이벤트 수신과 서명 검증",
  },
];

export const TECH_STACK_GROUPS: TechStackGroup[] = [
  {
    key: "frontend",
    title: "프론트엔드 / 웹앱 구조",
    description: "사용할 화면 프레임워크나 앱 구조를 고르세요.",
    stacks: STACKS.filter((stack) => ["nextjs", "react-spa"].includes(stack.id)),
  },
  {
    key: "backend",
    title: "백엔드 / 데이터",
    description: "주요 API 서버나 데이터 계층을 고르세요.",
    stacks: STACKS.filter((stack) =>
      ["supabase", "firebase", "prisma-postgres", "express", "nestjs", "django", "spring-boot"].includes(
        stack.id
      )
    ),
  },
  {
    key: "integrations",
    title: "결제 / 업로드 / 외부 연동",
    description: "보안 경계가 크게 생기는 외부 연동을 고르세요.",
    stacks: STACKS.filter((stack) =>
      ["stripe", "toss-payments", "s3-upload", "webhooks"].includes(stack.id)
    ),
  },
];

export function isTechStackId(value: unknown): value is TechStackId {
  return STACKS.some((stack) => stack.id === value);
}

export function normalizeTechStackIds(value: unknown): TechStackId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter(isTechStackId))];
}

export function getTechStackById(id: TechStackId) {
  return STACKS.find((stack) => stack.id === id) ?? STACKS[0];
}

export function formatSelectedTechStacks(stackIds: TechStackId[]) {
  if (stackIds.length === 0) {
    return "- 사용자가 기술 스택을 따로 고르지 않아 자동 추정이 필요합니다.";
  }

  return stackIds
    .map((stackId) => {
      const stack = getTechStackById(stackId);
      return `- ${stack.label}: ${stack.shortDescription}`;
    })
    .join("\n");
}

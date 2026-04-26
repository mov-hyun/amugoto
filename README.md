# AMUGOTO

아무것도 몰라도, 안전하게 앱은 만들 수 있게.

AMUGOTO는 `Lovable`, `v0`, `Replit Agent`, `Cursor`, `Claude Code` 같은 AI 앱 빌더와 코딩 에이전트를 쓰기 전에, 위험한 요구사항을 먼저 점검하고 안전한 제작 주문서로 바꿔주는 사전 안전 레이어이자 secure design copilot입니다.

## 한 줄 소개

비개발자와 초기 기획자가 막연한 앱 아이디어를 입력하면, AMUGOTO가:

- 어떤 점이 위험한지 설명하고
- 더 안전한 앱 요구사항으로 다시 쓰고
- 선택한 툴에 맞는 실행용 프롬프트를 만들고
- 출시 전 체크리스트와 심층 보안 리뷰까지 묶어줍니다

## 무엇을 해결하나요?

AI 앱 빌더는 자연어만으로도 앱을 만들 수 있다고 말하지만, 실제로는 첫 프롬프트에서 이미 중요한 보안, 개인정보, 권한, 결제 설계가 들어갑니다.

예를 들어 이런 요청은 위험할 수 있습니다.

- 고객 카드번호를 직접 저장하고 싶다
- 관리자 페이지에서 모든 고객 정보를 한 번에 보고 싶다
- 로그인 없이 URL만 알면 운영 화면에 들어가게 하고 싶다
- 민감한 개인정보를 필요 이상으로 오래 보관하고 싶다
- `role`, `ownerId`, `status`, `price` 같은 필드를 클라이언트가 직접 보내게 하고 싶다
- 다른 지점이나 다른 고객 데이터가 ID만 바꾸면 보이게 되는 구조다
- 외부 결제사, 웹훅, 업로드 URL을 너무 쉽게 신뢰하고 있다

AMUGOTO는 단순한 위험 문장 감지기보다 한 단계 더 나아가, `개발자도 놓치기 쉬운 설계 단계 보안 실수`를 AI가 코드를 만들기 전에 먼저 막는 데 초점을 둡니다.

## 타깃 사용자

- AI로 예약, 결제, 운영용 앱을 만들고 싶은 비개발자
- 1인 사업자, 소상공인, 운영자
- 제품 요구사항은 막연하지만 빠르게 프로토타입을 만들고 싶은 사용자
- AI 코딩 툴을 쓰기 전, 무엇을 요청해야 안전한지 모르겠는 사용자

## 현재 제품 흐름

1. `홈`
   제품 소개와 진입 경로를 보여줍니다.
2. `바로 시작`
   사용자가 앱 아이디어, 상세 조건, 사용할 툴을 입력합니다.
3. `업종별 예시`
   실제 업종 예시를 선택해 시작 화면으로 바로 가져옵니다.
4. `기본 결과`
   `A. 뭐가 위험한가?`와 `B. 어떻게 바꿀까?` 탭으로 나눠 위험 분석과 개선 가이드를 보여줍니다.
5. `심층 보안 분석 리포트`
   필요할 때만 별도로 잠금 해제해서, 기술 스택 가정과 구체적인 통제 설계도까지 포함한 보안 리뷰를 생성합니다.

## 현재 포함된 핵심 기능

- 위험한 요구 자동 감지
- 쉬운 설명으로 다시 풀어주기
- 안전한 앱 요약 생성
- 상세 질문 아코디언을 통한 업종 / 역할 / 데이터 / 숨은 설계 리스크 수집
- 일반인용 / 개발자용 툴 선택과 툴별 안내
- MVP 범위 / 제외 기능 분리
- 허용 데이터 / 차단 데이터 분리
- 관리자 권한 가이드
- 역할별 권한 매트릭스
- 클라이언트 금지 필드 제안
- 남용 / 비용 폭탄 방어 규칙
- 외부 API / 웹훅 / URL fetch 신뢰 규칙
- AI 코딩 툴 안전 사용 규칙
- 전후 비교 뷰
- 출시 준비도 점수
- 툴별 프롬프트 생성
- 최종 주문서 패키지 한 번에 복사
- 심층 보안 분석 리포트 잠금 해제
- 공격 시나리오, 스택별 구현 가이드, 통제 설계도 생성
- 분석 중 최소 5초 로딩 UX와 프로모 카드 표시

## 심층 리포트에서 다루는 것

- 출시를 막는 차단 이슈
- 가정한 기술 스택과 그 가정 이유
- 핵심 설계 취약점
- 신뢰 경계와 권한 경계 경고
- 위험한 클라이언트 제어 필드
- 남용 가능한 흐름
- 스택별 구현 가이드
- 구현 통제 설계도
- 공격 시나리오
- 개발자 / QA 검증 체크리스트
- AI 코딩 툴 사용 경고
- 반영한 보안 기준 요약

## 해커톤 포지셔닝

- 주요 트랙: `Business & Applications`
- 차별화 포인트: `AI Safety & Security` 관점의 명확한 제품 메시지

핵심 메시지:

> 비개발자는 코드를 못 짜서 앱을 못 만드는 게 아니라, AI에게 안전한 요구사항을 어떻게 말해야 하는지 모르는 경우가 많습니다.

## 모델 전략

- 기본 분석: `gemini-3-flash-preview`
- 심층 보안 분석 리포트: `gemini-3-pro-preview`

기본 분석은 속도와 데모 안정성을 우선하고, 심층 리포트는 더 높은 추론 밀도와 구조화 품질을 우선합니다.

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- `@google/genai`

## 현재 라우트

- `/`
  홈 랜딩 페이지
- `/start`
  직접 입력해서 분석을 시작하는 작업 화면
- `/examples`
  업종별 예시를 보고 시작 화면으로 가져오는 페이지
- `/api/generate`
  기본 결과 생성 API
- `/api/security-report`
  심층 보안 분석 리포트 생성 API

## 주요 폴더 구조

```text
.
├─ README.md
└─ web/
   ├─ app/
   │  ├─ api/
   │  ├─ examples/
   │  ├─ start/
   │  ├─ layout.tsx
   │  └─ page.tsx
   ├─ components/
   │  ├─ home/
   │  ├─ shared/
   │  └─ start/
   ├─ lib/amugoto/
   └─ types/
```

## 핵심 모듈 설명

- `web/app/api/generate/route.ts`
  기본 분석 결과를 생성합니다.
- `web/app/api/security-report/route.ts`
  현재 결과를 바탕으로 심층 보안 분석 리포트를 별도로 생성합니다.
- `web/lib/amugoto/prompt.ts`
  기본 분석 프롬프트와 모델 상수를 관리합니다.
- `web/lib/amugoto/security-report.ts`
  심층 보안 리포트 프롬프트와 파서를 관리합니다.
- `web/lib/amugoto/parser.ts`
  기본 분석 응답을 앱에서 쓰는 형식으로 정리합니다.
- `web/lib/amugoto/tools.ts`
  일반인용 / 개발자용 툴 분류와 메타데이터를 관리합니다.
- `web/lib/amugoto/details.ts`
  상세 질문 정의와 포맷팅 로직을 관리합니다.
- `web/lib/amugoto/examples.ts`
  업종별 예시 데이터를 관리합니다.
- `web/lib/amugoto/scoring.ts`
  출시 준비도 점수를 계산합니다.
- `web/lib/amugoto/package.ts`
  최종 주문서 패키지 텍스트를 생성합니다.
- `web/components/home/deep-security-report-panel.tsx`
  잠금 해제형 심층 보안 리포트 버튼과 결과 UI를 담당합니다.
- `web/components/start/start-workspace.tsx`
  시작 화면의 중앙 정렬, 결과 후 2컬럼 전환, 로딩 UX 흐름을 담당합니다.

## 로컬 실행

권장 환경:

- Node.js 20 이상
- npm
- WSL 기준 작업 경로에서 실행 권장

필수 환경변수:

```bash
GEMINI_API_KEY=your_api_key_here
```

`web/.env.local` 파일에 넣어주세요.

실행 방법:

```bash
cd web
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## API 입력 예시

`POST /api/generate`

```json
{
  "idea": "고객 예약과 결제가 가능한 피부관리샵 앱을 만들고 싶어요.",
  "selectedTool": "v0",
  "detailedAnswers": {
    "businessType": "피부관리샵 예약 운영",
    "targetUsers": "일반 고객, 사장님",
    "coreAction": "고객이 예약 시간 선택 후 예약 신청",
    "adminNeeds": "예약 확인, 일정 변경",
    "requiredData": "이름, 연락처, 예약 날짜",
    "mustHaveFeatures": "예약 신청, 예약 상태 확인, 관리자 관리",
    "blockedData": "카드번호 직접 저장"
  }
}
```

`POST /api/security-report`

```json
{
  "idea": "고객 예약과 결제가 가능한 피부관리샵 앱을 만들고 싶어요.",
  "selectedTool": "cursor",
  "detailedAnswers": {
    "businessType": "피부관리샵 예약 운영",
    "targetUsers": "일반 고객, 사장님, 직원",
    "coreAction": "고객 예약 생성과 관리자 예약 관리",
    "adminNeeds": "예약 확인, 일정 변경, 관리자 화면 접근",
    "forbiddenClientFields": "role, ownerId, status, price",
    "externalIntegrations": "결제사, 문자 발송, 웹훅"
  },
  "result": {
    "riskLevel": "높음",
    "oneLineSummary": "..."
  }
}
```

## 문제 해결 팁

- `GEMINI_API_KEY is missing` 오류가 나오면 `web/.env.local`을 확인하고 개발 서버를 다시 시작하세요.
- 결과가 이상하면 입력 아이디어를 더 짧고 구체적으로 나눠 적는 편이 좋습니다.
- 데모에서는 `/examples`에서 예시를 불러온 뒤 약간만 수정해서 실행하면 더 안정적입니다.
- 심층 보안 리포트는 `pro` 모델을 쓰기 때문에 기본 분석보다 더 느릴 수 있습니다.

# AMUGOTO Web

AMUGOTO의 실제 웹앱입니다.  
막연하고 위험한 앱 아이디어를 입력하면, 위험 분석과 안전한 제작 주문서, 툴별 프롬프트, 체크리스트를 생성합니다.

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- `@google/genai`

## 실행 전 준비

권장 환경:

- Node.js 20 이상
- npm
- WSL 기준 작업 경로에서 실행 권장

필수 환경변수:

```bash
GEMINI_API_KEY=your_api_key_here
```

`web/.env.local` 파일에 넣어주세요.

## 실행 방법

```bash
cd web
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 현재 페이지 구조

- `/`
  홈 랜딩 페이지
- `/start`
  직접 입력해서 분석을 시작하는 작업 화면
- `/examples`
  업종별 예시를 보고 시작 화면으로 가져오는 페이지
- `/api/generate`
  Gemini 기반 결과 생성 API

## 사용자 흐름

1. 홈에서 `바로 시작` 또는 `업종별 예시 사용법 보기`를 선택합니다.
2. 시작 화면에서 앱 아이디어를 입력합니다.
3. 필요하면 `더 자세히 물어보기`에서 업종, 사용자, 관리자 역할, 필수 데이터 등을 채웁니다.
4. 사용할 툴을 고릅니다.
5. 결과 화면에서:
   - `A. 뭐가 위험한가?`
   - `B. 어떻게 바꿀까?`
   두 탭으로 나눠 결과를 확인합니다.
6. 최종 주문서 패키지를 복사해서 선택한 툴에 붙여넣습니다.

## 주요 기능

- 위험한 요구 탐지
- 쉬운 설명 생성
- 안전한 앱 요약 생성
- MVP 기능 / 제외 기능 구분
- 허용 데이터 / 차단 데이터 분리
- 관리자 권한 가이드
- 전후 비교 뷰
- 출시 준비도 점수
- 툴별 프롬프트 생성
- 최종 주문서 패키지 복사
- 업종별 예시에서 시작 화면 자동 채우기

## 주요 폴더 구조

```text
web/
├─ app/
│  ├─ api/generate/route.ts
│  ├─ examples/page.tsx
│  ├─ start/page.tsx
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

- `app/api/generate/route.ts`
  요청을 받아 Gemini 호출 후 결과 JSON을 반환합니다.
- `lib/amugoto/prompt.ts`
  생성 프롬프트를 조립합니다.
- `lib/amugoto/parser.ts`
  Gemini 응답을 앱에서 쓰는 결과 형식으로 정리합니다.
- `lib/amugoto/tools.ts`
  일반인용 / 개발자용 툴 분류와 메타데이터를 관리합니다.
- `lib/amugoto/details.ts`
  상세 질문 정의와 포맷팅 로직을 담고 있습니다.
- `lib/amugoto/examples.ts`
  업종별 예시 데이터를 관리합니다.
- `lib/amugoto/compare.ts`
  전후 비교 배지를 계산합니다.
- `lib/amugoto/scoring.ts`
  출시 준비도 점수를 계산합니다.
- `lib/amugoto/package.ts`
  최종 주문서 패키지 텍스트를 생성합니다.

## API 입력 형식

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

## 문제 해결 팁

- `GEMINI_API_KEY is missing` 오류가 나오면 `web/.env.local`을 확인하고 개발 서버를 다시 시작하세요.
- 결과가 이상하면 입력 아이디어를 더 짧고 구체적으로 나눠 적는 편이 좋습니다.
- 데모에서는 `/examples`에서 예시를 불러온 뒤 약간만 수정해서 실행하면 더 안정적입니다.

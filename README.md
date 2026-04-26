# AMUGOTO

AMUGOTO는 개발 지식이 거의 없는 일반인도 보안을 점검하며 더 안전하게 바이브 코딩할 수 있도록 돕는 `pre-build secure design copilot`입니다. 동시에, 이미 바이브 코딩을 하고 있는 개발자도 체크리스트와 심층 리포트로 놓치기 쉬운 보안 포인트를 다시 확인할 수 있습니다.

> 앱은 1분 만에 만들 수 있어도, 사고는 그보다 오래 남습니다.
>
> AMUGOTO는 단 1분의 분석으로, 잘못된 바이브 코딩이 수백만 달러 규모의 데이터 유출과 운영 리스크로 번지기 전에 한 번 더 멈춰서 점검하게 해줍니다.

## Live Demo

- Production: [https://amugoto.vercel.app](https://amugoto.vercel.app)

## What It Does

사용자가 앱 아이디어를 입력하면 AMUGOTO는:

- 어떤 요구가 위험한지 설명합니다.
- 놓치기 쉬운 설계 단계 보안 리스크를 짚어줍니다.
- 더 안전한 요구사항과 툴별 실행 프롬프트로 다시 정리합니다.
- 출시 전 체크리스트를 생성합니다.
- 필요하면 심층 보안 분석 리포트와 역할별 실행 티켓까지 확장합니다.

## Who It Is For

- 개발 지식이 거의 없지만 Lovable, v0, Replit Agent, Cursor, Claude Code 같은 도구로 직접 만들어보려는 일반인 바이브 코더
- 빠르게 바이브 코딩을 하면서도 보안을 다시 점검하고 싶은 개발자
- QA, 운영 담당자, 외주/에이전시 팀

## Why It Matters

바이브 코딩은 누구나 빠르게 앱을 만들 수 있게 해주지만, 잘못된 첫 요구사항은 그대로 위험한 설계와 배포로 이어질 수 있습니다.  
AMUGOTO는 코드 생성 이후가 아니라 **코드 생성 이전의 설계 문장과 첫 프롬프트**를 다룹니다.

예를 들어 이런 요구는 위험할 수 있습니다.

- 카드번호를 직접 저장하고 싶다
- 관리자 페이지에서 모든 고객 정보를 한 번에 보고 싶다
- 직원도 예약을 다 확인할 수 있었으면 좋겠다
- 로그인은 최대한 단순하게 하고 싶다

그리고 AMUGOTO는 여기서 멈추지 않고, 아래와 같은 더 깊은 설계 리스크도 다룹니다.

- Broken Access Control, BOLA, IDOR
- `role`, `ownerId`, `status`, `price` 같은 클라이언트 제어 필드
- 예약/결제/쿠폰 흐름의 남용과 비용 폭탄
- 웹훅, 외부 API, 파일 업로드, SSRF 관련 리스크
- 멀티테넌트 분리 실패
- AI 도구가 읽어온 외부 문맥으로 인한 prompt injection 리스크

## Core Features

### 1. Landing / Start Flow

- 홈 페이지
- 바로 시작 페이지
- 업종별 예시 페이지
- 역할별 주의사항 페이지

### 2. Base Analysis

- 위험 요소 분석
- 전후 비교
- 출시 준비도 점수
- 안전한 앱 요약
- 허용/차단 정보
- 관리자 권한 제안
- 툴별 실행 프롬프트
- 테스트 체크리스트

### 3. Deep Security Report

추가 잠금 해제로 아래 내용을 생성합니다.

- 차단 이슈
- 가정한 기술 스택
- 스택별 구현 가이드
- 구현 통제 설계도
- 공격 시나리오
- 역할별 실행 요약
- 개발자 실행 티켓

### 4. Export / Reuse

- 전체 주문서 복사
- 역할별 복사
- 심층 리포트 PDF 저장

## Product Flow

1. 사용자가 아이디어를 입력합니다.
2. 툴과 기술 스택을 선택합니다.
3. 필요하면 상세 질문에 답합니다.
4. 기본 분석 결과를 확인합니다.
5. 필요하면 심층 보안 분석 리포트를 잠금 해제합니다.
6. 역할별 실행 요약, 티켓, PDF로 이어집니다.

## Developer Notes

### Routes

- `/` - 홈
- `/start` - 분석 시작
- `/examples` - 업종별 예시
- `/roles` - 역할별 주의사항
- `/api/generate` - 기본 분석 API
- `/api/security-report` - 심층 보안 분석 API

### Model Strategy

- Base analysis: `gemini-3-flash-preview`
- Deep security report: `gemini-3-pro-preview`

기본 분석은 속도 중심, 심층 리포트는 정확도와 밀도 중심으로 분리했습니다.

### Local Development

```bash
cd web
npm install
npm run dev
```

Build:

```bash
cd web
npm run build
```

### Environment Variables

`web/.env.local`에 아래 값이 필요합니다.

```bash
GEMINI_API_KEY=your_key_here
```

Vercel 배포 시에도 같은 환경변수를 `preview`, `production`에 등록해야 합니다.

### Tech Summary

- Next.js 16
- TypeScript
- App Router
- Gemini API
- Vercel deployment

## Notes

- 이 프로젝트는 완전한 보안 보장 시스템이 아닙니다.
- 목적은 **사전 설계 단계에서 위험한 요구와 보안 실수를 줄이는 것**입니다.

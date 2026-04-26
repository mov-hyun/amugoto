import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();

    if (!idea || typeof idea !== "string") {
      return Response.json(
        { error: "idea is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY is missing" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
너는 AMUGOTO라는 비개발자용 앱 제작 가이드다.

AMUGOTO의 역할:
- 사용자의 막연한 앱 아이디어를 안전하고 구체적인 앱 제작 주문서로 바꾼다.
- 사용자는 개발 지식이 거의 없다고 가정한다.
- 어려운 개발 용어는 쉬운 말로 바꿔 설명한다.
- Lovable, v0, Cursor, Claude Code 같은 AI 앱 빌더에 복사해서 붙여넣을 수 있는 프롬프트를 만든다.
- 개인정보, 결제, 관리자 권한, 비밀번호, 민감정보 저장, 고객 데이터 노출 위험을 반드시 점검한다.
- 위험하거나 복잡한 기능은 첫 버전에서 빼고 안전한 대안을 제안한다.

사용자의 앱 아이디어:
${idea}

아래 형식으로 한국어로 답변해라.

## 1. 앱 요약
비개발자도 이해할 수 있게 2~3문장으로 설명.

## 2. 오늘 만들 첫 버전
오늘 바로 만들 수 있는 핵심 기능만 bullet로 정리.

## 3. 나중에 추가할 기능
첫 버전에서 빼는 것이 좋은 기능을 정리.

## 4. 받아도 되는 정보
앱에서 사용자에게 입력받아도 되는 최소 정보.

## 5. 받지 않는 게 안전한 정보
개인정보, 결제정보, 민감정보 관점에서 피해야 할 정보.

## 6. 관리자 화면
관리자가 볼 수 있는 정보와 할 수 있는 일을 정리.

## 7. 위험 요소와 안전한 대안
초보자가 놓치기 쉬운 위험을 쉬운 말로 설명하고 대안을 제시.

## 8. AI 앱 빌더에 붙여넣을 프롬프트
Lovable, v0, Cursor, Claude Code에 그대로 넣을 수 있는 구체적인 제작 프롬프트를 text block 형태로 작성.

## 9. 초보자 테스트 체크리스트
비개발자가 직접 눌러보며 확인할 수 있는 테스트 항목.
`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return Response.json({ result: result.text });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to generate AMUGOTO guide" },
      { status: 500 }
    );
  }
}

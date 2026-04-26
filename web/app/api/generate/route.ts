import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();

    if (!idea || typeof idea !== "string") {
      return Response.json({ error: "idea is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY is missing. Check web/.env.local and restart npm run dev." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
너는 AMUGOTO라는 비개발자용 AI 앱 빌더 안전 레이어다.

역할:
개발 지식이 없는 일반인이 Lovable, v0, Cursor, Claude Code 같은 AI 앱 빌더를 사용할 때,
위험한 요구사항을 사전에 감지하고 안전한 앱 제작 주문서와 단계별 프롬프트로 바꿔준다.

사용자의 앱 아이디어:
${idea}

반드시 점검할 위험:
- 카드번호 직접 입력 또는 저장
- 주민등록번호, 건강정보, 민감정보 수집
- 과도한 개인정보 수집
- 비밀번호 직접 저장
- 관리자 페이지 접근 제한 없음
- 고객 정보 전체 노출
- 고객이 다른 고객 정보를 볼 가능성
- 로그인 없는 개인정보 조회
- 실제 결제 기능 직접 구현
- 권한 분리 없음
- 공개되면 안 되는 데이터 표시
- 처음 버전에 너무 복잡한 기능을 한꺼번에 넣으려는 요구

답변은 반드시 JSON만 출력해라.
마크다운 코드블록을 쓰지 마라.
설명 문장을 JSON 밖에 쓰지 마라.

JSON 형식:
{
  "riskLevel": "낮음 | 보통 | 높음",
  "oneLineSummary": "사용자 요청을 안전하게 바꾼 한 줄 요약",
  "detectedRisks": [
    {
      "title": "위험 이름",
      "description": "비개발자도 이해할 수 있는 쉬운 설명",
      "saferAlternative": "안전한 대안"
    }
  ],
  "easyExplanation": "전체적으로 왜 조심해야 하는지 쉬운 말로 설명",
  "safeAppSummary": "안전하게 바꾼 앱 요약",
  "mvpFeatures": ["처음 버전에서 만들 기능"],
  "excludedFeatures": ["처음 버전에서 제외할 기능"],
  "allowedData": ["받아도 되는 정보"],
  "blockedData": ["받지 않는 게 안전한 정보"],
  "adminAndPermission": ["관리자 화면과 권한 관련 주의사항"],
  "safeAlternatives": [
    {
      "riskyRequest": "위험한 요구",
      "safeVersion": "안전한 대안"
    }
  ],
  "builderPrompts": [
    {
      "step": "Step 1",
      "title": "기본 화면 만들기",
      "prompt": "AI 앱 빌더에 그대로 붙여넣을 프롬프트"
    }
  ],
  "testChecklist": ["초보자가 직접 확인할 테스트 항목"]
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = result.text ?? "";

    let parsed;
    try {
      const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      parsed = JSON.parse(cleaned);
    } catch {
      return Response.json(
        {
          error: "Gemini response was not valid JSON.",
          raw: text,
        },
        { status: 500 }
      );
    }

    return Response.json({ result: parsed });
  } catch (error) {
    console.error("AMUGOTO generate error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return Response.json(
      { error: `Failed to generate AMUGOTO guide: ${message}` },
      { status: 500 }
    );
  }
}

import os
from dotenv import load_dotenv
from google import genai
from anthropic import Anthropic

load_dotenv()

def test_gemini():
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("GEMINI_API_KEY is missing")
        return

    client = genai.Client(api_key=key)
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="Say hello in one short sentence."
    )
    print("Gemini:", response.text)

def test_claude():
    key = os.getenv("ANTHROPIC_API_KEY")
    if not key:
        print("ANTHROPIC_API_KEY is missing")
        return

    client = Anthropic(api_key=key)
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=100,
        messages=[{"role": "user", "content": "Say hello in one short sentence."}]
    )
    print("Claude:", message.content[0].text)

if __name__ == "__main__":
    test_gemini()
    test_claude()

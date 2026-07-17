"""One-off script to generate premium food photography using Gemini Nano Banana."""
import asyncio
import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")

OUT_DIR = Path("/app/frontend/public/images")
OUT_DIR.mkdir(parents=True, exist_ok=True)

RICE_PROMPT = (
    "Ultra-realistic 8K professional restaurant food photography, square format. "
    "Andhra Style White Bagara Rice (long grain basmati, pure shining glossy white) "
    "served in a premium matte black ceramic bowl, garnished with crisp golden fried "
    "onions, bay leaves, cinnamon stick, cloves, black pepper, cumin seeds and fresh "
    "coriander leaves. Beside it, a separate premium matte black bowl of rich Andhra "
    "Chicken Curry with thick spicy red-brown gravy, juicy tender chicken pieces, raw "
    "onion rings and a lemon wedge on the side. Set on a luxury dark textured restaurant "
    "table, dramatic cinematic overhead lighting, moody dark background, hyper realistic, "
    "high contrast, shallow depth of field, appetizing, magazine quality. "
    "No text, no logo, no watermark."
)

CHAPATI_PROMPT = (
    "Ultra-realistic 8K professional restaurant food photography, square format. "
    "Three soft freshly-cooked layered chapatis with light golden roasted spots, "
    "stacked elegantly on a premium matte black serving plate. Beside them, a matte "
    "black bowl of rich Andhra Chicken Curry with thick spicy red-brown gravy and "
    "juicy chicken pieces. Garnished with raw onion rings and a lemon wedge. Set on a "
    "luxury dark textured restaurant table, dramatic cinematic side lighting, moody "
    "dark background, hyper realistic, high contrast, shallow depth of field, "
    "appetizing, magazine quality. No text, no logo, no watermark."
)


async def gen(prompt: str, filename: str):
    api_key = os.getenv("EMERGENT_LLM_KEY")
    chat = LlmChat(
        api_key=api_key,
        session_id=f"tanyy-food-{filename}",
        system_message="You are a professional food photography AI.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(
        modalities=["image", "text"]
    )
    msg = UserMessage(text=prompt)
    text, images = await chat.send_message_multimodal_response(msg)
    print(f"[{filename}] text: {text[:80] if text else ''}")
    if not images:
        print(f"[{filename}] no images returned")
        return
    out = OUT_DIR / filename
    with open(out, "wb") as f:
        f.write(base64.b64decode(images[0]["data"]))
    print(f"[{filename}] saved -> {out}")


async def main():
    await gen(RICE_PROMPT, "flavoured-rice.png")
    await gen(CHAPATI_PROMPT, "chapati-set.png")


if __name__ == "__main__":
    asyncio.run(main())

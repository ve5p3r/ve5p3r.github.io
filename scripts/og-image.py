#!/usr/bin/env python3
"""Deterministic OG share-card generator for ve5p3r.dev.

Renders public/og-image.png (1200x630): dark background, orange accent bar,
"Vesper" title, two-line subtitle, bottom-left domain, and the fox artwork on the
right. The text column is kept at least 48px clear of the fox's left edge.

Usage: python3 scripts/og-image.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og-image.png"
FOX = ROOT / "public" / "fox.webp"

W, H = 1200, 630
BG = (13, 13, 13)
FG = (231, 231, 231)
MUTED = (160, 160, 160)
ORANGE = (232, 100, 26)

FONT_DIR = Path("/usr/share/fonts/TTF")
TITLE_FONT = "JetBrainsMonoNerdFont-SemiBold.ttf"
BODY_FONT = "JetBrainsMonoNerdFont-Regular.ttf"
FALLBACK_FONT = "DejaVuSansMono.ttf"

FOX_W = 430
FOX_L = 706
FOX_T = (H - FOX_W) // 2
TEXT_RIGHT = FOX_L - 48  # text column must end >=48px before fox edge
TEXT_LEFT = 80


def load_font(name):
    for candidate in [FONT_DIR / name, FONT_DIR / FALLBACK_FONT]:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), 0)  # size set per use below
    raise SystemExit(f"font not found: {name}")


def font(name, size):
    return ImageFont.truetype(str(FONT_DIR / name) if (FONT_DIR / name).exists() else str(FONT_DIR / FALLBACK_FONT), size)


def text_w(draw, s, f):
    return draw.textlength(s, font=f)


def main():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # fox artwork on the right
    fox = Image.open(FOX).convert("RGB").resize((FOX_W, FOX_W), Image.LANCZOS)
    img.paste(fox, (FOX_L, FOX_T))

    # orange accent bar
    draw.rectangle([TEXT_LEFT, 132, TEXT_LEFT + 64, 142], fill=ORANGE)

    # title
    title_font = font(TITLE_FONT, 72)
    draw.text((TEXT_LEFT, 160), "Vesper", font=title_font, fill=FG)
    title_bottom = 160 + draw.textbbox((0, 0), "Vesper", font=title_font)[3]

    # subtitle, two lines, auto-sized to fit the text column
    lines = ["Autonomous agent", "open-source builder · on-chain identity"]
    sub_size = 26
    sub_font = font(BODY_FONT, sub_size)
    while sub_size > 14 and any(text_w(draw, line, sub_font) > TEXT_RIGHT - TEXT_LEFT for line in lines):
        sub_size -= 2
        sub_font = font(BODY_FONT, sub_size)
    sub_top = title_bottom + 26  # >=24px under the title
    for line in lines:
        draw.text((TEXT_LEFT, sub_top), line, font=sub_font, fill=MUTED)
        sub_top += sub_size + 8

    # domain, anchored bottom-left
    domain_font = font(BODY_FONT, 24)
    draw.text((TEXT_LEFT, H - 78), "ve5p3r.dev", font=domain_font, fill=ORANGE)

    img.save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT} ({W}x{H})")


if __name__ == "__main__":
    main()

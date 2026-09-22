#!/usr/bin/env python3
"""Build the Open Graph share card for www.clairo.care.

Writes public/assets/og-clairo-care-2026-09.png at 1200x630: the white Clairo lockup
(assets-src/logo-lockup-white.png) on the brand navy, with the one-line description under it. Run
from the repo root:

    python3 scripts/make-og-image.py

/assets is served with a one-year immutable cache, so never overwrite a published card. Change the
date in OUT_NAME, regenerate, and point OG_IMAGE in src/layouts/Site.astro at the new file.
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "public", "assets")
ORIGINALS = os.path.join(ROOT, "assets-src")
OUT_NAME = "og-clairo-care-2026-09.png"

WIDTH, HEIGHT = 1200, 630
NAVY = (15, 23, 41)
WHITE = (255, 255, 255)
MUTED = (198, 210, 226)
LOGO_WIDTH = 520
TAGLINE = "Self-directed and traditional DDA services"
SUBLINE = "in Maryland and Pennsylvania"

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    # PIL's built-in bitmap font is tiny, but a card is better than no card.
    return ImageFont.load_default()


def centered(draw, text, font, y, fill):
    box = draw.textbbox((0, 0), text, font=font)
    draw.text(((WIDTH - (box[2] - box[0])) / 2 - box[0], y), text, font=font, fill=fill)
    return box[3] - box[1]


def main():
    card = Image.new("RGB", (WIDTH, HEIGHT), NAVY)

    logo_path = os.path.join(ORIGINALS, "logo-lockup-white.png")
    if not os.path.exists(logo_path):
        print("missing " + logo_path, file=sys.stderr)
        return 1
    logo = Image.open(logo_path).convert("RGBA")
    logo = logo.resize((LOGO_WIDTH, round(logo.height * LOGO_WIDTH / logo.width)), Image.LANCZOS)

    tagline_font = load_font(40)
    subline_font = load_font(40)

    block = logo.height + 54 + 52 + 12 + 52
    top = round((HEIGHT - block) / 2)

    card.paste(logo, (round((WIDTH - logo.width) / 2), top), logo)

    draw = ImageDraw.Draw(card)
    y = top + logo.height + 54
    centered(draw, TAGLINE, tagline_font, y, WHITE)
    centered(draw, SUBLINE, subline_font, y + 64, MUTED)

    out = os.path.join(ASSETS, OUT_NAME)
    card.save(out, "PNG", optimize=True)
    size_kb = os.path.getsize(out) / 1024
    print("wrote %s (%dx%d, %.1f KB)" % (out, WIDTH, HEIGHT, size_kb))
    return 0


if __name__ == "__main__":
    sys.exit(main())

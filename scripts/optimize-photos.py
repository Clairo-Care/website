#!/usr/bin/env python3
"""Write web-sized copies of the photographs in public/assets and repoint src/ at them.

The originals came off a camera: 0.7 MB to 6.8 MB each, up to 6052 px wide, for slots that are at
most about 800 px on screen. This writes a new file next to each one, capped at 1600 px wide and
saved as progressive JPEG at quality 82 with the metadata stripped.

Nothing is deleted or overwritten. /assets is served with a one-year immutable cache, so a new size
always means a new filename: photo-hero.png keeps working and photo-hero-w1600.jpg is what the
pages now ask for. A photograph with an alpha channel would keep PNG as -w1600.png; none of the
current set has one.

Run from the repo root:

    python3 scripts/optimize-photos.py
"""
import glob
import os
import re
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "public", "assets")
SRC = os.path.join(ROOT, "src")

MAX_WIDTH = 1600
JPEG_QUALITY = 82


def optimized_name(basename):
    stem = os.path.splitext(basename)[0]
    return stem + "-w1600"


def convert(path):
    """Write the resized copy. Returns (old basename, new basename)."""
    basename = os.path.basename(path)
    image = Image.open(path)
    has_alpha = image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info)

    if image.width > MAX_WIDTH:
        height = round(image.height * MAX_WIDTH / image.width)
        image = image.resize((MAX_WIDTH, height), Image.LANCZOS)

    stem = optimized_name(basename)
    if has_alpha:
        out_name = stem + ".png"
        out = os.path.join(ASSETS, out_name)
        image.save(out, "PNG", optimize=True)
    else:
        out_name = stem + ".jpg"
        out = os.path.join(ASSETS, out_name)
        # Drop the EXIF and ICC blocks by saving from a clean RGB image.
        image.convert("RGB").save(out, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)

    before = os.path.getsize(path) / 1024
    after = os.path.getsize(out) / 1024
    print("%-30s %7.0f KB -> %-30s %6.0f KB" % (basename, before, out_name, after))
    return basename, out_name


def repoint(mapping):
    """Rewrite every src="assets/photo-..." in src/ to the optimized filename."""
    changed = 0
    for path in glob.glob(os.path.join(SRC, "**", "*.astro"), recursive=True):
        text = open(path).read()
        original = text
        for old, new in mapping.items():
            text = text.replace('src="assets/' + old + '"', 'src="assets/' + new + '"')
        if text != original:
            open(path, "w").write(text)
            changed += 1
    print("rewrote %d file(s) under src/" % changed)


def main():
    photos = sorted(
        p for p in glob.glob(os.path.join(ASSETS, "photo-*"))
        if re.search(r"\.(jpe?g|png)$", p, re.I) and "-w1600." not in p
    )
    if not photos:
        print("no photographs found in " + ASSETS, file=sys.stderr)
        return 1
    mapping = dict(convert(p) for p in photos)
    repoint(mapping)
    return 0


if __name__ == "__main__":
    sys.exit(main())

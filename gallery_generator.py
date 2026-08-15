"""Build-time PNG gallery generator (Pillow). Never runs in the browser.

Webfont TTFs are committed under fonts/ rather than fetched at build time —
keeps CI builds deterministic and offline-safe instead of depending on a
live Google Fonts / GitHub mirror on every run.
"""

import os
import re
import urllib.request
from PIL import Image, ImageDraw, ImageFont

FONT_FILES = {
    'UnifrakturMaguntia': 'fonts/UnifrakturMaguntia-Regular.ttf',
    'Pinyon Script': 'fonts/PinyonScript-Regular.ttf',
    'Great Vibes': 'fonts/GreatVibes-Regular.ttf',
    'Almendra': 'fonts/Almendra-Regular.ttf',
    'Eagle Lake': 'fonts/EagleLake-Regular.ttf',
    # Local (non-Google-Fonts) TTFs — already committed under
    # chicano-font-generator/fonts/ for the browser-side local font loader,
    # reused here directly (no download needed).
    'Brock Script': 'chicano-font-generator/fonts/BrockScript.ttf',
    'Crimson Italic': 'chicano-font-generator/fonts/crimson-italic-webfont.ttf',
    'Dragonwick': 'chicano-font-generator/fonts/dragonwi.ttf',
}

GOOGLE_FONTS_CSS_URL = 'https://fonts.googleapis.com/css2?family={family}&display=swap'
# Google Fonts serves WOFF2 to modern desktop UAs and even a legacy desktop
# Chrome UA only gets WOFF (not readable by Pillow/FreeType). Old Android
# WebKit UAs are the ones Google's CSS API still serves plain .ttf to.
_LEGACY_UA = ('Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/'
              'FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 '
              'Mobile Safari/533.1')


def _cache_filename(family_name):
    return family_name.replace(' ', '') + '-Regular.ttf'


def _download_google_font(family_name, cache_path):
    """Fetch a Google Fonts TTF once and cache it under fonts/. Returns True
    if the file is available at cache_path afterward (already cached or
    freshly downloaded), False if it could not be obtained — callers must
    treat False as "skip this font", never as fatal."""
    if os.path.exists(cache_path):
        return True
    try:
        css_url = GOOGLE_FONTS_CSS_URL.format(family=family_name.replace(' ', '+'))
        req = urllib.request.Request(css_url, headers={'User-Agent': _LEGACY_UA})
        css_text = urllib.request.urlopen(req, timeout=15).read().decode('utf-8')
        match = re.search(r'url\((https://[^)]+\.ttf)\)', css_text)
        if not match:
            print(f"  Gallery: no TTF source found for '{family_name}', skipping")
            return False
        ttf_data = urllib.request.urlopen(match.group(1), timeout=15).read()
        os.makedirs(os.path.dirname(cache_path) or '.', exist_ok=True)
        with open(cache_path, 'wb') as f:
            f.write(ttf_data)
        print(f"  Gallery: downloaded '{family_name}' -> {cache_path}")
        return True
    except Exception as e:
        print(f"  Gallery: failed to download '{family_name}' ({e}), skipping")
        return False


def _ensure_font_files(fonts):
    """Populates FONT_FILES with a cached TTF path for every source:"google"
    entry in `fonts` that isn't already known, downloading+caching under
    fonts/ on first use. Local-source entries and already-known fonts are
    left untouched. Never raises — a failed download just leaves that font
    absent from FONT_FILES, and generate_gallery()'s existing skip-if-missing
    check handles the rest."""
    for f in fonts:
        name = f.get('name')
        if not name or name in FONT_FILES:
            continue
        if f.get('source') != 'google':
            continue
        cache_path = os.path.join('fonts', _cache_filename(name))
        if _download_google_font(name, cache_path):
            FONT_FILES[name] = cache_path


CANVAS_W = 1200
CANVAS_H = 630
BG_COLOR = '#FFFFFF'
TEXT_COLOR = '#1A1A1A'
WATERMARK_TEXT = 'aifontsgenerator.com'
WATERMARK_COLOR = '#999999'


def _slugify(text):
    out = []
    prev_dash = False
    for ch in text.lower():
        if ch.isalnum():
            out.append(ch)
            prev_dash = False
        elif not prev_dash:
            out.append('-')
            prev_dash = True
    return ''.join(out).strip('-')


def _fit_font(draw, text, font_path, max_width, max_height, start_size=200, min_size=36):
    size = start_size
    font = ImageFont.truetype(font_path, size)
    bbox = draw.textbbox((0, 0), text, font=font)
    while size > min_size and (bbox[2] - bbox[0] > max_width or bbox[3] - bbox[1] > max_height):
        size -= 4
        font = ImageFont.truetype(font_path, size)
        bbox = draw.textbbox((0, 0), text, font=font)
    return font, bbox


def _watermark_font():
    try:
        return ImageFont.load_default(size=22)
    except TypeError:
        return ImageFont.load_default()


def generate_gallery(page_slug, fonts, names, out_dir, count=20):
    """Render `count` PNGs pairing names with fonts round-robin.

    Returns a list of dicts: {filename, name, style_label} for the caller
    (build.py) to render into the template's gallery grid.
    """
    if not fonts or not names or not count:
        return []

    os.makedirs(out_dir, exist_ok=True)
    _ensure_font_files(fonts)
    wm_font = _watermark_font()
    generated = []

    for i in range(count):
        name = names[i % len(names)]
        font_entry = fonts[i % len(fonts)]
        font_name = font_entry['name']
        style_label = font_entry.get('label', font_name)
        font_path = FONT_FILES.get(font_name)
        if not font_path or not os.path.exists(font_path):
            continue

        img = Image.new('RGB', (CANVAS_W, CANVAS_H), BG_COLOR)
        draw = ImageDraw.Draw(img)

        font, bbox = _fit_font(draw, name, font_path, CANVAS_W - 160, CANVAS_H - 220)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        x = (CANVAS_W - text_w) / 2 - bbox[0]
        y = (CANVAS_H - text_h) / 2 - bbox[1]
        draw.text((x, y), name, font=font, fill=TEXT_COLOR)

        wm_bbox = draw.textbbox((0, 0), WATERMARK_TEXT, font=wm_font)
        wm_w = wm_bbox[2] - wm_bbox[0]
        draw.text((CANVAS_W - wm_w - 28, CANVAS_H - 40), WATERMARK_TEXT, font=wm_font, fill=WATERMARK_COLOR)

        name_slug = _slugify(name)
        style_slug = _slugify(style_label)
        filename = f'{name_slug}-chicano-{style_slug}-lettering.png'
        img.save(os.path.join(out_dir, filename), 'PNG', optimize=True)

        generated.append({'filename': filename, 'name': name, 'style_label': style_label})

    return generated

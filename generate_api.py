"""
generate_api.py — builds api/styles.json and api/index.json from the
fonts-*.js source files, using regex/string parsing only (no Node.js,
no JS execution). Run with: python generate_api.py

Style definitions appear in the source in two shapes:

1. Plain object literals, e.g.:
     { name: 'Bold', category: 'Classic Styles', map: {...}, tags: [...] }
   or a call to a "default-category" factory whose category comes from a
   default parameter when the caller omits it, e.g. makeRemixStyle():
     function makeRemixStyle({ name, category = 'Creative & Mixed Styles', ... })
     makeRemixStyle({ name: 'Quantum Spell', frame: {...}, ... })   // no category key

2. Positional "helper factory" calls, e.g. fonts-freaky-text.js's mk():
     function mk(name, transform) { return { name: name, category: 'Freaky Extended', ... }; }
     mk('Freaky Spaced', function (t) { ... })

Both shapes are detected generically (not hardcoded to specific function
names) by first scanning each file for factory function definitions, then
resolving each call against them.

Only styles with a literal, inline (or const-referenced) `map: {...}`
object get a real example_output — everything driven by `transform` is
procedural and gets example_output = null, per spec.
"""

import glob
import json
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
BASE_URL = "https://aifontsgenerator.com"
EXAMPLE_INPUT = "Hello"

# A quoted string: group "qch" = quote char, next group = content (handles \" / \'
# escapes). The backreference is named (not \1) because STR gets embedded after
# other capturing groups in some patterns below — a numeric \1 there would
# silently point at the wrong group instead of the quote char.
STR = r"""(?P<qch>['"])((?:\\.|(?!(?P=qch)).)*)(?P=qch)"""

NAME_RE = re.compile(r"\bname\s*:\s*" + STR)
CATEGORY_RE = re.compile(r"\bcategory\s*:\s*" + STR)
PACK_RE = re.compile(r"\bpack\s*:\s*" + STR)
MAP_INLINE_RE = re.compile(r"\bmap\s*:\s*\{([^{}]*)\}")
MAP_IDENT_RE = re.compile(r"\bmap\s*:\s*([A-Za-z_$][\w$]*)\b")
CONST_MAP_RE = re.compile(r"\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*\{([^{}]*)\}\s*;")
PAIR_RE = re.compile(r"""(['"])((?:\\.|(?!\1).)+)\1\s*:\s*(['"])((?:\\.|(?!\3).)*)\3""")

# Factory functions whose category comes from a default parameter, e.g.
# function makeRemixStyle({ name, category = 'X', ... })
FACTORY_DEFAULT_RE = re.compile(
    r"function\s+([A-Za-z_$][\w$]*)\s*\(\s*\{[\s\S]{0,400}?\bcategory\s*=\s*" + STR
)
# Factory functions whose category is hardcoded inside the body, e.g.
# function mk(name, transform) { return { name: name, category: 'X', ... }; }
FACTORY_HARDCODED_RE = re.compile(
    r"function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{[\s\S]{0,400}?\bcategory\s*:\s*" + STR
)

CHUNK_WINDOW = 1000


def parse_map_pairs(body):
    result = {}
    for m in PAIR_RE.finditer(body):
        key, val = m.group(2), m.group(4)
        if key:
            result[key] = val
    return result


def apply_char_map(text, char_map):
    out = []
    for ch in text:
        if ch in char_map:
            out.append(char_map[ch])
        elif ch.lower() in char_map:
            out.append(char_map[ch.lower()])
        elif ch.upper() in char_map:
            out.append(char_map[ch.upper()])
        else:
            out.append(ch)
    return "".join(out)


def extract_const_maps(text):
    maps = {}
    for m in CONST_MAP_RE.finditer(text):
        maps[m.group(1)] = parse_map_pairs(m.group(2))
    return maps


def extract_styles_from_file(path):
    text = open(path, encoding="utf-8").read()
    const_maps = extract_const_maps(text)

    factory_default = {m.group(1): m.group(3) for m in FACTORY_DEFAULT_RE.finditer(text)}
    factory_hardcoded = {m.group(1): m.group(3) for m in FACTORY_HARDCODED_RE.finditer(text)}

    # Anchors: where an object-style factory call opens, e.g. "makeRemixStyle({"
    factory_call_anchors = []
    for fname in factory_default:
        for m in re.finditer(r"\b" + re.escape(fname) + r"\s*\(\s*\{", text):
            factory_call_anchors.append((m.start(), fname))
    factory_call_anchors.sort()

    results = []
    name_matches = list(NAME_RE.finditer(text))

    for i, nm in enumerate(name_matches):
        name = nm.group(2)
        start = nm.end()
        hard_end = name_matches[i + 1].start() if i + 1 < len(name_matches) else len(text)
        end = min(hard_end, start + CHUNK_WINDOW)
        chunk = text[start:end]

        cat_m = CATEGORY_RE.search(chunk)
        if cat_m:
            category = cat_m.group(2)
        else:
            pack_m = PACK_RE.search(chunk)
            if pack_m:
                category = pack_m.group(2)
            else:
                # Fall back to the nearest enclosing factory call's default category
                best_pos, best_factory = -1, None
                for pos, fname in factory_call_anchors:
                    if pos <= nm.start() and pos > best_pos:
                        best_pos, best_factory = pos, fname
                category = factory_default.get(best_factory, "Misc") if best_factory else "Misc"

        example_output = None
        map_m = MAP_INLINE_RE.search(chunk)
        char_map = None
        if map_m:
            char_map = parse_map_pairs(map_m.group(1))
        else:
            ident_m = MAP_IDENT_RE.search(chunk)
            if ident_m and ident_m.group(1) in const_maps:
                char_map = const_maps[ident_m.group(1)]
        if char_map:
            example_output = apply_char_map(EXAMPLE_INPUT, char_map)

        results.append({"name": name, "category": category, "example_output": example_output})

    # Positional helper-factory calls, e.g. mk('Freaky Spaced', fn)
    for fname, category in factory_hardcoded.items():
        call_re = re.compile(r"\b" + re.escape(fname) + r"\s*\(\s*" + STR)
        for m in call_re.finditer(text):
            results.append({"name": m.group(2), "category": category, "example_output": None})

    return results


def collect_all_styles():
    all_files = sorted(glob.glob(os.path.join(ROOT, "fonts-*.js")))
    priority = ["fonts-core.js", "fonts-extra.js"]
    ordered = sorted(
        (f for f in all_files if os.path.basename(f) in priority),
        key=lambda f: priority.index(os.path.basename(f)),
    )
    ordered += [f for f in all_files if os.path.basename(f) not in priority]

    by_key = {}
    for path in ordered:
        for style in extract_styles_from_file(path):
            key = style["name"].strip().lower()
            if key and key not in by_key:
                by_key[key] = style

    styles = list(by_key.values())
    styles.sort(key=lambda s: s["name"])
    return styles


def build_styles_json(styles):
    categories = sorted({s["category"] for s in styles})
    return {
        "name": "AI Fonts Generator API",
        "description": "Free Unicode font style data. 168+ text transformation styles for Instagram, Discord, gaming names and social media.",
        "version": "1.0.0",
        "docs": f"{BASE_URL}/api-docs.html",
        "source": BASE_URL,
        "total_styles": len(styles),
        "categories": categories,
        "styles": [
            {
                "name": s["name"],
                "category": s["category"],
                "example_input": EXAMPLE_INPUT,
                "example_output": s["example_output"],
            }
            for s in styles
        ],
    }


def build_index_json():
    return {
        "api": "AI Fonts Generator",
        "version": "1.0.0",
        "endpoints": {
            "styles": f"{BASE_URL}/api/styles.json",
            "docs": f"{BASE_URL}/api-docs.html",
        },
        "license": "Free for non-commercial use",
        "contact": "chris.shangrei@gmail.com",
        "source": BASE_URL,
    }


def main():
    styles = collect_all_styles()
    styles_json = build_styles_json(styles)
    index_json = build_index_json()

    api_dir = os.path.join(ROOT, "api")
    os.makedirs(api_dir, exist_ok=True)

    styles_path = os.path.join(api_dir, "styles.json")
    with open(styles_path, "w", encoding="utf-8") as f:
        json.dump(styles_json, f, ensure_ascii=False, indent=2)
        f.write("\n")

    index_path = os.path.join(api_dir, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index_json, f, ensure_ascii=False, indent=2)
        f.write("\n")

    with_example = sum(1 for s in styles if s["example_output"] is not None)
    print(f"Wrote {styles_path} ({len(styles)} styles, {len(styles_json['categories'])} categories, {with_example} with example_output)")
    print(f"Wrote {index_path}")


if __name__ == "__main__":
    main()

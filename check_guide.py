"""Pre-publish checks for a guide fragment in content/guides/.

Usage:  python check_guide.py <slug>

Checks: banned phrases (from content/style/banned-phrases.txt), em/en dashes,
6-word phrases shared with any other guide, internal links that don't resolve,
body word count (excluding <script> and the Sources section) and H2 count.
Exits 1 if any hard check fails.
"""
import html
import os
import re
import sys

GUIDES_DIR = 'content/guides'
BANNED_FILE = 'content/style/banned-phrases.txt'
NGRAM = 6


def load_banned():
    with open(BANNED_FILE, encoding='utf-8') as f:
        return [line.strip().lower() for line in f
                if line.strip() and not line.lstrip().startswith('#')]


def visible_text(fragment):
    fragment = re.sub(r'(?s)<script.*?</script>', ' ', fragment)
    return html.unescape(re.sub(r'<[^>]+>', ' ', fragment))


def words(text):
    return re.findall(r"[A-Za-z0-9'’-]+", text)


def ngrams(text):
    ws = [w.lower() for w in words(text)]
    return {' '.join(ws[i:i + NGRAM]) for i in range(len(ws) - NGRAM + 1)}


def main(slug):
    path = os.path.join(GUIDES_DIR, f'{slug}.html')
    with open(path, encoding='utf-8') as f:
        fragment = f.read()
    text = visible_text(fragment)
    body = visible_text(fragment.split('<h2>Sources</h2>')[0])
    failed = False

    hits = [p for p in load_banned() if re.search(r'\b' + re.escape(p) + r'\b', text.lower())]
    print(f'banned phrases: {hits or "none"}')
    failed |= bool(hits)

    dashes = text.count('—') + text.count('–')
    print(f'em/en dashes: {dashes}')
    failed |= dashes > 0

    mine = ngrams(text)
    for other in sorted(os.listdir(GUIDES_DIR)):
        if not other.endswith('.html') or other == f'{slug}.html':
            continue
        with open(os.path.join(GUIDES_DIR, other), encoding='utf-8') as f:
            shared = sorted(mine & ngrams(visible_text(f.read())))
        print(f'shared {NGRAM}-word phrases with {other}: {shared or "none"}')
        failed |= bool(shared)

    for href in re.findall(r'href="([^"]+)"', fragment):
        if re.match(r'(https?:|mailto:|#)', href):
            continue
        target = os.path.normpath(os.path.join('guides', href.split('#')[0]))
        if href.endswith('/'):
            target = os.path.join(target, 'index.html')
        ok = os.path.exists(target)
        print(f'link {href} -> {target}: {"ok" if ok else "MISSING"}')
        failed |= not ok

    print(f'body words (no script, no Sources): {len(words(body))}')
    print(f'H2 count: {fragment.count("<h2")}')
    print('RESULT:', 'FAIL' if failed else 'PASS')
    return 1 if failed else 0


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1]))

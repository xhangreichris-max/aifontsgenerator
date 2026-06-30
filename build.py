import json
import os
import html as html_module
from datetime import date

# ── Existing helpers ─────────────────────────────────────────────────────────

def generate_internal_links_html(links):
    html = ""
    for link in links:
        html += f'<li><a href="{link["url"]}">{link["text"]}</a></li>\n'
    return html

def generate_faq_html(faqs):
    html = ""
    for faq in faqs:
        if faq.get("q") and faq.get("a"):
            html += f'''<details class="faq-item">
<summary>{faq["q"]}
<p>{faq["a"]}</p>
</details>\n'''
    return html

def build_pages():
    with open('pages-config.json', 'r', encoding='utf-8') as f:
        pages = json.load(f)

    # Skip letter pages — handled by build_letter_pages()
    pages = [p for p in pages if p.get('type') != 'letter-page']

    with open('template.html', 'r', encoding='utf-8') as f:
        template = f.read()

    with open('articles.json', 'r', encoding='utf-8') as f:
        articles = json.load(f)

    for page in pages:
        slug = page['slug']
        article = articles.get(slug, {})
        faqs = article.get('faq', [])

        categories_str = ','.join(page['categories'])
        internal_links_html = generate_internal_links_html(page['internal_links'])
        faq_html = generate_faq_html(faqs)

        html = template
        html = html.replace('{{TITLE}}', page['title'])
        html = html.replace('{{META_DESC}}', page['meta_desc'])
        html = html.replace('{{H1}}', page['h1'])
        html = html.replace('{{HERO_SUB}}', page['hero_sub'])
        html = html.replace('{{DEFAULT_TEXT}}', page['default_text'])
        html = html.replace('{{CATEGORIES}}', categories_str)
        html = html.replace('{{FILENAME}}', page['filename'])
        html = html.replace('{{SLUG}}', page['slug'])
        html = html.replace('{{HERO_IMAGE}}', page.get('hero_image', 'images/article-hero.png'))
        html = html.replace('{{WHAT_IS}}', article.get('what_is', ''))
        html = html.replace('{{HOW_TO_USE}}', article.get('how_to_use', ''))
        html = html.replace('{{FOR_INSTAGRAM}}', article.get('for_instagram', ''))
        html = html.replace('{{FOR_DISCORD}}', article.get('for_discord', ''))
        html = html.replace('{{FOR_GAMING}}', article.get('for_gaming', ''))
        html = html.replace('{{PLATFORM_GUIDE}}', article.get('platform_guide', ''))
        html = html.replace('{{WHY_UNICODE}}', article.get('why_unicode', ''))
        html = html.replace('{{FAQ_HTML}}', faq_html)
        html = html.replace('{{INTERNAL_LINKS_HTML}}', internal_links_html)

        with open(page['filename'], 'w', encoding='utf-8') as f:
            f.write(html)

        print(f"Built: {page['filename']}")

    print(f"\nDone. {len(pages)} pages generated.")


# ── Letter page infrastructure ───────────────────────────────────────────────

# 15 clean Unicode styles — uppercase A-Z maps, taken directly from
# fonts-core.js BASES where they exist, computed via codepoint offset elsewhere.
LETTER_STYLES = [
    ('Bold',             {'A':'𝐀','B':'𝐁','C':'𝐂','D':'𝐃','E':'𝐄','F':'𝐅','G':'𝐆','H':'𝐇','I':'𝐈','J':'𝐉','K':'𝐊','L':'𝐋','M':'𝐌','N':'𝐍','O':'𝐎','P':'𝐏','Q':'𝐐','R':'𝐑','S':'𝐒','T':'𝐓','U':'𝐔','V':'𝐕','W':'𝐖','X':'𝐗','Y':'𝐘','Z':'𝐙'}),
    ('Italic',           {'A':'𝐴','B':'𝐵','C':'𝐶','D':'𝐷','E':'𝐸','F':'𝐹','G':'𝐺','H':'𝐻','I':'𝐼','J':'𝐽','K':'𝐾','L':'𝐿','M':'𝑀','N':'𝑁','O':'𝑂','P':'𝑃','Q':'𝑄','R':'𝑅','S':'𝑆','T':'𝑇','U':'𝑈','V':'𝑉','W':'𝑊','X':'𝑋','Y':'𝑌','Z':'𝑍'}),
    ('Bold Italic',      {'A':'𝑨','B':'𝑩','C':'𝑪','D':'𝑫','E':'𝑬','F':'𝑭','G':'𝑮','H':'𝑯','I':'𝑰','J':'𝑱','K':'𝑲','L':'𝑳','M':'𝑴','N':'𝑵','O':'𝑶','P':'𝑷','Q':'𝑸','R':'𝑹','S':'𝑺','T':'𝑻','U':'𝑼','V':'𝑽','W':'𝑾','X':'𝑿','Y':'𝒀','Z':'𝒁'}),
    # Cursive Light: lookup table only — B→ℬ, E→ℰ, F→ℱ, H→ℋ, I→ℐ, L→ℒ, M→ℳ, R→ℛ are
    # pre-assigned Unicode codepoints that break the sequential offset pattern.
    ('Cursive Light',    {'A':'𝒜','B':'ℬ','C':'𝒞','D':'𝒟','E':'ℰ','F':'ℱ','G':'𝒢','H':'ℋ','I':'ℐ','J':'𝒥','K':'𝒦','L':'ℒ','M':'ℳ','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'ℛ','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵'}),
    # Cursive Bold: clean sequential offsets from U+1D4D0, no exceptions.
    ('Cursive Bold',     {'A':'𝓐','B':'𝓑','C':'𝓒','D':'𝓓','E':'𝓔','F':'𝓕','G':'𝓖','H':'𝓗','I':'𝓘','J':'𝓙','K':'𝓚','L':'𝓛','M':'𝓜','N':'𝓝','O':'𝓞','P':'𝓟','Q':'𝓠','R':'𝓡','S':'𝓢','T':'𝓣','U':'𝓤','V':'𝓥','W':'𝓦','X':'𝓧','Y':'𝓨','Z':'𝓩'}),
    ('Gothic',           {'A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'ℌ','I':'ℑ','J':'𝔍','K':'𝔎','L':'𝔏','M':'𝔐','N':'𝔑','O':'𝒪','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘','V':'𝔙','W':'𝔚','X':'𝔛','Y':'𝔜','Z':'ℨ'}),
    ('Double-Struck',    {'A':'𝔸','B':'𝔹','C':'ℂ','D':'𝔻','E':'𝔼','F':'𝔽','G':'𝔾','H':'ℍ','I':'𝕀','J':'𝕁','K':'𝕂','L':'𝕃','M':'𝕄','N':'ℕ','O':'𝕆','P':'ℙ','Q':'ℚ','R':'ℝ','S':'𝕊','T':'𝕋','U':'𝕌','V':'𝕍','W':'𝕎','X':'𝕏','Y':'𝕐','Z':'ℤ'}),
    ('Bold Gothic',      {'A':'𝕬','B':'𝕭','C':'𝕮','D':'𝕯','E':'𝕰','F':'𝕱','G':'𝕲','H':'𝕳','I':'𝕴','J':'𝕵','K':'𝕶','L':'𝕷','M':'𝕸','N':'𝕹','O':'𝕺','P':'𝕻','Q':'𝕼','R':'𝕽','S':'𝕾','T':'𝕿','U':'𝖀','V':'𝖁','W':'𝖂','X':'𝖃','Y':'𝖄','Z':'𝖅'}),
    ('Sans-Serif',       {'A':'𝖠','B':'𝖡','C':'𝖢','D':'𝖣','E':'𝖤','F':'𝖥','G':'𝖦','H':'𝖧','I':'𝖨','J':'𝖩','K':'𝖪','L':'𝖫','M':'𝖬','N':'𝖭','O':'𝖮','P':'𝖯','Q':'𝖰','R':'𝖱','S':'𝖲','T':'𝖳','U':'𝖴','V':'𝖵','W':'𝖶','X':'𝖷','Y':'𝖸','Z':'𝖹'}),
    ('Sans Bold',        {'A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭'}),
    ('Sans Italic',      {'A':'𝘈','B':'𝘉','C':'𝘊','D':'𝘋','E':'𝘌','F':'𝘍','G':'𝘎','H':'𝘏','I':'𝘐','J':'𝘑','K':'𝘒','L':'𝘓','M':'𝘔','N':'𝘕','O':'𝘖','P':'𝘗','Q':'𝘘','R':'𝘙','S':'𝘚','T':'𝘛','U':'𝘜','V':'𝘝','W':'𝘞','X':'𝘟','Y':'𝘠','Z':'𝘡'}),
    ('Sans Bold Italic', {'A':'𝘼','B':'𝘽','C':'𝘾','D':'𝘿','E':'𝙀','F':'𝙁','G':'𝙂','H':'𝙃','I':'𝙄','J':'𝙅','K':'𝙆','L':'𝙇','M':'𝙈','N':'𝙉','O':'𝙊','P':'𝙋','Q':'𝙌','R':'𝙍','S':'𝙎','T':'𝙏','U':'𝙐','V':'𝙑','W':'𝙒','X':'𝙓','Y':'𝙔','Z':'𝙕'}),
    ('Monospace',        {'A':'𝙰','B':'𝙱','C':'𝙲','D':'𝙳','E':'𝙴','F':'𝙵','G':'𝙶','H':'𝙷','I':'𝙸','J':'𝙹','K':'𝙺','L':'𝙻','M':'𝙼','N':'𝙽','O':'𝙾','P':'𝙿','Q':'𝚀','R':'𝚁','S':'𝚂','T':'𝚃','U':'𝚄','V':'𝚅','W':'𝚆','X':'𝚇','Y':'𝚈','Z':'𝚉'}),
    ('Fullwidth',        {'A':'Ａ','B':'Ｂ','C':'Ｃ','D':'Ｄ','E':'Ｅ','F':'Ｆ','G':'Ｇ','H':'Ｈ','I':'Ｉ','J':'Ｊ','K':'Ｋ','L':'Ｌ','M':'Ｍ','N':'Ｎ','O':'Ｏ','P':'Ｐ','Q':'Ｑ','R':'Ｒ','S':'Ｓ','T':'Ｔ','U':'Ｕ','V':'Ｖ','W':'Ｗ','X':'Ｘ','Y':'Ｙ','Z':'Ｚ'}),
    ('Circled',          {'A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ','K':'Ⓚ','L':'Ⓛ','M':'Ⓜ','N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ','U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ'}),
]

# Per-letter details injected into FAQ answer 3 for genuine variation
LETTER_DETAILS = {
    'A': ('Cursive Bold and Bold styles', 'A starts more usernames than any other letter and the Cursive Light 𝒜 and Cursive Bold 𝓐 are especially popular for aesthetic Instagram bios'),
    'B': ('bold and gothic styles', 'B in bold Unicode stands out strongly in gaming kill feeds and the gothic 𝔅 is a favourite for metal-themed Discord servers'),
    'C': ('script and cursive styles', 'C has a naturally curved shape that looks particularly elegant in script — the light cursive 𝒞 is one of the cleaner single-letter Unicode forms'),
    'D': ('double-struck and bold styles', 'D in double-struck (𝔻) has a clean mathematical appearance that works well for tech and gaming handles'),
    'E': ('script and italic styles', 'E is one of the most common letters in English usernames and the script ℰ gives it an instantly recognisable elegant form'),
    'F': ('gothic and bold styles', 'F in gothic (𝔉) and the script ℱ are among the most visually distinctive single-letter Unicode forms available'),
    'G': ('gothic and sans-serif styles', 'G in gothic style (𝔊) is popular in metal and gaming communities — the angular form reads as aggressive and deliberate'),
    'H': ('bold and sans-serif styles', 'H has a naturally symmetrical structure that reads well in bold sans-serif at any size, making it popular for gaming names and initials'),
    'I': ('script and italic styles', 'I in cursive (ℐ) has a single elegant stroke that is far more distinctive than the plain capital — it is commonly used in artistic usernames'),
    'J': ('bold script and cursive styles', 'J in cursive has a distinctive descending loop that makes it stand out in display contexts — the bold script 𝓙 is the most recognisable form'),
    'K': ('gothic and bold styles', 'K is one of the most popular starting letters for gaming names — Kira, Killer, King — and the gothic 𝔎 and bold 𝐊 both read as powerful'),
    'L': ('script and double-struck styles', 'the script ℒ is one of the most elegant single-letter Unicode symbols and is widely used in creative display names and artistic initials'),
    'M': ('script and bold styles', 'the script ℳ is the mathematical symbol for script M and one of the most recognised decorative Unicode letters — it appears frequently in brand initials and stylised usernames'),
    'N': ('double-struck and gothic styles', 'the double-struck ℕ is the mathematical symbol for natural numbers, giving it a scholarly look that stands out in intellectual or tech-themed usernames'),
    'O': ('circled and double-struck styles', 'O in circled style (Ⓞ) creates a distinctive bubble effect, while the double-struck 𝕆 is cleaner for minimal display name use'),
    'P': ('gothic and double-struck styles', 'the double-struck ℙ is the mathematical symbol for prime numbers — a subtle detail that appeals to maths and tech communities'),
    'Q': ('bold and gothic styles', 'Q is rare as a starting letter for usernames, which means a stylised Q stands out immediately — the bold 𝐐 and gothic 𝔔 both make strong visual statements'),
    'R': ('gothic and double-struck styles', 'the double-struck ℝ is the mathematical symbol for real numbers, and the gothic ℜ is the symbol for the real part of a complex number — both are recognisable to tech and science audiences'),
    'S': ('bold script and cursive styles', 'S in cursive and script styles has a flowing, symmetrical appearance that is extremely popular for aesthetic usernames and personalised initials'),
    'T': ('bold and sans-serif styles', 'T has clean geometric lines that work especially well in sans-serif bold — it is one of the most-used letters in gaming tags and streamer aliases'),
    'U': ('bold and cursive styles', 'U appears in popular username themes like Ultra, Unknown, and Unicorn — the bold 𝐔 is clean and readable while the cursive 𝒰 has an elegant sweeping form'),
    'V': ('bold italic and gothic styles', 'V is strongly associated with Victory in gaming culture — the bold italic 𝑽 and gothic 𝔙 both carry that aggressive, winning energy'),
    'W': ('fullwidth and bold styles', 'W is the widest capital letter in the Roman alphabet — the fullwidth Ｗ makes it even more imposing and is popular for display names where visual weight matters'),
    'X': ('bold and gothic styles', 'X is the go-to letter for edgy gaming usernames and brand marks — the gothic 𝔛 and double-struck 𝕏 are particularly popular, with the latter recognisable as the former Twitter symbol'),
    'Y': ('bold script and cursive styles', 'Y in cursive has a distinctive descending tail that looks elegant in display names — the bold script 𝓨 is especially popular for personalised initials'),
    'Z': ('gothic and double-struck styles', 'Z in double-struck (ℤ) is the mathematical symbol for integers, and in gothic (ℨ) it is one of the most visually striking single-letter Unicode forms — popular for edgy usernames like Zoro, Zero, and Zeus'),
}


def generate_letter_grid_html(letter):
    rows = []
    for style_name, char_map in LETTER_STYLES:
        char = char_map.get(letter.upper(), letter)
        safe_attr = html_module.escape(char, quote=True)
        rows.append(
            f'<div class="letter-font-row">'
            f'<span class="lf-name">{style_name}</span>'
            f'<span class="lf-char" data-char="{safe_attr}" onclick="copyLetter(this)" title="Click to copy">{char}</span>'
            f'</div>'
        )
    return '\n'.join(rows)


def generate_letter_faq_html(letter):
    popular, note = LETTER_DETAILS[letter]
    return f'''<details class="faq-item">
<summary>How do I copy and paste the letter {letter} in fancy fonts?
<p>Click any character in the grid above — it copies to your clipboard instantly. Each Unicode {letter} shown is a real text character, not an image, so it pastes directly into Instagram bios, Discord nicknames, TikTok display names, and gaming name fields without any font installation on either end. The live generator below also lets you type full words or names and copy complete styled text.</p>
</details>
<details class="faq-item">
<summary>Does fancy {letter} text work on Instagram and Discord?
<p>Yes. Every character in the grid uses standard Unicode, which both Instagram and Discord render correctly. Bold, italic, script, gothic, and double-struck {letter} all paste cleanly into bios, display names, and server nicknames. If a specific character shows as a box on a particular platform, switch to a bold or sans-serif variant — those have the widest compatibility across devices and client versions.</p>
</details>
<details class="faq-item">
<summary>What\'s the most popular font style for the letter {letter}?
<p>The {popular} tend to get the most use for {letter}. {note}. The best choice depends on context — bold and sans-serif variants are easiest to read at the small sizes games use for player names, while script and gothic styles have more visual impact in profile display contexts.</p>
</details>'''


def generate_az_grid_html(current_letter):
    parts = []
    for char in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
        url = f'different-fonts-{char.lower()}.html'
        if char == current_letter:
            parts.append(f'<a href="{url}" class="az-link az-current" aria-current="page">{char}</a>')
        else:
            parts.append(f'<a href="{url}" class="az-link">{char}</a>')
    return '<div class="az-browse-grid">\n' + '\n'.join(parts) + '\n</div>'


def build_letter_pages():
    with open('pages-config.json', 'r', encoding='utf-8') as f:
        all_pages = json.load(f)

    letter_pages = [p for p in all_pages if p.get('type') == 'letter-page']

    if not letter_pages:
        print("No letter pages found in pages-config.json.")
        return

    with open('template-letter.html', 'r', encoding='utf-8') as f:
        template = f.read()

    for page in letter_pages:
        letter = page['letter']
        categories_str = ','.join(page['categories'])
        letter_grid_html = generate_letter_grid_html(letter)
        faq_html = generate_letter_faq_html(letter)
        internal_links_html = generate_internal_links_html(page['internal_links'])
        az_grid_html = generate_az_grid_html(letter)

        output = template
        output = output.replace('{{TITLE}}', page['title'])
        output = output.replace('{{META_DESC}}', page['meta_desc'])
        output = output.replace('{{H1}}', page['h1'])
        output = output.replace('{{HERO_SUB}}', page['hero_sub'])
        output = output.replace('{{DEFAULT_TEXT}}', page['default_text'])
        output = output.replace('{{CATEGORIES}}', categories_str)
        output = output.replace('{{FILENAME}}', page['filename'])
        output = output.replace('{{SLUG}}', page['slug'])
        output = output.replace('{{LETTER}}', letter)
        output = output.replace('{{LETTER_LOWER}}', letter.lower())
        output = output.replace('{{LETTER_GRID}}', letter_grid_html)
        output = output.replace('{{FAQ_HTML}}', faq_html)
        output = output.replace('{{INTERNAL_LINKS_HTML}}', internal_links_html)
        output = output.replace('{{AZ_GRID}}', az_grid_html)

        with open(page['filename'], 'w', encoding='utf-8') as f:
            f.write(output)

        print(f"Built: {page['filename']}")

    update_sitemap(letter_pages)
    print(f"\nDone. {len(letter_pages)} letter pages generated.")


def update_sitemap(letter_pages):
    today = date.today().isoformat()

    subpage_files = [
        'glitch-text.html', 'bold-text.html', 'cursive-text.html',
        'tiny-text.html', 'zalgo-text.html', 'upside-down-text.html',
        'gothic-text.html', 'creepy-text.html', 'strikethrough-text.html',
        'unicode-text.html', 'bubble-text.html', 'mirror-text.html',
        'aesthetic-text.html', 'vaporwave-text.html', 'runic-text.html',
    ]

    def url_block(loc, priority, changefreq):
        return (f'  <url>\n'
                f'    <loc>{loc}</loc>\n'
                f'    <lastmod>{today}</lastmod>\n'
                f'    <changefreq>{changefreq}</changefreq>\n'
                f'    <priority>{priority}</priority>\n'
                f'  </url>')

    blocks = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
              '']

    base = 'https://aifontsgenerator.com'
    blocks.append(url_block(f'{base}/', '1.0', 'weekly'))
    blocks.append(url_block(f'{base}/categories.html', '0.9', 'weekly'))

    for f in subpage_files:
        blocks.append(url_block(f'{base}/{f}', '0.8', 'monthly'))

    for lp in sorted(letter_pages, key=lambda p: p['letter']):
        blocks.append(url_block(f'{base}/{lp["filename"]}', '0.7', 'monthly'))

    blocks.append(url_block(f'{base}/about.html', '0.5', 'yearly'))
    blocks.append(url_block(f'{base}/privacy-policy.html', '0.3', 'yearly'))
    blocks.append(url_block(f'{base}/contact.html', '0.3', 'yearly'))

    blocks.append('')
    blocks.append('</urlset>')

    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write('\n'.join(blocks) + '\n')

    print(f"Updated sitemap.xml ({len(letter_pages)} letter pages included)")


# ── Homepage preview generator ────────────────────────────────────────────────

import re

THIN = ' '

# ── helpers ──────────────────────────────────────────────────────────────────

def _am(text, m):
    """apply_map: char-by-char lookup with case fallback."""
    out = ''
    for ch in text:
        out += m.get(ch) or m.get(ch.lower()) or m.get(ch.upper()) or ch
    return out

def _af(text, marks, n):
    """apply_fixed: deterministic combining-mark cycle (n marks per letter)."""
    out = ''; mi = 0
    for ch in text:
        if ch.isalpha() or ch.isdigit():
            out += ch + ''.join(marks[(mi + j) % len(marks)] for j in range(n))
            mi += n
        else:
            out += ch
    return out

def _rf(text, cmap, pre, post, palette):
    """remix_fixed: map + always insert palette[0] + wrap in frame."""
    core = _am(text, cmap)
    if palette:
        sym = palette[0]
        core = sym + THIN + core + THIN + sym
    return (pre or '') + THIN + core + THIN + (post or '')

def _weave(text, seq):
    """Alternate combining marks across non-space chars."""
    i = 0; out = ''
    for ch in text:
        if ch.strip():
            out += ch + seq[i % len(seq)]; i += 1
        else:
            out += ch
    return out

# ── base alphabets ────────────────────────────────────────────────────────────

SU = {'A':'𝓐','B':'𝓑','C':'𝓒','D':'𝓓','E':'𝓔','F':'𝓕','G':'𝓖','H':'𝓗','I':'𝓘','J':'𝓙','K':'𝓚','L':'𝓛','M':'𝓜','N':'𝓝','O':'𝓞','P':'𝓟','Q':'𝓠','R':'𝓡','S':'𝓢','T':'𝓣','U':'𝓤','V':'𝓥','W':'𝓦','X':'𝓧','Y':'𝓨','Z':'𝓩'}
SL = {'a':'𝓪','b':'𝓫','c':'𝓬','d':'𝓭','e':'𝓮','f':'𝓯','g':'𝓰','h':'𝓱','i':'𝓲','j':'𝓳','k':'𝓴','l':'𝓵','m':'𝓶','n':'𝓷','o':'𝓸','p':'𝓹','q':'𝓺','r':'𝓻','s':'𝓼','t':'𝓽','u':'𝓾','v':'𝓿','w':'𝔀','x':'𝔁','y':'𝔂','z':'𝔃'}
FU = {'A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'ℌ','I':'ℑ','J':'𝔍','K':'𝔎','L':'𝔏','M':'𝔐','N':'𝔑','O':'𝒪','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘','V':'𝔙','W':'𝔚','X':'𝔛','Y':'𝔜','Z':'ℨ'}
FL = {'a':'𝔞','b':'𝔟','c':'𝔠','d':'𝔡','e':'𝔢','f':'𝔣','g':'𝔤','h':'𝔥','i':'𝔦','j':'𝔧','k':'𝔨','l':'𝔩','m':'𝔪','n':'𝔫','o':'𝔬','p':'𝔭','q':'𝔮','r':'𝔯','s':'𝔰','t':'𝔱','u':'𝔲','v':'𝔳','w':'𝔴','x':'𝔵','y':'𝔶','z':'𝔷'}
DU = {'A':'𝔸','B':'𝔹','C':'ℂ','D':'𝔻','E':'𝔼','F':'𝔽','G':'𝔾','H':'ℍ','I':'𝕀','J':'𝕁','K':'𝕂','L':'𝕃','M':'𝕄','N':'ℕ','O':'𝕆','P':'ℙ','Q':'ℚ','R':'ℝ','S':'𝕊','T':'𝕋','U':'𝕌','V':'𝕍','W':'𝕎','X':'𝕏','Y':'𝕐','Z':'ℤ'}
DL = {'a':'𝕒','b':'𝕓','c':'𝕔','d':'𝕕','e':'𝕖','f':'𝕗','g':'𝕘','h':'𝕙','i':'𝕚','j':'𝕛','k':'𝕜','l':'𝕝','m':'𝕞','n':'𝕟','o':'𝕠','p':'𝕡','q':'𝕢','r':'𝕣','s':'𝕤','t':'𝕥','u':'𝕦','v':'𝕧','w':'𝕨','x':'𝕩','y':'𝕪','z':'𝕫'}
MU = {'A':'𝙰','B':'𝙱','C':'𝙲','D':'𝙳','E':'𝙴','F':'𝙵','G':'𝙶','H':'𝙷','I':'𝙸','J':'𝙹','K':'𝙺','L':'𝙻','M':'𝙼','N':'𝙽','O':'𝙾','P':'𝙿','Q':'𝚀','R':'𝚁','S':'𝚂','T':'𝚃','U':'𝚄','V':'𝚅','W':'𝚆','X':'𝚇','Y':'𝚈','Z':'𝚉'}
ML = {'a':'𝚊','b':'𝚋','c':'𝚌','d':'𝚍','e':'𝚎','f':'𝚏','g':'𝚐','h':'𝚑','i':'𝚒','j':'𝚓','k':'𝚔','l':'𝚕','m':'𝚖','n':'𝚗','o':'𝚘','p':'𝚙','q':'𝚚','r':'𝚛','s':'𝚜','t':'𝚝','u':'𝚞','v':'𝚟','w':'𝚠','x':'𝚡','y':'𝚢','z':'𝚣'}
WU = {'A':'Ａ','B':'Ｂ','C':'Ｃ','D':'Ｄ','E':'Ｅ','F':'Ｆ','G':'Ｇ','H':'Ｈ','I':'Ｉ','J':'Ｊ','K':'Ｋ','L':'Ｌ','M':'Ｍ','N':'Ｎ','O':'Ｏ','P':'Ｐ','Q':'Ｑ','R':'Ｒ','S':'Ｓ','T':'Ｔ','U':'Ｕ','V':'Ｖ','W':'Ｗ','X':'Ｘ','Y':'Ｙ','Z':'Ｚ'}
WL = {'a':'ａ','b':'ｂ','c':'ｃ','d':'ｄ','e':'ｅ','f':'ｆ','g':'ｇ','h':'ｈ','i':'ｉ','j':'ｊ','k':'ｋ','l':'ｌ','m':'ｍ','n':'ｎ','o':'ｏ','p':'ｐ','q':'ｑ','r':'ｒ','s':'ｓ','t':'ｔ','u':'ｕ','v':'ｖ','w':'ｗ','x':'ｘ','y':'ｙ','z':'ｚ'}

def _cm(upper_u, lower_l, overrides=None):
    m = {**upper_u, **lower_l}
    if overrides:
        m.update(overrides)
    return m

# ── individual complex transforms ─────────────────────────────────────────────

def _vaporwave(text):
    return ' '.join(_am(text, {**WU, **WL}))

def _bubble_pop(text):
    circ = {'a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ','k':'ⓚ','l':'ⓛ','m':'ⓜ','n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ','u':'ⓤ','v':'ⓥ','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'𝓏','A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ','K':'Ⓚ','L':'Ⓛ','M':'Ⓜ','N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ','U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ'}
    out = ''; i = 0
    for ch in text:
        if not ch.strip(): out += ch; continue
        out += circ.get(ch, ch) if i % 2 == 0 else ch; i += 1
    return out

def _super_sub(text):
    sup = {'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','q':'۹','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ'}
    sub = {'a':'ₐ','b':'♭','c':'꜀','d':'Ꮷ','e':'ₑ','f':'բ','g':'₉','h':'ₕ','i':'ᵢ','j':'ⱼ','k':'ₖ','l':'ₗ','m':'ₘ','n':'ₙ','o':'ₒ','p':'ₚ','q':'૧','r':'ᵣ','s':'ₛ','t':'ₜ','u':'ᵤ','v':'ᵥ','w':'w','x':'ₓ','y':'ᵧ','z':'₂'}
    out = ''; pos = 0
    for ch in text:
        lc = ch.lower()
        if pos % 3 == 0: out += sup.get(lc, ch)
        elif pos % 3 == 1: out += sub.get(lc, ch)
        else: out += ch
        if ch.strip(): pos += 1
    return out

def _cyborg(text):
    vowels = set('AEIOUaeiou')
    runic = {'A':'ᚨ','B':'ᛒ','C':'ᚲ','D':'ᛞ','E':'ᛖ','F':'ᚠ','G':'ᚷ','H':'ᚺ','I':'ᛁ','J':'ᛃ','K':'ᚲ','L':'ᛚ','M':'ᛗ','N':'ᚾ','O':'ᛟ','P':'ᛈ','Q':'ᛩ','R':'ᚱ','S':'ᛊ','T':'ᛏ','U':'ᚢ','V':'ᚡ','W':'ᚹ','X':'ᛪ','Y':'ᛦ','Z':'ᛉ'}
    mono = {**MU, **ML}
    out = ''
    for ch in text:
        out += runic.get(ch.upper(), ch) if ch in vowels else mono.get(ch, ch)
    return out

def _demonic(text):
    frak = {'A':'𝕬','B':'𝕭','C':'𝕮','D':'𝕯','E':'𝕰','F':'𝕱','G':'𝕲','H':'𝕳','I':'𝕴','J':'𝕵','K':'𝕶','L':'𝕷','M':'𝕸','N':'𝕹','O':'𝕺','P':'𝕻','Q':'𝕼','R':'𝕽','S':'𝕾','T':'𝕿','U':'𝖀','V':'𝖁','W':'𝖂','X':'𝖃','Y':'𝖄','Z':'𝖅','a':'𝖆','b':'𝖇','c':'𝖈','d':'𝖉','e':'𝖊','f':'𝖋','g':'𝖌','h':'𝖍','i':'𝖎','j':'𝖏','k':'𝖐','l':'𝖑','m':'𝖒','n':'𝖓','o':'𝖔','p':'𝖕','q':'𝖖','r':'𝖗','s':'𝖘','t':'𝖙','u':'𝖚','v':'𝖛','w':'𝖜','x':'𝖝','y':'𝖞','z':'𝖟'}
    base = _am(text, frak); out = ''
    for ch in base:
        out += ch + '̛' if (ch.strip() and (ch.isalpha() or ch.isdigit())) else ch
    return out

def _voltage(text):
    marks = ['̼', '̰']; out = ''; i = 0
    for ch in text:
        if ch.isalpha() or ch.isdigit():
            out += '⧼' + ch + marks[i % 2] + '⧽'; i += 1
        else:
            out += ch
    return '⚡💀 ' + out + ' ⚡💀'

def _radar(text):
    out = ''
    for ch in text:
        out += ch + '͒͛̾' if (ch.isalpha() or ch.isdigit()) else ch
    return '◈⟨⟨ ' + out + ' ⟩⟩◈'

def _quill(text):
    out = ''
    for ch in text:
        out += '『' + ch + '』' if (ch.isalpha() or ch.isdigit()) else ch
    return '⚔️彡 ' + out + ' 彡⚔️'

def _death_march(text):
    chars = list(text); out = ''
    for i, ch in enumerate(chars):
        if ch.isalpha() or ch.isdigit():
            out += ch + ('⑊' if i < len(chars) - 1 else '')
        else:
            out += ch
    return '『†』 ' + out + ' 『†』'

def _encased(text):
    out = ''
    for ch in text:
        out += ch + '̲̅' if (ch.isalpha() or ch.isdigit()) else ch
    return out

def _ethereal(text):
    marks = ['̊', '̇']
    return _af(text, marks, 1)

def _spiral(text):
    marks = ['̰', '̭', '̱', '̮']
    return _af(text, marks, 1)

def _stitched_thin(text):
    weaved = _weave(text, ['̰', '̤'])
    return THIN.join(list(weaved))

def _reverse_order(text):
    return text[::-1]

def _heavy_frame(text):
    n = len(text)
    return f'╔═{"═" * n}═╗\n║  {text}  ║\n╚═{"═" * n}═╝'

# ── per-style maps (reused across multiple transforms) ────────────────────────

_BOLD_MAP = {'a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷','k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝗦','t':'𝗧','u':'𝗨','v':'𝗩','w':'𝗪','x':'𝗫','y':'𝗬','z':'𝗭','A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭'}
_ITALIC_MAP = {'a':'𝘢','b':'𝘣','c':'𝘤','d':'𝘥','e':'𝘦','f':'𝘧','g':'𝘨','h':'𝘩','i':'𝘪','j':'𝘫','k':'𝘬','l':'𝘭','m':'𝘮','n':'𝘯','o':'𝘰','p':'𝘱','q':'𝘲','r':'𝘳','s':'𝘴','t':'𝘵','u':'𝘶','v':'𝘷','w':'𝘸','x':'𝘹','y':'𝘺','z':'𝘻','A':'𝘈','B':'𝘉','C':'𝘊','D':'𝘋','E':'𝘌','F':'𝘍','G':'𝘎','H':'𝘏','I':'𝘐','J':'𝘑','K':'𝘒','L':'𝘓','M':'𝘔','N':'𝘕','O':'𝘖','P':'𝘗','Q':'𝘘','R':'𝘙','S':'𝘚','T':'𝘛','U':'𝘜','V':'𝘝','W':'𝘞','X':'𝘟','Y':'𝘠','Z':'𝘡'}
_CURSIVE_MAP = {'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'ℯ','f':'𝒻','g':'ℊ','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁','m':'𝓂','n':'𝓃','o':'ℴ','p':'𝓅','q':'𝓆','r':'𝓇','s':'𝓈','t':'𝓉','u':'𝓊','v':'𝓋','w':'𝓌','x':'𝓍','y':'𝓎','z':'𝓏','A':'𝒜','B':'ℬ','C':'𝒞','D':'𝒟','E':'ℰ','F':'ℱ','G':'𝒢','H':'ℋ','I':'ℐ','J':'𝒥','K':'𝒦','L':'ℒ','M':'ℳ','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'ℛ','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵'}
_BOLD_SCRIPT_MAP = {**SU, **SL}
_BOLD_ITALIC_MAP = {'A':'𝑨','B':'𝑩','C':'𝑪','D':'𝑫','E':'𝑬','F':'𝑭','G':'𝑮','H':'𝑯','I':'𝑰','J':'𝑱','K':'𝑲','L':'𝑳','M':'𝑴','N':'𝑵','O':'𝑶','P':'𝑷','Q':'𝑸','R':'𝑹','S':'𝑺','T':'𝑻','U':'𝑼','V':'𝑽','W':'𝑾','X':'𝑿','Y':'𝒀','Z':'𝒁','a':'𝒂','b':'𝒃','c':'𝒄','d':'𝒅','e':'𝒆','f':'𝒇','g':'𝒈','h':'𝒉','i':'𝒊','j':'𝒋','k':'𝒌','l':'𝒍','m':'𝒎','n':'𝒏','o':'𝒐','p':'𝒑','q':'𝒒','r':'𝒓','s':'𝒔','t':'𝒕','u':'𝒖','v':'𝒗','w':'𝒘','x':'𝒙','y':'𝒚','z':'𝒛'}
_SANS_BOLD_MAP = {'A':'𝘼','B':'𝘽','C':'𝘾','D':'𝘿','E':'𝙀','F':'𝙁','G':'𝙂','H':'𝙃','I':'𝙄','J':'𝙅','K':'𝙆','L':'𝙇','M':'𝙈','N':'𝙉','O':'𝙊','P':'𝙋','Q':'𝙌','R':'𝙍','S':'𝙎','T':'𝙏','U':'𝙐','V':'𝙑','W':'𝙒','X':'𝙓','Y':'𝙔','Z':'𝙕','a':'𝙖','b':'𝙗','c':'𝙘','d':'𝙙','e':'𝙚','f':'𝙛','g':'𝙜','h':'𝙝','i':'𝙞','j':'𝙟','k':'𝙠','l':'𝙡','m':'𝙢','n':'𝙣','o':'𝙤','p':'𝙥','q':'𝙦','r':'𝙧','s':'𝙨','t':'𝙩','u':'𝙪','v':'𝙫','w':'𝙬','x':'𝙭','y':'𝙮','z':'𝙯'}
_BOLD_SER_MAP = {'A':'𝐀','B':'𝐁','C':'𝐂','D':'𝐃','E':'𝐄','F':'𝐅','G':'𝐆','H':'𝐇','I':'𝐈','J':'𝐉','K':'𝐊','L':'𝐋','M':'𝐌','N':'𝐍','O':'𝐎','P':'𝐏','Q':'𝐐','R':'𝐑','S':'𝐒','T':'𝐓','U':'𝐔','V':'𝐕','W':'𝐖','X':'𝐗','Y':'𝐘','Z':'𝐙','a':'𝐚','b':'𝐛','c':'𝐜','d':'𝐝','e':'𝐞','f':'𝐟','g':'𝐠','h':'𝐡','i':'𝐢','j':'𝐣','k':'𝐤','l':'𝐥','m':'𝐦','n':'𝐧','o':'𝐨','p':'𝐩','q':'𝐪','r':'𝐫','s':'𝐬','t':'𝐭','u':'𝐮','v':'𝐯','w':'𝐰','x':'𝐱','y':'𝐲','z':'𝐳'}

# ── SAMPLE_WORDS: authoritative plaintext per style ──────────────────────────

SAMPLE_WORDS = {
    'Bold':'Stylish Name','Italic':'Stylish Name','Cursive':'Stylish Name',
    'Double Struck':'Stylish Name','Fraktur':'Stylish Name','Medieval':'Stylish Name',
    'Monospace':'Stylish Name','Circled':'Stylish Name','Full Width':'Stylish Name',
    'Vaporwave':'PUBG Name','Super/Subscript Mix':'PUBG Name','Bubble Pop':'PUBG Name',
    'Corrupted Glitch':'Stylish Name',
    'Cool':'Free Fire','Elegant Glitch':'Free Fire','Digital Decay':'Free Fire',
    'Cursed Script':'Free Fire','Glitch Hop':'Free Fire','Bracket Mix':'Free Fire',
    'Royal Mix':'Free Fire','Kool':'Free Fire','Neon':'Free Fire','Wierd':'Free Fire',
    'Signature':'Your Name','Voltage Cage':'Your Name','Ancient Seal':'Your Name',
    'Radar Lock':'Your Name','Quill Strike':'Your Name','Death March':'Your Name',
    'Hellenic Code':'Your Name','Rogue Alphabet':'Your Name',
    'Double Underline':'Your Name','IPA Rage':'Your Name',
    'Quantum Spell':'PUBG Name','Starlit Ice':'PUBG Name','Blood Rune':'PUBG Name',
    'Ember Strike':'PUBG Name','Cosmic Bloom':'PUBG Name','Dream Weaver':'PUBG Name',
    'Obsidian Flame':'PUBG Name','Soul Key':'PUBG Name',
    'Toxin Pulse':'PUBG Name','Toxic Pulse':'PUBG Name',
    'Shadow Circuit':'PUBG Name','Solar Sigil':'PUBG Name',
    'Necro Warden':'PUBG Name','Lunar Bloom':'PUBG Name','Frost Bite':'PUBG Name',
    'Arcane Tide':'PUBG Name','Iron Howl':'PUBG Name','Burning Sigil':'PUBG Name',
    'Abyss Crown':'PUBG Name','Ghost Pulse':'PUBG Name','Thunder Crest':'PUBG Name',
    'Astral Rune — Zodiac Seal':'Instagram Bio',
    'Venin Crown — Alchemical Sigil':'Instagram Bio',
    'Royal Gambit — Chess Fang':'Instagram Bio',
    'Ancient Oracle — Phoenician Sigil':'Instagram Bio',
    'Solar Relic — Old Italic Flame':'Instagram Bio',
    'Frozen Zodiac — Ice Rune':'Instagram Bio',
    'Sacred Bloom — Lotus Mark':'Instagram Bio',
    'Starveil Echo — Cosmic Song':'Instagram Bio',
    'Mystic Crown — Celestial Fang':'Instagram Bio',
    'Dragon Rune — Ember Fang':'Instagram Bio',
    'Jade Lotus — Mahjong Bloom':'Instagram Bio',
    'Twilight Mirror — Gothic Veil':'Instagram Bio',
    'Infernal Sigil — Hell Rune':'Instagram Bio',
    'Crown of Ages — Time Relic':'Instagram Bio',
    'Venom Halo — Toxic Glyph':'Instagram Bio',
    'Void Relic — Black Star':'Instagram Bio',
    'Phantom Lotus — Spirit Petal':'Instagram Bio',
    'Arcane Spiral — Chaos Sigil':'Instagram Bio',
    'Throne of Ash — Ember Crown':'Instagram Bio',
    'Obscura Flame — Tifinagh Ember':'Instagram Bio',
    'Ancient Glyphs':'Cool Name','Hieroglyphic Mix':'Cool Name','CJK Radicals':'Cool Name',
    'Cyborg Construct':'PUBG Name','Alien':'Free Fire','Decor':'Free Fire',
    'Skull & Stars':'Aesthetic Name','Heart Wings':'Aesthetic Name',
    'Fire Brackets':'Aesthetic Name','Pastel Hearts':'Aesthetic Name',
    'Sparkle Throw':'Aesthetic Name','Symbolic Hearts':'Aesthetic Name',
    'Eclectic Mix':'Aesthetic Name','Ornate Emblem':'Aesthetic Name',
    'Demonic Script':'PUBG Name','Heavy Frame':'Aesthetic Name',
    'Microcaps Hybrid':'Stylish Name','Squared Enclosure':'Stylish Name',
    'Wireframe Double':'Stylish Name','Box-Mono Tight':'Stylish Name',
    'Aura Halo':'Stylish Name','Shadow Underline':'Stylish Name',
    'Stitched Thin':'Stylish Name','Edge Glint':'Stylish Name',
    'Encased':'Stylish Name','Ethereal Sparkles':'Stylish Name',
    'CJK Strike':'Gaming Name','Tokyo Drift':'Gaming Name',
    'Ninja':'Gaming Name','Eastern Bold':'Gaming Name',
    'Slavic Strike':'Shadow','Thorned':'Shadow','Warzone':'Shadow',
    'Iron Fist':'Shadow','Blood Oath':'Shadow',
    'Floral Script':'Your Name','Blossom':'Your Name',
    'Butterfly':'Your Name','Elegant Serif':'Your Name',
    'Ultra Bold':'BGMI Name','Bold Italic':'BGMI Name',
    'Bold Script':'BGMI Name','Sans Bold':'BGMI Name',
    'Squared Caps':'Username','Filled Box':'Username','Corner Frame':'Username',
    'Crown Frame':'King Name','Royal Script':'King Name',
    'King Bold':'King Name','Emperor':'King Name',
    'Sweet Italic':'Kawaii Name','Fluffy':'Kawaii Name',
    'Bubble Cute':'Kawaii Name','Kawaii Small':'Kawaii Name','Rose Script':'Kawaii Name',
    'Flip Upside Down':'Flip Text','Mirror Reverse':'Flip Text','Reverse Order':'Flip Text',
    'Bullet Trail':'Sniper','Sniper':'Sniper','AK Frame':'Sniper','Combat':'Sniper',
    'Heart Script':'Love Name','Love Bold':'Love Name',
    'Cupid':'Love Name','Valentine':'Love Name',
    'Strikethrough':'Stylish Text','Double Strikethrough':'Stylish Text',
    'Underline Bold':'Stylish Text','Overline':'Stylish Text',
    'Double Overline':'Stylish Text','Tilde Wave':'Stylish Text',
    'Slash Through':'Stylish Text','Cross Hatch':'Stylish Text',
    'Underline Dots':'Stylish Text',
    'Angry Kaomoji':'Gamer Name','Happy Kaomoji':'Gamer Name',
    'Sad Kaomoji':'Gamer Name','Cool Kaomoji':'Gamer Name',
    'Cyrillic Strike':'Cyrillic Name','Soviet Bold':'Cyrillic Name',
    'Red Army':'Cyrillic Name','Slavic Mix':'Cyrillic Name',
    'Wave Mark':'Wavy Text','Zigzag':'Wavy Text',
    'Spiral':'Wavy Text','Curly Bold':'Wavy Text',
    'Star Frame':'Star Name','Galaxy Script':'Star Name',
    'Nova':'Star Name','Stellar Bold':'Star Name',
    'Zalgo Light':'Zalgo Text','Zalgo Heavy':'Zalgo Text',
    'Chaos':'Zalgo Text','Unstable':'Zalgo Text',
}

# ── STYLE_TRANSFORMS: dispatch table ─────────────────────────────────────────

def _mk_remix(upper_u, lower_l, overrides, pre, post, palette):
    m = _cm(upper_u, lower_l, overrides)
    return lambda t: _rf(t, m, pre, post, palette)

STYLE_TRANSFORMS = {
    # ── Classic ───────────────────────────────────────────────────────────────
    'Bold':           lambda t: _am(t, _BOLD_MAP),
    'Italic':         lambda t: _am(t, _ITALIC_MAP),
    'Cursive':        lambda t: _am(t, _CURSIVE_MAP),
    'Double Struck':  lambda t: _am(t, {**DU,**DL,'q':'𝑞'}),
    'Fraktur':        lambda t: _am(t, {**FU,**FL}),
    'Medieval':       lambda t: _am(t, {'A':'𝕬','B':'𝕭','C':'𝕮','D':'𝕯','E':'𝕰','F':'𝕱','G':'𝕲','H':'𝕳','I':'𝕴','J':'𝕵','K':'𝕶','L':'𝕷','M':'𝕸','N':'𝕹','O':'𝕺','P':'𝕻','Q':'𝕼','R':'𝕽','S':'𝕾','T':'𝕿','U':'𝖀','V':'𝖁','W':'𝖂','X':'𝖃','Y':'𝖄','Z':'𝖅','a':'𝖆','b':'𝖇','c':'𝖈','d':'𝖉','e':'𝖊','f':'𝖋','g':'𝖌','h':'𝖍','i':'𝖎','j':'𝖏','k':'𝖐','l':'𝖑','m':'𝖒','n':'𝖓','o':'𝖔','p':'𝖕','q':'𝖖','r':'𝖗','s':'𝖘','t':'𝖙','u':'𝖚','v':'𝖛','w':'𝖜','x':'𝖝','y':'𝖞','z':'𝖟'}),
    'Monospace':      lambda t: _am(t, {**MU,**ML}),
    'Circled':        lambda t: _am(t, {'a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ','k':'ⓚ','l':'ⓛ','m':'ⓜ','n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ','u':'ⓤ','v':'ⓥ','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'ⓩ','A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ','K':'Ⓚ','L':'Ⓛ','M':'Ⓜ','N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ','U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ'}),
    'Full Width':     lambda t: _am(t, {**WU,**WL}),
    'Vaporwave':      _vaporwave,
    'Super/Subscript Mix': _super_sub,
    'Bubble Pop':     _bubble_pop,
    # ── Glitch / Complex ──────────────────────────────────────────────────────
    'Corrupted Glitch': lambda t: _af(t, ['̍','̰','̲'], 3),
    'Cool': lambda t: _am(t, {'A':'A̷̗','B':'Ḃ̵','C':'C̶','D':'D̑','E':'E͕','F':'F̀','G':'G̗','H':'Ḩ̂','I':'I͍','J':'J̅','K':'Ǩ̰','L':'L̿','M':'M̴','N':'N̏','O':'Ó̰','P':'P̈','Q':'Q̻','R':'R͝','S':'S̖','T':'Ť̰','U':'U͋','V':'V͌','W':'W̠','X':'X̕','Y':'Y̅','Z':'Z̑'}),
    'Elegant Glitch': lambda t: _am(t, {'A':'ǟ','B':'B','C':'𝙲','D':'D','E':'𝘌','F':'⦑F⦒','G':'G̴','H':'░H░','I':'𝕀','J':'🇯','K':'𝐊','L':'ⓛ','M':'𝕄','N':'ᘉ','O':'𝓞','P':'ᑭ','Q':'𝐐','R':'᥅','S':'Ｓ','T':'T','U':'ᵁ','V':'⦏V̂⦎','W':'𝓦','X':'᙭','Y':'Y','Z':'չ'}),
    'Digital Decay':  lambda t: _am(t, {'A':'A̶','B':'ᗷ','C':'ᄃ','D':'░D░','E':'乇','F':'ᠻ','G':'🇬','H':'H','I':'𝐼','J':'ʝ','K':'K⃝','L':'ℓ','M':'M','N':'ℕ','O':'ට','P':'⦏P̂⦎','Q':'Q̶','R':'⦑R⦒','S':'🅂','T':'Ꮦ','U':'𝘜','V':'۷','W':'᭙','X':'𝓧','Y':'Ꭹ','Z':'Z̴'}),
    'Cursed Script':  lambda t: _am(t, {'A':'A̷','B':'B⃝','C':'ƈ','D':'ɖ','E':'𝐄','F':'F̶','G':'G','H':'𝘏','I':'i','J':'J','K':'𝒦','L':'ⓛ','M':'Ｍ','N':'N','O':'ₒ','P':'🄿','Q':'ᕴ','R':'R̷','S':'⦑S⦒','T':'T̷','U':'🆄','V':'V','W':'ω','X':'x','Y':'¥','Z':'Z'}),
    'Glitch Hop':     lambda t: _am(t, {'A':'A','B':'🅑','C':'C','D':'Ꮄ','E':'𝙀','F':'F','G':'𝓖','H':'H̶','I':'🇮','J':'ʝ','K':'K','L':'L','M':'M','N':'N','O':'𝙾','P':'ｱ','Q':'Q','R':'Ɽ','S':'丂','T':'𝒯','U':'U','V':'ᐯ','W':'🇼','X':'א','Y':'░Y░','Z':'𝚉'}),
    'Bracket Mix':    lambda t: _am(t, {'A':'𝘼','B':'⦑B⦒','C':'C','D':'𝘿','E':'𝘌','F':'𝙵','G':'ᧁ','H':'🅷','I':'ⓘ','J':'🄹','K':'𝔎','L':'ㄥ','M':'M','N':'ℕ','O':'օ','P':'P⃝','Q':'ᑫ','R':'𝑅','S':'𝕊','T':'T','U':'𝐔','V':'V̶','W':'ฬ','X':'⦑X⦒','Y':'Y','Z':'⦑Z⦒'}),
    'Royal Mix':      lambda t: _am(t, {'A':'ค','B':'ᴮ','C':'匚','D':'D⃝','E':'𝙴','F':'£','G':'Ⓖ','H':'Ή','I':'ℑ','J':'ᒚ','K':'𝙺','L':'𝙻','M':'🄼','N':'𝔑','O':'O','P':'Ꭾ','Q':'Q̷','R':'r','S':'░S░','T':'𝕋','U':'⦑U⦒','V':'V̴','W':'W̶','X':'⫸⫷','Y':'у','Z':'𝒵'}),
    'Kool':           lambda t: _am(t, {'A':'Ⱥ','B':'β','C':'↻','D':'Ꭰ','E':'Ɛ','F':'Ƒ','G':'Ɠ','H':'Ƕ','I':'į','J':'ل','K':'Ҡ','L':'Ꝉ','M':'Ɱ','N':'ហ','O':'ට','P':'φ','Q':'Ҩ','R':'འ','S':'Ϛ','T':'Ͳ','U':'Ա','V':'Ỽ','W':'చ','X':'ჯ','Y':'Ӌ','Z':'ɀ'}),
    'Neon':           lambda t: _am(t, {'A':'ᾰ','B':'♭','C':'ḉ','D':'ᖱ','E':'ḙ','F':'ḟ','G':'❡','H':'ℏ','I':'!','J':'♩','K':'к','L':'ℓ','M':'Պ','N':'ℵ','O':'✺','P':'℘','Q':'ǭ','R':'Ի','S':'ṧ','T':'т','U':'ṳ','V':'ṽ','W':'ω','X':'✘','Y':'⑂','Z':'ℨ'}),
    'Wierd':          lambda t: _am(t, {'A':'𒀀','B':'𒁀','C':'ℭ','D':'𒁓','E':'𝔈','F':'𐎣','G':'𝔊','H':'ℌ','I':'ℑ','J':'𝔍','K':'𝔎','L':'𒁇','M':'𐎠','N':'㞓','O':'𝔒','P':'𝔓','Q':'𒌒','R':'Я','S':'𒂍','T':'𒈦','U':'𝔘','V':'𐎏','W':'𝔚','X':'𒉽','Y':'𒌨','Z':'𒑣'}),
    'Decor':          lambda t: _am(t, {'A':'₳','B':'฿','C':'₵','D':'Đ','E':'Ɇ','F':'₣','G':'₲','H':'Ⱨ','I':'Ł','J':'J','K':'₭','L':'Ⱡ','M':'₥','N':'₦','O':'Ø','P':'₱','Q':'Q','R':'Ɽ','S':'₴','T':'₮','U':'Ʉ','V':'V','W':'₩','X':'Ӿ','Y':'Ɏ','Z':'Ⱬ'}),
    'Alien':          lambda t: _am(t, {'A':'ꁲ','B':'ꋰ','C':'ꀯ','D':'ꂠ','E':'ꈼ','F':'ꄞ','G':'ꁅ','H':'ꍩ','I':'ꂑ','J':'꒻','K':'ꀗ','L':'꒒','M':'ꂵ','N':'ꋊ','O':'ꂦ','P':'ꉣ','Q':'ꁷ','R':'ꌅ','S':'ꌚ','T':'ꋖ','U':'ꐇ','V':'ꀰ','W':'ꅏ','X':'ꇒ','Y':'ꐞ','Z':'ꁴ'}),
    # ── Featured ──────────────────────────────────────────────────────────────
    'Ancient Glyphs': lambda t: _am(t, {'A':'𖤬','B':'ꔪ','C':'ꛕ','D':'𖤀','E':'𖤟','F':'ꘘ','G':'ꚽ','H':'ꛅ','I':'ꛈ','J':'ꚠ','K':'𖤰','L':'ꚳ','M':'𖢑','N':'ꛘ','O':'𖣠','P':'ㄗ','Q':'ꚩ','R':'𖦪','S':'ꕷ','T':'𖢧','U':'ꚶ','V':'ꚴ','W':'ꛃ','X':'𖤗','Y':'ꚲ','Z':'ꛉ'}),
    'Hieroglyphic Mix': lambda t: _am(t, {'A':'ᗋ','B':'ᗾ','C':'ᕩ','D':'ᗥ','E':'ᗴ','F':'Ϝ','G':'G','H':'ꃙ','I':'ꉁ','J':'ꂖ','K':'Ƙ','L':'ᒫ','M':'ꉙ','N':'ꉌ','O':'ꇩ','P':'ᕾ','Q':'ᕴ','R':'ꔶ','S':'ꍛ','T':'𐏕','U':'ᕰ','V':'ᘙ','W':'ᘺ','X':'ꇨ','Y':'ꖃ','Z':'𑢪'}),
    'CJK Radicals':   lambda t: _am(t, {'A':'鿕','a':'𐐨','B':'⻖','C':'で','D':'ぬ','E':'乲','F':'乎','G':'⻢','H':'ぜ','I':'⻈','J':'ブ','K':'⽔','L':'乳','M':'丛','N':'乗','O':'ロ','P':'⺺','Q':'ꀹ','R':'⺠','S':'ぶ','T':'⻱','U':'ひ','V':'ㇾ','W':'丗','X':'⼢','Y':'ㆩ','Z':'ゑ'}),
    'Cyborg Construct': _cyborg,
    # ── Exotic ────────────────────────────────────────────────────────────────
    'Signature':      lambda t: _am(t, {'A':'꧁','B':'༒','C':'༻','D':'☬','E':'ད','F':'𐌀','G':'𐌁','H':'𐌂','I':'𐌃','J':'𐌄','K':'𐌅','L':'Ᏽ','M':'𐋅','N':'𐌉','O':'Ꮦ','P':'𐌊','Q':'𐌋','R':'𐌌','S':'𐌍','T':'Ꝋ','U':'𐌓','V':'𐌒','W':'𐌐','X':'𐌔','Y':'𐌕','Z':'𐌵'}),
    'Voltage Cage':   _voltage,
    'Ancient Seal':   lambda t: '⎝⎝✦⎠⎠ ' + _am(t, {'A':'𖤬','B':'ꔪ','C':'ꛕ','D':'𖤀','E':'𖤟','F':'ꘘ','G':'ꚽ','H':'ꛅ','I':'ꛈ','J':'ꚠ','K':'𖤰','L':'ꚳ','M':'𖢑','N':'ꛘ','O':'𖣠','P':'ㄗ','Q':'ꚩ','R':'𖦪','S':'ꕷ','T':'𖢧','U':'ꚶ','V':'ꚴ','W':'ꛃ','X':'𖤗','Y':'ꚲ','Z':'ꛉ'}) + ' ⎝⎝✦⎠⎠',
    'Radar Lock':     _radar,
    'Quill Strike':   _quill,
    'Death March':    _death_march,
    'Hellenic Code':  lambda t: _am(t, {'A':'𝛂','B':'𝛃','C':'𝛓','D':'𝛅','E':'𝛆','F':'𝒇','G':'𝒈','H':'𝛌','I':'𝒊','J':'𝒋','K':'𝛋','L':'𝛊','M':'𝒎','N':'𝛈','O':'𝛉','P':'𝛒','Q':'𝛗','R':'𝛄','S':'𝒔','T':'𝛕','U':'𝛍','V':'𝛎','W':'𝛡','X':'𝛘','Y':'𝛙','Z':'𝒛','a':'𝛂','b':'𝛃','c':'𝛓','d':'𝛅','e':'𝛆','f':'𝒇','g':'𝒈','h':'𝛌','i':'𝒊','j':'𝒋','k':'𝛋','l':'𝛊','m':'𝒎','n':'𝛈','o':'𝛉','p':'𝛒','q':'𝛗','r':'𝛄','s':'𝒔','t':'𝛕','u':'𝛍','v':'𝛎','w':'𝛡','x':'𝛘','y':'𝛙','z':'𝒛'}),
    'Rogue Alphabet': lambda t: _am(t, {'A':'Δ','B':'ß','C':'Ć','D':'Đ','E':'€','F':'Ƒ','G':'Ǥ','H':'Ħ','I':'Ɨ','J':'Ĵ','K':'Ҝ','L':'Ł','M':'Μ','N':'Ň','O':'Ø','P':'Ƥ','Q':'Ϙ','R':'Ř','S':'Ş','T':'Ŧ','U':'Ü','V':'V̶','W':'Ŵ','X':'Ж','Y':'¥','Z':'Ž','a':'α','b':'ƀ','c':'ç','d':'đ','e':'ě','f':'ƒ','g':'ĝ','h':'ħ','i':'î','j':'ĵ','k':'ķ','l':'ł','m':'ɱ','n':'ñ','o':'ø','p':'ƥ','q':'ϙ','r':'ř','s':'ş','t':'ŧ','u':'ü','v':'v̶','w':'ŵ','x':'ж','y':'ÿ','z':'ž'}),
    'Double Underline': lambda t: '₊˚⊹ ' + _af(t, ['̳'], 1) + ' ⊹˚₊',
    'IPA Rage':       lambda t: '༼つಠ益ಠ༽つ ' + _am(t, {'A':'ǟ','B':'ɮ','C':'ƈ','D':'ɖ','E':'ɛ','F':'ʄ','G':'ɢ','H':'ʜ','I':'ɪ','J':'ʝ','K':'ĸ','L':'ʟ','M':'ɱ','N':'ռ','O':'օ','P':'ք','Q':'զ','R':'ʀ','S':'ֆ','T':'ȶ','U':'ʊ','V':'ʋ','W':'ա','X':'ҳ','Y':'ʏ','Z':'ȥ','a':'ǟ','b':'ɮ','c':'ƈ','d':'ɖ','e':'ɛ','f':'ʄ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ʝ','k':'ĸ','l':'ʟ','m':'ɱ','n':'ռ','o':'օ','p':'ք','q':'զ','r':'ʀ','s':'ֆ','t':'ȶ','u':'ʊ','v':'ʋ','w':'ա','x':'ҳ','y':'ʏ','z':'ȥ'}) + ' ༼つಠ益ಠ༽つ',
    # ── Flourish Decorated ────────────────────────────────────────────────────
    'Skull & Stars':  lambda t: '꧁༒☠💥✨' + _am(t, _ITALIC_MAP) + '✨💥☠༒꧂',
    'Heart Wings':    lambda t: '෴❤️෴ ' + _am(t, _CURSIVE_MAP) + ' ෴❤️෴',
    'Fire Brackets':  lambda t: '🔥(✖ ' + _am(t, {'a':'ค','A':'ค','b':'๒','B':'๒','c':'ς','C':'ς','d':'๔','D':'๔','e':'є','E':'є','f':'Ŧ','F':'Ŧ','g':'ﻮ','G':'ﻮ','h':'ђ','H':'ђ','i':'เ','I':'เ','j':'ן','J':'ן','k':'к','K':'к','l':'ɭ','L':'ɭ','m':'๓','M':'๓','n':'ภ','N':'ภ','o':'๏','O':'๏','p':'ק','P':'ק','q':'ợ','Q':'ợ','r':'г','R':'г','s':'ร','S':'ร','t':'Շ','T':'Շ','u':'ย','U':'ย','v':'ש','V':'ש','w':'ฬ','W':'ฬ','x':'א','X':'א','y':'ץ','Y':'ץ','z':'չ','Z':'չ'}) + ' ✖)🔥',
    'Pastel Hearts':  lambda t: '(◍•ᴗ•◍) ミ💖 ' + _am(t, {'A':'🄰','B':'🄱','C':'🄲','D':'𝟄','E':'🄴','F':'𝟄','G':'𝖄','H':'🄷','I':'🄸','J':'🄹','K':'🄺','L':'🄻','M':'𝄼','N':'𝟄','O':'𝄾','P':'🄿','Q':'🅀','R':'🅁','S':'🅂','T':'🅃','U':'🅄','V':'🅅','W':'🆆','X':'🅇','Y':'🅈','Z':'🅉'}) + ' 💖彡',
    'Heavy Frame':    _heavy_frame,
    'Sparkle Throw':  lambda t: '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ' + t + ' ✧ﾟ･:*ヽ(◕ヮ◕ヽ)',
    'Symbolic Hearts': lambda t: '♥ﮩ٨ـﮩﮩ٨ـﮩﮩ ' + _am(t, {'a':'α','b':'в','c':'¢','d':'∂','e':'є','f':'ƒ','g':'g','h':'н','i':'ι','j':'נ','k':'к','l':'ℓ','m':'м','n':'η','o':'σ','p':'ρ','q':'q','r':'я','s':'ѕ','t':'т','u':'υ','v':'ν','w':'ω','x':'χ','y':'у','z':'z'}) + ' ﮩﮩـ٨ﮩﮩـ٨ﮩ♥',
    'Eclectic Mix':   lambda t: '`•.,¸¸,.•´¯ ' + _am(t, {'A':'α','B':'ᵇ','C':'ⓒ','D':'Ｄ','E':'Ⓔ','F':'ℱ','G':'Ꮆ','H':'卄','I':'𝐈','J':'𝓳','K':'𝕜','L':'Ĺ','M':'Ｍ','N':'𝐧','O':'Ỗ','P':'Ƥ','Q':'q','R':'𝐫','S':'𝓼','T':'𝐓','U':'ย','V':'ⓥ','W':'ｗ','X':'𝔁','Y':'𝐲','Z':'ｚ'}) + ' ¯`•.,¸¸,.•´',
    'Ornate Emblem':  lambda t: '-·=»‡«=·- ' + _am(t, {'A':'ⓐ','B':'в','C':'匚','D':'∂','E':'ᵉ','F':'Ŧ','G':'𝐆','H':'𝐡','I':'ι','J':'𝐉','K':'Ҝ','L':'ｌ','M':'м','N':'Ⓝ','O':'ㄖ','P':'ρ','Q':'𝓺','R':'尺','S':'𝓼','T':'Ｔ','U':'Ⓤ','V':'ש','W':'ω','X':'𝔵','Y':'ｙ','Z':'ž'}) + ' -·=»‡«=·-',
    'Demonic Script': _demonic,
    # ── Minimalist / NEW ──────────────────────────────────────────────────────
    'Microcaps Hybrid': lambda t: _am(t, {'A':'ᴬ','B':'ᴮ','C':'ᶜ','D':'ᴰ','E':'ᴱ','F':'ᶠ','G':'ᴳ','H':'ᴴ','I':'ᴵ','J':'ᴶ','K':'ᴷ','L':'ᴸ','M':'ᴹ','N':'ᴺ','O':'ᴼ','P':'ᴾ','Q':'ᵠ','R':'ᴿ','S':'ˢ','T':'ᵀ','U':'ᵁ','V':'ⱽ','W':'ᵂ','X':'ˣ','Y':'ʎ','Z':'ᶻ','a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ꜰ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','q':'ǫ','r':'ʀ','s':'s','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ'}),
    'Squared Enclosure': lambda t: _am(t, {'A':'🄰','B':'🄱','C':'🄲','D':'🄳','E':'🄴','F':'🄵','G':'🄶','H':'🄷','I':'🄸','J':'🄹','K':'🄺','L':'🄻','M':'🄼','N':'🄽','O':'🄾','P':'🄿','Q':'🅀','R':'🅁','S':'🅂','T':'🅃','U':'🅄','V':'🅅','W':'🅆','X':'🅇','Y':'🅈','Z':'🅉','a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ','k':'ⓚ','l':'ⓛ','m':'ⓜ','n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ','u':'ⓤ','v':'ⓥ','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'ⓩ'}),
    'Wireframe Double': lambda t: _am(t, {**DU,**DL,'0':'𝟘','1':'𝟙','2':'𝟚','3':'𝟛','4':'𝟜','5':'𝟝','6':'𝟞','7':'𝟟','8':'𝟠','9':'𝟡'}),
    'Box-Mono Tight': lambda t: _am(t, {**MU,**ML,'0':'𝟶','1':'𝟷','2':'𝟸','3':'𝟹','4':'𝟺','5':'𝟻','6':'𝟼','7':'𝟽','8':'𝟾','9':'𝟿'}),
    'Aura Halo':      lambda t: _weave(t, ['̇', '̊']),
    'Shadow Underline': lambda t: _weave(t, ['̳', '̱']),
    'Stitched Thin':  _stitched_thin,
    'Edge Glint':     lambda t: _weave(t, ['̌', '̣']),
    'Encased':        _encased,
    'Ethereal Sparkles': _ethereal,
    # ── Remix styles (20 original) ────────────────────────────────────────────
    'Quantum Spell':  _mk_remix(SU, SL, {'W':'𝔚','w':'𝔀','X':'𝔛','x':'𝔁','Y':'𝔜','y':'𝔂','Z':'ℨ','z':'𝔃','O':'𝓞','o':'𝓸'}, '⟁', '⟁', ['⌬','◬','⟡']),
    'Starlit Ice':    _mk_remix(SU, SL, {'A':'Ａ','E':'Ｅ','I':'Ｉ','O':'Ｏ','U':'Ｕ','a':'ａ','e':'ｅ','i':'ｉ','o':'ｏ','u':'ｕ'}, '❄︎', '❄︎', ['☾','✦','❆']),
    'Blood Rune':     _mk_remix(FU, FL, {'O':'𝒪','o':'𝔬'}, '𖤐', '𖤐', ['☨','✠','†']),
    'Ember Strike':   _mk_remix(DU, SL, {'X':'𝔛','x':'𝔁','V':'𝓥'}, '🔥', '🔥', ['✦','⚑','⚡']),
    'Toxic Pulse':    _mk_remix(MU, ML, {'O':'Ø','o':'ø','E':'Ξ','e':'ξ','A':'Δ','a':'Δ','Y':'¥','y':'ყ'}, '☣︎', '☣︎', ['⌁','⌬','⎔']),
    'Toxin Pulse':    _mk_remix(MU, ML, {'O':'Ø','o':'ø','E':'Ξ','e':'ξ','A':'Δ','a':'Δ','Y':'¥','y':'ყ'}, '☣︎', '☣︎', ['⌁','⌬','⎔']),
    'Cosmic Bloom':   _mk_remix(SU, SL, {}, '✧', '✧', ['✺','✸','✶']),
    'Shadow Circuit': _mk_remix(MU, ML, {'O':'𝙾','o':'ø','A':'𝙰','E':'𝙴','X':'𝚇','x':'𝚡'}, '⚫', '⚫', ['▣','◧','◨']),
    'Solar Sigil':    _mk_remix(DU, SL, {'T':'𝕋','R':'ℝ'}, '☀︎', '☀︎', ['☩','☼','✷']),
    'Necro Warden':   _mk_remix(FU, FL, {}, '☠︎', '☠︎', ['☥','⚰︎','✟']),
    'Lunar Bloom':    _mk_remix(SU, SL, {}, '☽', '☾', ['✧','☄︎','✦']),
    'Frost Bite':     _mk_remix(MU, FL, {'O':'Ｏ','o':'ｏ'}, '❄︎', '❄︎', ['☾','✶','❆']),
    'Arcane Tide':    _mk_remix(SU, SL, {}, '𓆉', '𓆉', ['☸︎','༄','⋆']),
    'Iron Howl':      _mk_remix(MU, ML, {'V':'𝚅','W':'𝚆','X':'𝚇','Y':'𝚈'}, '⛓', '⛓', ['⟟','⛓','⛨']),
    'Burning Sigil':  _mk_remix(DU, DL, {'A':'𝔸','a':'𝕒','E':'𝔼','e':'𝕖'}, '✠', '✠', ['†','☉','☍']),
    'Abyss Crown':    _mk_remix(WU, SL, {'O':'Ｏ','o':'ｏ','N':'Ｎ','n':'ｎ'}, '🌊', '🌊', ['❪','❫','⟢']),
    'Ghost Pulse':    _mk_remix(MU, SL, {'O':'Ø','o':'ø'}, '👁', '👁', ['▫','▪','◦']),
    'Thunder Crest':  _mk_remix(DU, DL, {'O':'𝕆','o':'𝕠','S':'𝕊','s':'𝕤'}, '⚡', '⚡', ['✦','⯈','➤']),
    'Dream Weaver':   _mk_remix(SU, SL, {}, '✿', '✿', ['🫧','⋆','❀']),
    'Obsidian Flame': _mk_remix(FU, FL, {'O':'𝒪','o':'𝔬'}, '⛧', '⛧', ['✟','❖','☗']),
    'Soul Key':       _mk_remix(SU, SL, {'G':'𝓖','g':'𝓰','K':'𝓚','k':'𝓴'}, '☽', '☽', ['⚷','⌘','✧']),
    # ── Symbol Fusion styles (20) ─────────────────────────────────────────────
    'Astral Rune — Zodiac Seal':       _mk_remix(DU, SL, {'O':'⊙','o':'⊙','S':'Ϟ','s':'ϟ'}, '♐', '♌', ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']),
    'Obscura Flame — Tifinagh Ember':  _mk_remix(FU, SL, {'A':'ⴰ','B':'ⴱ','E':'ⴻ','H':'ⵀ','I':'ⵉ','K':'ⴽ','L':'ⵍ','O':'ⵓ','U':'ⵓ','V':'ⵖ','W':'ⵡ','Y':'ⵢ','Z':'ⵣ'}, 'ⴰ', '🔥', ['ⵣ','ⵔ','ⵇ','ⴷ','ⴳ']),
    'Venin Crown — Alchemical Sigil':  _mk_remix(MU, ML, {'O':'🜔','o':'🜔','A':'🜃','a':'🜃','E':'🜁','e':'🜁'}, '🜂', '🜁', ['🜍','🜏','🜔','🜚','🜃','🜄']),
    'Royal Gambit — Chess Fang':       _mk_remix(DU, SL, {'K':'♚','Q':'♛','B':'♝','N':'♞','R':'♜','P':'♟'}, '♔', '♕', ['♔','♕','♖','♗','♘','♙','♚','♛','♜','♝','♞','♟']),
    'Jade Lotus — Mahjong Bloom':      _mk_remix(SU, SL, {}, '🀄', '🀚', ['🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏','🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘','🀙']),
    'Ancient Oracle — Phoenician Sigil': _mk_remix(FU, FL, {'A':'𐤀','B':'𐤁','G':'𐤂','D':'𐤃','H':'𐤄','W':'𐤅','Z':'𐤆','Y':'𐤉','K':'𐤊','L':'𐤋','M':'𐤌','N':'𐤍','S':'𐤎','P':'𐤐','Q':'𐤒','R':'𐤓','T':'𐤕'}, '𐤀', '𐤅', ['𐤀','𐤁','𐤂','𐤃','𐤄','𐤅','𐤆','𐤇','𐤈','𐤉','𐤊','𐤋','𐤌','𐤍','𐤎','𐤏','𐤐','𐤑','𐤒','𐤓','𐤔','𐤕']),
    'Twilight Mirror — Gothic Veil':   _mk_remix(FU, SL, {}, '⛧', '⛧', ['✟','☩','✠','✞']),
    'Solar Relic — Old Italic Flame':  _mk_remix(DU, DL, {'A':'𐌀','B':'𐌁','C':'𐌂','D':'𐌃','E':'𐌄','F':'𐌅','G':'𐌆','H':'𐌇','I':'𐌈','K':'𐌊','L':'𐌋','M':'𐌌','N':'𐌍','O':'𐌏','P':'𐌐','Q':'𐌒','R':'𐌓','S':'𐌔','T':'𐌕','U':'𐌖','V':'𐌖','X':'𐌗','Z':'𐌙'}, '𐌀', '🔥', ['𐌀','𐌁','𐌂','𐌃','𐌄','𐌅','𐌆','𐌇','𐌈','𐌊','𐌋','𐌌','𐌍','𐌏','𐌐','𐌒','𐌓','𐌔','𐌕','𐌖','𐌗','𐌙']),
    'Frozen Zodiac — Ice Rune':        _mk_remix(MU, ML, {'O':'♒','o':'♒','A':'♑','a':'♑'}, '❄︎', '❄︎', ['♑','♒','♓','❆','❄︎']),
    'Sacred Bloom — Lotus Mark':       _mk_remix(SU, SL, {}, '☸', '☸', ['☸','✿','❀','🪷']),
    'Infernal Sigil — Hell Rune':      _mk_remix(FU, FL, {}, '🜏', '🜍', ['🜏','🜍','🝫','🝟']),
    'Crown of Ages — Time Relic':      _mk_remix(DU, SL, {}, '⌛', '⌛', ['⌛','⏳','⧗','🕰']),
    'Starveil Echo — Cosmic Song':     _mk_remix(SU, SL, {}, '✧', '✧', ['✧','✦','⋆','✶','✷']),
    'Venom Halo — Toxic Glyph':        _mk_remix(MU, ML, {'O':'⍥','o':'⍥'}, '☣︎', '☣︎', ['☣︎','⎔','⌬','⌁']),
    'Mystic Crown — Celestial Fang':   _mk_remix(DU, SL, {}, '☾', '☾', ['☾','☽','✺','⋆']),
    'Dragon Rune — Ember Fang':        _mk_remix(FU, SL, {}, '🐉', '🐉', ['🐉','🔥','🜂','✠']),
    'Void Relic — Black Star':         _mk_remix(MU, DL, {'O':'●','o':'●'}, '✦', '✦', ['✦','●','◈','◇']),
    'Phantom Lotus — Spirit Petal':    _mk_remix(SU, SL, {}, '👁', '👁', ['👁','🪷','✧','◦']),
    'Arcane Spiral — Chaos Sigil':     _mk_remix(DU, DL, {}, '⟲', '⟲', ['⟲','⟳','↻','↺','⤿','⤾']),
    'Throne of Ash — Ember Crown':     _mk_remix(WU, SL, {'O':'⦿','o':'⦿'}, '🔥', '🔥', ['🔥','✠','⛧','⛓']),
    # ── Asian ─────────────────────────────────────────────────────────────────
    'CJK Strike':   lambda t: _am(t, {'A':'卂','B':'乃','C':'匚','D':'ᗪ','E':'乇','F':'千','G':'Ꮆ','H':'卄','I':'丨','J':'ﾌ','K':'Ҝ','L':'乚','M':'爪','N':'刀','O':'ㄖ','P':'卩','Q':'Ɋ','R':'尺','S':'丂','T':'ㄒ','U':'ㄩ','V':'ᐯ','W':'山','X':'乂','Y':'ㄚ','Z':'乙','a':'卂','b':'乃','c':'匚','d':'ᗪ','e':'乇','f':'千','g':'Ꮆ','h':'卄','i':'丨','j':'ﾌ','k':'Ҝ','l':'乚','m':'爪','n':'刀','o':'ㄖ','p':'卩','q':'Ɋ','r':'尺','s':'丂','t':'ㄒ','u':'ㄩ','v':'ᐯ','w':'山','x':'乂','y':'ㄚ','z':'乙'}),
    'Tokyo Drift':  lambda t: _am(t, {'A':'ア','B':'ム','C':'ᄃ','D':'刀','E':'ヨ','F':'キ','G':'ム','H':'ハ','I':'工','J':'ノ','K':'ズ','L':'レ','M':'ﾶ','N':'ℕ','O':'の','P':'ア','Q':'ϙ','R':'尺','S':'丂','T':'ｲ','U':'ひ','V':'√','W':'ﾘ','X':'乂','Y':'ﾘ','Z':'乙','a':'ア','b':'ム','c':'ᄃ','d':'刀','e':'ヨ','f':'キ','g':'ム','h':'ハ','i':'工','j':'ノ','k':'ズ','l':'レ','m':'ﾶ','n':'η','o':'の','p':'ア','q':'ϙ','r':'尺','s':'丂','t':'ｲ','u':'ひ','v':'√','w':'ﾘ','x':'乂','y':'ﾘ','z':'乙'}),
    'Ninja':        lambda t: '忍 ' + _am(t, {'A':'卂','B':'乃','C':'匚','D':'ᗪ','E':'乇','F':'千','G':'Ꮆ','H':'卄','I':'丨','J':'ﾌ','K':'Ҝ','L':'乚','M':'爪','N':'刀','O':'ㄖ','P':'卩','Q':'Ɋ','R':'尺','S':'丂','T':'ㄒ','U':'ㄩ','V':'ᐯ','W':'山','X':'乂','Y':'ㄚ','Z':'乙','a':'卂','b':'乃','c':'匚','d':'ᗪ','e':'乇','f':'千','g':'Ꮆ','h':'卄','i':'丨','j':'ﾌ','k':'Ҝ','l':'乚','m':'爪','n':'刀','o':'ㄖ','p':'卩','q':'Ɋ','r':'尺','s':'丂','t':'ㄒ','u':'ㄩ','v':'ᐯ','w':'山','x':'乂','y':'ㄚ','z':'乙'}) + ' 忍',
    'Eastern Bold': lambda t: _am(t, {**WU,**WL}),
    # ── Attitude ──────────────────────────────────────────────────────────────
    'Slavic Strike': lambda t: _am(t, {'A':'Ą','B':'Ɓ','C':'Ƈ','D':'Ɗ','E':'Ɛ','F':'Ƒ','G':'Ɠ','H':'Ƕ','I':'Ɩ','J':'Ɉ','K':'Ƙ','L':'Ƚ','M':'Ɱ','N':'Ɲ','O':'Ɵ','P':'Ƥ','Q':'Ɋ','R':'Ɍ','S':'Ş','T':'Ƭ','U':'Ʊ','V':'Ʋ','W':'Ɯ','X':'Ӿ','Y':'Ƴ','Z':'Ƶ','a':'ą','b':'ɓ','c':'ƈ','d':'ɗ','e':'ɛ','f':'ƒ','g':'ɠ','h':'ƕ','i':'ɩ','j':'ɉ','k':'ƙ','l':'ƚ','m':'ɱ','n':'ɲ','o':'ɵ','p':'ƥ','q':'ɋ','r':'ɍ','s':'ş','t':'ƭ','u':'ʊ','v':'ʋ','w':'ɯ','x':'ӿ','y':'ƴ','z':'ƶ'}),
    'Thorned':      lambda t: _am(t, {'A':'Ⱥ','B':'Ƀ','C':'Ȼ','D':'Đ','E':'Ɇ','F':'Ƒ','G':'Ǥ','H':'Ħ','I':'Ɨ','J':'Ɉ','K':'Ꝁ','L':'Ł','M':'Ɱ','N':'Ň','O':'Ø','P':'Ᵽ','Q':'Ꝗ','R':'Ɽ','S':'Ȿ','T':'Ŧ','U':'Ʉ','V':'Ꝟ','W':'Ⱳ','X':'Ӿ','Y':'Ɏ','Z':'Ƶ','a':'ⱥ','b':'ƀ','c':'ȼ','d':'đ','e':'ɇ','f':'ƒ','g':'ǥ','h':'ħ','i':'ɨ','j':'ɉ','k':'ꝁ','l':'ł','m':'ɱ','n':'ň','o':'ø','p':'ᵽ','q':'ꝗ','r':'ɽ','s':'ȿ','t':'ŧ','u':'ʉ','v':'ꝟ','w':'ⱳ','x':'ӿ','y':'ɏ','z':'ƶ'}),
    'Warzone':      lambda t: '⚔️ ' + _am(t, _BOLD_SER_MAP) + ' ⚔️',
    'Iron Fist':    lambda t: '👊 ' + _am(t, _BOLD_ITALIC_MAP) + ' 👊',
    'Blood Oath':   lambda t: '☠️ ' + _am(t, {'A':'𝕬','B':'𝕭','C':'𝕮','D':'𝕯','E':'𝕰','F':'𝕱','G':'𝕲','H':'𝕳','I':'𝕴','J':'𝕵','K':'𝕶','L':'𝕷','M':'𝕸','N':'𝕹','O':'𝕺','P':'𝕻','Q':'𝕼','R':'𝕽','S':'𝕾','T':'𝕿','U':'𝖀','V':'𝖁','W':'𝖂','X':'𝖃','Y':'𝖄','Z':'𝖅','a':'𝖆','b':'𝖇','c':'𝖈','d':'𝖉','e':'𝖊','f':'𝖋','g':'𝖌','h':'𝖍','i':'𝖎','j':'𝖏','k':'𝖐','l':'𝖑','m':'𝖒','n':'𝖓','o':'𝖔','p':'𝖕','q':'𝖖','r':'𝖗','s':'𝖘','t':'𝖙','u':'𝖚','v':'𝖛','w':'𝖜','x':'𝖝','y':'𝖞','z':'𝖟'}) + ' ☠️',
    # ── Cute ──────────────────────────────────────────────────────────────────
    'Sweet Italic': lambda t: '🌸 ' + _am(t, _ITALIC_MAP) + ' 🌸',
    'Fluffy':       lambda t: '💖 ' + _am(t, _CURSIVE_MAP) + ' 💖',
    'Bubble Cute':  lambda t: '(◕ᴗ◕✿) ' + _am(t, {'A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ','K':'Ⓚ','L':'Ⓛ','M':'Ⓜ','N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ','U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ','a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ','k':'ⓚ','l':'ⓛ','m':'ⓜ','n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ','u':'ⓤ','v':'ⓥ','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'ⓩ'}) + ' ✿',
    'Kawaii Small': lambda t: '₊˚ʚ ' + _am(t, {'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','q':'q','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ','A':'ᴬ','B':'ᴮ','C':'ᶜ','D':'ᴰ','E':'ᴱ','F':'ᶠ','G':'ᴳ','H':'ᴴ','I':'ᴵ','J':'ᴶ','K':'ᴷ','L':'ᴸ','M':'ᴹ','N':'ᴺ','O':'ᴼ','P':'ᴾ','Q':'Q','R':'ᴿ','S':'ˢ','T':'ᵀ','U':'ᵁ','V':'ⱽ','W':'ᵂ','X':'ˣ','Y':'ʸ','Z':'ᶻ'}) + ' ɞ˚₊',
    'Rose Script':  lambda t: '🌹 ' + _am(t, _BOLD_SCRIPT_MAP) + ' 🌹',
    # ── Russian ───────────────────────────────────────────────────────────────
    'Cyrillic Strike': lambda t: _am(t, {'A':'Д','B':'Б','C':'С','D':'Д','E':'Э','F':'Ғ','G':'Ԍ','H':'Н','I':'И','J':'Ј','K':'К','L':'Г','M':'М','N':'И','O':'О','P':'Р','Q':'Ϙ','R':'Я','S':'Ѕ','T':'Т','U':'Ц','V':'Щ','W':'Ш','X':'Ж','Y':'Ч','Z':'З','a':'а','b':'б','c':'с','d':'д','e':'э','f':'ғ','g':'ԍ','h':'н','i':'и','j':'ј','k':'к','l':'г','m':'м','n':'и','o':'о','p':'р','q':'ϙ','r':'я','s':'ѕ','t':'т','u':'ц','v':'щ','w':'ш','x':'ж','y':'ч','z':'з'}),
    'Soviet Bold':  lambda t: _am(t, {'A':'Λ','B':'β','C':'С','D':'Ð','E':'Σ','F':'Ƒ','G':'Ꮆ','H':'Η','I':'Ι','J':'Ĵ','K':'Κ','L':'Λ','M':'Μ','N':'Ν','O':'Θ','P':'Ρ','Q':'Ω','R':'Я','S':'Ѕ','T':'Τ','U':'Υ','V':'Ʋ','W':'Ш','X':'Χ','Y':'Ч','Z':'Ζ','a':'λ','b':'β','c':'с','d':'ð','e':'σ','f':'ƒ','g':'ɢ','h':'η','i':'ι','j':'ĵ','k':'κ','l':'λ','m':'μ','n':'ν','o':'θ','p':'ρ','q':'ω','r':'я','s':'ѕ','t':'τ','u':'υ','v':'ʋ','w':'ш','x':'χ','y':'ч','z':'ζ'}),
    'Red Army':     lambda t: '★ ' + _am(t, {'A':'Д','B':'Б','C':'С','D':'Д','E':'Э','F':'Ғ','G':'Ԍ','H':'Н','I':'И','J':'Ĵ','K':'К','L':'Г','M':'М','N':'Ν','O':'О','P':'Р','Q':'Ω','R':'Я','S':'Ş','T':'Т','U':'Ц','V':'Щ','W':'Ш','X':'Ж','Y':'Ч','Z':'З','a':'а','b':'б','c':'с','d':'д','e':'э','f':'ғ','g':'ԍ','h':'н','i':'и','j':'ĵ','k':'к','l':'г','m':'м','n':'ν','o':'о','p':'р','q':'ω','r':'я','s':'ş','t':'т','u':'ц','v':'щ','w':'ш','x':'ж','y':'ч','z':'з'}) + ' ★',
    'Slavic Mix':   lambda t: '҉ ' + _am(t, {'A':'Λ','B':'β','C':'ϲ','D':'Ď','E':'Σ','F':'Ƒ','G':'Ğ','H':'Н','I':'Ї','J':'Ĵ','K':'Ҡ','L':'Ĺ','M':'М','N':'Ñ','O':'Ö','P':'Р','Q':'Ϙ','R':'Ȓ','S':'Š','T':'Ţ','U':'Ü','V':'Ѵ','W':'Ш','X':'Ж','Y':'Ÿ','Z':'Ź','a':'λ','b':'β','c':'ϲ','d':'ď','e':'σ','f':'ƒ','g':'ğ','h':'н','i':'ї','j':'ĵ','k':'ҡ','l':'ĺ','m':'м','n':'ñ','o':'ö','p':'р','q':'ϙ','r':'ȓ','s':'š','t':'ţ','u':'ü','v':'ѵ','w':'ш','x':'ж','y':'ÿ','z':'ź'}) + ' ҉',
    # ── Lines / combining ──────────────────────────────────────────────────────
    'Strikethrough':      lambda t: _af(t, ['̶'], 1),
    'Double Strikethrough': lambda t: _af(t, ['̵'], 1),
    'Underline Bold':     lambda t: ''.join((_BOLD_SER_MAP.get(ch, ch) + '̲') if (ch.isalpha() or ch.isdigit()) else ch for ch in t),
    'Overline':           lambda t: _af(t, ['̅'], 1),
    'Double Overline':    lambda t: _af(t, ['̿'], 1),
    'Tilde Wave':         lambda t: _af(t, ['̴'], 1),
    'Slash Through':      lambda t: _af(t, ['̷'], 1),
    'Cross Hatch':        lambda t: _af(t, ['̶', '̅'], 2),
    'Underline Dots':     lambda t: _af(t, ['̲', '̇'], 2),
    # ── Gun ───────────────────────────────────────────────────────────────────
    'Bullet Trail': lambda t: '▄︻デ══━一 ' + _am(t, {'A':'Д','B':'Б','C':'С','D':'Д','E':'Э','F':'Ғ','G':'Ԍ','H':'Н','I':'И','J':'Ĵ','K':'К','L':'Г','M':'М','N':'Ν','O':'О','P':'Р','Q':'Ω','R':'Я','S':'Ş','T':'Т','U':'Ц','V':'Щ','W':'Ш','X':'Ж','Y':'Ч','Z':'З','a':'а','b':'б','c':'с','d':'д','e':'э','f':'ғ','g':'ԍ','h':'н','i':'и','j':'ĵ','k':'к','l':'г','m':'м','n':'ν','o':'о','p':'р','q':'ω','r':'я','s':'ş','t':'т','u':'ц','v':'щ','w':'ш','x':'ж','y':'ч','z':'з'}) + ' ━一',
    'Sniper':       lambda t: '🎯 ' + _am(t, _BOLD_MAP) + ' 🎯',
    'AK Frame':     lambda t: '꧁▄︻デ══━一 ' + t + ' ━一▄︻デ꧂',
    'Combat':       lambda t: '(ง ͠° ͟ل͜ ͡°)ง ' + _am(t, {'A':'Ⱥ','B':'Ƀ','C':'Ȼ','D':'Đ','E':'Ɇ','F':'Ƒ','G':'Ǥ','H':'Ħ','I':'Ɨ','J':'Ɉ','K':'Ƙ','L':'Ł','M':'Ɱ','N':'Ň','O':'Ø','P':'Ᵽ','Q':'Ꝗ','R':'Ɽ','S':'Ȿ','T':'Ŧ','U':'Ʉ','V':'Ꝟ','W':'Ⱳ','X':'Ӿ','Y':'Ɏ','Z':'Ƶ','a':'ⱥ','b':'ƀ','c':'ȼ','d':'đ','e':'ɇ','f':'ƒ','g':'ǥ','h':'ħ','i':'ɨ','j':'ɉ','k':'ƙ','l':'ł','m':'ɱ','n':'ň','o':'ø','p':'ᵽ','q':'ꝗ','r':'ɽ','s':'ȿ','t':'ŧ','u':'ʉ','v':'ꝟ','w':'ⱳ','x':'ӿ','y':'ɏ','z':'ƶ'}) + ' 💪',
    # ── Heart ─────────────────────────────────────────────────────────────────
    'Heart Script': lambda t: '♥ ' + _am(t, _CURSIVE_MAP) + ' ♥',
    'Love Bold':    lambda t: '❤️ ' + _am(t, _BOLD_MAP) + ' ❤️',
    'Cupid':        lambda t: '♡´･ᴗ･`♡ ' + t + ' ♡´･ᴗ･`♡',
    'Valentine':    lambda t: '💖 ' + _af(t, ['̲'], 1) + ' 💖',
    # ── Star ──────────────────────────────────────────────────────────────────
    'Star Frame':   lambda t: '★彡 ' + t + ' 彡★',
    'Galaxy Script': lambda t: '✦ ' + _am(t, _CURSIVE_MAP) + ' ✦',
    'Nova':         lambda t: '✨ ' + _af(t, ['̇'], 1) + ' ✨',
    'Stellar Bold': lambda t: '⭐ ' + _am(t, _BOLD_SER_MAP) + ' ⭐',
    # ── Crown ─────────────────────────────────────────────────────────────────
    'Crown Frame':  lambda t: '👑 ' + t + ' 👑',
    'Royal Script': lambda t: '👑➤ ' + _am(t, _BOLD_SCRIPT_MAP) + ' ➤👑',
    'King Bold':    lambda t: '⎝⎝✧KING✧⎠⎠ ' + _am(t, {'A':'𝕬','B':'𝕭','C':'𝕮','D':'𝕯','E':'𝕰','F':'𝕱','G':'𝕲','H':'𝕳','I':'𝕴','J':'𝕵','K':'𝕶','L':'𝕷','M':'𝕸','N':'𝕹','O':'𝕺','P':'𝕻','Q':'𝕼','R':'𝕽','S':'𝕾','T':'𝕿','U':'𝖀','V':'𝖁','W':'𝖂','X':'𝖃','Y':'𝖄','Z':'𝖅','a':'𝖆','b':'𝖇','c':'𝖈','d':'𝖉','e':'𝖊','f':'𝖋','g':'𝖌','h':'𝖍','i':'𝖎','j':'𝖏','k':'𝖐','l':'𝖑','m':'𝖒','n':'𝖓','o':'𝖔','p':'𝖕','q':'𝖖','r':'𝖗','s':'𝖘','t':'𝖙','u':'𝖚','v':'𝖛','w':'𝖜','x':'𝖝','y':'𝖞','z':'𝖟'}) + ' ⎝⎝✧KING✧⎠⎠',
    'Emperor':      lambda t: '◥꧁ད ' + t + ' ཌ꧂◤',
    # ── Flip & Mirror ─────────────────────────────────────────────────────────
    'Flip Upside Down': lambda t: _am(t, {'a':'ɐ','b':'q','c':'ɔ','d':'p','e':'ǝ','f':'ɟ','g':'ƃ','h':'ɥ','i':'ı','j':'ɾ','k':'ʞ','l':'l','m':'ɯ','n':'u','o':'o','p':'d','q':'b','r':'ɹ','s':'s','t':'ʇ','u':'n','v':'ʌ','w':'ʍ','x':'x','y':'ʎ','z':'z','A':'∀','B':'𐐒','C':'Ɔ','D':'ᗡ','E':'Ǝ','F':'Ⅎ','G':'פ','H':'H','I':'I','J':'ɾ','K':'ʞ','L':'˥','M':'W','N':'N','O':'O','P':'Ԁ','Q':'Q','R':'ᴚ','S':'S','T':'┴','U':'∩','V':'Λ','W':'M','X':'X','Y':'⅄','Z':'Z'}),
    'Mirror Reverse': lambda t: _am(t, {'a':'ɒ','b':'d','c':'ɔ','d':'b','e':'ɘ','f':'ʇ','g':'ϱ','h':'ʜ','i':'i','j':'į','k':'ʞ','l':'l','m':'m','n':'n','o':'o','p':'q','q':'p','r':'ɿ','s':'ƨ','t':'ƚ','u':'u','v':'v','w':'w','x':'x','y':'y','z':'ƹ','A':'A','B':'ᗺ','C':'Ɔ','D':'ᗡ','E':'Ǝ','F':'ꟻ','G':'Ꮁ','H':'H','I':'I','J':'Ⴑ','K':'ꓘ','L':'⅃','M':'M','N':'И','O':'O','P':'ꟼ','Q':'Ϙ','R':'Я','S':'Ƨ','T':'T','U':'U','V':'V','W':'W','X':'X','Y':'Y','Z':'Ƹ'}),
    'Reverse Order': _reverse_order,
    # ── Squiggle / Wave ───────────────────────────────────────────────────────
    'Wave Mark':    lambda t: _af(t, ['̰'], 1),
    'Zigzag':       lambda t: _af(t, ['͜'], 1),
    'Spiral':       _spiral,
    'Curly Bold':   lambda t: ''.join((_BOLD_MAP.get(ch, ch) + '̰') if (ch.isalpha() or ch.isdigit()) else ch for ch in t),
    # ── Beautiful / Floral ────────────────────────────────────────────────────
    'Floral Script': lambda t: '❀ ' + _am(t, _CURSIVE_MAP) + ' ❀',
    'Blossom':       lambda t: '🌸 ' + _af(t, ['̊'], 1) + ' 🌸',
    'Butterfly':     lambda t: '🦋 ' + _am(t, _BOLD_SCRIPT_MAP) + ' 🦋',
    'Elegant Serif': lambda t: _am(t, {'A':'𝐴','B':'𝐵','C':'𝐶','D':'𝐷','E':'𝐸','F':'𝐹','G':'𝐺','H':'𝐻','I':'𝐼','J':'𝐽','K':'𝐾','L':'𝐿','M':'𝑀','N':'𝑁','O':'𝑂','P':'𝑃','Q':'𝑄','R':'𝑅','S':'𝑆','T':'𝑇','U':'𝑈','V':'𝑉','W':'𝑊','X':'𝑋','Y':'𝑌','Z':'𝑍','a':'𝑎','b':'𝑏','c':'𝑐','d':'𝑑','e':'𝑒','f':'𝑓','g':'𝑔','h':'ℎ','i':'𝑖','j':'𝑗','k':'𝑘','l':'𝑙','m':'𝑚','n':'𝑛','o':'𝑜','p':'𝑝','q':'𝑞','r':'𝑟','s':'𝑠','t':'𝑡','u':'𝑢','v':'𝑣','w':'𝑤','x':'𝑥','y':'𝑦','z':'𝑧'}),
    # ── Bold variants ─────────────────────────────────────────────────────────
    'Ultra Bold':   lambda t: _am(t, _BOLD_MAP),
    'Bold Italic':  lambda t: _am(t, _BOLD_ITALIC_MAP),
    'Bold Script':  lambda t: _am(t, _BOLD_SCRIPT_MAP),
    'Sans Bold':    lambda t: _am(t, _SANS_BOLD_MAP),
    # ── Boxed ─────────────────────────────────────────────────────────────────
    'Squared Caps': lambda t: _am(t, {'A':'🄰','B':'🄱','C':'🄲','D':'🄳','E':'🄴','F':'🄵','G':'🄶','H':'🄷','I':'🄸','J':'🄹','K':'🄺','L':'🄻','M':'🄼','N':'🄽','O':'🄾','P':'🄿','Q':'🅀','R':'🅁','S':'🅂','T':'🅃','U':'🅄','V':'🅅','W':'🅆','X':'🅇','Y':'🅈','Z':'🅉','a':'🄰','b':'🄱','c':'🄲','d':'🄳','e':'🄴','f':'🄵','g':'🄶','h':'🄷','i':'🄸','j':'🄹','k':'🄺','l':'🄻','m':'🄼','n':'🄽','o':'🄾','p':'🄿','q':'🅀','r':'🅁','s':'🅂','t':'🅃','u':'🅄','v':'🅅','w':'🅆','x':'🅇','y':'🅈','z':'🅉'}),
    'Filled Box':   lambda t: _am(t, {'A':'🅐','B':'🅑','C':'🅒','D':'🅓','E':'🅔','F':'🅕','G':'🅖','H':'🅗','I':'🅘','J':'🅙','K':'🅚','L':'🅛','M':'🅜','N':'🅝','O':'🅞','P':'🅟','Q':'🅠','R':'🅡','S':'🅢','T':'🅣','U':'🅤','V':'🅥','W':'🅦','X':'🅧','Y':'🅨','Z':'🅩','a':'🅐','b':'🅑','c':'🅒','d':'🅓','e':'🅔','f':'🅕','g':'🅖','h':'🅗','i':'🅘','j':'🅙','k':'🅚','l':'🅛','m':'🅜','n':'🅝','o':'🅞','p':'🅟','q':'🅠','r':'🅡','s':'🅢','t':'🅣','u':'🅤','v':'🅥','w':'🅦','x':'🅧','y':'🅨','z':'🅩'}),
    'Corner Frame': lambda t: '⌜' + t + '⌝',
    # ── Ugly / Zalgo ──────────────────────────────────────────────────────────
    'Zalgo Light':  lambda t: _af(t, ['̀', '̇'], 2),
    'Zalgo Heavy':  lambda t: _af(t, ['̍', '̰', '̲', '̳'], 4),
    'Chaos':        lambda t: _af(t, ['̀', '̈', '̲', '̶'], 3),
    'Unstable':     lambda t: _af(t, ['̶', '̷', '̸'], 1),
    # ── Kaomoji ───────────────────────────────────────────────────────────────
    'Angry Kaomoji': lambda t: '(ง ͠° ͟ل͜ ͡°)ง ' + t + ' 💢',
    'Happy Kaomoji': lambda t: '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ' + t + ' ✧ﾟ･:*',
    'Sad Kaomoji':   lambda t: '(ಥ_ಥ) ' + t + ' ･ω･',
    'Cool Kaomoji':  lambda t: '(•̀ᴗ•́)و ★ ' + t + ' ★',
}

# ── regex to locate each font-row div + its font-sample span ─────────────────

_FONT_ROW_RE = re.compile(
    r'(<div class="font-row"(?:[^>]*)data-style-name="([^"]*)"(?:[^>]*)>)'
    r'(.*?)'
    r'(<span class="font-sample">)([^<]*)(</span>)',
    re.DOTALL
)

def generate_homepage_previews():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    changed = 0

    def _replace(m):
        nonlocal changed
        div_open    = m.group(1)
        style_name  = m.group(2)
        between     = m.group(3)
        span_open   = m.group(4)
        cur_content = m.group(5)
        span_close  = m.group(6)

        # Resolve sample word: SAMPLE_WORDS > data-sample attr > current ASCII span
        if style_name in SAMPLE_WORDS:
            word = SAMPLE_WORDS[style_name]
        else:
            ds = re.search(r'data-sample="([^"]*)"', div_open)
            if ds:
                word = ds.group(1)
            elif cur_content.isascii() and cur_content.strip():
                word = cur_content
            else:
                return m.group(0)  # already Unicode, no source word

        transform = STYLE_TRANSFORMS.get(style_name)
        if not transform:
            return m.group(0)

        try:
            preview = transform(word)
        except Exception:
            return m.group(0)

        # Add data-sample attribute to div (idempotent)
        escaped_word = html_module.escape(word, quote=True)
        if 'data-sample=' not in div_open:
            div_open = div_open[:-1] + f' data-sample="{escaped_word}">'

        changed += 1
        return div_open + between + span_open + preview + span_close

    new_html = _FONT_ROW_RE.sub(_replace, html)

    if new_html != html:
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"index.html: {changed} font-sample spans updated with Unicode previews.")
    else:
        print("index.html previews already up to date.")


if __name__ == '__main__':
    build_pages()
    build_letter_pages()
    generate_homepage_previews()

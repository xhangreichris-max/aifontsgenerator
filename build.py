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


if __name__ == '__main__':
    build_pages()
    build_letter_pages()

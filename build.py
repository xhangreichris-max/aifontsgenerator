import json
import os

# Article content per page — keyword-targeted, humanizer-style writing
ARTICLE_CONTENT = {
  "glitch-text": {
    "what_is": "Glitch text is text that looks broken on purpose. It uses Unicode combining characters — small diacritics that stack above and below letters — to create a corrupted, unstable look. The result is text that reads as hacked, digital decay, or deliberately broken. Gamers and dark-aesthetic social media users picked this up early for usernames and bios. AI Fonts Generator handles the full range: light strikethrough distortion to heavy diacritic overflow. All of it is plain Unicode — it pastes correctly on any platform that supports Unicode text.",
    "platform": "Glitch text pastes well into Discord name fields, bios, and server nicknames. In PUBG Mobile and Free Fire, light glitch styles display reliably in player names. Instagram bio and name fields accept most glitch styles. Heavy zalgo overflow can get truncated in platforms with character limits — if that happens, use a lighter glitch style from the generator."
  },
  "bold-text": {
    "what_is": "Bold text here does not use the bold button in a text editor. It uses Unicode bold characters — a separate set of characters that look visually identical to bolded text but are plain Unicode. They paste as regular text into any app, game, or platform. This means you can have bold text in your Instagram bio, Discord username, BGMI display name, or TikTok display name — anywhere that accepts text but does not have a formatting toolbar.",
    "platform": "Unicode bold pastes cleanly into Instagram bio and name fields, Discord nicknames and bios, BGMI and PUBG Mobile player names, and TikTok display names. It is among the most compatible Unicode styles across all platforms. If you need something that looks different from default text without being too experimental, bold Unicode is the safest starting point."
  },
  "cursive-text": {
    "what_is": "Cursive text in this generator uses Unicode script characters — a set of flowing, connected letterforms that look like handwritten cursive but are plain text. No font file needed. No special app required. The characters exist in the Unicode standard and render on any modern device. They look elegant and designed compared to default text, which is why they are popular for Instagram bios, display names, and anywhere you want a more refined look.",
    "platform": "Cursive Unicode styles paste well into Instagram bio and name fields, Discord profile bios and nicknames, TikTok display names, and WhatsApp names. The script characters are in a well-supported Unicode range, so compatibility is high across platforms. They also work in PUBG Mobile and Free Fire display names."
  },
  "tiny-text": {
    "what_is": "Tiny text uses Unicode superscript and subscript characters — characters that were originally designed for mathematical notation but work perfectly as small decorative text on social platforms. The characters render at a visually smaller size than normal text without needing any font size setting. You can paste tiny text into any platform that accepts a text field and it will display at the reduced size automatically.",
    "platform": "Tiny text is especially popular for Instagram bios where the small size creates a designed, editorial feel next to normal-sized text. It also works in Discord bios and TikTok display names. The superscript character range is well supported across platforms — most styles display correctly on both mobile and desktop."
  },
  "zalgo-text": {
    "what_is": "Zalgo text uses Unicode combining diacritics — marks that normally appear above or below a single letter — stacked so aggressively that the text overflows its line boundaries. Characters appear to bleed upward and downward, consuming surrounding text. The effect is named after a horror internet meme and is used for creepy, corrupted, or horror-aesthetic usernames and bios. The generator outputs multiple intensity levels from light diacritic stacking to full zalgo overflow.",
    "platform": "Zalgo text works best in Discord bios and username fields, which handle heavy Unicode well. In PUBG Mobile and Free Fire, full zalgo may get truncated due to character limits — use medium intensity for better compatibility. Instagram accepts light zalgo in bio fields. Heavy zalgo can cause display issues in some mobile apps, so test before committing."
  },
  "upside-down-text": {
    "what_is": "Upside down text works by replacing each letter with a Unicode character that looks like the upside-down version of that letter. When you flip your text, each character maps to its corresponding rotated Unicode equivalent. The result reads as upside-down text to anyone seeing it, but it is plain Unicode that pastes into any text field. Some characters have direct Unicode upside-down equivalents; others use visually similar characters from other scripts.",
    "platform": "Flipped upside-down text pastes into Instagram bios, Discord names, TikTok display names, and WhatsApp names. It works well in any text field that accepts Unicode. The effect is immediately noticeable and tends to get attention in gaming lobbies and social media profiles where it stands out from normal text."
  },
  "gothic-text": {
    "what_is": "Gothic text here refers to blackletter — the heavy, ornate script used in medieval manuscripts, old German typography, and modern tattoo lettering. The Unicode standard includes a full blackletter alphabet in its Mathematical Fraktur block. These characters look like decorative gothic lettering but paste as plain text. No font file needed. The result is text that reads as dark, classical, and heavily styled.",
    "platform": "Gothic blackletter Unicode pastes well into Instagram bios and name fields, Discord nicknames and bios, and PUBG Mobile and Free Fire player names. It is one of the most recognizable fancy text styles and displays correctly across a wide range of platforms. The characters are in a Unicode range with broad device support."
  },
  "creepy-text": {
    "what_is": "Creepy text combines Unicode corrupted characters, heavy diacritics, and horror-aesthetic symbol combinations to produce text that looks unsettling or disturbing. This covers a range of styles from light character corruption to heavy zalgo overflow to gothic blackletter with dark symbol frames. The generator outputs multiple creepy variations so you can choose the intensity that fits the platform you are pasting into.",
    "platform": "Creepy text works well in Discord servers with a horror or dark gaming theme, PUBG Mobile and Free Fire display names for intimidation effect, and Instagram bios for dark aesthetic profiles. Heavy creepy styles may display inconsistently on some mobile apps — if a style does not render correctly, try a lighter version from the generator."
  },
  "strikethrough-text": {
    "what_is": "Strikethrough text uses a Unicode combining character — a horizontal line that sits through the middle of each letter — applied to every character in your text. The result looks like crossed-out text, as if something has been redacted or deleted. The effect is achieved without any formatting toolbar. It pastes as plain Unicode into any text field and displays the strikethrough on any device that supports Unicode combining characters.",
    "platform": "Strikethrough text pastes into Discord messages, bios, and nicknames reliably. It works in Instagram bios and TikTok display names. The combining character used is in a well-supported Unicode range, so compatibility is good across platforms. It is a popular choice for ironic or sardonic social media bios and gaming usernames."
  },
  "unicode-text": {
    "what_is": "Unicode is the international standard for text encoding. Every character your device displays — letters, numbers, symbols, emoji — is a Unicode character. Beyond the standard Latin alphabet, Unicode contains hundreds of alternative letterforms: mathematical bold, italic, script, fraktur, double-struck, monospace, and more. A Unicode text converter maps your normal text to these alternative character sets so you can paste styled text anywhere that accepts plain text input.",
    "platform": "Unicode text styles work across every major platform because Unicode support is built into modern operating systems. Instagram, Discord, TikTok, WhatsApp, PUBG Mobile, Free Fire, BGMI, Twitter, Facebook — all support Unicode text in name fields, bios, and display names. Compatibility varies by style: classic Unicode variants have the widest support, while exotic scripts and heavy combining marks may vary."
  },
  "bubble-text": {
    "what_is": "Bubble text uses enclosed Unicode characters — letters inside circles or boxes — to create a rounded, bubbly appearance. The generator uses circled Latin letters from the Unicode Enclosed Alphanumerics block and related blocks. Each letter appears inside a circular enclosure, giving text a playful, cute aesthetic. Some bubble styles use filled circles for a bolder look; others use outlined circles for a lighter feel.",
    "platform": "Bubble text is popular for Instagram bios and TikTok display names where the playful aesthetic fits kawaii, cute, and aesthetic account themes. It pastes into Discord nicknames and WhatsApp names as well. The enclosed letter characters are in a widely supported Unicode range, so display compatibility is generally good across mobile and desktop platforms."
  },
  "mirror-text": {
    "what_is": "Mirror text reverses the order of your text characters and replaces each letter with its mirrored Unicode equivalent where one exists. The result reads as your text reflected in a mirror — right to left, with each character facing the opposite direction. Some characters have direct mirrored Unicode equivalents in other script blocks; others use visually similar reversed characters from mathematical or symbol sets.",
    "platform": "Mirror text pastes into Instagram bios, Discord names, TikTok display names, and most text fields that accept Unicode. The reversed reading direction makes it immediately noticeable as unusual, which is why it is popular for usernames and display names where standing out is the goal."
  },
  "aesthetic-text": {
    "what_is": "Aesthetic text covers decorated and flourish-style Unicode fonts — text surrounded by small symbols, spacing characters, and decorative marks that give it a crafted, designed appearance. This includes styles with flower symbols between letters, star decorations, and bracket-like flourishes that frame the text. The aesthetic font style is associated with Instagram and TikTok accounts that prioritize a curated visual identity.",
    "platform": "Aesthetic text styles are designed for Instagram bios and name fields, TikTok display names, and Discord profile bios. The decorative characters paste well in these text fields. Some heavier decorated styles may display differently across platforms depending on emoji and symbol support — the generator outputs multiple options so you can pick the one that works best for your target platform."
  },
  "vaporwave-text": {
    "what_is": "Vaporwave text uses full-width Unicode characters — a character set originally designed for East Asian typography where characters need to occupy the same width as CJK characters. Full-width Latin letters are wider than normal Latin letters, giving text a spaced-out, retro aesthetic associated with vaporwave music and internet art. The style became popular on social media for its distinctive wide spacing and 80s-influenced visual feel.",
    "platform": "Vaporwave full-width text pastes well into Instagram bios, TikTok display names, Discord nicknames, and Twitter bios. Full-width Latin characters are in a well-supported Unicode range. The wider character spacing makes this style particularly readable at small sizes in profile bios and display names."
  },
  "runic-text": {
    "what_is": "Runic text uses Elder Futhark runes — the oldest form of the runic alphabets used by Germanic peoples from around the 2nd to 8th centuries. The Unicode standard includes the full Elder Futhark runic alphabet in its Runic block. Each Latin letter maps to a visually similar rune character. The result looks like ancient inscriptions while remaining readable to anyone familiar with the original Latin letters.",
    "platform": "Runic text pastes into Discord bios and nicknames, Instagram bios, and PUBG Mobile and Free Fire display names. The Runic Unicode block has broad support on modern devices. The ancient aesthetic is popular for fantasy gaming accounts, RPG guild names, and dark or medieval-themed social media profiles."
  }
}

def generate_internal_links_html(links):
    html = ""
    for link in links:
        html += f'<li><a href="{link["url"]}">{link["text"]}</a></li>\n'
    return html

def build_pages():
    with open('pages-config.json', 'r', encoding='utf-8') as f:
        pages = json.load(f)

    with open('template.html', 'r', encoding='utf-8') as f:
        template = f.read()

    for page in pages:
        slug = page['slug']
        content = ARTICLE_CONTENT.get(slug, {})

        categories_str = ','.join(page['categories'])
        internal_links_html = generate_internal_links_html(page['internal_links'])

        html = template
        html = html.replace('{{TITLE}}', page['title'])
        html = html.replace('{{META_DESC}}', page['meta_desc'])
        html = html.replace('{{H1}}', page['h1'])
        html = html.replace('{{HERO_SUB}}', page['hero_sub'])
        html = html.replace('{{DEFAULT_TEXT}}', page['default_text'])
        html = html.replace('{{CATEGORIES}}', categories_str)
        html = html.replace('{{FILENAME}}', page['filename'])
        html = html.replace('{{SLUG}}', page['slug'])
        html = html.replace('{{WHAT_IS_CONTENT}}', content.get('what_is', ''))
        html = html.replace('{{PLATFORM_CONTENT}}', content.get('platform', ''))
        html = html.replace('{{INTERNAL_LINKS_HTML}}', internal_links_html)

        with open(page['filename'], 'w', encoding='utf-8') as f:
            f.write(html)

        print(f"Built: {page['filename']}")

    print(f"\nDone. {len(pages)} pages generated.")

if __name__ == '__main__':
    build_pages()

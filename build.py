import json
import os

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

if __name__ == '__main__':
    build_pages()

import json
import urllib.request
import re
import xml.etree.ElementTree as ET
import time
from bs4 import BeautifulSoup
import os

JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'poems.json')
RSS_URL = 'https://melancholicmuser.wixsite.com/website/blog-feed.xml'

def extract_poem_text(html):
    soup = BeautifulSoup(html, 'html.parser')
    
    article = soup.find('article', {'data-hook': 'post'})
    if not article:
        article = soup
        
    viewer = article.find('div', {'data-id': 'content-viewer'})
    container = viewer if viewer else article
        
    paragraphs = container.find_all('p', dir='auto')
    
    text_lines = []
    for p in paragraphs:
        text_lines.append(p.get_text().strip())
        
    if not text_lines:
        spans = container.find_all('span', class_='wixui-rich-text__text')
        for span in spans:
            text_lines.append(span.get_text().strip())
            
    while text_lines and not text_lines[0]:
        text_lines.pop(0)
    while text_lines and not text_lines[-1]:
        text_lines.pop()
        
    return '\n'.join(text_lines)

def main():
    # Load existing
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            poems = json.load(f)
    else:
        poems = []
        
    existing_ids = {p['id'] for p in poems}
    
    print(f"Fetching RSS feed from {RSS_URL}...")
    req = urllib.request.Request(RSS_URL, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        rss_data = urllib.request.urlopen(req).read()
        root = ET.fromstring(rss_data)
    except Exception as e:
        print(f"Error fetching RSS: {e}")
        return

    new_poems_added = 0
    
    # Items in RSS
    for item in root.findall('./channel/item'):
        title = item.find('title').text if item.find('title') is not None else "Untitled"
        link = item.find('link').text if item.find('link') is not None else ""
        
        # Extract slug
        slug = link.split('/')[-1]
        if not slug or slug in existing_ids:
            continue
            
        print(f"New poem found: {title} ({slug})")
        print(f"Fetching full content...")
        
        try:
            html = urllib.request.urlopen(urllib.request.Request(link, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')
            content = extract_poem_text(html)
            
            # Default to 'all' category for new poems, can be manually updated later
            poems.append({
                "id": slug,
                "title": title,
                "content": content,
                "category": "all" 
            })
            existing_ids.add(slug)
            new_poems_added += 1
            print("Successfully extracted and added.")
            time.sleep(1) # Be nice
            
        except Exception as e:
            print(f"Failed to fetch content for {link}: {e}")

    if new_poems_added > 0:
        with open(JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(poems, f, indent=2)
        print(f"Saved {new_poems_added} new poems to {JSON_PATH}!")
    else:
        print("No new poems found.")

if __name__ == '__main__':
    main()

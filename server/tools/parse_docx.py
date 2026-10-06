import zipfile, re, json, html

def parse(path):
    z = zipfile.ZipFile(path)
    xml = z.read('word/document.xml').decode('utf8')
    paras = re.findall(r'<w:p[ >].*?</w:p>', xml, flags=re.S)
    accounts, cur, sec, sub = [], None, None, None
    stack = []  # list-item stack for nesting
    for p in paras:
        style = re.search(r'<w:pStyle w:val="([^"]+)"', p)
        style = style.group(1) if style else None
        ilvl = re.search(r'<w:ilvl w:val="(\d+)"', p)
        ilvl = int(ilvl.group(1)) if ilvl else None
        text = html.unescape(''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', p))).strip()
        bold = '<w:b/>' in p or '<w:b ' in p
        if not text:
            continue
        if style == 'Heading1':
            cur = {'name': text, 'sections': {}, 'subtitle': ''}
            accounts.append(cur); sec = None; sub = None; stack = []
            continue
        if cur is None:
            continue
        if style == 'Heading3' and sec is not None:
            sub = {'label': text, 'items': [], 'notes': []}
            sec['blocks'].append(sub); stack = []
            continue
        if style == 'Heading2':
            sec = {'title': text, 'blocks': []}
            cur['sections'][text] = sec
            sub = {'label': None, 'items': [], 'notes': []}
            sec['blocks'].append(sub); stack = []
            continue
        if sec is None:
            cur['subtitle'] = text
            continue
        if ilvl is None:
            # non-list paragraph: bold = sub-label, else a note
            if bold:
                sub = {'label': text, 'items': [], 'notes': []}
                sec['blocks'].append(sub); stack = []
            else:
                sub['notes'].append(text)
            continue
        item = {'text': text, 'children': []}
        while len(stack) > ilvl:
            stack.pop()
        if ilvl == 0:
            sub['items'].append(item)
        else:
            stack[ilvl - 1]['children'].append(item)
        stack = stack[:ilvl] + [item]
    return accounts

if __name__ == '__main__':
    accts = parse('/Users/abhi19/Downloads/Customer_Intelligence_Account_Data.docx')
    json.dump(accts, open('/tmp/ci/tree.json', 'w'), indent=1)
    print(len(accts), [a['name'] for a in accts])
    a = accts[1]
    for t, s in a['sections'].items():
        print('==', t, [(b['label'], len(b['items'])) for b in s['blocks']])

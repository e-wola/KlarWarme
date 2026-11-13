from pathlib import Path
from bs4 import BeautifulSoup
from collections import Counter
from urllib.parse import unquote,urlsplit
from PIL import Image
import json,re,subprocess,sys
base=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]
htmlfiles=sorted([p for p in base.rglob('*.html') if 'tests' not in str(p) and p.name != '404.html']);errs=[];warn=[]
htmlfiles = [f for f in htmlfiles if f.name != '404.html']
assert len(htmlfiles)==17,f'Expected 17 html, got {len(htmlfiles)}'
assetsizes=[]
for f in htmlfiles:
 s=BeautifulSoup(f.read_text(encoding='utf-8'),'html.parser')
 def fail(msg):errs.append(f'{f.name}: {msg}')
 title=s.title.get_text(strip=True) if s.title else ''
 if not 25<len(title)<90: fail('weak title size')
 for typ in ('description','robots'):
  if not s.find('meta',attrs={'name':typ}):fail('missing meta '+typ)
 if s.find('meta',attrs={'name':'robots'}).get('content')!='noindex,nofollow,noarchive':fail('unsafe robots index')
 h1=s.select('main h1')
 if len(h1)!=1:fail('h1 count '+str(len(h1)))
 if s.html.get('lang')!='de':fail('missing language')
 if not s.select_one('a.skip[href="#main"]'):fail('skip link absent')
 ids=[i['id'] for i in s.select('[id]')]
 dup=[k for k,v in Counter(ids).items() if v>1]
 if dup:fail('duplicate IDs '+repr(dup))
 for node in s.find_all(['a','img','script','link']):
  field='href' if node.name in ('a','link') else 'src'
  url=node.get(field)
  if not url or url.startswith(('http:','https:','mailto:','tel:','data:','//','#')):continue
  path=unquote(urlsplit(url).path)
  if path.startswith('/'):continue
  target=(f.parent/path).resolve()
  clean_target = target.with_suffix('.html') if not target.suffix else target
  is_valid = target.is_file() or clean_target.is_file() or (target.is_dir() and (target / 'index.html').is_file())
  if not is_valid:fail(f'broken {node.name} {url}')
 for img in s.find_all('img'):
  if not img.has_attr('alt'):fail('missing image alt '+img.get('src',''))
  if not all(img.has_attr(z) for z in ('width','height')) and img.get('src','').endswith(('.png','.webp')):fail('missing image dimensions '+img.get('src',''))
  if img.get('src','').endswith('.webp') and img.get('width'):
   assetsizes.append(img['src'])
 for src in s.select('script[src]'):
  if src['src'].startswith('https://'):warn.append(f'{f.name}: third-party script')
 for fb in s.select('[data-enquiry-form]'):
  if fb.get('method')!='post':fail('form method not POST')
  if not fb.select_one('[data-feedback][aria-live]'):fail('no form feedback status')
 for a in s.select('a[target="_blank"]'):
  if 'noopener' not in a.get('rel',[]):fail('target blank missing noopener')
 for button in s.select('[data-service-toggle]'):
  if button.name!='button' or button.get('aria-controls')!='services-mega':fail('service toggle semantics')
 for button in s.select('[data-menu-toggle]'):
  if button.get('aria-controls')!='site-navigation':fail('menu aria controls mismatch')
 for datum in s.select('script[type="application/ld+json"]'):
  try:
   entry=json.loads(datum.string or datum.get_text())
   if entry.get('@type')=='LocalBusiness':fail('LocalBusiness unverified')
  except Exception as e:fail('invalid schema '+repr(e))
 if len(s.select('nav#site-navigation'))!=1:fail('nav missing')
 if f.name not in ('impressum.html','datenschutz.html') and 'https://www.ihre-domain.de' in f.read_text():fail('placeholder domain')
for js in sorted((base/'assets/js').glob('*.js')):
 r=subprocess.run(['node','--check',str(js)],capture_output=True,text=True)
 if r.returncode:errs.append('JS invalid '+js.name+': '+r.stderr)
if not (base/'robots.txt').read_text().splitlines().__contains__('Disallow: /'):errs.append('preview robots does not block indexing')
if (base/'sitemap.xml').exists():errs.append('unverified live sitemap')
for f in (base/'assets/images').glob('*'):
 if f.suffix in ('.png','.webp'):
  assetsizes.append((f.name,f.stat().st_size))
print('PAGES',len(htmlfiles))
print('LINKS',sum(len(BeautifulSoup(f.read_text(),'html.parser').select('a[href]')) for f in htmlfiles))
print('LOCAL_ASSETS',len(set(x for x in assetsizes if isinstance(x,str))))
print('STATIC_ERRORS',len(errs))
for x in errs[:50]:print('ERROR',x)
print('STATIC_WARNINGS',len(warn))
for x in warn[:10]:print('WARNING',x)
print('IMAGE_BYTES',sum(x[1] for x in assetsizes if isinstance(x,tuple)))
print('JS_BYTES',sum(f.stat().st_size for f in (base/'assets/js').glob('*.js')))
print('CSS_BYTES',(base/'assets/css/site.css').stat().st_size)
if errs:sys.exit(1)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const BLOG_DIR = path.join(ROOT, 'blog');
const BLOG_INDEX = path.join(ROOT, 'blog.html');
const BASE_URL = 'https://dokterrichard.nl';

function slugify(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').slice(0, 80);
}

function readAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), 'utf8'));
      data._filename = f;
      return data;
    })
    .filter(p => p.published !== false)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDateNL(iso) {
  const d = new Date(iso);
  const months = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function renderPostHTML(post) {
  const title = escapeHtml(post.title);
  const description = escapeHtml(post.excerpt || post.title);
  const canonical = `${BASE_URL}/blog/${post.slug}.html`;
  const cover = post.cover || '/images/Richard_Hoofs-32.webp';
  const coverAbs = cover.startsWith('http') ? cover : `${BASE_URL}${cover}`;
  const dateISO = new Date(post.date).toISOString();

  return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Dokter Richard</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Richard Hoofs">
    <meta name="theme-color" content="#2d5a3d">
    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${coverAbs}">
    <meta property="og:locale" content="nl_NL">
    <meta property="og:site_name" content="Dokter Richard">
    <meta property="article:published_time" content="${dateISO}">
    <meta property="article:author" content="Richard Hoofs">
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${coverAbs}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../shared.css">
    <style>
        .post-hero {
            padding: 140px 24px 60px;
            max-width: 820px;
            margin: 0 auto;
            text-align: center;
        }
        .post-hero .post-meta {
            font-size: 13px;
            color: var(--text-muted);
            letter-spacing: 0.04em;
            text-transform: uppercase;
            margin-bottom: 16px;
        }
        .post-hero h1 {
            color: var(--green-dark);
            margin-bottom: 18px;
            font-size: clamp(28px, 4vw, 44px);
            line-height: 1.2;
        }
        .post-hero .post-excerpt {
            font-size: 17px;
            color: var(--text-body);
            line-height: 1.7;
            max-width: 640px;
            margin: 0 auto;
        }
        .post-cover {
            max-width: 1120px;
            margin: 0 auto 40px;
            padding: 0 24px;
        }
        .post-cover img {
            width: 100%;
            aspect-ratio: 16 / 9;
            object-fit: cover;
            border-radius: 16px;
            display: block;
        }
        .post-body {
            max-width: 720px;
            margin: 0 auto;
            padding: 0 24px 100px;
            font-size: 17px;
            line-height: 1.8;
            color: var(--text-body);
        }
        .post-body h2 { font-size: 26px; color: var(--green-dark); margin: 44px 0 16px; line-height: 1.3; }
        .post-body h3 { font-size: 21px; color: var(--green-dark); margin: 36px 0 14px; }
        .post-body p { margin-bottom: 20px; }
        .post-body ul, .post-body ol { margin: 0 0 20px 24px; }
        .post-body li { margin-bottom: 8px; }
        .post-body a { color: var(--green); text-decoration: underline; }
        .post-body blockquote {
            border-left: 3px solid var(--green);
            margin: 28px 0;
            padding: 8px 0 8px 24px;
            font-style: italic;
            color: var(--text-muted);
        }
        .post-body img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 28px 0;
            display: block;
        }
        .post-body figure { margin: 28px 0; }
        .post-body figure img { margin: 0; }
        .post-body figure figcaption {
            font-size: 14px;
            color: var(--text-muted);
            text-align: center;
            margin-top: 10px;
            font-style: italic;
        }
        .post-footer {
            max-width: 720px;
            margin: 0 auto;
            padding: 40px 24px 80px;
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }
        .post-footer a {
            color: var(--green);
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .post-footer a:hover { text-decoration: underline; }
    </style>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": ${JSON.stringify(post.title)},
      "description": ${JSON.stringify(post.excerpt || post.title)},
      "image": "${coverAbs}",
      "author": {
        "@type": "Person",
        "name": "Richard Hoofs",
        "url": "${BASE_URL}/over.html"
      },
      "publisher": {
        "@type": "Person",
        "name": "Richard Hoofs"
      },
      "datePublished": "${dateISO}",
      "dateModified": "${dateISO}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${canonical}"
      },
      "inLanguage": "nl-NL"
    }
    </script>
</head>
<body>

<div id="nav-placeholder"></div>

<article>
    <header class="post-hero fade-in">
        <div class="post-meta">${formatDateNL(post.date)}</div>
        <h1>${title}</h1>
        ${post.excerpt ? `<p class="post-excerpt">${escapeHtml(post.excerpt)}</p>` : ''}
    </header>

    ${post.cover ? `<div class="post-cover fade-in">
        <img src="${cover.startsWith('/') ? '..' + cover : cover}" alt="${title}" loading="eager">
    </div>` : ''}

    <div class="post-body">
${post.body_html || ''}
    </div>

    <footer class="post-footer">
        <a href="../blog.html">← Terug naar blog</a>
        <a href="../contact.html">Neem contact op →</a>
    </footer>
</article>

<div id="footer-placeholder"></div>

<script>
  // Rewrite nav/footer placeholder paths voor subfolder
  document.addEventListener('DOMContentLoaded', function(){
    fetch('../nav.html').then(r=>r.text()).then(html=>{
      html = html.replace(/(href|src)="(?!https?:|\\/|#|mailto:)/g, '$1="../');
      var ph = document.getElementById('nav-placeholder');
      if (ph) ph.outerHTML = html;
      var nav = document.querySelector('.nav');
      if (nav) nav.classList.add('subpage-nav');
    });
    fetch('../footer.html').then(r=>r.text()).then(html=>{
      html = html.replace(/(href|src)="(?!https?:|\\/|#|mailto:)/g, '$1="../');
      var ph = document.getElementById('footer-placeholder');
      if (ph) ph.outerHTML = html;
    });
  });
</script>
<script>
var obs=new IntersectionObserver(function(e){e.forEach(function(en){if(en.isIntersecting)en.target.classList.add('visible')})},{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.fade-in').forEach(function(el){obs.observe(el)});
</script>

</body>
</html>
`;
}

function renderBlogIndex(posts) {
  const cards = posts.map(p => {
    const cover = p.cover || '/images/Richard_Hoofs-32.webp';
    return `        <a href="blog/${p.slug}.html" class="blog-card fade-in">
            <div class="blog-card-image"><img src="${cover}" alt="${escapeHtml(p.title)}" loading="lazy"></div>
            <div class="blog-card-body">
                <div class="blog-card-date">${formatDateNL(p.date)}</div>
                <h3>${escapeHtml(p.title)}</h3>
                <p>${escapeHtml(p.excerpt || '')}</p>
                <span class="blog-card-link">Lees meer →</span>
            </div>
        </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog | Dokter Richard</title>
    <meta name="description" content="Artikelen en inzichten van Richard Hoofs over gezondheid, bezieling en holistische geneeskunde.">
    <link rel="canonical" href="${BASE_URL}/blog.html">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Richard Hoofs">
    <meta name="theme-color" content="#2d5a3d">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${BASE_URL}/blog.html">
    <meta property="og:title" content="Blog | Dokter Richard">
    <meta property="og:description" content="Artikelen en inzichten van Richard Hoofs.">
    <meta property="og:image" content="${BASE_URL}/images/Richard_Hoofs-32.webp">
    <meta property="og:locale" content="nl_NL">
    <meta property="og:site_name" content="Dokter Richard">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="shared.css">
    <style>
        .blog-hero {
            background: var(--green-dark);
            padding: 160px 48px 80px;
            text-align: center;
        }
        .blog-hero-inner { max-width: 640px; margin: 0 auto; }
        .blog-hero h1 { color: #fff; margin-bottom: 16px; }
        .blog-hero p { font-size: 16px; color: rgba(255,255,255,0.72); line-height: 1.8; }
        .blog-grid {
            max-width: 1120px;
            margin: 0 auto;
            padding: 80px 24px 100px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 32px;
        }
        .blog-card {
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            text-decoration: none;
            color: inherit;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
        }
        .blog-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.08); }
        .blog-card-image { aspect-ratio: 16 / 10; overflow: hidden; }
        .blog-card-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .blog-card-body { padding: 22px 24px 26px; flex: 1; display: flex; flex-direction: column; }
        .blog-card-date {
            font-size: 12px;
            color: var(--text-muted);
            letter-spacing: 0.04em;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .blog-card-body h3 {
            font-size: 20px;
            color: var(--green-dark);
            margin-bottom: 10px;
            line-height: 1.3;
        }
        .blog-card-body p {
            font-size: 14px;
            color: var(--text-body);
            line-height: 1.6;
            margin-bottom: 14px;
            flex: 1;
        }
        .blog-card-link {
            font-size: 14px;
            font-weight: 600;
            color: var(--green);
        }
        .blog-empty {
            text-align: center;
            padding: 80px 24px;
            color: var(--text-muted);
        }
        @media (max-width: 768px) {
            .blog-hero { padding: 120px 24px 60px; }
            .blog-grid { padding: 50px 20px 80px; gap: 24px; }
        }
    </style>
</head>
<body>

<div id="nav-placeholder"></div>

<section class="blog-hero fade-in">
    <div class="blog-hero-inner">
        <h1>Blog</h1>
        <p>Richard deelt zijn inzichten, ervaringen en verhalen over gezondheid, bewustzijn en holistische geneeskunde.</p>
    </div>
</section>

<main>
${posts.length ? `    <section class="blog-grid">
${cards}
    </section>` : `    <div class="blog-empty">
        <p>Er zijn nog geen artikelen gepubliceerd. Kom binnenkort terug.</p>
    </div>`}
</main>

<div id="footer-placeholder"></div>

<script src="nav.js"></script>
<script>
var obs=new IntersectionObserver(function(e){e.forEach(function(en){if(en.isIntersecting)en.target.classList.add('visible')})},{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.fade-in').forEach(function(el){obs.observe(el)});
</script>
<script src="footer.js"></script>
</body>
</html>
`;
}

function renderSitemap(posts) {
  const pages = [
    '', 'over.html', 'coaching.html', 'behandelingen.html', 'boeken.html',
    'contact.html', 'consult.html', 'blog.html', 'nieuwe-geneeskunde.html',
    'cafe-noir.html', 'zelfscan.html'
  ];
  const today = new Date().toISOString().split('T')[0];
  const urls = pages.map(p => `  <url>
    <loc>${BASE_URL}/${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`);
  for (const post of posts) {
    urls.push(`  <url>
    <loc>${BASE_URL}/blog/${post.slug}.html</loc>
    <lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
  </url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

function generateAll() {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

  const posts = readAllPosts();

  // Ruim oude gegenereerde blog HTML op (alleen die van oude posts die niet meer bestaan)
  const currentSlugs = new Set(posts.map(p => `${p.slug}.html`));
  for (const f of fs.readdirSync(BLOG_DIR)) {
    if (f.endsWith('.html') && !currentSlugs.has(f)) {
      fs.unlinkSync(path.join(BLOG_DIR, f));
    }
  }

  // Genereer per-post HTML
  for (const post of posts) {
    const html = renderPostHTML(post);
    fs.writeFileSync(path.join(BLOG_DIR, `${post.slug}.html`), html);
  }

  // Genereer blog index
  fs.writeFileSync(BLOG_INDEX, renderBlogIndex(posts));

  // Genereer sitemap.xml + robots.txt
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), renderSitemap(posts));
  if (!fs.existsSync(path.join(ROOT, 'robots.txt'))) {
    fs.writeFileSync(path.join(ROOT, 'robots.txt'),
      `User-agent: *\nAllow: /\nDisallow: /beheer\nDisallow: /cms/\nDisallow: /api/\n\nSitemap: ${BASE_URL}/sitemap.xml\n`);
  }

  return { count: posts.length, posts };
}

module.exports = { generateAll, readAllPosts, slugify, POSTS_DIR, BLOG_DIR };

if (require.main === module) {
  const result = generateAll();
  console.log(`✓ ${result.count} posts gegenereerd`);
}

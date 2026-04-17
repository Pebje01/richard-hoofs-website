require('dotenv').config();
const express = require('express');
const session = require('express-session');
const multer  = require('multer');
const cheerio = require('cheerio');
const fs      = require('fs');
const path    = require('path');

const app           = express();
const PORT          = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'richard';
const SESSION_SECRET = process.env.SESSION_SECRET || 'verander-dit-geheim';

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000 } // 8 uur
}));

// ── Afbeeldingen uploaden ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'images')),
  filename:    (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .toLowerCase().replace(/[^a-z0-9]/g, '-');
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ── Auth helper ───────────────────────────────────────────────────────────────
const requireAuth = (req, res, next) => {
  if (req.session.authenticated) return next();
  res.redirect('/beheer/login');
};

// ── CMS config ────────────────────────────────────────────────────────────────
const cmsConfig = require('./cms-config');

// ── Blog module ───────────────────────────────────────────────────────────────
const blog = require('./scripts/blog-generator');

// ── Git auto-sync ─────────────────────────────────────────────────────────────
const gitSync = require('./scripts/git-sync');

// ── Beheer routes (voor statische bestanden, anders worden ze geblokt) ────────
app.get('/beheer/login', (req, res) => {
  if (req.session.authenticated) return res.redirect('/beheer');
  res.sendFile(path.join(__dirname, 'cms', 'login.html'));
});

app.post('/beheer/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    req.session.authenticated = true;
    res.redirect('/beheer');
  } else {
    res.redirect('/beheer/login?fout=1');
  }
});

app.get('/beheer/uitloggen', (req, res) => {
  req.session.destroy();
  res.redirect('/beheer/login');
});

app.get('/beheer', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'cms', 'panel.html'));
});

// ── API: lees bewerkbare velden van een pagina ────────────────────────────────
app.get('/api/content/:page', requireAuth, (req, res) => {
  const pageKey = req.params.page;
  const config  = cmsConfig[pageKey];
  if (!config) return res.status(404).json({ error: 'Pagina niet gevonden' });

  const filePath = path.join(__dirname, `${pageKey}.html`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'HTML-bestand niet gevonden' });

  const html = fs.readFileSync(filePath, 'utf8');
  const $    = cheerio.load(html, { decodeEntities: false });

  const result = { label: config.label, sections: [] };

  for (const section of config.sections) {
    const fields = section.fields.map(field => ({
      ...field,
      value: $(field.selector).eq(field.index || 0).html() || ''
    }));
    result.sections.push({ label: section.label, fields });
  }

  res.json(result);
});

// ── API: sla bewerkbare velden op ────────────────────────────────────────────
app.post('/api/content/:page', requireAuth, (req, res) => {
  const pageKey = req.params.page;
  const config  = cmsConfig[pageKey];
  if (!config) return res.status(404).json({ error: 'Pagina niet gevonden' });

  const filePath = path.join(__dirname, `${pageKey}.html`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'HTML-bestand niet gevonden' });

  // Backup maken
  const backup = filePath.replace('.html', `-backup-${Date.now()}.html`);
  fs.copyFileSync(filePath, path.join(__dirname, 'cms', 'backups', path.basename(backup)));

  const html = fs.readFileSync(filePath, 'utf8');
  const $    = cheerio.load(html, { decodeEntities: false });

  const updates = req.body;

  for (const section of config.sections) {
    for (const field of section.fields) {
      if (updates[field.id] !== undefined) {
        $(field.selector).eq(field.index || 0).html(updates[field.id]);
      }
    }
  }

  fs.writeFileSync(filePath, $.html());
  res.json({ success: true });

  gitSync.sync(`CMS: pagina "${config.label}" bijgewerkt`, [`${pageKey}.html`]);
});

// ── API: afbeelding uploaden ──────────────────────────────────────────────────
app.post('/api/upload', requireAuth, upload.single('afbeelding'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Geen bestand ontvangen' });
  res.json({ pad: `/images/${req.file.filename}`, naam: req.file.filename });

  gitSync.sync(`CMS: afbeelding geüpload (${req.file.filename})`, [`images/${req.file.filename}`]);
});

// ── API: afbeeldingen-bibliotheek ─────────────────────────────────────────────
app.get('/api/images', requireAuth, (req, res) => {
  const dir = path.join(__dirname, 'images');
  const exts = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.gif'];
  const files = fs.readdirSync(dir)
    .filter(f => exts.includes(path.extname(f).toLowerCase()))
    .map(f => {
      const stat = fs.statSync(path.join(dir, f));
      return { naam: f, pad: `/images/${f}`, grootte: stat.size, gewijzigd: stat.mtimeMs };
    })
    .sort((a, b) => b.gewijzigd - a.gewijzigd);
  res.json(files);
});

// ── API: Blog CRUD ────────────────────────────────────────────────────────────
app.get('/api/blog/list', requireAuth, (req, res) => {
  if (!fs.existsSync(blog.POSTS_DIR)) return res.json([]);
  const posts = fs.readdirSync(blog.POSTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(blog.POSTS_DIR, f), 'utf8'));
      return {
        slug: data.slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        cover: data.cover,
        published: data.published !== false
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(posts);
});

app.get('/api/blog/post/:slug', requireAuth, (req, res) => {
  const fp = path.join(blog.POSTS_DIR, `${req.params.slug}.json`);
  if (!fs.existsSync(fp)) return res.status(404).json({ error: 'Post niet gevonden' });
  res.json(JSON.parse(fs.readFileSync(fp, 'utf8')));
});

app.post('/api/blog/post', requireAuth, (req, res) => {
  const { slug, title, date, excerpt, cover, body_html, published, originalSlug } = req.body || {};
  if (!title || !title.trim()) return res.status(400).json({ error: 'Titel is verplicht' });

  let finalSlug = (slug && slug.trim()) || blog.slugify(title);
  finalSlug = blog.slugify(finalSlug);
  if (!finalSlug) return res.status(400).json({ error: 'Ongeldige slug' });

  if (!fs.existsSync(blog.POSTS_DIR)) fs.mkdirSync(blog.POSTS_DIR, { recursive: true });

  // Bij hernoemen: oude bestand verwijderen
  if (originalSlug && originalSlug !== finalSlug) {
    const oldFp = path.join(blog.POSTS_DIR, `${originalSlug}.json`);
    if (fs.existsSync(oldFp)) fs.unlinkSync(oldFp);
  }

  // Unieke slug afdwingen (tenzij zelfde post)
  const fp = path.join(blog.POSTS_DIR, `${finalSlug}.json`);
  if (fs.existsSync(fp) && !originalSlug) {
    return res.status(409).json({ error: 'Een post met deze slug bestaat al' });
  }

  const data = {
    slug: finalSlug,
    title: title.trim(),
    date: date || new Date().toISOString().split('T')[0],
    excerpt: (excerpt || '').trim(),
    cover: cover || '',
    body_html: body_html || '',
    published: published !== false
  };
  fs.writeFileSync(fp, JSON.stringify(data, null, 2));

  blog.generateAll();
  res.json({ success: true, slug: finalSlug });

  const action = originalSlug ? 'bijgewerkt' : 'gepubliceerd';
  gitSync.sync(`CMS: blog "${data.title}" ${action}`,
    ['posts/', 'blog/', 'blog.html', 'sitemap.xml']);
});

app.delete('/api/blog/post/:slug', requireAuth, (req, res) => {
  const fp = path.join(blog.POSTS_DIR, `${req.params.slug}.json`);
  if (!fs.existsSync(fp)) return res.status(404).json({ error: 'Post niet gevonden' });

  // Backup voor safety
  const backupDir = path.join(__dirname, 'cms', 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  fs.copyFileSync(fp, path.join(backupDir, `post-${req.params.slug}-${Date.now()}.json`));

  fs.unlinkSync(fp);
  blog.generateAll();
  res.json({ success: true });

  gitSync.sync(`CMS: blog "${req.params.slug}" verwijderd`,
    ['posts/', 'blog/', 'blog.html', 'sitemap.xml']);
});

// ── Statische bestanden (website) ─────────────────────────────────────────────
app.use(express.static(__dirname, {
  index: 'index.html',
  // cms/ map niet publiek toegankelijk maken
  dotfiles: 'deny'
}));

// Blokkeer directe toegang tot cms/ map
app.use('/cms', requireAuth);

// ── Start ─────────────────────────────────────────────────────────────────────
const backupsDir = path.join(__dirname, 'cms', 'backups');
if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });

app.listen(PORT, () => {
  console.log(`✓ Server draait op http://localhost:${PORT}`);
  console.log(`✓ Beheer: http://localhost:${PORT}/beheer`);
});

# Dokter Richard — Website + CMS

Statische HTML-website met een ingebouwd CMS voor teksten, afbeeldingen en blogposts. Draait in Node.js (Express) en deployt via Coolify op Hetzner.

## Stack

- Node.js 20 + Express (serveert statische HTML en levert de CMS-API)
- Cheerio voor HTML-edits op basis van CSS-selectors
- Quill 2 voor de WYSIWYG blog editor
- Multer voor image uploads
- simple-git voor auto-commit + push bij elke CMS-save

## Architectuur (kort)

- De HTML-bestanden zijn de enige bron van waarheid.
- Het CMS (`/beheer`) bewerkt die bestanden direct.
- Bij elke save commit de server naar GitHub (`GIT_AUTO_PUSH=true`).
- Coolify detecteert de push en herbouwt de container.

## Lokaal draaien

```bash
cp .env.example .env
# vul ADMIN_PASSWORD en SESSION_SECRET
npm install
node server.js
```

Beheerpaneel: `http://localhost:3000/beheer`

Laat `GIT_AUTO_PUSH=false` in lokale dev, anders pusht elke testwijziging naar productie.

## Deploy via Coolify op Hetzner

### 1. SSH deploy key aanmaken

Lokaal:

```bash
ssh-keygen -t ed25519 -C "cms@dokterrichard.nl" -f ./deploy_key -N ""
```

Voeg de **publieke** key (`deploy_key.pub`) toe aan GitHub → repo → Settings → Deploy keys → **Allow write access aan**.

### 2. Coolify service aanmaken

- New Resource → Application → Dockerfile
- Source: de GitHub repo van deze website
- Branch: `main`
- Build pack: Dockerfile (automatisch)
- Port: `3000` (intern; Coolify mapt naar 80/443)

### 3. Environment variables in Coolify

```
PORT=3000
ADMIN_PASSWORD=<sterk-wachtwoord>
SESSION_SECRET=<lange-willekeurige-string>
GIT_AUTO_PUSH=true
GIT_BRANCH=main
GIT_AUTHOR_NAME=Dokter Richard CMS
GIT_AUTHOR_EMAIL=cms@dokterrichard.nl
```

### 4. SSH private key als secret file mounten

Coolify → Storage → Persistent Storage:

- Source type: **File**
- Mount path: `/root/.ssh/id_ed25519`
- Content: plak de **private** key uit `deploy_key`
- Permissions: `600`

### 5. Persistent storage voor uploads

Zodat nieuwe foto's niet verloren gaan bij een rebuild voor ze naar git gepusht zijn:

- Mount `/app/images` → volume `richard-images`
- Mount `/app/posts` → volume `richard-posts`
- Mount `/app/cms/backups` → volume `richard-backups`

(Canonieke staat staat in git, maar de volumes voorkomen kortstondig dataverlies tijdens rebuilds.)

### 6. Domein + webhook

- Domein: `dokterrichard.nl` (en `www.dokterrichard.nl`) → automatisch Let's Encrypt
- GitHub webhook: Coolify geeft een webhook-URL bij de service — toevoegen bij GitHub → repo → Settings → Webhooks, zodat elke push meteen deployt.

### 7. Eerste deploy

Klik **Deploy** in Coolify. Bij succes:

- Website leeft op `https://dokterrichard.nl`
- Beheer op `https://dokterrichard.nl/beheer`

## CMS gebruik

- Login: `/beheer/login` met `ADMIN_PASSWORD`
- Pagina-teksten: sidebar → pagina kiezen → velden bewerken → opslaan
- Blog: sidebar → **Nieuwe post**; inline afbeeldingen via het Quill-toolbar plaatje
- Afbeeldingen: sidebar → **Afbeeldingen** (uploaden/verwijderen)

Elke save → auto-commit met duidelijke message → Coolify deployt binnen ~1 minuut.

## Belangrijke paden

```
server.js                    Express server + CMS API
scripts/blog-generator.js    Rendert posts/ naar blog/*.html + sitemap
scripts/git-sync.js          Auto-commit/push naar GitHub
cms-config.js                Welke HTML-velden bewerkbaar zijn
cms/panel.html               Beheer-UI
cms/login.html               Login-scherm
posts/*.json                 Brondata per blogpost
blog/*.html                  Gegenereerde blog-pagina's
images/                      Geüploade afbeeldingen
```

## Veelgestelde problemen

- **CMS-save commit niet** → check Coolify logs, meestal SSH key permissions (`600`) of deploy key zonder schrijfrechten.
- **Push faalt met "non-fast-forward"** → iemand heeft tussentijds gepusht; server.js doet een `pull --rebase` vóór elke push, dus een retry zou moeten werken.
- **Blog post verschijnt niet op `/blog`** → controleer of `published: true` staat en of de commit daadwerkelijk naar main is gegaan.

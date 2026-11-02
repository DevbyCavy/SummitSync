# Summit Sync — Website

Marketing/portfolio site for Summit Sync, "The Architects of MICE". Built from `summit-sync-architecture.md` (the spec, v1.0).

- **Frontend:** React 18 + Vite + Tailwind CSS, React Router v6, `react-helmet-async`
- **Forms API:** PHP 8 (`/api/*.php`) + MySQL, PHPMailer for contact notifications
- **Content:** JSON files in `src/content/` (no CMS)

Open decisions are marked in the code with `TODO(open):`. Search for that to see them all (`grep -rn "TODO(open)" src api public scripts`).

---

## 1. Local development

Prerequisites: Node 18+, PHP 8.1+ with `pdo_mysql`, MySQL/MariaDB (XAMPP works).

```bash
npm install
npm run logo              # logo, favicon and share image from images-src/brand/logo-source.png
npm run placeholders      # branded gradient placeholder images until real photos arrive
```

**Database**

```bash
mysql -u root -e "CREATE DATABASE summitsync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
mysql -u root summitsync < database/schema.sql
cp api/config.example.php api/config.php   # then edit DB + SMTP values
```

**Run**

The Vite dev server proxies `/api/*` to PHP. Pick one:

- **XAMPP Apache** (default): with Apache running and this folder at `htdocs/showcase-it/summitsync`, just run `npm run dev`.
- **PHP built-in server:** in one terminal `php -S 127.0.0.1:8099 -t .`, then in another
  `API_PROXY_TARGET=http://127.0.0.1:8099 npm run dev` (PowerShell: `$env:API_PROXY_TARGET="http://127.0.0.1:8099"; npm run dev`).

Open http://localhost:5173.

**Email:** the contact form needs PHPMailer: `cd api && composer install`. Without it, messages are still saved to the database but the API returns a 500 saying the notification could not be sent.

---

## 2. Editing content (no code needed)

| What | File |
|---|---|
| Phone, email, location, social links, domain | `src/content/site.json` |
| Magazine / MICE Calendar destinations (`links.magazine`, `links.calendar`). Empty = buttons shown as "coming soon" and not clickable; a full `https://` URL opens in a new tab | `src/content/site.json` |
| Services: `highlights` (the title + text the ← → arrows cycle through) and `cards` (the three static image cards) | `src/content/services.json` |
| "Why Choose Us" heading, intro and the four value points (icons: `target`, `megaphone`, `network`, `trending-up`) | `src/content/why.json` |
| "Our Publications" heading, intro and the three cards (Magazine, Weekly, Special Features). Set the magazine `cover` to a real image path when ready | `src/content/publications.json` |
| Industry Coverage gallery (first 7 items, in grid order) + lightbox text/gallery. Dated items also appear in the "Latest" feed | `src/content/projects.json` |
| "Latest" feed extras (Weekly editions, features, magazine issues): newest-first merged with dated coverage, top 4 shown | `src/content/latest.json` |
| Magazine issues | `src/content/magazine.json` |
| MICE Calendar events | `src/content/calendar.json` |

Projects grid placement follows file order: items 1–2 fill the left column (tall), items 3–5 the middle (short, tall, short), and items 6–7 the right column (tall).

### Images

1. Drop original photos (JPG/PNG) into `images-src/`, mirroring the folder and name the JSON expects, e.g.
   `images-src/projects/un-forum-cover.jpg` → referenced as `/images/projects/un-forum-cover.webp`.
2. Run `npm run images`. This writes `name.webp` plus `name-480/960/1600.webp` (for `srcset`) into `public/images/`, overwriting placeholders.

Fixed images: `hero/hero.webp` (≈1100×560), `about/about.webp` (≈16:10), `services/*.webp` (≈4:5), `projects/*.webp`, `magazine/*.webp` (cover, ≈3:4).

### Logo

The logo files in `public/images/brand/` (colour, white, "S" mark, mark silhouette for the hero watermark), plus `public/favicon.png` and `public/og-image.jpg`, are generated from `images-src/brand/logo-source.png` (the colour logo on a white background) by `npm run logo`. The current source is a screenshot, so the logo is slightly soft on high-DPI screens. For a sharper logo, replace the source with a larger PNG and re-run, or swap in SVGs in `src/components/ui/Logo.jsx`.

Magazine PDFs go in `public/magazine/` (e.g. `public/magazine/issue-01.pdf`), or use a full `https://` URL in `magazine.json`.

---

## 3. Build & deploy (shared hosting, e.g. Hostinger)

1. Set the production domain in `.env` (`VITE_SITE_URL`), `public/robots.txt` and `public/sitemap.xml`.
2. `npm run build` → `dist/` (includes the root `.htaccess`: HTTPS redirect, SPA fallback, security headers, caching).
3. Upload `dist/*` (including the hidden `.htaccess`) to `public_html/`.
4. Upload `api/` to `public_html/api/` and run `composer install` there (or upload `api/vendor/` built locally).
5. Create the MySQL database, import `database/schema.sql`, and create `api/config.php` with production DB + SMTP credentials.
   Remove `http://localhost:5173` from `allowed_origins`. If the host allows, keep `config.php` outside `public_html` and set the `SUMMITSYNC_CONFIG` env var to its path.
6. Test all three forms on production and confirm the contact email arrives.
7. Submit `https://<domain>/sitemap.xml` to Google Search Console.

---

## 4. API

All endpoints accept `POST` JSON and respond JSON. `website` is a honeypot: if it's filled in, the endpoint returns `200 { ok: true }` and discards the submission.

| Endpoint | Body | Notes |
|---|---|---|
| `/api/newsletter.php` | `{ email }` | Duplicates return 200 (no leak) |
| `/api/contact.php` | `{ name, email, phone?, organisation?, subject?, message }` | Stores + emails |
| `/api/signup.php` | `{ name, email, organisation?, role? }` | `role` ∈ Venue, Supplier, Planner, Corporate, Media, Other |

Errors: `422 { ok:false, error }` validation · `429` rate limit (5 requests / 10 min per IP per endpoint, `rate_limits` table) · `403` foreign origin · `500` server/mail error.

---

## 5. Open questions (defaults implemented)

1. **Sign Up**: opens the industry-network modal (default). For newsletter only, change the header button.
2. **Magazine / Calendar**: internal pages (default). For external platforms, change the hero buttons to external links.
3. Real phone, email, socials, domain (`site.json`, robots, sitemap, `.env`).
4. Final photos and SVG logo.
5. Footer newsletter button label: "Email" (default) or "Subscribe" (`NewsletterForm.jsx`).
6. Contact recipient and SMTP credentials (`api/config.php`).

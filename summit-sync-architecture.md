# Summit Sync — Portfolio Website
## System Architecture & Design Document (v1.0)

> **For the coding agent:** This document is the single source of truth for building the Summit Sync website. Follow it section by section. Where something is marked **[OPEN]**, implement the stated default and leave a `TODO(open):` comment so it can be revisited.

---

## 1. Project Overview

**Client:** Summit Sync — a media and industry platform connecting and showcasing Zimbabwe's MICE (Meetings, Incentives, Conferences and Exhibitions) industry.
**Location:** Harare, Zimbabwe
**Site type:** Simple, mostly-static marketing/portfolio website (single long landing page + a few light sub-pages).

### 1.1 Goals
1. Present Summit Sync as "The Architects of MICE" — credible, premium, event-industry focused.
2. Showcase services and past projects/events visually.
3. Drive three actions: **Explore the Magazine**, **Explore the MICE Calendar**, **Subscribe / Sign Up / Contact**.
4. Be fast on Zimbabwean mobile networks (low data, mid-range Android phones).

### 1.2 Non-goals (v1)
- No user accounts, logins or dashboards.
- No CMS admin panel (content lives in JSON files in the repo).
- No payments, ticketing or event booking.

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | **React 18 + Vite** | Fast build, static output, simple to host |
| Styling | **Tailwind CSS** with custom theme tokens (§4) | Rapid, consistent styling matching the design |
| Routing | **React Router v6** | Home + a few sub-pages |
| Content | Local **JSON files** in `/src/content` | Easy edits without a CMS |
| Forms backend | **Small PHP endpoint** (`/api/*.php`) + **MySQL** | Runs on standard shared hosting (e.g. Hostinger) |
| Email | **PHPMailer** over SMTP | Contact form notifications |
| Icons | `lucide-react` (UI) + inline SVG (social icons) | Lightweight |
| Hosting | Static build in `public_html/`, PHP API in `public_html/api/` | One host, one domain, SSL via host |

> If the host supports Node instead of PHP, the API layer may be swapped for an Express app with identical endpoints/contracts (§7). Do not change the frontend contracts.

---

## 3. High-Level Architecture

```
                ┌──────────────────────────────────────────┐
  Visitor ────► │  Static site (React/Vite build)           │
  (browser)     │  HTML/CSS/JS + optimized images (WebP)    │
                │  Content baked in from /src/content/*.json│
                └───────────────┬──────────────────────────┘
                                │ fetch (JSON, POST)
                                ▼
                ┌──────────────────────────────────────────┐
                │  /api (PHP 8.x on same host)              │
                │   ├─ newsletter.php  → insert subscriber  │
                │   ├─ contact.php     → insert + email     │
                │   └─ signup.php      → insert interest    │
                └───────────────┬──────────────────────────┘
                                │ PDO (prepared statements)
                                ▼
                ┌──────────────────────────────────────────┐
                │  MySQL: subscribers, contact_messages,    │
                │         signups                           │
                └──────────────────────────────────────────┘
                                │
                                ▼  SMTP (PHPMailer)
                        Summit Sync inbox
```

---

## 4. Design System (extracted from the layout)

### 4.1 Colours
| Token | Hex | Usage |
|---|---|---|
| `brand-purple` | `#4B2852` | Services section background, footer background, sub-headline text |
| `brand-purple-light` | `#5D3E64` | Hover states on purple, secondary accents |
| `brand-orange` | `#F57627` | Primary buttons, eyebrow text, underlines, borders, icons |
| `brand-orange-light` | `#F6843D` | Button hover |
| `ink` | `#231F20` | Headings, body text, image placeholders |
| `cream` | `#FEF4EE` | Hero watermark/logo tint, soft backgrounds |
| `white` | `#FFFFFF` | Page background, text on purple |

### 4.2 Typography
| Role | Font | Notes |
|---|---|---|
| Display headings (H1/H2) | **Impact** (fallback: `"Anton", "Oswald", sans-serif` via Google Fonts) | Tight, condensed, dark |
| Body, nav, buttons, cards | **Poppins** 400 / 500 / 700 (Google Fonts) | |

Scale (desktop → mobile):
- H1 hero: `clamp(2.5rem, 6vw, 5.5rem)`, line-height 1.0
- H2 section title: `clamp(2rem, 4vw, 3.25rem)`
- H3 sub-headline: Poppins Bold `1.5rem`
- Eyebrow: Poppins Bold, uppercase, `0.875rem`, orange, letter-spacing `0.05em`
- Body: Poppins Regular `1rem`, line-height 1.6
- Card text: Poppins Regular `0.875rem`

### 4.3 Components & visual rules
- **Primary button:** orange fill, white text, fully rounded (`rounded-full`), Poppins Medium.
- **Secondary button:** white/transparent fill, orange 1.5px border, orange text, `rounded-full`.
- **Outline-dark button** (nav "Contact Us"): purple/ink 1.5px border, `rounded-full`.
- **Section title underline:** short orange line (≈40px × 2px) under H2.
- **Round icon buttons:** circular outline (arrows ← → in Services; ↓ scroll cue in hero).
- **Max content width:** `1200px`, centered, horizontal padding `1.5rem` (mobile) / `3rem` (desktop).
- **Section vertical spacing:** `5rem` desktop, `3.5rem` mobile.
- **Hero watermark:** large faint Summit Sync "S" logo mark in `cream`, right side, behind content, decorative (`aria-hidden`).

---

## 5. Information Architecture

### 5.1 Routes
| Path | Page | Notes |
|---|---|---|
| `/` | Home (long landing page) | Primary page — all sections in §6 |
| `/#about`, `/#services`, `/#projects` | Anchor scroll | Nav links smooth-scroll on Home |
| `/magazine` | Magazine | Grid of issues (cover + title + PDF/external link) |
| `/calendar` | MICE Calendar | List of upcoming industry events from JSON |
| `/contact` | Contact | Contact form + details |
| `*` | 404 | Simple branded page with "Back home" |

**[OPEN]** If the Magazine and Calendar live on external platforms, change those buttons to external links (`target="_blank" rel="noopener"`) and drop the pages.

### 5.2 Navigation (header)
- Left: Summit Sync logo (links to `/`).
- Center: `Home` · `About Us` · `Projects` · `Services`.
- Right: **Sign Up** (primary orange button) · **Contact Us** (outline button).
- Sticky on scroll with white background + subtle shadow after 40px of scroll.
- Mobile (<768px): logo + hamburger → full-screen slide-in menu with all links and both buttons.
- Active section highlighted (orange text) via IntersectionObserver.

---

## 6. Home Page — Section Specs (top → bottom)

### 6.1 Hero (`<Hero />`)
- Eyebrow: **THE ARCHITECTS OF MICE**
- H1 (two lines): **Connecting an Industry.** / **Shaping Its Future**
- Sub-headline (Poppins Bold, purple): **We bring exceptional events to life.**
- Body: *From international conferences and corporate forums to bespoke experiences, we deliver seamless event management through thoughtful planning, precision and excellence.*
- Buttons: **Explore the Magazine** (primary → `/magazine`) · **Explore the MICE Calendar** (secondary → `/calendar`)
- Right side: circular ↓ scroll button → scrolls to `#services`.
- Decorative watermark logo (§4.3).
- **Featured image:** wide event photo (e.g. stage at a conference) centered, ~1100px max width. It **overlaps the boundary** between the white hero and the purple Services section — implement by giving the Services section a purple background that starts ~45% down the image (negative margin or a purple band behind the image's bottom half).
- Image: WebP, `loading="eager"`, `fetchpriority="high"`, with explicit width/height to avoid layout shift.

### 6.2 Our Services (`<Services />`, `id="services"`)
- Background: `brand-purple`, text white.
- H2: **Our Services** (white, Impact).
- Featured service block (left) + carousel arrows (right):
  - Title: **MICE Publication**
  - Text: *Industry stories, expert insights and inspiring profiles spotlighting the people and businesses shaping the MICE landscape.*
- Three cards in a row (stack on mobile; horizontal scroll-snap carousel on tablet), each = image (white placeholder, ~4:5) + title + short text:
  1. **Media & Publishing** — Showcasing the stories, insights, people and organisations shaping Zimbabwe's MICE industry.
  2. **Industry Connections** — Bringing event professionals, venues, suppliers and decision-makers together through a connected industry platform.
  3. **Events & Recognition** — Celebrating industry excellence and creating meaningful opportunities for networking, collaboration and recognition.
- ← → arrows cycle the **featured service** (title + text) and highlight the matching card. Data from `services.json`. Keyboard accessible, `aria-live="polite"` on the featured text.

### 6.3 About Us (`<About />`, `id="about"`)
- White background. H2: **About Us** with orange underline.
- Two columns (stack on mobile):
  - Left: image (dark placeholder, ~16:10).
  - Right: H3 **Bringing the MICE Industry Into Focus.** followed by body text inside a box with a **1.5px orange border** that offsets down/left so it overlaps the image's bottom-right corner (on mobile: no overlap, border box sits under image).
- Body text: *Summit Sync is a media and industry platform connecting and showcasing Zimbabwe's Meetings, Incentives, Conferences and Exhibitions (MICE) industry. Through our publication, industry calendar, directory and networking initiatives, we bring together the people, businesses and ideas shaping the business events landscape. Our goal is to make the industry more visible, connected and accessible, creating opportunities for collaboration and growth.*

### 6.4 Our Projects (`<Projects />`, `id="projects"`)
- H2: **Our Projects** with thin underline.
- **Masonry-style image grid, 3 columns** (from layout):
  - Column 1: two tall tiles (equal height).
  - Column 2: three tiles — short, tall, short.
  - Column 3: two tall tiles (equal height).
  - Implement with CSS Grid (`grid-template-rows` spans), 8–10px gaps, columns top/bottom aligned.
- Each tile: cover photo (`object-fit: cover`), on hover/focus a purple gradient overlay showing **event name, date, location**.
- Click opens a **lightbox modal** (image, title, short description, optional gallery). Close on Esc / backdrop click; focus trapped.
- Data from `projects.json` (7 items for the grid).
- Mobile: 2 columns, simple equal tiles.

### 6.5 Footer (`<Footer />`)
- Background `brand-purple`, white text. Three columns (stack on mobile):
  1. Logo, phone **+263 00 000 0000** (placeholder — `tel:` link), **HARARE, ZIMBABWE**, social icons in orange circles: LinkedIn, Email, Facebook.
  2. Links: About Us · Projects · Services.
  3. Label **Email** + newsletter form: input (placeholder "Newsletter") + orange **Email** submit button (rename visible label to "Subscribe" if client agrees — **[OPEN]**).
- Bottom bar: `© {year} Summit Sync. All rights reserved.`

---

## 7. Data & Content Model

### 7.1 Content files (`/src/content`)
```jsonc
// site.json
{
  "name": "Summit Sync",
  "tagline": "The Architects of MICE",
  "phone": "+263 00 000 0000",
  "email": "info@summitsync.co.zw",          // TODO(open): confirm
  "location": "Harare, Zimbabwe",
  "socials": { "linkedin": "", "facebook": "", "email": "mailto:" }
}

// services.json
[{ "id": "media-publishing", "title": "Media & Publishing", "summary": "...", "image": "/images/services/media.webp" }]

// projects.json
[{ "id": "un-tourism-forum-2024", "title": "First UN Tourism Regional Forum on Gastronomy Tourism for Africa",
   "date": "2024-07-26", "location": "Victoria Falls, Zimbabwe",
   "cover": "/images/projects/un-forum-cover.webp", "gallery": [], "description": "..." }]

// magazine.json
[{ "id": "issue-01", "title": "Issue 01", "cover": "/images/magazine/issue-01.webp", "url": "/magazine/issue-01.pdf", "date": "2026-10" }]

// calendar.json
[{ "id": "evt-001", "name": "...", "startDate": "2026-11-12", "endDate": "2026-11-14",
   "venue": "...", "city": "Harare", "category": "Conference", "link": "" }]
```

### 7.2 Database (MySQL)
```sql
CREATE TABLE subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip VARCHAR(45)
);

CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(40),
  organisation VARCHAR(160),
  subject VARCHAR(160),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip VARCHAR(45)
);

CREATE TABLE signups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  organisation VARCHAR(160),
  role ENUM('Venue','Supplier','Planner','Corporate','Media','Other') DEFAULT 'Other',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip VARCHAR(45)
);
```

### 7.3 API contracts
All endpoints: `POST`, `Content-Type: application/json`, respond JSON.

| Endpoint | Request body | Success | Errors |
|---|---|---|---|
| `/api/newsletter.php` | `{ email, website? }` | `200 { ok: true }` (also for duplicate emails — don't leak) | `422 { ok:false, error }`, `429` |
| `/api/contact.php` | `{ name, email, phone?, organisation?, subject?, message, website? }` | `200 { ok: true }` | `422`, `429`, `500` |
| `/api/signup.php` | `{ name, email, organisation?, role?, website? }` | `200 { ok: true }` | `422`, `429` |

`website` = **honeypot** field (hidden input). If non-empty → return `200 { ok:true }` and discard.

**[OPEN] "Sign Up" meaning:** Default = "Join the Summit Sync industry network" modal (name, email, organisation, role) feeding `signups`. If the client means newsletter only, point the button at the newsletter form instead.

---

## 8. Frontend Structure

```
summit-sync/
├─ public/
│  ├─ images/ (hero, services, about, projects, magazine — WebP)
│  ├─ favicon.svg, og-image.jpg, robots.txt, sitemap.xml
├─ src/
│  ├─ main.jsx, App.jsx (routes)
│  ├─ content/ site.json, services.json, projects.json, magazine.json, calendar.json
│  ├─ components/
│  │  ├─ layout/ Header.jsx, MobileMenu.jsx, Footer.jsx
│  │  ├─ ui/ Button.jsx, SectionTitle.jsx, IconButton.jsx, Modal.jsx, Toast.jsx
│  │  ├─ home/ Hero.jsx, Services.jsx, About.jsx, Projects.jsx, ProjectLightbox.jsx
│  │  └─ forms/ NewsletterForm.jsx, ContactForm.jsx, SignupModal.jsx
│  ├─ pages/ Home.jsx, Magazine.jsx, Calendar.jsx, Contact.jsx, NotFound.jsx
│  ├─ lib/ api.js (fetch wrapper), validators.js, useActiveSection.js
│  └─ styles/ index.css (Tailwind + font-face)
├─ api/ (deployed to public_html/api)
│  ├─ config.example.php (DB + SMTP creds; real config.php is git-ignored)
│  ├─ db.php, mailer.php, helpers.php (json response, rate limit, validation)
│  ├─ newsletter.php, contact.php, signup.php
│  └─ .htaccess (deny access to config/db/helpers files)
├─ database/schema.sql
├─ tailwind.config.js (tokens from §4)
└─ README.md (setup, build, deploy)
```

### 8.1 Tailwind theme extension
```js
theme: { extend: {
  colors: {
    brand: { purple: '#4B2852', 'purple-light': '#5D3E64', orange: '#F57627', 'orange-light': '#F6843D' },
    ink: '#231F20', cream: '#FEF4EE'
  },
  fontFamily: {
    display: ['Impact', 'Anton', 'Oswald', 'sans-serif'],
    sans: ['Poppins', 'system-ui', 'sans-serif']
  },
  maxWidth: { content: '1200px' }
}}
```

---

## 9. Behaviour & Interaction Rules
- Smooth scroll for anchor links (offset for sticky header height).
- Subtle reveal-on-scroll (fade + 16px rise) per section; disabled under `prefers-reduced-motion`.
- Forms: client-side validation (required fields, email regex), disabled button + spinner while sending, success/error toast, reset on success.
- Calendar page: sort by `startDate`, hide past events by default with a "Show past events" toggle; filter chips by `category`.
- Magazine page: responsive grid of covers (2 cols mobile, 4 desktop).

---

## 10. Non-Functional Requirements

### 10.1 Performance (targets on mid-range mobile, 4G)
- Lighthouse Performance ≥ 90, LCP < 2.5s, CLS < 0.1.
- All images WebP, responsive `srcset` (480 / 960 / 1600w), lazy-load below the fold.
- Self-host Poppins (woff2, only 400/500/700) with `font-display: swap`; preload the H1 display font.
- Total JS (gzipped) < 150 KB.

### 10.2 Accessibility (WCAG 2.1 AA)
- Semantic landmarks (`header`, `nav`, `main`, `section` with headings, `footer`).
- All images have meaningful `alt` (decorative ones `alt=""`).
- Visible focus states (orange 2px outline). All interactive elements keyboard reachable.
- Contrast: white on `#4B2852` ✔; orange `#F57627` on white is **below AA for small text** → use orange only for large text, buttons with white text at ≥ 16px medium, or borders/icons. Eyebrow text: bump to ≥ 18px bold, or darken to `#C85A14` for small sizes.

### 10.3 SEO
- Per-page `<title>` and meta description (use `react-helmet-async`).
- Open Graph + Twitter card tags with `og-image.jpg`.
- `sitemap.xml`, `robots.txt`, canonical URLs.
- JSON-LD `Organization` schema (name, logo, address Harare ZW, phone, socials).

### 10.4 Security
- PDO prepared statements only; never interpolate input into SQL.
- Server-side validation and length limits on every field; strip tags from text input.
- Honeypot + per-IP rate limit (e.g. 5 requests / 10 min per endpoint, stored in a small `rate_limits` table or file cache).
- CORS: allow only the site's own origin.
- `config.php` outside web root if the host allows, otherwise blocked via `.htaccess`.
- HTTPS enforced (redirect HTTP → HTTPS in root `.htaccess`); security headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`.

---

## 11. Build & Deployment
1. `npm install` → `npm run dev` for local work; `npm run build` → `dist/`.
2. Upload `dist/*` to `public_html/`, and `/api` to `public_html/api/`.
3. Root `.htaccess`: HTTPS redirect + SPA fallback (rewrite non-file, non-`/api` requests to `/index.html`).
4. Create MySQL DB, run `database/schema.sql`, fill `api/config.php` (DB + SMTP).
5. Test all three forms on production; confirm email delivery.
6. Submit sitemap to Google Search Console.

Environment variable for frontend: `VITE_API_BASE=/api`.

---

## 12. Acceptance Criteria (definition of done)
- [ ] Home page matches the layout: section order, colours, fonts, hero image overlap, About border-box overlap, 3-column masonry Projects grid, purple footer.
- [ ] Fully responsive at 360px, 768px, 1024px, 1440px, 1920px — no horizontal scroll.
- [ ] Header sticky, mobile menu works, active section highlighting works.
- [ ] Services arrows cycle the featured service; Projects lightbox opens/closes with keyboard.
- [ ] Newsletter, Contact and Sign Up forms store to MySQL; Contact sends an email; honeypot and rate limit verified.
- [ ] Magazine and Calendar pages render from JSON.
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95.
- [ ] All content editable by changing JSON + image files only (documented in README).

---

## 13. Open Questions (implement defaults, flag with `TODO(open):`)
1. **Sign Up** — industry network registration (default) or newsletter only?
2. **Magazine / Calendar** — internal pages (default) or external links?
3. Real phone number, email address, social links, and domain name.
4. Final images: hero event photo, 3 service images, about image, 7 project photos, logo in SVG.
5. Footer newsletter button label — keep "Email" or change to "Subscribe"?
6. Contact form recipient email and SMTP credentials.

# FuryTalks – website + API server

FuryTalks is a startup-founder talk series. This repository holds the public
website and a small Node API server, organised as a **pnpm monorepo**.

> **Read this first – what is (and is not) in this project**
>
> * The website is a **static HTML + CSS + vanilla-JavaScript page**. It is *not*
>   a React app, even though a React scaffold folder exists (see
>   [Unused leftovers](#unused-leftovers)).
> * **WhatsApp works through click-to-chat links** (`https://wa.me/<number>?text=…`).
>   There is **no WhatsApp Business Cloud API, no webhook, no access token and no
>   database of enquiries** anywhere in this project. The visitor's WhatsApp opens
>   with a pre-filled message and **the visitor presses Send themselves**.
>   (This was an explicit project rule – see `.agents/memory/furytalks-enquiry-delivery.md`.)
> * The API server currently exposes **one route only**: `GET /api/healthz`.
>   The website does **not** call the API server, so the site works without it.

---

## 1. Technology stack and folder structure

| Part | Technology |
| --- | --- |
| Monorepo | pnpm workspaces (`pnpm-workspace.yaml`), Node.js 24, TypeScript 5.9 |
| Website (`artifacts/furytalks`) | Plain HTML, vanilla JS (no framework), compiled Tailwind v4 CSS + 3 hand-written CSS files, served/built with Vite 7 |
| API server (`artifacts/api-server`) | Express 5, pino logging, CORS, bundled with esbuild |
| Database scaffold (`lib/db`) | Drizzle ORM + PostgreSQL – **no tables, not used by any route** |
| API contract (`lib/api-spec`, `lib/api-zod`, `lib/api-client-react`) | OpenAPI spec + Orval-generated Zod schemas / React client – only `healthCheck` |
| Hosting config | Replit (`.replit`, `artifacts/*/.replit-artifact/artifact.toml`) |

```
FuryTalks-WhatsApp-Backend/
├── README.md                  ← this file
├── .env.example               ← variable names + placeholders (no secrets)
├── package.json, pnpm-workspace.yaml, pnpm-lock.yaml, tsconfig*.json, .npmrc
├── .replit, .replitignore     ← Replit run/deploy configuration
│
├── artifacts/
│   ├── furytalks/             ← THE WEBSITE
│   │   ├── public/            ← ★ ALL EDITABLE WEBSITE SOURCE LIVES HERE ★
│   │   │   ├── index.html         page structure + fixed text
│   │   │   ├── css/               styles.css (compiled Tailwind), sections.css, screens.css, panels.css
│   │   │   ├── js/
│   │   │   │   ├── data/          ← content you edit: site.js, events.js, speakers.js, media.js
│   │   │   │   └── lib.js main.js events.js media.js speakers.js forms.js router.js  (behaviour)
│   │   │   ├── images/            hero-stage.jpg, auditorium.jpg, speakers/, gallery/, events/
│   │   │   ├── favicon.svg, robots.txt
│   │   ├── vite.config.ts, package.json
│   │   ├── dist/              ← GENERATED build output (do not edit)
│   │   ├── src/, index.html, components.json   ← unused React scaffold (see below)
│   │   └── .replit-artifact/artifact.toml      deploy config (static)
│   ├── api-server/            ← THE BACKEND
│   │   ├── src/               app.ts, index.ts, lib/logger.ts, routes/{index,health}.ts
│   │   ├── build.mjs          esbuild bundler
│   │   ├── dist/              ← GENERATED bundle (do not edit)
│   │   └── .replit-artifact/artifact.toml      deploy config (API)
│   └── mockup-sandbox/        ← Replit design-preview tool, unused by the site
├── lib/
│   ├── db/                    Drizzle/Postgres scaffold (empty schema)
│   ├── api-spec/              openapi.yaml + orval.config.ts
│   ├── api-zod/ api-client-react/   generated from the spec (src/generated/*)
└── scripts/                   hello.ts, post-merge.sh (Replit hook)
```

### Editable source vs generated output

| Edit these | Never edit by hand (regenerated) |
| --- | --- |
| everything in `artifacts/furytalks/public/` | `artifacts/furytalks/dist/` |
| `artifacts/api-server/src/`, `build.mjs` | `artifacts/api-server/dist/` (incl. `.map` files) |
| `lib/*/src/` (except `src/generated/`) | `lib/*/dist/`, all `*.tsbuildinfo`, `lib/*/src/generated/` (rewritten by `pnpm --filter @workspace/api-spec run codegen`) |

> **`dist/` folders were built from the *original* source.** After editing
> anything, rebuild (section 7) before deploying from `dist/`.

### Unused leftovers

Kept (nothing was deleted) but **not part of the running website**:

* `artifacts/furytalks/src/`, `artifacts/furytalks/index.html`, `components.json`
  – a Replit React/shadcn starter whose only page says "Replit Agent is building…".
  `vite.config.ts` sets `root` to `public/`, and `package.json` has no React
  dependency, so none of it is built or served.
* `artifacts/mockup-sandbox/` – a Replit component-preview sandbox.
* `replit.md` – an unfilled Replit template.

---

## 2. Install dependencies

Requires **Node.js 24** (22 also ran the shipped server bundle during testing) and **pnpm**.
`npm install` / `yarn` are blocked on purpose by the root `preinstall` script.

```bash
npm install -g pnpm        # or: corepack enable
pnpm install               # at the repository root
```

`pnpm-workspace.yaml` sets `minimumReleaseAge: 1440` (refuses package versions
published less than a day ago – a supply-chain safeguard). Leave it on.

---

## 3. Run locally

### Fastest way (no install needed) – the website only

The site is plain static files, so any static server works:

* **VS Code Live Server:** right-click `artifacts/furytalks/public/index.html` → *Open with Live Server*, or
* `cd artifacts/furytalks/public && python -m http.server 5500` → <http://localhost:5500>

Use a server rather than double-clicking the file (the `file://` route was not tested).

### With the project's own tooling (Vite)

`vite.config.ts` **requires** `PORT` and `BASE_PATH` and stops with an error without them.

```bash
# macOS / Linux / Git Bash / WSL
PORT=21397 BASE_PATH=/ pnpm --filter @workspace/furytalks run dev
```
```powershell
# Windows PowerShell
$env:PORT="21397"; $env:BASE_PATH="/"; pnpm --filter @workspace/furytalks run dev
```
```bat
:: Windows cmd
set PORT=21397 && set BASE_PATH=/ && pnpm --filter @workspace/furytalks run dev
```
Open <http://localhost:21397>.

### API server

```bash
# macOS / Linux / Git Bash / WSL  (the "dev" script uses `export`, so it needs a POSIX shell)
PORT=8080 pnpm --filter @workspace/api-server run dev
```
```powershell
# Windows PowerShell: build, then start the bundle
pnpm --filter @workspace/api-server run build
$env:PORT="8080"; $env:NODE_ENV="development"; node --enable-source-maps artifacts/api-server/dist/index.mjs
```

Check it: `curl http://localhost:8080/api/healthz` → `{"status":"ok"}`

Troubleshooting:

* **Server starts but prints nothing and never answers** → `PORT` is missing. With
  `NODE_ENV=production` it exits with a clear error; with the development logger it
  can hang silently (behaviour of the original code, not changed).
* **It does not need `DATABASE_URL`** – no route imports the database.
* Node can load a file of variables: `node --env-file=.env artifacts/api-server/dist/index.mjs`
  (nothing in the project loads `.env` automatically).

---

## 4. Environment variables

See `.env.example` (names and placeholders only).

| Variable | Used by | Required | Notes |
| --- | --- | --- | --- |
| `PORT` | API server | **Yes** | Deployment config uses `8080` |
| `NODE_ENV` | API server | No | `production` → plain JSON logs |
| `LOG_LEVEL` | API server | No | default `info` |
| `PORT`, `BASE_PATH` | Website dev/build (`vite.config.ts`) | **Yes** | Deployment config uses `21397` and `/` |
| `DATABASE_URL` | `lib/db` (Drizzle push) | No | Unused by any route today |

No secret is required, and **no secret may be put in `artifacts/furytalks/`** – every
visitor downloads that folder. A real `.env` is git-ignored.

---

## 5. WhatsApp: how it works, how to configure and test it

### How it works
1. The visitor opens **Attend FuryTalks** (event enquiry) or **Speakers → Speak at FuryTalks** (speaker application).
2. `js/forms.js` validates the fields in the browser (name, Indian 10-digit mobile starting 6–9, email, optional LinkedIn link, consent tick for speakers). A hidden "honeypot" field silently blocks simple spam bots.
3. It builds `https://wa.me/<number>?text=<URL-encoded message>` and opens it in a new tab. The message starts with `NEW FURYTALKS EVENT ENQUIRY` or `NEW FURYTALKS SPEAKER APPLICATION` followed by the answers.
4. **The visitor must press Send in WhatsApp.** Nothing is stored; there is no server-side delivery or confirmation.
5. The footer **WhatsApp** card links to `https://wa.me/<number>`.

### Configure
Change the number **in one place**: `artifacts/furytalks/public/js/data/site.js` → `whatsappNumber` (any format, e.g. `'+91 8800219630'`).
Both the forms and the footer read it. *(Before this cleanup the forms had the digits hard-coded a second time in `forms.js`; now `forms.js` reads `site.js` and keeps the old digits only as a fallback.)*

### Test
1. Serve the site (section 3), open **Attend FuryTalks**, fill the form with valid data, press **Register Interest**.
2. WhatsApp (web or app) must open to the correct number with the message pre-filled; check each line. Press Send once to confirm delivery.
3. Repeat with **Apply to Speak**.
4. Submit with an empty/invalid field → you should see red messages and *no* WhatsApp tab.
5. Check on a phone with WhatsApp installed.

### If you later want automatic delivery (Cloud API)
That is a new feature, not a setting: it needs a Meta WhatsApp Business account, a phone-number ID, a permanent access token, an HTTPS webhook with a verify token, and **new API routes** in `artifacts/api-server/src/routes/`. Keep every token in server-side environment variables only. Doing it also reverses the "no API" rule recorded in `.agents/memory/`.

---

## 6. Edit the website safely (without changing its design)

| I want to change… | Edit this |
| --- | --- |
| WhatsApp number, e-mail, Instagram/LinkedIn/YouTube/Facebook links | `public/js/data/site.js` |
| Event name, date, venue, description, poster | `public/js/data/events.js` (first event also feeds the Attend panel) |
| Speakers (name, photo, Instagram, bios) – 10 slots | `public/js/data/speakers.js` + photos in `public/images/speakers/` |
| YouTube videos, photo gallery | `public/js/data/media.js` + photos in `public/images/gallery/` |
| Headings and paragraphs of About / Discover / Stories / form text | `public/index.html` |
| Colours, spacing, fonts | existing rules in `public/css/*.css` (see warning below) |
| Behaviour (accordions, menu, forms) | the matching file in `public/js/` |

Rules that keep the layout intact:

1. **Do not rename or remove IDs / `data-*` attributes** in `index.html`
   (`#events #watch #attend #speakers #contact`, `data-acc`, `data-acc-toggle`, `data-card-link`,
   `data-scroll`, `data-menu-link`, `data-kind`, `data-rule`, `#attend-form`, `#speaker-form`,
   `#events-list`, `#video-gallery`, `#photo-gallery`, `#speaker-grid`, `#footer-email`, `#footer-phone`).
   The JavaScript looks elements up by these.
2. **Keep the six cards in the Discover section in the same order** (About, Upcoming Events, Watch, Attend, Speakers, Contact) – they are numbered 01–06 in the page.
3. **Tailwind warning:** `css/styles.css` is *compiled* Tailwind output and the project contains **no Tailwind source, config or compiler**. The classes already used in `index.html` (e.g. `text-[#c9271e]`, `md:py-36`) work; **new utility classes you invent will not exist**. Add new rules to `sections.css`, `screens.css` or `panels.css` instead (they load after `styles.css`).
4. Keep empty elements empty (e.g. `<p class="ft-error"></p>`, `#events-list`); some CSS uses `:empty`.
5. Keep the `<script>` order at the bottom of `index.html` (data files → `lib.js` → the rest).
6. After any change, open every card (Upcoming Events, Watch, Attend, Speakers), the menu, and both forms at desktop and phone width.

Placeholders still present (replace before launch): Facebook/LinkedIn/YouTube links in `site.js` show "Link needed"; the static footer in `index.html` still contains `example.com` links, `hello@example.com` and `+91 00000 00000`, which JavaScript overwrites at runtime but are visible if JavaScript is off; speaker slots are empty ("To be announced"); videos/photos show "Coming Soon". Google Fonts (DM Sans, DM Mono, Playfair Display) load from the internet.

---

## 7. Build and deploy

### Build
```bash
# needs PORT and BASE_PATH (vite.config.ts), same syntax as in section 3
PORT=21397 BASE_PATH=/ pnpm --filter @workspace/furytalks run build   # → artifacts/furytalks/dist/public
pnpm --filter @workspace/api-server run build                          # → artifacts/api-server/dist/index.mjs
pnpm run typecheck                                                     # TypeScript check of libs + API
```

### Deploy – Replit (how it was configured)
* `.replit`: `deploymentTarget = "autoscale"`, post-build `pnpm store prune`.
* Website: builds with the command above, serves `artifacts/furytalks/dist/public` statically, rewrites `/*` → `/index.html`, env `PORT=21397`, `BASE_PATH=/`.
* API: builds the bundle, runs `node --enable-source-maps artifacts/api-server/dist/index.mjs` with `PORT=8080`, `NODE_ENV=production`, health check `GET /api/healthz`, path prefix `/api`.
* `scripts/post-merge.sh` (Replit hook) runs `pnpm install --frozen-lockfile` and `pnpm --filter db push`, which needs `DATABASE_URL`.

### Deploy – any other host
* **Website only (enough for the full site, including WhatsApp links):** upload the contents of `artifacts/furytalks/public/` (or the built `dist/public/`) to any static host. No API server is required.
* **API server:** run `node artifacts/api-server/dist/index.mjs` on any Node host with `PORT` set.

---

## 8. What was changed in the cleanup, and what was verified

### Changes (everything else is byte-for-byte the original)
1. `public/css/styles.css`: re-indented from one 101 KB line into 3,400+ lines, plus an explanatory header comment. **Proven content-identical** (identical after removing whitespace).
2. `public/index.html`: ~34 KB page body split from 44 lines into ~400 indented lines. **Proven DOM-identical** (same parsed tree, same text, same empty elements); whitespace was added only beside block-level tags.
3. `public/js/forms.js`: WhatsApp number now read from `site.js` (same value today, so same behaviour).
4. Added `README.md`, `.env.example`, and `.env` entries in `.gitignore`.
5. The Git history (`.git/`) is **not** included in this delivery; your original ZIP still has it.

### Verified (actually run)
* Original and cleaned website compared in headless Chromium at **desktop 1440, tablet 820, mobile 390**: **19 full-page screenshots pixel-identical** (initial view, menu open, each of the four accordions open, submitted form).
* Same run: no JavaScript errors; all four accordions open and close; menu links open the right accordion; invalid forms are blocked; valid Attend and Speaker forms produce **identical `wa.me` URLs** before/after; honeypot blocks; footer WhatsApp/e-mail links correct; six cards keep the same positions.
* Changing `whatsappNumber` in `site.js` changes both the form target and the footer link.
* The API bundle shipped in the ZIP started with only `PORT` set (no `DATABASE_URL`); `GET /api/healthz` → `200 {"status":"ok"}`; `/api/whatsapp`, `/api/webhook`, `/` → 404 (these routes do not exist).

### Not tested (be aware)
* `pnpm install`, `vite build`, `pnpm run typecheck`, and rebuilding the API from source (no internet in the test environment) – the API test used the pre-built `dist` bundle.
* Real WhatsApp delivery, real phones/iOS/Safari, `file://` opening, Replit deployment and hooks.
* Google Fonts (blocked in the test, so the before/after comparison used fallback fonts for both).
* Frontend ↔ backend communication: **none exists** – the website never calls the API.

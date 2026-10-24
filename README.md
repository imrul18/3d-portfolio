# Md. Imrul Hosen Afnan — Portfolio

An interactive 3D developer room, built with Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4 and React Three Fiber.

Visitors scroll (or click the side dots) and the camera moves between stations, each with a neon title. The page scrollbar is hidden.

| Station | Object | Content |
| --- | --- | --- |
| Home | Room overview | Name, title, intro, specialties, call to action |
| About | Easel | Your photo, bio and specializations |
| Experience | Curved monitor | Career timeline, styled as a code editor |
| Skills | Laptop | Skills by category |
| Work | TV | Project grid. Click a project for a details popup |
| Services | Papers on a table | What you offer. Click a paper for details |
| Contact | Phone | Email, social links and an optional contact form popup |

It works on every device. On screens narrower than 1024px the room is the same, but each station shows a **Read** button that opens its content in a full-screen panel, because text on the in-room screens is too small to read on a phone. Browsers without WebGL see a short message with your name and contact links. Visitors without JavaScript see a short notice.

All content and settings live in `src/config/*.ts` and `src/data/projects.json`.

---

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build (also runs the TypeScript check) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm exec tsc --noEmit` | Type check only |

Requires Node.js 20.9+ and pnpm.

---

## Project layout

```
src/
├── app/                 Home page, 404, contact API, robots, sitemap, OG image
├── components/
│   ├── room/            The 3D room: scene, furniture, in-room screens, overlays, dialogs
│   └── ui/              Icon registry, brand icons, button, generated project covers
├── config/              ← Edit these
├── data/projects.json   ← and this
├── hooks/               Media query and motion preference hooks
├── lib/                 Content selectors, section list, room data, SEO, validation
└── types/               Types for every configuration structure
```

---

## Placeholders: the `TODO` convention

Any string value that **starts with `TODO`** counts as missing content.

- In **development** (`pnpm dev`) placeholders show, so you can spot what still needs writing.
- In **production** (`pnpm build`) they are hidden. Any entry that depends on them (a job without a real company name, for example) is left out, and a station with nothing left to show is skipped.

Change this with `placeholders` in `src/config/site.ts`: `"auto"` (default), `"show"`, or `"hide"`.

> The initial content only includes facts that were supplied. Employment history, project descriptions and links are `TODO` placeholders for you to fill in. Nothing is invented.

---

## Configuration guide

### Personal details and sections — `src/config/site.ts`

`name`, `shortName` (used as the logo), `title`, `description`, `locale`, `url` (see [Production domain](#production-domain)), `resume`, and `sections`:

```ts
{ id: "projects", label: "Work", enabled: true, order: 5, hideWhenEmpty: true }
```

- **Remove** a station: `enabled: false`.
- **Reorder:** change `order`. Lower numbers come first along the camera path.
- `label` is shown beside the side dots and on the phone **Read** button.
- `hideWhenEmpty` (default `true`) skips a station with no publishable content.

### Opening view — `src/config/hero.ts`

`greeting`, `headline` (defaults to `siteConfig.name`), `title`, `roles` (cycled on the line under the title, each sliding in from the top; `roleInterval` sets milliseconds per role), `intro`, `specialties` (shown as chips), `primaryCta` (a section anchor like `"#projects"` moves the camera there; a URL opens it), `showResumeButton`, `showSocialLinks`, and the `availability` badge (off by default).

**Your photo:** save it as `public/images/profile.jpg` (at least 1000px wide looks sharpest). It appears on the About easel. `portrait.focus` (a CSS object-position such as `"50% 20%"`) keeps your face in frame when cropped, and `portrait.alt` describes it.

### About — `src/config/about.ts`

`heading`, `biography` paragraphs and `specializations` (title and icon).

### Experience — `src/config/experience.ts`

`companies` is a merged array: one entry per company, each with a `roles` array. Every company becomes one card on the monitor, in the order listed, and roles show in the order listed (newest first reads best).

```ts
{
  id: "weezly",
  company: "Weezly",
  companyUrl: "https://weezly.de",
  employmentType: "full-time",
  location: { kind: "remote" },          // or { kind: "onsite", place: "Dhaka" }
  enabled: true,
  roles: [
    { id: "weezly-senior", title: "Senior Developer", startDate: "2026-08", currentlyWorking: true, … },
    { id: "weezly-mobile", title: "Mobile App Developer", startDate: "2024-04", endDate: "2026-07", currentlyWorking: false, … },
  ],
}
```

- `currentlyWorking: true` means a current role with no end date (it shows "Present"). `currentlyWorking: false` is a past role: add its `endDate` (`YYYY-MM`), or leave it out to show only the start date.
- A card is marked **Current** when any of its roles is current. Its date range runs from the earliest start to the latest end (or "Present"), with the total length.
- Roles support `description`, `responsibilities`, `achievements`, `technologies` and `enabled` (defaults to true). The card's tech chips combine every role's technologies.
- The monitor shows the first three companies side by side (scroll inside a card for more); the phone panel shows all of them.

### Skills — `src/config/skills.ts`

Categories (`id`, `label`, `icon`, `skills`, `enabled`) in display order. There are deliberately no proficiency percentages.

### Projects — `src/data/projects.json` + `src/config/projects.ts`

**To add a project**, append an object to `projects` in `src/data/projects.json`:

```json
{
  "id": "my-app",
  "slug": "my-app",
  "name": "My App",
  "shortDescription": "One sentence.",
  "fullDescription": "A paragraph for the details popup.",
  "coverImage": { "src": "/projects/my-app/cover.jpg", "alt": "My App dashboard showing…" },
  "gallery": [{ "src": "/projects/my-app/1.jpg", "alt": "…" }],
  "technologies": ["Laravel", "Vue", "MySQL"],
  "category": "web",
  "role": "Lead developer",
  "features": ["…"],
  "challenges": ["…"],
  "featured": true,
  "order": 1,
  "liveUrl": "https://…",
  "sourceUrl": "https://github.com/…",
  "details": true,
  "published": true,
  "startDate": "2024-02",
  "endDate": "2024-09"
}
```

- The file is validated with Zod at build time. A typo (bad slug, malformed URL, duplicate slug) fails the build with a clear message.
- `category` must match an `id` in `projectsConfig.categories`, which supplies the labels.
- Images go in `public/projects/`. Without a `coverImage`, a cover is generated from the project name.
- Clicking a project on the TV opens a details popup when `details` is true and the project has a description or features. Live and source links appear only when set.
- `projectsConfig.featuredOnly` shows only featured projects.

### Services — `src/config/services.ts`

Each item: `title`, `description`, `icon`, optional `details`, and `enabled`. The table holds up to seven papers. Clicking a paper (or a card in the phone panel) opens a details popup with a **Discuss this** button that opens the contact form, then falls back to email, then to the Contact station; it's hidden when none of those exist. The button text is `labels.discuss` in `src/config/room.ts`.

### Social links — `src/config/social.ts`

Fill in each `url` and set `enabled: true`. Available `icon` values are listed in `src/types/icon.ts`. Set `showInHero: false` to keep a link off the opening view.

### Contact — `src/config/contact.ts`

- `email` only appears when `publishEmail: true`. Nothing private is published by default.
- **Contact form:** messages are sent through the **Aetherix mail API** (your `MailServer` project: `POST /api/send-mail`, which queues mail and delivers it from `no-reply@mail.weaetherix.com`). With `form.enabled: true` and the server variables `MAIL_API_URL` (the full endpoint URL) and `CONTACT_TO_EMAIL` set (see `.env.example`), the phone shows "Send a message", which opens the form in a popup. You receive a notification email (same layout as the nordova notifications) with the sender's details, their message and a **Reply** button. Optional: `MAIL_API_KEY` (sent as a bearer token), `MAIL_FROM_NAME`, `MAIL_FROM_ADDRESS`. The MailServer's queue worker (`php artisan queue:work`) must be running for mail to go out. Set these variables before `pnpm build` (and in your host's environment): the page is pre-rendered, so whether the **Send a message** button appears is decided at build time. Submissions are validated with Zod on the server and protected by a honeypot field, a minimum fill time, and a per-IP rate limit. Without those variables the button isn't shown, and the site never pretends a message was sent.
- If there's no email, no social link and no form, the contact station is skipped in production.

### SEO — `src/config/seo.ts`

Default title, title template, description, keywords, Twitter handle, `index` (set to `false` to add `noindex` and block crawlers in robots.txt), and `jsonLd` (schema.org `Person` data built only from configured values). The Open Graph image is generated from your name, title and theme colors by `src/app/opengraph-image.tsx`; replace it with `src/app/opengraph-image.png` to use a static image.

---

## The room — `src/config/room.ts`

| Setting | Effect |
| --- | --- |
| `compactWidth` | Below this width (default 1024px): lighter rendering, smaller overlays, and the **Read** panel button. |
| `neonColor` | Color of the neon station titles. |
| `palette` | Room material colors: background, floor, hex lines, walls, furniture, accent LEDs, screens, wood, paper, fan glow. |
| `snap` | `enabled` and `threshold`: when scrolling stops, the room moves on to the next station if you scrolled at least `threshold` of the way there (default `0.1` = 10%), otherwise it eases back. Works with mouse wheel, trackpad, keyboard and touch (it waits until your finger lifts). |
| `loader` | Title and message on the intro screen. |
| `labels` | The scroll and skip-ahead hints, the Read button, and the no-WebGL / no-JavaScript messages. |
| `stations` | Per section: `camera` and `target` positions (meters; the desk is at the origin facing +z), the `neon` title, and a `hint`. |

Stations follow the order and visibility of `siteConfig.sections`. On portrait screens the camera automatically pulls back along its view line so each station still fits.

The furniture is built from code in `src/components/room/`, so there are no model files to license or download. Positions shared with the cameras are exported from `Stations.tsx` and `DeskSetup.tsx`. Screen content (`ScreenContent.tsx`) is real HTML placed in 3D, so it stays crisp, selectable and clickable.

## Interface theme — `src/config/theme.ts`

Colors, shadows, radii and type settings for the overlays, in-room screens, dialogs and loader. They become CSS custom properties and Tailwind utilities (`colors.primary` → `--primary` → `bg-primary`). The site is dark only.

**Fonts** are loaded with `next/font` in `src/lib/fonts.ts`: Geist for text, Geist Mono for code-style screens, and Yellowtail for the neon signs.

## Motion — `src/config/animations.ts`

`reducedMotion`: `"user"` follows the visitor's OS setting, `"always"` forces reduced motion, `"never"` ignores it. With reduced motion the camera jumps between stations instead of flying, and pointer parallax stops.

---

## Resume

1. Put the PDF in `public/resume/`, e.g. `public/resume/afnan-resume.pdf`.
2. In `src/config/site.ts`, set `resume: { enabled: true, url: "/resume/afnan-resume.pdf", label: "Download resume" }`.
3. The opening view shows the button while `heroConfig.showResumeButton` is true.

## Production domain

Set `url` in `src/config/site.ts` (e.g. `"https://your-domain.com"`), or set `NEXT_PUBLIC_SITE_URL` in your hosting environment. This enables canonical URLs, absolute Open Graph URLs, the sitemap entry, and the `Sitemap:` line in robots.txt. Until it's set, the build warns about `metadataBase`; that's expected.

## Deploying

**Vercel (simplest):** import the repository, keep the defaults (framework: Next.js, build: `pnpm build`), and add the environment variables from `.env.example` that you need.

**Any Node host:**

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start        # serves on PORT (default 3000)
```

The contact form's rate limit is in-memory, per instance. For multi-instance deployments, swap `isRateLimited` in `src/lib/contact-server.ts` for a shared store such as Redis.

---

## Quality checklist

```bash
pnpm lint && pnpm exec tsc --noEmit && pnpm build
```

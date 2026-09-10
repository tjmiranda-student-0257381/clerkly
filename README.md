# clerkly.us

Marketing website for **Clerkly** — a virtual assistant, web development and online
business support service.

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies, no framework.
Open `index.html` in a browser and it works.

---

## Pages

| File | Purpose | Menu |
| --- | --- | --- |
| `index.html` | Home — hero, services, process, pricing, testimonials | Header |
| `about.html` | About — story, values, tools, background, fit | Header |
| `videos.html` | Video library — featured video, filterable grid | Header |
| `services.html` | Six services in detail, engagement models, pricing | Header |
| `contact.html` | Enquiry form, direct details, quick FAQs | Header |
| `terms.html` | Terms of Service | Footer |
| `privacy.html` | Privacy Policy | Footer |
| `faqs.html` | Full FAQs, grouped by topic | Footer |
| `404.html` | Not-found page | — |

Supporting files: `assets/css/styles.css`, `assets/js/main.js`,
`assets/img/favicon.svg`, `robots.txt`, `sitemap.xml`.

---

## Before you go live — replace the placeholders

Everything below is invented placeholder content. Search and replace across all `.html`
files.

| Placeholder | Appears in | Replace with |
| --- | --- | --- |
| `hello@clerkly.us` | every page | Your real email address |
| `Tracy Miranda` / `Tracy` | home, about, footers | Your name (or drop it) |
| `TM` (avatar initials) | home, about | Your initials |
| `https://www.linkedin.com/` etc. | footer socials | Your real profile URLs |
| Stats (`6+ years`, `40+ businesses`, `97%`, `12k+`) | home, about | Your real numbers |
| Testimonials (Daniel R., Maria P., Amara K.) | home | Real quotes, with permission |
| Topbar notice (`2 retainer slots open`) | every page | Current availability, or delete |

Already set to real values: phone `+1 (619) 730-8655`, availability Wed–Sun 8am–2pm PT,
and all pricing (below).

**Please do not ship the invented testimonials or statistics as if they were real** —
swap in genuine ones, or delete those sections until you have them.

### Legal pages

`terms.html` and `privacy.html` are a plain-English starting point, not legal advice.
Both carry a visible note saying so. Have a lawyer in your jurisdiction review them, and
check that the privacy policy matches the tools you actually use. Update the
governing-law section in `terms.html` §18 — it currently names Delaware.

---

## Pricing model

Everything is derived from a **$35/hour base rate**. If you change the base, recompute
the retainer and project numbers below to match.

**Capacity:** Wed–Sun, 8am–2pm PT = 6 hrs/day × 5 days = **30 hrs/week ≈ 130 hrs/month**.

### Retainers (volume discount off base)

| Tier | Hours/mo | Discount | Effective rate | Price |
| --- | --- | --- | --- | --- |
| Starter | 20 | 14% | $30/hr | $600/mo |
| Growth | 50 | 20% | $28/hr | $1,400/mo |
| Scale | 100 | 26% | $26/hr | $2,600/mo |

Ad-hoc hourly work is billed at the full **$35/hr**, five-hour minimum.

Note that Scale (100 hrs) is roughly 77% of monthly capacity — one Scale client leaves
room for about one Starter client and nothing else.

### Fixed-price projects

| Project | Price | Implied hours @ $35 |
| --- | --- | --- |
| One-page landing site | from $950 | ~27 |
| 5–7 page marketing site | from $2,400 | ~69 |
| Shopify store setup | from $1,900 | ~54 |
| Site rescue / speed fix | from $575 | ~16 |
| Monthly maintenance | from $225/mo | ~6.5 |

Prices appear in `index.html`, `services.html` and `faqs.html` — including the FAQ
JSON-LD block at the top of `faqs.html`, which must stay in sync with the visible copy.

---

## Contact form (Formspree)

The form in `contact.html` posts to Formspree, which forwards each submission to the
inbox configured on the form. Visitors never leave the page and no mail client is
involved.

The endpoint is set in **two** places and they must match:

| Where | Why |
| --- | --- |
| `action` on `#contact-form` in `contact.html` | Used if JavaScript fails to load — the browser posts natively and Formspree shows its own thank-you page |
| `CONFIG.formEndpoint` in `assets/js/main.js` | Used normally — submit is intercepted and sent by `fetch`, so the visitor stays on the page |

Current endpoint: `https://formspree.io/f/xrpgrdab`

### How it behaves

- Client-side validation runs first (required fields, email format, 20-char minimum
  on the message). `novalidate` is applied by JS, so with JS disabled the browser
  does its own validation instead.
- `Accept: application/json` makes Formspree reply with JSON rather than redirecting.
- Formspree field errors (`{ errors: [{ field, message }] }`) are mapped back onto the
  matching input and shown inline.
- On failure the visitor is told to email `hello@clerkly.us` instead.

### Formspree-specific fields

| Field | Purpose |
| --- | --- |
| `email` | Formspree uses this as the reply-to, so replying to the notification answers the client directly |
| `_subject` | Notification subject. JS rewrites it to `clerkly.us enquiry from <name> - <service>` |
| `_gotcha` | Formspree's built-in honeypot. Hidden from people; if filled, the submission is dropped server-side and by `main.js` |

### Testing it

Formspree rejects requests from `file://`, so open the site over HTTP:

```bash
python -m http.server 8000    # then http://localhost:8000/contact.html
```

Note that real test submissions count against the Formspree plan's monthly quota and
land in the real inbox. To change the destination address, edit the form's settings at
formspree.io — not this codebase.

To switch providers, change both places above. Setting `CONFIG.formEndpoint` to `''`
restores the old behaviour of opening the visitor's mail client.

---

## Videos

Video slots are click-to-load: nothing is requested from YouTube until a visitor presses
play, so the page stays fast and no third-party cookies are dropped on arrival.

To publish a video, add its YouTube ID to the empty `data-video-id` attribute:

```html
<button class="video-embed" type="button" data-video-id="dQw4w9WgXcQ" ...>
```

The thumbnail loads automatically. Slots left empty render as "Coming soon" and are not
clickable. Video cards carry a `data-category` (`process`, `web`, `tools`, `clients`)
that drives the filter buttons.

---

## Local preview

Open `index.html` directly, or serve the folder to get clean paths:

```bash
python -m http.server 8000     # then visit http://localhost:8000
npx serve .                    # Node alternative
```

---

## Deploying

Any static host works — there is nothing to build.

- **Netlify / Vercel / Cloudflare Pages** — connect the repo, leave the build command
  empty, set the publish directory to the repository root.
- **GitHub Pages** — Settings → Pages → deploy from `main`, root folder.
- **Traditional hosting** — upload the whole folder to `public_html` over FTP.

After deploying, point `clerkly.us` at the host, force HTTPS, and submit
`https://clerkly.us/sitemap.xml` in Google Search Console.

### Post-deploy checklist

- [ ] Placeholders replaced (table above)
- [ ] Contact form endpoint configured and a test submission received
- [ ] Legal pages reviewed by a lawyer
- [ ] Social profile links updated
- [ ] `og-cover.png` added at `assets/img/` (1200×630) — referenced by the social tags
- [ ] Real YouTube IDs added to the video slots
- [ ] `sitemap.xml` dates refreshed
- [ ] Analytics added, if wanted (the privacy policy already describes a
      privacy-respecting setup)

---

## Design system

Design tokens live at the top of `assets/css/styles.css` as CSS custom properties.
Change the brand across the whole site by editing these:

```css
--navy-800: #0b2545;   /* primary dark  */
--blue-600: #1d6fa5;   /* primary brand */
--teal-500: #17b8a6;   /* accent        */
```

Fonts are Plus Jakarta Sans (headings) and Inter (body), loaded from Google Fonts. To
self-host them, download both families into `assets/fonts/`, replace the `<link>` in each
page's `<head>` with an `@font-face` block, and update section 6 of `privacy.html`.

Accessibility and performance notes: skip link on every page, visible focus rings,
keyboard-operable menu and accordions, ARIA state on interactive controls, honoured
`prefers-reduced-motion`, and a print stylesheet.

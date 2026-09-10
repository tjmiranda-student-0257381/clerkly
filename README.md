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
| `+1 (555) 010-1234` / `tel:+15550101234` | every page | Your real phone number |
| `Tracy Miranda` / `Tracy` | home, about, footers | Your name (or drop it) |
| `TM` (avatar initials) | home, about | Your initials |
| `https://www.linkedin.com/` etc. | footer socials | Your real profile URLs |
| Prices (`$480`, `$1,120`, `$2,100`, `$28/hour`, `From $750`) | home, services, faqs | Your real rates |
| Stats (`6+ years`, `40+ businesses`, `97%`, `12k+`) | home, about | Your real numbers |
| Testimonials (Daniel R., Maria P., Amara K.) | home | Real quotes, with permission |
| `Mon–Fri, 9:00–18:00 ET` | every page | Your working hours |
| Topbar notice (`2 retainer slots open`) | every page | Current availability, or delete |

**Please do not ship the invented testimonials or statistics as if they were real** —
swap in genuine ones, or delete those sections until you have them.

### Legal pages

`terms.html` and `privacy.html` are a plain-English starting point, not legal advice.
Both carry a visible note saying so. Have a lawyer in your jurisdiction review them, and
check that the privacy policy matches the tools you actually use. Update the
governing-law section in `terms.html` §18 — it currently names Delaware.

---

## Wiring up the contact form

The form lives in `contact.html` and is handled by `initForm()` in
`assets/js/main.js`. Configuration is at the top of that file:

```js
var CONFIG = {
  formEndpoint: '',            // POST target
  email: 'hello@clerkly.us'    // mailto fallback
};
```

**Default (no setup):** with `formEndpoint` empty, submitting opens the visitor's email
client with the message pre-filled. Works everywhere, but relies on the visitor having a
mail client configured.

**Recommended — [Formspree](https://formspree.io):** create a form, then set:

```js
formEndpoint: 'https://formspree.io/f/YOUR_FORM_ID'
```

**Netlify Forms:** add `netlify` and `name="contact"` to the `<form>` tag, set
`formEndpoint: '/'`, and Netlify captures submissions automatically.

The form already includes client-side validation, an accessible error state, a
honeypot field (`company_website`) that silently drops bot submissions, and a live
status message.

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

# Sunlight Supplies Sdn Bhd — company research

Compiled 2026-08-25 for the SunlightSuppliesWeb build. Same client as
[RackForge](https://github.com/LewixAI/RackForge).

Everything below is sourced from their own web properties (live or archived),
never invented. Where a fact differs between sources, both readings are shown.

---

## 1. The thing to know first

**`sunlightrack.com` is down.** Every page returns an ASP.NET
`Server Error in '/' Application — Runtime Error` (HTTP 500). Verified across
`/`, `/home`, `/our-services`, `/mobile/home`, `/cont/contact-us` on 2026-08-25.

Static files under `/data/`, `/css/`, `/js/` still serve 200 — only the
application is dead. That is why every image in `assets/` could be pulled at
original resolution straight from their own server; the page HTML had to come
from the Wayback Machine.

Their sister site **`sunlightrack.com.my`** (Sunlight Rack Sdn Bhd, Klang) is a
live Joomla + HikaShop site and is fully up.

The dead site is the strongest single argument for the rebuild.

---

## 2. Identity

| | |
|---|---|
| Legal name | Sunlight Supplies Sdn Bhd |
| Registration | 1068356-M |
| Founded | 2014, Kempas, Johor Bahru |
| Founder | Mr John Tang |
| Outlets | 3 — HQ Setia Business Park, Kempas Utama branch, Uda Utama branch |
| Sister company | Sunlight Rack Sdn Bhd (1292959-K), Klang, Selangor — `sunlightrack.com.my` |
| Old site built by | Webteq (JB) — ASP.NET CMS |
| .com.my site built by | Dreamztech / JBWebDesign — Joomla + HikaShop |

**Tagline (English):** "The Smile On Your Face, Made Us Move Forward."
**Tagline (Chinese):** 你臉上得笑容是我們前進的動力

The whole site is bilingual EN / 中文, with the Chinese set as a second line
under every English label rather than a language switch. Traditional and
simplified are mixed inconsistently in the source (e.g. 重型货架 simplified,
雙面陳列架子 traditional) — worth cleaning up rather than copying.

**SEO title they used:** "Racking System | Display Rack Supplier Manufacturer
Johor Bahru JB | Gondola | Oppa | Heavy Duty Racking | Sunlight Supplies"

---

## 3. Locations & contact

**Setia Business Park (HQ)**
No 8, Jalan Perniagaan Setia 1/1, Taman Perniagaan Setia, 81100 Johor Bahru, Johor
Tel +607-5543 990 · Fax +607-5543 991 · Mobile +6013-702 8880

**Kempas Utama**
28, Jalan Kempas Utama 3/1, Taman Kempas Utama, 81300 Skudai, Johor
Tel +607-5500 081 · Mobile +6010-710 8988

**Uda Utama**
6, Jalan Uda Utama 4/1, Bandar Uda Utama, 81300 Johor Bahru, Johor
Tel/Mobile +6018-262 8988

**Sunlight Rack Sdn Bhd (Klang)**
No. 74, Jalan Kapar, Kawasan 18, 41400 Klang, Selangor
WhatsApp +6013-702 8880 / +6018-289 6668 · sales@sunlightrack.com.my

Email: `sales@sunlightrack.com` and `noni@sunlightrack.com`
WhatsApp links used on the old site: 60137028880, 60107108988, 60182628988
Facebook: facebook.com/sunlightsupplies (3.6K followers)
YouTube: youtube.com/@sunlightsupplies6147

> Note: a third-party directory (webbig.com.my) lists an older HQ at
> "5, Jalan Ekoperniagaan 2/6, Taman Ekoperniagaan" and only 2 outlets. Their own
> 2022–2026 pages say Setia Business Park and 3 outlets. **Confirm with the client
> before publishing an address.**

---

## 4. What they actually sell

Two distinct businesses under one roof — this should drive the site's
information architecture.

### A. Warehouse storage systems (the RackForge side)

18 named systems, taken from their own "Our Racking System" grid:

Selective Pallet Racking · Multi-Tier Heavy Duty Racking · Heavy/Medium Duty
Storage Racking · Drive-In Racking System · Double Deep Pallet Racking Systems ·
Cantilever Racking System · Light Duty Boltless Rack · Gondola · Very Narrow
Aisle (VNA) Racking Systems · Pallet Flow Racking System · Push Back Racking
System · ASRS · Radio Shutter Racking System · Superblock Rack Supported
Platform · Oppa Rack · Rack & Stand · Pallet Rack Supported Mezzanine Platform ·
Boltless Rack

Stated capability: **loads from 1,000 up to 3,000 kg** per racking system.

### B. Retail display & store fixtures

Heavy and light duty racking · Mannequins & clothing forms · Slat wall store
fixtures · Countertop displays · Store supplies · Gondola display racking ·
Cashier machines & counters · Gridwall retail display and accessories · Hangers ·
Retail shopping bags and packaging · Oppa rack · Time recorder machines ·
Display showcases and counters

### Product catalogue (real data)

`research/product-catalogue.tsv` — **153 named products across 13 categories**,
each with a matching image in `assets/products/`:

| category | products |
|---|---|
| oppa-rack | 35 |
| rack-stand | 29 |
| other-accessories | 19 |
| wire-product | 15 |
| trolley-basket | 10 |
| hanger | 7 |
| hook | 7 |
| bar-bracket | 6 |
| boltless-rack | 6 |
| heavy-duty-rack | 6 |
| mannequin-accessories | 5 |
| cashier-counter | 4 |
| gondola | 4 |

`research/products-old-manifest.tsv` — 123 more product images from the old
`.com` site, including the hot-deal set, mapped to their category and name.

---

## 5. Service copy worth reusing

Their four stated differentiators, verbatim headings from the About page:
**Quality · Price · Service · Delivery**, closing on "Customer always First in
our company core value."

Under **Heavy Duty Racking** they promise, as a bulleted list:

- Shop measurement
- **Free AutoCAD drawing**
- Installation and dismantle service for all kinds of rack
- Ready stock and fast delivery
- Reasonable price

> "Free AutoCad Drawing" is exactly the drawing RackForge consumes. The website
> and RackForge are two ends of the same funnel — the site should say so.

**Boltless rack** — easy/fast install and dismantle, durable metal structure,
load to 300 kg, adjustable layers (4+), sizes to measure, colours beige / blue /
yellow (others on request).

**Gondola** — load to 50 kg, adjustable layers (4+), colours white and black
(others on request).

**Oppa rack** — load to 50 kg, adjustable layers, customisable with rubber
shoes, shelf dividers and side panels.

---

## 6. Clients

Named on their Our Client page (logos in `assets/cms/`):

Holiday Villa · Fraser Place · My Liberica Coffee · Al-Ikhsan · SKP · BP MPAK ·
ITG Machinery · Mid Valley Southkey · Vermi Industries · Mydin · Grand Meltique ·
Edaran Ilmu Didik · Hershey's · Forest City · Petikemas · PC Image

### Completed projects with photos

From the Gallery, captioned by client **and** system type — this is the raw
material for a real case-study section. See `research/gallery-manifest.tsv`.

| client | photos | system installed |
|---|---|---|
| ITG Machinery | 12 | Heavy Duty Racking System |
| Elite Hight | 8 | Heavy Duty Racking System |
| Zero To Infinity | 7 | Heavy Duty Racking System |
| TF Plastics | 5 | Selective Pallet Racking |
| KearyIrama Global Sdn Bhd | 4 | Superblock Rack Supported Platform |
| Grand Meltique Food Trading | 4 | Selective Pallet Racking |
| Fanz Sdn Bhd | 4 | Selective Pallet Racking |
| Keck Seng Electronic | 2 | Heavy Duty Racking System |
| Electronics World | 2 | Superblock Rack Supported Platform |
| Euro Base Technology | 1 | Selective Pallet Racking |

All ten are Johor Bahru sites. Photos are dated 2021–2022 in their filenames.

A further **13 unnamed project albums (56 photos)** came from the Klang site —
`assets/projects/album-N/`. No client names attached there.

---

## 7. Brand

- **Mark:** an "SL" monogram inside a broken ring, red → orange → yellow gradient.
  Clean 900×900 transparent PNG at `assets/brand/logo-mark.png`.
- **Wordmark:** `assets/brand/logo-wordmark-white.png` — white type, transparent
  background, so it only reads on a dark header. There is no dark-text lockup in
  any source; one will have to be rebuilt or requested.
- **Primary colour, from their own stylesheet:** `#F8941C` (66 occurrences —
  clearly the brand orange). Ink/dark: `#292929`. Greys `#919191`, `#D9D9D9`.
  Secondary accents `#FFA800`, `#FF4800`, `#F27A3D`.
- Fonts loaded by the old site: **Poppins** and **Rubik** (Google Fonts).

Note how close `#F8941C` is to RackForge's `#E8681C` — the two products can share
a visual family without either looking borrowed.

---

## 8. Sources

- `https://www.sunlightrack.com/` — live for static assets, HTTP 500 for all pages
- Wayback Machine captures of `sunlightrack.com` (2022-06 to 2026-04) — 25 pages
  saved under `research/raw/pages/`
- `https://sunlightrack.com.my/` — live sister site, product catalogue + portfolio
- `https://www.webbig.com.my/merchant/sunlight-supplies-sdn-bhd` — directory listing
- Facebook page (public, partially readable without login — 3.6K followers)

Not captured: Facebook photo albums past the first 10 images (login wall), and the
YouTube channel's video list. Both need a logged-in browser session if wanted.

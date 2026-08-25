# SunlightSuppliesWeb

Website for **Sunlight Supplies Sdn Bhd** — racking systems and retail display
fixtures, Johor Bahru. Same client as
[RackForge](https://github.com/LewixAI/RackForge).

Nothing is built yet. This commit is the research and the asset library.

## Where things are

- **`research/company-profile.md`** — read this first. Who they are, what they
  sell, their locations, their clients, their brand, and what is wrong with the
  site they have now.
- `research/product-catalogue.tsv` — 153 named products in 13 categories, each
  matched to an image file.
- `research/gallery-manifest.tsv` — 49 installation photos, each tagged with the
  customer and the racking system installed.
- `research/products-old-manifest.tsv` — 123 more product images with names.
- **`assets/`** — 494 files, ~152 MB of their own photography, logos and a PDF
  catalogue. `assets/README.md` says what is real and what is stock.
- `research/raw/` — untracked. Scraped HTML and CDX listings, kept locally only.

## The state of their current site

`sunlightrack.com` is **down**. Every page returns an ASP.NET runtime error
(HTTP 500) — verified 2026-08-25. Only its static files still serve, which is how
the assets here were recovered at full resolution; the page content came from the
Wayback Machine.

Their Klang sister site `sunlightrack.com.my` (Sunlight Rack Sdn Bhd) is a live
Joomla + HikaShop build and supplied the product catalogue.

## Two businesses, one company

Worth settling before any design work: they sell **warehouse storage systems**
(18 named systems, 1–3 tonne loads, the RackForge side of the business) and
**retail display fixtures** (gondolas, mannequins, cashier counters, hangers) to
what are largely different buyers. The old site mixed them into one product menu.

Their heavy-duty racking service list already promises "Free AutoCAD Drawing" —
the same drawing RackForge parses. The site and RackForge are two ends of one
funnel.

## Open questions for the client

1. Confirm the HQ address — their pages say Setia Business Park, a directory
   listing says Taman Ekoperniagaan.
2. Is a dark-text version of the wordmark available? Only a white-on-transparent
   lockup exists in any public source.
3. Bilingual EN/中文 throughout, or English-only with a Chinese landing? The old
   site duplicated every label and mixed traditional with simplified.
4. Are the ten named gallery customers cleared to be used as case studies?
5. Do they want the Klang company (Sunlight Rack Sdn Bhd) on the same site?

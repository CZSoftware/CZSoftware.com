# CZ Software LLC — Website

The one-page marketing site for **CZ Software LLC** (Auburn, WA). It's plain static HTML, CSS and vanilla JS: no build step, no dependencies.

Live URL (once deployed): **https://czsoftware.github.io/CZSoftware.com/**

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The site: all content, SEO meta, Open Graph and JSON-LD schema |
| `styles.css` | All styles (brand colors are CSS variables at the top) |
| `script.js` | Mobile menu, active nav, scroll reveal, footer year and the animated hero network |
| `favicon.svg` | "CZ" monogram favicon |
| `apple-touch-icon.png` | 180×180 home-screen icon |
| `og-image.png` | 1200×630 link-preview image for social and chat apps |
| `404.html` | Custom "page not found" page |
| `robots.txt`, `sitemap.xml` | Search engine crawl files |
| `.nojekyll` | Tells GitHub Pages to serve files as-is, without Jekyll |

To preview locally, double-click `index.html`.

---

## Deploy to GitHub Pages

1. Push these files to the **root** of the `main` branch of `github.com/CZSoftware/CZSoftware.com`:
   ```bash
   git init
   git add .
   git commit -m "Initial website"
   git branch -M main
   git remote add origin https://github.com/CZSoftware/CZSoftware.com.git
   git push -u origin main
   ```
2. On GitHub, open the repo and go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, then choose **Branch: `main`** and **Folder: `/ (root)`**. Click **Save**.
4. Wait 1–2 minutes. The site will be live at `https://czsoftware.github.io/CZSoftware.com/`.

### If you rename the repo or user

The full site URL is hard-coded in a few places for SEO. If the repo or account name changes, use find-and-replace on `https://czsoftware.github.io/CZSoftware.com/` across:

- `index.html`: canonical link, `og:url`, `og:image`, `twitter:image`, and every `url`/`@id`/`image`/`logo` in the JSON-LD block
- `sitemap.xml`
- `robots.txt`
- `404.html`: replace `/CZSoftware.com/` (the favicon and homepage links) with `/<NEW_REPO_NAME>/`

All other asset paths are relative, so nothing else needs to change.

### Using a custom domain (for example, czsoftware.com)

1. Buy the domain, then in **Settings → Pages → Custom domain**, enter it. GitHub will create a `CNAME` file.
2. At your DNS provider, add the records GitHub lists. For an apex domain these are four `A` records pointing to GitHub's Pages IPs, plus a `CNAME` for `www` pointing to `czsoftware.github.io`.
3. Tick **Enforce HTTPS** once it becomes available.
4. Replace `https://czsoftware.github.io/CZSoftware.com/` with `https://czsoftware.com/` in the files listed above. In `404.html`, change `/CZSoftware.com/` to `/`.

## Project links

The **Work** section in `index.html` links each project card to its page:

| Project | Link |
| --- | --- |
| Open Bitmap Internet | Chrome Web Store listing |
| Bitmap-Redirect | Chrome Web Store listing |
| Ordinals Content Viewer | Chrome Web Store listing |
| Go Chill | http://chillbugs.com/ |

To add a project, copy one of the `<li class="card work-card">` blocks and change the name, tag, description and `href`.

When you update content, also update `<lastmod>` in `sitemap.xml`.

---

## Get found: checklist

The site is already set up for search (meta tags, schema, FAQ, sitemap). These steps put it in front of people:

- [ ] **Google Business Profile** (free, and the most important step for local search): create it at business.google.com as a **service-area business**. Set the service area to Auburn, Kent, Seattle and the Puget Sound, **hide the street address**, choose the category *Software company*, and add the website link and email.
- [ ] **Bing Places for Business**: bingplaces.com. You can import directly from your Google Business Profile.
- [ ] **Google Search Console**: search.google.com/search-console. Add a URL-prefix property for the site URL, verify it with the HTML-tag method (paste the meta tag into `<head>` in `index.html`), then **submit `sitemap.xml`**.
- [ ] **Bing Webmaster Tools**: bing.com/webmasters. Import from Search Console and submit the sitemap.
- [ ] **Directories**: create profiles on **Clutch** (clutch.co), **Upwork** and **GoodFirms**, all linking back to the site.
- [ ] **Local chambers**: join or list with the **Auburn Area Chamber of Commerce** and the **Kent Chamber of Commerce**. Their member directories give you trusted local backlinks.
- [ ] **Reviews**: ask past clients for Google reviews (Business Profile → *Ask for reviews* gives you a share link) and Clutch reviews. Reply to every review.
- [ ] **Link back from your own projects**: add "Built by [CZ Software](https://czsoftware.github.io/CZSoftware.com/)" to each project's GitHub README and to the Chrome Web Store listing descriptions for your extensions.
- [ ] **Keep the details consistent**: use the same business name, city and email everywhere you list the business.
- [ ] **Test link previews**: paste the URL into opengraph.xyz or LinkedIn's Post Inspector to check the preview image and text.

# RESILIACT frontend and Sanity prototype

The website uses the actual source and assets from the example Site. Home contains the original Project overview, RESILIACT Hubs, News and Events, and Let's connect sections. About RESILIACT contains About Project, the interactive timeline, the full Consortium and Research community in that order. Outcomes contains the three outcome cards, followed by the full RESILIACT Platform explorer and published resources. All connect to Sanity, alongside news articles, published outcomes, and individual innovation hubs.

Home hides the Platform, Expected Outcomes and A European Partnership sections. It displays the full RESILIACT Hubs content, including the interactive map, hub details, replication sites, additional content and downloads, as well as the full News and Events content and article list. Home shares the same published Sanity content as `/innovation-hubs/` and `/news/`, so edits stay synchronized. Platform is a section within `/outcomes/`, and Consortium remains within `/project/`. The old `/platform/` URL and `/project/#project-platform` bookmark redirect to `/outcomes/#resiliact-platform`; `/consortium/` redirects to `/project/#project-consortium`. Their separate navigation tabs are removed. Edit the platform under **Outcomes → RESILIACT Platform** in Sanity and the consortium under **About RESILIACT → Consortium**. Both use their existing content documents, including extra content and downloads.

The navigation and section label use **Resilience pilots**. Both Home and `/innovation-hubs/` show two labelled button groups side by side below the section heading: five Nordic hubs and six replication sites. They stack on small screens. The old bottom replication list is removed. All locations are selectable from their map markers and buttons, using the same detail panel. Replication descriptions, local authorities and Living Lab approaches initially contain marked placeholder text. Edit them under **Resilience pilots → Page content and home summary → Replication site list**. The map-location key keeps each marker matched to its record when the list is reordered. The UK site is named Essex. Map controls support Enter/Space and preserve the selected site when published content refreshes.

All eleven pilot buttons have equal dimensions within the responsive layout. Selecting a pilot highlights its dot in amber and shades the existing country polygon containing that marker. A separate **Selected pilot** legend entry distinguishes selection from the blue Nordic hub and outlined replication-site symbols. The map uses country geometry rather than local administrative boundaries.

The homepage's **Let's connect** section displays the full Contact content, including the organisation, address, email, website and project links, additional text and downloads. Edit **Contact** in Sanity to update it. The separate Contact page is temporarily disabled: all Contact links lead to `/#contact`, and old `/contact/` bookmarks redirect there. The route definition and CMS content are retained for future reactivation.

This workspace is configured for project `l2s70ra1`, dataset `production`, owned by the `RESILIACT prototype` organisation under your Sanity account. Manage it at https://www.sanity.io/manage/project/l2s70ra1. The example article and hubs have already been imported.

Sanity automatically gives new projects a no-charge Growth trial, reverting to Free unless you explicitly upgrade. No payment method or paid subscription was added. This implementation uses Free-compatible features. Details: https://www.sanity.io/docs/platform-management/growth-plan-trial.

## Run locally

Use a current supported Node.js release and npm. In PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

```powershell
npm.cmd ci --cache .npm-cache
npm.cmd --prefix studio ci --cache ../.npm-cache
npm.cmd run sanity:setup
```

Setup reuses the locally configured project when available. For a new checkout, it signs you in through your browser and creates a no-charge Sanity project with a **public** `production` dataset. Choose the intended owner/organisation and paste the project ID printed by Sanity. Credentials stay in Sanity's CLI settings; ignored `.env.local` files contain only public configuration.

If the project already exists, reuse it instead of creating another:

```powershell
npm.cmd run sanity:setup -- --project YOUR_PROJECT_ID
```

Then import the example content and start both apps:

```powershell
npm.cmd run sanity:seed
npm.cmd run dev:all
```

- Homepage: http://localhost:5173
- Editor: http://localhost:3333
- Online editor: https://resiliact-norsar.sanity.studio/ — sign in with your existing Sanity project account. This uses the same project and production dataset as the local editor and works without running local servers. It is also listed under the project's Studios in the Sanity dashboard. Redeploy Studio changes with `npm.cmd --prefix studio run deploy`.
- Homepage alone before Sanity setup: `npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort`

The seed imports the five hub descriptions and existing Oslo meeting article. Stable IDs and `createIfNotExists` preserve existing entries when rerun. It creates published Sanity documents, does not deploy the frontend, and does not invent completed outcomes.

## Editing and publishing

The Studio sidebar follows the website navigation:

| Section | Editable content |
| --- | --- |
| Home | Hero gallery and project overview; shortcuts to shared RESILIACT Hubs, News and Events, and Let's connect content |
| About RESILIACT | About Project, objectives, expected results, figure, timeline and research community; nested Platform and Consortium editors |
| RESILIACT Hubs | One editor with overview headings, introduction, a DRMIH hub list and a replication-site list; each item includes full content/images/files; shared with Home |
| Outcomes | Overview headings, expected outcome cards, published outcomes/resources/files |
| News and Events | Events calendar, media/partner links, articles and blog posts/images/files |

News and Outcomes have a page-content document plus their individual content collections. RESILIACT Hubs uses one shared document containing both hub lists and their full content. About RESILIACT groups its main content, Platform and Consortium editors. Home links to its main document and the shared Hubs, News and contact documents. These shortcuts open the same existing document IDs. Publish to update the website; drafts remain private. Unpublished pages fall back to the original example copy. Home's optional background image replaces the example image; removing it restores the original. Browser titles and page descriptions update in the browser; production search metadata will need server rendering or a publish-triggered build.

Unused homepage-summary fields are hidden, and Platform/Consortium navigation labels are hidden because they now belong to About RESILIACT. **Additional page content** supports rich text and images; **Page downloads** supports files. Field descriptions identify where content appears. Hubs, News and Contact display their full content on Home; Hubs and News also display it on their dedicated pages. Home's action buttons and outcome links accept page paths; legacy Platform/Consortium links lead to their About RESILIACT sections, and Contact jumps to `/#contact`.

Edit the original Project overview under **Home → The project — homepage section**. Its existing copy, principles, extra content and downloads were moved there without changing their text. Edit the new dedicated page under **Project → Project page sections**. Uploading a project overview figure replaces the placeholder. Timeline phases can be reordered and edited; visitors select phases with clicks or arrow keys, or use Play/Pause to animate through them. Animation respects reduced-motion preferences. The initial phases are illustrative and dates are marked **to be confirmed** until the project team supplies an official schedule. TOGETHER and MEDiate are listed as sister projects, and CMINE as a research network, with the supplied website links.

| Page | URL |
| --- | --- |
| Home | `/` |
| About RESILIACT | `/project/` |
| Platform section | `/outcomes/#resiliact-platform` (old Platform URLs redirect) |
| RESILIACT Hubs | `/innovation-hubs/` |
| Outcomes | `/outcomes/` |
| Consortium section | `/project/#project-consortium` (old `/consortium/` redirects) |
| News | `/news/` |
| Contact | `/#contact` (homepage section) |

Header/footer navigation, summary links, action buttons, breadcrumbs, and related-page links connect these pages. Contact links jump to the homepage section from any page. Hubs, replication sites, articles and events have dedicated pages. Production builds include an `index.html` for each fixed page directory, all 11 default `/innovation-hubs/<site>/` pages and a redirect-only file for the old Contact URL. Edited site content addresses, article, event and archive URLs require the hosting fallback described below. To restore the Contact page, set its route path to `/contact/`, remove `dedicated: false`, and remove the Contact redirect middleware/output in `vite.config.js`.

1. Open the Studio and sign in with your invited Sanity account.
2. Choose the navigation section, then its overview or individual content collection.
3. Complete required fields, generate the page address, and upload images/files.
4. Publish. The frontend reads published content and rechecks every minute while visible and when you return. Sanity CDN caching may add a short delay; no frontend rebuild is required.
5. Unpublish to remove the CMS entry. Hub descriptions revert to the original example when no published override exists.

Free has Administrator and Viewer roles. Invite trusted NORSAR/partner publishers as Administrators at https://www.sanity.io/manage. They have project administration rights as well as content editing rights; Studio UI restrictions are not a permissions boundary. Restricted Editor/Contributor roles require another plan. Public asset uploads must not contain confidential information.

Display date is metadata, not scheduled publishing. Rich text, image alternative text/credits, attachments, external links, and hub references are supported. Articles and events have shareable page URLs; outcomes retain hash URLs. Old `#news/slug` links redirect to the corresponding article page. No draft preview is exposed by the public frontend.

The dedicated `/news/` page follows the structure of the [PARATUS News & Events page](https://www.paratus-project.eu/news-events/): Events calendar, News (external media/partner coverage), then Blog Posts (the project article archive with dates and categories). It uses RESILIACT content and styling. The homepage keeps its existing news article list.

In Studio, open **News and Events → Page content and media links** to edit the dedicated page heading, each block's heading/introduction, calendar page heading/introduction, calendar button and dated external media links with their sources. The calendar button always opens `/events/`, which provides keyword/location search, upcoming/past filtering, and List, Month and Day views. The earlier external-calendar field is preserved as a hidden legacy field.

Open **Events** to create events with a generated page address, start/end dates, location/address, organizer, category, image, registration link, programme/rich text and downloads. Each published event opens `/event/slug/`. The calendar list uses a compact month/day/year column, event summary and linked thumbnail, following the PARATUS events reference. Event pages use a large image and title panel, article content, and a Details/Venue/Organizer sidebar, stacked on mobile. The published ?Meet RESILIACT in the 9th European Civil Protection Forum!? event takes place on 3?4 November 2026 at Tour & Taxis, Brussels; dates and venue come from the official Union Civil Protection Knowledge Network page linked in the event. Edit its text, date/time, venue, website and replace the labelled placeholder image under **News and Events ? Events** in Studio. `scripts/initialize-forum-event.mjs` creates it without replacing existing editor content. Past events remain available with a notice. Dates/times and month boundaries use Europe/Oslo; the event page states this time zone. Events created before page addresses were introduced can still open using their document ID until a slug is generated.

Open **Articles and blog posts** to manage photo cards, summaries and full article pages. Upload an Article image to supply the card photo and detail-page image; cards without an image use the existing RESILIACT landscape illustration. Published articles open `/YYYY/MM/DD/slug/`, and archives are generated automatically at `/YYYY/MM/`, with year/month links and post counts. Dates come from the Display date. Earlier dated article URLs continue resolving by slug if the display date changes; keep published slugs stable. Homepage article links also open the full page. Only published records appear; no example events or media coverage are invented.

Blog editing is organised into **Article details**, **Story content** and **Files and links**. The article template follows the [PARATUS long-form story structure](https://www.paratus-project.eu/2026/09/28/when-storms-ignore-borders-building-hurricane-early-action-across-the-caribbean/): title, date/author/category/topics, optional featured photo and contributor byline, introduction, then a flexible story with section headings, paragraphs, links/lists, attributed quotes and inline photos with captions/credits. Editors can add, remove and reorder body blocks. New articles start with editable Background and context, Activities and insights, quote/photo placeholders, and Next steps. Replace or remove editorial placeholders before final publication. The existing Oslo article received this starter structure only where its body was missing; existing edits were preserved.

## Configuration and builds

The Home and RESILIACT Hubs map uses a Miller projection with detailed Natural Earth 1:50m country boundaries, following the interactive country-map approach on the PARATUS Case Studies page. All 11 locations retain their shared Sanity details, list/marker selection and keyboard controls. Zoom, drag, reset and supported-browser full screen work with the bundled SVG; no map service, API key or external map request is required. Country highlights use explicit geographic IDs so coastal cities and islands select the correct country. Run `npm.cmd run map:generate` to rebuild the SVG in `index.html` from `scripts/countries-50m.json`; the generator records its public-domain data source. Map navigation and styling are in `src/pilot-map.js` and `src/pilot-map.css`.

The homepage **Explore RESILIACT Hubs** link opens `/innovation-hubs/`, with a large hero map followed by separate **Nordic innovation hubs (DRMIH)** and **Replication sites (RS)** card groups. Hover or focus a map marker to preview its overview; touch users can tap a marker. Previews and cards link to individual `/innovation-hubs/<content-address>/` pages containing the summary, authority, local charter, featured image, full story, gallery and downloads. Cards use the editorial photograph where supplied and a bundled country illustration otherwise. Map preview text and cards refresh with published Sanity content, including reordered lists. Default map-location addresses remain valid as aliases, and old `#hub/<address>` links redirect to the dedicated page. These views are implemented in `src/pilot-pages.js`, `src/pilot-routes.js` and `src/pilot-map-preview.js`.

Each individual site page follows the PARATUS Caribbean page’s structure with an **Aim / Why / How** row, labelled **Hazards** icons and **Stakeholders involved** icons. Edit these in **RESILIACT Hubs → DRMIH hub list / Replication site list → Site profile: aim, why, how and icons**. Icon choices and their display labels can be added, removed and reordered. The initial text is drafted from the site descriptions and local charters; hazard and stakeholder categories reflect those descriptions, without adding unconfirmed hazards or organisations. Existing local-authority text, local charters, photographs, rich text, galleries and downloads remain available. `scripts/initialize-pilot-profiles.mjs` fills only missing profile fields and preserves existing edits. When no profile is stored, the frontend uses the shared defaults in `scripts/pilot-profile.mjs`; icons are original inline SVGs in `src/pilot-icons.js`.

Open **RESILIACT Hubs** directly to edit the overview and both lists in one document. The **DRMIH hub list** contains the five Nordic hubs; the **Replication site list** contains Brussels, Attica, Bratislava, Lisbon, Essex and Algiers. Open an item to edit its location, country, summary, authority, Living Lab approach, content address, featured image, full rich-text content, gallery and downloadable files. The same list item supplies both the map details and the full story opened through **Read hub updates** or **Read site updates**. Publish this document to update Home and RESILIACT Hubs together.

For an existing dataset, run `npm.cmd --prefix studio run login`, then `npm.cmd run sanity:hubs`. This merges the old individual hub content into the two embedded lists, preserving edited list summaries and media. Published stories stay published; unpublished individual-hub work is copied to the shared page draft. Legacy records remain stored for existing references and as a website fallback until migration; there is no separate Individual hubs menu. Repeated migration leaves already merged content, including intentional removals, untouched. Unconfirmed replication details retain their editorial placeholder text. The normal seed command also runs this migration.

The Consortium page follows the [GOBEYOND team layout](https://gobeyond-project.eu/who-we-are/), with an introduction, coordinator feature card and a responsive partner logo grid. NORSAR and all 22 existing partners have logo links to their official websites. In Studio → **Consortium**, edit page/team headings, the optional team photo, coordinator logo/website and each partner's logo, website, country, description, group and logo background. Drag partners to reorder. The associated partner section appears only when records are explicitly assigned to that group; no membership classification was invented. Logos are uploaded to Sanity and also bundled locally for the original page fallback.

The team-photo area displays a labelled group-picture placeholder until a photo is uploaded in Studio → **Consortium → Optional consortium team photo**. Its alternative text and caption are editable there.

The supplied `IMG_0018.HEIC` group photo is published as an optimized JPEG, with the full image visible. Its original HEIC upload was rejected by Sanity's Assets API with HTTP 422 (`Invalid image, could not process`), although Sanity's current asset documentation lists HEIF support. JPEG is a practical fallback for photos that fail that processing step. `scripts/update-consortium-photo.mjs` sets the supplied photo and the requested Attica tourism link while preserving other consortium fields.

The homepage hero is an editable image/video gallery. In **Studio → Home → Hero media gallery**, add pictures or MP4/WebM files, upload a video preview picture, set descriptions and source credits, and drag items to reorder. Publish to update the homepage. The gallery contains the existing Nordic landscape, [Wildfire in a Forest by Arnav Kainthola on Pexels](https://www.pexels.com/video/wildfire-in-a-forest-7533265/), and seven additional Pexels videos covering wildfire, flood, volcanic activity, landslide-risk landscape context, earthquake, heavy rain and grassland fire in the heatwave category. Source pages and creator credits are recorded in `scripts/additional-hero-media.mjs`. Videos are downloaded under the [Pexels license](https://www.pexels.com/license/) and optimized to muted 1280px MP4 files, with preview pictures. They are uploaded as Sanity file assets, which work on the Free prototype. The gallery includes previous/next, scrollable slide selection and play/pause controls; image slides advance after seven seconds, videos advance when finished, and playback stops when the hero is offscreen or the browser tab is hidden. Reduced-motion users start with automatic playback disabled. `scripts/initialize-hero-gallery.mjs` seeds missing galleries without replacing existing editor changes; `scripts/append-hero-videos.mjs` appends the seven requested videos without duplicating source URLs or changing existing media/order. Local copies provide the gallery when CMS data is unavailable; an explicitly empty gallery uses the legacy background image.

The prototype reads published content directly from Sanity's API with browser caching disabled. This avoids an older cached query response replacing the initial local gallery after page load, and lets published removals and reordering take effect. Media files still use Sanity's asset CDN. For a public production deployment, revisit query caching together with reliable publish-triggered invalidation.

To change hero timing, open **Home → Hero media gallery → an item → Display duration (seconds)**, enter a whole number from 1 to 300, and Publish. An empty field keeps the default: photos show for seven seconds and videos play to their end. A video duration is a playback limit: a shorter clip still advances at its natural end, and pausing the video pauses progress toward the limit.

Research community cards on the Project page retain TOGETHER, MEDiate and CMINE and include TURNkey, C2IMPRESS, Gobeyond, Driver+, engage, Synergies, Paratus, ANYWHERE, Links, DIREKTION, RiskPACC and ARISTOTLE-ENHSP. The twelve additional project names, supplied links, short summaries and summary source URLs are defined in `scripts/research-projects.mjs`; `scripts/append-research-projects.mjs` appends missing cards to published and existing draft content without replacing editor changes. Edit cards and upload optional logos under **About RESILIACT → About Project, timeline and research community → Sister projects** in Studio. All fifteen cards have linked logos from their official websites. `scripts/update-research-project-cards.mjs` uploads the twelve additional official logos and updates their summaries while preserving unrelated card content. GOBEYOND and ANYWHERE use dark logo panels to make their white artwork readable. Asset sources and local fallbacks are recorded in `scripts/research-assets.json`; `scripts/initialize-research-logos.mjs` initializes missing logos without replacing existing editor content.

The Platform page heading defaults to white for contrast against its dark background. Change it in **Studio → Platform → Heading colour**, choose White, Light cyan or Pale blue, and Publish. An empty field uses white.

Logo provenance and official website URLs are recorded in `scripts/partner-assets.json`. Most logos come directly from the organisation's website; Attica's logo is supplied by the GOBEYOND partner page and links to the Region of Attica. Lisbon uses the graphic-identity logo mirrored on Wikimedia Commons, attributed to the city's identity page because direct downloads are blocked. EENA uses the coloured logo from its conference website, and Technovative uses the centred company logo from its public LinkedIn profile. The National Delegation for Major Risks uses the official Ministry of Interior emblem from its institutional page, with a visible clarification. `scripts/initialize-partner-logos.mjs` initializes missing Sanity logos/links while preserving editor changes. `scripts/update-selected-partner-logos.mjs` replaces only the three explicitly requested Lisbon, EENA and Technovative logos in published and existing draft documents.

For manual setup, copy `.env.example` and `studio/.env.example` to corresponding `.env.local` files. Restart servers after changes. Never put passwords or write tokens in browser-visible `VITE_*` or `SANITY_STUDIO_*` variables.

Studio CORS origins need credentials; frontend origins do not. Setup adds localhost and 127.0.0.1 on ports 5173/4173 for development/production preview and 3333 for Studio. Add exact origins manually if changing ports.

```powershell
npm.cmd run build
npm.cmd run build:studio
```

Outputs: `dist/` (including the six navigation page directories, Events calendar and legacy Contact redirect) and `studio/dist/`. Serve directory URLs with their `index.html` files. Studio can compile before account setup with an `unconfigured` placeholder; actual sign-in/editing require a real project. Successful compilation does not verify live publishing.

Dynamic event, article and archive paths must serve the frontend `index.html` when no static file exists, so newly published records work without rebuilding. Vite development and preview provide this fallback. The bundled `_redirects` config supports static hosts that read that format. For a NORSAR Nginx server, configure the site root to the deployed `dist` directory and use:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Directly open and reload an event, article and archive URL when validating production hosting. An unpublished or missing article/event shows Content not found. Dynamic title/description metadata currently updates in the browser; search indexing and social previews would benefit from server rendering before production.

For `resiliact.norsar.no`, deploy the frontend output to NORSAR static hosting or an approved static host, and arrange DNS/HTTPS with NORSAR IT. Host Studio separately with Sanity or on an approved editor URL. Set `VITE_SANITY_STUDIO_URL` and add production CORS origins. Agree on organisation ownership and export/backup responsibility before production.

## Source provenance

- Example: https://resiliact-project.norsar-8495.chatgpt.site/
- Downloaded commit: `ad7fa8282c6331b43de974b6d7a1f8149500a0b1`
- Unmodified download: `example-source/dist/`
- Previous local prototype: `prototype-backup/`

This setup is local only and does not alter the hosted example or publish the NORSAR domain.

Studio dependency audit reports upstream advisories in CLI/build tooling. Review them before production; no forced downgrade or breaking replacement has been applied.

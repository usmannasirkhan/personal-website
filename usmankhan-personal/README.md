# Usman Khan — personal website

A self-contained, responsive light website with a separate project journal. No framework, analytics, remote fonts or third-party runtime dependencies. A dependency-free Python build prepares a restricted GitHub Pages artifact.

## Preview

Serve this folder over local HTTP so the browser can enforce the site’s security policy consistently:

```sh
cd usmankhan-personal
python3 -m http.server 8000 --bind 127.0.0.1
```

Then visit http://localhost:8000.

## Pages

- `index.html`: introduction, outcomes, approach, experience, education, journal preview and contact.
- `journal.html`: the full project feed, with category filters.
- `project.html?post=your-project-slug`: an individual published story.
- `editorial-policy.html`: personal views, independence, accuracy, sources and correction requests.
- `projects.js`: the single place to manage journal entries.
- `styles.css`: shared design and responsive layouts.
- `home.css`: homepage composition, enterprise positioning and outcome case studies.
- `assets/UsmanKhan_CV.pdf`: downloadable copy of the supplied CV, with the contact email updated to `usman@usman-khan.com`.
- `assets/usman-khan.jpeg`: your original portrait, framed responsively in the homepage hero.
- `assets/blueoptima-*.jpg`: local copies of the official previews for the featured BlueOptima appearances.

Career information and results come from the supplied CV. The current role and experience length reflect that document; update these when your circumstances change. The journal contains two published Notes articles: code verification in AI-assisted development, with GitHub and NIST sources, and the changing SDLC and Sonar’s Agent Centric Development Cycle (AC/DC), with Sonar sources. Two upcoming project placeholders remain clearly labelled.

The homepage leads with enterprise value and three selected contributions through BlueOptima. Fortune 100 positioning is supported by the CV’s stated advisory experience with Fortune 50 leaders; it does not claim that every named customer belongs to that ranking. Credit Suisse’s 15% productivity improvement is described as a programme contribution, CodeLedger as a solution you contributed to, and £1M+ ARR deals as work in partnership with Account Executives. The productivity comparison uses an index of 100 to 115, derived from the stated 15% increase; it is not a measured time series.

## My approach

The homepage’s `#approach` section presents three stages: define the current state, agree the ideal future state and build a transformation roadmap. An objective maturity model supports the journey through agreed criteria, observable evidence and reassessment at milestones. The section describes the method without displaying invented client scores. Edit the copy in `index.html` and the responsive layout in `home.css`; the section works without JavaScript.

## Featured conversations

The homepage’s `#featured` section links to three BlueOptima appearances supplied by Usman:

- [Podcast: Why DORA Metrics Miss the Biggest Predictors of Failure](https://www.youtube.com/watch?v=lfap5hmEprM).
- [Webinar: Software Incidents Aren’t Random: Why Maintainability Matters More Than Ever](https://www.youtube.com/watch?v=ThfTSJqe5ao).
- [LinkedIn feature on maintainability and trust in AI-generated code](https://www.linkedin.com/feed/update/urn:li:activity:7395085870833496064/).

Video titles and publishers were verified using YouTube’s public oEmbed metadata. The LinkedIn description and preview were retrieved from the post’s public metadata. Card summaries describe the topics, not transcripts. The images are the original publisher previews, stored locally. Cards open the original content in a new tab; no social scripts or embedded players load on your site. Edit the cards in `index.html` to add or update an appearance.

## Publish a project story

Edit `projects.js`. Keep the array JSON-compatible: double-quoted keys and strings, no comments inside entries, no functions and no trailing commas. The build parses this data without executing it. Replace a placeholder or add an entry to `window.PROJECTS`:

```json
{
  "slug": "my-first-project",
  "title": "My first project",
  "category": "Building",
  "description": "A short introduction to the problem and what I built.",
  "status": "published",
  "visual": "blueprint",
  "date": "2026-09-15",
  "link": "https://example.com",
  "content": [
    { "type": "paragraph", "text": "The story begins here." },
    { "type": "heading", "text": "The challenge" },
    { "type": "paragraph", "text": "Explain the problem and the decisions you made." },
    { "type": "list", "items": ["First lesson", "Second lesson"] },
    { "type": "quote", "text": "One thought worth remembering." },
    { "type": "heading", "text": "What comes next" },
    { "type": "paragraph", "text": "Share the next step." }
  ]
}
```

- Give every entry a unique URL-friendly `slug`.
- Categories: `Building`, `Experiments`, `Notes`.
- Status: `published` enables the story link; `upcoming` displays a placeholder; `draft` hides the entry. The Pages build omits drafts, upcoming article bodies and unused fields from the deployed `projects.js`. A public GitHub repository still exposes committed source and history: keep confidential drafts and credentials out of it.
- Visual options: `blueprint`, `orbit`, `steps`.
- Dates use `YYYY-MM-DD`. Published stories appear first, newest first.
- `link` is optional. Remove it if there is no public project URL.
- Content is plain text and rendered safely; HTML and Markdown are not interpreted. Paragraph blocks can include `"source": { "label": "Source title", "url": "https://example.com" }` for an inline citation; only HTTPS links without embedded credentials are accepted.
- Keep commas between entries and content blocks. The homepage displays the first three entries automatically.
- Update the homepage’s latest-article introduction when you publish a new entry.

## Publish on GitHub Pages

The workflow at `../.github/workflows/personal-pages.yml` publishes only the files prepared by `../tools/build_pages.py`. It is manually triggered and runs from `main`; commits and pull requests do not automatically deploy. Build and deployment jobs have separate permissions, checkout does not retain credentials, and official actions are pinned to verified commit hashes.

Before publishing:

1. Commit the website, `tools/` and workflow to your repository’s `main` branch. Review the source and the CV for information you intend to make public.
2. In **Settings → Pages**, select **GitHub Actions** as the publishing source. Do not publish the repository root as a branch-based site.
3. In the `github-pages` environment, restrict deployments to `main`. Protect `main` with reviews and use two-factor authentication on your GitHub account.
4. Run **Actions → Publish personal website → Run workflow** from `main` when ready. This replaces the site served by this repository’s Pages deployment, so confirm you have selected the intended repository.
5. In **Settings → Pages**, confirm the custom-domain setting and enable **Enforce HTTPS**. If using a custom domain, verify ownership in your account or organisation’s Pages settings, use GitHub’s documented DNS records, and avoid wildcard DNS records. Remove obsolete DNS records if you stop using Pages.

The repository’s existing root `CNAME` names `codelyft.com`. It is not included in this personal-site artifact. GitHub Pages settings still determine the actual custom domain; check them before publishing. This workflow does not update DNS or domain settings.

Local verification, from the repository root:

```sh
python3 -m unittest discover -s tools -p 'test_*.py'
python3 tools/build_pages.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory _site
```

The build intentionally refuses to overwrite an existing output directory. For a later preview, use a new empty destination, for example `python3 tools/build_pages.py --output /tmp/personal-pages-preview`, and serve that directory. `_site/` is ignored by Git. Publish the generated artifact, not the source folder. To add a new page or asset, add it to `PUBLIC_FILES` in the build script; unexpected files, README files, repository metadata and the unrelated Amazon site are excluded.

## Security boundaries

Every HTML page declares a Content Security Policy allowing only local scripts and styles, local images and the existing data-URL texture. Inline scripts, inline event handlers, inline styles, embedded documents, plugins and form submissions are blocked. Referrer information is suppressed. The build checks these policies and rejects symlinks, unsupported journal code and insecure journal links.

These controls reduce risk; they do not make the site risk-free or protect a compromised GitHub account. GitHub Pages does not provide a repository setting for arbitrary response headers. The HTML policy cannot set header-only protections such as `frame-ancestors`, `X-Frame-Options` or `X-Content-Type-Options`. In particular, a meta policy does **not** prevent other sites from framing these pages. If those controls become necessary, use hosting or a proxy that can set the actual HTTP response headers; adding `_headers` or header-like meta tags to Pages will not supply them. HTTPS enforcement and domain verification must be completed in GitHub settings.

The CV, email address, images and published entries in the approved artifact are intentionally public and downloadable. Review the CV’s contact details before publishing. No deployment, account configuration or DNS change has been made by preparing these files. The live site still needs verification after deployment.

References: [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [HTTPS enforcement](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https), [custom-domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages), [CSP frame-ancestors limitations](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).

## Design and accessibility

The site uses a `#f4f6f8` background, white surfaces, dark slate text and VS Code blue controls. Smaller blue text uses a deeper shade for contrast. Shared colours live in `styles.css`; homepage details and the portrait gradients live in `home.css`.

Responsive desktop and mobile layouts, keyboard-accessible navigation and filters, native expandable experience rows, visible focus indicators, reduced-motion support and print styles. Project placeholders are deliberately not links. The contact action opens the visitor’s email client; no form backend is needed.

## Editorial notice

A visible notice appears on the homepage journal preview, journal index and article template. It links to `editorial-policy.html`, also accessible from every footer. The policy distinguishes personal commentary from employers’ and companies’ views, acknowledges possible errors and changing information, and provides a correction contact. It is not a guarantee against legal claims; obtain qualified legal advice before relying on it as legal protection. Keep factual claims supported and act on substantiated correction requests.

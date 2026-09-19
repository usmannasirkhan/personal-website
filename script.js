(() => {
  'use strict';
  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  function closeMenu() {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
    });
    document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
    window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
  }

  const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
  const entries = projects.filter(post => ['published', 'upcoming'].includes(post.status)).sort((a, b) => {
    if (a.status !== b.status) return a.status === 'published' ? -1 : 1;
    return (b.date || '').localeCompare(a.date || '');
  });
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function dateLabel(date) {
    const parsed = new Date(`${date}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function card(post, index) {
    const article = element('article', 'project-card');
    const visual = ['blueprint', 'orbit', 'steps'].includes(post.visual) ? post.visual : 'blueprint';
    const art = element('div', `project-art project-art-${visual}`);
    art.setAttribute('aria-hidden', 'true');
    art.append(element('span', 'art-index', `FIELDNOTES / ${String(index + 1).padStart(2, '0')}`));
    const shapes = element('div', 'project-shapes');
    for (let i = 0; i < 5; i++) shapes.append(element('i'));
    art.append(shapes, element('span', 'art-category', post.category.toUpperCase()), element('span', 'art-plus', '+'));
    const body = element('div', 'project-body');
    const meta = element('div', 'project-meta');
    meta.append(element('span', '', post.category));
    if (post.status === 'published') {
      const time = element('time', '', dateLabel(post.date)); time.dateTime = post.date || ''; meta.append(time);
    } else meta.append(element('span', 'coming-soon', 'Coming soon'));
    const title = element('h3', '', post.title);
    body.append(meta, title, element('p', '', post.description));
    if (post.status === 'published') {
      const link = element('a', 'text-link', 'Read the story ↗');
      link.href = `project.html?post=${encodeURIComponent(post.slug)}`;
      link.setAttribute('aria-label', `Read ${post.title}`);
      body.append(link);
    } else body.append(element('span', 'placeholder-label', 'A future journal entry'));
    article.append(art, body);
    return article;
  }
  const feeds = document.querySelectorAll('[data-project-feed]');
  function renderFeed(category = 'all') {
    const filtered = entries.filter(post => category === 'all' || post.category === category);
    feeds.forEach(feed => {
      feed.replaceChildren();
      const limit = Number(feed.dataset.limit) || filtered.length;
      filtered.slice(0, limit).forEach(post => feed.append(card(post, entries.indexOf(post))));
      if (!filtered.length) feed.append(element('p', 'empty-state', 'No entries here yet. Check back for the next update.'));
    });
    const count = document.querySelector('[data-feed-count]');
    if (count) {
      const published = filtered.filter(post => post.status === 'published').length;
      const upcoming = filtered.length - published;
      count.textContent = `${published} published${upcoming ? ` · ${upcoming} upcoming` : ''}`;
    }
  }
  renderFeed();
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(other => {
        const active = other === button;
        other.classList.toggle('active', active);
        other.setAttribute('aria-pressed', String(active));
      });
      renderFeed(button.dataset.filter);
    });
  });

  const article = document.querySelector('[data-article]');
  if (article) {
    const slug = new URLSearchParams(window.location.search).get('post');
    const post = entries.find(entry => entry.slug === slug && entry.status === 'published');
    if (post) {
      article.replaceChildren();
      document.title = `${post.title} — Usman Khan`;
      document.querySelector('meta[name="description"]').content = post.description;
      const meta = element('div', 'section-label', `${post.category} / ${dateLabel(post.date)}`);
      article.append(meta, element('h1', '', post.title), element('p', 'article-lede', post.description));
      const content = element('div', 'article-content');
      (post.content || []).forEach(block => {
        if (block.type === 'list' && Array.isArray(block.items)) {
          const list = element('ul'); block.items.forEach(item => list.append(element('li', '', item))); content.append(list);
        } else {
          const tag = block.type === 'heading' ? 'h2' : block.type === 'quote' ? 'blockquote' : 'p';
          const node = element(tag, '', block.text || '');
          if (block.source) {
            try {
              const url = new URL(block.source.url);
              if (url.protocol === 'https:' && !url.username && !url.password) {
                const source = element('a', 'article-source', block.source.label || 'Source');
                source.href = url.href;
                node.append(document.createTextNode(' '), source);
              }
            } catch { /* Keep the article readable if an optional source URL is invalid. */ }
          }
          content.append(node);
        }
      });
      article.append(content);
      if (post.link) {
        try {
          const url = new URL(post.link);
          if (url.protocol === 'https:' && !url.username && !url.password) {
            const link = element('a', 'button button-primary', 'Explore the project ↗');
            link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; article.append(link);
          }
        } catch { /* Ignore invalid optional project URLs. */ }
      }
    }
  }
})();

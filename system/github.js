/* ==============================================
   LQV/SYS — "Live from GitHub"
   Fetched in the visitor's browser from the public GitHub REST API
   (no token, CORS-enabled, 60 requests/hour/IP), so it stays current
   without any backend. Loads only when the section is about to scroll
   into view, caches for 30 minutes, and degrades to a profile link.
   Recent public pushes are also appended to the live career.events
   topic, so the Kafka log and the 3D tower show real activity.
   Loaded after system.js (uses $, $$, L, esc, emit, LANG, API).
   ============================================== */

'use strict';

const GH = {
  user: 'lqviet45',
  api: 'https://api.github.com',
  cacheKey: 'lqv-gh-v2',
  ttlMs: 30 * 60 * 1000,
  months: 12
};
let ghData = null;       // { user, repos, events, fetchedAt }
let ghError = null;
let ghLoading = null;
let ghEmitted = false;

/* GitHub linguist colours for the language dot (name is always shown as text) */
const GH_LANG_COLORS = {
  Java: '#b07219', 'C#': '#178600', JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c',
  Python: '#3572A5', Go: '#00ADD8', Kotlin: '#A97BFF', Shell: '#89e051', Dockerfile: '#384d54', SCSS: '#c6538c',
  'Jupyter Notebook': '#DA5B0B', PHP: '#4F5D95', Dart: '#00B4AB', Vue: '#41b883', Rust: '#dea584', 'C++': '#f34b7d', C: '#555555'
};

async function ghFetch(path) {
  const res = await fetch(GH.api + path, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) {
    const limited = res.status === 403 || res.status === 429;
    throw Object.assign(new Error(limited ? 'rate-limited' : `HTTP ${res.status}`), { limited });
  }
  return res.json();
}

function ghLoad() {
  if (ghLoading) return ghLoading;
  ghLoading = (async () => {
    try {
      const cached = JSON.parse(localStorage.getItem(GH.cacheKey) || 'null');
      if (cached && Date.now() - cached.fetchedAt < GH.ttlMs) { ghData = cached; return ghData; }
    } catch { /* storage unavailable */ }
    try {
      const [user, repos, events] = await Promise.all([
        ghFetch(`/users/${GH.user}`),
        ghFetch(`/users/${GH.user}/repos?per_page=100&sort=pushed`),
        ghFetch(`/users/${GH.user}/events/public?per_page=100`).catch(() => [])   // optional
      ]);
      ghData = {
        user: { public_repos: user.public_repos, followers: user.followers, html_url: user.html_url },
        // skip forks, archived repos and the profile-README repo (named after the user)
        repos: repos.filter(r => !r.fork && !r.archived && r.name.toLowerCase() !== GH.user.toLowerCase()).map(r => ({
          name: r.name, url: r.html_url, desc: r.description, lang: r.language, stars: r.stargazers_count, pushed: r.pushed_at
        })),
        events: (Array.isArray(events) ? events : []).filter(e => e.type === 'PushEvent').map(e => ({
          repo: e.repo?.name || '', at: e.created_at,
          commits: e.payload?.size ?? e.payload?.commits?.length ?? 1,
          msg: e.payload?.commits?.[e.payload.commits.length - 1]?.message?.split('\n')[0] || ''
        })),
        fetchedAt: Date.now()
      };
      try { localStorage.setItem(GH.cacheKey, JSON.stringify(ghData)); } catch { /* ignore */ }
      ghError = null;
    } catch (err) {
      ghError = err;
      ghLoading = null;          // allow a retry later
    }
    return ghData;
  })();
  return ghLoading;
}

/* ---------- derived views ---------- */
function ghRelative(iso) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(LANG === 'vi' ? 'vi' : 'en', { numeric: 'auto' });
  const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [u, s] of units) if (Math.abs(diff) >= s || u === 'minute') return rtf.format(Math.round(diff / s), u);
  return '';
}

function ghSummary(d) {
  const langs = {};
  d.repos.forEach(r => { if (r.lang) langs[r.lang] = (langs[r.lang] || 0) + 1; });
  const top = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  const lastPush = [d.events[0]?.at, d.repos[0]?.pushed].filter(Boolean).sort().pop();
  // repositories by month of their last push, last N calendar months (index 0 = oldest).
  // The public Events API only covers ~30 days, so the repo list is the honest long-range signal.
  const now = new Date();
  const months = Array.from({ length: GH.months }, (_, i) => {
    const m = new Date(now.getFullYear(), now.getMonth() - (GH.months - 1 - i), 1);
    return { y: m.getFullYear(), m: m.getMonth(), start: m.getTime(), count: 0 };
  });
  d.repos.forEach(r => {
    const t = new Date(r.pushed);
    const hit = months.find(x => x.y === t.getFullYear() && x.m === t.getMonth());
    if (hit) hit.count++;
  });
  return { repos: d.repos.length, top, lastPush, months, recent: d.repos.slice(0, 4), pushes: d.events.length };
}

/* ---------- rendering ---------- */
function ghHead() {
  $('#gh-head').innerHTML = `
    <p class="section-eyebrow">${L('Live from GitHub', 'Trực tiếp từ GitHub')}</p>
    <h2 class="section-title">${L('Still shipping.', 'Vẫn đang ship.')}</h2>
    <p class="section-sub">${L('Pulled from the public GitHub API in your browser when this section came into view — nothing here is hard-coded.',
                                'Lấy từ GitHub API công khai ngay trên trình duyệt của bạn khi section này hiện ra — không có gì được viết cứng.')}</p>`;
}

function ghChart(buckets) {
  const W = 520, H = 120, padL = 28, padB = 20, padT = 8;
  const max = Math.max(1, ...buckets.map(w => w.count));
  const nice = max <= 5 ? 5 : Math.ceil(max / 5) * 5;
  const band = (W - padL) / buckets.length;
  const bw = Math.min(24, band - 2);
  const y = v => padT + (H - padT - padB) * (1 - v / nice);
  const fmtMonth = t => new Date(t).toLocaleDateString(LANG === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', year: 'numeric' });
  const bar = (x, top, w, base) => {
    const h = base - top; if (h <= 0) return '';
    const r = Math.min(4, h, w / 2);
    return `M${x} ${base} V${top + r} Q${x} ${top} ${x + r} ${top} H${x + w - r} Q${x + w} ${top} ${x + w} ${top + r} V${base} Z`;
  };
  return `
    <svg viewBox="0 0 ${W} ${H}" class="gh-chart" role="group" aria-label="${esc(L(`Repositories by month of last push, last ${GH.months} months`, `Số repository theo tháng push gần nhất, ${GH.months} tháng qua`))}">
      ${[0, nice].map(v => `<line x1="${padL}" x2="${W}" y1="${y(v)}" y2="${y(v)}" class="lt-grid"/><text x="${padL - 6}" y="${y(v) + 3.5}" text-anchor="end" class="lt-tick">${v}</text>`).join('')}
      ${buckets.map((w, i) => {
        const x = padL + band * i + (band - bw) / 2;
        const label = fmtMonth(w.start);
        const unit = w.count === 1 ? L('repository', 'repository') : L('repositories', 'repository');
        return `<g class="lt-bar" role="img" tabindex="0" data-tip="${w.count} ${unit}|${esc(label)}" aria-label="${esc(`${label}: ${w.count} ${unit}`)}">
          <rect x="${padL + band * i}" y="${padT}" width="${band}" height="${H - padT - padB}" class="lt-hit"/>
          <path d="${bar(x, y(w.count), bw, y(0))}" class="lt-fill"/></g>`;
      }).join('')}
      <text x="${padL}" y="${H - 4}" class="lt-tick">${fmtMonth(buckets[0].start)}</text>
      <text x="${W}" y="${H - 4}" text-anchor="end" class="lt-tick">${L('this month', 'tháng này')}</text>
    </svg>`;
}

function ghRender() {
  const box = $('#gh-box');
  if (!box) return;
  if (!ghData && !ghError) {
    box.innerHTML = `<div class="gh-skeleton" aria-busy="true"><span></span><span></span><span></span></div>`;
    return;
  }
  if (!ghData) {
    box.innerHTML = `
      <div class="gh-fallback">
        <p><b>${ghError?.limited ? L('GitHub’s API rate limit was reached for your network.', 'Mạng của bạn đã chạm giới hạn gọi API của GitHub.') : L('GitHub didn’t respond just now.', 'GitHub chưa phản hồi lúc này.')}</b>
        ${L('It resets within the hour — or see everything on the profile directly.', 'Giới hạn sẽ reset trong vòng một giờ — hoặc xem trực tiếp trên trang cá nhân.')}</p>
        <div class="actions"><a class="btn" href="https://github.com/${GH.user}" target="_blank" rel="noopener">github.com/${GH.user} ↗</a>
        <button class="btn ghost" id="gh-retry">${L('Try again', 'Thử lại')}</button></div>
      </div>`;
    $('#gh-retry').addEventListener('click', () => { ghError = null; ghRender(); ghLoad().then(ghRender); });
    return;
  }
  const s = ghSummary(ghData);
  const hasActivity = s.months.some(m => m.count > 0);
  box.innerHTML = `
    <dl class="gh-tiles">
      <div><dt>${L('Public repositories', 'Repository công khai')}</dt><dd>${s.repos}</dd></div>
      <div><dt>${L('Last push', 'Lần push gần nhất')}</dt><dd>${s.lastPush ? esc(ghRelative(s.lastPush)) : '—'}</dd></div>
      <div><dt>${L('Most-used languages', 'Ngôn ngữ dùng nhiều nhất')}</dt><dd class="gh-langs">${s.top.length ? s.top.map(l => `<span><i style="background:${GH_LANG_COLORS[l] || 'var(--muted)'}"></i>${esc(l)}</span>`).join('') : '—'}</dd></div>
    </dl>
    <div class="gh-grid">
      <section class="gh-activity">
        <h3 class="inc-h">${L(`Repositories by month of last push · ${GH.months} months`, `Repository theo tháng push gần nhất · ${GH.months} tháng`)}</h3>
        ${hasActivity ? `<div class="lt-plot">${ghChart(s.months)}<div class="lt-tip" id="gh-tip" hidden></div></div>
          <details class="lt-table"><summary>${L('view as table', 'xem dạng bảng')}</summary><table class="sql">
            <tr><th>${L('month', 'tháng')}</th><th>${L('repositories', 'repository')}</th></tr>
            ${s.months.map(m => `<tr><td>${new Date(m.start).toLocaleDateString(LANG === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', year: 'numeric' })}</td><td>${m.count}</td></tr>`).join('')}
          </table></details>`
          : `<p class="gh-empty">${L('No public repository updated in the last 12 months — most of my day-to-day work lives in private repositories.', 'Không có repository công khai nào được cập nhật trong 12 tháng qua — phần lớn công việc hằng ngày nằm trong repo riêng tư.')}</p>`}
      </section>
      <section>
        <h3 class="inc-h">${L('Recently pushed', 'Push gần đây')}</h3>
        <ul class="gh-repos">
          ${s.recent.map(r => `
            <li><a href="${esc(r.url)}" target="_blank" rel="noopener">
              <span class="gh-repo-name">${esc(r.name)}</span>
              ${r.desc ? `<span class="gh-repo-desc">${esc(r.desc)}</span>` : ''}
              <span class="gh-repo-meta">
                ${r.lang ? `<span><i style="background:${GH_LANG_COLORS[r.lang] || 'var(--muted)'}"></i>${esc(r.lang)}</span>` : ''}
                ${r.stars ? `<span>★ ${r.stars}</span>` : ''}
                <span>${esc(ghRelative(r.pushed))}</span>
              </span>
            </a></li>`).join('')}
        </ul>
      </section>
    </div>
    <p class="gh-foot">${L('Source', 'Nguồn')}: api.github.com · ${L('fetched', 'lấy lúc')} ${new Date(ghData.fetchedAt).toLocaleTimeString(LANG === 'vi' ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' })} · ${L('cached for 30 min', 'lưu tạm 30 phút')} · <a href="https://github.com/${GH.user}" target="_blank" rel="noopener">github.com/${GH.user} ↗</a></p>`;
  ghWireTips();
}

function ghWireTips() {
  const tip = $('#gh-tip');
  if (!tip) return;
  const plot = tip.parentElement;
  const show = (g, cx, cy) => {
    const [v, label] = g.dataset.tip.split('|');
    tip.replaceChildren();
    const b = document.createElement('b'); b.textContent = v;
    const s = document.createElement('span'); s.textContent = label;
    tip.append(b, s);
    tip.hidden = false;
    const pr = plot.getBoundingClientRect(), gr = g.getBoundingClientRect();
    const x = cx != null ? cx - pr.left : gr.left - pr.left + gr.width / 2;
    const y = cy != null ? cy - pr.top : 20;
    tip.style.left = `${Math.min(pr.width - 120, Math.max(0, x + 10))}px`;
    tip.style.top = `${Math.max(0, y - 48)}px`;
    g.classList.add('hover');
  };
  const hide = g => { tip.hidden = true; g.classList.remove('hover'); };
  $$('.gh-chart .lt-bar').forEach(g => {
    g.addEventListener('pointermove', e => show(g, e.clientX, e.clientY));
    g.addEventListener('pointerleave', () => hide(g));
    g.addEventListener('focus', () => show(g));
    g.addEventListener('blur', () => hide(g));
  });
}

/* real pushes → the live topic (once per page view) */
function ghEmit() {
  if (ghEmitted || !ghData) return;
  ghEmitted = true;
  ghData.events.slice(0, 5).reverse().forEach((e, i) => setTimeout(() => {
    const msg = e.msg.length > 48 ? `${e.msg.slice(0, 47)}…` : e.msg;
    emit('github.push', `{repo:"${e.repo}", commits:${e.commits}${msg ? `, head:"${msg.replace(/"/g, '\'')}"` : ''}}`, 'user');
  }, i * 700));
}

async function ghStart() {
  ghRender();
  await ghLoad();
  ghRender();
  ghEmit();
}

/* ---------- console route ---------- */
API['GET /github'] = () => {
  if (!ghData) {
    ghStart();
    return [202, { status: ghError ? 'unavailable' : 'loading', note: L('fetching from api.github.com — run it again in a moment', 'đang lấy từ api.github.com — chạy lại sau giây lát'), profile: `https://github.com/${GH.user}` }, 'gw'];
  }
  const s = ghSummary(ghData);
  return [200, { user: GH.user, public_repos: s.repos, last_push: s.lastPush, top_languages: s.top,
    recent: s.recent.map(r => ({ name: r.name, language: r.lang, pushed: r.pushed })), cached_at: new Date(ghData.fetchedAt).toISOString() }, 'gw'];
};

/* ---------- boot: load when the section is ~one screen away ---------- */
(() => {
  ghHead();
  ghRender();
  const section = $('#gh-box');
  if (!section) return;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { io.disconnect(); ghStart(); }
    }, { rootMargin: '600px 0px' });
    io.observe(section);
  } else ghStart();
  addEventListener('lqv:lang', () => { ghHead(); ghRender(); });
})();

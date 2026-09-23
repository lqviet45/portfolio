/* ==============================================
   Portfolio OS — app.js
   Vanilla JS, no framework
   ============================================== */

'use strict';

/* ------ Global state ------ */
let globalZ = 200;
const openWindows = {}; // id -> { el, config }
const maximizedWindows = {}; // id -> { top, left, width, height }
let currentTheme = localStorage.getItem('theme') || 'dark';
let currentLang = localStorage.getItem('lang') || 'en';
let musicPlaying = false;

/* ==============================================
   App Configs
   ============================================== */
const APP_CONFIGS = {
  about: {
    title: 'About_Me.txt',
    icon: 'fas fa-user-circle',
    iconColor: '#6366f1',
    width: 500,
    height: 460,
    content: buildAboutContent
  },
  experience: {
    title: 'Experience/',
    icon: 'fas fa-folder',
    iconColor: '#f59e0b',
    width: 580,
    height: 520,
    content: buildExperienceContent
  },
  projects: {
    title: 'Projects/',
    icon: 'fas fa-folder-open',
    iconColor: '#f59e0b',
    width: 560,
    height: 480,
    content: buildProjectsContent
  },
  skills: {
    title: 'skills.json',
    icon: 'fas fa-code',
    iconColor: '#a855f7',
    width: 500,
    height: 460,
    content: buildSkillsContent
  },
  terminal: {
    title: 'Terminal',
    icon: 'fas fa-terminal',
    iconColor: '#22c55e',
    width: 580,
    height: 420,
    content: buildTerminalContent
  },
  certificates: {
    title: 'Certificates/',
    icon: 'fas fa-certificate',
    iconColor: '#f59e0b',
    width: 480,
    height: 400,
    content: buildCertificatesContent
  },
  contact: {
    title: 'Contact.lnk',
    icon: 'fas fa-address-card',
    iconColor: '#a855f7',
    width: 420,
    height: 380,
    content: buildContactContent
  },
  recycle: {
    title: 'Recycle Bin',
    icon: 'fas fa-trash-alt',
    iconColor: '#6b7280',
    width: 440,
    height: 360,
    content: buildRecycleContent
  },
  browser: {
    title: 'Browser',
    icon: 'fas fa-globe',
    iconColor: '#3b82f6',
    width: 780,
    height: 540,
    content: buildBrowserContent
  }
};

/* Browser state (reset on each open) */
let _bHistory = [];
let _bIdx = -1;

/* ==============================================
   Content Builders
   ============================================== */
function buildAboutContent() {
  return `
    <div class="about-header">
      <img src="face-img.png" alt="Le Quoc Viet" class="about-avatar">
      <div class="about-identity">
        <h2>Le Quoc Viet</h2>
        <div class="about-role">Backend Developer @ Sacombank · Java / Spring Boot · .NET / C#</div>
      </div>
    </div>
    <div class="about-stats">
      <div class="stat-box"><span class="stat-val">~2</span><div class="stat-lbl">Years Experience</div></div>
      <div class="stat-box"><span class="stat-val">6</span><div class="stat-lbl">Partner Banks Integrated</div></div>
      <div class="stat-box"><span class="stat-val">7.92</span><div class="stat-lbl">GPA · FPT University</div></div>
    </div>
    <p class="about-desc">
      Backend Developer with ~2 years of hands-on experience across Java/Spring Boot and .NET/C#.
      Currently building core-banking microservices at Sacombank on two platforms —
      <strong>CoreCD/CoreSL</strong> (certificate-of-deposit trading) and the
      <strong>MCS Bill System</strong> (virtual-account partner integration) — working with Saga
      orchestration, the Outbox pattern, idempotent APIs, Oracle, Redis, Kafka and IBM MQ.
    </p>
    <p class="about-desc">
      Outside work I design and ship distributed systems end-to-end, including
      <strong>Notification Hub</strong> — a multi-tenant notification platform built solo from
      architecture to infra. Comfortable with clean architecture, RESTful API design, CI/CD and
      containerized deployment. Graduated in Software Engineering from FPT University (GPA 7.92/10).
    </p>
  `;
}

function buildExperienceContent() {
  return `
    <div class="explorer-breadcrumb">
      <i class="fas fa-home"></i> Home
      <i class="fas fa-chevron-right"></i> Work_Experience
    </div>
    <div class="file-list">
      <div class="file-item" id="exp-coresl">
        <div class="file-item-header" onclick="toggleFileDetail('exp-coresl')">
          <i class="fas fa-file-alt file-icon"></i>
          <span class="file-name">Sacombank_CoreCD_CoreSL.log</span>
          <span class="file-date">01/2026 – Now</span>
          <i class="fas fa-chevron-right file-chevron"></i>
        </div>
        <div class="file-detail">
          <p><strong style="color:var(--text)">Backend Developer @ Sacombank — CoreCD/CoreSL</strong><br>
          <small>Certificate-of-Deposit Trading Platform</small></p>
          <p>Delivered production microservices covering the full CD lifecycle — registration,
          issuance, primary/secondary trading and settlement — integrated with T24 Core Banking
          and PaymentHub.</p>
          <p><b>Registration &amp; lifecycle:</b> corporate/retail buy-register with account and CIF
          validation, contract generation, and cancellation (auto sell-off of remaining holdings for retail).</p>
          <p><b>Purchase flow:</b> dual-channel order intake (MQ + REST), buyer account verification,
          PaymentHub settlement and automatic rollback on failure — Saga orchestration with
          Redis-based idempotency for exactly-once processing.</p>
          <p><b>Early-redemption &amp; sell flow:</b> multi-criteria pre-maturity sale simulation
          (full / partial / by-amount), interest &amp; fee calculation, auto-sell below threshold and
          settlement at maturity.</p>
          <p><b>Platform:</b> Outbox-pattern event publishing in lot-management, CD-lot
          reconciliation/ODS sync with Apache Airflow DAGs, Redis-cached purchase/sale reporting.</p>
          <div class="exp-tags">
            <span class="exp-tag">Java</span>
            <span class="exp-tag">Spring Boot</span>
            <span class="exp-tag">Saga</span>
            <span class="exp-tag">Outbox</span>
            <span class="exp-tag">Oracle</span>
            <span class="exp-tag">Redis</span>
            <span class="exp-tag">IBM MQ</span>
            <span class="exp-tag">Airflow</span>
            <span class="exp-tag">T24</span>
          </div>
        </div>
      </div>
      <div class="file-item" id="exp-mcs">
        <div class="file-item-header" onclick="toggleFileDetail('exp-mcs')">
          <i class="fas fa-file-alt file-icon"></i>
          <span class="file-name">Sacombank_MCS_Bill.log</span>
          <span class="file-date">01/2026 – Now</span>
          <i class="fas fa-chevron-right file-chevron"></i>
        </div>
        <div class="file-detail">
          <p><strong style="color:var(--text)">Backend Developer @ Sacombank — MCS Bill System</strong><br>
          <small>Virtual-Account Partner Integration Platform</small></p>
          <p>Built the virtual-account (VA) integration platform — inquiry, deposit-notify and
          outgoing-core flows unified behind a <b>gRPC facade</b>, with an <b>IBM MQ request/reply</b>
          layer dispatching to partner adapters and fallback routing to the legacy system for
          accounts outside the new platform.</p>
          <p>Integrated <b>6 partner banks / payment gateways</b> (SHB, LienVietPostBank, PVI,
          NganLuong, Vimo, GSM) through a common adapter layer, including OAuth2 token exchange and
          RSA-SHA256 request signing for SHB.</p>
          <div class="exp-tags">
            <span class="exp-tag">gRPC</span>
            <span class="exp-tag">IBM MQ / JMS</span>
            <span class="exp-tag">Adapter Pattern</span>
            <span class="exp-tag">OAuth2</span>
            <span class="exp-tag">RSA-SHA256</span>
          </div>
        </div>
      </div>
      <div class="file-item" id="exp-amazing">
        <div class="file-item-header" onclick="toggleFileDetail('exp-amazing')">
          <i class="fas fa-file-alt file-icon"></i>
          <span class="file-name">AmazingTech.log</span>
          <span class="file-date">12/2023 – 05/2024</span>
          <i class="fas fa-chevron-right file-chevron"></i>
        </div>
        <div class="file-detail">
          <p><strong style="color:var(--text)">Back-end Developer @ Amazing Tech</strong></p>
          <p>Shipped API modules powering a <b>tax-invoicing system</b> and a
          <b>water-factory management system</b>, integrating external systems and cutting query
          latency with SQL Stored Procedures.</p>
          <p>Built complex reporting modules with Excel export, partnering with the frontend team to
          define API contracts.</p>
          <div class="exp-tags">
            <span class="exp-tag">ASP.NET Core</span>
            <span class="exp-tag">C#</span>
            <span class="exp-tag">SQL Server</span>
            <span class="exp-tag">Dapper</span>
            <span class="exp-tag">Stored Procedures</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildProjectsContent() {
  return `
    <div class="project-grid">
      <div class="project-card">
        <h3>Notification Hub</h3>
        <p><small>Multi-tenant Notification Platform · Personal · 2025 – Present</small></p>
        <p>A multi-tenant .NET 8 platform designed and shipped solo — Kong gateway, auth, ingestion
        (REST + gRPC + legacy AMQP), routing, templating, tracking, per-channel workers
        (email/SMS/push) and a Blazor admin console.</p>
        <p>OAuth2 client-credentials with RS256/JWKS and zero-downtime key rotation; outbox-relay →
        Kafka → channel workers with HMAC-signed callbacks, OpenTelemetry tracing across HTTP and
        Kafka, and Polly resilience with Redis fail-open caching.</p>
        <div class="tech-chips">
          <span class="tech-chip">.NET 8</span>
          <span class="tech-chip">Kafka</span>
          <span class="tech-chip">Kong</span>
          <span class="tech-chip">gRPC</span>
          <span class="tech-chip">OpenTelemetry</span>
          <span class="tech-chip">Polly</span>
          <span class="tech-chip">Blazor</span>
        </div>
      </div>
      <div class="project-card">
        <h3>FEDOM-AI</h3>
        <p><small>Internal Exam &amp; Proctor Management · Capstone · 2025</small></p>
        <p>Directed the backend architecture with CQRS + MediatR Clean Architecture, integrated a
        RAG-based Spring AI chatbot and SignalR real-time support, and moved Excel imports off the
        request thread with an async RabbitMQ + Quartz pipeline.</p>
        <div class="tech-chips">
          <span class="tech-chip">ASP.NET Core</span>
          <span class="tech-chip">CQRS</span>
          <span class="tech-chip">Spring AI</span>
          <span class="tech-chip">SignalR</span>
          <span class="tech-chip">RabbitMQ</span>
          <span class="tech-chip">Quartz</span>
        </div>
      </div>
      <div class="project-card">
        <h3>Gym Management System</h3>
        <p>Full-stack gym management system handling members, subscriptions, and operations with
        integrated payment processing and admin interface.</p>
        <div class="tech-chips">
          <span class="tech-chip">ASP.NET Core</span>
          <span class="tech-chip">NextJS</span>
          <span class="tech-chip">PostgreSQL</span>
          <span class="tech-chip">PayOS</span>
        </div>
      </div>
    </div>
  `;
}

function buildSkillsContent() {
  const block = (label, cls, items) => `
    <div class="skill-category-block">
      <div class="skill-cat-label"><span>"${label}"</span>: [</div>
      <div class="skill-chips">
        ${items.map(s => `<span class="skill-chip ${cls}">${s}</span>`).join('')}
      </div>
    </div>`;
  return `
    <div class="skills-file-header">
      <span style="color:#6366f1">// skills.json</span><br>
      <span style="color:#f59e0b">{</span>
    </div>
    ${block('Languages', 'backend', ['Java', 'C#', 'JavaScript', 'SQL', 'HTML/CSS'])}
    ${block('Frameworks', 'backend', ['Spring Boot', 'Spring Cloud OpenFeign', 'ASP.NET Core', 'Dapper', 'ReactJS', 'Next.js'])}
    ${block('Databases', 'database', ['Oracle', 'PostgreSQL', 'SQL Server', 'Redis', 'MongoDB'])}
    ${block('Messaging & APIs', 'frontend', ['REST API', 'gRPC', 'IBM MQ / JMS', 'Apache Kafka', 'RabbitMQ'])}
    ${block('Tools & DevOps', 'devops', ['Docker', 'Kubernetes', 'Helm', 'GitLab CI/CD', 'Apache Airflow', 'Kong', 'Git', 'Postman', 'Swagger'])}
    ${block('Patterns', 'backend', ['Saga', 'Outbox', 'Idempotency', 'CQRS', 'Clean Architecture', 'Circuit Breaker'])}
    <div class="skills-file-header" style="margin-top:8px"><span style="color:#f59e0b">}</span></div>
  `;
}

function buildTerminalContent() {
  return `
    <div class="terminal-window" id="terminal-win">
      <div class="terminal-output" id="terminal-output"></div>
      <div class="terminal-input-row">
        <span class="terminal-prompt">lqviet@portfolio:~$</span>
        <input class="terminal-input" id="terminal-input" type="text"
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
               placeholder="type a command...">
      </div>
    </div>
  `;
}

function buildCertificatesContent() {
  return `
    <div class="cert-list">
      <a class="cert-item" href="https://coursera.org/share/d6d4b9c8125ac11f4132a6012dbcef5f" target="_blank" rel="noopener">
        <div class="cert-icon-wrap"><i class="fas fa-certificate"></i></div>
        <div class="cert-info">
          <h4>Software Development Lifecycle</h4>
          <div class="cert-issuer">University of Minnesota &middot; Coursera</div>
          <div class="cert-link-row">
            <i class="fas fa-external-link-alt"></i> View Certificate
          </div>
        </div>
      </a>
      <a class="cert-item" href="https://coursera.org/share/e13540f572707149f36db01d7e93e34c" target="_blank" rel="noopener">
        <div class="cert-icon-wrap"><i class="fas fa-code"></i></div>
        <div class="cert-info">
          <h4>Backend Development</h4>
          <div class="cert-issuer">Microsoft &middot; Coursera</div>
          <div class="cert-link-row">
            <i class="fas fa-external-link-alt"></i> View Certificate
          </div>
        </div>
      </a>
      <a class="cert-item" href="https://www.freecodecamp.org/certification/viet455/foundational-c-sharp-with-microsoft" target="_blank" rel="noopener">
        <div class="cert-icon-wrap"><i class="fab fa-microsoft"></i></div>
        <div class="cert-info">
          <h4>Foundational C# with Microsoft</h4>
          <div class="cert-issuer">Microsoft &middot; freeCodeCamp</div>
          <div class="cert-link-row">
            <i class="fas fa-external-link-alt"></i> View Certificate
          </div>
        </div>
      </a>
    </div>
  `;
}

function buildContactContent() {
  return `
    <div class="contact-list">
      <a class="contact-row" href="mailto:lqviet455@gmail.com">
        <div class="contact-icon-wrap"><i class="fas fa-envelope"></i></div>
        <div>
          <div class="contact-label">Email</div>
          <div class="contact-value">lqviet455@gmail.com</div>
        </div>
      </a>
      <a class="contact-row" href="tel:+84353081770">
        <div class="contact-icon-wrap"><i class="fas fa-phone"></i></div>
        <div>
          <div class="contact-label">Phone</div>
          <div class="contact-value">+84 353 081 770</div>
        </div>
      </a>
      <a class="contact-row" href="https://github.com/lqviet45" target="_blank" rel="noopener">
        <div class="contact-icon-wrap"><i class="fab fa-github"></i></div>
        <div>
          <div class="contact-label">GitHub</div>
          <div class="contact-value">github.com/lqviet45</div>
        </div>
      </a>
      <a class="contact-row" href="https://linkedin.com/in/le-quoc-viet-a03721240" target="_blank" rel="noopener">
        <div class="contact-icon-wrap"><i class="fab fa-linkedin"></i></div>
        <div>
          <div class="contact-label">LinkedIn</div>
          <div class="contact-value">linkedin.com/in/le-quoc-viet-a03721240</div>
        </div>
      </a>
      <a class="contact-row" href="https://facebook.com/le.quoc.viet.692602" target="_blank" rel="noopener">
        <div class="contact-icon-wrap"><i class="fab fa-facebook"></i></div>
        <div>
          <div class="contact-label">Facebook</div>
          <div class="contact-value">facebook.com/le.quoc.viet.692602</div>
        </div>
      </a>
    </div>
  `;
}

function buildRecycleContent() {
  return `
    <div class="recycle-header">
      <i class="fas fa-trash-alt"></i>
      <p>These ideas didn't survive the code review</p>
    </div>
    <div class="recycle-list">
      <div class="recycle-file"><i class="fas fa-file-code"></i><span>spaghetti_code_v1.java</span></div>
      <div class="recycle-file"><i class="fas fa-file-code"></i><span>fix_for_real_this_time.java</span></div>
      <div class="recycle-file"><i class="fas fa-file-alt"></i><span>TODO_fix_later.txt</span></div>
      <div class="recycle-file"><i class="fas fa-file"></i><span>sleep_8h_per_day.exe</span></div>
      <div class="recycle-file"><i class="fas fa-file-code"></i><span>works_on_my_machine.config</span></div>
    </div>
  `;
}

function buildBrowserContent() {
  return `
    <div class="browser-wrap">
      <div class="browser-toolbar">
        <button class="br-nav-btn" id="br-back" onclick="browserBack()" disabled title="Back"><i class="fas fa-arrow-left"></i></button>
        <button class="br-nav-btn" id="br-fwd"  onclick="browserForward()" disabled title="Forward"><i class="fas fa-arrow-right"></i></button>
        <button class="br-nav-btn" onclick="browserRefresh()" title="Refresh"><i class="fas fa-redo-alt" id="br-refresh-icon"></i></button>
        <button class="br-nav-btn" onclick="browserHome()" title="Home"><i class="fas fa-home"></i></button>
        <div class="br-addressbar">
          <i class="fas fa-lock br-lock"></i>
          <input type="text" id="br-url-input" class="br-url-input"
            onkeydown="if(event.key==='Enter') navigateBrowser(this.value)"
            onclick="this.select()">
          <button class="br-go-btn" onclick="navigateBrowser(document.getElementById('br-url-input').value)">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div class="browser-tabs-bar">
        <div class="br-tab active">
          <i class="fas fa-globe br-tab-fav"></i>
          <span id="br-tab-title">New Tab</span>
          <span class="br-tab-x">×</span>
        </div>
        <button class="br-new-tab" onclick="navigateBrowser('lqviet.dev')"><i class="fas fa-plus"></i></button>
      </div>
      <div class="browser-page" id="br-page"></div>
    </div>
  `;
}

/* ---- Browser Engine ---- */
function initBrowser() {
  _bHistory = [];
  _bIdx = -1;
  navigateBrowser('lqviet.dev');
}

function navigateBrowser(rawUrl) {
  if (!rawUrl) return;
  const url = rawUrl.trim().toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '');
  _bHistory = _bHistory.slice(0, _bIdx + 1);
  _bHistory.push(url);
  _bIdx = _bHistory.length - 1;
  _renderBrowser(url);
}

function _renderBrowser(url) {
  const urlInput  = document.getElementById('br-url-input');
  const page      = document.getElementById('br-page');
  const tabTitle  = document.getElementById('br-tab-title');
  const back      = document.getElementById('br-back');
  const fwd       = document.getElementById('br-fwd');
  if (!page) return;
  if (urlInput)  urlInput.value  = url;
  if (back)      back.disabled   = _bIdx <= 0;
  if (fwd)       fwd.disabled    = _bIdx >= _bHistory.length - 1;
  const { title, html } = _getBrowserPage(url);
  if (tabTitle) tabTitle.textContent = title;
  page.innerHTML = html;
  page.scrollTop = 0;
}

function browserBack()    { if (_bIdx > 0) { _bIdx--; _renderBrowser(_bHistory[_bIdx]); } }
function browserForward() { if (_bIdx < _bHistory.length - 1) { _bIdx++; _renderBrowser(_bHistory[_bIdx]); } }
function browserHome()    { navigateBrowser('lqviet.dev'); }
function browserRefresh() {
  const icon = document.getElementById('br-refresh-icon');
  if (icon) icon.className = 'fas fa-spinner fa-spin';
  setTimeout(() => {
    if (icon) icon.className = 'fas fa-redo-alt';
    _renderBrowser(_bHistory[_bIdx] || 'lqviet.dev');
  }, 600);
}

function browserGoSearch(query) {
  if (!query) return;
  navigateBrowser('google.com/search?q=' + encodeURIComponent(query));
}

/* ---- Page Router ---- */
function _getBrowserPage(url) {
  if (url === 'lqviet.dev' || url === '' || url === 'home')
    return { title: 'Le Quoc Viet — Portfolio', html: _bpHome() };
  if (url.startsWith('github.com/lqviet45'))
    return { title: 'lqviet45 — GitHub', html: _bpGitHub() };
  if (url.startsWith('github.com'))
    return { title: 'GitHub', html: _bpGitHubGeneral() };
  if (url === 'google.com' || url === 'google.com/')
    return { title: 'Google', html: _bpGoogle() };
  if (url.startsWith('google.com/search')) {
    const raw = url.split('q=')[1] || '';
    const q   = decodeURIComponent(raw.replace(/\+/g, ' '));
    return { title: `${q} — Google Search`, html: _bpGoogleResults(q) };
  }
  if (url.startsWith('stackoverflow.com'))
    return { title: 'Stack Overflow', html: _bpStackOverflow() };
  if (url.startsWith('youtube.com'))
    return { title: 'YouTube', html: _bpYouTube() };
  if (url.startsWith('chat.openai.com') || url.startsWith('chatgpt.com'))
    return { title: '503 — ChatGPT', html: _bp503() };
  if (url.startsWith('sacombank.com'))
    return { title: 'Sacombank — Restricted', html: _bpRestricted() };
  if (url === 'localhost:8080' || url === 'localhost:8080/')
    return { title: 'localhost:8080 — Spring Boot', html: _bpLocalhost() };
  if (url.startsWith('localhost:8080/api/health'))
    return { title: 'GET /api/health — 200 OK', html: _bpApiHealth() };
  if (url.startsWith('localhost:8080/api'))
    return { title: `localhost:8080 — ${url.split('/api')[1]}`, html: _bpApiGeneric(url) };
  if (url.startsWith('linkedin.com/in/le-'))
    return { title: 'Le Quoc Viet — LinkedIn', html: _bpLinkedIn() };
  if (url.startsWith('facebook.com/le.quoc.viet'))
    return { title: 'Le Quoc Viet — Facebook', html: _bpFacebook() };
  return { title: `404 — ${url}`, html: _bp404(url) };
}

/* ---- Pages ---- */
function _bpHome() {
  return `<div class="bp bp-home">
    <div class="bp-home-hero">
      <img src="face-img.png" class="bp-home-avatar">
      <h1>Hi, I'm Le Quoc Viet 👋</h1>
      <p class="bp-home-role">Backend Developer @ Sacombank</p>
    </div>
    <div class="bp-quicklinks">
      <button class="bp-ql" onclick="navigateBrowser('github.com/lqviet45')"><i class="fab fa-github"></i> GitHub</button>
      <button class="bp-ql" onclick="navigateBrowser('linkedin.com/in/le-quoc-viet-a03721240')"><i class="fab fa-linkedin"></i> LinkedIn</button>
      <button class="bp-ql" onclick="openApp('contact')"><i class="fas fa-envelope"></i> Contact</button>
      <button class="bp-ql" onclick="openApp('terminal')"><i class="fas fa-terminal"></i> Terminal</button>
    </div>
    <div class="bp-work-card">
      <div class="bp-work-label">⚡ Currently building</div>
      <div class="bp-work-title">CoreCD/CoreSL &amp; MCS Bill — Core Banking</div>
      <div class="bp-work-company">@ Sacombank · CD trading + virtual-account partner integration</div>
      <div class="bp-work-tags">
        <span class="bp-tag">Java</span><span class="bp-tag">Spring Boot</span>
        <span class="bp-tag">Saga</span><span class="bp-tag">Outbox</span>
        <span class="bp-tag">Oracle</span><span class="bp-tag">Redis</span>
        <span class="bp-tag">IBM MQ</span><span class="bp-tag">gRPC</span>
      </div>
    </div>
    <div class="bp-visitor">👁 Visitor #2,047 — Welcome!</div>
  </div>`;
}

function _bpGitHub() {
  const levels = ['#161b22','#0e4429','#006d32','#26a641','#39d353'];
  const cells = Array.from({length: 52*7}, () => {
    const r = Math.random();
    return `<span class="gh-day" style="background:${levels[r<0.45?0:r<0.65?1:r<0.8?2:r<0.93?3:4]}"></span>`;
  }).join('');
  return `<div class="bp bp-github">
    <div class="gh-header"><i class="fab fa-github"></i> GitHub</div>
    <div class="gh-layout">
      <div class="gh-sidebar">
        <img src="face-img.png" class="gh-avatar">
        <div class="gh-name">Le Quoc Viet</div>
        <div class="gh-login">@lqviet45</div>
        <div class="gh-bio">Backend Developer · Java / Spring Boot · .NET / C# · Building distributed systems</div>
        <div class="gh-meta"><i class="fas fa-building"></i> Sacombank</div>
        <div class="gh-meta"><i class="fas fa-graduation-cap"></i> FPT University</div>
        <div class="gh-stats">
          <span><strong>12</strong> repos</span>
          <span><strong>48</strong> followers</span>
          <span><strong>23</strong> following</span>
        </div>
      </div>
      <div class="gh-main">
        <div class="gh-section-title">📌 Pinned</div>
        <div class="gh-pinned">
          <div class="gh-repo-card">
            <div class="gh-repo-name"><i class="fas fa-book"></i> Notification-Hub</div>
            <div class="gh-repo-desc">Multi-tenant .NET 8 notification platform — Kong, Kafka, gRPC, OpenTelemetry, Polly</div>
            <div class="gh-repo-footer"><span style="color:#178600">● C#</span> ⭐ 4 · 🍴 2</div>
          </div>
          <div class="gh-repo-card">
            <div class="gh-repo-name"><i class="fas fa-book"></i> FEDOM-AI</div>
            <div class="gh-repo-desc">Exam &amp; proctor management — CQRS, RAG chatbot, SignalR, RabbitMQ + Quartz</div>
            <div class="gh-repo-footer"><span style="color:#178600">● C#</span> ⭐ 3 · 🍴 1</div>
          </div>
        </div>
        <div class="gh-section-title">📊 Contribution Activity</div>
        <div class="gh-graph">${cells}</div>
        <div class="gh-graph-legend">
          <span>Less</span>
          ${levels.map(c=>`<span class="gh-day" style="background:${c}"></span>`).join('')}
          <span>More</span>
        </div>
      </div>
    </div>
  </div>`;
}

function _bpGitHubGeneral() {
  return `<div class="bp bp-github">
    <div class="gh-header"><i class="fab fa-github"></i> GitHub</div>
    <div style="text-align:center;padding:60px 20px">
      <div style="font-size:3rem;margin-bottom:16px">🐙</div>
      <p style="color:var(--bp-muted)">Looking for a developer?</p>
      <button class="bp-ql" onclick="navigateBrowser('github.com/lqviet45')" style="margin-top:16px">
        View @lqviet45's profile
      </button>
    </div>
  </div>`;
}

function _bpGoogle() {
  return `<div class="bp bp-google">
    <div class="bp-google-logo">
      <span style="color:#4285f4">G</span><span style="color:#ea4335">o</span><span style="color:#fbbc04">o</span><span style="color:#4285f4">g</span><span style="color:#34a853">l</span><span style="color:#ea4335">e</span>
    </div>
    <div class="bp-google-input-wrap">
      <input type="text" id="google-input" placeholder="Search Google or type a URL"
        onkeydown="if(event.key==='Enter') browserGoSearch(this.value)">
    </div>
    <div class="bp-google-btns">
      <button onclick="browserGoSearch(document.getElementById('google-input').value)">Google Search</button>
      <button onclick="browserGoSearch('Le Quoc Viet backend developer')">I'm Feeling Lucky</button>
    </div>
  </div>`;
}

function _bpGoogleResults(query) {
  const q = query.toLowerCase();
  let items = '';
  if (q.includes('le quoc viet') || q.includes('lqviet') || q.includes('sacombank')) {
    items = `
      <div class="sr-item" onclick="navigateBrowser('lqviet.dev')">
        <div class="sr-url">🌐 lqviet.dev</div>
        <div class="sr-title">Le Quoc Viet — Portfolio OS</div>
        <div class="sr-desc">Backend Developer at Sacombank. Building CoreCD/CoreSL (certificate-of-deposit trading) and MCS Bill (virtual-account partner integration). Java · Spring Boot · Saga · Outbox · Kafka · IBM MQ.</div>
      </div>
      <div class="sr-item" onclick="navigateBrowser('github.com/lqviet45')">
        <div class="sr-url">🐙 github.com/lqviet45</div>
        <div class="sr-title">Lqviet45 (Le Quoc Viet) — GitHub</div>
        <div class="sr-desc">Backend developer. Java • Spring Boot • .NET 8 • Kafka. FPT University graduate. Notification-Hub · FEDOM-AI.</div>
      </div>
      <div class="sr-item" onclick="navigateBrowser('linkedin.com/in/le-quoc-viet-a03721240')">
        <div class="sr-url">💼 linkedin.com</div>
        <div class="sr-title">Le Quoc Viet — LinkedIn</div>
        <div class="sr-desc">Backend Developer at Sacombank | FPT University | Java, Spring Boot, .NET, Oracle, Redis, Kafka, IBM MQ.</div>
      </div>`;
  } else if (q.includes('java') || q.includes('spring') || q.includes('spring boot')) {
    items = `
      <div class="sr-item">
        <div class="sr-url">🌐 docs.spring.io</div>
        <div class="sr-title">Spring Boot Reference Documentation</div>
        <div class="sr-desc">Spring Boot makes it easy to create stand-alone, production-grade Spring-based applications.</div>
      </div>
      <div class="sr-item">
        <div class="sr-url">🌐 stackoverflow.com</div>
        <div class="sr-title">java - Why is Spring Boot taking 45 seconds to start? - Stack Overflow</div>
        <div class="sr-desc">Top answer (2,847 upvotes): "This is normal. Have you tried Quarkus?" Questioner has not responded.</div>
      </div>
      <div class="sr-item" onclick="navigateBrowser('localhost:8080')">
        <div class="sr-url">🌐 localhost:8080</div>
        <div class="sr-title">Spring Boot App — Running Locally</div>
        <div class="sr-desc">Your local CoreSL instance. Started in 2.511 seconds.</div>
      </div>`;
  } else if (q.includes('redis') || q.includes('oracle') || q.includes('kubernetes') || q.includes('airflow')) {
    items = `
      <div class="sr-item">
        <div class="sr-url">🌐 redis.io / docs</div>
        <div class="sr-title">Redis Documentation — Distributed Locking</div>
        <div class="sr-desc">SET key value NX PX milliseconds — the correct way to implement distributed locks. Le Quoc Viet uses this in production.</div>
      </div>
      <div class="sr-item" onclick="navigateBrowser('github.com/lqviet45')">
        <div class="sr-url">🐙 github.com/lqviet45</div>
        <div class="sr-title">Le Quoc Viet uses ${query} in production @ Sacombank</div>
        <div class="sr-desc">CoreSL core banking system relies heavily on ${query} for high-throughput transaction processing.</div>
      </div>`;
  } else if (q.includes('fix') || q.includes('bug') || q.includes('error') || q.includes('null')) {
    items = `
      <div class="sr-item" onclick="navigateBrowser('stackoverflow.com')">
        <div class="sr-url">🌐 stackoverflow.com</div>
        <div class="sr-title">${query} - Stack Overflow</div>
        <div class="sr-desc">Asked 1 hour ago · 0 answers · "I've tried everything. Please help" [duplicate] [closed]</div>
      </div>
      <div class="sr-item">
        <div class="sr-url">🌐 github.com/issues</div>
        <div class="sr-title">Issue #4821 — ${query} [WONTFIX]</div>
        <div class="sr-desc">Maintainer: "Works on my machine 🤷 Please provide a minimal reproducible example."</div>
      </div>`;
  } else {
    items = `
      <div class="sr-item" onclick="navigateBrowser('lqviet.dev')">
        <div class="sr-url">🌐 lqviet.dev</div>
        <div class="sr-title">Le Quoc Viet — You were probably looking for this</div>
        <div class="sr-desc">Backend Developer at Sacombank. Since you're already here, why not check out the portfolio?</div>
      </div>
      <div class="sr-item">
        <div class="sr-url">🌐 google.com/sorry</div>
        <div class="sr-title">Hmm, are you sure about "${query}"?</div>
        <div class="sr-desc">Our AI thinks you might just be procrastinating. Try opening Terminal and typing 'cat skills.txt'.</div>
      </div>`;
  }
  const count = (Math.floor(Math.random()*900)+100).toLocaleString();
  const sec   = (Math.random()*0.4+0.1).toFixed(2);
  return `<div class="bp bp-search-results">
    <div class="sr-header">
      <span class="sr-logo">Google</span>
      <div class="sr-search-mini">
        <input type="text" value="${query}" onkeydown="if(event.key==='Enter') browserGoSearch(this.value)">
        <button onclick="browserGoSearch(this.previousElementSibling.value)">🔍</button>
      </div>
    </div>
    <div class="sr-meta">About ${count},000,000 results (${sec} seconds)</div>
    <div class="sr-list">${items}</div>
  </div>`;
}

function _bpStackOverflow() {
  return `<div class="bp bp-so">
    <div class="so-header">
      <div class="so-logo">Stack<span style="color:#f48024">Overflow</span></div>
      <div class="so-user-badge">
        <img src="face-img.png" class="so-avatar">
        <div>
          <div class="so-username">lqviet45</div>
          <div class="so-rep">🏅 847 reputation</div>
        </div>
      </div>
    </div>
    <div class="so-question">
      <div class="so-votes">
        <button class="so-vote-btn">▲</button>
        <div class="so-score">3</div>
        <button class="so-vote-btn">▼</button>
      </div>
      <div class="so-body">
        <h2 class="so-q-title">Redis distributed lock releases <em>exactly</em> when I need it — is this personal?</h2>
        <div class="so-q-text">
          <p>I implemented a distributed lock using <code>SET NX PX</code> for idempotency in my CD buying API. Works fine in testing, but in production the lock expires at the <em>exact</em> moment a duplicate request arrives.</p>
          <p>TTL is 5000ms. The duplicate always arrives at 4999ms. I've checked the logs 47 times.</p>
          <pre class="so-code">redisTemplate.opsForValue()
  .setIfAbsent(key, "LOCKED", 5, TimeUnit.SECONDS);</pre>
          <p>Is Redis testing me?</p>
        </div>
        <div class="so-tags">
          <span class="so-tag">java</span><span class="so-tag">redis</span>
          <span class="so-tag">spring-boot</span><span class="so-tag">distributed-systems</span>
        </div>
      </div>
    </div>
    <div class="so-answers-section">
      <h3>3 Answers</h3>
      <div class="so-answer">
        <div class="so-a-check">✓ 12</div>
        <div class="so-a-body">
          <p>Yes, it's personal. Redis is fully aware of your business logic.</p>
          <p>Seriously though: extend your TTL to 30s and add a lock-renewal mechanism (Redisson's <code>RLock</code> does this). Consider Redlock for stronger guarantees across multiple nodes.</p>
          <div class="so-a-meta">answered by <strong>javaGuru99</strong> · 42,918 rep</div>
        </div>
      </div>
    </div>
  </div>`;
}

function _bpYouTube() {
  return `<div class="bp bp-yt">
    <div class="yt-header">
      <span style="color:#ff0000;font-size:1.1rem">▶</span> <strong>YouTube</strong>
    </div>
    <div class="yt-center">
      <div class="yt-emoji">🎧</div>
      <h2>You should be coding right now.</h2>
      <p style="color:var(--bp-muted)">But since you're here, have some focus music.</p>
      <div class="yt-player">
        <div class="yt-thumb">📻</div>
        <div class="yt-track">
          <div class="yt-track-name">lofi hip hop radio — beats to relax/study to</div>
          <div class="yt-track-ch">Lofi Girl · 24/7 live · 47,291 watching</div>
          <div class="yt-progress">
            <div class="yt-bar"></div>
          </div>
        </div>
      </div>
      <button class="bp-ql" onclick="navigateBrowser('lqviet.dev')" style="margin-top:20px">
        ← Back to Portfolio
      </button>
    </div>
  </div>`;
}

function _bp503() {
  return `<div class="bp bp-503">
    <div class="err-code">503</div>
    <div class="err-title">Service Temporarily Unavailable</div>
    <div class="err-msg">ChatGPT is overwhelmed with people asking it to<br>"write my entire backend for me".</div>
    <div class="err-tip">
      <div class="err-tip-label">💡 Have you tried?</div>
      <button class="err-alt-btn" onclick="openApp('terminal')">
        <i class="fas fa-terminal"></i> Open Terminal
        <span class="err-alt-badge">Available Now</span>
      </button>
      <p style="color:var(--bp-muted);font-size:0.75rem;margin-top:8px">
        Type <code>cat skills.txt</code> — it's faster than waiting for GPT-4o
      </p>
    </div>
  </div>`;
}

function _bpRestricted() {
  return `<div class="bp bp-restricted">
    <div class="res-icon">🔒</div>
    <h2>Access Restricted</h2>
    <p>This resource requires Sacombank internal network access.</p>
    <div class="res-table">
      <div class="res-row"><span>Your IP</span><span>203.xxx.xxx.xxx</span></div>
      <div class="res-row"><span>Required</span><span>VPN / Internal</span></div>
      <div class="res-row"><span>Status</span><span style="color:#f87171">● BLOCKED</span></div>
      <div class="res-row"><span>Service</span><span>CoreSL Banking API</span></div>
    </div>
    <p style="color:var(--bp-muted);font-size:0.8rem;margin-top:16px">
      Try <a onclick="navigateBrowser('localhost:8080')" style="color:var(--accent);cursor:pointer">localhost:8080</a> instead — it's the same thing but local.
    </p>
  </div>`;
}

function _bpLocalhost() {
  return `<div class="bp bp-localhost">
    <div class="lb-console">
      <div class="lb-line muted">  .   ____          _            __ _ _</div>
      <div class="lb-line muted"> /\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\</div>
      <div class="lb-line muted">( ( )\\___ | '_ | '_| | '_ \\/ _\` | \\ \\ \\ \\</div>
      <div class="lb-line muted"> \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )</div>
      <div class="lb-line muted">  '  |____| .__|_| |_|_| |_\\__, | / / / /</div>
      <div class="lb-line accent"> =========|_|==============|___/=/_/_/_/</div>
      <div class="lb-line accent"> :: Spring Boot ::               (v3.3.0)</div>
      <div class="lb-spacer"></div>
      <div class="lb-line"><span class="lb-ts">09:12:33.001</span> <span class="lb-info">INFO </span> CoreSLApplication : Starting CoreSLApplication v1.0.0</div>
      <div class="lb-line"><span class="lb-ts">09:12:34.112</span> <span class="lb-info">INFO </span> JpaBaseConfiguration  : HikariPool-1 — Starting Oracle connection pool</div>
      <div class="lb-line"><span class="lb-ts">09:12:34.891</span> <span class="lb-info">INFO </span> RedisConfig          : Connected to Redis at localhost:6379</div>
      <div class="lb-line"><span class="lb-ts">09:12:35.023</span> <span class="lb-info">INFO </span> KafkaConfig          : Consumer group 'coresl-cd-events' registered</div>
      <div class="lb-line"><span class="lb-ts">09:12:35.234</span> <span class="lb-info">INFO </span> TomcatWebServer      : Tomcat started on port 8080 (http)</div>
      <div class="lb-line success"><span class="lb-ts">09:12:35.512</span> <span class="lb-info">INFO </span> CoreSLApplication    : Started in 2.511 seconds (JVM 3.204s)</div>
      <div class="lb-divider">─────────────────────────────────────────────</div>
      <div class="lb-ep-title">Mapped endpoints:</div>
      <div class="lb-ep" onclick="navigateBrowser('localhost:8080/api/health')">GET  /api/health</div>
      <div class="lb-ep">POST /api/cd/issue</div>
      <div class="lb-ep">POST /api/cd/buy</div>
      <div class="lb-ep">POST /api/cd/sell</div>
      <div class="lb-ep">GET  /api/cd/config/limits</div>
      <div class="lb-ep">PUT  /api/cd/config/interest-rate</div>
    </div>
  </div>`;
}

function _bpApiHealth() {
  const ts = new Date().toISOString();
  return `<div class="bp bp-json">
    <div class="json-statusbar">
      <span class="json-200">● 200 OK</span>
      <span>GET /api/health</span>
      <span>application/json</span>
    </div>
    <pre class="json-pre">{
  <span class="j-k">"status"</span>: <span class="j-s">"UP"</span>,
  <span class="j-k">"service"</span>: <span class="j-s">"CoreSL"</span>,
  <span class="j-k">"version"</span>: <span class="j-s">"1.0.0"</span>,
  <span class="j-k">"timestamp"</span>: <span class="j-s">"${ts}"</span>,
  <span class="j-k">"components"</span>: {
    <span class="j-k">"db"</span>:    { <span class="j-k">"status"</span>: <span class="j-s">"UP"</span>, <span class="j-k">"type"</span>: <span class="j-s">"Oracle 19c"</span> },
    <span class="j-k">"redis"</span>: { <span class="j-k">"status"</span>: <span class="j-s">"UP"</span>, <span class="j-k">"version"</span>: <span class="j-s">"7.0.12"</span> },
    <span class="j-k">"disk"</span>:  { <span class="j-k">"status"</span>: <span class="j-s">"UP"</span>, <span class="j-k">"free"</span>: <span class="j-n">42949672960</span> }
  },
  <span class="j-k">"activeTransactions"</span>: <span class="j-n">247</span>,
  <span class="j-k">"uptime"</span>: <span class="j-s">"3d 14h 22m"</span>
}</pre>
  </div>`;
}

function _bpApiGeneric(url) {
  return `<div class="bp bp-json">
    <div class="json-statusbar">
      <span class="json-200">● 200 OK</span><span>${url}</span>
    </div>
    <pre class="json-pre">{
  <span class="j-k">"message"</span>: <span class="j-s">"Hello from CoreSL API"</span>,
  <span class="j-k">"hint"</span>: <span class="j-s">"Try /api/health for full status"</span>
}</pre>
  </div>`;
}

function _bpLinkedIn() {
  return `<div class="bp bp-linkedin">
    <div class="li-header"><span style="color:#0077b5;font-weight:700;font-size:1.3rem">in</span> LinkedIn</div>
    <div class="li-card">
      <div class="li-cover"></div>
      <div class="li-body">
        <img src="face-img.png" class="li-avatar">
        <h2>Le Quoc Viet</h2>
        <div class="li-headline">Backend Developer @ Sacombank · Java / Spring Boot · .NET / C# · Distributed Systems</div>
        <div class="li-location"><i class="fas fa-map-marker-alt"></i> Dong Nai / Ho Chi Minh City, Vietnam</div>
        <div class="li-connections">🟡 500+ connections</div>
        <div class="li-actions">
          <button class="li-btn-primary">+ Connect</button>
          <button class="li-btn-secondary">Message</button>
        </div>
      </div>
      <div class="li-section">
        <h3>About</h3>
        <p>Backend Developer with ~2 years across Java/Spring Boot and .NET/C#. Building core-banking microservices at Sacombank — CoreCD/CoreSL (certificate-of-deposit trading) and MCS Bill (virtual-account partner integration) — with Saga orchestration, the Outbox pattern, idempotent APIs, Oracle, Redis, Kafka and IBM MQ.</p>
      </div>
      <div class="li-section">
        <h3>Experience</h3>
        <div class="li-job"><div class="li-job-icon">🏦</div><div><b>Backend Developer — Sacombank</b><br><small>01/2026 – Present · CoreCD/CoreSL · MCS Bill</small></div></div>
        <div class="li-job"><div class="li-job-icon">💻</div><div><b>Backend Developer — Amazing Tech</b><br><small>12/2023 – 05/2024 · Tax-invoicing · Water-factory management</small></div></div>
      </div>
    </div>
  </div>`;
}

function _bpFacebook() {
  return `<div class="bp bp-restricted">
    <div class="res-icon">📘</div>
    <h2>Le Quoc Viet</h2>
    <p>This profile is set to Friends only.</p>
    <p style="color:var(--bp-muted);font-size:0.85rem;margin-top:12px">
      Better info available at
      <a onclick="navigateBrowser('linkedin.com/in/le-quoc-viet-a03721240')" style="color:var(--accent);cursor:pointer">LinkedIn</a>
      or the <a onclick="openApp('contact')" style="color:var(--accent);cursor:pointer">Contact window</a>.
    </p>
  </div>`;
}

function _bp404(url) {
  return `<div class="bp bp-404">
    <div class="e404-code">404</div>
    <div class="e404-msg">Page Not Found</div>
    <p style="color:var(--bp-muted)"><code>${url}</code> doesn't exist in this universe.</p>
    <div class="e404-tips">
      <div style="color:var(--bp-muted);font-size:0.8rem;margin-bottom:10px">Try one of these:</div>
      <button class="bp-ql" onclick="navigateBrowser('lqviet.dev')">🏠 lqviet.dev</button>
      <button class="bp-ql" onclick="navigateBrowser('github.com/lqviet45')">🐙 GitHub</button>
      <button class="bp-ql" onclick="navigateBrowser('localhost:8080/api/health')">⚡ /api/health</button>
      <button class="bp-ql" onclick="navigateBrowser('google.com')">🔍 Google</button>
    </div>
  </div>`;
}

/* ==============================================
   Window Management
   ============================================== */
function openApp(id) {
  if (openWindows[id]) {
    const { el } = openWindows[id];
    if (el.classList.contains('minimized')) {
      el.classList.remove('minimized');
    }
    bringToFront(el, id);
    return;
  }
  const config = APP_CONFIGS[id];
  if (!config) return;
  createWindow(id, config);
}

function createWindow(id, config) {
  const container = document.getElementById('windows-container');
  const vw = window.innerWidth;
  const vh = window.innerHeight - 48; // above taskbar

  const w = Math.min(config.width, vw - 40);
  const h = Math.min(config.height, vh - 40);

  // Offset each new window slightly
  const count = Object.keys(openWindows).length;
  const left = Math.max(120, Math.min((vw - w) / 2 + count * 24, vw - w - 20));
  const top  = Math.max(20,  Math.min((vh - h) / 2 + count * 24, vh - h - 20));

  const win = document.createElement('div');
  win.className = 'win';
  win.setAttribute('data-app', id);
  win.style.cssText = `width:${w}px;height:${h}px;left:${left}px;top:${top}px;`;

  win.innerHTML = `
    <div class="win-titlebar" id="titlebar-${id}">
      <div class="win-controls">
        <button class="win-ctrl close"    onclick="closeWindow('${id}')"></button>
        <button class="win-ctrl minimize" onclick="minimizeWindow('${id}')"></button>
        <button class="win-ctrl maximize" onclick="maximizeWindow('${id}')"></button>
      </div>
      <span class="win-title-icon"><i class="${config.icon}" style="color:${config.iconColor}"></i></span>
      <span class="win-title">${config.title}</span>
    </div>
    <div class="win-body" id="body-${id}">
      ${config.content()}
    </div>
    <div class="win-resizer" id="resizer-${id}"></div>
  `;

  container.appendChild(win);

  win.addEventListener('mousedown', (e) => {
    // Don't bring to front when clicking controls
    if (!e.target.classList.contains('win-ctrl')) {
      bringToFront(win, id);
    }
  });

  makeDraggable(win, win.querySelector('.win-titlebar'));
  makeResizable(win, win.querySelector('.win-resizer'));
  bringToFront(win, id);

  openWindows[id] = { el: win, config };
  addTaskbarItem(id, config);

  // Apps needing post-DOM init
  if (id === 'terminal') setTimeout(() => initTerminal(), 50);
  if (id === 'browser')  setTimeout(() => initBrowser(),  50);
}

function closeWindow(id) {
  const entry = openWindows[id];
  if (!entry) return;
  const { el } = entry;
  el.classList.add('closing');
  setTimeout(() => {
    el.remove();
    delete openWindows[id];
    delete maximizedWindows[id];
    removeTaskbarItem(id);
  }, 180);
}

function minimizeWindow(id) {
  const entry = openWindows[id];
  if (!entry) return;
  entry.el.classList.add('minimized');
  // Update taskbar item to inactive
  const tbItem = document.getElementById(`tb-${id}`);
  if (tbItem) tbItem.classList.remove('active');
}

function maximizeWindow(id) {
  const entry = openWindows[id];
  if (!entry) return;
  const { el } = entry;

  if (maximizedWindows[id]) {
    // Restore
    const saved = maximizedWindows[id];
    el.style.left   = saved.left;
    el.style.top    = saved.top;
    el.style.width  = saved.width;
    el.style.height = saved.height;
    el.classList.remove('maximized');
    delete maximizedWindows[id];
  } else {
    // Save + maximize
    maximizedWindows[id] = {
      left:   el.style.left,
      top:    el.style.top,
      width:  el.style.width,
      height: el.style.height
    };
    el.classList.add('maximized');
  }
}

function bringToFront(win, id) {
  globalZ++;
  win.style.zIndex = globalZ;
  // Remove focused from all windows
  document.querySelectorAll('.win').forEach(w => w.classList.remove('focused'));
  win.classList.add('focused');
  // Sync taskbar
  document.querySelectorAll('.taskbar-item').forEach(btn => btn.classList.remove('active'));
  const tbItem = document.getElementById(`tb-${id}`);
  if (tbItem) tbItem.classList.add('active');
}

/* ==============================================
   Drag & Resize
   ============================================== */
function makeDraggable(win, handle) {
  let startX, startY, startLeft, startTop;
  let dragging = false;

  handle.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('win-ctrl')) return;
    if (win.classList.contains('maximized')) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(win.style.left) || 0;
    startTop  = parseInt(win.style.top)  || 0;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newLeft = startLeft + dx;
    const newTop  = startTop  + dy;

    // Constrain to viewport
    const maxLeft = window.innerWidth  - (parseInt(win.style.width)  || 200);
    const maxTop  = window.innerHeight - 48 - 40; // keep titlebar visible
    win.style.left = Math.max(-100, Math.min(newLeft, maxLeft + 100)) + 'px';
    win.style.top  = Math.max(0,    Math.min(newTop,  maxTop)) + 'px';
  });

  document.addEventListener('mouseup', () => { dragging = false; });
}

function makeResizable(win, resizer) {
  let startX, startY, startW, startH;
  let resizing = false;

  resizer.addEventListener('mousedown', (e) => {
    resizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startW = parseInt(win.style.width)  || win.offsetWidth;
    startH = parseInt(win.style.height) || win.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    const newW = Math.max(320, startW + (e.clientX - startX));
    const newH = Math.max(200, startH + (e.clientY - startY));
    win.style.width  = newW + 'px';
    win.style.height = newH + 'px';
  });

  document.addEventListener('mouseup', () => { resizing = false; });
}

/* ==============================================
   Taskbar Items
   ============================================== */
function addTaskbarItem(id, config) {
  const container = document.getElementById('taskbar-items');
  const btn = document.createElement('button');
  btn.className = 'taskbar-item';
  btn.id = `tb-${id}`;
  btn.innerHTML = `<i class="${config.icon}" style="color:${config.iconColor}"></i><span>${config.title}</span>`;
  btn.addEventListener('click', () => handleTaskbarClick(id));
  container.appendChild(btn);
}

function removeTaskbarItem(id) {
  const el = document.getElementById(`tb-${id}`);
  if (el) el.remove();
}

function handleTaskbarClick(id) {
  const entry = openWindows[id];
  if (!entry) return;
  const { el } = entry;

  if (el.classList.contains('minimized')) {
    el.classList.remove('minimized');
    bringToFront(el, id);
  } else if (el.classList.contains('focused')) {
    minimizeWindow(id);
  } else {
    bringToFront(el, id);
  }
}

/* ==============================================
   File Detail Toggle (Experience)
   ============================================== */
function toggleFileDetail(itemId) {
  const item = document.getElementById(itemId);
  if (!item) return;

  const isOpen = item.classList.contains('open');

  // Close all items first
  document.querySelectorAll('.file-item').forEach(fi => {
    fi.classList.remove('open');
    const detail = fi.querySelector('.file-detail');
    if (detail) detail.classList.remove('visible');
  });

  // Open clicked if it was closed
  if (!isOpen) {
    item.classList.add('open');
    const detail = item.querySelector('.file-detail');
    if (detail) detail.classList.add('visible');
  }
}

/* ==============================================
   Terminal
   ============================================== */
const TERMINAL_BANNER = `<div class="t-line t-ascii">  _      ___     __
 | |    / _ \\   / /
 | |   | | | | | |
 | |___| |_| | \\ \\__
 |_____\\__\\__/  \\___/</div>
<div class="t-line t-accent" style="margin-bottom:6px">Le Quoc Viet — Backend Developer</div>
<div class="t-line t-output">Type <span class="t-success">'help'</span> for available commands.</div>
<div class="t-line" style="margin-bottom:8px"></div>`;

const COMMANDS = {
  help() {
    return `<div class="t-line t-bold">Available commands:</div>
<div class="t-line t-output">  <span class="t-success">whoami</span>        — About me</div>
<div class="t-line t-output">  <span class="t-success">ls</span>            — List portfolio contents</div>
<div class="t-line t-output">  <span class="t-success">cat about.txt</span> — About info</div>
<div class="t-line t-output">  <span class="t-success">cat skills.txt</span>— Full skill list</div>
<div class="t-line t-output">  <span class="t-success">cat exp.txt</span>   — Work experience</div>
<div class="t-line t-output">  <span class="t-success">cat contact.txt</span>— Contact info</div>
<div class="t-line t-output">  <span class="t-success">open &lt;app&gt;</span>    — Open an app window</div>
<div class="t-line t-output">  <span class="t-success">ssh lqv.sys</span>   — Portfolio v2: my career as a distributed system</div>
<div class="t-line t-output">  <span class="t-success">date</span>           — Current date & time</div>
<div class="t-line t-output">  <span class="t-success">neofetch</span>      — System info</div>
<div class="t-line t-output">  <span class="t-success">clear</span>         — Clear terminal</div>`;
  },

  whoami() {
    return `<div class="t-line t-bold">Le Quoc Viet</div>
<div class="t-line t-output">Role  : Backend Developer @ Sacombank</div>
<div class="t-line t-output">Stack : Java/Spring Boot, .NET/C#, Oracle, Redis, Kafka, IBM MQ</div>
<div class="t-line t-output">Edu   : FPT University — GPA 7.92/10</div>`;
  },

  ls() {
    return `<div class="t-line t-output">portfolio/</div>
<div class="t-line t-output">├── About_Me.txt</div>
<div class="t-line t-output">├── Experience/</div>
<div class="t-line t-output">│   ├── Sacombank_CoreCD_CoreSL.log</div>
<div class="t-line t-output">│   ├── Sacombank_MCS_Bill.log</div>
<div class="t-line t-output">│   └── AmazingTech.log</div>
<div class="t-line t-output">├── Projects/</div>
<div class="t-line t-output">│   ├── NotificationHub/</div>
<div class="t-line t-output">│   ├── FEDOM-AI/</div>
<div class="t-line t-output">│   └── GymManagement/</div>
<div class="t-line t-output">├── skills.json</div>
<div class="t-line t-output">├── Certificates/</div>
<div class="t-line t-output">├── lqv.sys</div>
<div class="t-line t-output">├── Contact.lnk</div>
<div class="t-line t-output">└── Recycle Bin/</div>`;
  },

  'cat about.txt'() {
    return `<div class="t-line t-bold">Le Quoc Viet</div>
<div class="t-line t-output">Backend Developer @ Sacombank</div>
<div class="t-line t-output">Graduated from FPT University (GPA: 7.92/10).</div>
<div class="t-line t-output">Building core-banking microservices: CoreCD/CoreSL (CD trading)</div>
<div class="t-line t-output">and MCS Bill (virtual-account partner integration).</div>
<div class="t-line t-output">Saga · Outbox · idempotent APIs · Oracle · Redis · Kafka · IBM MQ</div>`;
  },

  'cat skills.txt'() {
    return `<div class="t-line t-bold">Technical Skills</div>
<div class="t-line t-output">Languages : Java, C#, JavaScript, SQL, HTML/CSS</div>
<div class="t-line t-output">Frameworks: Spring Boot, OpenFeign, ASP.NET Core, Dapper, React, Next.js</div>
<div class="t-line t-output">Databases : Oracle, PostgreSQL, SQL Server, Redis, MongoDB</div>
<div class="t-line t-output">Messaging : REST, gRPC, IBM MQ/JMS, Kafka, RabbitMQ</div>
<div class="t-line t-output">DevOps    : Docker, Kubernetes, Helm, GitLab CI/CD, Airflow, Kong</div>`;
  },

  'cat exp.txt'() {
    return `<div class="t-line t-bold">Work Experience</div>
<div class="t-line t-output" style="margin-top:4px">[ Sacombank — CoreCD/CoreSL ] 01/2026 – Present</div>
<div class="t-line t-output">  Full CD lifecycle: register, issue, trade, settle (T24 + PaymentHub)</div>
<div class="t-line t-output">  Purchase Saga w/ Redis idempotency · MQ + REST intake · auto rollback</div>
<div class="t-line t-output">  Early-redemption simulation · Outbox events · Airflow reconciliation</div>
<div class="t-line t-output" style="margin-top:6px">[ Sacombank — MCS Bill System ] 01/2026 – Present</div>
<div class="t-line t-output">  gRPC facade + IBM MQ request/reply · legacy fallback routing</div>
<div class="t-line t-output">  6 partner banks/gateways · OAuth2 · RSA-SHA256 signing</div>
<div class="t-line t-output" style="margin-top:6px">[ Amazing Tech ] 12/2023 – 05/2024</div>
<div class="t-line t-output">  Tax-invoicing &amp; water-factory APIs · stored procs · Excel reports</div>`;
  },

  'cat contact.txt'() {
    return `<div class="t-line t-output">Email    : lqviet455@gmail.com</div>
<div class="t-line t-output">Phone    : +84 353 081 770</div>
<div class="t-line t-output">GitHub   : github.com/lqviet45</div>
<div class="t-line t-output">LinkedIn : linkedin.com/in/le-quoc-viet-a03721240</div>
<div class="t-line t-output">Facebook : facebook.com/le.quoc.viet.692602</div>`;
  },

  date() {
    const now = new Date();
    return `<div class="t-line t-output">${now.toString()}</div>`;
  },

  neofetch() {
    return `<div class="t-line t-ascii">      ██████
    ██░░░░░░██
   ██░░░░░░░░██   <span class="t-bold t-accent">lqviet@portfolio</span>
   ██░░░░░░░░██   ─────────────────────
   ██░░░░░░░░██   <span class="t-info">OS</span>: Portfolio OS 1.0
    ██░░░░░░██    <span class="t-info">CPU</span>: Java / Spring Boot
      ██████      <span class="t-info">RAM</span>: 7.92 GPA / 10 GPA</div>
<div class="t-line t-output">  <span class="t-info">Uptime</span>  : ~2 years</div>
<div class="t-line t-output">  <span class="t-info">Shell</span>   : Portfolio Terminal</div>
<div class="t-line t-output">  <span class="t-info">Theme</span>   : Glassmorphism Dark</div>
<div class="t-line t-output">  <span class="t-info">Kernel</span>  : Vanilla JS</div>`;
  },

  'ssh lqv.sys'() {
    setTimeout(() => { location.href = 'system/'; }, 900);
    return `<div class="t-line t-output">Connecting to lqv.sys (vn-south-1)...</div>
<div class="t-line t-success">Authenticated. Redirecting to LQV/SYS...</div>`;
  },

  clear: '__CLEAR__'
};

function initTerminal() {
  const output = document.getElementById('terminal-output');
  const input  = document.getElementById('terminal-input');
  if (!output || !input) return;

  // Print banner
  output.innerHTML = TERMINAL_BANNER;

  const history = [];
  let histIdx = -1;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = input.value.trim();
      input.value = '';
      histIdx = -1;

      if (!raw) return;
      history.unshift(raw);

      // Echo the command
      appendLine(output, `<div class="t-line"><span class="t-prompt">lqviet@portfolio:~$</span> <span class="t-cmd">${escapeHtml(raw)}</span></div>`);

      // Look up command
      const key = raw.toLowerCase();
      const handler = COMMANDS[key];

      if (handler === '__CLEAR__') {
        output.innerHTML = '';
        return;
      }

      if (typeof handler === 'function') {
        appendLine(output, handler());
      } else if (key.startsWith('open ')) {
        const appId = key.slice(5).trim();
        if (APP_CONFIGS[appId]) {
          appendLine(output, `<div class="t-line t-success">Opening ${appId}...</div>`);
          openApp(appId);
        } else {
          appendLine(output, `<div class="t-line t-error">open: unknown app '${escapeHtml(appId)}'. Try: about, experience, projects, skills, certificates, contact, recycle</div>`);
        }
      } else {
        appendLine(output, `<div class="t-line t-error">command not found: ${escapeHtml(raw)}. Type 'help'</div>`);
      }

      output.scrollTop = output.scrollHeight;
    }

    if (e.key === 'ArrowUp') {
      if (histIdx < history.length - 1) {
        histIdx++;
        input.value = history[histIdx] || '';
      }
      e.preventDefault();
    }
    if (e.key === 'ArrowDown') {
      if (histIdx > 0) {
        histIdx--;
        input.value = history[histIdx] || '';
      } else {
        histIdx = -1;
        input.value = '';
      }
      e.preventDefault();
    }
  });

  input.focus();
}

function appendLine(output, html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  output.appendChild(div);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==============================================
   Start Menu
   ============================================== */
function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  const btn  = document.getElementById('start-btn');
  const isHidden = menu.classList.contains('hidden');
  menu.classList.toggle('hidden');
  btn.classList.toggle('active', isHidden);
}

function closeStartMenu() {
  const menu = document.getElementById('start-menu');
  const btn  = document.getElementById('start-btn');
  menu.classList.add('hidden');
  btn.classList.remove('active');
}

// Close start menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('start-menu');
  const btn  = document.getElementById('start-btn');
  if (!menu || !btn) return;
  if (!menu.classList.contains('hidden') &&
      !menu.contains(e.target) &&
      !btn.contains(e.target)) {
    closeStartMenu();
  }
});

/* ==============================================
   Theme Toggle
   ============================================== */
function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);

  const isDark = currentTheme === 'dark';
  const icon = isDark ? 'fas fa-moon' : 'fas fa-sun';

  const trayBtn = document.getElementById('tray-theme');
  if (trayBtn) trayBtn.innerHTML = `<i class="${icon}"></i>`;

  const smBtn = document.getElementById('sm-theme-btn');
  if (smBtn) smBtn.innerHTML = `<i class="${icon}"></i> Theme`;
}

/* ==============================================
   Language Toggle (cosmetic)
   ============================================== */
function toggleLang() {
  currentLang = currentLang === 'en' ? 'vi' : 'en';
  localStorage.setItem('lang', currentLang);
  const flag = currentLang === 'en' ? '🇺🇸' : '🇻🇳';
  const trayFlag = document.getElementById('tray-flag');
  if (trayFlag) trayFlag.textContent = flag;
  const smBtn = document.getElementById('sm-lang-btn');
  if (smBtn) smBtn.innerHTML = `<span>${flag}</span> Lang`;
}

/* ==============================================
   Clock
   ============================================== */
function updateClock() {
  const now = new Date();
  const hh  = String(now.getHours()).padStart(2, '0');
  const mm  = String(now.getMinutes()).padStart(2, '0');
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dayStr = days[now.getDay()];
  const monStr = months[now.getMonth()];
  const dd     = String(now.getDate()).padStart(2, '0');

  const timeEl = document.getElementById('clock-time');
  const dateEl = document.getElementById('clock-date');
  if (timeEl) timeEl.textContent = `${hh}:${mm}`;
  if (dateEl) dateEl.textContent = `${dayStr} ${monStr} ${dd}`;
}

/* ==============================================
   Particles
   ============================================== */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const left  = Math.random() * 100;
    const dur   = (Math.random() * 12 + 10).toFixed(1);
    const delay = (Math.random() * 16).toFixed(1);
    const drift = (Math.random() - 0.5) * 120;
    p.style.cssText = `left:${left}%;--dur:${dur}s;--delay:-${delay}s;--drift:${drift}px;`;
    container.appendChild(p);
  }
}

/* ==============================================
   Desktop Icon Selection
   ============================================== */
function setupDesktopIconSelection() {
  const icons = document.querySelectorAll('.desktop-icon');
  icons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      icons.forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
      e.stopPropagation();
    });
  });
  document.getElementById('wallpaper').addEventListener('click', () => {
    icons.forEach(i => i.classList.remove('selected'));
  });
}

/* ==============================================
   Music Player
   ============================================== */
class MusicPlayer {
  constructor() {
    this.audio = document.getElementById('audioPlayer');
    if (!this.audio) return;
    this.audio.src = 'music/la-vaguelette.mp3';
    this.audio.volume = 0.3;
  }

  toggle() {
    if (!this.audio) return;
    if (musicPlaying) {
      this.audio.pause();
      musicPlaying = false;
    } else {
      this.audio.play().catch(() => {});
      musicPlaying = true;
    }
    const btn = document.getElementById('tray-music');
    if (btn) btn.classList.toggle('playing', musicPlaying);
  }
}

let player;
function toggleMusic() {
  if (!player) player = new MusicPlayer();
  player.toggle();
}

/* ==============================================
   Boot Sequence
   ============================================== */
function bootSequence() {
  const boot = document.getElementById('boot-screen');
  if (!boot) return;
  setTimeout(() => {
    boot.classList.add('fade-out');
    setTimeout(() => boot.remove(), 800);
  }, 2200);
}

/* ==============================================
   Init
   ============================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'light') {
    const trayBtn = document.getElementById('tray-theme');
    if (trayBtn) trayBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Apply saved lang
  const savedFlag = currentLang === 'en' ? '🇺🇸' : '🇻🇳';
  const trayFlag = document.getElementById('tray-flag');
  if (trayFlag) trayFlag.textContent = savedFlag;

  createParticles();
  updateClock();
  setInterval(updateClock, 1000);
  setupDesktopIconSelection();
  bootSequence();
});

/* ==============================================
   LQV/SYS — a portfolio you can send requests through
   Vanilla JS, no framework
   ============================================== */

'use strict';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const SVGNS = 'http://www.w3.org/2000/svg';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const hex = n => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ==============================================
   Profile data (source: CV)
   ============================================== */
const PROFILE = {
  name: 'Le Quoc Viet',
  role: 'Backend Developer — Java / Spring Boot · .NET / C#',
  company: 'Sacombank',
  location: 'Bac Son, Trang Bom, Dong Nai, Vietnam',
  email: 'lqviet455@gmail.com',
  phone: '+84 353 081 770',
  github: 'https://github.com/lqviet45',
  linkedin: 'https://www.linkedin.com/in/le-quoc-viet-a03721240',
  summary: 'Junior Backend Developer with ~2 years of hands-on experience across Java/Spring Boot and .NET/C#. ' +
    'Currently building core-banking microservices at Sacombank, across two platforms — CoreCD/CoreSL ' +
    '(certificate-of-deposit trading) and the MCS Bill System (virtual-account partner integration) — working with ' +
    'Saga orchestration, the Outbox pattern, idempotent APIs, Oracle, Redis, Kafka and IBM MQ.',
  education: { school: 'FPT University, HCM City', degree: 'Bachelor of IT — Software Engineering', gpa: '7.92/10 (3.16/4)', graduated: '05/2025' },
  certs: [
    { name: 'Software Development Lifecycle', by: 'Coursera', url: 'https://coursera.org/share/d6d4b9c8125ac11f4132a6012dbcef5f' },
    { name: 'Microsoft Back-End Developer', by: 'Coursera', url: 'https://coursera.org/share/e13540f572707149f36db01d7e93e34c' },
    { name: 'Foundational C# with Microsoft', by: 'freeCodeCamp', url: 'https://www.freecodecamp.org/certification/viet455/foundational-c-sharp-with-microsoft' }
  ],
  skills: {
    'Languages': ['Java', 'C#', 'JavaScript', 'SQL', 'HTML/CSS'],
    'Frameworks & Libraries': ['Spring Boot', 'Spring Cloud OpenFeign', 'ASP.NET Core', 'Dapper', 'ReactJS', 'Next.js'],
    'Databases': ['Oracle', 'PostgreSQL', 'SQL Server', 'Redis', 'MongoDB'],
    'Messaging & APIs': ['REST API', 'gRPC', 'IBM MQ/JMS', 'Apache Kafka', 'RabbitMQ'],
    'Tools & DevOps': ['Docker', 'Kubernetes', 'Helm', 'GitLab CI/CD', 'Apache Airflow', 'Kong', 'Git', 'Postman', 'Swagger'],
    'Patterns': ['Saga', 'Outbox', 'Idempotency', 'CQRS', 'Clean Architecture', 'Circuit Breaker'],
    'Soft skills': ['Team coordination', 'Problem-solving', 'Self-learning']
  },
  hot: new Set(['Java', 'C#', 'Spring Boot', 'ASP.NET Core', 'Oracle', 'Redis', 'Apache Kafka', 'IBM MQ/JMS', 'gRPC', 'Saga', 'Outbox', 'Idempotency']),
  experience: [
    {
      id: 'corecd', company: 'Sacombank', title: 'Backend Developer', product: 'CoreCD/CoreSL',
      subtitle: 'Certificate-of-Deposit Trading Platform', period: '01/2026 – Present', now: true,
      tech: ['Java', 'Spring Boot', 'Saga', 'Outbox', 'Oracle', 'Redis', 'IBM MQ', 'Airflow', 'T24', 'PaymentHub'],
      bullets: [
        'Delivered production microservices covering the full CD lifecycle — registration, issuance, primary/secondary trading, settlement — integrated with T24 Core Banking and PaymentHub.',
        'Customer registration & lifecycle — corporate/retail buy-register with account and CIF validation, contract generation, and cancellation (auto sell-off of remaining holdings for retail).',
        'CD purchase flow end-to-end — dual-channel order intake (MQ + REST), buyer account verification, PaymentHub settlement and automatic rollback on failure — Saga orchestration with Redis-based idempotency for exactly-once processing.',
        'Early-redemption & sell flow — multi-criteria pre-maturity sale simulation (full / partial / by-amount), interest & fee calculation, auto-sell below threshold, settlement at maturity.',
        'Outbox-pattern event publishing in lot-management, CD-lot reconciliation/ODS sync with Apache Airflow DAGs, Redis-cached purchase/sale reporting.'
      ]
    },
    {
      id: 'mcs', company: 'Sacombank', title: 'Backend Developer', product: 'MCS Bill System',
      subtitle: 'Virtual-Account Partner Integration Platform', period: '01/2026 – Present', now: true,
      tech: ['gRPC', 'IBM MQ', 'Adapter layer', 'OAuth2', 'RSA-SHA256'],
      bullets: [
        'Virtual-account (VA) integration platform — inquiry, deposit-notify and outgoing-core flows unified behind a gRPC facade, with an IBM MQ request/reply layer dispatching to partner adapters and fallback routing to the legacy system.',
        'Integrated 6 partner banks / payment gateways (SHB, LienVietPostBank, PVI, NganLuong, Vimo, GSM) through a common adapter layer, incl. OAuth2 token exchange and RSA-SHA256 request signing for SHB.'
      ]
    },
    {
      id: 'amazing', company: 'Amazing Tech', title: 'Back-end Developer', product: 'Tax-invoicing & water-factory systems',
      subtitle: 'Outsourcing · API modules', period: '12/2023 – 05/2024', now: false,
      tech: ['ASP.NET Core', 'C#', 'SQL Server', 'Dapper', 'Stored Procedures'],
      bullets: [
        'Shipped API modules powering a tax-invoicing system and a water-factory management system, integrating external systems and cutting query latency with SQL Stored Procedures.',
        'Built complex reporting modules with Excel export, partnering with the frontend team to define API contracts.'
      ]
    }
  ],
  projects: [
    {
      id: 'nhub', name: 'Notification Hub', kind: 'Multi-tenant notification platform · personal', period: '2025 – Present',
      tech: ['.NET 8', 'Kong', 'Kafka', 'gRPC', 'AMQP', 'OpenTelemetry', 'Polly', 'Redis', 'Blazor'],
      bullets: [
        'Designed and shipped solo — Kong gateway, auth, ingestion (REST + gRPC + legacy AMQP), routing, templating, tracking, per-channel workers (email/SMS/push) and a Blazor admin console. Architecture through infra.',
        'OAuth2 client-credentials with RS256/JWKS, including zero-downtime signing-key rotation validated via a dual-key overlap window.',
        'Reliable delivery: outbox-relay → Kafka → channel workers, HMAC-signed callbacks, end-to-end tracing (OpenTelemetry, W3C trace-context across HTTP and Kafka), Polly circuit-breaker/retry/bulkhead with Redis fail-open caching.'
      ]
    },
    {
      id: 'fedom', name: 'FEDOM-AI', kind: 'Exam & proctor management · capstone · back-end', period: '2025',
      tech: ['ASP.NET Core', 'CQRS', 'MediatR', 'Spring AI (RAG)', 'SignalR', 'RabbitMQ', 'Quartz'],
      bullets: [
        'Directed the backend architecture with CQRS + MediatR Clean Architecture.',
        'Integrated a RAG-based Spring AI chatbot and SignalR real-time support.',
        'Moved Excel-import processing off the request thread with an async RabbitMQ + Quartz-scheduled pipeline.'
      ]
    },
    {
      id: 'gym', name: 'Gym Management System', kind: 'Full-stack side project', period: 'earlier',
      tech: ['ASP.NET Core', 'Next.js', 'PostgreSQL', 'PayOS'],
      bullets: ['Members, subscriptions and operations with integrated PayOS payments and an admin interface.']
    }
  ]
};

/* ==============================================
   Topology
   ============================================== */
const NODES = {
  you:      { x: 70,  y: 270, w: 112, h: 56,  kind: 'client',  label: 'you' },
  gw:       { x: 240, y: 270, w: 120, h: 56,  kind: 'gateway', label: 'kong-gw' },
  identity: { x: 447, y: 80,  w: 156, h: 56,  kind: 'service', label: 'identity-svc', route: '/about' },
  career:   { x: 447, y: 210, w: 156, h: 56,  kind: 'service', label: 'career-svc',   route: '/experience' },
  projects: { x: 447, y: 340, w: 156, h: 56,  kind: 'service', label: 'projects-svc', route: '/projects' },
  skills:   { x: 447, y: 470, w: 156, h: 56,  kind: 'service', label: 'skills-svc',   route: '/skills' },
  kafka:    { x: 645, y: 275, w: 60,  h: 450, kind: 'topic',   label: 'career.events', shape: 'kafka' },
  redis:    { x: 832, y: 110, w: 130, h: 76,  kind: 'cache',   label: 'redis',  shape: 'db', route: '/cache' },
  oracle:   { x: 832, y: 275, w: 130, h: 76,  kind: 'records', label: 'oracle', shape: 'db', route: '/education' },
  notify:   { x: 832, y: 440, w: 146, h: 56,  kind: 'worker',  label: 'notify-worker', route: '/contact' }
};
const SERVICES = ['identity', 'career', 'projects', 'skills'];
const SINKS = ['redis', 'oracle', 'notify'];

const EDGES = [
  ['you', 'gw', 'sync'],
  ...SERVICES.map(s => ['gw', s, 'sync']),
  ...SERVICES.map(s => [s, 'kafka', 'async']),
  ...SINKS.map(s => ['kafka', s, 'async'])
];

const edgeEls = {};   // "a>b" -> { el, len }
const nodeEls = {};   // id -> <g>
const down = new Set();
const packets = [];
let reqCount = 0;
let selected = null;

function svg(tag, attrs = {}, parent) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (parent) parent.appendChild(el);
  return el;
}

function edgePath(a, b) {
  const A = NODES[a], B = NODES[b];
  const x1 = A.x + A.w / 2;
  const x2 = B.x - B.w / 2;
  const y1 = A.shape === 'kafka' ? B.y : A.y;
  const y2 = B.shape === 'kafka' ? A.y : B.y;
  if (Math.abs(y1 - y2) < 1) return `M${x1} ${y1} H${x2}`;
  const mx = (x1 + x2) / 2;
  const s = Math.sign(y2 - y1);
  const r = Math.min(10, Math.abs(y2 - y1) / 2);
  return `M${x1} ${y1} H${mx - r} Q${mx} ${y1} ${mx} ${y1 + s * r} V${y2 - s * r} Q${mx} ${y2} ${mx + r} ${y2} H${x2}`;
}

function cylinderPath(n, dx = 0, dy = 0) {
  const l = n.x - n.w / 2 + dx, r = n.x + n.w / 2 + dx;
  const t = n.y - n.h / 2 + dy, b = n.y + n.h / 2 + dy;
  const ry = 9, rx = n.w / 2;
  return `M${l} ${t + ry} A${rx} ${ry} 0 0 1 ${r} ${t + ry} V${b - ry} A${rx} ${ry} 0 0 1 ${l} ${b - ry} Z`;
}

function drawTopology() {
  const root = $('#topo');
  const gEdges = svg('g', {}, root);
  const gNodes = svg('g', {}, root);
  svg('g', { id: 'packets' }, root);

  for (const [a, b, type] of EDGES) {
    const el = svg('path', { d: edgePath(a, b), class: `edge ${type}` }, gEdges);
    edgeEls[`${a}>${b}`] = { el, len: 0 };
  }

  for (const [id, n] of Object.entries(NODES)) {
    const g = svg('g', {
      class: 'node', tabindex: 0, role: 'button', 'data-node': id,
      'aria-label': `${n.label} (${n.kind}) — inspect`
    }, gNodes);
    const left = n.x - n.w / 2, top = n.y - n.h / 2;

    if (n.shape === 'db') {
      svg('path', { d: cylinderPath(n, 3, 3), class: 'shadow' }, g);
      svg('path', { d: cylinderPath(n), class: 'box' }, g);
      svg('ellipse', { cx: n.x, cy: top + 9, rx: n.w / 2, ry: 9, class: 'box' }, g);
      svg('path', { d: cylinderPath(n), class: 'pulse' }, g);
      svg('text', { x: n.x, y: n.y + 6, class: 'kind', 'text-anchor': 'middle' }, g).textContent = n.kind;
      svg('text', { x: n.x, y: n.y + 24, class: 'name', 'text-anchor': 'middle' }, g).textContent = n.label;
      svg('circle', { cx: n.x + n.w / 2 - 12, cy: top + 9, r: 3.5, class: 'led' }, g);
    } else if (n.shape === 'kafka') {
      svg('rect', { x: left + 3, y: top + 3, width: n.w, height: n.h, rx: 4, class: 'shadow' }, g);
      svg('rect', { x: left, y: top, width: n.w, height: n.h, rx: 4, class: 'box' }, g);
      svg('rect', { x: left, y: top, width: n.w, height: n.h, rx: 4, class: 'pulse' }, g);
      for (let yy = top + 40; yy < top + n.h - 10; yy += 18) {
        svg('line', { x1: left + 8, x2: left + 16, y1: yy, y2: yy, class: 'kafka-line' }, g);
        svg('line', { x1: left + n.w - 16, x2: left + n.w - 8, y1: yy, y2: yy, class: 'kafka-line' }, g);
      }
      svg('text', { x: n.x, y: top + 20, class: 'kind', 'text-anchor': 'middle' }, g).textContent = 'kafka';
      svg('text', { x: n.x, y: n.y, class: 'kafka-label', 'text-anchor': 'middle', 'dominant-baseline': 'middle', transform: `rotate(-90 ${n.x} ${n.y})` }, g).textContent = n.label;
      svg('circle', { cx: n.x, cy: top + n.h - 14, r: 3.5, class: 'led' }, g);
    } else {
      svg('rect', { x: left + 3, y: top + 3, width: n.w, height: n.h, rx: 4, class: 'shadow' }, g);
      svg('rect', { x: left, y: top, width: n.w, height: n.h, rx: 4, class: 'box' }, g);
      svg('rect', { x: left, y: top, width: n.w, height: n.h, rx: 4, class: 'pulse' }, g);
      svg('text', { x: left + 12, y: top + 20, class: 'kind' }, g).textContent = n.kind;
      svg('text', { x: left + 12, y: top + 41, class: 'name' }, g).textContent = n.label;
      svg('circle', { cx: left + n.w - 12, cy: top + 12, r: 3.5, class: 'led' }, g);
    }

    g.addEventListener('click', () => select(id));
    g.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(id); }
    });
    nodeEls[id] = g;
  }

  for (const e of Object.values(edgeEls)) e.len = e.el.getTotalLength();
}

/* ---- Packets ---- */
function travel(a, b, cls = 'sync', dur) {
  let key = `${a}>${b}`, reverse = false;
  if (!edgeEls[key]) { key = `${b}>${a}`; reverse = true; }
  const edge = edgeEls[key];
  if (!edge) return Promise.resolve();
  const ms = REDUCED ? 1 : (dur || (cls === 'async' ? 700 : 520));
  return new Promise(resolve => {
    const el = svg('circle', { r: cls === 'async' ? 4 : 4.5, class: `packet ${cls}` }, $('#packets'));
    packets.push({ edge, reverse, el, start: performance.now(), ms, resolve });
    if (packets.length === 1) requestAnimationFrame(tick);
  });
}

function tick(now) {
  for (let i = packets.length - 1; i >= 0; i--) {
    const p = packets[i];
    const t = Math.min(1, (now - p.start) / p.ms);
    const e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const pt = p.edge.el.getPointAtLength((p.reverse ? 1 - e : e) * p.edge.len);
    p.el.setAttribute('cx', pt.x);
    p.el.setAttribute('cy', pt.y);
    if (t >= 1) {
      p.el.remove();
      packets.splice(i, 1);
      p.resolve();
    }
  }
  if (packets.length) requestAnimationFrame(tick);
}

function ping(id) {
  const g = nodeEls[id];
  if (!g) return;
  g.classList.remove('ping');
  void g.getBBox();
  g.classList.add('ping');
}

function floatTag(id, text, ok = false) {
  const n = NODES[id];
  const t = svg('text', { x: n.x, y: n.y - n.h / 2 - 8, class: `float-tag${ok ? ' ok' : ''}`, 'text-anchor': 'middle' }, $('#packets'));
  t.textContent = text;
  if (REDUCED || !t.animate) { setTimeout(() => t.remove(), 1200); return; }
  t.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-16px)', opacity: 0 }], { duration: 1300, easing: 'ease-out' })
    .onfinish = () => t.remove();
}

function bumpCount() {
  reqCount++;
  $('#req-count').textContent = reqCount.toLocaleString('en-US');
}

/* A request through the system: you -> gw -> svc -> (response) ; svc -> kafka -> sink */
async function request(target, { sink } = {}) {
  await travel('you', 'gw', 'sync');
  ping('gw');

  if (SINKS.includes(target)) {
    // Data stores are reached through the event bus
    const via = pick(SERVICES.filter(s => !down.has(s))) || 'identity';
    await travel('gw', via, 'sync'); ping(via);
    await travel(via, 'kafka', 'async'); ping('kafka');
    await travel('kafka', target, 'async'); ping(target);
    travel('gw', 'you', 'sync').then(bumpCount);
    return true;
  }
  if (target === 'kafka') {
    const via = pick(SERVICES.filter(s => !down.has(s))) || 'identity';
    await travel('gw', via, 'sync'); ping(via);
    await travel(via, 'kafka', 'async'); ping('kafka');
    travel('gw', 'you', 'sync').then(bumpCount);
    return true;
  }
  if (target === 'gw' || target === 'you') {
    travel('gw', 'you', 'sync').then(bumpCount);
    return true;
  }

  if (down.has(target)) {
    floatTag('gw', '503 · circuit open');
    await travel('gw', 'you', 'fail');
    bumpCount();
    return false;
  }
  await travel('gw', target, 'sync');
  ping(target);
  travel(target, 'gw', 'sync').then(() => travel('gw', 'you', 'sync')).then(bumpCount);
  await travel(target, 'kafka', 'async');
  ping('kafka');
  const s = sink || pick(SINKS);
  await travel('kafka', s, 'async');
  ping(s);
  return true;
}

/* Ambient traffic */
function startAmbient() {
  if (REDUCED) return;
  setInterval(() => {
    if (document.hidden || packets.length > 16) return;
    request(pick(SERVICES));
  }, 1100);
}

/* ==============================================
   Inspector
   ============================================== */
const kv = obj => `<dl class="kv">${Object.entries(obj).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;
const tags = (arr, hotSet) => `<div class="tags">${arr.map(t => `<span class="tag${hotSet && hotSet.has(t) ? ' hot' : ''}">${esc(t)}</span>`).join('')}</div>`;
const list = arr => `<ul>${arr.map(b => `<li>${esc(b)}</li>`).join('')}</ul>`;
const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${esc(text)}</a>`;

const TRACE_ID = hex(32);

const INSPECT = {
  you: () => ({
    kind: 'client · that’s you',
    title: 'Hello, visitor',
    route: '',
    html: `
      <p>You’re the client. This page renders my career as a running system — every click is a request
      that travels through the gateway, hits a service, and emits an event onto Kafka.</p>
      ${kv({
        'trace-id': `<code>${TRACE_ID.slice(0, 16)}…</code>`,
        'timezone': esc(Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown'),
        'viewport': `${window.innerWidth}×${window.innerHeight}`,
        'requests': `<span id="you-req">${reqCount}</span> this session`
      })}
      <h4>Things to try</h4>
      <ul>
        <li>Click <b>career-svc</b> for my experience, <b>projects-svc</b> for side projects.</li>
        <li>Press <b>POST /hire</b> — it runs a real-looking Saga with idempotency.</li>
        <li>Turn on <b>chaos monkey</b>, then hire me again. Watch the compensation.</li>
        <li>Open the <b>console</b> tab and <code>curl /health</code>.</li>
      </ul>`
  }),

  gw: () => ({
    kind: 'gateway · kong',
    title: 'kong-gw',
    route: '<span class="verb">ANY</span> /*',
    html: `
      <p>Entry point for every request on this page. Same gateway I run in front of Notification Hub.</p>
      <table class="sql">
        <tr><th>route</th><th>upstream</th></tr>
        <tr><td>GET /about</td><td>identity-svc</td></tr>
        <tr><td>GET /experience</td><td>career-svc</td></tr>
        <tr><td>GET /projects</td><td>projects-svc</td></tr>
        <tr><td>GET /skills</td><td>skills-svc</td></tr>
        <tr><td>GET /education</td><td>oracle</td></tr>
        <tr><td>GET /contact</td><td>notify-worker</td></tr>
        <tr><td>POST /hire</td><td>saga-orchestrator</td></tr>
      </table>
      <h4>Plugins</h4>
      ${tags(['correlation-id', 'rate-limiting', 'oauth2 (client-credentials)', 'circuit-breaker'])}
      <p class="sub">Circuit state per upstream is visible in <code>GET /health</code>.</p>`
  }),

  identity: () => ({
    kind: 'service · identity-svc',
    title: 'About',
    route: '<span class="verb">GET</span> /about',
    html: `
      <p>${esc(PROFILE.summary)}</p>
      <p>Designs and ships distributed systems end-to-end, including a personal multi-tenant notification platform.
      Comfortable with clean architecture, RESTful API design, CI/CD and containerized deployment — and committed to continuous learning.</p>
      ${kv({
        name: esc(PROFILE.name),
        role: esc(PROFILE.role),
        at: 'Sacombank · core banking',
        based: esc(PROFILE.location),
        education: `FPT University · Software Engineering · GPA ${esc(PROFILE.education.gpa)}`
      })}
      <h4>Soft skills</h4>
      ${tags(PROFILE.skills['Soft skills'])}`
  }),

  career: () => ({
    kind: 'service · career-svc',
    title: 'Experience',
    route: '<span class="verb">GET</span> /experience',
    html: PROFILE.experience.map(x => `
      <div class="entry${x.now ? ' now' : ''}">
        <h4>${esc(x.title)} @ ${esc(x.company)} — ${esc(x.product)}</h4>
        <div class="sub">${esc(x.subtitle)} · ${esc(x.period)}</div>
        ${list(x.bullets)}
        ${tags(x.tech)}
      </div>`).join('')
  }),

  projects: () => ({
    kind: 'service · projects-svc',
    title: 'Projects',
    route: '<span class="verb">GET</span> /projects',
    html: PROFILE.projects.map(p => `
      <div class="entry${p.id === 'nhub' ? ' now' : ''}">
        <h4>${esc(p.name)}</h4>
        <div class="sub">${esc(p.kind)} · ${esc(p.period)}</div>
        ${list(p.bullets)}
        ${tags(p.tech)}
      </div>`).join('')
  }),

  skills: () => ({
    kind: 'service · skills-svc',
    title: 'Skills',
    route: '<span class="verb">GET</span> /skills',
    html: Object.entries(PROFILE.skills).map(([k, v]) => `<h4>${esc(k)}</h4>${tags(v, PROFILE.hot)}`).join('') +
      `<p class="sub">highlighted = used in production right now</p>`
  }),

  kafka: () => ({
    kind: 'topic · kafka',
    title: 'career.events',
    route: '',
    html: `
      <p>Every milestone is an event on this topic. Append-only, ordered, replayable — like a good ledger
      (and like the Outbox relays I build at work).</p>
      ${kv({ partitions: '1', retention: 'forever', 'consumer-group': 'visitors', producers: 'career-svc, projects-svc, skills-svc, you' })}
      <p><button class="btn" data-tab-open="events">tail the topic →</button></p>`
  }),

  redis: () => ({
    kind: 'cache · redis',
    title: 'Hot keys',
    route: '<span class="verb">GET</span> /cache',
    html: `
      <p class="q">redis-cli --scan --pattern 'profile:*'</p>
      <table class="sql">
        <tr><th>key</th><th>value</th></tr>
        <tr><td>profile:stack</td><td>java | spring-boot | dotnet | csharp</td></tr>
        <tr><td>profile:gpa</td><td>${esc(PROFILE.education.gpa)}</td></tr>
        <tr><td>profile:partners</td><td>SHB, LienVietPostBank, PVI, NganLuong, Vimo, GSM</td></tr>
        <tr><td>profile:platforms</td><td>CoreCD/CoreSL, MCS Bill</td></tr>
        <tr><td>idempotency:hire:*</td><td>TTL 86400</td></tr>
        <tr><td>lock:coffee-machine</td><td>held by lqviet · TTL 30s</td></tr>
      </table>
      <p class="sub">Fail-open: when a service is down, you still get stale-but-true facts from here.</p>`
  }),

  oracle: () => ({
    kind: 'records · oracle',
    title: 'Education',
    route: '<span class="verb">GET</span> /education',
    html: `
      <p class="q">SELECT * FROM education;</p>
      <table class="sql">
        <tr><th>school</th><th>degree</th><th>gpa</th><th>grad</th></tr>
        <tr><td>${esc(PROFILE.education.school)}</td><td>${esc(PROFILE.education.degree)}</td><td>${esc(PROFILE.education.gpa)}</td><td>${esc(PROFILE.education.graduated)}</td></tr>
      </table>
      <p class="q">SELECT name, issuer FROM certifications;</p>
      <table class="sql">
        <tr><th>name</th><th>issuer</th></tr>
        ${PROFILE.certs.map(c => `<tr><td>${link(c.url, c.name)}</td><td>${esc(c.by)}</td></tr>`).join('')}
      </table>
      <p class="sub">3 rows selected. COMMIT complete.</p>`
  }),

  notify: () => ({
    kind: 'worker · notify-worker',
    title: 'Contact',
    route: '<span class="verb">GET</span> /contact',
    html: `
      <p>Pick a channel — the worker delivers exactly once (well, I reply at least once).</p>
      <a class="contact-row" href="mailto:${PROFILE.email}"><span><span class="ch">email</span><br>${esc(PROFILE.email)}</span><span class="arrow">→</span></a>
      <a class="contact-row" href="tel:+84353081770"><span><span class="ch">phone</span><br>${esc(PROFILE.phone)}</span><span class="arrow">→</span></a>
      <a class="contact-row" href="${PROFILE.github}" target="_blank" rel="noopener"><span><span class="ch">github</span><br>github.com/lqviet45</span><span class="arrow">↗</span></a>
      <a class="contact-row" href="${PROFILE.linkedin}" target="_blank" rel="noopener"><span><span class="ch">linkedin</span><br>in/le-quoc-viet-a03721240</span><span class="arrow">↗</span></a>
      <p class="sub">📍 ${esc(PROFILE.location)}</p>`
  })
};

function select(id, { silent = false } = {}) {
  selected = id;
  Object.entries(nodeEls).forEach(([k, g]) => g.classList.toggle('sel', k === id));
  const d = INSPECT[id]();
  $('#insp-kind').textContent = d.kind;
  $('#insp-title').textContent = d.title;
  $('#insp-route').innerHTML = d.route;
  $('#insp-body').innerHTML = d.html;
  $('#insp-body').scrollTop = 0;
  if (silent) return;

  request(id);
  emit(`http.request`, `GET ${NODES[id].route || '/' + NODES[id].label} ← visitor`, 'user');
  if (window.innerWidth <= 1000) $('#inspector').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
}

/* ==============================================
   Kafka event stream
   ============================================== */
const EVENTS = [
  ['job.started', '{company:"Amazing Tech", role:"Back-end Developer", at:"2023-12"}'],
  ['module.shipped', '{system:"tax-invoicing", tech:["ASP.NET Core","SQL Server"]}'],
  ['query.optimized', '{via:"stored procedures", effect:"latency ↓"}'],
  ['report.exported', '{format:"xlsx", system:"water-factory"}'],
  ['job.ended', '{company:"Amazing Tech", at:"2024-05"}'],
  ['project.started', '{name:"FEDOM-AI", arch:"CQRS + MediatR"}'],
  ['feature.shipped', '{name:"RAG chatbot", via:"Spring AI"}'],
  ['pipeline.async', '{from:"request thread", to:"RabbitMQ + Quartz"}'],
  ['degree.granted', '{school:"FPT University", gpa:"7.92/10", at:"2025-05"}'],
  ['project.started', '{name:"Notification Hub", runtime:".NET 8", tenants:"multi"}'],
  ['auth.hardened', '{flow:"client-credentials", alg:"RS256", jwks:true}'],
  ['key.rotated', '{downtime:"0s", strategy:"dual-key overlap window"}'],
  ['trace.propagated', '{w3c:"traceparent", across:["HTTP","Kafka"]}'],
  ['resilience.enabled', '{polly:["circuit-breaker","retry","bulkhead"], cache:"redis fail-open"}'],
  ['job.started', '{company:"Sacombank", role:"Backend Developer", at:"2026-01"}'],
  ['saga.committed', '{flow:"CD purchase", idempotency:"redis", semantics:"exactly-once"}'],
  ['outbox.relayed', '{service:"lot-management", topic:"lot.events"}'],
  ['dag.succeeded', '{airflow:"cd-lot-reconciliation", sink:"ODS"}'],
  ['facade.online', '{protocol:"gRPC", transport:"IBM MQ request/reply"}'],
  ['partner.integrated', '{bank:"SHB", auth:"OAuth2", signing:"RSA-SHA256"}'],
  ['partner.integrated', '{bank:"LienVietPostBank"}'],
  ['partner.integrated', '{gateway:"PVI"}'],
  ['partner.integrated', '{gateway:"NganLuong"}'],
  ['partner.integrated', '{gateway:"Vimo"}'],
  ['partner.integrated', '{gateway:"GSM"}'],
  ['fallback.routed', '{to:"legacy system", reason:"account outside new platform"}'],
  ['skill.acquired', '{name:"always learning", ttl:null}']
];
let evIdx = 0, offset = 0, evPaused = false;

function emit(key, val, cls = '') {
  const li = document.createElement('li');
  if (cls) li.className = cls;
  const ts = new Date().toTimeString().slice(0, 8);
  li.innerHTML = `<span class="ev-off">#${offset}</span><span class="ev-ts">${ts}</span><span class="ev-key">${esc(key)}</span><span class="ev-val">${esc(val)}</span>`;
  const ol = $('#events');
  ol.prepend(li);
  while (ol.children.length > 80) ol.lastElementChild.remove();
  offset++;
  $('#offset').textContent = offset;
}

function startEvents() {
  const next = () => {
    if (!evPaused && !document.hidden) {
      const [k, v] = EVENTS[evIdx % EVENTS.length];
      emit(k, v);
      evIdx++;
    }
  };
  for (let i = 0; i < 6; i++) next();
  setInterval(next, 2400);
  $('#events-toggle').addEventListener('click', e => {
    evPaused = !evPaused;
    e.target.textContent = evPaused ? 'resume' : 'pause';
  });
}

/* ==============================================
   Trace waterfall
   ============================================== */
const ym = s => { const [y, m] = s.split('-').map(Number); return y * 12 + (m - 1); };
const NOW = new Date();
const NOW_M = NOW.getFullYear() * 12 + NOW.getMonth() + NOW.getDate() / 31;

function fmtDur(months) {
  const m = Math.floor(months);
  const y = Math.floor(m / 12), r = m % 12;
  return y ? `${y}y ${r}mo` : `${r}mo`;
}

const SPANS = [
  { name: 'career', svc: 'lqviet', start: '2023-12', depth: 0, cls: '',
    attrs: { 'span.kind': 'server', 'status': 'OK', 'languages': 'java, c#', 'location': 'vn-south' },
    notes: ['Root span — everything below is a child of this.'] },
  { name: 'backend.developer', svc: 'amazing-tech', start: '2023-12', end: '2024-05', depth: 1, cls: 'work',
    attrs: { 'period': '12/2023 – 05/2024', 'stack': 'ASP.NET Core · SQL Server · Dapper' }, notes: PROFILE.experience[2].bullets },
  { name: 'capstone', svc: 'fedom-ai', start: '2025-01', end: '2025-05', label: '2025', depth: 1, cls: 'side',
    attrs: { 'role': 'back-end developer', 'arch': 'CQRS + MediatR' }, notes: PROFILE.projects[1].bullets },
  { mark: '2025-05', name: 'degree.granted', svc: 'fpt-university', depth: 1,
    attrs: { 'degree': 'B.IT — Software Engineering', 'gpa': PROFILE.education.gpa }, notes: [] },
  { name: 'personal', svc: 'notification-hub', start: '2025-01', label: '2025 – now', depth: 1, cls: 'side',
    attrs: { 'runtime': '.NET 8', 'tenancy': 'multi', 'team size': '1 (me)' }, notes: PROFILE.projects[0].bullets },
  { name: 'backend.developer', svc: 'sacombank', start: '2026-01', depth: 1, cls: 'work',
    attrs: { 'period': '01/2026 – Present', 'domain': 'core banking' }, notes: ['Two platforms in parallel — see child spans.'] },
  { name: 'cd-trading', svc: 'coreCD/coreSL', start: '2026-01', depth: 2, cls: 'work',
    attrs: { 'patterns': 'saga · outbox · idempotency', 'integrations': 'T24, PaymentHub, ODS' }, notes: PROFILE.experience[0].bullets },
  { name: 'va-integration', svc: 'mcs-bill', start: '2026-01', depth: 2, cls: 'work',
    attrs: { 'transport': 'gRPC + IBM MQ', 'partners': '6' }, notes: PROFILE.experience[1].bullets }
];

function renderTrace() {
  const t0 = ym('2023-10'), t1 = NOW_M + 1;
  const pct = m => ((m - t0) / (t1 - t0)) * 100;

  const ticks = [];
  for (let y = 2024; y * 12 <= t1; y++) ticks.push(`<span class="axis-tick" style="left:${pct(y * 12)}%">${y}</span>`);
  ticks.push(`<span class="axis-tick" style="left:${pct(NOW_M)}%;color:var(--signal)">now</span>`);

  let html = `<div class="trace-inner"><div class="trace-axis"><span>service · operation</span><div class="axis-track">${ticks.join('')}</div></div>`;
  SPANS.forEach((s, i) => {
    let bar;
    if (s.mark) {
      bar = `<span class="span-mark" style="left:${pct(ym(s.mark))}%"><span>🎓 graduated ${s.mark.replace('-', '/')}</span></span>`;
    } else {
      const a = ym(s.start), live = !s.end, b = live ? NOW_M : ym(s.end) + 1;
      const left = pct(a), width = pct(b) - left;
      const dur = s.label || `${fmtDur(b - a)}${live ? ' · live' : ''}`;
      // label after the bar if there's room, else before it, else inside it
      let durPos = `left:calc(${left + width}% + 10px)`, durCls = '';
      if (left + width > 78) durPos = left > 22 ? `right:${100 - left + 1}%` : (durCls = ' inside', `right:${100 - left - width + 1.5}%`);
      bar = `<span class="span-bar ${s.cls}${live ? ' live' : ''}" style="left:${left}%;width:${width}%;animation-delay:${i * 90}ms"></span>
             <span class="span-dur${durCls}" style="${durPos}">${esc(dur)}</span>`;
    }
    html += `
      <div class="span-row" style="--depth:${s.depth}" tabindex="0" role="button" aria-expanded="false">
        <div class="span-name"><span class="tw">▸</span><span class="svc">${esc(s.svc)}</span> ${esc(s.name)}</div>
        <div class="span-track">${bar}</div>
      </div>
      <div class="span-attrs" style="--depth:${s.depth}">
        ${kv(Object.fromEntries(Object.entries(s.attrs).map(([k, v]) => [k, esc(v)])))}
        ${s.notes.length ? list(s.notes) : ''}
      </div>`;
  });
  html += '</div>';

  const trace = $('#trace');
  trace.innerHTML = html;
  $('#trace-id').textContent = TRACE_ID.slice(0, 16);
  $('#span-count').textContent = SPANS.length;

  $$('.span-row', trace).forEach(row => {
    const toggle = () => {
      const open = row.classList.toggle('open');
      row.setAttribute('aria-expanded', open);
    };
    row.addEventListener('click', toggle);
    row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
}

/* ==============================================
   Tabs
   ============================================== */
function openTab(name) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  $$('.panel').forEach(p => p.classList.toggle('active', p.id === `panel-${name}`));
}

/* ==============================================
   Chaos monkey + circuit breakers
   ============================================== */
let chaosOn = false, chaosTimer = null;

function setDown(id, isDown) {
  if (isDown) down.add(id); else down.delete(id);
  nodeEls[id].classList.toggle('down', isDown);
  edgeEls[`gw>${id}`].el.classList.toggle('broken', isDown);
  updateClusterStatus();
}

function updateClusterStatus() {
  const led = $('#cluster-led');
  const txt = $('#cluster-status');
  if (down.size) {
    led.className = 'led warn';
    txt.textContent = `degraded · ${[...down].map(d => NODES[d].label).join(', ')} down`;
  } else if (chaosOn) {
    led.className = 'led warn';
    txt.textContent = 'chaos monkey loose';
  } else {
    led.className = 'led ok';
    txt.textContent = 'all systems nominal';
  }
}

function chaosStrike() {
  const alive = SERVICES.filter(s => !down.has(s));
  if (!alive.length) return;
  const victim = pick(alive);
  setDown(victim, true);
  floatTag(victim, '☠ killed');
  emit('chaos.kill', `{target:"${NODES[victim].label}"}`, 'err');
  emit('breaker.open', `{upstream:"${NODES[victim].label}", fallback:"redis (fail-open)"}`, 'err');
  setTimeout(() => {
    emit('breaker.half_open', `{upstream:"${NODES[victim].label}", probe:1}`);
    setTimeout(() => {
      setDown(victim, false);
      floatTag(victim, 'recovered', true);
      emit('breaker.closed', `{upstream:"${NODES[victim].label}"}`);
    }, 1200);
  }, 3400);
}

function toggleChaos(force) {
  chaosOn = typeof force === 'boolean' ? force : !chaosOn;
  $('#chaos-btn').classList.toggle('on', chaosOn);
  $('#chaos-state').textContent = chaosOn ? 'ON' : 'off';
  clearInterval(chaosTimer);
  if (chaosOn) {
    emit('chaos.enabled', '{by:"visitor", blast_radius:"services"}', 'user');
    chaosStrike();
    chaosTimer = setInterval(chaosStrike, 5200);
  } else {
    SERVICES.forEach(s => down.has(s) && setDown(s, false));
    emit('chaos.disabled', '{by:"visitor"}', 'user');
  }
  updateClusterStatus();
}

/* ==============================================
   Hire Saga
   ============================================== */
let sagaRunning = false;
let committedKey = null;

const SAGA_STEPS = [
  { name: 'idempotency.acquire', svc: 'redis', note: 'SET hire:{key} NX EX 86400', comp: 'idempotency.release',
    anim: async () => { await travel('you', 'gw', 'sync'); ping('gw'); ping('redis'); } },
  { name: 'role.match', svc: 'skills-svc', note: 'java/spring ∪ .net/c# ∪ distributed systems → 100%', comp: 'role.match (no-op)',
    anim: async () => { await travel('gw', 'skills', 'sync'); ping('skills'); } },
  { name: 'candidate.reserve', svc: 'career-svc', note: 'reserving 1× backend developer', comp: 'candidate.release',
    anim: async () => { await travel('gw', 'career', 'sync'); ping('career'); } },
  { name: 'offer.notify', svc: 'notify-worker', note: 'outbox → kafka → email channel', comp: null,
    anim: async () => { await travel('career', 'kafka', 'async'); ping('kafka'); await travel('kafka', 'notify', 'async'); ping('notify'); } }
];

function sagaRow(i, state, extra = '') {
  const icons = { pending: '○', run: '◐', done: '✓', fail: '✗', comp: '↺' };
  const s = SAGA_STEPS[i];
  const li = $(`#saga-steps li[data-i="${i}"]`);
  li.className = state === 'pending' ? '' : state;
  const label = state === 'comp' ? s.comp : s.name;
  li.innerHTML = `<span class="ic">${icons[state]}</span><span>${esc(label)}<span class="note">${esc(extra || s.note)}</span></span><span class="svc">${esc(s.svc)}</span>`;
}

function openSaga() {
  $('#saga').hidden = false;
  $('#saga-close').focus();
}
function closeSaga() {
  $('#saga').hidden = true;
  $('#hire-btn').focus();
}

async function runSaga({ newKey = false } = {}) {
  openSaga();
  if (sagaRunning) return;

  if (committedKey && !newKey) {
    $('#saga-key').textContent = `Idempotency-Key: ${committedKey}`;
    $('#saga-steps').innerHTML = '';
    $('#saga-result').innerHTML = `
      <div class="big warn">409 — already committed</div>
      <p>Redis <code>SET NX</code> returned 0: this hire was already processed in this session.
      Exactly-once, as promised. (That’s literally what I build at work.)</p>
      <div class="actions">
        <a class="btn primary" href="mailto:${PROFILE.email}?subject=${encodeURIComponent('Let’s talk — from your portfolio')}">email me</a>
        <button class="btn" id="saga-newkey">retry with a new key</button>
      </div>`;
    $('#saga-newkey').addEventListener('click', () => runSaga({ newKey: true }));
    emit('saga.duplicate', `{key:"${committedKey}", result:409}`, 'user');
    return;
  }

  sagaRunning = true;
  const key = `hire-${hex(8)}-${hex(4)}`;
  $('#saga-key').textContent = `Idempotency-Key: ${key}`;
  $('#saga-result').innerHTML = '';
  $('#saga-steps').innerHTML = SAGA_STEPS.map((_, i) => `<li data-i="${i}"></li>`).join('');
  SAGA_STEPS.forEach((_, i) => sagaRow(i, 'pending'));
  emit('saga.started', `{saga:"HireLeQuocViet", key:"${key}"}`, 'user');

  const failAt = chaosOn ? 2 : -1;
  let attempt = 1, compensated = false;

  for (let i = 0; i < SAGA_STEPS.length; i++) {
    sagaRow(i, 'run');
    await Promise.all([SAGA_STEPS[i].anim(), sleep(REDUCED ? 150 : 650)]);

    if (i === failAt && attempt === 1) {
      sagaRow(i, 'fail', 'career-svc down — chaos monkey strikes');
      floatTag('career', '✗ step failed');
      emit('saga.step_failed', `{step:"${SAGA_STEPS[i].name}", attempt:1}`, 'err');
      await sleep(REDUCED ? 100 : 600);
      for (let j = i - 1; j >= 0; j--) {
        sagaRow(j, 'comp', 'compensating…');
        await sleep(REDUCED ? 100 : 480);
        emit('saga.compensated', `{step:"${SAGA_STEPS[j].name}"}`);
      }
      sagaRow(i, 'pending', 'retry · exponential backoff 400ms → 800ms');
      emit('saga.retry', '{attempt:2, backoff_ms:800}');
      await sleep(REDUCED ? 100 : 900);
      if (down.has('career')) setDown('career', false);
      attempt = 2; compensated = true;
      i = -1;
      continue;
    }
    sagaRow(i, 'done');
  }

  committedKey = key;
  sagaRunning = false;
  floatTag('notify', '201 created', true);
  emit('saga.committed', `{key:"${key}", attempts:${attempt}}`, 'user');
  $('#saga-result').innerHTML = `
    <div class="big ok">201 Created — hire committed${compensated ? ' (after compensation)' : ''}.</div>
    <p>${compensated
      ? 'A step failed, the saga rolled back what it had done, retried with backoff, and committed exactly once. '
      : 'All four steps committed. '}The last step is the human one — my inbox:</p>
    <div class="actions">
      <a class="btn primary" href="mailto:${PROFILE.email}?subject=${encodeURIComponent('Let’s talk — from your portfolio')}">email me</a>
      <button class="btn" id="saga-copy">copy email</button>
      <a class="btn ghost" href="${PROFILE.linkedin}" target="_blank" rel="noopener">linkedin ↗</a>
    </div>`;
  $('#saga-copy').addEventListener('click', copyEmail);
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(PROFILE.email);
    toast('copied lqviet455@gmail.com');
  } catch {
    toast(PROFILE.email);
  }
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
}

/* ==============================================
   Console (curl lqv.sys)
   ============================================== */
function health() {
  const svc = {};
  Object.entries(NODES).forEach(([id, n]) => {
    if (id === 'you') return;
    svc[n.label] = down.has(id) ? 'DOWN' : 'UP';
  });
  const breakers = {};
  SERVICES.forEach(s => { breakers[NODES[s].label] = down.has(s) ? 'OPEN' : 'CLOSED'; });
  return { status: down.size ? 'DEGRADED' : 'UP', components: svc, circuitBreakers: breakers, chaosMonkey: chaosOn };
}

const API = {
  'GET /': () => [200, { service: 'lqv.sys', owner: PROFILE.name, routes: ['/about', '/experience', '/projects', '/skills', '/education', '/contact', '/health', 'POST /hire', 'POST /chaos'] }, 'gw'],
  'GET /about': () => [200, { name: PROFILE.name, role: PROFILE.role, company: PROFILE.company, location: PROFILE.location, summary: PROFILE.summary }, 'identity'],
  'GET /experience': () => [200, PROFILE.experience.map(x => ({ company: x.company, product: x.product, title: x.title, period: x.period, tech: x.tech })), 'career'],
  'GET /projects': () => [200, PROFILE.projects.map(p => ({ name: p.name, kind: p.kind, period: p.period, tech: p.tech })), 'projects'],
  'GET /skills': () => [200, Object.fromEntries(Object.entries(PROFILE.skills)), 'skills'],
  'GET /education': () => [200, { ...PROFILE.education, certifications: PROFILE.certs.map(c => `${c.name} (${c.by})`) }, 'oracle'],
  'GET /contact': () => [200, { email: PROFILE.email, phone: PROFILE.phone, github: PROFILE.github, linkedin: PROFILE.linkedin }, 'notify'],
  'GET /cache': () => [200, { 'profile:stack': 'java|spring-boot|dotnet|csharp', 'profile:gpa': PROFILE.education.gpa, 'lock:coffee-machine': 'held by lqviet (TTL 30s)' }, 'redis'],
  'GET /health': () => [down.size ? 503 : 200, health(), 'gw'],
  'GET /hire': () => [405, { error: 'Method Not Allowed', hint: 'try: POST /hire' }, 'gw'],
  'POST /hire': () => { setTimeout(() => runSaga(), 300); return [202, { accepted: true, saga: 'HireLeQuocViet', note: 'opening orchestrator…' }, 'gw']; },
  'POST /chaos': () => { toggleChaos(); return [200, { chaosMonkey: chaosOn }, 'gw']; },
  'DELETE /chaos': () => { toggleChaos(false); return [200, { chaosMonkey: false }, 'gw']; },
  'GET /coffee': () => [418, { error: "I'm a teapot", note: 'but I do run on coffee' }, 'gw']
};

const ROUTE_TO_NODE = { '/about': 'identity', '/experience': 'career', '/projects': 'projects', '/skills': 'skills' };

function highlightJSON(obj) {
  return esc(JSON.stringify(obj, null, 2))
    .replace(/(&quot;(?:[^&]|&(?!quot;))*?&quot;)(\s*:)/g, '<span class="j-k">$1</span>$2')
    .replace(/:\s(&quot;.*?&quot;)/g, ': <span class="j-s">$1</span>')
    .replace(/^(\s*)(&quot;.*?&quot;)(,?)$/gm, '$1<span class="j-s">$2</span>$3')
    .replace(/:\s(-?\d+\.?\d*)/g, ': <span class="j-n">$1</span>')
    .replace(/:\s(true|false|null)/g, ': <span class="j-b">$1</span>');
}

function parseCmd(raw) {
  let s = raw.trim()
    .replace(/^curl\s+/i, '')
    .replace(/https?:\/\//i, '')
    .replace(/lqv\.sys/i, '')
    .trim();
  let method = 'GET';
  const m = s.match(/^(?:-X\s*)?(GET|POST|PUT|DELETE|PATCH)\s+/i);
  if (m) { method = m[1].toUpperCase(); s = s.slice(m[0].length).trim(); }
  let path = s.split(/[?\s#]/)[0] || '/';
  if (!path.startsWith('/')) path = '/' + path;
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return { method, path: path.toLowerCase() };
}

async function runConsole(raw) {
  if (!raw.trim()) return;
  const out = $('#console-out');
  const { method, path } = parseCmd(raw);
  const t0 = performance.now();

  if (method === 'GET' && path === '/clear') { out.innerHTML = ''; return; }

  const handler = API[`${method} ${path}`];
  let status, body, node;
  if (handler) {
    [status, body, node] = handler();
    const svcId = ROUTE_TO_NODE[path];
    if (svcId && down.has(svcId)) {
      status = 503;
      body = { error: 'Service Unavailable', circuit: 'OPEN', fallback: 'served stale from redis', hint: 'chaos monkey got it — try again in a few seconds' };
      node = 'redis';
    }
  } else {
    const known = Object.keys(API).map(k => k.split(' ')[1]);
    const guess = known.find(k => k.includes(path.slice(1, 4)) && path.length > 1);
    status = 404;
    body = { error: 'Not Found', path, ...(guess ? { 'did you mean': guess } : {}), hint: 'GET / lists all routes' };
    node = 'gw';
  }

  const target = ROUTE_TO_NODE[path] || node;
  const flight = request(target);
  await Promise.race([flight, sleep(900)]);
  const ms = Math.round(performance.now() - t0);
  const ok = status < 400;

  const block = document.createElement('div');
  block.innerHTML = `
    <div class="req">$ curl -X ${method} lqv.sys${esc(path)}</div>
    <div class="status ${ok ? 'ok' : 'bad'}">HTTP/1.1 <b>${status}</b> · ${ms}ms · x-trace-id: ${TRACE_ID.slice(0, 8)}</div>
    <pre>${highlightJSON(body)}</pre>`;
  out.appendChild(block);
  out.scrollTop = out.scrollHeight;
  emit('http.request', `${method} ${path} → ${status}`, ok ? 'user' : 'user err');
}

function setupConsole() {
  const out = $('#console-out');
  out.innerHTML = `<div class="status">lqv.sys api · type a path (e.g. <b>/experience</b>) or a full <b>curl -X POST /hire</b>. <b>/clear</b> clears.</div>`;
  const form = $('#console-form');
  const input = $('#console-input');
  const history = [];
  let hIdx = -1;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = input.value;
    if (v.trim()) history.unshift(v);
    hIdx = -1;
    input.value = '';
    runConsole(v);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && history.length) { hIdx = Math.min(hIdx + 1, history.length - 1); input.value = history[hIdx]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hIdx = Math.max(hIdx - 1, -1); input.value = hIdx < 0 ? '' : history[hIdx]; e.preventDefault(); }
  });

  const chips = ['/', '/experience', '/projects', '/skills', '/health', 'POST /hire', 'POST /chaos', '/coffee'];
  $('#console-chips').innerHTML = chips.map(c => `<button type="button" data-cmd="${esc(c)}">${esc(c)}</button>`).join('');
  $('#console-chips').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) runConsole(b.dataset.cmd);
  });
}

/* ==============================================
   Clock / uptime / theme
   ============================================== */
const START = new Date(2023, 11, 1);

function tickClock() {
  const now = new Date();
  $('#clock').textContent = now.toTimeString().slice(0, 8);

  let y = now.getFullYear() - START.getFullYear();
  let m = now.getMonth() - START.getMonth();
  let d = now.getDate() - START.getDate();
  if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  const hms = now.toTimeString().slice(0, 8);
  $('#uptime').textContent = `${y}y ${m}mo ${d}d ${hms}`;

  const you = $('#you-req');
  if (you) you.textContent = reqCount;
}

function setupTheme() {
  const root = document.documentElement;
  let theme = null;
  try { theme = localStorage.getItem('lqv-sys-theme'); } catch { /* storage unavailable */ }
  if (!theme) theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.dataset.theme = theme;
  $('#theme-btn').addEventListener('click', () => {
    theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
    try { localStorage.setItem('lqv-sys-theme', theme); } catch { /* ignore */ }
  });
}

/* ==============================================
   Boot
   ============================================== */
function boot() {
  setupTheme();
  drawTopology();
  renderTrace();
  setupConsole();
  startEvents();
  select('identity', { silent: true });

  $('#year').textContent = NOW.getFullYear();
  $('#manifest-ver').textContent = `v${NOW.getFullYear()}.${String(NOW.getMonth() + 1).padStart(2, '0')}`;
  tickClock();
  setInterval(tickClock, 1000);

  $('#hire-btn').addEventListener('click', () => runSaga());
  $('#chaos-btn').addEventListener('click', () => toggleChaos());
  $('#saga-close').addEventListener('click', closeSaga);
  $('#saga').addEventListener('click', e => { if (e.target.id === 'saga') closeSaga(); });
  $('#insp-close').addEventListener('click', () => $('.topo-card').scrollIntoView({ behavior: 'smooth' }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#saga').hidden) closeSaga(); });

  $$('.tab').forEach(t => t.addEventListener('click', () => openTab(t.dataset.tab)));
  document.addEventListener('click', e => {
    const n = e.target.closest('[data-node]');
    if (n && !n.closest('#topo')) select(n.dataset.node);
    const tab = e.target.closest('[data-tab-open]');
    if (tab) { openTab(tab.dataset.tabOpen); $('.lower').scrollIntoView({ behavior: 'smooth' }); }
  });

  // First request: the page load itself
  setTimeout(() => request('identity', { sink: 'oracle' }), 600);
  startAmbient();
}

boot();

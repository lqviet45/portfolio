/* ==============================================
   LQV/SYS — a portfolio you can send requests through
   Vanilla JS, no framework · EN / VI
   ============================================== */

'use strict';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const SVGNS = 'http://www.w3.org/2000/svg';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const hex = n => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
/* Event bus: the three.js hero (scene3d.js) mirrors everything that happens here */
const bus = (type, detail = {}) => window.dispatchEvent(new CustomEvent(`lqv:${type}`, { detail }));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ==============================================
   i18n
   ============================================== */
const LANGS = ['en', 'vi'];
let LANG = detectLang();

function detectLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(q)) return q;
  try {
    const saved = localStorage.getItem('lqv-sys-lang');
    if (LANGS.includes(saved)) return saved;
  } catch { /* storage unavailable */ }
  return (navigator.language || '').toLowerCase().startsWith('vi') ? 'vi' : 'en';
}

/* L('english', 'tiếng việt') — inline pair */
const L = (en, vi) => (LANG === 'vi' ? vi : en);
/* tr({en, vi}) — localized value, plain values pass through */
const tr = v => (v && typeof v === 'object' && !Array.isArray(v) && 'en' in v ? (v[LANG] ?? v.en) : v);

/* Static strings in index.html, keyed by data-i18n (innerHTML) */
const STATIC = {
  'name':          ['Le Quoc Viet', 'Lê Quốc Việt'],
  'region':        ['region', 'vùng'],
  'classic':       ['classic&nbsp;OS&nbsp;↗', 'bản&nbsp;OS&nbsp;cổ&nbsp;điển&nbsp;↗'],
  'eyebrow.a':     ['service manifest', 'service manifest'],
  'eyebrow.owner': ['owner', 'chủ sở hữu'],
  'lede': [
    'Backend developer. I build systems where money moves <em>exactly once</em> — core-banking microservices at <b>Sacombank</b>, in Java/Spring Boot and .NET/C#.',
    'Backend developer. Tôi xây những hệ thống mà tiền chỉ được chuyển <em>đúng một lần</em> — microservices core-banking tại <b>Sacombank</b>, bằng Java/Spring Boot và .NET/C#.'
  ],
  'hint': [
    'This page <em>is</em> the system. Click any node, fire a request, or break it on purpose.',
    'Trang này <em>chính là</em> hệ thống. Bấm vào node bất kỳ, gửi request, hoặc cố tình phá nó.'
  ],
  'contact':       ['contact →', 'liên hệ →'],
  'stat.uptime':   ['uptime (since 2023-12)', 'uptime (từ 12/2023)'],
  'stat.platforms':['core-banking platforms', 'nền tảng core-banking'],
  'stat.partners': ['partner banks integrated', 'ngân hàng đối tác đã tích hợp'],
  'stat.requests': ['requests this session', 'request trong phiên này'],
  'topology':      ['topology', 'sơ đồ'],
  'legend.sync':   ['sync', 'đồng bộ'],
  'legend.async':  ['async', 'bất đồng bộ'],
  'legend.fail':   ['failed', 'lỗi'],
  'topo.foot': [
    '↑ click a node to inspect it · packets are real clicks on this page, plus some ambient traffic',
    '↑ bấm vào một node để xem chi tiết · mỗi gói tin là một cú click thật trên trang, cộng thêm chút traffic nền'
  ],
  'tab.trace':     ['trace <span class="muted">· career waterfall</span>', 'trace <span class="muted">· dòng thời gian sự nghiệp</span>'],
  'tab.events':    ['kafka <span class="muted">· career.events</span>', 'kafka <span class="muted">· career.events</span>'],
  'tab.replay':    ['replay <span class="muted">· event sourcing</span>', 'replay <span class="muted">· event sourcing</span>'],
  'trace.replay':  ['⏪ replay the event log', '⏪ phát lại event log'],
  'tab.console':   ['console <span class="muted">· curl it</span>', 'console <span class="muted">· thử curl</span>'],
  'trace.hint':    ['click a span for attributes', 'bấm vào span để xem thuộc tính'],
  'send':          ['send', 'gửi'],
  'h3d.chip':      ['live 3D mirror of the topology', 'bản sao 3D trực tiếp của hệ thống'],
  'h3d.hint':      ['drag to orbit · click a node', 'kéo để xoay · bấm vào node'],
  'h3d.hint.touch':['tap a node to inspect', 'chạm vào node để xem'],
  'h3d.loading':   ['booting three.js…', 'đang khởi động three.js…'],
  'load.btn':      ['load test me', 'load test thử'],
  'recruiter': [
    'Recruiter? Read the <a href="#cv">10-second version</a> or <a href="../cv/Le-Quoc-Viet-CV.pdf" download>download my CV (PDF)</a>.',
    'Nhà tuyển dụng? Xem <a href="#cv">bản tóm tắt 10 giây</a> hoặc <a href="../cv/Le-Quoc-Viet-CV.pdf" download>tải CV (PDF)</a>.'
  ],
  'footer':        ['built with vanilla JS, no frameworks were harmed', 'viết bằng vanilla JS, không framework nào bị tổn hại']
};

const ARIA = {
  'theme':   ['Toggle theme', 'Đổi giao diện sáng/tối'],
  'lang':    ['Chuyển sang tiếng Việt', 'Switch to English'],
  'close':   ['Close', 'Đóng'],
  'topo':    ["Interactive system topology of Le Quoc Viet's career", 'Sơ đồ hệ thống tương tác về sự nghiệp của Lê Quốc Việt'],
  'api':     ['API path', 'Đường dẫn API'],
  'tldr':    ['TL;DR — recruiter version of this page', 'TL;DR — bản tóm tắt cho nhà tuyển dụng']
};

function applyStatic() {
  const i = LANG === 'vi' ? 1 : 0;
  document.documentElement.lang = LANG;
  document.title = `LQV/SYS — ${STATIC.name[i]}`;
  $$('[data-i18n]').forEach(el => {
    const pair = STATIC[el.dataset.i18n];
    if (pair) el.innerHTML = pair[i];
  });
  $$('[data-i18n-aria]').forEach(el => {
    const pair = ARIA[el.dataset.i18nAria];
    if (pair) { el.setAttribute('aria-label', pair[i]); el.title = pair[i]; }
  });
  $('#lang-btn').textContent = LANG === 'vi' ? 'EN' : 'VI';
  const hint = $('#h3d-hint');
  if (hint) hint.innerHTML = STATIC[matchMedia('(pointer: coarse)').matches ? 'h3d.hint.touch' : 'h3d.hint'][i];
  $('#chaos-state').textContent = chaosOn ? L('ON', 'BẬT') : L('off', 'tắt');
  $('#events-toggle').textContent = evPaused ? L('resume', 'tiếp tục') : L('pause', 'tạm dừng');
}

function setLang(lang) {
  LANG = lang;
  try { localStorage.setItem('lqv-sys-lang', lang); } catch { /* ignore */ }
  applyStatic();
  updateClusterStatus();
  if (selected) select(selected, { silent: true });
  renderTrace();
  setupConsoleIntro(true);
  tickClock();
  bus('lang', { lang });
  emit('i18n.changed', `{lang:"${lang}"}`, 'user');
}

/* ==============================================
   Profile data (source: CV)
   ============================================== */
const PROFILE = {
  name: { en: 'Le Quoc Viet', vi: 'Lê Quốc Việt' },
  role: 'Backend Developer — Java / Spring Boot · .NET / C#',
  company: 'Sacombank',
  location: { en: 'Bac Son, Trang Bom, Dong Nai, Vietnam', vi: 'Bắc Sơn, Trảng Bom, Đồng Nai, Việt Nam' },
  email: 'lqviet455@gmail.com',
  phone: '+84 353 081 770',
  github: 'https://github.com/lqviet45',
  linkedin: 'https://www.linkedin.com/in/le-quoc-viet-a03721240',
  summary: {
    en: 'Junior Backend Developer with ~2 years of hands-on experience across Java/Spring Boot and .NET/C#. ' +
      'Currently building core-banking microservices at Sacombank, across two platforms — CoreCD/CoreSL ' +
      '(certificate-of-deposit trading) and the MCS Bill System (virtual-account partner integration) — working with ' +
      'Saga orchestration, the Outbox pattern, idempotent APIs, Oracle, Redis, Kafka and IBM MQ.',
    vi: 'Junior Backend Developer với ~2 năm kinh nghiệm thực tế trên Java/Spring Boot và .NET/C#. ' +
      'Hiện đang xây dựng microservices core-banking tại Sacombank trên hai nền tảng — CoreCD/CoreSL ' +
      '(giao dịch chứng chỉ tiền gửi) và MCS Bill System (tích hợp tài khoản định danh với đối tác) — làm việc với ' +
      'Saga orchestration, Outbox pattern, API idempotent, Oracle, Redis, Kafka và IBM MQ.'
  },
  summary2: {
    en: 'Designs and ships distributed systems end-to-end, including a personal multi-tenant notification platform. ' +
      'Comfortable with clean architecture, RESTful API design, CI/CD and containerized deployment — and committed to continuous learning.',
    vi: 'Thiết kế và triển khai hệ thống phân tán end-to-end, bao gồm một nền tảng thông báo đa tenant do tôi tự làm. ' +
      'Quen với clean architecture, thiết kế RESTful API, CI/CD và triển khai bằng container — và luôn học hỏi không ngừng.'
  },
  education: {
    school: { en: 'FPT University, HCM City', vi: 'Đại học FPT, TP.HCM' },
    degree: { en: 'Bachelor of IT — Software Engineering', vi: 'Cử nhân CNTT — Kỹ thuật phần mềm' },
    gpa: '7.92/10 (3.16/4)',
    graduated: '05/2025'
  },
  certs: [
    { name: 'Software Development Lifecycle', by: 'Coursera', url: 'https://coursera.org/share/d6d4b9c8125ac11f4132a6012dbcef5f' },
    { name: 'Microsoft Back-End Developer', by: 'Coursera', url: 'https://coursera.org/share/e13540f572707149f36db01d7e93e34c' },
    { name: 'Foundational C# with Microsoft', by: 'freeCodeCamp', url: 'https://www.freecodecamp.org/certification/viet455/foundational-c-sharp-with-microsoft' }
  ],
  skills: [
    { group: { en: 'Languages', vi: 'Ngôn ngữ' }, items: ['Java', 'C#', 'JavaScript', 'SQL', 'HTML/CSS'] },
    { group: { en: 'Frameworks & Libraries', vi: 'Framework & thư viện' }, items: ['Spring Boot', 'Spring Cloud OpenFeign', 'ASP.NET Core', 'Dapper', 'ReactJS', 'Next.js'] },
    { group: { en: 'Databases', vi: 'Cơ sở dữ liệu' }, items: ['Oracle', 'PostgreSQL', 'SQL Server', 'Redis', 'MongoDB'] },
    { group: { en: 'Messaging & APIs', vi: 'Messaging & API' }, items: ['REST API', 'gRPC', 'IBM MQ/JMS', 'Apache Kafka', 'RabbitMQ'] },
    { group: { en: 'Tools & DevOps', vi: 'Công cụ & DevOps' }, items: ['Docker', 'Kubernetes', 'Helm', 'GitLab CI/CD', 'Apache Airflow', 'Kong', 'Git', 'Postman', 'Swagger'] },
    { group: { en: 'Patterns', vi: 'Pattern' }, items: ['Saga', 'Outbox', 'Idempotency', 'CQRS', 'Clean Architecture', 'Circuit Breaker'] }
  ],
  softSkills: [
    { en: 'Team coordination', vi: 'Phối hợp nhóm' },
    { en: 'Problem-solving', vi: 'Giải quyết vấn đề' },
    { en: 'Self-learning', vi: 'Tự học' }
  ],
  hot: new Set(['Java', 'C#', 'Spring Boot', 'ASP.NET Core', 'Oracle', 'Redis', 'Apache Kafka', 'IBM MQ/JMS', 'gRPC', 'Saga', 'Outbox', 'Idempotency']),
  experience: [
    {
      id: 'corecd', company: 'Sacombank', title: 'Backend Developer', product: 'CoreCD/CoreSL',
      subtitle: { en: 'Certificate-of-Deposit Trading Platform', vi: 'Nền tảng giao dịch chứng chỉ tiền gửi' },
      period: { en: '01/2026 – Present', vi: '01/2026 – Hiện tại' }, now: true,
      tech: ['Java', 'Spring Boot', 'Saga', 'Outbox', 'Oracle', 'Redis', 'IBM MQ', 'Airflow', 'T24', 'PaymentHub'],
      bullets: {
        en: [
          'Delivered production microservices covering the full CD lifecycle — registration, issuance, primary/secondary trading, settlement — integrated with T24 Core Banking and PaymentHub.',
          'Customer registration & lifecycle — corporate/retail buy-register with account and CIF validation, contract generation, and cancellation (auto sell-off of remaining holdings for retail).',
          'CD purchase flow end-to-end — dual-channel order intake (MQ + REST), buyer account verification, PaymentHub settlement and automatic rollback on failure — Saga orchestration with Redis-based idempotency for exactly-once processing.',
          'Early-redemption & sell flow — multi-criteria pre-maturity sale simulation (full / partial / by-amount), interest & fee calculation, auto-sell below threshold, settlement at maturity.',
          'Outbox-pattern event publishing in lot-management, CD-lot reconciliation/ODS sync with Apache Airflow DAGs, Redis-cached purchase/sale reporting.'
        ],
        vi: [
          'Xây dựng các microservice production bao trọn vòng đời chứng chỉ tiền gửi (CD) — đăng ký, phát hành, giao dịch sơ cấp/thứ cấp, tất toán — tích hợp với T24 Core Banking và PaymentHub.',
          'Luồng đăng ký & vòng đời khách hàng — đăng ký mua cho khách doanh nghiệp/cá nhân kèm kiểm tra tài khoản và CIF, sinh hợp đồng, huỷ đăng ký (tự động bán hết phần nắm giữ còn lại với khách cá nhân).',
          'Luồng mua CD end-to-end — nhận lệnh qua hai kênh (MQ + REST), xác minh tài khoản người mua, thanh toán qua PaymentHub và tự động rollback khi lỗi — dùng Saga orchestration cùng idempotency trên Redis để xử lý exactly-once.',
          'Luồng tất toán trước hạn & bán — mô phỏng bán trước hạn đa tiêu chí (toàn phần / một phần / theo số tiền), tính lãi & phí, tự động bán khi dưới ngưỡng, tất toán khi đáo hạn.',
          'Publish sự kiện theo Outbox pattern trong lot-management, đối soát lô CD/đồng bộ ODS bằng Apache Airflow DAG, báo cáo mua/bán có cache Redis.'
        ]
      }
    },
    {
      id: 'mcs', company: 'Sacombank', title: 'Backend Developer', product: 'MCS Bill System',
      subtitle: { en: 'Virtual-Account Partner Integration Platform', vi: 'Nền tảng tích hợp tài khoản định danh với đối tác' },
      period: { en: '01/2026 – Present', vi: '01/2026 – Hiện tại' }, now: true,
      tech: ['gRPC', 'IBM MQ', 'Adapter layer', 'OAuth2', 'RSA-SHA256'],
      bullets: {
        en: [
          'Virtual-account (VA) integration platform — inquiry, deposit-notify and outgoing-core flows unified behind a gRPC facade, with an IBM MQ request/reply layer dispatching to partner adapters and fallback routing to the legacy system.',
          'Integrated 6 partner banks / payment gateways (SHB, LienVietPostBank, PVI, NganLuong, Vimo, GSM) through a common adapter layer, incl. OAuth2 token exchange and RSA-SHA256 request signing for SHB.'
        ],
        vi: [
          'Nền tảng tích hợp tài khoản định danh (VA) — các luồng truy vấn, báo có (deposit-notify) và outgoing-core gom sau một gRPC facade, với lớp request/reply IBM MQ điều phối tới adapter của đối tác và định tuyến dự phòng về hệ thống cũ.',
          'Tích hợp 6 ngân hàng / cổng thanh toán đối tác (SHB, LienVietPostBank, PVI, NganLuong, Vimo, GSM) qua một lớp adapter chung, gồm trao đổi token OAuth2 và ký request RSA-SHA256 cho SHB.'
        ]
      }
    },
    {
      id: 'amazing', company: 'Amazing Tech', title: 'Back-end Developer',
      product: { en: 'Tax-invoicing & water-factory systems', vi: 'Hệ thống hoá đơn thuế & nhà máy nước' },
      subtitle: { en: 'Outsourcing · API modules', vi: 'Outsourcing · module API' }, period: '12/2023 – 05/2024', now: false,
      tech: ['ASP.NET Core', 'C#', 'SQL Server', 'Dapper', 'Stored Procedures'],
      bullets: {
        en: [
          'Shipped API modules powering a tax-invoicing system and a water-factory management system, integrating external systems and cutting query latency with SQL Stored Procedures.',
          'Built complex reporting modules with Excel export, partnering with the frontend team to define API contracts.'
        ],
        vi: [
          'Phát triển các module API cho hệ thống hoá đơn thuế và hệ thống quản lý nhà máy nước, tích hợp hệ thống bên ngoài và giảm độ trễ truy vấn bằng SQL Stored Procedure.',
          'Xây dựng các module báo cáo phức tạp có xuất Excel, phối hợp với team frontend để thống nhất API contract.'
        ]
      }
    }
  ],
  projects: [
    {
      id: 'nhub', name: 'Notification Hub',
      kind: { en: 'Multi-tenant notification platform · personal', vi: 'Nền tảng thông báo đa tenant · dự án cá nhân' },
      period: { en: '2025 – Present', vi: '2025 – nay' },
      tech: ['.NET 8', 'Kong', 'Kafka', 'gRPC', 'AMQP', 'OpenTelemetry', 'Polly', 'Redis', 'Blazor'],
      bullets: {
        en: [
          'Designed and shipped solo — Kong gateway, auth, ingestion (REST + gRPC + legacy AMQP), routing, templating, tracking, per-channel workers (email/SMS/push) and a Blazor admin console. Architecture through infra.',
          'OAuth2 client-credentials with RS256/JWKS, including zero-downtime signing-key rotation validated via a dual-key overlap window.',
          'Reliable delivery: outbox-relay → Kafka → channel workers, HMAC-signed callbacks, end-to-end tracing (OpenTelemetry, W3C trace-context across HTTP and Kafka), Polly circuit-breaker/retry/bulkhead with Redis fail-open caching.'
        ],
        vi: [
          'Tự thiết kế và triển khai một mình — Kong gateway, auth, ingestion (REST + gRPC + AMQP legacy), routing, templating, tracking, worker cho từng kênh (email/SMS/push) và trang quản trị Blazor. Từ kiến trúc đến hạ tầng.',
          'OAuth2 client-credentials với RS256/JWKS, gồm xoay khoá ký không downtime, kiểm chứng bằng cửa sổ chồng lấp hai khoá.',
          'Giao nhận tin cậy: outbox-relay → Kafka → channel worker, callback ký HMAC, tracing end-to-end (OpenTelemetry, W3C trace-context qua HTTP và Kafka), circuit-breaker/retry/bulkhead bằng Polly cùng cache Redis fail-open.'
        ]
      }
    },
    {
      id: 'fedom', name: 'FEDOM-AI',
      kind: { en: 'Exam & proctor management · capstone · back-end', vi: 'Quản lý thi & giám thị · đồ án tốt nghiệp · back-end' },
      period: '2025',
      tech: ['ASP.NET Core', 'CQRS', 'MediatR', 'Spring AI (RAG)', 'SignalR', 'RabbitMQ', 'Quartz'],
      bullets: {
        en: [
          'Directed the backend architecture with CQRS + MediatR Clean Architecture.',
          'Integrated a RAG-based Spring AI chatbot and SignalR real-time support.',
          'Moved Excel-import processing off the request thread with an async RabbitMQ + Quartz-scheduled pipeline.'
        ],
        vi: [
          'Định hướng kiến trúc backend theo CQRS + MediatR Clean Architecture.',
          'Tích hợp chatbot RAG bằng Spring AI và hỗ trợ real-time qua SignalR.',
          'Đưa xử lý import Excel ra khỏi request thread bằng pipeline bất đồng bộ RabbitMQ + Quartz.'
        ]
      }
    },
    {
      id: 'gym', name: 'Gym Management System',
      kind: { en: 'Full-stack side project', vi: 'Dự án full-stack' },
      period: { en: 'earlier', vi: 'trước đó' },
      tech: ['ASP.NET Core', 'Next.js', 'PostgreSQL', 'PayOS'],
      bullets: {
        en: ['Members, subscriptions and operations with integrated PayOS payments and an admin interface.'],
        vi: ['Quản lý hội viên, gói tập và vận hành, tích hợp thanh toán PayOS cùng trang quản trị.']
      }
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
      'aria-label': `${n.label} (${n.kind})`
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
  bus('travel', { a, b, cls, ms });
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
  bus('ping', { id });
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
  // only generate traffic while someone can see it (2D topology or the 3D hero that mirrors it)
  const onScreen = new Set();
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target))));
    [$('.topo-card'), $('#hero3d')].filter(Boolean).forEach(el => io.observe(el));
  }
  setInterval(() => {
    if (document.hidden || packets.length > 16) return;
    if ('IntersectionObserver' in window && !onScreen.size) return;
    request(pick(SERVICES));
  }, 1100);
}

/* ==============================================
   Inspector
   ============================================== */
const kv = obj => `<dl class="kv">${Object.entries(obj).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;
const tags = (arr, hotSet) => `<div class="tags">${arr.map(t => `<span class="tag${hotSet && hotSet.has(t) ? ' hot' : ''}">${esc(tr(t))}</span>`).join('')}</div>`;
const list = arr => `<ul>${arr.map(b => `<li>${esc(b)}</li>`).join('')}</ul>`;
const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${esc(text)}</a>`;

const TRACE_ID = hex(32);

const INSPECT = {
  you: () => ({
    kind: L('client · that’s you', 'client · chính là bạn'),
    title: L('Hello, visitor', 'Chào bạn'),
    route: '',
    html: `
      <p>${L(
        'You’re the client. This page renders my career as a running system — every click is a request that travels through the gateway, hits a service, and emits an event onto Kafka.',
        'Bạn là client. Trang này dựng sự nghiệp của tôi thành một hệ thống đang chạy — mỗi cú click là một request đi qua gateway, tới một service và phát một event lên Kafka.'
      )}</p>
      ${kv({
        'trace-id': `<code>${TRACE_ID.slice(0, 16)}…</code>`,
        [L('timezone', 'múi giờ')]: esc(Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown'),
        'viewport': `${window.innerWidth}×${window.innerHeight}`,
        'requests': `<span id="you-req">${reqCount}</span> ${L('this session', 'trong phiên này')}`
      })}
      <h4>${L('Things to try', 'Thử xem')}</h4>
      <ul>
        <li>${L('Click <b>career-svc</b> for my experience, <b>projects-svc</b> for side projects.',
                'Bấm <b>career-svc</b> để xem kinh nghiệm, <b>projects-svc</b> để xem dự án.')}</li>
        <li>${L('Press <b>POST /hire</b> — it runs a real-looking Saga with idempotency.',
                'Nhấn <b>POST /hire</b> — nó chạy một Saga trông như thật, có cả idempotency.')}</li>
        <li>${L('Turn on <b>chaos monkey</b>, then hire me again. Watch the compensation.',
                'Bật <b>chaos monkey</b> rồi tuyển tôi lần nữa. Xem Saga bù trừ (compensation).')}</li>
        <li>${L('Open the <b>console</b> tab and <code>curl /health</code>.',
                'Mở tab <b>console</b> và thử <code>curl /health</code>.')}</li>
        <li>${L('Be on call: <code>POST /incident</code> (or ↑↑↓↓←→←→BA) pages you at 3 AM.',
                'Thử trực ca: <code>POST /incident</code> (hoặc ↑↑↓↓←→←→BA) sẽ gọi bạn lúc 3h sáng.')}</li>
        <li>${L('Open <b>replay</b> and drag the offset back — the whole career is rebuilt from its event log.',
                'Mở tab <b>replay</b> và kéo offset về trước — cả sự nghiệp được dựng lại từ event log.')}</li>
      </ul>`
  }),

  gw: () => ({
    kind: 'gateway · kong',
    title: 'kong-gw',
    route: '<span class="verb">ANY</span> /*',
    html: `
      <p>${L('Entry point for every request on this page. Same gateway I run in front of Notification Hub.',
             'Cổng vào của mọi request trên trang này. Cũng là loại gateway tôi đặt trước Notification Hub.')}</p>
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
      <p class="sub">${L('Circuit state per upstream is visible in <code>GET /health</code>.',
                         'Trạng thái circuit của từng upstream xem ở <code>GET /health</code>.')}</p>`
  }),

  identity: () => ({
    kind: 'service · identity-svc',
    title: L('About', 'Giới thiệu'),
    route: '<span class="verb">GET</span> /about',
    html: `
      <p>${esc(tr(PROFILE.summary))}</p>
      <p>${esc(tr(PROFILE.summary2))}</p>
      ${kv({
        [L('name', 'tên')]: esc(tr(PROFILE.name)),
        [L('role', 'vai trò')]: esc(PROFILE.role),
        [L('at', 'đang làm')]: 'Sacombank · core banking',
        [L('based', 'nơi ở')]: esc(tr(PROFILE.location)),
        [L('education', 'học vấn')]: `${L('FPT University · Software Engineering', 'Đại học FPT · Kỹ thuật phần mềm')} · GPA ${esc(PROFILE.education.gpa)}`
      })}
      <h4>${L('Soft skills', 'Kỹ năng mềm')}</h4>
      ${tags(PROFILE.softSkills)}`
  }),

  career: () => ({
    kind: 'service · career-svc',
    title: L('Experience', 'Kinh nghiệm'),
    route: '<span class="verb">GET</span> /experience',
    html: PROFILE.experience.map(x => `
      <div class="entry${x.now ? ' now' : ''}">
        <h4>${esc(x.title)} @ ${esc(x.company)} — ${esc(tr(x.product))}</h4>
        <div class="sub">${esc(tr(x.subtitle))} · ${esc(tr(x.period))}</div>
        ${list(tr(x.bullets))}
        ${tags(x.tech)}
      </div>`).join('')
  }),

  projects: () => ({
    kind: 'service · projects-svc',
    title: L('Projects', 'Dự án'),
    route: '<span class="verb">GET</span> /projects',
    html: PROFILE.projects.map(p => `
      <div class="entry${p.id === 'nhub' ? ' now' : ''}">
        <h4>${esc(p.name)}</h4>
        <div class="sub">${esc(tr(p.kind))} · ${esc(tr(p.period))}</div>
        ${list(tr(p.bullets))}
        ${tags(p.tech)}
      </div>`).join('')
  }),

  skills: () => ({
    kind: 'service · skills-svc',
    title: L('Skills', 'Kỹ năng'),
    route: '<span class="verb">GET</span> /skills',
    html: PROFILE.skills.map(g => `<h4>${esc(tr(g.group))}</h4>${tags(g.items, PROFILE.hot)}`).join('') +
      `<h4>${L('Soft skills', 'Kỹ năng mềm')}</h4>${tags(PROFILE.softSkills)}` +
      `<p class="sub">${L('highlighted = used in production right now', 'tô màu = đang dùng trên production')}</p>`
  }),

  kafka: () => ({
    kind: 'topic · kafka',
    title: 'career.events',
    route: '',
    html: `
      <p>${L('Every milestone is an event on this topic. Append-only, ordered, replayable — like a good ledger (and like the Outbox relays I build at work).',
             'Mỗi cột mốc là một event trên topic này. Chỉ ghi thêm, có thứ tự, phát lại được — như một cuốn sổ cái tốt (và như các Outbox relay tôi làm ở công ty).')}</p>
      ${kv({ partitions: '1', retention: L('forever', 'mãi mãi'), 'consumer-group': 'visitors', producers: `career-svc, projects-svc, skills-svc, ${L('you', 'bạn')}` })}
      <p><button class="btn" data-tab-open="events">${L('tail the topic →', 'xem topic →')}</button></p>`
  }),

  redis: () => ({
    kind: 'cache · redis',
    title: L('Hot keys', 'Key nóng'),
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
        <tr><td>lock:coffee-machine</td><td>${L('held by lqviet · TTL 30s', 'lqviet đang giữ · TTL 30s')}</td></tr>
      </table>
      <p class="sub">${L('Fail-open: when a service is down, you still get stale-but-true facts from here.',
                         'Fail-open: khi một service sập, bạn vẫn nhận được thông tin cũ-nhưng-đúng từ đây.')}</p>`
  }),

  oracle: () => ({
    kind: 'records · oracle',
    title: L('Education', 'Học vấn'),
    route: '<span class="verb">GET</span> /education',
    html: `
      <p class="q">SELECT * FROM education;</p>
      <table class="sql">
        <tr><th>${L('school', 'trường')}</th><th>${L('degree', 'bằng')}</th><th>gpa</th><th>${L('grad', 'tốt nghiệp')}</th></tr>
        <tr><td>${esc(tr(PROFILE.education.school))}</td><td>${esc(tr(PROFILE.education.degree))}</td><td>${esc(PROFILE.education.gpa)}</td><td>${esc(PROFILE.education.graduated)}</td></tr>
      </table>
      <p class="q">SELECT name, issuer FROM certifications;</p>
      <table class="sql">
        <tr><th>${L('name', 'tên')}</th><th>${L('issuer', 'đơn vị cấp')}</th></tr>
        ${PROFILE.certs.map(c => `<tr><td>${link(c.url, c.name)}</td><td>${esc(c.by)}</td></tr>`).join('')}
      </table>
      <p class="sub">3 rows selected. COMMIT complete.</p>`
  }),

  notify: () => ({
    kind: 'worker · notify-worker',
    title: L('Contact', 'Liên hệ'),
    route: '<span class="verb">GET</span> /contact',
    html: `
      <p>${L('Pick a channel — the worker delivers exactly once (well, I reply at least once).',
             'Chọn một kênh — worker giao đúng một lần (còn tôi thì trả lời ít nhất một lần).')}</p>
      <a class="contact-row" href="mailto:${PROFILE.email}"><span><span class="ch">email</span><br>${esc(PROFILE.email)}</span><span class="arrow">→</span></a>
      <a class="contact-row" href="tel:+84353081770"><span><span class="ch">${L('phone', 'điện thoại')}</span><br>${esc(PROFILE.phone)}</span><span class="arrow">→</span></a>
      <a class="contact-row" href="${PROFILE.github}" target="_blank" rel="noopener"><span><span class="ch">github</span><br>github.com/lqviet45</span><span class="arrow">↗</span></a>
      <a class="contact-row" href="${PROFILE.linkedin}" target="_blank" rel="noopener"><span><span class="ch">linkedin</span><br>in/le-quoc-viet-a03721240</span><span class="arrow">↗</span></a>
      <p class="sub">📍 ${esc(tr(PROFILE.location))}</p>`
  })
};

function select(id, { silent = false } = {}) {
  selected = id;
  bus('select', { id });
  Object.entries(nodeEls).forEach(([k, g]) => g.classList.toggle('sel', k === id));
  const d = INSPECT[id]();
  $('#insp-kind').textContent = d.kind;
  $('#insp-title').textContent = d.title;
  $('#insp-route').innerHTML = d.route;
  $('#insp-body').innerHTML = d.html;
  if (silent) return;

  // cross-fade the new content in (restart the CSS animation)
  const body = $('#insp-body');
  body.classList.remove('swap');
  void body.offsetWidth;
  body.classList.add('swap');

  $('#insp-body').scrollTop = 0;
  request(id);
  emit('http.request', `GET ${NODES[id].route || '/' + NODES[id].label} ← visitor`, 'user');
  if (window.innerWidth <= 1000) $('#inspector').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
}

/* ==============================================
   Kafka event stream (event log stays in English, like real logs)
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
  bus('event', { key, cls, offset });
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
    e.target.textContent = evPaused ? L('resume', 'tiếp tục') : L('pause', 'tạm dừng');
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
  if (LANG === 'vi') return y ? `${y} năm ${r} tháng` : `${r} tháng`;
  return y ? `${y}y ${r}mo` : `${r}mo`;
}

const SPANS = [
  { name: 'career', svc: 'lqviet', start: '2023-12', depth: 0, cls: '',
    attrs: { 'span.kind': 'server', 'status': 'OK', 'languages': 'java, c#', 'location': 'vn-south' },
    notes: { en: ['Root span — everything below is a child of this.'], vi: ['Span gốc — mọi thứ bên dưới đều là con của nó.'] } },
  { name: 'backend.developer', svc: 'amazing-tech', start: '2023-12', end: '2024-05', depth: 1, cls: 'work',
    attrs: { 'period': '12/2023 – 05/2024', 'stack': 'ASP.NET Core · SQL Server · Dapper' }, notes: PROFILE.experience[2].bullets },
  { name: 'capstone', svc: 'fedom-ai', start: '2025-01', end: '2025-05', label: '2025', depth: 1, cls: 'side',
    attrs: { 'role': 'back-end developer', 'arch': 'CQRS + MediatR' }, notes: PROFILE.projects[1].bullets },
  { mark: '2025-05', name: 'degree.granted', svc: 'fpt-university', depth: 1,
    attrs: { 'degree': PROFILE.education.degree, 'gpa': PROFILE.education.gpa }, notes: [] },
  { name: 'personal', svc: 'notification-hub', start: '2025-01', label: { en: '2025 – now', vi: '2025 – nay' }, depth: 1, cls: 'side',
    attrs: { 'runtime': '.NET 8', 'tenancy': 'multi', 'team size': { en: '1 (me)', vi: '1 (tôi)' } }, notes: PROFILE.projects[0].bullets },
  { name: 'backend.developer', svc: 'sacombank', start: '2026-01', depth: 1, cls: 'work',
    attrs: { 'period': { en: '01/2026 – Present', vi: '01/2026 – Hiện tại' }, 'domain': 'core banking' },
    notes: { en: ['Two platforms in parallel — see child spans.'], vi: ['Hai nền tảng chạy song song — xem các span con.'] } },
  { name: 'cd-trading', svc: 'coreCD/coreSL', start: '2026-01', depth: 2, cls: 'work',
    attrs: { 'patterns': 'saga · outbox · idempotency', 'integrations': 'T24, PaymentHub, ODS' }, notes: PROFILE.experience[0].bullets },
  { name: 'va-integration', svc: 'mcs-bill', start: '2026-01', depth: 2, cls: 'work',
    attrs: { 'transport': 'gRPC + IBM MQ', 'partners': '6' }, notes: PROFILE.experience[1].bullets }
];

function renderTrace() {
  const t0 = ym('2023-10'), t1 = NOW_M + 1;
  const pct = m => ((m - t0) / (t1 - t0)) * 100;
  const open = new Set($$('.span-row.open').map(r => r.dataset.i));

  const ticks = [];
  for (let y = 2024; y * 12 <= t1; y++) ticks.push(`<span class="axis-tick" style="left:${pct(y * 12)}%">${y}</span>`);
  ticks.push(`<span class="axis-tick" style="left:${pct(NOW_M)}%;color:var(--signal)">${L('now', 'nay')}</span>`);

  let html = `<div class="trace-inner"><div class="trace-axis"><span>service · operation</span><div class="axis-track">${ticks.join('')}</div></div>`;
  SPANS.forEach((s, i) => {
    let bar;
    if (s.mark) {
      const [y, m] = s.mark.split('-');
      bar = `<span class="span-mark" style="left:${pct(ym(s.mark))}%"><span>🎓 ${L('graduated', 'tốt nghiệp')} ${m}/${y}</span></span>`;
    } else {
      const a = ym(s.start), live = !s.end, b = live ? NOW_M : ym(s.end) + 1;
      const left = pct(a), width = pct(b) - left;
      const dur = tr(s.label) || `${fmtDur(b - a)}${live ? ` · ${L('live', 'đang chạy')}` : ''}`;
      // label after the bar if there's room, else before it, else inside it
      let durPos = `left:calc(${left + width}% + 10px)`, durCls = '';
      if (left + width > 78) durPos = left > 22 ? `right:${100 - left + 1}%` : (durCls = ' inside', `right:${100 - left - width + 1.5}%`);
      bar = `<span class="span-bar ${s.cls}${live ? ' live' : ''}" style="left:${left}%;width:${width}%;animation-delay:${i * 90}ms"></span>
             <span class="span-dur${durCls}" style="${durPos}">${esc(dur)}</span>`;
    }
    const notes = tr(s.notes);
    const isOpen = open.has(String(i));
    html += `
      <div class="span-row${isOpen ? ' open' : ''}" data-i="${i}" style="--depth:${s.depth}" tabindex="0" role="button" aria-expanded="${isOpen}">
        <div class="span-name"><span class="tw">▸</span><span class="svc">${esc(s.svc)}</span> ${esc(s.name)}</div>
        <div class="span-track">${bar}</div>
      </div>
      <div class="span-attrs" style="--depth:${s.depth}">
        ${kv(Object.fromEntries(Object.entries(s.attrs).map(([k, v]) => [k, esc(tr(v))])))}
        ${notes.length ? list(notes) : ''}
      </div>`;
  });
  html += '</div>';

  const trace = $('#trace');
  trace.innerHTML = html;
  $('#trace-id').textContent = TRACE_ID.slice(0, 16);
  $('#span-count').textContent = SPANS.length;

  $$('.span-row', trace).forEach(row => {
    const toggle = () => {
      const isOpen = row.classList.toggle('open');
      row.setAttribute('aria-expanded', isOpen);
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
  bus('down', { id, down: isDown });
  updateClusterStatus();
}

function updateClusterStatus() {
  const led = $('#cluster-led');
  const txt = $('#cluster-status');
  if (down.size) {
    const names = [...down].map(d => NODES[d].label).join(', ');
    led.className = 'led warn';
    txt.textContent = L(`degraded · ${names} down`, `suy giảm · ${names} đang sập`);
  } else if (chaosOn) {
    led.className = 'led warn';
    txt.textContent = L('chaos monkey loose', 'chaos monkey đang phá');
  } else {
    led.className = 'led ok';
    txt.textContent = L('all systems nominal', 'mọi hệ thống ổn định');
  }
}

function chaosStrike() {
  const alive = SERVICES.filter(s => !down.has(s));
  if (!alive.length) return;
  const victim = pick(alive);
  setDown(victim, true);
  floatTag(victim, L('☠ killed', '☠ bị hạ'));
  emit('chaos.kill', `{target:"${NODES[victim].label}"}`, 'err');
  emit('breaker.open', `{upstream:"${NODES[victim].label}", fallback:"redis (fail-open)"}`, 'err');
  setTimeout(() => {
    emit('breaker.half_open', `{upstream:"${NODES[victim].label}", probe:1}`);
    setTimeout(() => {
      setDown(victim, false);
      floatTag(victim, L('recovered', 'đã hồi phục'), true);
      emit('breaker.closed', `{upstream:"${NODES[victim].label}"}`);
    }, 1200);
  }, 3400);
}

function toggleChaos(force) {
  chaosOn = typeof force === 'boolean' ? force : !chaosOn;
  $('#chaos-btn').classList.toggle('on', chaosOn);
  $('#chaos-state').textContent = chaosOn ? L('ON', 'BẬT') : L('off', 'tắt');
  clearInterval(chaosTimer);
  bus('chaos', { on: chaosOn });
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
  { name: 'idempotency.acquire', svc: 'redis', note: () => 'SET hire:{key} NX EX 86400', comp: 'idempotency.release',
    anim: async () => { await travel('you', 'gw', 'sync'); ping('gw'); ping('redis'); } },
  { name: 'role.match', svc: 'skills-svc', comp: 'role.match (no-op)',
    note: () => L('java/spring ∪ .net/c# ∪ distributed systems → 100%', 'java/spring ∪ .net/c# ∪ hệ thống phân tán → 100%'),
    anim: async () => { await travel('gw', 'skills', 'sync'); ping('skills'); } },
  { name: 'candidate.reserve', svc: 'career-svc', comp: 'candidate.release',
    note: () => L('reserving 1× backend developer', 'giữ chỗ 1× backend developer'),
    anim: async () => { await travel('gw', 'career', 'sync'); ping('career'); } },
  { name: 'offer.notify', svc: 'notify-worker', comp: null,
    note: () => L('outbox → kafka → email channel', 'outbox → kafka → kênh email'),
    anim: async () => { await travel('career', 'kafka', 'async'); ping('kafka'); await travel('kafka', 'notify', 'async'); ping('notify'); } }
];

const mailtoHref = () =>
  `mailto:${PROFILE.email}?subject=${encodeURIComponent(L('Let’s talk — from your portfolio', 'Trao đổi cơ hội — từ portfolio của bạn'))}`;

function sagaRow(i, state, extra = '') {
  const icons = { pending: '○', run: '◐', done: '✓', fail: '✗', comp: '↺' };
  const s = SAGA_STEPS[i];
  const li = $(`#saga-steps li[data-i="${i}"]`);
  li.className = state === 'pending' ? '' : state;
  const label = state === 'comp' ? s.comp : s.name;
  li.innerHTML = `<span class="ic">${icons[state]}</span><span>${esc(label)}<span class="note">${esc(extra || s.note())}</span></span><span class="svc">${esc(s.svc)}</span>`;
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
      <div class="big warn">${L('409 — already committed', '409 — đã commit rồi')}</div>
      <p>${L(
        'Redis <code>SET NX</code> returned 0: this hire was already processed in this session. Exactly-once, as promised. (That’s literally what I build at work.)',
        'Redis <code>SET NX</code> trả về 0: lượt tuyển này đã được xử lý trong phiên. Đúng một lần, như đã hứa. (Đây chính là thứ tôi làm ở công ty.)'
      )}</p>
      <div class="actions">
        <a class="btn primary" href="${mailtoHref()}">${L('email me', 'gửi email')}</a>
        <button class="btn" id="saga-newkey">${L('retry with a new key', 'thử lại với key mới')}</button>
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
      sagaRow(i, 'fail', L('career-svc down — chaos monkey strikes', 'career-svc sập — chaos monkey ra tay'));
      floatTag('career', L('✗ step failed', '✗ bước lỗi'));
      emit('saga.step_failed', `{step:"${SAGA_STEPS[i].name}", attempt:1}`, 'err');
      await sleep(REDUCED ? 100 : 600);
      for (let j = i - 1; j >= 0; j--) {
        sagaRow(j, 'comp', L('compensating…', 'đang bù trừ…'));
        await sleep(REDUCED ? 100 : 480);
        emit('saga.compensated', `{step:"${SAGA_STEPS[j].name}"}`);
      }
      sagaRow(i, 'pending', L('retry · exponential backoff 400ms → 800ms', 'thử lại · backoff luỹ thừa 400ms → 800ms'));
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
  bus('commit', { key, compensated });
  emit('saga.committed', `{key:"${key}", attempts:${attempt}}`, 'user');
  $('#saga-result').innerHTML = `
    <div class="big ok">${L('201 Created — hire committed', '201 Created — đã chốt tuyển dụng')}${compensated ? L(' (after compensation)', ' (sau khi bù trừ)') : ''}.</div>
    <p>${compensated
      ? L('A step failed, the saga rolled back what it had done, retried with backoff, and committed exactly once. ',
          'Một bước bị lỗi, saga đã hoàn tác những gì đã làm, thử lại với backoff và commit đúng một lần. ')
      : L('All four steps committed. ', 'Cả bốn bước đã commit. ')}${L('The last step is the human one — my inbox:', 'Bước cuối là bước của con người — hộp thư của tôi:')}</p>
    <div class="actions">
      <a class="btn primary" href="${mailtoHref()}">${L('email me', 'gửi email')}</a>
      <button class="btn" id="saga-copy">${L('copy email', 'copy email')}</button>
      <a class="btn ghost" href="${PROFILE.linkedin}" target="_blank" rel="noopener">linkedin ↗</a>
    </div>`;
  $('#saga-copy').addEventListener('click', copyEmail);
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(PROFILE.email);
    toast(L(`copied ${PROFILE.email}`, `đã copy ${PROFILE.email}`));
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
   Console (curl lqv.sys) — JSON keys stay English, prose is localized
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
  'GET /': () => [200, { service: 'lqv.sys', owner: tr(PROFILE.name), routes: ['/about', '/experience', '/projects', '/skills', '/education', '/contact', '/health', '/cv', '/tldr', 'POST /hire', 'POST /loadtest', 'POST /replay', 'POST /incident', 'POST /chaos'] }, 'gw'],
  'GET /about': () => [200, { name: tr(PROFILE.name), role: PROFILE.role, company: PROFILE.company, location: tr(PROFILE.location), summary: tr(PROFILE.summary) }, 'identity'],
  'GET /experience': () => [200, PROFILE.experience.map(x => ({ company: x.company, product: tr(x.product), title: x.title, period: tr(x.period), tech: x.tech })), 'career'],
  'GET /projects': () => [200, PROFILE.projects.map(p => ({ name: p.name, kind: tr(p.kind), period: tr(p.period), tech: p.tech })), 'projects'],
  'GET /skills': () => [200, Object.fromEntries(PROFILE.skills.map(g => [tr(g.group), g.items])), 'skills'],
  'GET /education': () => [200, {
    school: tr(PROFILE.education.school), degree: tr(PROFILE.education.degree), gpa: PROFILE.education.gpa, graduated: PROFILE.education.graduated,
    certifications: PROFILE.certs.map(c => `${c.name} (${c.by})`)
  }, 'oracle'],
  'GET /contact': () => [200, { email: PROFILE.email, phone: PROFILE.phone, github: PROFILE.github, linkedin: PROFILE.linkedin }, 'notify'],
  'GET /cache': () => [200, { 'profile:stack': 'java|spring-boot|dotnet|csharp', 'profile:gpa': PROFILE.education.gpa, 'lock:coffee-machine': L('held by lqviet (TTL 30s)', 'lqviet đang giữ (TTL 30s)') }, 'redis'],
  'GET /health': () => [down.size ? 503 : 200, health(), 'gw'],
  'GET /hire': () => [405, { error: 'Method Not Allowed', hint: L('try: POST /hire', 'thử: POST /hire') }, 'gw'],
  'POST /hire': () => { setTimeout(() => runSaga(), 300); return [202, { accepted: true, saga: 'HireLeQuocViet', note: L('opening orchestrator…', 'đang mở orchestrator…') }, 'gw']; },
  'GET /cv': () => { setTimeout(downloadCV, 300); return [200, { file: 'Le-Quoc-Viet-CV.pdf', type: 'application/pdf', size: '349 KB', note: L('download started', 'đang tải xuống') }, 'notify']; },
  'GET /tldr': () => { setTimeout(() => setView('cv'), 300); return [200, { view: 'tldr', note: L('opening the recruiter version…', 'đang mở bản tóm tắt…') }, 'identity']; },
  'POST /incident': () => { setTimeout(() => startIncident(), 300); return [202, { accepted: true, severity: 'P1', service: 'career-svc', note: L('paging the on-call engineer (you)…', 'đang gọi kỹ sư trực (là bạn)…') }, 'career']; },
  'POST /replay': () => { setTimeout(() => openReplay({ play: true }), 300); return [202, { accepted: true, from_offset: 0, events: CAREER_LOG.length, note: L('replaying the career log…', 'đang phát lại career log…') }, 'kafka']; },
  'POST /loadtest': () => { setTimeout(() => runLoadTest(), 300); return [202, { accepted: true, tool: 'k6-style', note: L('opening the report…', 'đang mở báo cáo…') }, 'gw']; },
  'POST /chaos': () => { toggleChaos(); return [200, { chaosMonkey: chaosOn }, 'gw']; },
  'DELETE /chaos': () => { toggleChaos(false); return [200, { chaosMonkey: false }, 'gw']; },
  'GET /coffee': () => [418, { error: "I'm a teapot", note: L('but I do run on coffee', 'nhưng tôi chạy bằng cà phê') }, 'gw']
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
      body = {
        error: 'Service Unavailable', circuit: 'OPEN',
        fallback: L('served stale from redis', 'trả dữ liệu cũ từ redis'),
        hint: L('chaos monkey got it — try again in a few seconds', 'chaos monkey vừa hạ nó — thử lại sau vài giây')
      };
      node = 'redis';
    }
  } else {
    const known = Object.keys(API).map(k => k.split(' ')[1]);
    const guess = known.find(k => k.includes(path.slice(1, 4)) && path.length > 1);
    status = 404;
    body = { error: 'Not Found', path, ...(guess ? { [L('did you mean', 'ý bạn là')]: guess } : {}), hint: L('GET / lists all routes', 'GET / liệt kê mọi route') };
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

function setupConsoleIntro(onlyIfPristine = false) {
  const out = $('#console-out');
  const intro = out.querySelector('.intro-line');
  if (onlyIfPristine && !intro) return;
  const html = L(
    'lqv.sys api · type a path (e.g. <b>/experience</b>) or a full <b>curl -X POST /hire</b>. <b>/clear</b> clears.',
    'lqv.sys api · gõ một path (vd. <b>/experience</b>) hoặc cả lệnh <b>curl -X POST /hire</b>. <b>/clear</b> để xoá.'
  );
  if (intro) intro.innerHTML = html;
  else out.innerHTML = `<div class="status intro-line">${html}</div>`;
}

function setupConsole() {
  setupConsoleIntro();
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

  const chips = ['/', '/experience', '/projects', '/skills', '/health', '/cv', 'POST /hire', 'POST /loadtest', 'POST /replay', 'POST /incident', 'POST /chaos', '/coffee'];
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
  const hms = now.toTimeString().slice(0, 8);
  $('#clock').textContent = hms;

  let y = now.getFullYear() - START.getFullYear();
  let m = now.getMonth() - START.getMonth();
  let d = now.getDate() - START.getDate();
  if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  $('#uptime').textContent = LANG === 'vi'
    ? `${y} năm ${m} tháng ${d} ngày ${hms}`
    : `${y}y ${m}mo ${d}d ${hms}`;

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
/* Read by scene3d.js */
window.LQV = {
  select: id => select(id),
  state: () => ({ selected, down: [...down], chaos: chaosOn, offset })
};

function boot() {
  setupTheme();
  applyStatic();
  drawTopology();
  renderTrace();
  setupConsole();
  startEvents();
  updateClusterStatus();
  select('identity', { silent: true });

  $('#year').textContent = NOW.getFullYear();
  $('#manifest-ver').textContent = `v${NOW.getFullYear()}.${String(NOW.getMonth() + 1).padStart(2, '0')}`;
  tickClock();
  setInterval(tickClock, 1000);

  $('#lang-btn').addEventListener('click', () => setLang(LANG === 'vi' ? 'en' : 'vi'));
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

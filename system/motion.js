/* ==============================================
   LQV/SYS — motion layer
   · hero entrance choreography
   · scroll reveals (fade + rise, staggered)
   · count-up stats
   · statement whose words light up as you scroll
   · "Selected work" cards with a 3D tilt + specular glare
   Timing follows Material 3 tokens (emphasized-decelerate for entrances),
   and everything collapses to instant states under prefers-reduced-motion
   (Apple HIG: "make motion optional").
   Loaded last; uses system.js globals ($, $$, L, esc, REDUCED, select, bus).
   ============================================== */

'use strict';

window.__motionReady = true;

(() => {
  const root = document.documentElement;
  const MOTION = root.classList.contains('motion');
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- 1. hero entrance ---------- */
  const heroParts = [
    ...$$('.intro-text > *'),
    $('#hero3d')
  ].filter(Boolean);
  heroParts.forEach((el, i) => { el.classList.add('enter'); el.style.setProperty('--d', `${80 + i * 70}ms`); });
  const enter = () => requestAnimationFrame(() => root.classList.add('entered'));
  Promise.race([document.fonts?.ready, new Promise(r => setTimeout(r, 600))]).then(enter);

  /* ---------- 2. section heads (bilingual) ---------- */
  function renderHeads() {
    $('#work-head').innerHTML = `
      <p class="section-eyebrow">${L('Selected work', 'Công việc tiêu biểu')}</p>
      <h2 class="section-title">${L('Systems that move money — and messages.', 'Hệ thống chuyển tiền — và chuyển tin.')}</h2>
      <p class="section-sub">${L('Two core-banking platforms in production at Sacombank, and the side projects that sharpened them.',
                                  'Hai nền tảng core-banking đang chạy thật ở Sacombank, và những dự án riêng đã mài giũa chúng.')}</p>`;
    $('#explore-head').innerHTML = `
      <p class="section-eyebrow">${L('Under the hood', 'Bên dưới lớp vỏ')}</p>
      <h2 class="section-title">${L('Explore the live system.', 'Khám phá hệ thống đang chạy.')}</h2>
      <p class="section-sub">${L('Every node is clickable. Send requests, break things with chaos monkey, load-test it, or replay the whole career from its event log.',
                                  'Node nào cũng bấm được. Gửi request, phá bằng chaos monkey, load test, hoặc phát lại cả sự nghiệp từ event log.')}</p>`;
  }

  /* ---------- 3. statement: words light up with scroll ---------- */
  const STATEMENT = {
    en: 'I build systems where money moves {exactly once} — where a retry, a timeout or a crashed service can never make it move twice.',
    vi: 'Tôi xây những hệ thống mà tiền chỉ chuyển {đúng một lần} — nơi một lần thử lại, một timeout hay một service sập cũng không thể khiến nó chuyển hai lần.'
  };
  let words = [];
  function renderStatement() {
    const text = STATEMENT[LANG] || STATEMENT.en;
    const out = [];
    let hl = false;
    text.split(/(\{|\})/).forEach(part => {
      if (part === '{') { hl = true; return; }
      if (part === '}') { hl = false; return; }
      part.split(/(\s+)/).forEach(w => {
        if (!w) return;
        out.push(/^\s+$/.test(w) ? w : `<span class="w${hl ? ' hl' : ''}">${esc(w)}</span>`);
      });
    });
    const p = $('#statement');
    p.innerHTML = out.join('');
    p.setAttribute('aria-label', text.replace(/[{}]/g, ''));
    words = $$('.w', p);
    litStatement();
  }
  function litStatement() {
    if (!words.length) return;
    if (!MOTION) { words.forEach(w => w.classList.add('lit')); return; }
    const r = $('#statement').getBoundingClientRect();
    const vh = innerHeight;
    // start lighting when the paragraph's top reaches 80% of the viewport, finish at 35%
    const t = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.8 - vh * 0.35 + r.height * 0.6)));
    const n = Math.round(t * words.length);
    words.forEach((w, i) => w.classList.toggle('lit', i < n));
  }

  /* ---------- 4. selected work cards ---------- */
  const WORK = [
    { node: 'career', kicker: ['Sacombank · 2026 – now', 'Sacombank · 2026 – nay'], title: 'CoreCD/CoreSL',
      desc: ['Certificate-of-deposit trading, end to end: registration, purchase, early redemption, settlement.',
             'Giao dịch chứng chỉ tiền gửi trọn vòng: đăng ký, mua, tất toán trước hạn, tất toán.'],
      metric: ['Exactly once', 'Đúng một lần'], metricSub: ['Saga orchestration + Redis idempotency', 'Saga orchestration + idempotency trên Redis'],
      tags: ['Java', 'Spring Boot', 'Oracle', 'IBM MQ', 'Airflow'] },
    { node: 'career', kicker: ['Sacombank · 2026 – now', 'Sacombank · 2026 – nay'], title: 'MCS Bill System',
      desc: ['Virtual-account integration behind a gRPC facade, with IBM MQ request/reply to partner adapters.',
             'Tích hợp tài khoản định danh sau gRPC facade, request/reply IBM MQ tới adapter đối tác.'],
      metric: ['6', '6'], metricSub: ['partner banks & payment gateways', 'ngân hàng & cổng thanh toán đối tác'],
      tags: ['gRPC', 'IBM MQ', 'OAuth2', 'RSA-SHA256'] },
    { node: 'projects', kicker: ['Personal · 2025 – now', 'Cá nhân · 2025 – nay'], title: 'Notification Hub',
      desc: ['A multi-tenant notification platform, designed and shipped solo — gateway to per-channel workers.',
             'Nền tảng thông báo đa tenant, tự thiết kế và triển khai một mình — từ gateway tới worker từng kênh.'],
      metric: ['0 s', '0 giây'], metricSub: ['downtime while rotating signing keys', 'downtime khi xoay khoá ký'],
      tags: ['.NET 8', 'Kafka', 'Kong', 'OpenTelemetry'] },
    { node: 'projects', kicker: ['Capstone · 2025', 'Đồ án · 2025'], title: 'FEDOM-AI',
      desc: ['Exam & proctor management: CQRS + MediatR backend, a RAG chatbot and real-time support.',
             'Quản lý thi & giám thị: backend CQRS + MediatR, chatbot RAG và hỗ trợ real-time.'],
      metric: ['RAG', 'RAG'], metricSub: ['Spring AI chatbot over exam data', 'chatbot Spring AI trên dữ liệu thi'],
      tags: ['ASP.NET Core', 'CQRS', 'SignalR', 'RabbitMQ'] }
  ];
  const tx = pair => (LANG === 'vi' ? pair[1] : pair[0]);

  function renderWork() {
    $('#work-grid').innerHTML = WORK.map((w, i) => `
      <article class="work-card" tabindex="0" role="button" data-node="${w.node}" style="--i:${i}"
               aria-label="${esc(`${w.title} — ${L('open in the inspector', 'mở trong inspector')}`)}">
        <div class="work-glare" aria-hidden="true"></div>
        <p class="work-kicker">${esc(tx(w.kicker))}</p>
        <h3 class="work-title">${esc(w.title)}</h3>
        <p class="work-desc">${esc(tx(w.desc))}</p>
        <div class="work-metric">
          <span class="work-metric-value">${esc(tx(w.metric))}</span>
          <span class="work-metric-sub">${esc(tx(w.metricSub))}</span>
        </div>
        <div class="work-tags">${w.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        <span class="work-open" aria-hidden="true">${L('Inspect', 'Xem chi tiết')} →</span>
      </article>`).join('');
    wireTilt();
    observeReveals($('#work-grid'));
  }

  function wireTilt() {
    $$('.work-card').forEach(card => {
      const open = () => {
        select(card.dataset.node);
        $('.stage').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
      };
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      card.addEventListener('click', e => { e.stopPropagation(); open(); });
      if (!FINE || !MOTION) return;
      let raf = 0;
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
          card.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
          card.style.setProperty('--mx', `${x * 100}%`);
          card.style.setProperty('--my', `${y * 100}%`);
          card.classList.add('tilting');
        });
      });
      card.addEventListener('pointerleave', () => {
        cancelAnimationFrame(raf);
        card.classList.remove('tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- 5. scroll reveals + count-up ---------- */
  const countUp = el => {
    const to = +el.dataset.count;
    if (!MOTION) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1200;
    const step = now => {
      const t = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(2, -10 * t)));   // ease-out-expo
      if (t < 1) requestAnimationFrame(step); else el.textContent = to;
    };
    el.textContent = 0;
    requestAnimationFrame(step);
  };

  const io = MOTION && 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      $$('[data-count]', en.target).forEach(countUp);
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }) : null;

  function observeReveals(scope = document) {
    const targets = [...$$('[data-reveal]', scope), ...$$('[data-reveal-stagger] > *', scope)];
    if (scope.matches?.('[data-reveal-stagger]')) targets.push(...scope.children);
    targets.forEach(el => {
      if (el.classList.contains('in')) return;
      if (!io) { el.classList.add('in'); return; }
      io.observe(el);
    });
  }

  /* ---------- boot ---------- */
  renderHeads();
  renderStatement();
  renderWork();
  observeReveals();
  let litQueued = false;
  addEventListener('scroll', () => { if (!litQueued) { litQueued = true; requestAnimationFrame(() => { litQueued = false; litStatement(); }); } }, { passive: true });
  addEventListener('resize', litStatement);
  addEventListener('lqv:lang', () => { renderHeads(); renderStatement(); renderWork(); });
})();

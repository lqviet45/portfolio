/* ==============================================
   LQV/SYS — event-sourced career ("replay" tab)
   The career is stored as an append-only log of dated events. Nothing on
   the right-hand "materialized view" is stored: it is recomputed by
   folding the log up to the chosen offset — i.e. event sourcing.
   Loaded after system.js; uses its L(), tr(), esc(), $, emit(), bus()...
   ============================================== */

'use strict';

/* `at` orders the log; `when` is what we display. Where the CV only gives
   a year, `when` shows just the year so no month is invented. */
const CAREER_LOG = [
  { at: '2023-12', when: '12/2023', key: 'job.started', payload: '{company:"Amazing Tech", role:"Back-end Developer"}',
    text: { en: 'Joined Amazing Tech as a back-end developer', vi: 'Vào Amazing Tech làm back-end developer' },
    set: { role: 'Back-end Developer', company: 'Amazing Tech', status: { en: 'employed', vi: 'đang đi làm' } },
    add: { skills: ['C#', 'ASP.NET Core', 'SQL Server'] } },
  { at: '2024-01', when: '2024', key: 'module.shipped', payload: '{system:"tax-invoicing"}',
    text: { en: 'Shipped API modules for a tax-invoicing system', vi: 'Ra mắt module API cho hệ thống hoá đơn thuế' },
    add: { shipped: ['Tax-invoicing APIs'] } },
  { at: '2024-02', when: '2024', key: 'module.shipped', payload: '{system:"water-factory management"}',
    text: { en: 'Shipped a water-factory management system', vi: 'Ra mắt hệ thống quản lý nhà máy nước' },
    add: { shipped: ['Water-factory management'], skills: ['Dapper', 'Stored Procedures'] } },
  { at: '2024-03', when: '2024', key: 'report.exported', payload: '{format:"xlsx"}',
    text: { en: 'Built complex reporting with Excel export', vi: 'Xây báo cáo phức tạp có xuất Excel' },
    add: { shipped: ['Excel reporting'] } },
  { at: '2024-05', when: '05/2024', key: 'job.ended', payload: '{company:"Amazing Tech"}',
    text: { en: 'Left Amazing Tech to finish university', vi: 'Rời Amazing Tech để hoàn thành đại học' },
    set: { role: null, company: null, status: { en: 'student · building side projects', vi: 'sinh viên · làm dự án riêng' } } },
  { at: '2025-01', when: '2025', key: 'project.started', payload: '{name:"FEDOM-AI", arch:"CQRS + MediatR"}',
    text: { en: 'Led the backend of FEDOM-AI (capstone)', vi: 'Phụ trách backend FEDOM-AI (đồ án tốt nghiệp)' },
    add: { projects: ['FEDOM-AI'], patterns: ['CQRS', 'Clean Architecture'], skills: ['MediatR'] } },
  { at: '2025-02', when: '2025', key: 'feature.shipped', payload: '{name:"RAG chatbot", via:"Spring AI"}',
    text: { en: 'Integrated a RAG chatbot and real-time support', vi: 'Tích hợp chatbot RAG và hỗ trợ real-time' },
    add: { skills: ['Spring AI', 'SignalR'] } },
  { at: '2025-03', when: '2025', key: 'pipeline.async', payload: '{via:"RabbitMQ + Quartz"}',
    text: { en: 'Moved Excel imports off the request thread', vi: 'Đưa import Excel ra khỏi request thread' },
    add: { skills: ['RabbitMQ', 'Quartz'] } },
  { at: '2025-05', when: '05/2025', key: 'degree.granted', payload: '{school:"FPT University", gpa:"7.92/10"}',
    text: { en: 'Graduated in Software Engineering, FPT University', vi: 'Tốt nghiệp Kỹ thuật phần mềm, Đại học FPT' },
    set: { education: { en: 'B.IT, FPT University · GPA 7.92/10', vi: 'Cử nhân CNTT, Đại học FPT · GPA 7.92/10' } } },
  { at: '2025-06', when: '2025', key: 'project.started', payload: '{name:"Notification Hub", runtime:".NET 8"}',
    text: { en: 'Started Notification Hub, a multi-tenant platform, solo', vi: 'Bắt đầu Notification Hub, nền tảng đa tenant, làm một mình' },
    add: { projects: ['Notification Hub'], skills: ['.NET 8', 'Kong', 'gRPC'] } },
  { at: '2025-07', when: '2025', key: 'auth.hardened', payload: '{flow:"client-credentials", alg:"RS256"}',
    text: { en: 'OAuth2 with zero-downtime signing-key rotation', vi: 'OAuth2 với xoay khoá ký không downtime' },
    add: { skills: ['OAuth2 / JWKS'] } },
  { at: '2025-08', when: '2025', key: 'delivery.reliable', payload: '{via:"outbox → Kafka"}',
    text: { en: 'Reliable delivery: outbox relay into Kafka', vi: 'Giao nhận tin cậy: outbox relay vào Kafka' },
    add: { patterns: ['Outbox'], skills: ['Apache Kafka'] } },
  { at: '2025-09', when: '2025', key: 'resilience.enabled', payload: '{polly:["circuit-breaker","retry"], tracing:"OpenTelemetry"}',
    text: { en: 'Added tracing and circuit breakers', vi: 'Thêm tracing và circuit breaker' },
    add: { patterns: ['Circuit Breaker'], skills: ['OpenTelemetry', 'Polly'] } },
  { at: '2026-01', when: '01/2026', key: 'job.started', payload: '{company:"Sacombank", role:"Backend Developer"}',
    text: { en: 'Joined Sacombank as a backend developer', vi: 'Vào Sacombank làm backend developer' },
    set: { role: 'Backend Developer', company: 'Sacombank', status: { en: 'employed', vi: 'đang đi làm' } },
    add: { skills: ['Java', 'Spring Boot', 'Oracle', 'Redis'] } },
  { at: '2026-02', when: '2026', key: 'platform.joined', payload: '{name:"CoreCD/CoreSL"}',
    text: { en: 'Building CoreCD/CoreSL (certificate-of-deposit trading)', vi: 'Xây CoreCD/CoreSL (giao dịch chứng chỉ tiền gửi)' },
    add: { platforms: ['CoreCD/CoreSL'] } },
  { at: '2026-03', when: '2026', key: 'saga.committed', payload: '{flow:"CD purchase", semantics:"exactly-once"}',
    text: { en: 'CD purchase flow: Saga + Redis idempotency', vi: 'Luồng mua CD: Saga + idempotency trên Redis' },
    add: { patterns: ['Saga', 'Idempotency'], skills: ['IBM MQ'] } },
  { at: '2026-04', when: '2026', key: 'dag.succeeded', payload: '{airflow:"cd-lot-reconciliation"}',
    text: { en: 'Airflow DAGs for CD-lot reconciliation', vi: 'Airflow DAG đối soát lô CD' },
    add: { skills: ['Apache Airflow'] } },
  { at: '2026-05', when: '2026', key: 'platform.joined', payload: '{name:"MCS Bill System"}',
    text: { en: 'Building MCS Bill (virtual-account integration)', vi: 'Xây MCS Bill (tích hợp tài khoản định danh)' },
    add: { platforms: ['MCS Bill System'] } },
  ...['SHB', 'LienVietPostBank', 'PVI', 'NganLuong', 'Vimo', 'GSM'].map((bank, i) => ({
    at: `2026-06-${i}`, when: '2026', key: 'partner.integrated',
    payload: bank === 'SHB' ? '{bank:"SHB", auth:"OAuth2", signing:"RSA-SHA256"}' : `{partner:"${bank}"}`,
    text: { en: `Integrated partner: ${bank}`, vi: `Tích hợp đối tác: ${bank}` },
    add: { partners: [bank] }
  }))
];

const EMPTY_STATE = Object.freeze({
  role: null, company: null, status: { en: 'student', vi: 'sinh viên' },
  education: { en: 'B.IT, FPT University · in progress', vi: 'Cử nhân CNTT, Đại học FPT · đang học' },
  skills: [], patterns: [], shipped: [], projects: [], platforms: [], partners: []
});

/* The whole point: a pure reducer. state(offset) = log[0..offset).reduce(apply, EMPTY) */
function apply(state, ev) {
  const next = { ...state, ...(ev.set || {}) };
  for (const [k, items] of Object.entries(ev.add || {})) {
    next[k] = [...state[k], ...items.filter(x => !state[k].includes(x))];
  }
  return next;
}
const stateAt = offset => CAREER_LOG.slice(0, offset).reduce(apply, EMPTY_STATE);

let rpOffset = CAREER_LOG.length;
let rpTimer = null;
let rpBuilt = false;

function rpChips(items, fresh, empty) {
  if (!items.length) return `<span class="rp-empty">${esc(empty)}</span>`;
  return `<div class="tags">${items.map(x => `<span class="tag${fresh.includes(x) ? ' rp-new' : ''}">${esc(x)}</span>`).join('')}</div>`;
}

function renderReplay() {
  const panel = $('#panel-replay');
  if (!panel) return;
  if (!rpBuilt) buildReplay(panel);

  const N = CAREER_LOG.length;
  const s = stateAt(rpOffset);
  const prev = stateAt(Math.max(0, rpOffset - 1));
  const last = CAREER_LOG[rpOffset - 1];
  const freshOf = k => (rpOffset ? s[k].filter(x => !prev[k].includes(x)) : []);
  const changed = k => rpOffset && JSON.stringify(s[k]) !== JSON.stringify(prev[k]);

  $('#rp-range').value = rpOffset;
  $('#rp-range').setAttribute('aria-valuetext', `offset ${rpOffset} / ${N}`);
  $('#rp-pos').innerHTML = `offset <b>${rpOffset}</b> / ${N} · <b>${last ? esc(last.when) : L('before 12/2023', 'trước 12/2023')}</b>`;
  $('#rp-play').innerHTML = rpTimer ? `❚❚ ${L('Pause', 'Tạm dừng')}` : `▶ ${rpOffset >= N ? L('Replay from offset 0', 'Phát lại từ offset 0') : L('Play', 'Phát')}`;
  $('#rp-prev').disabled = rpOffset <= 0;
  $('#rp-next').disabled = rpOffset >= N;

  // the log: applied · current · pending
  $('#rp-log').innerHTML = CAREER_LOG.map((ev, i) => {
    const cls = i < rpOffset - 1 ? 'applied' : i === rpOffset - 1 ? 'current' : 'pending';
    return `<li class="${cls}"><button type="button" data-offset="${i + 1}">
      <span class="rp-off">#${i}</span><span class="rp-when">${esc(ev.when)}</span>
      <span class="rp-key">${esc(ev.key)}</span><span class="rp-text">${esc(tr(ev.text))}</span>
    </button></li>`;
  }).join('');
  // keep the current event in view by scrolling the log box only (never the page)
  const log = $('#rp-log');
  const cur = $('#rp-log li.current');
  if (cur) log.scrollTop = cur.offsetTop - log.clientHeight / 2 + cur.offsetHeight / 2;

  // the materialized view
  const row = (k, label, value) => `<div class="rp-field${changed(k) ? ' changed' : ''}"><dt>${label}</dt><dd>${value}</dd></div>`;
  const job = s.role ? `${esc(s.role)} <span class="muted">@</span> ${esc(s.company)}` : `<span class="rp-empty">${L('none', 'chưa có')}</span>`;
  $('#rp-view').innerHTML = `
    ${row('status', L('Status', 'Trạng thái'), esc(tr(s.status)))}
    ${row('role', L('Current job', 'Công việc hiện tại'), job)}
    ${row('education', L('Education', 'Học vấn'), esc(tr(s.education)))}
    ${row('platforms', L('Core-banking platforms', 'Nền tảng core-banking'), rpChips(s.platforms, freshOf('platforms'), L('none yet', 'chưa có')))}
    ${row('partners', L('Partner banks integrated', 'Ngân hàng đối tác đã tích hợp'), `<b class="rp-count">${s.partners.length}</b><span class="muted"> / 6</span> ${rpChips(s.partners, freshOf('partners'), '')}`)}
    ${row('shipped', L('Shipped at work', 'Đã ra mắt ở công ty'), rpChips(s.shipped, freshOf('shipped'), L('none yet', 'chưa có')))}
    ${row('projects', L('Side projects', 'Dự án riêng'), rpChips(s.projects, freshOf('projects'), L('none yet', 'chưa có')))}
    ${row('patterns', L('Patterns in production', 'Pattern đã dùng thật'), rpChips(s.patterns, freshOf('patterns'), L('none yet', 'chưa có')))}
    ${row('skills', L('Skills', 'Kỹ năng') + ` <span class="muted">(${s.skills.length})</span>`, rpChips(s.skills, freshOf('skills'), L('none yet', 'chưa có')))}`;
}

function buildReplay(panel) {
  rpBuilt = true;
  panel.innerHTML = `
    <div class="rp-controls">
      <button class="btn primary" id="rp-play"></button>
      <button class="mini" id="rp-prev" aria-label="${esc(L('Step back', 'Lùi một event'))}">‹</button>
      <button class="mini" id="rp-next" aria-label="${esc(L('Step forward', 'Tiến một event'))}">›</button>
      <input type="range" id="rp-range" min="0" max="${CAREER_LOG.length}" step="1" aria-label="${esc(L('Log offset', 'Offset trong log'))}">
      <span class="rp-pos" id="rp-pos"></span>
    </div>
    <div class="rp-grid">
      <section class="rp-col">
        <div class="rp-head"><b>career.events</b> <span class="muted">· ${L('append-only log', 'log chỉ ghi thêm')}</span></div>
        <ol class="rp-log" id="rp-log"></ol>
      </section>
      <section class="rp-col">
        <div class="rp-head"><b>${L('Materialized view', 'Materialized view')}</b>
          <code class="rp-code">state = log.slice(0, offset).reduce(apply, EMPTY)</code></div>
        <dl class="rp-view" id="rp-view"></dl>
      </section>
    </div>
    <p class="rp-note" id="rp-note"></p>`;

  $('#rp-play').addEventListener('click', () => (rpTimer ? pauseReplay() : playReplay()));
  $('#rp-prev').addEventListener('click', () => { pauseReplay(); seek(rpOffset - 1); });
  $('#rp-next').addEventListener('click', () => { pauseReplay(); seek(rpOffset + 1, true); });
  $('#rp-range').addEventListener('input', e => { pauseReplay(); seek(+e.target.value); });
  $('#rp-log').addEventListener('click', e => {
    const b = e.target.closest('button[data-offset]');
    if (b) { pauseReplay(); seek(+b.dataset.offset); }
  });
}

function renderNote() {
  const n = $('#rp-note');
  if (n) n.innerHTML = L(
    'Nothing on the right is stored. Every field is recomputed by folding the events on the left — that is <b>event sourcing</b>, the same idea behind the Outbox relays and Kafka consumers I build. Drag the offset back to time-travel.',
    'Không có gì bên phải được lưu sẵn. Mọi trường đều được tính lại bằng cách fold các event bên trái — đó là <b>event sourcing</b>, cùng ý tưởng với các Outbox relay và Kafka consumer tôi làm. Kéo offset về trước để du hành thời gian.'
  );
}

function seek(offset, publish = false) {
  const next = Math.max(0, Math.min(CAREER_LOG.length, offset));
  if (publish && next > rpOffset) {
    const ev = CAREER_LOG[next - 1];
    emit(ev.key, ev.payload, 'user'); // appended to the live topic -> 3D tower grows too
  }
  rpOffset = next;
  renderReplay();
}

function playReplay() {
  if (rpOffset >= CAREER_LOG.length) {
    rpOffset = 0;
    bus('replay', { reset: true });
    emit('replay.started', `{from_offset:0, events:${CAREER_LOG.length}}`, 'user');
  }
  rpTimer = setInterval(() => {
    if (rpOffset >= CAREER_LOG.length) { pauseReplay(); emit('replay.caught_up', `{offset:${rpOffset}}`, 'user'); return; }
    seek(rpOffset + 1, true);
  }, REDUCED ? 250 : 900);
  renderReplay();
}

function pauseReplay() {
  if (!rpTimer) return;
  clearInterval(rpTimer);
  rpTimer = null;
  renderReplay();
}

function openReplay({ play = false } = {}) {
  openTab('replay');
  $('.lower').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  if (play && !rpTimer) { rpOffset = CAREER_LOG.length; playReplay(); }
}

/* Wiring */
document.addEventListener('click', e => { if (e.target.closest('[data-open-replay]')) openReplay(); });
renderReplay();
renderNote();
addEventListener('lqv:lang', () => { rpBuilt = false; renderReplay(); renderNote(); });

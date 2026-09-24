/* ==============================================
   LQV/SYS — "On-call drill · 03:00" (a simulated incident)
   Pager → acknowledge → investigate with a runbook → mitigate → resolved,
   then a blameless postmortem generated from what you actually did.
   The scenario is fictional (a bad config in deploy v2.4.1 shrinks the
   Oracle connection pool); it exercises real on-call habits: check what
   changed, read saturation metrics, prefer rollback over guesswork.
   Triggers: Konami code, `POST /incident`, the link under "Explore".
   Loaded after system.js (uses $, $$, L, esc, emit, bus, setDown, REDUCED).
   ============================================== */

'use strict';

const INC = {
  TICK_MS: 500,        // real time per simulation tick
  SIM_S: 5,            // simulated seconds per tick
  SLO_ERR: 1,          // % errors
  SLO_P99: 500,        // ms
  HISTORY: 36
};

let inc = null;

const incFmtClock = s => {
  const t = 3 * 3600 + s;
  const hh = String(Math.floor(t / 3600)).padStart(2, '0');
  const mm = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
  const ss = String(t % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};
const incFmtDur = s => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;

/* ---------- simulation model ---------- */
function incMetrics() {
  const s = inc.state, t = inc.simS;
  const noise = (a) => (Math.random() - 0.5) * a;
  let err, p99;
  if (s.rolledBack) {
    const since = t - s.rolledBackAt;                       // recovery curve after rollback
    err = Math.max(0.05, 19 * Math.exp(-since / 12)) + Math.abs(noise(0.1));
    p99 = 170 + 2300 * Math.exp(-since / 12) + noise(20);
  } else {
    // pool of 5 connections × replicas; demand grows slowly after 03:00
    const capacity = 5 * s.replicas;
    const demand = 40 + t * 0.05;
    const saturation = Math.max(0, 1 - capacity / demand);
    err = 4 + saturation * 22 + noise(1.5);
    p99 = 900 + saturation * 2200 + noise(120);
    if (s.restartedAt != null) {                            // restart frees the pool… briefly
      const since = t - s.restartedAt;
      const relief = Math.max(0, 1 - since / 35);
      err *= 1 - 0.85 * relief;
      p99 *= 1 - 0.7 * relief;
    }
    if (s.flushedAt != null) {                              // cold cache → stampede on Oracle
      const since = t - s.flushedAt;
      const burst = Math.max(0, 1 - since / 45);
      err += 14 * burst;
      p99 += 1500 * burst;
    }
  }
  return { err: Math.max(0, Math.min(100, err)), p99: Math.max(80, p99) };
}

const RUNBOOK = [
  { id: 'deploys', kind: 'investigate', icon: '🔍',
    label: ['Check recent deploys', 'Xem các deploy gần đây'],
    cmd: 'kubectl rollout history deploy/career-svc',
    run(s) {
      s.knowsDeploy = true;
      return [L('v2.4.1 rolled out at 02:56:04 — 4 minutes before the alert. Diff: ORACLE_POOL_MAX 50 → 5.',
                'v2.4.1 được rollout lúc 02:56:04 — 4 phút trước cảnh báo. Diff: ORACLE_POOL_MAX 50 → 5.'), 'clue'];
    } },
  { id: 'pool', kind: 'investigate', icon: '📈',
    label: ['Check DB connection pool', 'Xem connection pool DB'],
    cmd: 'curl career-svc:8081/actuator/metrics/hikaricp.connections.pending',
    run(s) {
      s.knowsPool = true;
      return [L(`Pool saturated: ${5 * s.replicas}/${5 * s.replicas} connections active, ~140 threads waiting. Oracle itself is healthy.`,
                `Pool bão hoà: ${5 * s.replicas}/${5 * s.replicas} kết nối đang dùng, ~140 thread đang chờ. Bản thân Oracle vẫn khoẻ.`), 'clue'];
    } },
  { id: 'restart', kind: 'mitigate', icon: '♻️',
    label: ['Restart pods', 'Restart pod'],
    cmd: 'kubectl rollout restart deploy/career-svc',
    run(s) {
      s.restartedAt = inc.simS; s.wrongTurns++;
      return [L('Errors drop… then climb back as the tiny pool fills up again. Treats the symptom, not the cause.',
                'Lỗi giảm… rồi tăng lại khi pool nhỏ lại đầy. Chữa triệu chứng, không chữa nguyên nhân.'), 'warn'];
    } },
  { id: 'scale', kind: 'mitigate', icon: '⬆️',
    label: ['Scale out ×3', 'Scale ra ×3'],
    cmd: 'kubectl scale deploy/career-svc --replicas=9',
    run(s) {
      if (s.replicas >= 9) return [L('Already at 9 replicas.', 'Đã ở 9 replica.'), 'info'];
      s.replicas = 9; s.wrongTurns++;
      return [L('More pods = more pools, so errors ease — but each pod still has 5 connections. Partial relief, triple the cost.',
                'Nhiều pod hơn = nhiều pool hơn, lỗi đỡ phần nào — nhưng mỗi pod vẫn chỉ 5 kết nối. Đỡ một phần, tốn gấp ba.'), 'warn'];
    } },
  { id: 'flush', kind: 'mitigate', icon: '🧹',
    label: ['Flush Redis cache', 'Flush cache Redis'],
    cmd: 'redis-cli FLUSHALL',
    run(s) {
      s.flushedAt = inc.simS; s.wrongTurns++;
      return [L('Cache stampede: every request now hits Oracle through the same 5 connections. It got worse.',
                'Cache stampede: mọi request giờ dồn vào Oracle qua đúng 5 kết nối đó. Tệ hơn rồi.'), 'bad'];
    } },
  { id: 'rollback', kind: 'mitigate', icon: '⏪',
    label: ['Roll back to v2.4.0', 'Rollback về v2.4.0'],
    cmd: 'kubectl rollout undo deploy/career-svc --to-revision=41',
    run(s) {
      if (s.rolledBack) return [L('Already rolled back.', 'Đã rollback rồi.'), 'info'];
      s.rolledBack = true; s.rolledBackAt = inc.simS;
      return [L('Rolling back to v2.4.0 (ORACLE_POOL_MAX=50). Watching error rate…', 'Đang rollback về v2.4.0 (ORACLE_POOL_MAX=50). Theo dõi tỷ lệ lỗi…'), 'good'];
    } }
];

/* ---------- lifecycle ---------- */
function startIncident() {
  if (inc && !inc.done) { $('#inc').hidden = false; return; }
  inc = {
    simS: 0, ackS: null, resolvedS: null, done: false, busy: false, okStreak: 0, failed: 0, total: 0,
    hist: [], log: [], actions: [],
    state: { replicas: 3, rolledBack: false, rolledBackAt: null, restartedAt: null, flushedAt: null, knowsDeploy: false, knowsPool: false, wrongTurns: 0 }
  };
  // seed the history so the charts start mid-incident
  for (let i = 0; i < 10; i++) { inc.simS = i * INC.SIM_S - 50; inc.hist.push({ s: inc.simS, ...incMetrics() }); }
  inc.simS = 0;
  incLog(L('deploy v2.4.1 rolled out (career-svc)', 'deploy v2.4.1 đã rollout (career-svc)'), 'info', -236);
  incLog(L('ALERT P1 · career-svc error rate 18% > SLO 1% · p99 > 2s', 'CẢNH BÁO P1 · career-svc lỗi 18% > SLO 1% · p99 > 2s'), 'bad', 0);
  setDown('career', true);
  emit('alert.fired', '{severity:"P1", service:"career-svc", signal:"error_rate>SLO"}', 'err');
  bus('incident', { on: true });
  $('#inc').hidden = false;
  renderPager();
  if (!REDUCED && navigator.vibrate) { try { navigator.vibrate([200, 100, 200]); } catch { /* ignore */ } }
  inc.timer = setInterval(incTick, INC.TICK_MS);
}

function incTick() {
  inc.simS += INC.SIM_S;
  const m = incMetrics();
  inc.hist.push({ s: inc.simS, ...m });
  if (inc.hist.length > INC.HISTORY) inc.hist.shift();
  // rough impact model: ~40 req/s through career-svc
  const reqs = 40 * INC.SIM_S;
  inc.total += reqs;
  inc.failed += Math.round(reqs * m.err / 100);

  if (!inc.hinted && inc.ackS != null && inc.simS - inc.ackS > 120 && !inc.state.rolledBack && !inc.state.knowsDeploy) {
    inc.hinted = true;
    incLog(L('hint from the incident commander: "what changed in the last hour?"', 'gợi ý từ incident commander: "một giờ qua đã thay đổi gì?"'), 'clue');
  }
  if (inc.state.rolledBack && !inc.done) {
    inc.okStreak = m.err < INC.SLO_ERR && m.p99 < INC.SLO_P99 ? inc.okStreak + 1 : 0;
    if (inc.okStreak >= 3) resolveIncident();
  }
  if (inc.ackS != null && !inc.done) renderConsole(); else if (!inc.done) renderPagerClock();
}

function ackIncident() {
  inc.ackS = inc.simS;
  incLog(L(`acknowledged by lqviet (on-call) · TTA ${incFmtDur(inc.ackS)}`, `lqviet (trực) đã nhận ca · TTA ${incFmtDur(inc.ackS)}`), 'info');
  emit('incident.acknowledged', `{by:"lqviet", tta_s:${inc.ackS}}`, 'user');
  renderConsole(true);
}

async function runAction(a) {
  if (inc.busy || inc.done) return;
  inc.busy = true;
  inc.actions.push({ id: a.id, at: inc.simS });
  incLog(a.cmd, 'cmd');
  renderConsole();
  await sleep(REDUCED ? 100 : 900);
  const [msg, tone] = a.run(inc.state);
  incLog(msg, tone);
  emit(`runbook.${a.id}`, `{at:"${incFmtClock(inc.simS)}"}`, tone === 'bad' ? 'err' : 'user');
  inc.busy = false;
  renderConsole();
}

function resolveIncident() {
  inc.done = true;
  inc.resolvedS = inc.simS;
  clearInterval(inc.timer);
  setDown('career', false);
  incLog(L(`resolved · error rate back under SLO for 15s · MTTR ${incFmtDur(inc.resolvedS)}`, `đã xử lý · lỗi dưới SLO 15 giây liên tục · MTTR ${incFmtDur(inc.resolvedS)}`), 'good');
  emit('incident.resolved', `{mttr_s:${inc.resolvedS}, failed_requests:${inc.failed}}`, 'user');
  bus('incident', { on: false });
  renderPostmortem();
}

function closeIncident() {
  $('#inc').hidden = true;
  if (inc && !inc.done) {                        // closing abandons the drill cleanly
    clearInterval(inc.timer);
    setDown('career', false);
    bus('incident', { on: false });
    emit('incident.abandoned', '{reason:"closed"}', 'user');
    inc = null;
  }
}

function incLog(text, tone = 'info', atS = null) {
  inc.log.push({ s: atS ?? inc.simS, text, tone });
}

/* ---------- rendering ---------- */
function renderPager() {
  $('#inc-card').className = 'inc-card inc-pager';
  $('#inc-card').innerHTML = `
    <div class="inc-pager-top">
      <span class="inc-sev">P1</span>
      <span class="inc-clock" id="inc-clock">${incFmtClock(inc.simS)}</span>
    </div>
    <p class="inc-pager-kicker">${L('On-call drill · simulated incident', 'Diễn tập trực sự cố · mô phỏng')}</p>
    <h2 class="inc-pager-title">career-svc ${L('is failing', 'đang lỗi')}</h2>
    <p class="inc-pager-body">${L('Error rate 18% (SLO 1%) · p99 latency > 2 s · started 03:00:08', 'Tỷ lệ lỗi 18% (SLO 1%) · p99 > 2 giây · bắt đầu 03:00:08')}</p>
    <div class="actions">
      <button class="btn primary" id="inc-ack">${L('Acknowledge', 'Nhận ca')}</button>
      <button class="btn ghost" id="inc-dismiss">${L('Not now', 'Để sau')}</button>
    </div>`;
  $('#inc-ack').addEventListener('click', ackIncident);
  $('#inc-dismiss').addEventListener('click', closeIncident);
  $('#inc-ack').focus();
}
function renderPagerClock() { const c = $('#inc-clock'); if (c) c.textContent = incFmtClock(inc.simS); }

function sparkline(key, color, slo, unit, fmt) {
  const W = 260, H = 64, pad = 4;
  const pts = inc.hist;
  const max = Math.max(slo * 1.6, ...pts.map(p => p[key])) * 1.1;
  const x = i => pad + (W - 2 * pad) * (i / (INC.HISTORY - 1));
  const y = v => H - pad - (H - 2 * pad) * (v / max);
  const off = INC.HISTORY - pts.length;
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i + off).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return `
    <svg viewBox="0 0 ${W} ${H}" class="inc-spark" role="img" aria-label="${esc(`${fmt(last[key])}${unit}`)}">
      <rect x="0" y="0" width="${W}" height="${y(slo)}" class="inc-breach"/>
      <line x1="0" x2="${W}" y1="${y(slo)}" y2="${y(slo)}" class="inc-slo"/>
      <path d="${d}" class="inc-line" style="stroke:${color}"/>
      <circle cx="${x(pts.length - 1 + off)}" cy="${y(last[key])}" r="4" class="inc-dot" style="fill:${color}"/>
      <text x="${W - 4}" y="${y(slo) - 4}" text-anchor="end" class="inc-slo-label">SLO ${slo}${unit}</text>
    </svg>`;
}

function renderConsole(first = false) {
  const m = inc.hist[inc.hist.length - 1];
  const breach = m.err >= INC.SLO_ERR || m.p99 >= INC.SLO_P99;
  const card = $('#inc-card');
  if (first || !card.classList.contains('inc-console')) {
    card.className = 'inc-card inc-console';
    card.innerHTML = `
      <div class="saga-head">
        <div>
          <div class="insp-kind">${L('on-call drill · simulated', 'diễn tập trực · mô phỏng')}</div>
          <div class="saga-title">INC-0300 · career-svc</div>
        </div>
        <button class="insp-close" id="inc-close" aria-label="${esc(L('Close', 'Đóng'))}">×</button>
      </div>
      <div class="inc-bar" id="inc-bar"></div>
      <div class="inc-grid">
        <section>
          <div class="inc-tiles" id="inc-tiles"></div>
          <h3 class="inc-h">${L('Timeline', 'Timeline')}</h3>
          <ol class="inc-log" id="inc-log"></ol>
        </section>
        <section>
          <h3 class="inc-h">${L('Runbook', 'Runbook')}</h3>
          <p class="inc-hint">${L('Investigate first, then mitigate. Every action changes the metrics.', 'Điều tra trước, xử lý sau. Mỗi hành động đều làm số liệu thay đổi.')}</p>
          <div class="inc-actions" id="inc-actions"></div>
        </section>
      </div>`;
    $('#inc-close').addEventListener('click', closeIncident);
    $('#inc-actions').addEventListener('click', e => {
      const b = e.target.closest('button[data-a]');
      if (b) runAction(RUNBOOK.find(a => a.id === b.dataset.a));
    });
  }
  $('#inc-bar').innerHTML = `
    <span class="inc-status ${breach ? 'bad' : 'good'}"><span aria-hidden="true">${breach ? '●' : '✓'}</span> ${breach ? L('SLO breached', 'Vi phạm SLO') : L('within SLO', 'trong SLO')}</span>
    <span class="inc-meta">${L('sim time', 'giờ mô phỏng')} <b>${incFmtClock(inc.simS)}</b></span>
    <span class="inc-meta">${L('since alert', 'từ lúc cảnh báo')} <b>${incFmtDur(inc.simS)}</b></span>
    <span class="inc-meta">${L('failed requests', 'request lỗi')} <b>${inc.failed.toLocaleString('en-US')}</b></span>`;
  $('#inc-tiles').innerHTML = `
    <div class="inc-tile">
      <div class="inc-tile-top"><span>${L('Error rate', 'Tỷ lệ lỗi')}</span><b class="${m.err >= INC.SLO_ERR ? 'bad' : 'good'}">${m.err.toFixed(1)}%</b></div>
      ${sparkline('err', 'var(--err)', INC.SLO_ERR, '%', v => v.toFixed(1))}
    </div>
    <div class="inc-tile">
      <div class="inc-tile-top"><span>p99 ${L('latency', 'độ trễ')}</span><b class="${m.p99 >= INC.SLO_P99 ? 'bad' : 'good'}">${Math.round(m.p99).toLocaleString('en-US')} ms</b></div>
      ${sparkline('p99', 'var(--signal)', INC.SLO_P99, 'ms', v => Math.round(v))}
    </div>`;
  const toneIcon = { cmd: '$', good: '✓', bad: '✕', warn: '!', clue: '?', info: '·' };
  $('#inc-log').innerHTML = inc.log.slice(-9).map(e => `
    <li class="${e.tone}"><span class="inc-t">${incFmtClock(e.s)}</span><span class="inc-i" aria-hidden="true">${toneIcon[e.tone] || '·'}</span><span class="inc-m">${esc(e.text)}</span></li>`).join('');
  const logEl = $('#inc-log');
  logEl.scrollTop = logEl.scrollHeight;
  const box = $('#inc-actions');
  if (!box.children.length) {
    box.innerHTML = RUNBOOK.map(a => `
      <button type="button" class="inc-act ${a.kind}" data-a="${a.id}">
        <span class="inc-act-icon" aria-hidden="true">${a.icon}</span>
        <span><b>${esc(L(...a.label))}</b><code>${esc(a.cmd)}</code></span>
      </button>`).join('');
  }
  $$('.inc-act', box).forEach(b => {
    b.disabled = inc.busy;
    b.classList.toggle('used', inc.actions.some(x => x.id === b.dataset.a));
  });
}

function renderPostmortem() {
  const s = inc.state;
  const used = id => inc.actions.find(a => a.id === id);
  const timeline = inc.log.filter(e => e.tone !== 'cmd').map(e =>
    `<li><span class="inc-t">${incFmtClock(e.s)}</span> ${esc(e.text)}</li>`).join('');
  const investigatedFirst = (used('deploys') || used('pool')) &&
    Math.min(...['deploys', 'pool'].map(id => used(id)?.at ?? Infinity)) <= (used('rollback')?.at ?? Infinity);
  const good = [];
  if (investigatedFirst) good.push(L('Checked what changed before touching production.', 'Kiểm tra thay đổi gần đây trước khi động vào production.'));
  if (used('rollback')) good.push(L('Rolled back instead of hot-fixing at 3 AM — the fastest safe mitigation.', 'Chọn rollback thay vì hot-fix lúc 3h sáng — cách giảm thiểu an toàn nhanh nhất.'));
  if (s.wrongTurns === 0) good.push(L('No detours: zero actions that made things worse or only masked the symptom.', 'Không đi đường vòng: không có hành động nào làm tệ hơn hay chỉ che triệu chứng.'));
  const learn = [];
  if (used('flush')) learn.push(L('Flushing the cache during a DB saturation incident caused a stampede.', 'Flush cache khi DB đang bão hoà gây ra stampede.'));
  if (used('restart')) learn.push(L('Restarts bought ~30 s of relief but hid the root cause.', 'Restart chỉ đỡ ~30 giây và che mất nguyên nhân gốc.'));
  if (used('scale')) learn.push(L('Scaling out tripled cost without fixing the per-pod pool limit.', 'Scale ra tốn gấp ba mà không sửa giới hạn pool mỗi pod.'));
  if (!learn.length) learn.push(L('Nothing to add — a clean drill.', 'Không có gì thêm — một lần diễn tập sạch.'));

  $('#inc-card').className = 'inc-card inc-pm';
  $('#inc-card').innerHTML = `
    <div class="saga-head">
      <div>
        <div class="insp-kind">${L('postmortem · blameless', 'postmortem · blameless')}</div>
        <div class="saga-title">INC-0300 ${L('resolved', 'đã xử lý')}</div>
      </div>
      <button class="insp-close" id="inc-close" aria-label="${esc(L('Close', 'Đóng'))}">×</button>
    </div>
    <dl class="lt-tiles inc-pm-tiles">
      <div><dt>MTTR</dt><dd>${incFmtDur(inc.resolvedS)}</dd></div>
      <div><dt>${L('Time to acknowledge', 'Thời gian nhận ca')}</dt><dd>${incFmtDur(inc.ackS ?? 0)}</dd></div>
      <div><dt>${L('Failed requests', 'Request lỗi')}</dt><dd>${inc.failed.toLocaleString('en-US')}</dd></div>
      <div><dt>${L('Detours', 'Đường vòng')}</dt><dd>${s.wrongTurns}</dd></div>
    </dl>
    <h3 class="inc-h">${L('Summary', 'Tóm tắt')}</h3>
    <p class="inc-p">${L(
      'Deploy v2.4.1 lowered ORACLE_POOL_MAX from 50 to 5. Under normal night traffic the pool saturated, requests queued for connections and timed out, pushing career-svc errors to ~20% and p99 past 2 s. Rolling back to v2.4.0 restored the pool and the service recovered.',
      'Deploy v2.4.1 hạ ORACLE_POOL_MAX từ 50 xuống 5. Với traffic ban đêm bình thường, pool bị bão hoà, request phải chờ kết nối rồi timeout, đẩy lỗi của career-svc lên ~20% và p99 vượt 2 giây. Rollback về v2.4.0 khôi phục pool và service hồi phục.')}</p>
    <h3 class="inc-h">${L('Root cause', 'Nguyên nhân gốc')}</h3>
    <p class="inc-p">${L('A config change shipped without a guardrail; nothing flagged that the pool was 10× smaller. Blameless: the process allowed it, so the fix is in the process.',
                         'Một thay đổi cấu hình được ship mà không có rào chắn; không có gì cảnh báo pool nhỏ đi 10 lần. Blameless: quy trình đã cho phép điều đó, nên sửa ở quy trình.')}</p>
    <div class="inc-two">
      <div><h3 class="inc-h">${L('What went well', 'Điều làm tốt')}</h3><ul class="inc-ul">${(good.length ? good : [L('The alert fired within seconds of the SLO breach.', 'Cảnh báo bắn ra vài giây sau khi vi phạm SLO.')]).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><h3 class="inc-h">${L('Lessons', 'Bài học')}</h3><ul class="inc-ul">${learn.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
    </div>
    <h3 class="inc-h">${L('Action items', 'Việc cần làm')}</h3>
    <ul class="inc-ul inc-todo">
      <li>${L('Validate pool-size config in CI (reject drops > 50%).', 'Validate cấu hình pool trong CI (chặn khi giảm > 50%).')}</li>
      <li>${L('Canary deploys with automatic rollback on SLO burn rate.', 'Canary deploy, tự rollback khi SLO burn rate vượt ngưỡng.')}</li>
      <li>${L('Alert on hikaricp.connections.pending before users feel it.', 'Cảnh báo theo hikaricp.connections.pending trước khi người dùng bị ảnh hưởng.')}</li>
    </ul>
    <details class="lt-table"><summary>${L('Full timeline', 'Timeline đầy đủ')}</summary><ol class="inc-log inc-log-full">${timeline}</ol></details>
    <p class="inc-note">${L('Simulated drill with a fictional scenario — no real system was harmed.', 'Diễn tập mô phỏng với kịch bản hư cấu — không hệ thống thật nào bị ảnh hưởng.')}</p>
    <div class="actions">
      <button class="btn primary" id="inc-again">${L('Run the drill again', 'Diễn tập lại')}</button>
      <button class="btn ghost" id="inc-done">${L('Close', 'Đóng')}</button>
    </div>`;
  $('#inc-close').addEventListener('click', closeIncident);
  $('#inc-done').addEventListener('click', closeIncident);
  $('#inc-again').addEventListener('click', () => { inc = null; startIncident(); });
}

/* ---------- triggers ---------- */
(() => {
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  document.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea, [contenteditable]')) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = k === KONAMI[pos] ? pos + 1 : (k === KONAMI[0] ? 1 : 0);
    if (pos === KONAMI.length) { pos = 0; startIncident(); }
    if (e.key === 'Escape' && !$('#inc').hidden) closeIncident();
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-incident]')) { e.preventDefault(); startIncident(); }
  });
  $('#inc').addEventListener('click', e => { if (e.target.id === 'inc') closeIncident(); });
  addEventListener('lqv:lang', () => {
    if (!inc || $('#inc').hidden) return;
    if (inc.done) renderPostmortem(); else if (inc.ackS == null) renderPager(); else renderConsole(true);
  });
})();

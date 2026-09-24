/* ==============================================
   LQV/SYS — recruiter view (TL;DR) + CV download
   Loaded after system.js; uses its PROFILE, L(), tr(), esc(), bus().
   Open with the TL;DR button, the recruiter link, `GET /tldr`, or #cv.
   ============================================== */

'use strict';

const CV_URL = '../cv/Le-Quoc-Viet-CV.pdf';

function downloadCV() {
  const a = document.createElement('a');
  a.href = CV_URL;
  a.download = 'Le-Quoc-Viet-CV.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  emit('cv.downloaded', '{file:"Le-Quoc-Viet-CV.pdf"}', 'user');
}

function renderCV() {
  const P = PROFILE;
  const li = arr => arr.map(b => `<li>${esc(b)}</li>`).join('');
  const exp = P.experience.map(x => `
    <div class="cv-item">
      <div class="cv-row">
        <h3>${esc(x.title)} · ${esc(x.company)} <span class="cv-prod">— ${esc(tr(x.product))}</span></h3>
        <span class="cv-when">${esc(tr(x.period))}</span>
      </div>
      <div class="cv-sub">${esc(tr(x.subtitle))}</div>
      <ul>${li(tr(x.bullets).slice(0, 3))}</ul>
    </div>`).join('');
  const projects = P.projects.slice(0, 2).map(p => `
    <div class="cv-item">
      <div class="cv-row">
        <h3>${esc(p.name)} <span class="cv-prod">— ${esc(tr(p.kind))}</span></h3>
        <span class="cv-when">${esc(tr(p.period))}</span>
      </div>
      <ul>${li(tr(p.bullets).slice(0, 2))}</ul>
    </div>`).join('');
  const skills = P.skills.map(g => `<dt>${esc(tr(g.group))}</dt><dd>${g.items.map(esc).join(', ')}</dd>`).join('');

  $('#cv-view').innerHTML = `
    <div class="cv-toolbar">
      <button class="btn ghost" id="cv-back">${L('← back to the system', '← quay lại hệ thống')}</button>
      <span class="cv-actions">
        <button class="btn" id="cv-print">${L('print / save as PDF', 'in / lưu PDF')}</button>
        <a class="btn primary" href="${CV_URL}" download id="cv-dl">${L('download CV (PDF)', 'tải CV (PDF)')}</a>
      </span>
    </div>

    <article class="cv-paper">
      <header class="cv-head">
        <div>
          <h1 class="cv-name">${esc(tr(P.name))}</h1>
          <p class="cv-role">${esc(P.role)}</p>
        </div>
        <ul class="cv-contact">
          <li><a href="mailto:${P.email}">${esc(P.email)}</a></li>
          <li><a href="tel:+84353081770">${esc(P.phone)}</a></li>
          <li><a href="${P.github}" target="_blank" rel="noopener">github.com/lqviet45</a></li>
          <li><a href="${P.linkedin}" target="_blank" rel="noopener">linkedin.com/in/le-quoc-viet-a03721240</a></li>
          <li>${esc(tr(P.location))}</li>
        </ul>
      </header>

      <section class="cv-tldr">
        <h2>TL;DR</h2>
        <ul>
          <li>${L('<b>~2 years</b> as a backend developer — Java / Spring Boot and .NET / C#.',
                  '<b>~2 năm</b> làm backend developer — Java / Spring Boot và .NET / C#.')}</li>
          <li>${L('<b>Now at Sacombank</b>: core-banking microservices for certificate-of-deposit trading and virtual-account integration with <b>6 partner banks / gateways</b>.',
                  '<b>Hiện tại ở Sacombank</b>: microservices core-banking cho giao dịch chứng chỉ tiền gửi và tích hợp tài khoản định danh với <b>6 ngân hàng / cổng thanh toán đối tác</b>.')}</li>
          <li>${L('<b>Strengths</b>: Saga, Outbox, idempotent APIs, Kafka, IBM MQ, gRPC, Oracle, Redis.',
                  '<b>Thế mạnh</b>: Saga, Outbox, API idempotent, Kafka, IBM MQ, gRPC, Oracle, Redis.')}</li>
          <li>${L('Ships side projects end-to-end — e.g. a <b>multi-tenant notification platform</b> built solo.',
                  'Tự làm dự án cá nhân end-to-end — ví dụ một <b>nền tảng thông báo đa tenant</b> làm một mình.')}</li>
        </ul>
      </section>

      <section><h2>${L('Experience', 'Kinh nghiệm')}</h2>${exp}</section>
      <section><h2>${L('Selected projects', 'Dự án tiêu biểu')}</h2>${projects}</section>
      <section><h2>${L('Skills', 'Kỹ năng')}</h2><dl class="cv-skills">${skills}</dl></section>
      <section class="cv-two">
        <div>
          <h2>${L('Education', 'Học vấn')}</h2>
          <p><b>${esc(tr(P.education.school))}</b><br>${esc(tr(P.education.degree))}<br>GPA ${esc(P.education.gpa)} · ${L('graduated', 'tốt nghiệp')} ${esc(P.education.graduated)}</p>
        </div>
        <div>
          <h2>${L('Certifications', 'Chứng chỉ')}</h2>
          <ul class="cv-plain">${P.certs.map(c => `<li><a href="${c.url}" target="_blank" rel="noopener">${esc(c.name)}</a> · ${esc(c.by)}</li>`).join('')}</ul>
        </div>
      </section>
      <p class="cv-foot">${L('Full CV with every detail:', 'CV đầy đủ:')} <a href="${CV_URL}" download>Le-Quoc-Viet-CV.pdf</a> · ${L('interactive version:', 'phiên bản tương tác:')} lqviet45.github.io/portfolio/system</p>
    </article>`;

  $('#cv-back').addEventListener('click', () => setView('system'));
  $('#cv-print').addEventListener('click', () => window.print());
  $('#cv-dl').addEventListener('click', () => emit('cv.downloaded', '{file:"Le-Quoc-Viet-CV.pdf"}', 'user'));
}

function setView(view, { updateHash = true } = {}) {
  const cv = view === 'cv';
  if (cv) renderCV();
  document.body.classList.toggle('cv-mode', cv);
  $('#cv-view').hidden = !cv;
  $('#tldr-btn').classList.toggle('on', cv);
  $('#tldr-btn').setAttribute('aria-pressed', cv);
  if (updateHash) {
    const url = location.pathname + location.search + (cv ? '#cv' : '');
    if ((location.hash === '#cv') !== cv) history.pushState(null, '', url);
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (cv) {
    $('#cv-back').focus({ preventScroll: true });
    emit('view.changed', '{view:"tldr"}', 'user');
  }
}

/* Wiring */
$('#tldr-btn').addEventListener('click', () => setView(document.body.classList.contains('cv-mode') ? 'system' : 'cv'));
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#cv"]');
  if (a) { e.preventDefault(); setView('cv'); }
});
addEventListener('hashchange', () => setView(location.hash === '#cv' ? 'cv' : 'system', { updateHash: false }));
addEventListener('popstate', () => setView(location.hash === '#cv' ? 'cv' : 'system', { updateHash: false }));
addEventListener('lqv:lang', () => { if (document.body.classList.contains('cv-mode')) renderCV(); });
// Printing from the system view still prints the clean CV
addEventListener('beforeprint', () => { if (!document.body.classList.contains('cv-mode')) renderCV(); });

if (location.hash === '#cv') setView('cv', { updateHash: false });

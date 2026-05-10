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
  }
};

/* ==============================================
   Content Builders
   ============================================== */
function buildAboutContent() {
  return `
    <div class="about-header">
      <img src="face-img.png" alt="Le Quoc Viet" class="about-avatar">
      <div class="about-identity">
        <h2>Le Quoc Viet</h2>
        <div class="about-role">Backend Developer @ Sacombank</div>
      </div>
    </div>
    <div class="about-stats">
      <div class="stat-box"><span class="stat-val">2+</span><div class="stat-lbl">Years Experience</div></div>
      <div class="stat-box"><span class="stat-val">7.92</span><div class="stat-lbl">GPA Score</div></div>
      <div class="stat-box"><span class="stat-val">FPT</span><div class="stat-lbl">University</div></div>
    </div>
    <p class="about-desc">
      Graduated with a Bachelor's in Information Technology from FPT University (GPA: 7.92/10).
      Currently working as a Backend Developer on CoreSL — a microservices-based core banking
      system for Certificate of Deposit management using Java, Spring Boot, Oracle, and Redis.
      Previously built production-level backend systems at Amazing Tech across tax invoicing,
      water management, and construction domains. Passionate about building scalable,
      high-throughput distributed systems.
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
      <div class="file-item" id="exp-sacombank">
        <div class="file-item-header" onclick="toggleFileDetail('exp-sacombank')">
          <i class="fas fa-file-alt file-icon"></i>
          <span class="file-name">Sacombank_CoreSL.log</span>
          <span class="file-date">Present</span>
          <i class="fas fa-chevron-right file-chevron"></i>
        </div>
        <div class="file-detail">
          <p><strong style="color:var(--text)">Backend Developer @ Sacombank — CoreSL Project</strong></p>
          <p>Developed CD issuance API with PaymentHub/T24 integration. Built CD buying API with
          interest-rate-based pricing formula, lot locking mechanism, and Redis-based idempotency.
          Developed CD selling API supporting 3 sell modes (by quantity, by amount, sell all)
          with a prioritization algorithm based on maturity and purchase date.</p>
          <p>Built Apache Airflow DAGs for automated bulk CD purchasing: 4-step pipeline with lot
          allocation algorithm by customer segment. Optimized DAG performance by migrating to
          async batch processing (aiohttp + semaphore) and moving large inter-task datasets
          (&gt;2,000 records) from XCom to Redis.</p>
          <p>Integrated ODS (balance inquiry), PaymentHub/T24, and interest rate API via OpenFeign.
          Implemented distributed locking and built configuration management APIs for buy/sell limits
          and interest rate tables. Fixed security vulnerabilities identified by BlackDuck and
          Coverity. Deployed on Kubernetes/OpenShift.</p>
          <div class="exp-tags">
            <span class="exp-tag">Java</span>
            <span class="exp-tag">Spring Boot</span>
            <span class="exp-tag">Oracle</span>
            <span class="exp-tag">Redis</span>
            <span class="exp-tag">Airflow</span>
            <span class="exp-tag">OpenFeign</span>
            <span class="exp-tag">K8s/OpenShift</span>
          </div>
        </div>
      </div>
      <div class="file-item" id="exp-amazing">
        <div class="file-item-header" onclick="toggleFileDetail('exp-amazing')">
          <i class="fas fa-file-alt file-icon"></i>
          <span class="file-name">AmazingTech.log</span>
          <span class="file-date">9 months</span>
          <i class="fas fa-chevron-right file-chevron"></i>
        </div>
        <div class="file-detail">
          <p><strong style="color:var(--text)">Backend Developer @ Amazing Tech</strong></p>
          <p>Developed a Node.js web API for creating tax invoices for businesses, integrating
          with Odoo for data storage and facilitating connections with the Malaysian government.
          Implemented robust OTP validation for enhanced security.</p>
          <p>Built a comprehensive water plant management system. Designed and implemented APIs
          for complex data queries and statistical reports with Excel export functionality.
          Optimized performance using Dapper and stored procedures.</p>
          <p>Developed a web application for tracking and managing concrete piles in construction
          projects. Collaborated with stakeholders to gather requirements and designed the initial
          database structure and feature specifications.</p>
          <div class="exp-tags">
            <span class="exp-tag">Node.js</span>
            <span class="exp-tag">ASP.NET Core</span>
            <span class="exp-tag">SQL Server</span>
            <span class="exp-tag">Dapper</span>
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
        <h3>FPTU Examination System</h3>
        <p>A comprehensive mobile and web system for FPTU Examination Office with AI chatbot
        integration. Built with modern architecture patterns and real-time features.</p>
        <div class="tech-chips">
          <span class="tech-chip">ASP.NET Core</span>
          <span class="tech-chip">React</span>
          <span class="tech-chip">SQL Server</span>
          <span class="tech-chip">SignalR</span>
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
  return `
    <div class="skills-file-header">
      <span style="color:#6366f1">// skills.json</span><br>
      <span style="color:#f59e0b">{</span>
    </div>
    <div class="skill-category-block">
      <div class="skill-cat-label"><span>"Backend"</span>: [</div>
      <div class="skill-chips">
        <span class="skill-chip backend">Java</span>
        <span class="skill-chip backend">Spring Boot</span>
        <span class="skill-chip backend">ASP.NET Core</span>
        <span class="skill-chip backend">C#</span>
        <span class="skill-chip backend">Node.js</span>
      </div>
    </div>
    <div class="skill-category-block">
      <div class="skill-cat-label"><span>"Database"</span>: [</div>
      <div class="skill-chips">
        <span class="skill-chip database">Oracle</span>
        <span class="skill-chip database">SQL Server</span>
        <span class="skill-chip database">PostgreSQL</span>
        <span class="skill-chip database">Redis</span>
      </div>
    </div>
    <div class="skill-category-block">
      <div class="skill-cat-label"><span>"Tools & DevOps"</span>: [</div>
      <div class="skill-chips">
        <span class="skill-chip devops">Git</span>
        <span class="skill-chip devops">Docker</span>
        <span class="skill-chip devops">Kubernetes/OpenShift</span>
        <span class="skill-chip devops">Apache Airflow</span>
      </div>
    </div>
    <div class="skill-category-block">
      <div class="skill-cat-label"><span>"Frontend"</span>: [</div>
      <div class="skill-chips">
        <span class="skill-chip frontend">HTML5</span>
        <span class="skill-chip frontend">CSS3</span>
        <span class="skill-chip frontend">JavaScript</span>
        <span class="skill-chip frontend">React</span>
      </div>
    </div>
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
      <a class="contact-row" href="https://github.com/Lqviet45" target="_blank" rel="noopener">
        <div class="contact-icon-wrap"><i class="fab fa-github"></i></div>
        <div>
          <div class="contact-label">GitHub</div>
          <div class="contact-value">github.com/Lqviet45</div>
        </div>
      </a>
      <a class="contact-row" href="https://linkedin.com/in/le-viet-a03721240" target="_blank" rel="noopener">
        <div class="contact-icon-wrap"><i class="fab fa-linkedin"></i></div>
        <div>
          <div class="contact-label">LinkedIn</div>
          <div class="contact-value">linkedin.com/in/le-viet-a03721240</div>
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

  // Terminal needs special init after DOM insertion
  if (id === 'terminal') {
    setTimeout(() => initTerminal(), 50);
  }
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
<div class="t-line t-output">  <span class="t-success">date</span>           — Current date & time</div>
<div class="t-line t-output">  <span class="t-success">neofetch</span>      — System info</div>
<div class="t-line t-output">  <span class="t-success">clear</span>         — Clear terminal</div>`;
  },

  whoami() {
    return `<div class="t-line t-bold">Le Quoc Viet</div>
<div class="t-line t-output">Role  : Backend Developer @ Sacombank</div>
<div class="t-line t-output">Stack : Java, Spring Boot, Oracle, Redis, Airflow, K8s</div>
<div class="t-line t-output">Edu   : FPT University — GPA 7.92/10</div>`;
  },

  ls() {
    return `<div class="t-line t-output">portfolio/</div>
<div class="t-line t-output">├── About_Me.txt</div>
<div class="t-line t-output">├── Experience/</div>
<div class="t-line t-output">│   ├── Sacombank_CoreSL.log</div>
<div class="t-line t-output">│   └── AmazingTech.log</div>
<div class="t-line t-output">├── Projects/</div>
<div class="t-line t-output">│   ├── FPTU_ExamSystem/</div>
<div class="t-line t-output">│   └── GymManagement/</div>
<div class="t-line t-output">├── skills.json</div>
<div class="t-line t-output">├── Certificates/</div>
<div class="t-line t-output">├── Contact.lnk</div>
<div class="t-line t-output">└── Recycle Bin/</div>`;
  },

  'cat about.txt'() {
    return `<div class="t-line t-bold">Le Quoc Viet</div>
<div class="t-line t-output">Backend Developer @ Sacombank</div>
<div class="t-line t-output">Graduated from FPT University (GPA: 7.92/10).</div>
<div class="t-line t-output">Currently working on CoreSL — a microservices-based core banking</div>
<div class="t-line t-output">system for Certificate of Deposit management.</div>`;
  },

  'cat skills.txt'() {
    return `<div class="t-line t-bold">Technical Skills</div>
<div class="t-line t-output">Backend  : Java, Spring Boot, ASP.NET Core, C#, Node.js</div>
<div class="t-line t-output">Database : Oracle, SQL Server, PostgreSQL, Redis</div>
<div class="t-line t-output">DevOps   : Git, Docker, Kubernetes/OpenShift, Apache Airflow</div>
<div class="t-line t-output">Frontend : HTML5, CSS3, JavaScript, React</div>`;
  },

  'cat exp.txt'() {
    return `<div class="t-line t-bold">Work Experience</div>
<div class="t-line t-output" style="margin-top:4px">[ Sacombank — CoreSL Project ] Present</div>
<div class="t-line t-output">  CD issuance, buying, selling APIs (PaymentHub/T24)</div>
<div class="t-line t-output">  Apache Airflow DAGs — bulk CD pipeline (aiohttp + Redis)</div>
<div class="t-line t-output">  Distributed locking, OpenFeign integrations, K8s/OpenShift</div>
<div class="t-line t-output">  Security fixes via BlackDuck & Coverity</div>
<div class="t-line t-output" style="margin-top:6px">[ Amazing Tech ] 9 months</div>
<div class="t-line t-output">  Node.js tax invoice API (Odoo + Malaysian gov)</div>
<div class="t-line t-output">  Water plant management (Dapper + stored procs)</div>
<div class="t-line t-output">  Construction pile tracking app</div>`;
  },

  'cat contact.txt'() {
    return `<div class="t-line t-output">Email    : lqviet455@gmail.com</div>
<div class="t-line t-output">Phone    : +84 353 081 770</div>
<div class="t-line t-output">GitHub   : github.com/Lqviet45</div>
<div class="t-line t-output">LinkedIn : linkedin.com/in/le-viet-a03721240</div>
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
<div class="t-line t-output">  <span class="t-info">Uptime</span>  : 2+ years</div>
<div class="t-line t-output">  <span class="t-info">Shell</span>   : Portfolio Terminal</div>
<div class="t-line t-output">  <span class="t-info">Theme</span>   : Glassmorphism Dark</div>
<div class="t-line t-output">  <span class="t-info">Kernel</span>  : Vanilla JS</div>`;
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

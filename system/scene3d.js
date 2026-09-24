/* ==============================================
   LQV/SYS — three.js hero
   A live 3D mirror of the topology in system.js: it listens to the
   lqv:* events that page dispatches and replays them in 3D.
   ============================================== */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const host = document.getElementById('hero3d');
const canvas = document.getElementById('scene3d');
const offsetEl = document.getElementById('h3d-offset');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE = matchMedia('(pointer: coarse)').matches;
const DEG = Math.PI / 180;

/* ---------- Renderer ---------- */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
} catch (err) {
  host.dataset.state = 'failed';
  throw err;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x000000, 0);

/* ---------- Palette (read from the page's CSS variables) ---------- */
const P = {};
function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  for (const k of ['paper', 'card', 'ink', 'muted', 'line', 'signal', 'async', 'ok', 'err']) {
    P[k] = new THREE.Color(cs.getPropertyValue(`--${k}`).trim() || '#888');
  }
}
readPalette();
const mix = (a, b, t) => a.clone().lerp(b, t);

/* ---------- Scene, camera, controls ---------- */
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(P.card, 22, 46);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
const TARGET = new THREE.Vector3(0, 0.9, 0);
const BASE_DIST = 18.5;
let camDist = BASE_DIST;
camera.position.copy(new THREE.Vector3(0.3, 0.78, 1).normalize().multiplyScalar(camDist).add(TARGET));

const controls = new OrbitControls(camera, canvas);
controls.target.copy(TARGET);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.55;
controls.minPolarAngle = 0.6;
controls.maxPolarAngle = 1.3;
controls.autoRotate = !REDUCED;
controls.autoRotateSpeed = 0.5;
if (COARSE) {
  // Dragging would fight page scroll on phones: keep auto-rotate + tap-to-select only
  controls.enabled = false;
  canvas.style.touchAction = 'pan-y';
}

/* ---------- Layout ---------- */
const polar = (r, deg, y = 0) => new THREE.Vector3(r * Math.cos(deg * DEG), y, -r * Math.sin(deg * DEG));
const R_SVC = 3.3, R_OUT = 6.1, R_YOU = 8.1, BASE_Y = 0.75;

const DEFS = {
  you:      { pos: polar(R_YOU, 180), shape: 'client', kind: 'client',  label: 'you', size: [0.84, 0.84, 0.84] },
  gw:       { pos: polar(R_OUT, 180), shape: 'box', kind: 'gateway', label: 'kong-gw',       size: [1.1, 0.9, 1.1] },
  identity: { pos: polar(R_SVC, 135), shape: 'box', kind: 'service', label: 'identity-svc',  size: [1.4, 0.55, 0.85] },
  career:   { pos: polar(R_SVC, 225), shape: 'box', kind: 'service', label: 'career-svc',    size: [1.4, 0.55, 0.85] },
  projects: { pos: polar(R_SVC, 315), shape: 'box', kind: 'service', label: 'projects-svc',  size: [1.4, 0.55, 0.85] },
  skills:   { pos: polar(R_SVC, 45),  shape: 'box', kind: 'service', label: 'skills-svc',    size: [1.4, 0.55, 0.85] },
  redis:    { pos: polar(R_OUT, 42),  shape: 'db',  kind: 'cache',   label: 'redis',         size: [1.0, 0.8, 1.0] },
  oracle:   { pos: polar(R_OUT, 0),   shape: 'db',  kind: 'records', label: 'oracle',        size: [1.0, 0.8, 1.0] },
  notify:   { pos: polar(R_OUT, -42), shape: 'box', kind: 'worker',  label: 'notify-worker', size: [1.4, 0.55, 0.85] }
};
const SERVICES = ['identity', 'career', 'projects', 'skills'];
const SINKS = ['redis', 'oracle', 'notify'];

/* ---------- Shared resources ---------- */
const themed = [];                     // [material, paletteKey, lerpTo?, t?]
function themedMat(mat, key) { themed.push([mat, key]); mat.color.copy(P[key]); return mat; }
const faceMat = () => new THREE.MeshBasicMaterial({ color: P.card, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });

/* ---------- Floor: grid + orbit rings ---------- */
const floor = new THREE.Group();
scene.add(floor);
{
  const pts = [];
  const N = 12;
  for (let i = -N; i <= N; i++) {
    pts.push(-N, 0, i, N, 0, i, i, 0, -N, i, 0, N);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const gridMat = themedMat(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 }), 'line');
  floor.add(new THREE.LineSegments(g, gridMat));
  floor.userData.gridMat = gridMat;

  for (const r of [R_SVC, R_OUT]) {
    const c = new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * 2);
    const rg = new THREE.BufferGeometry().setFromPoints(c.getPoints(128).map(p => new THREE.Vector3(p.x, 0.01, p.y)));
    const ring = new THREE.Line(rg, themedMat(new THREE.LineDashedMaterial({ dashSize: 0.25, gapSize: 0.2 }), 'muted'));
    ring.computeLineDistances();
    floor.add(ring);
  }
}

/* ---------- Labels: white text on canvas, tinted per state via material.color ---------- */
function makeLabel(kind, name) {
  const s = 3;                          // supersample for crisp text
  const fKind = `500 ${9.5 * s}px Inter, system-ui, sans-serif`;
  const fName = `500 ${13 * s}px "JetBrains Mono", ui-monospace, monospace`;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  ctx.font = fName;
  const wName = ctx.measureText(name).width;
  ctx.font = fKind;
  const wKind = ctx.measureText(kind).width;
  c.width = Math.ceil(Math.max(wName, wKind) + 8 * s);
  c.height = 34 * s;
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = fKind;
  ctx.fillText(kind, c.width / 2, 11 * s);
  ctx.fillStyle = '#fff';
  ctx.font = fName;
  ctx.fillText(name, c.width / 2, 28 * s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  // depthTest off: labels stay readable when the camera orbits behind a box
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false, color: P.ink, fog: false });
  const sprite = new THREE.Sprite(mat);
  sprite.renderOrder = 10;
  const h = 0.7;
  sprite.scale.set(h * c.width / c.height, h, 1);
  return sprite;
}

/* ---------- Nodes ---------- */
const nodes = {};
const pickables = [];

function buildNode(id, d) {
  const [w, h, dep] = d.size;
  const grp = new THREE.Group();
  grp.position.copy(d.pos).setY(BASE_Y + h / 2);
  scene.add(grp);

  const body = new THREE.Group();       // the part that pulses / shakes
  grp.add(body);

  let geo;
  if (d.shape === 'box') geo = new THREE.BoxGeometry(w, h, dep);
  else if (d.shape === 'db') geo = new THREE.CylinderGeometry(w / 2, w / 2, h, 36, 1);
  else geo = new THREE.OctahedronGeometry(w / 2, 0);

  const fMat = faceMat();
  const eMat = new THREE.LineBasicMaterial({ color: P.ink });
  const face = new THREE.Mesh(geo, fMat);
  face.userData.id = id;
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), eMat);
  body.add(face, edges);
  if (d.shape === 'db') {
    // a mid band so the cylinder reads as a database drum
    const band = new THREE.EllipseCurve(0, 0, w / 2, w / 2, 0, Math.PI * 2);
    const bg = new THREE.BufferGeometry().setFromPoints(band.getPoints(48).map(p => new THREE.Vector3(p.x, h * 0.12, p.y)));
    body.add(new THREE.LineLoop(bg, eMat));
  }
  pickables.push(face);

  // hard offset shadow on the floor (echoes the 2D drop shadows)
  const shadowMat = themedMat(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.1, depthWrite: false }), 'ink');
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(w, d.shape === 'box' ? dep : w), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0.14, -(BASE_Y + h / 2) + 0.012, 0.14);
  grp.add(shadow);

  // dashed drop line to the floor, like a technical drawing
  const legGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -h / 2, 0), new THREE.Vector3(0, -(BASE_Y + h / 2), 0)]);
  const leg = new THREE.Line(legGeo, themedMat(new THREE.LineDashedMaterial({ dashSize: 0.08, gapSize: 0.08 }), 'muted'));
  leg.computeLineDistances();
  grp.add(leg);

  if (d.shape !== 'client') grp.lookAt(0, grp.position.y, 0);

  const label = makeLabel(d.kind, d.label);
  label.position.set(0, h / 2 + 0.62, 0);
  grp.add(label);

  nodes[id] = { id, d, grp, body, face, fMat, eMat, label, h, pulse: 0, shake: 0, down: false, intro: 0 };
}
Object.entries(DEFS).forEach(([id, d]) => buildNode(id, d));

/* ---------- Kafka log tower ---------- */
const SLICE_H = 0.13, SLICE_GAP = 0.05, SLICE_MAX = 15, TOWER_R = 0.72;
const sliceY = i => 0.16 + SLICE_GAP + i * (SLICE_H + SLICE_GAP) + SLICE_H / 2;
const TOWER_TOP = sliceY(SLICE_MAX - 1) + SLICE_H;
const tower = new THREE.Group();
scene.add(tower);
const sliceGeo = new THREE.CylinderGeometry(TOWER_R, TOWER_R, SLICE_H, 44, 1);
const sliceEdgeGeo = new THREE.EdgesGeometry(sliceGeo, 25);
const slices = [];
const dying = [];
let kafkaNode;
{
  const baseGeo = new THREE.CylinderGeometry(1.05, 1.15, 0.16, 48, 1);
  const base = new THREE.Mesh(baseGeo, faceMat());
  base.position.y = 0.08;
  base.userData.id = 'kafka';
  const baseEdgeMat = new THREE.LineBasicMaterial({ color: P.ink });
  const baseEdges = new THREE.LineSegments(new THREE.EdgesGeometry(baseGeo, 25), baseEdgeMat);
  baseEdges.position.y = 0.08;
  tower.add(base, baseEdges);
  pickables.push(base);

  // spine + an invisible hit cylinder so the whole tower is clickable
  const spineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.16, 0), new THREE.Vector3(0, TOWER_TOP + 0.35, 0)]);
  tower.add(new THREE.Line(spineGeo, themedMat(new THREE.LineBasicMaterial(), 'async')));
  const hit = new THREE.Mesh(new THREE.CylinderGeometry(TOWER_R, TOWER_R, TOWER_TOP, 12), new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.y = TOWER_TOP / 2;
  hit.userData.id = 'kafka';
  tower.add(hit);
  pickables.push(hit);

  const label = makeLabel('kafka · topic', 'career.events');
  label.position.set(0, TOWER_TOP + 0.75, 0);
  tower.add(label);
  kafkaNode = { id: 'kafka', grp: tower, body: tower, fMat: base.material, eMat: baseEdgeMat, label, h: TOWER_TOP, pulse: 0, shake: 0, down: false, intro: 1, isTower: true };
  nodes.kafka = kafkaNode;
}

function sliceColor(cls = '') {
  if (cls.includes('err')) return P.err;
  if (cls.includes('user')) return P.signal;
  return P.async;
}

function pushSlice(cls, instant = false) {
  if (slices.length >= SLICE_MAX) {
    const old = slices.shift();
    old.dieT = 0;
    dying.push(old);
    slices.forEach((s, i) => { s.target = sliceY(i); });
  }
  const eMat = new THREE.LineBasicMaterial({ color: sliceColor(cls), transparent: true, opacity: instant ? 1 : 0 });
  const fMat = faceMat();
  fMat.transparent = true;
  fMat.opacity = instant ? 1 : 0;
  const g = new THREE.Group();
  g.add(new THREE.Mesh(sliceGeo, fMat), new THREE.LineSegments(sliceEdgeGeo, eMat));
  const target = sliceY(slices.length);
  g.position.y = instant || REDUCED ? target : target + 2.4;
  g.rotation.y = Math.random() * Math.PI;
  tower.add(g);
  slices.push({ g, fMat, eMat, target, cls, flash: instant ? 0 : 1 });
}

/* ---------- Arcs (edges) ---------- */
const arcs = {};
function anchor(id, other) {
  if (id === 'kafka') {
    const dir = DEFS[other].pos.clone().setY(0).normalize();
    return SINKS.includes(other)
      ? dir.multiplyScalar(0.45).setY(TOWER_TOP)
      : dir.multiplyScalar(TOWER_R + 0.05).setY(1.25);
  }
  const d = DEFS[id];
  return d.pos.clone().setY(BASE_Y + d.size[1]);
}
function buildArc(a, b, type) {
  const p0 = anchor(a, b), p2 = anchor(b, a);
  const mid = p0.clone().lerp(p2, 0.5);
  mid.y = Math.max(p0.y, p2.y) + 0.5 + p0.distanceTo(p2) * 0.2;
  const curve = new THREE.QuadraticBezierCurve3(p0, mid, p2);
  const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(56));
  const mat = type === 'async'
    ? new THREE.LineDashedMaterial({ color: P.line, dashSize: 0.16, gapSize: 0.12 })
    : new THREE.LineBasicMaterial({ color: P.line });
  const line = new THREE.Line(geo, mat);
  if (type === 'async') line.computeLineDistances();
  scene.add(line);
  arcs[`${a}>${b}`] = { curve, mat, type, heat: 0, heatColor: P.signal, broken: false };
}
buildArc('you', 'gw', 'sync');
SERVICES.forEach(s => buildArc('gw', s, 'sync'));
SERVICES.forEach(s => buildArc(s, 'kafka', 'async'));
SINKS.forEach(s => buildArc('kafka', s, 'async'));

/* ---------- Packets (head + fading trail + halo) ---------- */
const haloTex = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,.45)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
})();
const headGeo = new THREE.SphereGeometry(0.11, 14, 10);
const TRAIL = [0.72, 0.5, 0.32];
const pktMats = {};
function packetMats(cls) {
  const key = cls === 'async' ? 'async' : cls === 'fail' ? 'err' : 'signal';
  if (!pktMats[key]) {
    pktMats[key] = {
      key,
      head: new THREE.MeshBasicMaterial({ color: P[key], fog: false }),
      trail: TRAIL.map((_, i) => new THREE.MeshBasicMaterial({ color: P[key], transparent: true, opacity: 0.55 - i * 0.15, fog: false })),
      halo: new THREE.SpriteMaterial({ map: haloTex, color: P[key], transparent: true, opacity: 0.5, depthWrite: false, fog: false })
    };
  }
  return pktMats[key];
}
const packets = [];
const packetPool = [];
function getPacket(mats) {
  let p = packetPool.pop();
  if (!p) {
    const g = new THREE.Group();
    const head = new THREE.Mesh(headGeo);
    const trail = TRAIL.map(s => { const m = new THREE.Mesh(headGeo); m.scale.setScalar(s); return m; });
    const halo = new THREE.Sprite();
    halo.scale.setScalar(0.75);
    g.add(head, halo, ...trail);
    p = { g, head, trail, halo };
  }
  p.head.material = mats.head;
  p.trail.forEach((m, i) => { m.material = mats.trail[i]; });
  p.halo.material = mats.halo;
  scene.add(p.g);
  return p;
}
const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function spawnPacket(a, b, cls, ms) {
  if (REDUCED || packets.length > 48) return;
  let arc = arcs[`${a}>${b}`], reverse = false;
  if (!arc) { arc = arcs[`${b}>${a}`]; reverse = true; }
  if (!arc) return;
  const mats = packetMats(cls);
  const p = getPacket(mats);
  Object.assign(p, { arc, reverse, t0: performance.now(), ms: Math.max(ms, 200) });
  arc.heat = 1;
  arc.heatColor = P[mats.key];
  packets.push(p);
}

/* ---------- Floor rings (ping / commit) ---------- */
const ringGeo = new THREE.BufferGeometry().setFromPoints(
  new THREE.EllipseCurve(0, 0, 1, 1, 0, Math.PI * 2).getPoints(64).map(p => new THREE.Vector3(p.x, 0, p.y))
);
const rings = [];
function ring(pos, colorKey = 'signal', maxScale = 2.2, delay = 0, alpha = 0.9, dur = 900) {
  if (REDUCED) return;
  const mat = new THREE.LineBasicMaterial({ color: P[colorKey], transparent: true, opacity: 0 });
  const r = new THREE.LineLoop(ringGeo, mat);
  r.position.set(pos.x, 0.03, pos.z);
  r.scale.setScalar(0.4);
  scene.add(r);
  rings.push({ r, mat, t0: performance.now() + delay, dur, maxScale, alpha });
}

// radar sweep from the log tower every few seconds
if (!REDUCED) setInterval(() => { if (visible && !document.hidden) ring(new THREE.Vector3(), 'async', 9.5, 0, 0.35, 3200); }, 4200);

/* ---------- Selection marker ---------- */
const markerGeo = new THREE.ConeGeometry(0.17, 0.34, 4);
const marker = new THREE.LineSegments(new THREE.EdgesGeometry(markerGeo), themedMat(new THREE.LineBasicMaterial(), 'signal'));
marker.rotation.x = Math.PI;
scene.add(marker);

/* ---------- State from the page ---------- */
const state = { selected: null, hover: null, chaos: false };
const init = window.LQV?.state?.() || {};
state.selected = init.selected || null;
state.chaos = !!init.chaos;
(init.down || []).forEach(id => { if (nodes[id]) nodes[id].down = true; });
for (let i = 0; i < Math.min(init.offset || 0, 9); i++) pushSlice('', true);
if (offsetEl) offsetEl.textContent = init.offset || 0;

addEventListener('lqv:travel', e => spawnPacket(e.detail.a, e.detail.b, e.detail.cls, e.detail.ms));
addEventListener('lqv:ping', e => {
  const n = nodes[e.detail.id];
  if (!n) return;
  n.pulse = 1;
  if (!n.isTower) ring(n.grp.position, 'signal', 1.6);
});
addEventListener('lqv:down', e => {
  const n = nodes[e.detail.id];
  if (!n) return;
  n.down = e.detail.down;
  if (n.down) { n.shake = 1; ring(n.grp.position, 'err', 2.6); }
  const arc = arcs[`gw>${e.detail.id}`];
  if (arc) arc.broken = n.down;
});
addEventListener('lqv:select', e => { state.selected = e.detail.id; });
addEventListener('lqv:event', e => {
  pushSlice(e.detail.cls || '');
  if (offsetEl) offsetEl.textContent = e.detail.offset;
});
addEventListener('lqv:chaos', e => { state.chaos = e.detail.on; });
// replay from offset 0: the log tower collapses, then regrows event by event
addEventListener('lqv:replay', e => {
  if (!e.detail.reset) return;
  while (slices.length) { const s = slices.shift(); s.dieT = 0; dying.push(s); }
  ring(new THREE.Vector3(), 'async', 4, 0, 0.6, 900);
});
addEventListener('lqv:commit', () => {
  const n = nodes.notify;
  n.pulse = 1;
  [0, 180, 360].forEach((d, i) => ring(n.grp.position, 'ok', 3.2 + i, d));
  ring(new THREE.Vector3(0, 0, 0), 'ok', 7.5, 250);
});

/* ---------- Theme / language changes ---------- */
new MutationObserver(() => {
  readPalette();
  scene.fog.color.copy(P.card);
  themed.forEach(([m, k]) => m.color.copy(P[k]));
  Object.values(pktMats).forEach(m => {
    m.head.color.copy(P[m.key]);
    m.trail.forEach(t => t.color.copy(P[m.key]));
    m.halo.color.copy(P[m.key]);
  });
  slices.forEach(s => s.eMat.color.copy(sliceColor(s.cls)));
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ---------- Picking ---------- */
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function pick(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects(pickables, false)[0];
  return hit ? hit.object.userData.id : null;
}
let downAt = null;
canvas.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
canvas.addEventListener('pointermove', e => {
  if (COARSE) return;
  state.hover = pick(e.clientX, e.clientY);
  canvas.classList.toggle('hover', !!state.hover);
});
canvas.addEventListener('pointerleave', () => { state.hover = null; canvas.classList.remove('hover'); });
canvas.addEventListener('click', e => {
  if (downAt && Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return; // it was a drag
  const id = pick(e.clientX, e.clientY);
  if (id && window.LQV) window.LQV.select(id);
});

/* ---------- Resize / visibility ---------- */
function resize() {
  const w = host.clientWidth, h = host.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const aspect = w / h;
  const narrow = aspect < 1.1;
  camDist = BASE_DIST * (aspect < 1.25 ? Math.min(1.8, Math.pow(1.25 / aspect, 0.85)) : 1) * (narrow ? 1.1 : 1);
  // look down more steeply on narrow screens so the ring uses the vertical space
  const sph = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
  sph.phi = narrow ? 0.62 : 0.93;
  camera.position.setFromSpherical(sph).add(controls.target);
  controls.minPolarAngle = narrow ? 0.45 : 0.6;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(host);
resize();

let visible = true;
new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(host);

/* ---------- Pointer parallax (fine pointers only) ---------- */
const tilt = { x: 0, y: 0 };
if (!COARSE) {
  addEventListener('pointermove', e => {
    tilt.x = (e.clientX / innerWidth) * 2 - 1;
    tilt.y = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
}

/* ---------- Frame loop ---------- */
const clock = new THREE.Clock();
const startedAt = performance.now();
const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _c = new THREE.Color();

function updateNode(n, dt, t, introP) {
  n.pulse *= Math.exp(-dt * 5);
  n.shake = Math.max(0, n.shake - dt * 1.4);
  const sel = state.selected === n.id, hov = state.hover === n.id;

  // edge + face + label colours
  let edge = P.ink;
  if (n.down) edge = P.err;
  else if (sel) edge = P.signal;
  else if (hov) edge = mix(P.ink, P.signal, 0.6);
  n.eMat.color.copy(edge);
  _c.copy(P.card);
  if (n.down) _c.lerp(P.err, 0.18);
  else if (sel || hov) _c.lerp(P.signal, sel ? 0.16 : 0.1);
  _c.lerp(P.signal, n.pulse * 0.18);
  n.fMat.color.copy(_c);
  n.label.material.color.copy(n.down ? P.err : sel ? P.signal : P.ink);
  // farther labels fade back, so the front of the ring reads first
  const dist = camera.position.distanceTo(n.grp.getWorldPosition(_v2));
  const depth = sel || hov ? 1 : THREE.MathUtils.clamp(1.35 - (dist - camDist * 0.72) / (camDist * 0.62), 0.35, 1);

  if (n.isTower) { n.label.material.opacity = Math.max(depth, 0.8); return; }
  // intro rise, pulse, chaos shake / sag
  const k = Math.min(1, Math.max(0, introP * 1.9 - n.intro));
  const s = (REDUCED ? 1 : 1 - Math.pow(1 - k, 3)) * (1 + n.pulse * 0.14);
  n.body.scale.setScalar(Math.max(s, 0.0001));
  n.label.material.opacity = k * depth;
  const sag = n.down ? -0.22 : 0;
  n.body.position.y += (sag - n.body.position.y) * Math.min(1, dt * 6);
  n.body.position.x = n.shake ? Math.sin(t * 60) * 0.06 * n.shake : 0;
  if (n.d.shape === 'client') n.body.rotation.y += dt * 0.9;
}

function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (!visible || document.hidden) return;
  const now = performance.now();
  const t = now / 1000;
  const introP = REDUCED ? 1 : Math.min(1, (now - startedAt) / 1600);

  // camera: dolly in during intro, keep distance afterwards
  const introDist = camDist * (1 + 0.4 * (1 - ease(introP)));
  _v.copy(camera.position).sub(controls.target).setLength(introDist);
  camera.position.copy(controls.target).add(_v);
  controls.autoRotateSpeed = REDUCED ? 0 : (state.chaos ? 1.3 : state.hover ? 0.12 : 0.5);
  controls.update();

  // floor tint under chaos
  floor.userData.gridMat.color.copy(state.chaos ? mix(P.line, P.err, 0.45) : P.line);

  Object.values(nodes).forEach(n => updateNode(n, dt, t, introP));

  // arcs: heat glow after a packet passes, red when the upstream is down
  Object.values(arcs).forEach(a => {
    a.heat = Math.max(0, a.heat - dt * 1.6);
    if (a.broken) a.mat.color.copy(P.err);
    else a.mat.color.copy(P.line).lerp(a.heatColor, Math.min(1, a.heat * 0.9));
  });

  // packets
  for (let i = packets.length - 1; i >= 0; i--) {
    const p = packets[i];
    const raw = (now - p.t0) / p.ms;
    const e = ease(Math.min(1, raw));
    const at = x => p.arc.curve.getPoint(Math.min(1, Math.max(0, p.reverse ? 1 - x : x)));
    p.head.position.copy(at(e));
    p.halo.position.copy(p.head.position);
    p.trail.forEach((m, k) => m.position.copy(at(e - (k + 1) * 0.035)));
    if (raw >= 1) {
      scene.remove(p.g);
      packetPool.push(p);
      packets.splice(i, 1);
    }
  }

  // kafka slices: fall into place, flash, retire
  slices.forEach(s => {
    s.g.position.y += (s.target - s.g.position.y) * Math.min(1, dt * 7);
    s.fMat.opacity = s.eMat.opacity = Math.min(1, s.fMat.opacity + dt * 3);
    s.flash = Math.max(0, s.flash - dt * 1.2);
    s.fMat.color.copy(P.card).lerp(sliceColor(s.cls), s.flash * 0.35);
    s.g.rotation.y += dt * 0.15;
  });
  for (let i = dying.length - 1; i >= 0; i--) {
    const s = dying[i];
    s.dieT += dt * 2.5;
    s.g.scale.set(1 - s.dieT * 0.4, 1, 1 - s.dieT * 0.4);
    s.fMat.opacity = s.eMat.opacity = Math.max(0, 1 - s.dieT);
    if (s.dieT >= 1) { tower.remove(s.g); s.fMat.dispose(); s.eMat.dispose(); dying.splice(i, 1); }
  }

  // floor rings
  for (let i = rings.length - 1; i >= 0; i--) {
    const r = rings[i];
    const k = (now - r.t0) / r.dur;
    if (k < 0) continue;
    r.r.scale.setScalar(0.4 + (r.maxScale - 0.4) * ease(Math.min(1, k)));
    r.mat.opacity = Math.max(0, r.alpha * (1 - k));
    if (k >= 1) { scene.remove(r.r); r.mat.dispose(); rings.splice(i, 1); }
  }

  // selection marker hovers above the selected node
  const sel = nodes[state.selected];
  marker.visible = !!sel;
  if (sel) {
    const top = sel.isTower ? TOWER_TOP + 1.35 : sel.grp.position.y + sel.h / 2 + 1.25;
    marker.position.set(sel.grp.position.x, top + (REDUCED ? 0 : Math.sin(t * 3) * 0.08), sel.grp.position.z);
    marker.rotation.y = REDUCED ? 0 : t * 1.5;
  }

  // pointer parallax: the whole scene leans a little toward the cursor
  if (!REDUCED) {
    scene.rotation.x += (tilt.y * 0.05 - scene.rotation.x) * Math.min(1, dt * 4);
    scene.rotation.z += (-tilt.x * 0.035 - scene.rotation.z) * Math.min(1, dt * 4);
  }

  renderer.render(scene, camera);
}

/* Wait for the label font so canvas text isn't drawn in a fallback face */
await Promise.race([document.fonts?.ready, new Promise(r => setTimeout(r, 1500))]);
Object.values(nodes).forEach(n => {
  const fresh = n.isTower ? makeLabel('kafka · topic', 'career.events') : makeLabel(n.d.kind, n.d.label);
  fresh.position.copy(n.label.position);
  n.label.parent.add(fresh);
  n.label.parent.remove(n.label);
  n.label.material.map.dispose();
  n.label.material.dispose();
  n.label = fresh;
});
Object.values(nodes).forEach((n, i) => { n.intro = n.isTower ? 0 : 0.15 + i * 0.06; });

host.dataset.state = 'ready';
frame();

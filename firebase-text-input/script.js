const firebaseConfig = {
  apiKey: "AIzaSyCywtkCOa9IoMQHFuMt0HYQCblON92dfcg",
  authDomain: "iml300-firebase-demo-2046d.firebaseapp.com",
  projectId: "iml300-firebase-demo-2046d",
  storageBucket: "iml300-firebase-demo-2046d.firebasestorage.app",
  messagingSenderId: "114164794723",
  appId: "1:114164794723:web:4ba8370bf83e05a808ff56"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let dbRef = db.ref("text");

const chatContainer = document.getElementById("chat-container");
const entry = document.getElementById("text-input-entry");
const share = document.getElementById("text-input-submit");

// All active bubbles
const bubbles = [];

// Irregular blob border-radius shapes
const blobShapes = [
  "62% 38% 70% 30% / 45% 60% 40% 55%",
  "45% 55% 35% 65% / 60% 40% 55% 45%",
  "70% 30% 50% 50% / 40% 65% 35% 60%",
  "38% 62% 60% 40% / 55% 45% 65% 35%",
  "55% 45% 40% 60% / 35% 55% 45% 65%",
  "50% 50% 65% 35% / 60% 40% 50% 50%",
  "30% 70% 45% 55% / 50% 60% 40% 55%",
];

// Semi-transparent soft colors
const colors = [
  "rgba(255,255,255,0.30)",
  "rgba(200,225,255,0.32)",
  "rgba(180,215,255,0.35)",
  "rgba(220,240,255,0.28)",
  "rgba(160,205,240,0.38)",
];

let wordCount = 0;

function findTarget(w, h) {
  const pad = 40;
  const minX = w / 2 + pad;
  const maxX = window.innerWidth - w / 2 - pad;
  const minY = window.innerHeight * 0.15;
  const maxY = window.innerHeight * 0.78;

  for (let attempt = 0; attempt < 150; attempt++) {
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    const overlaps = bubbles.some(b => {
      const dx = Math.abs(b.targetX - x);
      const dy = Math.abs(b.targetY - y);
      return dx < (b.w + w) / 2 + pad && dy < (b.h + h) / 2 + pad;
    });
    if (!overlaps) return { x, y };
  }
  return {
    x: minX + Math.random() * (maxX - minX),
    y: minY + Math.random() * (maxY - minY)
  };
}

// Animate along a winding cubic bezier from bottom to target (~5 seconds)
function animateBalloonPath(bubble) {
  const { el, targetX, targetY } = bubble;
  const startX = window.innerWidth * (0.2 + Math.random() * 0.6);
  const startY = window.innerHeight + 80;

  const duration = 5000;
  const steps = 100;

  // Two control points that create a winding S-curve path
  const swing = 180 + Math.random() * 120;
  const dir = Math.random() < 0.5 ? 1 : -1;
  const cp1x = startX + dir * swing;
  const cp1y = startY * 0.5 + targetY * 0.5 + (Math.random() - 0.5) * 100;
  const cp2x = targetX - dir * swing * 0.6;
  const cp2y = targetY + (Math.random() - 0.5) * 80;

  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    pts.push({
      x: mt*mt*mt*startX + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*targetX,
      y: mt*mt*mt*startY + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*targetY,
    });
  }

  let step = 0;
  el.style.opacity = "0";
  el.style.visibility = "visible";
  const stepMs = duration / steps;

  const tick = setInterval(() => {
    if (step >= pts.length) {
      clearInterval(tick);
      bubble.x = targetX;
      bubble.y = targetY;
      bubble.vx = (Math.random() - 0.5) * 0.5;
      bubble.vy = (Math.random() - 0.5) * 0.3 - 0.1;
      bubble.settled = true;
      return;
    }
    const pt = pts[step];
    bubble.x = pt.x;
    bubble.y = pt.y;
    el.style.left = pt.x + "px";
    el.style.top  = pt.y + "px";
    el.style.opacity = step < 12 ? (step / 12).toFixed(2) : "1";
    step++;
  }, stepMs);
}

dbRef.on("child_added", gotText);

function gotText(data) {
  const value = data.val();
  if (!value || typeof value !== "string") return;

  const el = document.createElement("div");
  el.classList.add("response");
  el.textContent = value;
  el.style.visibility = "hidden";
  el.style.left = "-9999px";
  el.style.top = "0px";
  chatContainer.appendChild(el);

  const rect = el.getBoundingClientRect();
  const w = rect.width + 48;
  const h = rect.height + 32;

  const { x: targetX, y: targetY } = findTarget(w, h);

  el.style.borderRadius = blobShapes[wordCount % blobShapes.length];
  el.style.background   = colors[wordCount % colors.length];
  wordCount++;

  const bubble = {
    el, w, h, targetX, targetY,
    x: 0, y: 0, vx: 0, vy: 0, settled: false
  };
  bubbles.push(bubble);
  animateBalloonPath(bubble);
}

// ---- Physics loop ----
const flashSet = new Set();

function flashCollision(el) {
  if (flashSet.has(el)) return;
  flashSet.add(el);
  const orig = el.style.background;
  el.style.transition = "background 0.12s, box-shadow 0.12s";
  el.style.background = "rgba(255,255,255,0.70)";
  el.style.boxShadow = "0 0 18px rgba(255,255,255,0.7)";
  setTimeout(() => {
    el.style.background = orig;
    el.style.boxShadow = "";
    setTimeout(() => flashSet.delete(el), 400);
  }, 180);
}

function physicsLoop() {
  const active = bubbles.filter(b => b.settled);

  for (let i = 0; i < active.length; i++) {
    const a = active[i];

    // Random gentle drift force (larger amplitude than before)
    a.vx += (Math.random() - 0.5) * 0.10;
    a.vy += (Math.random() - 0.5) * 0.08;

    // Soft spring back toward home
    a.vx += (a.targetX - a.x) * 0.004;
    a.vy += (a.targetY - a.y) * 0.004;

    // Dampen
    a.vx *= 0.97;
    a.vy *= 0.97;

    // Speed cap
    const spd = Math.hypot(a.vx, a.vy);
    if (spd > 3.0) { a.vx *= 3.0 / spd; a.vy *= 3.0 / spd; }

    // Collision with other bubbles
    for (let j = i + 1; j < active.length; j++) {
      const b = active[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const minDist = (a.w + b.w) / 2.5;

      if (dist < minDist && dist > 0.5) {
        const overlap = (minDist - dist) / minDist;
        const nx = dx / dist;
        const ny = dy / dist;
        const push = overlap * 0.7;
        a.vx -= nx * push;
        a.vy -= ny * push;
        b.vx += nx * push;
        b.vy += ny * push;
        flashCollision(a.el);
        flashCollision(b.el);
      }
    }

    // Update position
    a.x += a.vx;
    a.y += a.vy;

    // Screen edges bounce
    const pad = 20;
    if (a.x < a.w / 2 + pad)                       { a.x = a.w / 2 + pad; a.vx *= -0.4; }
    if (a.x > window.innerWidth - a.w / 2 - pad)   { a.x = window.innerWidth - a.w / 2 - pad; a.vx *= -0.4; }
    if (a.y < a.h / 2 + pad)                        { a.y = a.h / 2 + pad; a.vy *= -0.4; }
    if (a.y > window.innerHeight - a.h / 2 - pad)  { a.y = window.innerHeight - a.h / 2 - pad; a.vy *= -0.4; }

    a.el.style.left = a.x + "px";
    a.el.style.top  = a.y + "px";
  }

  requestAnimationFrame(physicsLoop);
}

physicsLoop();

// ---- Form ----
document.getElementById("text-input-submit").addEventListener("click", submitText);
const textContainerElement = document.getElementById("text-input-entry");

function submitText() {
  const text = textContainerElement.value;
  if (!text.trim()) return;
  const newKey = dbRef.push().key;
  const updates = {};
  updates[newKey] = text;
  dbRef.update(updates);
}

function submitlock() {
  entry.remove();
  share.value = "Thanks for telling me.";
  share.disabled = true;
  share.style.width = "70%";
}

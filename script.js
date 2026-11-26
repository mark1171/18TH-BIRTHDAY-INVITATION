/* =========================================================
   EDIT THIS BLOCK — everything personal lives here
   ========================================================= */
const CONFIG = {
  eventDate: "2027-02-26T18:00:00+08:00",              // party start (Philippine time)
  mapsQuery: "Starlight Garden Events Place, San Jose del Monte, Bulacan",
  rsvpUrl:   "https://forms.gle/your-form-link",       // your Google Form link
  roses: [
    "Adrian Cruz","Brian Reyes","Carlo Mendoza","Daniel Santos","Ethan Navarro","Francis Bautista",
    "Gabriel Aquino","Harvey Flores","Ian Ramos","Joshua Dela Cruz","Kevin Torres","Luis Villanueva",
    "Marco Castillo","Noel Garcia","Oscar Mercado","Paolo Lim","Ryan Tan","Sean Domingo"
  ],
  candles: [
    "Angela Cruz","Bianca Reyes","Carla Mendoza","Denise Santos","Eliza Navarro","Faith Bautista",
    "Gwen Aquino","Hannah Flores","Isabel Ramos","Jasmine Dela Cruz","Kyla Torres","Lara Villanueva",
    "Mika Castillo","Nina Garcia","Olivia Mercado","Patricia Lim","Queenie Tan","Rhea Domingo"
  ]
};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- links ---------- */
$("#mapsLink").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery);
$("#rsvpLink").href = CONFIG.rsvpUrl;

/* ---------- starfield ---------- */
(function stars(){
  const c = $("#stars"), ctx = c.getContext("2d");
  let w, h, dots = [];
  function size(){
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr;
    dots = Array.from({length: Math.round(innerWidth * innerHeight / 7000)}, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: (Math.random() * 1.3 + .3) * dpr,
      p: Math.random() * Math.PI * 2, s: Math.random() * .02 + .005,
      hue: Math.random() < .5 ? "230,220,255" : "169,196,255"
    }));
    draw(0);
  }
  function draw(t){
    ctx.clearRect(0, 0, w, h);
    for (const d of dots){
      const a = reduceMotion ? .7 : .35 + .6 * Math.abs(Math.sin(d.p + t * d.s * .06));
      ctx.fillStyle = `rgba(${d.hue},${a})`;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  addEventListener("resize", size); size();
})();


/* ---------- confetti ---------- */
const confetti = (function(){
  const c = $("#confetti"), ctx = c.getContext("2d");
  const colors = ["#7c3aed","#a78bfa","#2f6bff","#a9c4ff","#e4dcff","#ffffff","#5b3df5"];
  let parts = [], raf = 0, dpr = 1;
  function size(){ dpr = Math.min(devicePixelRatio || 1, 2); c.width = innerWidth * dpr; c.height = innerHeight * dpr; }
  addEventListener("resize", size); size();

  function burst(x, y, count = 140){
    if (reduceMotion) return;
    for (let i = 0; i < count; i++){
      const a = Math.random() * Math.PI * 2, v = (Math.random() * 9 + 4) * dpr;
      parts.push({
        x: x * dpr, y: y * dpr,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5 * dpr,
        w: (Math.random() * 7 + 5) * dpr, h: (Math.random() * 4 + 3) * dpr,
        rot: Math.random() * 6.28, vr: (Math.random() - .5) * .35, ph: Math.random() * 6.28, tilt: Math.random() * .6,
        color: colors[(Math.random() * colors.length) | 0],
        round: Math.random() < .3, life: 0, max: 130 + Math.random() * 70
      });
    }
    if (!raf) raf = requestAnimationFrame(step);
  }
  function step(){
    ctx.clearRect(0, 0, c.width, c.height);
    parts = parts.filter(p => p.life < p.max && p.y < c.height + 40);
    for (const p of parts){
      p.life++; p.vx *= .985; p.vy = p.vy * .985 + .22 * dpr;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot + Math.sin(p.ph) * p.tilt);
      ctx.globalAlpha = Math.min(1, (p.max - p.life) / 30);
      ctx.fillStyle = p.color;
      if (p.round){ ctx.beginPath(); ctx.arc(0, 0, p.h * .7, 0, 6.28); ctx.fill(); }
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    raf = parts.length ? requestAnimationFrame(step) : 0;
    if (!raf) ctx.clearRect(0, 0, c.width, c.height);
  }
  return { burst };
})();

/* ---------- butterflies ---------- */
const butterflies = (function(){
  if (reduceMotion) return { start(){}, intro(){ return null; }, flee(){} };
  const SKINS = [["gB","gC"],["gA","gB"],["gC","gD"]];
  const rand = (a, b) => a + Math.random() * (b - a);

  function art([up, low]){
    const half = `<path d="M31 28 C39 8 58 5 56 20 C55 29 42 33 31 31Z" fill="url(#${up})"/>
      <path d="M31 33 C42 34 53 38 49 48 C46 55 36 51 31 37Z" fill="url(#${low})"/>
      <circle cx="47" cy="19" r="2.6" fill="#e4dcff" fill-opacity=".85" stroke="none"/>
      <circle cx="42" cy="46" r="2" fill="#e4dcff" fill-opacity=".7" stroke="none"/>`;
    return `<svg viewBox="0 0 60 60" aria-hidden="true">
      <g class="wings" stroke="#e4dcff" stroke-opacity=".5" stroke-width=".6" stroke-linejoin="round">
        <g>${half}</g><g transform="matrix(-1 0 0 1 60 0)">${half}</g>
      </g>
      <path d="M29 22 C27 17 25 15 22 14 M31 22 C33 17 35 15 38 14" fill="none" stroke="#a78bfa" stroke-width=".9" stroke-linecap="round"/>
      <ellipse cx="30" cy="31" rx="1.9" ry="8.5" fill="#2a1670" stroke="#a78bfa" stroke-width=".6"/>
      <circle cx="30" cy="22" r="2.2" fill="#2a1670" stroke="#a78bfa" stroke-width=".6"/>
    </svg>`;
  }

  const list = [];
  function make(i){
    const el = document.createElement("div");
    el.className = "bfly";
    el.innerHTML = art(SKINS[i % SKINS.length]);
    document.body.append(el);
    const b = { el, x: 0, y: 0, vx: 0, vy: 0, rot: 0, ph: Math.random() * 6.28,
                speed: rand(65, 95), state: "gone", until: 0, tx: 0, ty: 0, sy: 0 };
    el.addEventListener("click", () => flee(b));
    list.push(b);
    return b;
  }

  function pickSpot(b){
    const m = 56;
    let tx, ty, tries = 0;
    do {
      tx = rand(m, innerWidth - m); ty = rand(m + 40, innerHeight - m);
    } while (Math.hypot(tx - b.x, ty - b.y) < 160 && ++tries < 8);
    b.tx = tx; b.ty = ty;
  }

  function spawn(b){                       // fly in from a random screen edge
    const side = (Math.random() * 4) | 0, m = 70;
    b.x = side === 0 ? -m : side === 1 ? innerWidth + m : rand(0, innerWidth);
    b.y = side === 2 ? -m : side === 3 ? innerHeight + m : rand(0, innerHeight);
    b.vx = b.vy = 0; b.state = "fly";
    b.el.classList.remove("perched", "fleeing"); b.el.classList.add("on");
    pickSpot(b);
  }
  function land(b){
    b.state = "perch"; b.vx = b.vy = 0;
    b.until = performance.now() + rand(3500, 8000);
    b.sy = scrollY;
    b.el.classList.add("perched");
  }
  function takeoff(b){
    b.state = "fly"; b.el.classList.remove("perched");
    pickSpot(b);
  }
  function flee(b){
    if (!b || b.state === "flee") return;
    b.anchor = null;
    b.state = "flee"; b.el.classList.remove("perched"); b.el.classList.add("fleeing");
    const a = rand(-2.6, -.55);            // mostly upward, any side
    b.tx = b.x + Math.cos(a) * 2500; b.ty = b.y + Math.sin(a) * 2500;
    b.fleeSpeed = rand(380, 460);
  }
  function vanish(b){
    if (b.once){ b.el.remove(); list.splice(list.indexOf(b), 1); return; }   // the envelope butterfly leaves for good
    b.state = "gone"; b.el.classList.remove("on", "fleeing");
    b.until = performance.now() + rand(5000, 9000);
  }

  function update(b, dt, now){
    if (b.state === "gone"){ if (now > b.until) spawn(b); return; }
    if (b.state === "perch"){
      if (b.anchor){ const p = b.anchor(); b.x = p.x; b.y = p.y; return; }   // stay glued to the envelope
      if (now > b.until || Math.abs(scrollY - b.sy) > 120) takeoff(b);   // scrolling startles it
      return;
    }
    const fleeing = b.state === "flee";
    const dx = b.tx - b.x, dy = b.ty - b.y, d = Math.hypot(dx, dy) || 1;
    const ease = fleeing ? 1 : Math.min(1, d / 110);                       // slow down + calm wobble when landing
    const speed = (fleeing ? b.fleeSpeed : b.speed) * Math.max(.3, ease);
    b.ph += dt * 5;
    const wob = fleeing ? 0 : (Math.sin(b.ph) * 55 + Math.sin(b.ph * .37) * 25) * ease;
    const tvx = dx / d * speed - dy / d * wob;
    const tvy = dy / d * speed + dx / d * wob;
    const k = Math.min(1, dt * (fleeing ? 6 : 2.5));
    b.vx += (tvx - b.vx) * k; b.vy += (tvy - b.vy) * k;
    b.x += b.vx * dt; b.y += b.vy * dt;

    const ang = Math.atan2(b.vy, b.vx) * 180 / Math.PI + 90;               // artwork faces up
    b.rot += (((ang - b.rot + 540) % 360) - 180) * Math.min(1, dt * 6);

    if (!fleeing && d < 12) land(b);
    if (fleeing && (b.x < -90 || b.x > innerWidth + 90 || b.y < -90 || b.y > innerHeight + 90)) vanish(b);
  }

  let looping = false, started = false;
  function loop(){
    if (looping) return; looping = true;
    let last = performance.now();
    (function frame(now){
      const dt = Math.min(.05, (now - last) / 1000) || 0; last = now;
      for (const b of [...list]){
        update(b, dt, now);
        b.el.style.transform = `translate(${b.x.toFixed(1)}px,${b.y.toFixed(1)}px) rotate(${b.rot.toFixed(1)}deg)`;
      }
      requestAnimationFrame(frame);
    })(last);
  }

  function start(){
    if (started) return; started = true;
    const n = innerWidth < 600 ? 2 : 3;
    for (let i = 0; i < n; i++){
      const b = make(i);
      b.until = performance.now() + i * 1800;                              // staggered arrival
    }
    loop();
  }

  // one butterfly resting on the envelope's upper-left corner until clicked
  function intro(anchor){
    const b = make(0);
    b.once = true; b.anchor = anchor;
    const p = anchor(); b.x = p.x; b.y = p.y; b.rot = -25;
    b.state = "perch"; b.until = Infinity;
    b.el.classList.add("intro-bfly", "on", "perched");
    loop();
    return b;
  }
  return { start, intro, flee };
})();

/* ---------- envelope open ---------- */
const root = document.documentElement;
root.classList.add("locked");
const intro = $("#intro"), env = $("#env");
const envBfly = butterflies.intro(() => {
  const r = env.getBoundingClientRect();
  return { x: r.left + 20, y: r.top + 2 };                                 // upper-left of the envelope
});
let opened = false;
function openInvite(){
  if (opened) return; opened = true;
  intro.classList.add("opened");
  butterflies.flee(envBfly);                                               // fly away if it's still there
  const sr = $(".seal").getBoundingClientRect();
  confetti.burst(sr.left + sr.width / 2, sr.top + sr.height / 2, 160);
  const wait = reduceMotion ? 50 : 2300;
  setTimeout(() => {
    intro.classList.add("gone");
    root.classList.remove("locked");
    scrollTo(0, 0);
    document.body.classList.add("show");
    confetti.burst(innerWidth * .2, innerHeight * .35, 70);
    confetti.burst(innerWidth * .8, innerHeight * .35, 70);
    butterflies.start();
  }, wait);
}
env.addEventListener("click", openInvite);
env.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openInvite(); } });

/* ---------- countdown ---------- */
(function countdown(){
  const target = new Date(CONFIG.eventDate).getTime();
  const pad = n => String(n).padStart(2, "0");
  function tick(){
    const diff = target - Date.now();
    if (diff <= 0){
      $("#count").outerHTML = '<p class="count-done">Tonight is the night</p>';
      return clearInterval(timer);
    }
    $("#cd-d").textContent = pad(Math.floor(diff / 864e5));
    $("#cd-h").textContent = pad(Math.floor(diff / 36e5) % 24);
    $("#cd-m").textContent = pad(Math.floor(diff / 6e4) % 60);
    $("#cd-s").textContent = pad(Math.floor(diff / 1e3) % 60);
  }
  const timer = setInterval(tick, 1000); tick();
})();

/* ---------- gallery lightbox ---------- */
(function lightbox(){
  const dlg = $("#lightbox"), holder = $("#lbIn");
  $$(".gallery .frame").forEach(btn => btn.addEventListener("click", () => {
    holder.innerHTML = "";
    const img = $("img", btn);
    if (img){ const big = new Image(); big.src = img.src; big.alt = img.alt; holder.append(big); }
    dlg.showModal();
  }));
  $("#lbClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
})();

/* ---------- roses + candles ---------- */
const fill = (id, names) => { $(id).innerHTML = names.map(n => `<li>${n}</li>`).join(""); };
fill("#roses", CONFIG.roses);
fill("#candles", CONFIG.candles);
(function tabs(){
  const pairs = [["#tab-roses", "#panel-roses"], ["#tab-candles", "#panel-candles"]];
  // Only wire up tabs that exist, so removing the Candles tab from the HTML causes no errors
  const live = pairs.filter(([t, pp]) => $(t) && $(pp));
  live.forEach(([t]) => $(t).addEventListener("click", () => {
    live.forEach(([tt, pp]) => {
      const on = tt === t;
      $(tt).setAttribute("aria-selected", on);
      $(pp).hidden = !on;
    });
  }));
})();


/* ---------- falling petals ---------- */
(function petals(){
  if (reduceMotion) return;
  const c = $("#petals"), ctx = c.getContext("2d");
  const colors = ["167,139,250","124,92,255","169,196,255","228,220,255","91,123,255"];
  let w, h, dpr, list = [];
  function size(){
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr;
    const n = innerWidth < 600 ? 14 : 24;
    list = Array.from({length: n}, () => make(true));
  }
  function make(anywhere){
    return {
      x: Math.random() * w, y: anywhere ? Math.random() * h : -20 * dpr,
      s: (Math.random() * 5 + 5) * dpr,                    // petal size
      vy: (Math.random() * .3 + .22) * dpr,                // fall speed (lower = slower)
      sway: (Math.random() * 30 + 15) * dpr, ph: Math.random() * 6.28, f: Math.random() * .012 + .006,
      rot: (Math.random() - .5) * .9, tilt: Math.random() * .25 + .15,   // small rock, no spinning
      col: colors[(Math.random() * colors.length) | 0], a: Math.random() * .35 + .3
    };
  }
  function petal(p){
    ctx.save(); ctx.translate(p.x + Math.sin(p.ph) * p.sway, p.y); ctx.rotate(p.rot);
    ctx.scale(1, .8 + .2 * Math.cos(p.ph));                // little flutter
    ctx.fillStyle = `rgba(${p.col},${p.a})`;
    const s = p.s; ctx.beginPath(); ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * .9, -s * .5, s * .7, s * .7, 0, s);
    ctx.bezierCurveTo(-s * .7, s * .7, -s * .9, -s * .5, 0, -s); ctx.fill(); ctx.restore();
  }
  function frame(){
    ctx.clearRect(0, 0, w, h);
    list.forEach((p, i) => {
      p.y += p.vy; p.ph += p.f * 3.5;
      if (p.y > h + 20 * dpr) list[i] = make(false);
      petal(p);
    });
    requestAnimationFrame(frame);
  }
  addEventListener("resize", size); size(); frame();
})();


/* ---------- twisted ribbons around the frames ----------
   Two satin ribbons weave around the edge of the portrait and gallery frames.
   Tweak the look here: */
(function frameRibbons(){
  const NS = "http://www.w3.org/2000/svg";
  const STRANDS = [
    { edge: "#4c1fd0", core: "#c9b8ff" },      // violet ribbon
    { edge: "#1f4fd0", core: "#a9c4ff" }       // blue ribbon
  ];
  const H = Math.PI / 2, clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function outline(kind, w, h){                // points going once around the frame edge
    const P = [], step = 2;
    const line = (x0, y0, x1, y1) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let i = 0; i < n; i++) P.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); };
    const arc = (cx, cy, rx, ry, a0, a1) => { const n = Math.max(2, Math.round(Math.abs(a1 - a0) * Math.max(rx, ry) / step));
      for (let i = 0; i < n; i++){ const a = a0 + (a1 - a0) * i / n; P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } };
    if (kind === "ellipse") arc(w / 2, h / 2, w / 2, h / 2, H, H + 4 * H);
    else {
      const rb = kind === "arch" ? 10 : 14, rt = kind === "arch" ? w / 2 : 14;
      line(w / 2, h, rb, h);        arc(rb, h - rb, rb, rb, H, 2 * H);
      line(0, h - rb, 0, rt);       arc(rt, rt, rt, rt, 2 * H, 3 * H);
      line(rt, 0, w - rt, 0);       arc(w - rt, rt, rt, rt, 3 * H, 4 * H);
      line(w, rt, w, h - rb);       arc(w - rb, h - rb, rb, rb, 0, H);
      line(w - rb, h, w / 2, h);
    }
    return P;
  }

  function build(fr){
    fr.querySelector(":scope > .rib")?.remove();
    const w = fr.offsetWidth, h = fr.offsetHeight;
    if (w < 60 || h < 60) return;
    const kind = fr.classList.contains("arch") ? "arch" : (fr.classList.contains("oval") || fr.classList.contains("round")) ? "ellipse" : "rect";
    const A = clamp(w * .032, 4, 9), rw = clamp(w * .024, 3.4, 6.2), m = Math.ceil(A + rw + 3);
    const P = outline(kind, w, h), n = P.length;
    const cum = [0]; for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const total = cum[n - 1] + Math.hypot(P[0][0] - P[n - 1][0], P[0][1] - P[n - 1][1]);
    const N = Math.max(3, Math.round(total / clamp(w * .3, 34, 80)));         // full waves around the frame
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "rib"); svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("viewBox", `${-m} ${-m} ${w + 2 * m} ${h + 2 * m}`);
    svg.style.cssText = `left:${-m}px;top:${-m}px;width:${w + 2 * m}px;height:${h + 2 * m}px`;

    const pts = [[], []];                                                     // each strand's displaced points + wave index
    for (let i = 0; i < n; i++){
      const a = P[(i + 1) % n], b = P[(i - 1 + n) % n];
      let tx = a[0] - b[0], ty = a[1] - b[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      const nx = ty, ny = -tx;                                                // outward normal
      const ph = 2 * Math.PI * N * cum[i] / total, off = A * Math.sin(ph), half = Math.floor(ph / Math.PI);
      pts[0].push([P[i][0] + nx * off, P[i][1] + ny * off, half]);
      pts[1].push([P[i][0] - nx * off, P[i][1] - ny * off, half]);
    }
    const segs = [];                                                          // split each strand at the crossings
    pts.forEach((arr, si) => {
      let cur = [arr[0]];
      for (let i = 1; i <= n; i++){
        const p = arr[i % n];
        if (p[2] !== cur[0][2] && i < n){ cur.push(p); segs.push({ si, half: cur[0][2], pts: cur }); cur = [p]; }
        else cur.push(p);
      }
      segs.push({ si, half: cur[0][2], pts: cur });
    });
    const over = s => (s.half + s.si) % 2 === 0;                              // alternate which ribbon is on top
    [...segs.filter(s => !over(s)), ...segs.filter(over)].forEach(s => {
      const d = "M" + s.pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L");
      [[STRANDS[s.si].edge, rw + 2, 1], [STRANDS[s.si].core, rw, 1], ["#fff", Math.max(.8, rw * .2), .75]].forEach(([col, sw, op]) => {
        const p = document.createElementNS(NS, "path");
        p.setAttribute("d", d); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
        p.setAttribute("stroke-width", sw.toFixed(1)); p.setAttribute("stroke-opacity", op);
        p.setAttribute("stroke-linejoin", "round"); svg.append(p);
      });
    });
    fr.append(svg);
  }

  const frames = $$(".portrait .frame");
  const ro = new ResizeObserver(es => es.forEach(e => build(e.target)));
  frames.forEach(f => ro.observe(f));
})();

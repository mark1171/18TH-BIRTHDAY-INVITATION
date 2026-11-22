/* =========================================================
   EDIT THIS BLOCK — everything personal lives here
   ========================================================= */
const CONFIG = {
  eventDate: "2027-01-16T18:00:00+08:00",              // party start (Philippine time)
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
        rot: Math.random() * 6.28, vr: (Math.random() - .5) * .35,
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
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
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

/* ---------- envelope open ---------- */
const root = document.documentElement;
root.classList.add("locked");
const intro = $("#intro"), env = $("#env");
let opened = false;
function openInvite(){
  if (opened) return; opened = true;
  intro.classList.add("opened");
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
  pairs.forEach(([t]) => $(t).addEventListener("click", () => {
    pairs.forEach(([tt, pp]) => {
      const on = tt === t;
      $(tt).setAttribute("aria-selected", on);
      $(pp).hidden = !on;
    });
  }));
})();

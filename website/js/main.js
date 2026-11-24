/* =========================================================
   Hashtag Coffee – Capitol Site | Site behaviour
   Every feature checks that its elements exist first, so the
   same file works on all four pages.
   ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const peso = n => "₱" + n.toLocaleString("en-PH");

/* Safe localStorage helpers (private windows can block storage) */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  },
};

/* ---------- Toast message ---------- */
function toast(msg) {
  let t = $(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- Header: sticky shadow, mobile menu, back-to-top ---------- */
function initHeader() {
  const header = $(".site-header");
  const toggle = $(".menu-toggle");
  const links = $(".nav-links");
  const toTop = $(".to-top");

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 10);
    toTop?.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });

  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    links.classList.toggle("open", !open);
  });
  $$(".nav-links a").forEach(a => a.addEventListener("click", () => {
    toggle?.setAttribute("aria-expanded", "false");
    links?.classList.remove("open");
  }));

  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- Open / closed status + hours table ---------- */
const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const to12 = t => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

function initHours() {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = HOURS[day];
  const yesterday = HOURS[(day + 6) % 7];
  const overnight = h => toMin(h.close) <= toMin(h.open);   // closes after midnight

  // Open if inside today's hours, or still inside last night's late hours
  let isOpen = false, closesAt;
  if (overnight(yesterday) && mins < toMin(yesterday.close)) { isOpen = true; closesAt = yesterday.close; }
  else if (mins >= toMin(today.open) && (overnight(today) || mins < toMin(today.close))) { isOpen = true; closesAt = today.close; }

  $$("[data-open-status]").forEach(el => {
    el.querySelector(".status-dot")?.classList.add(isOpen ? "open" : "closed");
    const label = el.querySelector(".status-text");
    if (label) label.textContent = isOpen
      ? `Open now · until ${to12(closesAt)}`
      : mins < toMin(today.open)
        ? `Closed now · opens today ${to12(today.open)}`
        : `Closed now · opens tomorrow ${to12(HOURS[(day + 1) % 7].open)}`;
  });

  $$("[data-hours-table]").forEach(table => {
    const order = [1, 2, 3, 4, 5, 6, 0]; // Monday first
    table.innerHTML = order.map(i => {
      const h = HOURS[i];
      return `<tr class="${i === day ? "today" : ""}"><td>${h.day}${i === day ? " (today)" : ""}</td><td>${to12(h.open)} – ${to12(h.close)}</td></tr>`;
    }).join("");
  });
}

/* ---------- Menu helpers ---------- */
const groupOf = item => GROUPS.find(g => g.id === item.group);
const catOf = item => groupOf(item).cat;
const findItem = id => MENU.find(m => m.id === id);
// Label for a price column, e.g. "S" or "Platter" (empty when there is only one price)
const sizeLabel = (item, i) => item.prices.length > 1 ? (groupOf(item).sizes || [])[i] || "" : "";

/* ---------- Dish cards (items with a photo) ---------- */
function dishCard(item) {
  const name = item.card || item.name;
  // Ribs come in three sizes; the card shows the lowest starting price
  const price = item.card
    ? "from " + peso(Math.min(...MENU.filter(m => m.name.startsWith(item.card)).map(m => m.prices[0])))
    : item.prices.length > 1 ? `${peso(item.prices[0])}+` : peso(item.prices[0]);
  return `
    <article class="dish-card reveal">
      <div class="dish-img">
        <img src="${item.img}" alt="${name}" loading="lazy" width="800" height="600">
        <span class="tag">${item.tag}</span>
      </div>
      <div class="dish-body">
        <div class="dish-top"><h3>${name}</h3><span class="price">${price}</span></div>
        <p class="dish-desc">${item.desc}</p>
        <div class="dish-meta">
          <span class="chips">${groupOf(item).name}${item.best ? ' <span class="tag tag-purple">Best seller</span>' : ""}</span>
          <button class="btn btn-outline btn-sm" data-add="${item.id}" data-size="0" aria-label="Add ${name} to my order">+ Add</button>
        </div>
      </div>
    </article>`;
}

function initFeatured() {
  const grid = $("#featured-grid");
  if (!grid) return;
  grid.innerHTML = MENU.filter(i => i.featured).slice(0, 6).map(dishCard).join("");
}

/* ---------- Menu page: filters, search, photo cards and full menu board ---------- */
function initMenuPage() {
  const grid = $("#menu-grid");
  const board = $("#menu-board");
  if (!grid || !board) return;
  const tabs = $("#filter-tabs");
  const search = $("#menu-search");
  const count = $("#menu-count");
  let cat = new URLSearchParams(location.search).get("cat") || "all";
  if (!CATEGORIES[cat]) cat = "all";

  tabs.innerHTML = Object.entries(CATEGORIES)
    .map(([key, label]) => `<button type="button" data-cat="${key}" aria-pressed="${key === cat}">${label}</button>`).join("");

  function boardRow(item) {
    const buttons = item.priceText
      ? `<button type="button" class="price-btn" data-add="${item.id}" data-size="0" aria-label="Add ${item.name}, ${item.priceText}">${item.priceText}</button>`
      : item.prices.map((p, i) => {
          const label = sizeLabel(item, i);
          return `<button type="button" class="price-btn" data-add="${item.id}" data-size="${i}" aria-label="Add ${item.name}${label ? " " + label : ""} for ${peso(p)}">${label ? `<small>${label}</small> ` : ""}${peso(p)}</button>`;
        }).join("");
    return `<li><span class="board-name">${item.name}${item.best ? ' <span class="board-star" title="Best seller">★</span>' : ""}</span><span class="dots"></span><span class="board-prices">${buttons}</span></li>`;
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const items = MENU.filter(i =>
      (cat === "all" || catOf(i) === cat) &&
      (!q || (i.name + " " + groupOf(i).name + " " + (i.desc || "")).toLowerCase().includes(q)));

    const photos = items.filter(i => i.img);
    grid.innerHTML = photos.map(dishCard).join("");
    $("#favorites-head").hidden = !photos.length;

    board.innerHTML = items.length ? GROUPS.map(g => {
      const rows = items.filter(i => i.group === g.id);
      if (!rows.length) return "";
      return `<section class="board-group"><h3>${g.name}</h3>${g.note ? `<p class="board-note">${g.note}</p>` : ""}<ul class="board-list">${rows.map(boardRow).join("")}</ul></section>`;
    }).join("") : `<p class="board-empty">No items match “${search.value}”. Try another word or category.</p>`;

    count.textContent = `${items.length} item${items.length === 1 ? "" : "s"} · tap any price to add it to your order`;
    observeReveal();
  }

  tabs.addEventListener("click", e => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    cat = btn.dataset.cat;
    $$("button", tabs).forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
    render();
  });
  search.addEventListener("input", render);
  render();
}

/* ---------- Order tray (build-your-order estimator) ---------- */
function initOrder() {
  const tray = $("#order-tray");
  const overlay = $(".overlay");
  const list = $("#tray-items");
  const totalEl = $("#tray-total");
  const counts = $$(".order-count");
  const KEY = "hc-order-v2";
  let order = store.get(KEY, {});            // { "itemId|sizeIndex": quantity }

  const parse = key => { const [id, s] = key.split("|"); return { item: findItem(id), size: Number(s) || 0 }; };
  const unitPrice = ({ item, size }) => item.prices[size] ?? item.prices[0];
  const label = p => `${p.item.card || p.item.name}${sizeLabel(p.item, p.size) ? ` (${sizeLabel(p.item, p.size)})` : ""}`;
  function save() { store.set(KEY, order); }
  function render() {
    const entries = Object.entries(order).filter(([key, q]) => q > 0 && parse(key).item);
    const qty = entries.reduce((s, [, q]) => s + q, 0);
    counts.forEach(c => { c.textContent = qty; c.dataset.count = qty; });
    if (!list) return;
    list.innerHTML = entries.length ? entries.map(([key, q]) => {
      const p = parse(key);
      return `<li><span>${label(p)}<br><small style="color:var(--muted)">${p.item.priceText ? "from " : ""}${peso(unitPrice(p))} each</small></span>
        <span class="qty"><button type="button" data-dec="${key}" aria-label="Remove one">−</button>${q}<button type="button" data-inc="${key}" aria-label="Add one">+</button></span></li>`;
    }).join("") : `<li><p>Your order is empty. Tap “+ Add” or any price on the menu to start planning your visit.</p></li>`;
    totalEl.textContent = peso(entries.reduce((s, [key, q]) => s + unitPrice(parse(key)) * q, 0));
  }
  function open() { tray?.classList.add("open"); overlay?.classList.add("show"); tray?.setAttribute("aria-hidden", "false"); $(".tray-head button", tray)?.focus(); }
  function close() { tray?.classList.remove("open"); overlay?.classList.remove("show"); tray?.setAttribute("aria-hidden", "true"); }

  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    if (add) {
      const key = `${add.dataset.add}|${add.dataset.size || 0}`;
      order[key] = (order[key] || 0) + 1; save(); render();
      toast(`${label(parse(key))} added to your order`);
    }
    if (inc) { order[inc.dataset.inc]++; save(); render(); }
    if (dec) { order[dec.dataset.dec]--; if (order[dec.dataset.dec] <= 0) delete order[dec.dataset.dec]; save(); render(); }
    if (e.target.closest(".order-btn")) open();
    if (e.target.closest("[data-close-tray]") || e.target === overlay) close();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

  $("#clear-order")?.addEventListener("click", () => { order = {}; save(); render(); toast("Order cleared"); });
  render();
}

/* ---------- Gallery lightbox ---------- */
function initLightbox() {
  const items = $$(".gallery button");
  const box = $(".lightbox");
  if (!items.length || !box) return;
  const img = $("img", box);
  const cap = $("figcaption", box);
  let index = 0;

  function show(i) {
    index = (i + items.length) % items.length;
    const src = items[index].querySelector("img");
    img.src = src.dataset.full || src.src;
    img.alt = src.alt;
    cap.textContent = src.alt;
  }
  items.forEach((btn, i) => btn.addEventListener("click", () => { show(i); box.classList.add("open"); $(".lb-close", box).focus(); }));
  $(".lb-close", box).addEventListener("click", () => box.classList.remove("open"));
  $(".lb-prev", box).addEventListener("click", () => show(index - 1));
  $(".lb-next", box).addEventListener("click", () => show(index + 1));
  box.addEventListener("click", e => { if (e.target === box) box.classList.remove("open"); });
  document.addEventListener("keydown", e => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") box.classList.remove("open");
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
}

/* ---------- Form validation ---------- */
function validate(form) {
  let ok = true;
  $$("[required]", form).forEach(input => {
    const field = input.closest(".field");
    let valid = input.checkValidity();
    if (input.type === "date" && input.value) {
      const picked = new Date(input.value + "T23:59");
      if (picked < new Date()) valid = false;
    }
    field?.classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  if (!ok) $(".invalid input, .invalid select, .invalid textarea", form)?.focus();
  return ok;
}

function initForms() {
  $$("form[data-validate]").forEach(form => {
    $$("input, select, textarea", form).forEach(el =>
      el.addEventListener("input", () => el.closest(".field")?.classList.remove("invalid")));

    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!validate(form)) return;
      const data = Object.fromEntries(new FormData(form));
      const success = $(".form-success", form);
      if (form.id === "reserve-form") {
        const when = new Date(data.date + "T" + data.time).toLocaleString("en-PH", { dateStyle: "long", timeStyle: "short" });
        success.textContent = `Thank you, ${data.name}! Your table for ${data.guests} on ${when} is noted. We will confirm by text at ${data.phone}.`;
      } else {
        success.textContent = `Thanks, ${data.name}! Your message was received. We usually reply within one day.`;
      }
      success.classList.add("show");
      form.reset();
    });
  });

  // Reservation date cannot be in the past
  const date = $("#res-date");
  if (date) {
    const d = new Date();
    date.min = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  // Newsletter
  $$(".newsletter").forEach(form => form.addEventListener("submit", e => {
    e.preventDefault();
    const input = $("input", form);
    if (!input.checkValidity()) { toast("Please enter a valid email address"); return; }
    form.reset();
    toast("You're on the list! Watch out for promos ☕");
  }));
}

/* ---------- Visitor feedback (star rating) ---------- */
function initFeedback() {
  const form = $("#feedback-form");
  if (!form) return;
  const wall = $("#feedback-wall");
  const summary = $("#rating-summary");
  let entries = store.get("hc-feedback", []);

  function render() {
    if (!entries.length) { summary.textContent = "Be the first to rate us from this site!"; wall.innerHTML = ""; return; }
    const avg = entries.reduce((s, f) => s + f.stars, 0) / entries.length;
    summary.textContent = `Your ratings on this device: ${avg.toFixed(1)} ★ from ${entries.length} review${entries.length > 1 ? "s" : ""}`;
    wall.innerHTML = entries.slice(-3).reverse().map(f => `
      <article class="review"><div class="stars">${"★".repeat(f.stars)}${"☆".repeat(5 - f.stars)}</div>
      <p></p><strong></strong></article>`).join("");
    // Insert user text safely as text, not HTML
    $$(".review", wall).forEach((card, i) => {
      const f = entries.slice(-3).reverse()[i];
      card.querySelector("p").textContent = `“${f.text}”`;
      card.querySelector("strong").textContent = f.name || "Guest";
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const stars = Number(new FormData(form).get("stars"));
    const text = $("#fb-text", form).value.trim();
    if (!stars) { toast("Please pick a star rating first"); return; }
    if (text.length < 3) { toast("Tell us a little about your visit"); $("#fb-text", form).focus(); return; }
    entries.push({ stars, text: text.slice(0, 240), name: $("#fb-name", form).value.trim().slice(0, 40) });
    store.set("hc-feedback", entries);
    form.reset();
    render();
    toast("Salamat! Thanks for the feedback ★");
  });
  render();
}

/* ---------- Promo video: play button overlay ---------- */
function initVideo() {
  $$("video[data-promo]").forEach(v => {
    v.addEventListener("error", () => v.closest(".video-wrap")?.classList.add("video-error"));
  });
}

/* ---------- Scroll reveal & count-up ---------- */
let revealObserver;
function observeReveal() {
  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach(el => el.classList.add("visible")); return; }
  revealObserver ||= new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("visible"); revealObserver.unobserve(en.target); }
  }), { threshold: 0.12 });
  $$(".reveal:not(.visible)").forEach(el => revealObserver.observe(el));
}

function initCounters() {
  const nums = $$("[data-count-to]");
  if (!nums.length) return;
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = Number(el.dataset.countTo), suffix = el.dataset.suffix || "";
    const start = performance.now();
    const step = t => {
      const p = Math.min((t - start) / 1200, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    io.unobserve(el);
  }), { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initHours();
  initFeatured();
  initMenuPage();
  initOrder();
  initLightbox();
  initForms();
  initFeedback();
  initVideo();
  observeReveal();
  initCounters();
});

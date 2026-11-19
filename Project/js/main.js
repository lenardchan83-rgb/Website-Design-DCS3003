const PAGE = document.body.dataset.page;
const $ = (sel) => document.querySelector(sel);

/* ----- Cart (localStorage) ----- */
function getCart() {
  try {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}
function saveCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
  updateBadge();
}
function addToCart(id) {
  const items = getCart();
  const found = items.find((i) => i.id === id);
  if (found) found.qty += 1;
  else items.push({ id: id, qty: 1 });
  saveCart(items);
}
function updateBadge() {
  const count = getCart().reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll("#cart-badge").forEach((el) => (el.textContent = count));
}

/* ----- Money ----- */
function money(n) {
  return "RM " + n.toFixed(2);
}

/* ----- Small pop-up message ----- */
function toast(message) {
  let wrap = $(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = message;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

/* ----- Product card HTML ----- */
function productCard(p) {
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return `
    <div class="card">
      <a href="product.html?id=${p.id}">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <img src="${p.image}" alt="${p.name}">
      </a>
      <div class="info">
        <p class="tag">${p.category}</p>
        <h3 class="name">${p.name}</h3>
        <p class="rating">★ ${p.rating}</p>
        <p class="price">
          ${p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : ""}
          <strong>${money(p.price)}</strong>
          ${off ? `<small>(-${off}%)</small>` : ""}
        </p>
        <button class="add" data-add="${p.id}">Add to cart</button>
      </div>
    </div>`;
}

/* ----- Home page ----- */
function initHome() {
  // Categories
  $("#category-grid").innerHTML = CATEGORIES.map((c) => `
  <a class="cat cat-${c.key}" href="shop.html?cat=${c.key}">
    <h3>${c.name}</h3>
    <p>${c.blurb}</p>
  </a>`).join("");

  // Trending = top 4 by rating
  const trending = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 4);
  $("#featured-grid").innerHTML = trending.map(productCard).join("");

  // NEW: hero photos = first product of the first 4 categories
  const heroBox = $("#hero-visual");
  if (heroBox) {
    heroBox.innerHTML = CATEGORIES.slice(0, 4)
      .map((c) => PRODUCTS.find((p) => p.category === c.key))
      .filter(Boolean)
      .map((p) => `<div class="hero-tile"><img src="${p.image}" alt="${p.name}"></div>`)
      .join("");
  }
}

/* ----- Shop page ----- */
function initShop() {
  let currentCat = "all";
  let currentSearch = "";
  let currentSort = "featured";

  // NEW: read ?cat= from URL (e.g. shop.html?cat=football)
  const urlCat = new URLSearchParams(window.location.search).get("cat");
  if (urlCat && CATEGORIES.some((c) => c.key === urlCat)) {
    currentCat = urlCat;
  }

  // Build filter buttons (All + each category)
  const filterBox = $("#filters");
  CATEGORIES.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "filter" + (c.key === currentCat ? " active" : "");  // NEW: highlight if from URL
    btn.dataset.cat = c.key;
    btn.textContent = c.name;
    filterBox.appendChild(btn);
  });

  // Toggle the "All" button's active state based on currentCat
  const allBtn = filterBox.querySelector('[data-cat="all"]');
  if (allBtn) {
    if (currentCat === "all") allBtn.classList.add("active");
    else allBtn.classList.remove("active");
  }

  // Filter button clicks
  filterBox.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    filterBox.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCat = btn.dataset.cat;
    render();
  });

  // Search
  $("#search").addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase();
    render();
  });

  // Sort
  $("#sort").addEventListener("change", (e) => {
    currentSort = e.target.value;
    render();
  });

  // Filter + sort + render
  function render() {
    let list = PRODUCTS.slice();

    if (currentCat !== "all") {
      list = list.filter((p) => p.category === currentCat);
    }
    if (currentSearch) {
      list = list.filter((p) => p.name.toLowerCase().includes(currentSearch));
    }
    if (currentSort === "low") list.sort((a, b) => a.price - b.price);
    if (currentSort === "high") list.sort((a, b) => b.price - a.price);
    if (currentSort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    $("#count").textContent = "Showing " + list.length + " product" + (list.length === 1 ? "" : "s");
    $("#shop-grid").innerHTML = list.map(productCard).join("");
  }

  render();
}

/* ----- Product page ----- */
function initProduct() {
  // Read ?id=1 from the URL
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    $("#product-root").innerHTML =
      "<p>Product not found. <a href='shop.html'>Back to shop</a></p>";
    // FIX 3: hide the empty "You may also like" section
    $("#related-grid").closest("section").hidden = true;
    return;
  }

  // Page title + breadcrumb
  document.title = product.name + " | SprintZone";
  if ($("#crumb-name")) $("#crumb-name").textContent = product.name;

  // Build the detail layout
  const off = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  $("#product-root").innerHTML = `
    <div class="detail">
      <img src="${product.image}" alt="${product.name}">
      <div class="detail-info">
        <p class="tag">${product.category}</p>
        <h1>${product.name}</h1>
        <p class="rating">★ ${product.rating}</p>
        <p class="price">
          ${product.oldPrice ? `<s>${money(product.oldPrice)}</s>` : ""}
          <strong>${money(product.price)}</strong>
          ${off ? `<small>(-${off}%)</small>` : ""}
        </p>
        <p>${product.description}</p>
        <ul class="pd-points">
          <li>Authentic, brand-new and quality checked</li>
          <li>Free shipping on orders over RM ${SHIPPING.freeThreshold}</li>
          <li>14-day easy returns</li>
        </ul>
        <div class="buy">
          <input id="qty" type="number" value="1" min="1" max="20">
          <button class="add" id="add-detail">Add to cart</button>
        </div>
        <p class="pd-note">💡 Tip: use code <strong>SPORT10</strong> at the cart for 10% off.</p>
        <a class="btn" href="shop.html" style="margin-top:1rem">← Back to shop</a>
      </div>
    </div>`;

  // Add-to-cart for this page (with quantity)
  $("#add-detail").addEventListener("click", () => {
    // FIX 2: quantity must be a whole number from 1 to 20
    const qty = Math.min(20, Math.max(1, Math.floor(Number($("#qty").value)) || 1));
    $("#qty").value = qty;
    const items = getCart();
    const found = items.find((i) => i.id === product.id);
    if (found) found.qty += qty;
    else items.push({ id: product.id, qty: qty });
    saveCart(items);
    $("#add-detail").textContent = "Added ✓";
    toast(qty + " × " + product.name + " added to cart");
    setTimeout(() => ($("#add-detail").textContent = "Add to cart"), 800);
  });

  // Related products — same category, excluding this one
  // NEW: if the category is small, fill the rest with other products
  const related = PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .concat(PRODUCTS.filter((p) => p.category !== product.category))
    .slice(0, 4);

  $("#related-grid").innerHTML = related.map(productCard).join("");
}

/* ----- Cart page ----- */
function initCart() {
  let promoCode = "";

  function render() {
    const items = getCart();
    const root = $("#cart-root");

    // Empty cart
    if (items.length === 0) {
      root.innerHTML = `
        <div class="empty-state">
          <div class="big">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't picked any gear yet.</p>
          <a class="btn" href="shop.html">Start shopping</a>
        </div>`;
      return;
    }

    // Build rows
    let rows = "";
    let subtotal = 0;

    items.forEach((item) => {
      const p = PRODUCTS.find((x) => x.id === item.id);
      if (!p) return;
      const line = p.price * item.qty;
      subtotal += line;

      rows += `
        <div class="cart-row">
          <img src="${p.image}" alt="${p.name}">
          <div class="cart-info">
            <h3>${p.name}</h3>
            <p class="tag">${p.category}</p>
            <p>${money(p.price)} each</p>
          </div>
          <div class="cart-qty">
            <button data-qty="${p.id}" data-change="-1">−</button>
            <span>${item.qty}</span>
            <button data-qty="${p.id}" data-change="1">+</button>
          </div>
          <div class="cart-line">${money(line)}</div>
          <button class="cart-remove" data-remove="${p.id}">✕</button>
        </div>`;
    });

    // Totals
    const discount = promoCode && PROMOS[promoCode]
      ? subtotal * (PROMOS[promoCode].value / 100)
      : 0;

    const afterDiscount = subtotal - discount;
    const shipping = afterDiscount >= SHIPPING.freeThreshold ? 0 : SHIPPING.flat;
    const total = afterDiscount + shipping;

    // Free-shipping progress bar
    const remaining = Math.max(0, SHIPPING.freeThreshold - afterDiscount);
    const progress = Math.min(100, (afterDiscount / SHIPPING.freeThreshold) * 100);

    root.innerHTML = `
      <div class="cart-layout">
      <div>
        <div class="cart-list">${rows}</div>
        <div class="cart-actions"><a class="btn btn-outline" href="shop.html">← Continue shopping</a></div>
      </div>

      <div class="cart-summary">
        <p class="ship-msg">${remaining > 0 ? "Add <strong>" + money(remaining) + "</strong> more for free shipping" : "🎉 You've unlocked free shipping!"}</p>
        <div class="ship-bar"><span style="width:${progress}%"></span></div>
        <p><span>Subtotal</span><strong>${money(subtotal)}</strong></p>
        ${discount ? `<p class="discount"><span>Discount (${promoCode})</span><strong>− ${money(discount)}</strong></p>` : ""}
        <p><span>Shipping</span><strong>${shipping === 0 ? "Free" : money(shipping)}</strong></p>
        <p class="total"><span>Total</span><strong>${money(total)}</strong></p>

        <div class="promo">
          <input id="promo" type="text" placeholder="Try SPORT10" value="${promoCode}">
          <button class="btn" id="apply-promo">Apply</button>
        </div>

        <button class="btn checkout-btn" id="checkout">Checkout</button>
      </div>
      </div>`;
  }

  // Delegate clicks for qty, remove, promo, checkout
  $("#cart-root").addEventListener("click", (e) => {
    const qtyBtn = e.target.closest("[data-qty]");
    const removeBtn = e.target.closest("[data-remove]");

    if (qtyBtn) {
      const id = Number(qtyBtn.dataset.qty);
      const change = Number(qtyBtn.dataset.change);
      const items = getCart();
      const found = items.find((i) => i.id === id);
      if (!found) return;
      found.qty += change;
      if (found.qty <= 0) {
        const idx = items.indexOf(found);
        items.splice(idx, 1);
      }
      saveCart(items);
      render();
      return;
    }

    if (removeBtn) {
      const id = Number(removeBtn.dataset.remove);
      const items = getCart().filter((i) => i.id !== id);
      saveCart(items);
      render();
      return;
    }

    if (e.target.id === "apply-promo") {
      const code = $("#promo").value.trim().toUpperCase();
      if (PROMOS[code]) {
        promoCode = code;
        render();
      } else {
        alert("Invalid promo code");
      }
      return;
    }

    if (e.target.id === "checkout") {
      alert("Order placed!");
      localStorage.removeItem("cart");
      updateBadge();
      render();
    }
  });

  render();
}

/* ----- Deals page ----- */
function initDeals() {
  // Only products with an oldPrice
  const deals = PRODUCTS.filter((p) => p.oldPrice);

  // Sort by biggest discount first
  deals.sort((a, b) => {
    const da = 1 - a.price / a.oldPrice;
    const db = 1 - b.price / b.oldPrice;
    return db - da;
  });

  $("#deals-grid").innerHTML = deals.map(productCard).join("");

  // Countdown — ends next Sunday at midnight (local time)
  const end = new Date();
  end.setDate(end.getDate() + (7 - end.getDay()));  // next Sunday
  end.setHours(23, 59, 59, 0);

  function tick() {
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) {
      $("#cd-hours").textContent = "00";
      $("#cd-mins").textContent = "00";
      $("#cd-secs").textContent = "00";
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins  = Math.floor((diff / (1000 * 60)) % 60);
    const secs  = Math.floor((diff / 1000) % 60);

    $("#cd-hours").textContent = String(hours).padStart(2, "0");
    $("#cd-mins").textContent  = String(mins).padStart(2, "0");
    $("#cd-secs").textContent  = String(secs).padStart(2, "0");
  }

  tick();
  setInterval(tick, 1000);

  // Copy the promo code
  const copyBtn = $("#copy-code");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      if (navigator.clipboard) navigator.clipboard.writeText("SPORT10").catch(() => {});
      toast("Code SPORT10 copied! Paste it in your cart.");
    });
  }
}

/* ----- Contact page ----- */
function initContact() {
  const form = $("#contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = $("#c-name").value.trim();
    const email = $("#c-email").value.trim();
    const topic = $("#c-topic").value;
    const msg = $("#c-msg").value.trim();

    // Simple checks
    if (!name) return alert("Please enter your name.");
    if (!email.includes("@")) return alert("Please enter a valid email.");
    if (!topic) return alert("Please choose a topic.");
    if (msg.length < 10) return alert("Message must be at least 10 characters.");

    // Success
    form.style.display = "none";
    $("#contact-success").hidden = false;
  });
}

/* ----- Add-to-cart (works on any page) ----- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  addToCart(Number(btn.dataset.add));
  const added = PRODUCTS.find((p) => p.id === Number(btn.dataset.add));
  if (added) toast(added.name + " added to cart");
  btn.textContent = "Added ✓";
  setTimeout(() => (btn.textContent = "Add to cart"), 800);
});

/* ----- Mobile menu ----- */
function initMenu() {
  const toggle = $("#nav-toggle");
  const nav = $("#main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("is-open"));
  }

  // NEW: highlight the link of the page you are on
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#main-nav a").forEach((a) => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });
}

/* ----- Newsletter form ----- */
function initNewsletter() {
  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      if (!input.value.includes("@")) return toast("Please enter a valid email.");
      toast("Thanks for subscribing! 🎉");
      form.reset();
    });
  });
}

/* ----- Fade-in when scrolling ----- */
function initReveal() {
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
}

/* ----- Start ----- */
document.addEventListener("DOMContentLoaded", () => {
  updateBadge();
  initMenu();
  initNewsletter();
  initReveal();

  if (PAGE === "home") initHome();
  if (PAGE === "shop") initShop();
  if (PAGE === "product") initProduct();
  if (PAGE === "cart") initCart();
  if (PAGE === "deals") initDeals();
  if (PAGE === "contact") initContact();

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
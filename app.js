const STORAGE_KEY = "brownie-da-keise-app-v2";
const API_URLS = {
  login: "./api/login.php",
  logout: "./api/logout.php",
  publicState: "./api/public-state.php",
  state: "./api/state.php",
  orders: "./api/orders.php",
  upload: "./api/upload.php",
};
const WHATSAPP_NUMBER = "71982371552";
const SALE_PRODUCTS = [
  {
    id: "tradicional",
    name: "Tradicional",
    price: 10,
    image: "./assets/produtos/tradicional.png",
    description: "Chocolate intenso, casquinha brilhante e interior bem úmido.",
    tag: "Clássico",
  },
  {
    id: "brookies",
    name: "Brookies",
    price: 12,
    image: "./assets/produtos/brookies.png",
    description: "Brownie denso com cobertura dourada e toque caramelizado.",
    tag: "Crocante",
  },
  {
    id: "doce-leite-coco",
    name: "Doce de Leite com Coco",
    price: 12,
    image: "./assets/produtos/doce-de-leite-coco.png",
    description: "Doce de leite cremoso, coco tostado e massa chocolatuda.",
    tag: "Cremoso",
  },
  {
    id: "mix-castanhas",
    name: "Mix de Castanhas",
    price: 10,
    image: "./assets/produtos/mix-castanhas.png",
    description: "Castanhas selecionadas, textura marcante e chocolate profundo.",
    tag: "Especial",
  },
  {
    id: "charge",
    name: "Charge",
    price: 12,
    image: "./assets/produtos/charge.png",
    description: "Camadas generosas com chocolate, caramelo e amendoim.",
    tag: "Recheado",
  },
];
const defaultSiteConfig = {
  heroTitle: "Brownies intensos, molhadinhos e feitos para pedir de novo.",
  featuredProductId: "",
  products: SALE_PRODUCTS.map((product) => ({ ...product, active: true })),
  upcomingProducts: [],
};
const editing = {
  ingredientId: null,
  recipeId: null,
  movementId: null,
  saleId: null,
};
const PAGE_SIZE = 25;
const ui = {
  monthFilter: "all",
  pages: {},
};
const serverSync = {
  enabled: false,
  authenticated: false,
  needsLogin: false,
  saving: false,
  pending: false,
  lastError: null,
};
const saleCart = new Map();
let suggestedOrders = [];
let activeSuggestedOrderId = null;
let serverSavePromise = Promise.resolve(true);
let siteConfigSaveTimer = null;
let siteConfigStatusTimer = null;

const seedState = {
  ingredients: [
    { id: crypto.randomUUID(), name: "Chocolate Nobre Sicao 40%", unit: "g", packageQuantity: 1000, packageCost: 135, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Chocolate em pó Melken 50%", unit: "g", packageQuantity: 1000, packageCost: 65, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Manteiga", unit: "g", packageQuantity: 500, packageCost: 20, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Açúcar", unit: "g", packageQuantity: 1000, packageCost: 3, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Ovos", unit: "g", packageQuantity: 1200, packageCost: 20, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Farinha de Trigo", unit: "g", packageQuantity: 1000, packageCost: 3.8, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Papel Manteiga", unit: "g", packageQuantity: 750, packageCost: 4.9, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Saco Express", unit: "un", packageQuantity: 100, packageCost: 12, notes: "Embalagem Individual" },
    { id: crypto.randomUUID(), name: "Sacola personalizada", unit: "un", packageQuantity: 1, packageCost: 0, notes: "Cadastre o custo quando souber" },
    { id: crypto.randomUUID(), name: "Adesivo", unit: "un", packageQuantity: 250, packageCost: 77, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Avental", unit: "un", packageQuantity: 1, packageCost: 0, notes: "Cadastre o custo quando souber" },
    { id: crypto.randomUUID(), name: "Bandeja", unit: "un", packageQuantity: 1, packageCost: 0, notes: "Cadastre o custo quando souber" },
    { id: crypto.randomUUID(), name: "Display", unit: "un", packageQuantity: 1, packageCost: 0, notes: "Cadastre o custo quando souber" },
    { id: crypto.randomUUID(), name: "Goiabada cascão", unit: "g", packageQuantity: 500, packageCost: 5.3, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Queijo Parmesão Vigor", unit: "g", packageQuantity: 50, packageCost: 6.2, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Leite Condensado", unit: "g", packageQuantity: 395, packageCost: 5.3, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Creme de Leite", unit: "g", packageQuantity: 200, packageCost: 2.75, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Cranberry", unit: "g", packageQuantity: 30, packageCost: 8.9, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Bluberry", unit: "g", packageQuantity: 100, packageCost: 20, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Morango glaceado", unit: "g", packageQuantity: 30, packageCost: 10, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Cereja glaceada", unit: "g", packageQuantity: 30, packageCost: 10, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Amendoas Laminadas", unit: "g", packageQuantity: 100, packageCost: 13, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Castanha do pará", unit: "g", packageQuantity: 30, packageCost: 12.9, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Nozes", unit: "g", packageQuantity: 30, packageCost: 8.9, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Amendoas inteiras", unit: "g", packageQuantity: 30, packageCost: 9.9, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Coco Tostado", unit: "g", packageQuantity: 100, packageCost: 3.48, notes: "Base da planilha" },
    { id: crypto.randomUUID(), name: "Mix Castanhas", unit: "g", packageQuantity: 100, packageCost: 43.18, notes: "Custo do lote do mix na planilha" },
    { id: crypto.randomUUID(), name: "Mix Frutas Vermelhas", unit: "g", packageQuantity: 100, packageCost: 48.9, notes: "Custo do lote do mix na planilha" },
  ],
  recipes: [],
  movements: [],
  sales: [],
  siteConfig: structuredClone(defaultSiteConfig),
};

let state = loadState();

const els = {
  salesPage: document.getElementById("sales-page"),
  productGrid: document.getElementById("product-grid"),
  salesHeroTitle: document.getElementById("sales-hero-title"),
  featuredProduct: document.getElementById("featured-product"),
  upcomingProducts: document.getElementById("upcoming-products"),
  orderSummary: document.getElementById("order-summary"),
  orderTotal: document.getElementById("order-total"),
  buyBrownie: document.getElementById("buy-brownie"),
  openAdminLogin: document.getElementById("open-admin-login"),
  adminLogin: document.getElementById("admin-login"),
  adminLoginForm: document.getElementById("admin-login-form"),
  adminLoginError: document.getElementById("admin-login-error"),
  adminLoginSubmit: document.getElementById("admin-login-submit"),
  adminShell: document.getElementById("admin-shell"),
  backToSales: document.getElementById("back-to-sales"),
  backToSalesFromAdmin: document.getElementById("back-to-sales-from-admin"),
  sections: document.querySelectorAll(".section"),
  navLinks: document.querySelectorAll(".nav-link"),
  ingredientForm: document.getElementById("ingredient-form"),
  ingredientList: document.getElementById("ingredient-list"),
  recipeForm: document.getElementById("recipe-form"),
  recipeItems: document.getElementById("recipe-items"),
  recipeList: document.getElementById("recipe-list"),
  movementForm: document.getElementById("movement-form"),
  movementList: document.getElementById("movement-list"),
  saleForm: document.getElementById("sale-form"),
  saleList: document.getElementById("sale-list"),
  suggestedOrderList: document.getElementById("suggested-order-list"),
  siteCopyForm: document.getElementById("site-copy-form"),
  siteConfigStatus: document.getElementById("site-config-status"),
  siteProductForm: document.getElementById("site-product-form"),
  siteProductEditor: document.getElementById("site-product-editor"),
  upcomingProductForm: document.getElementById("upcoming-product-form"),
  upcomingProductList: document.getElementById("upcoming-product-list"),
  financeList: document.getElementById("finance-list"),
  inventorySummary: document.getElementById("inventory-summary"),
  salesSummary: document.getElementById("sales-summary"),
  addRecipeItem: document.getElementById("add-recipe-item"),
  recipeItemTemplate: document.getElementById("recipe-item-template"),
  exportData: document.getElementById("export-data"),
  exportExcel: document.getElementById("export-excel"),
  importExcel: document.getElementById("import-excel"),
  importData: document.getElementById("import-data"),
  monthFilter: document.getElementById("month-filter"),
  resetData: document.getElementById("reset-data"),
};

init();

async function init() {
  bindNavigation();
  bindForms();
  await loadPublicSiteConfig();
  renderSaleProducts();
  renderSiteHighlights();
  updateOrderSummary();
  showSalesPage();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(seedState);
    return normalizeState(JSON.parse(raw));
  } catch {
    return structuredClone(seedState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (serverSync.enabled && serverSync.authenticated) {
    serverSavePromise = serverSavePromise
      .catch(() => false)
      .then(() => saveServerState());
    return serverSavePromise;
  }
  return Promise.resolve(true);
}

function getSiteConfig() {
  return normalizeSiteConfig(state.siteConfig);
}

function getActiveSaleProducts() {
  return getSiteConfig().products.filter((product) => product.active !== false);
}

async function loadPublicSiteConfig() {
  try {
    const response = await fetch(API_URLS.publicState, { credentials: "same-origin" });
    if (!response.ok) throw new Error("public_state_failed");
    const payload = await response.json();
    if (payload.siteConfig) {
      state.siteConfig = normalizeSiteConfig(payload.siteConfig);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    state.siteConfig = normalizeSiteConfig(state.siteConfig);
  }
}

function renderSaleProducts() {
  const products = getActiveSaleProducts();
  els.salesHeroTitle.textContent = getSiteConfig().heroTitle;
  if (products.length === 0) {
    els.productGrid.innerHTML = emptyState("Cardápio em atualização. Volte em breve.");
    return;
  }

  els.productGrid.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="product-media">
        <img src="${product.image}" alt="Brownie ${product.name}" />
        <span>${product.tag}</span>
      </div>
      <div class="product-body">
        <div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
        <div class="product-footer">
          <strong>${formatCurrency(product.price)}</strong>
          <div class="quantity-control" aria-label="Quantidade de ${product.name}">
            <button type="button" data-cart-action="decrease" data-product-id="${product.id}">−</button>
            <span id="qty-${product.id}">0</span>
            <button type="button" data-cart-action="increase" data-product-id="${product.id}">+</button>
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

function renderSiteHighlights() {
  const config = getSiteConfig();
  const featured = config.products.find((product) => product.id === config.featuredProductId && product.active !== false);

  if (featured) {
    els.featuredProduct.hidden = false;
    els.featuredProduct.innerHTML = `
      <div>
        <span>Destaque do mês</span>
        <h3>${featured.name}</h3>
        <p>${featured.description}</p>
      </div>
      <strong>${formatCurrency(featured.price)}</strong>
    `;
  } else {
    els.featuredProduct.hidden = true;
    els.featuredProduct.innerHTML = "";
  }

  if (config.upcomingProducts.length > 0) {
    els.upcomingProducts.hidden = false;
    els.upcomingProducts.innerHTML = `
      <div class="sales-section-title compact">
        <p class="eyebrow">Em breve</p>
        <h2>Próximos brownies</h2>
      </div>
      <div class="upcoming-grid">
        ${config.upcomingProducts.map((product) => `
          <article>
            <strong>${product.name}</strong>
            ${product.eta ? `<span>${product.eta}</span>` : ""}
            ${product.description ? `<p>${product.description}</p>` : ""}
          </article>
        `).join("")}
      </div>
    `;
  } else {
    els.upcomingProducts.hidden = true;
    els.upcomingProducts.innerHTML = "";
  }
}

function handleProductClick(event) {
  const button = event.target.closest("[data-cart-action]");
  if (!button) return;

  const productId = button.dataset.productId;
  const current = saleCart.get(productId) || 0;
  const next = button.dataset.cartAction === "increase" ? current + 1 : Math.max(current - 1, 0);

  if (next === 0) {
    saleCart.delete(productId);
  } else {
    saleCart.set(productId, next);
  }

  updateOrderSummary();
}

function updateOrderSummary() {
  let itemCount = 0;
  let total = 0;

  getActiveSaleProducts().forEach((product) => {
    const quantity = saleCart.get(product.id) || 0;
    itemCount += quantity;
    total += quantity * product.price;
    const quantityEl = document.getElementById(`qty-${product.id}`);
    if (quantityEl) quantityEl.textContent = String(quantity);
  });

  els.orderSummary.textContent = itemCount === 0
    ? "Nenhum brownie selecionado"
    : `${itemCount} ${itemCount === 1 ? "brownie selecionado" : "brownies selecionados"}`;
  els.orderTotal.textContent = formatCurrency(total);
}

async function handleBuyBrownie() {
  const selected = getActiveSaleProducts()
    .map((product) => ({ ...product, quantity: saleCart.get(product.id) || 0 }))
    .filter((product) => product.quantity > 0);

  if (selected.length === 0) {
    alert("Escolha pelo menos um brownie para montar seu pedido.");
    return;
  }

  const lines = selected.map((product) =>
    `- ${product.quantity}x ${product.name} (${formatCurrency(product.price)} cada)`,
  );
  const total = selected.reduce((sum, product) => sum + product.quantity * product.price, 0);
  const orderItems = selected.map((product) => ({
    productId: product.id,
    name: product.name,
    quantity: product.quantity,
    price: product.price,
  }));
  const message = [
    "Olá, Keise! Quero fazer um pedido:",
    "",
    ...lines,
    "",
    `Total: ${formatCurrency(total)}`,
  ].join("\n");

  await Promise.all(orderItems.map((item) => createSuggestedOrder([item])));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

async function createSuggestedOrder(items) {
  try {
    await fetch(API_URLS.orders, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  } catch {
    // WhatsApp remains the primary customer-facing action if the suggestion API is unavailable.
  }
}

async function openAdminArea() {
  await logoutServerSession();
  showLoginScreen();
}

async function loadSuggestedOrders() {
  try {
    const response = await fetch(API_URLS.orders, { credentials: "same-origin" });
    if (!response.ok) throw new Error("orders_load_failed");
    const payload = await response.json();
    suggestedOrders = Array.isArray(payload.orders) ? payload.orders : [];
  } catch {
    suggestedOrders = [];
  }
}

function normalizeState(nextState) {
  return {
    ingredients: Array.isArray(nextState?.ingredients) ? nextState.ingredients : [],
    recipes: Array.isArray(nextState?.recipes) ? nextState.recipes : [],
    movements: Array.isArray(nextState?.movements) ? nextState.movements : [],
    sales: Array.isArray(nextState?.sales) ? nextState.sales : [],
    siteConfig: normalizeSiteConfig(nextState?.siteConfig),
  };
}

function normalizeSiteConfig(config) {
  const savedProducts = Array.isArray(config?.products) ? config.products : [];
  const productById = new Map(savedProducts.map((product) => [product.id, product]));
  const baseProducts = defaultSiteConfig.products.map((fallback) => {
    const saved = productById.get(fallback.id) || {};
    return normalizeSiteProduct({
      ...fallback,
      name: String(saved.name || fallback.name).trim(),
      price: Number(saved.price ?? fallback.price) || 0,
      image: String(saved.image || fallback.image).trim(),
      description: String(saved.description || fallback.description).trim(),
      tag: String(saved.tag || fallback.tag).trim(),
      active: saved.active !== false,
      custom: false,
    }, fallback);
  });
  const defaultIds = new Set(defaultSiteConfig.products.map((product) => product.id));
  const customProducts = savedProducts
    .filter((product) => product?.id && !defaultIds.has(product.id))
    .map((product) => normalizeSiteProduct(product))
    .filter(Boolean);
  const products = [...baseProducts, ...customProducts];

  const productIds = new Set(products.map((product) => product.id));
  const featuredProductId = productIds.has(config?.featuredProductId) ? config.featuredProductId : "";

  return {
    heroTitle: String(config?.heroTitle || defaultSiteConfig.heroTitle).trim(),
    featuredProductId,
    products,
    upcomingProducts: Array.isArray(config?.upcomingProducts)
      ? config.upcomingProducts.map(normalizeUpcomingProduct).filter(Boolean)
      : [],
  };
}

function normalizeSiteProduct(product, fallback = null) {
  const name = String(product?.name || fallback?.name || "").trim();
  const image = String(product?.image || fallback?.image || "").trim();
  const description = String(product?.description || fallback?.description || "").trim();
  if (!name || !image || !description) return null;
  return {
    id: String(product?.id || createProductId(name, [])),
    name,
    price: Number(product?.price ?? fallback?.price ?? 0) || 0,
    image,
    description,
    tag: String(product?.tag || fallback?.tag || "Novo").trim(),
    active: product?.active !== false,
    custom: product?.custom === true || !fallback,
  };
}

function createProductId(name, products = getSiteConfig().products) {
  const base = normalizeText(name).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "brownie";
  const existing = new Set(products.map((product) => product.id));
  let id = base;
  let index = 2;
  while (existing.has(id)) {
    id = `${base}-${index}`;
    index += 1;
  }
  return id;
}

function normalizeUpcomingProduct(product) {
  const name = String(product?.name || "").trim();
  if (!name) return null;
  return {
    id: String(product?.id || crypto.randomUUID()),
    name,
    eta: String(product?.eta || "").trim(),
    description: String(product?.description || "").trim(),
  };
}

async function initializeServerState() {
  try {
    let response = await fetch(API_URLS.state, { credentials: "same-origin" });
    if (response.status === 401) {
      serverSync.needsLogin = true;
      return false;
    }

    if (!response.ok) throw new Error("state_load_failed");
    const payload = await response.json();
    serverSync.enabled = true;
    serverSync.authenticated = true;
    serverSync.needsLogin = false;
    serverSync.lastError = null;

    if (payload.data) {
      state = normalizeState(payload.data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    return true;
  } catch {
    serverSync.enabled = false;
    serverSync.authenticated = false;
    serverSync.needsLogin = true;
    serverSync.lastError = "server_unavailable";
    return false;
  }
}

async function handleAdminLogin(event) {
  event.preventDefault();
  hideLoginError();
  setLoginLoading(true);

  const data = new FormData(event.currentTarget);
  const username = String(data.get("username") || "").trim();
  const password = String(data.get("password") || "");

  try {
    const response = await fetch(API_URLS.login, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      showLoginError();
      return;
    }

    serverSync.authenticated = true;
    const ready = await initializeServerState();
    if (!ready) {
      showLoginError("Não consegui carregar o painel. Tente novamente.");
      return;
    }

    ensureSampleRecipes();
    await loadSuggestedOrders();
    saveState();
    renderAll();
    showAdminShell();
  } catch {
    showLoginError("Não consegui conectar ao servidor.");
  } finally {
    setLoginLoading(false);
  }
}

function showLoginScreen() {
  els.salesPage.hidden = true;
  els.adminLogin.hidden = false;
  els.adminShell.hidden = true;
  document.getElementById("admin-username")?.focus();
}

function showAdminShell() {
  els.salesPage.hidden = true;
  els.adminLogin.hidden = true;
  els.adminShell.hidden = false;
}

function showSalesPage() {
  els.salesPage.hidden = false;
  els.adminLogin.hidden = true;
  els.adminShell.hidden = true;
}

async function returnToSalesPage() {
  await logoutServerSession();
  showSalesPage();
}

async function logoutServerSession() {
  try {
    await fetch(API_URLS.logout, { method: "POST", credentials: "same-origin" });
  } catch {
    // The UI should still return to the public page if the logout request fails.
  } finally {
    serverSync.enabled = false;
    serverSync.authenticated = false;
    serverSync.needsLogin = true;
    suggestedOrders = [];
    activeSuggestedOrderId = null;
  }
}

function showLoginError(message = "Usuário ou senha inválidos.") {
  els.adminLoginError.textContent = message;
  els.adminLoginError.hidden = false;
}

function hideLoginError() {
  els.adminLoginError.hidden = true;
}

function setLoginLoading(isLoading) {
  els.adminLoginSubmit.disabled = isLoading;
  els.adminLoginSubmit.textContent = isLoading ? "Entrando..." : "Entrar no painel →";
}

function startButtonLoading(button, loadingText = "Salvando...") {
  if (!button) return () => {};
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = loadingText;
  return () => {
    button.disabled = false;
    button.textContent = originalText;
  };
}

function showSiteConfigStatus(message, type = "saving") {
  if (!els.siteConfigStatus) return;
  if (siteConfigStatusTimer) window.clearTimeout(siteConfigStatusTimer);
  els.siteConfigStatus.textContent = message;
  els.siteConfigStatus.className = `form-status ${type}`;
  els.siteConfigStatus.hidden = false;

  if (type !== "saving") {
    siteConfigStatusTimer = window.setTimeout(() => {
      els.siteConfigStatus.hidden = true;
    }, 3200);
  }
}

async function uploadSiteImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(API_URLS.upload, {
    method: "POST",
    credentials: "same-origin",
    body: formData,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.path) throw new Error(payload.error || "upload_failed");
  return payload.path;
}

async function saveServerState() {
  serverSync.saving = true;
  serverSync.pending = false;

  let saved = false;
  try {
    const response = await fetch(API_URLS.state, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: state }),
    });
    if (!response.ok) throw new Error("state_save_failed");
    serverSync.lastError = null;
    saved = true;
  } catch {
    serverSync.lastError = "server_save_failed";
  } finally {
    serverSync.saving = false;
  }
  return saved;
}

function bindNavigation() {
  els.navLinks.forEach((button) => {
    button.addEventListener("click", () => {
      activateSection(button.dataset.section);
    });
  });
}

function activateSection(target) {
  els.navLinks.forEach((link) => link.classList.toggle("active", link.dataset.section === target));
  els.sections.forEach((section) => section.classList.toggle("active", section.id === target));
}

function bindForms() {
  els.productGrid.addEventListener("click", handleProductClick);
  els.buyBrownie.addEventListener("click", handleBuyBrownie);
  els.openAdminLogin.addEventListener("click", openAdminArea);
  els.adminLoginForm.addEventListener("submit", handleAdminLogin);
  els.backToSales.addEventListener("click", returnToSalesPage);
  els.backToSalesFromAdmin.addEventListener("click", returnToSalesPage);
  els.ingredientForm.addEventListener("submit", handleIngredientSubmit);
  els.recipeForm.addEventListener("submit", handleRecipeSubmit);
  els.movementForm.addEventListener("submit", handleMovementSubmit);
  els.saleForm.addEventListener("submit", handleSaleSubmit);
  els.siteCopyForm.addEventListener("submit", handleSiteCopySubmit);
  els.siteProductForm.addEventListener("submit", handleSiteProductSubmit);
  els.siteProductEditor.addEventListener("input", handleSiteProductInput);
  els.siteProductEditor.addEventListener("change", handleSiteProductInput);
  els.siteProductEditor.addEventListener("change", handleSiteProductImageUpload);
  els.upcomingProductForm.addEventListener("submit", handleUpcomingProductSubmit);
  els.addRecipeItem.addEventListener("click", () => appendRecipeItem());
  els.exportData.addEventListener("click", exportData);
  els.exportExcel.addEventListener("click", exportExcel);
  els.importExcel.addEventListener("change", importExcelFile);
  els.importData.addEventListener("change", importData);
  els.monthFilter.addEventListener("change", handleMonthFilterChange);
  els.resetData.addEventListener("click", resetData);
  document.addEventListener("click", handlePaginationClick);
}

function ensureSampleRecipes() {
  if (state.recipes.length > 0) return;

  const findId = (name) => state.ingredients.find((item) => item.name === name)?.id;
  const makeItems = (items) =>
    items
      .map(([name, quantity]) => {
        const ingredientId = findId(name);
        return ingredientId ? { ingredientId, quantity } : null;
      })
      .filter(Boolean);

  state.recipes.push({
    id: crypto.randomUUID(),
    name: "Tradicional",
    yield: 12,
    salePrice: 10,
    notes: "Base da planilha",
    items: makeItems([
      ["Açúcar", 340],
      ["Ovos", 200],
      ["Manteiga", 207],
      ["Chocolate Nobre Sicao 40%", 115],
      ["Chocolate em pó Melken 50%", 115],
      ["Farinha de Trigo", 197],
      ["Papel Manteiga", 30],
      ["Saco Express", 12],
      ["Adesivo", 12],
    ]),
  });

  state.recipes.push({
    id: crypto.randomUUID(),
    name: "Mix de Castanhas",
    yield: 12,
    salePrice: 10,
    notes: "Usa o mix agregado da planilha",
    items: makeItems([
      ["Açúcar", 340],
      ["Ovos", 200],
      ["Manteiga", 207],
      ["Chocolate Nobre Sicao 40%", 115],
      ["Chocolate em pó Melken 50%", 115],
      ["Farinha de Trigo", 197],
      ["Papel Manteiga", 30],
      ["Saco Express", 12],
      ["Adesivo", 12],
      ["Mix Castanhas", 15],
    ]),
  });

  state.recipes.push({
    id: crypto.randomUUID(),
    name: "Frutas Vermelhas",
    yield: 12,
    salePrice: 10,
    notes: "Usa o mix agregado da planilha",
    items: makeItems([
      ["Açúcar", 340],
      ["Ovos", 200],
      ["Manteiga", 207],
      ["Chocolate Nobre Sicao 40%", 115],
      ["Chocolate em pó Melken 50%", 115],
      ["Farinha de Trigo", 197],
      ["Papel Manteiga", 30],
      ["Saco Express", 12],
      ["Adesivo", 12],
      ["Mix Frutas Vermelhas", 15],
    ]),
  });

  state.recipes.push({
    id: crypto.randomUUID(),
    name: "Doce de Leite com Coco",
    yield: 12,
    salePrice: 12,
    notes: "Base da planilha",
    items: makeItems([
      ["Açúcar", 340],
      ["Ovos", 200],
      ["Manteiga", 207],
      ["Chocolate Nobre Sicao 40%", 115],
      ["Chocolate em pó Melken 50%", 115],
      ["Farinha de Trigo", 197],
      ["Papel Manteiga", 30],
      ["Saco Express", 12],
      ["Adesivo", 12],
      ["Leite Condensado", 15],
      ["Coco Tostado", 7.5],
    ]),
  });

  state.recipes.push({
    id: crypto.randomUUID(),
    name: "Romeu e Julieta",
    yield: 12,
    salePrice: 12,
    notes: "Base da planilha",
    items: makeItems([
      ["Açúcar", 340],
      ["Ovos", 200],
      ["Manteiga", 207],
      ["Chocolate Nobre Sicao 40%", 115],
      ["Chocolate em pó Melken 50%", 115],
      ["Farinha de Trigo", 197],
      ["Papel Manteiga", 30],
      ["Saco Express", 12],
      ["Adesivo", 12],
      ["Leite Condensado", 10.04],
      ["Creme de Leite", 5.08],
      ["Queijo Parmesão Vigor", 1.27],
      ["Manteiga", 0.51],
      ["Goiabada cascão", 0.38],
    ]),
  });

  saveState();
}

function renderAll() {
  fillMonthFilter();
  fillIngredientSelects();
  fillRecipeSelect();
  renderIngredientList();
  renderRecipeBuilder();
  renderRecipeList();
  renderMovementList();
  renderSalesList();
  renderSuggestedOrders();
  renderSiteConfigEditor();
  renderInventorySummary();
  renderSalesSummary();
  renderFinance();
  renderKpis();
  bindActionButtons();
}

function handleMonthFilterChange(event) {
  ui.monthFilter = event.target.value || "all";
  ui.pages = {};
  renderAll();
}

function handlePaginationClick(event) {
  const button = event.target.closest("[data-table-page]");
  if (!button) return;

  ui.pages[button.dataset.tablePage] = Number(button.dataset.page || 1);
  renderAll();
}

function handleIngredientSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const ingredient = {
    id: editing.ingredientId || crypto.randomUUID(),
    name: data.get("name").trim(),
    unit: data.get("unit"),
    packageQuantity: Number(data.get("packageQuantity")),
    packageCost: Number(data.get("packageCost")),
    notes: data.get("notes").trim(),
  };
  if (editing.ingredientId) {
    const index = state.ingredients.findIndex((item) => item.id === editing.ingredientId);
    state.ingredients[index] = ingredient;
    editing.ingredientId = null;
  } else {
    state.ingredients.push(ingredient);
  }
  saveState();
  event.currentTarget.reset();
  resetFormButton(event.currentTarget, "Salvar insumo");
  renderAll();
}

function handleRecipeSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const items = Array.from(els.recipeItems.querySelectorAll(".recipe-item-row"))
    .map((row) => ({
      ingredientId: row.querySelector(".recipe-item-ingredient").value,
      quantity: Number(row.querySelector(".recipe-item-quantity").value),
    }))
    .filter((item) => item.ingredientId && item.quantity > 0);

  const recipe = {
    id: editing.recipeId || crypto.randomUUID(),
    name: data.get("name").trim(),
    yield: Number(data.get("yield")),
    salePrice: Number(data.get("salePrice") || 0),
    notes: data.get("notes").trim(),
    items,
  };

  if (editing.recipeId) {
    const index = state.recipes.findIndex((item) => item.id === editing.recipeId);
    state.recipes[index] = recipe;
    editing.recipeId = null;
  } else {
    state.recipes.push(recipe);
  }

  saveState();
  event.currentTarget.reset();
  els.recipeItems.innerHTML = "";
  appendRecipeItem();
  resetFormButton(event.currentTarget, "Salvar sabor");
  renderAll();
}

function handleMovementSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const movement = {
    id: editing.movementId || crypto.randomUUID(),
    ingredientId: data.get("ingredientId"),
    type: data.get("type"),
    quantity: Number(data.get("quantity")),
    amount: Number(data.get("amount") || 0),
    date: data.get("date"),
    notes: data.get("notes").trim(),
  };
  if (editing.movementId) {
    const index = state.movements.findIndex((item) => item.id === editing.movementId);
    state.movements[index] = movement;
    editing.movementId = null;
  } else {
    state.movements.unshift(movement);
  }
  saveState();
  event.currentTarget.reset();
  setToday(event.currentTarget.querySelector('[name="date"]'));
  resetFormButton(event.currentTarget, "Salvar movimento");
  renderAll();
}

async function handleSaleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton?.textContent || "Salvar venda";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Salvando...";
  }

  const data = new FormData(event.currentTarget);
  const recipe = state.recipes.find((item) => item.id === data.get("recipeId"));
  if (!recipe) {
    alert("Selecione um sabor antes de salvar a venda.");
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
    return;
  }

  const quantity = Number(data.get("quantity"));
  const amount = Number(data.get("amount") || recipe.salePrice * quantity);
  const wasEditingSale = Boolean(editing.saleId);
  const previousSales = structuredClone(state.sales);
  const previousEditingSaleId = editing.saleId;

  const sale = {
    id: editing.saleId || crypto.randomUUID(),
    recipeId: recipe.id,
    quantity,
    amount,
    date: data.get("date"),
    notes: data.get("notes").trim(),
  };
  if (editing.saleId) {
    const index = state.sales.findIndex((item) => item.id === editing.saleId);
    state.sales[index] = sale;
    editing.saleId = null;
  } else {
    state.sales.unshift(sale);
  }
  try {
    const saleSaved = await saveState();

    if (saleSaved === false) {
      state.sales = previousSales;
      editing.saleId = previousEditingSaleId;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      alert("Nao consegui salvar a venda no banco agora. Tente novamente em alguns segundos.");
      return;
    }

    let nextSuggestedOrder = null;
    if (activeSuggestedOrderId && !wasEditingSale) {
      const updated = await updateSuggestedOrderStatus(activeSuggestedOrderId, "converted");
      if (updated) {
        suggestedOrders = suggestedOrders.filter((order) => order.id !== activeSuggestedOrderId);
        nextSuggestedOrder = getSuggestedOrderRows()[0] || null;
      } else {
        alert("A venda foi salva, mas nao consegui remover o pedido sugerido. Voce pode dispensar manualmente depois.");
      }
      activeSuggestedOrderId = null;
    }

    form.reset();
    setToday(form.querySelector('[name="date"]'));
    resetFormButton(form, "Salvar venda");
    renderAll();
    if (nextSuggestedOrder) {
      fillSuggestedSale(nextSuggestedOrder.order.id, nextSuggestedOrder.itemIndex, { scroll: false });
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = activeSuggestedOrderId ? "Salvar venda sugerida" : "Salvar venda";
    }
  }
}

function appendRecipeItem(prefill = {}) {
  const fragment = els.recipeItemTemplate.content.cloneNode(true);
  const row = fragment.querySelector(".recipe-item-row");
  const select = fragment.querySelector(".recipe-item-ingredient");
  const input = fragment.querySelector(".recipe-item-quantity");
  populateIngredientOptions(select, prefill.ingredientId);
  input.value = prefill.quantity || "";
  row.querySelector(".remove-item").addEventListener("click", () => row.remove());
  els.recipeItems.appendChild(fragment);
}

function renderRecipeBuilder() {
  if (els.recipeItems.children.length === 0) appendRecipeItem();
}

function fillIngredientSelects() {
  populateIngredientOptions(els.movementForm.querySelector('[name="ingredientId"]'));
  const today = new Date().toISOString().slice(0, 10);
  setToday(els.movementForm.querySelector('[name="date"]'), today);
}

function fillRecipeSelect() {
  const select = els.saleForm.querySelector('[name="recipeId"]');
  select.innerHTML = "";
  if (state.recipes.length === 0) {
    select.innerHTML = '<option value="">Cadastre um sabor primeiro</option>';
  } else {
    state.recipes.forEach((recipe) => {
      const option = document.createElement("option");
      option.value = recipe.id;
      option.textContent = recipe.name;
      select.appendChild(option);
    });
  }
  setToday(els.saleForm.querySelector('[name="date"]'));
}

function populateIngredientOptions(select, selectedId = "") {
  select.innerHTML = "";
  state.ingredients.forEach((ingredient) => {
    const option = document.createElement("option");
    option.value = ingredient.id;
    option.textContent = ingredient.name;
    option.selected = ingredient.id === selectedId;
    select.appendChild(option);
  });
}

function fillMonthFilter() {
  const months = getAvailableMonthKeys();
  if (ui.monthFilter !== "all" && !months.includes(ui.monthFilter)) {
    ui.monthFilter = "all";
  }

  els.monthFilter.innerHTML = [
    '<option value="all">Todos os meses</option>',
    ...months.map((monthKey) => `<option value="${monthKey}">${formatMonthLabel(monthKey)}</option>`),
  ].join("");
  els.monthFilter.value = ui.monthFilter;
}

function getAvailableMonthKeys() {
  const months = new Set();
  [...state.movements, ...state.sales].forEach((item) => {
    const monthKey = getMonthKey(item.date);
    if (monthKey) months.add(monthKey);
  });
  return Array.from(months).sort((a, b) => (a < b ? 1 : -1));
}

function getMonthKey(dateValue) {
  return typeof dateValue === "string" && /^\d{4}-\d{2}/.test(dateValue) ? dateValue.slice(0, 7) : null;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
}

function getActiveMonthRange() {
  if (ui.monthFilter === "all") return null;
  const [year, month] = ui.monthFilter.split("-").map(Number);
  const endDay = String(new Date(year, month, 0).getDate()).padStart(2, "0");
  return {
    start: `${ui.monthFilter}-01`,
    end: `${ui.monthFilter}-${endDay}`,
  };
}

function isInActiveMonth(dateValue) {
  const range = getActiveMonthRange();
  return !range || (dateValue >= range.start && dateValue <= range.end);
}

function isThroughActiveMonth(dateValue) {
  const range = getActiveMonthRange();
  return !range || dateValue <= range.end;
}

function compareByDateDesc(a, b) {
  if ((a.date || "") === (b.date || "")) return 0;
  return (a.date || "") < (b.date || "") ? 1 : -1;
}

function compareByName(a, b) {
  return String(a.name || "").localeCompare(String(b.name || ""), "pt-BR");
}

function getVisibleMovements() {
  return state.movements.filter((movement) => isInActiveMonth(movement.date)).sort(compareByDateDesc);
}

function getVisibleSales() {
  return state.sales.filter((sale) => isInActiveMonth(sale.date)).sort(compareByDateDesc);
}

function getIngredientById(id) {
  return state.ingredients.find((item) => item.id === id);
}

function recipeUnitCost(recipe) {
  const batchCost = recipe.items.reduce((sum, item) => {
    const ingredient = getIngredientById(item.ingredientId);
    if (!ingredient || !ingredient.packageQuantity) return sum;
    return sum + (ingredient.packageCost / ingredient.packageQuantity) * item.quantity;
  }, 0);
  return batchCost / Math.max(recipe.yield || 1, 1);
}

function getInventorySnapshot({ throughDate = null } = {}) {
  const totals = new Map();

  state.ingredients.forEach((ingredient) => {
    totals.set(ingredient.id, { ingredient, entries: 0, exitsManual: 0, exitsSales: 0 });
  });

  state.movements.forEach((movement) => {
    if (throughDate && movement.date > throughDate) return;
    const item = totals.get(movement.ingredientId);
    if (!item) return;
    if (movement.type === "entry") item.entries += movement.quantity;
    if (movement.type === "exit") item.exitsManual += movement.quantity;
  });

  state.sales.forEach((sale) => {
    if (throughDate && sale.date > throughDate) return;
    const recipe = state.recipes.find((item) => item.id === sale.recipeId);
    if (!recipe) return;
    recipe.items.forEach((item) => {
      const target = totals.get(item.ingredientId);
      if (!target) return;
      const perUnit = item.quantity / Math.max(recipe.yield || 1, 1);
      target.exitsSales += perUnit * sale.quantity;
    });
  });

  return Array.from(totals.values()).map((row) => ({
    ...row,
    current: row.entries - row.exitsManual - row.exitsSales,
  }));
}

function renderPaginatedTable(host, tableId, rows, renderTable, emptyText) {
  if (rows.length === 0) {
    host.innerHTML = emptyState(emptyText);
    return;
  }

  const totalPages = Math.max(Math.ceil(rows.length / PAGE_SIZE), 1);
  const currentPage = Math.min(Math.max(ui.pages[tableId] || 1, 1), totalPages);
  ui.pages[tableId] = currentPage;
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);

  host.innerHTML = `
    <div class="table-scroll">
      ${renderTable(pageRows)}
    </div>
    ${renderPagination(tableId, currentPage, totalPages, rows.length)}
  `;
}

function renderPagination(tableId, currentPage, totalPages, totalRows) {
  if (totalPages <= 1) {
    return `<div class="pagination-info">${totalRows} registro(s)</div>`;
  }

  const buttons = getPaginationItems(currentPage, totalPages).map((item) => {
    if (item === "...") {
      return '<span class="pagination-ellipsis">...</span>';
    }

    return `
      <button
        type="button"
        class="pagination-button${item === currentPage ? " active" : ""}"
        data-table-page="${tableId}"
        data-page="${item}"
      >
        ${item}
      </button>
    `;
  }).join("");

  return `
    <div class="pagination-bar">
      <span>${totalRows} registro(s)</span>
      <div class="pagination-pages">${buttons}</div>
    </div>
  `;
}

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, 2, totalPages - 1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const visiblePages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return visiblePages.flatMap((page, index) => {
    const previous = visiblePages[index - 1];
    return previous && page - previous > 1 ? ["...", page] : [page];
  });
}

function renderIngredientList() {
  const ingredients = [...state.ingredients].sort(compareByName);
  renderPaginatedTable(els.ingredientList, "ingredients", ingredients, (rows) => `
    <table>
      <thead>
        <tr>
          <th>Insumo</th>
          <th>Embalagem</th>
          <th>Custo</th>
          <th>Custo por unidade base</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map((ingredient) => {
            const unitCost = ingredient.packageCost / ingredient.packageQuantity;
            return `
              <tr>
                <td>${ingredient.name}</td>
                <td>${formatNumber(ingredient.packageQuantity)} ${ingredient.unit}</td>
                <td>${formatCurrency(ingredient.packageCost)}</td>
                <td>${formatCurrency(unitCost)} / ${ingredient.unit}</td>
                <td>${actionButtons("ingredient", ingredient.id)}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `, "Nenhum insumo cadastrado ainda.");
}

function renderRecipeList() {
  const recipes = [...state.recipes].sort(compareByName);
  if (state.recipes.length === 0) {
    els.recipeList.innerHTML = emptyState("Cadastre um sabor para ver a composição aqui.");
    return;
  }

  renderPaginatedTable(els.recipeList, "recipes", recipes, (rows) => `
    <table>
      <thead>
        <tr>
          <th>Sabor</th>
          <th>Rendimento</th>
          <th>Custo unitário</th>
          <th>Preço sugerido</th>
          <th>Itens</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map((recipe) => `
            <tr>
              <td>${recipe.name}</td>
              <td>${recipe.yield}</td>
              <td>${formatCurrency(recipeUnitCost(recipe))}</td>
              <td>${formatCurrency(recipe.salePrice || 0)}</td>
                <td>
                <div class="mini-list">
                  ${recipe.items
                    .map((item) => {
                      const ingredient = getIngredientById(item.ingredientId);
                      if (!ingredient) return "";
                      return `<span class="mini-pill">${ingredient.name}: ${formatNumber(item.quantity)} ${ingredient.unit}</span>`;
                    })
                  .join("")}
                </div>
              </td>
              <td>${actionButtons("recipe", recipe.id)}</td>
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
  `, "Cadastre um sabor para ver a composicao aqui.");
}

function renderMovementList() {
  const movements = getVisibleMovements();
  if (movements.length === 0) {
    els.movementList.innerHTML = emptyState("Sem movimentos de estoque até agora.");
    return;
  }

  renderPaginatedTable(els.movementList, "movements", movements, (rows) => `
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Insumo</th>
          <th>Tipo</th>
          <th>Quantidade</th>
          <th>Valor</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map((movement) => {
            const ingredient = getIngredientById(movement.ingredientId);
            return `
              <tr>
                <td>${formatDate(movement.date)}</td>
                <td>${ingredient?.name || "-"}</td>
                <td>${movement.type === "entry" ? "Entrada" : "Saída manual"}</td>
                <td>${formatNumber(movement.quantity)} ${ingredient?.unit || ""}</td>
                <td>${movement.amount ? formatCurrency(movement.amount) : "-"}</td>
                <td>${actionButtons("movement", movement.id)}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `, "Sem movimentos de estoque ate agora.");
}

function renderSalesList() {
  const sales = getVisibleSales();
  if (sales.length === 0) {
    els.saleList.innerHTML = emptyState("Sem vendas registradas ainda.");
    return;
  }

  renderPaginatedTable(els.saleList, "sales", sales, (rows) => `
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Sabor</th>
          <th>Qtd.</th>
          <th>Receita</th>
          <th>Custo estimado</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map((sale) => {
            const recipe = state.recipes.find((item) => item.id === sale.recipeId);
            const unitCost = recipe ? recipeUnitCost(recipe) : 0;
            return `
              <tr>
                <td>${formatDate(sale.date)}</td>
                <td>${recipe?.name || "-"}</td>
                <td>${sale.quantity}</td>
                <td>${formatCurrency(sale.amount)}</td>
                <td>${formatCurrency(unitCost * sale.quantity)}</td>
                <td>${actionButtons("sale", sale.id)}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `, "Sem vendas registradas ainda.");
}

function renderSuggestedOrders() {
  const rows = getSuggestedOrderRows();

  if (rows.length === 0) {
    els.suggestedOrderList.innerHTML = emptyState("Nenhum pedido sugerido pelo site no momento.");
    return;
  }

  els.suggestedOrderList.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Recebido</th>
          <th>Sabor</th>
          <th>Qtd.</th>
          <th>Total do item</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(({ order, item, itemIndex }) => `
          <tr class="suggested-row">
            <td>${formatDateTime(order.createdAt)}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(Number(item.quantity || 0) * Number(item.price || 0))}</td>
            <td>
              <div class="row-actions">
                <button type="button" class="table-action" data-suggested-action="fill" data-order-id="${order.id}" data-item-index="${itemIndex}">Preencher venda</button>
                <button type="button" class="table-action danger" data-suggested-action="dismiss" data-order-id="${order.id}">Dispensar</button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderSiteConfigEditor() {
  const config = getSiteConfig();
  els.siteCopyForm.heroTitle.value = config.heroTitle;
  els.siteCopyForm.featuredProductId.innerHTML = [
    '<option value="">Sem destaque</option>',
    ...config.products.map((product) => `<option value="${product.id}">${product.name}</option>`),
  ].join("");
  els.siteCopyForm.featuredProductId.value = config.featuredProductId;

  els.siteProductEditor.innerHTML = config.products.map((product) => `
    <article class="site-editor-card" data-product-id="${product.id}">
      <div class="site-editor-media">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="site-editor-fields">
        <label>
          Exibir no site
          <select data-site-field="active">
            <option value="true"${product.active !== false ? " selected" : ""}>Sim</option>
            <option value="false"${product.active === false ? " selected" : ""}>Não</option>
          </select>
        </label>
        <label>
          Nome
          <input data-site-field="name" value="${escapeAttribute(product.name)}" />
        </label>
        <label>
          Preço
          <input data-site-field="price" type="number" min="0" step="0.01" value="${product.price}" />
        </label>
        <label>
          Etiqueta
          <input data-site-field="tag" value="${escapeAttribute(product.tag)}" />
        </label>
        <label class="full">
          Descrição
          <input data-site-field="description" value="${escapeAttribute(product.description)}" />
        </label>
        <label class="full">
          Imagem
          <input data-site-field="image" value="${escapeAttribute(product.image)}" />
        </label>
        <label class="full">
          Trocar imagem
          <input type="file" accept="image/png,image/jpeg,image/webp" data-site-image-upload />
          <span class="field-hint">Envie uma nova foto para atualizar este brownie automaticamente.</span>
        </label>
        ${product.custom ? `
          <div class="full actions">
            <button type="button" class="ghost-button danger" data-site-product-delete="${product.id}">Excluir brownie</button>
          </div>
        ` : ""}
      </div>
    </article>
  `).join("");
  els.siteProductEditor.querySelectorAll("[data-site-product-delete]").forEach((button) => {
    button.onclick = () => deleteSiteProduct(button.dataset.siteProductDelete);
  });

  renderUpcomingProductList();
}

function renderUpcomingProductList() {
  const upcoming = getSiteConfig().upcomingProducts;
  if (upcoming.length === 0) {
    els.upcomingProductList.innerHTML = emptyState("Nenhum próximo brownie cadastrado.");
    return;
  }

  els.upcomingProductList.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Previsão</th>
          <th>Descrição</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${upcoming.map((product) => `
          <tr>
            <td>${product.name}</td>
            <td>${product.eta || "-"}</td>
            <td>${product.description || "-"}</td>
            <td><button type="button" class="table-action danger" data-upcoming-delete="${product.id}">Excluir</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
  els.upcomingProductList.querySelectorAll("[data-upcoming-delete]").forEach((button) => {
    button.onclick = () => deleteUpcomingProduct(button.dataset.upcomingDelete);
  });
}

async function handleSiteCopySubmit(event) {
  event.preventDefault();
  const stopLoading = startButtonLoading(event.submitter, "Salvando...");
  const config = getSiteConfig();
  state.siteConfig = {
    ...config,
    heroTitle: event.currentTarget.heroTitle.value.trim() || defaultSiteConfig.heroTitle,
    featuredProductId: event.currentTarget.featuredProductId.value,
  };
  const saved = await saveSiteConfig({ immediate: true });
  stopLoading();
  showSiteConfigStatus(saved ? "Textos salvos com sucesso." : "Não foi possível salvar agora.", saved ? "success" : "error");
}

async function handleSiteProductSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const stopLoading = startButtonLoading(event.submitter, "Adicionando...");
  const data = new FormData(event.currentTarget);
  const config = getSiteConfig();
  let image = String(data.get("image") || "").trim();

  try {
    const file = form.imageFile?.files?.[0];
    if (file) {
      showSiteConfigStatus("Enviando imagem...", "saving");
      image = await uploadSiteImage(file);
    }
  } catch {
    stopLoading();
    showSiteConfigStatus("Não foi possível enviar a imagem. Tente novamente.", "error");
    return;
  }

  const product = normalizeSiteProduct({
    id: createProductId(data.get("name"), config.products),
    name: data.get("name"),
    price: data.get("price"),
    tag: data.get("tag") || "Novo",
    image,
    description: data.get("description"),
    active: true,
    custom: true,
  });
  if (!product) {
    stopLoading();
    showSiteConfigStatus("Preencha nome, imagem e descrição para adicionar o brownie.", "error");
    return;
  }

  state.siteConfig = {
    ...config,
    products: [...config.products, product],
  };
  form.reset();
  const saved = await saveSiteConfig({ immediate: true });
  stopLoading();
  showSiteConfigStatus(saved ? "Brownie adicionado ao cardápio." : "Brownie adicionado localmente, mas não foi salvo no servidor.", saved ? "success" : "error");
}

function handleSiteProductInput(event) {
  const field = event.target.dataset.siteField;
  if (!field) return;

  const card = event.target.closest("[data-product-id]");
  const productId = card?.dataset.productId;
  const config = getSiteConfig();
  const products = config.products.map((product) => {
    if (product.id !== productId) return product;
    const value = event.target.value;
    return {
      ...product,
      [field]: field === "active" ? value === "true" : field === "price" ? Number(value || 0) : value,
    };
  });
  state.siteConfig = { ...config, products };
  saveSiteConfig({ renderEditor: false });
}

async function handleSiteProductImageUpload(event) {
  const input = event.target.closest("[data-site-image-upload]");
  if (!input || !input.files?.[0]) return;

  const card = input.closest("[data-product-id]");
  const productId = card?.dataset.productId;
  if (!productId) return;

  input.disabled = true;
  showSiteConfigStatus("Enviando imagem...", "saving");

  try {
    const image = await uploadSiteImage(input.files[0]);
    const config = getSiteConfig();
    const products = config.products.map((product) =>
      product.id === productId ? { ...product, image } : product,
    );
    state.siteConfig = { ...config, products };
    const saved = await saveSiteConfig({ immediate: true });
    showSiteConfigStatus(saved ? "Imagem atualizada com sucesso." : "Imagem enviada, mas não foi possível salvar no servidor.", saved ? "success" : "error");
  } catch {
    showSiteConfigStatus("Não foi possível enviar a imagem. Tente outra foto.", "error");
  } finally {
    input.disabled = false;
    input.value = "";
  }
}

async function deleteSiteProduct(id) {
  const config = getSiteConfig();
  const confirmed = window.confirm("Remover este brownie do cardapio?");
  if (!confirmed) return;
  showSiteConfigStatus("Salvando...", "saving");
  state.siteConfig = {
    ...config,
    featuredProductId: config.featuredProductId === id ? "" : config.featuredProductId,
    products: config.products.filter((product) => product.id !== id),
  };
  saleCart.delete(id);
  const saved = await saveSiteConfig({ immediate: true });
  showSiteConfigStatus(saved ? "Brownie removido do cardápio." : "Não foi possível salvar a remoção agora.", saved ? "success" : "error");
}

async function handleUpcomingProductSubmit(event) {
  event.preventDefault();
  const stopLoading = startButtonLoading(event.submitter, "Adicionando...");
  const data = new FormData(event.currentTarget);
  const next = normalizeUpcomingProduct({
    name: data.get("name"),
    eta: data.get("eta"),
    description: data.get("description"),
  });
  if (!next) {
    stopLoading();
    showSiteConfigStatus("Informe ao menos o nome do próximo brownie.", "error");
    return;
  }

  const config = getSiteConfig();
  state.siteConfig = {
    ...config,
    upcomingProducts: [...config.upcomingProducts, next],
  };
  event.currentTarget.reset();
  const saved = await saveSiteConfig({ immediate: true });
  stopLoading();
  showSiteConfigStatus(saved ? "Próximo brownie adicionado." : "Não foi possível salvar agora.", saved ? "success" : "error");
}

async function deleteUpcomingProduct(id) {
  const config = getSiteConfig();
  showSiteConfigStatus("Salvando...", "saving");
  state.siteConfig = {
    ...config,
    upcomingProducts: config.upcomingProducts.filter((product) => product.id !== id),
  };
  const saved = await saveSiteConfig({ immediate: true });
  showSiteConfigStatus(saved ? "Próximo brownie removido." : "Não foi possível salvar a remoção agora.", saved ? "success" : "error");
}

async function saveSiteConfig(options = {}) {
  state.siteConfig = normalizeSiteConfig(state.siteConfig);
  if (siteConfigSaveTimer) window.clearTimeout(siteConfigSaveTimer);
  if (options.immediate) {
    showSiteConfigStatus("Salvando...", "saving");
    const saved = await saveState();
    if (!saved) serverSync.pending = true;
    renderSaleProducts();
    renderSiteHighlights();
    updateOrderSummary();
    if (options.renderEditor !== false) renderSiteConfigEditor();
    return saved;
  } else {
    showSiteConfigStatus("Salvando...", "saving");
    siteConfigSaveTimer = window.setTimeout(async () => {
      const saved = await saveState();
      if (!saved) serverSync.pending = true;
      showSiteConfigStatus(saved ? "Alteração salva." : "Não foi possível salvar agora.", saved ? "success" : "error");
    }, 450);
  }
  renderSaleProducts();
  renderSiteHighlights();
  updateOrderSummary();
  if (options.renderEditor !== false) renderSiteConfigEditor();
  return true;
}

function getSuggestedOrderRows() {
  return suggestedOrders.flatMap((order) =>
    (order.items || []).map((item, index) => ({
      order,
      item,
      itemIndex: index,
    })),
  );
}

async function handleSuggestedOrderAction(action, orderId, itemIndex) {
  if (action === "fill") {
    fillSuggestedSale(orderId, itemIndex);
    return;
  }

  if (action === "dismiss") {
    const updated = await updateSuggestedOrderStatus(orderId, "dismissed");
    if (updated) {
      suggestedOrders = suggestedOrders.filter((order) => order.id !== orderId);
      if (activeSuggestedOrderId === orderId) activeSuggestedOrderId = null;
      renderSuggestedOrders();
      bindActionButtons();
    } else {
      alert("Nao consegui dispensar esse pedido agora. Tente novamente.");
    }
  }
}

function fillSuggestedSale(orderId, itemIndex, options = {}) {
  const order = suggestedOrders.find((item) => item.id === orderId);
  const orderItem = order?.items?.[itemIndex];
  if (!orderItem) return;

  const recipe = findRecipeForSuggestedItem(orderItem);
  if (!recipe) {
    alert(`Nao encontrei um sabor chamado "${orderItem.name}" no painel. Cadastre ou ajuste o nome do sabor antes de salvar essa venda.`);
    return;
  }

  activeSuggestedOrderId = orderId;
  editing.saleId = null;
  const form = els.saleForm;
  activateSection("vendas");
  form.recipeId.value = recipe.id;
  form.quantity.value = Number(orderItem.quantity || 1);
  form.amount.value = Number(orderItem.quantity || 1) * Number(orderItem.price || recipe.salePrice || 0);
  form.date.value = new Date().toISOString().slice(0, 10);
  form.notes.value = `Pedido sugerido pelo site em ${formatDateTime(order.createdAt)}.`;
  setFormButton(form, "Salvar venda sugerida");
  if (options.scroll !== false) {
    window.setTimeout(() => form.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }
}

function findRecipeForSuggestedItem(orderItem) {
  const suggestedName = normalizeText(orderItem.name);
  const suggestedNameLoose = simplifyProductName(orderItem.name);
  return state.recipes.find((recipe) => {
    const recipeName = normalizeText(recipe.name);
    return recipeName === suggestedName || recipeName === suggestedNameLoose;
  });
}

function simplifyProductName(value) {
  return normalizeText(value).replace(/\b(de|da|do|das|dos)\b/g, "").replace(/\s+/g, " ").trim();
}

async function updateSuggestedOrderStatus(orderId, status) {
  try {
    const response = await fetch(API_URLS.orders, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateStatus", id: orderId, status }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function renderInventorySummary() {
  const range = getActiveMonthRange();
  const snapshot = getInventorySnapshot({ throughDate: range?.end ?? null })
    .sort((a, b) => compareByName(a.ingredient, b.ingredient));
  renderPaginatedTable(els.inventorySummary, "inventory-summary", snapshot, (rows) => `
    <table>
      <thead>
        <tr>
          <th>Insumo</th>
          <th>Entradas</th>
          <th>Saídas manuais</th>
          <th>Saídas por venda</th>
          <th>Saldo</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map((row) => `
            <tr>
              <td>${row.ingredient.name}</td>
              <td>${formatNumber(row.entries)} ${row.ingredient.unit}</td>
              <td>${formatNumber(row.exitsManual)} ${row.ingredient.unit}</td>
              <td>${formatNumber(row.exitsSales)} ${row.ingredient.unit}</td>
              <td>${formatNumber(row.current)} ${row.ingredient.unit}</td>
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
  `, "Nenhum insumo cadastrado ainda.");
}

function renderSalesSummary() {
  const sales = getVisibleSales();
  if (sales.length === 0) {
    els.salesSummary.innerHTML = emptyState("As vendas mais recentes vão aparecer aqui.");
    return;
  }

  renderPaginatedTable(els.salesSummary, "sales-summary", sales, (rows) => `
    <table>
      <thead>
        <tr>
          <th>Sabor</th>
          <th>Qtd.</th>
          <th>Receita</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map((sale) => {
            const recipe = state.recipes.find((item) => item.id === sale.recipeId);
            return `
              <tr>
                <td>${recipe?.name || "-"}</td>
                <td>${sale.quantity}</td>
                <td>${formatCurrency(sale.amount)}</td>
                <td>${formatDate(sale.date)}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `, "As vendas mais recentes vao aparecer aqui.");
}

function renderFinance() {
  const movements = getVisibleMovements();
  const sales = getVisibleSales();
  const expense = movements.reduce((sum, movement) => sum + (movement.amount || 0), 0);
  const income = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const estimatedCost = sales.reduce((sum, sale) => {
    const recipe = state.recipes.find((item) => item.id === sale.recipeId);
    return sum + (recipe ? recipeUnitCost(recipe) * sale.quantity : 0);
  }, 0);

  document.getElementById("finance-income").textContent = formatCurrency(income);
  document.getElementById("finance-expense").textContent = formatCurrency(expense);
  document.getElementById("finance-profit").textContent = formatCurrency(income - estimatedCost);

  const rows = buildFinanceRows({ movements, sales });

  if (rows.length === 0) {
    els.financeList.innerHTML = emptyState("O fluxo financeiro vai aparecer aqui conforme você registrar compras e vendas.");
    return;
  }

  renderPaginatedTable(els.financeList, "finance", rows, (pageRows) => `
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Tipo</th>
          <th>Descrição</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        ${pageRows
          .map((row) => `
            <tr>
              <td>${formatDate(row.date)}</td>
              <td>${row.type}</td>
              <td>${row.description}</td>
              <td>${formatCurrency(row.amount)}</td>
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
  `, "O fluxo financeiro vai aparecer aqui conforme voce registrar compras e vendas.");
}

function buildFinanceRows({ movements = state.movements, sales = state.sales } = {}) {
  return [
    ...movements.map((movement) => ({
      date: movement.date,
      type: "Despesa",
      description: `${getIngredientById(movement.ingredientId)?.name || "Insumo"} (${movement.type === "entry" ? "entrada" : "saída manual"})`,
      amount: -(movement.amount || 0),
    })),
    ...sales.map((sale) => ({
      date: sale.date,
      type: "Receita",
      description: state.recipes.find((item) => item.id === sale.recipeId)?.name || "Venda",
      amount: sale.amount,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
}

function renderKpis() {
  const visibleSales = getVisibleSales();
  const visibleMovements = getVisibleMovements();
  const income = visibleSales.reduce((sum, sale) => sum + sale.amount, 0);
  const expense = visibleMovements.reduce((sum, movement) => sum + (movement.amount || 0), 0);
  document.getElementById("kpi-ingredients").textContent = String(state.ingredients.length);
  document.getElementById("kpi-recipes").textContent = String(state.recipes.length);
  document.getElementById("kpi-sales").textContent = String(visibleSales.length);
  document.getElementById("kpi-balance").textContent = formatCurrency(income - expense);
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "brownie-da-keise-dados.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportExcel() {
  const inventory = getInventorySnapshot();
  const financeRows = buildFinanceRows();
  const recipeRows = state.recipes.map((recipe) => ({
    recipe,
    unitCost: recipeUnitCost(recipe),
  }));

  const workbook = [
    '<?xml version="1.0"?>',
    '<?mso-application progid="Excel.Sheet"?>',
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"',
    ' xmlns:o="urn:schemas-microsoft-com:office:office"',
    ' xmlns:x="urn:schemas-microsoft-com:office:excel"',
    ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"',
    ' xmlns:html="http://www.w3.org/TR/REC-html40">',
    createWorksheetXml("Insumos", [
      ["Insumo", "Unidade", "Embalagem", "Custo Embalagem", "Observacao"],
      ...state.ingredients.map((ingredient) => [
        ingredient.name,
        ingredient.unit,
        ingredient.packageQuantity,
        ingredient.packageCost,
        ingredient.notes || "",
      ]),
    ]),
    createWorksheetXml("Sabores", [
      ["Sabor", "Rendimento", "Preco Venda", "Custo Unitario", "Itens", "Observacao"],
      ...recipeRows.map(({ recipe, unitCost }) => [
        recipe.name,
        recipe.yield,
        recipe.salePrice || 0,
        unitCost,
        recipe.items
          .map((item) => {
            const ingredient = getIngredientById(item.ingredientId);
            return ingredient ? `${ingredient.name}: ${formatNumber(item.quantity)} ${ingredient.unit}` : "";
          })
          .filter(Boolean)
          .join(" | "),
        recipe.notes || "",
      ]),
    ]),
    createWorksheetXml("Estoque", [
      ["Insumo", "Entradas", "Saidas Manuais", "Saidas por Venda", "Saldo Atual", "Unidade"],
      ...inventory.map((row) => [
        row.ingredient.name,
        row.entries,
        row.exitsManual,
        row.exitsSales,
        row.current,
        row.ingredient.unit,
      ]),
    ]),
    createWorksheetXml("Movimentos", [
      ["Data", "Insumo", "Tipo", "Quantidade", "Valor", "Observacao"],
      ...state.movements.map((movement) => {
        const ingredient = getIngredientById(movement.ingredientId);
        return [
          formatDate(movement.date),
          ingredient?.name || "-",
          movement.type === "entry" ? "Entrada" : "Saída manual",
          movement.quantity,
          movement.amount || 0,
          movement.notes || "",
        ];
      }),
    ]),
    createWorksheetXml("Vendas", [
      ["Data", "Sabor", "Quantidade", "Receita", "Custo Estimado", "Observacao"],
      ...state.sales.map((sale) => {
        const recipe = state.recipes.find((item) => item.id === sale.recipeId);
        const unitCost = recipe ? recipeUnitCost(recipe) : 0;
        return [
          formatDate(sale.date),
          recipe?.name || "-",
          sale.quantity,
          sale.amount,
          unitCost * sale.quantity,
          sale.notes || "",
        ];
      }),
    ]),
    createWorksheetXml("Financeiro", [
      ["Data", "Tipo", "Descricao", "Valor"],
      ...financeRows.map((row) => [formatDate(row.date), row.type, row.description, row.amount]),
    ]),
    "</Workbook>",
  ].join("");

  const blob = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "brownie-da-keise-export.xls";
  anchor.click();
  URL.revokeObjectURL(url);
}

function createWorksheetXml(name, rows) {
  const cells = rows
    .map(
      (row) => `
        <Row>
          ${row
            .map((value) => {
              const text = value ?? "";
              const numericValue = typeof text === "number" ? text : Number(String(text).replace(",", "."));
              const isNumeric = text !== "" && Number.isFinite(numericValue) && !/[A-Za-z]/.test(String(text));
              const type = isNumeric ? "Number" : "String";
              const output = isNumeric ? String(numericValue) : escapeXml(String(text));
              return `<Cell><Data ss:Type="${type}">${output}</Data></Cell>`;
            })
            .join("")}
        </Row>
      `,
    )
    .join("");

  return `<Worksheet ss:Name="${escapeXml(name)}"><Table>${cells}</Table></Worksheet>`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function importExcelFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const xml = String(reader.result || "");
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "application/xml");
      if (doc.querySelector("parsererror")) throw new Error("invalid_xml");
      importWorkbookData(doc);
      saveState();
      renderAll();
      alert("Dados importados do Excel com sucesso.");
    } catch {
      alert("Não consegui importar esse Excel. Use o arquivo exportado pelo próprio sistema.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function importWorkbookData(doc) {
  const ingredientsRows = readWorksheetRows(doc, "Insumos");
  const recipesRows = readWorksheetRows(doc, "Sabores");
  const movementsRows = readWorksheetRows(doc, "Movimentos");
  const salesRows = readWorksheetRows(doc, "Vendas");

  const importedIngredients = ingredientsRows.slice(1).filter((row) => row.some(Boolean)).map((row) => ({
    id: crypto.randomUUID(),
    name: row[0] || "",
    unit: row[1] || "g",
    packageQuantity: Number(row[2] || 0),
    packageCost: Number(row[3] || 0),
    notes: row[4] || "",
  }));

  const ingredientByName = new Map();
  importedIngredients.forEach((ingredient) => {
    if (ingredient.name) ingredientByName.set(normalizeText(ingredient.name), ingredient);
  });

  const importedRecipes = recipesRows
    .slice(1)
    .filter((row) => row.some(Boolean))
    .map((row) => {
      const items = parseRecipeItems(row[4], ingredientByName);
      return {
        id: crypto.randomUUID(),
        name: row[0] || "Sabor importado",
        yield: Number(row[1] || 12),
        salePrice: Number(row[2] || 0),
        notes: row[5] || "",
        items,
      };
    });

  const recipeByName = new Map();
  importedRecipes.forEach((recipe) => {
    recipeByName.set(normalizeText(recipe.name), recipe);
  });

  const importedMovements = movementsRows
    .slice(1)
    .filter((row) => row.some(Boolean))
    .map((row) => {
      const ingredient = ingredientByName.get(normalizeText(row[1] || ""));
      if (!ingredient) return null;
      return {
        id: crypto.randomUUID(),
        date: parseImportedDate(row[0]),
        ingredientId: ingredient.id,
        type: normalizeText(row[2]) === "entrada" ? "entry" : "exit",
        quantity: Number(row[3] || 0),
        amount: Number(row[4] || 0),
        notes: row[5] || "",
      };
    })
    .filter(Boolean);

  const importedSales = salesRows
    .slice(1)
    .filter((row) => row.some(Boolean))
    .map((row) => {
      const recipe = recipeByName.get(normalizeText(row[1] || ""));
      if (!recipe) return null;
      return {
        id: crypto.randomUUID(),
        date: parseImportedDate(row[0]),
        recipeId: recipe.id,
        quantity: Number(row[2] || 0),
        amount: Number(row[3] || 0),
        notes: row[5] || "",
      };
    })
    .filter(Boolean);

  if (
    importedIngredients.length === 0
    && importedRecipes.length === 0
    && importedMovements.length === 0
    && importedSales.length === 0
  ) {
    throw new Error("empty_import");
  }

  state.ingredients = importedIngredients;
  state.recipes = importedRecipes;
  state.movements = importedMovements;
  state.sales = importedSales;
}

function readWorksheetRows(doc, worksheetName) {
  const worksheets = Array.from(doc.getElementsByTagName("Worksheet"));
  const worksheet = worksheets.find((node) => getWorksheetName(node) === worksheetName);
  if (!worksheet) return [];

  return Array.from(worksheet.getElementsByTagName("Row")).map((row) =>
    Array.from(row.getElementsByTagName("Cell")).map((cell) => {
      const data = cell.getElementsByTagName("Data")[0];
      return data?.textContent?.trim() || "";
    }),
  );
}

function getWorksheetName(node) {
  return (
    node.getAttribute("ss:Name")
    || node.getAttribute("Name")
    || node.getAttributeNS("urn:schemas-microsoft-com:office:spreadsheet", "Name")
    || ""
  );
}

function parseRecipeItems(text, ingredientByName) {
  if (!text) return [];
  return text
    .split(" | ")
    .map((part) => {
      const separator = part.indexOf(": ");
      if (separator === -1) return null;
      const name = part.slice(0, separator).trim();
      const quantityText = part.slice(separator + 2).trim();
      const match = quantityText.match(/^([\d.,]+)\s*(.*)$/);
      if (!match) return null;
      const ingredient = ingredientByName.get(normalizeText(name));
      if (!ingredient) return null;
      return {
        ingredientId: ingredient.id,
        quantity: Number(match[1].replace(",", ".")) || 0,
      };
    })
    .filter((item) => item && item.quantity > 0);
}

function parseImportedDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const brMatch = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brMatch) return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`;
  const isoMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return value;
  return new Date().toISOString().slice(0, 10);
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state.ingredients = parsed.ingredients || [];
      state.recipes = parsed.recipes || [];
      state.movements = parsed.movements || [];
      state.sales = parsed.sales || [];
      state.siteConfig = normalizeSiteConfig(parsed.siteConfig);
      saveState();
      renderAll();
    } catch {
      alert("Não consegui importar esse arquivo.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function resetData() {
  const confirmed = window.confirm("Isso vai apagar os dados salvos neste navegador. Deseja continuar?");
  if (!confirmed) return;
  state.ingredients = structuredClone(seedState.ingredients);
  state.recipes = [];
  state.movements = [];
  state.sales = [];
  state.siteConfig = structuredClone(defaultSiteConfig);
  ensureSampleRecipes();
  saveState();
  renderAll();
}

function actionButtons(type, id) {
  return `
    <div class="row-actions">
      <button type="button" class="table-action" data-action="edit" data-type="${type}" data-id="${id}">Editar</button>
      <button type="button" class="table-action danger" data-action="delete" data-type="${type}" data-id="${id}">Excluir</button>
    </div>
  `;
}

function bindActionButtons() {
  document.querySelectorAll(".table-action").forEach((button) => {
    button.onclick = async () => {
      const { action, type, id, suggestedAction, orderId, itemIndex } = button.dataset;
      if (suggestedAction) {
        await handleSuggestedOrderAction(suggestedAction, Number(orderId), Number(itemIndex || 0));
        return;
      }
      if (action === "edit") handleEdit(type, id);
      if (action === "delete") handleDelete(type, id);
    };
  });
}

function handleEdit(type, id) {
  if (type === "ingredient") {
    const ingredient = state.ingredients.find((item) => item.id === id);
    if (!ingredient) return;
    editing.ingredientId = id;
    const form = els.ingredientForm;
    form.name.value = ingredient.name;
    form.unit.value = ingredient.unit;
    form.packageQuantity.value = ingredient.packageQuantity;
    form.packageCost.value = ingredient.packageCost;
    form.notes.value = ingredient.notes || "";
    setFormButton(form, "Atualizar insumo");
  }

  if (type === "recipe") {
    const recipe = state.recipes.find((item) => item.id === id);
    if (!recipe) return;
    editing.recipeId = id;
    const form = els.recipeForm;
    form.name.value = recipe.name;
    form.yield.value = recipe.yield;
    form.salePrice.value = recipe.salePrice || "";
    form.notes.value = recipe.notes || "";
    els.recipeItems.innerHTML = "";
    recipe.items.forEach((item) => appendRecipeItem(item));
    setFormButton(form, "Atualizar sabor");
  }

  if (type === "movement") {
    const movement = state.movements.find((item) => item.id === id);
    if (!movement) return;
    editing.movementId = id;
    const form = els.movementForm;
    form.ingredientId.value = movement.ingredientId;
    form.type.value = movement.type;
    form.quantity.value = movement.quantity;
    form.amount.value = movement.amount || "";
    form.date.value = movement.date;
    form.notes.value = movement.notes || "";
    setFormButton(form, "Atualizar movimento");
  }

  if (type === "sale") {
    const sale = state.sales.find((item) => item.id === id);
    if (!sale) return;
    activeSuggestedOrderId = null;
    editing.saleId = id;
    const form = els.saleForm;
    form.recipeId.value = sale.recipeId;
    form.quantity.value = sale.quantity;
    form.amount.value = sale.amount;
    form.date.value = sale.date;
    form.notes.value = sale.notes || "";
    setFormButton(form, "Atualizar venda");
  }
}

function handleDelete(type, id) {
  if (type === "ingredient") {
    const usedInRecipes = state.recipes.some((recipe) => recipe.items.some((item) => item.ingredientId === id));
    const usedInMovements = state.movements.some((movement) => movement.ingredientId === id);
    if (usedInRecipes || usedInMovements) {
      alert("Esse insumo já está sendo usado em receitas ou movimentos. Edite primeiro essas referências antes de excluir.");
      return;
    }
    state.ingredients = state.ingredients.filter((item) => item.id !== id);
  }

  if (type === "recipe") {
    const usedInSales = state.sales.some((sale) => sale.recipeId === id);
    if (usedInSales) {
      alert("Esse sabor já possui vendas registradas. Exclua ou edite as vendas antes de remover o sabor.");
      return;
    }
    state.recipes = state.recipes.filter((item) => item.id !== id);
  }

  if (type === "movement") {
    state.movements = state.movements.filter((item) => item.id !== id);
  }

  if (type === "sale") {
    state.sales = state.sales.filter((item) => item.id !== id);
  }

  saveState();
  renderAll();
}

function setFormButton(form, text) {
  const button = form.querySelector('button[type="submit"]');
  if (button) button.textContent = text;
}

function resetFormButton(form, fallbackText) {
  setFormButton(form, fallbackText);
}

function setToday(input, value = new Date().toISOString().slice(0, 10)) {
  if (input && !input.value) input.value = value;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
  if (!value) return "-";
  const normalized = String(value).includes("T") ? value : String(value).replace(" ", "T");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function emptyState(text) {
  return `<div class="empty-state">${text}</div>`;
}

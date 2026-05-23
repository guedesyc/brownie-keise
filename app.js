const STORAGE_KEY = "brownie-da-keise-app-v2";
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
};

const state = loadState();

const els = {
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

function init() {
  bindNavigation();
  bindForms();
  ensureSampleRecipes();
  renderAll();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(seedState);
    const parsed = JSON.parse(raw);
    return {
      ingredients: parsed.ingredients || [],
      recipes: parsed.recipes || [],
      movements: parsed.movements || [],
      sales: parsed.sales || [],
    };
  } catch {
    return structuredClone(seedState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindNavigation() {
  els.navLinks.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.section;
      els.navLinks.forEach((link) => link.classList.toggle("active", link === button));
      els.sections.forEach((section) => section.classList.toggle("active", section.id === target));
    });
  });
}

function bindForms() {
  els.ingredientForm.addEventListener("submit", handleIngredientSubmit);
  els.recipeForm.addEventListener("submit", handleRecipeSubmit);
  els.movementForm.addEventListener("submit", handleMovementSubmit);
  els.saleForm.addEventListener("submit", handleSaleSubmit);
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

function handleSaleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const recipe = state.recipes.find((item) => item.id === data.get("recipeId"));
  if (!recipe) return;

  const quantity = Number(data.get("quantity"));
  const amount = Number(data.get("amount") || recipe.salePrice * quantity);

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
  saveState();
  event.currentTarget.reset();
  setToday(event.currentTarget.querySelector('[name="date"]'));
  resetFormButton(event.currentTarget, "Salvar venda");
  renderAll();
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
    button.onclick = () => {
      const { action, type, id } = button.dataset;
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

function emptyState(text) {
  return `<div class="empty-state">${text}</div>`;
}

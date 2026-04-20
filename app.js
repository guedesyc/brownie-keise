const STORAGE_KEY = "brownie-da-keise-app-v2";

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
  importData: document.getElementById("import-data"),
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
  els.importData.addEventListener("change", importData);
  els.resetData.addEventListener("click", resetData);
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
}

function handleIngredientSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  state.ingredients.push({
    id: crypto.randomUUID(),
    name: data.get("name").trim(),
    unit: data.get("unit"),
    packageQuantity: Number(data.get("packageQuantity")),
    packageCost: Number(data.get("packageCost")),
    notes: data.get("notes").trim(),
  });
  saveState();
  event.currentTarget.reset();
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

  state.recipes.push({
    id: crypto.randomUUID(),
    name: data.get("name").trim(),
    yield: Number(data.get("yield")),
    salePrice: Number(data.get("salePrice") || 0),
    notes: data.get("notes").trim(),
    items,
  });

  saveState();
  event.currentTarget.reset();
  els.recipeItems.innerHTML = "";
  appendRecipeItem();
  renderAll();
}

function handleMovementSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  state.movements.unshift({
    id: crypto.randomUUID(),
    ingredientId: data.get("ingredientId"),
    type: data.get("type"),
    quantity: Number(data.get("quantity")),
    amount: Number(data.get("amount") || 0),
    date: data.get("date"),
    notes: data.get("notes").trim(),
  });
  saveState();
  event.currentTarget.reset();
  setToday(event.currentTarget.querySelector('[name="date"]'));
  renderAll();
}

function handleSaleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const recipe = state.recipes.find((item) => item.id === data.get("recipeId"));
  if (!recipe) return;

  const quantity = Number(data.get("quantity"));
  const amount = Number(data.get("amount") || recipe.salePrice * quantity);

  state.sales.unshift({
    id: crypto.randomUUID(),
    recipeId: recipe.id,
    quantity,
    amount,
    date: data.get("date"),
    notes: data.get("notes").trim(),
  });
  saveState();
  event.currentTarget.reset();
  setToday(event.currentTarget.querySelector('[name="date"]'));
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

function getInventorySnapshot() {
  const totals = new Map();

  state.ingredients.forEach((ingredient) => {
    totals.set(ingredient.id, { ingredient, entries: 0, exitsManual: 0, exitsSales: 0 });
  });

  state.movements.forEach((movement) => {
    const item = totals.get(movement.ingredientId);
    if (!item) return;
    if (movement.type === "entry") item.entries += movement.quantity;
    if (movement.type === "exit") item.exitsManual += movement.quantity;
  });

  state.sales.forEach((sale) => {
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

function renderIngredientList() {
  if (state.ingredients.length === 0) {
    els.ingredientList.innerHTML = emptyState("Nenhum insumo cadastrado ainda.");
    return;
  }

  els.ingredientList.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Insumo</th>
          <th>Embalagem</th>
          <th>Custo</th>
          <th>Custo por unidade base</th>
        </tr>
      </thead>
      <tbody>
        ${state.ingredients
          .map((ingredient) => {
            const unitCost = ingredient.packageCost / ingredient.packageQuantity;
            return `
              <tr>
                <td>${ingredient.name}</td>
                <td>${formatNumber(ingredient.packageQuantity)} ${ingredient.unit}</td>
                <td>${formatCurrency(ingredient.packageCost)}</td>
                <td>${formatCurrency(unitCost)} / ${ingredient.unit}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderRecipeList() {
  if (state.recipes.length === 0) {
    els.recipeList.innerHTML = emptyState("Cadastre um sabor para ver a composição aqui.");
    return;
  }

  els.recipeList.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Sabor</th>
          <th>Rendimento</th>
          <th>Custo unitário</th>
          <th>Preço sugerido</th>
          <th>Itens</th>
        </tr>
      </thead>
      <tbody>
        ${state.recipes
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
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
  `;
}

function renderMovementList() {
  if (state.movements.length === 0) {
    els.movementList.innerHTML = emptyState("Sem movimentos de estoque até agora.");
    return;
  }

  els.movementList.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Insumo</th>
          <th>Tipo</th>
          <th>Quantidade</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        ${state.movements
          .map((movement) => {
            const ingredient = getIngredientById(movement.ingredientId);
            return `
              <tr>
                <td>${formatDate(movement.date)}</td>
                <td>${ingredient?.name || "-"}</td>
                <td>${movement.type === "entry" ? "Entrada" : "Saída manual"}</td>
                <td>${formatNumber(movement.quantity)} ${ingredient?.unit || ""}</td>
                <td>${movement.amount ? formatCurrency(movement.amount) : "-"}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderSalesList() {
  if (state.sales.length === 0) {
    els.saleList.innerHTML = emptyState("Sem vendas registradas ainda.");
    return;
  }

  els.saleList.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Sabor</th>
          <th>Qtd.</th>
          <th>Receita</th>
          <th>Custo estimado</th>
        </tr>
      </thead>
      <tbody>
        ${state.sales
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
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderInventorySummary() {
  const snapshot = getInventorySnapshot();
  els.inventorySummary.innerHTML = `
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
        ${snapshot
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
  `;
}

function renderSalesSummary() {
  const latest = state.sales.slice(0, 6);
  if (latest.length === 0) {
    els.salesSummary.innerHTML = emptyState("As vendas mais recentes vão aparecer aqui.");
    return;
  }

  els.salesSummary.innerHTML = `
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
        ${latest
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
  `;
}

function renderFinance() {
  const expense = state.movements.reduce((sum, movement) => sum + (movement.amount || 0), 0);
  const income = state.sales.reduce((sum, sale) => sum + sale.amount, 0);
  const estimatedCost = state.sales.reduce((sum, sale) => {
    const recipe = state.recipes.find((item) => item.id === sale.recipeId);
    return sum + (recipe ? recipeUnitCost(recipe) * sale.quantity : 0);
  }, 0);

  document.getElementById("finance-income").textContent = formatCurrency(income);
  document.getElementById("finance-expense").textContent = formatCurrency(expense);
  document.getElementById("finance-profit").textContent = formatCurrency(income - estimatedCost);

  const rows = [
    ...state.movements.map((movement) => ({
      date: movement.date,
      type: "Despesa",
      description: `${getIngredientById(movement.ingredientId)?.name || "Insumo"} (${movement.type === "entry" ? "entrada" : "saída manual"})`,
      amount: -(movement.amount || 0),
    })),
    ...state.sales.map((sale) => ({
      date: sale.date,
      type: "Receita",
      description: state.recipes.find((item) => item.id === sale.recipeId)?.name || "Venda",
      amount: sale.amount,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  if (rows.length === 0) {
    els.financeList.innerHTML = emptyState("O fluxo financeiro vai aparecer aqui conforme você registrar compras e vendas.");
    return;
  }

  els.financeList.innerHTML = `
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
        ${rows
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
  `;
}

function renderKpis() {
  const income = state.sales.reduce((sum, sale) => sum + sale.amount, 0);
  const expense = state.movements.reduce((sum, movement) => sum + (movement.amount || 0), 0);
  document.getElementById("kpi-ingredients").textContent = String(state.ingredients.length);
  document.getElementById("kpi-recipes").textContent = String(state.recipes.length);
  document.getElementById("kpi-sales").textContent = String(state.sales.length);
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

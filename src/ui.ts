/* UI
  - renders the pantry table and recipe table
  - handles all button clicks and input events
  - coordinates with Pantry and StorageService
*/

import { Pantry } from "./models/pantry";
import type { IngrCategory } from "./models/pantry";
import { createRecipe, HighProteinRecipe } from "./models/recipe";
import type { Recipe, RecipeCategory } from "./models/recipe";
import { StorageService } from "./services/storageService";
declare const bootstrap: any;

// All recipe type options shown in the <select>
const RECIPE_TYPES: RecipeCategory[] = [
  "Regular",
  "Vegetarian (blocks meat)",
  "High Protein (15g+ total protein)",
  "Low Carb (<50g total carbs)",
];

export class UI {
  // DOM references
  private pantryBody = document.getElementById(
    "pantryTableBody",
  ) as HTMLElement;
  private recipeBody = document.getElementById(
    "recipeTableBody",
  ) as HTMLElement;
  private nameInput = document.getElementById("recipeName") as HTMLInputElement;
  private typeSelect = document.getElementById(
    "recipeType",
  ) as HTMLSelectElement;
  private totalsMeta = document.getElementById("totalsMeta") as HTMLElement;
  private totalCalEl = document.getElementById("totalCalories") as HTMLElement;
  private totalProtEl = document.getElementById("totalProtein") as HTMLElement;
  private totalCarbEl = document.getElementById("totalCarbs") as HTMLElement;
  private totalFatEl = document.getElementById("totalFat") as HTMLElement;

  // The recipe currently being built (null until the first ingredient is added)
  private currentRecipe: Recipe | null = null;
  // Use Date.now() so IDs don't clash with IDs loaded from storage
  private nextRecipeId = Date.now();

  constructor(
    private pantry: Pantry,
    private storageService: StorageService,
  ) {}

  // entry point to initialize webapp
  init(): void {
    this.populateTypeSelect();
    this.renderPantry();
    this.renderRecipe();
    this.bindEvents();
  }

  // populate recipe-type <select>
  private populateTypeSelect(): void {
    for (const type of RECIPE_TYPES) {
      const opt = document.createElement("option");
      opt.value = opt.textContent = type;
      this.typeSelect.appendChild(opt);
    }
  }

  // pantry table rendering
  private renderPantry(): void {
    this.pantryBody.innerHTML = "";
    for (const item of this.pantry.ingredients) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-2 py-1 small align-middle">${item.ingrName}</td>
        <td class="px-2 py-1 align-middle">
          <span class="badge text-bg-secondary fw-normal" style="font-size:0.72rem">${item.ingrCat}</span>
        </td>
        <td class="px-2 py-1 small text-end align-middle">${item.ingrNut.calories}</td>
        <td class="px-2 py-1 small text-end align-middle">${item.ingrNut.protein}</td>
        <td class="px-2 py-1 small text-end align-middle">${item.ingrNut.carbs}</td>
        <td class="px-2 py-1 small text-end align-middle">${item.ingrNut.fat}</td>
        <td class="px-2 py-1 align-middle">
          <button class="btn btn-outline-primary btn-sm" style="font-size:0.75rem;padding:2px 10px">Add</button>
        </td>
        <td class="px-2 py-1 align-middle">
          <button class="btn btn-outline-danger btn-sm" style="font-size:0.75rem;padding:2px 8px">Remove</button>
        </td>
      `;

      // Add to recipe
      row
        .querySelector<HTMLButtonElement>(".btn-outline-primary")!
        .addEventListener("click", () => this.handleAddToRecipe(item.ingrId));

      // Remove from pantry (and from current recipe if present)
      row
        .querySelector<HTMLButtonElement>(".btn-outline-danger")!
        .addEventListener("click", () => {
          this.pantry.pan_removeIngr(item.ingrId);
          this.currentRecipe?.recipe_removeIngr(item.ingrId);
          this.renderPantry();
          this.renderRecipe();
        });

      this.pantryBody.appendChild(row);
    }
  }

  // recipe table + totals
  private renderRecipe(): void {
    this.recipeBody.innerHTML = "";

    if (!this.currentRecipe || this.currentRecipe.items.length === 0) {
      this.recipeBody.innerHTML = `
        <tr><td colspan="3" class="empty-recipe">No ingredients yet. Add items from the pantry.</td></tr>`;
      this.updateTotals();
      return;
    }

    for (const item of this.currentRecipe.items) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-2 py-1 small align-middle">${item.recipeIngr.ingrName}</td>
        <td class="px-2 py-1 align-middle ">
          <input type="number" class="grams-input" value="${item.ingrGrams}" min="1"/>
        </td>
        <td class="px-2 py-1 align-middle text-center">
          <button class="btn btn-outline-danger btn-sm" style="font-size:0.75rem;padding:2px 8px">✕</button>
        </td>
      `;

      // Live grams update — only totals need re-rendering
      row
        .querySelector<HTMLInputElement>(".grams-input")!
        .addEventListener("input", (e) => {
          const val = parseFloat((e.target as HTMLInputElement).value);
          if (val > 0) {
            item.ingrGrams = val;
            this.updateTotals();

            const t = this.currentRecipe!.nutritionTotals();
            const type = this.currentRecipe!.recipeType;
            if (type.includes("Low Carb") && t.carbs > 50)
              showToast(
                `Warning: total carbs are now ${t.carbs.toFixed(1)}g — exceeds 50g limit.`,
              );
            if (type.includes("High Protein") && t.protein < 15)
              showToast(
                `Warning: total protein is ${t.protein.toFixed(1)}g — below 15g goal.`,
              );
          }
        });

      // Remove from recipe
      row
        .querySelector<HTMLButtonElement>(".btn-outline-danger")!
        .addEventListener("click", () => {
          this.currentRecipe!.recipe_removeIngr(item.recipeIngr.ingrId);
          this.renderRecipe();
        });

      this.recipeBody.appendChild(row);
    }

    this.updateTotals();
  }

  // totals panel
  private updateTotals(): void {
    const t = this.currentRecipe?.nutritionTotals() ?? {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
    const fmt = (n: number) => String(Math.round(n * 10) / 10);
    this.totalCalEl.textContent = fmt(t.calories);
    this.totalProtEl.textContent = fmt(t.protein);
    this.totalCarbEl.textContent = fmt(t.carbs);
    this.totalFatEl.textContent = fmt(t.fat);

    const count = this.currentRecipe?.items.length ?? 0;
    const type =
      this.currentRecipe?.recipeType ??
      (this.typeSelect.value as RecipeCategory);
    this.totalsMeta.textContent = `${shortType(type)} • ${count} item(s)`;
  }

  // add ingredient from pantry to recipe
  private handleAddToRecipe(ingrId: number): void {
    const ingredient = this.pantry.ingredients.find((i) => i.ingrId === ingrId);
    if (!ingredient) return;

    // Create recipe on first add if one doesn't exist yet
    if (!this.currentRecipe) {
      const name = this.nameInput.value.trim() || "Untitled";
      const type = this.typeSelect.value as RecipeCategory;
      this.currentRecipe = createRecipe(this.nextRecipeId++, name, type);
    }

    try {
      this.currentRecipe.recipe_addIngr(ingredient, 100);
    } catch (err) {
      // Vegetarian: throws BEFORE adding (hard block — ingredient not added)
      // HighProtein / LowCarb: throw AFTER adding (advisory — ingredient IS added)
      showToast((err as Error).message);
    }

    this.renderRecipe();
  }

  // routing buttons
  private bindEvents(): void {
    // Recipe type change — rebuild with same items under the new type rules
    this.typeSelect.addEventListener("change", () => {
      if (!this.currentRecipe || this.currentRecipe.items.length === 0) {
        this.currentRecipe = null;
        this.updateTotals();
        return;
      }
      const oldItems = [...this.currentRecipe.items];
      const newType = this.typeSelect.value as RecipeCategory;
      const newRecipe = createRecipe(
        this.currentRecipe.recipeId,
        this.currentRecipe.recipeName,
        newType,
      );
      const blocked: string[] = [];
      for (const item of oldItems) {
        try {
          newRecipe.recipe_addIngr(item.recipeIngr, item.ingrGrams);
        } catch {
          blocked.push(item.recipeIngr.ingrName);
        }
      }
      this.currentRecipe = newRecipe;
      // if (blocked.length)
      //   showToast(`Removed incompatible ingredient(s): ${blocked.join(", ")}`);
      // this.renderRecipe();
    });

    // "Add Ingredient" modal — open
    document
      .getElementById("openAddIngredientModal")!
      .addEventListener("click", () => {
        new bootstrap.Modal(
          document.getElementById("addIngredientModal")!,
        ).show();
      });

    // "Add Ingredient" modal — confirm
    document
      .getElementById("confirmAddIngredientBtn")!
      .addEventListener("click", () => {
        const nameEl = document.getElementById(
          "newIngrName",
        ) as HTMLInputElement;
        const name = nameEl.value.trim();
        if (!name) {
          showToast("Ingredient name is required.");
          return;
        }

        this.pantry.pan_addIngr(
          name,
          (document.getElementById("newIngrCat") as HTMLSelectElement)
            .value as IngrCategory,
          {
            calories:
              parseFloat(
                (document.getElementById("newIngrCalories") as HTMLInputElement)
                  .value,
              ) || 0,
            protein:
              parseFloat(
                (document.getElementById("newIngrProtein") as HTMLInputElement)
                  .value,
              ) || 0,
            carbs:
              parseFloat(
                (document.getElementById("newIngrCarbs") as HTMLInputElement)
                  .value,
              ) || 0,
            fat:
              parseFloat(
                (document.getElementById("newIngrFat") as HTMLInputElement)
                  .value,
              ) || 0,
          },
        );

        nameEl.value = "";
        bootstrap.Modal.getInstance(
          document.getElementById("addIngredientModal")!,
        )?.hide();
        this.renderPantry();
        showToast(`"${name}" added to pantry.`, "success");
      });

    // Save button
    document.getElementById("saveBtn")!.addEventListener("click", async () => {
      const name = this.nameInput.value.trim();
      if (!name) {
        showToast("Enter a recipe name before saving.");
        return;
      }
      if (!this.currentRecipe || this.currentRecipe.items.length === 0) {
        showToast("Add at least one ingredient before saving.");
        return;
      }
      // Gate: High Protein recipe must meet its protein threshold to be saved
      if (
        this.currentRecipe instanceof HighProteinRecipe &&
        !this.currentRecipe.meetsProteinGoal()
      ) {
        showToast(
          `High Protein recipes need ≥${this.currentRecipe.proteinThreshold}g protein to save.`,
        );
        return;
      }
      this.currentRecipe.recipeName = name;
      try {
        await this.storageService.saveRecipe(this.currentRecipe);
        showToast(`"${name}" saved!`, "success");
      } catch (err) {
        showToast((err as Error).message);
      }
    });

    // Clear Form button
    document.getElementById("clearFormBtn")!.addEventListener("click", () => {
      this.nameInput.value = "";
      this.typeSelect.value = "Regular";
      this.currentRecipe = null;
      this.renderRecipe();
      showToast("Form cleared.", "success");
    });

    // Load button — populate and open the modal
    document.getElementById("loadBtn")!.addEventListener("click", async () => {
      await this.populateLoadModal();
      new bootstrap.Modal(document.getElementById("loadModal")!).show();
    });
  }

  // load modal
  private async populateLoadModal(): Promise<void> {
    const listView = document.getElementById("recipeListView")!;
    const detailView = document.getElementById("recipeDetailView")!;
    const listEl = document.getElementById("savedRecipesList")!;

    listView.style.display = "block";
    detailView.style.display = "none";

    document.getElementById("backToListBtn")!.onclick = () => {
      detailView.style.display = "none";
      listView.style.display = "block";
    };

    let saved;
    try {
      saved = await this.storageService.loadAll();
    } catch {
      listEl.innerHTML = `<p class="text-muted text-center py-3">Could not load recipes.</p>`;
      return;
    }

    const renderList = (recipes: typeof saved) => {
      listEl.innerHTML = "";
      if (recipes.length === 0) {
        listEl.innerHTML = `<p class="text-muted text-center py-3">No saved recipes yet.</p>`;
        return;
      }

      for (const data of recipes) {
        const row = document.createElement("div");
        row.className = "modal-recipe-row";
        row.innerHTML = `
          <div class="d-flex align-items-center gap-2">
            <span class="fw-bold">${data.recipeName}</span>
            <span class="badge ${badgeClass(data.recipeType)}">${shortType(data.recipeType)}</span>
          </div>
          <div class="d-flex gap-1">
            <button class="btn btn-outline-secondary btn-sm">View</button>
            <button class="btn btn-outline-primary   btn-sm">Load</button>
            <button class="btn btn-outline-danger    btn-sm">Delete</button>
          </div>
        `;
        const [viewBtn, loadBtn, deleteBtn] =
          row.querySelectorAll<HTMLButtonElement>("button");

        // View detail
        viewBtn.addEventListener("click", () => {
          document.getElementById("detailRecipeName")!.textContent =
            data.recipeName;
          const badge = document.getElementById("detailRecipeBadge")!;
          badge.textContent = shortType(data.recipeType);
          badge.className = `badge ${badgeClass(data.recipeType)}`;

          const tbody = document.getElementById("detailIngredientList")!;
          tbody.innerHTML = "";
          let totalCal = 0,
            totalP = 0,
            totalC = 0,
            totalF = 0;

          for (const item of data.items) {
            const s = item.ingrGrams / 100;
            const cal = item.recipeIngr.ingrNut.calories * s;
            totalCal += cal;
            totalP += item.recipeIngr.ingrNut.protein * s;
            totalC += item.recipeIngr.ingrNut.carbs * s;
            totalF += item.recipeIngr.ingrNut.fat * s;
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td >${item.recipeIngr.ingrName}</td>
              <td class="text-end">${item.ingrGrams}g</td>
              <td class="text-end">${Math.round(cal)} kcal</td>`;
            tbody.appendChild(tr);
          }

          document.getElementById("detailTotalCalories")!.textContent =
            `${Math.round(totalCal)} kcal`;
          document.getElementById("detailMacros")!.textContent =
            `${f(totalP)}g / ${f(totalC)}g / ${f(totalF)}g`;

          listView.style.display = "none";
          detailView.style.display = "block";
        });

        // Load into form
        loadBtn.addEventListener("click", () => {
          const recipe = createRecipe(
            data.recipeId,
            data.recipeName,
            data.recipeType,
          );
          recipe.items = [...data.items];
          this.currentRecipe = recipe;
          this.nameInput.value = data.recipeName;
          this.typeSelect.value = data.recipeType;
          this.renderRecipe();
          bootstrap.Modal.getInstance(
            document.getElementById("loadModal")!,
          )?.hide();
          showToast(`"${data.recipeName}" loaded.`, "success");
        });

        // Delete
        deleteBtn.addEventListener("click", async () => {
          if (!confirm(`Delete "${data.recipeName}"?`)) return;
          await this.storageService.deleteRecipe(data.recipeId);
          recipes.splice(recipes.indexOf(data), 1);
          renderList(recipes);
        });

        listEl.appendChild(row);
      }
    };

    renderList(saved);
  }
}

// helper functions

let _toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(msg: string, type: "error" | "success" = "error"): void {
  const el = document.getElementById("toast")!;
  el.textContent = msg;
  el.style.background = type === "success" ? "#198754" : "#dc3545";
  el.classList.add("show");
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove("show"), 3500);
}

function shortType(type: string): string {
  if (type.includes("Vegetarian")) return "Vegetarian";
  if (type.includes("High Protein")) return "High Protein";
  if (type.includes("Low Carb")) return "Low Carb";
  return "Regular";
}

function badgeClass(type: string): string {
  if (type.includes("Vegetarian")) return "text-bg-success";
  if (type.includes("High Protein")) return "text-bg-primary";
  if (type.includes("Low Carb")) return "text-bg-warning";
  return "text-bg-secondary";
}

function f(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1);
}

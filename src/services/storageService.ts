// /*  Asynchronous Save/Load (Promise Requirement)
// You must support saving and loading recipes through an asynchronous API.
// You may implement this using local storage. The minimum required functions:

// saveRecipe(recipe): Promise<void>
// loadRecipe(recipeId): Promise<Recipe>
// The functions must return Promises and be used with async/await.*/
import { createRecipe } from "../models/recipe";
import type { Recipe, RecipeCategory } from "../models/recipe";
import type { RecipeItem } from "../interfaces/recipeItem";

const STORAGE_KEY = "recipe_builder";

interface SavedRecipe {
  recipeId: number;
  recipeName: string;
  recipeType: RecipeCategory;
  items: RecipeItem[];
}

export class StorageService {
  // Save (or overwrite) one recipe
  saveRecipe(recipe: Recipe): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const all = this._readAll();
        all[recipe.recipeId] = {
          recipeId: recipe.recipeId,
          recipeName: recipe.recipeName,
          recipeType: recipe.recipeType,
          items: recipe.items,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        resolve();
      } catch (err) {
        reject(new Error(`Save failed: ${err}`));
      }
    });
  }

  // Load one recipe by id and reconstruct the correct subclass
  loadRecipe(recipeId: number): Promise<Recipe> {
    return new Promise((resolve, reject) => {
      try {
        const data = this._readAll()[recipeId];
        if (!data) {
          reject(new Error(`Recipe ${recipeId} not found.`));
          return;
        }
        const recipe = createRecipe(
          data.recipeId,
          data.recipeName,
          data.recipeType,
        );
        recipe.items = data.items; // restore items directly (already validated on save)
        resolve(recipe);
      } catch (err) {
        reject(new Error(`Load failed: ${err}`));
      }
    });
  }

  // Load all saved recipes — used to populate the Load modal list
  loadAll(): Promise<SavedRecipe[]> {
    return new Promise((resolve, reject) => {
      try {
        resolve(Object.values(this._readAll()));
      } catch (err) {
        reject(new Error(`Load all failed: ${err}`));
      }
    });
  }

  // Delete one recipe by id
  deleteRecipe(recipeId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const all = this._readAll();
        delete all[recipeId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        resolve();
      } catch (err) {
        reject(new Error(`Delete failed: ${err}`));
      }
    });
  }

  // Read and parse the full storage map. Returns {} on any error.
  private _readAll(): Record<number, SavedRecipe> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<number, SavedRecipe>) : {};
    } catch {
      return {}; // corrupted data — start fresh
    }
  }
}

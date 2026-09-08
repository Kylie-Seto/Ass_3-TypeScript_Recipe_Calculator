/*
create recipe
get all recipes
get by recipe id
remove recipe
set (load) recipe

*/

import { createRecipe } from "../models/recipe";
import type { Recipe, RecipeCategory } from "../models/recipe";

export class RecipeService {
  private recipes: Recipe[] = [];
  private nextId = 1;

  // recipe is assigned an id & is pushed to recipes array
  createRecipe(recipeName: string, recipeType: RecipeCategory): Recipe {
    const recipe = createRecipe(this.nextId++, recipeName, recipeType);
    this.recipes.push(recipe);
    return recipe;
  }

  // returns a copy to prevent external mutation - should be called upon load button
  getAll(): Recipe[] {
    return [...this.recipes];
  }

  // find one recipe by ID
  getById(recipeId: number): Recipe {
    try {
      const recipe = this.recipes.find(
        (recipe) => recipe.recipeId === recipeId,
      );
      if (!recipe) {
        throw new Error(`Recipe with ID ${recipeId} not found.`);
      }
      return recipe;
    } catch (error) {
      throw new Error(
        `Error occurred while fetching recipe with ID ${recipeId}`,
      );
    }
  }

  // remove an entire recipe
  removeRecipe(recipeId: number): void {
    this.recipes = this.recipes.filter(
      (recipe) => recipe.recipeId !== recipeId,
    );
  }

  // replace recipes list — used when loading from storage
  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;

    // to determine the next ID, find the maxID listed in recipes array & +1
    const maxId = recipes.reduce(
      (max, recipe) => Math.max(max, recipe.recipeId),
      0,
    );
    this.nextId = maxId + 1;
  }
}

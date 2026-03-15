/*
remove recipe
load recipe

*/

import { Recipe, VegetarianRecipe, HighProteinRecipe, LowCarbRecipe } from "../models/recipe";
import type { RecipeCategory } from "../models/recipe";

export class RecipeService {
  private recipes: Recipe[] = [];
  private nextId = 1;

  createRecipe(recipeName: string, recipeType: RecipeCategory): Recipe {
    let recipe: Recipe;

    // create the right subclass based on type
    switch (recipeType) {
      case "Vegetarian (blocks meat)":
        recipe = new VegetarianRecipe(recipeName);
        break;
      case "High Protein (15g+ total protein)":
        recipe = new HighProteinRecipe(recipeName);
        break;
      case "Low Carb (<50g total carbs)":
        recipe = new LowCarbRecipe(recipeName);
        break;
      default:
        recipe = new Recipe(recipeName, recipeType);
    }

    recipe.recipeId = this.nextId++;  // assign ID after creation
    this.recipes.push(recipe);
    return recipe;
  }

  // returns a copy to prevent external mutation - should be called upon load button
  getAll(): Recipe[] {
    return [...this.recipes];
  }

  // find one recipe by ID
  getById(recipeId: number): Recipe {
    try{
        const recipe = this.recipes.find(recipe => recipe.recipeId === recipeId);
        if (!recipe) {
            throw new Error(`Recipe with ID ${recipeId} not found.`);
        }
        return recipe;
    }
    catch (error) {
        throw new Error(`Error occurred while fetching recipe with ID ${recipeId}`);
    }
  }

  // remove an entire recipe
  removeRecipe(recipeId: number): void {
    this.recipes = this.recipes.filter(recipe => recipe.recipeId !== recipeId);
  }

  // replace recipes list — used when loading from storage
  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
  }
}
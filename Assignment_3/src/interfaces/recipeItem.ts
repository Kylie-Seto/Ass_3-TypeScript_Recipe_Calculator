// RecipeItem data structure = (ingredient + grams)

import type { Ingredient } from "./ingredient";

export interface RecipeItem {
  recipeIngr: Ingredient;
  ingrGrams: number;
}

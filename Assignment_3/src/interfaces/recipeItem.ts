/*Use interfaces to define the shape of data objects, such as:
Ingredient
Nutrition
RecipeItem (ingredient + grams)*/


import type { Ingredient } from "./ingredient";

export interface RecipeItem{
    recipeIngr: Ingredient;
    ingrGrams: number;
}

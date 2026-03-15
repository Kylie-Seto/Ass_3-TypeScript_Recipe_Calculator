/*Use interfaces to define the shape of data objects, such as:
Ingredient
Nutrition
RecipeItem (ingredient + grams)*/

import type { IngrCategory } from "../models/pantry";
import type { Nutrition } from "./nutrition";

export interface Ingredient {
  ingrId: number;
  ingrName: string;
  ingrNut: Nutrition;
  ingrCat: IngrCategory;
}

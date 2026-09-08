// ingredient data structure, which inherits from nutrition interface + ingrCategory

import type { IngrCategory } from "../models/pantry";
import type { Nutrition } from "./nutrition";

export interface Ingredient {
  ingrId: number;
  ingrName: string;
  ingrNut: Nutrition;
  ingrCat: IngrCategory;
}

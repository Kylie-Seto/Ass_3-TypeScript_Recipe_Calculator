/* pantry class:
- initializes default pantry
method: add ingredient to pantry
method: remove item from pantry */

import type { Ingredient } from "../interfaces/ingredient";
import type { Nutrition } from "../interfaces/nutrition";   
import { DEFAULT_PANTRY } from "../data/defaultPantry";

export type IngrCategory =
  | "Meat"
  | "Vegetable"
  | "Grain"
  | "Protein"
  | "Dairy"
  | "Fruit"
  | "Fat"
  | "Other";

export class Pantry {
    public ingredients: Ingredient[] = [];
    private nextId : number = 11; // 1-10 are default values

    constructor(){
        this.ingredients = [...DEFAULT_PANTRY]; // a copy to prevent external mutation
    }

    pan_addIngr(ingrName: string, ingrCat: IngrCategory, ingrNut: Nutrition): void {
        const newPanIngr: Ingredient = {
            ingrId: this.nextId++, // generates new ID based on length of ingredients array
            ingrName,
            ingrCat, ingrNut
            
        };
        this.ingredients.push(newPanIngr);
    }

    // pantry - remove item from pantry. triggered when user clicks button associated with ingredient in pantry
    pan_removeIngr(ingrId: number): void {
        this.ingredients = this.ingredients.filter(item => item.ingrId !== ingrId);
    };
}
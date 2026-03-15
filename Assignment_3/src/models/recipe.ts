/* Your design must include inheritance. As an example (and only as an example), you may create a base class Recipe. 
Then, create subclasses that extend Recipe for specific categories of recipes */

import type { Ingredient } from "../interfaces/ingredient";
import type { Nutrition } from "../interfaces/nutrition";
import type { RecipeItem } from "../interfaces/recipeItem";

export class Recipe {
  public recipeId:number = 0;
  public recipeName: string;
  public recipeType: RecipeCategory;
  public items: RecipeItem[] = []; // holds both ingredient name & grams

  constructor(recipeName: string, recipeType: RecipeCategory) {
    this.recipeName = recipeName;
    this.recipeType = recipeType;
  }

  // add ingredients to recipe. saved to items array. ingrGrams is default set to 100
  recipe_addIngr(recipeIngr: Ingredient, ingrGrams: number): void {
    // returns true if an ingredient with the same id is found in the recipe list
    const alreadyAdded = this.items.some(
      (item) => item.recipeIngr.ingrId === recipeIngr.ingrId,
    );
    if (alreadyAdded) {
      // only allows one entry of an ingredient per recipe to ensure the ids for ingredients in the recipe are unique
      throw new Error(`${recipeIngr.ingrName} is already in the recipe.`);
    }
    this.items.push({ recipeIngr, ingrGrams });
  }

  // recipe - triggered when user clicks button associated with ingredient to remove ingredient from recipe
  recipe_removeIngr(ingrId: number): void {
    this.items = this.items.filter((item) => item.recipeIngr.ingrId !== ingrId);
  }

  // NOTE: nutrition values are per 100 grams so we need to edit the calculations based on the grams inputted by the user
  nutritionTotals(): Nutrition {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    for (const item of this.items) {
      // calculate the scale factor based on the grams of the ingredient/100 (bc nutrition values are/100g)
      const scale = item.ingrGrams / 100;

      // scale nutrition based on grams of ingredients in recipe
      calories += item.recipeIngr.ingrNut.calories * scale;
      protein += item.recipeIngr.ingrNut.protein * scale;
      carbs += item.recipeIngr.ingrNut.carbs * scale;
      fat += item.recipeIngr.ingrNut.fat * scale;
    }
    return { calories, protein, carbs, fat };
  }
}

// cannot add ingredients from category "meat" if vegetarian
export class VegetarianRecipe extends Recipe {
  // check to see if recipeType is vegetarian
  constructor(recipeName: string) {
    super(recipeName, "Vegetarian (blocks meat)");
  }

  // if vegetarian + meat, block add + throw error
  override recipe_addIngr(recipeIngr: Ingredient, ingrGrams: number): void {
    if (recipeIngr.ingrCat === "Meat") {
      this.recipe_removeIngr(recipeIngr.ingrId); // blocks adding
      throw new Error(
        `Vegetarian recipes cannot include: ${recipeIngr.ingrName}`
      );
    }
    super.recipe_addIngr(recipeIngr, ingrGrams);
  }
}

export class HighProteinRecipe extends Recipe {
  // check to see if recipeType is high protein
  constructor(recipeName: string) {
    super(recipeName, "High Protein (15g+ total protein)");
  }

  override recipe_addIngr(recipeIngr: Ingredient, ingrGrams: number): void {
    super.recipe_addIngr(recipeIngr, ingrGrams);
    // if total protein <15g, throw error. no removal of ingredient, just toast + blocked save until threshold met
    if (this.nutritionTotals().protein < 15) {
      throw new Error(
        `${this.recipeName} is not a High Protein Recipe. Switch the recipe type or add more protein`
      );
      // BLOCK saveRecipe
    }
  }
}

//raises a warning when above threshold (<15g of carbs/serving is a low carb meal)
export class LowCarbRecipe extends Recipe {
    // check to see if recipeType is low carb
  constructor(recipeName: string) {
    super(recipeName, "Low Carb (<50g total carbs)");
  }

  override recipe_addIngr(recipeIngr: Ingredient, ingrGrams: number): void {
    super.recipe_addIngr(recipeIngr, ingrGrams);
    // if total carbs >50g, throw warning. no removal of ingredient, or blocking, just toast 
    if (this.nutritionTotals().carbs > 50) {
      throw new Error(
        `WARNING: ${this.recipeName} is not a Low Carb Recipe. You are ${this.nutritionTotals().carbs - 100} over the suggested limit`
      );

    }
  }

}

export type RecipeCategory =
  | "Regular"
  | "Vegetarian (blocks meat)"
  | "High Protein (15g+ total protein)"
  | "Low Carb (<50g total carbs)";

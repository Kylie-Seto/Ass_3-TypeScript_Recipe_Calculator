// /*  Asynchronous Save/Load (Promise Requirement)
// You must support saving and loading recipes through an asynchronous API. 
// You may implement this using local storage. The minimum required functions:

// saveRecipe(recipe): Promise<void>
// loadRecipe(recipeId): Promise<Recipe>
// The functions must return Promises and be used with async/await.*/

import type { Recipe } from "../models/recipe";

// Note: I referenced Bobby's 5a_TSWebProject storageService.ts to create this
const STORAGE_KEY = "recipe";

// ADD ASYNC/AWAIT
export class StorageService {
  async saveRecipe(recipe: Recipe): Promise<void> {
    try{
      return new Promise((resolve) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipe));
        resolve();
      });

    }
    catch(error){
      throw new Error(
        `${recipe} cannot be saved. Please try again.`
      );
    }
  }

  loadRecipe(recipeId): Promise<Recipe>;


}

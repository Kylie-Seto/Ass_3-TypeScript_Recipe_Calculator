import type { Ingredient } from "../interfaces/ingredient";

export const DEFAULT_PANTRY: Ingredient[] = [
  {
    ingrId: 1,
    ingrName: "Chicken Breast",
    ingrCat: "Meat",
    ingrNut: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
    },
  },
  {
    ingrId: 2,
    ingrName: "Tofu",
    ingrCat: "Protein",
    ingrNut: {
      calories: 76,
      protein: 8,
      carbs: 1.9,
      fat: 4.8,
    },
  },
  {
    ingrId: 3,
    ingrName: "Cooked Rice",
    ingrCat: "Grain",
    ingrNut: {
      calories: 130,
      protein: 2.4,
      carbs: 28.2,
      fat: 0.3,
    },
  },
  {
    ingrId: 4,
    ingrName: "Milk (2%)",
    ingrCat: "Dairy",
    ingrNut: {
      calories: 50,
      protein: 3.4,
      carbs: 5,
      fat: 2,
    },
  },
  {
    ingrId: 5,
    ingrName: "Olive Oil",
    ingrCat: "Fat",
    ingrNut: {
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100,
    },
  },
  {
    ingrId: 6,
    ingrName: "Broccoli",
    ingrCat: "Vegetable",
    ingrNut: {
      calories: 34,
      protein: 2.8,
      carbs: 6.6,
      fat: 0.4,
    },
  },
  {
    ingrId: 7,
    ingrName: "Banana",
    ingrCat: "Fruit",
    ingrNut: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
    },
  },
  {
    ingrId: 8,
    ingrName: "Almonds",
    ingrCat: "Fat",
    ingrNut: {
      calories: 579,
      protein: 21.2,
      carbs: 21.6,
      fat: 49.9,
    },
  },
  {
    ingrId: 9,
    ingrName: "Eggs",
    ingrCat: "Protein",
    ingrNut: {
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
    },
  },
  {
    ingrId: 10,
    ingrName: "Sugar",
    ingrCat: "Other",
    ingrNut: {
      calories: 387,
      protein: 0,
      carbs: 100,
      fat: 0,
    },
  },
];

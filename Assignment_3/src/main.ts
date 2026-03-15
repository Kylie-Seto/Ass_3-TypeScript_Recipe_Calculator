import './style.css'
import { defaultPantry } from "../src/UI/UIpantry"; // or wherever you put the function
import { DEFAULT_PANTRY } from "../src/data/defaultPantry";

document.addEventListener("DOMContentLoaded", () => {
    defaultPantry(DEFAULT_PANTRY);
});

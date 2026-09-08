/* main.ts
  - initializes the application
  - creates instances of Pantry, StorageService, and UI
  - starts the UI
*/

import "./style.css";
import { Pantry } from "./models/pantry";
import { StorageService } from "./services/storageService";
import { UI } from "./ui";

const pantry = new Pantry(); // initializes default pantry
const storageService = new StorageService();

const app = new UI(pantry, storageService);
app.init();

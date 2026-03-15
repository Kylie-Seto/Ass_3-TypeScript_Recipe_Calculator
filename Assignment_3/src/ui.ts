import { Recipe } from "./models/recipe";

for (const item of Recipe.items) {
  const row = document.createElement("tr");

  // the ID is captured here when the button is built
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => {
    Recipe.r_removeIngr(item.recipeIngr.recipeId); // ID comes from the row, not the user
    this.render(); // re-render the table after removal
  });

  row.appendChild(removeBtn);
}


const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
    toastBootstrap.show()
  })
}
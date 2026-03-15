import { DEFAULT_PANTRY } from "../data/defaultPantry";

export function defaultPantry(defaultData: typeof DEFAULT_PANTRY) {
    const defaultPantryBody = document.getElementById("pantryTableBody");
    if (!defaultPantryBody) return;

    for (let i = 0; i < defaultData.length; i++) {
        const item = defaultData[i];
        const row = `<tr>
            <td class="px-2 py-1 small align-middle">${item.ingrName}</td>
            <td class="px-2 py-1 align-middle">
                <span class="badge text-bg-secondary fw-normal" style="font-size:0.72rem">
                    ${item.ingrCat}
                </span>
            </td>
            <td class="px-2 py-1 small text-end align-middle">${item.ingrNut.calories}</td>
            <td class="px-2 py-1 small text-end align-middle">${item.ingrNut.protein}</td>
            <td class="px-2 py-1 small text-end align-middle">${item.ingrNut.carbs}</td>
            <td class="px-2 py-1 small text-end align-middle">${item.ingrNut.fat}</td>
            <td class="px-2 py-1 align-middle">
                <button class="btn btn-outline-primary btn-sm" style="font-size:0.75rem;padding:2px 10px" data-id="${item.ingrId}">Add</button>
            </td>
            <td class="px-2 py-1 align-middle">
                <button class="btn btn-outline-danger btn-sm" style="font-size:0.75rem;padding:2px 8px" data-id="${item.ingrId}">Remove</button>
            </td>
        </tr>`;
        defaultPantryBody.innerHTML += row;
    }
}

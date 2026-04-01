import MyList from "../../data_structures/list.js";
import { buildPointerRows } from "../../cli.js";

const swap = (list: MyList<number>, i: number, j: number): void => {
    const temp = list.get(i);
    list.set(i, list.get(j));
    list.set(j, temp);
};

/**
 * Sorts a list in place using the Insertion Sort algorithm.
 *
 * @param list - The list to sort.
 * @param order - Sort direction: "asc" (default) or "desc".
 *
 * Time complexity:
 *   - Best case:    O(n)   — already sorted; inner loop never executes
 *   - Worst case:   O(n²)  — reverse sorted; each element shifts all the way left
 * Space complexity: O(1)   — sorts in place, no auxiliary data structures
 */
export const insertionSort = (list: MyList<number>, order: "asc" | "desc" = "asc") => {
    console.log("--------------------------------");
    console.log("INSERTION SORT:");
    console.log("");
    console.log("✅ Means the item is already sorted");

    for (let k = 0; k < list.getSize(); k++)
        if (list.get(k) === undefined) throw new Error("Cannot sort a list with undefined items");

    for (let i = 1; i < list.getSize(); i++) {
        for (let j = i; j > 0; j--) {
            printVisualRepresentation(list, i, j);
            const shouldSwap = order === "asc"
                ? list.get(j)! < list.get(j - 1)!
                : list.get(j)! > list.get(j - 1)!;
            if (shouldSwap) {
                console.log();
                console.log(`Swapping ${list.get(j)} and ${list.get(j - 1)}:`);
                swap(list, j, j - 1);
                list.printVisualRepresentation();
            } else {
                break;
            }
        }
    }
    printVisualRepresentation(list, list.getSize(), 0);
};

const printVisualRepresentation = (list: MyList<number>, i: number, j: number) => {
    const n = list.getSize();
    const elements = Array.from({ length: n }, (_, k) => {
        const val = list.get(k);
        return val === undefined ? "_" : String(val);
    });

    // In insertion sort the sorted region grows from the LEFT (0..i-1)
    const pointers: Record<number, string> = {};
    if (i < n) {
        pointers[i] = i === j ? "i=j" : "i";
        pointers[j] = i === j ? "i=j" : "j";
    }

    let sortedRow = "  ";
    for (let k = 0; k < n; k++) {
        const isSorted = k < i;
        const w = elements[k].length;
        const col = Math.max(w, (pointers[k] ?? " ").length);
        const sep = k < n - 1 ? "  " : "";
        if (isSorted) {
            // ✅ is 2 terminal cols wide; absorb the separator into trailing spaces
            // so the next element starts at the right terminal column
            sortedRow += "✅" + " ".repeat(k < n - 1 ? w : Math.max(0, w - 2));
        } else {
            sortedRow += " ".repeat(col) + sep;
        }
    }

    console.log("--------------------------------");
    if (i > 0) console.log(sortedRow);
    list.printVisualRepresentation();
    console.log(buildPointerRows(elements, pointers));
};

function main() {
    const list = new MyList<number>(5, true);
    list.set(0, Math.floor(Math.random() * 100));
    list.set(1, Math.floor(Math.random() * 100));
    list.set(2, Math.floor(Math.random() * 100));
    list.set(3, Math.floor(Math.random() * 100));
    list.set(4, Math.floor(Math.random() * 100));
    console.log("--------------------------------");
    console.log("List to be sorted:");
    list.printVisualRepresentation();
    insertionSort(list);
}
main();

import MyList from "../../data_structures/list.js";
import { buildPointerRows, executeMain } from "../../cli.js";

const swap = (list: MyList<number>, i: number, j: number): void => {
    const temp = list.get(i);
    list.set(i, list.get(j));
    list.set(j, temp);
};

/**
 * Sorts a list in place using the Bubble Sort algorithm.
 *
 * @param list - The list to sort.
 * @param order - Sort direction: "asc" (default) or "desc".
 *
 * Time complexity:
 *   - Best case:    O(n)   — already sorted; early termination fires after one pass
 *   - Worst case:   O(n²)  — reverse sorted; every element must be swapped each pass
 * Space complexity: O(1)   — sorts in place, no auxiliary data structures
 */
export const bubbleSort = (list: MyList<number>, order: "asc" | "desc" = "asc") => {

    console.log("----------------------------------------------------------------------------------------");
    console.log("BUBBLE SORT:");
    console.log("");
    console.log("✅ Means the item is already sorted");
    console.log("");
    console.log(`j will be compared with the the next item, if is ${order === 'asc' ? 'bigger' : 'smaller'}, it will be swaped`);

    for (let k = 0; k < list.getLength(); k++)
        if (list.get(k) === undefined) throw new Error("Cannot sort a list with undefined items");

    for (let i = 0; i < list.getLength() - 1; i++) {
        console.log('')
        console.log(`New outer loop i = ${i} ------------------------------------------------`)
        console.log('')
        let swapped = false;
        for (let j = 0; j < list.getLength() - i - 1; j++) {
            printVisualRepresentation(list, i, j);
            const shouldSwap = order === "asc"
                ? list.get(j)! > list.get(j + 1)!
                : list.get(j)! < list.get(j + 1)!;
            if (shouldSwap) {
                console.log('');
                console.log(`Swapping ${list.get(j)} and ${list.get(j + 1)}:`);
                console.log('');
                swap(list, j, j + 1);
                list.printVisualRepresentation();
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    printVisualRepresentation(list, list.getLength(), 0);
    return list;
};

const printVisualRepresentation = (list: MyList<number>, i: number, j: number) => {
    const n = list.getLength();
    const elements = Array.from({ length: n }, (_, k) => {
        const val = list.get(k);
        return val === undefined ? "_" : String(val);
    });

    const sortedStart = n - i;
    const iPointerIndex = n - i - 1;
    const pointers: Record<number, string> = {};
    if (i < n) {
        if (iPointerIndex === j) pointers[iPointerIndex] = "i=j";
        else {
            pointers[iPointerIndex] = "n-i";
            pointers[j] = "j";
        }
    }

    let sortedRow = "  ";
    for (let k = 0; k < n; k++) {
        const isSorted = k >= sortedStart;
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

executeMain("bubble_sort.ts", () => {
    const list = new MyList<number>(5, true);
    list.set(0, Math.floor(Math.random() * 100));
    list.set(1, Math.floor(Math.random() * 100));
    list.set(2, Math.floor(Math.random() * 100));
    list.set(3, Math.floor(Math.random() * 100));
    list.set(4, Math.floor(Math.random() * 100));
    console.log("");
    console.log("List to be sorted:");
    list.printVisualRepresentation();
    bubbleSort(list, "asc");
    return list;
});


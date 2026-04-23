import MyList from "../../data_structures/list.js";
import { buildPointerRows, executeMain } from "../../cli.js";

const swap = (list: MyList<number>, i: number, j: number): void => {
    const temp = list.get(i);
    list.set(i, list.get(j));
    list.set(j, temp);
};

/**
 * Sorts a list in place using the Selection Sort algorithm.
 *
 * @param list - The list to sort.
 * @param order - Sort direction: "asc" (default) or "desc".
 *
 * Time complexity:
 *   - Best case:    O(n²)  — still scans the unsorted tail to select the winner each pass
 *   - Average case: O(n²)  — same nested scan pattern regardless of input distribution
 *   - Worst case:   O(n²)  — same number of comparisons even when reverse sorted
 * Space complexity: O(1)   — sorts in place, no auxiliary data structures
 */
export const bubbleSort = (list: MyList<number>, order: "asc" | "desc" = "asc") => {

    console.log("----------------------------------------------------------------------------------------");
    console.log("SELECTION SORT:");
    console.log("");
    console.log(`j will be compared with all of the items looking for the ${order === 'asc' ? 'smallest' : 'biggest'}, and then swap it with i`);
    console.log("");
    console.log("✅ Means the item is already sorted");

    for (let k = 0; k < list.getSize(); k++)
        if (list.get(k) === undefined) throw new Error("Cannot sort a list with undefined items");

    for (let i = 0; i < list.getSize() - 1; i++) {
        console.log('')
        console.log(`New outer loop i = ${i} ------------------------------------------------`)
        console.log('')
        let winner = -1;
        for (let j = i; j < list.getSize(); j++) {
            console.log("--------------------------------");
            printVisualRepresentation({ list, pointers: { i, j, w: winner}});

            const newWinner = order === "asc"
                ? list.get(j)! < list.get(winner)!
                : list.get(j)! > list.get(winner)!;

            if (winner === -1 || newWinner) {
                winner = j;
            }

        }
        console.log("--------------------------------");
        if (winner !== i) {
            console.log('')
            console.log(`Winner is ${list.get(winner)}, swaping winner with i = ${i} (${list.get(i)})`)
            console.log('')
            // Swap elements
            const temp = list.get(i);
            list.set(i, list.get(winner));
            list.set(winner, temp);
            printVisualRepresentation({ list, pointers: {w: i, i: winner} });
        } else {
            console.log('')
            console.log(`Winner is i = ${i} (${list.get(winner)}), no swaping is needed`)
        }
        console.log("--------------------------------");
        console.log("Ending loop with:");
        console.log('')
        printVisualRepresentation({ list, pointers: {}, sortedUntil: i+1 });
    }
    console.log("--------------------------------");
    console.log("Ending algorithm with:");
    console.log('')
    printVisualRepresentation({ list, pointers: {}, sortedUntil: list.getSize() });
    return list;
};

const printVisualRepresentation = ({
    list,
    pointers,
    sortedUntil = 0,
}: {
    list: MyList<number>;
    pointers: { i?: number; j?: number; w?: number };
    sortedUntil?: number;
}) => {
    const n = list.getSize();
    const elements = Array.from({ length: n }, (_, k) => {
        const val = list.get(k);
        return val === undefined ? "_" : String(val);
    });

    const pointerLabels: Record<number, string> = {};
    if (typeof pointers.i === "number") pointerLabels[pointers.i] = "i";
    if (typeof pointers.j === "number") {
        pointerLabels[pointers.j] = pointerLabels[pointers.j]
            ? `${pointerLabels[pointers.j]}=j`
            : "j";
    }
    if (typeof pointers.w === "number" && pointers.w >= 0) {
        pointerLabels[pointers.w] = pointerLabels[pointers.w]
            ? `${pointerLabels[pointers.w]}=w`
            : "w";
    }

    let sortedRow = "  ";
    for (let k = 0; k < n; k++) {
        const isSorted = k < sortedUntil;
        const w = elements[k].length;
        const col = Math.max(w, (pointerLabels[k] ?? " ").length);
        const sep = k < n - 1 ? "  " : "";
        if (isSorted) {
            // ✅ is 2 terminal cols wide; absorb the separator into trailing spaces
            // so the next element starts at the right terminal column
            sortedRow += "✅" + " ".repeat(k < n - 1 ? w : Math.max(0, w - 2));
        } else {
            sortedRow += " ".repeat(col) + sep;
        }
    }
    if (sortedUntil > 0) console.log(sortedRow);
    list.printVisualRepresentation();
    if (pointerLabels) console.log(buildPointerRows(elements, pointerLabels));
};

executeMain("selection_sort.ts", () => {
    const list = new MyList<number>(5, true);
    list.set(0, Math.floor(Math.random() * 100));
    list.set(1, Math.floor(Math.random() * 100));
    list.set(2, Math.floor(Math.random() * 100));
    list.set(3, Math.floor(Math.random() * 100));
    list.set(4, Math.floor(Math.random() * 100));
    console.log("");
    console.log("List to be sorted:");
    console.log("");
    list.printVisualRepresentation();
    bubbleSort(list, "asc");
    return list;
});


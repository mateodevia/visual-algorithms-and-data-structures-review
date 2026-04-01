import MyList from "../../data_structures/list.js";
import { buildPointerRows } from "../../cli.js";

const swap = (list: MyList<number>, i: number, j: number): void => {
    const temp = list.get(i);
    list.set(i, list.get(j));
    list.set(j, temp);
};

/**
 * Partitions a subarray around a pivot (the element at `low`).
 * Elements smaller than the pivot end up to its left, larger ones to its right.
 * Returns the final index of the pivot after partitioning.
 *
 * @param list  - The list to partition (mutated in place).
 * @param low   - Start index of the subarray (inclusive); also the pivot index.
 * @param high  - End index of the subarray (inclusive).
 * @param order - Sort direction: "asc" (default) or "desc".
 *
 * Time complexity:  O(n) — scans each element in the subarray once
 * Space complexity: O(1) — partitions in place
 */
const partition = (list: MyList<number>, low: number, high:number, order: "asc" | "desc" = "asc"): number => {
    const pivot = list.get(low)!; // choose the first element as pivot
    console.log('---------------------------------------------------')
    console.log(`Partitioning sub array [${list.getSubList(low + 1, high).getVisualElements()}] with pivot: ${pivot}`);
    let i = low + 1; // dont iterate over the pivot
    let j = high;

    printVisualRepresentation(list.getSubList(low, high), low, i, j);

    while (i <= j) {
        // move the i index to the right until it founds a number smaller than the chosen pivot
        while(i <= j && (order === 'asc' && list.get(i)! < pivot || order === 'desc' && list.get(i)! > pivot)) {
            i++; 
            printVisualRepresentation(list.getSubList(low, high), low, i, j);
        }
        // move the j index to the left until it founds a number grater than the chosen pivot
        while(i <= j && (order === 'asc' && list.get(j)! > pivot || order === 'desc' && list.get(j)! < pivot)) {
            j--; 
            printVisualRepresentation(list.getSubList(low, high), low, i, j);
        }
        

        // If indexes did not cross, a swap should be made, and the indexes should continue advancing
        if (i < j) {
            console.log(`Swaping ${list.get(i)} and ${list.get(j)}`)
            swap(list, i, j);
            i++;
            j--;
            printVisualRepresentation(list.getSubList(low, high), low, i, j);
        }
    }

    // put the pivot in the middle of both partitions
    console.log(`Swaping pivot ${list.get(low)} with ${list.get(j)}`)
    swap(list, low, j);
    printVisualRepresentation(list.getSubList(low, high), low, i, low, j);

    return j;
}

/**
 * Sorts a list in place using the Quick Sort algorithm.
 *
 * @param list  - The list to sort.
 * @param low   - Start index of the subarray to sort (default: 0).
 * @param high  - End index of the subarray to sort (default: list.getSize() - 1).
 * @param order - Sort direction: "asc" (default) or "desc".
 *
 * Time complexity:
 *   - Best case:    O(n log n) — pivot consistently splits the array near the middle
 *   - Worst case:   O(n²)     — pivot is always the smallest or largest element (e.g. sorted input)
 * Space complexity: O(log n)  — recursive call stack depth
 */
export const quickSort = (list: MyList<number>, low?: number, high?:number, order: "asc" | "desc" = "asc") => {

    const l = low ?? 0;
    const h = high ?? list.getSize() - 1;

    if (l >= h) return list;

    const pivot = partition(list, l, h, order)
    quickSort(list, l, pivot - 1, order); // Don´t include the pivot
    quickSort(list, pivot + 1, h, order);

}

const printVisualRepresentation = (list: MyList<number>, pivotIndex: number, i: number, j: number, pivotFinalIndex?: number) => {
    const elements: string[] = [];
    for (let k = 0; k < list.getSize(); k++) {
        const val = list.get(k);
        elements.push(val === undefined ? "_" : String(val));
    }

    const pRel = (pivotFinalIndex ?? pivotIndex) - pivotIndex;
    const iRel = i - pivotIndex;
    const jRel = j - pivotIndex;

    // Extend elements with "_" entries for any out-of-bounds pointer
    const minRel = Math.min(pRel, iRel, jRel);
    const maxRel = Math.max(pRel, iRel, jRel);

    let offset = 0;
    if (minRel < 0) {
        for (let x = 0; x < -minRel; x++) elements.unshift("_");
        offset = -minRel;
    }
    while (maxRel + offset >= elements.length) elements.push("_");

    const pointers: Record<number, string> = {};
    const addPointer = (relIdx: number, label: string) => {
        const idx = relIdx + offset;
        pointers[idx] = pointers[idx] ? `${pointers[idx]}=${label}` : label;
    };
    addPointer(pRel, "p");
    addPointer(iRel, "i");
    addPointer(jRel, "j");

    // Pad elements to match their pointer label widths so array and pointer rows stay aligned
    for (const [idxStr, label] of Object.entries(pointers)) {
        const k = Number(idxStr);
        if (label.length > elements[k].length) elements[k] = elements[k].padEnd(label.length);
    }

    console.log("-----------------------");
    console.log(`[ ${elements.join(", ")} ]`);
    console.log(buildPointerRows(elements, pointers));
};

function main() {
    const list = new MyList<number>(5);
    list.set(0, Math.floor(Math.random() * 100));
    list.set(1, Math.floor(Math.random() * 100));
    list.set(2, Math.floor(Math.random() * 100));
    list.set(3, Math.floor(Math.random() * 100));
    list.set(4, Math.floor(Math.random() * 100));
    console.log("-----------------------");
    console.log("List to be sorted:");
    list.printVisualRepresentation();

    for (let k = 0; k < list.getSize(); k++)
        if (list.get(k) === undefined) throw new Error("Cannot sort a list with undefined items");
    quickSort(list);
    list.printVisualRepresentation();
}
main();

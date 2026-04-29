import MyList from "../../data_structures/list.js";
import { buildPointerRows } from "../../cli.js";

const merge = (list1: MyList<number>, list2: MyList<number>, order: "asc" | "desc" = "asc"): MyList<number> => {
    console.log("------------------------------------------------------");
    console.log(`Merging [${list1.getVisualElements()}] with [${list2.getVisualElements()}]`)
    console.log()

    const mergedList = new MyList<number>(list1.getLength() + list2.getLength());

    /* Index to iterate over list1 */
    let i = 0;

    /* Index to iterate over list2 */
    let j = 0;


    /* Index to iterate over the mergedList */
    let k = 0;

    // Compare and pick while both lists have remaining elements
    while (i < list1.getLength() && j < list2.getLength()) {
        const prevI = i, prevJ = j;
        const takeFromList1 = order === 'asc'
            ? list1.get(i)! <= list2.get(j)!
            : list1.get(i)! >= list2.get(j)!;
        const nextItem = takeFromList1 ? list1.get(i++) : list2.get(j++);
        mergedList.set(k, nextItem);
        printVisualRepresentation(mergedList, prevI, prevJ, k, nextItem!, list1, list2);
        k++;
    }

    // NOTE: Only one of the lists will have elements at this point, so only one of the following whiles will be executed

    // If list1 has elements, those are the only ones missing, so they can be merged in order as list1 is already ordered
    while (i < list1.getLength()) {
        mergedList.set(k, list1.get(i));
        printVisualRepresentation(mergedList, i, j, k, list1.get(i)!, list1, undefined);
        i++; k++;
    }

    // If list2 has elements, those are the only ones missing, so they can be merged in order as list2 is already ordered
    while (j < list2.getLength()) {
        mergedList.set(k, list2.get(j));
        printVisualRepresentation(mergedList, i, j, k, list2.get(j)!, undefined, list2);
        j++; k++;
    }

    return mergedList;
}

/**
 * Sorts a list using the Merge Sort algorithm. Returns a new sorted list.
 *
 * @param list - The list to sort.
 * @param order - Sort direction: "asc" (default) or "desc".
 *
 * Time complexity:
 *   - Best case:    O(n log n) — always divides and merges regardless of input order
 *   - Worst case:   O(n log n) — same as best case; no early termination
 * Space complexity: O(n)       — creates new sub-lists at each recursive level
 */
export const mergeSort = (list: MyList<number>, order: "asc" | "desc" = "asc"): MyList<number> => {

    if (list.getLength() === 1) return list;

    for (let k = 0; k < list.getLength(); k++)
        if (list.get(k) === undefined) throw new Error("Cannot sort a list with undefined items");

    // Divide the array in two, if it has an odd size, the second array will be larger by one
    const length1 = Math.floor(list.getLength()/2);
    const length2 = list.getLength() - length1;

    // Clone the list into two separate lists
    const list1 = new MyList<number>(length1);
    const list2 = new MyList<number>(length2);

    for(let i = 0; i < length1; i++) {
        list1.set(i, list.get(i));
    }

    for(let i = 0; i < length2; i++) {
        list2.set(i, list.get(length1 + i));
    }
    console.log();
    console.log(`Dividing [ ${list.getVisualElements()} ] into: `);
    list1.printVisualRepresentation();
    list2.printVisualRepresentation();

    const orderList1 = mergeSort(list1, order);
    const orderList2 = mergeSort(list2, order);

    return merge(orderList1, orderList2, order);
};


const printWithPointers = (label: string, elements: string[], pointers: Record<number, string>) => {
    console.log(`${label}[ ${elements.join(", ")} ]`);
    buildPointerRows(elements, pointers)
        .split("\n")
        .forEach(row => console.log(" ".repeat(label.length) + row));
};

const printVisualRepresentation = (mergedList: MyList<number>, i: number, j: number, k: number, nextItem: number, list1?: MyList<number>, list2?: MyList<number>) => {
    list1 ? printWithPointers("List 1: ", list1.getVisualElements(), { [i]: "i" }) : console.log('List 1: DONE');
    list2 ? printWithPointers("List 2: ", list2.getVisualElements(), { [j]: "j" }) : console.log('List 2: DONE');
    console.log('');
    console.log(`${nextItem} was selected for merging`)
    console.log('');
    printWithPointers("Merged list: ", mergedList.getVisualElements(), { [k]: "k" });
    console.log("------------");
}

function main() {
    const list = new MyList<number>(5);
    list.set(0, Math.floor(Math.random() * 100));
    list.set(1, Math.floor(Math.random() * 100));
    list.set(2, Math.floor(Math.random() * 100));
    list.set(3, Math.floor(Math.random() * 100));
    list.set(4, Math.floor(Math.random() * 100));
    console.log("--------------------------------");
    console.log("List to be sorted:");
    list.printVisualRepresentation();
    mergeSort(list);
}
main();
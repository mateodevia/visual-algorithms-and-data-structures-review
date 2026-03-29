import { buildPointerRows } from "../../cli.js";
import { MyArray } from "../../data_structures/array.js";

/**
 * Removes duplicates from a sorted array in place and returns the count of unique elements.
 * The first k elements of the array will contain the unique values in their original order.
 *
 * @param nums - A sorted MyArray of numbers.
 *
 * Time complexity:
 *   - Best case:    O(n) — single pass; no early termination
 *   - Worst case:   O(n) — same as best case
 * Space complexity: O(1) — in place, no auxiliary data structures
 */
const removeDuplicates = function(nums: MyArray<number>) {

    let j = 0; // last unique element

    for (let i = 1; i < nums.getSize(); i++) {
        printVisualRepresentation(nums, i, j);
        if (nums.get(j) < nums.get(i)) {
            nums.set(j+1, nums.get(i));
            j++;
        }
        printVisualRepresentation(nums, i, j);
    }
    
    return nums.getSize() ? j+1 : 0;
};

const printVisualRepresentation = (list: MyArray<number>, reading: number, lastWrite: number) => {
    const elements: string[] = [];
    for (let k = 0; k < list.getSize(); k++) {
        elements.push(k > lastWrite && k < reading ? "X" : String(list.get(k)));
    }
    const pointers: Record<number, string> = {};
    if (reading === lastWrite) {
        pointers[reading] = "i=j";
    } else {
        pointers[reading] = "i";
        pointers[lastWrite] = "j";
    }
    console.log("--------------------------------");
    console.log(`[ ${elements.join(", ")} ]`);
    console.log(buildPointerRows(elements, pointers));
}


const isMain = process.argv[1]?.endsWith("0_remove_item_from_ordered_array.js");
if (isMain) {
    const nums = new MyArray<number>();
    [1, 2].forEach(n => nums.push(n));
    const finalLength = removeDuplicates(nums);

    console.log('Final length:', finalLength);
};


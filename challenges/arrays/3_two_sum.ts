import { buildPointerRows, executeMain } from "../../cli.js";
import MyArray from "../../data_structures/array.js";
import MyHashTable from "../../data_structures/hash_table.js";

/**
 * Two Sum: returns the indices of two distinct positions whose values sum to `target`.
 * Assumes exactly one valid pair exists (classic LeetCode-style statement).
 *
 * Uses a hash map from each value to the list of indices where it appears, then for each
 * index `i` checks whether `target - nums[i]` was seen at a different index.
 *
 * @param nums - Input array of numbers.
 * @param target - The sum that the two chosen elements must equal.
 * @returns A `MyArray` with two indices `[i, j]` (order as found: first the earlier index
 *   from the map, then the current `i`).
 *
 * Time complexity:  O(n) — one pass; O(1) expected work per step with a good hash map.
 * Space complexity: O(n) — map stores index lists per distinct value.
 */
const twoSum = function(nums: MyArray<number>, target: number) {
    const map = new MyHashTable<MyArray<number>>(nums.getLength());

    const response = new MyArray();

    console.log("Two Sum — step trace (pointer = current i)\n");

    for (let i = 0; i < nums.getLength(); i++) {
        const array = map.get(`${nums.get(i)}`) ?? new MyArray();
        array.push(i);
        map.set(`${nums.get(i)}`, array);
        const complement = target - nums.get(i);

        printTwoSumStep(nums, i, target, complement, 'Storing complement');

        if (map.get(`${complement}`)?.getLength()) {
            if (map.get(`${complement}`)?.get(0) == i) continue;

            const j = map.get(`${complement}`)?.get(0);
            response.push(j);
            response.push(i);
            printTwoSumStep(
                nums,
                i,
                target,
                complement,
                `pair found: indices [${j}, ${i}] → nums[${j}]=${nums.get(j!)} nums[${i}]=${nums.get(i)} (${nums.get(j!)} + ${nums.get(i)} = ${target})`,
                j,
            );
            break;
        }
    }
    return response;
};

/**
 * Prints the array with column pointer(s) at `i` (and `j` when the pair is resolved) plus a summary line.
 */
const printTwoSumStep = (
    nums: MyArray<number>,
    i: number,
    target: number,
    complement: number,
    note: string,
    pairPartnerIndex?: number,
) => {
    const elements = nums.getVisualElements();
    const pointers: Record<number, string> = {};
    pointers[i] = "i";
    if (pairPartnerIndex !== undefined) {
        pointers[pairPartnerIndex] = "j";
    }

    console.log("--------------------------------");
    console.log(`[ ${elements.join(", ")} ]`);
    console.log(buildPointerRows(elements, pointers));
    console.log(
        `  ${note}  |  target=${target}  nums[${i}]=${nums.get(i)}  complement=${complement}`,
    );
};

executeMain("3_two_sum.ts", () => {
    const array = new MyArray({ initArray: [2, 7, 11, 15] });

    const response = twoSum(array, 9);

    console.log("\nResult indices:");
    response.printVisualRepresentation();
});

/**
 * Sorted array to balanced BST (LeetCode 108).
 * Uses {@link Node} from this repo — `value`, `left`, `right` (not `val`).
 * Input is a {@link MyArray} of numbers sorted ascending.
 */

import { executeMain, formatBinaryTreeAsciiLines } from "../../cli.js";
import MyArray from "../../data_structures/array.js";
import { Node } from "../../data_structures/binary_search_tree.js";

export const sortedArrayToBST = function (nums: MyArray<number>): Node<number> | null {
    if (nums.getLength() === 0) return null;

    return generateSubTree(nums, 0, nums.getLength() - 1);
};

const generateSubTree = (
    nums: MyArray<number>,
    start: number,
    end: number,
): Node<number> | null => {
    if (end - start === 0) {
        return new Node(nums.get(start));
    }

    const middle = start + Math.floor((end - start) / 2);
    const left = start <= middle - 1 ? generateSubTree(nums, start, middle - 1) : null;
    const right = middle + 1 <= end ? generateSubTree(nums, middle + 1, end) : null;

    return new Node(nums.get(middle), left, right);
};

executeMain("4_ordered_array_to_BST.ts", () => {
    const nums = new MyArray<number>({ initArray: [-10, -3, 0, 5, 9] });
    const root = sortedArrayToBST(nums);

    console.log("Sorted input (MyArray):");
    nums.printVisualRepresentation();
    console.log();

    console.log("BST from sorted array:");
    if (!root) {
        console.log("(empty)");
        return;
    }

    console.log("-----------------------------------------------------");
    for (const line of formatBinaryTreeAsciiLines(root)) {
        console.log(line);
    }
});

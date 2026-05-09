import { buildPointerRows, executeMain } from "../../cli.js";
import MyArray from "../../data_structures/array.js";

/**
 * Merges `nums2` into `nums1` in non-decreasing order. `nums1` has logical length `m + n`:
 * the first `m` values are sorted, followed by `n` buffer slots (often placeholders).
 * `nums2` contributes `n` sorted values. Modifies `nums1` only; classic “merge from the end”.
 *
 * @param nums1 - Destination array (`m + n` elements).
 * @param m - Count of meaningful elements initially in `nums1`.
 * @param nums2 - Second sorted array (`n` elements).
 * @param n - Length of `nums2`.
 *
 * Time complexity:
 *   - Best / worst case: O(m + n) — each element moves at most once when pointers stay valid.
 * Space complexity: O(1) — only index variables; merges in place.
 */
const mergeSortedArrays = (
    nums1: MyArray<number>,
    m: number,
    nums2: MyArray<number>,
    n: number,
): void => {
    let tail = m - 1;
    let lastEmptySpace = m + n - 1;
    let elementToInsert = n - 1;

    console.log("Merge sorted arrays — step trace\n");

    while (elementToInsert >= 0) {
        printMergeStep(nums1, tail, lastEmptySpace, nums2, elementToInsert);

        if (nums2.get(elementToInsert) <= nums1.get(tail)) {
            console.log(`${nums1.get(tail)} is grater or equal to ${nums2.get(elementToInsert)}, so it should be pushed to the end`)
            nums1.set(lastEmptySpace, nums1.get(tail));
            nums1.set(tail, 0);

            lastEmptySpace--;
            tail--;
        } else {
            console.log(`${nums2.get(elementToInsert)} is grater than ${nums1.get(tail)} to it should be inserted at the end`)
            nums1.set(lastEmptySpace, nums2.get(elementToInsert));
            nums2.set(elementToInsert, 0);

            lastEmptySpace--;
            elementToInsert--;
        }
    }

    printMergeStep(nums1, tail, lastEmptySpace, nums2, elementToInsert);
};

/** Renders placeholders (and numeric zero) as `-` for trace readability. */
const zeroAsDash = (cells: string[]) => cells.map((c) => (c === "0" ? "-" : c));

/** Joins pointer labels when two indices collide on the same column. */
function buildMergedPointerRecord(
    entries: readonly { index: number; label: string }[],
    len: number,
): Record<number, string> {
    const byIndex = new Map<number, string[]>();
    for (const { index, label } of entries) {
        if (index < 0 || index >= len) continue;
        const bucket = byIndex.get(index);
        if (bucket) bucket.push(label);
        else byIndex.set(index, [label]);
    }
    const pointers: Record<number, string> = {};
    for (const [index, labels] of byIndex) {
        pointers[index] = labels.join("|");
    }
    return pointers;
}

const printMergeStep = (
    nums1: MyArray<number>,
    tail: number,
    writeIdx: number,
    nums2: MyArray<number>,
    j: number,
) => {
    const nums1Elts = zeroAsDash(nums1.getVisualElements());
    const nums1Len = nums1.getLength();
    const nums1Pointers = buildMergedPointerRecord(
        [
            { index: tail, label: "t" },
            { index: writeIdx, label: "w" },
        ],
        nums1Len,
    );

    const nums2Elts = zeroAsDash(nums2.getVisualElements());
    const nums2Len = nums2.getLength();
    const nums2Pointers =
        j >= 0 && j < nums2Len
            ? buildMergedPointerRecord([{ index: j, label: "j" }], nums2Len)
            : {};

    console.log("--------------------------------");
    console.log("nums1:");
    console.log(`[ ${nums1Elts.join(", ")} ]`);
    console.log(buildPointerRows(nums1Elts, nums1Pointers));
    console.log();

    console.log("nums2:");
    console.log(`[ ${nums2Elts.join(", ")} ]`);
    console.log(buildPointerRows(nums2Elts, nums2Pointers));

};

executeMain("7_merge_sorted_arrays.ts", () => {
    const nums1 = new MyArray({ initArray: [1, 2, 3, 0, 0, 0] });
    const nums2 = new MyArray({ initArray: [2, 5, 6] });

    mergeSortedArrays(nums1, 3, nums2, 3);

    console.log("\nResult nums1:");
    console.log(`[ ${zeroAsDash(nums1.getVisualElements()).join(", ")} ]`);
});

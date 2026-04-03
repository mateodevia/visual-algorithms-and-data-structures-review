import MyArray from "../../data_structures/array.js";

const reverseArray = (nums: MyArray<number>, start: number, end: number) => {
    const size = end -  start;

    let swapIndex = end - 1

    for (let i = start; i < start + Math.trunc(size / 2); i++) {
        const swapElement = nums.get(swapIndex);
        
        nums.set(swapIndex, nums.get(i));
        nums.set(i, swapElement);
        swapIndex--;
    }
}

/**
 * @param {number[]} nums
 * @param {number} k number of positions to rotate
 * @return {void} Do not return anything, modify nums in-place instead.
 */
const rotateArray = (nums: MyArray<number>, k: number) => {

    if (nums.getLength() <= 1) return;

    console.log('Initial Array', nums.getVisualElements());
    
    // Reverse all the array [0,...,S)
    reverseArray(nums, 0, nums.getLength());

    console.log('Reverse complete array', printVisualRepresentation(nums, 0, nums.getLength()));

    const pivotIndex = k % nums.getLength();

    // Reverse first p elements [0,...,p)
    reverseArray(nums, 0, pivotIndex);

    console.log('Reverse first sub array', printVisualRepresentation(nums, 0, pivotIndex));

    // Reverse rest of elements [p,...,S)
    reverseArray(nums, pivotIndex, nums.getLength())

    console.log('Reverse second sub array', printVisualRepresentation(nums, pivotIndex, nums.getLength()));
    
};

const printVisualRepresentation = (nums: MyArray<number>, start: number, end: number): string => {
    const elements = nums.getVisualElements();
    const parts = elements.map((el, i) => {
        if (i === start) return `[ ${el}`;
        if (i === end - 1) return `${el} ]`;
        if (i > start && i < end) return el;
        return ` ${el} `;
    });
    return parts.join(", ");
}

const isMain = process.argv[1]?.endsWith("1_rotate_array.ts");
if (isMain) {
    const nums = new MyArray<number>();
    [1,2].forEach(n => nums.push(n));
    rotateArray(nums, 3);

    console.log('Final array:', nums.getVisualElements());
};


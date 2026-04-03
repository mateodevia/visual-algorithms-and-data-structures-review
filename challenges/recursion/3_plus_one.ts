import { executeMain } from "../../cli.js";
import MyArray from "../../data_structures/array.js";

/**
 * Adds one to the received number
 *
 * @param digits - Array of numbers representing the digits of a number
 * @return Array of numbers representing the digits of the original number plus one
 *
 * Time complexity:  O(n²) — Each recursion does linear work n, n-1, n-2, … = n(n+1)/2 = O(n²)
 * Space complexity:  O(n²) — Each recursion clones the array n, n-1, n-2, … = n(n+1)/2 = O(n²)
 * (Optimized version of this challenge can be found in challenges/arrays/2_plus_one.ts)
 * 
 */
const plusOne = (digits: MyArray<number>): MyArray<number> => {
    const newDigits = digits.clone(); // O(n)
    const newDigit = newDigits.get(newDigits.getLength() - 1);
    
    if (newDigit === 9) {
        if (newDigits.getLength() === 1) return new MyArray({ initArray: [1, 0] }); 
        
        return plusOne(newDigits
                .slice(0, newDigits.getLength() - 1)) // O(n)
                .concat(new MyArray({ initArray: [0] })); // O(n)
    } else {
        newDigits.set(newDigits.getLength() - 1, newDigits.get(newDigits.getLength() - 1) + 1);
        return newDigits;
    }

}

executeMain('3_plus_one.ts', () => {
    const array = new MyArray({initArray: [4,3,2,1]});

    const incrementedArray = plusOne(array);

    incrementedArray.printVisualRepresentation();
});
import { executeMain } from "../../cli.js";
import MyArray from "../../data_structures/array.js";

/**
 * Adds one to the received number
 *
 * @param digits - Array of numbers representing the digits of a number
 * @return Array of numbers representing the digits of the original number plus one
 *
 * Time complexity:  O(n)
 * Space complexity:  O(1)
 * 
 */
const plusOne = (digits: MyArray<number>): MyArray<number> => {
    if (digits.getLength() === 0) {
        digits.push(1);
        return digits;
    }
    let carry = 1; // Space O(1)
    for (let i = digits.getLength() - 1; i >= 0; i--) { // Time O(n)
        const newDigit = digits.get(i) + carry; // Space O(1)
        
        if (newDigit <= 9) {
            digits.set(i, newDigit);
            carry = 0;
            break;
        } else {
            digits.set(i, 0)
            carry = 1;
        }
    }
    if (carry === 1) {
        let memory = 1; // O(1)
        for (let i = 0; i < digits.getLength(); i++){ // O(n)
            const temp = digits.get(i);
            digits.set(i, memory);
            memory = temp;
            
        }
        digits.push(memory)
    }
    return digits;
}

executeMain('2_plus_one.ts', () => {
    const array = new MyArray({initArray: [4,3,2,1]});

    const incrementedArray = plusOne(array);

    incrementedArray.printVisualRepresentation();
});
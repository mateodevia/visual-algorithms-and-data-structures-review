import { buildPointerRows, executeMain } from "../../cli.js";
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
    console.log("Plus one — step trace\n");
    for (let i = digits.getLength() - 1; i >= 0; i--) {
        // Time O(n)
        const digitAtI = digits.get(i);
        const incomingCarry = carry;
        const newDigit = digitAtI + incomingCarry; // Space O(1)

        printPlusOneStep(
            digits,
            i,
            `inspect i: digits[${i}](${digitAtI}) + carry (${incomingCarry}) = ${newDigit}`,
        );

        if (newDigit <= 9) {
            digits.set(i, newDigit);
            carry = 0;
            printPlusOneStep(
                digits,
                i,
                `set digits[${i}] to ${newDigit} (${digitAtI} + ${incomingCarry}); carry → 0 — stop`,
                carry,
            );
            break;
        } else {
            digits.set(i, 0);
            carry = 1;
            printPlusOneStep(
                digits,
                i,
                `overflow: digits[${i}](${digitAtI}) + carry (${incomingCarry}) = ${newDigit} → digit 0, carry → 1`,
                carry,
            );
        }
    }
    if (carry === 1) {
        console.log("\nCarry still 1 — shift digits right and place leading 1\n");
        let memory = 1; // O(1)
        for (let i = 0; i < digits.getLength(); i++) {
            // O(n)
            const digitAtI = digits.get(i);
            const memToWrite = memory;
            printPlusOneShiftStep(
                digits,
                i,
                memory,
                `before: digits[${i}](${digitAtI}) ← memory (${memToWrite})`,
            );
            const temp = digits.get(i);
            digits.set(i, memory);
            memory = temp;
            printPlusOneShiftStep(
                digits,
                i,
                memory,
                `after: digits[${i}] = ${memToWrite}; memory ← ${memory} (previous digit at i was ${digitAtI})`,
            );
        }
        digits.push(memory);
        console.log("--------------------------------");
        console.log(`[ ${digits.getVisualElements().join(", ")} ]`);
        console.log(
            `  append: push memory (${memory}) → new index ${digits.getLength() - 1}`,
        );
    }
    return digits;
};

/** Right-to-left pass: pointer at the active index `i`; optional `carryState` prints current carry after the step. */
const printPlusOneStep = (
    digits: MyArray<number>,
    i: number,
    note: string,
    carryState?: number,
) => {
    const elements = digits.getVisualElements();
    const pointers: Record<number, string> = { [i]: "i" };
    console.log("--------------------------------");
    console.log(`[ ${elements.join(", ")} ]`);
    console.log(buildPointerRows(elements, pointers));
    const tail = carryState !== undefined ? `  |  carry=${carryState}` : "";
    console.log(`  ${note}${tail}`);
};

/** Overflow pass: pointer at `i`; `memory` is the value held in the rotating `memory` slot after the step. */
const printPlusOneShiftStep = (
    digits: MyArray<number>,
    i: number,
    memory: number,
    note: string,
) => {
    const elements = digits.getVisualElements();
    const pointers: Record<number, string> = { [i]: "i" };
    console.log("--------------------------------");
    console.log(`[ ${elements.join(", ")} ]`);
    console.log(buildPointerRows(elements, pointers));
    console.log(`  ${note}  |  memory=${memory}`);
};

executeMain("2_plus_one.ts", () => {
    const array = new MyArray({ initArray: [9, 9, 9, 9] });

    const incrementedArray = plusOne(array);

    console.log("\nResult:");
    incrementedArray.printVisualRepresentation();
});

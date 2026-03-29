
/**
 * Calculates the factorial of a non-negative integer n (n!).
 *
 * - The factorial of 0 is defined as 1.
 * - The factorial of n is the product of all positive integers up to n.
 * - Throws an error if n is negative.
 *
 * Time complexity: O(n) — one recursive call per decrement of n, from n down to 0
 * Space complexity: O(n) — call stack grows linearly with n due to recursion
 *
 * @param n - The non-negative integer to compute the factorial of
 * @returns The factorial of n
 */
export const factorial = (n: number): number => {

    if (n<0) throw new Error('Cannot calculate factorial for negative numbers')

    let response;
    // Base case
    if (n === 0) response = 1;
    // Non base case
    else response = n * factorial(n-1);
    
    console.log(`${n} factorial is ${response}`);
    return response;
}

const isMain = process.argv[1]?.endsWith("1_factorial.js");
if (isMain) {
    factorial(10);
};

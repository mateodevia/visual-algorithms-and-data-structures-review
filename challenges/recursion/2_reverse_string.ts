
/**
 * Reverses a string recursively.
 *
 * @param str - The string to reverse.
 * @returns The reversed string.
 *
 * Time complexity:  O(n) — one recursive call per character
 * Space complexity: O(n) — call stack grows linearly with string length
 */
export const reverseString = (str: string): string => {
    let newString;

    if (str.length === 1) newString = str;
    else newString = str[str.length - 1] + reverseString(str.substring(0, str.length-1))
    
    console.log(newString)
    return newString;
}

const isMain = process.argv[1]?.endsWith("2_reverse_string.js");
if (isMain) {
    reverseString('Hello');
};

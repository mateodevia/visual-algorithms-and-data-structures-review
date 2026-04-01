import MyList from "../../data_structures/list.js";

const VISUAL_DEPTH_LIMIT = 3;

/**
 * Finds the minimum number of coins needed to make up `debt` using the given coin set.
 * Uses a greedy recursive approach: tries every coin denomination at each step.
 *
 * @param coinSet - A list of available coin denominations.
 * @param debt    - The remaining amount to pay.
 * @param depth   - Current recursion depth (used internally for visual indentation).
 * @param verbose - Whether to print the visual trace (default: true).
 * @returns The minimum number of coins needed, or Infinity if no solution exists.
 *
 * Time complexity:  O(n^d) — n coin denominations, d = debt/smallest coin (exponential)
 * Space complexity: O(d)   — call stack depth proportional to debt
 */
const greedyChange = (coinSet: MyList<number>, debt: number, depth: number = 0, verbose: boolean = true): number => {
    const indent = "  ".repeat(depth);

    if (debt === 0) return 0;

    if (debt < 0) return Infinity

    // Past the visual limit: compute silently and print a summary
    if (verbose && depth >= VISUAL_DEPTH_LIMIT) {
        const result = greedyChange(coinSet, debt, 0, false);
        const label = result === Infinity ? "∞" : String(result);
        console.log(`${indent}[greedyChange(${debt}) = ${label}  — deeper levels hidden]`);
        return result;
    }

    if (verbose) console.log(`${indent}greedyChange(debt=${debt}):`);

    let leastNumberOfCoins = Infinity;

    // Try all alternatives you have in the coin set
    for(let i = 0; i < coinSet.getSize() - 1; i++) {
        const coin = coinSet.get(i)!;
        const remaining = debt - coin;

        if (remaining < 0) {
            if (verbose) console.log(`${indent}  • coin=${coin}: impossible (debt goes to ${remaining})`);
            continue;
        }

        if (verbose) console.log(`${indent}  • coin=${coin}: remaining debt = ${remaining}, recursing...`);

        // How many coins I need to pay the remaining debt if my next coin is coinSet.get(i)?
        const res = greedyChange(coinSet, remaining, depth + 1, verbose);

        if(res !== Infinity) {
            // The number of coins for the current alternative is the recursive call + the current coin we are choosing
            const coinsOfCurrentAlternative = res + 1

            if (verbose) {
                const star = coinsOfCurrentAlternative < leastNumberOfCoins ? "  ← new best!" : "";
                console.log(`${indent}    ${res} coins for rest + 1 (this coin) = ${coinsOfCurrentAlternative}${star}`);
            }

            // Store this alternative only if the number of coins of the currentAlternative is less than leastNumberOfCoins
            leastNumberOfCoins = Math.min(leastNumberOfCoins, coinsOfCurrentAlternative);
        } else {
            if (verbose) console.log(`${indent}    impossible`);
        }
    }

    if (verbose) console.log(`${indent}  → returns ${leastNumberOfCoins === Infinity ? "∞ (no solution)" : leastNumberOfCoins + " coins"}\n`);
    return leastNumberOfCoins;
}

const isMain = process.argv[1]?.endsWith("coin_change.js");
if (isMain) {
    const coins = new MyList<number>(5);
    coins.set(0, 1);
    coins.set(1, 5);
    coins.set(2, 10);
    coins.set(3, 15);
    coins.set(4, 20);

    const debt = 27;

    console.log("=== Visual Trace ===\n");
    const change = greedyChange(coins, debt);

    console.log(`Payed the debt of ${debt} with ${change} coins`);
};

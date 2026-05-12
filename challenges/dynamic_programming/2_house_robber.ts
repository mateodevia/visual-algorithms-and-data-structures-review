import { executeMain } from "../../cli.js";
import MyArray from "../../data_structures/array.js";

/**
 * You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums: MyArray<number>) {
    const cache: Record<number, number> = {
        0: nums.get(0),
        1: Math.max(nums.get(0),nums.get(1)),
    };

    for(let i = 2; i < nums.getLength(); i++) {
        console.log('-------------------------------------------')
        console.log(`Best robbery until house ${i-2} = ${cache[i-2]}`)
        console.log(`Best robbery until house ${i-1} = ${cache[i-1]}`)
        console.log(`Comparing skipping this house (${cache[i-1]}) with robbing it (${cache[i-2] + nums.get(i)})`)
        cache[i] = Math.max(cache[i-2] + nums.get(i), cache[i-1]);
        console.log(`Best robbery until house ${i} = ${cache[i]}`)
    }
    return cache[nums.getLength()-1];
};

executeMain("2_house_robber.ts", () => {

    const nums = new MyArray<number>({ initArray: [2, 7, 9, 3, 1] });
    console.log(rob(nums));
});

import { executeMain } from "../../cli.js";
import MyArray from "../../data_structures/array.js";

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums:MyArray<number>) {
    let previous = nums.get(0);
    
    let max = nums.get(0)
    
    for (let i = 1; i < nums.getLength(); i++) {
        console.log('-------------------------------------------')
        console.log(`Biggest subarray until ${i-1} = ${previous}`)
        console.log(`Comparing the cuurent value standalone (${nums.get(i)}) with it + the biggest so far (${previous + nums.get(i)})`)
        const current = Math.max(nums.get(i), previous + nums.get(i));
        console.log(`Biggest subarray until ${i} = ${current}`)
        
        max = Math.max(max, current);
        console.log(`Biggest sum so far ${max}`)
        previous = current;
    }
    
    return max;
};

executeMain("1_max_sub_array.ts", () => {

    const nums = new MyArray<number>({ initArray: [-2, 1, -3, 4, -1, 2, 1, -5, 4] });
    console.log(maxSubArray(nums));
});

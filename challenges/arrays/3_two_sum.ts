import { executeMain } from "../../cli.js";
import MyArray from "../../data_structures/array.js";
import MyHashTable from "../../data_structures/hash_table.js";

/**
 * funds the indexes of the only two items of an array that sum exactly target
 * @param nums 
 * @param target 
 * @returns 
 */
var twoSum = function(nums: MyArray<number>, target: number) {
    const map = new MyHashTable<MyArray<number>>(nums.getLength());
    
    const response = new MyArray();
    
    for (let i = 0; i < nums.getLength(); i++) {
        const array = map.get(`${nums.get(i)}`) ?? new MyArray();
        array.push(i)
        map.set(`${nums.get(i)}`, array);
        const complement = target - nums.get(i);
        
        if (map.get(`${complement}`)?.getLength()) {
            if (map.get(`${complement}`)?.get(0) == i) continue;
        
            response.push(map.get(`${complement}`)?.get(0));
            response.push(i);
            break;
        }
    }
    return response;
};
executeMain('3_two_sum.ts', () => {
    const array = new MyArray({initArray: [2,7,11,15]});

    const response = twoSum(array, 9);

    response.printVisualRepresentation();
});
import { buildPointerRows, executeMain } from "../../cli.js";
import MyArray from "../../data_structures/array.js";
import MyList from "../../data_structures/list.js";

const binarySearch = (list: MyArray<number> | MyList<number>, value: number) => {

    let lower = 0;
    let upper = list.getLength() - 1;
    let found;

    printVisualRepresentation(list, lower, upper);

    while(found === undefined && lower <= upper) {
        const middle = lower+Math.floor((upper-lower)/2);
        console.log(`Analysing middle element at index ${middle}`);
        console.log();
        if(list.get(middle) === value) {
            console.log(`Element found at index ${middle}`)
            found = middle;
        } else if (list.get(middle)! < value) {
            console.log(`${list.get(middle)} is less than ${value}, moving to the upper half`)
            lower = middle !== lower ? middle : middle + 1;
        } else {
            console.log(`${list.get(middle)} is more than ${value}, moving to the lower half`)
            upper = middle !== upper ? middle : middle - 1;
        }
        printVisualRepresentation(list, lower, upper);
    }

    
    return found;
}

const printVisualRepresentation = (list: MyArray<number> | MyList<number>, lower: number, upper: number) => {
    const elements = list.getVisualElements();
    const pointers: Record<number, string> = {};

    if (lower <= upper) {
        const middle = lower + Math.floor((upper - lower) / 2);
        pointers[lower] = "l";
        pointers[upper] = pointers[upper] ? `${pointers[upper]}=u` : "u";
        pointers[middle] = pointers[middle] ? `${pointers[middle]}=m` : "m";
    }

    console.log("-----------------------------------------------");
    list.printVisualRepresentation();
    if (lower <= upper) {
        console.log(buildPointerRows(elements, pointers));
    } else {
        console.log("Window is empty.");
    }
}

executeMain("binary_search.ts", () => {
    const list = new MyArray<number>({ initArray: [10, 20, 30, 40, 50, 60], enableLogs:true });
    console.log('Found 20 at', binarySearch(list, 20));
    return list;
});

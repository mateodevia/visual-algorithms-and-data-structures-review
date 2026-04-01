import { executeMain, runCLI } from "../cli.js";

/**
 * A generic dynamic array backed by a hash map (object).
 * Supports O(1) get/set and O(n) delete (due to shifting).
 */
class MyArray<T> {

    private length: number;

    private data: Record<number, T>;

    constructor(enableLogs?: boolean) {
        this.length = 0;
        this.data = {};
        if (enableLogs) {
            console.log("List Initialized:");
            this.printVisualRepresentation();
        }
    }

    /** Returns the element at the given index. */
    get(index: number): T {
        return this.data[index];
    }

    /** Sets the element at the given index. */
    set(i: number, value: T): void {
        if (i+1 > this.length) {
            this.length = i+1;
        }

        this.data[i] = value;
    }

    /** Appends an element to the end. Returns the internal data map. */
    push(element: T): Record<number, T> {
        this.data[this.length] = element;
        this.length++;
        return this.data;
    }

    /** Removes and returns the last element. */
    pop(): T {
        if (this.length === 0) throw new Error('The array is empty');
        const elementToDelete = this.data[this.length - 1];
        delete this.data[this.length - 1];
        this.length--;
        return elementToDelete;
    }

    /**
     * Shifts all elements from `index` onward one position to the left,
     * overwriting the element at `index`. Does not update `length`.
     *
     * Time complexity: O(n) — moves up to n elements.
     */
    shiftLeft (index: number) {
        for(let i = index; i < this.length - 1; i++) {
            this.data[i] = this.data[i+1]
        }
    }

    /**
     * Removes the element at the given index, shifting all subsequent elements left.
     * Returns the removed element.
     *
     * Time complexity: O(n) — shifts up to n elements.
     */
    delete(index: number): T {
        if (index > this.length - 1) throw new Error('The index is out of bounce');
        const elementToDelete = this.data[index]
        // Move all elements after the index to the left
        this.shiftLeft(index)
        // Remove the last element which at this point is duplicated
        this.pop();
        return elementToDelete;
    }

    /** Returns the number of elements in the array. */
    getSize(): number {
        return this.length;
    }

    /** Returns a new MyArray with each element transformed by the given function. */
    map<R>(f: (p: T, k: number) => R): MyArray<R> {
        const newArray = new MyArray<R>();
        for(let i = 0; i < this.length; i++) {
            newArray.set(i, f(this.get(i), i))
        }
        return newArray;
    }

    find(callback: (item?: T) => boolean): T | undefined {
        let found = false;
        for (let i = 0 ; i < this.length; i++) {
            found = callback(this.data[i])
            if (found) return this.data[i]
        }
        return undefined
    }

    forEach(callback: (item?: T, i?: number) => void): void {
        for (let i = 0 ; i < this.length; i++) {
            callback(this.data[i], i);
        }
    }

    getVisualElements(): string[] {
        return Array.from({ length: this.length }, (_, i) =>
            this.data[i] === undefined ? "_" : String(this.data[i])
        );
    }

    printVisualRepresentation() {
        console.log(`[ ${this.getVisualElements().join(", ")} ]`);
    }
}

executeMain('array.ts', () => {
    runCLI({
        s: ([index, value], arr) => arr.set(Number(index), Number(value)),
        g: ([index], arr) => console.log('Retrieved value', arr.get(Number(index))),
        pu: ([value], arr) => arr.push(Number(value)),
        po: ([], arr) => arr.pop(),
        sh: ([index], arr) => arr.shiftLeft(Number(index)),
        d: ([index], arr) => arr.delete(Number(index)),
    }, () => new MyArray(true))
});

export default MyArray;
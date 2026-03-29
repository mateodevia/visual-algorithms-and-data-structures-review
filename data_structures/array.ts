
/**
 * A generic dynamic array backed by a hash map (object).
 * Supports O(1) get/set and O(n) delete (due to shifting).
 */
export class MyArray<T> {

    private length = 0;

    private data: Record<number, T> = {};

    /** Returns the element at the given index. */
    get(index: number): T {
        return this.data[index];
    }

    /** Sets the element at the given index. */
    set(i: number, value: T) {
        this.data[i] = value;
    }

    /** Appends an element to the end. Returns the internal data map. */
    push(element: T) {
        this.data[this.length] = element;
        this.length++;
        return this.data;
    }

    /** Removes and returns the last element. */
    pop() {
        const elementToDelete = this.data[this.length - 1];
        delete this.data[this.length - 1];
        this.length--;
        return elementToDelete;
    }

    /**
     * Removes the element at the given index, shifting all subsequent elements left.
     * Returns the removed element.
     *
     * Time complexity: O(n) — shifts up to n elements.
     */
    delete(index: number) {
        const elementToDelete = this.data[index]
        // Move all elements after the index to the left
        for(let i = index; i < this.length - 1; i++) {
            this.data[i] = this.data[i+1]
        }
        this.pop();
        return elementToDelete;
    }

    /** Returns the number of elements in the array. */
    getSize() {
        return this.length;
    }

    /** Returns a new MyArray with each element transformed by the given function. */
    map(f: (p: T, k: number) => any) {
        const newArray = new MyArray<T>();
        for(let i = 0; i < this.length; i++) {
            newArray.set(i, f(this.get(i), i))
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
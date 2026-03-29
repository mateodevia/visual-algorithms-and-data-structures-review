
import { runCLI, buildPointerRows } from "../cli.js";

class Queue {
    constructor(private size: number) {
        this.items = new Array(size).fill(undefined);
        console.log("Queue Initialized:");
        this.printVisualRepresentation();
    }

    private items: (number | undefined)[] = [];
    /**
     * The `front` property points to the logical index where the first element is located in the queue.
     *
     * Example:
     * [ 5, 7, _, _, _, _, _]
     *   ^
     *   F
     */
    private logicalFront = -1;
    /**
     * The `rear` property points to the logical index where the last element is located in the queue.
     *
     * Example:
     * [ 5, 7, _, _, _, _, _]
     *      ^
     *      R
     */
    private logicalRear = -1;

    /**
     * Adds a value to the rear of the queue.
     *
     * Time complexity:  O(1) — advances the rear pointer and writes one slot
     * Space complexity: O(1)
     *
     * @param value - The number to add.
     */
    enqueue(value: number) {
        // if the the distance between the rear and front pointers is equal to the size of the queue, the queue is full
        if (Math.abs(this.logicalRear - this.logicalFront) === this.size) {
            console.error("Queue is full");
            return;
        }

        // Add the value to the rear index
        this.logicalRear++;
        this.items[this.logicalRear % this.size] = value;
    }

    /**
     * Removes the value at the front of the queue.
     *
     * Time complexity:  O(1) — advances the front pointer, no data is moved
     * Space complexity: O(1)
     */
    dequeue() {
        if (this.logicalRear === this.logicalFront) {
            console.error("Queue is empty");
            return;
        }
        // Move the front pointer to the next element
        this.logicalFront++;
    }

    printVisualRepresentation(): string {
        const visual = this.items.map(item => item === undefined ? "_" : String(item));
        const line = `[ ${visual.join(", ")} ]`;

        if (this.logicalFront === this.logicalRear) return line;

        const f = (this.logicalFront + 1) % this.size;
        const r = this.logicalRear % this.size;

        const pointers: Record<number, string> = {};
        if (f === r) pointers[f] = "F=R";
        else { pointers[f] = "F"; pointers[r] = "R"; }

        return `${line}\n${buildPointerRows(visual, pointers)}`;
    }
}


function main() {
    const queue = new Queue(5)
    return queue;
}

runCLI({
    e: ([value], q) => q.enqueue(Number(value)),
    d: (_, q) => q.dequeue(),
}, main);

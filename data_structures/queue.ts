
import { runCLI, buildPointerRows } from "../cli.js";

interface Node<T> {
    value: T | undefined;
    next: Node<T> | null
}

/**
 * Queue implemented as a singly linked chain from newest (`last`) along `next`;
 * dequeue finds the front by walking from `last`. Enqueue is O(1); index lookup and
 * dequeue are O(n) in the worst case because of that walk.
 */
class MyQueue<T> {
    private first: Node<T> | null;

    private last: Node<T> | null;

    private length: number;

    private enableLogs: boolean;

    /**
     * @param enableLogs - When true, logs an initial empty visualization.
     */
    constructor(enableLogs?: boolean) {
        this.first = null;
        this.last = null;

        this.length = 0;

        this.enableLogs = !!enableLogs;
        if (this.enableLogs) {
            console.log('Initialized queue:');
            this.printVisualRepresentation()
        }
    }

    /**
     * Inserts a new node at the rear (`last`).
     *
     * Time complexity:  O(1) — prepends to the internal chain from `last`
     * Space complexity: O(1) — one new node
     *
     * @param value - Element to enqueue.
     */
    enqueue(value: T) {
        const newNode = {
            value,
            next: this.last,
        }

        this.last = newNode;
        this.length++;
    }

    /**
     * Removes the front element by relinking near the end of the chain.
     *
     * Time complexity:  O(n) — calls {@link MyQueue.getNodeAtIndex} at `length - 2` when length > 1
     * Space complexity: O(1)
     */
    dequeue() {
        if (this.length === 0) {
            console.error('The queue is empty');
            return;
        }

        if (this.length === 1) {
            this.first = null;
            this.last = null;
            this.length --;
            return;
        }

        const second = this.getNodeAtIndex(this.length - 2)!;
        second.next = null;

        this.first = second
        this.length --;
    }

    /**
     * Returns the node at the front of the queue (oldest element).
     *
     * Time complexity:  O(1) — returns `first` without walking
     * Space complexity: O(1)
     */
    peek() {
        return this.first;
    }

    /**
     * Walks from `last` (index 0) forward along `next` for `index` steps.
     *
     * Time complexity:  O(n) — up to `index` steps; `index` can be `length - 1`
     * Space complexity: O(1)
     *
     * @param index - Position in the internal newest-first ordering (0 = `last`).
     */
    getNodeAtIndex(index: number): Node<T> | null {

        if (index < 0) {
            console.error('Invalid Index');
            return null;
        }

        if (index === 0) return this.last;

        if (index > this.length - 1) return null;

        /** iteration reference of the node at position i*/ 
        let node: Node<T> | null = this.last;

        // Move through the linked list until node references index
        for(let i = 0; i < index; i++) {
            node = node!.next; // index is at most this.length so node is always defined
            // if (this.enableLogs) this.printVisualRepresentation({ [i]: 'lookup' });
        }

        // if (this.enableLogs) this.printVisualRepresentation({ [index]: 'lookup' });

        return node;
    }

    /**
     * Walks from `last` (newest) along `next` to build values, then reverses to
     * queue order: front (oldest) → rear (newest).
     *
     * Time complexity:  O(n) — one pass plus reverse
     * Space complexity: O(n) — output array
     */
    getVisualElements(): string[] {
        const newestToOldest: string[] = [];
        let currentNode: Node<T> | null = this.last;

        while (currentNode !== null) {
            newestToOldest.push(String(currentNode.value));
            currentNode = currentNode.next;
        }

        const visualElements = newestToOldest.reverse();
        visualElements.push("null");
        return visualElements;
    }

    /**
     * Prints a bracket diagram from front to last with pointer labels.
     *
     * Time complexity:  O(n) — uses {@link MyQueue.getVisualElements}
     * Space complexity: O(n) — console output proportional to n
     *
     * @param extraPointers - Optional index → label for extra markers on nodes.
     */
    printVisualRepresentation(extraPointers: Record<number, string> = {}) {
        const elements = this.getVisualElements();
        const nodeElements = elements.slice(0, Math.max(0, elements.length - 1));
        const visualLength = nodeElements.length;

        const pointers: Record<number, string> = {};
        if (visualLength === 1) {
            pointers[0] = "f/l";
        } else if (visualLength > 1) {
            pointers[0] = "f";
            pointers[visualLength - 1] = "l";
        }

        for (const [index, label] of Object.entries(extraPointers)) {
            const i = Number(index);
            pointers[i] = pointers[i] ? `${pointers[i]}/${label}` : label;
        }

        const between = " --> ";
        const line = `[ ${nodeElements.join(between)} ]`;
        console.log(line);
        console.log(buildPointerRows(nodeElements, pointers, { between }));
    }
}


runCLI({
    e: ([value], q) => q.enqueue(Number(value)),
    d: (_, q) => q.dequeue(),
}, () => {
    const queue = new MyQueue(true)
    return queue;
});

export default MyQueue;
import { executeMain, runCLI, buildPointerRows } from "../cli.js";


interface Node<T> {
    value: T | undefined;
    next: Node<T> | null
}

/**
 * Singly linked list with `head`/`tail` and index-based helpers.
 * Random access and tail-adjacent work use {@link MyLinkedList.getNodeAtIndex}, so they are
 * O(n) in the worst case; append at tail and prepend at head are O(1).
 */
class MyLinkedList<T> {
    private head: Node<T> | null;

    private tail: Node<T> | null;

    private length: number;

    private enableLogs: boolean;

    /**
     * @param enableLogs - When true, logs an initial empty visualization.
     */
    constructor(enableLogs?: boolean) {
        this.head = null;
        this.tail = null;
        this.length = 0;

        this.enableLogs = enableLogs ?? false;
        if (enableLogs) {
            console.log('Initialized linked list:');
            this.printVisualRepresentation()
        }
    }

    /**
     * Writes `value` at `index`, optionally extending the list with `undefined` nodes.
     *
     * Time complexity:  O(n) — may walk with {@link MyLinkedList.getNodeAtIndex} and/or extend with repeated {@link MyLinkedList.push}
     * Space complexity: O(1) extra — aside from new nodes stored in the list
     *
     * @param index - Logical index to set.
     * @param value - Value to store.
     */
    set(index: number, value: T) {

        if (index < 0) {
            console.error('Index out of bounds')
            return;
        }

        if(!this.length) return;

        // If the index is out of bounds, we should fill the gap with undefined nodes
        if (index > this.length-1) {
            console.warn('Index is out of bounds, feeling the gap with empty nodes')

            // Add an empty node at the end until the tail is at position index - 1)
            for(let i = this.length-1; i < index - 1; i++) {
                this.push(undefined)
                if (this.enableLogs) this.printVisualRepresentation({ [i]: 'i' });
            }
            
            // Set the last node as the new value
            const newElement = {
                value,
                next: null,
            }
            this.tail!.next = newElement; // tail has to be defined at this point because the array is not empty
            this.tail = newElement;
            this.length = index + 1;
            return;
        }

        const elementToUpdate = this.getNodeAtIndex(index)!; // at this point index is at most this.length -1, so elementToUpdate is always defined


        if (this.enableLogs) this.printVisualRepresentation({ [index]: 'found' });

        elementToUpdate.value = value;

        if (this.enableLogs) this.printVisualRepresentation({ [index]: 'updated' });
    }

    /**
     * Returns the value at `index`, or `undefined` if missing.
     *
     * Time complexity:  O(n) — {@link MyLinkedList.getNodeAtIndex}
     * Space complexity: O(1)
     *
     * @param index - Logical index to read.
     */
    get(index: number) {
        const node = this.getNodeAtIndex(index)

        return node?.value;
    }

    /**
     * Inserts `value` before the current node at `index`, or extends the list if `index` is past the end.
     *
     * Time complexity:  O(n) — traversal and/or gap filling
     * Space complexity: O(1) extra — aside from the new node
     *
     * @param index - Insert position (0 = prepend).
     * @param value - Value to insert.
     */
    insert(index: number, value: T) {

        if(!this.length) return;

        if (index < 0) {
            console.error('Index out of bounds')
            return;
        }
        
        if (index === 0) return this.prepend(value);

        // If the index is out of bounds, we should fill the gap with undefined nodes
        if (index > this.length-1) {
            console.warn('Index is out of bounds, feeling the gap with empty nodes')

            // Add an empty node at the end until the tail is at position index
            for(let i = this.length-1; i < index - 1; i++) {
                this.push(undefined)
                if (this.enableLogs) this.printVisualRepresentation({ [i]: 'i' });
            }
            
            // Set the last node as the new value
            const newElement = {
                value,
                next: null,
            }
            this.tail!.next = newElement; // tail has to be defined at this point because the array is not empty
            this.tail = newElement;
            this.length = index + 1
            return;
        }

        /** iteration reference of the node at position i*/ 
        const previousElement = this.getNodeAtIndex(index - 1)! // at this point index is at most this.length - 1, so previousElement is always defined

        if (this.enableLogs) this.printVisualRepresentation({ [index - 1]: 'previous' });

        /** The node that will be placed in i+1 */
        const nextElement = previousElement.next;

        /** The new node that will be placed at i */
        const newNode = { value, next: nextElement };

        // Update the links
        previousElement.next = newNode;
        this.length++;

        if (this.enableLogs) this.printVisualRepresentation({ [index]: 'new' });
    }

    /**
     * Removes the node at `index`.
     *
     * Time complexity:  O(n) — uses {@link MyLinkedList.getNodeAtIndex} when index > 0
     * Space complexity: O(1)
     *
     * @param index - Index of the node to remove.
     */
    delete(index: number) {

        if (index < 0 || index > this.length - 1) {
            console.error('Index out of bounds')
            return;
        }

        if (index === 0) {
            if (this.length === 1) this.tail = null;
            this.head = this.head!.next;
            this.length--;
            return;
        }

        const previousNode = this.getNodeAtIndex(index - 1)!; // index is at most this.length - 1 and at least 1, so index - 1 has to be defined

        const nextNode = previousNode.next!.next; // index is at most this.length - 1 so previousNode.next has to be defined

        previousNode.next = nextNode;

        // If the last element is deleted, the tail should be updated
        if (index === this.length-1) this.tail = previousNode;

        this.length--;
    }

    /**
     * Returns the node at `index` by walking forward from `head`.
     *
     * Time complexity:  O(n) — up to `index` steps from the head
     * Space complexity: O(1)
     *
     * @param index - Zero-based index from the head.
     */
    getNodeAtIndex(index: number): Node<T> | null {

        if (index < 0) {
            console.error('Invalid Index');
            return null;
        }

        if (index === 0) return this.head;

        if (index > this.length - 1) return null;

        /** iteration reference of the node at position i*/ 
        let node: Node<T> | null = this.head;

        // Move through the linked list until node references index
        for(let i = 0; i < index; i++) {
            node = node!.next; // index is at most this.length so node is always defined
            if (this.enableLogs) this.printVisualRepresentation({ [i]: 'lookup' });
        }

        if (this.enableLogs) this.printVisualRepresentation({ [index]: 'lookup' });

        return node;
    }

    /**
     * Appends a node after the current tail (or initializes the list).
     *
     * Time complexity:  O(1) — updates `tail` and one link
     * Space complexity: O(1) — one new node
     *
     * @param item - Value to append (may be `undefined` for sparse gaps).
     */
    push(item: T | undefined) {

        const newNode = { value: item, next: null }

        if (!this.length) {
            this.tail = newNode;
            this.head = newNode;
            this.length++;
            return;
        }

        this.tail!.next = newNode; // tail has to be defined at this point because the array is not empty
        this.tail = newNode
        this.length++;
    }

    /**
     * Inserts a new head node.
     *
     * Time complexity:  O(1)
     * Space complexity: O(1) — one new node
     *
     * @param item - Value to prepend.
     */
    prepend(item: T) {
        const newNode = { value: item, next: this.head }
        this.head = newNode;
        // If the list was empty, then the tail should be updated to the new and only node
        if (this.length === 0) this.tail = newNode
        this.length++;
    }

    /**
     * Removes the tail node.
     *
     * Time complexity:  O(n) — uses {@link MyLinkedList.getNodeAtIndex} at `length - 2` when length > 1
     * Space complexity: O(1)
     */
    pop() {

        if (this.length === 0) {
            console.warn('List is empty');
            return;
        }

        if (this.length === 1) {
            this.head = null;
            this.tail = null;
            this.length--;
            return;
        }

        const newLastElement = this.getNodeAtIndex(this.length - 2)!;
        newLastElement.next = null;
        this.tail = newLastElement;
        this.length--;
    }

    /**
     * Removes the node at `index` and appends a copy of the old tail at the end (experimental helper).
     *
     * Time complexity:  O(n) — {@link MyLinkedList.getNodeAtIndex} plus constant-time relinking
     * Space complexity: O(1) extra — one new tail node
     *
     * @param index - Index of the node to remove from the chain.
     */
    shiftLeft(index: number) {

        if (this.length === 1) {
            return;
        }

        if (this.length === 0) {
            console.error('List is empty')
            return;
        }

        if (index >= this.length - 1) {
            console.error('Index out of bounds')
            return;
        }

        if (index === 0) {
            this.head = this.head!.next; // The head has to be defined because the array is not empty at this point
            return 
        }

        const previousNode = this.getNodeAtIndex(index-1)!;

        previousNode.next = previousNode.next!.next // previousNode.next has to be defined because at this point index >= 1

        this.tail!.next = {
            value: this.tail!.value,
            next: null,
        }


    }

    /**
     * Collects values from head to tail, plus a trailing `"null"` sentinel.
     *
     * Time complexity:  O(n) — single pass
     * Space complexity: O(n) — output array
     */
    getVisualElements(): string[] {
        const visualElements: string[] = [];
        let currentNode: Node<T> | null = this.head;

        while (currentNode !== null) {
            visualElements.push(String(currentNode.value));
            currentNode = currentNode.next;
        }

        // Sentinel null to show end of chain in some contexts
        visualElements.push("null");
        return visualElements;
    }

    /**
     * Prints a singly linked diagram with head/tail labels.
     *
     * Time complexity:  O(n) — uses {@link MyLinkedList.getVisualElements}
     * Space complexity: O(n) — console output
     *
     * @param extraPointers - Optional index → label for extra markers on nodes.
     */
    printVisualRepresentation(extraPointers: Record<number, string> = {}) {
        const elements = this.getVisualElements(); // node values + "null"
        const nodeElements = elements.slice(0, Math.max(0, elements.length - 1)); // exclude sentinel
        const visualLength = nodeElements.length;

        const pointers: Record<number, string> = {};
        if (visualLength === 1) {
            pointers[0] = "h/t";
        } else if (visualLength > 1) {
            pointers[0] = "h";
            pointers[visualLength - 1] = "t";
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

executeMain('linked_list.ts', () => {
    runCLI({
        s: ([index, value], arr) => arr.set(Number(index), Number(value)),
        g: ([index], arr) => console.log('Retrieved value', arr.get(Number(index))),
        i: ([index, value], arr) => arr.insert(Number(index), Number(value)),
        pu: ([value], arr) => arr.push(Number(value)),
        po: ([], arr) => arr.pop(),
        sh: ([index], arr) => arr.shiftLeft(Number(index)),
        d: ([index], arr) => arr.delete(Number(index)),
    }, () => new MyLinkedList(true))
});

export default MyLinkedList;
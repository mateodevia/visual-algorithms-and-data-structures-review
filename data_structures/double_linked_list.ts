import { executeMain, runCLI, buildPointerRows } from "../cli.js";


interface Node<T> {
    value: T | undefined;
    next: Node<T> | null;
    previous: Node<T> | null;
} 

class MyDoubleLinkedList<T> {
    private head: Node<T> | null;

    private tail: Node<T> | null;

    private length: number;

    private enableLogs: boolean;

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
                previous: this.tail,
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

    get(index: number) {
        const node = this.getNodeAtIndex(index)

        return node?.value;
    }

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
                previous: this.tail,
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
        const newNode = { value, next: nextElement, previous: previousElement };

        // Update the links
        previousElement.next = newNode;
        this.length++;

        if (this.enableLogs) this.printVisualRepresentation({ [index]: 'new' });
    }

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

        if (nextNode) nextNode.previous = previousNode;

        previousNode.next = nextNode;
        
        // If the last element is deleted, the tail should be updated
        if (index === this.length-1) this.tail = previousNode;

        this.length--;
    }

    getNodeAtIndex(index: number): Node<T> | null {

        if (index < 0) {
            console.error('Invalid Index');
            return null;
        }

        if (index === 0) return this.head;

        if (index === this.length - 1) return this.tail;

        if (index > this.length - 1) return null;

        if (index < this.length / 2) {
            /** iteration reference of the node at position i*/ 
            let node: Node<T> | null = this.head;

            // Move through the linked list until node references index
            for(let i = 0; i < index; i++) {
                node = node!.next; // index is at most this.length so node is always defined
                if (this.enableLogs) this.printVisualRepresentation({ [i]: 'lookup' });
            }

            if (this.enableLogs) this.printVisualRepresentation({ [index]: 'lookup' });

            return node;
        } else {
            /** iteration reference of the node at position i*/ 
            let node: Node<T> | null = this.tail;

            // Move through the linked list until node references index
            for(let i = this.length - 1; i > 0; i--) {
                node = node!.previous; // index is at least 1 so node is always defined
                if (this.enableLogs) this.printVisualRepresentation({ [i]: 'lookup' });
            }

            if (this.enableLogs) this.printVisualRepresentation({ [index]: 'lookup' });

            return node;

        }
    }

    push(item: T | undefined) {

        const newNode = { value: item, next: null, previous: this.tail }

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

    prepend(item: T) {
        const newNode = { value: item, next: this.head, previous: null }
        this.head = newNode;
        // If the list was empty, then the tail should be updated to the new and only node
        if (this.length === 0) this.tail = newNode
        this.length++;
    }

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

        const newLastElement = this.tail!.previous!; // at this point tail has to be defined and its predecesor as well
        newLastElement.next = null;
        this.tail = newLastElement;
        this.length--;
    }

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
            previous: this.tail,
        }


    }

    reverse() {
        if (this.length <= 1) return this;

        /** Reference to iterate over the array, after the loop it will end up being the tail */
        let current = this.head!; // At this point head is defined

        while(current.next !== null) {
            const temp = current.next!;

            // Invert the reference of each node
            current.next = current.previous;
            current.previous = temp;
            current = temp;
        }
        // Update tail references
        current.next = current.previous;
        current.previous = null;
        

        // Update head and tail references
        this.head = this.tail;
        this.tail = current;
    }

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

        const between = " <-> ";
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
        r: ([], arr) => arr.reverse(),
    }, () => new MyDoubleLinkedList(true))
});

export default MyDoubleLinkedList;
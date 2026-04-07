import { executeMain, runCLI, buildPointerRows } from "../cli.js";

interface Node<T> {
    value: T | undefined;
    next: Node<T> | null
}

/**
 * A singly linked stack with pointers to the top (and bottom for visualization).
 * Core operations are O(1); walking the chain for visuals is O(n).
 */
class MyStack<T> {
    private top: Node<T> | null;

    private bottom: Node<T> | null;

    private length: number;

    private enableLogs: boolean;

    /**
     * @param enableLogs - When true, logs an initial empty visualization.
     */
    constructor(enableLogs?: boolean) {
        this.top = null;
        this.bottom = null;
        this.length = 0;

        this.enableLogs = enableLogs ?? false;
        if (this.enableLogs) {
            console.log('Initialized stack:');
            this.printVisualRepresentation()
        }
    }

    /**
     * Pushes a value onto the top of the stack.
     *
     * Time complexity:  O(1) — updates `top` and optionally `bottom`
     * Space complexity: O(1) — one new node
     *
     * @param value - Element to push.
     */
    push(value: T) {
        if (this.length === 0) {
            this.top = {
                value,
                next: null,
            };
            this.bottom = this.top;
            this.length++;
            return;
        }

        const newNode = {
            value,
            next: this.top,
        }
        this.top = newNode;
        this.length++;
    }

    /**
     * Removes and returns the top element.
     *
     * Time complexity:  O(1) — relinks `top`
     * Space complexity: O(1)
     */
    pop(): T | undefined {
        if (this.length === 0) {
            console.error('The stack is empty');
            return;
        }
        const response = this.top!
        this.top = this.top!.next;
        this.length --;
        return response.value;
    }

    /**
     * Returns the top value without removing it.
     *
     * Time complexity:  O(1)
     * Space complexity: O(1)
     */
    peek () {
        return this.top?.value;
    }

    /**
     * Returns the number of elements.
     *
     * Time complexity:  O(1)
     * Space complexity: O(1)
     */
    getLength () {
        return this.length;
    }

    /**
     * Collects node values from top to bottom, plus a trailing `"null"` sentinel.
     *
     * Time complexity:  O(n) — walks the whole list
     * Space complexity: O(n) — output array
     */
    getVisualElements(): string[] {
        const visualElements: string[] = [];
        let currentNode: Node<T> | null = this.top;

        while (currentNode !== null) {
            visualElements.push(String(currentNode.value));
            currentNode = currentNode.next;
        }

        visualElements.push("null");
        return visualElements;
    }

    /**
     * Prints a bracket diagram and pointer labels (e.g. top/bottom).
     *
     * Time complexity:  O(n) — uses {@link MyStack.getVisualElements}
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
            pointers[0] = "t/b";
        } else if (visualLength > 1) {
            pointers[0] = "t";
            pointers[visualLength - 1] = "b";
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

executeMain('stack.ts', () => {
    runCLI({
        pu: ([value], arr) => arr.push(Number(value)),
        po: ([], arr) => arr.pop(),
        pe: ([], arr) => console.log('Peeking the stack', arr.peek()),
    }, () => new MyStack(true))
});

export default MyStack;
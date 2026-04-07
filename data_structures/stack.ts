import { executeMain, runCLI, buildPointerRows } from "../cli.js";

interface Node<T> {
    value: T | undefined;
    next: Node<T> | null
} 

class MyStack<T> {
    private top: Node<T> | null;

    private bottom: Node<T> | null;

    private length: number;

    private enableLogs: boolean;

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

    peek () {
        return this.top?.value;
    }

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
import { executeMain, runCLI, buildPointerRows } from "../../cli.js";
import MyStack from '../../data_structures/stack.js'


class ChallengeStack<T> {

    private mainStack: MyStack<T>;

    private auxiliaryStack: MyStack<T>;

    private enableLogs: boolean;

    private length: number;

    constructor(enableLogs?: boolean) {
        this.mainStack = new MyStack(false);
        this.auxiliaryStack = new MyStack(false);

        this.length = 0;
        this.enableLogs = enableLogs ?? false;
        if (this.enableLogs) {
            console.log('Initialized queue (MAIN + AUX stacks):');
            this.printVisualRepresentation()
        }
    }
    
    enqueue(value: T) {
        this.mainStack.push(value);
        this.length++;
    }

    dequeue() {
        if (this.length === 0) {
            console.error('Queue is empty');
            return;
        }

        if (this.auxiliaryStack.getLength()) {
            const response = this.auxiliaryStack.pop();
            this.length--;
            return response;
        }

        this.fillAuxStack();

        this.length--;
        return this.auxiliaryStack.pop();
    }

    peek () {
        if (this.length === 0) {
            console.info('Queue is empty');
            return;
        }

        if (this.auxiliaryStack.getLength()) {
            return this.auxiliaryStack.peek();
        }

        this.fillAuxStack();

        return this.auxiliaryStack.peek();
    }

    fillAuxStack () {
        for(let i = 0; i < this.length; i++) {
            this.auxiliaryStack.push(this.mainStack.pop()!);
            if (this.enableLogs) this.printStackBlock("Filling aux", this.auxiliaryStack);
        }
    }

    getVisualElements(): string[] {
        const main = this.mainStack.getVisualElements();
        const aux = this.auxiliaryStack.getVisualElements();
        return ["MAIN", ...main, "AUX", ...aux];
    }

    printVisualRepresentation(extraPointers: Record<number, string> = {}) {
        console.log("");
        this.printStackBlock("MAIN STACK", this.mainStack, extraPointers);
        this.printStackBlock("AUX STACK", this.auxiliaryStack, extraPointers);
    }

    /**
     * Same layout as {@link MyStack.printVisualRepresentation} so diagrams match the stack lesson.
     */
    private printStackBlock(
        title: string,
        stack: MyStack<T>,
        extraPointers: Record<number, string> = {},
    ): void {
        console.log(`--- ${title} ---`);
        const elements = stack.getVisualElements();
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

executeMain('1_stacks_as_queue.ts', () => {
    runCLI({
        e: ([value], arr) => arr.enqueue(Number(value)),
        d: ([], arr) => console.log('Dequeue element:', arr.dequeue()),
        pe: ([], arr) => console.log('Peeked the queue:', arr.peek()),
    }, () => new ChallengeStack(true))
});

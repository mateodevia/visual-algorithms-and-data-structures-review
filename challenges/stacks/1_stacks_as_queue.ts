import { executeMain, runCLI, buildPointerRows } from "../../cli.js";
import MyStack from '../../data_structures/stack.js'

/**
 * Queue behavior using two stacks: incoming pushes go to `mainStack`; dequeue/peek
 * drain into `auxiliaryStack` when needed. Enqueue is O(1); dequeue is amortized O(1),
 * worst case O(n) when the main stack must be reversed into the auxiliary stack.
 */
class ChallengeStack<T> {

    private mainStack: MyStack<T>;

    private auxiliaryStack: MyStack<T>;

    private enableLogs: boolean;

    private length: number;

    /**
     * @param enableLogs - When true, logs initial state and optional steps while filling aux.
     */
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

    /**
     * Enqueues by pushing onto the main stack.
     *
     * Time complexity:  O(1) — one stack push
     * Space complexity: O(1) — aside from the stored element
     *
     * @param value - Element to enqueue.
     */
    enqueue(value: T) {
        this.mainStack.push(value);
        this.length++;
    }

    /**
     * Dequeues from the auxiliary stack when non-empty; otherwise transfers the main stack into it.
     *
     * Time complexity:
     *   - Amortized: O(1) — occasional O(n) reversal of the main stack
     *   - Worst case:  O(n) — when `fillAuxStack` runs
     * Space complexity: O(1) — aside from the two stacks holding elements
     */
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

    /**
     * Returns the front value without removing it (uses auxiliary stack or fills it first).
     *
     * Time complexity:
     *   - Amortized: O(1)
     *   - Worst case:  O(n) — when `fillAuxStack` runs
     * Space complexity: O(1)
     */
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

    /**
     * Pops every element from `mainStack` and pushes it onto `auxiliaryStack` (reverses order).
     *
     * Time complexity:  O(n) — one pop and one push per element currently in main
     * Space complexity: O(1) — reuses existing nodes via stack operations
     */
    fillAuxStack () {
        for(let i = 0; i < this.length; i++) {
            this.auxiliaryStack.push(this.mainStack.pop()!);
            if (this.enableLogs) this.printStackBlock("Filling aux", this.auxiliaryStack);
        }
    }

    /**
     * Concatenates MAIN and AUX stack visual strings (see {@link MyStack.getVisualElements}).
     *
     * Time complexity:  O(n) — linear in total elements across both stacks
     * Space complexity: O(n) — output array
     */
    getVisualElements(): string[] {
        const main = this.mainStack.getVisualElements();
        const aux = this.auxiliaryStack.getVisualElements();
        return ["MAIN", ...main, "AUX", ...aux];
    }

    /**
     * Prints both stack diagrams.
     *
     * Time complexity:  O(n) — proportional to elements in both stacks
     * Space complexity: O(n) — console output
     *
     * @param extraPointers - Passed through to each stack block’s pointer labels.
     */
    printVisualRepresentation(extraPointers: Record<number, string> = {}) {
        console.log("");
        this.printStackBlock("MAIN STACK", this.mainStack, extraPointers);
        this.printStackBlock("AUX STACK", this.auxiliaryStack, extraPointers);
    }

    /**
     * Same layout as {@link MyStack.printVisualRepresentation} so diagrams match the stack lesson.
     *
     * Time complexity:  O(n) for that stack’s size
     * Space complexity: O(n) — console output
     *
     * @param title - Section heading printed above the diagram.
     * @param stack - Stack to render.
     * @param extraPointers - Optional index → label for extra markers on nodes.
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

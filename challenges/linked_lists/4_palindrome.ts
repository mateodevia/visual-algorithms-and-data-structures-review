import { buildPointerRows, executeMain } from "../../cli.js";
import MyLinkedList, { type Node } from "../../data_structures/linked_list.js";

/** Index of `target` in the chain starting at `start`, by reference (not value). */
const indexOfNodeFrom = <T>(start: Node<T> | null, target: Node<T> | null): number => {
    if (start === null || target === null) return -1;
    let current: Node<T> | null = start;
    let i = 0;
    while (current !== null) {
        if (current === target) return i;
        current = current.next;
        i++;
    }
    return -1;
};

const printMiddleFastStep = <T>(list: MyLinkedList<T>, head: Node<T> | null, middle: Node<T> | null, fast: Node<T> | null) => {
    const mIdx = indexOfNodeFrom(head, middle);
    const fIdx = indexOfNodeFrom(head, fast);
    const pointers: Record<number, string> =
        mIdx >= 0 && fIdx >= 0 && mIdx === fIdx
            ? { [mIdx]: "m/f" }
            : { ...(mIdx >= 0 ? { [mIdx]: "m" } : {}), ...(fIdx >= 0 ? { [fIdx]: "f" } : {}) };
    list.printVisualRepresentation(pointers);
};

const SLOT_SEP = " --> ";

/** Values from `head` along `.next` up to but not including `secondHalfStart` (first node of second half). */
const collectFirstHalfValuesBefore = <T>(head: Node<T> | null, secondHalfStart: Node<T> | null): string[] => {
    const out: string[] = [];
    for (let n = head; n !== null && n !== secondHalfStart; n = n.next) {
        out.push(String(n.value));
    }
    return out;
};

const chainLength = <T>(start: Node<T> | null): number => {
    let c = 0;
    for (let n = start; n !== null; n = n.next) c++;
    return c;
};

/** Up to `maxCount` nodes from `start` along `.next`. */
const collectChainValueStrings = <T>(start: Node<T> | null, maxCount?: number): string[] => {
    const out: string[] = [];
    let n = start;
    let i = 0;
    while (n !== null && (maxCount === undefined || i < maxCount)) {
        out.push(String(n.value));
        n = n.next;
        i++;
    }
    return out;
};

const printCompareHalvesTwoLists = <T>(
    head: Node<T> | null,
    secondHalfHead: Node<T> | null,
    compare1: Node<T> | null,
    compare2: Node<T> | null,
    firstHalfValues: string[],
    secondHalfValues: string[],
) => {
    const i1 = indexOfNodeFrom(head, compare1);
    const i2 = indexOfNodeFrom(secondHalfHead, compare2);
    console.log("  first half (forward from head):");
    printStaticSlotDiagram(firstHalfValues, i1 >= 0 ? { [i1]: "c1" } : {});
    console.log("  second half (follow .next from reversed head, outer → inner):");
    printStaticSlotDiagram(secondHalfValues, i2 >= 0 ? { [i2]: "c2" } : {});
};

const printStaticSlotDiagram = (originalValues: string[], pointers: Record<number, string>) => {
    const inner = originalValues.join(SLOT_SEP);
    console.log(`[ ${inner} ]`);
    console.log(buildPointerRows(originalValues, pointers, { between: SLOT_SEP }));
};

/** Between reversed (left) and still-forward (right) segments in the reverse-phase bracket line. */
const REVERSE_PHASE_INNER_SEP = " ,  ";

const formatOriginalListBracketLine = (values: string[]): string => {
    if (values.length === 0) return `[ ]`;
    if (values.length <= 12) return `[ ${values.join(SLOT_SEP)} ]`;
    const head = values.slice(0, 6).join(SLOT_SEP);
    const tail = values.slice(-4).join(SLOT_SEP);
    return `[ ${head} --> ... --> ${tail} ]`;
};

/**
 * Left bracket segment: what `p.next` was rewired to (`pp`) and the reversed chain from `p`
 * along `.next`, read with `<--` (toward the first half).
 */
const buildLeftReverseBracketSegment = <T>(pp: Node<T> | null, p: Node<T> | null): string => {
    if (p === null) return "null";
    const nodes: Node<T>[] = [];
    let n: Node<T> | null = p;
    while (n !== null) {
        nodes.push(n);
        n = n.next;
    }
    const vals = nodes.map((x) => String(x.value));
    const revStr = vals.slice().reverse().join(" <-- ");
    if (pp === null) return `null <-- ${revStr}`;
    if (nodes.length >= 2 && nodes[1] === pp) return revStr;
    return `${String(pp.value)} <-- ${revStr}`;
};

const printCaretLabelRowUnder = (fullLine: string, marks: readonly { col: number; label: string }[]) => {
    const w = fullLine.length;
    const arrows = Array.from({ length: w }, () => " ");
    const labels = Array.from({ length: w }, () => " ");
    for (const { col, label } of marks) {
        if (col < 0 || col >= w) continue;
        arrows[col] = "^";
        for (let i = 0; i < label.length && col + i < w; i++) {
            const ch = label[i]!;
            const at = col + i;
            if (labels[at] === " ") labels[at] = ch;
            else if (labels[at] !== ch) labels[at] = "/";
        }
    }
    console.log(arrows.join(""));
    console.log(labels.join(""));
};

const printReversePhaseBracketView = <T>(
    /** First half only (same order as along `.next` from head); second half may still be linked in memory. */
    firstHalfLineValues: string[],
    pp: Node<T> | null,
    p: Node<T> | null,
    c: Node<T> | null,
) => {
    const origLine = formatOriginalListBracketLine(firstHalfLineValues);
    const leftSeg = buildLeftReverseBracketSegment(pp, p);
    const rightSeg = stringifyForward(c);
    const inner = leftSeg + REVERSE_PHASE_INNER_SEP + rightSeg;
    const workLine = `[ ${inner} ]`;

    console.log(origLine);
    console.log(workLine);

    const sep = REVERSE_PHASE_INNER_SEP;
    const base = 2;

    const idxPp =
        pp === null ? leftSeg.indexOf("null") : leftSeg.indexOf(String(pp.value));
    const lastTok = leftSeg.split(" <-- ").pop() ?? "";
    const idxP = lastTok.length ? leftSeg.lastIndexOf(lastTok) : 0;
    const firstRight = rightSeg.split(" --> ")[0] ?? rightSeg;
    const idxC = leftSeg.length + sep.length + (firstRight.length ? rightSeg.indexOf(firstRight) : 0);

    printCaretLabelRowUnder(workLine, [
        { col: base + Math.max(0, idxPp), label: "pp" },
        { col: base + Math.max(0, idxP), label: "p" },
        { col: base + Math.max(0, idxC), label: "c" },
    ]);
};

const stringifyForward = <T>(start: Node<T> | null): string => {
    const parts: string[] = [];
    let n = start;
    while (n !== null) {
        parts.push(String(n.value));
        n = n.next;
    }
    return parts.length ? parts.join(SLOT_SEP) : "null";
};

/**
 * Returns whether a singly linked list of numbers reads the same forward and backward.
 *
 * Time complexity:  O(n)
 * Space complexity: O(1) — pointer rewiring only; debug logs may allocate strings
 *
 * @param head - Head of the list (or null).
 * @param list - The linked list instance (just for visualization).
 */
export const isPalindrome = (head: Node<number> | null, list: MyLinkedList<number>): boolean => {
    if (!head) return false;

    if (head.next === null) return true;

    console.log("");
    console.log("--- Find middle (slow = middle, fast moves two steps) ---");
    console.log("");

    // Find the middle
    let fast: Node<number> | null = head;
    let middle: Node<number> | null = head;
    while (fast) {
        printMiddleFastStep(list, head, middle, fast);

        middle = middle!.next;
        fast = fast.next?.next ?? null;
    }

    console.log("");
    console.log("--- Reverse second half (each step points .next back toward the first half) ---");
    console.log("");

    const firstHalfLineValues = collectFirstHalfValuesBefore(head, middle);

    // Traverse the second half
    let current: Node<number> | null = middle;
    let previous: Node<number> | null = null;
    let previousPrevious: Node<number> | null = null;
    while (current) {
        const at = current;
        const rest = at.next;
        const oldNextLabel = rest !== null ? String(rest.value) : "null";
        const newNextLabel = previous !== null ? String(previous.value) : "null";

        previousPrevious = previous;
        previous = at;
        current = rest;
        previous.next = previousPrevious;

        console.log(`[Rewire] ${String(at.value)}.next: ${oldNextLabel} -> ${newNextLabel}`);
        console.log("");
        printReversePhaseBracketView(firstHalfLineValues, previousPrevious, previous, current);
        console.log("");
    }

    console.log("--- Compare halves (c1 from head, c2 along reversed second half) ---");
    console.log("");

    const secondHalfHead = previous;
    const compareHalfLen = chainLength(secondHalfHead);
    const firstHalfValueStrings = collectChainValueStrings(head, compareHalfLen);
    const secondHalfValueStrings = collectChainValueStrings(secondHalfHead);

    // Compare both halves
    let compare1: Node<number> | null = head;
    let compare2: Node<number> | null = secondHalfHead;
    let matches = true;

    while (compare2) {
        const ok = compare1?.value === compare2.value;
        console.log(`[Compare] ${String(compare1?.value)} vs ${String(compare2.value)} -> ${ok ? "match" : "mismatch"}`);
        printCompareHalvesTwoLists(
            head,
            secondHalfHead,
            compare1,
            compare2,
            firstHalfValueStrings,
            secondHalfValueStrings,
        );
        console.log("");

        if (!ok) {
            matches = false;
        }
        compare1 = compare1?.next ?? null;
        compare2 = compare2.next;
    }

    return matches;
};

executeMain("4_palindrome.ts", () => {
    const list = new MyLinkedList<number>();
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);
    list.push(5);
    list.push(4);
    list.push(3);
    list.push(2);
    list.push(1);

    console.log("List:");
    list.printVisualRepresentation();

    console.log("");
    console.log("isPalindrome:", isPalindrome(list.getNodeAtIndex(0), list));
});

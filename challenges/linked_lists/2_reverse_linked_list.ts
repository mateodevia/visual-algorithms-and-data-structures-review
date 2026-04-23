import { executeMain } from "../../cli.js";
import MyLinkedList, { type Node } from "../../data_structures/linked_list.js";

/**
 * Reverses a singly linked list in-place.
 *
 * Time complexity:  O(n) — each node is visited and relinked once
 * Space complexity: O(1)
 *
 * @param head - Head node of the linked list.
 * @returns New head of the reversed list.
 */
export const reverseList = <T>(head: Node<T> | null): Node<T> | null => {
    if (head === null) return head;

    let current: Node<T> = head;
    let previous: Node<T> | null = null;

    const toArray = (node: Node<T> | null): string[] => {
        const values: string[] = [];
        let currentNode = node;
        while (currentNode) {
            values.push(String(currentNode.value));
            currentNode = currentNode.next;
        }
        return values;
    };

    const printStateChains = (backwardHead: Node<T> | null, forwardHead: Node<T> | null) => {
        const backwardValues = toArray(backwardHead);
        const forwardValues = toArray(forwardHead);
        const backward = backwardValues.length ? backwardValues.join(" <- ") : "null";
        const forward = forwardValues.length ? forwardValues.join(" -> ") : "null";

        console.log(`backward: ${backward}`);
        console.log(`forward:  ${forward}`);
    };

    console.log("");
    console.log("Reversing links node by node");
    console.log("");
    printStateChains(previous, current);

    while (current.next) {
        const temp = current.next;

        const oldNext = current.next;
        console.log("");
        current.next = previous;
        console.log(
            `[Rewire] ${String(current.value)}.next: ${String(oldNext?.value ?? null)} -> ${
                previous ? String(previous.value) : "null"
            }`,
        );

        previous = current;
        current = temp;
        printStateChains(previous, current);
    }

    const oldNextLabel = "null";
    console.log("");
    current.next = previous;
    console.log(
        `[Final rewire] ${String(current.value)}.next: ${oldNextLabel} -> ${
            previous ? String(previous.value) : "null"
        }`,
    );
    printStateChains(current, null);
    return current;
};

executeMain("2_reverse_linked_list.ts", () => {
    const list = new MyLinkedList<string>();
    list.push("A");
    list.push("B");
    list.push("C");
    list.push("D");
    list.push("E");

    console.log("Before reverse:");
    list.printVisualRepresentation();

    const reversedHead = reverseList(list.getNodeAtIndex(0));

    const reversedValues: string[] = [];
    let current = reversedHead;
    while (current) {
        reversedValues.push(String(current.value));
        current = current.next;
    }

    console.log("");
    console.log("After reverse:");
    console.log(reversedValues.join(" -> "));
});
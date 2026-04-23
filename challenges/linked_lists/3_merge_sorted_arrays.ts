import { executeMain } from "../../cli.js";
import MyLinkedList, { type Node } from "../../data_structures/linked_list.js";

/**
 * Merges two sorted singly linked lists into one sorted list.
 *
 * Time complexity:  O(n + m) — each node from both lists is attached at most once
 * Space complexity: O(1) — only pointer rewiring; debug logs build temporary strings
 *
 * @param list1 - Head of the first sorted list (or null).
 * @param list2 - Head of the second sorted list (or null).
 * @returns Head of the merged sorted list.
 */
export const mergeTwoLists = (
    list1: Node<number> | null,
    list2: Node<number> | null,
): Node<number> | null => {

    if (!list1 && !list2) return null;

    if (!list1) return list2;

    if (!list2) return list1;

    let curr1: Node<number> | null = list1;
    let curr2: Node<number> | null = list2;
    let newHead: Node<number> | null = null;
    let curr3: Node<number> | null = null;

    console.log("");
    console.log("Merge two sorted lists — pick smaller head first");
    console.log("");
    console.log(`list1 head: ${list1.value}`);
    console.log(`list2 head: ${list2.value}`);
    console.log("");

    if (curr1!.value! < curr2!.value!) {
        newHead = curr1;
        curr3 = curr1;
        curr1 = curr1!.next;
        console.log(`Pick list1 node ${String(newHead.value)} as the head (smaller or equal than ${String(list2.value)})`);
    } else {
        newHead = curr2;
        curr3 = curr2;
        curr2 = curr2!.next;
        console.log(`Pick list2 node ${String(newHead.value)} as the head (smaller than ${String(list1.value)})`);
    }

    console.log("")
    console.log(`remaining1: ${stringifyFromNode(curr1)} | remaining2: ${stringifyFromNode(curr2)}`);
    console.log("");

    while (curr1 && curr2) {
        const v1 = curr1.value!;
        const v2 = curr2.value!;
        if (v1 < v2) {
            console.log(`[Pick] ${v1} < ${v2} → append ${v1} to the merged list`);
            curr3!.next = curr1;
            curr3 = curr1;
            curr1 = curr1.next;
        } else {
            console.log(`[Pick] ${v1} >= ${v2} → append ${v2} to the merged list`);
            curr3!.next = curr2;
            curr3 = curr2;
            curr2 = curr2.next;
        }
        console.log(`        remaining1: ${stringifyFromNode(curr1)} | remaining2: ${stringifyFromNode(curr2)}`);
        console.log("");
    }

    if (curr1) {
        console.log(`[Drain] attach rest of list1: ${stringifyFromNode(curr1)}`);
        curr3!.next = curr1;
    }
    if (curr2) {
        console.log(`[Drain] attach rest of list2: ${stringifyFromNode(curr2)}`);
        curr3!.next = curr2;
    }

    console.log(`[Done] merged: ${stringifyFromNode(newHead)}`);
    return newHead;
};

const stringifyFromNode = (start: Node<number> | null): string => {
    const parts: string[] = [];
    let n = start;
    while (n) {
        parts.push(String(n.value));
        n = n.next;
    }
    return parts.length ? parts.join(" -> ") : "null";
};

executeMain("3_merge_sorted_arrays.ts", () => {
    const a = new MyLinkedList<number>();
    a.push(1);
    a.push(2);
    a.push(4);

    const b = new MyLinkedList<number>();
    b.push(1);
    b.push(3);
    b.push(4);

    console.log("Before merge:");
    console.log("list1:");
    a.printVisualRepresentation();
    console.log("list2:");
    b.printVisualRepresentation();

    const merged = mergeTwoLists(a.getNodeAtIndex(0), b.getNodeAtIndex(0));

    console.log("After merge (from returned head):");
    const parts: string[] = [];
    let n = merged;
    while (n) {
        parts.push(String(n.value));
        n = n.next;
    }
    console.log(parts.join(" -> "));
});

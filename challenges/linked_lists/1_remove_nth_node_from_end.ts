import { executeMain } from "../../cli.js";
import MyLinkedList, { type Node } from "../../data_structures/linked_list.js";

/**
 * Removes the n-th node from the end of a singly linked list.
 *
 * Time complexity:  O(n) — one pass to compute size and one partial pass to unlink the target
 * Space complexity: O(n) — temporary array/string storage used for debug visualization
 *
 * @param head - Head node of the linked list.
 * @param n - Position from the end (1-based).
 * @returns The head of the updated list (or null when list becomes empty).
 */
export const removeNthFromEnd = <T>(head: Node<T> | null, n: number): Node<T> | null => {

    if (!head) return null;

    let current: Node<T> = head;
    if (head.next === null) return null;
    let size = 1;
    console.log('')
    console.log('Looping through the whole list to find out size')
    console.log('')
    console.log(`Scanning node: ${current.value} | size=${size}`);

    while (current.next) {
        current = current.next;
        size++;
        console.log(`Scanning node: ${current.value} | size=${size}`);
    }

    current = head;
    const targetIndexFromEnd = size - n;
    console.log('')
    console.log(`Computed node index to remove as size - n: ${size} - ${n} = ${targetIndexFromEnd}`);

    if (n === size) {
        console.log('')
        console.log(`n is the length of the list, so head (${String(head.value)}) should be removed`);
        return head.next;
    }

    
    console.log('')
    console.log(`Moving to the previous node before size - n (${targetIndexFromEnd})`)
    console.log('')
    console.log(`First node: ${current.value}`);
    for (let i = 0; i < size - n - 1; i++) {
        current = current.next!;
        console.log(`Moving to node: ${current.value}`);
    }
    console.log('')
    console.log(`Node to remove: ${String(current.next?.value)}`);
    console.log('')
    console.log(`Upating ${current.value} next link to`, current.next?.next?.value ?? null)
    current.next = current.next?.next ?? null;

    return head;
};

executeMain("1_remove_nth_node_from_end.ts", () => {
    const list = new MyLinkedList<string>();
    list.push('A');
    list.push('B');
    list.push('C');
    list.push('D');
    list.push('E');

    console.log("Before removal:");
    list.printVisualRepresentation();

    removeNthFromEnd(list.getNodeAtIndex(0), 2);

    console.log("After removal:");
    list.printVisualRepresentation();
});
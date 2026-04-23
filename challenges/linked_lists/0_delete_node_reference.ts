import { executeMain } from "../../cli.js";
import MyLinkedList, { type Node } from "../../data_structures/linked_list.js";

/**
 * Deletes a node from a singly linked list when only that node reference is provided.
 * Assumes `node` is not the tail node.
 *
 * Time complexity:  O(k) — each debug visualization walks from `node` to the end of the chain
 * Space complexity: O(k) — temporary string/array storage used to build printed snapshots
 */
export const deleteNode = <T>(node: Node<T>): void => {

    console.log('')
    console.log(`Before update: ${stringifyFromNode(node)}`);

    node.value = node.next!.value;
    console.log('')
    console.log(`After copying next value: ${stringifyFromNode(node)}`);

    node.next = node.next!.next;
    console.log('')
    console.log(`After bypassing next node: ${stringifyFromNode(node)}`);
    console.log('')
};

const stringifyFromNode = <T>(start: Node<T> | null): string => {
    const values: string[] = [];
    let current = start;

    while (current) {
        values.push(String(current.value));
        current = current.next;
    }

    return values.join(" -> ");
};

executeMain("0_delete_node_reference.ts", () => {
    const list = new MyLinkedList<number>();
    list.push(4);
    list.push(5);
    list.push(1);
    list.push(9);

    console.log("List before deletion:");
    list.printVisualRepresentation();


    const nodeToDelete = list.getNodeAtIndex(1);
    if (!nodeToDelete) throw new Error("Node to delete was not found");

    deleteNode(nodeToDelete);

    console.log("List after deletion:");
    list.printVisualRepresentation();
});
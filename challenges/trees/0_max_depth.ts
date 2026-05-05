/**
 * Maximum depth of a binary tree (LeetCode 104).
 * Use {@link Node} from this repo — fields are `value`, `left`, `right` (not `val`).
 */

import { depthFirstSearch, DFSOrder } from "../../algorithms/searching/depth_first_search.js";
import { executeMain } from "../../cli.js";
import MyBinarySearchTree, { Node } from "../../data_structures/binary_search_tree.js";

export const maxDepth = function (tree: MyBinarySearchTree<number>): number {

    const preOrder = (node: Node<number>, depth: number) => {
        let leftDepth = depth;
        let rightDepth = depth;

        if (node.left) {
            leftDepth = preOrder(node.left, depth + 1);
        }

        if (node.right) {
            rightDepth = preOrder(node.right, depth + 1);
        }
        const res = Math.max(leftDepth, rightDepth);

        console.log(`Calculated depth for node ${node.value}: ${res}`)

        return res;
    };

    return depthFirstSearch(tree, (node: Node<number>, depth) => {
        let leftDepth = depth;
        let rightDepth = depth;

        if (node.left) {
            leftDepth = preOrder(node.left, depth + 1);
        }

        if (node.right) {
            rightDepth = preOrder(node.right, depth + 1);
        }
        const res = Math.max(leftDepth, rightDepth);

        console.log(`Calculated depth for node ${node.value}: ${res}`)

        return res;
    }, DFSOrder.PRE_ORDER, 1)!;
};

executeMain("0_max_depth.ts", () => {
    const tree = new MyBinarySearchTree<number>(true);
    tree.insert(9);
    tree.insert(4);
    tree.insert(6);
    tree.insert(20);
    tree.insert(170);
    tree.insert(15);
    tree.insert(1);
    tree.insert(10);
    tree.printVisualRepresentation();
    console.log();

    const res = maxDepth(tree);
    console.log();
    console.log('Max depth was: ', res);
});

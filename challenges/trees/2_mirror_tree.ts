/**
 * Symmetric binary tree (LeetCode 101).
 * Use {@link Node} from this repo — fields are `value`, `left`, `right` (not `val`).
 */

import { executeMain } from "../../cli.js";
import MyBinarySearchTree, { Node } from "../../data_structures/binary_search_tree.js";


// TODO Change this to a balanced tree
export const isSymmetric = function (tree: MyBinarySearchTree<number>): boolean {
    const root = tree.getRoot();

    if (root === null) return false;

    const { left, right } = root;

    return isMirror(left, right);
};

const isMirror = (root1: Node<number> | null, root2: Node<number> | null): boolean => {
    if (root1 === null && root2 === null) return true;

    console.log(`Comparing sub tree ${root1?.value} vs  sub tree ${root2?.value}`);

    return (
        root1?.value === root2?.value &&
        isMirror(root1?.left ?? null, root2?.right ?? null) &&
        isMirror(root1?.right ?? null, root2?.left ?? null)
    );
};

executeMain("2_mirror_tree.ts", () => {
    const tree = new MyBinarySearchTree<number>(true);
    tree.insert(1);
    tree.insert(2);
    tree.insert(2);
    tree.printVisualRepresentation();
    console.log();

    console.log("isSymmetric:", isSymmetric(tree));
});

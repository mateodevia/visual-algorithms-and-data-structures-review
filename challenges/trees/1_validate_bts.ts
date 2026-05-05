import { depthFirstSearch, DFSOrder } from "../../algorithms/searching/depth_first_search.js";
import { executeMain, formatBinaryTreeAsciiLines, type BinaryTreeNodeLike } from "../../cli.js";
import MyBinarySearchTree, { Node } from "../../data_structures/binary_search_tree.js";

export const isValidBST = function (tree: MyBinarySearchTree<number>): boolean {
    let res = true;
    let previous: Node<number> | undefined;

    depthFirstSearch(tree, (node: Node<number>) => {
        console.log(`Comparing ${node.value} with ${previous?.value}`)
        if (node.value <= (previous?.value ?? Number.NEGATIVE_INFINITY)) res = false;
        previous = node;
    }, DFSOrder.IN_ORDER)
    return res;
};

executeMain("1_validate_bts.ts", () => {
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

    
    console.log("isValidBST:", isValidBST(tree));
});
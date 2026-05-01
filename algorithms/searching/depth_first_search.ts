import { executeMain } from "../../cli.js";
import MyBinarySearchTree, { Node } from "../../data_structures/binary_search_tree.js";

const moveInOrder = <T>(node: Node<T>, nodeAnalyzer: (node: Node<T>) => boolean) => {
    if (node.left) {
        moveInOrder(node.left, nodeAnalyzer);
    }
    nodeAnalyzer(node);
    if (node.right) {
        moveInOrder(node.right, nodeAnalyzer);
    }
}

const movePreOrder = <T>(node: Node<T>, nodeAnalyzer: (node: Node<T>) => boolean) => {
    nodeAnalyzer(node);
    if (node.left) {
        movePreOrder(node.left, nodeAnalyzer);
    }
    if (node.right) {
        movePreOrder(node.right, nodeAnalyzer);
    }
}


const movePostOrder = <T>(node: Node<T>, nodeAnalyzer: (node: Node<T>) => boolean) => {
    if (node.left) {
        movePostOrder(node.left, nodeAnalyzer);
    }
    if (node.right) {
        movePostOrder(node.right, nodeAnalyzer);
    }
    nodeAnalyzer(node);
}

export const enum DFSOrder {
    PRE_ORDER = 'PRE_ORDER',
    IN_ORDER = 'IN_ORDER',
    POST_ORDER = 'POST_ORDER'
}

const orderFunctionMapper: Record<DFSOrder, <T>(node: Node<T>, nodeAnalyzer: (node: Node<T>) => boolean) => void> = {
    [DFSOrder.PRE_ORDER]: movePreOrder,
    [DFSOrder.IN_ORDER]: moveInOrder,
    [DFSOrder.POST_ORDER]: movePostOrder,
}

const depthFirstSearch = <T>(tree: MyBinarySearchTree<T>, nodeAnalyzer: (node: Node<T>) => boolean, order: DFSOrder = DFSOrder.IN_ORDER) => {
    const root = tree.getRoot();
    if (!root) return;
    const orderFunction = orderFunctionMapper[order];
    orderFunction(root, nodeAnalyzer);
}

// TODO Make it graph compliant


executeMain("depth_first_search.ts", () => {
    const tree = new MyBinarySearchTree<number>(true);
    tree.insert(9);
    tree.insert(4);
    tree.insert(6);
    tree.insert(20);
    tree.insert(170);
    tree.insert(15);
    tree.insert(1);
    tree.printVisualRepresentation()

    console.log();

    depthFirstSearch(tree, (node: Node<number>) => {
        console.log('Exploring', node.value);
        return false;
    }, DFSOrder.PRE_ORDER)
});

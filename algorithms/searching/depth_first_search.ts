import { executeMain } from "../../cli.js";
import MyBinarySearchTree, { Node } from "../../data_structures/binary_search_tree.js";

const moveInOrder = <T>(node: Node<T>, nodeAnalyzer: (node: Node<T>, ...args: any[]) => any, ...args: any[]) => {
    if (node.left) {
        moveInOrder(node.left, nodeAnalyzer, ...args);
    }
    let res = nodeAnalyzer(node, ...args);
    if (node.right) {
        moveInOrder(node.right, nodeAnalyzer, ...args);
    }

    return res;
}

const movePreOrder = <T>(node: Node<T>, nodeAnalyzer: (node: Node<T>, ...args: any[]) => any, ...args: any[]) => {
    let res = nodeAnalyzer(node, ...args);
    if (node.left) {
        movePreOrder(node.left, nodeAnalyzer, ...args);
    }
    if (node.right) {
        movePreOrder(node.right, nodeAnalyzer, ...args);
    }
    return res;
}


const movePostOrder = <T>(node: Node<T>, nodeAnalyzer: (node: Node<T>, ...args: any[]) => any, ...args: any[]) => {
    if (node.left) {
        movePostOrder(node.left, nodeAnalyzer, ...args);
    }
    if (node.right) {
        movePostOrder(node.right, nodeAnalyzer, ...args);
    }
    return nodeAnalyzer(node, ...args);
}

export const enum DFSOrder {
    PRE_ORDER = 'PRE_ORDER',
    IN_ORDER = 'IN_ORDER',
    POST_ORDER = 'POST_ORDER'
}

const orderFunctionMapper: Record<DFSOrder, <T>(node: Node<T>, nodeAnalyzer: (node: Node<T>, ...args: any[]) => any) => void> = {
    [DFSOrder.PRE_ORDER]: movePreOrder,
    [DFSOrder.IN_ORDER]: moveInOrder,
    [DFSOrder.POST_ORDER]: movePostOrder,
}

export const depthFirstSearch = <T, R>(
    tree: MyBinarySearchTree<T>,
    nodeAnalyzer: (node: Node<T>, ...args: any[]) => R,
    order: DFSOrder = DFSOrder.IN_ORDER,
    ...initialArgs: any[]
): R | void => {
    const root = tree.getRoot();
    if (!root) return;
    const orderFunction = orderFunctionMapper[order];
    return (orderFunction as any)(root, nodeAnalyzer, ...initialArgs);
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

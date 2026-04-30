import { executeMain } from "../../cli.js";
import MyBinarySearchTree, { Node } from "../../data_structures/binary_search_tree.js";
import MyQueue from "../../data_structures/queue.js";

const breathFirstSearch = <T>(tree: MyBinarySearchTree<T>, nodeAnalyzer: (node: Node<T>) => boolean) => {
    let current = tree.getRoot();
    
    if (!current) return;

    const queue = new MyQueue<Node<T>>(false);
    queue.enqueue(current);

    while (queue.getLength() > 0) {
        current = queue.dequeue()!.value!;
        
        const found = nodeAnalyzer(current);
        if (found) break;

        for(let child of current.children) {
            queue.enqueue(child);
        }
    }

}


executeMain("breath_first_search.ts", () => {
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

    breathFirstSearch(tree, (node: Node<number>) => {
        console.log('Exploring', node.value);
        return false;
    })
});

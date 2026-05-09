/**
 * Binary tree level-order traversal grouped by levels.
 * Uses the local {@link Node} shape: `value`, `left`, `right`.
 */

import { executeMain } from "../../cli.js";
import MyArray from "../../data_structures/array.js";
import MyBinarySearchTree, { Node } from "../../data_structures/binary_search_tree.js";

export const levelArray = function (tree: MyBinarySearchTree<number>): MyArray<MyArray<number>> {
    const root = tree.getRoot();

    if (root === null) return new MyArray<MyArray<number>>();

    let i = 0;
    let currentLevel = new MyArray<Node<number>>({ initArray: [root] });
    let levelNumber = 0;
    let nextLevel = new MyArray<Node<number>>();
    const res = new MyArray<MyArray<number>>();

    while (i < currentLevel.getLength()) {
        const currentNode = currentLevel.get(i);

        if (!res.get(levelNumber)) res.set(levelNumber, new MyArray<number>());

        res.get(levelNumber).push(currentNode.value);

        if (currentNode.left) nextLevel.push(currentNode.left);
        if (currentNode.right) nextLevel.push(currentNode.right);

        if (i === currentLevel.getLength() - 1) {
            currentLevel = nextLevel;
            nextLevel = new MyArray<Node<number>>();
            levelNumber++;
            i = 0;
        } else {
            i++;
        }
    }

    return res;
};

const toNativeLevels = (levels: MyArray<MyArray<number>>): number[][] => {
    const result: number[][] = [];
    levels.forEach((level, levelIndex) => {
        result[levelIndex!] = [];
        level.forEach((value) => {
            result[levelIndex!].push(value);
        });
    });
    return result;
};

executeMain("3_levels_array.ts", () => {
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

    console.log("Levels array:", toNativeLevels(levelArray(tree)));
});
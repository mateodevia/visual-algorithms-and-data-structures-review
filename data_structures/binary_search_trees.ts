import {
    executeMain,
    runCLI,
    buildPointerRows,
    collectBinaryTreeLevels,
    formatBinaryTreeAsciiLines,
} from "../cli.js";


interface Node<T> {
    value: T;
    right: Node<T> | null;
    left: Node<T> | null;
}

class MyBinarySearchTree<T> {
    private root: Node<T> | null;

    private enableLogs: boolean;

    /**
     * @param enableLogs - When true, logs an initial empty visualization.
     */
    constructor(enableLogs?: boolean) {
        this.root = null;

        this.enableLogs = enableLogs ?? false;

        if (enableLogs) {
            console.log("Initialized binary search tree:");
            this.printVisualRepresentation();
        }
    }

    insert (value: T) {
        if (!this.root) {
            this.root = {
                value,
                right: null,
                left: null,
            }
            return;
        }

        let current = this.root;

        while(true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = {
                        value,
                        right: null,
                        left: null,
                    };
                    break;
                }
                current = current.left;

            } else {
                if (!current.right) {
                    current.right = {
                        value,
                        right: null,
                        left: null,
                    };
                    break;
                }
                current = current.right;
            }
        }
    }

    lookup (value: T): { found: Node<T> | undefined, parentInfo: {
        parent: Node<T> | undefined,
        relation: 'left' | 'right' | undefined,
    } } {
        if (!this.root) return { found: undefined, parentInfo: { parent: undefined, relation: undefined } };
        let current: Node<T> | null = this.root;
        let found: Node<T> | undefined = undefined;
        let parent: Node<T> | undefined = undefined;
        let relation: 'left' | 'right' | undefined = undefined;

        while(current && !found) {
            if (this.enableLogs) console.log(`Looking for ${value} at ${current.value}`)
            if (current.value === value) {
                found = current;
            } else if (value < current.value) {
                parent = current;
                current = current.left;
                relation = 'left';
            } else {
                parent = current;
                current = current.right;
                relation = 'right';
            }
        }

        return { found, parentInfo: { parent, relation } };

    }

    remove (value: T) {
        const { found: nodeToRemove, parentInfo } = this.lookup(value);

        const { parent, relation } = parentInfo;

        if (!nodeToRemove) return;

        const next = nodeToRemove.right;

        if (!next) {
            //      (parent)
            //         |
            //         X       (has no right child)
            //        /
            //      (l)
            //
            // After removal:
            //     (parent)
            //        |
            //       (l)   (parent points to nodeToRemove.left)
            
            // If there is no parent it meands we are removing the root
            if (!parent || !relation) {
                this.root = nodeToRemove.left;
                return;
            }

            parent[relation] = nodeToRemove.left
            return;
        }

        if (next.left) {
            //      (parent)
            //         |
            //         X
            //        / \
            //      (l) (r)
            //         /
            //       (L)
            //       /  \
            //   (L')   (R')
            //     /
            //   ...
            // (L''')        // find the smaller sucesor of r
            //
            // After removal:
            //      (parent)
            //         |
            //       (L''')   // replace nodeToRemove with next´s smaller sucessor
            //        / \
            //      (l) (r)
            //         /
            //       (L)
            //       /  \
            //   (L')   (R')
            //    /       \
            //  ...       ...

            // Find next´s smaller sucessor
            let lastLeft = next.left!;
            let lastLeftParent = next;
            while (lastLeft?.left) {
                lastLeftParent= lastLeft;
                lastLeft = lastLeft?.left;
            }
            
            // If there is no parent it meands we are removing the root
            if (!parent || !relation) {
                lastLeftParent.left = lastLeft.right; // put the right subtree as parent´s new left sub tree

                this.root = lastLeft; // replace the root with next´s left
                lastLeft.right = nodeToRemove.right;
                lastLeft.left = nodeToRemove.left;
                return;
            }

            lastLeftParent.left = lastLeft.right; // put the right next´s smaller sucessor´s right subtree as its parent´s new left sub tree

            parent[relation] = lastLeft // replace nodeToRemove with next´s smaller sucessor
            lastLeft.right = nodeToRemove.right;
            lastLeft.left = nodeToRemove.left;

            
        } else if (next.right && !next.left) {
            //      (parent)
            //         |
            //         X
            //        / \
            //      (l) (r)  // next has no left element
            //            \
            //            (R)
            //           /   \
            //        (L')   (R')
            //
            // After removal:
            //      (parent)
            //         |
            //        (r)   // replace nodeToRemove with next
            //        / \
            //    (l)   (R)
            //         /  \
            //     (L')   (R')

            // If there is no parent it meands we are removing the root
            if (!parent || !relation) {
                this.root = next;
                next.left = nodeToRemove.left;
                return;
            }

            parent[relation] = next;
            next.left = nodeToRemove.left
        } else {
            //      (parent)
            //         |
            //         X
            //        / \
            //      (l) (r)  // next has no children
            //          / \
            //       null null
            //
            // After removal:
            //      (parent)
            //         |
            //        (r) // replace nodeToRemove with next
            //        / \
            //      (l) null

            // If there is no parent it meands we are removing the root
            if (!parent || !relation) {
                next.left = nodeToRemove.left;
                this.root = next;
                return;
            }

            next.left = nodeToRemove.left;
            parent[relation] = next;
        }
    }

    /**
     * Values in breadth-first order (level by level, left to right).
     * Index `i` matches {@link MyBinarySearchTree.printVisualRepresentation} pointer keys.
     */
    getVisualElements(): string[] {
        return collectBinaryTreeLevels(this.root).bfsOrder;
    }

    /**
     * Prints a centered ASCII tree (parent above children, `/` `\\` edges).
     * Optional carets: BFS index → label (same order as {@link getVisualElements}),
     * rendered on a companion line using {@link buildPointerRows}.
     *
     * @param extraPointers - Global BFS index → label for pointer row under the value line.
     */
    printVisualRepresentation(extraPointers: Record<number, string> = {}) {
        if (!this.root) {
            console.log("(empty tree)");
            return;
        }

        const lines = formatBinaryTreeAsciiLines(this.root);
        console.log("");
        console.log('-----------------------------------------------------')
        console.log("Tree:");
        for (const line of lines) {
            console.log(line);
        }

        const bfs = collectBinaryTreeLevels(this.root).bfsOrder;
        if (Object.keys(extraPointers).length > 0 && bfs.length > 0) {
            const between = ", ";
            const pointerBlock = buildPointerRows(bfs, extraPointers, { between });
            if (pointerBlock.trim()) {
                console.log("");
                console.log(`Pointers (BFS order: [ ${bfs.join(between)} ]):`);
                console.log(`[ ${bfs.join(between)} ]`);
                console.log(pointerBlock);
            }
        }
    }
}

executeMain("binary_search_trees.ts", () => {
    runCLI(
        {
            i: ([value], tree) => tree.insert(Number(value)),
            l: ([value], tree) => console.log('Found:', tree.lookup(Number(value)).found?.value),
            r: ([value], tree) => tree.remove(Number(value)),
        },
        () => {
            const t = new MyBinarySearchTree<number>(true)
            t.insert(5);
            t.insert(10);
            t.insert(4);
            t.insert(6);
            t.insert(7);
            t.insert(8);
            t.insert(12);
            t.insert(11);
            t.printVisualRepresentation()
            return t
        },
    );
});

export default MyBinarySearchTree;
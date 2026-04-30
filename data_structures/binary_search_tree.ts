import {
    executeMain,
    runCLI,
    collectBinaryTreeLevels,
    formatBinaryTreeAsciiLines,
    type BinaryTreeNodeLike,
} from "../cli.js";


export class Node<T> {
    value: T;
    right: Node<T> | null;
    left: Node<T> | null;

    constructor(value: T, left: Node<T> | null = null, right: Node<T> | null = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }

    get children(): readonly Node<T>[] {
        const res = [];
        if (this.left) res.push(this.left);
        if (this.right) res.push(this.right);
        return res;
    }
}

class MyBinarySearchTree<T> {
    /** Short tags in the tree → plain-language meaning (only tags used in a step are printed). */
    private static readonly REMOVAL_MARK_LEGENDS: Readonly<Record<string, string>> = {
        x: "node to remove (lookup hit)",
        P: "parent of x (the link you will rewrite: parent.left or parent.right)",
        l: "subtree that replaces x when x has no right child (x.left, may be null)",
        r: "x.right — first node in the right subtree (step toward the successor)",
        S: "successor = smallest element in x’s right subtree (walk right from x, then left as far as possible)",
        Ps: "parent of S",
    };

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

    getRoot() {
        return this.root;
    }

    insert (value: T) {
        if (!this.root) {
            this.root = new Node(value);
            return;
        }

        let current = this.root;

        while(true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = new Node(value);
                    break;
                }
                current = current.left;

            } else {
                if (!current.right) {
                    current.right = new Node(value);
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

    /**
     * Builds {@link formatBinaryTreeAsciiLines} `nodeSuffix` so labels appear inside each node cell.
     */
    private marksToSuffixFn(
        marks: ReadonlyArray<{ label: string; node: Node<T> | null | undefined }>,
    ): (node: BinaryTreeNodeLike<T>) => string | undefined {
        const map = new Map<Node<T>, string>();
        for (const { label, node } of marks) {
            if (node == null) continue;
            const prev = map.get(node);
            map.set(node, prev ? `${prev}·${label}` : `·${label}`);
        }
        return (n) => map.get(n as Node<T>);
    }

    /** Prints explanations for mark tags present in this step (order = first use in `marks`). */
    private printRemovalMarkLegend(
        marks: ReadonlyArray<{ label: string; node: Node<T> | null | undefined }>,
    ) {
        const ordered: string[] = [];
        const seen = new Set<string>();
        for (const { label } of marks) {
            if (seen.has(label)) continue;
            seen.add(label);
            ordered.push(label);
        }
        if (ordered.length === 0) return;

        const colW = Math.max(...ordered.map((l) => l.length));
        console.log("");
        console.log("Mark legend:");
        for (const label of ordered) {
            const desc =
                MyBinarySearchTree.REMOVAL_MARK_LEGENDS[label] ??
                "(add this tag to REMOVAL_MARK_LEGENDS)";
            console.log(`  ${label.padEnd(colW)}  ${desc}`);
        }
    }

    private logRemovalStep(
        step: string,
        marks: ReadonlyArray<{ label: string; node: Node<T> | null | undefined }>,
    ) {
        if (!this.enableLogs) return;
        console.log("");
        console.log(`[remove] ${step}`);
        if (!this.root) {
            console.log("(empty tree)");
            return;
        }
        this.printVisualRepresentation(marks);
    }

    remove (value: T) {
        const { found: nodeToRemove, parentInfo } = this.lookup(value);

        const { parent, relation } = parentInfo;

        if (!nodeToRemove) {
            this.logRemovalStep(`value ${String(value)} not found`, []);
            return;
        }

        this.logRemovalStep("after lookup", [
            { label: "x", node: nodeToRemove },
            { label: "P", node: parent },
        ]);

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
            
            this.logRemovalStep("branch: no right child → splice left subtree (or null)", [
                { label: "x", node: nodeToRemove },
                { label: "P", node: parent },
                { label: "l", node: nodeToRemove.left },
            ]);

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

            this.logRemovalStep(
                "branch: successor = leftmost in right subtree; detach preserves succ.right",
                [
                    { label: "x", node: nodeToRemove },
                    { label: "P", node: parent },
                    { label: "r", node: next },
                    { label: "S", node: lastLeft },
                    { label: "Ps", node: lastLeftParent },
                ],
            );
            
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
            this.logRemovalStep("branch: R has no left but has right → promote R, hang old left on R", [
                { label: "x", node: nodeToRemove },
                { label: "P", node: parent },
                { label: "r", node: next },
            ]);
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
            this.logRemovalStep("branch: R is leaf → promote R, attach old left as R.left", [
                { label: "x", node: nodeToRemove },
                { label: "P", node: parent },
                { label: "r", node: next },
            ]);
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
     */
    getVisualElements(): string[] {
        return collectBinaryTreeLevels(this.root).bfsOrder;
    }

    /**
     * Prints a centered ASCII tree (parent above children, `/` `\\` edges).
     * Optional removal/debug marks: labels are drawn inside the node’s padded cell after the value
     * (e.g. `10·rm` on the target and `5·P` on its parent), via {@link formatBinaryTreeAsciiLines} `nodeSuffix`.
     * When `marks` is non-empty, a **Mark legend** block is printed under the tree.
     */
    printVisualRepresentation(
        marks?: ReadonlyArray<{ label: string; node: Node<T> | null | undefined }>,
    ) {
        if (!this.root) {
            console.log("(empty tree)");
            return;
        }

        const suffixFn =
            marks && marks.length > 0 ? this.marksToSuffixFn(marks) : undefined;
        const lines = formatBinaryTreeAsciiLines(this.root, suffixFn ? { nodeSuffix: suffixFn } : undefined);
        console.log("");
        console.log('-----------------------------------------------------')
        console.log("Tree:");
        for (const line of lines) {
            console.log(line);
        }
        if (marks && marks.length > 0) {
            this.printRemovalMarkLegend(marks);
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
        () => new MyBinarySearchTree<number>(true),
    );
});

export default MyBinarySearchTree;
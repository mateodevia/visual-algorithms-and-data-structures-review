/**
 * Shared helpers for CLI / ASCII visualizations: aligned carets and labels for
 * lists, trees, graphs, or any fixed-width line layout.
 */

/** Truncates with `...` only when the string does not fit in `maxLen`. */
function truncateLabelForSlot(text: string, maxLen: number): string {
    if (maxLen <= 0) return "";
    if (text.length <= maxLen) return text;
    if (maxLen <= 3) return text.slice(0, maxLen);
    return text.slice(0, maxLen - 3) + "...";
}

export interface ColumnPointer {
    /** 0-based character index on the line where the caret sits. */
    column: number;
    /** Text under the caret (may be truncated to fit the slot). */
    label: string;
}

/**
 * Builds two lines (arrows + labels) aligned to arbitrary character columns.
 * Use when elements are not a simple `join(between)` list — e.g. trees with
 * gaps, graphs with positioned nodes, or custom padding.
 *
 * Carets are placed at each `column` with a `^`. Labels extend rightward with a
 * minimum width of 3 characters up to the next pointer column or end of line.
 */
export function buildColumnPointers(
    width: number,
    pointers: ColumnPointer[],
): string {
    if (width <= 0) return "\n";

    const sorted = [...pointers].sort((a, b) => a.column - b.column);
    const arrowsArr = Array.from({ length: width }, () => " ");
    const labelsArr = Array.from({ length: width }, () => " ");

    for (let i = 0; i < sorted.length; i++) {
        const { column, label } = sorted[i]!;
        if (column < 0 || column >= width) continue;

        const display = label.trim();
        if (display) {
            arrowsArr[column] = "^";
        }

        if (!display) continue;

        const nextCol = i + 1 < sorted.length ? sorted[i + 1]!.column : width;
        const maxLen = Math.max(3, nextCol - column);
        const text = truncateLabelForSlot(display, maxLen);
        for (let k = 0; k < text.length && column + k < width; k++) {
            labelsArr[column + k] = text[k]!;
        }
    }

    return `${arrowsArr.join("")}\n${labelsArr.join("")}`;
}

/**
 * Finds the start index of the first occurrence of `needle` in `line`, or -1.
 * Useful to place a column pointer under a known substring (node id, value, …).
 */
export function indexOfSubstring(line: string, needle: string): number {
    if (!needle) return -1;
    return line.indexOf(needle);
}

/**
 * Builds {@link buildColumnPointers} lines for carets under substrings of `line`.
 * Each `needle` must be unique enough that `indexOf` finds the right occurrence
 * (use padded or prefixed labels if needed).
 */
export function buildSubstringPointers(
    line: string,
    marks: { needle: string; label: string }[],
): string {
    const pointers: ColumnPointer[] = [];
    for (const { needle, label } of marks) {
        const column = indexOfSubstring(line, needle);
        if (column >= 0) {
            pointers.push({ column, label });
        }
    }
    return buildColumnPointers(line.length, pointers);
}

export interface BinaryTreeNodeLike<T> {
    value: T;
    left: BinaryTreeNodeLike<T> | null;
    right: BinaryTreeNodeLike<T> | null;
}

/** Label for an edge that would revisit an already-seen node (cycle / “infinite” branch). */
function formatCycleBackEdge<T>(node: BinaryTreeNodeLike<T>): string {
    return `[↻${String(node.value)}]`;
}

type BfsQueueItem<T> =
    | { kind: "node"; node: BinaryTreeNodeLike<T> }
    | { kind: "cycle"; node: BinaryTreeNodeLike<T> };

/**
 * Breadth-first levels: each inner array is one level (left-to-right).
 * Also returns values in global BFS order (same as concatenating levels).
 *
 * If a child pointer would enter a node already enqueued on this walk, that
 * slot is rendered as {@link formatCycleBackEdge} instead of looping forever.
 */
export function collectBinaryTreeLevels<T>(
    root: BinaryTreeNodeLike<T> | null,
): { levels: string[][]; bfsOrder: string[] } {
    if (!root) {
        return { levels: [], bfsOrder: [] };
    }

    const levels: string[][] = [];
    const bfsOrder: string[] = [];
    const enqueued = new WeakSet<BinaryTreeNodeLike<T>>();
    enqueued.add(root);
    let queue: BfsQueueItem<T>[] = [{ kind: "node", node: root }];

    while (queue.length > 0) {
        const row: string[] = [];
        const next: BfsQueueItem<T>[] = [];

        for (const item of queue) {
            if (item.kind === "cycle") {
                const s = formatCycleBackEdge(item.node);
                row.push(s);
                bfsOrder.push(s);
                continue;
            }
            const node = item.node;
            const s = String(node.value);
            row.push(s);
            bfsOrder.push(s);
            for (const child of [node.left, node.right] as const) {
                if (!child) continue;
                if (enqueued.has(child)) {
                    next.push({ kind: "cycle", node: child });
                } else {
                    enqueued.add(child);
                    next.push({ kind: "node", node: child });
                }
            }
        }

        levels.push(row);
        queue = next;
    }

    return { levels, bfsOrder };
}

/** One rendered subtree: text lines and horizontal span of the root label. */
interface AsciiSubtree {
    lines: string[];
    width: number;
    /** Horizontal center of this node’s label on line 0 (fractional ok). */
    rootCenter: number;
}

function padLine(s: string, w: number): string {
    return s.length >= w ? s.slice(0, w) : s + " ".repeat(w - s.length);
}

/**
 * Centers `text` in a fixed-width cell (padding with spaces on both sides).
 * Truncates if longer than `cellW`.
 *
 * Uses `Math.round` for the left padding share so odd leftover space is split
 * evenly (e.g. two digits in width 5 → two spaces on the left, one on the right).
 * Lines must not be right-trimmed after rendering or digits will look shifted left.
 */
export function padCell(text: string, cellW: number): string {
    const s = text.length > cellW ? text.slice(0, cellW) : text;
    if (s.length >= cellW) return s;
    const totalPad = cellW - s.length;
    const start = Math.round(totalPad / 2);
    const end = totalPad - start;
    return " ".repeat(start) + s + " ".repeat(end);
}

function maxLabelLength<T>(
    node: BinaryTreeNodeLike<T> | null,
    path: Set<BinaryTreeNodeLike<T>>,
): number {
    if (!node) return 0;
    if (path.has(node)) return formatCycleBackEdge(node).length;
    path.add(node);
    const m = Math.max(
        String(node.value).length,
        node.left ? maxLabelLength(node.left, path) : 0,
        node.right ? maxLabelLength(node.right, path) : 0,
    );
    path.delete(node);
    return m;
}

/**
 * Horizontal center of the rendered value inside a padded `cell` (fractional index).
 * Aligns edges and parents to the digits, not to the middle of the padding box.
 */
export function labelCenterInCell(cell: string, value: unknown): number {
    const raw = String(value);
    const i = cell.indexOf(raw);
    if (i < 0) return (cell.length - 1) / 2;
    const j = i + raw.length - 1;
    return (i + j) / 2;
}

/**
 * Puts `cell` into a line of width `totalW` so the label’s center sits at `labelCenterGlobal`.
 */
function placeCell(
    cell: string,
    totalW: number,
    labelCenterGlobal: number,
    value: unknown,
): string {
    const lw = cell.length;
    const local = labelCenterInCell(cell, value);
    let start = Math.round(labelCenterGlobal - local);
    if (start < 0) start = 0;
    if (start + lw > totalW) start = Math.max(0, totalW - lw);
    const arr = Array.from({ length: totalW }, () => " ");
    for (let i = 0; i < lw; i++) {
        arr[start + i] = cell[i]!;
    }
    return arr.join("");
}

function leafSubtree(cell: string, value: unknown): AsciiSubtree {
    const w = cell.length;
    return {
        lines: [cell],
        width: w,
        rootCenter: labelCenterInCell(cell, value),
    };
}

function edgeTwoParents(
    parentCenter: number,
    leftCenter: number,
    rightCenter: number,
    w: number,
): string {
    const arr = Array.from({ length: w }, () => " ");
    let i1 = Math.round((parentCenter + leftCenter) / 2);
    let i2 = Math.round((parentCenter + rightCenter) / 2);
    if (i1 === i2 && i2 < w - 1) i2 = i2 + 1;
    if (i1 >= 0 && i1 < w) arr[i1] = "/";
    if (i2 >= 0 && i2 < w) arr[i2] = "\\";
    return arr.join("");
}

function edgeSingle(
    parentCenter: number,
    childCenter: number,
    w: number,
    side: "left" | "right",
): string {
    const arr = Array.from({ length: w }, () => " ");
    const i = Math.round((parentCenter + childCenter) / 2);
    if (i >= 0 && i < w) arr[i] = side === "left" ? "/" : "\\";
    return arr.join("");
}

export interface FormatBinaryTreeAsciiOptions {
    /** Minimum width of each node cell (spaces pad shorter values). Default 5. */
    minCellWidth?: number;
    /** Gap between left and right subtree blocks. Default 2. */
    gap?: number;
    /**
     * Staircase leading spaces per row (root most indented, lower rows shifted left).
     * - `undefined` (default): only for **path** trees (each node has ≤1 child), so
     *   branching trees keep flush dedented layout.
     * - `true`: always apply (including branching shapes).
     * - `false`: never apply.
     */
    staircaseIndent?: boolean;
}

/**
 * True if every node has at most one child (a single path / spine), with no
 * cycles. Corrupt cyclic graphs yield false so layout options stay safe.
 */
export function isBinaryPathTree<T>(
    root: BinaryTreeNodeLike<T> | null,
    path: WeakSet<BinaryTreeNodeLike<T>> = new WeakSet(),
): boolean {
    if (!root) return true;
    if (path.has(root)) return false;
    if (root.left && root.right) return false;
    path.add(root);
    try {
        return isBinaryPathTree(root.left, path) && isBinaryPathTree(root.right, path);
    } finally {
        path.delete(root);
    }
}

/**
 * Renders a binary tree with each parent centered above its child(ren), using
 * `/` and `\\` edges — not level-wise arrays of siblings.
 *
 * Every node is drawn in a fixed-width cell: `max(minCellWidth, longest label in tree)`,
 * with the value centered in the cell so multi-digit numbers stay aligned.
 *
 * If `left`/`right` closes a cycle (re-enters a node on the path from the root),
 * that edge is drawn as a leaf cell `[↻value]` so the structure stays finite.
 */
export function formatBinaryTreeAsciiLines<T>(
    root: BinaryTreeNodeLike<T> | null,
    options?: FormatBinaryTreeAsciiOptions,
): string[] {
    if (!root) return [];

    const gap = options?.gap ?? 2;
    const minCell = options?.minCellWidth ?? 5;
    const cellW = Math.max(minCell, maxLabelLength(root, new Set()));

    function cellFor(node: BinaryTreeNodeLike<T>): string {
        return padCell(String(node.value), cellW);
    }

    function cycleLeaf(node: BinaryTreeNodeLike<T>): AsciiSubtree {
        const raw = formatCycleBackEdge(node);
        const cell = padCell(raw, cellW);
        return leafSubtree(cell, raw);
    }

    function layout(
        node: BinaryTreeNodeLike<T>,
        path: Set<BinaryTreeNodeLike<T>>,
    ): AsciiSubtree {
        if (path.has(node)) {
            return cycleLeaf(node);
        }
        path.add(node);
        const cell = cellFor(node);
        let left: AsciiSubtree | null = null;
        let right: AsciiSubtree | null = null;
        try {
            if (node.left) {
                left = path.has(node.left)
                    ? cycleLeaf(node.left)
                    : layout(node.left, path);
            }
            if (node.right) {
                right = path.has(node.right)
                    ? cycleLeaf(node.right)
                    : layout(node.right, path);
            }
        } finally {
            path.delete(node);
        }

        if (!left && !right) {
            return leafSubtree(cell, node.value);
        }

        if (left && !right) {
            const w = left.width;
            const labelX = left.rootCenter;
            const parentLine = placeCell(cell, w, labelX, node.value);
            const edge = edgeSingle(labelX, left.rootCenter, w, "left");
            return {
                lines: [parentLine, edge, ...left.lines],
                width: w,
                rootCenter: labelX,
            };
        }

        if (!left && right) {
            const w = right.width;
            const labelX = right.rootCenter;
            const parentLine = placeCell(cell, w, labelX, node.value);
            const edge = edgeSingle(labelX, right.rootCenter, w, "right");
            return {
                lines: [parentLine, edge, ...right.lines],
                width: w,
                rootCenter: labelX,
            };
        }

        const L = left!;
        const R = right!;
        const h = Math.max(L.lines.length, R.lines.length);
        const merged: string[] = [];
        for (let i = 0; i < h; i++) {
            const l = padLine(L.lines[i] ?? "", L.width);
            const r = padLine(R.lines[i] ?? "", R.width);
            merged.push(l + " ".repeat(gap) + r);
        }

        const totalW = L.width + gap + R.width;
        const leftCenter = L.rootCenter;
        const rightCenter = L.width + gap + R.rootCenter;
        const parentCenter = (leftCenter + rightCenter) / 2;
        const parentLine = placeCell(cell, totalW, parentCenter, node.value);
        const edge = edgeTwoParents(parentCenter, leftCenter, rightCenter, totalW);

        return {
            lines: [parentLine, edge, ...merged],
            width: totalW,
            rootCenter: parentCenter,
        };
    }

    const raw = layout(root, new Set()).lines;
    const normalized = trimTreeLinesRight(dedentTreeLines(raw));
    const stairMode = options?.staircaseIndent;
    const useStaircase =
        stairMode === true ||
        (stairMode !== false && isBinaryPathTree(root));
    return useStaircase ? applyStaircaseIndent(normalized) : normalized;
}

/**
 * Classic “staircase” look: line `r` (0 = root) gets `N + 1 - r` leading spaces
 * so the edge row sits between parent and child columns (`/` between them).
 */
function applyStaircaseIndent(lines: string[]): string[] {
    const n = lines.length;
    if (n <= 1) return lines;
    return lines.map((line, r) => " ".repeat(n + 1 - r) + line);
}

/**
 * Shifts every line left by the width of the longest leading-space prefix that
 * **every** line shares. (Using “min index of first non-space” would only remove
 * a few columns and leave the root line still indented — it must be the same
 * prefix length on all lines.)
 */
function dedentTreeLines(lines: string[]): string[] {
    if (lines.length === 0) return lines;
    let n = 0;
    outer: while (true) {
        for (const line of lines) {
            if (n >= line.length || line[n] !== " ") break outer;
        }
        n++;
    }
    if (n === 0) return lines;
    return lines.map((line) => line.slice(n));
}

/** Trims trailing spaces on each line (safe after dedent; keeps column alignment). */
function trimTreeLinesRight(lines: string[]): string[] {
    return lines.map((line) => line.replace(/\s+$/g, ""));
}

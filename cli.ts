import * as readline from "readline";

/** Options for {@link buildPointerRows}; keep `between` in sync with the printed value line. */
export interface BuildPointerRowsOptions {
    /**
     * Separator between elements, e.g. `", "` or `" --> "`.
     * Must be identical to what you use in `elements.join(between)` in the value line.
     */
    between?: string;
    /**
     * Leading characters so the first column lines up under the first value after `[`.
     * Default is two spaces (same width as `[ ` in `[ 1, 2 ]`).
     */
    prefix?: string;
}

/** Truncates with `...` only when the string does not fit in `maxLen`. */
function truncateLabelForSlot(text: string, maxLen: number): string {
    if (maxLen <= 0) return "";
    if (text.length <= maxLen) return text;
    if (maxLen <= 3) return text.slice(0, maxLen);
    return text.slice(0, maxLen - 3) + "...";
}

/**
 * Builds pointer rows (arrows + labels) aligned to the same layout as
 * `prefix + elements.join(between)` (the usual interior of `[ … ]`).
 *
 * Arrows sit on the first character of each element. Labels use the span up to the next
 * element (including the separator gap), with a minimum slot width of 3 chars; if longer,
 * labels are shortened with `...`.
 */
export function buildPointerRows(
    elements: string[],
    pointers: Record<number, string>,
    options?: BuildPointerRowsOptions,
): string {
    const between = options?.between ?? ", ";
    const prefix = options?.prefix ?? "  ";
    const n = elements.length;

    if (n === 0) {
        return `${prefix}\n${prefix}`;
    }

    const inner = elements.join(between);
    const dataInner = prefix + inner;
    const starts: number[] = [];
    let pos = prefix.length;
    for (let i = 0; i < n; i++) {
        starts[i] = pos;
        pos += elements[i].length;
        if (i < n - 1) pos += between.length;
    }

    const arrowsArr = Array.from({ length: dataInner.length }, () => " ");
    const labelsArr = Array.from({ length: dataInner.length }, () => " ");

    for (let i = 0; i < n; i++) {
        const raw = pointers[i] ?? " ";
        if (raw.trim()) {
            arrowsArr[starts[i]] = "^";
        }

        const display = raw.trim() ? raw : "";
        if (!display) continue;

        const maxLen = Math.max(
            3,
            i < n - 1 ? starts[i + 1] - starts[i] : dataInner.length - starts[i],
        );
        const text = truncateLabelForSlot(display, maxLen);
        while (labelsArr.length < starts[i] + maxLen) labelsArr.push(" ");
        for (let k = 0; k < text.length && starts[i] + k < labelsArr.length; k++) {
            labelsArr[starts[i] + k] = text[k]!;
        }
    }

    return `${arrowsArr.join("")}\n${labelsArr.join("")}`;
}

export interface Visualizable {
    printVisualRepresentation(): void;
}

type CommandHandler<T> = (args: string[], context: T) => void;
type Commands<T> = Record<string, CommandHandler<T>>;

export async function runCLI<T extends Visualizable>(
    commands: Commands<T>,
    factory: () => T,
) {
    const context = factory();
    const rl = readline.createInterface({ input: process.stdin, prompt: "> " });
    const available = [...Object.keys(commands), "exit"].map((c) => `"${c}"`).join(", ");
    console.log(`Commands: ${available}`);
    rl.prompt();

    for await (const line of rl) {
        const match = line.trim().match(/^([a-zA-Z]+)\s+(.*)$/);
        const command = match?.[1] ?? line.trim();
        const args = match?.[2]?.trim().split(/\s+/) ?? [];

        if (command === "exit") break;

        if (command in commands) {
            commands[command](args, context);
        } else {
            console.log(`Unknown command. Available: ${available}`);
        }

        context.printVisualRepresentation();
        rl.prompt();
    }

    console.log("Goodbye!");
}

export const executeMain = (fileName: string, callback: () => void) => {
    const isMain = process.argv[1]?.endsWith(fileName);
    if (isMain) callback();
};

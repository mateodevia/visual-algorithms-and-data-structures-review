import * as readline from "readline";

/**
 * Builds pointer rows (arrows + labels) for a printed array.
 * @param elements - string representation of each element
 * @param pointers - map of index → label (e.g. { 0: "F", 3: "R" })
 * @returns two-line string: arrows row + labels row
 */
export function buildPointerRows(elements: string[], pointers: Record<number, string>): string {
    let arrows = "  ", labels = "  ";
    for (let i = 0; i < elements.length; i++) {
        const w = elements[i].length;
        const label = pointers[i] ?? " ";
        const arrow = label.trim() ? "^" : " ";
        const col = Math.max(w, label.length);
        const sep = i < elements.length - 1 ? "  " : "";
        arrows += arrow.padEnd(col) + sep;
        labels += label.padEnd(col) + sep;
    }
    return `${arrows}\n${labels}`;
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

        console.log(context.printVisualRepresentation());
        rl.prompt();
    }

    console.log("Goodbye!");
}

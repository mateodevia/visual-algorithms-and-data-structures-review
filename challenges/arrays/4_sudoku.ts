import { buildPointerRows, executeMain } from "../../cli.js";

/**
 * Returns true if a 9×9 Sudoku board is valid (no duplicate digits 1–9 in any row, column,
 * or 3×3 box). Cells with '.' are treated as empty and ignored.
 *
 * @param board - 9 rows of 9 characters each ('1'–'9' or '.').
 * @returns Whether the board satisfies Sudoku placement rules.
 *
 * Time complexity:  O(81) = O(1) — fixed board size.
 * Space complexity: O(1) — bounded maps for rows, columns, and boxes.
 */
var isValidSudoku = function (board: string[][]) {
    const map: any = {
        row: {
            0: {},
            1: {},
            2: {},
            3: {},
            4: {},
            5: {},
            6: {},
            7: {},
            8: {},
        },
        col: {
            0: {},
            1: {},
            2: {},
            3: {},
            4: {},
            5: {},
            6: {},
            7: {},
            8: {},
        },
        box: {
            0: {},
            1: {},
            2: {},
            3: {},
            4: {},
            5: {},
            6: {},
            7: {},
            8: {},
        },
    };
    let isValid = true;
    const forceBreak = false;

    console.log("Valid Sudoku — step trace (non-empty cells only)\n");

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = board[i][j];
            if (cell !== '.') {
                const b = Math.floor(i / 3) * 3 + Math.floor(j / 3);

                printSudokuStep(
                    board,
                    map,
                    i,
                    j,
                    b,
                    `(row=${i}, col=${j}): cell='${cell}' → box=${b}`,
                );

                if (map.row[i][cell] !== undefined) {
                    printSudokuStep(
                        board,
                        map,
                        i,
                        j,
                        b,
                        `(row=${i}, col=${j}): INVALID — '${cell}' already in row ${i}`,
                    );
                    isValid = false;
                    break;
                }
                map.row[i][cell] = true;

                if (map.col[j][cell] !== undefined) {
                    printSudokuStep(
                        board,
                        map,
                        i,
                        j,
                        b,
                        `(row=${i}, col=${j}): INVALID — '${cell}' already in col ${j}`,
                    );
                    isValid = false;
                    break;
                }
                map.col[j][cell] = true;

                if (map.box[b][cell] !== undefined) {
                    printSudokuStep(
                        board,
                        map,
                        i,
                        j,
                        b,
                        `(row=${i}, col=${j}): INVALID — '${cell}' already in box ${b}`,
                    );
                    isValid = false;
                    break;
                }
                map.box[b][cell] = true;
                printSudokuStep(
                    board,
                    map,
                    i,
                    j,
                    b,
                    `(row=${i}, col=${j}): OK — '${cell}' recorded in row ${i}, col ${j}, box ${b}`,
                );
            }
        }
    }
    return isValid;
};

/**
 * Prints only the row, column, and box maps relevant to `(i, j)` / `b`.
 */
const printSudokuMaps = (
    map: { row: Record<number, Record<string, boolean>>; col: Record<number, Record<string, boolean>>; box: Record<number, Record<string, boolean>> },
    i: number,
    j: number,
    b: number,
) => {
    const rowKeys = Object.keys(map.row[i]).sort();
    const colKeys = Object.keys(map.col[j]).sort();
    const boxKeys = Object.keys(map.box[b]).sort();
    console.log(`  row[${i}]: ${rowKeys.length ? rowKeys.join(", ") : "∅"}`);
    console.log(`  col[${j}]: ${colKeys.length ? colKeys.join(", ") : "∅"}`);
    console.log(`  box[${b}]: ${boxKeys.length ? boxKeys.join(", ") : "∅"}`);
};

/**
 * Prints the 9×9 board with a pointer under the active column on row `i`, a note line, then relevant maps.
 */
const printSudokuStep = (
    board: string[][],
    map: { row: Record<number, Record<string, boolean>>; col: Record<number, Record<string, boolean>>; box: Record<number, Record<string, boolean>> },
    i: number,
    j: number,
    b: number,
    note: string,
) => {
    const colLabels = Array.from({ length: 9 }, (_, k) => String(k)).join("   ");
    console.log("--------------------------------");
    console.log(`        ${colLabels}`);
    for (let r = 0; r < 9; r++) {
        const cells = board[r].map(String);
        console.log(`  ${r}    [ ${cells.join(", ")} ]`);
        if (r === i) {
            console.log(buildPointerRows(cells, { [j]: "i,j" }));
        }
    }
    console.log(`  ${note}`);
    printSudokuMaps(map, i, j, b);
};

executeMain("4_sudoku.ts", () => {
    const board: string[][] = [
        ["5", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"],
    ];

    const ok = isValidSudoku(board);

    console.log("\nResult:", ok);
});

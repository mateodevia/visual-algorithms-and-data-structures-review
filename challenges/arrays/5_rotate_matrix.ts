import { executeMain } from "../../cli.js";

/**
 * Elements are reflected across this diagonal line.
 *  \ _ _ _
 *  _ \ _ _
 *  _ _ \ _
 *  _ _ _ \ 
 *
 * @param matrix 
 */
const reflectDiagonalyMatrix = (matrix: string[][]) => {
    console.log('');
    console.log('Reflecting diagonally...');
    printMatrix(matrix, "diagonal");
    for (let i = 0; i < matrix.length; i++) {
        for (let j = i; j < matrix.length; j++) {
            const temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
};

/**
 * Elements are reflected across this vertical line.
 *  _ _ | _ _
 *  _ _ | _ _
 *  _ _ | _ _
 *  _ _ | _ _
 *
 * @param matrix 
 */
const reflectVerticallyMatrix = (matrix: string[][]) => {
    console.log('');
    console.log('Reflecting vertically...');
    printMatrix(matrix, "vertical");
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < Math.floor(matrix.length / 2); j++) {
            const temp = matrix[i][j];
            matrix[i][j] = matrix[i][matrix.length - 1 - j];
            matrix[i][matrix.length - 1 - j] = temp;
        }
    }
};


const rotateMatrix = (matrix: string[][]) => {
    printMatrix(matrix);
    reflectDiagonalyMatrix(matrix); //  Time: O(n²), Space O(1)
    printMatrix(matrix);
    reflectVerticallyMatrix(matrix); //  Time: O(n²), Space O(1)
    printMatrix(matrix);

};


const printMatrix = (matrix: string[][], axis?: "diagonal" | "vertical") => {
    const cellWidth = Math.max(
        5,
        ...matrix.flat().map((cell) => cell.length),
    );
    const totalColumns = matrix[0]?.length ?? 0;
    const isVerticalAxisOnColumn = totalColumns % 2 !== 0;
    const verticalAxisColumn = Math.floor(totalColumns / 2);

    console.log('-------------------------------------')

    for (let i = 0; i < matrix.length; i++) {
        const renderedRow: string[] = [];
        for (let j = 0; j < matrix[i].length; j++) {
            const value = matrix[i][j];
            if (axis === "diagonal" && i === j) {
                renderedRow.push("*".padStart(cellWidth, " "));
                continue;
            }
            if (axis === "vertical" && isVerticalAxisOnColumn && j === verticalAxisColumn) {
                renderedRow.push("|".padStart(cellWidth, " "));
                continue;
            }
            renderedRow.push(value.padStart(cellWidth, " "));
            if (axis === "vertical" && !isVerticalAxisOnColumn && j + 1 === verticalAxisColumn) {
                renderedRow.push("|".padStart(cellWidth, " "));
            }
        }
        console.log(renderedRow.join(""));
    }
};



executeMain("5_rotate_matrix.ts", () => {
    const matrix: string[][] = [
        ["1",  "2",  "3",  "4",  "5"],
        ["6",  "7",  "8",  "9",  "10"],
        ["11", "12", "13", "14", "15"],
        ["16", "17", "18", "19", "20"],
        ["21", "22", "23", "24", "25"],
    ];
    rotateMatrix(matrix);
});

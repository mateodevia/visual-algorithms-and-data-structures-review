/**
 * Returns true if the sudoku board is valid, or false otherwise
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board: string[][]) {
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
        }
    }
    let isValid = true;
    const forceBreak = false;
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = board[i][j];
            if (cell !== '.') {
                if (map.row[i][cell] !== undefined) {
                    isValid = false;
                    break;
                }
                map.row[i][cell] = true;
                
                if (map.col[j][cell] !== undefined) {
                    isValid = false;
                    break;
                }
                map.col[j][cell] = true;
                
                const b = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                if (map.box[b][cell] !== undefined) {
                    isValid = false;
                    break;
                }
                map.box[b][cell] = true;   
            }
        }
    }
    return isValid
};
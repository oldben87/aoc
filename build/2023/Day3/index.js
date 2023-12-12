"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runAOC_1 = __importDefault(require("../../utils/runAOC"));
const isNumber_1 = __importDefault(require("../../utils/isNumber"));
const add_1 = __importDefault(require("../../utils/add"));
const multiply_1 = __importDefault(require("../../utils/multiply"));
const ROW_AND_COLUMN_START = 0;
const positions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];
const getKey = (startCoords, endCoords) => {
    return `${startCoords.x}:${startCoords.y}|${endCoords.x}:${endCoords.y}`;
};
const validatePartNumber = (value) => {
    if (value === undefined) {
        return false;
    }
    if ((0, isNumber_1.default)(value)) {
        return false;
    }
    if (value === ".") {
        return false;
    }
    return true;
};
const validateGear = (value) => value === "*";
const part1 = (data) => {
    const height = data.length;
    const width = data[0]?.length;
    if (!width) {
        throw new Error("Width could not be determind");
    }
    let numberStartIndex, numberEndIndex;
    let isPartNumber = false;
    const partNumbersToSum = [];
    for (let row = ROW_AND_COLUMN_START; row < width; row++) {
        for (let column = ROW_AND_COLUMN_START; column < height; column++) {
            if (column === ROW_AND_COLUMN_START) {
                numberEndIndex = numberStartIndex = undefined;
                isPartNumber = false;
            }
            const valueToCheck = data[row][column];
            const valueIsNumber = (0, isNumber_1.default)(valueToCheck);
            if (valueIsNumber) {
                if (numberStartIndex === undefined) {
                    numberStartIndex = column;
                }
                numberEndIndex = column;
                // Check if surrounding squares are a valid option
                positions.forEach(([x, y]) => {
                    const dataRow = data[row + x];
                    const dataValue = dataRow !== undefined ? dataRow[column + y] : undefined;
                    if (validatePartNumber(dataValue)) {
                        isPartNumber = true;
                    }
                });
            }
            if (!valueIsNumber || data[row][column + 1] === undefined) {
                if (numberStartIndex !== undefined && numberEndIndex !== undefined) {
                    let toBeNum = "";
                    for (let i = numberStartIndex; i <= numberEndIndex; i++) {
                        toBeNum += data[row][i];
                    }
                    if (isPartNumber) {
                        partNumbersToSum.push(parseInt(toBeNum, 10));
                    }
                    numberStartIndex = numberEndIndex = undefined;
                    isPartNumber = false;
                }
            }
        }
    }
    return (0, add_1.default)(...partNumbersToSum);
};
const part2 = (data) => {
    const height = data.length;
    const width = data[0]?.length;
    if (!width) {
        throw new Error("Width could not be determind");
    }
    const gearSums = [];
    for (let row = ROW_AND_COLUMN_START; row < width; row++) {
        for (let column = ROW_AND_COLUMN_START; column < height; column++) {
            const valueToCheck = data[row][column];
            const isGear = validateGear(valueToCheck);
            if (!isGear) {
                continue;
            }
            const partNumbers = {};
            positions.forEach(([x, y]) => {
                const posRow = row + x;
                const posCol = column + y;
                const dataRow = data[posRow];
                const dataValue = dataRow !== undefined ? dataRow[posCol] : undefined;
                const valueIsNumber = (0, isNumber_1.default)(dataValue);
                if (valueIsNumber) {
                    // check for start of number
                    let startIndex = posCol;
                    let endIndex = posCol;
                    for (let i = posCol; (0, isNumber_1.default)(dataRow[i]); i--) {
                        startIndex = i;
                    }
                    for (let i = posCol; (0, isNumber_1.default)(dataRow[i]); i++) {
                        endIndex = i;
                    }
                    // add to memo
                    const key = getKey({ x: posRow, y: startIndex }, { x: posRow, y: endIndex });
                    if (partNumbers[key] === undefined) {
                        let partNumber = "";
                        for (let i = startIndex; i <= endIndex; i++) {
                            partNumber += data[posRow][i];
                        }
                        partNumbers[key] = parseInt(partNumber, 10);
                    }
                }
            });
            const partNumbersTotal = Object.values(partNumbers);
            if (partNumbersTotal.length === 2) {
                gearSums.push((0, multiply_1.default)(...partNumbersTotal));
            }
        }
    }
    return (0, add_1.default)(...gearSums);
};
(0, runAOC_1.default)({ part1, part2 });

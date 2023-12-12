"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_1 = __importDefault(require("../../utils/add"));
const coordHelpers_1 = require("../../utils/coordHelpers");
const coordHelpers_2 = require("../../utils/coordHelpers");
const runAOC_1 = __importDefault(require("../../utils/runAOC"));
const isGalaxy = (val) => val === "#";
const insertToString = (valToInsert, insertInto, index) => {
    const result = insertInto.split("");
    result.splice(index, 0, valToInsert);
    return result.join("");
};
const expandGalaxy = (data) => {
    const extraRows = [];
    data.forEach((row) => {
        const newRow = row.split("");
        if (newRow.every((toCheck) => !isGalaxy(toCheck))) {
            extraRows.push(newRow.join(""), newRow.join(""));
        }
        else {
            extraRows.push(newRow.join(""));
        }
    });
    let newColumns = extraRows.map((row) => row);
    let columnsAdded = 0;
    for (let column = 0; column < extraRows[0].length; column++) {
        const checkColumn = [];
        for (let row = 0; row < extraRows.length; row++) {
            checkColumn.push(extraRows[row][column]);
        }
        if (checkColumn.every((toCheck) => !isGalaxy(toCheck))) {
            newColumns = newColumns.map((rowToAmend) => insertToString(".", rowToAmend, column + columnsAdded));
            columnsAdded++;
        }
    }
    return newColumns;
};
const getDistanceFromCoordinates = (distances) => {
    let distance = 0;
    distances.forEach((coords, ind, array) => {
        array.forEach((subCoords, index) => {
            if ((0, coordHelpers_1.getCoordsAsKey)(coords) === (0, coordHelpers_1.getCoordsAsKey)(subCoords) || index < ind) {
                return;
            }
            const newDistance = (0, coordHelpers_2.getDistanceFromCoords)(coords, subCoords);
            distance = (0, add_1.default)(distance, newDistance);
        });
    });
    return distance;
};
const calculateMinimumDistances = (data, rows = [], columns = [], expansionFactor = 1) => {
    const galaxies = [];
    for (let row = 0; row < data.length; row++) {
        for (let column = 0; column < data[0].length; column++) {
            if (isGalaxy(data[row][column])) {
                galaxies.push({
                    y: adjustForExpansion(row, rows, expansionFactor),
                    x: adjustForExpansion(column, columns, expansionFactor),
                });
            }
            else {
                continue;
            }
        }
    }
    return getDistanceFromCoordinates(galaxies);
};
const adjustForExpansion = (value, expandedSpaces, multiplier = 1) => {
    const filtered = expandedSpaces.filter((space) => value > space);
    if (filtered.length) {
        const timesToMultiply = filtered.length;
        return value - timesToMultiply + multiplier * timesToMultiply;
    }
    return value;
};
const expandGalaxyCoords = (data) => {
    const rowsExpanded = [];
    const columnsExpanded = [];
    data.forEach((row, index) => {
        const newRow = row.split("");
        if (newRow.every((toCheck) => !isGalaxy(toCheck))) {
            rowsExpanded.push(index);
        }
    });
    for (let column = 0; column < data[0].length; column++) {
        const checkColumn = [];
        for (let row = 0; row < data.length; row++) {
            checkColumn.push(data[row][column]);
        }
        if (checkColumn.every((toCheck) => !isGalaxy(toCheck))) {
            columnsExpanded.push(column);
        }
    }
    return calculateMinimumDistances(data, rowsExpanded, columnsExpanded, 1000000);
};
const part1 = (data) => {
    const expandedGalaxy = expandGalaxy(data);
    return calculateMinimumDistances(expandedGalaxy, [], [], 1);
};
const part2 = (data) => {
    return expandGalaxyCoords(data);
};
(0, runAOC_1.default)({ part1, part2 });

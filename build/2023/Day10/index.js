"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coordHelpers_1 = require("../../utils/coordHelpers");
const runAOC_1 = __importDefault(require("../../utils/runAOC"));
const pipePieces = ["|", "7", "J", "F", "L", "-"];
const directions = ["north", "south", "east", "west"];
const getTargetMatch = (currentDirection) => {
    switch (currentDirection) {
        case "east":
            return "west";
        case "west":
            return "east";
        case "north":
            return "south";
        case "south":
            return "north";
        default:
            throw new Error("Invalid Direction provided: " + currentDirection);
    }
};
const getCoordShift = (direction) => {
    switch (direction) {
        case "east":
            return { x: 1, y: 0 };
        case "west":
            return { x: -1, y: 0 };
        case "north":
            return { x: 0, y: -1 };
        case "south":
            return { x: 0, y: 1 };
        default:
            throw new Error("Invalid Direction provided: " + direction);
    }
};
const assertPipePiece = (value) => pipePieces.includes(value);
const assertDirection = (value) => directions.includes(value);
const movements = {
    "|": ["north", "south"],
    "7": ["west", "south"],
    J: ["north", "west"],
    F: ["south", "east"],
    "-": ["east", "west"],
    L: ["north", "east"],
};
const canMove = (currentPiece, targetPiece) => {
    if (currentPiece === "." || targetPiece === ".") {
        return false;
    }
    if (!assertPipePiece(currentPiece) || !assertPipePiece(targetPiece)) {
        throw new Error("not pipe piece");
    }
    const current = movements[currentPiece];
    const target = movements[targetPiece];
    let canMove;
    for (let i = 0; i < current.length; i++) {
        for (let j = 0; j < target.length; j++) {
            const targetDirection = getTargetMatch(current[i]);
            if (targetDirection === target[j]) {
                canMove = current[i];
            }
        }
    }
    if (canMove) {
        return getCoordShift(canMove);
    }
    return;
};
const findStart = (data) => {
    let coords;
    for (let row = 0; row < data.length; row++) {
        for (let column = 0; column < data[0].length; column++) {
            if (data[row][column] === "S") {
                coords = { x: column, y: row };
            }
        }
    }
    if (coords === undefined) {
        throw new Error("No start found!");
    }
    const validDirections = [];
    directions.forEach((dir) => {
        const shiftedCoords = getCoordShift(dir);
        if (!coords)
            throw new Error("No start found!");
        const newCoords = (0, coordHelpers_1.addCoords)(coords, shiftedCoords);
        const valueToCheck = data[newCoords.y][newCoords.x];
        if (!valueToCheck || !assertPipePiece(valueToCheck)) {
            return;
        }
        const toMatch = getTargetMatch(dir);
        const movementsToCheck = movements[valueToCheck];
        if (movementsToCheck.includes(toMatch)) {
            validDirections.push(dir);
        }
    });
    return { coords, directions: validDirections };
};
const findNextCoord = (data, { x, y }, exclude) => {
    const filteredDirections = exclude
        ? directions.filter((dir) => dir !== exclude)
        : directions;
    const currentVal = data[y][x];
    let nextCoordinate;
    filteredDirections.forEach((dir) => {
        const shiftedCoords = getCoordShift(dir);
        const newCoords = (0, coordHelpers_1.addCoords)({ x, y }, shiftedCoords);
        const valueToCheck = data[newCoords.y][newCoords.x];
        if (!valueToCheck || !assertPipePiece(valueToCheck)) {
            return;
        }
    });
};
const part1 = (data) => {
    const start = findStart(data);
    return start;
};
(0, runAOC_1.default)({ part1 });

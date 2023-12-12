"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCoords = exports.getDistanceFromCoords = exports.getCoordsFromKey = exports.getCoordsAsKey = void 0;
const getCoordsAsKey = ({ x, y }) => {
    return `${x},${y}`;
};
exports.getCoordsAsKey = getCoordsAsKey;
const getCoordsFromKey = (key) => {
    const [x, y] = key.split(",");
    if (x === undefined || y === undefined) {
        throw new Error("Invalid coord key passed in");
    }
    return { x: Number(x), y: Number(y) };
};
exports.getCoordsFromKey = getCoordsFromKey;
const getDistanceFromCoords = ({ x: xA, y: yA }, { x: xB, y: yB }) => {
    return Math.abs(xA - xB) + Math.abs(yA - yB);
};
exports.getDistanceFromCoords = getDistanceFromCoords;
const addCoords = ({ x: xA, y: yA }, { x: xB, y: yB }) => {
    return { x: xA + xB, y: yA + yB };
};
exports.addCoords = addCoords;

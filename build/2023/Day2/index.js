"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_1 = __importDefault(require("../../utils/add"));
const runAOC_1 = __importDefault(require("../../utils/runAOC"));
const multiply_1 = __importDefault(require("../../utils/multiply"));
const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;
const parseId = (rawId) => {
    const parsed = rawId.replace("Game ", "");
    const idNumber = parseInt(parsed, 10);
    if (isNaN(idNumber)) {
        throw new Error(`Invalid ID passeed in: ${rawId}`);
    }
    return idNumber;
};
const parseGames = (rawGames) => {
    const games = rawGames.split("; ");
    return games.map((game) => {
        const rawCubes = game.split(", ");
        const cubes = {};
        rawCubes.forEach((cube) => {
            const [value, key] = cube.split(" ");
            cubes[key] = parseInt(value, 10);
            if (isNaN(cubes[key])) {
                throw new Error(`Error: Value not a number: ${cubes[key]} | ${cube}`);
            }
        });
        return cubes;
    });
};
const parseInput = (data) => {
    return data.reduce((result, current) => {
        const [rawId, rawGames] = current.split(": ");
        const id = parseId(rawId);
        result[id] = parseGames(rawGames);
        return result;
    }, {});
};
const isGameValid = ({ red, green, blue }) => {
    if (red === undefined && green === undefined && blue === undefined) {
        return false;
    }
    if (!!red) {
        if (red > MAX_RED) {
            return false;
        }
    }
    if (!!green) {
        if (green > MAX_GREEN) {
            return false;
        }
    }
    if (!!blue) {
        if (blue > MAX_BLUE) {
            return false;
        }
    }
    return true;
};
const part1 = (dataInput) => {
    const data = parseInput(dataInput);
    const dataEntries = Object.entries(data);
    const ids = dataEntries.map(([idAsString, games]) => {
        const isValid = games.every(isGameValid);
        return isValid ? parseInt(idAsString, 10) : 0;
    });
    return (0, add_1.default)(...ids);
};
const getPowerFromCubes = (games) => {
    const maxes = {
        red: 0,
        green: 0,
        blue: 0,
    };
    games.forEach(({ red, green, blue }) => {
        if (!!red) {
            maxes.red = Math.max(red, maxes.red);
        }
        if (!!green) {
            maxes.green = Math.max(green, maxes.green);
        }
        if (!!blue) {
            maxes.blue = Math.max(blue, maxes.blue);
        }
    });
    return (0, multiply_1.default)(...Object.values(maxes));
};
const part2 = (dataInput) => {
    const data = parseInput(dataInput);
    const values = Object.values(data);
    const maxCubes = values.map(getPowerFromCubes);
    return (0, add_1.default)(...maxCubes);
};
(0, runAOC_1.default)({ part1, part2 });

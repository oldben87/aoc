"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multiply_1 = __importDefault(require("../../utils/multiply"));
const runAOC_1 = __importDefault(require("../../utils/runAOC"));
const parseData = (data) => {
    const result = {
        Time: [],
        Distance: [],
    };
    data.forEach((rawStat) => {
        const [key, values] = rawStat.split(":");
        if (key === "Time" || key === "Distance") {
            result[key] = values.split(" ").filter(Boolean).map(Number);
        }
    });
    return result;
};
const solvePuzzle = (data) => {
    const numberOfWins = [];
    for (let i = 0; i < data.Time.length; i++) {
        const time = data.Time[i];
        const distanceToBeat = data.Distance[i];
        let winners = 0;
        for (let pressedFor = 1; pressedFor < time; pressedFor++) {
            const remainingTime = time - pressedFor;
            const distanceTravelled = remainingTime * pressedFor;
            if (distanceTravelled > distanceToBeat) {
                winners++;
            }
        }
        numberOfWins.push(winners);
    }
    return numberOfWins;
};
const part1 = (data) => {
    const parsed = parseData(data);
    const numberOfWins = solvePuzzle(parsed);
    return (0, multiply_1.default)(...numberOfWins);
};
const part2 = (data) => {
    const parsed = parseData(data);
    const adjusted = {
        Time: [Number(parsed.Time.join(""))],
        Distance: [Number(parsed.Distance.join(""))],
    };
    const numberOfWins = solvePuzzle(adjusted);
    return Math.max(...numberOfWins);
};
(0, runAOC_1.default)({ part1, part2 });

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_1 = __importDefault(require("../../utils/add"));
const runAOC_1 = __importDefault(require("../../utils/runAOC"));
const parseId = (rawId) => {
    const parsed = rawId.replace("Card ", "");
    const idNumber = parseInt(parsed, 10);
    if (isNaN(idNumber)) {
        throw new Error(`Invalid ID passeed in: ${rawId}`);
    }
    return idNumber;
};
const parseGames = (rawGame) => {
    const [rawWinningNumbers, rawNumbers] = rawGame
        .replaceAll("  ", " ")
        .split(" | ");
    return {
        winningNumbers: rawWinningNumbers.split(" ").map(Number),
        numbers: rawNumbers.split(" ").map(Number),
    };
};
const parseArray = (data) => {
    const results = data.reduce((acc, game) => {
        const [rawId, rawGames] = game.split(": ");
        acc[parseId(rawId)] = parseGames(rawGames);
        return acc;
    }, {});
    return results;
};
const getMatches = ({ winningNumbers, numbers }) => {
    return winningNumbers.reduce((tot, curr) => {
        return numbers.includes(curr) ? tot + 1 : tot;
    }, 0);
};
const part1 = (data) => {
    const bingoGames = parseArray(data);
    const pileWorth = Object.values(bingoGames).reduce((total, game) => {
        const matches = getMatches(game);
        if (!matches) {
            return total;
        }
        let sum = 0;
        for (let i = 1; i <= matches; i++) {
            sum = !sum ? 1 : (sum *= 2);
        }
        return total + sum;
    }, 0);
    return pileWorth;
};
const getItem = (id, memo, matches) => {
    const result = memo[id];
    if (!result) {
        return {
            matches,
            copies: 1,
        };
    }
    return result;
};
const part2 = (data) => {
    const bingoGames = parseArray(data);
    const maxID = data.length;
    const cardsMemo = {};
    Object.entries(bingoGames).forEach(([cardId, game]) => {
        const matches = getMatches(game);
        const id = Number(cardId);
        const item = getItem(id, cardsMemo, matches);
        if (item?.matches === undefined) {
            item.matches = matches;
        }
        cardsMemo[id] = item;
        for (let copies = 1; copies <= item.copies; copies++) {
            for (let i = 1; i <= matches; i++) {
                const newId = id + i;
                if (newId > maxID) {
                    break;
                }
                const newItem = getItem(newId, cardsMemo);
                newItem.copies++;
                cardsMemo[newId] = newItem;
            }
        }
    });
    return (0, add_1.default)(...Object.values(cardsMemo).map(({ copies }) => copies));
};
(0, runAOC_1.default)({ part1, part2 });

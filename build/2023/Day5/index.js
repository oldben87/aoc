"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runAOC_1 = __importDefault(require("../../utils/runAOC"));
const notEmptyString = (val) => !!val && val !== "";
const customDataParser = (rawData) => {
    const result = rawData
        .split("\n\n")
        .reduce((acc, inputItem) => {
        const [key, value] = inputItem.split(":");
        const isSeeds = key === "seeds";
        if (isSeeds) {
            acc.seeds = value.split(" ").filter(notEmptyString).map(Number);
        }
        else {
            const res = value
                .split("\n")
                .filter(notEmptyString)
                .reduce((mapTo, current) => {
                mapTo.push(current
                    .split(" ")
                    .filter((val) => val !== "")
                    .map(Number));
                return mapTo;
            }, []);
            acc.mappings[key] = res;
        }
        return acc;
    }, { seeds: [], mappings: {} });
    return result;
};
const isBetween = (val, min, max) => {
    return val >= min && val <= max;
};
const part1 = (data) => {
    const results = [];
    data.seeds.forEach((seed) => {
        let result = seed;
        Object.values(data.mappings).forEach((mappings) => {
            let hasMapped = false;
            mappings.forEach(([destinationStart, sourceStart, range]) => {
                if (hasMapped) {
                    return;
                }
                const inStartRange = isBetween(result, sourceStart, sourceStart + Math.max(range - 1, 0));
                if (!inStartRange) {
                    return;
                }
                const sourceOffset = destinationStart - sourceStart;
                result += sourceOffset;
                hasMapped = true;
            });
        });
        results.push({ seed, mappedTo: result });
    });
    return Math.min(...results.map(({ mappedTo }) => mappedTo));
};
const getSeedsAsRanges = (seeds) => {
    const parsedSeeds = [];
    for (let i = 0; i < seeds.length; i += 2) {
        parsedSeeds.push({ start: seeds[i], range: seeds[i + 1] });
    }
    return parsedSeeds;
};
const isAValidRangeValue = (value, seeds) => {
    return seeds.some(({ start, range }) => isBetween(value, start, start + range - 1));
};
const reverse = ({ seeds, mappings }) => {
    // start at 0
    // work upwards until true!
    const seedRanges = getSeedsAsRanges(seeds);
    const arrayOfMappings = Object.values(mappings).reverse();
    let lowestLocation;
    let location = -1;
    while (lowestLocation === undefined) {
        location++;
        let result = location;
        arrayOfMappings.forEach((mappings) => {
            let hasMapped = false;
            const mappingsCopy = mappings.map((item) => item).reverse();
            mappingsCopy.forEach(([destinationStart, sourceStart, range]) => {
                if (hasMapped) {
                    return;
                }
                const inDestinationRange = isBetween(result, destinationStart, destinationStart + Math.max(range - 1, 0));
                if (!inDestinationRange) {
                    return;
                }
                const sourceOffset = sourceStart - destinationStart;
                result += sourceOffset;
                hasMapped = true;
            });
        });
        if (isAValidRangeValue(result, seedRanges)) {
            lowestLocation = location;
        }
    }
    return lowestLocation;
};
(0, runAOC_1.default)({ part1, part2: reverse, customDataParser });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add = (...numbers) => {
    return numbers.reduce((total, current) => total + current, 0);
};
exports.default = add;

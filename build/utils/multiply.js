"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multiply = (...numbers) => {
    return numbers.reduce((current, total) => total * current, 1);
};
exports.default = multiply;

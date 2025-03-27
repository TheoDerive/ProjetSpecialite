"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWhereConditions = parseWhereConditions;
function parseWhereConditions(name, value) {
    if (typeof value === "number") {
        return `${name} = ${value}`;
    }
    else if (typeof value === "string") {
        return `${name} = '${value}'`;
    }
    else {
        return `${name} = ${value}`;
    }
}

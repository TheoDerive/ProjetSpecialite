"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateForSQL = void 0;
const formatDateForSQL = (date) => {
    return date.replace("T", " ").replace("Z", ""); // Convertit le format
};
exports.formatDateForSQL = formatDateForSQL;

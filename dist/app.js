"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepo = exports.MembreRepo = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const membresRepo_1 = require("./db/repository/membresRepo");
const membres_1 = require("./routes/membres");
const roleRepository_1 = require("./db/repository/roleRepository");
const roles_1 = require("./routes/roles");
exports.app = (0, express_1.default)();
exports.MembreRepo = new membresRepo_1.MembreRepository();
exports.RoleRepo = new roleRepository_1.RoleRepository();
const PORT = 3000;
exports.app.listen(PORT, (err) => {
    if (!err) {
        console.log("Server runnning");
    }
    else {
        console.error("Server can't start", err);
    }
});
exports.app.use(express_1.default.json());
exports.app.use("/api/membres", membres_1.membreRoute);
exports.app.use("/api/roles", roles_1.roleRoute);

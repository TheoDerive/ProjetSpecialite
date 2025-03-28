"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypeRepo = exports.RoleRepo = exports.CategoryRepo = exports.EvenementRepo = exports.MembreRepo = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const membresRepo_1 = require("./db/repository/membresRepo");
const membres_1 = require("./routes/membres");
const roleRepository_1 = require("./db/repository/roleRepository");
const roles_1 = require("./routes/roles");
const categoriesRepository_1 = require("./db/repository/categoriesRepository");
const category_1 = require("./routes/category");
const eventTypeRepository_1 = require("./db/repository/eventTypeRepository");
const typeEvent_1 = require("./routes/typeEvent");
const evenementRepository_1 = require("./db/repository/evenementRepository");
const evenements_1 = require("./routes/evenements");
exports.app = (0, express_1.default)();
exports.MembreRepo = new membresRepo_1.MembreRepository();
exports.EvenementRepo = new evenementRepository_1.EvenementRepository();
exports.CategoryRepo = new categoriesRepository_1.categoryRepository();
exports.RoleRepo = new roleRepository_1.RoleRepository();
exports.EventTypeRepo = new eventTypeRepository_1.EventTypeRepository();
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
exports.app.use("/api/category", category_1.categoryRoute);
exports.app.use("/api/typesevents", typeEvent_1.typeEventRouter);
exports.app.use("/api/evenements", evenements_1.evenementRoute);

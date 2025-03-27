"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const Role_1 = require("../../classes/Role");
const init_1 = require("../init");
class RoleRepository {
    getAll() {
        return new Promise((resolve, reject) => {
            const roles = [];
            init_1.connection.execute("SELECT * FROM roles", (err, res) => {
                if (err)
                    reject(err);
                if (Array.isArray(res)) {
                    res.forEach((el) => {
                        const new_role = new Role_1.Role(el.id, el.name);
                        roles.push(new_role);
                    });
                }
                resolve(roles);
            });
        });
    }
    getById(id) {
        return new Promise((resolve, reject) => {
            init_1.connection.execute(`SELECT * FROM roles WHERE Id_roles = ${id}`, (err, res) => {
                if (err)
                    reject(err);
                if (res.length === 0) {
                    throw new Error("Pas de role trouver");
                }
                resolve(res[0]);
            });
        });
    }
}
exports.RoleRepository = RoleRepository;

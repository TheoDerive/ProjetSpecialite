"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const Role_1 = require("../../classes/Role");
const parseWhereConditions_1 = require("../../utils/parseWhereConditions");
const init_1 = require("../init");
class RoleRepository {
    getBy(resultParams, params) {
        return new Promise((resolve, reject) => {
            // Start Query
            let startQuery = "SELECT ";
            if (resultParams.length === 0) {
                startQuery += "*";
            }
            else {
                resultParams.forEach((filter, i) => {
                    if (i === 0) {
                        startQuery += `${filter}`;
                    }
                    else {
                        startQuery += `, ${filter}`;
                    }
                });
            }
            // End Query
            let endQuery = " FROM roles Where ";
            if (params.length === 0) {
                endQuery += "1";
            }
            else {
                params.forEach((el, i) => {
                    let result;
                    if (i === 0) {
                        result = (0, parseWhereConditions_1.parseWhereConditions)(el.name, el.value);
                    }
                    else {
                        result = ` AND ${(0, parseWhereConditions_1.parseWhereConditions)(el.name, el.value)}`;
                    }
                    endQuery += result;
                });
            }
            const query = startQuery + endQuery;
            init_1.connection.execute(query, (err, res) => {
                if (err)
                    reject(err);
                const roles = [];
                if (Array.isArray(res)) {
                    res.forEach((el) => {
                        const new_role = new Role_1.Role(el.Id_roles, el.name);
                        roles.push(new_role);
                    });
                }
                else {
                    reject(new Error("La requete n'est pas sous format de tableau."));
                }
                resolve(roles);
            });
        });
    }
}
exports.RoleRepository = RoleRepository;

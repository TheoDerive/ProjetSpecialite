"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoleRepository = void 0;
const parseWhereConditions_1 = require("../../utils/parseWhereConditions");
const init_1 = require("../init");
const GetRole_1 = require("../../classes/GetRole");
const app_1 = require("../../app");
class GetRoleRepository {
    getBy(resultParams_1, params_1) {
        return __awaiter(this, arguments, void 0, function* (resultParams, params, needOtherFetch = true) {
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
            let endQuery = " From get_role Where ";
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
            console.log(query);
            const get_roles = [];
            try {
                const res = yield new Promise((resolve, reject) => {
                    init_1.connection.execute(query, (err, results) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                if (Array.isArray(res)) {
                    for (const el of res) {
                        const new_get_role = new GetRole_1.GetRole(el.id, el.Id_Membre, el.Id_roles, el.Id_Evenement, el.isvalid, el.date);
                        if (needOtherFetch) {
                            try {
                                const [evenement, role, membre] = yield Promise.all([
                                    app_1.EvenementRepo.getBy([], [{ name: "Id_Evenement", value: el.Id_Evenement }]),
                                    app_1.RoleRepo.getBy(["name"], [{ name: "Id_roles", value: el.Id_roles }]),
                                    app_1.MembreRepo.getBy(["firstname", "lastname", "email", "is_admin", "image_url"], [{ name: "Id_Membre", value: el.Id_Membre }]),
                                ]);
                                new_get_role.evenement = evenement[0];
                                new_get_role.roleName = role[0];
                                new_get_role.membre = membre[0];
                            }
                            catch (fetchError) {
                                console.error("Erreur lors de la récupération des données associées :", fetchError);
                                // Gérer l'erreur ici (par exemple, définir des valeurs par défaut ou ignorer l'élément)
                            }
                        }
                        get_roles.push(new_get_role);
                    }
                }
                else {
                    throw new Error("La requête n'a pas renvoyé un tableau.");
                }
            }
            catch (error) {
                console.error("Erreur lors de l'exécution de la requête principale :", error);
                // Gérer l'erreur ici (par exemple, renvoyer un tableau vide ou une erreur)
            }
            return get_roles;
        });
    }
    add(getRole) {
        return new Promise((resolve, reject) => {
            const { id, Id_Membre, Id_roles, Id_Evenement, date, isvalid } = getRole;
            const query = `
      INSERT INTO get_role 
      (id, Id_Evenement, Id_roles, Id_Membre, date, isvalid) 
      VALUES (${id}, ${Id_Evenement}, ${Id_roles}, ${Id_Membre}, '${date}', ${isvalid})
    `;
            init_1.connection.execute(query, (err, res) => {
                if (err)
                    reject(err);
                const new_get_role = new GetRole_1.GetRole(id, Id_Membre, Id_roles, Id_Evenement, isvalid, date);
                resolve(new_get_role);
            });
        });
    }
    update(id, new_get_role) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = true;
            const { Id_roles, Id_Membre, Id_Evenement, isvalid } = new_get_role;
            const query = `UPDATE get_role SET Id_roles=${Id_roles}, Id_Membre=${Id_Membre}, Id_Evenement=${Id_Evenement} WHERE id=${id}`;
            try {
                yield new Promise((resolve, reject) => {
                    init_1.connection.execute(query, (err) => {
                        if (err) {
                            valid = false;
                            reject(err);
                        }
                        resolve();
                    });
                });
            }
            catch (error) {
                console.error(error);
            }
            return valid;
        });
    }
    valid(id, isValid) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = true;
            const query = `UPDATE get_role SET isvalid=${isValid} WHERE id=${id}`;
            try {
                yield new Promise((resolve, reject) => {
                    init_1.connection.execute(query, (err) => {
                        if (err) {
                            valid = false;
                            reject(err);
                        }
                        resolve();
                    });
                });
            }
            catch (error) {
                console.error(error);
            }
            return valid;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = true;
            const query = `DELETE from get_role WHERE id=${id}`;
            try {
                yield new Promise((resolve, reject) => {
                    init_1.connection.execute(query, (err, res) => {
                        if (err) {
                            valid = false;
                            reject(err);
                        }
                        resolve();
                    });
                });
            }
            catch (error) {
                console.log(error);
            }
            return valid;
        });
    }
    deleteFromMembre(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = true;
            const query = `DELETE from get_role WHERE Id_Membre=${id}`;
            try {
                yield new Promise((resolve, reject) => {
                    init_1.connection.execute(query, (err, res) => {
                        if (err) {
                            valid = false;
                            reject(err);
                        }
                        resolve();
                    });
                });
            }
            catch (error) {
                console.log(error);
            }
            return valid;
        });
    }
    deleteFromEvenement(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = true;
            const query = `DELETE from get_role WHERE Id_Evenement=${id}`;
            try {
                yield new Promise((resolve, reject) => {
                    init_1.connection.execute(query, (err, res) => {
                        if (err) {
                            valid = false;
                            reject(err);
                        }
                        resolve();
                    });
                });
            }
            catch (error) {
                console.log(error);
            }
            return valid;
        });
    }
}
exports.GetRoleRepository = GetRoleRepository;

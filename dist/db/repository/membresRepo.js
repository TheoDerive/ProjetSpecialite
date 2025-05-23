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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembreRepository = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const init_1 = require("../init");
const Membre_1 = require("../../classes/Membre");
const parseWhereConditions_1 = require("../../utils/parseWhereConditions");
class MembreRepository {
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
            let endQuery = " FROM Membre Where ";
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
                if (err) {
                    init_1.connection.end();
                    reject(err);
                }
                ;
                const membres = [];
                if (Array.isArray(res)) {
                    res.forEach((el) => {
                        const new_membre = new Membre_1.Membre(el.Id_Membre, el.firstname, el.lastname, el.is_admin, el.email, el.image_url, el.password, el.token);
                        membres.push(new_membre);
                    });
                }
                else {
                    init_1.connection.end();
                    reject(new Error("La requete n'est pas sous format de tableau."));
                }
                resolve(membres);
            });
        });
    }
    add(membre) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield bcrypt_1.default.genSalt();
                const hashedPassword = yield bcrypt_1.default.hash(membre.password, salt);
                const query = `
      INSERT INTO Membre 
      (is_admin, firstname, lastname, email, password, image_url, token) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
                init_1.connection.execute(query, [
                    membre.is_admin,
                    membre.firstname,
                    membre.lastname,
                    membre.email.toLowerCase(),
                    hashedPassword,
                    membre.image_url,
                    membre.token
                ]);
                return new Membre_1.Membre(membre.id, membre.firstname, membre.lastname, membre.is_admin, membre.email, membre.image_url, "", membre.token);
            }
            catch (err) {
                init_1.connection.end();
                throw new Error(`Erreur lors de l'ajout du membre : ${err}`);
            }
        });
    }
    updateEmail(email, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let isValid = true;
            const query = `
      UPDATE Membre
SET email = '${email}'
WHERE Id_Membre = ${id};
    `;
            init_1.connection.execute(query, (err, res) => {
                if (err)
                    isValid = false;
            });
            return isValid;
        });
    }
    updatePassword(newPassword, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
            let isValid = true;
            const query = `
      UPDATE Membre
SET password = '${hashedPassword}'
WHERE Id_Membre = ${id};
    `;
            init_1.connection.execute(query, (err, res) => {
                if (err)
                    isValid = false;
            });
            return isValid;
        });
    }
    login(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let isValid = true;
            const query = `
      UPDATE Membre
SET token = '${token}'
WHERE Id_Membre = ${id};
    `;
            console.log(query);
            init_1.connection.execute(query, (err, res) => {
                if (err)
                    isValid = false;
            });
            return isValid;
        });
    }
    logout(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let isValid = true;
            const query = `
      UPDATE Membre
SET token = null
WHERE Id_Membre = ${id};
    `;
            init_1.connection.execute(query, (err, res) => {
                if (err)
                    isValid = false;
            });
            return isValid;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = true;
            const query = `DELETE from Membre WHERE Id_Membre=${id}`;
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
exports.MembreRepository = MembreRepository;

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
    getAll() {
        return new Promise((resolve, reject) => {
            init_1.connection.execute("SELECT * FROM Membre", (err, res) => {
                if (err)
                    reject(err);
                const membres = [];
                if (Array.isArray(res)) {
                    res.forEach((el) => {
                        const new_membre = new Membre_1.Membre(el.Id_Membre, el.firstname, el.lastname, el.is_admin, el.email, el.image_url);
                        membres.push(new_membre);
                    });
                }
                else {
                    reject(new Error("La requete n'est pas sous format de tableau."));
                }
                resolve(membres);
            });
        });
    }
    getById(id) {
        return new Promise((resolve, reject) => {
            init_1.connection.execute(`SELECT * FROM Membre WHERE Id_Membre = ${id}`, (err, res) => {
                if (err)
                    reject(err);
                if (res === undefined) {
                    throw new Error("User not found");
                }
                const response = res[0];
                const new_membre = new Membre_1.Membre(response.Id_Membre, response.firstname, response.lastname, response.is_admin, response.email, response.image_url);
                resolve(new_membre);
            });
        });
    }
    getBy(params) {
        return new Promise((resolve, reject) => {
            let query = `
        Select * from Membre Where `;
            params.forEach((el, i) => {
                let result;
                if (i === 0) {
                    result = (0, parseWhereConditions_1.parseWhereConditions)(el.name, el.value);
                }
                else {
                    result = ` AND ${(0, parseWhereConditions_1.parseWhereConditions)(el.name, el.value)}`;
                }
                query += result;
            });
            init_1.connection.execute(query, (err, res) => {
                if (err)
                    reject(err);
                const membres = [];
                if (Array.isArray(res)) {
                    res.forEach((el) => {
                        const new_membre = new Membre_1.Membre(el.Id_Membre, el.firstname, el.lastname, el.is_admin, el.email, el.image_url);
                        membres.push(new_membre);
                    });
                }
                else {
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
      (Id_Membre, is_admin, firstname, lastname, email, password, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
                init_1.connection.execute(query, [
                    membre.id,
                    membre.is_admin,
                    membre.firstname,
                    membre.lastname,
                    membre.email.toLowerCase(),
                    hashedPassword,
                    membre.image_url,
                ]);
                return new Membre_1.Membre(membre.id, membre.firstname, membre.lastname, membre.is_admin, membre.email, membre.image_url);
            }
            catch (err) {
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
    getPassword(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                init_1.connection.execute(`SELECT password FROM Membre WHERE Id_Membre = ${id}`, (err, res) => {
                    if (err)
                        reject(err);
                    if (res === undefined) {
                        throw new Error("User not found");
                    }
                    const response = res[0];
                    resolve(response.password);
                });
            });
        });
    }
}
exports.MembreRepository = MembreRepository;

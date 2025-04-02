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
exports.EvenementRepository = void 0;
const Evenement_1 = require("../../classes/Evenement");
const parseWhereConditions_1 = require("../../utils/parseWhereConditions");
const init_1 = require("../init");
const formatDate_1 = require("../../utils/formatDate");
class EvenementRepository {
    getBy(resultParams, params) {
        return new Promise((resolve, reject) => {
            // Start Query
            let startQuery = "SELECT ";
            if (resultParams.length === 0) {
                startQuery += "Evenement.Id_Evenement, Evenement.creation_date, Evenement.Name, Evenement.date, Evenement.desc_, Evenement.adresse, Category.name as category_name, type_event.name as type_event_name";
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
            let midQuery = `
          FROM Evenement INNER JOIN Category ON Evenement.Id_Category = Category.Id_Category
          INNER JOIN type_event ON Evenement.Id_type_event = type_event.Id_type_event
      `;
            // End Query
            let endQuery = " Where ";
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
            const query = startQuery + midQuery + endQuery;
            init_1.connection.execute(query, (err, res) => {
                if (err)
                    reject(err);
                const evenements = [];
                if (Array.isArray(res)) {
                    res.forEach((el) => {
                        const new_evenement = new Evenement_1.Evenement(el.Id_Evenement, el.Name, el.date, el.desc_, el.adresse, el.creation_date, el.Id_Category, el.Id_type_event);
                        new_evenement.categoryName = el.category_name;
                        new_evenement.type_eventName = el.type_event_name;
                        evenements.push(new_evenement);
                    });
                }
                else {
                    reject(new Error("La requete n'est pas sous format de tableau."));
                }
                resolve(evenements);
            });
        });
    }
    add(evenement) {
        return new Promise((resolve, reject) => {
            const { date, Id_Category, Id_type_event, Id_Evenement, creation_date, adresse, desc_, Name, } = evenement;
            const query = `
      INSERT INTO Evenement 
      (Id_Evenement, Name, date, desc_, adresse, creation_date, Id_Category, Id_type_event) 
      VALUES (${Id_Evenement}, '${Name}', '${(0, formatDate_1.formatDateForSQL)(date)}', '${desc_}', '${adresse}', '${(0, formatDate_1.formatDateForSQL)(creation_date)}', ${Id_Category}, ${Id_type_event})
    `;
            init_1.connection.execute(query, (err, res) => {
                if (err)
                    reject(err);
                const new_evenement = new Evenement_1.Evenement(Id_Evenement, Name, date, desc_, adresse, creation_date, Id_Category, Id_type_event);
                resolve(new_evenement);
            });
        });
    }
    update(id, newValues) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = true;
            const { date, Id_type_event, Id_Category, adresse, desc_, Name } = newValues;
            const query = `UPDATE Evenement SET Name='${Name}', date='${date}', desc_='${desc_}', adresse='${adresse}', Id_Category=${Id_Category}, Id_type_event=${Id_type_event} WHERE Id_Evenement=${id}`;
            try {
                yield new Promise((resolve, reject) => {
                    init_1.connection.execute(query, (err, res) => {
                        if (res === undefined) {
                            valid = false;
                            reject(err);
                        }
                        resolve();
                    });
                });
            }
            catch (error) {
                console.error("Erreur lors de la mise à jour :", error);
            }
            return valid;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = true;
            const query = `DELETE from Evenement WHERE Id_Evenement=${id}`;
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
exports.EvenementRepository = EvenementRepository;

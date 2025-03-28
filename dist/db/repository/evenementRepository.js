"use strict";
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
            let endQuery = " FROM Evenement Where ";
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
                const evenements = [];
                if (Array.isArray(res)) {
                    res.forEach((el) => {
                        const new_evenement = new Evenement_1.Evenement(el.Id_Evenement, el.Name, el.date, el.desc_, el.adresse, el.creation_date, el.Id_Category, el.Id_type_event);
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
            const { date, Id_Category, Id_type_event, Id_Evenement, creation_date, adresse, desc_, Name } = evenement;
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
}
exports.EvenementRepository = EvenementRepository;

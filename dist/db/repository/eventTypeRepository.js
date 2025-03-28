"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypeRepository = void 0;
const init_1 = require("../init");
const Type_Event_1 = require("../../classes/Type_Event");
const parseWhereConditions_1 = require("../../utils/parseWhereConditions");
class EventTypeRepository {
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
            let endQuery = " FROM type_event Where ";
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
                const type_events = [];
                if (Array.isArray(res)) {
                    res.forEach((el) => {
                        const new_type_event = new Type_Event_1.TypeEvent(el.Id_type_event, el.name);
                        type_events.push(new_type_event);
                    });
                }
                else {
                    reject(new Error("La requete n'est pas sous format de tableau."));
                }
                resolve(type_events);
            });
        });
    }
}
exports.EventTypeRepository = EventTypeRepository;

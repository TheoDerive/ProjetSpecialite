"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRepository = void 0;
const init_1 = require("../init");
const Category_1 = require("../../classes/Category");
const parseWhereConditions_1 = require("../../utils/parseWhereConditions");
class categoryRepository {
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
            let endQuery = " FROM Category Where ";
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
                const categories = [];
                if (Array.isArray(res)) {
                    res.forEach((el) => {
                        const new_category = new Category_1.Category(el.Id_Category, el.name);
                        categories.push(new_category);
                    });
                }
                else {
                    reject(new Error("La requete n'est pas sous format de tableau."));
                }
                resolve(categories);
            });
        });
    }
}
exports.categoryRepository = categoryRepository;

import { MysqlError } from "mysql";
import { connection } from "../init";
import { CategoriesRepoInterface } from "../../interfaces/CategoriesInterface";
import { Category } from "../../classes/Category";
import { CategType } from "../../types/CategoryTypes";
import { filterParamsType, resultParamsType } from "../../types/usefullTypes";
import { parseWhereConditions } from "../../utils/parseWhereConditions";

export class categoryRepository implements CategoriesRepoInterface {
  getBy(
    resultParams: resultParamsType,
    params: filterParamsType[],
  ): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      // Start Query
      let startQuery = "SELECT ";

      if (resultParams.length === 0) {
        startQuery += "*";
      } else {
        resultParams.forEach((filter, i) => {
          if (i === 0) {
            startQuery += `${filter}`;
          } else {
            startQuery += `, ${filter}`;
          }
        });
      }

      // End Query
      let endQuery = " FROM Category Where ";

      if (params.length === 0) {
        endQuery += "1";
      } else {
        params.forEach((el, i) => {
          let result;

          if (i === 0) {
            result = parseWhereConditions(el.name, el.value);
          } else {
            result = ` AND ${parseWhereConditions(el.name, el.value)}`;
          }

          endQuery += result;
        });
      }

      const query = startQuery + endQuery;

      connection.execute(
        query,
        (err: MysqlError | Error | null, res: CategType[]) => {
          if (err) reject(err);

          const categories: Category[] = [];

          if (Array.isArray(res)) {
            res.forEach((el: CategType) => {
              const new_category = new Category(
                el.Id_Category,
                el.name
              );

              categories.push(new_category);
            });
          } else {
            reject(new Error("La requete n'est pas sous format de tableau."));
          }

          resolve(categories);
        },
      );
    });
  }
}

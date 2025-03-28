import { MysqlError } from "mysql";
import { Role } from "../../classes/Role";
import { RoleRepoInterface } from "../../interfaces/RolesInterface";
import { RoleType } from "../../types/RoleTypes";
import { filterParamsType, resultParamsType } from "../../types/usefullTypes";
import { parseWhereConditions } from "../../utils/parseWhereConditions";
import { connection } from "../init";

export class RoleRepository implements RoleRepoInterface {
  getBy(
    resultParams: resultParamsType,
    params: filterParamsType[],
  ): Promise<Role[]> {
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
      let endQuery = " FROM roles Where ";

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
        (err: MysqlError | Error | null, res: RoleType[]) => {
          if (err) reject(err);

          const roles: Role[] = [];

          if (Array.isArray(res)) {
            res.forEach((el: RoleType) => {
              const new_role = new Role(el.Id_roles, el.name);

              roles.push(new_role);
            });
          } else {
            reject(new Error("La requete n'est pas sous format de tableau."));
          }

          resolve(roles);
        },
      );
    });
  }
}

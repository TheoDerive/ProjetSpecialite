import { MysqlError } from "mysql";
import { GetRoleRepoInterface } from "../../interfaces/GetRoleRepoInterface";
import { getRoleType, UpdateGetRoleType } from "../../types/getRolesType";
import { filterParamsType, resultParamsType } from "../../types/usefullTypes";
import { parseWhereConditions } from "../../utils/parseWhereConditions";
import { connection } from "../init";
import { GetRole } from "../../classes/GetRole";
import { EvenementRepo, MembreRepo, RoleRepo } from "../../app";
import { formatDateForSQL } from "../../utils/formatDate";

export class GetRoleRepository implements GetRoleRepoInterface {
  async getBy(
    resultParams: resultParamsType,
    params: filterParamsType[],
    needOtherFetch = true,
  ): Promise<GetRole[]> {
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

    let endQuery = " From get_role Where ";

    console.log(params);
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

    console.log(query);

    const get_roles = [];

    try {
      const res = await new Promise((resolve, reject) => {
        connection.execute(query, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      if (Array.isArray(res)) {
        for (const el of res) {
          const new_get_role = new GetRole(
            el.id,
            el.Id_Membre,
            el.Id_roles,
            el.Id_Evenement,
            el.isvalid,
            el.date,
          );

          if (needOtherFetch) {
            try {
              const [evenement, role, membre] = await Promise.all([
                EvenementRepo.getBy(
                  [],
                  [{ name: "Id_Evenement", value: el.Id_Evenement }],
                ),
                RoleRepo.getBy(
                  ["name"],
                  [{ name: "Id_roles", value: el.Id_roles }],
                ),
                MembreRepo.getBy(
                  ["firstname", "lastname", "email", "is_admin", "image_url"],
                  [{ name: "Id_Membre", value: el.Id_Membre }],
                ),
              ]);

              new_get_role.evenement = evenement[0];
              new_get_role.roleName = role[0];
              new_get_role.membre = membre[0];
            } catch (fetchError) {
              console.error(
                "Erreur lors de la récupération des données associées :",
                fetchError,
              );
              // Gérer l'erreur ici (par exemple, définir des valeurs par défaut ou ignorer l'élément)
            }
          }

          get_roles.push(new_get_role);
        }
      } else {
        throw new Error("La requête n'a pas renvoyé un tableau.");
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'exécution de la requête principale :",
        error,
      );
      // Gérer l'erreur ici (par exemple, renvoyer un tableau vide ou une erreur)
    }

    return get_roles;
  }

  add(getRole: getRoleType): Promise<GetRole> {
    return new Promise((resolve, reject) => {
      const { id, Id_Membre, Id_roles, Id_Evenement, date, isvalid } = getRole;
      console.log(Id_Membre)

      const query = `
      INSERT INTO get_role 
      ( Id_Evenement, Id_roles, Id_Membre, date, isvalid) 
      VALUES ( ${Id_Evenement}, ${Id_roles}, ${Id_Membre}, '${formatDateForSQL(date)}', ${isvalid})
    `;

      connection.execute(
        query,
        (err: MysqlError | Error | null, res: getRoleType) => {
          if (err) reject(err);

          const new_get_role = new GetRole(
            id,
            Id_Membre,
            Id_roles,
            Id_Evenement,
            isvalid,
            date,
          );

          resolve(new_get_role);
        },
      );
    });
  }

  async update(id: number, new_get_role: UpdateGetRoleType) {
    let valid = true;

    const { Id_roles, Id_Membre, Id_Evenement, isvalid } = new_get_role;

    const query = `UPDATE get_role SET Id_roles=${Id_roles}, Id_Membre=${Id_Membre}, Id_Evenement=${Id_Evenement} WHERE id=${id}`;

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(query, (err: MysqlError | Error | null) => {
          if (err) {
            valid = false;
            reject(err);
          }

          resolve();
        });
      });
    } catch (error) {
      console.error(error);
    }

    return valid;
  }

  async valid(id: number, isValid: number | null) {
    let valid = true;

    const query = `UPDATE get_role SET isvalid=${isValid} WHERE id=${id}`;

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(query, (err: MysqlError | Error | null) => {
          if (err) {
            valid = false;
            reject(err);
          }

          resolve();
        });
      });
    } catch (error) {
      console.error(error);
    }

    return valid;
  }

  async delete(id: number): Promise<boolean> {
    let valid = true;

    const query = `DELETE from get_role WHERE id=${id}`;

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(query, (err: MysqlError | Error | null, res) => {
          if (err) {
            valid = false;
            reject(err);
          }

          resolve();
        });
      });
    } catch (error) {
      console.log(error);
    }

    return valid;
  }

  async deleteFromMembre(id: number): Promise<boolean> {
    let valid = true;

    const query = `DELETE from get_role WHERE Id_Membre=${id}`;

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(query, (err: MysqlError | Error | null, res) => {
          if (err) {
            valid = false;
            reject(err);
          }

          resolve();
        });
      });
    } catch (error) {
      console.log(error);
    }

    return valid;
  }

  async deleteFromEvenement(id: number): Promise<boolean> {
    let valid = true;

    const query = `DELETE from get_role WHERE Id_Evenement=${id}`;

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(query, (err: MysqlError | Error | null, res) => {
          if (err) {
            valid = false;
            reject(err);
          }

          resolve();
        });
      });
    } catch (error) {
      console.log(error);
    }

    return valid;
  }
}

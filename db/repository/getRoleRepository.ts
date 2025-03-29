import { MysqlError } from "mysql";
import { GetRoleRepoInterface } from "../../interfaces/GetRoleRepoInterface";
import { getRoleType, UpdateGetRoleType } from "../../types/getRolesType";
import { filterParamsType, resultParamsType } from "../../types/usefullTypes";
import { parseWhereConditions } from "../../utils/parseWhereConditions";
import { connection } from "../init";
import { GetRole } from "../../classes/GetRole";
import { EvenementRepo, MembreRepo, RoleRepo } from "../../app";

export class GetRoleRepository implements GetRoleRepoInterface {
  async getBy(
    resultParams: resultParamsType,
    params: filterParamsType[],
    needOtherFetch = true,
  ): Promise<GetRole[]> {
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
    let endQuery = " From get_role Where ";

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


    const get_roles: GetRole[] = [];

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(
          query,
          async (err: MysqlError | Error | null, res: getRoleType[]) => {
            if (err) {
              reject(err);
            }

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
                  const evenement = await EvenementRepo.getBy(
                    [],
                    [{ name: "Id_Evenement", value: el.Id_Evenement }],
                  );

                  const role = await RoleRepo.getBy(
                    ["name"],
                    [{ name: "Id_roles", value: el.Id_roles }],
                  );

                  const membre = await MembreRepo.getBy(
                    ["firstname", "lastname", "email", "is_admin", "image_url"],
                    [{ name: "Id_Membre", value: el.Id_Membre }],
                  );

                  new_get_role.evenement = evenement[0];
                  new_get_role.roleName = role[0];
                  new_get_role.membre = membre[0];
                }

                get_roles.push(new_get_role);
              }
            } else {
              throw new Error("La requete n'est pas sous format de tableau.");
            }

            resolve();
          },
        );
      });
    } catch (error) {}

    return get_roles;
  }

  add(getRole: getRoleType): Promise<GetRole> {
    return new Promise((resolve, reject) => {
      const { id, Id_Membre, Id_roles, Id_Evenement, date, isvalid } = getRole;

      const query = `
      INSERT INTO get_role 
      (id, Id_Evenement, Id_roles, Id_Membre, date, isvalid) 
      VALUES (${id}, ${Id_Evenement}, ${Id_roles}, ${Id_Membre}, '${date}', ${isvalid})
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

  async update(id: number, new_get_role: UpdateGetRoleType){
    let valid = true

    const {Id_roles, Id_Membre, Id_Evenement, isvalid} = new_get_role

    const query = `UPDATE get_role SET Id_roles=${Id_roles}, Id_Membre=${Id_Membre}, Id_Evenement=${Id_Evenement} WHERE id=${id}`

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(query, (err: MysqlError | Error | null) => {
          if(err) {
            valid =  false
            reject(err)
          }
          
          resolve()
        })
      }) 
    } catch (error) {
      console.error(error)
    }

    return valid
  }

  async valid(id: number, isValid: number | null){
    let valid = true

    const query = `UPDATE get_role SET isvalid=${isValid} WHERE id=${id}`

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(query, (err: MysqlError | Error | null) => {
          if(err) {
            valid =  false
            reject(err)
          }
          
          resolve()
        })
      }) 
    } catch (error) {
      console.error(error)
    }

    return valid
  }

  async delete(id: number): Promise<boolean> {
    let valid = true  

    const query = `DELETE from get_role WHERE id=${id}`

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(query, (err: MysqlError | Error | null, res) => {
          if(err){
            valid = false
            reject(err)
          }

          resolve()
        }) 
      }) 
    } catch (error) {
      console.log(error) 
    }

    return valid
  }

  async deleteFromMembre(id: number): Promise<boolean> {
    let valid = true  

    const query = `DELETE from get_role WHERE Id_Membre=${id}`

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(query, (err: MysqlError | Error | null, res) => {
          if(err){
            valid = false
            reject(err)
          }

          resolve()
        }) 
      }) 
    } catch (error) {
      console.log(error) 
    }

    return valid
  }

  async deleteFromEvenement(id: number): Promise<boolean> {
    let valid = true  

    const query = `DELETE from get_role WHERE Id_Evenement=${id}`

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(query, (err: MysqlError | Error | null, res) => {
          if(err){
            valid = false
            reject(err)
          }

          resolve()
        }) 
      }) 
    } catch (error) {
      console.log(error) 
    }

    return valid
  }
}

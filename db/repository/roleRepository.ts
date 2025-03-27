import { MysqlError } from "mysql";
import { Role } from "../../classes/Role";
import { RoleRepoInterface } from "../../interfaces/RolesInterface";
import { RoleType } from "../../types/RoleTypes";
import { connection } from "../init";

export class RoleRepository implements RoleRepoInterface {
  getAll(): Promise<Role[]> {
    return new Promise((resolve, reject) => {
      const roles: Role[] = [];

      connection.execute(
        "SELECT * FROM roles",
        (err: MysqlError | Error | null, res: RoleType[]) => {
          if (err) reject(err);

          if (Array.isArray(res)) {
            res.forEach((el: RoleType) => {
              const new_role = new Role(el.id, el.name);

              roles.push(new_role);
            });
          }

          resolve(roles);
        },
      );
    });
  }

  getById(id: number): Promise<RoleType> {
    return new Promise((resolve, reject) => {
      connection.execute(
        `SELECT * FROM roles WHERE Id_roles = ${id}`,
        (err: MysqlError | Error | null, res: RoleType[]) => {
          if (err) reject(err);

          if(res.length === 0){
            throw new Error("Pas de role trouver")
          }

          resolve(res[0]);
        },
      );
    })
  }
}

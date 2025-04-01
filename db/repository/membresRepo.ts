import { MysqlError } from "mysql";
import bcrypt from "bcrypt";

import {
  MembreRepoInterface,
  MembreGetRequest,
} from "../../interfaces/MembreRepoInterface";
import { connection } from "../init";
import { Membre } from "../../classes/Membre";
import { CreateMembreType } from "../../types/MembreTypes";
import { parseWhereConditions } from "../../utils/parseWhereConditions";
import { filterParamsType, resultParamsType } from "../../types/usefullTypes";

export class MembreRepository implements MembreRepoInterface {
  getBy(resultParams: resultParamsType, params:  filterParamsType[]): Promise<Membre[]> {
    return new Promise((resolve, reject) => {

      // Start Query
      let startQuery = "SELECT "

      if(resultParams.length === 0){
        startQuery += "*"
      }else {
        resultParams.forEach((filter, i) => {
          if(i === 0){
            startQuery += `${filter}`
          }else {
            startQuery += `, ${filter}`
          }
        })   
      }

      // End Query
      let endQuery = " FROM Membre Where "
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

      const query = startQuery + endQuery

      connection.execute(query, (err, res: MembreGetRequest[]) => {
        if (err) {
          connection.end()
          reject(err)
        };

        const membres: Membre[] = [];

        if (Array.isArray(res)) {
          res.forEach((el: MembreGetRequest) => {
            const new_membre = new Membre(
              el.Id_Membre,
              el.firstname,
              el.lastname,
              el.is_admin,
              el.email,
              el.image_url,
              el.password,
              el.token
            );

            membres.push(new_membre);
          });
        } else {
          connection.end()
          reject(new Error("La requete n'est pas sous format de tableau."));
        }

        resolve(membres);
      });
    });
  }

  async add(membre: CreateMembreType): Promise<Membre> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(membre.password, salt);

      const query = `
      INSERT INTO Membre 
      (Id_Membre, is_admin, firstname, lastname, email, password, image_url, token) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

      connection.execute(query, [
        membre.id,
        membre.is_admin,
        membre.firstname,
        membre.lastname,
        membre.email.toLowerCase(),
        hashedPassword,
        membre.image_url,
        membre.token
      ]);

      return new Membre(
        membre.id,
        membre.firstname,
        membre.lastname,
        membre.is_admin,
        membre.email,
        membre.image_url,
        "",
        membre.token
      );
    } catch (err) {
          connection.end()
      throw new Error(`Erreur lors de l'ajout du membre : ${err}`);
    }
  }

  async updateEmail(email: string, id: number){
      let isValid = true

      const query = `
      UPDATE Membre
SET email = '${email}'
WHERE Id_Membre = ${id};
    `;

    connection.execute(query, (err, res) => {
      if(err) isValid = false
    })

    return isValid
  }

  async updatePassword(newPassword: string, id: number){
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      let isValid = true

      const query = `
      UPDATE Membre
SET password = '${hashedPassword}'
WHERE Id_Membre = ${id};
    `;

    connection.execute(query, (err, res) => {
      if(err) isValid = false
    })

    return isValid
  }


  async login(id: number, token: string){
      let isValid = true

      const query = `
      UPDATE Membre
SET token = '${token}'
WHERE Id_Membre = ${id};
    `;

    console.log(query)

    connection.execute(query, (err, res) => {
      if(err) isValid = false
    })

    return isValid
  }

  async logout(id: number){
      let isValid = true

      const query = `
      UPDATE Membre
SET token = null
WHERE Id_Membre = ${id};
    `;

    connection.execute(query, (err, res) => {
      if(err) isValid = false
    })

    return isValid
  }

  async delete(id: number): Promise<boolean> {
    let valid = true  

    const query = `DELETE from Membre WHERE Id_Membre=${id}`

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

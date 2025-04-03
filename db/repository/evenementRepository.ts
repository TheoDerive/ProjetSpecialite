import { MysqlError } from "mysql";
import { Evenement } from "../../classes/Evenement";
import { EvenementRepoInterface } from "../../interfaces/EvenementRepoInterface";
import { EvenementType, ResultEvenementType, UpdateEvenementType } from "../../types/EvenementType";
import { parseWhereConditions } from "../../utils/parseWhereConditions";
import { connection } from "../init";
import { filterParamsType, resultParamsType } from "../../types/usefullTypes";
import { formatDateForSQL } from "../../utils/formatDate";

export class EvenementRepository implements EvenementRepoInterface {
  getBy(
    resultParams: resultParamsType,
    params: filterParamsType[],
  ): Promise<Evenement[]> {
    return new Promise((resolve, reject) => {
      // Start Query
      let startQuery = "SELECT ";

      if (resultParams.length === 0) {
        startQuery += "Evenement.Id_Evenement, Evenement.creation_date, Evenement.Name, Evenement.date, Evenement.desc_, Evenement.adresse, Category.name as category_name, type_event.name as type_event_name";
      } else {
        resultParams.forEach((filter, i) => {
          if (i === 0) {
            startQuery += `${filter}`;
          } else {
            startQuery += `, ${filter}`;
          }
        });
      }

      let midQuery = `
          FROM Evenement INNER JOIN Category ON Evenement.Id_Category = Category.Id_Category
          INNER JOIN type_event ON Evenement.Id_type_event = type_event.Id_type_event
      `

      // End Query
      let endQuery = " Where ";

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

      const query = startQuery + midQuery + endQuery;


      connection.execute(
        query,
        (err: MysqlError | Error | null, res: ResultEvenementType[]) => {
          if (err) reject(err);

          const evenements: Evenement[] = [];

          if (Array.isArray(res)) {
            res.forEach((el: ResultEvenementType) => {
              const new_evenement = new Evenement(
                el.Id_Evenement,
                el.Name,
                el.date,
                el.desc_,
                el.adresse,
                el.creation_date,
                el.Id_Category,
                el.Id_type_event,
              );

              new_evenement.categoryName = el.category_name
              new_evenement.type_eventName = el.type_event_name

              evenements.push(new_evenement);
            });
          } else {
            reject(new Error("La requete n'est pas sous format de tableau."));
          }

          resolve(evenements);
        },
      );
    });
  }

  add(evenement: EvenementType): Promise<Evenement> {
    return new Promise((resolve, reject) => {
      const {
        date,
        Id_Category,
        Id_type_event,
        creation_date,
        adresse,
        desc_,
        Name,
      } = evenement;

      const query = `
      INSERT INTO Evenement 
      (Name, date, desc_, adresse, creation_date, Id_Category, Id_type_event) 
      VALUES ('${Name}', '${formatDateForSQL(date)}', '${desc_}', '${adresse}', '${formatDateForSQL(creation_date)}', ${Id_Category}, ${Id_type_event})
    `;

      connection.execute(query, (err, res) => {
        if (err) reject(err);

        const new_evenement = new Evenement(
          0,
          Name,
          date,
          desc_,
          adresse,
          creation_date,
          Id_Category,
          Id_type_event,
        );

        resolve(new_evenement);
      });
    });
  }

  async update(id: number, newValues: UpdateEvenementType) {
    let valid = true;

    const { date, Id_type_event, Id_Category, adresse, desc_, Name } =
      newValues;

    const query = `UPDATE Evenement SET Name='${Name}', date='${date}', desc_='${desc_}', adresse='${adresse}', Id_Category=${Id_Category}, Id_type_event=${Id_type_event} WHERE Id_Evenement=${id}`;

    try {
      await new Promise<void>((resolve, reject) => {
        connection.execute(
          query,
          (err: MysqlError | Error | null, res: EvenementType) => {
            if (res === undefined) {
              valid = false;
              reject(err);
            }

            resolve();
          },
        );
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }

    return valid;
  }


  async delete(id: number): Promise<boolean> {
    let valid = true  

    const query = `DELETE from Evenement WHERE Id_Evenement=${id}`

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

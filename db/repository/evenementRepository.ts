import { MysqlError } from "mysql";
import { Evenement } from "../../classes/Evenement";
import { EvenementRepoInterface } from "../../interfaces/EvenementRepoInterface";
import { EvenementType } from "../../types/EvenementType";
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
      let endQuery = " FROM Evenement Where ";

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
        (err: MysqlError | Error | null, res: EvenementType[]) => {
          if (err) reject(err);

          const evenements: Evenement[] = [];

          if (Array.isArray(res)) {
            res.forEach((el: EvenementType) => {
              const new_evenement = new Evenement(
                el.Id_Evenement,
                el.Name,
                el.date,
                el.desc_,
                el.adresse,
                el.creation_date,
                el.Id_Category,
                el.Id_type_event
              );

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
      const {date,Id_Category,Id_type_event,Id_Evenement, creation_date,adresse,desc_,Name} = evenement

      const query = `
      INSERT INTO Evenement 
      (Id_Evenement, Name, date, desc_, adresse, creation_date, Id_Category, Id_type_event) 
      VALUES (${Id_Evenement}, '${Name}', '${formatDateForSQL(date)}', '${desc_}', '${adresse}', '${formatDateForSQL(creation_date)}', ${Id_Category}, ${Id_type_event})
    `;

      connection.execute(query, (err, res) => {
        if(err) reject(err)

        const new_evenement = new Evenement(
          Id_Evenement,
          Name,
          date,
          desc_,
          adresse,
          creation_date,
          Id_Category,
          Id_type_event
        )

        resolve(new_evenement)
      })

    })  
  }
}

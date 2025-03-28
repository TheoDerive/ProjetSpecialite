import { MysqlError } from "mysql";
import { connection } from "../init";
import { EventTypesRepoInterface } from "../../interfaces/EventsTypeInterface";
import { TypeEvent } from "../../classes/Type_Event";
import { EventsType } from "../../types/EventsTypes";
import { filterParamsType, resultParamsType } from "../../types/usefullTypes";
import { parseWhereConditions } from "../../utils/parseWhereConditions";

export class EventTypeRepository implements EventTypesRepoInterface {
  getBy(
    resultParams: resultParamsType,
    params: filterParamsType[],
  ): Promise<TypeEvent[]> {
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
      let endQuery = " FROM type_event Where ";

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
        (err: MysqlError | Error | null, res: EventsType[]) => {
          if (err) reject(err);

          const type_events: TypeEvent[] = [];

          if (Array.isArray(res)) {
            res.forEach((el: EventsType) => {
              const new_type_event = new TypeEvent(el.Id_type_event, el.name);

              type_events.push(new_type_event);
            });
          } else {
            reject(new Error("La requete n'est pas sous format de tableau."));
          }

          resolve(type_events);
        },
      );
    });
  }
}

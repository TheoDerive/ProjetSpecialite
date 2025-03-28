import { TypeEvent } from "../classes/Type_Event"
import { filterParamsType, resultParamsType } from "../types/usefullTypes"

export interface EventTypesRepoInterface {
  getBy(resultParams: resultParamsType ,params: filterParamsType[]): Promise<TypeEvent[]>
  //
  //add(): Promise<RoleType>
}

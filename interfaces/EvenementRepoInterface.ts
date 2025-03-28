import { Evenement } from "../classes/Evenement";
import { filterParamsType, resultParamsType } from "../types/usefullTypes";
import { EvenementType } from "../types/EvenementType";

export interface EvenementRepoInterface {
  getBy(resultParams: resultParamsType ,params: filterParamsType[]): Promise<Evenement[]>

  add(evenement: EvenementType): Promise<Evenement>
}

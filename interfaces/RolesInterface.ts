import { Role } from "../classes/Role";
import { filterParamsType, resultParamsType } from "../types/usefullTypes";

export interface RoleRepoInterface {
  getBy(resultParams: resultParamsType ,params: filterParamsType[]): Promise<Role[]>
  //
  //add(): Promise<RoleType>
  //
  //update(): Promise<boolean>
}

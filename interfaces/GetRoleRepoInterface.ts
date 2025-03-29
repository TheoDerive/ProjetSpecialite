import { GetRole } from "../classes/GetRole";
import { getRoleType } from "../types/getRolesType";
import { filterParamsType, resultParamsType } from "../types/usefullTypes";

export interface GetRoleRepoInterface {
  getBy(resultParams: resultParamsType ,params: filterParamsType[], needOtherFetch: boolean): Promise<GetRole[]>

  add(getRole: getRoleType): Promise<GetRole>
}

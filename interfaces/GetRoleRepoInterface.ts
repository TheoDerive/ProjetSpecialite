import { GetRole } from "../classes/GetRole";
import { getRoleType, UpdateGetRoleType } from "../types/getRolesType";
import { filterParamsType, resultParamsType } from "../types/usefullTypes";

export interface GetRoleRepoInterface {
  getBy(resultParams: resultParamsType ,params: filterParamsType[], needOtherFetch: boolean): Promise<GetRole[]>

  add(getRole: getRoleType): Promise<GetRole>

  update(id: number, new_get_role: UpdateGetRoleType): Promise<boolean>
  valid(id: number, isValid: number | null): Promise<boolean>

  delete(id: number): Promise<boolean>
}

import { Category } from "../classes/Category";
import { filterParamsType, resultParamsType } from "../types/usefullTypes";

export interface CategoriesRepoInterface {
  getBy(resultParams: resultParamsType, params: filterParamsType[]): Promise<Category[]>
  //
  //add(): Promise<RoleType>
}

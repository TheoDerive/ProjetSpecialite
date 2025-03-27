import { Role } from "../classes/Role";
import { RoleType } from "../types/RoleTypes";

export interface RoleRepoInterface {
  getAll(): Promise<Role[]>
  getById(id: number): Promise<RoleType>
  //
  //add(): Promise<RoleType>
  //
  //update(): Promise<boolean>
}

import { RowDataPacket } from "mysql2";
import { Membre } from "../classes/Membre";
import { CreateMembreType } from "../types/MembreTypes";
import { filterParamsType, resultParamsType } from "../types/usefullTypes";

export interface MembreRepoInterface {
  getBy(resultParams: resultParamsType ,params: filterParamsType[]): Promise<Membre[]>
  
  add(membre: CreateMembreType): Promise<Membre>

  updateEmail(email: string, id: number): Promise<boolean>
  updatePassword(password: string, id: number): Promise<boolean>

}

export interface MembreGetRequest extends RowDataPacket {
  Id_Membre: number
  firstname: string
  lastname: string
  is_admin: number | null
  email: string
  image_url: string
  password: string
}



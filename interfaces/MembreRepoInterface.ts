import { RowDataPacket } from "mysql2";
import { Membre } from "../classes/Membre";
import { CreateMembreType } from "../types/MembreTypes";

export interface MembreRepoInterface {
  getAll(): Promise<Membre[]>
  getById(id: number): Promise<Membre>
  getBy(params: {name:string, value:any}[]): void
  
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



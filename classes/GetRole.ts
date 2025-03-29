import { Evenement } from "./Evenement"
import { Membre } from "./Membre"
import { Role } from "./Role"

export class GetRole {
  private id: number
  private Id_Membre: number
  private Id_roles: number
  private Id_Evenement: number
  private is_valid: boolean | null
  private date: string

  public evenement: Evenement | null
  public membre: Membre | null
  public roleName: string | null

  constructor(id: number, Id_Membre: number, Id_roles: number, Id_Evenement: number, is_valid: boolean | null, date: string ){
    this.id = id
    this.Id_Membre = Id_Membre
    this.Id_roles = Id_roles
    this.Id_Evenement = Id_Evenement
    this.is_valid = is_valid
    this.date = date

    this.roleName = null
    this.evenement = null
    this.membre = null
  }
}

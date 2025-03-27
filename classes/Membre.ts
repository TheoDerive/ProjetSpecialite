import { MembreRepository } from "../db/repository/membresRepo"
import bcrypt from "bcrypt"

export class Membre {
  public id: number

  private firstname: string
  private lastname: string
  private is_admin: number | null
  private email: string
  private image_url: string

  constructor(id: number, firstname: string, lastname: string, is_admin: number | null, email: string, image_url: string){
    this.id = id,

    this.firstname = firstname,
    this.lastname = lastname,
    this.is_admin = is_admin,
    this.email = email,
    this.image_url = image_url
  }
  public membreIsAdmin(){
    if(this.is_admin){
      return true
    }

    return false
  }

  static async memberAlreadyExist(MembreRepo: MembreRepository, params: { name: string, value: any}[]): Promise<boolean> {
    const membre = await MembreRepo.getBy(params)


    if(membre.length > 0){
      return true
    }

    return false
  }

  static async isPasswordValid(password: string, db_password: string){
    return await bcrypt.compare(password, db_password)

  }
}

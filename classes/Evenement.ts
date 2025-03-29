import { CategoryRepo } from "../app"

export class Evenement {
  public id: number

  private name: string
  private date: string
  private desc: string
  private adresse: string
  private creation_date: string

  private Id_Category: number
  private Id_type_event: number

  public categoryName: string
  public type_eventName: string

  constructor(id: number, name: string, date: string, desc: string, adresse: string, creation_date: string, Id_Category: number, Id_type_event: number){
    this.id = id

    this.name = name
    this.date = date
    this.desc = desc
    this.adresse = adresse
    this.creation_date = creation_date
    this.Id_Category = Id_Category,
    this.Id_type_event = Id_type_event


    this.categoryName = ""
    this.type_eventName = ""
  }

  getName(){
    return this.name
  }


  async setCategoryName(){
    const test = await CategoryRepo.getBy(['name'], [{name: "Id_Category", value: this.Id_Category}])
    console.log(test)

    return test[0].getName()
  }

}

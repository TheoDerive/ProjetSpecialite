export class Role {
  public id: number

  private name: string

  constructor(id: number, name: string){
    this.id = id
    this.name = name
  }


  getName(): string {
    return this.name
  }
}

import { Request, Response } from "express";
import { EvenementRepo } from "../app";
import { EvenementType } from "../types/EvenementType";
import { formatDateForSQL } from "../utils/formatDate";

export async function getEvenemets(req: Request, res: Response) {
  const resultParams = req.body.resultParams
  const filterParams = req.body.filterParams

  const result = await EvenementRepo.getBy(resultParams, filterParams)

  res.status(200)
  res.send(JSON.stringify(result))
}

export async function addEvenement(req: Request, res: Response){
  const {Id_type_event, Id_Category,creation_date,desc_,Id_Evenement,adresse,Name,date}: EvenementType = req.body

  const dateAlreadyUsed = await EvenementRepo.getBy(["Name"], [{name: "date", value: formatDateForSQL(date)}])

  if(dateAlreadyUsed.length > 0){
    res.status(400)
    res.send(`La date que vous essayer d'assigner est deja attribuer a l'evenement ${dateAlreadyUsed[0].getName()}`)
  }
  
  const newEvenement: EvenementType = {
    Id_Evenement,
    Name,
    date,
    desc_,
    adresse,
    Id_Category,
    Id_type_event,
    creation_date
  }

  console.log(newEvenement)

  const creation = await EvenementRepo.add(newEvenement)

  res.status(200)
  res.send(JSON.stringify(creation))
}

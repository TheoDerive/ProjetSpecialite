import { Request, Response } from "express";
import { EvenementRepo, GetRoleRepo } from "../app";
import { EvenementType, UpdateEvenementType } from "../types/EvenementType";
import { formatDateForSQL } from "../utils/formatDate";

export async function get(req: Request, res: Response) {
  const resultParams = req.body.resultParams;
  const filterParams = req.body.filterParams;

  const result = await EvenementRepo.getBy(resultParams, filterParams);

  res.status(200);
  res.send(JSON.stringify(result));
}

export async function add(req: Request, res: Response) {
  const {
    Id_type_event,
    Id_Category,
    creation_date,
    desc_,
    Id_Evenement,
    adresse,
    Name,
    date,
  }: EvenementType = req.body;

  const dateAlreadyUsed = await EvenementRepo.getBy(
    ["Name"],
    [{ name: "date", value: formatDateForSQL(date) }],
  );

  if (dateAlreadyUsed.length > 0) {
    res.status(400);
    res.send(
      `La date que vous essayer d'assigner est deja attribuer a l'evenement ${dateAlreadyUsed[0].getName()}`,
    );
  }

  const newEvenement: EvenementType = {
    Id_Evenement,
    Name,
    date,
    desc_,
    adresse,
    Id_Category,
    Id_type_event,
    creation_date,
  };


  const creation = await EvenementRepo.add(newEvenement);

  res.status(200);
  res.send(JSON.stringify(creation));
}

export async function update(req: Request, res: Response) {
  const id = req.params.id;
  const newValues: UpdateEvenementType = req.body.newValues;

  const evenementFind = await EvenementRepo.getBy(
    ["Id_Evenement"],
    [{ name: "Id_Evenement", value: id }],
  );

  if (evenementFind.length === 0) {
    throw new Error("Nous n'avons pas trouver d'evenement");
  }


  const update = await EvenementRepo.update(Number(id), newValues);

  if(!update){
    res.status(500)
    res.send(JSON.stringify({err: "Il y a eu un probleme lors de la mise a jours de votre evenement"}))
  } 

  res.status(200)
  res.send(JSON.stringify({message: "Evenement modifier avec succes"}))
}

export async function erease(req: Request, res: Response) {
  const id = req.params.id;

  const evenement_valid = await EvenementRepo.getBy(
    ["Id_Evenement"],
    [{ name: "Id_Evenement", value: Number(id) }],
  );

  if (evenement_valid.length === 0) {
    res.status(500);
    res.send(
      JSON.stringify({
        err: "L'evenement que vous essayer de supprimer n'existe pas",
      }),
    );
  } else {
    const deleteGetRolesFromEvenement = await GetRoleRepo.deleteFromEvenement(
      Number(id),
    );

    if (!deleteGetRolesFromEvenement) {
    res.status(500);
    res.send(
      JSON.stringify({
        err: "Nous n'avons pas reussi a supprimer les roles auquels l'evenement est assigner, veuillez reessayer",
      }),
    );
    } else {
      const deleteValid = await EvenementRepo.delete(Number(id));

      if (!deleteValid) {
        res.status(500);
        res.send(
          JSON.stringify({
            err: "Nous n'avons pas pu supprimer l'evenement, veuillez reessayer",
          }),
        );
      } else {
        res.status(200);
        res.send(JSON.stringify({ message: "L'evenement a bien ete supprimer" }));
      }
    }
  }
}

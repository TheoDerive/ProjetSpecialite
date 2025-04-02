import { Request, Response } from "express";
import { GetRoleRepo } from "../app";
import { GetRole } from "../classes/GetRole";
import { getRoleType, UpdateGetRoleType } from "../types/getRolesType";

export async function get(req: Request, res: Response) {
  const resultParams = req.body.resultParams;
  const filterParams = req.body.filterParams;
  const needFetch = req.body.needFetch;

  console.log(needFetch)

  const get_roles = await GetRoleRepo.getBy(resultParams, filterParams, needFetch);

  res.status(200);
  res.send(JSON.stringify(get_roles));
}

export async function add(req: Request, res: Response) {
  const new_get_role: getRoleType = req.body;

  const get_role_exist = await GetRoleRepo.getBy(
    ["id"],
    [
      {
        name: "Id_Membre",
        value: new_get_role.Id_Membre,
      },
      {
        name: "Id_Evenement",
        value: new_get_role.Id_Evenement,
      },
    ],
    false,
  );

  if (get_role_exist.length > 0) {
    res.status(400);
    res.send(
      JSON.stringify({ err: "Ce membre a deja un role dans cette evenement" }),
    );
  } else {
    const add_get_role = await GetRoleRepo.add(new_get_role);

    res.status(200);
    res.send(JSON.stringify(add_get_role));
  }
}

export async function update(req: Request, res: Response) {
  const id = req.params.id;

  const newGetRole: UpdateGetRoleType = req.body;

  const get_role_exist = await GetRoleRepo.getBy(
    ["id"],
    [
      {
        name: "Id_Membre",
        value: newGetRole.Id_Membre,
      },
      {
        name: "Id_Evenement",
        value: newGetRole.Id_Evenement,
      },
    ],
    false,
  );

  if (get_role_exist.length > 0) {
    res.status(400);
    res.send(
      JSON.stringify({ err: "Ce membre a deja un role dans cette evenement" }),
    );
  } else {
    const update = await GetRoleRepo.update(Number(id), newGetRole);

    if (update) {
      res.status(200);
      res.send(JSON.stringify({ message: "Les roles ont bien ete modifier" }));
    } else {
      res.status(500);
      res.send(
        JSON.stringify({
          err: "Nous n'avons pas pu modifier les roles, veuillez reessayer",
        }),
      );
    }
  }
}

export async function updateValid(req: Request, res: Response) {
  const id = req.params.id;

  const get_role_isvalid = await GetRoleRepo.getBy(
    ["isvalid"],
    [{ name: "id", value: Number(id) } ], false
  );

  console.log(get_role_isvalid)

  if (get_role_isvalid.length === 0) {
    res.status(400);
    res.send(
      JSON.stringify({ err: "Ce membre a deja un role dans cette evenement" }),
    );
  } else {
    const isvalid = get_role_isvalid[0].getIsValid();
    const returnIsValid = isvalid !== null ? null : 1;

    const updateValid = await GetRoleRepo.valid(Number(id), returnIsValid);

    if (!updateValid) {
      res.status(500);
      res.send(
        JSON.stringify({
          err: "Nous n'avons pas pu modifier les roles, veuillez reessayer",
        }),
      );
    } else {
      res.status(200);
      res.send(JSON.stringify({ message: "Le role a bien ete modifier" }));
    }
  }
}


export async function erease(req: Request, res: Response){
  const id = req.params.id

  const get_role_valid = await GetRoleRepo.getBy(["id"], [{name: "id", value: Number(id)}], false)

  if(get_role_valid.length === 0){
      res.status(500);
      res.send(
        JSON.stringify({
          err: "Le role que vous essayer de supprimer n'existe pas"
        }),
      );
  }else {
    const deleteValid = await GetRoleRepo.delete(Number(id))

    if (!deleteValid) {
      res.status(500);
      res.send(
        JSON.stringify({
          err: "Nous n'avons pas pu supprimer les roles, veuillez reessayer",
        }),
      );
    } else {
      res.status(200);
      res.send(JSON.stringify({ message: "Le role a bien ete supprimer" }));
    }
  }
}

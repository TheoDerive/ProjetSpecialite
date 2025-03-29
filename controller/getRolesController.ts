import { Request, Response } from "express";
import { GetRoleRepo } from "../app";
import { GetRole } from "../classes/GetRole";
import { getRoleType } from "../types/getRolesType";

export async function get(req: Request, res: Response) {
  const resultParams = req.body.resultParams;
  const filterParams = req.body.filterParams;

  const get_roles = await GetRoleRepo.getBy(resultParams, filterParams);

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

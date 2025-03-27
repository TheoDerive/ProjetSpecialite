import { Request, Response } from "express";
import { RoleRepo } from "../app";

export async function getRoles(req: Request, res: Response){
  const response = await RoleRepo.getAll()

  res.status(200)
  res.send(JSON.stringify(response))

}

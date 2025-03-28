import { Request, Response } from "express";
import { RoleRepo } from "../app";

export async function getRoles(req: Request, res: Response){
  const resultParams = req.body.resultParams
  const filterParams = req.body.filterParams

  const response = await RoleRepo.getBy(resultParams, filterParams)

  res.status(200)
  res.send(JSON.stringify(response))
}

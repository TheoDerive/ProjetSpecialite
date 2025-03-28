import { Request, Response } from "express";
import { CategoryRepo } from "../app";

export async function getCategories(req: Request, res: Response) {
  const resultParams = req.body.resultParams
  const filterParams = req.body.filterParams

  const response = await CategoryRepo.getBy(resultParams, filterParams);

  res.status(200);
  res.send(JSON.stringify(response));
}

import { Request, Response } from "express";
import { EventTypeRepo } from "../app";

export async function getEventTypes(req: Request, res: Response) {
  const resultParams = req.body.resultParams
  const filterParams = req.body.filterParams

  const response = await EventTypeRepo.getBy(resultParams, filterParams);

  res.status(200);
  res.send(JSON.stringify(response));
}

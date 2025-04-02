import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MembreRepo } from "../app";

export async function authentification(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log(req.cookies)
    const authToken = req.header("Authorization")!.replace("Wazza ", "");
    const decodeToken = jwt.verify(authToken, "foo");

    if (typeof decodeToken === "string") throw new Error();

    const membreFind = await MembreRepo.getBy(
      ["Id_Membre"],
      [{ name: "Id_Membre", value: decodeToken.id }],
    );

    if(!membreFind) throw new Error()

    next();
  } catch (error) {
    res.status(401).send("Merci de s'identifier'");
  }
}

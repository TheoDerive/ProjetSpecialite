import { Request } from "express";
import { Membre } from "../classes/Membre";

declare module "express-serve-static-core" {
  interface Request {
    user?: Membre
  }
}

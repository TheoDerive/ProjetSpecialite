import { Router } from "express";
import * as EvenementController from "../controller/evenementController";

export const evenementRoute = Router()

evenementRoute.get("/", EvenementController.get)
evenementRoute.post("/", EvenementController.add)
evenementRoute.patch("/:id", EvenementController.update)
evenementRoute.delete("/:id", EvenementController.erease)


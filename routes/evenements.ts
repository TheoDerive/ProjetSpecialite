import { Router } from "express";
import * as EvenementController from "../controller/evenementController";

export const evenementRoute = Router()

evenementRoute.post("/", EvenementController.get)
evenementRoute.post("/new", EvenementController.add)
evenementRoute.patch("/:id", EvenementController.update)
evenementRoute.delete("/:id", EvenementController.erease)


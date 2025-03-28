import { Router } from "express";
import * as EvenementController from "../controller/evenementController";

export const evenementRoute = Router()

evenementRoute.get("/", EvenementController.getEvenemets)
evenementRoute.post("/", EvenementController.addEvenement)


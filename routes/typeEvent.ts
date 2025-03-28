import { Router } from "express";
import * as TypeEventController from "../controller/eventTypeController";

export const typeEventRouter = Router()

typeEventRouter.get("/", TypeEventController.getEventTypes)

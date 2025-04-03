import { Router } from "express";
import * as RoleController from "../controller/roleController";

export const roleRoute = Router()

roleRoute.post("/", RoleController.getRoles)

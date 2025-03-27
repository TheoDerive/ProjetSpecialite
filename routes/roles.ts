import { Router } from "express";
import * as RoleController from "../controller/roleController";

export const roleRoute = Router()

roleRoute.get("/", RoleController.getRoles)

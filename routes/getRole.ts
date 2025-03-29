import { Router } from "express";
import * as GetRoleController from "../controller/getRolesController"

export const getRoleRoute = Router()

getRoleRoute.get("/", GetRoleController.get)
getRoleRoute.post("/", GetRoleController.add)

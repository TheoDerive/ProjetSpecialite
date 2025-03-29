import { Router } from "express";
import * as GetRoleController from "../controller/getRolesController"

export const getRoleRoute = Router()

getRoleRoute.get("/", GetRoleController.get)
getRoleRoute.post("/", GetRoleController.add)
getRoleRoute.patch("/:id", GetRoleController.update)
getRoleRoute.patch("/isvalid/:id", GetRoleController.updateValid)
getRoleRoute.delete("/:id", GetRoleController.erease)

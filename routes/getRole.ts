import { Router } from "express";
import * as GetRoleController from "../controller/getRolesController"

export const getRoleRoute = Router()

getRoleRoute.post("/", GetRoleController.get)
getRoleRoute.post("/new", GetRoleController.add)
getRoleRoute.patch("/:id", GetRoleController.update)
getRoleRoute.patch("/isvalid/:id", GetRoleController.updateValid)
getRoleRoute.delete("/:id", GetRoleController.erease)

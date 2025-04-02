import { Router } from "express";
import * as MembreController from "../controller/membreController";
import { authentification } from "../middleware/authentification";

export const membreRoute = Router()

membreRoute.post("/", authentification, MembreController.getMembers)
membreRoute.post("/signin", MembreController.newMember)
membreRoute.post("/login", MembreController.login)
membreRoute.patch("/logout", authentification, MembreController.logout)
membreRoute.patch("/update/email", authentification, MembreController.updateMemberEmail)
membreRoute.patch("/update/password", authentification, MembreController.updatePassword)
membreRoute.delete("/:id", authentification, MembreController.erease)

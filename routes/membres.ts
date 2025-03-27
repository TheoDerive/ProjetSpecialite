import { Router } from "express";
import * as MembreController from "../controller/membreController";

export const membreRoute = Router()

membreRoute.get("/", MembreController.getMembers)
membreRoute.get("/:id", MembreController.getMemberWithId)
membreRoute.post("/", MembreController.newMember)
membreRoute.patch("/update/email", MembreController.updateMemberEmail)
membreRoute.patch("/update/password", MembreController.updatePassword)

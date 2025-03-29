import express from "express";
import { MembreRepository } from "./db/repository/membresRepo";
import { membreRoute } from "./routes/membres";
import { RoleRepository } from "./db/repository/roleRepository";
import { roleRoute } from "./routes/roles";
import { categoryRepository } from "./db/repository/categoriesRepository";
import { categoryRoute } from "./routes/category";
import { EventTypeRepository } from "./db/repository/eventTypeRepository";
import { typeEventRouter } from "./routes/typeEvent";
import { EvenementRepository } from "./db/repository/evenementRepository";
import { evenementRoute } from "./routes/evenements";
import { GetRoleRepository } from "./db/repository/getRoleRepository";
import { getRoleRoute } from "./routes/getRole";

export const app = express();

export const MembreRepo = new MembreRepository();
export const GetRoleRepo = new GetRoleRepository();
export const EvenementRepo = new EvenementRepository();
export const CategoryRepo = new categoryRepository();
export const RoleRepo = new RoleRepository();
export const EventTypeRepo = new EventTypeRepository();

const PORT = 3000;

app.listen(PORT, (err) => {
  if (!err) {
    console.log("Server runnning");
  } else {
    console.error("Server can't start", err);
  }
});

app.use(express.json())

app.use("/api/membres", membreRoute)
app.use("/api/roles", roleRoute)
app.use("/api/category", categoryRoute)
app.use("/api/typesevents", typeEventRouter)
app.use("/api/evenements", evenementRoute)
app.use("/api/getRole", getRoleRoute)

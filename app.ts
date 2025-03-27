import express from "express";
import { MembreRepository } from "./db/repository/membresRepo";
import { membreRoute } from "./routes/membres";
import { RoleRepository } from "./db/repository/roleRepository";
import { roleRoute } from "./routes/roles";

export const app = express();
export const MembreRepo = new MembreRepository();
export const RoleRepo = new RoleRepository();

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

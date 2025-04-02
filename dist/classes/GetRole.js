"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRole = void 0;
class GetRole {
    constructor(id, Id_Membre, Id_roles, Id_Evenement, is_valid, date) {
        this.id = id;
        this.Id_Membre = Id_Membre;
        this.Id_roles = Id_roles;
        this.Id_Evenement = Id_Evenement;
        this.is_valid = is_valid;
        this.date = date;
        this.roleName = null;
        this.evenement = null;
        this.membre = null;
    }
    getIsValid() {
        return this.is_valid;
    }
}
exports.GetRole = GetRole;

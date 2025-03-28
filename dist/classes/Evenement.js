"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evenement = void 0;
class Evenement {
    constructor(id, name, date, desc, adresse, creation_date, Id_Category, Id_type_event) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.desc = desc;
        this.adresse = adresse;
        this.creation_date = creation_date;
        this.Id_Category = Id_Category,
            this.Id_type_event = Id_type_event;
    }
    getName() {
        return this.name;
    }
}
exports.Evenement = Evenement;

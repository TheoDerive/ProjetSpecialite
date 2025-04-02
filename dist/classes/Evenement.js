"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evenement = void 0;
const app_1 = require("../app");
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
        this.categoryName = "";
        this.type_eventName = "";
    }
    getName() {
        return this.name;
    }
    setCategoryName() {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield app_1.CategoryRepo.getBy(['name'], [{ name: "Id_Category", value: this.Id_Category }]);
            console.log(test);
            return test[0].getName();
        });
    }
}
exports.Evenement = Evenement;

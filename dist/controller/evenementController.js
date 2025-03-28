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
exports.getEvenemets = getEvenemets;
exports.addEvenement = addEvenement;
const app_1 = require("../app");
const formatDate_1 = require("../utils/formatDate");
function getEvenemets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultParams = req.body.resultParams;
        const filterParams = req.body.filterParams;
        const result = yield app_1.EvenementRepo.getBy(resultParams, filterParams);
        res.status(200);
        res.send(JSON.stringify(result));
    });
}
function addEvenement(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Id_type_event, Id_Category, creation_date, desc_, Id_Evenement, adresse, Name, date } = req.body;
        const dateAlreadyUsed = yield app_1.EvenementRepo.getBy(["Name"], [{ name: "date", value: (0, formatDate_1.formatDateForSQL)(date) }]);
        if (dateAlreadyUsed.length > 0) {
            res.status(400);
            res.send(`La date que vous essayer d'assigner est deja attribuer a l'evenement ${dateAlreadyUsed[0].getName()}`);
        }
        const newEvenement = {
            Id_Evenement,
            Name,
            date,
            desc_,
            adresse,
            Id_Category,
            Id_type_event,
            creation_date
        };
        console.log(newEvenement);
        const creation = yield app_1.EvenementRepo.add(newEvenement);
        res.status(200);
        res.send(JSON.stringify(creation));
    });
}

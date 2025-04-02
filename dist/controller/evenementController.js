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
exports.get = get;
exports.add = add;
exports.update = update;
exports.erease = erease;
const app_1 = require("../app");
const formatDate_1 = require("../utils/formatDate");
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        const resultParams = req.body.resultParams;
        const filterParams = req.body.filterParams;
        const result = yield app_1.EvenementRepo.getBy(resultParams, filterParams);
        res.status(200);
        res.send(JSON.stringify(result));
    });
}
function add(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Id_type_event, Id_Category, creation_date, desc_, Id_Evenement, adresse, Name, date, } = req.body;
        const dateAlreadyUsed = yield app_1.EvenementRepo.getBy(["Evenement.Name"], [{ name: "date", value: (0, formatDate_1.formatDateForSQL)(date) }]);
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
            creation_date,
        };
        const creation = yield app_1.EvenementRepo.add(newEvenement);
        res.status(200);
        res.send(JSON.stringify(creation));
    });
}
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const newValues = req.body.newValues;
        const evenementFind = yield app_1.EvenementRepo.getBy(["Id_Evenement"], [{ name: "Id_Evenement", value: id }]);
        if (evenementFind.length === 0) {
            throw new Error("Nous n'avons pas trouver d'evenement");
        }
        const update = yield app_1.EvenementRepo.update(Number(id), newValues);
        if (!update) {
            res.status(500);
            res.send(JSON.stringify({ err: "Il y a eu un probleme lors de la mise a jours de votre evenement" }));
        }
        res.status(200);
        res.send(JSON.stringify({ message: "Evenement modifier avec succes" }));
    });
}
function erease(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const evenement_valid = yield app_1.EvenementRepo.getBy(["Id_Evenement"], [{ name: "Id_Evenement", value: Number(id) }]);
        if (evenement_valid.length === 0) {
            res.status(500);
            res.send(JSON.stringify({
                err: "L'evenement que vous essayer de supprimer n'existe pas",
            }));
        }
        else {
            const deleteGetRolesFromEvenement = yield app_1.GetRoleRepo.deleteFromEvenement(Number(id));
            if (!deleteGetRolesFromEvenement) {
                res.status(500);
                res.send(JSON.stringify({
                    err: "Nous n'avons pas reussi a supprimer les roles auquels l'evenement est assigner, veuillez reessayer",
                }));
            }
            else {
                const deleteValid = yield app_1.EvenementRepo.delete(Number(id));
                if (!deleteValid) {
                    res.status(500);
                    res.send(JSON.stringify({
                        err: "Nous n'avons pas pu supprimer l'evenement, veuillez reessayer",
                    }));
                }
                else {
                    res.status(200);
                    res.send(JSON.stringify({ message: "L'evenement a bien ete supprimer" }));
                }
            }
        }
    });
}

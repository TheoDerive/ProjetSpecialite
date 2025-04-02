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
exports.updateValid = updateValid;
exports.erease = erease;
const app_1 = require("../app");
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultParams = req.body.resultParams;
        const filterParams = req.body.filterParams;
        const needFetch = req.body.needFetch;
        console.log(needFetch);
        const get_roles = yield app_1.GetRoleRepo.getBy(resultParams, filterParams, needFetch);
        res.status(200);
        res.send(JSON.stringify(get_roles));
    });
}
function add(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const new_get_role = req.body;
        const get_role_exist = yield app_1.GetRoleRepo.getBy(["id"], [
            {
                name: "Id_Membre",
                value: new_get_role.Id_Membre,
            },
            {
                name: "Id_Evenement",
                value: new_get_role.Id_Evenement,
            },
        ], false);
        if (get_role_exist.length > 0) {
            res.status(400);
            res.send(JSON.stringify({ err: "Ce membre a deja un role dans cette evenement" }));
        }
        else {
            const add_get_role = yield app_1.GetRoleRepo.add(new_get_role);
            res.status(200);
            res.send(JSON.stringify(add_get_role));
        }
    });
}
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const newGetRole = req.body;
        const get_role_exist = yield app_1.GetRoleRepo.getBy(["id"], [
            {
                name: "Id_Membre",
                value: newGetRole.Id_Membre,
            },
            {
                name: "Id_Evenement",
                value: newGetRole.Id_Evenement,
            },
        ], false);
        if (get_role_exist.length > 0) {
            res.status(400);
            res.send(JSON.stringify({ err: "Ce membre a deja un role dans cette evenement" }));
        }
        else {
            const update = yield app_1.GetRoleRepo.update(Number(id), newGetRole);
            if (update) {
                res.status(200);
                res.send(JSON.stringify({ message: "Les roles ont bien ete modifier" }));
            }
            else {
                res.status(500);
                res.send(JSON.stringify({
                    err: "Nous n'avons pas pu modifier les roles, veuillez reessayer",
                }));
            }
        }
    });
}
function updateValid(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const get_role_isvalid = yield app_1.GetRoleRepo.getBy(["isvalid"], [{ name: "id", value: Number(id) }], false);
        console.log(get_role_isvalid);
        if (get_role_isvalid.length === 0) {
            res.status(400);
            res.send(JSON.stringify({ err: "Ce membre a deja un role dans cette evenement" }));
        }
        else {
            const isvalid = get_role_isvalid[0].getIsValid();
            const returnIsValid = isvalid !== null ? null : 1;
            const updateValid = yield app_1.GetRoleRepo.valid(Number(id), returnIsValid);
            if (!updateValid) {
                res.status(500);
                res.send(JSON.stringify({
                    err: "Nous n'avons pas pu modifier les roles, veuillez reessayer",
                }));
            }
            else {
                res.status(200);
                res.send(JSON.stringify({ message: "Le role a bien ete modifier" }));
            }
        }
    });
}
function erease(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const get_role_valid = yield app_1.GetRoleRepo.getBy(["id"], [{ name: "id", value: Number(id) }], false);
        if (get_role_valid.length === 0) {
            res.status(500);
            res.send(JSON.stringify({
                err: "Le role que vous essayer de supprimer n'existe pas"
            }));
        }
        else {
            const deleteValid = yield app_1.GetRoleRepo.delete(Number(id));
            if (!deleteValid) {
                res.status(500);
                res.send(JSON.stringify({
                    err: "Nous n'avons pas pu supprimer les roles, veuillez reessayer",
                }));
            }
            else {
                res.status(200);
                res.send(JSON.stringify({ message: "Le role a bien ete supprimer" }));
            }
        }
    });
}

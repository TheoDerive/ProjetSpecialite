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
exports.getMembers = getMembers;
exports.getMemberWithId = getMemberWithId;
exports.newMember = newMember;
exports.updateMemberEmail = updateMemberEmail;
exports.updatePassword = updatePassword;
const app_1 = require("../app");
const Membre_1 = require("../classes/Membre");
function getMembers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const membres = yield app_1.MembreRepo.getAll();
        res.status(200);
        res.send(JSON.stringify(membres));
    });
}
function getMemberWithId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        const membre = yield app_1.MembreRepo.getById(id);
        res.status(200);
        res.send(JSON.stringify(membre));
    });
}
function newMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const new_member = {
            id: 3,
            email: "Test@gmail.com",
            firstname: "ted",
            image_url: "/",
            is_admin: null,
            lastname: "dre",
            password: "test",
        };
        const membreExist = yield Membre_1.Membre.memberAlreadyExist(app_1.MembreRepo, [
            {
                name: "email",
                value: new_member.email,
            },
        ]);
        if (membreExist) {
            res.status(400);
            res.send(JSON.stringify({ err: "user already exist" }));
        }
        const membre = app_1.MembreRepo.add(new_member).then((membre) => membre);
        res.status(200);
        res.send(JSON.stringify(membre));
    });
}
function updateMemberEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.id;
        const newEmail = req.body.email;
        const membreExist = yield app_1.MembreRepo.getBy([
            { name: "email", value: newEmail },
        ]);
        if (membreExist.length > 0) {
            res.status(400);
            res.send(JSON.stringify({ err: "Votre nouvelle adresse email existe deja" }));
        }
        const update = yield app_1.MembreRepo.updateEmail(newEmail, id);
        if (update) {
            res.status(200);
            res.send(JSON.stringify({ message: "Votre email a bien ete modifer" }));
        }
        else {
            res.status(500);
            res.send(JSON.stringify({
                err: "Il y a eu un probleme lors de la modification de votre adresse email. Veuillez reesseiller",
            }));
        }
    });
}
function updatePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.id;
        const db_password = yield app_1.MembreRepo.getPassword(id);
        const passwordValid = yield Membre_1.Membre.isPasswordValid(req.body.old_password, db_password);
        console.log(passwordValid);
        if (!passwordValid) {
            res.status(400);
            res.send(JSON.stringify({ err: "Mot de passe incorrect" }));
        }
        const update = yield app_1.MembreRepo.updatePassword(req.body.password, id);
        if (update) {
            res.status(200);
            res.send(JSON.stringify({ message: "Votre mot de passe a bien ete modifer" }));
        }
        else {
            res.status(500);
            res.send(JSON.stringify({
                err: "Il y a eu un probleme lors de la modification de votre mot de passe. Veuillez reesseiller",
            }));
        }
    });
}

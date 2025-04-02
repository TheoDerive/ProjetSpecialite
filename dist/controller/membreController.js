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
exports.newMember = newMember;
exports.login = login;
exports.logout = logout;
exports.updateMemberEmail = updateMemberEmail;
exports.updatePassword = updatePassword;
exports.erease = erease;
const app_1 = require("../app");
const Membre_1 = require("../classes/Membre");
function getMembers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultParams = req.body.resultParams;
        const filterParams = req.body.filterParams;
        const membres = yield app_1.MembreRepo.getBy(resultParams, filterParams);
        res.status(200);
        res.send(JSON.stringify(membres));
    });
}
function newMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, firstname, lastname, password, is_admin, image_url } = req.body;
        const membreLength = yield app_1.MembreRepo.getBy([], []);
        const authToken = Membre_1.Membre.createToken(membreLength.length + 1);
        const new_member = {
            id: membreLength.length + 1,
            email,
            firstname,
            lastname,
            password,
            is_admin,
            image_url,
            token: authToken,
        };
        const emailExist = yield Membre_1.Membre.memberAlreadyExist(app_1.MembreRepo, [
            {
                name: "email",
                value: new_member.email,
            },
        ]);
        const personExist = yield Membre_1.Membre.memberAlreadyExist(app_1.MembreRepo, [
            {
                name: "firstname",
                value: new_member.firstname,
            },
            {
                name: "lastname",
                value: new_member.lastname,
            },
        ]);
        if (emailExist || personExist) {
            res.status(400);
            res.send(JSON.stringify({
                err: "Un membre avec les memes informations exite deja",
            }));
        }
        else {
            const membre = yield app_1.MembreRepo.add(new_member);
            res.cookie("token", authToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.status(200);
            res.send(JSON.stringify(membre));
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const emailValid = yield app_1.MembreRepo.getBy(["Id_Membre", "email", "password"], [{ name: "email", value: email }]);
        if (emailValid.length === 0) {
            res.status(400);
            res.send(JSON.stringify({
                err: "L'adresse email que vous chercher n'est pas enregistrer",
            }));
        }
        else {
            const passwordValid = yield Membre_1.Membre.isPasswordValid(password, emailValid[0].getPassword());
            if (!passwordValid) {
                res.status(400);
                res.send(JSON.stringify({
                    err: "L'adresse email et ne mot de passe ne correspondent pas",
                }));
            }
            else {
                const token = Membre_1.Membre.createToken(emailValid[0].id);
                const valid = yield app_1.MembreRepo.login(emailValid[0].id, token);
                res.cookie("token", token, {
                    httpOnly: true,
                    // secure: false,
                    // sameSite: "lax",
                    // path: "/"
                });
                const membre = yield app_1.MembreRepo.getBy(["email", "firstname", "lastname", "Id_Membre", "is_admin", "image_url"], [{ name: "Id_Membre", value: emailValid[0].id }]);
                res.status(200);
                res.send(JSON.stringify({ message: "connection ok", value: membre }));
            }
        }
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.id;
        const membreExist = yield app_1.MembreRepo.getBy([], [{ name: "Id_Membre", value: id }]);
        if (membreExist.length === 0) {
            res.status(400);
            res.send(JSON.stringify({
                err: "Il y a eu une erreur lors de votre requete, veuillez reessayer",
            }));
        }
        else {
            const update = yield app_1.MembreRepo.logout(id);
            if (update) {
                res.status(200);
                res.send(JSON.stringify({ message: "Vous etes bien deconnecter" }));
            }
            else {
                res.status(500);
                res.send(JSON.stringify({
                    err: "Il y a eu un probleme lors de votre deconnection. Veuillez reesseiller",
                }));
            }
        }
    });
}
function updateMemberEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.body.id;
        const newEmail = req.body.email;
        console.log(req.body);
        const membreExist = yield app_1.MembreRepo.getBy([], [{ name: "email", value: newEmail }]);
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
        const db_password = yield app_1.MembreRepo.getBy(["password"], [{ name: "Id_Membre", value: id }]);
        const passwordValid = yield Membre_1.Membre.isPasswordValid(req.body.old_password, db_password[0].getPassword());
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
function erease(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const membre_valid = yield app_1.MembreRepo.getBy(["Id_Membre"], [{ name: "Id_Membre", value: Number(id) }]);
        if (membre_valid.length === 0) {
            res.status(500);
            res.send(JSON.stringify({
                err: "Le membre que vous essayer de supprimer n'existe pas",
            }));
        }
        else {
            const deleteGetRolesFromMembre = yield app_1.GetRoleRepo.deleteFromMembre(Number(id));
            if (!deleteGetRolesFromMembre) {
                res.status(500);
                res.send(JSON.stringify({
                    err: "Nous n'avons pas reussi a supprimer les roles auquels le membre est assigner, veuillez reessayer",
                }));
            }
            else {
                const deleteValid = yield app_1.MembreRepo.delete(Number(id));
                if (!deleteValid) {
                    res.status(500);
                    res.send(JSON.stringify({
                        err: "Nous n'avons pas pu supprimer le membre, veuillez reessayer",
                    }));
                }
                else {
                    res.status(200);
                    res.send(JSON.stringify({ message: "Le membre a bien ete supprimer" }));
                }
            }
        }
    });
}

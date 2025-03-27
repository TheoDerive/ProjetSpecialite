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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Membre = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class Membre {
    constructor(id, firstname, lastname, is_admin, email, image_url) {
        this.id = id,
            this.firstname = firstname,
            this.lastname = lastname,
            this.is_admin = is_admin,
            this.email = email,
            this.image_url = image_url;
    }
    membreIsAdmin() {
        if (this.is_admin) {
            return true;
        }
        return false;
    }
    static memberAlreadyExist(MembreRepo, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const membre = yield MembreRepo.getBy(params);
            if (membre.length > 0) {
                return true;
            }
            return false;
        });
    }
    static isPasswordValid(password, db_password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, db_password);
        });
    }
}
exports.Membre = Membre;

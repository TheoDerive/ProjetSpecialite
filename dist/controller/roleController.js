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
exports.getRoles = getRoles;
const app_1 = require("../app");
function getRoles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultParams = req.body.resultParams;
        const filterParams = req.body.filterParams;
        const response = yield app_1.RoleRepo.getBy(resultParams, filterParams);
        res.status(200);
        res.send(JSON.stringify(response));
    });
}

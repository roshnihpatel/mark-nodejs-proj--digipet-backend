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
const supertest_1 = __importDefault(require("supertest"));
const model_1 = require("../digipet/model");
const server_1 = __importDefault(require("../server"));
/**
 * This file has integration tests for rehoming a digipet.
 *
 * It is intended to test two behaviours:
 *  1. rehome a digipet leads to user no longer having a digipet
 *  2. user is not able to rehome a digipet if they do not have one
 */
describe("when user has a digipet they can rehome the digipet so that they no longer have a digipet. the user cannot repeatedly rehome, if the user currently does not have a digipet", () => {
    // setup: ensure there is no digipet to begin with
    model_1.setDigipet(model_1.INITIAL_DIGIPET);
    test("1st GET /digipet gives stats of the  current digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("happiness", model_1.INITIAL_DIGIPET.happiness);
        expect(response.body.digipet).toHaveProperty("nutrition", model_1.INITIAL_DIGIPET.nutrition);
        expect(response.body.digipet).toHaveProperty("discipline", model_1.INITIAL_DIGIPET.discipline);
    }));
    test("1st GET /digipet/rehome informs them that rehomed their digipet and they no longer have a digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/rehome");
        expect(response.body.message).toMatch(/success/i);
        expect(response.body.message).toMatch(/rehomed/i);
        expect(response.body.digipet).toBeUndefined();
    }));
    test("2nd GET /digipet now informs them that they don't currently have a digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/you don't have a digipet/i);
        expect(response.body.digipet).toBeUndefined();
    }));
    test("2nd GET /digipet/rehome now informs them that they can't rehome as they dont have a digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/rehome");
        expect(response.body.message).not.toMatch(/success/i);
        expect(response.body.message).toMatch(/can't rehome/i);
        expect(response.body.digipet).toBeFalsy();
    }));
});

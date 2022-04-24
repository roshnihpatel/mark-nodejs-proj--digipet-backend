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
 * This file has integration tests for ignoring a digipet.
 *
 * It is intended to test two behaviours:
 *  1. ignoring a digipet leads to decreasing discipline
 *  2. ignoring a digipet leads to decreasing happiness
 *  3. ignoring a digipet leads to decreasing nutrition
 */
describe("When a user trains a digipet repeatedly, its discipline increases by 10 each time until it eventually maxes out at 100", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 60,
            nutrition: 80,
            discipline: 25,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("discipline", 25);
    }));
    test("1st GET /digipet/ignore informs them about the ignore and shows decrease discipline for digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 15);
    }));
    test("2nd GET /digipet/ignore shows continued stats change", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 5);
    }));
    test("3rd GET /digipet/ignore shows discipline hitting a floor of 0", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 0);
    }));
    test("4th GET /digipet/ignore shows no further decrease in discipline", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 0);
    }));
});
describe("When a digipet has zero happiness and nutrition, it is still possible to ignore it and decrease its discipline", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 0,
            nutrition: 0,
            discipline: 50,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("discipline", 50);
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    }));
    test("GET /digipet/ignore shows that discipline remains at 100 but happiness has decreased", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 40);
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    }));
});
describe("When a user ignores a digipet repeatedly, its happiness decreases by 10 each time until it eventually floors out at 0", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 23,
            nutrition: 50,
            discipline: 50,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("happiness", 23);
    }));
    test("1st GET /digipet/ignore informs them about the ignore and shows decreased happiness for digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("happiness", 13);
    }));
    test("2nd GET /digipet/ignore shows continued stats change", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("happiness", 3);
    }));
    test("3rd GET /digipet/ignore shows happiness hitting a floor of 0", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    }));
    test("4th GET /digipet/ignore shows no further decrease in happiness", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    }));
});
describe("When a digipet has zero discipline and nutrition, it is still possible to ignore it and decrease its happiness", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 50,
            nutrition: 0,
            discipline: 0,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("discipline", 0);
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
        expect(response.body.digipet).toHaveProperty("happiness", 50);
    }));
    test("GET /digipet/ignore shows that discipline remains at 100 but happiness has decreased", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 0);
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
        expect(response.body.digipet).toHaveProperty("happiness", 40);
    }));
});
describe("When a user ignores a digipet repeatedly, its nutrition decreases by 10 each time until it eventually floors out at 0", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 33,
            nutrition: 28,
            discipline: 50,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("nutrition", 28);
    }));
    test("1st GET /digipet/ignore informs them about the ignore and shows decreased nutrition for digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 18);
    }));
    test("2nd GET /digipet/ignore shows continued stats change", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 8);
    }));
    test("3rd GET /digipet/ignore shows nutrition hitting a floor of 0", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
    }));
    test("4th GET /digipet/ignore shows no further decrease in nutrition", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
    }));
});
describe("When a digipet has zero discipline, and happiness it is still possible to ignore it and decrease its nutrition", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 0,
            nutrition: 60,
            discipline: 0,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("discipline", 0);
        expect(response.body.digipet).toHaveProperty("nutrition", 60);
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    }));
    test("GET /digipet/ignore shows that discipline remains at 100 but happiness has decreased", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 0);
        expect(response.body.digipet).toHaveProperty("happiness", 0);
        expect(response.body.digipet).toHaveProperty("nutrition", 50);
    }));
});

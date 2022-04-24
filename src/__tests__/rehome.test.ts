import supertest from "supertest";
import { INITIAL_DIGIPET, setDigipet } from "../digipet/model";
import app from "../server";

/**
 * This file has integration tests for rehoming a digipet.
 *
 * It is intended to test two behaviours:
 *  1. rehome a digipet leads to user no longer having a digipet
 *  2. user is not able to rehome a digipet if they do not have one
 */

describe("when user has a digipet they can rehome the digipet so that they no longer have a digipet. the user cannot repeatidlt rehome, if the user currently doesnot have a digipet", () => {
  // setup: ensure there is no digipet to begin with
  setDigipet(INITIAL_DIGIPET);

  test("1st GET /digipet gives stats of the  current digipet", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/digitpet/i);
    expect(response.body.digipet).toHaveProperty(
        "happiness",
        INITIAL_DIGIPET.happiness
      );
      expect(response.body.digipet).toHaveProperty(
        "nutrition",
        INITIAL_DIGIPET.nutrition
      );
      expect(response.body.digipet).toHaveProperty(
        "discipline",
        INITIAL_DIGIPET.discipline
      );
    });
  

  test("1st GET /digipet/rehome informs them that rehomed their digipet and they no longer have a digipet", async () => {
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.message).toMatch(/success/i);
    expect(response.body.message).toMatch(/rehomed/i);
    expect(response.body.digipet).not.toBeDefined()
  });

  test("2nd GET /digipet now informs them that they don't currently have a digipet", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).not.toBeDefined();
  });

  test("2nd GET /digipet/rehome now informs them that they can't rehome as they dont have a digipet", async () => {
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.message).not.toMatch(/success/i);
    expect(response.body.message).toMatch(/can't rehome/i);
    expect(response.body.digipet).not.toBeDefined()
  });
});

import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

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
    const startingDigipet: Digipet = {
      happiness: 60,
      nutrition: 80,
      discipline: 25,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("discipline", 25);
  });

  test("1st GET /digipet/ignore informs them about the ignore and shows decrease discipline for digipet", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 15);
  });

  test("2nd GET /digipet/ignore shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 5);
  });

  test("3rd GET /digipet/ignore shows discipline hitting a floor of 0", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });

  test("4th GET /digipet/ignore shows no further decrease in discipline", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });
});
describe("When a digipet has zero happiness and nutrition, it is still possible to ignore it and decrease its discipline", () => {
    beforeAll(() => {
      // setup: give an initial digipet
      const startingDigipet: Digipet = {
        happiness: 0,
        nutrition: 0,
        discipline: 50,
      };
      setDigipet(startingDigipet);
    });
  
    test("GET /digipet informs them that they have a digipet with expected stats", async () => {
      const response = await supertest(app).get("/digipet");
      expect(response.body.message).toMatch(/your digipet/i);
      expect(response.body.digipet).toHaveProperty("discipline", 50);
      expect(response.body.digipet).toHaveProperty("nutrition", 0);
      expect(response.body.digipet).toHaveProperty("happiness", 0);
    });
  
    test("GET /digipet/ignore shows that discipline remains at 100 but happiness has decreased", async () => {
      const response = await supertest(app).get("/digipet/ignore");
      expect(response.body.digipet).toHaveProperty("discipline", 40);
      expect(response.body.digipet).toHaveProperty("nutrition", 0);
      expect(response.body.digipet).toHaveProperty("happiness", 0);
    });
  })

describe("When a user ignores a digipet repeatedly, its happiness decreases by 10 each time until it eventually floors out at 0", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 23,
      nutrition: 50,
      discipline: 50,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("happiness", 23);
  });

  test("1st GET /digipet/ignore informs them about the ignore and shows decreased happiness for digipet", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 13);
  });

  test("2nd GET /digipet/ignore shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 3);
  });

  test("3rd GET /digipet/ignore shows happiness hitting a floor of 0", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 0);
  });

  test("4th GET /digipet/ignore shows no further decrease in happiness", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 0);
  });
});

describe("When a digipet has zero discipline and nutrition, it is still possible to ignore it and decrease its happiness", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 50,
      nutrition: 0,
      discipline: 0,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("discipline", 0);
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
    expect(response.body.digipet).toHaveProperty("happiness", 50);
  });

  test("GET /digipet/ignore shows that discipline remains at 100 but happiness has decreased", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 0);
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
    expect(response.body.digipet).toHaveProperty("happiness", 40);
  });
});
describe("When a user ignores a digipet repeatedly, its nutrition decreases by 10 each time until it eventually floors out at 0", () => {
    beforeAll(() => {
      // setup: give an initial digipet
      const startingDigipet: Digipet = {
        happiness: 33,
        nutrition: 28,
        discipline: 50,
      };
      setDigipet(startingDigipet);
    });
  
    test("GET /digipet informs them that they have a digipet with expected stats", async () => {
      const response = await supertest(app).get("/digipet");
      expect(response.body.message).toMatch(/your digipet/i);
      expect(response.body.digipet).toHaveProperty("nutrition", 28);
    });
  
    test("1st GET /digipet/ignore informs them about the ignore and shows decreased nutrition for digipet", async () => {
      const response = await supertest(app).get("/digipet/ignore");
      expect(response.body.digipet).toHaveProperty("nutrition", 18);
    });
  
    test("2nd GET /digipet/ignore shows continued stats change", async () => {
      const response = await supertest(app).get("/digipet/ignore");
      expect(response.body.digipet).toHaveProperty("nutrition", 8);
    });
  
    test("3rd GET /digipet/ignore shows nutrition hitting a floor of 0", async () => {
      const response = await supertest(app).get("/digipet/ignore");
      expect(response.body.digipet).toHaveProperty("nutrition", 0);
    });
  
    test("4th GET /digipet/ignore shows no further decrease in nutrition", async () => {
      const response = await supertest(app).get("/digipet/ignore");
      expect(response.body.digipet).toHaveProperty("nutrition", 0);
    });
  });
  
  describe("When a digipet has zero discipline, and happiness it is still possible to ignore it and decrease its nutrition", () => {
    beforeAll(() => {
      // setup: give an initial digipet
      const startingDigipet: Digipet = {
        happiness: 0,
        nutrition: 60,
        discipline: 0,
      };
      setDigipet(startingDigipet);
    });
  
    test("GET /digipet informs them that they have a digipet with expected stats", async () => {
      const response = await supertest(app).get("/digipet");
      expect(response.body.message).toMatch(/your digipet/i);
      expect(response.body.digipet).toHaveProperty("discipline", 0)
      expect(response.body.digipet).toHaveProperty("nutrition", 60);
      expect(response.body.digipet).toHaveProperty("happiness", 0);
    });
  
    test("GET /digipet/ignore shows that discipline remains at 100 but happiness has decreased", async () => {
      const response = await supertest(app).get("/digipet/ignore");
      expect(response.body.digipet).toHaveProperty("discipline", 0);
      expect(response.body.digipet).toHaveProperty("happiness", 0);
      expect(response.body.digipet).toHaveProperty("nutrition", 50)
    });
  });
  

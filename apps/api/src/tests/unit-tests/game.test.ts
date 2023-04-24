/* eslint-env jest */
import "jest";
import supertest from "supertest";
import { app } from "../../index";

const request = supertest(app);
let token: string = "";

beforeAll(async () => {
  const response = await request.post("/api/users/").set("Content-Type", "application/json").send({
    name: "Test3",
    password: "password",
  });
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("token");
  token = response.body.token;
  console.log(token);
});

describe("POST /api/games/", () => {
  test("Test game creation", async () => {
    const response = await request
      .post("/api/games/")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({
        name: "game1",
        deadline: "16:30:00",
        minPlayer: 5,
        maxPlayer: 5,
        wolfProb: 0.4,
        seerProb: 0.5,
        insomProb: 0.6,
        contProb: 0.4,
        spiritProb: 0.6,
        startDay: "08:00:00",
        endDay: "20:00:00",
      });
    expect(response.statusCode).toBe(201);
  });
});

//describe("Scénario ajout -> modification -> suppression d'un tag", () => {
//  describe("POST /bmt/paul/tags", () => {
//    test("Test if post tag works", async () => {});
//  });
//
//  describe(`PUT`, () => {
//    test("Test if put tag works", async () => {});
//  });
//
//  describe(`DELET`, () => {
//    test("Test if delete tag works", async () => {});
//  });
//});

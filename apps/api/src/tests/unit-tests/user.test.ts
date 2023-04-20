/* eslint-env jest */
import "jest";
import supertest from "supertest";
import { app } from "../../index";

const request = supertest(app);
let token: string;

beforeAll(async () => {
  const response = await request.post("/api/users/").set("Content-Type", "application/json").send({
    name: "paul",
    password: "paul",
  });
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("token");
  token = response.body.token;
  console.log(token);
});
describe("GET /bmt/paul/tags", () => {
  test("Test if get tags works with initialized table tag", async () => {});
});

describe("Scénario ajout -> modification -> suppression d'un tag", () => {
  describe("POST /bmt/paul/tags", () => {
    test("Test if post tag works", async () => {});
  });

  describe(`PUT`, () => {
    test("Test if put tag works", async () => {});
  });

  describe(`DELET`, () => {
    test("Test if delete tag works", async () => {});
  });
});

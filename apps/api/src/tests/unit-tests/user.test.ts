/* eslint-env jest */
import "jest";
import supertest from "supertest";
import app from "../../app";
const request = supertest(app);
let token: string = "";

beforeAll(async () => {
  const response = await request.post("/api/users/").set("Content-Type", "application/json").send({
    name: "axelle",
    password: "axelle",
  });
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("token");
  token = response.body.token;
});

describe("Scénario création de deux comptes avec meme nom", () => {
  describe("POST /api/users/ johnny", () => {
    test("Test account creation", async () => {
      const response = await request.post("/api/users/").send({ name: "johnny", password: "john" });
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("User created");
      expect(response.body).toHaveProperty("token");
      token = response.body.token;
    });
  });
  describe("POST /api/users/ johndoe", () => {
    test("Test double account creation", async () => {
      const response = await request
        .post("/api/users/")
        .send({ name: "johnny", password: "johndoe" });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Name already exists");
    });
  });
  test("now delete first account", async () => {
    const response = await request
      .delete("/api/users/")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User Deleted");
  });
});

describe("Test scénario login -> update account", () => {
  describe("POST /api/users/login", () => {
    test("Test login", async () => {
      const response = await request
        .post("/api/users/login")
        .set("Content-Type", "application/json")
        .send({ name: "axelle", password: "axelle" });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("User logged in");
      expect(response.body).toHaveProperty("token");
      token = response.body.token;
    });
  });
  describe("PATCH /api/users/", () => {
    test("Test update account", async () => {
      const response = await request
        .patch("/api/users/")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({ name: "axelle", password: "axelle2" });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("User updated");
      expect(response.body).toHaveProperty("token");
      token = response.body.token;
    });
  });
});

afterAll(async () => {
  const response = await request
    .delete("/api/users/")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json");
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("User Deleted");
});

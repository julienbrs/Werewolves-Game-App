/* eslint-env jest */
import "jest";
import supertest from "supertest";
import { app } from "../../index";

const request = supertest(app);
let token: string = "";

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

describe("POST /api/users/", () => {
  test("Test account creation", async () => {
    const response = await request
      .post("/api/users/")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({ name: "john" , password: "john"});
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User created");
    expect(response.body).toHaveProperty("token");

  });
});

describe("POST /api/users/", () => {
  test("Test double account creation", async () => {
    const response = await request
      .post("/api/users/")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({ name: "john" , password: "johndoe"});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Name already exists");
  });
});

describe("POST /api/users/login", () => {
  test("Test login", async () => {
    const response = await request
      .post("/api/users/login")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({ name: "john" , password: "john"});
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User logged in");
    expect(response.body).toHaveProperty("token");

  });
});

describe("PATCH /api/users/", () => {
  test("Test update account", async () => {
    const response = await request
      .patch("/api/users/")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({ name: "johndoe" , password: "john"});
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User updated");
    expect(response.body).toHaveProperty("token");
  });
});

//describe("DELETE /api/users/", () => {
//  test("Test delete account", async () => {
//    const response = await request
//      .delete("/api/users/")
//      .set("Authorization", `Bearer ${token}`)
//      .set("Content-Type", "application/json")
//    expect(response.statusCode).toBe(201);
//  });
//}); Unsure what to expect here



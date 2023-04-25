import prismaclient from "./client";
let prisma = prismaclient;
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "test") {
  jest.mock("database", () => {
    return {
      ...jest.requireActual("database"),
      PrismaClient: jest.requireActual("prismock").PrismockClient,
    };
  });
}

export default prisma;

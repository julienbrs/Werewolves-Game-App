/*module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./",
  setupFiles: ["dotenv/config"],
  transform: {
    "\\.[jt]s?$": "babel-jest",
  },
};
*/
module.exports = {
  preset: "ts-jest",
  rootDir: "./",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};

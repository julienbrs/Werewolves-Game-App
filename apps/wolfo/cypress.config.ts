import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:19000/",
    projectId: "7ki4yp",
    video: false,
    viewportHeight: 600,
    viewportWidth: 400,
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
});

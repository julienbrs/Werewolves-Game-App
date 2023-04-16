module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["turbo", "prettier", "@react-native-community", "eslint-config-prettier"],
  rules: {
    "react/no-unstable-nested-components": "off",
  },
};

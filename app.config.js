import "dotenv/config";
// If you want to force reading .env.staging, do:
require("dotenv").config({ path: ".env.staging" });

export default {
  expo: {
    name: "grocerystore",
    slug: "grocerystore",
    extra: {
      apiUrl: process.env.API_URL,
      // any other env variables you need
    },
  },
};

import "dotenv/config";
require("dotenv").config({ path: ".env.staging" });

export default {
  expo: {
    name: "GroceryStore",
    slug: "GroceryStore",
    owner: "wahab4529",
    userInterfaceStyle: "automatic",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/premium-meats-logo.png",
    scheme: "myapp",
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: "5da05919-62b7-46cd-9f2c-24ab96eadd49",
      },
      apiUrl: process.env.API_URL || "https://default.api.url",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.premiummeats.grocerystore",
      adaptiveIcon: {
        foregroundImage: "./assets/images/premium-meats-logo.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/premium-meats-logo.png",
    },
    plugins: [
      "expo-router",

      [
        "expo-splash-screen",
        {
          image: "./assets/images/premium-meats-logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};

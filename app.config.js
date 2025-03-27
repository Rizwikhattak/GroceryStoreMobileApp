import "dotenv/config";
require("dotenv").config({ path: ".env.staging" });

export default {
  expo: {
    name: "GroceryStore",
    slug: "GroceryStore",
    owner: "moaaz4529",
    userInterfaceStyle: "automatic",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "myapp",
    newArchEnabled: false,
    extra: {
      eas: {
        projectId: "c0458020-197c-4e3e-8378-145d9ed1897a",
      },
      apiUrl: process.env.API_URL || "https://default.api.url",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.premiummeats.grocerystore",
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/logo.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo.png",
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

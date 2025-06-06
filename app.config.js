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
    icon: "./assets/images/premium-meats-logo.png",
    scheme: "myapp",
    newArchEnabled: true,
    extra: {
      // eas: {
      //   projectId: "c0458020-197c-4e3e-8378-145d9ed1897a",
      // },
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
      [
        "expo-font",
        {
          fonts: ["./assets/fonts/OPTIMA.TTF"],
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};

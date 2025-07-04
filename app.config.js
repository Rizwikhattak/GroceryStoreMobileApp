import "dotenv/config";
require("dotenv").config({ path: ".env.staging" });

export default {
  expo: {
    name: "GroceryStore",
    slug: "GroceryStore",
    owner: "rizwan11493",
    userInterfaceStyle: "automatic",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/premium-meat-logo-1024x1024.png",
    scheme: "myapp",
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: "a04e0037-ab95-4038-8cdf-ca5b9f80854b",
      },
      apiUrl: process.env.API_URL || "https://default.api.url",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.premiummeats.grocerystore",
      adaptiveIcon: {
        foregroundImage: "./assets/images/premium-meat-logo-1024x1024.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/premium-meat-logo-1024x1024.png",
    },
    plugins: [
      "expo-router",

      [
        "expo-splash-screen",
        {
          image: "./assets/images/premium-meat-logo-1024x1024.png",
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

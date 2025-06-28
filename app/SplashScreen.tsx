import React from "react";
import { Image, View } from "react-native";

const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/images/premium-meats-logo.png")}
        style={{ width: 120, height: 120 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

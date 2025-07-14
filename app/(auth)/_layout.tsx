import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // preset
        animationDuration: 280, // ms
        gestureEnabled: true, // keeps swipes responsive
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="ForgetPassword" />
    </Stack>
  );
};

export default _layout;

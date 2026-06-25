import { Stack } from "expo-router";
import React from "react";

const LayoutWrapper = () => {
  //for now hard coded
  const isAuthenticated = false;
  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <React.Fragment>
      <LayoutWrapper />
    </React.Fragment>
  );
};
export default RootLayout;

import {
  GlobalContextProvider,
  useGlobalContext,
} from "@/contextApis/GlobalContext";
import { Stack } from "expo-router";
import React from "react";

const LayoutWrapper = () => {
  const { isLoggedIn } = useGlobalContext();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <GlobalContextProvider>
      <LayoutWrapper />
    </GlobalContextProvider>
  );
}

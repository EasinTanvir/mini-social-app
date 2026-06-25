import {
  GlobalContextProvider,
  useGlobalContext,
} from "@/contextApis/GlobalContext";
import { Stack } from "expo-router";
import React from "react";

const LayoutWrapper = () => {
  const { isLoggedIn } = useGlobalContext();
  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <GlobalContextProvider>
      <LayoutWrapper />
    </GlobalContextProvider>
  );
};
export default RootLayout;

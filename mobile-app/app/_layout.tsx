import {
  GlobalContextProvider,
  useGlobalContext,
} from "@/contextApis/GlobalContext";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const LayoutWrapper = () => {
  const { isLoggedIn, loading } = useGlobalContext();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

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

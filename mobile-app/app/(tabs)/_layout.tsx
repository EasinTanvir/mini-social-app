import { Tabs } from "expo-router";
import React from "react";

const TabLayout = () => {
  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default TabLayout;

import React, { useState } from "react";
import { Tabs } from "expo-router";
import { TabIcon } from "@/components/TabIcon";

import { Platform } from "react-native";
import { BrandHeader } from "@/components/BrandHeader";
import { useGlobalContext } from "@/contextApis/GlobalContext";

const TabLayout = () => {
  const { setUsernameFilter } = useGlobalContext();

  return (
    <Tabs
      screenOptions={{
        header: () => (
          <BrandHeader
            onSearch={(username) => setUsernameFilter(username || undefined)}
          />
        ),
        headerShown: true,

        tabBarShowLabel: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" focused={focused} color={color} label="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="add-circle"
              focused={focused}
              color={color}
              label="Create"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

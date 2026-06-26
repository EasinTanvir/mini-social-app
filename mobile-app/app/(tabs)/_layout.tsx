import React from "react";
import { Tabs } from "expo-router";
import { TabIcon } from "@/components/TabIcon";
import { Platform } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BrandHeader } from "@/components/BrandHeader";
import { useGlobalContext } from "@/contextApis/GlobalContext";

const TabLayout = () => {
  const { setUsernameFilter, unreadCount } = useGlobalContext();

  const insets = useSafeAreaInsets();

  const isIOS = Platform.OS === "ios";

  const bottomPadding = insets.bottom > 0 ? insets.bottom : isIOS ? 20 : 10;
  const tabBarHeight = (isIOS ? 50 : 54) + bottomPadding;

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
          height: tabBarHeight,
          paddingBottom: bottomPadding,
          paddingTop: isIOS ? 5 : 10,
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
      <Tabs.Screen
        name="notification"
        options={{
          tabBarBadge: unreadCount,
          title: "notification",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="notifications"
              focused={focused}
              color={color}
              label="notification"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

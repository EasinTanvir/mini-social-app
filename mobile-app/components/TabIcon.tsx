import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  label: string;
}

export const TabIcon = ({ name, focused, color, label }: TabIconProps) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name={focused ? name : (`${name}-outline` as any)}
        size={24}
        color={color}
      />
      <Text
        style={[styles.label, { color, fontWeight: focused ? "600" : "400" }]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    top: Platform.OS === "ios" ? 10 : 0, // Padding adjustments for iOS bottom notch
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    minWidth: "auto",
  },
});

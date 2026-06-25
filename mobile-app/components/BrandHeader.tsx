import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "@/contextApis/GlobalContext";

export const BrandHeader = () => {
  const insets = useSafeAreaInsets();
  const { logout } = useGlobalContext();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
      <View style={styles.brandWrapper}>
        <Text style={styles.brandText}>
          Source<Text style={styles.brandAccent}>Club</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  brandWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: "#2563EB",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 4,
  },
});

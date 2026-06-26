import React, { useRef, useState, useCallback } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "@/contextApis/GlobalContext";

interface Props {
  onSearch?: (username: string) => void;
}

export const BrandHeader = ({ onSearch }: Props) => {
  const insets = useSafeAreaInsets();
  const { logout } = useGlobalContext();

  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<TextInput>(null);
  const widthAnim = useRef(new Animated.Value(0)).current;
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openSearch = () => {
    if (!onSearch) return;
    setSearchMode(true);
    Animated.spring(widthAnim, {
      toValue: 1,
      useNativeDriver: false,
      bounciness: 0,
    }).start(() => inputRef.current?.focus());
  };

  const closeSearch = useCallback(() => {
    setQuery("");
    onSearch?.("");
    setSearchMode(false);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    Animated.timing(widthAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [onSearch]);

  const handleChangeText = useCallback(
    (text: string) => {
      setQuery(text);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onSearch?.(text.trim());
      }, 400);
    },
    [onSearch],
  );

  const clearQuery = useCallback(() => {
    setQuery("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    onSearch?.("");
  }, [onSearch]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "65%"],
  });

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
      {!searchMode && (
        <View style={styles.brandWrapper}>
          <Text style={styles.brandText}>
            Source<Text style={styles.brandAccent}>Club</Text>
          </Text>
        </View>
      )}

      {searchMode && (
        <Animated.View style={[styles.searchBar, { width: animatedWidth }]}>
          <Ionicons name="search" size={16} color="#6B7280" />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search by username..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={handleChangeText}
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={() => {
              if (debounceTimer.current) clearTimeout(debounceTimer.current);
              onSearch?.(query.trim());
            }}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearQuery}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </Animated.View>
      )}

      <View style={styles.rightActions}>
        {onSearch && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={searchMode ? closeSearch : openSearch}
            activeOpacity={0.7}
          >
            <Ionicons
              name={searchMode ? "close" : "search"}
              size={20}
              color="#2563EB"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    padding: 0,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
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

import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getPosts } from "@/services/post.service";
import { Post } from "@/types/post.types";
import { useGlobalContext } from "@/contextApis/GlobalContext";

const NewsFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useGlobalContext();

  const fetchPosts = useCallback(async () => {
    try {
      const res = await getPosts(token!, 1, 10);

      setPosts(res.posts);
    } catch (error) {
      console.log("Fetch Posts Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={
        posts.length === 0 ? styles.emptyContainer : styles.list
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>No posts found.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.username}>{item.author.username}</Text>

            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <Text style={styles.postText}>{item.text}</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>❤️ {item.likeCount}</Text>

            <Text style={styles.footerText}>💬 {item.commentCount}</Text>
          </View>
        </View>
      )}
    />
  );
};

export default NewsFeed;

const styles = StyleSheet.create({
  list: {
    padding: 15,
  },

  emptyContainer: {
    flexGrow: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  username: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },

  date: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  postText: {
    fontSize: 15,
    color: "#1F2937",
    lineHeight: 22,
  },

  footer: {
    flexDirection: "row",
    marginTop: 18,
    gap: 20,
  },

  footerText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
});

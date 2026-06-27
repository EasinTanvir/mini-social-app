import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Post } from "@/types/post.types";
import CommentSheet from "@/components/CommentSheet";
import PostCard from "@/components/PostCard";
import { useNewsFeed } from "@/hooks/useNewsFeed";

const NewsFeed = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const {
    posts,
    selectedPost,
    usernameFilter,
    loading,
    refreshing,
    loadingMore,
    onRefresh,
    onEndReached,
    handleLike,
    handleCommentAdded,
    openComments,
    closeComments,
  } = useNewsFeed();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <>
      {usernameFilter ? (
        <View style={styles.filterBadge}>
          <Text style={styles.filterText}>
            Showing posts by{" "}
            <Text style={styles.filterUser}>@{usernameFilter}</Text>
          </Text>
        </View>
      ) : null}

      <FlatList
        data={posts}
        keyExtractor={(item: Post) => item.id}
        contentContainerStyle={[
          posts.length === 0 ? styles.emptyContainer : styles.list,
          isTablet && styles.listTablet,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2563EB"
            colors={["#2563EB"]}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              {usernameFilter
                ? `No posts found for @${usernameFilter}`
                : "No posts yet."}
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : null
        }
        renderItem={({ item }: { item: Post }) => (
          <PostCard
            post={item}
            onLike={handleLike}
            onComment={() => openComments(item)}
            isTablet={isTablet}
          />
        )}
      />

      <CommentSheet
        visible={!!selectedPost}
        postId={selectedPost?.id ?? ""}
        comments={selectedPost?.comments ?? []}
        onClose={closeComments}
        onCommentAdded={handleCommentAdded}
      />
    </>
  );
};

export default NewsFeed;

const styles = StyleSheet.create({
  list: { padding: 14, paddingBottom: 30 },
  listTablet: {
    paddingHorizontal: 40,
    maxWidth: 680,
    alignSelf: "center",
    width: "100%",
  },
  emptyContainer: { flexGrow: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  footerLoader: { paddingVertical: 20, alignItems: "center" },
  filterBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DBEAFE",
  },
  filterText: { fontSize: 13, color: "#6B7280" },
  filterUser: { color: "#2563EB", fontWeight: "700" },
});

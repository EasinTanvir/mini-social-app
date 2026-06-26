import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { getPosts, likePost } from "@/services/post.service";
import { Comment, Post } from "@/types/post.types";
import { useGlobalContext } from "@/contextApis/GlobalContext";
import CommentSheet from "@/components/CommentSheet";

const PAGE_LIMIT = 10;

const NewsFeed = () => {
  const { token, usernameFilter, feedRefreshKey } = useGlobalContext();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchingRef = useRef(false);

  const fetchPosts = useCallback(
    async (pageNum: number, replace: boolean, username?: string) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      try {
        const res = await getPosts(token!, pageNum, PAGE_LIMIT, username);
        setPosts((prev) => (replace ? res.posts : [...prev, ...res.posts]));
        setHasNextPage(res.hasNextPage);
        setPage(pageNum);
      } catch (error) {
        console.error("Fetch Posts Error:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        fetchingRef.current = false;
      }
    },
    [token],
  );

  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setPage(1);
    setHasNextPage(true);
    fetchPosts(1, true, usernameFilter);
  }, [usernameFilter, fetchPosts, feedRefreshKey]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts(1, true, usernameFilter);
  }, [fetchPosts, usernameFilter]);

  const onEndReached = useCallback(() => {
    if (!hasNextPage || loadingMore || fetchingRef.current) return;
    setLoadingMore(true);
    fetchPosts(page + 1, false, usernameFilter);
  }, [hasNextPage, loadingMore, page, fetchPosts, usernameFilter]);

  const handleLike = useCallback(
    async (postId: string) => {
      const original = posts.find((p) => p.id === postId);
      if (!original) return;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likedByMe: !p.likedByMe,
                likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1,
              }
            : p,
        ),
      );

      try {
        await likePost(token!, postId);
      } catch {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likedByMe: original.likedByMe,
                  likeCount: original.likeCount,
                }
              : p,
          ),
        );
      }
    },
    [token, posts],
  );

  const handleCommentAdded = useCallback((postId: string, comment: Comment) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              commentCount: p.commentCount + 1,
              comments: [...p.comments, comment],
            }
          : p,
      ),
    );
    setSelectedPost((prev) =>
      prev?.id === postId
        ? {
            ...prev,
            commentCount: prev.commentCount + 1,
            comments: [...prev.comments, comment],
          }
        : prev,
    );
  }, []);

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
        keyExtractor={(item) => item.id}
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
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={handleLike}
            onComment={() => setSelectedPost(item)}
            isTablet={isTablet}
          />
        )}
      />

      <CommentSheet
        visible={!!selectedPost}
        postId={selectedPost?.id ?? ""}
        comments={selectedPost?.comments ?? []}
        onClose={() => setSelectedPost(null)}
        onCommentAdded={handleCommentAdded}
      />
    </>
  );
};

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: () => void;
  isTablet?: boolean;
}

const PostCard = React.memo(
  ({ post, onLike, onComment, isTablet }: PostCardProps) => (
    <View style={[styles.card, isTablet && styles.cardTablet]}>
      <View style={styles.header}>
        <View style={[styles.avatar, isTablet && styles.avatarTablet]}>
          <Text
            style={[styles.avatarText, isTablet && styles.avatarTextTablet]}
          >
            {post.author.username[0].toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={[styles.username, isTablet && styles.usernameTablet]}>
            {post.author.username}
          </Text>
          <Text style={styles.date}>
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      <Text style={[styles.postText, isTablet && styles.postTextTablet]}>
        {post.text}
      </Text>

      <View style={styles.divider} />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onLike(post.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.actionIcon}>{post.likedByMe ? "❤️" : "🤍"}</Text>
          <Text style={[styles.actionText, post.likedByMe && styles.likedText]}>
            {post.likeCount} {post.likeCount === 1 ? "Like" : "Likes"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onComment}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>
            {post.commentCount}{" "}
            {post.commentCount === 1 ? "Comment" : "Comments"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ),
);

PostCard.displayName = "PostCard";

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

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTablet: { padding: 22, borderRadius: 20 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarTablet: { width: 48, height: 48, borderRadius: 24 },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  avatarTextTablet: { fontSize: 19 },
  username: { fontSize: 15, fontWeight: "700", color: "#111827" },
  usernameTablet: { fontSize: 17 },
  date: { fontSize: 12, color: "#9CA3AF", marginTop: 1 },

  postText: { fontSize: 15, color: "#1F2937", lineHeight: 23 },
  postTextTablet: { fontSize: 17, lineHeight: 27 },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },

  actions: { flexDirection: "row", gap: 20 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionIcon: { fontSize: 18 },
  actionText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  likedText: { color: "#EF4444", fontWeight: "700" },
});

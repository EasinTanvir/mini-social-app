import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getPosts, likePost } from "@/services/post.service";
import { Comment, Post } from "@/types/post.types";
import { useGlobalContext } from "@/contextApis/GlobalContext";
import CommentSheet from "@/components/CommentSheet";

const PAGE_LIMIT = 10;

const NewsFeed = () => {
  const { token } = useGlobalContext();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Comment sheet state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Prevent duplicate fetches
  const fetchingRef = useRef(false);

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchPosts = useCallback(
    async (pageNum: number, replace: boolean) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      try {
        const res = await getPosts(token!, pageNum, PAGE_LIMIT);
        setPosts((prev) => (replace ? res.posts : [...prev, ...res.posts]));
        setHasNextPage(res.hasNextPage);
        setPage(pageNum);
      } catch (error) {
        console.log("Fetch Posts Error:", error);
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
    fetchPosts(1, true);
  }, [fetchPosts]);

  // ─── Pull to refresh ──────────────────────────────────────────────────────
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts(1, true);
  }, [fetchPosts]);

  // ─── Infinite scroll ──────────────────────────────────────────────────────
  const onEndReached = useCallback(() => {
    if (!hasNextPage || loadingMore || fetchingRef.current) return;
    setLoadingMore(true);
    fetchPosts(page + 1, false);
  }, [hasNextPage, loadingMore, page, fetchPosts]);

  // ─── Like (optimistic) ────────────────────────────────────────────────────
  const handleLike = useCallback(
    async (postId: string) => {
      // Optimistic update
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
      } catch (e) {
        // Revert on error
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
        console.log("Like error:", e);
      }
    },
    [token],
  );

  // ─── Comment added callback ───────────────────────────────────────────────
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
    // Keep sheet open with updated comments
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

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          posts.length === 0 ? styles.emptyContainer : styles.list
        }
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
            <Text style={styles.emptyText}>No posts yet.</Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={handleLike}
            onComment={() => setSelectedPost(item)}
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

// ─── PostCard (memoised) ──────────────────────────────────────────────────────
interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: () => void;
}

const PostCard = React.memo(({ post, onLike, onComment }: PostCardProps) => (
  <View style={styles.card}>
    {/* Header */}
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {post.author.username[0].toUpperCase()}
        </Text>
      </View>
      <View>
        <Text style={styles.username}>{post.author.username}</Text>
        <Text style={styles.date}>
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>
    </View>

    {/* Body */}
    <Text style={styles.postText}>{post.text}</Text>

    {/* Divider */}
    <View style={styles.divider} />

    {/* Actions */}
    <View style={styles.actions}>
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => onLike(post.id)}
        activeOpacity={0.7}
      >
        <Text style={[styles.actionIcon, post.likedByMe && styles.likedIcon]}>
          {post.likedByMe ? "❤️" : "🤍"}
        </Text>
        <Text style={[styles.actionText, post.likedByMe && styles.likedText]}>
          {post.likeCount} {post.likeCount === 1 ? "Like" : "Likes"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onComment}
        activeOpacity={0.7}
      >
        <Text style={styles.actionIcon}>💬</Text>
        <Text style={styles.actionText}>
          {post.commentCount} {post.commentCount === 1 ? "Comment" : "Comments"}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
));

export default NewsFeed;

const styles = StyleSheet.create({
  list: {
    padding: 14,
    paddingBottom: 30,
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
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },

  // Card
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
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  username: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1,
  },
  postText: {
    fontSize: 15,
    color: "#1F2937",
    lineHeight: 23,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 20,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionIcon: {
    fontSize: 18,
  },
  likedIcon: {},
  actionText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  likedText: {
    color: "#EF4444",
    fontWeight: "700",
  },
});

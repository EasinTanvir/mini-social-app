import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { PostCardProps } from "@/types/post.types";

const PostCard = ({ post, onLike, onComment, isTablet }: PostCardProps) => {
  return (
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
  );
};

export default PostCard;

const styles = StyleSheet.create({
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

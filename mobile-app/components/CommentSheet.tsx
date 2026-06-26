import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Comment } from "@/types/post.types";
import { commentOnPost } from "@/services/post.service";
import { useGlobalContext } from "@/contextApis/GlobalContext";

interface Props {
  visible: boolean;
  postId: string;
  comments: Comment[];
  onClose: () => void;
  onCommentAdded: (postId: string, comment: Comment) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.65;

const CommentSheet = ({
  visible,
  postId,
  comments,
  onClose,
  onCommentAdded,
}: Props) => {
  const { token } = useGlobalContext();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const listRef = useRef<FlatList>(null);

  // ─── Sheet animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // ─── Scroll to end when keyboard opens ───────────────────────────────────
  useEffect(() => {
    const event =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const sub = Keyboard.addListener(event, () => {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => sub.remove();
  }, []);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await commentOnPost(token!, postId, text.trim());
      onCommentAdded(postId, res.comment);
      setText("");
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) {
      console.log("Comment error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Full-screen wrapper — backdrop tap closes, sheet sits at bottom */}
      <View style={styles.wrapper}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}
        />

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          {/*
            KeyboardAvoidingView INSIDE the Modal + behavior="padding"
            is the only combo that works correctly on Android.
            It shrinks the available height so the input stays visible.
          */}
          <KeyboardAvoidingView
            style={styles.kavFill}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          >
            <View style={styles.handleBar} />

            <Text style={styles.title}>Comments ({comments.length})</Text>

            <FlatList
              ref={listRef}
              data={comments}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.commentList}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No comments yet. Be the first!
                </Text>
              }
              renderItem={({ item }) => (
                <View style={styles.commentRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.user.username[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentUsername}>
                      {item.user.username}
                    </Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                  </View>
                </View>
              )}
            />

            <View
              style={[
                styles.inputRow,
                { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                placeholderTextColor="#9CA3AF"
                value={text}
                onChangeText={setText}
                multiline
                maxLength={300}
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  (!text.trim() || submitting) && styles.sendBtnDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!text.trim() || submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CommentSheet;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "flex-end", // keeps sheet pinned to bottom
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden", // clips KAV children to rounded corners
  },
  kavFill: {
    flex: 1, // KAV must fill the sheet so it can shrink
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  commentList: {
    padding: 16,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
  },
  commentRow: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-start",
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 10,
  },
  commentUsername: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    alignItems: "flex-end",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#93C5FD",
  },
  sendText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});

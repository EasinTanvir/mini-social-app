import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
  Platform,
} from "react-native";
import { Comment } from "@/types/post.types";
import { commentOnPost } from "@/services/post.service";
import { useGlobalContext } from "@/contextApis/GlobalContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const useCommentSheet = (
  visible: boolean,
  postId: string,
  onCommentAdded: (postId: string, comment: Comment) => void,
  onClose: () => void,
) => {
  const { token } = useGlobalContext();

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const listRef = useRef<FlatList>(null);

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

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  return {
    text,
    submitting,

    slideAnim,
    listRef,

    setText,
    handleSubmit,
    handleClose,
  };
};

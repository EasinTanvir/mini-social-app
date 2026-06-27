import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardEvent,
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
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList>(null);

  // Sheet open/close animation
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      // Reset keyboard offset when sheet closes
      keyboardOffset.setValue(0);
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Keyboard listeners — push sheet up on Android, scroll list on both
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        toValue: -e.endCoordinates.height,
        duration: Platform.OS === "ios" ? e.duration : 200,
        useNativeDriver: true,
      }).start();

      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const onHide = (e: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: Platform.OS === "ios" ? e.duration : 200,
        useNativeDriver: true,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
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
    keyboardOffset,
    listRef,
    setText,
    handleSubmit,
    handleClose,
  };
};

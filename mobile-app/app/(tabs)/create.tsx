import React, { useEffect, useRef } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";

import FormInput from "@/components/FormInput";
import { useRouter } from "expo-router";
import { useGlobalContext } from "@/contextApis/GlobalContext";
import { createPost } from "@/services/post.service";
import { CreatePostRequest } from "@/types/post.types";

const CreatePost = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<CreatePostRequest>({
    defaultValues: {
      text: "",
    },
  });
  const scrollRef = useRef<ScrollView>(null);

  const text = watch("text");
  const { token, triggerFeedRefresh } = useGlobalContext();
  const router = useRouter();

  const onSubmit = async (payload: CreatePostRequest) => {
    try {
      const data = await createPost(token!, payload.text);
      Alert.alert("Success", data.message);
      reset();
      triggerFeedRefresh();
      router.push("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong",
      );
    }
  };

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => showListener.remove();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Create Post</Text>

            <Text style={styles.subtitle}>Share what's on your mind.</Text>

            <FormInput
              control={control}
              name="text"
              label="Post"
              placeholder="What's happening?"
              multiline
              numberOfLines={7}
              textAlignVertical="top"
              style={styles.textArea}
              maxLength={500}
            />

            <Text style={styles.counter}>{text?.length ?? 0}/500</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Posting..." : "Post"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    maxWidth: 680,
    alignSelf: "center",
    width: "100%",
  },

  content: {
    padding: 20,
    flexGrow: 1,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 24,
    fontSize: 15,
  },

  textArea: {
    height: 170,
    paddingTop: 14,
  },

  counter: {
    alignSelf: "flex-end",
    color: "#6B7280",
    marginBottom: 16,
    marginTop: 6,
  },

  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 16,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});

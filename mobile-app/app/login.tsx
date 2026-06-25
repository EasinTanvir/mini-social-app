import React from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "@/components/FormInput";
import { loginSchema } from "@/validations/auth.validation";
import { LoginRequest } from "@/types/auth.types";
import { loginUser } from "@/services/auth.service";

const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      const res = await loginUser(data);

      console.log(res);

      Alert.alert("Success", res.message);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FormInput
          control={control}
          name="email"
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <FormInput
          control={control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
        />

        <Button
          title={isSubmitting ? "Logging in..." : "Login"}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});

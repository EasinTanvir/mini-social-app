import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";

import FormInput from "@/components/FormInput";
import { registerSchema } from "@/validations/auth.validation";
import { RegisterRequest } from "@/types/auth.types";
import { registerUser } from "@/services/auth.service";

const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const res = await registerUser(data);

      Alert.alert("Success", res.message);

      reset();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong",
      );
    }
  };

  return (
    <LinearGradient colors={["#4F8EF7", "#7B61FF"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Create Account 🚀</Text>

            <Text style={styles.subtitle}>
              Join Mini Social and connect with everyone.
            </Text>

            <FormInput
              control={control}
              name="username"
              label="Username"
              placeholder="Enter your username"
              autoCapitalize="none"
            />

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

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Creating Account..." : "Register"}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>

              <Link href="/login" style={styles.link}>
                Login
              </Link>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    color: "#222",
  },

  subtitle: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#4F8EF7",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  footerText: {
    color: "#666",
    fontSize: 15,
  },

  link: {
    color: "#4F8EF7",
    fontWeight: "700",
    marginLeft: 5,
    fontSize: 15,
  },
});

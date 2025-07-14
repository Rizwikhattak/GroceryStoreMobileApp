import Logo from "@/assets/images/premium-meats-logo.svg";
import { primary } from "@/constants/Colors";
import { TOAST_MESSAGES } from "@/constants/constants";
import { resetPassword } from "@/store/actions/authActions.js";
import { ToastHelper } from "@/utils/ToastHelper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const handleSendResetEmail = async () => {
    try {
      if (!emailOk(email)) {
        return ToastHelper.showError({
          title: TOAST_MESSAGES.INVALID_EMAIL.title,
        });
      }

      setIsLoading(true);

      const resp = await dispatch(resetPassword({ email }));

      ToastHelper.showSuccess({
        title: TOAST_MESSAGES.RESET_PASSWORD_MAIL_SENT.title,
      });
      router.back();
    } catch (err) {
      ToastHelper.showError({
        title: TOAST_MESSAGES.RESET_PASSWORD_MAIL_ERROR.title,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar style="dark" translucent={true} backgroundColor="white" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={primary} />
          </TouchableOpacity>

          {/* Logo and Title */}
          <View style={styles.headerContainer}>
            <Logo width={300} height={80} />
            <Text style={styles.titleText}>Forgot Password?</Text>
            <Text style={styles.subtitleText}>
              Enter your email address and we'll send you a link to reset your
              password
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.textInput}
                />
              </View>
            </View>
          </View>

          {/* Send Reset Email Button */}
          <TouchableOpacity
            style={styles.resetButton}
            activeOpacity={0.8}
            onPress={handleSendResetEmail}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>Send Reset Email</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)")}>
              <Text style={styles.loginLinkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollViewContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 8,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitleText: {
    color: "#6b7280",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    marginTop: 32,
  },
  inputLabel: {
    color: "#374151",
    marginBottom: 8,
    fontWeight: "500",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#000000",
  },
  resetButton: {
    backgroundColor: primary,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  resetButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  loginText: {
    color: "#4b5563",
  },
  loginLinkText: {
    color: primary,
    fontWeight: "500",
  },
});

export default ForgotPasswordScreen;

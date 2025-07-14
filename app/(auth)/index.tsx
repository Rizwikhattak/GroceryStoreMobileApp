import Logo from "@/assets/images/premium-meats-logo.svg";
import { primary } from "@/constants/Colors";
import { TOAST_MESSAGES } from "@/constants/constants";
import { loginUser } from "@/store/actions/authActions";
import { ToastHelper } from "@/utils/ToastHelper";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
const LoginScreen = () => {
  const auth = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const handleLogin = async () => {
    try {
      if (!emailOk(email))
        return ToastHelper.showError({
          title: TOAST_MESSAGES.INVALID_EMAIL.title,
        });
      if (!password.trim())
        return ToastHelper.showError({
          title: TOAST_MESSAGES.PASSWORD_REQUIRED.title,
        });

      const response = await dispatch(
        loginUser(JSON.stringify({ email: email.trim(), password }))
      ).unwrap();

      if (response?.user) {
        router.replace("/(drawer)/(tabs)");
      } else {
      }
    } catch (err) {
      ToastHelper.showError({
        title: TOAST_MESSAGES.INVALID_EMAIL_PASSWORD.title,
      });
    }
  };

  return (
    <>
      <StatusBar style="dark" translucent={true} backgroundColor="white" />

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Logo and Title */}
          <View style={styles.headerContainer}>
            {/* <Text style={styles.titleText}>
              <Text style={styles.premiumText}>Premium</Text>
              <Text style={styles.meatText}> Meat</Text>
            </Text> */}
            <Logo width={300} height={80} />
            {/* <Image
              source={require("@/assets/images/premium-meat-logo-1024x1024.png")}
              style={{ width: 250, height: 120 }}
              resizeMode="contain"
            /> */}
            <Text style={styles.subtitleText}>Sign in to your account</Text>
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

            <View style={styles.passwordContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureTextEntry}
                  style={styles.textInput}
                />
                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Ionicons
                    name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => router.push("/(auth)/ForgetPassword")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.8}
            onPress={() => {
              handleLogin();
            }}
            disabled={auth.isLoading} // Optional: disable button while loading
          >
            {auth.isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          {/* <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View> */}

          {/* Social Login */}
          {/* <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={24} color="#000" />
            </TouchableOpacity>
          </View> */}

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Link href="/(auth)/signup">
                <Text style={styles.signupLinkText}>Sign Up</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    // height: "100%",
    backgroundColor: "#ffffff", // bg-white
  },
  ImageContainer: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: "100%", // takes full width of parent
    height: undefined,
    aspectRatio: 16 / 9, // maintain aspect ratio
    borderRadius: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24, // px-6
  },
  scrollViewContent: {
    paddingTop: 80,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center", // items-center
    marginBottom: 32, // mb-8
  },
  titleText: {
    fontSize: 30, // text-3xl
    fontWeight: "bold", // font-bold
    marginBottom: 8, // mb-2
  },
  premiumText: {
    color: primary, // text-red-500
  },
  meatText: {
    color: "#000000", // text-black
  },
  subtitleText: {
    color: "#6b7280", // text-gray-500
    fontSize: 16, // text-base
    marginTop: 8,
  },
  formContainer: {
    marginTop: 24, // mt-6
  },

  inputLabel: {
    color: "#374151", // text-gray-700
    marginBottom: 8, // mb-2
    fontWeight: "500", // font-medium
    fontSize: 16, // text-base
  },
  inputContainer: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    backgroundColor: "#f3f4f6", // bg-gray-100
    borderRadius: 8, // rounded-lg
    paddingHorizontal: 16, // px-4
    height: 56, // h-14
  },
  textInput: {
    flex: 1, // flex-1
    marginLeft: 12, // ml-3
    fontSize: 16, // text-base
    color: "#000000", // text-black
  },
  passwordContainer: {
    marginTop: 20, // part of space-y-5
  },
  forgotPasswordButton: {
    alignSelf: "flex-end", // self-end
    marginTop: 20, // part of space-y-5
  },
  forgotPasswordText: {
    color: primary, // text-red-500
    fontWeight: "500", // font-medium
  },
  loginButton: {
    backgroundColor: primary, // bg-red-500
    height: 50, // h-14
    borderRadius: 8, // rounded-lg
    alignItems: "center", // items-center
    justifyContent: "center", // justify-center
    marginTop: 32, // mt-8
  },
  loginButtonText: {
    color: "#ffffff", // text-white
    fontWeight: "bold", // font-bold
    fontSize: 18, // text-lg
  },
  dividerContainer: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    marginVertical: 32, // my-8
  },
  dividerLine: {
    flex: 1, // flex-1
    height: 1, // h-[1px]
    backgroundColor: "#d1d5db", // bg-gray-300
  },
  dividerText: {
    marginHorizontal: 16, // mx-4
    color: "#6b7280", // text-gray-500
  },
  socialButtonsContainer: {
    flexDirection: "row", // flex-row
    justifyContent: "center", // justify-center
    gap: 24, // gap-6
  },
  socialButton: {
    width: 56, // w-14
    height: 56, // h-14
    borderRadius: 28, // rounded-full
    backgroundColor: "#f3f4f6", // bg-gray-100
    alignItems: "center", // items-center
    justifyContent: "center", // justify-center
  },
  signupContainer: {
    flexDirection: "row", // flex-row
    justifyContent: "center", // justify-center
    marginTop: 32, // mt-8
  },
  signupText: {
    color: "#4b5563", // text-gray-600
  },
  signupLinkText: {
    color: primary, // text-red-500
    fontWeight: "500", // font-medium
  },
});

export default LoginScreen;

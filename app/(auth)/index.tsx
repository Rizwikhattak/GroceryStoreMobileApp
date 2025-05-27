import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  StatusBar as RNStatusBar,
} from "react-native";
import React, { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "@/store/store";
import { loginUser } from "@/store/actions/authActions";
import Logo from "../../assets/images/premium-meats-logo.svg";
import {
  dark,
  dark_secondary,
  light,
  light_secondary,
  primary,
} from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => getStyles(colorScheme), [colorScheme]);
  const auth = useSelector((state: StoreState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    try {
      const response = await dispatch(
        loginUser(JSON.stringify({ email, password }))
      ).unwrap();

      if (response?.user) {
        router.replace("/(tabs)");
      }
    } catch (err) {}
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colorScheme === "dark" ? dark : light}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <Logo width={300} height={80} />
              <Text style={styles.subtitleText}>Sign in to your account</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
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

              <Text style={[styles.inputLabel, { marginTop: 20 }]}>
                Password
              </Text>
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

              <TouchableOpacity style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Button */}
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={auth.isLoading}
            >
              {auth.isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Sign up */}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (scheme: string) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: scheme === "dark" ? dark : light,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: scheme === "dark" ? dark : light,
      paddingHorizontal: 24,
    },
    scrollViewContent: {
      paddingTop: 80,
      paddingBottom: 40,
    },
    headerContainer: {
      alignItems: "center",
      marginBottom: 32,
    },
    subtitleText: {
      color: "#6b7280",
      fontSize: 16,
      marginTop: 8,
    },
    formContainer: {
      marginTop: 24,
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
      backgroundColor: scheme === "light" ? light_secondary : dark_secondary,
      borderRadius: 8,
      paddingHorizontal: 16,
      height: 56,
    },
    textInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: scheme === "light" ? dark : light,
    },
    forgotPasswordButton: {
      alignSelf: "flex-end",
      marginTop: 20,
    },
    forgotPasswordText: {
      color: primary,
      fontWeight: "500",
    },
    loginButton: {
      backgroundColor: primary,
      height: 50,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 32,
    },
    loginButtonText: {
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: 18,
    },
    signupContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 32,
    },
    signupText: {
      color: "#4b5563",
    },
    signupLinkText: {
      color: primary,
      fontWeight: "500",
    },
  });

export default LoginScreen;

import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "@/store/store";
import { loginUser } from "@/store/actions/authActions";
import { Toast } from "toastify-react-native";
const LoginScreen = () => {
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
      } else {
      }
    } catch (err) {}
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <StatusBar style="dark" />
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 80,
            paddingBottom: 40,
          }}
        >
          {/* Logo and Title */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold mb-2">
              <Text className="text-red-500">Premium</Text>
              <Text className="text-black"> Meat</Text>
            </Text>
            <Text className="text-gray-500 text-base">
              Sign in to your account
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-5 mt-6">
            <View>
              <Text className="text-gray-700 mb-2 font-medium text-base">
                Email
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="mail-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 mb-2 font-medium text-base">
                Password
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="lock-closed-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureTextEntry}
                  className="flex-1 ml-3 text-base text-black"
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

            <TouchableOpacity className="self-end">
              <Text className="text-red-500 font-medium">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-red-500 h-14 rounded-lg items-center justify-center mt-8"
            activeOpacity={0.8}
            onPress={() => {
              handleLogin();
            }}
            disabled={auth.isLoading} // Optional: disable button while loading
          >
            {auth.isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-4 text-gray-500">Or continue with</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Social Login */}
          <View className="flex-row justify-center gap-6">
            <TouchableOpacity className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center">
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center">
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center">
              <Ionicons name="logo-apple" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity>
              <Link href="/(auth)/signup">
                <Text className="text-red-500 font-medium">Sign Up</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

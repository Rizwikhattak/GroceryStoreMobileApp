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
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Link } from "expo-router";

const SignupScreen = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [document, setDocument] = useState(null);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "You need to grant gallery permissions to upload a profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // All file types
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        setDocument({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
          size: result.assets[0].size,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
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
            paddingTop: 50,
            paddingBottom: 40,
          }}
        >
          {/* Logo and Title */}
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold mb-2">
              <Text className="text-red-500">Premium</Text>
              <Text className="text-black"> Meat</Text>
            </Text>
            <Text className="text-gray-500 text-base">Create your account</Text>
          </View>

          {/* Profile Image */}
          <View className="items-center mb-6">
            <TouchableOpacity onPress={pickImage} className="relative">
              <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center overflow-hidden border-2 border-gray-200">
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={50} color="#888" />
                )}
              </View>
              <View className="absolute bottom-0 right-0 bg-red-500 w-8 h-8 rounded-full items-center justify-center">
                <Ionicons name="camera" size={18} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="text-gray-500 mt-2">Add profile picture</Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* First Name */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                First Name <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="person-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your first name"
                  placeholderTextColor="#888"
                  value={formData.first_name}
                  onChangeText={(text) => updateFormData("first_name", text)}
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Last Name */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Last Name <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="person-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your last name"
                  placeholderTextColor="#888"
                  value={formData.last_name}
                  onChangeText={(text) => updateFormData("last_name", text)}
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Phone */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Phone Number
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="call-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your phone number"
                  placeholderTextColor="#888"
                  value={formData.phone}
                  onChangeText={(text) => updateFormData("phone", text)}
                  keyboardType="phone-pad"
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Email <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="mail-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#888"
                  value={formData.email}
                  onChangeText={(text) => updateFormData("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Password <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="lock-closed-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Create a password"
                  placeholderTextColor="#888"
                  value={formData.password}
                  onChangeText={(text) => updateFormData("password", text)}
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
              <Text className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters
              </Text>
            </View>

            {/* File Upload */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Upload Document
              </Text>
              <TouchableOpacity
                onPress={pickDocument}
                className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14"
              >
                <Ionicons name="document-outline" size={20} color="#888" />
                <View className="flex-1 ml-3">
                  {document ? (
                    <Text
                      className="text-base text-black"
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {document.name}
                    </Text>
                  ) : (
                    <Text className="text-base text-gray-400">
                      Select a document
                    </Text>
                  )}
                </View>
                <View className="bg-red-500 px-3 py-1.5 rounded-md">
                  <Text className="text-white text-xs font-medium">Browse</Text>
                </View>
              </TouchableOpacity>
              {document && (
                <View className="flex-row items-center mt-2">
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {(document.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                  <TouchableOpacity
                    onPress={() => setDocument(null)}
                    className="ml-auto"
                  >
                    <Ionicons name="close-circle" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Terms and Conditions */}
          <View className="flex-row items-start mt-6">
            <Ionicons name="checkbox-outline" size={20} color="#FF3B30" />
            <Text className="flex-1 ml-2 text-gray-600 text-sm">
              By signing up, you agree to our{" "}
              <Text className="text-red-500">Terms of Service</Text> and{" "}
              <Text className="text-red-500">Privacy Policy</Text>
            </Text>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            className="bg-red-500 h-14 rounded-lg items-center justify-center mt-8"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">Create Account</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity>
              <Link href="/(auth)">
                <Text className="text-red-500 font-medium">Sign In</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

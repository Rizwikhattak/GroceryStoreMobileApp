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
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Link, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupStep1, signupStep1Data } from "@/utils/FormValidationScheemas";
import InputCommon from "@/components/ui/FormCommons";
import { Toast } from "toastify-react-native";
import { registrationStep1 } from "@/store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";

const SignupScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
  });
  const initialState = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
  };
  const formMethods = useForm<signupStep1Data>({
    resolver: zodResolver(signupStep1),
    defaultValues: initialState,
  });
  const { control, handleSubmit } = formMethods;
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

  const handleFormSubmit = async () => {
    try {
      const allFieldsFilled = Object.values(formData).every(
        (value) => value.trim().length > 0
      );
      if (!allFieldsFilled) {
        Toast.error("Please fill all fields", "top");
        return;
      }
      const formObj = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formObj.append(key, value);
      });
      formObj.append("driver_license", document.uri);
      console.log("asdwqeqe", formObj, typeof document.uri);

      const response = await dispatch(registrationStep1(formObj)).unwrap();
      console.log("Resssssssssssssssssss", response);
      const _id = response.item._id;
      // console.log("Doneeeeee", formObj);
      router.push(`/(auth)/signupStep2?_id=${_id}`);
    } catch (err) {
      console.log("ERrrrrrrooor", err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Logo and Title */}
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>
              <Text style={styles.premiumText}>Premium</Text>
              <Text style={styles.meatText}> Meat</Text>
            </Text>
            <Text style={styles.subtitleText}>Create your account</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* First Name */}
            <View>
              <Text style={styles.inputLabel}>
                First Name <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your first name"
                  placeholderTextColor="#888"
                  value={formData.first_name}
                  onChangeText={(text) => updateFormData("first_name", text)}
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Last Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Last Name <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your last name"
                  placeholderTextColor="#888"
                  value={formData.last_name}
                  onChangeText={(text) => updateFormData("last_name", text)}
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your phone number"
                  placeholderTextColor="#888"
                  value={formData.phone}
                  onChangeText={(text) => updateFormData("phone", text)}
                  keyboardType="phone-pad"
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Email <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#888"
                  value={formData.email}
                  onChangeText={(text) => updateFormData("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Password <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Create a password"
                  placeholderTextColor="#888"
                  value={formData.password}
                  onChangeText={(text) => updateFormData("password", text)}
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
              <Text style={styles.helperText}>
                Password must be at least 8 characters
              </Text>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Confirm Password <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#888"
                  value={formData.confirm_password}
                  onChangeText={(text) =>
                    updateFormData("confirm_password", text)
                  }
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

            {/* Address */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Registered Address<Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your Registered Location"
                  placeholderTextColor="#888"
                  value={formData.address}
                  onChangeText={(text) => updateFormData("address", text)}
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* File Upload */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Upload Document</Text>
              <TouchableOpacity
                onPress={pickDocument}
                style={styles.inputContainer}
              >
                <Ionicons name="document-outline" size={20} color="#888" />
                <View style={styles.documentTextContainer}>
                  {document ? (
                    <Text
                      style={styles.documentNameText}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {document.name}
                    </Text>
                  ) : (
                    <Text style={styles.documentPlaceholderText}>
                      Select a document
                    </Text>
                  )}
                </View>
                <View style={styles.browseButton}>
                  <Text style={styles.browseButtonText}>Browse</Text>
                </View>
              </TouchableOpacity>
              {document && (
                <View style={styles.documentInfoContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.documentSizeText}>
                    {(document.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                  <TouchableOpacity
                    onPress={() => setDocument(null)}
                    style={styles.removeDocumentButton}
                  >
                    <Ionicons name="close-circle" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={styles.signupButton}
            activeOpacity={0.8}
            onPress={handleFormSubmit}
          >
            {auth.isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.signupButtonText}>Save & Continue</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity>
              <Link href="/(auth)">
                <Text style={styles.loginLinkText}>Sign In</Text>
              </Link>
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
    backgroundColor: "#ffffff", // bg-white
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24, // px-6
  },
  scrollViewContent: {
    paddingTop: 50,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center", // items-center
    marginBottom: 24, // mb-6
  },
  titleText: {
    fontSize: 30, // text-3xl
    fontWeight: "bold", // font-bold
    marginBottom: 8, // mb-2
  },
  premiumText: {
    color: "#ef4444", // text-red-500
  },
  meatText: {
    color: "#000000", // text-black
  },
  subtitleText: {
    color: "#6b7280", // text-gray-500
    fontSize: 16, // text-base
  },
  formContainer: {
    gap: 16, // space-y-4
  },
  inputWrapper: {
    marginTop: 2, // part of space-y-4
  },
  inputLabel: {
    color: "#374151", // text-gray-700
    marginBottom: 4, // mb-1
    fontWeight: "500", // font-medium
    fontSize: 16, // text-base
  },
  requiredAsterisk: {
    color: "#ef4444", // text-red-500
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
  helperText: {
    fontSize: 12, // text-xs
    color: "#6b7280", // text-gray-500
    marginTop: 4, // mt-1
  },
  documentTextContainer: {
    flex: 1, // flex-1
    marginLeft: 12, // ml-3
  },
  documentNameText: {
    fontSize: 16, // text-base
    color: "#000000", // text-black
  },
  documentPlaceholderText: {
    fontSize: 16, // text-base
    color: "#9ca3af", // text-gray-400
  },
  browseButton: {
    backgroundColor: "#ef4444", // bg-red-500
    paddingHorizontal: 12, // px-3
    paddingVertical: 6, // py-1.5
    borderRadius: 6, // rounded-md
  },
  browseButtonText: {
    color: "#ffffff", // text-white
    fontSize: 12, // text-xs
    fontWeight: "500", // font-medium
  },
  documentInfoContainer: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    marginTop: 8, // mt-2
  },
  documentSizeText: {
    fontSize: 12, // text-xs
    color: "#6b7280", // text-gray-500
    marginLeft: 4, // ml-1
  },
  removeDocumentButton: {
    marginLeft: "auto", // ml-auto
  },
  signupButton: {
    backgroundColor: "#ef4444", // bg-red-500
    height: 50, // h-14
    borderRadius: 8, // rounded-lg
    alignItems: "center", // items-center
    justifyContent: "center", // justify-center
    marginTop: 32, // mt-8
  },
  signupButtonText: {
    color: "#ffffff", // text-white
    fontWeight: "bold", // font-bold
    fontSize: 18, // text-lg
  },
  loginLinkContainer: {
    flexDirection: "row", // flex-row
    justifyContent: "center", // justify-center
    marginTop: 32, // mt-8
  },
  loginText: {
    color: "#4b5563", // text-gray-600
  },
  loginLinkText: {
    color: "#ef4444", // text-red-500
    fontWeight: "500", // font-medium
  },
});

export default SignupScreen;

import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Toast } from "toastify-react-native";
import {
  registrationStep2,
  registrationStep3,
} from "@/store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";

const SigupStep3 = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const router = useRouter();
  const { _id } = useLocalSearchParams();
  console.log("Received woww _id:", _id);

  // Adjust form fields to match “Credit Reference 1” and “Credit Reference 2”
  const [formData, setFormData] = useState({
    credit_reference1_name: "",
    credit_reference1_email: "",
    credit_reference1_phone: "",
    credit_reference2_name: "",
    credit_reference2_email: "",
    credit_reference2_phone: "",
  });

  // For the “I agree” checkbox
  const [agreeChecked, setAgreeChecked] = useState(false);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      // Check if all fields are filled
      const allFieldsFilled = Object.values(formData).every(
        (value) => value.trim().length > 0
      );
      if (!allFieldsFilled) {
        Toast.error("Please fill all fields", "top");
        return;
      }
      // Check “I agree” box if your flow requires it
      if (!agreeChecked) {
        Toast.error("Please agree to the terms before continuing.", "top");
        return;
      }

      const formObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        console.log(key, value);
        formObj.append(key, value);
      });
      console.log("Form obj", formObj);
      // Dispatch to Redux or handle as needed
      const response = await dispatch(
        registrationStep3({ formData: formObj, _id })
      ).unwrap();
      console.log("third response:", response);
      router.push("/(auth)");
      // Navigate or do something after success
      // router.push("(auth)/");
    } catch (err) {
      console.log("Error", err);
      Alert.alert("Error", "Something went wrong while submitting");
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
          {/* Heading */}
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold mb-2">
              <Text className="text-red-500">Premium</Text>
              <Text className="text-black"> Meat</Text>
            </Text>
            <Text className="text-gray-500 text-base">
              Credit Reference (Step 3/3)
            </Text>
          </View>

          {/* Credit Reference 1 */}
          <View className="space-y-4">
            <Text className="text-lg font-semibold mt-2 mb-2">
              Credit Reference 1
            </Text>

            {/* Name of Business */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Name of Business <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="briefcase-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter name of business"
                  placeholderTextColor="#888"
                  value={formData.credit_reference1_name}
                  onChangeText={(text) =>
                    updateFormData("credit_reference1_name", text)
                  }
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Contact Person Email */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Contact Person Email <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="mail-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter contact person email"
                  placeholderTextColor="#888"
                  value={formData.credit_reference1_email}
                  onChangeText={(text) =>
                    updateFormData("credit_reference1_email", text)
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Phone Number */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Phone Number <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="call-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor="#888"
                  value={formData.credit_reference1_phone}
                  onChangeText={(text) =>
                    updateFormData("credit_reference1_phone", text)
                  }
                  keyboardType="phone-pad"
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>
          </View>

          {/* Credit Reference 2 */}
          <View className="space-y-4 mt-6">
            <Text className="text-lg font-semibold mt-2 mb-2">
              Credit Reference 2
            </Text>

            {/* Name of Business */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Name of Business <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="briefcase-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter name of business"
                  placeholderTextColor="#888"
                  value={formData.credit_reference2_name}
                  onChangeText={(text) =>
                    updateFormData("credit_reference2_name", text)
                  }
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Contact Person Email */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Contact Person Email <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="mail-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter contact person email"
                  placeholderTextColor="#888"
                  value={formData.credit_reference2_email}
                  onChangeText={(text) =>
                    updateFormData("credit_reference2_email", text)
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Phone Number */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Phone Number <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="call-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor="#888"
                  value={formData.credit_reference2_phone}
                  onChangeText={(text) =>
                    updateFormData("credit_reference2_phone", text)
                  }
                  keyboardType="phone-pad"
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>
          </View>

          {/* “I agree” Checkbox */}
          <View className="flex-row items-center mt-6">
            <TouchableOpacity
              onPress={() => setAgreeChecked(!agreeChecked)}
              className="mr-2"
            >
              {/* Toggle between checked / unchecked Ionicon if desired */}
              <Ionicons
                name={agreeChecked ? "checkbox" : "square-outline"}
                size={24}
                color={agreeChecked ? "#f00" : "#888"}
              />
            </TouchableOpacity>
            <Text className="flex-1 text-gray-600 text-sm">
              I agree to the company’s credit terms and conditions.
            </Text>
          </View>

          {/* Save & Continue Button */}
          <TouchableOpacity
            className="bg-red-500 h-14 rounded-lg items-center justify-center mt-8"
            activeOpacity={0.8}
            onPress={handleFormSubmit}
          >
            {auth.isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Already have an account? */}
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

export default SigupStep3;

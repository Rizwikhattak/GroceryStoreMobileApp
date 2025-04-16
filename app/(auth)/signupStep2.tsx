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
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { signupStep1, signupStep1Data } from "@/utils/FormValidationScheemas";
// import InputCommon from "@/components/ui/FormCommons";
import { Toast } from "toastify-react-native";
import {
  registrationStep1,
  registrationStep2,
} from "@/store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";

const SigupStep2 = () => {
  const auth = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { _id } = useLocalSearchParams();
  console.log("Wowww nicee id", _id);
  // Change your form state to match the new fields:
  const [formData, setFormData] = useState({
    business_name: "",
    business_mobile: "",
    delivery_address: "",
    business_email: "",
    company_number: "",
    account_payable_name: "",
    account_payable_email: "",
    account_payable_phone: "",
  });

  // If you’re still using react-hook-form + zod, update your default values:
  const initialState = {
    business_name: "",
    business_mobile: "",
    delivery_address: "",
    business_email: "",
    company_number: "",
    account_payable_name: "",
    account_payable_email: "",
    account_payable_phone: "",
  };

  // If you have a validation schema, update it accordingly or remove for now:
  // const formMethods = useForm<signupStep1Data>({
  //   resolver: zodResolver(signupStep1),
  //   defaultValues: initialState,
  // });
  // const { control, handleSubmit } = formMethods;

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      // Check if all fields are filled:
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

      // Dispatch to Redux or handle as needed:
      const response = await dispatch(
        registrationStep2({ formData: formObj, _id: _id })
      ).unwrap();
      console.log("Second respoinse", response);
      const new_id = response.item._id;
      console.log("new iddds", new_id);

      router.push(`/(auth)/signupStep3?_id=${new_id}`);
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
          {/* Heading (you can rename to “Business Details” if desired) */}
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold mb-2">
              <Text className="text-red-500">Premium</Text>
              <Text className="text-black"> Meat</Text>
            </Text>
            <Text className="text-gray-500 text-base">
              Business Details (Step 2/3)
            </Text>
          </View>

          {/* FORM FIELDS */}
          <View className="space-y-4">
            {/* Business Name */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Business Name <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="briefcase-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your business name"
                  placeholderTextColor="#888"
                  value={formData.business_name}
                  onChangeText={(text) => updateFormData("business_name", text)}
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Business Phone */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Business Phone <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="call-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your business phone"
                  placeholderTextColor="#888"
                  value={formData.business_mobile}
                  onChangeText={(text) =>
                    updateFormData("business_mobile", text)
                  }
                  keyboardType="phone-pad"
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Delivery Address */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Delivery Address <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="location-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your delivery address"
                  placeholderTextColor="#888"
                  value={formData.delivery_address}
                  onChangeText={(text) =>
                    updateFormData("delivery_address", text)
                  }
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Business Email */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Business Email <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="mail-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your business email"
                  placeholderTextColor="#888"
                  value={formData.business_email}
                  onChangeText={(text) =>
                    updateFormData("business_email", text)
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Company Number */}
            <View>
              <Text className="text-gray-700 mb-1 font-medium text-base">
                Company Number <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                <Ionicons name="document-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your company number"
                  placeholderTextColor="#888"
                  value={formData.company_number}
                  onChangeText={(text) =>
                    updateFormData("company_number", text)
                  }
                  className="flex-1 ml-3 text-base text-black"
                />
              </View>
            </View>

            {/* Accounts Payable */}
            <View>
              <Text className="text-lg font-semibold mt-4 mb-2">
                Accounts Payable
              </Text>
              {/* Contact Name */}
              <View className="mb-3">
                <Text className="text-gray-700 mb-1 font-medium text-base">
                  Contact Name
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                  <Ionicons name="person-outline" size={20} color="#888" />
                  <TextInput
                    placeholder="Enter contact name"
                    placeholderTextColor="#888"
                    value={formData.account_payable_name}
                    onChangeText={(text) =>
                      updateFormData("account_payable_name", text)
                    }
                    className="flex-1 ml-3 text-base text-black"
                  />
                </View>
              </View>

              {/* Contact Email */}
              <View className="mb-3">
                <Text className="text-gray-700 mb-1 font-medium text-base">
                  Contact Email
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                  <Ionicons name="mail-outline" size={20} color="#888" />
                  <TextInput
                    placeholder="Enter contact email"
                    placeholderTextColor="#888"
                    value={formData.account_payable_email}
                    onChangeText={(text) =>
                      updateFormData("account_payable_email", text)
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 ml-3 text-base text-black"
                  />
                </View>
              </View>

              {/* Contact Phone */}
              <View className="mb-3">
                <Text className="text-gray-700 mb-1 font-medium text-base">
                  Contact Phone
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded-lg px-4 h-14">
                  <Ionicons name="call-outline" size={20} color="#888" />
                  <TextInput
                    placeholder="Enter contact phone"
                    placeholderTextColor="#888"
                    value={formData.account_payable_phone}
                    onChangeText={(text) =>
                      updateFormData("account_payable_phone", text)
                    }
                    keyboardType="phone-pad"
                    className="flex-1 ml-3 text-base text-black"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Save & Continue */}
          <TouchableOpacity
            className="bg-red-500 h-14 rounded-lg items-center justify-center mt-8"
            activeOpacity={0.8}
            onPress={handleFormSubmit}
          >
            {auth.isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Save & Continue
              </Text>
            )}
          </TouchableOpacity>

          {/* Already have an account? (Adjust as needed) */}
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

export default SigupStep2;

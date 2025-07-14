import { primary } from "@/constants/Colors";
import { registrationStep3 } from "@/store/actions/authActions";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { Toast } from "toastify-react-native";
import Logo from "../../assets/images/premium-meats-logo.svg";

const SigupStep3 = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const router = useRouter();
  const { _id } = useLocalSearchParams();
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  // Adjust form fields to match "Credit Reference 1" and "Credit Reference 2"
  const [formData, setFormData] = useState({
    credit_reference1_name: "",
    credit_reference1_email: "",
    credit_reference1_phone: "",
    credit_reference2_name: "",
    credit_reference2_email: "",
    credit_reference2_phone: "",
  });

  // For the "I agree" checkbox
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
      if (!emailOk(formData.credit_reference1_email))
        return Toast.error("Please enter a credit reference 1 email", "top");
      if (!emailOk(formData.credit_reference2_email))
        return Toast.error("Please enter a credit reference 2 email", "top");
      // Check "I agree" box if your flow requires it
      if (!agreeChecked) {
        Toast.error("Please agree to the terms before continuing.", "top");
        return;
      }

      const formObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formObj.append(key, value);
      });
      // Dispatch to Redux or handle as needed
      const response = await dispatch(
        registrationStep3({ formData: formObj, _id })
      ).unwrap();
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
      style={styles.keyboardAvoidingView}
    >
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Heading */}
          <View style={styles.headerContainer}>
            {/* <Text style={styles.titleText}>
              <Text style={styles.premiumText}>Premium</Text>
              <Text style={styles.meatText}> Meat</Text>
            </Text> */}
            <Logo width={300} height={80} />
            <Text style={styles.subtitleText}>Credit Reference (Step 3/3)</Text>
          </View>

          {/* Credit Reference 1 */}
          <View style={styles.referenceContainer}>
            <Text style={styles.sectionTitle}>Credit Reference 1</Text>

            {/* Name of Business */}
            <View>
              <Text style={styles.inputLabel}>
                Name of Business <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="briefcase-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter name of business"
                  placeholderTextColor="#888"
                  value={formData.credit_reference1_name}
                  onChangeText={(text) =>
                    updateFormData("credit_reference1_name", text)
                  }
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Contact Person Email */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Contact Person Email{" "}
                <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
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
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Phone Number <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor="#888"
                  value={formData.credit_reference1_phone}
                  onChangeText={(text) =>
                    updateFormData("credit_reference1_phone", text)
                  }
                  keyboardType="phone-pad"
                  style={styles.textInput}
                />
              </View>
            </View>
          </View>

          {/* Credit Reference 2 */}
          <View style={styles.referenceContainer2}>
            <Text style={styles.sectionTitle}>Credit Reference 2</Text>

            {/* Name of Business */}
            <View>
              <Text style={styles.inputLabel}>
                Name of Business <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="briefcase-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter name of business"
                  placeholderTextColor="#888"
                  value={formData.credit_reference2_name}
                  onChangeText={(text) =>
                    updateFormData("credit_reference2_name", text)
                  }
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Contact Person Email */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Contact Person Email{" "}
                <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
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
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Phone Number <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor="#888"
                  value={formData.credit_reference2_phone}
                  onChangeText={(text) =>
                    updateFormData("credit_reference2_phone", text)
                  }
                  keyboardType="phone-pad"
                  style={styles.textInput}
                />
              </View>
            </View>
          </View>

          {/* "I agree" Checkbox */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() => setAgreeChecked(!agreeChecked)}
              style={styles.checkboxButton}
            >
              {/* Toggle between checked / unchecked Ionicon if desired */}
              <Ionicons
                name={agreeChecked ? "checkbox" : "square-outline"}
                size={24}
                color={agreeChecked ? "#f00" : "#888"}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              I agree to the company's credit{" "}
              <Text
                style={{ color: "#0000EE", textDecorationLine: "underline" }}
                onPress={() => router.push("/TermsAndConditions")}
              >
                terms and conditions
              </Text>
              .
            </Text>
          </View>

          {/* Save & Continue Button */}
          <TouchableOpacity
            style={styles.createAccountButton}
            activeOpacity={0.8}
            onPress={handleFormSubmit}
          >
            {auth.isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.createAccountButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Already have an account? */}
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
  referenceContainer: {
    gap: 16, // space-y-4
  },
  referenceContainer2: {
    gap: 16, // space-y-4
    marginTop: 24, // mt-6
  },
  sectionTitle: {
    fontSize: 18, // text-lg
    fontWeight: "600", // font-semibold
    marginTop: 8, // mt-2
    marginBottom: 8, // mb-2
  },
  inputWrapper: {
    marginTop: 16, // part of space-y-4
  },
  inputLabel: {
    color: "#374151", // text-gray-700
    marginBottom: 4, // mb-1
    fontWeight: "500", // font-medium
    fontSize: 16, // text-base
  },
  requiredAsterisk: {
    color: primary, // text-red-500
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
  checkboxContainer: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    marginTop: 24, // mt-6
  },
  checkboxButton: {
    marginRight: 8, // mr-2
  },
  checkboxText: {
    flex: 1, // flex-1
    color: "#4b5563", // text-gray-600
    fontSize: 14, // text-sm
  },
  createAccountButton: {
    backgroundColor: primary, // bg-red-500
    height: 56, // h-14
    borderRadius: 8, // rounded-lg
    alignItems: "center", // items-center
    justifyContent: "center", // justify-center
    marginTop: 32, // mt-8
  },
  createAccountButtonText: {
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
    color: primary, // text-red-500
    fontWeight: "500", // font-medium
  },
});

export default SigupStep3;

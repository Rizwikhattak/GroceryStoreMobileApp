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
  StyleSheet,
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
import Logo from "../../assets/images/premium-meats-logo.svg";
import { primary } from "@/constants/Colors";

const SigupStep2 = () => {
  const auth = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { _id } = useLocalSearchParams();
  // Change your form state to match the new fields:
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
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

  // If you're still using react-hook-form + zod, update your default values:
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
      if (!emailOk(formData.business_email))
        return Toast.error("Please enter a valid business email", "top");
      if (!emailOk(formData.account_payable_email))
        return Toast.error("Please enter a valid account payable email", "top");

      const formObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formObj.append(key, value.trim());
      });

      // Dispatch to Redux or handle as needed:
      const response = await dispatch(
        registrationStep2({ formData: formObj, _id: _id })
      ).unwrap();
      const new_id = response.item._id;

      router.push(`/(auth)/signupStep3?_id=${new_id}`);
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
          {/* Heading (you can rename to "Business Details" if desired) */}
          <View style={styles.headerContainer}>
            {/* <Text style={styles.titleText}>
              <Text style={styles.premiumText}>Premium</Text>
              <Text style={styles.meatText}> Meat</Text>
            </Text> */}
            <Logo width={300} height={100} />
            <Text style={styles.subtitleText}>Business Details (Step 2/3)</Text>
          </View>

          {/* FORM FIELDS */}
          <View style={styles.formContainer}>
            {/* Business Name */}
            <View>
              <Text style={styles.inputLabel}>
                Business Name <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="briefcase-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your business name"
                  placeholderTextColor="#888"
                  value={formData.business_name}
                  onChangeText={(text) => updateFormData("business_name", text)}
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Business Phone */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Business Phone <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your business phone"
                  placeholderTextColor="#888"
                  value={formData.business_mobile}
                  onChangeText={(text) =>
                    updateFormData("business_mobile", text)
                  }
                  keyboardType="phone-pad"
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Delivery Address */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Delivery Address <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your delivery address"
                  placeholderTextColor="#888"
                  value={formData.delivery_address}
                  onChangeText={(text) =>
                    updateFormData("delivery_address", text)
                  }
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Business Email */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Business Email <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
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
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Company Number */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Company Number <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#888" />
                <TextInput
                  placeholder="Enter your company number"
                  placeholderTextColor="#888"
                  keyboardType="phone-pad"
                  value={formData.company_number}
                  onChangeText={(text) =>
                    updateFormData("company_number", text)
                  }
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Accounts Payable */}
            <View style={styles.inputWrapper}>
              <Text style={styles.sectionTitle}>Accounts Payable</Text>
              {/* Contact Name */}
              <View style={styles.accountsPayableField}>
                <Text style={styles.inputLabel}>Contact Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#888" />
                  <TextInput
                    placeholder="Enter contact name"
                    placeholderTextColor="#888"
                    value={formData.account_payable_name}
                    onChangeText={(text) =>
                      updateFormData("account_payable_name", text)
                    }
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Contact Email */}
              <View style={styles.accountsPayableField}>
                <Text style={styles.inputLabel}>Contact Email</Text>
                <View style={styles.inputContainer}>
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
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Contact Phone */}
              <View style={styles.accountsPayableField}>
                <Text style={styles.inputLabel}>Contact Phone</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color="#888" />
                  <TextInput
                    placeholder="Enter contact phone"
                    placeholderTextColor="#888"
                    value={formData.account_payable_phone}
                    onChangeText={(text) =>
                      updateFormData("account_payable_phone", text)
                    }
                    keyboardType="phone-pad"
                    style={styles.textInput}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Save & Continue */}
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.8}
            onPress={handleFormSubmit}
          >
            {auth.isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.continueButtonText}>Save & Continue</Text>
            )}
          </TouchableOpacity>

          {/* Already have an account? (Adjust as needed) */}
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
  sectionTitle: {
    fontSize: 18, // text-lg
    fontWeight: "600", // font-semibold
    marginTop: 16, // mt-4
    marginBottom: 8, // mb-2
  },
  accountsPayableField: {
    marginBottom: 12, // mb-3
  },
  continueButton: {
    backgroundColor: primary, // bg-red-500
    height: 50, // h-14
    borderRadius: 8, // rounded-lg
    alignItems: "center", // items-center
    justifyContent: "center", // justify-center
    marginTop: 32, // mt-8
  },
  continueButtonText: {
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

export default SigupStep2;

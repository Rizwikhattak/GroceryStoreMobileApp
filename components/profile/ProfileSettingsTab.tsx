"use client";

import { SettingsSkeleton } from "@/components/ui/Skeletons";
import { primary } from "@/constants/Colors";
import { TOAST_MESSAGES } from "@/constants/constants";
import {
  getUserProfileDetails,
  updateUserProfileDetails,
} from "@/store/actions/settingsActions";
import { saveAndOpenFile } from "@/utils/downloadFile";
import { ToastHelper } from "@/utils/ToastHelper";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const ProfileSettingsTab = () => {
  /* ---- redux ---- */
  const dispatch = useDispatch();
  const auth = useSelector((s: any) => s.auth);
  const customer = useSelector((s: any) => s.settings);
  const customerData = customer.data;

  /* ---- local state ---- */
  const [firstName, setFirstName] = useState(customerData.first_name);
  const [lastName, setLastName] = useState(customerData.last_name);
  const [email, setEmail] = useState(customerData.email);
  const [phone, setPhone] = useState(customerData.phone);
  const [address, setAddress] = useState(customerData.address);
  const [password, setPassword] = useState("********");

  // Simplified driver license state
  const [driverLicense, setDriverLicense] = useState<null | {
    uri: string;
    name: string;
    type: string;
  }>(null);

  /* ---- helpers ---- */
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const pickDriverLicense = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true, // Store a copy in cache to prevent memory issues
      });

      if (res.canceled) return;

      // Get file info from the first selected asset
      const { uri, name, mimeType } = res.assets[0];

      // Create a more lightweight file object
      setDriverLicense({
        uri,
        name,
        type: mimeType || "application/octet-stream",
      });

      Alert.alert("Selected", name);
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to select document");
    }
  };

  const handleDownload = () => {
    const dl = customer.data.driver_license;

    if (!dl?.data) {
      Alert.alert("No license found");
      return;
    }

    saveAndOpenFile(dl).catch(() =>
      Alert.alert("Error", "Could not open driver license")
    );
  };

  const saveProfile = async () => {
    /* quick validation */
    if (!firstName.trim() || !lastName.trim())
      return Alert.alert("Missing", "First and last name are required");

    if (!emailOk(email)) return Alert.alert("Invalid", "E-mail is not valid");

    if (!phone.trim()) return Alert.alert("Missing", "Phone number required");

    if (!address.trim()) return Alert.alert("Missing", "Address is required");

    try {
      const form = new FormData();

      // Add basic profile fields
      form.append("_id", customer.data._id);
      form.append("first_name", firstName.trim());
      form.append("last_name", lastName.trim());
      form.append("email", email.trim());
      form.append("phone", phone.trim());
      form.append("address", address.trim());

      // Add any required fields from existing data to prevent validation errors
      const requiredFields = [
        "business_name",
        "company_number",
        "delivery_address",
        "business_mobile",
        "business_email",
        "account_payable_name",
        "account_payable_phone",
        "account_payable_email",
        "credit_reference1_name",
        "credit_reference1_email",
        "credit_reference1_phone",
        "credit_reference2_name",
        "credit_reference2_email",
        "credit_reference2_phone",
      ];

      requiredFields.forEach((field) => {
        if (customer.data[field]) {
          form.append(field, customer.data[field]);
        }
      });

      // Handle driver license file properly
      if (driverLicense) {
        // Only append the file object - the backend will handle it from request.files
        form.append("driver_license", {
          uri: driverLicense.uri,
          name: driverLicense.name,
          type: driverLicense.type,
        });
      }

      // Make the API call
      await dispatch(
        updateUserProfileDetails({ _id: customer.data._id, formData: form })
      ).unwrap();

      // Refresh profile data
      await dispatch(getUserProfileDetails(auth.data._id)).unwrap();

      ToastHelper.showSuccess({
        title: TOAST_MESSAGES.PROFILE_DETAILS_UPDATED.title,
      });
    } catch (err: any) {
      console.error("Profile update error:", err);
      Alert.alert("Error", err?.message || "Update failed");
    }
  };

  /* ---- UI ---- */
  return (
    <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
      {customer.isLoading ? (
        <SettingsSkeleton />
      ) : (
        <View style={styles.contentContainer}>
          {/* Personal Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.full}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.addressInput}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Security Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>

            <View style={styles.full}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                {/* <TouchableOpacity style={styles.changePasswordBtn}>
                  <Text style={styles.changePasswordText}>Change</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>

          {/* Documents Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents</Text>

            <View style={styles.full}>
              <Text style={styles.label}>Driver License</Text>

              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={pickDriverLicense}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={20}
                  color={primary}
                />
                <Text style={styles.uploadTxt}>
                  {customerData?.driver_license
                    ? "Change file"
                    : driverLicense
                    ? "Change file"
                    : "Upload License"}
                </Text>
              </TouchableOpacity>

              {(driverLicense || customerData?.driver_license) && (
                <View style={styles.fileInfo}>
                  <Ionicons name="document-outline" size={16} color="#6B7280" />
                  <Text style={styles.fileName}>
                    {driverLicense
                      ? driverLicense.name
                      : customerData?.driver_license?.name || "Driver License"}
                  </Text>
                </View>
              )}

              {customerData?.driver_license && (
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={handleDownload}
                >
                  <Ionicons name="download-outline" size={18} color="#fff" />
                  <Text style={styles.downloadTxt}>
                    Download Current License
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
          {customer.isPostLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons
                name="checkmark-outline"
                size={20}
                color="#fff"
                style={styles.saveIcon}
              />
              <Text style={styles.saveTxt}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  col: {
    flex: 1,
  },
  full: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    color: "#1F2937",
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    maxHeight: 120,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
    textAlignVertical: "top",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    color: "#1F2937",
  },
  changePasswordBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: `${primary}15`,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${primary}30`,
  },
  changePasswordText: {
    color: primary,
    fontSize: 14,
    fontWeight: "600",
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: primary,
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: `${primary}05`,
    marginBottom: 12,
  },
  uploadTxt: {
    color: primary,
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  fileName: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    fontWeight: "500",
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  downloadTxt: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
  saveContainer: {
    padding: 16,
    paddingTop: 0,
  },
  saveBtn: {
    backgroundColor: primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveTxt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileSettingsTab;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { primary } from "@/constants/colors";
import {
  updateUserProfileDetails,
  getUserProfileDetails,
} from "@/store/actions/settingsActions";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { saveAndOpenFile } from "@/utils/downloadFile";

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

      // Handle arrays
      // const arrayFields = [
      //   "billing_addresses",
      //   "shipping_addresses",
      //   "addresses",
      // ];
      // arrayFields.forEach((field) => {
      //   if (customer.data[field] && Array.isArray(customer.data[field])) {
      //     // form.append(field, JSON.stringify(customer.data[field]));
      //     form.append(field, customer.data[field]);
      //   }
      // });

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
      Alert.alert("Success", "Profile updated");
    } catch (err: any) {
      console.error("Profile update error:", err);
      Alert.alert("Error", err?.message || "Update failed");
    }
  };

  /* ---- UI ---- */
  return (
    <ScrollView style={styles.wrapper}>
      {/* first/last name */}
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

      {/* email / phone */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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

      {/* address */}
      <View style={styles.full}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={2}
        />
      </View>

      {/* password (placeholder) */}
      <View style={styles.full}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* driver license */}
      <View style={styles.full}>
        <Text style={styles.label}>Driver License</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickDriverLicense}>
          <Ionicons name="cloud-upload-outline" size={20} color={primary} />
          <Text style={styles.uploadTxt}>
            {customerData?.driver_license
              ? "Change file"
              : driverLicense
              ? "Change file"
              : "Upload License"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.uploadNote}>
          {driverLicense
            ? driverLicense.name
            : customerData?.driver_license?.name
            ? customerData?.driver_license?.name
            : "No file chosen"}
        </Text>
        {customerData?.driver_license && (
          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
            <Ionicons name="download-outline" size={20} color="#fff" />
            <Text style={styles.downloadTxt}>Download license</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* save */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        {customer.isPostLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveTxt}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

/* ----- shared styles (same look as other tabs) ----- */
const styles = StyleSheet.create({
  wrapper: { padding: 16 },
  row: { flexDirection: "row", marginBottom: 16 },
  col: { flex: 1, marginRight: 8 },
  full: { marginBottom: 16 },
  label: { fontSize: 14, color: "#666", marginBottom: 8 },
  // input: {
  //   borderWidth: 1,
  //   borderColor: "#ddd",
  //   borderRadius: 8,
  //   paddingHorizontal: 12,
  //   paddingVertical: 10,
  //   fontSize: 16,
  // },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    height: 48, // 🔒 keeps height constant
  },

  /* optional separate style if you want different width rules for e-mail */
  inputEmail: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    height: 48,
  },

  /* address box: still multiline, but fixed height so it won’t expand */
  addressInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    height: 70, // enough for two lines
    textAlignVertical: "top", // place text at the top of the box
  },

  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  uploadTxt: { color: primary, marginLeft: 8, fontWeight: "500" },
  uploadNote: { fontSize: 12, color: "#666", marginTop: 8 },
  saveBtn: {
    backgroundColor: primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  saveTxt: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: primary, // use your theme colour
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginTop: 8,
  },

  downloadTxt: {
    color: "#fff", // white text on coloured button
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default ProfileSettingsTab;

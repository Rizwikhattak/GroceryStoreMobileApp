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
  getUserProfileDetails,
  updateUserProfileDetails,
} from "@/store/actions/settingsActions";
import { SettingsSkeleton } from "@/components/ui/Skeletons";

/* ------------- props ------------- */
interface Props {
  customerData: any; // same shape passed to SettingsTab
}

const BusinessDetailTab = () => {
  /* ------- redux hooks ------- */
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const customer = useSelector((state: any) => state.settings);
  const customerData = customer.data;

  /* ------- local state ------- */
  const [businessName, setBusinessName] = useState(customerData.business_name);
  const [businessPhone, setBusinessPhone] = useState(
    customerData.business_mobile
  );
  const [businessEmail, setBusinessEmail] = useState(
    customerData.business_email
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    customerData.delivery_address
  );
  const [companyNumber, setCompanyNumber] = useState(
    customerData.company_number
  );

  // Accounts-payable sub-section
  const [apName, setApName] = useState(customerData.account_payable_name);
  const [apPhone, setApPhone] = useState(customerData.account_payable_phone);
  const [apEmail, setApEmail] = useState(customerData.account_payable_email);

  /* ------------- helpers ------------- */
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  const buildFormData = () => {
    const fd = new FormData();

    /* ──────────────────────── primitives ──────────────────────── */
    // fd.set("_id", customerData._id);
    // fd.set("first_name", customerData.first_name);
    // fd.set("last_name", customerData.last_name);
    // fd.set("email", customerData.email);
    // fd.set("phone", customerData.phone);
    // fd.set("address", customerData.address);

    const requiredFields = [
      "_id",
      "first_name",
      "last_name",
      "email",
      "phone",
      "address",
      "credit_reference1_name",
      "credit_reference1_email",
      "credit_reference1_phone",
      "credit_reference2_name",
      "credit_reference2_email",
      "credit_reference2_phone",
    ];

    requiredFields.forEach((field) => {
      if (customer.data[field]) {
        fd.append(field, customer.data[field]);
      }
    });
    fd.set("business_name", businessName.trim());
    fd.set("business_mobile", businessPhone.trim());
    fd.set("business_email", businessEmail.trim());
    fd.set("delivery_address", deliveryAddress.trim());
    fd.set("company_number", companyNumber.trim());
    fd.set("account_payable_name", apName.trim());
    fd.set("account_payable_phone", apPhone.trim());
    fd.set("account_payable_email", apEmail.trim());

    /* ──────────────────────── arrays ───────────────────────────── */
    // (customerData.billing_addresses ?? []).forEach((v: string) =>
    //   fd.set("billing_addresses[]", v)
    // );
    // (customerData.shipping_addresses ?? []).forEach((v: string) =>
    //   fd.set("shipping_addresses[]", v)
    // );
    // (customerData.addresses ?? []).forEach((v: string) =>
    //   fd.set("addresses[]", v)
    // );

    return fd;
  };

  const saveBusinessDetails = async () => {
    /* quick client validation */
    if (!businessName.trim()) {
      return Alert.alert("Missing", "Business name is required");
    }
    if (!businessEmail.trim() || !emailOk(businessEmail)) {
      return Alert.alert("Missing", "Valid business e-mail is required");
    }

    try {
      const form = buildFormData();

      await dispatch(
        updateUserProfileDetails({ _id: customer.data._id, formData: form })
      ).unwrap();

      await dispatch(getUserProfileDetails(auth.data._id)).unwrap();
      Alert.alert("Success", "Business details updated");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err?.message || "Update failed");
    }
  };

  /* ------------- UI ------------- */
  return (
    <ScrollView style={styles.wrapper}>
      {/* first row */}
      {customer.isLoading ? (
        <SettingsSkeleton />
      ) : (
        <View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Business Name</Text>
              <TextInput
                style={styles.input}
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Business Phone</Text>
              <TextInput
                style={styles.input}
                value={businessPhone}
                onChangeText={setBusinessPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* second row */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Business Email</Text>
              <TextInput
                style={styles.input}
                value={businessEmail}
                onChangeText={setBusinessEmail}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Delivery Address</Text>
              <TextInput
                style={styles.input}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

          {/* company number */}
          <View style={styles.full}>
            <Text style={styles.label}>Company Number</Text>
            <TextInput
              style={styles.input}
              value={companyNumber}
              onChangeText={setCompanyNumber}
            />
          </View>

          {/* accounts payable */}
          <Text style={[styles.label, { marginTop: 16 }]}>
            Accounts Payable
          </Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Contact Name</Text>
              <TextInput
                style={styles.input}
                value={apName}
                onChangeText={setApName}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Contact Email</Text>
              <TextInput
                style={styles.input}
                value={apEmail}
                onChangeText={setApEmail}
                keyboardType="email-address"
              />
            </View>
          </View>
          <View style={styles.full}>
            <Text style={styles.label}>Contact Phone</Text>
            <TextInput
              style={styles.input}
              value={apPhone}
              onChangeText={setApPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      )}
      {/* save btn */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveBusinessDetails}>
        {customer.isPostLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveTxt}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

/* ---------- styles share the same look-and-feel ---------- */
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
  saveBtn: {
    backgroundColor: primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  saveTxt: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default BusinessDetailTab;

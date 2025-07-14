"use client";

import { SettingsSkeleton } from "@/components/ui/Skeletons";
import { primary } from "@/constants/Colors";
import {
  getUserProfileDetails,
  updateUserProfileDetails,
} from "@/store/actions/settingsActions";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

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

    /* ────────────���─────────── primitives ──────────────────────── */
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
    <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
      {customer.isLoading ? (
        <SettingsSkeleton />
      ) : (
        <View style={styles.contentContainer}>
          {/* Business Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Information</Text>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Business Name</Text>
                <TextInput
                  editable={false}
                  style={styles.input}
                  value={businessName}
                  onChangeText={setBusinessName}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Business Phone</Text>
                <TextInput
                  editable={false}
                  style={styles.input}
                  value={businessPhone}
                  onChangeText={setBusinessPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Business Email</Text>
                <TextInput
                  editable={false}
                  style={styles.input}
                  value={businessEmail}
                  onChangeText={setBusinessEmail}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Company Number</Text>
                <TextInput
                  editable={false}
                  style={styles.input}
                  value={companyNumber}
                  onChangeText={setCompanyNumber}
                />
              </View>
            </View>

            {/* Delivery Address - Full Width */}
            <View style={styles.full}>
              <Text style={styles.label}>Delivery Address</Text>
              <TextInput
                editable={false}
                style={styles.addressInput}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Accounts Payable Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accounts Payable</Text>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Contact Name</Text>
                <TextInput
                  editable={false}
                  style={styles.input}
                  value={apName}
                  onChangeText={setApName}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Contact Email</Text>
                <TextInput
                  editable={false}
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
                editable={false}
                style={styles.input}
                value={apPhone}
                onChangeText={setApPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

/* ---------- Enhanced styles ---------- */
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
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    color: "#6B7280",
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
    backgroundColor: "#F9FAFB",
    color: "#6B7280",
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  saveTxt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BusinessDetailTab;

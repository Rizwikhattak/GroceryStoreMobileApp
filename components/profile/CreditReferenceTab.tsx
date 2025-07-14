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

interface Props {
  customerData: any;
}

/* helper for DRY rendering of each reference block */
const ReferenceBlock = ({
  prefix,
  values,
  setters,
}: {
  prefix: "1" | "2";
  values: { name: string; contact: string; phone: string };
  setters: {
    setName: (t: string) => void;
    setContact: (t: string) => void;
    setPhone: (t: string) => void;
  };
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Credit Reference {prefix}</Text>

    <View style={styles.full}>
      <Text style={styles.label}>Name of Business</Text>
      <TextInput
        editable={false}
        style={styles.input}
        value={values.name}
        onChangeText={setters.setName}
      />
    </View>

    <View style={styles.row}>
      <View style={styles.col}>
        <Text style={styles.label}>Contact Person</Text>
        <TextInput
          editable={false}
          style={styles.input}
          value={values.contact}
          onChangeText={setters.setContact}
        />
      </View>
      <View style={styles.col}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          editable={false}
          style={styles.input}
          value={values.phone}
          onChangeText={setters.setPhone}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  </View>
);

const CreditReferenceTab = () => {
  const dispatch = useDispatch();
  const auth = useSelector((s: any) => s.auth);
  const customer = useSelector((s: any) => s.settings);
  const customerData = customer.data;

  /* reference 1 state */
  const [ref1Name, setRef1Name] = useState(customerData.credit_reference1_name);
  const [ref1Contact, setRef1Contact] = useState(
    customerData.credit_reference1_email // site shows "contact person" but API stores email & phone separately
  );
  const [ref1Phone, setRef1Phone] = useState(
    customerData.credit_reference1_phone
  );

  /* reference 2 state */
  const [ref2Name, setRef2Name] = useState(customerData.credit_reference2_name);
  const [ref2Contact, setRef2Contact] = useState(
    customerData.credit_reference2_email
  );
  const [ref2Phone, setRef2Phone] = useState(
    customerData.credit_reference2_phone
  );

  const buildFormData = () => {
    const fd = new FormData();

    /* ──────────────────────── primitives ──────────────────────── */
    fd.set("_id", customerData._id);
    fd.set("first_name", customerData.first_name);
    fd.set("last_name", customerData.last_name);
    fd.set("email", customerData.email);
    fd.set("phone", customerData.phone);
    fd.set("address", customerData.address);
    fd.set("business_name", customerData.business_name);
    fd.set("business_mobile", customerData.business_mobile);
    fd.set("business_email", customerData.business_email);
    fd.set("delivery_address", customerData.delivery_address);
    fd.set("company_number", customerData.company_number);
    fd.set("account_payable_name", customerData.account_payable_name);
    fd.set("account_payable_phone", customerData.account_payable_phone);
    fd.set("account_payable_email", customerData.account_payable_email);

    // asd asd
    fd.set("credit_reference1_name", ref1Name.trim());
    fd.set("credit_reference1_email", ref1Contact.trim());
    fd.set("credit_reference1_phone", ref1Phone.trim());
    fd.set("credit_reference2_name", ref2Name.trim());
    fd.set("credit_reference2_email", ref2Contact.trim());
    fd.set("credit_reference2_phone", ref2Phone.trim());

    /* ──────────────────────── arrays ───────────────────────────── */
    (customerData.billing_addresses ?? []).forEach((v: string) =>
      fd.set("billing_addresses[]", v)
    );
    (customerData.shipping_addresses ?? []).forEach((v: string) =>
      fd.set("shipping_addresses[]", v)
    );
    (customerData.addresses ?? []).forEach((v: string) =>
      fd.set("addresses[]", v)
    );

    return fd;
  };

  /* ------ save handler ------ */
  const saveCreditRefs = async () => {
    if (!ref1Name.trim()) {
      return Alert.alert("Missing", "Reference 1 business name is required");
    }

    try {
      const form = buildFormData();

      await dispatch(
        updateUserProfileDetails({ _id: customer.data._id, formData: form })
      ).unwrap();

      await dispatch(getUserProfileDetails(auth.data._id)).unwrap();

      Alert.alert("Success", "Credit references updated");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err?.message || "Update failed");
    }
  };

  return (
    <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
      {customer.isLoading ? (
        <SettingsSkeleton />
      ) : (
        <View style={styles.contentContainer}>
          <ReferenceBlock
            prefix="1"
            values={{ name: ref1Name, contact: ref1Contact, phone: ref1Phone }}
            setters={{
              setName: setRef1Name,
              setContact: setRef1Contact,
              setPhone: setRef1Phone,
            }}
          />

          <ReferenceBlock
            prefix="2"
            values={{ name: ref2Name, contact: ref2Contact, phone: ref2Phone }}
            setters={{
              setName: setRef2Name,
              setContact: setRef2Contact,
              setPhone: setRef2Phone,
            }}
          />
        </View>
      )}

      {/* <TouchableOpacity style={styles.saveBtn} onPress={saveCreditRefs}>
        {customer.isPostLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveTxt}>Save Changes</Text>
        )}
      </TouchableOpacity> */}
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
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    color: "#6B7280",
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

export default CreditReferenceTab;

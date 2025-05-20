/*
  SettingsTab.js
  Contains logic and UI for account settings form
*/
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerDetails } from "@/store/actions/customerActions";

const SettingsTab = ({customerData}) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const [activeSettingsTab, setActiveSettingsTab] = useState("profile");
  const [firstName, setFirstName] = useState(customerData.first_name);
  const [lastName, setLastName] = useState(customerData.last_name);
  const [email, setEmail] = useState(customerData.email);
  const [phone, setPhone] = useState(customerData.phone);
  const [address, setAddress] = useState(customerData.address);
  const [password, setPassword] = useState("********");

  return (
    <View style={styles.tabContent}>
      <View style={styles.settingsTabs}>
        {[
          ["profile", "Profile Settings"],
          ["business", "Business Detail"],
          ["credit", "Credit Reference"],
        ].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.settingsTab,
              activeSettingsTab === key && styles.activeSettingsTab,
            ]}
            onPress={() => setActiveSettingsTab(key)}
          >
            <Text
              style={[
                styles.settingsTabText,
                activeSettingsTab === key && styles.activeSettingsTabText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeSettingsTab === "profile" && (
        <ScrollView style={styles.settingsForm}>
          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.formLabel}>First Name</Text>
              <TextInput
                style={styles.formInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
              />
            </View>
            <View style={styles.formColumn}>
              <Text style={styles.formLabel}>Last Name</Text>
              <TextInput
                style={styles.formInput}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={styles.formInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.formColumn}>
              <Text style={styles.formLabel}>Phone</Text>
              <TextInput
                style={styles.formInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.formFullRow}>
            <Text style={styles.formLabel}>Address</Text>
            <TextInput
              style={styles.formInput}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address"
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.formFullRow}>
            <Text style={styles.formLabel}>Password</Text>
            <TextInput
              style={styles.formInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
            />
          </View>

          <View style={styles.formFullRow}>
            <Text style={styles.formLabel}>Driver License</Text>
            <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="cloud-upload-outline" size={20} color="#f44336" />
              <Text style={styles.uploadButtonText}>Upload License</Text>
            </TouchableOpacity>
            <Text style={styles.uploadNote}>No file chosen</Text>
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {activeSettingsTab === "business" && (
        <View style={styles.comingSoonContainer}>
          <Ionicons name="business-outline" size={60} color="#f44336" />
          <Text style={styles.comingSoonText}>
            Business Details Coming Soon
          </Text>
        </View>
      )}

      {activeSettingsTab === "credit" && (
        <View style={styles.comingSoonContainer}>
          <Ionicons name="card-outline" size={60} color="#f44336" />
          <Text style={styles.comingSoonText}>
            Credit Reference Coming Soon
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },

  settingsTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingsTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeSettingsTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#f44336",
  },
  settingsTabText: {
    fontSize: 14,
    color: "#666",
  },
  activeSettingsTabText: {
    color: "#f44336",
    fontWeight: "500",
  },
  settingsForm: {
    padding: 16,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  formColumn: {
    flex: 1,
    marginRight: 8,
  },
  formFullRow: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f44336",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  uploadButtonText: {
    color: "#f44336",
    marginLeft: 8,
    fontWeight: "500",
  },
  uploadNote: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#f44336",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  comingSoonText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
});

export default SettingsTab;

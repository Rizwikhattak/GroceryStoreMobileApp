/*
  SettingsTab.tsx
  Only switches between the three dedicated tabs
*/
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { primary } from "@/constants/colors";

/* sub-screens */
import ProfileSettingsTab from "@/components/profile/ProfileSettingsTab";
import BusinessDetailTab from "@/components/profile/BusinessDetailTab";
import CreditReferenceTab from "@/components/profile/CreditReferenceTab";

const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "business" | "credit">(
    "profile"
  );
  const customer = useSelector((s: any) => s.settings);

  return (
    <View style={styles.container}>
      {/* top pill switcher */}
      <View style={styles.tabs}>
        {[
          ["profile", "Profile Settings"],
          ["business", "Business Detail"],
          ["credit", "Credit Reference"],
        ].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, activeTab === key && styles.tabActive]}
            onPress={() => setActiveTab(key as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === key && styles.tabTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* current screen */}
      {activeTab === "profile" && <ProfileSettingsTab />}
      {activeTab === "business" && <BusinessDetailTab />}
      {activeTab === "credit" && <CreditReferenceTab />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderBottomColor: primary },
  tabText: { fontSize: 14, color: "#666" },
  tabTextActive: { color: primary, fontWeight: "500" },
});

export default SettingsTab;

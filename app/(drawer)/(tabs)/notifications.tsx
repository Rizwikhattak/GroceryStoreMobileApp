import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";

import Notifications from "@/components/profile/NotificationsTab";
import HeaderCommon from "@/components/ui/HeaderCommon";

const NotificationsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Status-bar tint */}
      <StatusBar barStyle="dark-content" />

      {/* ---------- header ---------- */}

      <HeaderCommon title="Notifications" isSearchEnabled={false} />

      <View style={styles.divider} />

      {/* ---------- notifications list ---------- */}
      <Notifications />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

/* -------------------------------------------------------------------- */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
    color: "#333",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 8,
  },
});

import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import Notifications from "@/components/profile/NotificationsTab";
import {
  primary,
  dark,
  dark_secondary,
  light,
  light_secondary,
} from "@/constants/colors";
import { useRouter } from "expo-router";

const NotificationsScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => getStyles(colorScheme), [colorScheme]);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Dynamic Status Bar */}
      <StatusBar
        barStyle={colorScheme === "light" ? "dark-content" : "light-content"}
        backgroundColor={colorScheme === "light" ? light : dark}
      />

      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={
          colorScheme === "light" ? ["#ffffff", "#f8f9fa"] : [dark, "#2a2a2a"]
        }
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <View style={styles.backButtonInner}>
              <Ionicons name="chevron-back" size={22} color={primary} />
            </View>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>Stay updated</Text>
          </View>

          <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
            <View style={styles.moreButtonInner}>
              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color={colorScheme === "light" ? "#666" : "#ccc"}
              />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Enhanced Divider */}
      <View style={styles.divider} />

      {/* Content Container */}
      <View style={styles.contentContainer}>
        <Notifications />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colorScheme: string) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colorScheme === "light" ? light : dark,
    },

    headerGradient: {
      paddingTop: 40,
      paddingHorizontal: 20,
      shadowColor: colorScheme === "light" ? "#000" : "#fff",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === "light" ? 0.1 : 0.05,
      shadowRadius: 8,
      elevation: 5,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
    },

    backButton: {
      padding: 4,
    },

    backButtonInner: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colorScheme === "light" ? "#f0f0f0" : dark_secondary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colorScheme === "light" ? "#000" : "#fff",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === "light" ? 0.1 : 0.05,
      shadowRadius: 4,
      elevation: 3,
    },

    headerTitleContainer: {
      flex: 1,
      alignItems: "center",
      marginHorizontal: 16,
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colorScheme === "light" ? primary : "#fff",
      letterSpacing: 0.5,
    },

    headerSubtitle: {
      fontSize: 13,
      color: colorScheme === "light" ? "#666" : "#ccc",
      marginTop: 2,
      fontWeight: "400",
    },

    moreButton: {
      padding: 4,
    },

    moreButtonInner: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colorScheme === "light" ? "#f0f0f0" : dark_secondary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colorScheme === "light" ? "#000" : "#fff",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === "light" ? 0.1 : 0.05,
      shadowRadius: 4,
      elevation: 3,
    },

    divider: {
      height: 1,
      backgroundColor: colorScheme === "light" ? "#e9ecef" : "#333",
      marginHorizontal: 20,
      opacity: 0.8,
    },

    contentContainer: {
      flex: 1,
      backgroundColor: colorScheme === "light" ? "#fafbfc" : "#1a1a1a",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: 16,
    },
  });

export default NotificationsScreen;

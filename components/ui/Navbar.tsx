// components/ui/Navbar.jsx - Simplified version using drawer navigation
import Logo from "@/assets/images/premium-meats-logo.svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const Navbar = ({ title = "Premium meats" }) => {
  const navigation = useNavigation();
  const router = useRouter();
  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
          <Ionicons name="menu" size={24} color="#8B1538" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Logo width={200} height={50} style={{ alignSelf: "center" }} />
        </View>

        <TouchableOpacity
          style={[styles.actionButton]}
          activeOpacity={0.7}
          onPress={() => router.push("/SearchPage")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="search" size={22} color={"#666"} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    // paddingTop: 30,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.select({
      ios: 20,
    }),
    paddingTop: Platform.select({
      ios: 40,
    }),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  actionButton: {
    padding: 6,
    borderRadius: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
});

export default Navbar;

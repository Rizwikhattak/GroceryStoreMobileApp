// components/ui/CustomDrawerContent.jsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/reducers/authSlice";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import Logo from "../../assets/images/premium-meats-logo.svg";
import { useModal } from "@/utils/useModal";
import CustomModal from "@/components/ui/CustomModak";

const CustomDrawerContent = (props) => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    modalState,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showConfirmation,
  } = useModal();
  const handleLogout = () => {
    showError(
      "Remove Item",
      `Are you sure you want to logout?`,
      "Logout",
      () => {
        console.log("User logged out");
        dispatch(logout());
        router.replace("/(auth)");
        hideModal();
      }
    );
  };

  const menuItems = [
    {
      id: 1,
      title: "Home",
      icon: "home-outline",
      screen: "/(drawer)/(tabs)",
    },
    {
      id: 5,
      title: "Contact Us",
      icon: "mail-outline",
      screen: "/ContactUs",
    },
    {
      id: 6,
      title: "About Us",
      icon: "information-circle-outline",
      screen: "/AboutUs",
    },
    {
      id: 7,
      title: "Settings",
      icon: "settings-outline",
      screen: "/(drawer)/(tabs)/profile", // This should work now
    },
  ];

  const handleNavigation = (screenPath) => {
    try {
      // Close the drawer first
      props.navigation?.closeDrawer?.();

      // Add a small delay to ensure drawer closes before navigation
      setTimeout(() => {
        if (screenPath.includes("/(drawer)/(tabs)/")) {
          // For tab screens, use replace to ensure proper navigation
          router.replace(screenPath);
        } else {
          // For other screens, use push
          router.push(screenPath);
        }
      }, 100);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation
      try {
        router.replace(screenPath);
      } catch (fallbackError) {
        console.error("Fallback navigation also failed:", fallbackError);
      }
    }
  };

  // Alternative navigation method specifically for profile
  const handleProfileNavigation = () => {
    try {
      props.navigation?.closeDrawer?.();

      // Navigate to the tabs navigator first, then to profile
      setTimeout(() => {
        // This ensures we're in the tab navigator context
        router.push("/(drawer)/(tabs)");

        // Then navigate to the profile tab
        setTimeout(() => {
          // If your tab navigator has a method to switch tabs
          props.navigation?.navigate?.("(tabs)", {
            screen: "Profile",
            initial: false,
          });
        }, 200);
      }, 100);
    } catch (error) {
      console.error("Profile navigation error:", error);
      // Fallback: just go to profile directly
      router.replace("/(drawer)/(tabs)/profile");
    }
  };

  return (
    <View style={styles.container}>
      <CustomModal
        isVisible={modalState.isVisible}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        primaryButtonText={modalState.primaryButtonText}
        secondaryButtonText={modalState.secondaryButtonText}
        onPrimaryPress={modalState.onPrimaryPress}
        onSecondaryPress={modalState.onSecondaryPress}
        animationType="slide"
        size="medium"
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Custom Header */}
        <View style={styles.header}>
          <Logo width={200} height={60} style={{ alignSelf: "center" }} />
          <TouchableOpacity
            onPress={() => props.navigation?.closeDrawer?.()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#8B1538" />
          </TouchableOpacity>
        </View>

        {/* User Section */}
        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>
              {user?.data?.first_name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.userName}>
            Welcome, {user?.data?.first_name || "User"}
          </Text>
          <Text style={styles.userEmail}>{user?.data?.email || ""}</Text>
        </View>

        {/* Menu Items */}
        <ScrollView
          style={styles.menuContainer}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                // Special handling for Settings/Profile
                if (item.id === 7) {
                  handleProfileNavigation();
                } else {
                  handleNavigation(item.screen);
                }
              }}
            >
              <Ionicons name={item.icon} size={22} color="#666" />
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Logout Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#8B1538" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  closeButton: {
    padding: 4,
  },
  userSection: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8B1538",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  userInitial: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  menuItemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8B1538",
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#8B1538",
    fontWeight: "500",
  },
});

export default CustomDrawerContent;

import SearchInput from "@/components/ui/SearchInput";
import { primary, shades } from "@/constants/colors";
import { logout } from "@/store/reducers/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";
import { Heart } from "lucide-react-native";
const HeaderCommon = ({
  title,
  subtitle,
  isSearchEnabled = false,
  isLogoutEnabled = false,
  isHeartEnabled = false,
  isFavorite,
  setIsFavorite,
  searchFilters = {},
  enableDropdown,
}: any) => {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          // Dispatch logout action
          // dispatch({ type: 'LOGOUT' });
          console.log("User logged out");
          dispatch(logout());

          // Navigate to login screen
          // router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  };
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="chevron-back" size={22} color={primary} />
          </View>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>

        {isSearchEnabled ? (
          <TouchableOpacity
            style={styles.searchButton}
            activeOpacity={0.7}
            onPress={() => setShowSearch(!showSearch)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="search" size={22} color="#666" />
            </View>
          </TouchableOpacity>
        ) : isLogoutEnabled ? (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.iconContainer}>
              <Ionicons name="log-out-outline" size={22} color={primary} />
            </View>
          </TouchableOpacity>
        ) : isHeartEnabled ? (
          <TouchableOpacity
            style={[
              styles.headerButton,
              isFavorite && styles.favoriteButtonActive,
            ]}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              color={isFavorite ? "#fff" : "#666"}
              size={24}
              fill={isFavorite ? "#fff" : "none"}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      {showSearch && (
        <View style={styles.searchBox}>
          <SearchInput
            searchFilters={searchFilters}
            enableDropdown={enableDropdown}
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: shades.white,
    borderBottomWidth: 1,
    borderBottomColor: shades.lighterGray,
    elevation: 2,
    shadowColor: "#000",
    paddingTop: Constants.statusBarHeight,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  favoriteButtonActive: {
    backgroundColor: primary,
  },
  logoutButton: {
    padding: 4,
  },
  searchBox: { paddingHorizontal: 16, paddingVertical: 12 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: shades.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 24,
  },
  backButton: { marginRight: 12 },
  headerTitleContainer: { flex: 1, alignItems: "center" },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#555555",
    fontWeight: "500",
  },
  searchButton: { marginLeft: 12 },
});
export default HeaderCommon;

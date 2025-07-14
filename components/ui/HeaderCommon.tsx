import CustomModal from "@/components/ui/CustomModak";
import SearchInput from "@/components/ui/SearchInput";
import { primary } from "@/constants/Colors";
import { TOAST_MESSAGES } from "@/constants/constants";
import { logout } from "@/store/reducers/authSlice";
import { ToastHelper } from "@/utils/ToastHelper";
import { useModal } from "@/utils/useModal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

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
  handleSearchInput,
}: any) => {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();
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

  return (
    <View>
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
      <View style={styles.header}>
        {/* Enhanced gradient background overlay */}
        {/* <View style={styles.gradientOverlay} /> */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="chevron-back" size={24} color={primary} />
          </View>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <View style={styles.subtitleContainer}>
              <View style={styles.subtitleDot} />
              <Text style={styles.headerSubtitle}>{subtitle}</Text>
            </View>
          )}
        </View>

        {isSearchEnabled ? (
          <TouchableOpacity
            style={[
              styles.actionButton,
              showSearch && styles.actionButtonActive,
            ]}
            activeOpacity={0.7}
            onPress={() => setShowSearch(!showSearch)}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="search"
                size={22}
                color={showSearch ? "#fff" : "#666"}
              />
            </View>
          </TouchableOpacity>
        ) : isLogoutEnabled ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="log-out-outline" size={22} color={primary} />
            </View>
          </TouchableOpacity>
        ) : isHeartEnabled ? (
          <TouchableOpacity
            style={[styles.heartButton, isFavorite && styles.heartButtonActive]}
            onPress={() => {
              setIsFavorite(!isFavorite);
              if (!isFavorite)
                ToastHelper.showSuccess({
                  title: TOAST_MESSAGES.ADDED_TO_WISH_LIST.title,
                });
              else
                ToastHelper.showWarning({
                  title: TOAST_MESSAGES.REMOVED_FROM_WISH_LIST.title,
                });
            }}
            activeOpacity={0.8}
          >
            <Heart
              color={isFavorite ? "#fff" : "#666"}
              size={22}
              fill={isFavorite ? "#fff" : "none"}
            />
            {isFavorite && <View style={styles.heartGlow} />}
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {showSearch && (
        <View style={styles.searchBox}>
          <View style={styles.searchContainer}>
            <SearchInput
              searchFilters={searchFilters}
              enableDropdown={enableDropdown}
              handleSearchInput={handleSearchInput}
            />
          </View>
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
    paddingVertical: 18,
    backgroundColor: "#ffffff",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
    elevation: 8,
    shadowColor: "#000",
    // paddingTop: Constants.statusBarHeight + 8,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    position: "relative",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    // backgroundColor: primary,
    opacity: 0.8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 12,
    // backgroundColor: "rgba(105, 17, 18, 0.05)",
    transition: "all 0.2s ease",
  },
  actionButtonActive: {
    backgroundColor: primary,
    transform: [{ scale: 0.95 }],
  },
  heartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    // backgroundColor: "rgba(105, 17, 18, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: primary,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 8,
    // elevation: 4,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(105, 17, 18, 0.1)",
  },
  heartButtonActive: {
    backgroundColor: primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.05 }],
  },
  heartGlow: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: primary,
    opacity: 0.2,
    zIndex: -1,
  },
  searchBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(105, 17, 18, 0.02)",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(105, 17, 18, 0.1)",
  },
  searchContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
  placeholder: {
    width: 44,
  },
  backButton: {
    marginRight: 12,
    padding: 2,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  subtitleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: primary,
    marginRight: 6,
    opacity: 0.7,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#666666",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});

export default HeaderCommon;

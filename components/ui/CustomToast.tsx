import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BaseToast, ErrorToast, InfoToast } from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";

// Custom Toast Configurations
export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={[styles.baseToast, styles.successToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text1NumberOfLines={0} // Allow unlimited lines for title
      text2NumberOfLines={0} // Allow unlimited lines for subtitle
      onPress={() => {}} // Disable default press behavior
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={24} color="#4CAF50" />
        </View>
      )}
      renderTrailingIcon={() => (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={(e) => {
            e?.stopPropagation?.();
            Toast.hide();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="close" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    />
  ),

  error: (props: any) => (
    <BaseToast
      {...props}
      style={[styles.baseToast, styles.errorToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text1NumberOfLines={0} // Allow unlimited lines for title
      text2NumberOfLines={0} // Allow unlimited lines for subtitle
      onPress={() => {}} // Disable default press behavior
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Icon name="error" size={24} color="#F44336" />
        </View>
      )}
      renderTrailingIcon={() => (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={(e) => {
            e?.stopPropagation?.();
            Toast.hide();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    />
  ),

  warning: (props: any) => (
    <BaseToast
      {...props}
      style={[styles.baseToast, styles.warningToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text1NumberOfLines={0} // Allow unlimited lines for title
      text2NumberOfLines={0} // Allow unlimited lines for subtitle
      onPress={() => {}} // Disable default press behavior
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Icon name="warning" size={24} color="#FF9800" />
        </View>
      )}
      renderTrailingIcon={() => (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={(e) => {
            e?.stopPropagation?.();
            Toast.hide();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={[styles.baseToast, styles.infoToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text1NumberOfLines={0} // Allow unlimited lines for title
      text2NumberOfLines={0} // Allow unlimited lines for subtitle
      onPress={() => {}} // Disable default press behavior
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Icon name="info" size={24} color="#2196F3" />
        </View>
      )}
      renderTrailingIcon={() => (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={(e) => {
            e?.stopPropagation?.();
            Toast.hide();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    />
  ),
};

const styles = StyleSheet.create({
  baseToast: {
    borderLeftWidth: 0,
    borderRadius: 12,
    minHeight: 60,
    width: "90%",
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12, // Added vertical padding for better spacing with multiline text
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  successToast: {
    backgroundColor: "#2C2C2C",
  },

  errorToast: {
    backgroundColor: "#2C2C2C",
  },

  warningToast: {
    backgroundColor: "#2C2C2C",
  },

  infoToast: {
    backgroundColor: "#2C2C2C",
  },

  contentContainer: {
    paddingHorizontal: 8,
    flex: 1,
    justifyContent: "center",
  },

  iconContainer: {
    justifyContent: "flex-start", // Changed from center to flex-start
    alignItems: "center",
    marginRight: 12,
    paddingTop: 4, // Small padding to align with first line of text
  },

  closeButton: {
    justifyContent: "flex-start", // Changed from center to flex-start
    alignItems: "center",
    alignSelf: "flex-start", // Changed from center to flex-start
    marginLeft: 8,
    marginTop: 4, // Small margin to align with first line of text
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  text1: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
    lineHeight: 16, // Added line height for better readability
    flexWrap: "wrap", // Allow text to wrap
  },

  text2: {
    fontSize: 14,
    fontWeight: "400",
    color: "#CCCCCC",
    lineHeight: 18, // Added line height for better readability
    flexWrap: "wrap", // Allow text to wrap
  },
});

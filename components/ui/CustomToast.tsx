import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BaseToast, ErrorToast, InfoToast } from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialIcons";

// Custom Toast Configurations
export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={[styles.baseToast, styles.successToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={24} color="#4CAF50" />
        </View>
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
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Icon name="error" size={24} color="#F44336" />
        </View>
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
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Icon name="warning" size={24} color="#FF9800" />
        </View>
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
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <Icon name="info" size={24} color="#2196F3" />
        </View>
      )}
    />
  ),
};

const styles = StyleSheet.create({
  baseToast: {
    borderLeftWidth: 0,
    borderRadius: 12,
    height: 60,
    width: "90%",
    marginHorizontal: 20,
    paddingHorizontal: 16,
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  text1: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },

  text2: {
    fontSize: 14,
    fontWeight: "400",
    color: "#CCCCCC",
  },
});

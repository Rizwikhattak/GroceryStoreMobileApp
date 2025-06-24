import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: "success" | "error" | "warning" | "info" | "confirmation";
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  showCloseButton?: boolean;
  children?: React.ReactNode;
  animationType?: "slide" | "fade" | "bounce";
  backdropOpacity?: number;
  size?: "small" | "medium" | "large";
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  title,
  message,
  type = "confirmation",
  primaryButtonText = "OK",
  secondaryButtonText = "Cancel",
  onPrimaryPress,
  onSecondaryPress,
  showCloseButton = true,
  children,
  animationType = "slide",
  backdropOpacity = 0.7,
  size = "medium",
}) => {
  const getModalConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: "checkmark-circle",
          iconColor: "#4CAF50",
          iconBackground: "#E8F5E8",
          primaryColor: "#4CAF50",
        };
      case "error":
        return {
          icon: "close-circle",
          iconColor: "#F44336",
          iconBackground: "#FFEBEE",
          primaryColor: "#F44336",
        };
      case "warning":
        return {
          icon: "warning",
          iconColor: "#FF9800",
          iconBackground: "#FFF3E0",
          primaryColor: "#FF9800",
        };
      case "info":
        return {
          icon: "information-circle",
          iconColor: "#2196F3",
          iconBackground: "#E3F2FD",
          primaryColor: "#2196F3",
        };
      default:
        return {
          icon: "help-circle",
          iconColor: "#9C27B0",
          iconBackground: "#F3E5F5",
          primaryColor: "#9C27B0",
        };
    }
  };

  const getAnimationConfig = () => {
    switch (animationType) {
      case "fade":
        return {
          animationIn: "fadeIn",
          animationOut: "fadeOut",
        };
      case "bounce":
        return {
          animationIn: "bounceIn",
          animationOut: "bounceOut",
        };
      default:
        return {
          animationIn: "slideInUp",
          animationOut: "slideOutDown",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { width: screenWidth * 0.8, maxHeight: screenHeight * 0.4 };
      case "large":
        return { width: screenWidth * 0.95, maxHeight: screenHeight * 0.8 };
      default:
        return { width: screenWidth * 0.85, maxHeight: screenHeight * 0.6 };
    }
  };

  const config = getModalConfig();
  const animationConfig = getAnimationConfig();
  const sizeStyles = getSizeStyles();

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    } else {
      onClose();
    }
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={backdropOpacity}
      animationIn={animationConfig.animationIn as any}
      animationOut={animationConfig.animationOut as any}
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
      style={styles.modal}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />

      <View style={[styles.modalContainer, sizeStyles]}>
        {/* Close Button */}
        {showCloseButton && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        )}

        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: config.iconBackground },
          ]}
        >
          <Ionicons
            name={config.icon as any}
            size={48}
            color={config.iconColor}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.message}>{message}</Text>}
          {children && <View style={styles.customContent}>{children}</View>}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {secondaryButtonText && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleSecondaryPress}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>
                {secondaryButtonText}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: config.primaryColor },
              !secondaryButtonText && styles.fullWidthButton,
            ]}
            onPress={handlePrimaryPress}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  content: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 28,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  customContent: {
    marginTop: 16,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primaryButton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  fullWidthButton: {
    flex: 1,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomModal;

import React from "react";
import { Text, TextProps, StyleSheet, TextStyle } from "react-native";

type Variant = "regular" | "bold" | "semiBold" | "medium" | "extraBold";

interface AppTextProps extends TextProps {
  variant?: Variant;
}

const AppText: React.FC<AppTextProps> = ({
  style,
  children,
  variant = "regular",
  ...rest
}) => {
  const getFontStyle = (): TextStyle => {
    switch (variant) {
      case "bold":
        return styles.boldText;
      case "semiBold":
        return styles.semiBoldText;
      case "medium":
        return styles.mediumText;
      case "extraBold":
        return styles.extraBoldText;
      case "regular":
      default:
        return styles.defaultText;
    }
  };

  return (
    <Text style={[getFontStyle(), style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: "Optima-regular",
    fontSize: 16,
    color: "#000",
  },
  boldText: {
    fontFamily: "Optima-bold",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  semiBoldText: {
    fontFamily: "Optima-semi-bold",
    fontSize: 16,
    color: "#000",
  },
  mediumText: {
    fontFamily: "Optima-medium",
    fontSize: 16,
    color: "#000",
  },
  extraBoldText: {
    fontFamily: "Optima-extra-bold",
    fontSize: 16,
    color: "#000",
  },
});

export default AppText;

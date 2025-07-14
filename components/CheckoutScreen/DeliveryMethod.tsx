import { primary } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DeliveryMethod = ({ deliveryMethod, setDeliveryMethod }) => {
  // Memoize the press handlers to prevent unnecessary re-renders
  const handleDeliveryPress = useCallback(() => {
    setDeliveryMethod("delivery");
  }, [setDeliveryMethod]);

  const handlePickupPress = useCallback(() => {
    setDeliveryMethod("pickup");
  }, [setDeliveryMethod]);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Delivery Method</Text>
      <View style={styles.deliveryOptions}>
        <TouchableOpacity
          style={[
            styles.deliveryOption,
            deliveryMethod === "delivery" && styles.selectedDeliveryOption,
          ]}
          onPress={handleDeliveryPress}
          activeOpacity={0.6}
          // Add these props to improve touch handling
          delayPressIn={0}
          delayPressOut={0}
          delayLongPress={500}
          // Ensure the touchable area is large enough
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <Ionicons
            name="bicycle"
            size={24}
            color={deliveryMethod === "delivery" ? primary : "#888"}
          />
          <Text
            style={[
              styles.deliveryOptionText,
              deliveryMethod === "delivery" &&
                styles.selectedDeliveryOptionText,
            ]}
          >
            Delivery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.deliveryOption,
            deliveryMethod === "pickup" && styles.selectedDeliveryOption,
          ]}
          onPress={handlePickupPress}
          activeOpacity={0.6}
          // Add these props to improve touch handling
          delayPressIn={0}
          delayPressOut={0}
          delayLongPress={500}
          // Ensure the touchable area is large enough
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <Ionicons
            name="storefront"
            size={24}
            color={deliveryMethod === "pickup" ? primary : "#888"}
          />
          <Text
            style={[
              styles.deliveryOptionText,
              deliveryMethod === "pickup" && styles.selectedDeliveryOptionText,
            ]}
          >
            Pickup
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  deliveryOptionText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  selectedDeliveryOption: {
    borderColor: primary,
    backgroundColor: "#fff5f5",
  },
  selectedDeliveryOptionText: {
    color: primary,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  deliveryOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deliveryOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    // Ensure minimum touch target size (44x44 points recommended by Apple/Google)
    minHeight: 44,
    minWidth: 44,
  },
});

export default DeliveryMethod;

// import { primary } from "@/constants/Colors";
// import { Ionicons } from "@expo/vector-icons";
// import React, { useCallback, useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Pressable,
// } from "react-native";

// const DeliveryMethod = ({ deliveryMethod, setDeliveryMethod }) => {
//   // Add state to prevent rapid multiple presses
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Memoize the press handlers with debouncing
//   const handleDeliveryPress = useCallback(async () => {
//     if (isProcessing || deliveryMethod === "delivery") return;

//     setIsProcessing(true);
//     setDeliveryMethod("delivery");

//     // Small delay to prevent rapid successive presses
//     setTimeout(() => setIsProcessing(false), 150);
//   }, [setDeliveryMethod, deliveryMethod, isProcessing]);

//   const handlePickupPress = useCallback(async () => {
//     if (isProcessing || deliveryMethod === "pickup") return;

//     setIsProcessing(true);
//     setDeliveryMethod("pickup");

//     // Small delay to prevent rapid successive presses
//     setTimeout(() => setIsProcessing(false), 150);
//   }, [setDeliveryMethod, deliveryMethod, isProcessing]);

//   return (
//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>Delivery Method</Text>
//       <View style={styles.deliveryOptions}>
//         <Pressable
//           style={({ pressed }) => [
//             styles.deliveryOption,
//             deliveryMethod === "delivery" && styles.selectedDeliveryOption,
//             pressed && styles.pressedOption,
//           ]}
//           onPress={handleDeliveryPress}
//           disabled={isProcessing}
//           // Better touch handling with Pressable
//           hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//         >
//           <Ionicons
//             name="bicycle"
//             size={24}
//             color={deliveryMethod === "delivery" ? primary : "#888"}
//           />
//           <Text
//             style={[
//               styles.deliveryOptionText,
//               deliveryMethod === "delivery" &&
//                 styles.selectedDeliveryOptionText,
//             ]}
//           >
//             Delivery
//           </Text>
//         </Pressable>

//         <Pressable
//           style={({ pressed }) => [
//             styles.deliveryOption,
//             deliveryMethod === "pickup" && styles.selectedDeliveryOption,
//             pressed && styles.pressedOption,
//           ]}
//           onPress={handlePickupPress}
//           disabled={isProcessing}
//           // Better touch handling with Pressable
//           hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//         >
//           <Ionicons
//             name="storefront"
//             size={24}
//             color={deliveryMethod === "pickup" ? primary : "#888"}
//           />
//           <Text
//             style={[
//               styles.deliveryOptionText,
//               deliveryMethod === "pickup" && styles.selectedDeliveryOptionText,
//             ]}
//           >
//             Pickup
//           </Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   deliveryOptionText: {
//     marginLeft: 8,
//     fontSize: 16,
//     color: "#333",
//   },
//   selectedDeliveryOption: {
//     borderColor: primary,
//     backgroundColor: "#fff5f5",
//   },
//   selectedDeliveryOptionText: {
//     color: primary,
//     fontWeight: "500",
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 12,
//     color: "#333",
//   },
//   deliveryOptions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   deliveryOption: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//     marginHorizontal: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     // Ensure minimum touch target size (44x44 points recommended by Apple/Google)
//     minHeight: 44,
//     minWidth: 44,
//   },
//   pressedOption: {
//     opacity: 0.6,
//     transform: [{ scale: 0.98 }],
//   },
// });

// export default DeliveryMethod;

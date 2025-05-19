import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalSearchParams, useRouter } from "expo-router";

const CheckoutScreen = ({ route, navigation }) => {
  // Destructure parameters from route.params; these should be passed when navigating here.
  const router = useRouter();
  const { cartTotal, subtotal, deliveryFee } = useGlobalSearchParams();

  const [deliveryMethod, setDeliveryMethod] = useState("delivery"); // "delivery" or "pickup"
  const [paymentMethod, setPaymentMethod] = useState("cash"); // "cash", "card", or "online"

  // Delivery address state
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "Dhoke Kala Khan",
    street: "123 Main Street",
    city: "Islamabad",
    phone: "+92 300 1234567",
  });

  // Pickup location state
  const [selectedPickupLocation, setSelectedPickupLocation] = useState("main");

  // Sample pickup locations
  const pickupLocations = [
    {
      id: "main",
      name: "Main Branch",
      address: "G-9 Markaz, Islamabad",
      time: "9:00 AM - 10:00 PM",
    },
    {
      id: "f10",
      name: "F-10 Branch",
      address: "F-10 Markaz, Islamabad",
      time: "10:00 AM - 9:00 PM",
    },
    {
      id: "bahria",
      name: "Bahria Town Branch",
      address: "Phase 4, Bahria Town",
      time: "9:00 AM - 8:00 PM",
    },
  ];

  const handlePlaceOrder = () => {
    Alert.alert("Order Placed", "Your order has been placed successfully!", [
      { text: "OK", onPress: () => navigation.navigate("Home") },
    ]);
  };

  const renderDeliveryForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formLabel}>Delivery Address</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={deliveryAddress.name}
          onChangeText={(text) =>
            setDeliveryAddress({ ...deliveryAddress, name: text })
          }
          placeholder="Enter your full name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Street Address</Text>
        <TextInput
          style={styles.input}
          value={deliveryAddress.street}
          onChangeText={(text) =>
            setDeliveryAddress({ ...deliveryAddress, street: text })
          }
          placeholder="Enter street address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>City</Text>
        <TextInput
          style={styles.input}
          value={deliveryAddress.city}
          onChangeText={(text) =>
            setDeliveryAddress({ ...deliveryAddress, city: text })
          }
          placeholder="Enter city"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={deliveryAddress.phone}
          onChangeText={(text) =>
            setDeliveryAddress({ ...deliveryAddress, phone: text })
          }
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.deliveryTimeContainer}>
        <Text style={styles.deliveryTimeTitle}>Estimated Delivery Time</Text>
        <Text style={styles.deliveryTimeValue}>30-45 minutes</Text>
      </View>
    </View>
  );

  const renderPickupForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formLabel}>Select Pickup Location</Text>

      {pickupLocations.map((location) => (
        <TouchableOpacity
          key={location.id}
          style={[
            styles.pickupLocationCard,
            selectedPickupLocation === location.id &&
              styles.selectedPickupLocation,
          ]}
          onPress={() => setSelectedPickupLocation(location.id)}
        >
          <View style={styles.pickupLocationHeader}>
            <Text style={styles.pickupLocationName}>{location.name}</Text>
            {selectedPickupLocation === location.id && (
              <Ionicons name="checkmark-circle" size={24} color="#f44336" />
            )}
          </View>
          <Text style={styles.pickupLocationAddress}>{location.address}</Text>
          <Text style={styles.pickupLocationTime}>Hours: {location.time}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.deliveryTimeContainer}>
        <Text style={styles.deliveryTimeTitle}>Pickup Instructions</Text>
        <Text style={styles.deliveryTimeValue}>
          Show your order ID at the counter
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#f44336" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Method Selection */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Delivery Method</Text>
          <View style={styles.deliveryOptions}>
            <TouchableOpacity
              style={[
                styles.deliveryOption,
                deliveryMethod === "delivery" && styles.selectedDeliveryOption,
              ]}
              onPress={() => setDeliveryMethod("delivery")}
            >
              <Ionicons
                name="bicycle"
                size={24}
                color={deliveryMethod === "delivery" ? "#f44336" : "#888"}
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
              onPress={() => setDeliveryMethod("pickup")}
            >
              <Ionicons
                name="storefront"
                size={24}
                color={deliveryMethod === "pickup" ? "#f44336" : "#888"}
              />
              <Text
                style={[
                  styles.deliveryOptionText,
                  deliveryMethod === "pickup" &&
                    styles.selectedDeliveryOptionText,
                ]}
              >
                Pickup
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conditional Form Rendering */}
        {deliveryMethod === "delivery"
          ? renderDeliveryForm()
          : renderPickupForm()}

        {/* Payment Method Selection */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "cash" && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <Ionicons
                name="cash"
                size={24}
                color={paymentMethod === "cash" ? "#f44336" : "#888"}
              />
              <Text style={styles.paymentOptionText}>
                Cash on {deliveryMethod === "delivery" ? "Delivery" : "Pickup"}
              </Text>
              {paymentMethod === "cash" && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#f44336"
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "card" && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod("card")}
            >
              <Ionicons
                name="card"
                size={24}
                color={paymentMethod === "card" ? "#f44336" : "#888"}
              />
              <Text style={styles.paymentOptionText}>Credit/Debit Card</Text>
              {paymentMethod === "card" && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#f44336"
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "online" && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod("online")}
            >
              <Ionicons
                name="globe"
                size={24}
                color={paymentMethod === "online" ? "#f44336" : "#888"}
              />
              <Text style={styles.paymentOptionText}>Online Payment</Text>
              {paymentMethod === "online" && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#f44336"
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{subtotal} $</Text>
          </View>

          {deliveryMethod === "delivery" && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>{deliveryFee} $</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{cartTotal} $</Text>
          </View>
        </View>

        {/* Bottom Space for Fixed Button */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Fixed Place Order Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.checkoutButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f44336",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
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
  },
  selectedDeliveryOption: {
    borderColor: "#f44336",
    backgroundColor: "#fff5f5",
  },
  deliveryOptionText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  selectedDeliveryOptionText: {
    color: "#f44336",
    fontWeight: "500",
  },
  formContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  deliveryTimeContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  deliveryTimeTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  deliveryTimeValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  pickupLocationCard: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  selectedPickupLocation: {
    borderColor: "#f44336",
    backgroundColor: "#fff5f5",
  },
  pickupLocationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pickupLocationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pickupLocationAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  pickupLocationTime: {
    fontSize: 14,
    color: "#666",
  },
  paymentOptions: {
    marginTop: 8,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedPaymentOption: {
    backgroundColor: "#fff5f5",
  },
  paymentOptionText: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  checkIcon: {
    marginLeft: "auto",
  },
  summaryContainer: {
    padding: 16,
    marginBottom: 100,
    backgroundColor: "#f9f9f9",
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f44336",
  },
  bottomSpace: {
    height: 80,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  checkoutButton: {
    backgroundColor: "#f44336",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;

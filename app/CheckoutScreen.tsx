"use client";

import { useState } from "react";
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
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { primary } from "@/constants/colors";

const CheckoutScreen = ({ route, navigation }) => {
  const router = useRouter();
  const {
    cartTotal,
    subtotal,
    deliveryFee,
    gstAmount = "0",
  } = useGlobalSearchParams();

  const [deliveryMethod, setDeliveryMethod] = useState("delivery"); // "delivery" or "pickup"
  const [selectedDate, setSelectedDate] = useState(null);
  const [orderInstructions, setOrderInstructions] = useState("");

  // Delivery address - now just displayed, not editable
  const deliveryAddress = {
    name: "John Doe",
    street: "54 Stoddard Road",
    city: "Wesley, Auckland 1041",
    country: "New Zealand",
    phone: "+64 21 123 4567",
  };

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

  // Selected pickup location
  const [selectedPickupLocation, setSelectedPickupLocation] = useState("main");

  // Generate delivery dates (next 7 days)
  const getDeliveryDates = () => {
    const dates = [];
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Start from tomorrow
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      dates.push({
        id: i.toString(),
        day: daysOfWeek[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        year: date.getFullYear(),
        fullDate: date,
      });
    }

    return dates;
  };

  const deliveryDates = getDeliveryDates();

  const handlePlaceOrder = () => {
    if (!selectedDate) {
      Alert.alert("Select Date", "Please select a delivery/pickup date");
      return;
    }

    Alert.alert("Order Placed", "Your order has been placed successfully!", [
      {
        text: "OK",
        onPress: () => navigation?.navigate("Home") || router.push("/"),
      },
    ]);
  };

  // Handle date selection with immediate visual feedback
  const handleDateSelection = (dateId) => {
    setSelectedDate(dateId);
  };

  // Handle pickup location selection with immediate visual feedback
  const handlePickupLocationSelection = (locationId) => {
    setSelectedPickupLocation(locationId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Delivery Method Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Delivery Method</Text>
            <View style={styles.deliveryOptions}>
              <TouchableOpacity
                style={[
                  styles.deliveryOption,
                  deliveryMethod === "delivery" &&
                    styles.selectedDeliveryOption,
                ]}
                onPress={() => setDeliveryMethod("delivery")}
                activeOpacity={0.6}
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
                onPress={() => setDeliveryMethod("pickup")}
                activeOpacity={0.6}
              >
                <Ionicons
                  name="storefront"
                  size={24}
                  color={deliveryMethod === "pickup" ? primary : "#888"}
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

          {/* Delivery Address or Pickup Location */}
          <View style={styles.sectionContainer}>
            {deliveryMethod === "delivery" ? (
              <>
                <Text style={styles.sectionTitle}>Deliver to:</Text>
                <View style={styles.addressCard}>
                  <Text style={styles.addressName}>{deliveryAddress.name}</Text>
                  <Text style={styles.addressText}>
                    {deliveryAddress.street}
                  </Text>
                  <Text style={styles.addressText}>{deliveryAddress.city}</Text>
                  <Text style={styles.addressText}>
                    {deliveryAddress.phone}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.changeAddressButton}
                  activeOpacity={0.6}
                >
                  <Text style={styles.changeAddressText}>Change Address</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Pickup from:</Text>
                {pickupLocations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    style={[
                      styles.pickupLocationCard,
                      selectedPickupLocation === location.id &&
                        styles.selectedPickupLocation,
                    ]}
                    onPress={() => handlePickupLocationSelection(location.id)}
                    activeOpacity={0.6}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <View style={styles.pickupLocationHeader}>
                      <Text style={styles.pickupLocationName}>
                        {location.name}
                      </Text>
                      {selectedPickupLocation === location.id && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={primary}
                        />
                      )}
                    </View>
                    <Text style={styles.pickupLocationAddress}>
                      {location.address}
                    </Text>
                    <Text style={styles.pickupLocationTime}>
                      Hours: {location.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>

          {/* Delivery/Pickup Date Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {deliveryMethod === "delivery" ? "Delivery" : "Pickup"} Date
            </Text>

            <View style={styles.dateContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {deliveryDates.map((date) => (
                  <TouchableOpacity
                    key={date.id}
                    style={[
                      styles.dateCard,
                      selectedDate === date.id && styles.selectedDateCard,
                    ]}
                    onPress={() => handleDateSelection(date.id)}
                    activeOpacity={0.6}
                    hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                  >
                    <View style={styles.dateCardContent}>
                      <Text
                        style={[
                          styles.dayText,
                          selectedDate === date.id && styles.selectedDateText,
                        ]}
                      >
                        {date.day}
                      </Text>
                      <Text
                        style={[
                          styles.dateText,
                          selectedDate === date.id && styles.selectedDateText,
                        ]}
                      >
                        {date.date}
                      </Text>
                      <Text
                        style={[
                          styles.monthText,
                          selectedDate === date.id && styles.selectedDateText,
                        ]}
                      >
                        {date.month} {date.year}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.deliveryNote}>
              If an order is placed before 5:00pm then it will be delivered on
              the same day, otherwise it will be processed for the next day.
            </Text>
          </View>

          {/* Order Instructions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Order Instructions</Text>
            <TextInput
              style={styles.instructionsInput}
              placeholder="Add any special instructions for your order here..."
              multiline
              numberOfLines={4}
              value={orderInstructions}
              onChangeText={setOrderInstructions}
            />
          </View>

          {/* Order Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (15%)</Text>
              <Text style={styles.summaryValue}>${gstAmount}</Text>
            </View>

            {deliveryMethod === "delivery" && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>${deliveryFee}</Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>Rs. {cartTotal}</Text>
            </View>
          </View>

          {/* Add some padding at the bottom to ensure content isn't hidden behind the fixed button */}
          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Place Order Button - now positioned absolutely */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handlePlaceOrder}
            activeOpacity={0.7}
          >
            <Text style={styles.checkoutButtonText}>Place Order</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="white"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 0 : 40,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    zIndex: 10,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: primary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: 80, // Add padding to account for the fixed button
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
  },
  selectedDeliveryOption: {
    borderColor: primary,
    backgroundColor: "#fff5f5",
  },
  deliveryOptionText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  selectedDeliveryOptionText: {
    color: primary,
    fontWeight: "500",
  },
  addressCard: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 12,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  changeAddressButton: {
    alignSelf: "flex-start",
    padding: 8, // Add padding to increase touch area
  },
  changeAddressText: {
    color: primary,
    fontSize: 14,
    fontWeight: "500",
  },
  pickupLocationCard: {
    marginBottom: 12,
    padding: 16, // Increased padding for better touch area
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  selectedPickupLocation: {
    borderColor: primary,
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
  dateContainer: {
    marginVertical: 12,
  },
  dateCard: {
    width: 110, // Slightly wider for better touch area
    height: 100, // Slightly taller for better touch area
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden", // Ensure content doesn't overflow
  },
  dateCardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  selectedDateCard: {
    borderColor: primary,
    backgroundColor: primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  monthText: {
    fontSize: 12,
    color: "#666",
  },
  selectedDateText: {
    color: "white",
  },
  deliveryNote: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 12,
    lineHeight: 18,
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    height: 100,
    textAlignVertical: "top",
  },
  summaryContainer: {
    padding: 16,
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
    color: primary,
  },
  bottomPadding: {
    height: 100, // Extra padding at the bottom so content isn't hidden behind button
  },
  buttonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Platform.OS === "ios" ? 20 : 0, // Adjust position based on platform
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  checkoutButton: {
    backgroundColor: primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;

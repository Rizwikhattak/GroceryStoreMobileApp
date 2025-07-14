"use client";

import DeliveryMethod from "@/components/CheckoutScreen/DeliveryMethod";
import HeaderCommon from "@/components/ui/HeaderCommon";
import { primary } from "@/constants/Colors";
import { TOAST_MESSAGES } from "@/constants/constants";
import { placeCustomerOrder } from "@/store/actions/orderActions";
import { getUserProfileDetails } from "@/store/actions/settingsActions";
import { resetCartState } from "@/store/reducers/cartSlice";
import { ToastHelper } from "@/utils/ToastHelper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
const CheckoutScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const customer = useSelector((state) => state.settings);
  // console.log("Customer Details", customer);
  // console.log("Auth Details", auth);
  const cartState = useSelector((state: any) => state.cart.data);
  const {
    cartTotal,
    subtotal,
    deliveryFee,
    gstAmount = "0",
  } = useLocalSearchParams();

  const [deliveryMethod, setDeliveryMethod] = useState("delivery"); // "delivery" or "pickup"
  const [selectedDate, setSelectedDate] = useState(null);
  const [orderInstructions, setOrderInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  const mapCartToOrderPayload = (
    cartState: any[],
    customerId: string,
    shippingAddress: string,
    shippingDateISO: string,
    deliveryMethod: "Pickup" | "Delivery" | "Delivery/Pickup",
    globalInstructions: string
  ) => {
    const items: { productId: string; uniqueId: string | null }[] = [];
    const quantities: number[] = [];
    const weights: ({ value: number; uom: string } | null)[] = [];
    const variations: (object | null)[] = [];
    const productNotes: { product_id: string; note: string }[] = [];

    cartState.forEach((cartItem) => {
      // ⚠️ take the *first* (and only) element if it’s an array
      const pickedVar = Array.isArray(cartItem.selectedVariant)
        ? {
            ...cartItem.selectedVariant[0],
            uniqueId: cartItem.selectedVariant[0]?._id,
          }
        : cartItem.selectedVariant;

      items.push({
        productId: cartItem._id,
        // uniqueId: pickedVar?.uniqueId ?? null,
        uniqueId: cartItem?._id ?? null,
      });

      quantities.push(cartItem.orderQuantity);
      weights.push(cartItem.weight ?? null);
      variations.push(pickedVar ?? null);

      if (cartItem.product_note) {
        //doing for the chicken variants
        const existingProdIndex = productNotes.findIndex(
          (prod: any) => prod.product_id === cartItem.product_note.product_id
        );
        if (existingProdIndex !== -1) {
          productNotes[existingProdIndex] = {
            ...productNotes[existingProdIndex],
            note: `${productNotes[existingProdIndex]?.note} ${cartItem.product_note.note}`,
          };
        } else
          productNotes.push({
            product_id: cartItem.product_note.product_id,
            note: cartItem.product_note.note,
          });
      }
    });

    return {
      customer: customerId,
      items,
      quantities,
      weights,
      selectedVariations: variations,
      product_notes: productNotes,
      shipping_address: shippingAddress,
      shipping_date: shippingDateISO,
      type: deliveryMethod,
      instructions: globalInstructions || "",
      tax: 0,
      status: "Pending",
    };
  };

  // const mapCartToOrderPayload = (
  //   cartState: any[],
  //   customerId: string,
  //   shippingAddress: string,
  //   shippingDateISO: string,
  //   deliveryMethod: "Pickup" | "Delivery" | "Delivery/Pickup",
  //   globalInstructions: string
  // ) => {
  //   // 1⃣  Arrays expected by the backend
  //   const items: { productId: string; uniqueId: string | null }[] = [];
  //   const quantities: number[] = [];
  //   const weights: ({ value: number; uom: string } | null)[] = [];
  //   const variations: (object | null)[] = [];
  //   const productNotes: { product_id: string; note: string }[] = [];

  //   cartState.forEach((cartItem) => {
  //     items.push({
  //       productId: cartItem._id,
  //       uniqueId: cartItem.selectedVariant?.uniqueId ?? null,
  //     });

  //     quantities.push(cartItem.orderQuantity);
  //     weights.push(cartItem.weight ?? null);
  //     variations.push(cartItem.selectedVariant?.[0] ?? null);
  //     console.log("VAriaaaaaaant", cartItem.selectedVariant);
  //     if (cartItem.product_note) {
  //       productNotes.push({
  //         product_id: cartItem.product_note.product_id,
  //         note: cartItem.product_note.note,
  //       });
  //     }
  //   });

  //   // 2⃣  Final payload
  //   return {
  //     customer: customerId, // ➜ customers._id
  //     items, // ➜ [{ productId, uniqueId }]
  //     quantities, // ➜ [4, 2, …] (same length as items)
  //     weights, // ➜ [null, {value:2,uom:"kg"}, …]
  //     selectedVariations: variations, // ➜ [null, {…}, …]
  //     product_notes: productNotes, // ➜ [{product_id, note}, …]
  //     shipping_address: shippingAddress,
  //     shipping_date: shippingDateISO, // ISO string (e.g. "2025-05-24T00:00:00Z")
  //     type: deliveryMethod, // "Pickup" | "Delivery" | "Delivery/Pickup"
  //     instructions: globalInstructions || "",
  //     tax: 0,
  //     status: "Pending",
  //   };
  // };
  const handlePlaceOrder = async () => {
    if (!selectedDate) {
      ToastHelper.showError({
        title: TOAST_MESSAGES.SELECT_DELIVERY_DATE.title,
      });
      return;
    }
    try {
      setIsLoading(true);
      const isoDate = deliveryDates
        .find((d) => d.id === selectedDate)!
        .fullDate.toISOString();

      const payload = mapCartToOrderPayload(
        cartState,
        customer?.data?._id,
        customer?.data?.delivery_address,
        isoDate,
        deliveryMethod === "delivery" ? "Delivery" : "Pickup",
        orderInstructions
      );
      // console.log("Order Payload", payload);
      const resp = await dispatch(placeCustomerOrder(payload)).unwrap();
      console.log("Response", resp);
      ToastHelper.showSuccess({
        title: TOAST_MESSAGES.ORDER_PLACED.title,
      });
      await dispatch(resetCartState());
      router.push("/(drawer)/(tabs)");
    } catch (err) {
      console.error(err);
      ToastHelper.showError({
        title: TOAST_MESSAGES.ORDER_FAILED.title,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date selection with immediate visual feedback
  const handleDateSelection = (dateId) => {
    setSelectedDate(dateId);
  };

  // Handle pickup location selection with immediate visual feedback
  const handlePickupLocationSelection = (locationId) => {
    setSelectedPickupLocation(locationId);
  };
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        await dispatch(getUserProfileDetails(auth.data._id)).unwrap();
      } catch (err) {
        console.error(err);
      }
    };
    fetchCustomerDetails();
  }, [dispatch]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" translucent={true} backgroundColor="white" />

      <HeaderCommon title="Checkout" isSearchEnabled={false} />
      <View
        style={styles.container}
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.mainContainer}>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            // ADD THESE PROPS to prevent touch interference:
            keyboardShouldPersistTaps="always"
            scrollEventThrottle={16}
            bounces={true}
            bouncesZoom={false}
            alwaysBounceVertical={false}
            // This is crucial for preventing touch conflicts:
            nestedScrollEnabled={true}
          >
            {/* Delivery Method Selection */}
            <View style={{ zIndex: 1 }} pointerEvents="box-none">
              <DeliveryMethod
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
              />
            </View>

            {/* Delivery Address or Pickup Location */}
            <View style={styles.sectionContainer}>
              {deliveryMethod === "delivery" ? (
                <>
                  <Text style={styles.sectionTitle}>Deliver to:</Text>
                  <View style={styles.addressCard}>
                    <Text style={styles.addressName}>
                      {customer?.data?.name}
                    </Text>
                    <Text style={styles.addressText}>
                      {customer?.data?.delivery_address}
                    </Text>
                    {/* <Text style={styles.addressText}>
                      {deliveryAddress.street}
                    </Text>
                    <Text style={styles.addressText}>
                      {deliveryAddress.city}
                    </Text>
                    <Text style={styles.addressText}>
                      {deliveryAddress.phone}
                    </Text> */}
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

                  {/* ───── Meat ───── */}
                  <View style={styles.addressCard}>
                    <Text style={styles.addressName}>Meat pickup</Text>
                    <Text style={styles.addressText}>
                      3 Saint Jude, Street,
                    </Text>
                    <Text style={styles.addressText}>
                      Avondale, Auckland 1026, New Zealand
                    </Text>
                  </View>

                  {/* ───── Grocery ───── */}
                  <View style={[styles.addressCard, { marginTop: 12 }]}>
                    <Text style={styles.addressName}>Grocery pickup</Text>
                    <Text style={styles.addressText}>
                      {/* 3 St Jude Street, Bush Road */}
                      12C Ash Road,
                    </Text>
                    <Text style={styles.addressText}>
                      {/* Rosedale, Auckland 0632 */}
                      Wiri, Auckland, New Zealand
                    </Text>
                  </View>
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
                <Text style={styles.summaryValue}>$ {subtotal}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST (15%)</Text>
                <Text style={styles.summaryValue}>$ {gstAmount}</Text>
              </View>

              {deliveryMethod === "delivery" && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>$ {deliveryFee}</Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>$ {cartTotal}</Text>
              </View>
            </View>

            {/* Add some padding at the bottom to ensure content isn't hidden behind the fixed button */}
            <View style={styles.bottomPadding} />
          </ScrollView>

          {/* Place Order Button - now in a fixed position at the bottom */}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handlePlaceOrder}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.checkoutButtonText}>Place Order</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // position: "relative",
  },

  mainContainer: {
    flex: 1,
    position: "relative",
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
    paddingBottom: 10, // Increased padding to ensure content isn't hidden behind the button
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
    bottom: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    // Add shadow for better visibility
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999, // Ensure it's above everything else
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

// const a = {
//   enrichedOrderItems: [
//     {
//       note: [Object],
//       product: [Object],
//       quantity: 2,
//       selectedVariant: [Object],
//       total: 33,
//     },
//   ],
//   item: {
//     _id: "684842db8c40fd03f1c90fc2",
//     created_at: "2025-06-10T14:36:11.835Z",
//     created_by: "info@destraditions.co.nz",
//     customer: "661c9f97ecd2d11bbc44c55c",
//     deleted_at: null,
//     discount: 0,
//     enrichedItems: [[Object]],
//     instructions: "New order",
//     items: ["684842db8c40fd03f1c90fbc"],
//     order_id: 614,
//     product_notes: [[Object]],
//     shipping_address: "54 Stoddard Road, Wesley, Auckland 1041, New Zealand",
//     shipping_date: "2025-06-16T14:36:06.022Z",
//     status: "Pending",
//     supplier: "666805854b5d72033022827c",
//     tax: 33,
//     total: 33,
//     type: "Delivery",
//     updated_at: "2025-06-10T14:36:11.835Z",
//     xero_invoice_id: null,
//   },
//   message: "Order placed successfully",
// };

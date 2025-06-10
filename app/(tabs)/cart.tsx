"use client";

import { useNavigation, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import { updateCartQuantity } from "@/store/reducers/cartSlice";
import { primary } from "@/constants/colors";
import HeaderCommon from "@/components/ui/HeaderCommon";
const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };

export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartState = useSelector((state: any) => state.cart.data);

  // GST rate (15%)
  const GST_RATE = 0.15;

  // Calculate subtotal
  const subtotal = cartState.reduce(
    (sum, item) => sum + item.sale_price * item.orderQuantity,
    0
  );

  // Calculate GST amount
  const gstAmount = subtotal * GST_RATE;

  // Delivery fee and discount
  const deliveryFee = 150.0;
  const discount = 0.0;

  // Calculate grand total
  const grandTotal = subtotal + gstAmount - discount;

  // Total number of items
  const totalItems = cartState.reduce(
    (sum, item) => sum + item.orderQuantity,
    0
  );

  // Function to render weight unit based on product type
  const getWeightUnit = (item) => {
    // This is a placeholder - you should determine the unit based on your product data
    return item.weight_unit || "Kg";
  };

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <HeaderCommon title="My Cart" isSearchEnabled={false} />

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {/* Items Section */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Items</Text>

            {cartState.length === 0 ? (
              <Text style={styles.emptyCartText}>No Items Selected</Text>
            ) : (
              <>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                    Product
                  </Text>
                  <Text
                    style={[
                      styles.tableHeaderText,
                      { flex: 1, textAlign: "center" },
                    ]}
                  >
                    Qty
                  </Text>
                  <Text
                    style={[
                      styles.tableHeaderText,
                      { flex: 1, textAlign: "center" },
                    ]}
                  >
                    Weight
                  </Text>
                  <Text
                    style={[
                      styles.tableHeaderText,
                      { flex: 1, textAlign: "right" },
                    ]}
                  >
                    Price
                  </Text>
                </View>

                {/* Cart Items */}
                {cartState.map((item: any, index) => (
                  <View key={item._id + index} style={styles.cartItem}>
                    <View style={styles.productSection}>
                      <Image
                        source={{
                          uri:
                            `${apiUrl}products/photo/${item.photo}` ||
                            "https://via.placeholder.com/150",
                        }}
                        style={styles.itemImage}
                        resizeMode="cover"
                      />
                      {console.log(`${apiUrl}products/photo/${item.photo}`)}
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemVariation}>
                          {item?.selectedVariant
                            ? item?.selectedVariant[0]?.size
                            : "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                          dispatch(
                            updateCartQuantity({
                              id: item._id,
                              item: item,
                              selectedSizeId: item?.selectedVariant
                                ? item?.selectedVariant[0]?._id
                                : -1,
                              change: -1,
                            })
                          )
                        }
                      >
                        <Text style={styles.quantityButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>
                        {item.orderQuantity}
                      </Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                          dispatch(
                            updateCartQuantity({
                              id: item._id,
                              item: item,
                              selectedSizeId: item?.selectedVariant[0]?._id,
                              change: 1,
                            })
                          )
                        }
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.weightText}>
                      {item?.uom?.slug || "N/A"}
                    </Text>

                    <Text style={styles.itemPrice}>
                      ${(item.sale_price * item.orderQuantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Price Summary */}
          {cartState.length !== 0 && (
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Items</Text>
                <Text style={styles.summaryValue}>{totalItems}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST (15%)</Text>
                <Text style={styles.summaryValue}>${gstAmount.toFixed(2)}</Text>
              </View>

              {/* <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>
                  ${deliveryFee.toFixed(2)}
                </Text>
              </View> */}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={styles.summaryValue}>${discount.toFixed(2)}</Text>
              </View>

              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalValue}>
                  $ {grandTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Total and Checkout */}
        {cartState.length !== 0 && (
          <View style={styles.bottomSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>$ {grandTotal.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() =>
                router.push({
                  pathname: "/CheckoutScreen",
                  params: {
                    cartTotal: grandTotal.toFixed(2),
                    subtotal: subtotal.toFixed(2),
                    gstAmount: gstAmount.toFixed(2),
                    deliveryFee: deliveryFee.toFixed(2),
                    discount: discount.toFixed(2),
                    totalItems: totalItems,
                  },
                })
              }
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    minHeight: "100%",
    overflow: "visible",
  },

  content: {
    flex: 1,
    backgroundColor: "white",
  },
  itemsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productSection: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  itemVariation: {
    fontSize: 12,
    color: "#666",
  },
  quantityControl: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    width: 26,
    height: 26,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  quantityButtonText: {
    fontSize: 16,
    color: primary,
    fontWeight: "bold",
  },
  quantityText: {
    paddingHorizontal: 8,
    fontSize: 14,
  },
  weightText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  itemPrice: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "right",
  },
  summarySection: {
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#eee",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: primary,
  },
  bottomSection: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: primary,
  },
  checkoutButton: {
    backgroundColor: primary,
    borderRadius: 5,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});

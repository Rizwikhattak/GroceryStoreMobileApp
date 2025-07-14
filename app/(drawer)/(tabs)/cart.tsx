"use client";

import CustomModal from "@/components/ui/CustomModak";
import HeaderCommon from "@/components/ui/HeaderCommon";
import { primary } from "@/constants/Colors";
import { TOAST_MESSAGES } from "@/constants/constants";
import {
  removeCartItem,
  updateFinalizedProductsQuantity,
} from "@/store/reducers/cartSlice";
import { ToastHelper } from "@/utils/ToastHelper";
import { useModal } from "@/utils/useModal";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;


export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartState = useSelector((state) => state.cart.data);

  // Filter to show only finalized items
  const finalizedCartItems = cartState.filter(
    (item) => item.isFinalized === true
  );

  const {
    modalState,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showConfirmation,
  } = useModal();

  // GST rate (15%)
  const GST_RATE = 0.15;

  // Calculate subtotal using only finalized items
  const subtotal = finalizedCartItems.reduce(
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

  // Total number of finalized items
  const totalItems = finalizedCartItems.reduce(
    (sum, item) => sum + item.orderQuantity,
    0
  );

  // Function to handle quantity update (only for finalized items)
  const handleQuantityUpdate = (item, change) => {
    // Only allow quantity updates for finalized items
    if (!item.isFinalized) {
      console.warn("Cannot update quantity for non-finalized items");
      return;
    }

    dispatch(
      updateFinalizedProductsQuantity({
        id: item._id,
        item: item,
        selectedSizeId: item?.selectedVariant
          ? item?.selectedVariant[0]?._id
          : null,
        change: change,
      })
    );
  };

  // Function to handle item deletion (only finalized items)
  const handleDeleteItem = (item) => {
    // Only allow deletion of finalized items
    if (!item.isFinalized) {
      console.warn("Cannot delete non-finalized items");
      return;
    }

    showError(
      "Remove Item",
      `Are you sure you want to remove "${item.name}" from your cart?`,
      "Confirm",
      () => {
        // Remove finalized item
        dispatch(
          removeCartItem({
            cartItemId: item.cartItemId,
            id: item._id,
            selectedSizeId: item?.selectedVariant
              ? item?.selectedVariant[0]?._id
              : null,
            removeFinalized: true, // Allow removal of finalized items
          })
        );
        ToastHelper.showWarning({
          title: TOAST_MESSAGES.PRODUCT_REMOVED_FROM_CART.title,
        });
        hideModal();
      }
    );
  };

  // Function to render weight unit based on product type
  const getWeightUnit = (item) => {
    return item.weight_unit || "Kg";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderCommon title="My Cart" isSearchEnabled={false} />
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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Cart Items Section */}
        <View style={styles.itemsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cart Items</Text>
            {finalizedCartItems.length > 0 && (
              <View style={styles.itemCountBadge}>
                <Text style={styles.itemCountText}>{totalItems}</Text>
              </View>
            )}
          </View>

          {finalizedCartItems.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <Ionicons name="cart-outline" size={80} color="#E0E0E0" />
              <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
              <Text style={styles.emptyCartSubtitle}>
                Add some products to get started
              </Text>
            </View>
          ) : (
            <View style={styles.cartItemsContainer}>
              {finalizedCartItems.map((item, index) => (
                <View
                  key={`${item.cartItemId || item._id}_${index}`}
                  style={styles.cartItemCard}
                >
                  {/* Finalized Item Indicator */}
                  <View style={styles.finalizedIndicator}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#4CAF50"
                    />
                    <Text style={styles.finalizedText}>Added to Cart</Text>
                  </View>

                  {/* Product Image and Details */}
                  <View style={styles.productInfo}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{
                          uri:
                            `${apiUrl}products/photo/${item.photo}` ||
                            "https://via.placeholder.com/150",
                        }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    </View>

                    <View style={styles.productDetails}>
                      <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Text style={styles.productVariant}>
                        Size:{" "}
                        {item?.selectedVariant
                          ? item?.selectedVariant[0]?.size
                          : "Standard"}
                      </Text>
                      <Text style={styles.productUnit}>
                        Unit: {item?.uom?.slug || "N/A"}
                      </Text>
                      <Text style={styles.productPrice}>
                        ${item.sale_price.toFixed(2)} each
                      </Text>
                    </View>

                    {/* Delete Button */}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteItem(item)}
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={24}
                        color="#FF6B6B"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Quantity Controls and Total */}
                  <View style={styles.quantitySection}>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityUpdate(item, -1)}
                      >
                        <Ionicons name="remove" size={18} color={primary} />
                      </TouchableOpacity>

                      <View style={styles.quantityDisplay}>
                        <Text style={styles.quantityText}>
                          {item.orderQuantity}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityUpdate(item, 1)}
                      >
                        <Ionicons name="add" size={18} color={primary} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.itemTotalContainer}>
                      <Text style={styles.itemTotalLabel}>Total</Text>
                      <Text style={styles.itemTotalPrice}>
                        ${(item.sale_price * item.orderQuantity).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Price Summary */}
        {finalizedCartItems.length !== 0 && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items ({totalItems})</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST (15%)</Text>
                <Text style={styles.summaryValue}>${gstAmount.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, styles.discountText]}>
                  -${discount.toFixed(2)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total Amount</Text>
                <Text style={styles.grandTotalValue}>
                  ${grandTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Add some bottom padding */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Checkout Section */}
      {finalizedCartItems.length !== 0 && (
        <View style={styles.bottomSection}>
          <View style={styles.bottomContent}>
            <View style={styles.totalSummary}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
  },
  itemsSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  itemCountBadge: {
    backgroundColor: primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  itemCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyCartContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  cartItemsContainer: {
    gap: 16,
  },
  cartItemCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  finalizedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F0F8F0",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  finalizedText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
    marginLeft: 4,
  },
  productInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
  },
  productDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  productVariant: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  productUnit: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: primary,
  },
  debugText: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FFF5F5",
    alignSelf: "flex-start",
  },
  quantitySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  itemTotalContainer: {
    alignItems: "flex-end",
  },
  itemTotalLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  itemTotalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  summarySection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  discountText: {
    color: "#4CAF50",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: primary,
  },
  bottomSection: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomContent: {
    padding: 20,
    paddingBottom: 30,
  },
  totalSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "700",
    color: primary,
  },
  checkoutButton: {
    backgroundColor: primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
});

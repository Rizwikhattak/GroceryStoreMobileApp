import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import { updateCartQuantity } from "@/store/reducers/productsSlice";
const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };

export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const navigation = useNavigation();
  const featuredProducts = useSelector((state: any) => state.featuredProducts);
  const cartState = useSelector((state: any) => state.products.cartState);

  const updateQuantity = (id: any, change: any) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cartState.reduce(
    (sum, item) => sum + item.sale_price * item.orderQuantity,
    0
  );

  const deliveryFee = 150.0;
  const grandTotal = subtotal + deliveryFee;

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#C41E3A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {/* Delivery Address */}
          <View style={styles.deliverySection}>
            <Text style={styles.sectionLabel}>Deliver To</Text>
            <View style={styles.addressRow}>
              <Text style={styles.addressText}>Dhoke Kala Khan</Text>
              <TouchableOpacity>
                <Text style={styles.changeButton}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Items Section */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Items</Text>

            {cartState.map((item: any) => (
              <View key={item._id} style={styles.cartItem}>
                <Image
                  source={{
                    uri:
                      `${apiUrl}products/photo/${item.photo}` ||
                      "https://via.placeholder.com/150",
                  }}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    {item.sale_price.toFixed(2)} $
                  </Text>
                </View>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                      dispatch(
                        updateCartQuantity({
                          id: item._id,
                          item: item,
                          change: -1,
                        })
                      )
                    }
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.orderQuantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                      dispatch(
                        updateCartQuantity({
                          id: item._id,
                          item: item,
                          change: 1,
                        })
                      )
                    }
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Price Summary */}
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{subtotal.toFixed(2)} $</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                {deliveryFee.toFixed(2)} $
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>
                Rs. {grandTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Total and Checkout */}
        <View style={styles.bottomSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs. {grandTotal.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() =>
              navigation.navigate("CheckoutScreen", {
                cartTotal: grandTotal,
                subtotal: subtotal,
                deliveryFee: deliveryFee,
              })
            }
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 40,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#C41E3A",
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  deliverySection: {
    padding: 15,
    borderBottomWidth: 8,
    borderBottomColor: "#f5f5f5",
  },
  sectionLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  changeButton: {
    color: "#C41E3A",
    fontWeight: "500",
  },
  itemsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1,
    paddingHorizontal: 15,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: "#333",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  quantityButtonText: {
    fontSize: 16,
    color: "#C41E3A",
    fontWeight: "bold",
  },
  quantityText: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
  summarySection: {
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 25,
    borderRadius: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#333",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bottomSection: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  checkoutButton: {
    backgroundColor: "#C41E3A",
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

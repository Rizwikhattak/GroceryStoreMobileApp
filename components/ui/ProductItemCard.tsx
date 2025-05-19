import { primary } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import { updateCartQuantity } from "@/store/reducers/productsSlice";

const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };

const ProductItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.products.cartState);
  const [favorites, setFavorites] = useState({});

  // Get quantity from cart state
  const quantity =
    cartState.find((cartItem) => cartItem._id === item._id)?.orderQuantity || 0;
  const isFavorite = favorites[item._id] || false;

  // Toggle favorite
  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.card}>
      {/* Favorite Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item._id)}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite ? primary : "#BDBDBD"}
        />
      </TouchableOpacity>

      {/* Discount Label */}
      {item.promotion_status === "active" && (
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>{item.promotion_value}% OFF</Text>
        </View>
      )}

      {/* Product Image */}
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

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.priceRatingContainer}>
          <Text style={styles.priceText}>${item.sale_price}</Text>

          {item.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Ionicons name="star" size={12} color="#FFD700" />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {quantity > 0 ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, styles.decrementButton]}
              onPress={() =>
                dispatch(
                  updateCartQuantity({ id: item._id, item: item, change: -1 })
                )
              }
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity
              style={[styles.quantityButton, styles.incrementButton]}
              onPress={() =>
                dispatch(
                  updateCartQuantity({ id: item._id, item: item, change: 1 })
                )
              }
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() =>
              dispatch(
                updateCartQuantity({ id: item._id, item: item, change: 1 })
              )
            }
          >
            <Text style={styles.addToCartText}>Add to cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 10,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 7,
    position: "relative",
    overflow: "visible", // Prevents shadow clipping
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  discountTag: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: primary,
    paddingHorizontal: 8,
    borderTopStartRadius: 10,
    paddingVertical: 4,
    borderBottomRightRadius: 8,
    zIndex: 5,
  },
  discountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    height: 120, // Fixed height for uniformity
    overflow: "hidden",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  detailsContainer: {
    padding: 12,
  },
  productName: {
    color: "#333",
    fontWeight: "500",
    marginBottom: 6,
    fontSize: 14,
  },
  priceRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    marginRight: 2,
    color: "#888",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityButton: {
    width: 35,
    height: 35,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  decrementButton: {
    backgroundColor: primary,
  },
  incrementButton: {
    backgroundColor: primary,
  },
  quantityButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  quantityText: {
    color: "#333",
    fontWeight: "500",
  },
  addToCartButton: {
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
    color: primary,
    fontWeight: "500",
    fontSize: 13,
  },
});

export default ProductItemCard;

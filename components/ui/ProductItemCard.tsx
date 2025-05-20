"use client";

import { primary } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateCartQuantity } from "@/store/reducers/productsSlice";

import Constants from "expo-constants";
const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };

const ProductItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.products.cartState);
  const [favorites, setFavorites] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  // Get quantity from cart state
  const quantity =
    cartState.find((cartItem) => cartItem._id === item._id)?.orderQuantity || 0;
  const isFavorite = favorites[item._id] || false;

  // Get unit from product data or use default
  const unit = item?.uom?.slug || "kg";

  // Only update input value when quantity changes and we're not editing
  useEffect(() => {
    if (!isEditing) {
      setInputValue(quantity.toString());
    }
  }, [quantity, isEditing]);

  // Set up keyboard dismiss listener
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (isEditing) {
          handleQuantitySubmit();
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [isEditing, inputValue]);

  // Toggle favorite
  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const hasSubmitted = useRef(false);
  // Handle direct quantity input
  const handleQuantityInputFocus = () => {
    if (hasSubmitted.current) return; // ignore duplicates
    hasSubmitted.current = true;
    setIsEditing(true);

    // Select all text for easy replacement
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 50);
    }
  };

  const handleQuantityChange = (text) => {
    // Only allow numeric input
    if (/^\d*$/.test(text)) {
      setInputValue(text);
    }
  };

  const handleQuantitySubmit = () => {
    // Exit if not editing
    if (!isEditing) return;

    // Parse the input value as an integer
    let newQuantity = parseInt(inputValue, 10);

    // Handle empty or non-numeric input
    if (isNaN(newQuantity)) {
      newQuantity = 0;
    }

    // Ensure minimum value is 0
    newQuantity = Math.max(0, newQuantity);

    // Update cart with the absolute new quantity, not relative change
    if (newQuantity !== quantity) {
      // Calculate the change needed to reach the new quantity
      const change = newQuantity - quantity;

      dispatch(
        updateCartQuantity({ id: item._id, item: item, change: change })
      );
    }

    // Reset editing state
    setIsEditing(false);
    setTimeout(() => (hasSubmitted.current = false), 200);
    // Keyboard.dismiss();
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

        <View style={styles.priceUnitContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${item.sale_price}</Text>
            <Text style={styles.unitText}>/{unit}</Text>
          </View>

          {item.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Ionicons name="star" size={12} color="#FFD700" />
            </View>
          )}
        </View>

        {/* Weight/Size if available */}
        {item.weight && (
          <Text style={styles.weightText}>
            {item.weight} {unit}
          </Text>
        )}

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

            {isEditing ? (
              <TextInput
                ref={inputRef}
                style={styles.quantityInput}
                value={inputValue}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
                selectTextOnFocus
                autoFocus
                onEndEditing={handleQuantitySubmit} // <-- only event that commits
                blurOnSubmit
                maxLength={3}
              />
            ) : (
              <TouchableOpacity
                style={styles.quantityDisplay}
                onPress={handleQuantityInputFocus}
                activeOpacity={0.7}
              >
                <View style={styles.quantityUnitContainer}>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <Text style={styles.quantityUnitText}>{unit}</Text>
                </View>
              </TouchableOpacity>
            )}

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
  priceUnitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  unitText: {
    color: "#666",
    fontSize: 12,
    marginLeft: 1,
  },
  weightText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
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
    height: 36,
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
  quantityDisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  quantityUnitContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  quantityText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
  quantityUnitText: {
    color: "#666",
    fontSize: 10,
    marginLeft: 2,
  },
  quantityInput: {
    flex: 1,
    color: "#333",
    fontWeight: "500",
    minWidth: 30,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: primary,
    paddingVertical: 0,
    marginHorizontal: 5,
    height: 30,
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

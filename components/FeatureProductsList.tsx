"use client";

import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import SectionHeader from "./SectionHeader";

const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };

const FeatureProductsList = () => {
  const products = useSelector((state) => state.products);
  const [quantities, setQuantities] = useState({});

  // Handle quantity changes
  const updateQuantity = (id, change) => {
    setQuantities((prev) => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + change);
      return { ...prev, [id]: newQty };
    });
  };

  // Toggle favorite
  const [favorites, setFavorites] = useState({});
  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Render each product item
  const renderProductItem = ({ item }) => {
    const quantity = quantities[item._id] || 0;
    const isFavorite = favorites[item._id] || false;
    const hasDiscount = item.promotion_value && item.promotion_value > 0;

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
            color={isFavorite ? "#FF6B6B" : "#BDBDBD"}
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
            resizeMode="contain"
          />
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.priceRatingContainer}>
            <Text style={styles.priceText}>{item.sale_price} $</Text>

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
                onPress={() => updateQuantity(item._id, -1)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={[styles.quantityButton, styles.incrementButton]}
                onPress={() => updateQuantity(item._id, 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => updateQuantity(item._id, 1)}
            >
              <Text style={styles.addToCartText}>Add to cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Main render
  return (
    <View style={styles.container}>
      <SectionHeader title="Popular Deals" />
      {products.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : products.data && products.data.length > 0 ? (
        <FlatList
          data={products.data}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  loadingContainer: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    color: "#888",
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
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
    overflow: "visible", // This is important to prevent shadow clipping
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
    backgroundColor: "#FF6B6B",
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
    height: 120,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  productImage: {
    height: 100,
    width: "100%",
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
    backgroundColor: "#FF6B6B",
  },
  incrementButton: {
    backgroundColor: "#4ECDC4",
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
    borderColor: "#FF9F1C",
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
    color: "#FF9F1C",
    fontWeight: "500",
    fontSize: 13,
  },
  listContainer: {
    paddingHorizontal: 4,
  },
});

export default FeatureProductsList;

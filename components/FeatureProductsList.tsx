import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";

const { apiUrl } = Constants.expoConfig.extra;
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
  const renderProductItem = ({ item, index }) => {
    const quantity = quantities[item._id] || 0;
    const isFavorite = favorites[item._id] || false;
    const hasDiscount = item.discount && item.discount > 0;
    console.log("Photo url", `${apiUrl}${item.photo}`);
    return (
      <View className="w-[48%] bg-white rounded-xl border border-gray-100 overflow-hidden mb-4">
        {/* Favorite Button */}
        <TouchableOpacity
          className="absolute top-2 right-2 z-10"
          onPress={() => toggleFavorite(item._id)}
        >
          <View className="w-8 h-8 rounded-full bg-white items-center justify-center shadow-sm">
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={18}
              color={isFavorite ? "#FF3B30" : "#888"}
            />
          </View>
        </TouchableOpacity>

        {/* Discount Label */}
        {hasDiscount && (
          <View className="absolute top-0 left-0 bg-red-500 z-10 px-2 py-1 rounded-br-lg">
            <Text className="text-white text-xs font-bold">
              {item.discount}% OFF
            </Text>
          </View>
        )}

        {/* Product Image */}
        <View className="h-28 w-full items-center justify-center p-2">
          <Image
            source={{
              uri:
                `${apiUrl}products/photo/${item.photo}` ||
                "https://via.placeholder.com/150",
            }}
            className="h-24 w-24"
            resizeMode="contain"
          />
        </View>

        {/* Product Details */}
        <View className="p-3">
          <Text className="text-gray-800 font-medium mb-1" numberOfLines={1}>
            {item.name}
          </Text>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-900 font-bold">{item.price} $</Text>

            {item.rating && (
              <View className="flex-row items-center">
                <Text
                  className={`text-xs mr-1 ${
                    parseFloat(item.rating) >= 4.5
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {item.rating}
                </Text>
                <Ionicons name="star" size={12} color="#FFD700" />
              </View>
            )}
          </View>

          {/* Action Buttons */}
          {quantity > 0 ? (
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                className="w-8 h-8 rounded-full bg-red-400 items-center justify-center"
                onPress={() => updateQuantity(item.id, -1)}
              >
                <Text className="text-white font-bold text-lg">-</Text>
              </TouchableOpacity>

              <Text className="text-gray-800 font-medium">{quantity}</Text>

              <TouchableOpacity
                className="w-8 h-8 rounded-full bg-teal-500 items-center justify-center"
                onPress={() => updateQuantity(item.id, 1)}
              >
                <Text className="text-white font-bold text-lg">+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="h-9 rounded-lg border border-orange-400 items-center justify-center"
              onPress={() => updateQuantity(item.id, 1)}
            >
              <Text className="text-orange-400 font-medium">Add to cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Main render
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between px-5 mb-4">
        <Text className="text-lg font-semibold text-gray-800">
          Popular Deals
        </Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {products.isLoading ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator size="large" color="#FF3B30" />
        </View>
      ) : products.data && products.data.length > 0 ? (
        <View className="px-5">
          <FlatList
            data={products.data}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      ) : (
        <View className="h-40 items-center justify-center px-5">
          <Text className="text-gray-500">No products available</Text>
        </View>
      )}
    </View>
  );
};

export default FeatureProductsList;

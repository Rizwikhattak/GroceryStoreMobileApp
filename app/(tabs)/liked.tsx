import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { primary } from "@/constants/colors";
import SearchInput from "@/components/ui/SearchInput";

const LikedScreen = () => {
  // State for search functionality
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Mock data for liked products
  const [likedProducts, setLikedProducts] = useState([
    {
      _id: "1",
      name: "Premium Beef Steak",
      sale_price: 25,
      rating: 4.8,
      photo: "placeholder",
      promotion_status: "active",
      promotion_value: 10,
    },
    {
      _id: "2",
      name: "Chicken Breast",
      sale_price: 12,
      rating: 4.5,
      photo: "placeholder",
      promotion_status: "inactive",
      promotion_value: 0,
    },
    {
      _id: "3",
      name: "Fresh Cucumber",
      sale_price: 3,
      rating: 4.2,
      photo: "placeholder",
      promotion_status: "inactive",
      promotion_value: 0,
    },
    {
      _id: "4",
      name: "Cherries",
      sale_price: 8,
      rating: 4.7,
      photo: "placeholder",
      promotion_status: "active",
      promotion_value: 5,
    },
  ]);

  // Filter products based on search text
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredProducts(likedProducts);
    } else {
      const filtered = likedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchText, likedProducts]);

  // Function to remove item from liked products
  const removeFromLiked = (productId) => {
    setLikedProducts(
      likedProducts.filter((product) => product._id !== productId)
    );
  };

  // Function to toggle favorite status
  const toggleFavorite = (productId) => {
    // In a real app, this would update your favorites in Redux
    console.log("Toggle favorite for:", productId);
  };

  // Custom SearchInput with state management
  const CustomSearchInput = () => {
    return (
      <SearchInput
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      {/* Discount Tag */}
      {item.promotion_status === "active" && (
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>{item.promotion_value}% OFF</Text>
        </View>
      )}

      {/* Favorite Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item._id)}
      >
        <Ionicons name="heart-outline" size={22} color="#999" />
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFromLiked(item._id)}
      >
        <Ionicons name="trash" size={18} color="#fff" />
      </TouchableOpacity>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>${item.sale_price}</Text>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Ionicons name="star" size={12} color="#FFD700" />
        </View>

        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Pantry List</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setShowSearch(!showSearch)}
        >
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <SearchInput value={searchText} onChangeText={setSearchText} />
        </View>
      )}

      {/* Item Count */}
      <Text style={styles.itemCount}>
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "item" : "items"} in your pantry list
      </Text>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsGrid}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  searchButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  itemCount: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  productsGrid: {
    paddingHorizontal: 8,
    paddingBottom: 80, // Extra padding for bottom navigation
  },
  productCard: {
    width: "46%",
    backgroundColor: "white",
    borderRadius: 12,
    margin: "2%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    position: "relative",
    overflow: "hidden",
  },
  discountTag: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 8,
    zIndex: 10,
  },
  discountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#e53935",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  imageContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#f9f9f9",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginRight: 2,
  },
  addToCartButton: {
    borderWidth: 1,
    borderColor: primary,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
    color: primary,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default LikedScreen;

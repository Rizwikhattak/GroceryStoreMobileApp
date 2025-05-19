import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Sample data - in a real app, you would fetch this from your API based on category ID
const sampleProducts = {
  Groceries: [
    {
      id: "1",
      name: "Rice",
      price: "15",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=200&width=200",
    },
    {
      id: "2",
      name: "Flour",
      price: "8",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=200&width=200",
    },
    {
      id: "3",
      name: "Sugar",
      price: "5",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=200&width=200",
    },
    {
      id: "4",
      name: "Salt",
      price: "3",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=200&width=200",
    },
  ],
  "Meat & Poultry": [
    {
      id: "1",
      name: "Mince Mix Chicken beef",
      price: "18",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=200&width=200",
    },
    {
      id: "2",
      name: "Chicken Breast",
      price: "22",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=200&width=200",
    },
    {
      id: "3",
      name: "Beef Steak",
      price: "35",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=200&width=200",
    },
    {
      id: "4",
      name: "Lamb Chops",
      price: "40",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=200&width=200",
    },
  ],
};

const CategoryScreen = ({ route, navigation }) => {
  const { categoryName } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a timeout
    setTimeout(() => {
      setProducts(sampleProducts[categoryName] || []);
      setLoading(false);
    }, 500);
  }, [categoryName]);

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => console.log("Added to favorites")}
      >
        <Ionicons name="heart-outline" size={24} color="#888" />
      </TouchableOpacity>

      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="cover"
      />

      <Text style={styles.productName} numberOfLines={1}>
        {item.name}
      </Text>

      <Text style={styles.productPrice}>{item.price} $</Text>

      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => console.log("Added to cart")}
      >
        <Text style={styles.addToCartText}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#f44336" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={24} color="#f44336" />
        </TouchableOpacity>
      </View>

      {/* Products List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#f44336" />
        </View>
      ) : (
        <>
          <Text style={styles.resultsText}>
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            found
          </Text>

          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.productList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No products found in this category
                </Text>
              </View>
            }
          />
        </>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.cartNavItem]}>
          <Ionicons name="cart" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#888" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cartButton: {
    padding: 4,
  },
  resultsText: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    fontSize: 14,
    color: "#666",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productList: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteButton: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 1,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f44336",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  addToCartText: {
    color: "#f44336",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 8,
  },
  navItem: {
    padding: 8,
  },
  cartNavItem: {
    backgroundColor: "#f44336",
    borderRadius: 30,
    padding: 12,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CategoryScreen;

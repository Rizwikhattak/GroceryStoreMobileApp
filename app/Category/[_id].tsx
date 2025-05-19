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
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/store/actions/productsActions";
import ProductsList from "@/components/ui/ProductsList";

const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };

const CategoryScreen = ({ navigation }: any) => {
  // Retrieve _id parameter from route; it is assumed that the dynamic segment in your routing file is named [ _id ].tsx
  const { _id } = useGlobalSearchParams();
  const products = useSelector((state: any) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  console.log("_id from route:", _id);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await dispatch(getAllProducts({ _id })).unwrap();
        const filtered = result.list.filter(
          (item) => item.category._id === _id
        );
        setFilteredProducts({ ...products, data: filtered });
      } catch (err) {}
    };
    fetchProducts();
    // Simulate API fetch with a timeout, now using _id instead of categoryName
  }, [_id]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      className="bg-light-100"
    >
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#f44336" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{_id}</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={24} color="#f44336" />
        </TouchableOpacity>
      </View> */}
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: "100%",
            paddingBottom: 80, // Add extra padding at bottom to account for tab bar
            paddingTop: 20,
            overflow: "visible",
          }}
        >
          {products.isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#f44336" />
            </View>
          ) : (
            <ProductsList products={filteredProducts} />
          )}
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
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
      </View> */}
    </KeyboardAvoidingView>
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

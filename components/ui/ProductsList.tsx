"use client";

import ProductItemCard from "@/components/ui/ProductItemCard";
import { ProductsSkeleton } from "@/components/ui/Skeletons";
import { primary } from "@/constants/Colors";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const ProductsList = ({ products }) => {
  const dispatch = useDispatch();
  // Render each product item
  const renderProductItem = ({ item }) => {
    return <ProductItemCard item={item} />;
  };

  // Main render
  return (
    <View style={styles.container}>
      {products?.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : products.isLoading ? (
        <ProductsSkeleton />
      ) : products?.data && products?.data.length > 0 ? (
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
  },
  listContainer: {
    paddingHorizontal: 0,
    // paddingHorizontal: 4,
  },
});

export default ProductsList;

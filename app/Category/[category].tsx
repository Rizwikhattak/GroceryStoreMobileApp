"use client";

import HeaderCommon from "@/components/ui/HeaderCommon";
import ProductItemCard from "@/components/ui/ProductItemCard";
import {
  ProductsSkeleton,
  SubcategorySkeleton,
} from "@/components/ui/Skeletons";
import { primary, shades } from "@/constants/Colors";
import { getSubCategories } from "@/store/actions/categoriesActions";
import { getProducts } from "@/store/actions/productsActions";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const CategoryScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { category } = useGlobalSearchParams() || {
    category: "Meat & Poultry",
  };

  const categories = useSelector((state: any) => state.categories);
  const cartState = useSelector((state: any) => state.cart.data);
  const pantry = useSelector((state: any) => state.pantry);

  const subcategories = useSelector(
    (state: any) => state.categories.SubCategories
  );
  const products = useSelector((state: any) => state.products);

  const cartTotal = cartState.reduce(
    (sum, item) => sum + item.sale_price * item.orderQuantity,
    0
  );
  const totalItems = cartState?.length || 0;

  const subcategoriesList = useMemo(() => {
    const data = subcategories?.data || [];
    return [{ _id: -10, name: "All" }, ...data];
  }, [subcategories?.data]);

  const [selectedSubcategory, setSelectedSubcategory] = useState(-10);
  const [prodLimit, setProdLimit] = useState(20);
  const [refreshing, setRefreshing] = useState(false);
  const filteredProducts = products.data || [];

  const searchFilters = {
    category_slug: `${categories.selectedCategory.slug}`,
  };
  if (selectedSubcategory !== -10)
    searchFilters.sub_category = `${selectedSubcategory}`;

  const fetchSubCategories = async () => {
    try {
      if (categories.selectedCategory?._id) {
        await dispatch(
          getSubCategories(categories.selectedCategory._id)
        ).unwrap();
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const prodFilters = {
        category_slug: categories.selectedCategory.slug,
      };

      if (selectedSubcategory !== -10)
        prodFilters.sub_category = selectedSubcategory;
      if (prodLimit !== -1) prodFilters.limit = prodLimit;

      await dispatch(getProducts(prodFilters)).unwrap();
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh both subcategories and products
      await Promise.all([fetchSubCategories(), fetchProducts()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, [categories.selectedCategory?._id, dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [selectedSubcategory, pantry.data, dispatch, prodLimit]);

  const renderSubcategoryItem = ({ item }) => (
    <TouchableOpacity
      key={item._id}
      style={[
        styles.subcategoryChip,
        selectedSubcategory === item._id && styles.selectedSubcategoryChip,
      ]}
      onPress={() => setSelectedSubcategory(item._id)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.subcategoryChipText,
          selectedSubcategory === item._id &&
            styles.selectedSubcategoryChipText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const handleViewCart = () => {
    router.push("/(drawer)/(tabs)/cart");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={shades.white} />

      {/* Simple Header */}
      <HeaderCommon
        title={category}
        subtitle={`${filteredProducts?.length || 0} products`}
        isSearchEnabled={true}
        searchFilters={searchFilters}
        enableDropdown={false}
      />

      {/* Clean Subcategories */}
      <View style={styles.subcategoriesSection}>
        {subcategories.isLoading ? (
          <SubcategorySkeleton />
        ) : (
          <FlatList
            data={subcategoriesList}
            renderItem={renderSubcategoryItem}
            keyExtractor={(item) => item._id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subcategoriesScrollContent}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          />
        )}
      </View>

      {/* Products Grid - Main Focus */}
      <View style={styles.productsSection}>
        {/* Minimal Products Header */}
        <View style={styles.productsHeader}>
          <Text style={styles.productsCount}>
            {filteredProducts?.length || 0} Products
          </Text>
          {prodLimit !== -1 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => setProdLimit(-1)}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {products.isLoading ? (
          <View style={{ paddingVertical: 20 }}>
            <ProductsSkeleton />
          </View>
        ) : filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => <ProductItemCard item={item} />}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.productsGrid,
              { paddingBottom: cartState.length > 0 ? 80 : 20 },
            ]}
            columnWrapperStyle={styles.productRow}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[primary]} // Android
                tintColor={primary} // iOS
                title="Pull to refresh" // iOS
                titleColor={primary} // iOS
              />
            }
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="basket-outline" size={60} color="#E0E0E0" />
            <Text style={styles.emptyStateTitle}>No products found</Text>
            <Text style={styles.emptyStateSubtitle}>Pull down to refresh</Text>
          </View>
        )}
      </View>

      {/* Compact Cart Section */}
      {cartState.length > 0 && (
        <View style={styles.bottomCartSection}>
          <View style={styles.cartSummary}>
            <View style={styles.cartInfo}>
              <Text style={styles.cartText}>
                {totalItems} items • ${cartTotal.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewCartButton}
              onPress={handleViewCart}
            >
              <Text style={styles.viewCartText}>View Cart</Text>
              <Ionicons name="arrow-forward" size={16} color={shades.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  // Clean subcategories
  subcategoriesSection: {
    backgroundColor: shades.white,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  subcategoriesScrollContent: {
    paddingHorizontal: 16,
  },
  subcategoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedSubcategoryChip: {
    backgroundColor: primary,
    borderColor: primary,
  },
  subcategoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  selectedSubcategoryChipText: {
    color: shades.white,
    fontWeight: "600",
  },

  // Simplified products section
  productsSection: {
    flex: 1,
    backgroundColor: shades.white,
    paddingTop: 16,
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  productsCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: primary,
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: shades.white,
    fontWeight: "600",
  },
  productsGrid: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  // Enhanced empty state
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999",
    marginTop: 12,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#CCC",
    marginTop: 4,
  },

  // Compact cart section
  bottomCartSection: {
    backgroundColor: shades.white,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
  },
  cartSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartInfo: {
    flex: 1,
  },
  cartText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  viewCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  viewCartText: {
    color: shades.white,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
});

export default CategoryScreen;

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { light, primary, shades } from "@/constants/colors";
import ProductItemCard from "@/components/ui/ProductItemCard";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "@/store/actions/productsActions";
import { getSubCategories } from "@/store/actions/categoriesActions";
import SearchInput from "@/components/ui/SearchInput";
import HeaderCommon from "@/components/ui/HeaderCommon";
import {
  CategorySkeleton,
  ProductsSkeleton,
  SubcategorySkeleton,
} from "@/components/ui/Skeletons";
import { getPantryProducts } from "@/store/actions/pantryActions";

/* ---------- local monochrome palette ---------- */

const SubCategoryScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const scrollY = new Animated.Value(0);
  const [showSearch, setShowSearch] = useState(false);
  // Get category from route params
  const { category } = useGlobalSearchParams() || {
    category: "Meat & Poultry",
  };
  const categories = useSelector((state: any) => state.categories);
  const pantry = useSelector((state) => state.pantry);
  const pantryData = pantry?.data;
  const favouriteIds = {};
  pantryData &&
    pantryData?.forEach((item) => {
      if (item.product) {
        favouriteIds[item.product._id] = true;
      }
    });

  console.log("New gog gog ", favouriteIds);
  const subcategories = useSelector(
    (state: any) => state.categories.SubCategories
  );
  const products = useSelector((state: any) => state.products);

  /* ---------- memoised lists ---------- */
  const subcategoriesList = useMemo(() => {
    const data = subcategories?.data || [];
    return [{ _id: -10, name: "All" }, ...data];
  }, [subcategories?.data]);

  const [selectedSubcategory, setSelectedSubcategory] = useState(-10);
  const [prodLimit, setProdLimit] = useState(20);
  const filteredProducts = products.data || [];
  const searchFilters = {
    category_slug: `${categories.selectedCategory.slug}`,
  };
  if (selectedSubcategory !== -10)
    searchFilters.sub_category = `${selectedSubcategory}`;
  /* ---------- header animation ---------- */
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: "clamp",
  });

  /* ---------- data fetching ---------- */
  useEffect(() => {
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
    fetchSubCategories();
  }, [categories.selectedCategory?._id, dispatch]);

  useEffect(() => {
    const fetchPantryProducts = async () => {
      try {
        console.log("Nice calling u gog gog");
        await dispatch(getPantryProducts()).unwrap();
      } catch (err) {
        console.log("Error fetching pantry products", err);
      }
    };
    fetchPantryProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const prodFilters = {
          category_slug: categories.selectedCategory.slug,
        };

        if (selectedSubcategory !== -10)
          prodFilters.sub_category = selectedSubcategory;
        if (prodLimit !== -1) prodFilters.limit = prodLimit;

        dispatch(getProducts(prodFilters)).unwrap();
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [selectedSubcategory, dispatch, prodLimit]);

  /* ---------- renderers ---------- */
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={shades.white} />

      {/* ---------- Header ---------- */}
      <HeaderCommon
        title={category}
        subtitle={`${filteredProducts?.length || 0} products`}
        isSearchEnabled={true}
        searchFilters={searchFilters}
        enableDropdown={false}
      />

      {/* ---------- Sub-categories ---------- */}
      <View style={styles.subcategoriesSection}>
        <View style={styles.subcategoriesHeader}>
          <Text style={styles.subcategoriesTitle}>Categories</Text>
          <View style={styles.subcategoriesCount}>
            <Text style={styles.subcategoriesCountText}>
              {subcategoriesList?.length || 0}
            </Text>
          </View>
        </View>

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
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        )}
      </View>

      {/* ---------- Products ---------- */}
      <View style={styles.productsSection}>
        <View style={styles.productsHeader}>
          <View>
            <Text style={styles.productsTitle}>Products</Text>
            <Text style={styles.productsSubtitle}>Fresh & Quality Items</Text>
          </View>
          <TouchableOpacity
            style={styles.viewAllButton}
            activeOpacity={0.7}
            onPress={() => setProdLimit(-1)}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={shades.white} />
          </TouchableOpacity>
        </View>

        {filteredProducts.length > 0 ? (
          products.isLoading || pantry.isLoading ? (
            <ProductsSkeleton />
          ) : (
            <Animated.FlatList
              data={filteredProducts}
              renderItem={({ item }) => (
                <ProductItemCard item={item} favouriteIds={favouriteIds} />
              )}
              keyExtractor={(item) => item._id.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.productsGrid}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              columnWrapperStyle={styles.productRow}
            />
          )
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No products found</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: shades.lightGray,
  },

  /* --- sub-categories --- */
  subcategoriesSection: {
    backgroundColor: shades.white,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: shades.lighterGray,
  },

  subcategoriesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  subcategoriesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  subcategoriesCount: {
    backgroundColor: primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subcategoriesCountText: {
    color: shades.white,
    fontSize: 12,
    fontWeight: "600",
  },
  subcategoriesScrollContent: { paddingHorizontal: 20, paddingRight: 20 },
  subcategoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: shades.lightGray,
    borderWidth: 1,
    borderColor: shades.lighterGray,
    minWidth: 80,
    alignItems: "center",
  },
  selectedSubcategoryChip: {
    backgroundColor: primary,
    borderColor: primary,
    elevation: 3,
    shadowColor: primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  subcategoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  selectedSubcategoryChipText: {
    color: shades.white,
    fontWeight: "600",
  },

  /* --- products --- */
  productsSection: {
    flex: 1,
    backgroundColor: shades.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    marginTop: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: shades.lighterGray,
    paddingBottom: 12,
  },
  productsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  productsSubtitle: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 14,
    color: shades.white,
    fontWeight: "600",
    marginRight: 4,
  },
  productsGrid: { paddingHorizontal: 16, paddingBottom: 100 },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  /* --- empty-state --- */
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
});

export default SubCategoryScreen;

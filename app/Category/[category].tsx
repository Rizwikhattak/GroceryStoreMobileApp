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
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

const { width: screenWidth } = Dimensions.get("window");

const CategoryScreen = () => {
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
  const cartState = useSelector((state: any) => state.cart.data);
  const pantryData = pantry?.data;

  const favouriteIds = {};
  pantryData &&
    pantryData?.forEach((item) => {
      if (item.product) {
        favouriteIds[item.product._id] = true;
      }
    });

  const subcategories = useSelector(
    (state: any) => state.categories.SubCategories
  );
  const products = useSelector((state: any) => state.products);

  // Cart calculations
  const cartTotal = cartState.reduce(
    (sum, item) => sum + item.sale_price * item.orderQuantity,
    0
  );
  // const totalItems = cartState.reduce(
  //   (sum, item) => sum + item.orderQuantity,
  //   0
  // );
  const totalItems = cartState?.length || 0;

  /* ---------- memoised lists ---------- */
  const subcategoriesList = useMemo(() => {
    const data = subcategories?.data || [];
    return [{ _id: -10, name: "All", icon: "grid-outline" }, ...data];
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

  // Cart button animation
  const cartButtonScale = new Animated.Value(1);
  const animateCartButton = () => {
    Animated.sequence([
      Animated.timing(cartButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cartButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
  const renderSubcategoryItem = ({ item, index }) => (
    <TouchableOpacity
      key={item._id}
      style={[
        styles.subcategoryChip,
        selectedSubcategory === item._id && styles.selectedSubcategoryChip,
        index === 0 && styles.firstChip,
      ]}
      onPress={() => setSelectedSubcategory(item._id)}
      activeOpacity={0.7}
    >
      {item.icon && (
        <Ionicons
          name={item.icon}
          size={16}
          color={selectedSubcategory === item._id ? shades.white : primary}
          style={styles.chipIcon}
        />
      )}
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
    animateCartButton();
    router.push("/cart");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={shades.white} />

      {/* ---------- Header ---------- */}
      <HeaderCommon
        title={category}
        subtitle={`${filteredProducts?.length || 0} products available`}
        isSearchEnabled={true}
        searchFilters={searchFilters}
        enableDropdown={false}
      />

      {/* ---------- Sub-categories ---------- */}
      <View style={styles.subcategoriesSection}>
        <View style={styles.subcategoriesHeader}>
          <View>
            <Text style={styles.subcategoriesTitle}>Browse Categories</Text>
            <Text style={styles.subcategoriesSubtitle}>
              {subcategoriesList?.length || 0} categories available
            </Text>
          </View>
          <View style={styles.categoryBadge}>
            <MaterialIcons name="category" size={16} color={primary} />
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
          <View style={styles.productsHeaderLeft}>
            <Text style={styles.productsTitle}>Fresh Products</Text>
            <View style={styles.productsSubtitleContainer}>
              <MaterialIcons name="verified" size={16} color="#4CAF50" />
              <Text style={styles.productsSubtitle}>Quality Guaranteed</Text>
            </View>
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

        {products.isLoading || pantry.isLoading ? (
          <ProductsSkeleton />
        ) : filteredProducts.length > 0 ? (
          <Animated.FlatList
            data={filteredProducts}
            renderItem={({ item }) => (
              <ProductItemCard item={item} favouriteIds={favouriteIds} />
            )}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.productsGrid,
              { paddingBottom: cartState.length > 0 ? 120 : 20 },
            ]}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            columnWrapperStyle={styles.productRow}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="basket-outline" size={80} color="#E0E0E0" />
            <Text style={styles.emptyStateTitle}>No products found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try adjusting your filters or search terms
            </Text>
          </View>
        )}
      </View>

      {/* ---------- Bottom Cart Section ---------- */}
      {cartState.length > 0 && (
        <Animated.View
          style={[
            styles.bottomCartSection,
            { transform: [{ scale: cartButtonScale }] },
          ]}
        >
          <View style={styles.cartSummary}>
            <View style={styles.cartInfo}>
              <View style={styles.cartItemsContainer}>
                <View style={styles.cartIconContainer}>
                  <Ionicons name="basket" size={20} color={primary} />
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{totalItems}</Text>
                  </View>
                </View>
                <View style={styles.cartDetails}>
                  <Text style={styles.cartItemsText}>
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </Text>
                  <Text style={styles.cartTotalText}>
                    ${cartTotal.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewCartButton}
              onPress={handleViewCart}
              activeOpacity={0.8}
            >
              <Text style={styles.viewCartText}>View Cart</Text>
              <Ionicons name="arrow-forward" size={20} color={shades.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  /* --- sub-categories --- */
  subcategoriesSection: {
    backgroundColor: shades.white,
    paddingTop: 24,
    paddingBottom: 20,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  subcategoriesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subcategoriesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subcategoriesSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${primary}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  subcategoriesScrollContent: {
    paddingHorizontal: 20,
    paddingRight: 20,
  },
  subcategoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#F8F9FA",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    minWidth: 80,
  },
  firstChip: {
    marginLeft: 0,
  },
  selectedSubcategoryChip: {
    backgroundColor: primary,
    borderColor: primary,
    elevation: 4,
    shadowColor: primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  chipIcon: {
    marginRight: 6,
  },
  subcategoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  selectedSubcategoryChipText: {
    color: shades.white,
    fontWeight: "700",
  },

  /* --- products --- */
  productsSection: {
    flex: 1,
    backgroundColor: shades.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    marginTop: 16,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 12,
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  productsHeaderLeft: {
    flex: 1,
  },
  productsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  productsSubtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productsSubtitle: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 4,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: shades.white,
    fontWeight: "700",
    marginRight: 6,
  },
  productsGrid: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  /* --- empty-state --- */
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 40,
  },

  /* --- bottom cart section --- */
  bottomCartSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: shades.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cartSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartInfo: {
    flex: 1,
    marginRight: 16,
  },
  cartItemsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartIconContainer: {
    position: "relative",
    marginRight: 12,
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: shades.white,
  },
  cartBadgeText: {
    color: shades.white,
    fontSize: 12,
    fontWeight: "700",
  },
  cartDetails: {
    flex: 1,
  },
  cartItemsText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginBottom: 2,
  },
  cartTotalText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  viewCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  viewCartText: {
    color: shades.white,
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
});

export default CategoryScreen;

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   FlatList,
//   Animated,
//   StatusBar,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { light, primary, shades } from "@/constants/colors";
// import ProductItemCard from "@/components/ui/ProductItemCard";
// import { useGlobalSearchParams, useRouter } from "expo-router";
// import { useDispatch, useSelector } from "react-redux";
// import { getProducts } from "@/store/actions/productsActions";
// import { getSubCategories } from "@/store/actions/categoriesActions";
// import SearchInput from "@/components/ui/SearchInput";
// import HeaderCommon from "@/components/ui/HeaderCommon";
// import {
//   CategorySkeleton,
//   ProductsSkeleton,
//   SubcategorySkeleton,
// } from "@/components/ui/Skeletons";
// import { getPantryProducts } from "@/store/actions/pantryActions";

// /* ---------- local monochrome palette ---------- */

// const SubCategoryScreen = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const scrollY = new Animated.Value(0);
//   const [showSearch, setShowSearch] = useState(false);
//   // Get category from route params
//   const { category } = useGlobalSearchParams() || {
//     category: "Meat & Poultry",
//   };
//   const categories = useSelector((state: any) => state.categories);
//   const pantry = useSelector((state) => state.pantry);
//   const pantryData = pantry?.data;
//   const favouriteIds = {};
//   pantryData &&
//     pantryData?.forEach((item) => {
//       if (item.product) {
//         favouriteIds[item.product._id] = true;
//       }
//     });

//   console.log("New gog gog ", favouriteIds);
//   const subcategories = useSelector(
//     (state: any) => state.categories.SubCategories
//   );
//   const products = useSelector((state: any) => state.products);

//   /* ---------- memoised lists ---------- */
//   const subcategoriesList = useMemo(() => {
//     const data = subcategories?.data || [];
//     return [{ _id: -10, name: "All" }, ...data];
//   }, [subcategories?.data]);

//   const [selectedSubcategory, setSelectedSubcategory] = useState(-10);
//   const [prodLimit, setProdLimit] = useState(20);
//   const filteredProducts = products.data || [];
//   const searchFilters = {
//     category_slug: `${categories.selectedCategory.slug}`,
//   };
//   if (selectedSubcategory !== -10)
//     searchFilters.sub_category = `${selectedSubcategory}`;
//   /* ---------- header animation ---------- */
//   const headerOpacity = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [1, 0.9],
//     extrapolate: "clamp",
//   });
//   const headerTranslateY = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [0, -10],
//     extrapolate: "clamp",
//   });

//   /* ---------- data fetching ---------- */
//   useEffect(() => {
//     const fetchSubCategories = async () => {
//       try {
//         if (categories.selectedCategory?._id) {
//           await dispatch(
//             getSubCategories(categories.selectedCategory._id)
//           ).unwrap();
//         }
//       } catch (err) {
//         console.error("Error fetching subcategories:", err);
//       }
//     };
//     fetchSubCategories();
//   }, [categories.selectedCategory?._id, dispatch]);

//   useEffect(() => {
//     const fetchPantryProducts = async () => {
//       try {
//         console.log("Nice calling u gog gog");
//         await dispatch(getPantryProducts()).unwrap();
//       } catch (err) {
//         console.log("Error fetching pantry products", err);
//       }
//     };
//     fetchPantryProducts();
//   }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const prodFilters = {
//           category_slug: categories.selectedCategory.slug,
//         };

//         if (selectedSubcategory !== -10)
//           prodFilters.sub_category = selectedSubcategory;
//         if (prodLimit !== -1) prodFilters.limit = prodLimit;

//         dispatch(getProducts(prodFilters)).unwrap();
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       }
//     };
//     fetchProducts();
//   }, [selectedSubcategory, dispatch, prodLimit]);

//   /* ---------- renderers ---------- */
//   const renderSubcategoryItem = ({ item }) => (
//     <TouchableOpacity
//       key={item._id}
//       style={[
//         styles.subcategoryChip,
//         selectedSubcategory === item._id && styles.selectedSubcategoryChip,
//       ]}
//       onPress={() => setSelectedSubcategory(item._id)}
//       activeOpacity={0.7}
//     >
//       <Text
//         style={[
//           styles.subcategoryChipText,
//           selectedSubcategory === item._id &&
//             styles.selectedSubcategoryChipText,
//         ]}
//       >
//         {item.name}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={shades.white} />

//       {/* ---------- Header ---------- */}
//       <HeaderCommon
//         title={category}
//         subtitle={`${filteredProducts?.length || 0} products`}
//         isSearchEnabled={true}
//         searchFilters={searchFilters}
//         enableDropdown={false}
//       />

//       {/* ---------- Sub-categories ---------- */}
//       <View style={styles.subcategoriesSection}>
//         {/* <View style={styles.subcategoriesHeader}>
//           <Text style={styles.subcategoriesTitle}>Categories</Text>
//           <View style={styles.subcategoriesCount}>
//             <Text style={styles.subcategoriesCountText}>
//               {subcategoriesList?.length || 0}
//             </Text>
//           </View>
//         </View> */}

//         {subcategories.isLoading ? (
//           <SubcategorySkeleton />
//         ) : (
//           <FlatList
//             data={subcategoriesList}
//             renderItem={renderSubcategoryItem}
//             keyExtractor={(item) => item._id.toString()}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.subcategoriesScrollContent}
//             ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
//           />
//         )}
//       </View>

//       {/* ---------- Products ---------- */}
//       <View style={styles.productsSection}>
//         <View style={styles.productsHeader}>
//           <View>
//             <Text style={styles.productsTitle}>Products</Text>
//             <Text style={styles.productsSubtitle}>Fresh & Quality Items</Text>
//           </View>
//           <TouchableOpacity
//             style={styles.viewAllButton}
//             activeOpacity={0.7}
//             onPress={() => setProdLimit(-1)}
//           >
//             <Text style={styles.viewAllText}>View All</Text>
//             <Ionicons name="chevron-forward" size={16} color={shades.white} />
//           </TouchableOpacity>
//         </View>

//         {products.isLoading || pantry.isLoading ? (
//           <ProductsSkeleton />
//         ) : filteredProducts.length > 0 ? (
//           <Animated.FlatList
//             data={filteredProducts}
//             renderItem={({ item }) => (
//               <ProductItemCard item={item} favouriteIds={favouriteIds} />
//             )}
//             keyExtractor={(item) => item._id.toString()}
//             numColumns={2}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.productsGrid}
//             onScroll={Animated.event(
//               [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//               { useNativeDriver: true }
//             )}
//             scrollEventThrottle={16}
//             columnWrapperStyle={styles.productRow}
//           />
//         ) : (
//           <View style={styles.emptyStateContainer}>
//             <Text style={styles.emptyStateText}>No products found</Text>
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// /* ---------- Styles ---------- */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: shades.lightGray,
//   },

//   /* --- sub-categories --- */
//   subcategoriesSection: {
//     backgroundColor: shades.white,
//     paddingTop: 20,
//     paddingBottom: 24,
//     borderBottomWidth: 1,
//     borderBottomColor: shades.lighterGray,
//   },

//   subcategoriesHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   subcategoriesTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#1a1a1a",
//   },
//   subcategoriesCount: {
//     backgroundColor: primary,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   subcategoriesCountText: {
//     color: shades.white,
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   subcategoriesScrollContent: { paddingHorizontal: 20, paddingRight: 20 },
//   subcategoryChip: {
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 25,
//     backgroundColor: shades.lightGray,
//     borderWidth: 1,
//     borderColor: shades.lighterGray,
//     minWidth: 80,
//     alignItems: "center",
//   },
//   selectedSubcategoryChip: {
//     backgroundColor: primary,
//     borderColor: primary,
//     elevation: 3,
//     shadowColor: primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 6,
//   },
//   subcategoryChipText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#666666",
//   },
//   selectedSubcategoryChipText: {
//     color: shades.white,
//     fontWeight: "600",
//   },

//   /* --- products --- */
//   productsSection: {
//     flex: 1,
//     backgroundColor: shades.white,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingTop: 24,
//     marginTop: 8,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: -2 },
//     shadowRadius: 6,
//   },
//   productsHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     // marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: shades.lighterGray,
//     paddingBottom: 12,
//   },
//   productsTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#1a1a1a",
//     marginBottom: 4,
//   },
//   productsSubtitle: {
//     fontSize: 14,
//     color: "#666666",
//     fontWeight: "500",
//   },
//   viewAllButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: primary,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
//   viewAllText: {
//     fontSize: 14,
//     color: shades.white,
//     fontWeight: "600",
//     marginRight: 4,
//   },
//   productsGrid: { paddingHorizontal: 16, paddingBottom: 100 },
//   productRow: {
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },

//   /* --- empty-state --- */
//   emptyStateContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 40,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: "#666666",
//     fontWeight: "500",
//   },
// });

// export default SubCategoryScreen;

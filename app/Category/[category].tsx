import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  useColorScheme,
  Animated,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  dark,
  dark_secondary,
  light,
  light_secondary,
  primary,
} from "@/constants/colors";
import ProductItemCard from "@/components/ui/ProductItemCard";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "@/store/actions/productsActions";
import { getSubCategories } from "@/store/actions/categoriesActions";

const SubCategoryScreen = () => {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => getStyles(colorScheme), [colorScheme]);
  const dispatch = useDispatch();
  const router = useRouter();
  const scrollY = new Animated.Value(0);

  // Get category from route params
  const { category } = useGlobalSearchParams() || {
    category: "Meat & Poultry",
  };
  const categories = useSelector((state: any) => state.categories);
  const subcategories = useSelector(
    (state: any) => state.categories.SubCategories
  );
  const products = useSelector((state: any) => state.products);
  const subcategoriesList = [{ _id: -10, name: "All" }, ...subcategories?.data];

  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subcategoriesList[0]?._id
  );

  const filteredProducts = products.data;

  // Header animation
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

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        await dispatch(
          getSubCategories(categories.selectedCategory?._id)
        ).unwrap();
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (selectedSubcategory === -10) {
          await dispatch(
            getProducts({ category_slug: categories.selectedCategory?.slug })
          ).unwrap();
        } else {
          await dispatch(
            getProducts({ sub_category: selectedSubcategory })
          ).unwrap();
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [selectedSubcategory]);

  const renderSubcategoryItem = ({ item: subcat, index }) => (
    <TouchableOpacity
      key={subcat._id}
      style={[
        styles.subcategoryChip,
        selectedSubcategory === subcat._id && styles.selectedSubcategoryChip,
      ]}
      onPress={() => setSelectedSubcategory(subcat._id)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.subcategoryChipText,
          selectedSubcategory === subcat._id &&
            styles.selectedSubcategoryChipText,
        ]}
      >
        {subcat.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colorScheme === "light" ? light : dark}
      />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="chevron-back" size={22} color={primary} />
          </View>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {category}
          </Text>
          <Text style={styles.headerSubtitle}>
            {filteredProducts?.length || 0} products
          </Text>
        </View>

        <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="search"
              size={22}
              color={colorScheme === "light" ? "#666" : "#ccc"}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Enhanced Subcategories Section */}
      <View style={styles.subcategoriesSection}>
        <View style={styles.subcategoriesHeader}>
          <Text style={styles.subcategoriesTitle}>Categories</Text>
          <View style={styles.subcategoriesCount}>
            <Text style={styles.subcategoriesCountText}>
              {subcategoriesList?.length || 0}
            </Text>
          </View>
        </View>

        <FlatList
          data={subcategoriesList}
          renderItem={renderSubcategoryItem}
          keyExtractor={(item) => item._id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subcategoriesScrollContent}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>

      {/* Enhanced Products Section */}
      <View style={styles.productsSection}>
        <View style={styles.productsHeader}>
          <View>
            <Text style={styles.productsTitle}>Products</Text>
            <Text style={styles.productsSubtitle}>Fresh & Quality Items</Text>
          </View>
          <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={primary} />
          </TouchableOpacity>
        </View>

        <Animated.FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductItemCard item={item} />}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsGrid}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colorScheme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === "light" ? light : dark,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingTop: 50,
      backgroundColor: colorScheme === "light" ? light : dark,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === "light" ? "#f0f0f0" : dark_secondary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === "light" ? 0.05 : 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colorScheme === "light" ? "#f8f9fa" : dark_secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    backButton: {
      marginRight: 12,
    },
    headerTitleContainer: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colorScheme === "light" ? "#1a1a1a" : "#ffffff",
      marginBottom: 2,
    },
    headerSubtitle: {
      fontSize: 12,
      color: colorScheme === "light" ? "#666" : "#999",
      fontWeight: "500",
    },
    searchButton: {
      marginLeft: 12,
    },
    subcategoriesSection: {
      backgroundColor: colorScheme === "light" ? light : dark,
      paddingTop: 20,
      paddingBottom: 24,
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
      color: colorScheme === "light" ? "#1a1a1a" : "#ffffff",
    },
    subcategoriesCount: {
      backgroundColor: primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    subcategoriesCountText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
    },
    subcategoriesScrollContent: {
      paddingHorizontal: 20,
    },
    subcategoryChip: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      backgroundColor: colorScheme === "light" ? "#f8f9fa" : dark_secondary,
      borderWidth: 1,
      borderColor: colorScheme === "light" ? "#e9ecef" : dark_secondary,
      minWidth: 80,
      alignItems: "center",
    },
    selectedSubcategoryChip: {
      backgroundColor: primary,
      borderColor: primary,
      shadowColor: primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    subcategoryChipText: {
      fontSize: 14,
      fontWeight: "500",
      color: colorScheme === "light" ? "#666" : "#ccc",
    },
    selectedSubcategoryChipText: {
      color: "#ffffff",
      fontWeight: "600",
    },
    productsSection: {
      flex: 1,
      backgroundColor: colorScheme === "light" ? "#fafbfc" : "#1a1a1a",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 24,
      marginTop: 8,
    },
    productsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    productsTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colorScheme === "light" ? "#1a1a1a" : "#ffffff",
      marginBottom: 4,
    },
    productsSubtitle: {
      fontSize: 14,
      color: colorScheme === "light" ? "#666" : "#999",
      fontWeight: "500",
    },
    viewAllButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colorScheme === "light" ? "#ffffff" : dark_secondary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colorScheme === "light" ? "#e9ecef" : dark_secondary,
    },
    viewAllText: {
      fontSize: 14,
      color: primary,
      fontWeight: "600",
      marginRight: 4,
    },
    productsGrid: {
      paddingHorizontal: 16,
      paddingBottom: 100,
    },
  });

export default SubCategoryScreen;

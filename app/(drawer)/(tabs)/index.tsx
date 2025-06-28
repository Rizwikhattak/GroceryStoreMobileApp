// screens/HomeScreen.jsx or your updated index.tsx
"use client";

import CategorySlider from "@/components/ui/CategorySlider";
import ProductsList from "@/components/ui/ProductsList";
import PromoSlider from "@/components/ui/PromoSlider";
import SearchInput from "@/components/ui/SearchInput";
import SectionHeader from "@/components/ui/SectionHeader";
import { primary } from "@/constants/colors";
import {
  getAllFeaturedProducts,
  getFeaturedProducts,
} from "@/store/actions/productsActions";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
  Button,
  InteractionManager,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/images/premium-meats-logo.svg";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "@/store/reducers/authSlice";
import { getPantryProducts } from "@/store/actions/pantryActions";
import { useFocusEffect } from "@react-navigation/native";
import Navbar from "@/components/ui/Navbar";
import { getAllCategories } from "@/store/actions/categoriesActions";

// Pre-defined styles to prevent recreation
const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    minHeight: "100%",
    paddingBottom: 10,
    overflow: "visible",
  },
  promoSliderContainer: {
    marginTop: 16,
  },
  categorySliderContainer: {
    marginTop: 40,
  },
  featuredProductsContainer: {
    marginTop: 40,
  },
});

export default function HomeScreen() {
  const dispatch = useDispatch();

  // Selectors with shallow equality check
  const user = useSelector((state: any) => state.auth);
  const products = useSelector((state: any) => state.products.featuredProducts);
  const cart = useSelector((state: any) => state.cart);
  const pantry = useSelector((state: any) => state.pantry);

  // Local state for loading and error handling
  const [isLoadingPantry, setIsLoadingPantry] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Ref to track component mount status
  const isMountedRef = useRef(true);

  const fetchFeaturedProducts = useCallback(async () => {
    if (isLoadingProducts) return; // Prevent duplicate requests

    try {
      setIsLoadingProducts(true);
      console.log("Fetching featured products...");

      await dispatch(getFeaturedProducts()).unwrap();
    } catch (err) {
      console.log("Error fetching featured products:", err);
    } finally {
      if (isMountedRef.current) {
        setIsLoadingProducts(false);
      }
    }
  }, [dispatch, isLoadingProducts]);

  // Add other API fetch functions here
  const fetchCategories = useCallback(async () => {
    try {
      console.log("Fetching categories...");
      await dispatch(getAllCategories()).unwrap();
    } catch (err) {
      console.log("Error fetching categories:", err);
    }
  }, [dispatch]);

  // Comprehensive refresh function that calls ALL APIs
  const refreshAllData = useCallback(async () => {
    console.log("Refreshing all data...");
    try {
      // Call all your API functions here
      const results = await Promise.allSettled([
        fetchFeaturedProducts(),
        fetchCategories(),
      ]);

      // Log any failed requests for debugging
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const apiNames = [
            "pantry",
            "products",
            "categories",
            "promotions",
            "profile",
            "cart",
          ];
          console.log(`Failed to fetch ${apiNames[index]}:`, result.reason);
        }
      });
    } catch (error) {
      console.log("Error during comprehensive refresh:", error);
    }
  }, [fetchFeaturedProducts, fetchCategories]);

  // Updated pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshAllData();
    } catch (error) {
      console.log("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshAllData]);

  // Focus effect - refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Use InteractionManager to delay non-critical updates
      refreshAllData();
      // InteractionManager.runAfterInteractions(() => {
      //   refreshAllData().catch((err) => {
      //     console.log("Error refreshing data on focus:", err);
      //   });
      // });
    }, [pantry.data])
  );

  // Memoized handlers
  const handleViewAllProducts = useCallback(() => {
    if (products?.pagination?.total) {
      dispatch(getAllFeaturedProducts({ limit: products.pagination.total }));
    }
  }, [dispatch, products?.pagination?.total]);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // Memoized render sections to prevent unnecessary re-renders
  const renderPromoSlider = useMemo(
    () => (
      <View style={styles.promoSliderContainer}>
        <PromoSlider />
      </View>
    ),
    []
  );

  const renderCategorySlider = useMemo(
    () => (
      <View style={styles.categorySliderContainer}>
        <CategorySlider />
      </View>
    ),
    []
  );

  const renderFeaturedProducts = useMemo(
    () => (
      <View style={styles.featuredProductsContainer}>
        <SectionHeader
          title="Featured Products"
          onViewAll={handleViewAllProducts}
        />
        <ProductsList products={products} />
      </View>
    ),
    [products, handleViewAllProducts]
  );

  return (
    <>
      <Navbar />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            removeClippedSubviews={true} // Optimize for large lists
            scrollEventThrottle={16} // Optimize scroll performance
            onScrollBeginDrag={dismissKeyboard} // Dismiss keyboard on scroll
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[primary]}
                tintColor={primary}
                title="Pull to refresh"
                titleColor="#666"
              />
            }
          >
            {renderPromoSlider}
            {renderCategorySlider}
            {renderFeaturedProducts}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

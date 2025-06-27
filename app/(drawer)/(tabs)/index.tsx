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
    paddingBottom: 80,
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

  // Memoized favourite IDs computation
  const favouriteIds = useMemo(() => {
    const ids = {};
    if (pantry?.data && Array.isArray(pantry.data)) {
      pantry.data.forEach((item) => {
        if (item?.product?._id) {
          ids[item.product._id] = true;
        }
      });
    }
    return ids;
  }, [pantry?.data]);

  // Optimized fetch functions with error handling
  const fetchPantryProducts = useCallback(async () => {
    if (isLoadingPantry) return; // Prevent duplicate requests

    try {
      setIsLoadingPantry(true);
      console.log("Fetching pantry products...");

      await dispatch(getPantryProducts()).unwrap();
    } catch (err) {
      console.log("Error fetching pantry products:", err);
    } finally {
      if (isMountedRef.current) {
        setIsLoadingPantry(false);
      }
    }
  }, [dispatch, isLoadingPantry]);

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

  const fetchPromotions = useCallback(async () => {
    try {
      console.log("Fetching promotions...");
      // Replace with your actual promotions action
      // await dispatch(getPromotions()).unwrap();
    } catch (err) {
      console.log("Error fetching promotions:", err);
    }
  }, [dispatch]);

  const fetchUserProfile = useCallback(async () => {
    try {
      console.log("Fetching user profile...");
      // Replace with your actual user profile action
      // await dispatch(getUserProfile()).unwrap();
    } catch (err) {
      console.log("Error fetching user profile:", err);
    }
  }, [dispatch]);

  const fetchCartItems = useCallback(async () => {
    try {
      console.log("Fetching cart items...");
      // Replace with your actual cart action
      // await dispatch(getCartItems()).unwrap();
    } catch (err) {
      console.log("Error fetching cart items:", err);
    }
  }, [dispatch]);

  // Comprehensive refresh function that calls ALL APIs
  const refreshAllData = useCallback(async () => {
    console.log("Refreshing all data...");
    try {
      // Call all your API functions here
      const results = await Promise.allSettled([
        fetchPantryProducts(),
        fetchFeaturedProducts(),
        fetchCategories(),
        fetchPromotions(),
        fetchUserProfile(),
        fetchCartItems(),
        // Add any other API calls you need
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
  }, [
    fetchPantryProducts,
    fetchFeaturedProducts,
    fetchCategories,
    fetchPromotions,
    fetchUserProfile,
    fetchCartItems,
  ]);

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

  // Initial data loading with InteractionManager for better performance
  useEffect(() => {
    const loadInitialData = () => {
      InteractionManager.runAfterInteractions(() => {
        refreshAllData().catch((err) => {
          console.log("Error loading initial data:", err);
        });
      });
    };

    loadInitialData();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [refreshAllData]);

  // Focus effect - refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Use InteractionManager to delay non-critical updates
      InteractionManager.runAfterInteractions(() => {
        refreshAllData().catch((err) => {
          console.log("Error refreshing data on focus:", err);
        });
      });
    }, [refreshAllData])
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
        <ProductsList
          products={products}
          pantryData={pantry?.data}
          favouriteIds={favouriteIds}
        />
      </View>
    ),
    [products, pantry?.data, favouriteIds, handleViewAllProducts]
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

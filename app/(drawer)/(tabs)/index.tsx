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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/images/premium-meats-logo.svg";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "@/store/reducers/authSlice";
import { getPantryProducts } from "@/store/actions/pantryActions";
import { useFocusEffect } from "@react-navigation/native";
import Navbar from "@/components/ui/Navbar";
import Toast from "react-native-toast-message";

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
  const [lastFetchTime, setLastFetchTime] = useState(0);

  // Refs to prevent unnecessary re-fetching
  const pantryFetchedRef = useRef(false);
  const productsFetchedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Cache time (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

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

  // Optimized fetch functions with caching and error handling
  const fetchPantryProducts = useCallback(
    async (force = false) => {
      const now = Date.now();

      // Skip if recently fetched and not forced
      if (
        !force &&
        pantryFetchedRef.current &&
        now - lastFetchTime < CACHE_DURATION
      ) {
        return;
      }

      if (isLoadingPantry) return; // Prevent duplicate requests

      try {
        setIsLoadingPantry(true);
        console.log("Fetching pantry products...");

        await dispatch(getPantryProducts()).unwrap();

        if (isMountedRef.current) {
          pantryFetchedRef.current = true;
          setLastFetchTime(now);
        }
      } catch (err) {
        console.log("Error fetching pantry products:", err);
        // Don't throw here to prevent app crashes
      } finally {
        if (isMountedRef.current) {
          setIsLoadingPantry(false);
        }
      }
    },
    [dispatch, isLoadingPantry, lastFetchTime]
  );

  const fetchFeaturedProducts = useCallback(
    async (force = false) => {
      const now = Date.now();

      // Skip if recently fetched and not forced
      if (
        !force &&
        productsFetchedRef.current &&
        now - lastFetchTime < CACHE_DURATION
      ) {
        return;
      }

      if (isLoadingProducts) return; // Prevent duplicate requests

      try {
        setIsLoadingProducts(true);
        console.log("Fetching featured products...");

        await dispatch(getFeaturedProducts()).unwrap();

        if (isMountedRef.current) {
          productsFetchedRef.current = true;
          setLastFetchTime(now);
        }
      } catch (err) {
        console.log("Error fetching featured products:", err);
        // Don't throw here to prevent app crashes
      } finally {
        if (isMountedRef.current) {
          setIsLoadingProducts(false);
        }
      }
    },
    [dispatch, isLoadingProducts, lastFetchTime]
  );

  // Initial data loading with InteractionManager for better performance
  useEffect(() => {
    const loadInitialData = () => {
      InteractionManager.runAfterInteractions(() => {
        // Load both in parallel for better performance
        Promise.all([
          fetchPantryProducts(true),
          fetchFeaturedProducts(true),
        ]).catch((err) => {
          console.log("Error loading initial data:", err);
        });
      });
    };

    loadInitialData();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPantryProducts, fetchFeaturedProducts]);

  // Optimized focus effect - only refresh if data is stale
  useFocusEffect(
    useCallback(() => {
      const now = Date.now();
      const shouldRefresh = now - lastFetchTime > CACHE_DURATION;

      if (shouldRefresh) {
        // Use InteractionManager to delay non-critical updates
        InteractionManager.runAfterInteractions(() => {
          Promise.all([
            fetchPantryProducts(false),
            fetchFeaturedProducts(false),
          ]).catch((err) => {
            console.log("Error refreshing data on focus:", err);
          });
        });
      }
    }, [fetchPantryProducts, fetchFeaturedProducts, lastFetchTime])
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
          >
            {renderPromoSlider}
            {renderCategorySlider}
            {renderFeaturedProducts}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </>
  );
}

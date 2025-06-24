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
import { useCallback, useEffect } from "react";
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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/images/premium-meats-logo.svg";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "@/store/reducers/authSlice";
import { getPantryProducts } from "@/store/actions/pantryActions";
import { useFocusEffect } from "@react-navigation/native";
import Navbar from "@/components/ui/Navbar";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const user = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const products = useSelector((state: any) => state.products.featuredProducts);
  const cart = useSelector((state: any) => state.cart);
  console.log("cart", cart);

  const pantry = useSelector((state) => state.pantry);
  const pantryData = pantry?.data;
  const favouriteIds = {};
  pantryData &&
    pantryData.forEach((item) => {
      if (item.product) {
        favouriteIds[item.product._id] = true;
      }
    });

  useFocusEffect(
    useCallback(() => {
      const fetchPantryProducts = async () => {
        try {
          console.log("Nice calling u gog gog");
          await dispatch(getPantryProducts()).unwrap();
        } catch (err) {
          console.log("Error fetching pantry products", err);
        }
      };
      fetchPantryProducts();

      const fetchFeaturedProducts = async () => {
        try {
          await dispatch(getFeaturedProducts()).unwrap();
        } catch (err) {
          console.log("Error fetching prods", err);
        }
      };
      fetchFeaturedProducts();
    }, [dispatch])
  );

  // Function to dismiss keyboard when tapping outside of input
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

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
          >
            {/* Promo Slider */}
            <View style={styles.promoSliderContainer}>
              <PromoSlider />
            </View>

            {/* Category Slider */}
            <View style={styles.categorySliderContainer}>
              <CategorySlider />
            </View>

            {/* Featured Products */}
            <View style={styles.featuredProductsContainer}>
              <SectionHeader
                title="Featured Products"
                onViewAll={() =>
                  dispatch(
                    getAllFeaturedProducts({ limit: products.pagination.total })
                  )
                }
              />
              <ProductsList
                products={products}
                pantryData={pantry?.data}
                favouriteIds={favouriteIds}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </>
  );
}

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

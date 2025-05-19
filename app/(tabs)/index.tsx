"use client";

import CategorySlider from "@/components/ui/CategorySlider";
import ProductsList from "@/components/ui/ProductsList";
import PromoSlider from "@/components/ui/PromoSlider";
import SearchInput from "@/components/ui/SearchInput";
import SectionHeader from "@/components/ui/SectionHeader";
import { primary } from "@/constants/colors";
import { icons } from "@/constants/icons";
import {
  getAllFeaturedProducts,
  getFeaturedProducts,
} from "@/store/actions/productsActions";
import { useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const checkPersistedData = async () => {
//   try {
//     const data = await AsyncStorage.getItem("persist:root");
//     if (data !== null) {
//       // Data is stored. Note that it's a JSON string.
//       console.log("Persisted data:", JSON.parse(data));
//     } else {
//       console.log("No persisted data found");
//     }
//   } catch (error) {
//     console.error("Error reading persisted data:", error);
//   }
// };

// checkPersistedData();

export default function Index() {
  const user = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const products = useSelector((state: any) => state.products.featuredProducts);
  console.log("userrrr", user);
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        await dispatch(getFeaturedProducts()).unwrap();
      } catch (err) {
        console.log("Error fetching prods", err);
      }
    };
    fetchFeaturedProducts();
  }, [dispatch]);
  // Function to dismiss keyboard when tapping outside of input
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
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
          {/* Title section - can be wrapped with TouchableOpacity to dismiss keyboard */}
          <TouchableOpacity activeOpacity={1} onPress={dismissKeyboard}>
            <View style={styles.titleContainer}>
              <Text style={styles.premiumText}>Premium</Text>
              <Text style={styles.meatsText}>Meats</Text>
            </View>
          </TouchableOpacity>

          {/* Welcome section */}
          <View style={styles.welcomeSection}>
            <TouchableOpacity activeOpacity={1} onPress={dismissKeyboard}>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>Welcome, </Text>
                <Text style={styles.welcomeNameText}>
                  {user.data.first_name}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={dismissKeyboard}>
              <View style={styles.notificationButton}>
                <Image
                  source={icons.bell}
                  // tintColor="#ea7173"
                  tintColor={primary}
                  style={styles.notificationIcon}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Search input */}
          <View style={styles.searchContainer}>
            <SearchInput />
          </View>

          {/* DO NOT wrap sliders with TouchableWithoutFeedback */}
          <View style={styles.promoSliderContainer}>
            <PromoSlider />
          </View>

          <View style={styles.categorySliderContainer}>
            <CategorySlider />
          </View>

          <View style={styles.featuredProductsContainer}>
            <SectionHeader
              title="Featured Products"
              onViewAll={() =>
                dispatch(
                  getAllFeaturedProducts({ limit: products.pagination.total })
                )
              }
            />
            <ProductsList products={products} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f9fafb", // bg-light-100 equivalent
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20, // px-5 equivalent
  },
  scrollViewContent: {
    minHeight: "100%",
    paddingBottom: 80, // Add extra padding at bottom to account for tab bar
    paddingTop: 50,
    overflow: "visible",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  premiumText: {
    fontSize: 30, // equivalent to text-3xl
    fontWeight: "bold", // equivalent to font-bold
    color: primary, // your primary-700 color
  },
  meatsText: {
    fontSize: 30, // equivalent to text-3xl
    fontWeight: "bold", // equivalent to font-bold
    // default color (e.g., black) unless you specify otherwise
  },
  welcomeSection: {
    marginTop: 40, // mt-10 equivalent
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  welcomeTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeText: {
    fontSize: 20, // text-xl equivalent
    fontWeight: "600", // font-semibold equivalent
  },
  welcomeNameText: {
    fontSize: 20, // text-xl equivalent
    fontWeight: "600", // font-semibold equivalent
    color: primary, // text-primary-700 equivalent
  },
  notificationButton: {
    justifyContent: "center",
    width: 40, // size-10 equivalent
    height: 40, // size-10 equivalent
    alignItems: "center",
    borderRadius: 20, // rounded-full equivalent
    backgroundColor: "#e5e7eb", // bg-gray-200 equivalent
  },
  notificationIcon: {
    width: 20, // size-5 equivalent
    height: 20, // size-5 equivalent
    borderRadius: 10, // rounded-full equivalent
  },
  searchContainer: {
    marginVertical: 24, // my-6 equivalent
  },
  promoSliderContainer: {
    marginTop: 16, // mt-4 equivalent
  },
  categorySliderContainer: {
    marginTop: 40, // mt-10 equivalent
  },
  featuredProductsContainer: {
    marginTop: 40, // mt-10 equivalent
  },
});

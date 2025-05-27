"use client";

import CategorySlider from "@/components/ui/CategorySlider";
import ProductsList from "@/components/ui/ProductsList";
import PromoSlider from "@/components/ui/PromoSlider";
import SearchInput from "@/components/ui/SearchInput";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  dark,
  dark_secondary,
  light,
  light_secondary,
  primary,
} from "@/constants/colors";
import {
  getAllFeaturedProducts,
  getFeaturedProducts,
} from "@/store/actions/productsActions";
import { useEffect, useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/images/premium-meats-logo.svg";
import AppText from "@/components/ui/AppText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { logout } from "@/store/reducers/authSlice";
import { getPantryProducts } from "@/store/actions/pantryActions";

export default function Index() {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => getStyles(colorScheme), [colorScheme]);
  const user = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const products = useSelector((state: any) => state.products.featuredProducts);
  console.log("userrrr", user);
  const pantry = useSelector((state) => state.pantry);
  useEffect(() => {
    const fetchPantryProducts = async () => {
      try {
        await dispatch(getPantryProducts()).unwrap();
      } catch (err) {
        console.log("Error fetching pantry products", err);
      }
    };
    const fetchFeaturedProducts = async () => {
      try {
        await dispatch(getFeaturedProducts()).unwrap();
      } catch (err) {
        console.log("Error fetching prods", err);
      }
    };
    fetchPantryProducts();
    fetchFeaturedProducts();
  }, [dispatch]);

  // Function to dismiss keyboard when tapping outside of input
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          // Dispatch logout action
          dispatch(logout());
          console.log("User logged out");
          // Navigate to login screen
          // router.replace("/login");
        },
        style: "destructive",
      },
    ]);
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
            <Logo
              width={200}
              height={80}
              style={{ alignSelf: "center", marginTop: 20 }}
            />
          </TouchableOpacity>

          {/* Welcome section */}
          <View style={styles.welcomeSection}>
            <TouchableOpacity activeOpacity={1} onPress={dismissKeyboard}>
              <View style={styles.welcomeTextContainer}>
                <AppText style={styles.welcomeText}>Welcome, </AppText>
                <AppText variant="bold" style={styles.welcomeNameText}>
                  {user.data.first_name}
                </AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color={primary} />
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
            <ProductsList products={products} pantryData={pantry?.data} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colorScheme: string) =>
  StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: colorScheme === "light" ? light : dark, // bg-light-100 equivalent
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
      marginTop: 25, // mt-10 equivalent
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
      fontFamily: "Optima-regular",
      color: colorScheme === "light" ? dark : light,
    },
    welcomeNameText: {
      fontSize: 20, // text-xl equivalent
      fontWeight: "600", // font-semibold equivalent
      color: primary, // text-primary-700 equivalent
    },
    logoutButton: {
      justifyContent: "center",
      width: 40, // size-10 equivalent
      height: 40, // size-10 equivalent
      alignItems: "center",
      borderRadius: 20, // rounded-full equivalent
      backgroundColor:
        colorScheme === "light" ? light_secondary : dark_secondary, // bg-gray-200 equivalent
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

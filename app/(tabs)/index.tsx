"use client";

import CategorySlider from "@/components/CategorySlider";
import FeatureProductsList from "@/components/FeatureProductsList";
import PromoSlider from "@/components/PromoSlider";
import SearchInput from "@/components/SearchInput";
import { primary } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { getFeaturedProducts } from "@/store/actions/productsActions";
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

export default function Index() {
  const products = useSelector((state) => state.products);
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
      style={{ flex: 1 }}
      className="bg-light-100"
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: "100%",
            paddingBottom: 80, // Add extra padding at bottom to account for tab bar
            paddingTop: 50,
            overflow: "visible",
          }}
        >
          {/* Title section - can be wrapped with TouchableOpacity to dismiss keyboard */}
          <TouchableOpacity activeOpacity={1} onPress={dismissKeyboard}>
            <View style={styles.container}>
              <Text style={styles.premiumText}>Premium</Text>
              <Text style={styles.meatsText}>Meats</Text>
            </View>
          </TouchableOpacity>

          {/* Welcome section */}
          <View className="mt-10 flex-row items-center justify-between gap-1">
            <TouchableOpacity activeOpacity={1} onPress={dismissKeyboard}>
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-semibold">Welcome ,</Text>
                <Text className="text-xl font-semibold text-primary-700">
                  {user.data.first_name}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={dismissKeyboard}>
              <View className="justify-center size-10 items-center rounded-full bg-gray-200">
                <Image
                  source={icons.bell}
                  // tintColor="#ea7173"
                  tintColor={primary}
                  className="size-5 rounded-full"
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Search input */}
          <View className="my-6">
            <SearchInput />
          </View>

          {/* DO NOT wrap sliders with TouchableWithoutFeedback */}
          <View className="mt-4">
            <PromoSlider />
          </View>

          <View className="mt-10">
            <CategorySlider />
          </View>

          <View className="mt-10">
            <FeatureProductsList />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    // Container styles if needed
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
});

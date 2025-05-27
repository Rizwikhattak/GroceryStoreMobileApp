import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import SearchInput from "@/components/ui/SearchInput";
import {
  dark,
  dark_secondary,
  light,
  light_secondary,
  primary,
} from "@/constants/colors";
import { getPantryProducts } from "@/store/actions/pantryActions";
import ProductItemCard from "@/components/ui/ProductItemCard";
import { ProductsSkeleton } from "@/components/ui/Skeletons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

const LikedScreen = () => {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => getStyles(colorScheme), [colorScheme]);
  const dispatch = useDispatch();
  const pantrySlice = useSelector((s: any) => s.pantry);
  const router = useRouter();
  const pantryItems = useMemo(
    () => (pantrySlice?.data ?? []).filter((p: any) => !!p.product),
    [pantrySlice?.data]
  );

  /* ---------- UI state ---------- */
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* ---------- fetch once ---------- */
  useEffect(() => {
    dispatch(getPantryProducts());
  }, [dispatch]);

  /* ---------- optional search filter ---------- */
  const visibleItems = useMemo(() => {
    if (!searchText.trim()) return pantryItems;
    const q = searchText.toLowerCase();
    return pantryItems.filter((pi: any) =>
      pi.product.name.toLowerCase().includes(q)
    );
  }, [searchText, pantryItems]);

  /* ---------- JSX ---------- */
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        style={colorScheme === "light" ? "dark" : "light"}
        translucent={true}
        backgroundColor="transparent"
      />

      {/* Enhanced Header with dynamic gradient background */}
      <LinearGradient
        colors={
          colorScheme === "light" ? ["#ffffff", "#f8f9fa"] : [dark, "#2a2a2a"]
        }
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <View style={styles.backButtonInner}>
              <Ionicons name="chevron-back" size={22} color={primary} />
            </View>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>My Pantry</Text>
            <Text style={styles.headerSubtitle}>Your favorite items</Text>
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setShowSearch((p) => !p)}
            activeOpacity={0.7}
          >
            <View style={styles.searchButtonInner}>
              <Ionicons
                name={showSearch ? "close" : "search"}
                size={20}
                color={colorScheme === "light" ? "#666" : "#ccc"}
              />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Enhanced Search Box */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <SearchInput value={searchText} onChangeText={setSearchText} />
          </View>
        </View>
      )}

      {/* Enhanced Count Display */}
      <View style={styles.countContainer}>
        <View style={styles.countBadge}>
          <Ionicons name="basket-outline" size={16} color={primary} />
          <Text style={styles.count}>
            {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}
          </Text>
        </View>
        {visibleItems.length > 0 && (
          <Text style={styles.countSubtext}>in your pantry</Text>
        )}
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {pantrySlice.isLoading || pantrySlice.isPostLoading ? (
          <ProductsSkeleton length={10} />
        ) : visibleItems.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons
                name="basket-outline"
                size={64}
                color={colorScheme === "light" ? "#e0e0e0" : "#555"}
              />
            </View>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySubtitle}>
              {searchText.trim()
                ? "Try adjusting your search terms"
                : "Start adding items to your pantry"}
            </Text>
            {!searchText.trim() && (
              <TouchableOpacity
                style={styles.addItemsButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[primary, "#e91e63"]}
                  style={styles.addItemsGradient}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.addItemsText}>Browse Products</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={visibleItems}
            keyExtractor={(it: any) => it.product._id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <ProductItemCard item={item.product} inPantry />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colorScheme: string) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colorScheme === "light" ? light : dark,
    },

    headerGradient: {
      paddingTop: 40,
      shadowColor: colorScheme === "light" ? "#000" : "#fff",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === "light" ? 0.1 : 0.05,
      shadowRadius: 8,
      elevation: 5,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 16,
      paddingTop: 8,
    },

    backButton: {
      padding: 4,
    },

    backButtonInner: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colorScheme === "light" ? "#f0f0f0" : dark_secondary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colorScheme === "light" ? "#000" : "#fff",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === "light" ? 0.1 : 0.05,
      shadowRadius: 4,
      elevation: 3,
    },

    headerTitleContainer: {
      flex: 1,
      alignItems: "center",
      marginHorizontal: 16,
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colorScheme === "light" ? primary : "#fff",
      letterSpacing: 0.5,
    },

    headerSubtitle: {
      fontSize: 13,
      color: colorScheme === "light" ? "#666" : "#ccc",
      marginTop: 2,
      fontWeight: "400",
    },

    searchButton: {
      padding: 4,
    },

    searchButtonInner: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colorScheme === "light" ? "#f0f0f0" : dark_secondary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colorScheme === "light" ? "#000" : "#fff",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === "light" ? 0.1 : 0.05,
      shadowRadius: 4,
      elevation: 3,
    },

    searchContainer: {
      backgroundColor: colorScheme === "light" ? light : dark,
      paddingBottom: 8,
      shadowColor: colorScheme === "light" ? "#000" : "#fff",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === "light" ? 0.05 : 0.02,
      shadowRadius: 4,
      elevation: 2,
    },

    searchBox: {
      paddingHorizontal: 20,
      paddingTop: 8,
    },

    countContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
    },

    countBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colorScheme === "light" ? "#f8f9fa" : dark_secondary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: colorScheme === "light" ? "#000" : "#fff",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: colorScheme === "light" ? 0.1 : 0.05,
      shadowRadius: 3,
      elevation: 2,
      borderWidth: 1,
      borderColor: colorScheme === "light" ? "#e9ecef" : "#333",
    },

    count: {
      fontSize: 14,
      fontWeight: "600",
      color: colorScheme === "light" ? "#333" : "#fff",
      marginLeft: 6,
    },

    countSubtext: {
      fontSize: 14,
      color: colorScheme === "light" ? "#666" : "#ccc",
      marginLeft: 8,
      fontWeight: "400",
    },

    contentContainer: {
      flex: 1,
      backgroundColor: colorScheme === "light" ? "#fafbfc" : "#121212",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: 8,
    },

    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
    },

    emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colorScheme === "light" ? "#f8f9fa" : dark_secondary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
      borderWidth: 2,
      borderColor: colorScheme === "light" ? "#e9ecef" : "#333",
      borderStyle: "dashed",
    },

    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colorScheme === "light" ? "#333" : "#fff",
      marginBottom: 8,
      textAlign: "center",
    },

    emptySubtitle: {
      fontSize: 16,
      color: colorScheme === "light" ? "#666" : "#ccc",
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 32,
    },

    addItemsButton: {
      marginTop: 16,
    },

    addItemsGradient: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 25,
    },

    addItemsText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },

    list: {
      padding: 16,
      paddingBottom: 100,
      paddingTop: 24,
    },

    row: {
      justifyContent: "space-between",
      paddingHorizontal: 4,
    },
  });

export default LikedScreen;

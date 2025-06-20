/* LikedScreen.tsx --------------------------------------------------------- */
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import SearchInput from "@/components/ui/SearchInput";
import { primary, shades } from "@/constants/colors";
import { getPantryProducts } from "@/store/actions/pantryActions";
import ProductItemCard from "@/components/ui/ProductItemCard";
import { ProductsSkeleton } from "@/components/ui/Skeletons";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import HeaderCommon from "@/components/ui/HeaderCommon";

const LikedScreen = () => {
  const dispatch = useDispatch();
  const pantrySlice = useSelector((s: any) => s.pantry); // { data: […] }
  const pantryItems = useMemo(
    () => (pantrySlice?.data ?? []).filter((p: any) => !!p.product),
    [pantrySlice?.data]
  );

  /* ---------- UI state ---------- */
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const handleSearchInput = (txt) => {
    setSearchText(txt);
  };
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
      <StatusBar style="dark" translucent={true} backgroundColor="white" />
      {/* header */}
      <HeaderCommon
        title="Liked Products"
        subtitle={`${pantryItems.length} items`}
        isSearchEnabled={true}
        enableDropdown={false}
        handleSearchInput={handleSearchInput}
      />
      {pantrySlice.isLoading || pantrySlice.isPostLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : visibleItems.length > 0 ? (
        <FlatList
          data={visibleItems}
          keyExtractor={(it: any) => it.product._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductItemCard item={item.product} inPantry={true} />
          )}
        />
      ) : (
       <View style> <Text style={{fontWeight:"bold"}}>No products</Text></View>
      )}
    </SafeAreaView>
  );
};

/* ------------- styles (unchanged except container names) ------------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  list: { padding: 8, paddingBottom: 80 },
});

export default LikedScreen;

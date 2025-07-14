import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import HeaderCommon from "@/components/ui/HeaderCommon";
import ProductItemCard from "@/components/ui/ProductItemCard";
import { primary } from "@/constants/Colors";
import { getPantryProducts } from "@/store/actions/pantryActions";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

const LikedScreen = () => {
  const dispatch = useDispatch();
  const pantrySlice = useSelector((s: any) => s.pantry);
  const pantryItems = useMemo(
    () => (pantrySlice?.data ?? []).filter((p: any) => !!p.product),
    [pantrySlice?.data]
  );

  /* ---------- UI state ---------- */
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  const handleSearchInput = (txt: string) => {
    setSearchText(txt);
  };

  /* ---------- fetch once ---------- */
  useFocusEffect(
    useCallback(() => {
      dispatch(getPantryProducts());
    }, [])
  );

  /* ---------- Animations ---------- */
  useEffect(() => {
    if (!pantrySlice.isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [pantrySlice.isLoading]);

  /* ---------- Pull to refresh ---------- */
  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getPantryProducts());
    setRefreshing(false);
  };

  /* ---------- optional search filter ---------- */
  const visibleItems = useMemo(() => {
    if (!searchText.trim()) return pantryItems;
    const q = searchText.toLowerCase();
    return pantryItems.filter((pi: any) =>
      pi.product.name.toLowerCase().includes(q)
    );
  }, [searchText, pantryItems]);

  /* ---------- Empty State Component ---------- */
  const EmptyState = () => (
    <Animated.View
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={["#f8f9ff", "#ffffff"]}
        style={styles.emptyGradient}
      >
        <View style={styles.emptyIconContainer}>
          <Ionicons name="heart-outline" size={80} color="#e1e5e9" />
        </View>
        <Text style={styles.emptyTitle}>
          {searchText ? "No matching products" : "No liked products yet"}
        </Text>
        <Text style={styles.emptySubtitle}>
          {searchText
            ? "Try adjusting your search terms"
            : "Start exploring and add products to your favorites"}
        </Text>
        {!searchText && (
          <TouchableOpacity style={styles.exploreButton}>
            <LinearGradient
              colors={[primary, "#667eea"]}
              style={styles.exploreButtonGradient}
            >
              <Ionicons name="compass" size={20} color="white" />
              <Text style={styles.exploreButtonText}>Explore Products</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </Animated.View>
  );

  /* ---------- Loading State Component ---------- */
  const LoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={primary} />
      <Text style={styles.loadingText}>Loading your favorites...</Text>
    </View>
  );

  /* ---------- Stats Header Component ---------- */
  const StatsHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{pantryItems.length}</Text>
        <Text style={styles.statLabel}>Total Items</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{visibleItems.length}</Text>
        <Text style={styles.statLabel}>{searchText ? "Found" : "Showing"}</Text>
      </View>
    </View>
  );

  /* ---------- JSX ---------- */
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" translucent={true} backgroundColor="white" />

      {/* Header */}
      <HeaderCommon
        title="My Wish List"
        subtitle={`${pantryItems.length} items in your collection`}
        isSearchEnabled={true}
        enableDropdown={false}
        handleSearchInput={handleSearchInput}
      />

      {pantrySlice.isLoading ? (
        <LoadingState />
      ) : (
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* {pantryItems.length > 0 && <StatsHeader />} */}

          {visibleItems.length > 0 ? (
            <FlatList
              data={visibleItems}
              keyExtractor={(it: any) => it.product._id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[primary]}
                  tintColor={primary}
                />
              }
              renderItem={({ item, index }) => (
                // <Animated.View
                //   style={[
                //     styles.cardContainer,
                //     {
                //       opacity: fadeAnim,
                //       transform: [
                //         {
                //           translateY: slideAnim.interpolate({
                //             inputRange: [0, 50],
                //             outputRange: [0, 50 + index * 10],
                //           }),
                //         },
                //       ],
                //     },
                //   ]}
                // >
                <ProductItemCard item={item.product} inPantry={true} />
                // </Animated.View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <EmptyState />
          )}
        </Animated.View>
      )}

      {/* Floating Action Button */}
      {/* {pantryItems.length > 0 && (
        <TouchableOpacity style={styles.fab}>
          <LinearGradient
            colors={[primary, "#667eea"]}
            style={styles.fabGradient}
          >
            <Ionicons name="filter" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      )} */}
    </SafeAreaView>
  );
};

/* ------------- Enhanced Styles ------------- */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fafbfc",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafbfc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e1e5e9",
    marginHorizontal: 20,
  },
  list: {
    padding: 16,
    paddingBottom: 10,
  },
  cardContainer: {
    flex: 1,
    margin: 4,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  emptyGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f8f9ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderStyle: "dashed",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  exploreButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  exploreButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LikedScreen;

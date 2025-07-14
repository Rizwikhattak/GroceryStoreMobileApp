import Logo from "@/assets/images/premium-meats-logo.svg";
import HeaderCommon from "@/components/ui/HeaderCommon";
import ProductItemCard from "@/components/ui/ProductItemCard";
import SearchInput from "@/components/ui/SearchInput";
import { ProductsSkeleton } from "@/components/ui/Skeletons";
import { primary } from "@/constants/Colors";
import { getAllCategories } from "@/store/actions/categoriesActions";
import { getProducts } from "@/store/actions/productsActions";
import { setSelectedCategory } from "@/store/reducers/categoriesSlice";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const { width } = Dimensions.get("window");

interface SearchPageProps {
  onSearch?: (query: string) => void;
  onFilterPress?: () => void;
  onExploreMenuPress?: () => void;
  popularSearches?: string[];
  recentSearches?: string[];
  isLoading?: boolean;
}
// Fallback category icons mapping
const categoryIcons: { [key: string]: string } = {
  // core categories you asked about
  food: "🍽️", // plate & cutlery
  groceries: "🛒", // shopping cart :contentReference[oaicite:0]{index=0}
  packaging: "📦", // cardboard package / parcel :contentReference[oaicite:1]{index=1}
  cleaning: "🧹", // broom for sweeping & tidying :contentReference[oaicite:2]{index=2}
  produce: "🥦", // fresh broccoli as a universal veg icon :contentReference[oaicite:3]{index=3}
  "meat & poultry": "🥩",
  // existing mappings that already make sense
  home: "🏠",
  travel: "✈️",
  health: "🏥",
  automotive: "🚗",

  // catch-all for anything uncategorised
  default: "📦",
};
const SearchPage: React.FC<SearchPageProps> = ({
  onSearch,
  onFilterPress,
  onExploreMenuPress,
  popularSearches = [
    "Boneless lamb leg",
    "Whole chicken",
    "Chicken Legs",
    "Chicken Liver",
  ],
  recentSearches = [],
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();
  const products = useSelector((state: any) => state.products);
  const pantry = useSelector((state: any) => state.pantry);
  const categories = useSelector((state: any) => state.categories);
  const dispatch = useDispatch();

  // Determine what to show based on search state
  const showInitialSections =
    !isSearching && !hasSearched && searchQuery.length === 0;
  const showProducts = hasSearched && products.data && products.data.length > 0;
  const showNoResults =
    hasSearched &&
    !products.isLoading &&
    (!products.data || products.data.length === 0);
  const fetchCategories = async () => {
    try {
      await dispatch(getAllCategories()).unwrap();
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    return categoryIcons[name] || categoryIcons.default;
  };
  const handleSearchInput = async (query: string) => {
    setSearchQuery(query);

    if (query.length > 0) {
      setIsSearching(true);
      setHasSearched(true);

      try {
        const filtersPayload = {
          search: query.toLowerCase(),
          limit: 20,
        };

        await dispatch(getProducts(filtersPayload)).unwrap();
        onSearch?.(query);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      // Reset when search is cleared
      setIsSearching(false);
      setHasSearched(false);
    }
  };

  const handlePopularSearchPress = (search: string) => {
    setSearchQuery(search);
    handleSearchInput(search);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setHasSearched(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Reset search state on refresh
    setSearchQuery("");
    setIsSearching(false);
    setHasSearched(false);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  // Render the main content based on state
  const renderMainContent = () => {
    // Show loading when searching
    if (isSearching || products.isLoading) {
      return <ProductsSkeleton />;
    }

    // Show products if we have search results
    if (showProducts) {
      return (
        <FlatList
          data={products.data}
          renderItem={({ item }) => <ProductItemCard item={item} />}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.productRow}
          scrollEnabled={false}
        />
      );
    }

    // Show no results message
    if (showNoResults) {
      return (
        <View style={styles.emptyStateContainer}>
          <Logo width={300} height={80} />

          <Text style={styles.emptyStateTitle}>No Products Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            No products found for "{searchQuery}". Try searching with different
            keywords.
          </Text>
          <TouchableOpacity
            style={[styles.exploreButton, { backgroundColor: primary }]}
            onPress={clearSearch}
          >
            <Text style={styles.exploreButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <HeaderCommon title="Search" />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchInput
            enableDropdown={false}
            handleSearchInput={handleSearchInput}
            searchValue={searchQuery}
            onClear={clearSearch}
          />
        </View>

        {/* Show initial sections only when not searching */}
        {showInitialSections && (
          <>
            {/* Recent Searches */}
            {/* <View style={styles.section}>
              {recentSearches.length > 0 ? (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity>
                      <Text style={[styles.clearAllText, { color: primary }]}>
                        Clear All
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.recentSearches}>
                    {recentSearches.map((search, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.recentSearchItem}
                        onPress={() => handlePopularSearchPress(search)}
                      >
                        <Icon name="history" size={16} color="#666" />
                        <Text style={styles.recentSearchText}>{search}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              ) : (
                <View style={styles.emptyRecentContainer}>
                  <Text style={styles.emptyRecentText}>
                    No recent searches
                  </Text>
                </View>
              )}
            </View> */}

            {/* Popular Searches */}
            <View>
              <Text style={styles.sectionTitle}>Popular Searches</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.popularSearchesContainer}
              >
                {popularSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.popularSearchChip}
                    onPress={() => handlePopularSearchPress(search)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.popularSearchText}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Browse Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse Categories</Text>
              <View style={styles.categoriesGrid}>
                {categories.data.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.categoryCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      dispatch(setSelectedCategory(category));

                      router.push(`/Category/${category?.name}`);
                    }}
                  >
                    <Text style={styles.iconEmoji}>
                      {getCategoryIcon(category?.name)}
                    </Text>
                    <Text style={styles.categoryText}>{category?.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Main Content Area */}
        {renderMainContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollView: {
    flex: 1,
  },
  iconEmoji: {
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  filterButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    padding: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "400",
  },
  clearButton: {
    padding: 4,
  },
  section: {
    marginBottom: 32,
  },
  productsGrid: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 20,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  emptyRecentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyRecentText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  recentSearches: {
    paddingHorizontal: 20,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  recentSearchText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  popularSearchesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 3,
  },
  popularSearchChip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  popularSearchText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  exploreMenuCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreMenuContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exploreMenuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  exploreMenuSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  exploreMenuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  categoryCard: {
    width: (width - 60) / 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  illustrationPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontWeight: "500",
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SearchPage;

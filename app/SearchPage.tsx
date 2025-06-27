import { primary } from "@/constants/colors";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
  RefreshControl,
  Dimensions,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import logoImage from "../assets/images/premium-meats-logo.png";
const { width } = Dimensions.get("window");

interface SearchPageProps {
  onSearch?: (query: string) => void;
  onFilterPress?: () => void;
  onExploreMenuPress?: () => void;
  popularSearches?: string[];
  recentSearches?: string[];
  isLoading?: boolean;
}

const SearchPage: React.FC<SearchPageProps> = ({
  onSearch,
  onFilterPress,
  onExploreMenuPress,
  popularSearches = [
    "Chicken Mushroom",
    "Chicken Piece",
    "Cheese Burger",
    "Pizza Special",
  ],
  recentSearches = [],
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setShowRecentSearches(false);
      onSearch?.(query);
    } else {
      setShowRecentSearches(true);
    }
  };

  const handlePopularSearchPress = (search: string) => {
    setSearchQuery(search);
    onSearch?.(search);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowRecentSearches(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search</Text>
          <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
            <Icon name="tune" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        {/* Search Bar */}
        <Animated.View
          style={[
            styles.searchContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.searchInputContainer}>
            <Icon
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your favorite items"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setShowRecentSearches(true)}
              returnKeyType="search"
              onSubmitEditing={() => onSearch?.(searchQuery)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                style={styles.clearButton}
              >
                <Icon name="close" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
        {/* Recent Searches */}
        // Replace the Recent Searches section with this:
        {showRecentSearches && (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
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
                <Text style={styles.emptyRecentText}>No recent searches</Text>
              </View>
            )}
          </Animated.View>
        )}
        {/* Popular Searches */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
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
        </Animated.View>
        {/* Explore Menu */}
        {/* <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.exploreMenuCard}
            onPress={onExploreMenuPress}
            activeOpacity={0.8}
          >
            <View style={styles.exploreMenuContent}>
              <View>
                <Text style={styles.exploreMenuTitle}>Explore Menu</Text>
                <Text style={styles.exploreMenuSubtitle}>
                  Discover our full range of delicious items
                </Text>
              </View>
              <View style={styles.exploreMenuIconContainer}>
                <Icon name="arrow-forward" size={24} color={primary} />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View> */}
        {/* Categories */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <View style={styles.categoriesGrid}>
            {[
              "🍔 Burgers",
              "🍕 Pizza",
              "🍗 Chicken",
              "🥤 Beverages",
              "🍰 Desserts",
              "🥗 Salads",
            ].map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
        {/* Empty State */}
        <Animated.View
          style={[
            styles.emptyStateContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo instead of “Your Custom Illustration Here” */}
          <Image
            source={logoImage} // ⬅️ dummy URL
            style={{ width: 200, height: 100 }}
            resizeMode="contain"
          />

          <Text style={styles.emptyStateTitle}>No Products Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            Try searching with different keywords or explore our menu
          </Text>
        </Animated.View>
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
    paddingHorizontal: 20,
    marginBottom: 24,
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
    fontSize: 16,
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

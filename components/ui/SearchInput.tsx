"use client";

import { primary } from "@/constants/Colors";
import { getProducts } from "@/store/actions/productsActions";
import { useRouter } from "expo-router";
import { Search, X } from "lucide-react-native";
import type React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface SearchInputProps {
  onProductSelect?: (product: any) => void;
  searchFilters?: any;
  enableDropdown?: boolean;
  handleSearchInput?: (text: string) => void;
  searchValue?: string;
  onClear?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onProductSelect,
  searchFilters = {},
  enableDropdown = true,
  handleSearchInput,
  searchValue = "",
  onClear,
}) => {
  const [searchText, setSearchText] = useState(searchValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();

  // Sync with external searchValue
  useEffect(() => {
    setSearchText(searchValue);
  }, [searchValue]);

  const handleSearchChange = async (text: string) => {
    try {
      setSearchText(text);

      // Call parent handler immediately for UI updates
      if (handleSearchInput) {
        handleSearchInput(text);
      }

      // Handle dropdown logic for SearchInput's own dropdown
      if (enableDropdown) {
        setIsLoading(true);
        setShowDropdown(true);

        if (text.length > 0) {
          const filtersPayload = {
            search: text.toLowerCase(),
            limit: 20,
            ...searchFilters,
          };

          const filtered = await dispatch(getProducts(filtersPayload)).unwrap();
          setFilteredProducts(filtered.list || []);
        } else {
          setShowDropdown(false);
          setFilteredProducts([]);
        }
      }
    } catch (err) {
      console.error("Search error:", err);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: any) => {
    router.push({
      pathname: "/ProductDetailsPage",
      params: {
        productParam: JSON.stringify(product),
      },
    });
    setSearchText("");
    setShowDropdown(false);
    onProductSelect?.(product);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setShowDropdown(false);
    setFilteredProducts([]);

    if (onClear) {
      onClear();
    }

    if (handleSearchInput) {
      handleSearchInput("");
    }
  };

  const renderProductItem = (item: any) => {
    const unit = item?.uom?.slug || "kg";
    return (
      <TouchableOpacity
        key={item._id}
        style={styles.dropdownItem}
        onPress={() => handleProductSelect(item)}
      >
        <Image
          source={{ uri: `${apiUrl}products/photo/${item.photo}` }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>
            $ {item.sale_price}/{unit}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search color="#888" size={18} />
        <TextInput
          placeholder="Search Anything..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearchChange}
          style={styles.input}
          onFocus={() => {
            if (searchText.length > 0 && enableDropdown) {
              setShowDropdown(true);
            }
          }}
          onBlur={() => {
            // Delay hiding dropdown to allow for item selection
            setTimeout(() => setShowDropdown(false), 150);
          }}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}
          >
            <X color="#888" size={18} />
          </TouchableOpacity>
        )}
      </View>

      {/* Inline Dropdown - Only show when enableDropdown is true */}
      {showDropdown && enableDropdown && (
        <View style={styles.dropdownContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={primary} />
            </View>
          ) : filteredProducts.length > 0 ? (
            <ScrollView
              style={styles.dropdown}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              showsVerticalScrollIndicator
            >
              {filteredProducts.map(renderProductItem)}
            </ScrollView>
          ) : searchText.length > 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No products found</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1000,
  },
  searchContainer: {
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 20,
    paddingVertical: 3,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  clearButton: {
    padding: 4,
  },
  dropdownContainer: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 250,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  dropdown: {
    maxHeight: 250,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
  },
  noResultsContainer: {
    padding: 20,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#888",
  },
});

export default SearchInput;

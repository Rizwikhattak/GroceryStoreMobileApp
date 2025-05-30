"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Search } from "lucide-react-native";
import { getProducts } from "@/store/actions/productsActions";
import { useDispatch } from "react-redux";
import { primary } from "@/constants/colors";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };
// Sample grocery products data

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface SearchInputProps {
  onProductSelect?: (product: Product) => void;
}

const SearchInputAlternative: React.FC<SearchInputProps> = ({
  onProductSelect,
}) => {
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSearchChange = async (text: string) => {
    try {
      setSearchText(text);
      setIsLoading(true);
      setShowDropdown(true);
      if (text.length > 0) {
        // const filtered = groceryProducts.filter((product) =>
        //   product.name.toLowerCase().includes(text.toLowerCase())
        // );
        // setFilteredProducts(filtered);
        const filtered = await dispatch(
          getProducts({ search: text.toLowerCase(), limit: 20 })
        ).unwrap();
        console.log(filtered);
        setFilteredProducts(filtered.list);
      } else {
        setShowDropdown(false);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error(err);
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

  const renderProductItem = (item: any) => {
    const unit = item?.uom?.slug || "kg";
    return (
      <TouchableOpacity
        key={item.id}
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
            if (searchText.length > 0) {
              setShowDropdown(true);
            }
          }}
          onBlur={() => {
            // Delay hiding dropdown to allow for item selection
            setTimeout(() => setShowDropdown(false), 150);
          }}
        />
      </View>

      {/* Inline Dropdown - Fixed rendering */}
      {showDropdown && (
        <View style={styles.dropdownContainer /* now overflow hidden */}>
          {isLoading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="large" color={primary} />
            </View>
          ) : (
            <ScrollView
              style={styles.dropdown}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled // lets the inner view keep the gesture on Android
              showsVerticalScrollIndicator
            >
              {filteredProducts.map(renderProductItem)}
            </ScrollView>
          )}
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
    gap: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  dropdownContainer: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 250, // 🔒 gives the ScrollView a bounded height
    overflow: "hidden", // 🔒 avoids touch “holes”
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
  weightText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
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

export default SearchInputAlternative;

// "use client";

// import type React from "react";
// import { useCallback, useEffect, useRef, useState } from "react";
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Text,
//   Image,
// } from "react-native";
// import { FlatList } from "react-native-gesture-handler"; // ⬅️ virtualised list
// import { Search } from "lucide-react-native";

// // ─── sample data ───────────────────────────────────────────────
// const groceryProducts = [
//   {
//     id: 1,
//     name: "Cherries",
//     price: "$3/kg",
//     image:
//       "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=100&h=100&fit=crop",
//   },
//   {
//     id: 2,
//     name: "Cucumber",
//     price: "$12/kg",
//     image:
//       "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=100&h=100&fit=crop",
//   },
//   {
//     id: 3,
//     name: "Leeche",
//     price: "$6/kg",
//     image:
//       "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=100&h=100&fit=crop",
//   },
//   {
//     id: 4,
//     name: "Tomato",
//     price: "$9/kg",
//     image:
//       "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=100&h=100&fit=crop",
//   },
//   {
//     id: 5,
//     name: "Chicken Breast",
//     price: "$15/kg",
//     image:
//       "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=100&h=100&fit=crop",
//   },
//   {
//     id: 6,
//     name: "Beef Steak",
//     price: "$25/kg",
//     image:
//       "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100&h=100&fit=crop",
//   },
//   {
//     id: 7,
//     name: "Fresh Salmon",
//     price: "$20/kg",
//     image:
//       "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=100&h=100&fit=crop",
//   },
//   {
//     id: 8,
//     name: "Spinach",
//     price: "$4/kg",
//     image:
//       "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop",
//   },
// ] as const;

// interface Product {
//   id: number;
//   name: string;
//   price: string;
//   image: string;
// }
// interface SearchInputProps {
//   onProductSelect?: (product: Product) => void;
// }

// // ─── component ────────────────────────────────────────────────
// const SearchInputAlternative: React.FC<SearchInputProps> = ({
//   onProductSelect,
// }) => {
//   const [searchText, setSearchText] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

//   // simple debounce: wait 150 ms after last key-press
//   const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const handleSearchChange = (text: string) => {
//     setSearchText(text);

//     if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     debounceTimer.current = setTimeout(() => {
//       if (text.trim().length) {
//         const filtered = groceryProducts.filter((p) =>
//           p.name.toLowerCase().includes(text.toLowerCase())
//         );
//         setFilteredProducts(filtered);
//         setShowDropdown(true);
//       } else {
//         setFilteredProducts([]);
//         setShowDropdown(false);
//       }
//     }, 150);
//   };

//   const handleProductSelect = useCallback(
//     (product: Product) => {
//       setSearchText(product.name);
//       setShowDropdown(false);
//       onProductSelect?.(product);
//     },
//     [onProductSelect]
//   );

//   const renderItem = ({ item }: { item: Product }) => (
//     <TouchableOpacity
//       style={styles.dropdownItem}
//       onPress={() => handleProductSelect(item)}
//     >
//       <Image source={{ uri: item.image }} style={styles.productImage} />
//       <View style={styles.productInfo}>
//         <Text style={styles.productName}>{item.name}</Text>
//         <Text style={styles.productPrice}>{item.price}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* search box */}
//       <View style={styles.searchContainer}>
//         <Search color="#888" size={18} />
//         <TextInput
//           placeholder="Search Anything…"
//           placeholderTextColor="#888"
//           value={searchText}
//           onChangeText={handleSearchChange}
//           style={styles.input}
//           onFocus={() => searchText && setShowDropdown(true)}
//           onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
//         />
//       </View>

//       {/* dropdown */}
//       {showDropdown && (
//         <View style={styles.dropdownContainer}>
//           {filteredProducts.length ? (
//             <FlatList
//               data={filteredProducts}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={renderItem}
//               style={styles.dropdown}
//               nestedScrollEnabled
//               keyboardShouldPersistTaps="handled"
//               showsVerticalScrollIndicator
//             />
//           ) : (
//             <View style={styles.noResultsContainer}>
//               <Text style={styles.noResultsText}>No products found</Text>
//             </View>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// // ─── styles ───────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     zIndex: 1000,
//   },
//   searchContainer: {
//     borderRadius: 10,
//     height: 50,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#e5e7eb",
//     paddingHorizontal: 20,
//     paddingVertical: 3,
//     gap: 2,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: "#000",
//   },
//   dropdownContainer: {
//     position: "absolute",
//     top: 55,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     maxHeight: 250,
//     overflow: "hidden",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     zIndex: 1000,
//   },
//   dropdown: {
//     maxHeight: 250,
//   },
//   dropdownItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   productImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   productInfo: { flex: 1 },
//   productName: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#333",
//     marginBottom: 2,
//   },
//   productPrice: { fontSize: 14, color: "#666" },
//   noResultsContainer: { padding: 20, alignItems: "center" },
//   noResultsText: { fontSize: 16, color: "#888" },
// });

// export default SearchInputAlternative;

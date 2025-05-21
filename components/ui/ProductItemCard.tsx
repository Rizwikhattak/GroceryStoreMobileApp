"use client";

import { primary } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateCartQuantity } from "@/store/reducers/cartSlice";

import Constants from "expo-constants";
import {
  getPantryProducts,
  makeProductPantry,
} from "@/store/actions/pantryActions";
const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };

const ProductItemCard = ({ item, inPantry, pantryData }) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart.data);

  const favouriteIds = {};
  pantryData &&
    pantryData.forEach((item: any) => {
      if (item.product) {
        favouriteIds[item.product._id] = true;
      }
    });
  const [favorites, setFavorites] = useState(favouriteIds || {});
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  // Get quantity from cart state
  const quantity =
    cartState.find((cartItem) => cartItem._id === item._id)?.orderQuantity || 0;
  const isFavorite = favorites[item._id] || false;

  // Get unit from product data or use default
  const unit = item?.uom?.slug || "kg";

  // Only update input value when quantity changes and we're not editing
  useEffect(() => {
    if (!isEditing) {
      setInputValue(quantity.toString());
    }
  }, [quantity, isEditing]);

  // Set up keyboard dismiss listener

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (isEditing) {
          handleQuantitySubmit();
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [isEditing, inputValue]);

  // Toggle favorite
  const toggleFavorite = async (id) => {
    try {
      setFavorites((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      const resp = await dispatch(makeProductPantry({ product: id })).unwrap();
      await dispatch(getPantryProducts()).unwrap();
    } catch (err) {
      console.log("Error toggling favorite", err);
    }
  };
  const hasSubmitted = useRef(false);
  // Handle direct quantity input
  const handleQuantityInputFocus = () => {
    if (hasSubmitted.current) return; // ignore duplicates
    hasSubmitted.current = true;
    setIsEditing(true);

    // Select all text for easy replacement
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 50);
    }
  };

  const handleQuantityChange = (text) => {
    // Only allow numeric input
    if (/^\d*$/.test(text)) {
      setInputValue(text);
    }
  };

  const handleQuantitySubmit = () => {
    // Exit if not editing
    if (!isEditing) return;

    // Parse the input value as an integer
    let newQuantity = parseInt(inputValue, 10);

    // Handle empty or non-numeric input
    if (isNaN(newQuantity)) {
      newQuantity = 0;
    }

    // Ensure minimum value is 0
    newQuantity = Math.max(0, newQuantity);

    // Update cart with the absolute new quantity, not relative change
    if (newQuantity !== quantity) {
      // Calculate the change needed to reach the new quantity
      const change = newQuantity - quantity;

      dispatch(
        updateCartQuantity({ id: item._id, item: item, change: change })
      );
    }

    // Reset editing state
    setIsEditing(false);
    setTimeout(() => (hasSubmitted.current = false), 200);
    // Keyboard.dismiss();
  };

  return (
    <View style={styles.card}>
      {/* Favorite Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item._id)}
      >
        <Ionicons
          name={inPantry ? "heart" : isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={inPantry ? primary : isFavorite ? primary : "#BDBDBD"}
        />
      </TouchableOpacity>

      {/* Discount Label */}
      {item.promotion_status === "active" && (
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>{item.promotion_value}% OFF</Text>
        </View>
      )}

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              `${apiUrl}products/photo/${item.photo}` ||
              "https://via.placeholder.com/150",
          }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.priceUnitContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${item.sale_price}</Text>
            <Text style={styles.unitText}>/{unit}</Text>
          </View>

          {item.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Ionicons name="star" size={12} color="#FFD700" />
            </View>
          )}
        </View>

        {/* Weight/Size if available */}
        {item.weight && (
          <Text style={styles.weightText}>
            {item.weight} {unit}
          </Text>
        )}

        {/* Action Buttons */}
        {quantity > 0 ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, styles.decrementButton]}
              onPress={() =>
                dispatch(
                  updateCartQuantity({ id: item._id, item: item, change: -1 })
                )
              }
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            {isEditing ? (
              <TextInput
                ref={inputRef}
                style={styles.quantityInput}
                value={inputValue}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
                selectTextOnFocus
                autoFocus
                onEndEditing={handleQuantitySubmit} // <-- only event that commits
                blurOnSubmit
                maxLength={3}
              />
            ) : (
              <TouchableOpacity
                style={styles.quantityDisplay}
                onPress={handleQuantityInputFocus}
                activeOpacity={0.7}
              >
                <View style={styles.quantityUnitContainer}>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <Text style={styles.quantityUnitText}>{unit}</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.quantityButton, styles.incrementButton]}
              onPress={() =>
                dispatch(
                  updateCartQuantity({ id: item._id, item: item, change: 1 })
                )
              }
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() =>
              dispatch(
                updateCartQuantity({ id: item._id, item: item, change: 1 })
              )
            }
          >
            <Text style={styles.addToCartText}>Add to cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 10,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 7,
    position: "relative",
    overflow: "visible", // Prevents shadow clipping
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  discountTag: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: primary,
    paddingHorizontal: 8,
    borderTopStartRadius: 10,
    paddingVertical: 4,
    borderBottomRightRadius: 8,
    zIndex: 5,
  },
  discountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    height: 120, // Fixed height for uniformity
    overflow: "hidden",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  detailsContainer: {
    padding: 12,
  },
  productName: {
    color: "#333",
    fontWeight: "500",
    marginBottom: 6,
    fontSize: 14,
  },
  priceUnitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  unitText: {
    color: "#666",
    fontSize: 12,
    marginLeft: 1,
  },
  weightText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    marginRight: 2,
    color: "#888",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 36,
  },
  quantityButton: {
    width: 35,
    height: 35,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  decrementButton: {
    backgroundColor: primary,
  },
  incrementButton: {
    backgroundColor: primary,
  },
  quantityButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  quantityDisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  quantityUnitContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  quantityText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
  quantityUnitText: {
    color: "#666",
    fontSize: 10,
    marginLeft: 2,
  },
  quantityInput: {
    flex: 1,
    color: "#333",
    fontWeight: "500",
    minWidth: 30,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: primary,
    paddingVertical: 0,
    marginHorizontal: 5,
    height: 30,
  },
  addToCartButton: {
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
    color: primary,
    fontWeight: "500",
    fontSize: 13,
  },
});

export default ProductItemCard;

/* ProductItemCard.tsx
   — keeps heart state in sync with the Redux pantry slice —
*/
// "use client";

// import { useRef, useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Keyboard,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useDispatch, useSelector } from "react-redux";
// import Constants from "expo-constants";

// import { primary } from "@/constants/colors";
// import { updateCartQuantity } from "@/store/reducers/cartSlice";
// import {
//   makeProductPantry,
//   getPantryProducts, // <-- still used when we’re on the pantry screen
// } from "@/store/actions/pantryActions";

// const { apiUrl } = Constants.expoConfig?.extra ?? { apiUrl: "" };

// /* -------------------------------------------------------------------------- */
// /*                                    Card                                    */
// /* -------------------------------------------------------------------------- */
// const ProductItemCard = ({
//   item,
//   inPantry = false, // screen can pass “true” if this card lives in Pantry view
// }) => {
//   const dispatch = useDispatch();

//   /* ──────────────── selectors ──────────────── */
//   const cartItems = useSelector((s: any) => s.cart.data);

//   // Build a Set with *all* favourited product ids → O(1) lookup
//   const pantryIds: Set<string> = useSelector(
//     (s: any) =>
//       new Set(
//         (s.pantry.data ?? [])
//           .filter((p: any) => p.product)
//           .map((p: any) => p.product._id)
//       )
//   );

//   /* ─────────────── derived props ───────────── */
//   const quantity =
//     cartItems.find((ci: any) => ci._id === item._id)?.orderQuantity ?? 0;

//   const isFavourite = pantryIds.has(item._id);
//   const unit = item?.uom?.slug ?? "kg";

//   /* ─────────────── local state (for qty edit) ───────────── */
//   const [inputValue, setInputValue] = useState(quantity.toString());
//   const [isEditing, setIsEditing] = useState(false);
//   const inputRef = useRef<TextInput | null>(null);
//   const hasSubmitted = useRef(false);

//   /* keep input text in sync when quantity changes from elsewhere */
//   useEffect(() => {
//     if (!isEditing) setInputValue(quantity.toString());
//   }, [quantity, isEditing]);

//   /* auto-commit when keyboard is dismissed */
//   useEffect(() => {
//     const hide = Keyboard.addListener("keyboardDidHide", () => {
//       if (isEditing) handleQuantitySubmit();
//     });
//     return () => hide.remove();
//   }, [isEditing, inputValue]);

//   /* ─────────────── helpers ───────────── */
//   const changeQty = (delta: number) =>
//     dispatch(updateCartQuantity({ id: item._id, item, change: delta }));

//   const handleQuantitySubmit = () => {
//     if (!isEditing) return;

//     let newQty = parseInt(inputValue, 10);
//     if (Number.isNaN(newQty)) newQty = 0;
//     newQty = Math.max(0, newQty);

//     if (newQty !== quantity) changeQty(newQty - quantity);

//     setIsEditing(false);
//     setTimeout(() => (hasSubmitted.current = false), 150);
//   };

//   const beginEdit = () => {
//     if (hasSubmitted.current) return;
//     hasSubmitted.current = true;
//     setIsEditing(true);
//     setTimeout(() => inputRef.current?.focus(), 50);
//   };

//   const toggleFavourite = async () => {
//     try {
//       await dispatch(makeProductPantry({ product: item._id })).unwrap();
//       if (inPantry) dispatch(getPantryProducts()); // keep pantry screen fresh
//     } catch (err) {
//       console.warn("Favourite toggle failed", err);
//     }
//   };

//   /* ─────────────── render ───────────── */
//   return (
//     <View style={styles.card}>
//       {/* heart */}
//       <TouchableOpacity style={styles.heart} onPress={toggleFavourite}>
//         <Ionicons
//           name={isFavourite ? "heart" : "heart-outline"}
//           size={20}
//           color={isFavourite ? primary : "#BDBDBD"}
//         />
//       </TouchableOpacity>

//       {/* discount */}
//       {item.promotion_status === "active" && (
//         <View style={styles.discount}>
//           <Text style={styles.discountTxt}>
//             {item.promotion_type === "percentage"
//               ? `${item.promotion_value}% OFF`
//               : `-$${item.promotion_value}`}
//           </Text>
//         </View>
//       )}

//       {/* image */}
//       <View style={styles.imgWrap}>
//         <Image
//           source={{
//             uri:
//               item.photo && apiUrl
//                 ? `${apiUrl}products/photo/${item.photo}`
//                 : "https://via.placeholder.com/150",
//           }}
//           style={styles.img}
//         />
//       </View>

//       {/* details */}
//       <View style={styles.body}>
//         <Text style={styles.name} numberOfLines={1}>
//           {item.name}
//         </Text>

//         <View style={styles.row}>
//           <Text style={styles.price}>${item.sale_price}</Text>
//           <Text style={styles.unit}>/{unit}</Text>
//         </View>

//         {/* cart controls */}
//         {quantity > 0 ? (
//           <View style={styles.qtyBox}>
//             <TouchableOpacity
//               style={styles.qtyBtn}
//               onPress={() => changeQty(-1)}
//             >
//               <Text style={styles.qtyBtnTxt}>-</Text>
//             </TouchableOpacity>

//             {isEditing ? (
//               <TextInput
//                 ref={inputRef}
//                 style={styles.qtyInput}
//                 value={inputValue}
//                 onChangeText={(t) => /^\d*$/.test(t) && setInputValue(t)}
//                 keyboardType="numeric"
//                 blurOnSubmit
//                 onEndEditing={handleQuantitySubmit}
//                 maxLength={3}
//               />
//             ) : (
//               <TouchableOpacity
//                 style={styles.qtyDisplay}
//                 onPress={beginEdit}
//                 activeOpacity={0.7}
//               >
//                 <Text style={styles.qtyTxt}>{quantity}</Text>
//                 <Text style={styles.qtyUnit}>{unit}</Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               style={styles.qtyBtn}
//               onPress={() => changeQty(1)}
//             >
//               <Text style={styles.qtyBtnTxt}>+</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <TouchableOpacity style={styles.addBtn} onPress={() => changeQty(1)}>
//             <Text style={styles.addTxt}>Add to cart</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// export default ProductItemCard;

// /* -------------------------------------------------------------------------- */
// /*                                  styles                                    */
// /* -------------------------------------------------------------------------- */
// const styles = StyleSheet.create({
//   card: {
//     width: "47%",
//     marginHorizontal: 4,
//     marginTop: 10,
//     marginBottom: 16,
//     borderRadius: 12,
//     backgroundColor: "#fff",
//     elevation: 7,
//     overflow: "visible",
//   },

//   heart: { position: "absolute", top: 8, right: 8, zIndex: 5 },

//   discount: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     backgroundColor: primary,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderTopLeftRadius: 10,
//     borderBottomRightRadius: 8,
//     zIndex: 5,
//   },
//   discountTxt: { color: "#fff", fontSize: 10, fontWeight: "bold" },

//   imgWrap: {
//     height: 120,
//     overflow: "hidden",
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   img: { width: "100%", height: "100%" },

//   body: { padding: 12 },
//   name: { fontSize: 14, fontWeight: "500", marginBottom: 6, color: "#333" },

//   row: { flexDirection: "row", alignItems: "baseline", marginBottom: 8 },
//   price: { fontSize: 16, fontWeight: "bold", color: "#333" },
//   unit: { fontSize: 12, color: "#666", marginLeft: 1 },

//   /* quantity area */
//   qtyBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     height: 36,
//   },
//   qtyBtn: {
//     width: 35,
//     height: 35,
//     borderRadius: 12,
//     backgroundColor: primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   qtyBtnTxt: { color: "#fff", fontSize: 16, fontWeight: "bold" },

//   qtyDisplay: { flex: 1, alignItems: "center", justifyContent: "center" },
//   qtyTxt: { fontSize: 14, fontWeight: "500", color: "#333" },
//   qtyUnit: { fontSize: 10, color: "#666", marginLeft: 2 },

//   qtyInput: {
//     flex: 1,
//     height: 30,
//     textAlign: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: primary,
//     color: "#333",
//     fontWeight: "500",
//   },

//   /* add-to-cart */
//   addBtn: {
//     height: 36,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   addTxt: { color: primary, fontSize: 13, fontWeight: "500" },
// });

"use client";
import { primary } from "@/constants/Colors";
import {
  finalizeCartItem,
  updateCartQuantity,
} from "@/store/reducers/cartSlice";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { TOAST_MESSAGES } from "@/constants/constants";
import {
  getPantryProducts,
  makeProductPantry,
} from "@/store/actions/pantryActions";
import { ToastHelper } from "@/utils/ToastHelper";
import { useRouter } from "expo-router";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const { width: screenWidth } = Dimensions.get("window");

const ProductItemCard = ({ item, inPantry, favouriteIds }) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart.data);
  const router = useRouter();
  const [favorites, setFavorites] = useState(favouriteIds || {});
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showQuantityControls, setShowQuantityControls] = useState(false);
  const [isPantry, setIsPantry] = useState(item?.isPantry || false);
  const inputRef = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cardScaleAnim = useRef(new Animated.Value(1)).current;

  // New animation values for card press effect
  const cardPressScale = useRef(new Animated.Value(1)).current;
  const cardPressOpacity = useRef(new Animated.Value(1)).current;
  const cardGlow = useRef(new Animated.Value(0)).current;

  // 1. Update the quantity calculation to get the cart item object instead of just quantity
  const cartItem = cartState.find(
    (cartItem) => cartItem._id === item._id && !cartItem.isFinalized
  );
  const quantity = cartItem?.orderQuantity || 0;
  const isFinalized = cartState.some(
    (cartItem) => cartItem._id === item._id && cartItem.isFinalized
  );

  // Get unit from product data or use default
  const unit = item?.uom?.slug || "kg";

  // Calculate discounted price if there's a promotion
  const hasPromotion =
    item.promotion_status === "active" && item.promotion_value > 0;
  const discountedPrice = hasPromotion
    ? item.promotion_type === "percentage"
      ? item.sale_price - (item.sale_price * item.promotion_value) / 100
      : item.sale_price - item.promotion_value
    : item.sale_price;

  // Update input value when quantity changes and we're not editing
  useEffect(() => {
    if (!isEditing) {
      setInputValue(quantity.toString());
    }
  }, [quantity, isEditing]);
  // 2. Update the showQuantityControls logic to only show for non-finalized items
  useEffect(() => {
    const shouldShow = quantity > 0;
    console.log("WOwwwwww", shouldShow, quantity, isFinalized);
    if (shouldShow !== showQuantityControls) {
      setShowQuantityControls(shouldShow);
    }
  }, [quantity, isFinalized]);

  // Animation effect when quantity controls visibility changes
  useEffect(() => {
    if (showQuantityControls) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showQuantityControls]);

  // Keyboard dismiss listener
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

  const hasSubmitted = useRef(false);

  // Enhanced card press handlers
  const handleCardPressIn = () => {
    // Light haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.parallel([
      Animated.spring(cardPressScale, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 200,
        friction: 8,
      }),
      Animated.timing(cardPressOpacity, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardGlow, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleCardPressOut = () => {
    Animated.parallel([
      Animated.spring(cardPressScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 8,
      }),
      Animated.timing(cardPressOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardGlow, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleCardPress = () => {
    // Medium haptic feedback for navigation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    router.push({
      pathname: "/ProductDetailsPage",
      params: {
        productParam: JSON.stringify({ ...item, inPantry }),
      },
    });
  };

  // Toggle favorite WITHOUT animation
  const toggleFavorite = async () => {
    try {
      setIsPantry((prev) => {
        if (inPantry) {
          ToastHelper.showWarning({
            title: TOAST_MESSAGES.REMOVED_FROM_WISH_LIST.title,
          });
        } else if (!prev)
          ToastHelper.showSuccess({
            title: TOAST_MESSAGES.ADDED_TO_WISH_LIST.title,
          });
        else
          ToastHelper.showWarning({
            title: TOAST_MESSAGES.REMOVED_FROM_WISH_LIST.title,
          });
        return !prev;
      });

      await dispatch(makeProductPantry({ product: item._id })).unwrap();
      await dispatch(getPantryProducts()).unwrap();
    } catch (err) {
      console.log("Error toggling favorite", err);
    }
  };

  // Handle direct quantity input
  // 4. Update the handleQuantityInputFocus to prevent editing finalized items
  const handleQuantityInputFocus = () => {
    if (hasSubmitted.current || isFinalized) return;
    hasSubmitted.current = true;
    setIsEditing(true);

    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 50);
    }
  };

  const handleQuantityChange = (text) => {
    if (/^\d*$/.test(text)) {
      setInputValue(text);
    }
  };

  // 3. Update the handleQuantitySubmit function to only work with non-finalized items
  const handleQuantitySubmit = () => {
    if (!isEditing || isFinalized) return;

    let newQuantity = Number.parseInt(inputValue, 10);
    if (isNaN(newQuantity)) {
      newQuantity = 0;
    }
    newQuantity = Math.max(0, newQuantity);

    if (newQuantity !== quantity) {
      const change = newQuantity - quantity;
      dispatch(
        updateCartQuantity({ id: item._id, item: item, change: change })
      );
    }

    setIsEditing(false);
    setTimeout(() => (hasSubmitted.current = false), 200);
  };

  // Handle add to cart with animation
  const handleAddToCart = () => {
    if (quantity === 0) {
      // First time adding - navigate to product details if variations exist
      if (item?.variation_exists) {
        handleCardPress();
      } else {
        // Add 1 to cart directly
        Animated.sequence([
          Animated.timing(cardScaleAnim, {
            toValue: 0.98,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(cardScaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        dispatch(updateCartQuantity({ id: item._id, item: item, change: 1 }));
      }
    } else {
      // Already has quantity - navigate to cart or product details
      handleCardPress();
    }
  };
  const getActiveCartItem = () => {
    if (!item?.variations || item?.variations?.length === 0) {
      // For items without variations, get the active (non-finalized) item
      console.log("1 nigga");
      return cartState?.find(
        (cartItem) => cartItem?._id === item?._id && !cartItem?.isFinalized
      );
    } else {
      console.log("2 nigga");
      // For items with variations, get the active (non-finalized) cartItem with matching variant
      // Note: This assumes you have a way to determine the selected variant in this component
      // You might need to modify this based on how you handle variant selection in ProductItemCard
      return cartState?.find(
        (cartItem) =>
          cartItem?._id === item?._id &&
          cartItem?.selectedVariant?.[0]?._id && // This needs to be properly defined
          !cartItem?.isFinalized
      );
    }
  };
  // Handle adding more quantity when already in cart
  // 5. Update the handleAddMoreToCart to check finalization status
  const handleAddMoreToCart = () => {
    const currentItem = getActiveCartItem();

    if (currentItem) {
      // Finalize the existing unfinalized item
      dispatch(
        finalizeCartItem({
          id: item._id,
          cartItemId: currentItem.cartItemId,
          // Only include selectedSizeId if the item has variations
          ...(item?.variations &&
            item?.variations?.length > 0 && {
              selectedSizeId: currentItem.selectedVariant?.[0]?._id,
            }),
        })
      );
      return ToastHelper.showSuccess({
        title: TOAST_MESSAGES.PRODUCT_ADDED_TO_CART.title,
      });
    }

    // If no current item exists, this shouldn't happen in normal flow
    // but we can add fallback behavior
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to item details for more options
    handleCardPress();
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ scale: cardPressScale }],
          opacity: cardPressOpacity,
        },
      ]}
    >
      {/* Animated glow effect */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: cardGlow,
          },
        ]}
      />

      {/* Enhanced Gradient Overlay for better contrast */}
      <View style={styles.gradientOverlay} />

      {/* Favorite Button */}
      <TouchableOpacity
        style={[
          styles.favoriteButton,
          (inPantry || isPantry) && styles.favoriteButtonActive,
        ]}
        onPress={() => toggleFavorite()}
        activeOpacity={0.8}
      >
        <Ionicons
          name={inPantry ? "heart" : isPantry ? "heart" : "heart-outline"}
          size={18}
          color={isPantry || inPantry ? "#fff" : "#666"}
        />
      </TouchableOpacity>

      <Pressable
        onPressIn={handleCardPressIn}
        onPressOut={handleCardPressOut}
        onPress={handleCardPress}
        style={styles.pressableContent}
      >
        {/* Discount Label */}
        {hasPromotion && (
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>
              {item.promotion_type === "percentage"
                ? `${item.promotion_value}% OFF`
                : `$${item.promotion_value} OFF`}
            </Text>
          </View>
        )}

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `${apiUrl}products/photo/${item.photo}` }}
            style={styles.productImage}
            contentFit="cover"
            transition={100}
          />
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>
                ${discountedPrice?.toFixed(2)}
              </Text>
              <Text style={styles.unitText}>/{unit}</Text>
              {hasPromotion && (
                <Text style={styles.originalPrice}>
                  ${item.sale_price.toFixed(2)}
                </Text>
              )}
            </View>
          </View>

          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}

          {/* Fixed Height Action Container - KEY CHANGE */}
          <View style={styles.actionContainer}>
            {showQuantityControls ? (
              <Animated.View
                style={[
                  styles.quantitySelectedContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                {/* Horizontal Layout for Quantity + Add to Cart */}
                <View style={styles.quantityActionRow}>
                  {/* Compact Quantity Display */}
                  <View style={styles.compactQuantitySection}>
                    {isEditing ? (
                      <TextInput
                        ref={inputRef}
                        style={styles.compactQuantityInput}
                        value={inputValue}
                        onChangeText={handleQuantityChange}
                        keyboardType="numeric"
                        selectTextOnFocus
                        autoFocus
                        onEndEditing={handleQuantitySubmit}
                        blurOnSubmit
                        maxLength={3}
                        returnKeyType="done"
                      />
                    ) : (
                      <TouchableOpacity
                        style={styles.compactQuantityDisplay}
                        onPress={handleQuantityInputFocus}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.compactQuantityText}>
                          {quantity} {unit}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Compact Add to Cart Button */}
                  <TouchableOpacity
                    style={styles.compactAddToCartButton}
                    onPress={handleAddMoreToCart}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="bag-add" size={14} color="#fff" />
                    {/* <Text style={styles.compactAddToCartText}>Add</Text> */}
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ) : (
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleCardPress}
                activeOpacity={0.9}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.addToCartText}>View Product</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: screenWidth < 400 ? "47%" : "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 10,
    marginHorizontal: 4,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Android Shadow
    elevation: 8,
    position: "relative",
    overflow: "hidden",
  },
  glowEffect: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: primary,
    borderRadius: 18,
    zIndex: -1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.9,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android Shadow
    elevation: 3,
  },
  discountTag: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#FF4757",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 12,
    zIndex: 5,
    // iOS Shadow
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android Shadow
    elevation: 4,
  },
  compactAddToCartButton: {
    flex: 2,
    height: 40,
    borderRadius: 12,
    backgroundColor: primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
    // iOS Shadow
    shadowColor: primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Android Shadow
    elevation: 6,
  },
  addToCartButton: {
    height: 40,
    borderRadius: 12,
    backgroundColor: primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // iOS Shadow
    shadowColor: primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Android Shadow
    elevation: 6,
  },
  pressableContent: {
    flex: 1,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 100%)",
    zIndex: 1,
  },

  favoriteButtonActive: {
    backgroundColor: primary,
  },

  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  imageContainer: {
    width: "100%",
    height: 140,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    padding: 14,
    flex: 1,
  },
  productName: {
    color: "#1a1a1a",
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  priceContainer: {
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  currentPrice: {
    color: primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  originalPrice: {
    color: "#999",
    fontSize: 12,
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  unitText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  // FIXED HEIGHT ACTION CONTAINER - KEY CHANGE
  actionContainer: {
    marginTop: "auto",
    height: 40, // Fixed height to prevent card expansion
    justifyContent: "center",
  },
  // New compact horizontal layout styles
  quantitySelectedContainer: {
    height: 40, // Same height as single button
  },
  quantityActionRow: {
    flexDirection: "row",
    height: 40,
    gap: 8,
  },
  compactQuantitySection: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  compactQuantityDisplay: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  compactQuantityText: {
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },
  compactQuantityInput: {
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
    height: "100%",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: primary,
  },

  // compactAddToCartText: {
  //   color: "#fff",
  //   fontWeight: "600",
  //   fontSize: 12,
  //   letterSpacing: 0.5,
  // },
  // Original styles (keeping for initial add to cart)

  addToCartText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

export default ProductItemCard;

"use client";
import { Image } from "expo-image";
import { primary } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateCartQuantity } from "@/store/reducers/cartSlice";
import * as Haptics from "expo-haptics";

import {
  getPantryProducts,
  makeProductPantry,
} from "@/store/actions/pantryActions";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };
const { width: screenWidth } = Dimensions.get("window");

const ProductItemCard = ({ item, inPantry, favouriteIds }) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart.data);
  const router = useRouter();
  const [favorites, setFavorites] = useState(favouriteIds || {});
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showQuantityControls, setShowQuantityControls] = useState(false);
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

  // Get quantity from cart state
  const quantity =
    cartState.find((cartItem) => cartItem._id === item._id)?.orderQuantity || 0;
  const isFavorite = favorites[item._id] || false;

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

  // Show/hide quantity controls based on quantity
  useEffect(() => {
    const shouldShow = quantity > 0;
    if (shouldShow !== showQuantityControls) {
      setShowQuantityControls(shouldShow);
    }
  }, [quantity]);

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
        productParam: JSON.stringify({ ...item, inPantry, isFavorite }),
      },
    });
  };

  // Toggle favorite WITHOUT animation
  const toggleFavorite = async (id) => {
    try {
      setFavorites((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      await dispatch(makeProductPantry({ product: id })).unwrap();
      await dispatch(getPantryProducts()).unwrap();
    } catch (err) {
      console.log("Error toggling favorite", err);
    }
  };

  // Handle direct quantity input
  const handleQuantityInputFocus = () => {
    if (hasSubmitted.current) return;
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

  const handleQuantitySubmit = () => {
    if (!isEditing) return;

    let newQuantity = parseInt(inputValue, 10);
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
    handleCardPress();
    // if (quantity === 0) {
    //   // Animate button press
    //   if (item?.variation_exists) handleCardPress();
    //   else {
    //     Animated.sequence([
    //       Animated.timing(cardScaleAnim, {
    //         toValue: 0.98,
    //         duration: 100,
    //         useNativeDriver: true,
    //       }),
    //       Animated.timing(cardScaleAnim, {
    //         toValue: 1,
    //         duration: 100,
    //         useNativeDriver: true,
    //       }),
    //     ]).start();

    //     dispatch(updateCartQuantity({ id: item._id, item: item, change: 1 }));
    //   }
    // }
  };

  // Handle quantity change with animation feedback
  const handleQuantityChangeWithAnimation = (change) => {
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

    dispatch(updateCartQuantity({ id: item._id, item: item, change: change }));
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

          (inPantry || isFavorite) && styles.favoriteButtonActive,
        ]}
        onPress={() => toggleFavorite(item._id)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={inPantry ? "heart" : isFavorite ? "heart" : "heart-outline"}
          size={18}
          color={isFavorite || inPantry ? "#fff" : "#666"}
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
          {/* <Image
            source={{
              uri:
                `${apiUrl}products/photo/${item.photo}` ||
                "https://via.placeholder.com/150x150/f5f5f5/999999?text=No+Image",
            }}
            style={styles.productImage}
            resizeMode="cover"
          /> */}
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

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            {showQuantityControls ? (
              <Animated.View
                style={[
                  styles.quantityContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    styles.decrementButton,
                    quantity <= 0 && styles.quantityButtonDisabled,
                  ]}
                  onPress={() => handleQuantityChangeWithAnimation(-1)}
                  disabled={quantity <= 0}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.quantityButtonText,
                      quantity <= 0 && styles.quantityButtonTextDisabled,
                    ]}
                  >
                    -
                  </Text>
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
                    onEndEditing={handleQuantitySubmit}
                    blurOnSubmit
                    maxLength={3}
                    returnKeyType="done"
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
                  onPress={() => handleQuantityChangeWithAnimation(1)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
                activeOpacity={0.9}
              >
                <Ionicons
                  name="add"
                  size={16}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.addToCartText}>Add to cart</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
    shadowColor: primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButtonActive: {
    backgroundColor: primary,
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
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
  actionContainer: {
    marginTop: "auto",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 4,
    minHeight: 40,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityButtonDisabled: {
    backgroundColor: "#ddd",
    shadowOpacity: 0,
    elevation: 0,
  },
  decrementButton: {
    backgroundColor: primary,
  },
  incrementButton: {
    backgroundColor: primary,
  },
  quantityButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  quantityButtonTextDisabled: {
    color: "#999",
  },
  quantityDisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  quantityUnitContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  quantityText: {
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  quantityUnitText: {
    color: "#666",
    fontSize: 10,
    marginLeft: 2,
    fontWeight: "500",
  },
  quantityInput: {
    flex: 1,
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: primary,
    paddingVertical: 4,
    marginHorizontal: 8,
    minHeight: 32,
  },
  addToCartButton: {
    height: 40,
    borderRadius: 12,
    backgroundColor: primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addToCartText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

export default ProductItemCard;

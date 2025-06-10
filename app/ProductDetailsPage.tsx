"use client";

import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  Animated,
  Modal,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  Clock,
  Package,
  ChevronDown,
  Check,
} from "lucide-react-native";
import { primary } from "@/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import Constants from "expo-constants";
import HeaderCommon from "@/components/ui/HeaderCommon";
import { useDispatch, useSelector } from "react-redux";
import {
  getPantryProducts,
  makeProductPantry,
} from "@/store/actions/pantryActions";
import { updateCartQuantity } from "@/store/reducers/cartSlice";
const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Product {
  _id: string;
  name: string;
  slug: string;
  photo: string;
  photo_gallery: string[];
  sale_price: number;
  cost_price: number;
  quantity: number;
  is_unlimited: boolean;
  uom: {
    name: string;
    slug: string;
  };
  uom_value: number;
  category: {
    name: string;
  };
  sub_category: {
    name: string;
  };
  description: string;
  promotion_type: string;
  promotion_value: number;
  promotion_status: string;
  status: string;
  featured: string;
  supplier: {
    name: string;
    company_name: string;
  };
  sku: string;
  type: string;
}

// Size options for the dropdown
const variations = [
  { label: "Size 9-10", value: "9-10" },
  { label: "Size 14", value: "14" },
  { label: "Size 16", value: "16" },
  { label: "Size 18", value: "18" },
  { label: "Size 20", value: "20" },
  { label: "Size 22", value: "22" },
  { label: "Size 24", value: "24" },
  { label: "Size 12-13", value: "12-13" },
];

const ProductDetailPage = () => {
  const { productParam } = useLocalSearchParams();
  const dispatch = useDispatch();
  let product: Product | null = null;

  try {
    product = productParam ? JSON.parse(productParam as string) : null;
  } catch (error) {
    console.error("Error parsing product data:", error);
  }

  const router = useRouter();
  const cart = useSelector((state) => state.cart);

  // Size dropdown states
  const [selectedSize, setSelectedSize] = useState(
    product?.variations ? product?.variations[0] : {}
  );
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  // Get current cart item for the selected size
  const getCurrentCartItem = () => {
    if (!product?.variations || product?.variations?.length === 0) {
      // For products without variations
      return cart?.data?.find((item) => item?._id === product?._id);
    } else {
      // For products with variations, find by product ID and selected size
      return cart?.data?.find(
        (item) =>
          item?._id === product?._id &&
          item?.selectedVariant?.[0]?._id === selectedSize?._id
      );
    }
  };

  const currentCartItem = getCurrentCartItem();
  const [selectedQuantity, setSelectedQuantity] = useState(
    currentCartItem?.orderQuantity || 0
  );

  const [isFavorite, setIsFavorite] = useState(
    product?.inPantry || product?.isFavorite || false
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [showQuantityControls, setShowQuantityControls] = useState(
    selectedQuantity !== 0
  );

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Update selected quantity when size changes
  useEffect(() => {
    const newCartItem = getCurrentCartItem();
    const newQuantity = newCartItem?.orderQuantity || 0;
    setSelectedQuantity(newQuantity);
    setShowQuantityControls(newQuantity !== 0);
  }, [selectedSize, cart.data]);

  // Animation effect when quantity controls visibility changes
  useEffect(() => {
    if (showQuantityControls) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
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
      ]).start();
    }
  }, [showQuantityControls]);

  // If no product data, show error state
  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Package color="#ccc" size={64} />
          <Text style={styles.errorText}>Product not found</Text>
          <Text style={styles.errorSubText}>
            The product you're looking for doesn't exist.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate price based on selected size (if variations exist) or base product price
  const getCurrentPrice = () => {
    if (
      product?.variations &&
      product?.variations?.length > 0 &&
      selectedSize?.price
    ) {
      return selectedSize.price;
    }
    return product.sale_price;
  };

  const currentPrice = getCurrentPrice();

  const hasPromotion =
    product.promotion_status === "active" && product.promotion_value > 0;
  const discountedPrice = hasPromotion
    ? product.promotion_type === "fixed"
      ? currentPrice - product.promotion_value
      : currentPrice - (currentPrice * product.promotion_value) / 100
    : currentPrice;

  const discountPercentage = hasPromotion
    ? Math.round(((currentPrice - discountedPrice) / currentPrice) * 100)
    : 0;

  const handleQuantityChange = (change: number) => {
    const newQuantity = selectedQuantity + change;
    if (
      newQuantity >= 0 &&
      (product.is_unlimited || newQuantity <= product.quantity)
    ) {
      setSelectedQuantity(newQuantity);

      // Create the item object with selected variant if product has variations
      const itemToUpdate =
        product?.variations && product?.variations?.length > 0
          ? { ...product, selectedVariant: [selectedSize] }
          : product;

      dispatch(
        updateCartQuantity({
          id: product._id,
          item: itemToUpdate,
          change: change,
          selectedSizeId: selectedSize?._id, // Add this to help identify the specific variant
        })
      );

      // Hide quantity controls when quantity reaches 0
      if (newQuantity === 0) {
        setTimeout(() => {
          setShowQuantityControls(false);
        }, 150);
      }
    }
  };

  const handleAddToCart = () => {
    if (selectedQuantity === 0) {
      // First tap - show quantity controls and set quantity to 1
      setSelectedQuantity(1);
      setShowQuantityControls(true);

      const itemToAdd =
        product?.variations && product?.variations?.length > 0
          ? { ...product, selectedVariant: [selectedSize] }
          : product;

      dispatch(
        updateCartQuantity({
          id: product._id,
          item: itemToAdd,
          change: 1,
          selectedSizeId: selectedSize?._id,
        })
      );
    } else {
      // Subsequent taps - you can add additional logic here if needed
      console.log(
        "Adding to cart:",
        product.name,
        "Quantity:",
        selectedQuantity,
        "Size:",
        selectedSize?.size || "No size"
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Better image handling with fallbacks
  const getImageUri = (imageUrl: string) => {
    if (!imageUrl) return null;
    return `${apiUrl}products/photo/${imageUrl}`;
  };

  const images = [product.photo, ...(product.photo_gallery || [])].filter(
    Boolean
  );
  const currentImageUri = getImageUri(images[selectedImageIndex]);
  const fallbackImage =
    "https://via.placeholder.com/400x400/f5f5f5/999999?text=No+Image";

  const isOutOfStock = !product.is_unlimited && product.quantity === 0;

  // Size Dropdown Component
  const SizeDropdown = () => (
    <>
      <View style={styles.sizeContainer}>
        <Text style={styles.sizeLabel}>Size:</Text>
        <TouchableOpacity
          style={styles.sizeSelector}
          onPress={() => setShowSizeDropdown(true)}
        >
          <Text style={styles.sizeText}>{selectedSize?.size}</Text>
          <ChevronDown color="#666" size={20} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSizeDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSizeDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSizeDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <ScrollView
              style={styles.dropdownList}
              showsVerticalScrollIndicator={false}
            >
              {product?.variations?.map((option, index) => (
                <TouchableOpacity
                  key={option?._id}
                  style={[
                    styles.dropdownItem,
                    selectedSize?._id === option?._id &&
                      styles.selectedDropdownItem,
                    index === product?.variations?.length - 1 &&
                      styles.lastDropdownItem,
                  ]}
                  onPress={() => {
                    setSelectedSize(option);
                    setShowSizeDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedSize?._id === option?._id &&
                        styles.selectedDropdownItemText,
                    ]}
                  >
                    {option?.size}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedSize?._id === option?._id &&
                          styles.selectedDropdownItemText,
                      ]}
                    >
                      $ {option?.price}
                    </Text>
                    {selectedSize._id === option._id && (
                      <Check color="#fff" size={16} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Header */}
        <HeaderCommon
          title={product.name}
          isHeartEnabled={true}
          isFavorite={isFavorite}
          setIsFavorite={async (isFav) => {
            setIsFavorite(isFav);
            await dispatch(
              makeProductPantry({ product: product?._id })
            ).unwrap();
            await dispatch(getPantryProducts()).unwrap();
          }}
        />

        {/* Product Images */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                !imageError && currentImageUri
                  ? currentImageUri
                  : fallbackImage,
            }}
            style={styles.mainImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
          {hasPromotion && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
            </View>
          )}
          {product.featured === "yes" && (
            <View style={styles.featuredBadge}>
              <Star color="#FFD700" size={16} fill="#FFD700" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>

        {/* Image Gallery */}
        {images.length > 1 && (
          <ScrollView
            horizontal
            style={styles.imageGallery}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnailContainer,
                  selectedImageIndex === index && styles.selectedThumbnail,
                ]}
                onPress={() => {
                  setSelectedImageIndex(index);
                  setImageError(false);
                }}
              >
                <Image
                  source={{ uri: getImageUri(image) || fallbackImage }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>
              {product.category?.name || "Category"}
            </Text>
            {product.sub_category?.name && (
              <Text style={styles.subCategoryText}>
                {" "}
                • {product.sub_category.name}
              </Text>
            )}
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productSku}>SKU: {product.sku}</Text>

          {/* Size Dropdown - Show for products with variations */}
          {product?.variation_exists && <SizeDropdown />}

          {/* Price Section */}
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>
                ${discountedPrice.toFixed(2)}
                <Text style={styles.priceUnit}>
                  /{product.uom?.slug || "unit"}
                </Text>
              </Text>
              {hasPromotion && (
                <Text style={styles.originalPrice}>
                  ${currentPrice.toFixed(2)}
                </Text>
              )}
            </View>
            <Text style={styles.unitInfo}>
              {product.uom_value} {product.uom?.name || "unit"} per unit
            </Text>
          </View>

          {/* Description */}
          {product.description && product.description.trim() && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>About this product</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Why choose us</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Truck color={primary} size={20} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Fast Delivery</Text>
                  <Text style={styles.featureSubtitle}>
                    Same day delivery available
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Shield color={primary} size={20} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Quality Guaranteed</Text>
                  <Text style={styles.featureSubtitle}>
                    100% satisfaction promise
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Clock color={primary} size={20} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Always Fresh</Text>
                  <Text style={styles.featureSubtitle}>
                    Daily restocked inventory
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {showQuantityControls ? (
          <Animated.View
            style={[
              styles.quantityControlsContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.quantityButton,
                selectedQuantity <= 0 && styles.quantityButtonDisabled,
              ]}
              onPress={() => handleQuantityChange(-1)}
              disabled={selectedQuantity <= 0}
            >
              <Minus
                color={selectedQuantity <= 0 ? "#ccc" : "#fff"}
                size={20}
              />
            </TouchableOpacity>
            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{selectedQuantity}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                !product.is_unlimited &&
                  selectedQuantity >= product.quantity &&
                  styles.quantityButtonDisabled,
              ]}
              onPress={() => handleQuantityChange(1)}
              disabled={
                !product.is_unlimited && selectedQuantity >= product.quantity
              }
            >
              <Plus
                color={
                  !product.is_unlimited && selectedQuantity >= product.quantity
                    ? "#ccc"
                    : "#fff"
                }
                size={20}
              />
            </TouchableOpacity>
          </Animated.View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            isOutOfStock && styles.disabledButton,
            showQuantityControls && styles.addToCartButtonWithQuantity,
          ]}
          onPress={handleAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart color="#fff" size={20} />
          <Text style={styles.addToCartText}>
            {selectedQuantity === 0
              ? isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"
              : `Add ${selectedQuantity} • $${(
                  discountedPrice * selectedQuantity
                ).toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    // paddingTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 15,
    zIndex: 10,
  },

  imageContainer: {
    position: "relative",
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  mainImage: {
    width: "100%",
    height: screenWidth - 40,
    backgroundColor: "#f8f9fa",
  },
  discountBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#FF4757",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  featuredBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "700",
  },
  outOfStockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  outOfStockText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageGallery: {
    marginBottom: 25,
  },
  thumbnailContainer: {
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "transparent",
  },
  selectedThumbnail: {
    borderColor: primary,
  },
  thumbnail: {
    width: 80,
    height: 80,
  },
  productInfo: {
    paddingHorizontal: 20,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 15,
    color: primary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subCategoryText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  productName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 34,
  },
  productSku: {
    fontSize: 14,
    color: "#999",
    marginBottom: 24,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  // Size Dropdown Styles
  sizeContainer: {
    marginBottom: 24,
  },
  sizeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  sizeSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sizeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: 300,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedDropdownItem: {
    backgroundColor: "#666",
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  selectedDropdownItemText: {
    color: "#fff",
    fontWeight: "600",
  },
  priceContainer: {
    marginBottom: 24,
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: "800",
    color: primary,
  },
  priceUnit: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },
  originalPrice: {
    fontSize: 20,
    color: "#999",
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  unitInfo: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  stockContainer: {
    marginBottom: 28,
  },
  stockBadge: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    alignSelf: "flex-start",
  },
  lowStockBadge: {
    backgroundColor: "#FFF3E0",
  },
  outOfStockBadge: {
    backgroundColor: "#FFEBEE",
  },
  stockText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "700",
  },
  lowStockText: {
    color: "#FF9800",
  },
  outOfStockTextSmall: {
    color: "#F44336",
  },
  descriptionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 26,
    fontWeight: "400",
  },
  featuresContainer: {
    marginBottom: 28,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600",
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  supplierContainer: {
    marginBottom: 28,
  },
  supplierInfo: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: primary,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  supplierName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  supplierContact: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  quantityControlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 28,
    padding: 4,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: primary,
    justifyContent: "center",
    alignItems: "center",
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
  quantityDisplay: {
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: primary,
    paddingVertical: 18,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  addToCartButtonWithQuantity: {
    flex: 2,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ProductDetailPage;

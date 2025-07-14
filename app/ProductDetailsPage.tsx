"use client";
import HeaderCommon from "@/components/ui/HeaderCommon";
import { primary } from "@/constants/Colors";
import { TOAST_MESSAGES } from "@/constants/constants";
import {
  getPantryProducts,
  makeProductPantry,
} from "@/store/actions/pantryActions";
import {
  finalizeCartItem,
  updateCartItemNotes,
  updateCartQuantity,
} from "@/store/reducers/cartSlice";
import { ToastHelper } from "@/utils/ToastHelper";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  ChevronDown,
  Edit3,
  FileText,
  MessageSquare,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Star,
  X,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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

  // 1. Update the getCurrentCartItem function to also get finalized items for notes
  const getCurrentCartItem = () => {
    if (!product?.variations || product?.variations?.length === 0) {
      // For products without variations, get any item (active or finalized)
      return cart?.data?.find((item) => item?._id === product?._id);
    } else {
      // For products with variations, get any item with matching variant
      return cart?.data?.find(
        (item) =>
          item?._id === product?._id &&
          item?.selectedVariant?.[0]?._id === selectedSize?._id
      );
    }
  };
  // 2. Add a separate function to get active cart item for quantity operations
  const getActiveCartItem = () => {
    if (!product?.variations || product?.variations?.length === 0) {
      // For products without variations, get the active (non-finalized) item
      return cart?.data?.find(
        (item) => item?._id === product?._id && !item?.isFinalized
      );
    } else {
      // For products with variations, get the active (non-finalized) item with matching variant
      return cart?.data?.find(
        (item) =>
          item?._id === product?._id &&
          item?.selectedVariant?.[0]?._id === selectedSize?._id &&
          !item?.isFinalized
      );
    }
  };

  // 3. Update the getFinalizedItemsCount function to get total finalized quantity
  const getFinalizedItemsCount = () => {
    if (!product?.variations || product?.variations?.length === 0) {
      return (
        cart?.data
          ?.filter((item) => item?._id === product?._id && item?.isFinalized)
          ?.reduce((total, item) => total + (item?.orderQuantity || 0), 0) || 0
      );
    } else {
      return (
        cart?.data
          ?.filter(
            (item) =>
              item?._id === product?._id &&
              item?.selectedVariant?.[0]?._id === selectedSize?._id &&
              item?.isFinalized
          )
          ?.reduce((total, item) => total + (item?.orderQuantity || 0), 0) || 0
      );
    }
  };
  const currentCartItem = getCurrentCartItem();
  const [selectedQuantity, setSelectedQuantity] = useState(
    currentCartItem?.orderQuantity || 0
  );
  const isItemFinalized = () => {
    const cartItem = getCurrentCartItem();
    return cartItem?.isFinalized || false;
  };
  const [isFavorite, setIsFavorite] = useState(
    product?.inPantry || product?.isPantry || false
  );
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  // Notes state
  const [productNotes, setProductNotes] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [tempNotes, setTempNotes] = useState("");
  const notesInputRef = useRef(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showQuantityControls, setShowQuantityControls] = useState(
    selectedQuantity !== 0 && !isItemFinalized() // Hide if finalized
  );
  const [tempQuantity, setTempQuantity] = useState(selectedQuantity.toString());
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Notes handlers
  const handleNotesPress = () => {
    setTempNotes(productNotes);
    setShowNotesModal(true);
  };

  // 5. Update the handleNotesSubmit function to update notes for all matching items
  const handleNotesSubmit = () => {
    setProductNotes(tempNotes);
    setShowNotesModal(false);

    // Find all items (active and finalized) that match the current product/variant
    const matchingItems = cart?.data?.filter((item) => {
      if (!product?.variations || product?.variations?.length === 0) {
        return item?._id === product?._id;
      } else {
        return (
          item?._id === product?._id &&
          item?.selectedVariant?.[0]?._id === selectedSize?._id
        );
      }
    });

    // Update notes for all matching items
    matchingItems?.forEach((item) => {
      dispatch(
        updateCartItemNotes({
          id: product._id,
          selectedSizeId: selectedSize?._id,
          notes: tempNotes,
          cartItemId: item.cartItemId, // Use specific cart item ID
        })
      );
    });
  };

  const handleNotesCancel = () => {
    setTempNotes(productNotes);
    setShowNotesModal(false);
  };

  useEffect(() => {
    const activeItem = getActiveCartItem();
    const anyItem = getCurrentCartItem(); // This gets any item for notes
    const newQuantity = activeItem?.orderQuantity || 0;

    // Get notes from any available item (prioritize active, then finalized)
    const existingNotes =
      activeItem?.product_note?.note || anyItem?.product_note?.note || "";

    setSelectedQuantity(newQuantity);
    setProductNotes(existingNotes);

    // Show controls if there's an active quantity OR if there are finalized items
    const finalizedCount = getFinalizedItemsCount();
    setShowQuantityControls(newQuantity > 0 || finalizedCount > 0);
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

  // 7. Update the handleQuantityChange function
  const handleQuantityChange = (change: number) => {
    const currentItem = getActiveCartItem(); // Use active item for quantity operations
    const currentQuantity = currentItem?.orderQuantity || 0;
    const newQuantity = currentQuantity + change;

    if (newQuantity < 0) return; // Don't allow negative quantities

    if (product.is_unlimited || newQuantity <= product.quantity) {
      setSelectedQuantity(newQuantity);

      const itemToUpdate =
        product?.variations && product?.variations?.length > 0
          ? {
              ...product,
              selectedVariant: [selectedSize],
            }
          : product;

      dispatch(
        updateCartQuantity({
          id: product._id,
          item: {
            ...itemToUpdate,
            product_note: { product_id: product?._id, note: productNotes },
          },
          change: change,
          selectedSizeId: selectedSize?._id,
        })
      );

      if (newQuantity === 0) {
        setTimeout(() => {
          setShowQuantityControls(false);
        }, 150);
      }
    }
  };

  // 7. Update the handleAddToCart function to use getActiveCartItem
  const handleAddToCart = () => {
    const currentItem = getActiveCartItem(); // Use active item for cart operations
    const finalizedCount = getFinalizedItemsCount();

    if (!currentItem || currentItem?.orderQuantity === 0) {
      // No active item in cart OR quantity is 0 - add new item
      setSelectedQuantity(1);
      setShowQuantityControls(true);

      const itemToAdd =
        product?.variations && product?.variations?.length > 0
          ? {
              ...product,
              selectedVariant: [selectedSize],
            }
          : product;

      dispatch(
        updateCartQuantity({
          id: product._id,
          item: {
            ...itemToAdd,
            product_note: { product_id: product?._id, note: productNotes },
          },
          change: 1,
          selectedSizeId: selectedSize?._id,
        })
      );
    } else {
      // Active item exists with quantity > 0 - finalize it
      dispatch(
        finalizeCartItem({
          id: product._id,
          selectedSizeId: selectedSize?._id,
          cartItemId: currentItem.cartItemId,
        })
      );
      ToastHelper.showSuccess({
        title: TOAST_MESSAGES.PRODUCT_ADDED_TO_CART.title,
      });
      // Reset UI state but keep controls visible for next addition
      setSelectedQuantity(0);

      console.log(
        "Item finalized in cart:",
        product.name,
        "Quantity:",
        currentItem.orderQuantity,
        "Size:",
        selectedSize?.size || "No size",
        "Notes:",
        productNotes,
        "Total finalized items:",
        finalizedCount + 1
      );
      router.back();
    }
  };

  const getAddToCartButtonText = () => {
    const currentItem = getActiveCartItem(); // Use active item for button text
    const finalizedCount = getFinalizedItemsCount();

    if (isOutOfStock) {
      return "Out of Stock";
    }

    if (!currentItem || currentItem?.orderQuantity === 0) {
      if (finalizedCount > 0) {
        return `Add More (${finalizedCount} in cart)`;
      }
      return "Add to Cart";
    }

    return `Add ${currentItem.orderQuantity} • $${(
      discountedPrice * currentItem.orderQuantity
    ).toFixed(2)}`;
  };

  // 5. Update the getAddToCartButtonStyle function
  const getAddToCartButtonStyle = () => {
    const currentItem = getCurrentCartItem();

    return [
      styles.addToCartButton,
      isOutOfStock && styles.disabledButton,
      showQuantityControls && styles.addToCartButtonWithQuantity,
    ];
  };
  const handleBack = () => {
    router.back();
  };

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

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleQuantityPress = () => {
    setTempQuantity(selectedQuantity.toString());
    setShowQuantityModal(true);
    setIsEditing(true);
  };

  const handleQuantitySubmit = () => {
    const newQuantity = parseInt(tempQuantity) || 0;
    const maxQuantity = product.is_unlimited ? 999 : product.quantity;

    if (newQuantity >= 0 && newQuantity <= maxQuantity) {
      const difference = newQuantity - selectedQuantity;
      if (difference !== 0) {
        handleQuantityChange(difference);
      }
    }
    setShowQuantityModal(false);
    setIsEditing(false);
  };

  const handleQuantityCancel = () => {
    setTempQuantity(selectedQuantity.toString());
    setShowQuantityModal(false);
    setIsEditing(false);
  };

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
        contentContainerStyle={{ paddingBottom: 100 }}
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

          {/* Product Notes Section */}
          <View style={styles.notesSection}>
            <View style={styles.notesSectionHeader}>
              <MessageSquare color={primary} size={20} />
              <Text style={styles.notesSectionTitle}>Special Instructions</Text>
            </View>
            <Text style={styles.notesSectionSubtitle}>
              Add any special notes or preferences for this product
            </Text>

            <TouchableOpacity
              style={styles.notesInputContainer}
              onPress={handleNotesPress}
              activeOpacity={0.7}
            >
              <View style={styles.notesInputContent}>
                <FileText color="#999" size={18} />
                <Text
                  style={[
                    styles.notesInputText,
                    !productNotes && styles.notesPlaceholderText,
                  ]}
                  numberOfLines={2}
                >
                  {productNotes || "Tap to add special instructions..."}
                </Text>
                <Edit3 color="#999" size={16} />
              </View>
              {productNotes && (
                <View style={styles.notesIndicator}>
                  <Text style={styles.notesIndicatorText}>
                    {productNotes.length} characters
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Notes Modal */}
      <Modal
        visible={showNotesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleNotesCancel}
      >
        <View style={styles.notesModalOverlay}>
          <View style={styles.notesModalContainer}>
            <View style={styles.notesModalHeader}>
              <View style={styles.notesModalTitleContainer}>
                <MessageSquare color={primary} size={24} />
                <Text style={styles.notesModalTitle}>Special Instructions</Text>
              </View>
              <TouchableOpacity
                style={styles.notesModalCloseButton}
                onPress={handleNotesCancel}
              >
                <X color="#666" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.notesModalSubtitle}>
              Add any special notes, preferences, or instructions for this
              product
            </Text>

            <View style={styles.notesTextInputContainer}>
              <TextInput
                ref={notesInputRef}
                style={styles.notesTextInput}
                value={tempNotes}
                onChangeText={setTempNotes}
                placeholder="e.g., Extra spicy, no onions, gift wrap, delivery instructions..."
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                autoFocus={true}
                maxLength={500}
              />
              <View style={styles.notesCharacterCount}>
                <Text style={styles.notesCharacterCountText}>
                  {tempNotes.length}/500
                </Text>
              </View>
            </View>

            <View style={styles.notesModalActions}>
              <TouchableOpacity
                style={styles.notesModalSecondaryButton}
                onPress={handleNotesCancel}
              >
                <Text style={styles.notesModalSecondaryButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notesModalPrimaryButton}
                onPress={handleNotesSubmit}
              >
                <Check color="#fff" size={20} />
                <Text style={styles.notesModalPrimaryButtonText}>
                  Save Notes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Quantity Modal */}
      <Modal
        visible={showQuantityModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleQuantityCancel}
      >
        <TouchableOpacity
          style={styles.quantityModalOverlay}
          activeOpacity={1}
          onPress={handleQuantityCancel}
        >
          <View style={styles.quantityModalContainer}>
            <View style={styles.quantityModalHeader}>
              <Text style={styles.quantityModalTitle}>Enter Quantity</Text>
              <Text style={styles.quantityModalSubtitle}>
                {product.is_unlimited
                  ? "Enter desired quantity"
                  : `Max available: ${product.quantity}`}
              </Text>
            </View>

            <View style={styles.quantityInputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.quantityInput}
                value={tempQuantity}
                onChangeText={setTempQuantity}
                keyboardType="numeric"
                selectTextOnFocus={true}
                autoFocus={true}
                placeholder="0"
                placeholderTextColor="#999"
                maxLength={3}
              />
              <View style={styles.quantityInputSuffix}>
                <Text style={styles.quantityInputUnit}>
                  {product.uom?.name || "items"}
                </Text>
              </View>
            </View>

            <View style={styles.quantityModalActions}>
              <TouchableOpacity
                style={styles.quantityModalButton}
                onPress={handleQuantityCancel}
              >
                <X color="#666" size={20} />
                <Text style={styles.quantityModalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quantityModalButton,
                  styles.quantityModalPrimaryButton,
                ]}
                onPress={handleQuantitySubmit}
              >
                <Check color="#fff" size={20} />
                <Text
                  style={[
                    styles.quantityModalButtonText,
                    styles.quantityModalPrimaryButtonText,
                  ]}
                >
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

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

            <TouchableOpacity
              style={styles.quantityDisplay}
              onPress={handleQuantityPress}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.quantityContainer,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <Text style={styles.quantityText}>{selectedQuantity}</Text>
                {selectedQuantity > 0 && (
                  <View style={styles.editIndicator}>
                    <Edit3 color="#666" size={12} />
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>

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
          style={getAddToCartButtonStyle()}
          onPress={handleAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart color="#fff" size={20} />
          <Text style={styles.addToCartText}>{getAddToCartButtonText()}</Text>
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
  // Notes Section Styles
  notesSection: {
    marginBottom: 28,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  notesSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  notesSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  notesSectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  notesInputContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e8e8e8",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notesInputContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 12,
  },
  notesInputText: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    lineHeight: 22,
    fontWeight: "400",
  },
  notesPlaceholderText: {
    color: "#999",
    fontStyle: "italic",
  },
  notesIndicator: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  notesIndicatorText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  // Notes Modal Styles
  notesModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  notesModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: screenHeight * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  notesModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  notesModalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notesModalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  notesModalCloseButton: {
    padding: 4,
  },
  notesModalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    lineHeight: 22,
  },
  notesTextInputContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e8e8e8",
    marginBottom: 24,
    overflow: "hidden",
  },
  notesTextInput: {
    fontSize: 16,
    color: "#1a1a1a",
    padding: 16,
    minHeight: 120,
    maxHeight: 200,
    lineHeight: 22,
    fontWeight: "400",
  },
  notesCharacterCount: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e8e8e8",
  },
  notesCharacterCountText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  notesModalActions: {
    flexDirection: "row",
    gap: 12,
  },
  notesModalSecondaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  notesModalSecondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  notesModalPrimaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: primary,
    gap: 8,
  },
  notesModalPrimaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  // Existing styles continue...
  quantityDisplay: {
    minWidth: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  quantityContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  editIndicator: {
    opacity: 0.6,
  },
  quantityModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  quantityModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 320,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  quantityModalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  quantityModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  quantityModalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  quantityInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  quantityInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  quantityInputSuffix: {
    paddingLeft: 8,
  },
  quantityInputUnit: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  quantityModalActions: {
    flexDirection: "row",
    gap: 12,
  },
  quantityModalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    backgroundColor: "#f5f5f5",
  },
  quantityModalPrimaryButton: {
    backgroundColor: primary,
  },
  quantityModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  quantityModalPrimaryButtonText: {
    color: "#fff",
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
    fontSize: 12,
    fontWeight: "700",
  },
  finalizedButton: {
    backgroundColor: "#28a745", // Green color to indicate success
    opacity: 0.8,
  },
});

export default ProductDetailPage;

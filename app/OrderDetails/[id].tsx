"use client";
import HeaderCommon from "@/components/ui/HeaderCommon";
import { primary } from "@/constants/Colors";
import { getCustomerOrderByID } from "@/store/actions/orderActions";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const OrderDetailsPage = () => {
  const { id } = useLocalSearchParams();
  console.log("od", id);
  const orderSlice = useSelector((state: any) => state.order);
  const dispatch = useDispatch();
  console.log("asd", orderSlice?.data);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await dispatch(getCustomerOrderByID(id)).unwrap();
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, []);

  const formatCurrency = (amount: number) => `$${amount?.toFixed(2)}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return { bg: "#FEF3C7", text: "#D97706" };
      case "Completed":
        return { bg: "#D1FAE5", text: "#059669" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  const statusColors = getStatusColor(orderSlice?.data?.status);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <HeaderCommon title="Order Details" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Header Card */}
        <View style={styles.card}>
          <View style={styles.orderHeaderSection}>
            <View style={styles.orderTitleRow}>
              <Text style={styles.orderIdText}>
                Order #{orderSlice?.data?.order_id}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColors.bg },
                ]}
              >
                <Text style={[styles.statusText, { color: statusColors.text }]}>
                  {orderSlice?.data?.status}
                </Text>
              </View>
            </View>
            <Text style={styles.orderDate}>
              Placed on{" "}
              {moment(orderSlice?.data?.created_at).format(
                "DD MMM YYYY, hh:mm A"
              )}
            </Text>
          </View>
        </View>

        {/* Product Details Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cube-outline" size={20} color={primary} />
            <Text style={styles.sectionTitle}>Product Details</Text>
          </View>

          {orderSlice?.data?.enrichedItems?.map((item: any, index: number) => (
            <View key={index} style={styles.productItem}>
              <View style={styles.productRow}>
                {console.log(
                  "URLD",
                  `${apiUrl}products/photo/${item.product.photo}`
                )}
                {item.product?.photo ? (
                  <Image
                    source={{ uri: `${apiUrl}${item.product.photo}` }}
                    style={styles.productImage}
                  />
                ) : (
                  <View style={styles.productImagePlaceholder}>
                    <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                  </View>
                )}

                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.product?.name}</Text>
                  <Text style={styles.productCategory}>
                    {item.product?.category?.name}
                  </Text>
                  <Text style={styles.productSku}>
                    SKU: {item.product?.sku}
                  </Text>
                </View>
              </View>

              <View style={styles.productDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantity:</Text>
                  <Text style={styles.detailValue}>
                    {item.quantity} {item.uom}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Unit Price:</Text>
                  <Text style={styles.detailValue}>
                    {formatCurrency(item?.product?.sale_price)}
                  </Text>
                </View>
                {/* <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Weight:</Text>
                  <Text style={styles.detailValue}>
                    {item?.product?.weight}
                  </Text>
                </View> */}
                <View style={[styles.detailRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Item Total:</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(item.total)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Information Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color={primary} />
            <Text style={styles.sectionTitle}>Shipping Information</Text>
          </View>

          <View style={styles.shippingInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="home-outline" size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Delivery Address</Text>
                <Text style={styles.infoValue}>
                  {orderSlice?.data?.shipping_address}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Delivery Date</Text>
                <Text style={styles.infoValue}>
                  {moment(orderSlice?.data?.shipping_date).format(
                    "DD MMM YYYY"
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="car-outline" size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Delivery Type</Text>
                <Text style={styles.infoValue}>{orderSlice?.data?.type}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Supplier Information Card */}
        {/* {orderSlice?.data?.enrichedItems?.[0]?.product?.supplier && (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="business-outline" size={20} color={primary} />
              <Text style={styles.sectionTitle}>Supplier Information</Text>
            </View>

            <View style={styles.supplierInfo}>
              <Text style={styles.supplierName}>
                {
                  orderSlice?.data?.enrichedItems[0].product.supplier
                    .company_name
                }
              </Text>
              <Text style={styles.supplierContact}>
                {orderSlice?.data?.enrichedItems[0].product.supplier.name}
              </Text>
              <Text style={styles.supplierEmail}>
                {orderSlice?.data?.enrichedItems[0].product.supplier.email}
              </Text>
              <Text style={styles.supplierPhone}>
                {orderSlice?.data?.enrichedItems[0].product.supplier.phone}
              </Text>
            </View>
          </View>
        )} */}

        {/* Instructions Card */}
        {orderSlice?.data?.instructions && (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={primary}
              />
              <Text style={styles.sectionTitle}>Special Instructions</Text>
            </View>
            <Text style={styles.instructionsText}>
              {orderSlice?.data?.instructions}
            </Text>
          </View>
        )}

        {/* Order Summary Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calculator-outline" size={20} color={primary} />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>

          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(
                  orderSlice?.data?.total - orderSlice?.data?.tax
                )}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(orderSlice?.data?.tax)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>
                -{formatCurrency(orderSlice?.data?.discount)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalSummaryRow]}>
              <Text style={styles.totalSummaryLabel}>Total Amount</Text>
              <Text style={styles.totalSummaryValue}>
                {formatCurrency(orderSlice?.data?.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeaderSection: {
    marginBottom: 4,
  },
  orderTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderIdText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  productItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    marginLeft: 12,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  productSku: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  productDetails: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 14,
    color: primary,
    fontWeight: "700",
  },
  shippingInfo: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  supplierInfo: {
    gap: 8,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  supplierContact: {
    fontSize: 14,
    color: "#6B7280",
  },
  supplierEmail: {
    fontSize: 14,
    color: primary,
  },
  supplierPhone: {
    fontSize: 14,
    color: "#6B7280",
  },
  instructionsText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
  summarySection: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  totalSummaryRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    marginTop: 8,
  },
  totalSummaryLabel: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },
  totalSummaryValue: {
    fontSize: 18,
    color: primary,
    fontWeight: "700",
  },
  bottomSpacing: {
    height: 32,
  },
});
export default OrderDetailsPage;

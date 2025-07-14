"use client";
import { OrdersSkeleton } from "@/components/ui/Skeletons";
import { primary } from "@/constants/Colors";
import {
  getCustomerOrders,
  printCustomerOrder,
} from "@/store/actions/settingsActions";
import { saveAndOpenFile } from "@/utils/downloadFile";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const OrdersTab = () => {
  /* ─────────────── Redux ─────────────── */
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const orders = useSelector((state: any) => state.settings.orders || []);

  useEffect(() => {
    dispatch(getCustomerOrders({ order: -1 }));
  }, [dispatch]);

  /* ─────────────── Local state ─────────────── */
  const [showFilters, setShowFilters] = useState(false);
  const [orderStatus, setOrderStatus] = useState<
    "All" | "Pending" | "Completed"
  >("All");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Separate function for viewing order details
  const handleViewDetails = async (orderId: string) => {
    try {
      setIsLoading(true);
      router.push({ pathname: `/OrderDetails/${orderId}` });
    } catch (e) {
      console.warn("View details failed", e);
      Alert.alert("Error", "Unable to open the order details");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      const { base64 } = await dispatch(
        printCustomerOrder({ orderId, user: auth.data._id })
      ).unwrap();
      await saveAndOpenFile({
        name: `order_${orderId}.pdf`,
        data: base64,
        mimetype: "application/pdf",
      });
    } catch (e) {
      console.warn("Print-order failed", e);
      Alert.alert("Error", "Unable to open the PDF");
    } finally {
      setIsLoading(false);
    }
  };

  /* ─────────────── Derived list ─────────────── */
  const filteredOrders = useMemo(() => {
    return orders?.data
      ?.filter((o: any) => {
        if (orderStatus !== "All" && o.status !== orderStatus) return false;
        if (fromDate && moment(o.created_at).isBefore(fromDate, "day"))
          return false;
        if (toDate && moment(o.created_at).isAfter(toDate, "day")) return false;
        return true;
      })
      .sort(
        (a: any, b: any) =>
          moment(b.created_at).valueOf() - moment(a.created_at).valueOf()
      );
  }, [orders?.data, orderStatus, fromDate, toDate]);

  /* ─────────────── Helpers ─────────────── */
  const firstThumb = (order: any) =>
    order.enrichedItems?.[0]?.product?.photo
      ? { uri: apiUrl + order.enrichedItems[0].product.photo }
      : null;

  const toggleFilters = () => {
    setShowFilters((p) => !p);
  };

  const handleApplyFilters = async () => {
    setShowFilters(false);
    const payload: any = {
      skip: 0,
      limit: 10,
      sort: "created_at",
      order: -1,
    };
    if (orderStatus !== "All") {
      payload.status = orderStatus;
    }
    if (fromDate) {
      payload.from = moment(fromDate).format("YYYY-MM-DD");
    }
    if (toDate) {
      payload.to = moment(toDate).format("YYYY-MM-DD");
    }
    console.log("Filter payload:", payload);
    dispatch(getCustomerOrders(payload));
  };

  /* ─────────────── Calendar buttons ─────────────── */
  const DateButton = ({
    label,
    date,
    onPress,
  }: {
    label: string;
    date: Date | null;
    onPress: () => void;
  }) => (
    <View style={styles.dateFilter}>
      <Text style={styles.dateFilterLabel}>{label}</Text>
      <TouchableOpacity style={styles.datePickerButton} onPress={onPress}>
        <Ionicons
          name="calendar-outline"
          size={18}
          color="#6B7280"
          style={styles.dateIcon}
        />
        <Text style={styles.datePickerText}>
          {date ? moment(date).format("DD/MM/YYYY") : "Pick date"}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  /* ─────────────── Render ─────────────── */
  const renderOrderItem = ({ item }: { item: any }) => {
    const placed = moment(item.created_at).format("DD MMM YYYY");
    const delivery = moment(item.shipping_date).format("DD MMM YYYY");
    const count = item.enrichedItems?.length ?? 0;

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderLeft}>
            {firstThumb(item) ? (
              <Image source={firstThumb(item)} style={styles.thumb} />
            ) : (
              <View style={styles.thumbPlaceholder}>
                <Ionicons name="cube-outline" size={24} color="#9CA3AF" />
              </View>
            )}
            <View style={styles.orderHeaderInfo}>
              <Text style={styles.orderId}>#{item.order_id}</Text>
              <Text style={styles.orderCount}>{count} items</Text>
              <Text style={styles.supplierName}>
                {item.supplier?.company_name ?? "—"}
              </Text>
            </View>
          </View>
          <View style={styles.statusBadge(item.status)}>
            <Text style={styles.statusText(item.status)}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.orderDetails}>
          <View style={styles.detailsGrid}>
            <Info label="Mode" value={item.type} icon="settings-outline" />
            <Info label="Placed" value={placed} icon="calendar-outline" />
            <Info label="Delivery" value={delivery} icon="time-outline" />
            <Info
              label="Total"
              value={`$${item.total.toFixed(2)}`}
              icon="card-outline"
            />
          </View>
        </View>
        {item.instructions && (
          <View style={styles.instructionsContainer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#6B7280"
            />
            <Text style={styles.instructionsText} numberOfLines={2}>
              {item.instructions}
            </Text>
          </View>
        )}
        <View style={styles.orderActions}>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => handleViewDetails(item._id)}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={primary} />
            ) : (
              <>
                <Ionicons name="eye-outline" size={18} color={primary} />
                <Text style={styles.viewDetailsButtonText}>View Details</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.printButton}
            onPress={() => handlePrintOrder(item._id)}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="print-outline" size={18} color="#fff" />
                <Text style={styles.printButtonText}>Print Order</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Info = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon: string;
  }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoHeader}>
        <Ionicons name={icon as any} size={14} color="#6B7280" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterToggleButton}
          onPress={toggleFilters}
        >
          <Ionicons name="filter-outline" size={18} color={primary} />
          <Text style={styles.filterToggleText}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Text>
          <Ionicons
            name={showFilters ? "chevron-up" : "chevron-down"}
            size={18}
            color={primary}
          />
        </TouchableOpacity>
        {showFilters && (
          <View style={styles.filterSection}>
            {/* Status Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Order Status</Text>
              <View style={styles.statusButtons}>
                {(["All", "Pending", "Completed"] as const).map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.statusButton,
                      orderStatus === s && styles.activeStatusButton,
                    ]}
                    onPress={() => setOrderStatus(s)}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        orderStatus === s && styles.activeStatusButtonText,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Date Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Date Range</Text>
              <View style={styles.dateFilters}>
                <DateButton
                  label="From Date"
                  date={fromDate}
                  onPress={() => setShowFromPicker(true)}
                />
                <DateButton
                  label="To Date"
                  date={toDate}
                  onPress={() => setShowToPicker(true)}
                />
              </View>
            </View>
            {/* Hidden native pickers */}
            {showFromPicker && (
              <DateTimePicker
                value={fromDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "calendar"}
                maximumDate={toDate || undefined}
                onChange={(_, selected) => {
                  setShowFromPicker(Platform.OS === "ios");
                  if (selected) setFromDate(selected);
                }}
              />
            )}
            {showToPicker && (
              <DateTimePicker
                value={toDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "calendar"}
                minimumDate={fromDate || undefined}
                onChange={(_, selected) => {
                  setShowToPicker(Platform.OS === "ios");
                  if (selected) setToDate(selected);
                }}
              />
            )}
            <TouchableOpacity
              style={styles.applyFilterButton}
              onPress={handleApplyFilters}
            >
              <Ionicons name="checkmark-outline" size={18} color="#fff" />
              <Text style={styles.applyFilterText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Orders List */}
      <View style={styles.contentContainer}>
        {orders.isLoading ? (
          <OrdersSkeleton />
        ) : (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.ordersList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No orders found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try adjusting your filters or check back later
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  filterToggleText: {
    fontSize: 14,
    color: primary,
    fontWeight: "600",
  },
  filterSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: "row",
    gap: 8,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  activeStatusButton: {
    backgroundColor: primary,
    borderColor: primary,
  },
  statusButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  activeStatusButtonText: {
    color: "#FFFFFF",
  },
  dateFilters: {
    flexDirection: "row",
    gap: 12,
  },
  dateFilter: {
    flex: 1,
  },
  dateFilterLabel: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "500",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  dateIcon: {
    marginRight: 4,
  },
  datePickerText: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
  },
  applyFilterButton: {
    backgroundColor: primary,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  applyFilterText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    marginTop: 12,
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  orderHeaderLeft: {
    flexDirection: "row",
    flex: 1,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  thumbPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  orderHeaderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  orderCount: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  supplierName: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  statusBadge: (status: string) => ({
    backgroundColor:
      status === "Pending"
        ? "#FEF3C7"
        : status === "Completed"
        ? "#D1FAE5"
        : "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  }),
  statusText: (status: string) => ({
    color:
      status === "Pending"
        ? "#D97706"
        : status === "Completed"
        ? "#059669"
        : "#6B7280",
    fontSize: 12,
    fontWeight: "600",
  }),
  orderDetails: {
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoItem: {
    flex: 1,
    minWidth: "45%",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  instructionsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  instructionsText: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  orderActions: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12, // Fixed: Changed from "2" to 12
  },
  // New style for View Details button (outline style)
  viewDetailsButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1, // Added flex to make buttons equal width
  },
  viewDetailsButtonText: {
    color: primary,
    fontWeight: "600",
    fontSize: 14,
  },
  printButton: {
    backgroundColor: primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1, // Added flex to make buttons equal width
  },
  printButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default OrdersTab;

/* OrdersTab.tsx */
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // ← NEW
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { primary } from "@/constants/colors";
import {
  getCustomerOrders,
  printCustomerOrder,
} from "@/store/actions/settingsActions";
import Constants from "expo-constants";
const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";
import { saveAndOpenFile } from "@/utils/downloadFile";
import { OrdersSkeleton } from "@/components/ui/Skeletons";
const OrdersTab = () => {
  /* ─────────────── Redux ─────────────── */
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  const orders = useSelector((state: any) => state.settings.orders || []);
  useEffect(() => {
    dispatch(getCustomerOrders());
  }, [dispatch]);

  /* ─────────────── Local state ─────────────── */
  const [showFilters, setShowFilters] = useState(false);
  const [orderStatus, setOrderStatus] = useState<
    "All" | "Pending" | "Completed"
  >("All");

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false); // ← NEW
  const [showToPicker, setShowToPicker] = useState(false); // ← NEW

  const handlePrintOrder = async (orderId: string) => {
    try {
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

  const toggleFilters = () => setShowFilters((p) => !p);

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
        <Text style={styles.datePickerText}>
          {date ? moment(date).format("DD/MM/YYYY") : "Pick date"}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
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
        <View style={styles.row}>
          {firstThumb(item) ? (
            <Image source={firstThumb(item)} style={styles.thumb} />
          ) : (
            <Ionicons name="cube-outline" size={32} color="#bbb" />
          )}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.orderId}>
              #{item.order_id} • {count} items
            </Text>
            <Text style={styles.subLine}>
              {item.supplier?.company_name ?? "—"}
            </Text>
          </View>
          <View style={styles.statusBadge(item.status)}>
            <Text style={styles.statusText(item.status)}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <Info label="Mode" value={item.type} />
          <Info label="Placed" value={placed} />
          <Info label="Delivery" value={delivery} />
          <Info label="Total" value={`$${item.total.toFixed(2)}`} />
        </View>

        {item.instructions ? (
          <Text style={styles.note} numberOfLines={1}>
            {item.instructions}
          </Text>
        ) : null}

        <View style={styles.orderActions}>
          <TouchableOpacity style={styles.orderActionButton}>
            <Text style={styles.orderActionText}>Reorder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.orderActionButton}
            onPress={() => handlePrintOrder(item._id)}
          >
            <Text style={styles.orderActionText}>Print Order</Text>
            <Ionicons name="document-text-outline" size={16} color={primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Info = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.tabContent}>
      {/*  Toggle  */}
      <TouchableOpacity
        style={styles.filterToggleButton}
        onPress={toggleFilters}
      >
        <Text style={styles.filterToggleText}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Text>
        <Ionicons
          name={showFilters ? "chevron-up" : "chevron-down"}
          size={18}
          color={primary}
        />
      </TouchableOpacity>

      {/*  Filters panel  */}
      {showFilters && (
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Status</Text>
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

          {/*  Date filters  */}
          <View style={styles.dateFilters}>
            <DateButton
              label="From"
              date={fromDate}
              onPress={() => setShowFromPicker(true)}
            />
            <DateButton
              label="To"
              date={toDate}
              onPress={() => setShowToPicker(true)}
            />
          </View>

          {/*  Hidden native pickers  */}
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
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyFilterText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/*  Orders list  */}
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
            <Text style={{ textAlign: "center", marginTop: 32, color: "#666" }}>
              No orders found.
            </Text>
          }
        />
      )}
    </View>
  );
};

/* ───────────────── styles (unchanged except small tweaks) ─────────────── */
const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
  thumb: { width: 48, height: 48, borderRadius: 6, backgroundColor: "#f0f0f0" },
  subLine: { fontSize: 12, color: "#666", marginTop: 2 },
  infoRow: { flexDirection: "row", marginBottom: 4 },
  infoLabel: { width: 78, fontSize: 13, color: "#666" },
  infoValue: { fontSize: 13, fontWeight: "500" },
  note: { fontSize: 12, color: "#555", fontStyle: "italic", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  statusBadge: (s: any) => ({
    backgroundColor: s === "Pending" ? "#FFF4E5" : "#E5F8ED",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  }),
  statusText: (s: any) => ({
    color: s === "Pending" ? "#FF9800" : "#00C853",
    fontSize: 12,
    fontWeight: "500",
  }),
  filterToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterToggleText: {
    fontSize: 14,
    color: primary,
    fontWeight: "500",
    marginRight: 4,
  },
  filterSection: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#666",
  },
  statusButtons: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  activeStatusButton: {
    backgroundColor: primary,
    borderColor: primary,
  },
  statusButtonText: {
    color: "#666",
  },
  activeStatusButtonText: {
    color: "#fff",
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
  },
  // statusBadge: {
  //   paddingHorizontal: 8,
  //   paddingVertical: 4,
  //   borderRadius: 4,
  // },
  // statusText: {
  //   fontSize: 12,
  //   fontWeight: "500",
  // },
  orderDetails: {
    marginBottom: 16,
  },
  orderDetailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  orderDetailLabel: {
    width: 80,
    fontSize: 14,
    color: "#666",
  },
  orderDetailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  supplierBadge: {
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  supplierText: {
    fontSize: 12,
    color: "#FF9800",
    fontWeight: "500",
  },
  orderActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  orderActionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderActionText: {
    color: primary,
    fontWeight: "500",
    marginRight: 4,
  },
  dateFilters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateFilter: {
    flex: 1,
    marginRight: 8,
  },
  dateFilterLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  datePickerText: {
    fontSize: 14,
    color: "#333",
  },
  applyFilterButton: {
    backgroundColor: primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  applyFilterText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default OrdersTab;

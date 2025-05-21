/* OrdersTab.tsx */
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { primary } from "@/constants/colors";
import { getCustomerOrders } from "@/store/actions/settingsActions";

const OrdersTab = () => {
  /* ───────────────── Redux ───────────────── */
  const dispatch = useDispatch();
  const orders = useSelector(
    (state: any) => state.settings.orders || [] // fallback to []
  );
  console.log("orders", orders);
  /* Fetch once on mount */
  useEffect(() => {
    dispatch(getCustomerOrders());
  }, [dispatch]);

  /* ───────────────── UI state / filters ───────────────── */
  const [showFilters, setShowFilters] = useState(false);
  const [orderStatus, setOrderStatus] = useState<
    "All" | "Pending" | "Completed"
  >("All");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  /* ───────────────── Derived list ───────────────── */
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

  /* ───────────────── Render helpers ───────────────── */
  const renderOrderItem = ({ item }: { item: any }) => {
    const placed = moment(item.created_at).format("DD MMM, YYYY");
    const delivery = moment(item.shipping_date).format("DD MMM, YYYY");

    return (
      <View style={styles.orderCard}>
        {/* Header */}
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order #{item.order_id}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "Pending" ? "#FFF4E5" : "#E5F8ED",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: item.status === "Pending" ? "#FF9800" : "#00C853" },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.orderDetails}>
          {[
            ["Mode", item.type],
            ["Placed", placed],
            ["Delivery", delivery],
            ["Supplier", item?.supplier?.company_name ?? "—"],
          ].map(([label, value]) => (
            <View style={styles.orderDetailRow} key={label}>
              <Text style={styles.orderDetailLabel}>{label}:</Text>
              {label === "Supplier" ? (
                <View style={styles.supplierBadge}>
                  <Text style={styles.supplierText}>{value}</Text>
                </View>
              ) : (
                <Text style={styles.orderDetailValue}>{value}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.orderActions}>
          <TouchableOpacity style={styles.orderActionButton}>
            <Text style={styles.orderActionText}>Reorder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderActionButton}>
            <Text style={styles.orderActionText}>Print Order</Text>
            <Ionicons name="document-text-outline" size={16} color={primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ───────────────── JSX ───────────────── */
  return (
    <View style={styles.tabContent}>
      {/* Toggle filters */}
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

      {/* Filters */}
      {showFilters && (
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Status</Text>

          {/* Status buttons */}
          <View style={styles.statusButtons}>
            {(["All", "Pending", "Completed"] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  orderStatus === status && styles.activeStatusButton,
                ]}
                onPress={() => setOrderStatus(status)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    orderStatus === status && styles.activeStatusButtonText,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date filters (hook them up to a real date-picker if you’d like) */}
           <View style={styles.dateFilters}>
            <View style={styles.dateFilter}>
               <Text style={styles.dateFilterLabel}>From</Text>
               <TouchableOpacity style={styles.datePickerButton}>
                 <Text style={styles.datePickerText}>01/01/2025</Text>
                 <Ionicons name="calendar-outline" size={20} color="#666" />
               </TouchableOpacity>
             </View>

             <View style={styles.dateFilter}>
               <Text style={styles.dateFilterLabel}>To</Text>
               <TouchableOpacity style={styles.datePickerButton}>
                 <Text style={styles.datePickerText}>31/12/2025</Text>
                 <Ionicons name="calendar-outline" size={20} color="#666" />
               </TouchableOpacity>
             </View>
           </View>
          {/* … keep your From / To pickers here, they simply set fromDate / toDate … */}

          <TouchableOpacity style={styles.applyFilterButton} onPress={() => {}}>
            <Text style={styles.applyFilterText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Orders list */}
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
    </View>
  );
};

/* ───────────────── styles (unchanged except small tweaks) ─────────────── */
const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
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

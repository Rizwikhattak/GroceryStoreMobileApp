import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OrdersTab = () => {
  const orders = [
    {
      id: "1677",
      mode: "Delivery",
      placed: "05 Feb, 2025",
      delivery: "07 Feb, 2025",
      supplier: "Premium Meat",
      status: "Pending",
    },
    {
      id: "1648",
      mode: "Delivery",
      placed: "01 Feb, 2025",
      delivery: "03 Feb, 2025",
      supplier: "Premium Meat",
      status: "Pending",
    },
    {
      id: "1632",
      mode: "Pickup",
      placed: "28 Jan, 2025",
      delivery: "29 Jan, 2025",
      supplier: "Premium Meat",
      status: "Completed",
    },
    {
      id: "1621",
      mode: "Delivery",
      placed: "25 Jan, 2025",
      delivery: "27 Jan, 2025",
      supplier: "Premium Meat",
      status: "Completed",
    },
  ];
  const [showFilters, setShowFilters] = useState(false);
  const [orderStatus, setOrderStatus] = useState("All");

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
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
      <View style={styles.orderDetails}>
        {[
          ["Mode", item.mode],
          ["Placed", item.placed],
          ["Delivery", item.delivery],
          ["Supplier", item.supplier],
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
      <View style={styles.orderActions}>
        <TouchableOpacity style={styles.orderActionButton}>
          <Text style={styles.orderActionText}>Reorder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.orderActionButton}>
          <Text style={styles.orderActionText}>Print Order</Text>
          <Ionicons name="document-text-outline" size={16} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.tabContent}>
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
          color="#f44336"
        />
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                orderStatus === "All" && styles.activeStatusButton,
              ]}
              onPress={() => setOrderStatus("All")}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  orderStatus === "All" && styles.activeStatusButtonText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                orderStatus === "Pending" && styles.activeStatusButton,
              ]}
              onPress={() => setOrderStatus("Pending")}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  orderStatus === "Pending" && styles.activeStatusButtonText,
                ]}
              >
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                orderStatus === "Completed" && styles.activeStatusButton,
              ]}
              onPress={() => setOrderStatus("Completed")}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  orderStatus === "Completed" && styles.activeStatusButtonText,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>

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

          <TouchableOpacity style={styles.applyFilterButton}>
            <Text style={styles.applyFilterText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

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
    color: "#f44336",
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
    backgroundColor: "#f44336",
    borderColor: "#f44336",
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
    color: "#f44336",
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
    backgroundColor: "#f44336",
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

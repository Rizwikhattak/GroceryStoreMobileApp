import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerDetails } from "@/store/actions/customerActions";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const customer = useSelector((state: any) => state.customers);
  const auth = useSelector((state: any) => state.auth);
  const [activeTab, setActiveTab] = useState("orders");
  const router = useRouter();
  // Orders tab state
  const [orderStatus, setOrderStatus] = useState("All");
  // Account settings state
  const [firstName, setFirstName] = useState(
    customer?.data?.first_name || "Kamran"
  );
  const [lastName, setLastName] = useState(customer?.data?.last_name || "Khan");
  const [email, setEmail] = useState(
    customer?.data?.email || "info@premiummeat.co.nz"
  );
  const [phone, setPhone] = useState(customer?.data?.phone || "0220274555");
  const [address, setAddress] = useState(
    customer?.data?.address ||
      "54 Stoddard Road, Wesley, Auckland 1108, New Zealand"
  );
  const [password, setPassword] = useState("********");
  const [activeSettingsTab, setActiveSettingsTab] = useState("profile");
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        console.log("idL", auth.data._id);
        await dispatch(getCustomerDetails(auth.data._id)).unwrap();
      } catch (err) {
        console.error(err);
      }
    };
    fetchCustomerDetails();
  }, [dispatch]);
  // Sample orders data
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

  // Sample notifications data
  const notifications = [
    {
      id: "1",
      type: "Order Status",
      message: "Your order has been Shipped",
      date: "21-Jun-2024",
    },
    {
      id: "2",
      type: "Account Verification",
      message: "Your account has been verified",
      date: "27-May-2024",
    },
    {
      id: "3",
      type: "Order Status",
      message: "Your order has been Picked up",
      date: "23-May-2024",
    },
    {
      id: "4",
      type: "Order Status",
      message: "Your order has been Completed",
      date: "22-May-2024",
    },
    {
      id: "5",
      type: "Account Verification",
      message: "Your account has been verified",
      date: "15-Apr-2024",
    },
  ];

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
        <View style={styles.orderDetailRow}>
          <Text style={styles.orderDetailLabel}>Mode:</Text>
          <Text style={styles.orderDetailValue}>{item.mode}</Text>
        </View>
        <View style={styles.orderDetailRow}>
          <Text style={styles.orderDetailLabel}>Placed:</Text>
          <Text style={styles.orderDetailValue}>{item.placed}</Text>
        </View>
        <View style={styles.orderDetailRow}>
          <Text style={styles.orderDetailLabel}>Delivery:</Text>
          <Text style={styles.orderDetailValue}>{item.delivery}</Text>
        </View>
        <View style={styles.orderDetailRow}>
          <Text style={styles.orderDetailLabel}>Supplier:</Text>
          <View style={styles.supplierBadge}>
            <Text style={styles.supplierText}>{item.supplier}</Text>
          </View>
        </View>
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

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationType}>{item.type}</Text>
        <Text style={styles.notificationDate}>{item.date}</Text>
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
    </View>
  );

  const renderOrdersTab = () => (
    <View style={styles.tabContent}>
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

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderNotificationsTab = () => (
    <FlatList
      data={notifications}
      renderItem={renderNotificationItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.notificationsList}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderSettingsTab = () => {
    console.log("customersssss", customer.data);
    return (
      <View style={styles.tabContent}>
        <View style={styles.settingsTabs}>
          <TouchableOpacity
            style={[
              styles.settingsTab,
              activeSettingsTab === "profile" && styles.activeSettingsTab,
            ]}
            onPress={() => setActiveSettingsTab("profile")}
          >
            <Text
              style={[
                styles.settingsTabText,
                activeSettingsTab === "profile" && styles.activeSettingsTabText,
              ]}
            >
              Profile Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.settingsTab,
              activeSettingsTab === "business" && styles.activeSettingsTab,
            ]}
            onPress={() => setActiveSettingsTab("business")}
          >
            <Text
              style={[
                styles.settingsTabText,
                activeSettingsTab === "business" &&
                  styles.activeSettingsTabText,
              ]}
            >
              Business Detail
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.settingsTab,
              activeSettingsTab === "credit" && styles.activeSettingsTab,
            ]}
            onPress={() => setActiveSettingsTab("credit")}
          >
            <Text
              style={[
                styles.settingsTabText,
                activeSettingsTab === "credit" && styles.activeSettingsTabText,
              ]}
            >
              Credit Reference
            </Text>
          </TouchableOpacity>
        </View>

        {activeSettingsTab === "profile" && (
          <ScrollView style={styles.settingsForm}>
            <View style={styles.formRow}>
              <View style={styles.formColumn}>
                <Text style={styles.formLabel}>First Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                />
              </View>
              <View style={styles.formColumn}>
                <Text style={styles.formLabel}>Last Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formColumn}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.formColumn}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  style={styles.formInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.formFullRow}>
              <Text style={styles.formLabel}>Address</Text>
              <TextInput
                style={styles.formInput}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter address"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.formFullRow}>
              <Text style={styles.formLabel}>Password</Text>
              <TextInput
                style={styles.formInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                secureTextEntry
              />
            </View>

            <View style={styles.formFullRow}>
              <Text style={styles.formLabel}>Driver License</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={20}
                  color="#f44336"
                />
                <Text style={styles.uploadButtonText}>Upload License</Text>
              </TouchableOpacity>
              <Text style={styles.uploadNote}>No file chosen</Text>
            </View>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {activeSettingsTab === "business" && (
          <View style={styles.comingSoonContainer}>
            <Ionicons name="business-outline" size={60} color="#f44336" />
            <Text style={styles.comingSoonText}>
              Business Details Coming Soon
            </Text>
          </View>
        )}

        {activeSettingsTab === "credit" && (
          <View style={styles.comingSoonContainer}>
            <Ionicons name="card-outline" size={60} color="#f44336" />
            <Text style={styles.comingSoonText}>
              Credit Reference Coming Soon
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#f44336" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Profile Summary */}
      <View style={styles.profileSummary}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=100&width=100",
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editProfileImageButton}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {customer?.data?.first_name} {customer?.data?.last_name}
          </Text>
          <Text style={styles.profileEmail}>{customer?.data?.email}</Text>
        </View>
      </View>

      {/* Custom Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "orders" && styles.activeTab]}
          onPress={() => setActiveTab("orders")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "orders" && styles.activeTabText,
            ]}
          >
            Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "notifications" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("notifications")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "notifications" && styles.activeTabText,
            ]}
          >
            Notifications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "settings" && styles.activeTab]}
          onPress={() => setActiveTab("settings")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "settings" && styles.activeTabText,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTab === "orders" && renderOrdersTab()}
        {activeTab === "notifications" && renderNotificationsTab()}
        {activeTab === "settings" && renderSettingsTab()}
      </View>

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.cartNavItem]}>
          <Ionicons name="cart" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#f44336" />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f44336",
  },
  placeholder: {
    width: 32,
  },
  profileSummary: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#f44336",
  },
  editProfileImageButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#f44336",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#f44336",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#f44336",
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
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
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  notificationType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f44336",
  },
  notificationDate: {
    fontSize: 12,
    color: "#666",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#333",
  },
  settingsTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingsTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeSettingsTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#f44336",
  },
  settingsTabText: {
    fontSize: 14,
    color: "#666",
  },
  activeSettingsTabText: {
    color: "#f44336",
    fontWeight: "500",
  },
  settingsForm: {
    padding: 16,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  formColumn: {
    flex: 1,
    marginRight: 8,
  },
  formFullRow: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f44336",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  uploadButtonText: {
    color: "#f44336",
    marginLeft: 8,
    fontWeight: "500",
  },
  uploadNote: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#f44336",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  comingSoonText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 8,
  },
  navItem: {
    padding: 8,
  },
  cartNavItem: {
    backgroundColor: "#f44336",
    borderRadius: 30,
    padding: 12,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ProfileScreen;

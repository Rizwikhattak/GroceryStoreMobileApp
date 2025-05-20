import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const Notifications = () => {
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
  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationType}>{item.type}</Text>
        <Text style={styles.notificationDate}>{item.date}</Text>
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
    </View>
  );

  return (
    <FlatList
      data={notifications}
      renderItem={renderNotificationItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.notificationsList}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
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
});

export default Notifications;

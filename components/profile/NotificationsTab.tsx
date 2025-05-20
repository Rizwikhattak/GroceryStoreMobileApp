import { primary } from "@/constants/colors";
import { getNotifications } from "@/store/actions/settingsActions";
import { parseISOString } from "@/utils/Helpers";
import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.settings.notifications);
  // const notifications = [
  //   {
  //     id: "1",
  //     type: "Order Status",
  //     message: "Your order has been Shipped",
  //     date: "21-Jun-2024",
  //   },
  //   {
  //     id: "2",
  //     type: "Account Verification",
  //     message: "Your account has been verified",
  //     date: "27-May-2024",
  //   },
  //   {
  //     id: "3",
  //     type: "Order Status",
  //     message: "Your order has been Picked up",
  //     date: "23-May-2024",
  //   },
  //   {
  //     id: "4",
  //     type: "Order Status",
  //     message: "Your order has been Completed",
  //     date: "22-May-2024",
  //   },
  //   {
  //     id: "5",
  //     type: "Account Verification",
  //     message: "Your account has been verified",
  //     date: "15-Apr-2024",
  //   },
  // ];
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await dispatch(getNotifications()).unwrap();
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationType}>{item?.message}</Text>
        <Text style={styles.notificationDate}>
          {parseISOString(item?.created_at)?.date}
        </Text>
      </View>
      <Text style={styles.notificationMessage}>{item?.title}</Text>
    </View>
  );

  return (
    <FlatList
      data={notifications?.data}
      renderItem={renderNotificationItem}
      keyExtractor={(item) => item?._id}
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
    color: primary,
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

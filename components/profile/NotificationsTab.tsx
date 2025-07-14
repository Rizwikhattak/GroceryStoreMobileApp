import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { NotificationsSkeleton } from "@/components/ui/Skeletons";
import { primary } from "@/constants/Colors";
import { getNotifications } from "@/store/actions/settingsActions";
import { parseISOString } from "@/utils/Helpers";

const Notifications = () => {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.settings.notifications);

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

  const getNotificationIcon = (message: string) => {
    const lowerMessage = message?.toLowerCase() || "";
    if (
      lowerMessage.includes("order") ||
      lowerMessage.includes("shipped") ||
      lowerMessage.includes("delivered")
    ) {
      return "bag-outline";
    } else if (
      lowerMessage.includes("account") ||
      lowerMessage.includes("verified")
    ) {
      return "checkmark-circle-outline";
    } else if (
      lowerMessage.includes("payment") ||
      lowerMessage.includes("transaction")
    ) {
      return "card-outline";
    } else if (
      lowerMessage.includes("promotion") ||
      lowerMessage.includes("offer")
    ) {
      return "gift-outline";
    }
    return "notifications-outline";
  };

  const getNotificationColor = (message: string) => {
    const lowerMessage = message?.toLowerCase() || "";
    if (
      lowerMessage.includes("shipped") ||
      lowerMessage.includes("delivered") ||
      lowerMessage.includes("completed")
    ) {
      return "#4CAF50";
    } else if (
      lowerMessage.includes("verified") ||
      lowerMessage.includes("confirmed")
    ) {
      return "#2196F3";
    } else if (
      lowerMessage.includes("pending") ||
      lowerMessage.includes("processing")
    ) {
      return "#FF9800";
    } else if (
      lowerMessage.includes("cancelled") ||
      lowerMessage.includes("failed")
    ) {
      return "#F44336";
    }
    return primary;
  };

  const renderNotificationItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.notificationCard, index === 0 && styles.firstCard]}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconBackground,
              { backgroundColor: getNotificationColor(item?.message) + "20" },
            ]}
          >
            <Ionicons
              name={getNotificationIcon(item?.message)}
              size={20}
              color={getNotificationColor(item?.message)}
            />
          </View>
        </View>

        <View style={styles.textContainer}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationType} numberOfLines={2}>
              {item?.message}
            </Text>
            <Text style={styles.notificationDate}>
              {parseISOString(item?.created_at)?.date}
            </Text>
          </View>
          <Text style={styles.notificationMessage} numberOfLines={3}>
            {item?.title}
          </Text>
        </View>

        {/* <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colorScheme === "light" ? "#999" : "#666"}
            />
          </TouchableOpacity>
        </View> */}
      </View>

      {/* Subtle gradient overlay for premium feel */}
      <LinearGradient
        colors={[
          "transparent",
          colorScheme === "light" ? "#f8f9fa10" : "#ffffff05",
        ]}
        style={styles.cardGradient}
        pointerEvents="none"
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons
          name="notifications-outline"
          size={64}
          color={colorScheme === "light" ? "#e0e0e0" : "#555"}
        />
      </View>
      <Text style={styles.emptyTitle}>No notifications yet</Text>
      <Text style={styles.emptySubtitle}>
        We'll notify you when something important happens
      </Text>
    </View>
  );

  if (notifications.isLoading) {
    return (
      <View style={styles.container}>
        <NotificationsSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notifications?.data?.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={notifications?.data}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item?._id}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  notificationsList: {
    padding: 20,
    paddingBottom: 30,
  },

  notificationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 0,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },

  firstCard: {
    marginTop: 8,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },

  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },

  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    flex: 1,
    marginRight: 8,
  },

  notificationHeader: {
    marginBottom: 8,
  },

  notificationType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: 22,
    marginBottom: 4,
  },

  notificationDate: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },

  notificationMessage: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    fontWeight: "400",
  },

  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },

  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default Notifications;

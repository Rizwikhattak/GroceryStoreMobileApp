import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OrderConfirmation({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Confirmation</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Section */}
        <View style={styles.successSection}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={60} color="#22c55e" />
          </View>
          <Text style={styles.successTitle}>Thank You for your Order!</Text>
          <Text style={styles.successSubtitle}>
            Your order has been successfully placed
          </Text>
        </View>

        {/* Order Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="cube-outline" size={20} color="#7f1d1d" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Order Number</Text>
              <Text style={styles.detailValue}>#3144</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={20} color="#7f1d1d" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Confirmation Email</Text>
              <Text style={styles.detailValue}>rizwikhattak4384@gmail.com</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={20} color="#7f1d1d" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Delivery Date</Text>
              <Text style={styles.detailValue}>01 July, 2025</Text>
            </View>
          </View>
        </View>

        {/* Status Notice */}
        <View style={styles.statusNotice}>
          <Text style={styles.statusText}>
            Please view order details from order and invoices screen
          </Text>
        </View>

        {/* Delivery Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationPlaceholder}>
            <Ionicons name="bicycle" size={40} color="#7f1d1d" />
            <Text style={styles.illustrationText}>Order on the way!</Text>
          </View>
        </View>

        {/* Email Confirmation Notice */}
        <View style={styles.emailNotice}>
          <Text style={styles.emailNoticeText}>
            You will receive a confirmation email shortly at your registered
            email address
          </Text>
        </View>

        {/* Bottom spacing for fixed buttons */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons
            name="home"
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("OrderDetails")}
        >
          <Text style={styles.secondaryButtonText}>View Order Details</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  successSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  statusNotice: {
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 14,
    color: "#7f1d1d",
    fontWeight: "500",
    textAlign: "center",
  },
  illustrationContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  illustrationPlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  illustrationText: {
    fontSize: 16,
    color: "#7f1d1d",
    fontWeight: "500",
    marginTop: 8,
  },
  emailNotice: {
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  emailNoticeText: {
    fontSize: 14,
    color: "#1e40af",
    textAlign: "center",
  },
  bottomSpacer: {
    height: 120,
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 16,
    paddingBottom: 32,
  },
  primaryButton: {
    backgroundColor: "#7f1d1d",
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#7f1d1d",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    color: "#7f1d1d",
    fontSize: 16,
    fontWeight: "600",
  },
});

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const Navbar = ({ title = "Premium meats" }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.8)).current;

  const openMenu = () => {
    setIsMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuVisible(false);
    });
  };

  // Pan responder for swipe to close
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        const newValue = Math.max(gestureState.dx, -width * 0.8);
        slideAnim.setValue(newValue);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -width * 0.2) {
        closeMenu();
      } else {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const menuItems = [
    { id: 1, title: "Home", icon: "home-outline" },
    { id: 2, title: "Categories", icon: "grid-outline" },
    { id: 3, title: "Featured Products", icon: "star-outline" },
    { id: 4, title: "My Orders", icon: "receipt-outline" },
    { id: 5, title: "Contact Us", icon: "mail-outline" },
    { id: 6, title: "About Us", icon: "information-circle-outline" },
    { id: 7, title: "Settings", icon: "settings-outline" },
    { id: 8, title: "Help & Support", icon: "help-circle-outline" },
  ];

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
            <Ionicons name="menu" size={24} color="#8B1538" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#8B1538" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Modal with absolute positioning */}
      {isMenuVisible && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={closeMenu}
          />

          <Animated.View
            style={[
              styles.slideMenu,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Premium meats</Text>
              <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#8B1538" />
              </TouchableOpacity>
            </View>

            {/* User Section */}
            <View style={styles.userSection}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitial}>K</Text>
              </View>
              <Text style={styles.userName}>Welcome, Kamran</Text>
              <Text style={styles.userEmail}>kamran@example.com</Text>
            </View>

            {/* Menu Items */}
            <View style={styles.menuItems}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => {
                    console.log(`Navigate to ${item.title}`);
                    closeMenu();
                  }}
                >
                  <Ionicons name={item.icon} size={22} color="#666" />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Menu Footer */}
            <View style={styles.menuFooter}>
              <TouchableOpacity style={styles.logoutButton} onPress={closeMenu}>
                <Ionicons name="log-out-outline" size={20} color="#8B1538" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8B1538",
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#8B1538",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
    elevation: 999999,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  slideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.8,
    backgroundColor: "#fff",
    elevation: 1000000,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 1000000,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 60,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8B1538",
  },
  closeButton: {
    padding: 4,
  },
  userSection: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8B1538",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  userInitial: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  menuItemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  menuFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8B1538",
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#8B1538",
    fontWeight: "500",
  },
});

export default Navbar;

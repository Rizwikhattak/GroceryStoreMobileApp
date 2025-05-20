"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import OrdersTab from "@/components/profile/OrdersTab";
import Notifications from "@/components/profile/NotificationsTab";
import SettingsTab from "@/components/profile/Settings";
import * as ImagePicker from "expo-image-picker";
import * as mime from "react-native-mime-types";

import { primary } from "@/constants/colors";
import Constants from "expo-constants";
import {
  getUserProfileDetails,
  updateUserProfileDetails,
} from "@/store/actions/settingsActions";
import { logout } from "@/store/reducers/authSlice";
const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);

  const customer = useSelector((state: any) => state.settings);
  const [activeTab, setActiveTab] = useState("orders");
  const router = useRouter();
  // Orders tab state
  // console.log("customer", customer);
  console.log("auth", auth);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    const toValue = showFilters ? 0 : 1;
    setShowFilters(!showFilters);

    // Animated.timing(filterAnimation, {
    //   toValue,
    //   duration: 300,
    //   useNativeDriver: false,
    // }).start();
  };

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        await dispatch(getUserProfileDetails(auth.data._id)).unwrap();
      } catch (err) {
        console.error(err);
      }
    };
    fetchCustomerDetails();
  }, [dispatch]);

  const pickAndUploadPhoto = async () => {
    /* 1️⃣  Ask the user for gallery permission (iOS + Android) */
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need access to your photo library so you can change your picture."
      );
      return;
    }

    /* 2️⃣  Launch the gallery */
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // keep it square-ish
      quality: 0.8,
    });

    if (result.canceled) return; // user hit the ✖️

    /* 3️⃣  Prepare multipart/form-data exactly like backend expects */
    const asset = result.assets[0];
    const localUri = asset.uri;
    const filename = localUri.split("/").pop() || `photo_${Date.now()}.jpg`;
    const filetype = mime.lookup(filename) || "image/jpeg";

    const formData = new FormData();

    // copy every field we got from the API slice
    for (const [key, value] of Object.entries(customer.data)) {
      if (key !== "photo") {
        formData.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : value
        );
      }
    }

    // 2️⃣ **MUST** include the current id for the unique rule
    formData.append("_id", customer.data._id); // 👈 add this back!

    // 3️⃣ attach the file exactly on the field name the controller expects
    formData.append("photo", {
      uri: localUri,
      name: filename,
      type: filetype,
    });

    /* 4️⃣  Fire the Redux thunk – it already sets multipart headers for "form" */
    try {
      console.log("Uploading photo...");
      await dispatch(
        updateUserProfileDetails({ _id: customer.data._id, formData: formData })
      ).unwrap();
      // optionally refresh the profile info in Redux
      await dispatch(getUserProfileDetails(auth?.data?._id)).unwrap();
    } catch (err) {
      console.error(err);
      Alert.alert("Upload failed", err.message || "Please try again");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          // Dispatch logout action
          // dispatch({ type: 'LOGOUT' });
          console.log("User logged out");
          dispatch(logout());

          // Navigate to login screen
          // router.replace("/login");
        },
        style: "destructive",
      },
    ]);
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
          <Ionicons name="chevron-back" size={24} color={primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={primary} />
        </TouchableOpacity>
      </View>

      {/* Profile Summary */}
      <View style={styles.profileSummary}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              // uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=100&width=100",
              uri:
                `${apiUrl}users/photo/${customer?.data?.photo}` ||
                "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editProfileImageButton}
            onPress={pickAndUploadPhoto}
          >
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
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "notifications" && <Notifications />}
        {activeTab === "settings" && (
          <SettingsTab customerData={customer?.data} />
        )}
      </View>
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
    color: primary,
  },
  logoutButton: {
    padding: 4,
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
    borderColor: primary,
  },
  editProfileImageButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: primary,
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
    borderBottomColor: primary,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: primary,
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
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
    backgroundColor: primary,
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

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   TextInput,
//   Image,
//   FlatList,
//   StatusBar,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useDispatch, useSelector } from "react-redux";
// import OrdersTab from "@/components/profile/OrdersTab";
// import Notifications from "@/components/profile/NotificationsTab";
// import SettingsTab from "@/components/profile/Settings";
// import * as ImagePicker from "expo-image-picker";
// import * as mime from "react-native-mime-types";
// import { Alert } from "react-native";

// import { primary } from "@/constants/colors";
// import Constants from "expo-constants";
// import {
//   getUserProfileDetails,
//   updateUserProfileDetails,
// } from "@/store/actions/settingsActions";
// const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };

// const ProfileScreen = () => {
//   const dispatch = useDispatch();
//   const auth = useSelector((state: any) => state.auth);

//   const customer = useSelector((state: any) => state.settings);
//   const [activeTab, setActiveTab] = useState("orders");
//   const router = useRouter();
//   // Orders tab state
//   // console.log("customer", customer);
//   console.log("auth", auth);
//   const [showFilters, setShowFilters] = useState(false);

//   const toggleFilters = () => {
//     const toValue = showFilters ? 0 : 1;
//     setShowFilters(!showFilters);

//     // Animated.timing(filterAnimation, {
//     //   toValue,
//     //   duration: 300,
//     //   useNativeDriver: false,
//     // }).start();
//   };
//   useEffect(() => {
//     const fetchCustomerDetails = async () => {
//       try {
//         await dispatch(getUserProfileDetails(auth.data._id)).unwrap();
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchCustomerDetails();
//   }, [dispatch]);
//   const pickAndUploadPhoto = async () => {
//     /* 1️⃣  Ask the user for gallery permission (iOS + Android) */
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Permission needed",
//         "We need access to your photo library so you can change your picture."
//       );
//       return;
//     }

//     /* 2️⃣  Launch the gallery */
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1], // keep it square-ish
//       quality: 0.8,
//     });

//     if (result.canceled) return; // user hit the ✖️

//     /* 3️⃣  Prepare multipart/form-data exactly like backend expects */
//     const asset = result.assets[0];
//     const localUri = asset.uri;
//     const filename = localUri.split("/").pop() || `photo_${Date.now()}.jpg`;
//     const filetype = mime.lookup(filename) || "image/jpeg";

//     const formData = new FormData();

//     // copy every field we got from the API slice
//     for (const [key, value] of Object.entries(customer.data)) {
//       if (key !== "photo") {
//         formData.append(
//           key,
//           Array.isArray(value) ? JSON.stringify(value) : value
//         );
//       }
//     }

//     // 2️⃣ **MUST** include the current id for the unique rule
//     formData.append("_id", customer.data._id); // 👈 add this back!

//     // 3️⃣ attach the file exactly on the field name the controller expects
//     formData.append("photo", {
//       uri: localUri,
//       name: filename,
//       type: filetype,
//     });

//     /* 4️⃣  Fire the Redux thunk – it already sets multipart headers for "form" */
//     try {
//       console.log("Uploading photo...");
//       await dispatch(
//         updateUserProfileDetails({ _id: customer.data._id, formData: formData })
//       ).unwrap();
//       // optionally refresh the profile info in Redux
//       await dispatch(getUserProfileDetails(auth?.data?._id)).unwrap();
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Upload failed", err.message || "Please try again");
//     }
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <Ionicons name="chevron-back" size={24} color={primary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>My Profile</Text>
//         <View style={styles.placeholder} />
//       </View>

//       {/* Profile Summary */}
//       <View style={styles.profileSummary}>
//         <View style={styles.profileImageContainer}>
//           <Image
//             source={{
//               // uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=100&width=100",
//               uri:
//                 `${apiUrl}users/photo/${customer?.data?.photo}` ||
//                 "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ob7miW3mUreePYfXdVwkpFWHthzoR5.svg?height=100&width=100",
//             }}
//             style={styles.profileImage}
//           />
//           <TouchableOpacity
//             style={styles.editProfileImageButton}
//             onPress={pickAndUploadPhoto}
//           >
//             <Ionicons name="camera" size={16} color="#fff" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.profileInfo}>
//           <Text style={styles.profileName}>
//             {customer?.data?.first_name} {customer?.data?.last_name}
//           </Text>
//           <Text style={styles.profileEmail}>{customer?.data?.email}</Text>
//         </View>
//       </View>

//       {/* Custom Tab Navigation */}
//       <View style={styles.tabBar}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === "orders" && styles.activeTab]}
//           onPress={() => setActiveTab("orders")}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === "orders" && styles.activeTabText,
//             ]}
//           >
//             Orders
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.tab,
//             activeTab === "notifications" && styles.activeTab,
//           ]}
//           onPress={() => setActiveTab("notifications")}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === "notifications" && styles.activeTabText,
//             ]}
//           >
//             Notifications
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.tab, activeTab === "settings" && styles.activeTab]}
//           onPress={() => setActiveTab("settings")}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === "settings" && styles.activeTabText,
//             ]}
//           >
//             Settings
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Tab Content */}
//       <View style={styles.contentContainer}>
//         {activeTab === "orders" && <OrdersTab />}
//         {activeTab === "notifications" && <Notifications />}
//         {activeTab === "settings" && (
//           <SettingsTab customerData={customer?.data} />
//         )}
//       </View>

//       {/* Bottom Navigation */}
//       {/* <View style={styles.bottomNav}>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="home" size={24} color="#888" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="grid" size={24} color="#888" />
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.navItem, styles.cartNavItem]}>
//           <Ionicons name="cart" size={24} color="#fff" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="heart" size={24} color="#888" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="person" size={24} color=primary />
//         </TouchableOpacity>
//       </View> */}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingTop: 50,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: primary,
//   },
//   placeholder: {
//     width: 32,
//   },
//   profileSummary: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   profileImageContainer: {
//     position: "relative",
//     marginRight: 16,
//   },
//   profileImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     borderWidth: 2,
//     borderColor: primary,
//   },
//   editProfileImageButton: {
//     position: "absolute",
//     right: 0,
//     bottom: 0,
//     backgroundColor: primary,
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   profileEmail: {
//     fontSize: 14,
//     color: "#666",
//   },
//   tabBar: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 16,
//     alignItems: "center",
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: primary,
//   },
//   tabText: {
//     fontSize: 14,
//     color: "#666",
//   },
//   activeTabText: {
//     color: primary,
//     fontWeight: "500",
//   },
//   contentContainer: {
//     flex: 1,
//   },

//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     paddingVertical: 8,
//   },
//   navItem: {
//     padding: 8,
//   },
//   cartNavItem: {
//     backgroundColor: primary,
//     borderRadius: 30,
//     padding: 12,
//     marginTop: -20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
// });

// export default ProfileScreen;

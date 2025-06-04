import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import SkeletonLoading from "expo-skeleton-loading";
const { width: screenWidth } = Dimensions.get("window");

export const ProfileHeaderSkeleton = () => {
  return (
    <SkeletonLoading background="#e0e0e0" highlight="#f5f5f5">
      <View style={ProfileHeaderSkeletonStyles.container}>
        <View style={ProfileHeaderSkeletonStyles.profilePic}></View>
        <View style={{ gap: 10 }}>
          <View style={ProfileHeaderSkeletonStyles.name} />
          <View style={ProfileHeaderSkeletonStyles.gmail} />
        </View>
      </View>
    </SkeletonLoading>
  );
};

const ProfileHeaderSkeletonStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    borderRadius: 100,
    width: 80,
    height: 80,
    backgroundColor: "#e0e0e0",
  },
  name: {
    width: 100,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    marginRight: 12,
  },
  gmail: {
    width: 150,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    marginRight: 12,
  },
});
export const CategorySkeleton = () => {
  return (
    <SkeletonLoading background="#e0e0e0" highlight="#f5f5f5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={categorySkeletonStyles.container}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={categorySkeletonStyles.item} />
        ))}
      </ScrollView>
    </SkeletonLoading>
  );
};

const categorySkeletonStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  item: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    marginRight: 12,
  },
});
export const SubcategorySkeleton = ({ length = 4 }) => {
  return (
    <SkeletonLoading background="#e0e0e0" highlight="#f5f5f5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={SubcategorySkeletonStyles.container}
      >
        {Array.from({ length: length }).map((_, index) => (
          <View key={index} style={SubcategorySkeletonStyles.item} />
        ))}
      </ScrollView>
    </SkeletonLoading>
  );
};

const SubcategorySkeletonStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  item: {
    width: 80,
    height: 40,
    borderRadius: 100,
    backgroundColor: "#e0e0e0",
    marginRight: 12,
  },
});

export const ProductsSkeleton = ({ length = 4 }) => {
  return (
    <SkeletonLoading background="#e0e0e0" highlight="#f5f5f5">
      <View style={productsSkeletonStyles.container}>
        {Array.from({ length: length }).map((_, index) => (
          <View key={index} style={productsSkeletonStyles.card}>
            <View style={productsSkeletonStyles.image} />
            <View style={{ padding: 5 }}>
              <View style={productsSkeletonStyles.textLineShort} />
              <View style={productsSkeletonStyles.textLineLong} />
              <View style={productsSkeletonStyles.button} />
            </View>
          </View>
        ))}
      </View>
    </SkeletonLoading>
  );
};

const productsSkeletonStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  card: {
    width: "48%",
    marginBottom: 20,
    // padding: 5,
    borderColor: "#e0e0e0",
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: "solid",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  textLineShort: {
    width: "60%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginTop: 8,
  },
  textLineLong: {
    width: "80%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginTop: 6,
  },
  button: {
    width: "100%",
    height: 30,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginTop: 6,
  },
});

export const OrdersSkeleton = ({ length = 5 }) => {
  return (
    <SkeletonLoading background="#e0e0e0" highlight="#f5f5f5">
      <View style={ordersSkeletonStyle.container}>
        {Array.from({ length }).map((_, index) => (
          <View key={index} style={ordersSkeletonStyle.card}>
            <View style={ordersSkeletonStyle.header}>
              <View style={ordersSkeletonStyle.orderId} />
              <View style={ordersSkeletonStyle.status} />
            </View>
            <View style={ordersSkeletonStyle.details}>
              <View style={ordersSkeletonStyle.textLine} />
              <View style={ordersSkeletonStyle.textLineShort} />
            </View>
            <View style={ordersSkeletonStyle.footer}>
              <View style={ordersSkeletonStyle.button} />
            </View>
          </View>
        ))}
      </View>
    </SkeletonLoading>
  );
};

const ordersSkeletonStyle = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderId: {
    width: screenWidth * 0.4,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  status: {
    width: screenWidth * 0.2,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  details: {
    marginBottom: 12,
  },
  textLine: {
    width: "100%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginBottom: 6,
  },
  textLineShort: {
    width: "60%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  footer: {
    alignItems: "flex-end",
  },
  button: {
    width: 80,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
  },
});
export const NotificationsSkeleton = ({ length = 5 }) => {
  return (
    <SkeletonLoading background="#e0e0e0" highlight="#f5f5f5">
      <View style={notificationsSkeleton.container}>
        {Array.from({ length }).map((_, index) => (
          <View key={index} style={notificationsSkeleton.card}>
            <View style={notificationsSkeleton.header}>
              <View style={notificationsSkeleton.orderId} />
              <View style={notificationsSkeleton.status} />
            </View>
            <View style={notificationsSkeleton.details}>
              <View style={notificationsSkeleton.textLine} />
              {/* <View style={notificationsSkeleton.textLineShort} /> */}
            </View>
            {/* <View style={notificationsSkeleton.footer}>
              <View style={notificationsSkeleton.button} />
            </View> */}
          </View>
        ))}
      </View>
    </SkeletonLoading>
  );
};

const notificationsSkeleton = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderId: {
    width: screenWidth * 0.4,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  status: {
    width: screenWidth * 0.2,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  details: {
    marginBottom: 12,
  },
  textLine: {
    width: "100%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginBottom: 6,
  },
  textLineShort: {
    width: "60%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  footer: {
    alignItems: "flex-end",
  },
  button: {
    width: 80,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
  },
});

export const SettingsSkeleton = () => {
  return (
    <SkeletonLoading background="#e0e0e0" highlight="#f5f5f5">
      <View style={settingsSkeletonStyle.wrapper}>
        {/* First Name & Last Name */}
        <View style={settingsSkeletonStyle.row}>
          <View style={settingsSkeletonStyle.col}>
            <View style={settingsSkeletonStyle.label} />
            <View style={settingsSkeletonStyle.input} />
          </View>
          <View style={settingsSkeletonStyle.col}>
            <View style={settingsSkeletonStyle.label} />
            <View style={settingsSkeletonStyle.input} />
          </View>
        </View>

        {/* Email & Phone */}
        <View style={settingsSkeletonStyle.row}>
          <View style={settingsSkeletonStyle.col}>
            <View style={settingsSkeletonStyle.label} />
            <View style={settingsSkeletonStyle.input} />
          </View>
          <View style={settingsSkeletonStyle.col}>
            <View style={settingsSkeletonStyle.label} />
            <View style={settingsSkeletonStyle.input} />
          </View>
        </View>

        {/* Address */}
        <View style={settingsSkeletonStyle.full}>
          <View style={settingsSkeletonStyle.label} />
          <View style={settingsSkeletonStyle.addressInput} />
        </View>

        {/* Password */}
        <View style={settingsSkeletonStyle.full}>
          <View style={settingsSkeletonStyle.label} />
          <View style={settingsSkeletonStyle.input} />
        </View>

        {/* Driver License Upload */}
        <View style={settingsSkeletonStyle.full}>
          <View style={settingsSkeletonStyle.label} />
          <View style={settingsSkeletonStyle.uploadBtn} />
          <View style={settingsSkeletonStyle.uploadNote} />
        </View>

        {/* Save Button */}
        <View style={settingsSkeletonStyle.saveBtn} />
      </View>
    </SkeletonLoading>
  );
};

const settingsSkeletonStyle = StyleSheet.create({
  wrapper: { padding: 16 },
  row: { flexDirection: "row", marginBottom: 16 },
  col: { flex: 1, marginRight: 8 },
  full: { marginBottom: 16 },
  label: {
    width: "40%",
    height: 14,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  addressInput: {
    height: 70,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  uploadBtn: {
    width: 150,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  uploadNote: {
    width: "60%",
    height: 12,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginTop: 8,
  },
  saveBtn: {
    height: 48,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginTop: 8,
  },
});

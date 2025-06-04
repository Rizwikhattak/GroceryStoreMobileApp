import { images } from "@/constants/images";
import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: screenWidth } = Dimensions.get("window");
const itemWidth = screenWidth * 0.8; // 80% of screen width
const itemGap = 16; // Desired gap between items

const data = [
  // { title: "Item 1" },
  // { title: "Item 2" },
  // { title: "Item 3" },
  { title: "Item 1", image: images.BannerImg1 },
  { title: "Item 2", image: images.BannerImg2 },
  { title: "Item 3", image: images.BannerImg3 },
  { title: "Item 3", image: images.BannerImg4 },
  // Add more items as needed
];

const renderItem = ({ item }) => {
  return (
    <View style={[styles.item]}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
    </View>
    // <View style={styles.item}>
    //   {/* <Image source={item.image} style={styles.image} resizeMode="cover" /> */}
    //   <Text>Banner Image</Text>
    // </View>
  );
};

const PromoCarousel = () => (
  <Carousel
    loop
    width={screenWidth}
    height={200}
    autoPlay={true}
    autoPlayInterval={3000}
    data={data}
    scrollAnimationDuration={1000}
    renderItem={renderItem}
    modeConfig={{
      snapDirection: "left", // Align items to the left
      moveSize: itemWidth + itemGap, // Move size includes item width and gap
    }}
    style={{
      width: screenWidth,
    }}
  />
);

const styles = StyleSheet.create({
  item: {
    width: itemWidth,
    backgroundColor: "gray",
    borderRadius: 8,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default PromoCarousel;

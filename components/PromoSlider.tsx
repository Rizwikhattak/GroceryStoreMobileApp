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
  { title: "Item 1", image: images.groceryCardImg1 },
  { title: "Item 2", image: images.groceryCardImg2 },
  { title: "Item 3", image: images.groceryCardImg3 },
  // Add more items as needed
];

const renderItem = ({ item }) => {
  const { width: imageWidth, height: imageHeight } = Image.resolveAssetSource(
    item.image
  );
  const aspectRatio = imageWidth / imageHeight;

  return (
    <View style={[styles.item, { aspectRatio }]}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
    </View>
  );
};

const PromoCarousel = () => (
  <Carousel
    loop
    width={screenWidth}
    height={200}
    autoPlay={true}
    autoPlayInterval={1000}
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

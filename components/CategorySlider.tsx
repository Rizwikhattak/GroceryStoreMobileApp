import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { icons } from "@/constants/icons";
import { ChevronRight } from "lucide-react-native";

const { width: screenWidth } = Dimensions.get("window");
const itemWidth = screenWidth * 0.25;

const data = [
  { title: "Groceries", icon: icons.sprout, bgColor: "#4ab7b6" },
  { title: "Meet & Poultry", icon: icons.meat, bgColor: "#4b9dcb" },
  { title: "Packing", icon: icons.packing, bgColor: "#bb6e9c" },
  { title: "Category 4", icon: icons.plant, bgColor: "#a187d9" },
  { title: "Item 5", icon: icons.sprout, bgColor: "#4ab7b6" },
];

const CategorySlider = () => {
  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: item.bgColor }]}>
      <Image
        source={item.icon}
        style={styles.icon}
        resizeMode="contain"
        tintColor="#fff"
      />
      <Text style={styles.label}>{item.title}</Text>
    </View>
  );
  const flatListRef = useRef<FlatList>(null);

  const scrollToEnd = () => {
    flatListRef.current?.scrollToIndex({
      index: data.length - 1,
      animated: true,
    });
  };
  return (
    <View>
      <View
        className="mt-20 flex-row items-center justify-between"
        style={{ marginBottom: 20 }}
      >
        <Text className="text-xl font-semibold text-customblue-700">
          Categories
        </Text>
        <TouchableOpacity onPress={scrollToEnd}>
          <ChevronRight color="#888" size={20} />
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          // contentContainerStyle={{ paddingHorizontal: 16 }}
          style={{ zIndex: 10 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: itemWidth,
    height: 100,
    backgroundColor: "#ccc",
    borderRadius: 10,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginVertical: 10,
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    textAlign: "center",
    color: "#fff",
  },
});

export default CategorySlider;

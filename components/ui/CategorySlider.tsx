import React, { useEffect, useRef } from "react";
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
import { primary } from "@/constants/Colors";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "@/store/actions/categoriesActions";
import { useNavigation, useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");
const itemWidth = screenWidth * 0.25;
const { apiUrl } = Constants.expoConfig?.extra || { apiUrl: "" };

const CategorySlider = () => {
  const categories = useSelector((state: any) => state.categories);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await dispatch(getAllCategories()).unwrap();
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [dispatch]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/Category/${item._id}`)}
    >
      <Text style={styles.label}>{item.name}</Text>
    </TouchableOpacity>
    // <View style={styles.item}>
    //   {console.log(`${apiUrl}categories/photo/${item.photo}`)}
    //   <Image
    //     source={{
    //       uri:
    //         `${apiUrl}categories/photo/${item.photo}` ||
    //         "https://via.placeholder.com/150",
    //     }}
    //     style={styles.icon}
    //     resizeMode="cover"
    //   />
    //   <Text style={styles.label}>{item.name}</Text>
    // </View>
  );
  const flatListRef = useRef<FlatList>(null);

  const scrollToEnd = () => {
    flatListRef.current?.scrollToIndex({
      index: categories.data.length - 1,
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
          data={categories.data}
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
    backgroundColor: primary,
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

// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Image,
//   Dimensions,
//   TouchableOpacity,
// } from "react-native";
// import { icons } from "@/constants/icons";
// import { ChevronRight } from "lucide-react-native";
// import { primary } from "@/constants/Colors";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllCategories } from "@/store/actions/categoriesActions";

// const { width: screenWidth } = Dimensions.get("window");
// const itemWidth = screenWidth * 0.25;

// const CategorySlider = () => {
//   const data = [
//     { title: "Groceries", icon: icons.sprout, bgColor: primary },
//     { title: "Meet & Poultry", icon: icons.meat, bgColor: primary },
//     { title: "Packing", icon: icons.packing, bgColor: primary },
//     { title: "Category 4", icon: icons.plant, bgColor: primary },
//     { title: "Item 5", icon: icons.sprout, bgColor: primary },
//     // { title: "Groceries", icon: icons.sprout, bgColor: "#4ab7b6" },
//     // { title: "Meet & Poultry", icon: icons.meat, bgColor: "#4b9dcb" },
//     // { title: "Packing", icon: icons.packing, bgColor: "#bb6e9c" },
//     // { title: "Category 4", icon: icons.plant, bgColor: "#a187d9" },
//     // { title: "Item 5", icon: icons.sprout, bgColor: "#4ab7b6" },
//   ];
//   const renderItem = ({ item }: any) => (
//     <View style={[styles.item, { backgroundColor: item.bgColor }]}>
//       <Image
//         source={item.icon}
//         style={styles.icon}
//         resizeMode="contain"
//         tintColor="#fff"
//       />
//       <Text style={styles.label}>{item.title}</Text>
//     </View>
//   );
//   const flatListRef = useRef<FlatList>(null);

//   const scrollToEnd = () => {
//     flatListRef.current?.scrollToIndex({
//       index: data.length - 1,
//       animated: true,
//     });
//   };
//   return (
//     <View>
//       <View
//         className="mt-20 flex-row items-center justify-between"
//         style={{ marginBottom: 20 }}
//       >
//         <Text className="text-xl font-semibold text-customblue-700">
//           Categories
//         </Text>
//         <TouchableOpacity onPress={scrollToEnd}>
//           <ChevronRight color="#888" size={20} />
//         </TouchableOpacity>
//       </View>
//       <View>
//         <FlatList
//           ref={flatListRef}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           data={data}
//           renderItem={renderItem}
//           keyExtractor={(item, index) => index.toString()}
//           // contentContainerStyle={{ paddingHorizontal: 16 }}
//           style={{ zIndex: 10 }}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   item: {
//     width: itemWidth,
//     height: 100,
//     backgroundColor: "#ccc",
//     borderRadius: 10,
//     marginRight: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 5,
//     marginVertical: 10,
//   },
//   icon: {
//     width: 32,
//     height: 32,
//     marginBottom: 6,
//   },
//   label: {
//     fontSize: 12,
//     textAlign: "center",
//     color: "#fff",
//   },
// });

// export default CategorySlider;

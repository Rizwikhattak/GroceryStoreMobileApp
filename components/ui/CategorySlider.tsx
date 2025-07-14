import { CategorySkeleton } from "@/components/ui/Skeletons";
import { primary } from "@/constants/Colors";
import { getAllCategories } from "@/store/actions/categoriesActions";
import { setSelectedCategory } from "@/store/reducers/categoriesSlice";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const { width: screenWidth } = Dimensions.get("window");
const itemWidth = screenWidth * 0.28;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Fallback category icons mapping
const categoryIcons: { [key: string]: string } = {
  // core categories you asked about
  food: "🍽️", // plate & cutlery
  groceries: "🛒", // shopping cart :contentReference[oaicite:0]{index=0}
  packaging: "📦", // cardboard package / parcel :contentReference[oaicite:1]{index=1}
  cleaning: "🧹", // broom for sweeping & tidying :contentReference[oaicite:2]{index=2}
  produce: "🥦", // fresh broccoli as a universal veg icon :contentReference[oaicite:3]{index=3}
  Meat: "🥩",
  // existing mappings that already make sense
  home: "🏠",
  travel: "✈️",
  health: "🏥",
  automotive: "🚗",

  // catch-all for anything uncategorised
  default: "📦",
};

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

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    console.log(name);
    return categoryIcons[name] || categoryIcons.default;
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      style={[
        styles.item,
        {
          marginLeft: index === 0 ? 16 : 0,
          marginRight: index === categories.data.length - 1 ? 16 : 12,
        },
      ]}
      onPress={() => {
        dispatch(setSelectedCategory(item));
        router.push(`/Category/${item.name}`);
      }}
      activeOpacity={0.8}
    >
      {/* Background gradient overlay */}
      <View style={styles.gradientOverlay} />

      {/* Image container */}
      <View style={styles.imageContainer}>
        {item.photo ? (
          <Image
            source={{
              uri: `${apiUrl}categories/photo/${item.photo}`,
            }}
            style={styles.categoryImage}
            resizeMode="cover"
            onError={() => console.log("Image failed to load")}
          />
        ) : (
          <View style={styles.iconFallback}>
            <Text style={styles.iconEmoji}>{getCategoryIcon(item.name)}</Text>
          </View>
        )}

        {/* Overlay for better text readability */}
        <View style={styles.imageOverlay} />
      </View>

      {/* Content container */}
      <View style={styles.contentContainer}>
        <Text style={styles.label} numberOfLines={2}>
          {item.name}
        </Text>

        {/* Decorative element */}
        <View style={styles.decorativeDot} />
      </View>

      {/* Shine effect */}
      <View style={styles.shineEffect} />
    </TouchableOpacity>
  );

  const flatListRef = useRef<FlatList>(null);

  const scrollToEnd = () => {
    flatListRef.current?.scrollToIndex({
      index: categories.data.length - 1,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Explore Menu</Text>
          <View style={styles.headerUnderline} />
        </View>
        <TouchableOpacity
          style={styles.scrollButton}
          onPress={scrollToEnd}
          activeOpacity={0.7}
        >
          <ChevronRight color={primary} size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.sliderContainer}>
        {categories.isLoading ? (
          <CategorySkeleton />
        ) : (
          <FlatList
            ref={flatListRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories.data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
            style={styles.flatList}
            // decelerationRate="fast"
            snapToInterval={itemWidth + 12}
            snapToAlignment="start"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  headerUnderline: {
    width: 40,
    height: 3,
    backgroundColor: primary,
    borderRadius: 2,
    marginTop: 4,
    opacity: 0.8,
  },
  scrollButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(105, 17, 18, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(105, 17, 18, 0.2)",
  },
  sliderContainer: {
    position: "relative",
  },
  flatListContent: {
    paddingVertical: 8,
  },
  flatList: {
    zIndex: 10,
  },
  item: {
    width: itemWidth,
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    shadowColor: primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(105, 17, 18, 0.1)",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `linear-gradient(135deg, ${primary}E6, ${primary}CC)`,
    // backgroundColor: primary,
    opacity: 0.9,
    zIndex: 1,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  iconFallback: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(105, 17, 18, 0.1)",
  },
  iconEmoji: {
    fontSize: 32,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    zIndex: 2,
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  decorativeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ffffff",
    marginTop: 6,
    opacity: 0.8,
  },
  shineEffect: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 3,
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
//   ImageBackground,
// } from "react-native";
// import { icons } from "@/constants/icons";
// import { ChevronRight } from "lucide-react-native";
// import { primary } from "@/constants/Colors";
// import Constants from "expo-constants";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllCategories } from "@/store/actions/categoriesActions";
// import { useNavigation, useRouter } from "expo-router";
// import { CommonActions } from "@react-navigation/native";
// import AppText from "@/components/ui/AppText";
// import { setSelectedCategory } from "@/store/reducers/categoriesSlice";
// import { CategorySkeleton } from "@/components/ui/Skeletons";

// const { width: screenWidth } = Dimensions.get("window");
// const itemWidth = screenWidth * 0.28;
// const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// // Fallback category icons mapping
// const categoryIcons: { [key: string]: string } = {
//   food: "🍽️",
//   groceries: "🛒",
//   packaging: "📦",
//   cleaning: "🧹",
//   produce: "🥦",
//   home: "🏠",
//   travel: "✈️",
//   health: "🏥",
//   automotive: "🚗",
//   default: "📦",
// };

// const CategorySlider = () => {
//   const categories = useSelector((state: any) => state.categories);
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         await dispatch(getAllCategories()).unwrap();
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchCategories();
//   }, [dispatch]);

//   const getCategoryIcon = (categoryName: string) => {
//     const name = categoryName.toLowerCase();
//     return categoryIcons[name] || categoryIcons.default;
//   };

//   const navigateToCategory = (item: any) => {
//     dispatch(setSelectedCategory(item));

//     // Reset navigation state and navigate to category
//     navigation.dispatch(
//       CommonActions.reset({
//         index: 1,
//         routes: [
//           { name: "(tabs)" }, // Home screen
//           {
//             name: "Category",
//             params: { category: item.name },
//           },
//         ],
//       })
//     );
//   };

//   const renderItem = ({ item, index }: any) => (
//     <TouchableOpacity
//       style={[
//         styles.item,
//         {
//           marginLeft: index === 0 ? 16 : 0,
//           marginRight: index === categories.data.length - 1 ? 16 : 12,
//         },
//       ]}
//       onPress={() => navigateToCategory(item)}
//       activeOpacity={0.8}
//     >
//       {/* Background gradient overlay */}
//       <View style={styles.gradientOverlay} />

//       {/* Image container */}
//       <View style={styles.imageContainer}>
//         {item.photo ? (
//           <Image
//             source={{
//               uri: `${apiUrl}categories/photo/${item.photo}`,
//             }}
//             style={styles.categoryImage}
//             resizeMode="cover"
//             onError={() => console.log("Image failed to load")}
//           />
//         ) : (
//           <View style={styles.iconFallback}>
//             <Text style={styles.iconEmoji}>{getCategoryIcon(item.name)}</Text>
//           </View>
//         )}
//         <View style={styles.imageOverlay} />
//       </View>

//       {/* Content container */}
//       <View style={styles.contentContainer}>
//         <Text style={styles.label} numberOfLines={2}>
//           {item.name}
//         </Text>
//         <View style={styles.decorativeDot} />
//       </View>

//       {/* Shine effect */}
//       <View style={styles.shineEffect} />
//     </TouchableOpacity>
//   );

//   const flatListRef = useRef<FlatList>(null);

//   const scrollToEnd = () => {
//     flatListRef.current?.scrollToIndex({
//       index: categories.data.length - 1,
//       animated: true,
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <View style={styles.headerLeft}>
//           <Text style={styles.headerText}>Explore Menu</Text>
//           <View style={styles.headerUnderline} />
//         </View>
//         <TouchableOpacity
//           style={styles.scrollButton}
//           onPress={scrollToEnd}
//           activeOpacity={0.7}
//         >
//           <ChevronRight color={primary} size={22} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.sliderContainer}>
//         {categories.isLoading ? (
//           <CategorySkeleton />
//         ) : (
//           <FlatList
//             ref={flatListRef}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             data={categories.data}
//             renderItem={renderItem}
//             keyExtractor={(item, index) => index.toString()}
//             contentContainerStyle={styles.flatListContent}
//             style={styles.flatList}
//             decelerationRate="fast"
//             snapToInterval={itemWidth + 12}
//             snapToAlignment="start"
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 8,
//   },
//   headerContainer: {
//     marginBottom: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//   },
//   headerLeft: {
//     flex: 1,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#1a1a1a",
//     letterSpacing: -0.5,
//   },
//   headerUnderline: {
//     width: 40,
//     height: 3,
//     backgroundColor: primary,
//     borderRadius: 2,
//     marginTop: 4,
//     opacity: 0.8,
//   },
//   scrollButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "rgba(105, 17, 18, 0.1)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "rgba(105, 17, 18, 0.2)",
//   },
//   sliderContainer: {
//     position: "relative",
//   },
//   flatListContent: {
//     paddingVertical: 8,
//   },
//   flatList: {
//     zIndex: 10,
//   },
//   item: {
//     width: itemWidth,
//     height: 120,
//     borderRadius: 16,
//     overflow: "hidden",
//     position: "relative",
//     shadowColor: primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 8,
//     backgroundColor: "#ffffff",
//     borderWidth: 1,
//     borderColor: "rgba(105, 17, 18, 0.1)",
//   },
//   gradientOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: `linear-gradient(135deg, ${primary}E6, ${primary}CC)`,
//     opacity: 0.9,
//     zIndex: 1,
//   },
//   imageContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 0,
//   },
//   categoryImage: {
//     width: "100%",
//     height: "100%",
//   },
//   iconFallback: {
//     width: "100%",
//     height: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(105, 17, 18, 0.1)",
//   },
//   iconEmoji: {
//     fontSize: 32,
//   },
//   imageOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//   },
//   contentContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 12,
//     zIndex: 2,
//     alignItems: "center",
//   },
//   label: {
//     fontSize: 13,
//     fontWeight: "600",
//     textAlign: "center",
//     color: "#ffffff",
//     textShadowColor: "rgba(0, 0, 0, 0.5)",
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//     letterSpacing: 0.3,
//     lineHeight: 16,
//   },
//   decorativeDot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: "#ffffff",
//     marginTop: 6,
//     opacity: 0.8,
//   },
//   shineEffect: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     zIndex: 3,
//   },
// });

// export default CategorySlider;

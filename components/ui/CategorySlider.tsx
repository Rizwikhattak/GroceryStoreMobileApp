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
import { primary } from "@/constants/colors";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "@/store/actions/categoriesActions";
import { useNavigation, useRouter } from "expo-router";
import AppText from "@/components/ui/AppText";
import { setSelectedCategory } from "@/store/reducers/categoriesSlice";
import { CategorySkeleton } from "@/components/ui/Skeletons";

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
      // onPress={() => router.push(`/Category/${item._id}`)}
      onPress={() => {
        dispatch(setSelectedCategory(item));
        router.push(`/Category/${item.name}`);
      }}
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
      <View style={[styles.headerContainer, { marginBottom: 20 }]}>
        <Text style={styles.headerText}>Categories</Text>
        <TouchableOpacity onPress={scrollToEnd}>
          <ChevronRight color="#888" size={20} />
        </TouchableOpacity>
      </View>
      <View>
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
            // contentContainerStyle={{ paddingHorizontal: 16 }}
            style={{ zIndex: 10 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 5, // mt-20
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    justifyContent: "space-between", // justify-between
  },
  headerText: {
    fontSize: 20, // text-xl
    fontWeight: "600", // font-semibold
    color: "#000", // text-customblue-700 (assuming this is a dark blue color)
  },
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

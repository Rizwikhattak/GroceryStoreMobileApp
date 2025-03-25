import CategorySlider from "@/components/CategorySlider";
import PromoSlider from "@/components/PromoSlider";
import SearchInput from "@/components/SearchInput";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Link } from "expo-router";
import { ArrowRight, ChevronRight } from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-light-100">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
          paddingTop: 30,
        }}
      >
        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-2xl font-semibold text-primary-700">
            Premium
          </Text>
          <Text className="text-2xl font-semibold">Meats</Text>
        </View>
        <View className="mt-10 flex-row items-center justify-between gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-semibold">Welcome ,</Text>
            <Text className="text-xl font-semibold text-primary-700">
              Rizwan
            </Text>
          </View>
          <View className="justify-center size-10 items-center rounded-full bg-gray-200">
            <Image
              source={icons.bell}
              tintColor="#ea7173"
              className="size-5 rounded-full"
            />
          </View>
        </View>
        <View className="mt-4">
          <SearchInput />
        </View>
        <View className="mt-4">
          <PromoSlider />
        </View>
 
        <View className="mt-4">
          <CategorySlider />
        </View>
      </ScrollView>
    </View>
  );
}

// import { Link } from "expo-router";
// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text className="text-blue-500">Edit app/index.tsx to edit this ok.</Text>
//       {/* <Link href="/onboarding">Onboarding</Link>
//       <Link href="/items/avengers">avengers</Link> */}
//     </View>
//   );
// }

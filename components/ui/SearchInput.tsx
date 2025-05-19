import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Mic, Search } from "lucide-react-native";
import { primary } from "@/constants/Colors";
const SearchInput = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <View
      style={{
        borderRadius: 10,
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e5e7eb",
        paddingHorizontal: 20,
        paddingVertical: 3,
        gap: 2,
      }}
    >
      <Search color="#888" size={18} />
      <TextInput
        placeholder="Search Anything..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
        className="flex-1 text-base text-black "
      />
      <TouchableOpacity
        onPress={() => {
          /* Handle voice search */
        }}
      >
        {/* <Mic color="#4ab7b6" size={20} /> */}
        <Mic color={primary} size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;

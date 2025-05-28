import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Mic, Search } from "lucide-react-native";
import { primary } from "@/constants/colors";

const SearchInput = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <View style={styles.container}>
      <Search color="#888" size={18} />
      <TextInput
        placeholder="Search Anything..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />
      {/* <TouchableOpacity>
        <Mic color={primary} size={20} />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 20,
    paddingVertical: 3,
    gap: 2,
  },
  input: {
    flex: 1, // flex-1
    fontSize: 16, // text-base
    color: "#000000", // text-black
  },
});

export default SearchInput;

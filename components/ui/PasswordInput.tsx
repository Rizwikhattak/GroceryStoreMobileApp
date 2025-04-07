import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Mic, Search } from "lucide-react-native";
const PasswordInput = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <View
      className="flex-row items-center bg-gray-200 h-10 px-5 py-2 gap-2 "
      style={{
        borderRadius: 10,
      }}
    >
      <TextInput
        placeholder="Enter your password"
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
        className="flex-1 text-base text-black "
        secureTextEntry
      />
      <TouchableOpacity
        onPress={() => {
          /* Handle voice search */
        }}
      >
        <Mic color="#4ab7b6" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;

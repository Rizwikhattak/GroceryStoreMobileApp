import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Mic, Search } from "lucide-react-native";
import {
  dark,
  dark_secondary,
  light,
  light_secondary,
  primary,
} from "@/constants/colors";

const SearchInput = () => {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => getStyles(colorScheme), [colorScheme]);
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

const getStyles = (colorScheme: string) =>
  StyleSheet.create({
    container: {
      borderRadius: 10,
      height: 50,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        colorScheme === "light" ? light_secondary : dark_secondary,
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

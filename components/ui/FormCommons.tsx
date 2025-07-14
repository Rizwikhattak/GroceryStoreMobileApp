import React from "react";
import { Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
const InputCommon = ({
  control,
  name,
  label,
  placeholder,
  inputType = "default",
  Icon = <Ionicons name="alert-circle" size={20} color="red" />,
  secureTextEntry = false,
  ...props
}: any) => {
  return (
    <View style={inputStyles.container}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View style={inputStyles.inputContainer}>
              {error && Icon}
              <TextInput
                style={inputStyles.textInput}
                placeholder={placeholder}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType={inputType}
                secureTextEntry={secureTextEntry}
                {...props}
              />
            </View>
            {error && (
              <Text style={inputStyles.errorText}>{error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
};

const inputStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
    color: "red",
    fontSize: 12,
  },
});

export default InputCommon;

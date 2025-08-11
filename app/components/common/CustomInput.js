import React from "react";
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Constants from "../../util/Constants";

const { width: screenWidth } = Dimensions.get("window");

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  showPassword,
  setShowPassword,
  selectedLanguage,
  maxLength,
}) => {
  const isRTL = selectedLanguage === "ar";
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={[
          styles.input,
          isRTL && { textAlign: "right", writingDirection: "rtl" },
        ]}
        placeholder={placeholder}
        placeholderTextColor={Constants.COLOR.FONT_HINT}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={maxLength}
      />
      {setShowPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            resizeMode="contain"
            source={
              showPassword
                ? require("../../images/EyeView.png")
                : require("../../images/EyeHidden.png")
            }
            style={styles.eyeIconImage}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4E6EF",
    borderRadius: 100,
    columnGap: 4,
    paddingHorizontal: screenWidth * 0.03,
    marginBottom: screenWidth * 0.02,
    width: "100%",
    height: 50,
    justifyContent: "flex-start",
    alignSelf: "center",
    backgroundColor: "#e0e0e0",
  },
  inputIcon: {
    width: screenWidth * 0.05,
    height: screenWidth * 0.04,
    resizeMode: "contain",
    tintColor: "#82869D",
  },
  input: {
    flex: 1,
    fontWeight: "500",
    color: "#3f4254",
  },
  eyeIconImage: {
    width: screenWidth * 0.045,
    height: screenWidth * 0.045,
  },
});

export default CustomInput;

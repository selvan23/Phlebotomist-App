import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
// import { COLOR, FONT_FAMILY, FONT_SIZE } from '../../utils/Constants';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

const { width: screenWidth } = Dimensions.get("window");

const GradientButton = ({
  onPress,
  title,
  isResetPassword,
  isOTPGenerated,
  isSetwith,
  isSetheight

}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient

        colors={["#1E3989", "#9B71AA", "#87C699"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {title ? (
            <Text>{title}</Text>
          ) : isResetPassword === true ? (
            isOTPGenerated === true ? (
              <Text>Reset</Text>
            ) : (
              <Text>Get OTP</Text>
            )
          ) : (
            <Text>Verify</Text>
          )}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: screenWidth * 0.7,
    height: screenWidth * 0.12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: screenWidth * 0.05,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    // fontFamily: FONT_FAMILY.fontFamilyAnekLatinSemiBold,
  },
});

export default GradientButton;

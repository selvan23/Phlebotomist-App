/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageStyle,
  TextStyle,
  ViewStyle,
  Dimensions,
} from "react-native";

interface RiyalPriceProps {
  amount: string | number;
  containerStyle?: ViewStyle;
  iconStyle?: ImageStyle;
  textStyle?: TextStyle;
  dynamicHeight?: number;
  iconColor?: string;
}

const RiyalPrice: React.FC<RiyalPriceProps> = ({
  amount,
  containerStyle,
  iconStyle,
  textStyle,
  dynamicHeight = 0.03,
  iconColor,
}) => {
  const { width } = Dimensions.get("window");
  const baseUnit = width * dynamicHeight;

  return (
    <View style={[styles.price, containerStyle]}>
      <Image
        source={require("../../images/riyal.png")}
        style={[
          styles.riyalIcon,
          {
            height: baseUnit,
            width: baseUnit,
            tintColor: iconColor ? iconColor : "#000",
          },
          iconStyle,
        ]}
        resizeMode="contain"
      />
      <Text style={[styles.pricetext, { fontSize: baseUnit * 1.3 }, textStyle]}>
        {amount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  price: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    direction: "ltr",
  },
  riyalIcon: {
    marginRight: 4,
  },
  pricetext: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default RiyalPrice;

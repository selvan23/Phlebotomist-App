import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Constants from "../../util/Constants";
import Utility from "../../util/Utility";
import LinearGradient from "react-native-linear-gradient";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onClose,
}) => {
  return (

    <Modal transparent visible={visible} animationType='fade'>
     
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose}>
            <LinearGradient
              colors={["#1E3989", "#9B71AA", "#87C699"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.modalButtonText}>{"Ok"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    marginBottom: 10,
    textAlign: 'left',
    color:Constants.COLOR.THEME_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_ANEK_LATIN_SEMI_BOLD,
    fontSize: Constants.FONT_SIZE.XXL,
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
    color:"black",
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
    fontSize: Constants.FONT_SIZE.L,

  },
  modalButton: {
    width: deviceHeight * 0.1,
    height: deviceHeight * 0.05,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: Constants.COLOR.WHITE_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD,
    fontSize: Constants.FONT_SIZE.M,
  },
  gradientButton: {
    // paddingVertical: 10,
    // paddingHorizontal: 30,
    width: deviceHeight * 0.1,
    height: deviceHeight * 0.05,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomAlert;

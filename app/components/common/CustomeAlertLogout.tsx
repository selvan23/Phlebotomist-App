import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Constants from "../../util/Constants";
import Utility from "../../util/Utility";
import LinearGradient from "react-native-linear-gradient";
import { IconOutline } from "@ant-design/icons-react-native";

export interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  buttons?: Array<{
    text: string;
    onPress: () => void;
    style?: string;
  }>;
}

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;

const CustomeAlertLogout: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onClose,
  buttons,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <IconOutline name="logout" size={50} color={Constants.COLOR.PRIMARY_COLOR} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {Array.isArray(buttons) && buttons.length > 0 ? (
              buttons.map((btn, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={btn.onPress}
                  style={{ marginHorizontal: 5 }}
                >
                  <LinearGradient
                    colors={["#1E3989", "#9B71AA", "#87C699"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.modalButtonText}>{btn.text}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))
            ) : (
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
            )}
          </View>
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
    textAlign: "left",
    color: Constants.COLOR.THEME_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD,
    fontSize: Constants.FONT_SIZE.XXL,
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
    color: "black",
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
    width: deviceHeight * 0.1,
    height: deviceHeight * 0.05,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomeAlertLogout;

import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Linking,
  Platform,
} from "react-native";
import Constants from "../../util/Constants";
import Utility from "../../util/Utility";
import moment from "moment";
import { navigate } from "../../rootNavigation";
import { IconOutline } from "@ant-design/icons-react-native";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;

class DeliveryRow extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.subViewContainerOne}></View>
        <TouchableOpacity
          style={styles.subViewContainerTwo}
          onPress={() => {
            this._navigateTipsRowListScreen(this.props.item);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 5,
              marginTop: 4,
              justifyContent: "center",
            }}
          >
            <View>
              <Text style={[styles.nameTextStyle]} numberOfLines={1}>
                {`${this.props.item.Pt_Name}  ${this.props.item.First_Age} ${this.props.item.Gender_Code}`}
              </Text>
            </View>
            <View style={{ flex: 2, paddingLeft: 20, alignSelf: "center" }}>
              <Text style={[styles.dateTextStyle]} numberOfLines={2}>
                {moment(this.props.item.Booking_Date, "YYYY/MM/DD").format(
                  "DD/MM/YYYY"
                )}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                paddingHorizontal: 15,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <IconOutline
                style={{
                  marginHorizontal: 5,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                name="environment"
                color={Constants.COLOR.THEME_COLOR}
                size={deviceHeight / 40}
              />
              <Text
                style={{
                  alignSelf: "center",
                  color: Constants.COLOR.THEME_COLOR,
                  fontSize: Constants.FONT_SIZE.SM,
                  textAlign: "center",
                }}
                numberOfLines={2}
              >
                {this.props.item.Branch_Name}
              </Text>
            </View>
          </View>
          <View style={styles.pendingMainView}>
            <View style={styles.pendingSubViewOne}>
              <View style={styles.rowDirectionView}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <Image
                    source={require("../../images/booking_id_img.png")}
                    style={styles.imageStyle}
                  />
                  <Text
                    style={styles.pendingdeliverTextStyle}
                    numberOfLines={2}
                  >
                    {this.props.item.Booking_No}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    paddingRight: 0,
                    marginLeft: 5,
                  }}
                >
                  <Image
                    source={require("../../images/sample_id_img.png")}
                    style={styles.imageStyle}
                  />
                  <Text
                    style={[styles.pendingdeliverTextStyle]}
                    numberOfLines={2}
                  >
                    {this.props.item.Sid_No}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.pendingSubViewTwo}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignSelf: "center",
                }}
              >
                <Text style={styles.pendingdeliverTextStyle} numberOfLines={2}>
                  SID DATE{" "}
                  {moment(this.props.item.Sid_Date, "YYYY/MM/DD").format(
                    "DD/MM/YYYY"
                  )}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View
              style={[
                styles.tagBackground,
                { backgroundColor: Constants.COLOR.DELIVERY_PHONE_BG },
              ]}
            >
              <View style={styles.circleBackground}>
                <Image
                  style={styles.callImage}
                  source={require("../../images/callIcon.png")}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.dialCall(this.props.item.Mobile_No);
                }}
              >
                <Text style={styles.phoneTextStyle}>
                  {this.props.item.Mobile_No}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  dialCall(number) {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  }

  _navigateTipsRowListScreen = (item) => {
    // Actions.deliveryDetails({
    //   deliveryDetail: item,
    //   isFromPending: this.props.isFromPending,
    // });
    navigate("deliveryDetails", {
      deliveryDetail: item,
      isFromPending: this.props.isFromPending,
    });
  };
}

export default DeliveryRow;
const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: "row",
    height: Platform.OS === "android" ? deviceHeight / 5.5 : null,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "#fbfbfb",
  },

  subViewContainerOne: {
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: Constants.COLOR.THEME_COLOR,
  },

  subViewContainerTwo: {
    flex: 3,
    justifyContent: "space-around",
    // borderLeftWidth: 2,
    // borderRightWidth: 1,
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftColor: "#4C4C4C",
    borderBottomColor: "#F1F1F1",
    borderTopColor: "#F1F1F1",
    borderRightColor: "#F1F1F1",
    paddingHorizontal: 5,
    backgroundColor: "#e6ecffff",
  },

  nameTextStyle: {
    alignSelf: "flex-start",
    fontSize: Constants.FONT_SIZE.M,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_WIX_REGULAR,
    padding: 5,
    color: "#000000",
    fontWeight: "bold",
    width: deviceWidth / 2.5,
  },

  dateTextStyle: {
    alignSelf: "flex-start",
    fontSize: Constants.FONT_SIZE.SM,
    padding: 5,
    paddingHorizontal: Platform.OS === "android" ? 5 : 10,
    color: "#000000",
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  pendingMainView: {
    flexDirection: "row",
    marginLeft: 5,
    flex: 1,
    // backgroundColor: '#f9aa2a',
  },
  pendingSubViewOne: {
    flexDirection: "row",
    alignSelf: "center",
    flex: 7,
  },
  pendingSubViewTwo: {
    flexDirection: "row",
    flex: 7,
    // justifyContent: 'flex-end',
  },
  pendingdeliverTextStyle: {
    alignSelf: "flex-start",
    fontSize: Constants.FONT_SIZE.SM,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
    padding: Platform.OS === "android" ? 5 : 5,
    height: "100%",
    flex: 1,
    color: "#000000ff",
  },
  phoneTextStyle: {
    padding: 5,
    color: "white",
    fontSize: Constants.FONT_SIZE.XS,
  },
  imageStyle: {
    width: 14,
    height: 14,
    alignSelf: "center",
  },

  tagBackground: {
    borderRadius: 12,
    alignSelf: "flex-start",
    marginHorizontal: 10,
    marginBottom: 5,
    flexDirection: "row",
  },

  rowDirectionView: {
    flexDirection: "row",
  },

  circleBackground: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: Constants.COLOR.DELIVERY_SHADOW_BG,
  },
  timeBackground: {
    backgroundColor: Constants.COLOR.DELIVERY_SHADOW_BG,
    borderBottomStartRadius: 25,
    justifyContent: "flex-end",
  },
  callImage: {
    width: 12,
    height: 12,
    alignSelf: "center",
    marginTop: 5,
  },
});

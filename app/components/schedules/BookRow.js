/*************************************************
 * SukraasLIS - Phlebotomist
 * PendingScreen.js
 * Created by Abdul on 22/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

"use strict";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
} from "react-native";
import Constants from "../../util/Constants";
import Utility from "../../util/Utility";
import { IconOutline } from "@ant-design/icons-react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import moment from "moment";

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;

const deviceWidth = Dimensions.get("window").width;

class BookRow extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let month = this.props.rowData.Visit_Date_Desc.split(" ")[0];
    let date =
      this.props.rowData.Visit_Date_Desc.split(" ")[1] +
      " " +
      this.props.rowData.Visit_Date_Desc.split(" ")[2];
    let name = this.props.rowData.Full_Name.split("(")[0];

    return (
      <View style={styles.mainContainer}>
        <View style={styles.subViewContainerOne}>
          <Text numberOfLines={1} style={styles.monthTextStyle}>
            {month}
          </Text>
          <Text
            style={{
              alignSelf: "flex-end",
              fontSize: Constants.FONT_SIZE.SM,
              color: Constants.COLOR.BOOK_DATE_TIME_TEXT_COLOR,
              paddingHorizontal: 6,
              paddingEnd: 10,
              fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
            }}
          >
            {date}
          </Text>
          <View style={styles.timeBackground}>
            <Text style={[styles.dateTimeTextStyle, { alignSelf: "center" }]}>
              {this.props.rowData.Visit_Time}
            </Text>
          </View>
        </View>

        <View style={styles.subViewContainerTwo}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 5,
              marginHorizontal: 6,
            }}
          >
            <Text
              style={[styles.addressTextStyle, { width: deviceHeight / 5 }]}
              numberOfLines={2}
            >
              {this.props.rowData.Pt_Name}, {this.props.rowData.First_Age},{" "}
              {this.props.rowData.Gender_Code}
            </Text>
            <View
              style={{
                padding: 5,
                flex: 1,
                flexDirection: "row",
                marginLeft: 10,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <Image
                style={{
                  width: deviceHeight / 45,
                  height: deviceHeight / 45,
                  marginHorizontal: 3,
                  tintColor: "red",
                }}
                source={require("../../images/placeholder.png")}
              />
              <Text
                style={{
                  marginRight: 5,
                  alignSelf: "center",
                  color: "red",
                  fontSize: Constants.FONT_SIZE.S,
                  fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_LIGHT,
                }}
                numberOfLines={1}
              >
                {this.props.rowData.Branch_Name}
              </Text>
            </View>
          </View>

          <View style={styles.bookingIdMainView}>
            <View style={styles.bookingIdSubViewOne}>
              <View style={styles.rowDirectionView}>
                <IconOutline name="carry-out" size={18} />
                <Text
                  style={[
                    styles.bookingIdTextStyle,
                    // { height: Platform.OS === "ios" ? 20 : 15 },
                  ]}
                >
                  {this.props.rowData.Booking_No}
                </Text>
              </View>
            </View>
            <View style={styles.bookingIdSubViewTwo}>
              {this.props.isFrom === "completed" ? (
                <View style={[styles.rowDirectionView, { flex: 1, width: 60 }]}>
                  {this._displaySidNoImg()}
                  {this._displaySidNoText()}
                </View>
              ) : this.props.isFrom !== "cancelled" ? (
                <Text
                  style={{
                    flex: 1,
                    alignSelf: "center",
                    justifyContent: "center",
                    paddingLeft: 30,
                    height: 20,
                    color:
                      this.props.rowData.Payment_Type === "Online Payment"
                        ? Constants.COLOR.PAYMENT_STATUS_ONLINE
                        : Constants.COLOR.CASH_ON_HAND,
                    fontSize: Constants.FONT_SIZE.SM,
                    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
                  }}
                  numberOfLines={2}
                >
                  {this.props.rowData.Payment_Type}
                </Text>
              ) : (
                <Text
                  style={{
                    flex: 1,
                    alignSelf: "center",
                    justifyContent: "center",
                    paddingLeft: 30,
                    height: 20,
                    color:
                      this.props.rowData.Payment_Type === "Online Payment"
                        ? Constants.COLOR.PAYMENT_STATUS_ONLINE
                        : Constants.COLOR.CASH_ON_HAND,
                    fontSize: Constants.FONT_SIZE.SM,
                    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
                  }}
                />
              )}
              <IconOutline name="right" style={{marginRight: 10}} size={20} />
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={[styles.tagBackground]}>
              <Text style={styles.statusTextStyle}>
                {this.props.rowData.Branch_Name}
              </Text>
            </View>
            {this.props.rowData.Mobile_No !== undefined &&
            this.props.rowData.Mobile_No !== "" ? (
              <TouchableOpacity
                onPress={() => {
                  this.dialCall();
                }}
                style={{
                  borderRadius: 12,
                  alignSelf: "flex-start",
                  marginHorizontal: Platform.OS === "android" ? 20 : 15,
                  marginBottom: 8,
                  marginTop: 10,
                  flexDirection: "row",
                  backgroundColor: Constants.COLOR.BOOK_PHONE_BG,
                }}
              >
                <View style={styles.circleBackground}>
                  <Image
                    style={styles.callImage}
                    source={require("../../images/callIcon.png")}
                  />
                </View>
                <Text style={styles.statusTextStyle}>
                  {this.props.rowData.Mobile_No}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  dialCall() {
    let phoneNumber = "";
    let number = this.props.rowData.Mobile_No;
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  }

  _displayPayNow = () => {
    if (this.props.rowData.Due_Amount === 0) {
      return <View />;
    } else {
      return (
        <TouchableOpacity style={styles.blueBackground}>
          <Text style={styles.payNowText}> Pay Now </Text>
        </TouchableOpacity>
      );
    }
  };

  _displaySidNoText = () => {
    if (
      this.props.rowData.Sid_No.trim() !== "" &&
      this.props.rowData.Sid_No !== undefined &&
      this.props.rowData.Sid_No !== null
    ) {
      return (
        <Text
          style={[
            styles.bookingIdTextStyle,
            // { height: Platform.OS === "ios" ? 20 : 'auto' },
          ]}
          numberOfLines={1}
        >
          {this.props.rowData.Sid_No}
        </Text>
      );
    } else {
      return null;
    }
  };

  _displaySidNoImg = () => {
    console.log("sid data: ", this.props.rowData);
    if (
      this.props.rowData.Sid_No.trim() !== "" &&
      this.props.rowData.Sid_No !== undefined &&
      this.props.rowData.Sid_No !== null
    ) {
      return (
        <Image
          source={require("../../images/sample_id_img.png")}
          style={styles.imageStyle}
        />
      );
    } else {
      return null;
    }
  };

  _displayEditView = () => {
    if (this.props.rowData.Sid_No !== "") {
      return (
        <View style={[styles.rowDirectionView, { flex: 1, width: 60 }]}>
          <Image
            resizeMode="contain"
            source={require("../../images/edit_light.png")}
            style={styles.imageStyle}
          />
          <Text style={[styles.bookingIdTextStyle, { padding: 20 }]}>
            {this.props.rowData.Sid_No}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: "row",
    height: Platform.OS === "android" ? deviceHeight / 7 : null,
  },
  subViewContainerOne: {
    flex: 0.8,
    backgroundColor: Constants.COLOR.PRIMARY_COLOR,
    borderBottomStartRadius: 25,
    borderTopStartRadius: 25,
    justifyContent: "space-between",
  },
  subViewContainerTwo: {
    flex: 2,
    justifyContent: "space-around",
    borderWidth: 0.3,
    borderColor: "gray",
    borderBottomEndRadius: 25,
    borderTopEndRadius: 25,
  },
  monthTextStyle: {
    marginTop: 5,
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.BOOK_DATE_TIME_TEXT_COLOR,
    alignSelf: "flex-end",
    // paddingVertical: 4,
    paddingEnd: 10,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  dateTimeTextStyle: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.BLACK_COLOR,
    paddingVertical: 6,
    paddingHorizontal: 6,
    paddingEnd: 10,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  addressTextStyle: {
    alignSelf: "flex-start",
    fontSize: Constants.FONT_SIZE.SM,
    padding: 5,
    color: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD,
  },
  bookingIdMainView: {
    flexDirection: "row",
    marginLeft: 10,
    flex: 1,
    marginTop: 10,
  },
  bookingIdSubViewOne: {
    flexDirection: "row",
    alignSelf: "center",
    flex: 1.5,
  },
  bookingIdSubViewTwo: {
    flexDirection: "row",
    alignSelf: "center",
    flex: 2.5,
  },
  bookingIdTextStyle: {
    flex: 1,
    height: '100%',
    alignSelf: "flex-start",
    fontSize: Constants.FONT_SIZE.S,
    paddingHorizontal: 5,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    color: Constants.COLOR.BOOK_ID_TEXT_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_LIGHT,
  },
  statusTextStyle: {
    padding: 4,
    color: "black",
    fontSize: Constants.FONT_SIZE.S,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  imageStyle: {
    width: 14,
    height: 14,
    alignSelf: "center",
  },
  nextImageStyle: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    paddingRight: 5,
    alignSelf: "center",
  },
  tagBackground: {
    flex: 1,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 5,
    flexDirection: "row",
  },
  blueBackground: {
    backgroundColor: Constants.COLOR.BOOK_PAY_BG,
    borderRadius: 5,
    marginRight: 5,
    alignSelf: "center",
  },
  rowDirectionView: {
    flexDirection: "row",
    marginHorizontal: 6,
    alignSelf: "center",
  },
  payNowText: {
    padding: 5,
    color: "white",
    fontSize: Constants.FONT_SIZE.XS,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  circleBackground: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: Constants.COLOR.BOOK_SHADOW_BG,
    alignSelf: "flex-start",
  },
  timeBackground: {
    backgroundColor: Constants.COLOR.SECONDARY_COLOR,
    borderBottomStartRadius: 25,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  callImage: {
    width: 12,
    height: 12,
    alignSelf: "center",
    marginTop: 5,
  },
});

export default BookRow;

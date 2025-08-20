/*************************************************
 * SukraasLIS
 * @exports
 * @class ScanBarcodeView.js
 * @extends Component
 * Created by Sankar on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

"use strict";
import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  TextInput,
} from "react-native";

import Utility from "../../util/Utility";
import Constants from "../../util/Constants";
import DeviceInfo from "react-native-device-info";
import Permissions from "react-native-permissions";
import PropTypes from "prop-types";
import { navigate, navigationRef } from "../../rootNavigation";
import { IconOutline } from "@ant-design/icons-react-native";

let scene = "sampleCollectionScreen";
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;

export default class ScanBarcodeView extends Component {
  static propTypes = {
    data: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.props = props;
    // this.state = {
    //   data: this.props.data,
    //   index: this.props.index, 
    // };
    console.log("constuctor scan bar code view: ", this.props);
  }

  _setBarCodeValue(data) {
    console.log("setbarcodeval : ", data);
    this.props.onBarCodeChange(data.QR_Code_Value, data.ItemIndex);
  }

  // componentDidUpdate() {
  //   console.log("component did update scan: ", this.props);
  //   if (
  //     this.state.index !== this.props.index &&
  //     JSON.stringify(data) !== JSON.stringify(this.props.data)
  //   ) {
  //     this.setState({
  //       data: this.props.data,
  //       index: this.props.index,
  //     });
  //   }
  // }

  render() {
    const { data, index } = this.props;
    try {
      return (
        <View style={styles.barcodeMainView}>
          <View style={styles.subContainer}>
            <Text style={styles.barcodeMainTitle}>Scan Barcode</Text>
            <Text
              style={[
                styles.barcodeMainTitle,
                {
                  color:
                    data.isVerifiedBarCode || data.IsAlready_Collected
                      ? Constants.COLOR.GREEN_COLOR
                      : Constants.COLOR.THEME_COLOR,
                },
              ]}
            >
              {data.isVerifiedBarCode || data.IsAlready_Collected
                ? "Captured"
                : "Pending"}
            </Text>
          </View>
          <View style={styles.viewTubeStyle}>
            {data.Specimen_Desc?.trim() !== "" && (
              <>
                <Text
                  style={{
                    color: Constants.COLOR.FONT_COLOR_DEFAULT,
                    fontFamily:
                      Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
                  }}
                >
                  {data.Specimen_Desc}
                </Text>
              </>
            )}
            {data.Container_Desc?.trim() !== "" && (
              <>
                <Text
                  style={{
                    color: Constants.COLOR.FONT_COLOR_DEFAULT,
                    paddingHorizontal: 5,
                    fontFamily:
                      Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
                  }}
                >
                  -
                </Text>
                <View
                  style={[
                    styles.squareView,
                    { backgroundColor: data.Container_Color },
                  ]}
                />
                <Text
                  style={{
                    marginLeft: 4,
                    color: Constants.COLOR.FONT_COLOR_DEFAULT,
                    fontFamily:
                      Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
                  }}
                >
                  {data.Container_Desc}
                </Text>
              </>
            )}
          </View>
  
          <View style={styles.barcodeTextScanView}>
            <View style={styles.barcodeTextSubmitView}>
              <TextInput
                style={styles.barcodeText}
                placeholder="Enter the BarCode"
                placeholderTextColor={"#e4e4e4"}
                value={
                  data.IsAlready_Collected
                    ? data.Barcode_Value
                    : data.scannedValue
                }
                editable={
                  data.IsAlready_Collected
                    ? !data.IsAlready_Collected
                    : !data.isVerifiedBarCode
                }
                keyboardType="default"
                underlineColorAndroid="transparent"
                returnKeyType={"done"}
                onChangeText={(scanValue) =>
                  this.props.onBarCodeChange(scanValue, index)
                }
              />
              {data.isVerifiedBarCode || data.IsAlready_Collected ? (
                <IconOutline
                  style={{ flex: 1, alignSelf: "center" }}
                  name="check"
                  size={deviceHeight / 35}
                  color={Constants.COLOR.GREEN_COLOR}
                />
              ) : null}
            </View>
            <TouchableOpacity
              disabled={
                data.IsAlready_Collected
                  ? data.IsAlready_Collected
                  : data.isVerifiedBarCode
              }
              onPress={() => {
                // if (Actions.currentScene === scene) {
                if (navigationRef.getCurrentRoute().name === scene) {
                  this._openScanner(index, data);
                }
              }}
            >
              <IconOutline name="barcode" size={45} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity
              disabled={
                data.IsAlready_Collected
                  ? data.IsAlready_Collected
                  : data.isVerifiedBarCode
              }
              style={styles.submitButton}
              onPress={() => {
                this.props.onSubmitClick(data.scannedValue, index);
              }}
            >
              <Text style={styles.submitTextStyle}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={data.IsAlready_Collected}
              style={{
                paddingVertical: 10,
                borderRadius: 5,
                paddingHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                this.props.onResetBarCode(index);
              }}
            >
              <Text
                style={[
                  styles.submitTextStyle,
                  {
                    color: Constants.COLOR.PRIMARY_COLOR,
                    fontFamily:
                      Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD,
                  },
                ]}
              >
                Reset Code
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.barcodeListItemView}>
            {typeof data.Test_List === "object" &&
              data.Test_List.length > 0 && (
                <>
                  <FlatList
                    extraData={this.state}
                    data={data.Test_List}
                    renderItem={({ item }, idx) => (
                      <Item
                        key={idx}
                        title={item.Service_Name}
                        QrCode={data.isVerifiedBarCode}
                      />
                    )}
                    keyExtractor={(_, idx) => idx}
                    listKey={(_, index) => `_key${index.toString()}`}
                  />
                </>
              )}
          </View>
        </View>
      );
    } catch (Error) {
      console.log('render error: ', Error);
      return (
        <>
          <Text
            style={{
              fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
            }}
          >
            Error
          </Text>
        </>
      );
    }
  }

  _openScanner = (index, data) => {
    if (Platform.OS === "ios") {
      // Actions.QRScanner({
      //   index: index,
      //   data: this.props.data,
      // });
      navigate("QRScanner", {
        index: index,
        data: this.props.data,
        onGoBack: this._setBarCodeValue.bind(this),
      });
    } else {
      const systemVersion = DeviceInfo.getSystemVersion();
      if (parseFloat(systemVersion) >= 6) {
        Permissions.check("android.permission.CAMERA").then((response) => {
          if (response === "granted") {
            // Actions.QRScanner({
            //   index: index,
            //   data: this.props.data,
            // });
            navigate("QRScanner", {
              index: index,
              data: this.props.data,
              onGoBack: this._setBarCodeValue.bind(this),
            });
          } else {
            Permissions.request("android.permission.CAMERA").then(
              (permission) => {
                if (permission === "granted") {
                  // Actions.QRScanner({
                  //   index: index,
                  //   data: this.props.data,
                  // });
                  navigate("QRScanner", {
                    index: index,
                    data: this.props.data,
                    onGoBack: this._setBarCodeValue.bind(this),
                  });
                } else {
                  Alert.alert("Please Allow access to scan QR Code");
                }
              }
            );
          }
        });
      } else {
        // Actions.QRScanner({
        //   index: index,
        //   data: this.props.data,
        // });
        navigate("QRScanner", {
          index: index,
          data: this.props.data,
          onGoBack: this._setBarCodeValue.bind(this),
        });
      }
    }
  };
}

function Item({ title, QrCode }) {
  console.log(' flatlist item : ', title, QrCode);
  return (
    <View style={styles.barcodeListItemContainer}>
      <Text style={styles.barcodeListItemText}>{title}</Text>
      {QrCode === null || QrCode === false ? (
        <></>
      ) : (
        <IconOutline
          style={{ marginLeft: 5 }}
          name="check"
          size={deviceHeight / 58}
          color={Constants.COLOR.GREEN_COLOR}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  barcodeMainView: {
    backgroundColor: Constants.COLOR.LIGHT_GREY,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  barcodeMainTitle: {
    fontSize: Constants.FONT_SIZE.SM,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  barcodeTextScanView: {
    flexDirection: "row",
    alignItems: "center",
  },
  barcodeTextSubmitView: {
    flex: 5,
    flexDirection: "row",
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 5,
    padding: 5,
    justifyContent: "center",
    marginRight: 10,
  },
  barcodeScanView: { flex: 1, alignContent: "center" },
  barcodeScanImage: {
    flex: 1,
    marginStart: 10,
    alignSelf: "center",
    width: deviceHeight / 25,
    height: deviceHeight / 25,
  },
  barcodeText: {
    flex: 10,
    alignSelf: "center",
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.BLACK_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  barcodeTextVerifyImage: {
    flex: 1,
    alignSelf: "center",
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  barcodeListItemView: { padding: 10 },
  barcodeListItemContainer: { flexDirection: "row", padding: 3 },
  barcodeListItemText: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  barcodeListItemImage: {
    alignSelf: "center",
    marginLeft: 10,
    width: deviceHeight / 65,
    height: deviceHeight / 65,
  },
  viewTubeStyle: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  squareView: {
    height: 15,
    width: 15,
    // backgroundColor: Constants.COLOR.THEME_COLOR,
    marginHorizontal: 5,
  },
  submitButton: {
    paddingVertical: 10,
    backgroundColor: Constants.COLOR.PRIMARY_COLOR,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  submitTextStyle: {
    color: Constants.COLOR.WHITE_COLOR,
    fontSize: Constants.FONT_SIZE.SM,
    fontWeight: "600",
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

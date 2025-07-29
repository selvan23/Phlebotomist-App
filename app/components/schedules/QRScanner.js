import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableHighlight,
  TextInput,
} from "react-native";

import { RNCamera } from "react-native-camera";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import PropTypes from "prop-types";
import { nativationPop, navigationSetParams } from "../../rootNavigation";
let i = 0;
export default class QRScanner extends Component {
  static propTypes = {
    index: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      isShowLoading: false,
      loadingText: "LOADING",
      cameraPermission: false,
      data: "",
      torchOn: false,
      selectedIndex: 0,
    };
    this.onBarCodeRead = this.onBarCodeRead.bind(this);
    this.barCodeRead = false;
  }

  barcodeRecognized = ({ barcodes }) => {
    console.log("barcode recog", barcodes);
    // barcodes.map(this.onBarCodeRead);
  };

  /*
   * On QR code reads
   */

  onBarCodeRead(e) {
    console.log("onBarCodeRead ==== e", e.data, e.type);
    // this.i++;
    if (e.data && e.type !== "UNKNOWN_FORMAT") {
      // this.setState({isShowLoading: true});
      // this.setState({data: e.data});
      if (!this.barCodeRead) {
        this.replaceScreen(e.data);
        this.barCodeRead = true;
      }
    } else {
    }
  }

  /*
   * Navigate and remove the privious screen
   */
  replaceScreen = (qrData) => {
    // Actions.pop({
    //   refresh: {
    //     QR_Code_Value: qrData,
    //     ItemIndex: this.props.route.params.index,
    //     timeStamp: new Date().getTime(),
    //   },
    //   timeout: 1,
    // });
    console.log("replacing screen", qrData);
    // navigationSetParams({
    //   QR_Code_Value: qrData,
    //   ItemIndex: this.props.route.params.index,
    //   timeStamp: new Date().getTime(),
    // });
    if (typeof this.props.route.params.onGoBack === "function") {
      this.props.route.params.onGoBack({
        QR_Code_Value: qrData,
        ItemIndex: this.props.route.params.index,
        timeStamp: new Date().getTime(),
      });
    }
    setTimeout(() => {
      nativationPop();
    }, 1000);
  };

  render() {
    if (this.state.isShowLoading) {
      return (
        <View style={styles.loadingView}>
          <ActivityIndicator color="red" size={"small"} />
          <Text
            style={{ fontSize: deviceHeight / 45, margin: deviceWidth / 24 }}
          >
            {this.state.loadingText}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {/* <View
            style={{
              // position: 'absolute',
              marginTop: 10,
              marginHorizontal: 100,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TextInput
              style={{
                width: 200,
                height: 60,
                fontSize: 22,
                paddingLeft: 20,
                color: 'black',
                backgroundColor: '#EFEFEF',
                borderWidth: 2,
                borderColor: 'gainsboro',
                borderRadius: 10,
              }}
              returnKeyType={'done'}
              autoCapitalize="none"
              autoCorrect={true}
              onChangeText={(txtTempScanValue) =>
                this.setState({txtTempScanValue})
              }
              value={this.state.txtTempScanValue}
              autoFocus={true}
            />
            <TouchableHighlight
              underlayColor={'transparent'}
              style={{backgroundColor: 'red', marginLeft: 50}}
              onPress={() => this.onBarCodeRead(this.state.txtTempScanValue)}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#FFF',
                  paddingVertical: 10,
                  paddingHorizontal: 50,
                }}>
                SCAN BUTTON
              </Text>
            </TouchableHighlight>
          </View> */}

          <RNCamera
            style={styles.preview}
            // onGoogleVisionBarcodesDetected={() => {
            //   console.log('on barcode read');
            // }}
            ref={(cam) => (this.camera = cam)}
            // type={this.state.camera.type}
            defaultTouchToFocus
            // flashMode={this.state.camera.flashMode}
            mirrorImage={false}
            onBarCodeRead={this.onBarCodeRead}
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            androidCameraPermissionOptions={{
              title: "Permission to use camera",
              message: "We need your permission to use your camera",
              buttonPositive: "Ok",
              buttonNegative: "Cancel",
            }}
          >
            <View style={styles.rectangle}>
              <View style={styles.rectangleColor} />
              <View style={styles.topLeft} />
              <View style={styles.topRight} />
              <View style={styles.bottomLeft} />
              <View style={styles.bottomRight} />
            </View>
            {/* {this.renderBarcodes()} */}
          </RNCamera>
          <View style={styles.close}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                this.setState({ isShowLoading: true });
                // Actions.pop();
                nativationPop();
              }}
            >
              <Image
                resizeMode="contain"
                style={styles.buttonIcon}
                source={require("../../images/Back.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    // top: 90,
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: "center",
  },
  buttonIcon: {
    height: deviceWidth * 0.1,
    width: deviceWidth * 0.16,
    tintColor: "white",
  },
  backBtn: {
    marginTop: 20,
  },
  loadingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rectangle: {
    position: "absolute",
    borderLeftColor: "rgba(0, 0, 0, .6)",
    borderRightColor: "rgba(0, 0, 0, .6)",
    borderTopColor: "rgba(0, 0, 0, .6)",
    borderBottomColor: "rgba(0, 0, 0, .6)",
    borderLeftWidth: deviceWidth / 1,
    borderRightWidth: deviceWidth / 1,
    borderTopWidth: deviceHeight / 3,
    borderBottomWidth: deviceHeight / 1,
  },
  rectangleColor: {
    height: deviceWidth / 1.4,
    width: deviceWidth / 1.1,
    backgroundColor: "transparent",
  },
  topLeft: {
    width: 50,
    height: 50,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    position: "absolute",
    left: -1,
    top: -1,
    borderLeftColor: "green",
    borderTopColor: "green",
  },
  topRight: {
    width: 50,
    height: 50,
    borderTopWidth: 2,
    borderRightWidth: 2,
    position: "absolute",
    right: -1,
    top: -1,
    borderRightColor: "green",
    borderTopColor: "green",
  },
  bottomLeft: {
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    position: "absolute",
    left: -1,
    bottom: -1,
    borderLeftColor: "green",
    borderBottomColor: "green",
  },
  bottomRight: {
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    position: "absolute",
    right: -1,
    bottom: -1,
    borderRightColor: "green",
    borderBottomColor: "green",
  },
  close: {
    position: "absolute",
    width: deviceWidth,
  },
});

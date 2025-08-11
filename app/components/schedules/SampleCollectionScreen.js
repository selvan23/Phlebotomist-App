/*************************************************
 * SukraasLIS
 * @exports
 * @class BookingDetailsScreen.js
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
  TouchableOpacity,
  FlatList,
} from "react-native";
import LoadingScreen from "../common/LoadingScreen";
import Constants from "../../util/Constants";
import ScanBarcodeView from "./ScanBarcodeView";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ButtonNext from "../common/ButtonNext";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Utility from "../../util/Utility";
import {
  invokeCheckBarCode,
  invokeUpdateSampleCollection,
} from "../../actions/SampleCollectionAction";
import PropTypes from "prop-types";
import { navigate } from "../../rootNavigation";

let updateBarCode = [];

class SampleCollectionScreen extends Component {
  static propTypes = {
    isSubmitBarCodeLoading: PropTypes.bool,
    invokeCheckBarCode: PropTypes.func,
    invokeUpdateSampleCollection: PropTypes.func,
    collectorCode: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      QR_Code_Value: "",
      Start_Scanner: false,

      isShowBodyView: false,
      barCodeData: [],
      btnNextDisabled: false,
      time: "",
    };
  }

  componentDidMount() {
    let test = this.props.route.params.barCodeDetail;
    const newFile = test.map((test) => {
      return { ...test, scannedValue: "", isVerifiedBarCode: false };
    });
    this.setState({
      barCodeData: newFile,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState.barCodeData.length > 0 &&
      nextProps.ItemIndex !== undefined &&
      nextProps.timeStamp !== prevState.time &&
      nextProps.timeStamp !== undefined
    ) {
      if (nextProps.QR_Code_Value.includes("errorCode")) {
        Utility.showAlert(
          Constants.ALERT.TITLE.FAILED,
          Constants.VALIDATION_MSG.QR_SCAN_FAILED
        );
        return {
          time: nextProps.timeStamp,
        };
      } else {
        updateBarCode = prevState.barCodeData;
        if (
          updateBarCode.length > 0 &&
          updateBarCode[nextProps.ItemIndex].scannedValue !== undefined
        ) {
          updateBarCode[nextProps.ItemIndex].scannedValue =
            nextProps.QR_Code_Value;
        }
        return {
          time: nextProps.timeStamp,
          QR_Code_Value: nextProps.QR_Code_Value,
          barCodeData: updateBarCode,
        };
      }
    } else {
      return null;
    }
  }

  render() {
    return this._renderScreens();
  }

  _onNextPress = () => {
    let barRegData = [];
    const barCodePostData = this.state.barCodeData.map((barCodeData) => {
      if (barCodeData.isVerifiedBarCode) {
        return {
          ...barRegData,
          Barcode: barCodeData.scannedValue,
          Specimen_Code: barCodeData.Specimen_Code,
          Container_Code: barCodeData.Container_Code,
          Suffix: barCodeData.Suffix,
        };
      } else {
        return null;
      }
    });
    let filtered = barCodePostData.filter(function (el) {
      return el != null;
    });
    if (filtered.length > 0) {
      this._sampleCollectionUpdate(filtered);
    } else {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_SAMPLE_COLLECTION_UPDATE
      );
    }
  };

  _sampleCollectionUpdate = (Barcode_Reg_Data) => {
    const bookingDetail = this.props.route.params.bookingDetail;
    let updateSampleCollection = {
      Firm_No: bookingDetail.Firm_No,
      Booking_Date: bookingDetail.Booking_Date,
      Booking_No: bookingDetail.Booking_No,
      Collector_Code: this.props.collectorCode,
      Booking_Type: bookingDetail.Booking_Type,
      Barcode_Reg_Data: Barcode_Reg_Data,
      Cash_Received: "",
      Payment_Received: "Y",
      Pay_Mode: "",
      Pay_Ref_No: "",
      Paid_Amount: bookingDetail.Patient_Due,
    };

    // Actions.sampleCollectionSummary({
    //   isfromPendingDetail: true,
    //   bookingDetail: bookingDetail,
    //   updateCollectionData: updateSampleCollection,
    // });
    navigate("sampleCollectionSummary", {
      isfromPendingDetail: true,
      bookingDetail: bookingDetail,
      updateCollectionData: updateSampleCollection,
    });
  };

  _renderScreens = () => {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        {this._renderBodyView()}
        {this._checkForLoading()}
      </View>
    );
    // if (this.props.isSubmitBarCodeLoading) {
    //   return this._screenLoading();
    // } else {
    //   return this._renderBodyView();
    // }
  };

  _checkForLoading = () => {
    if (this.props.isSubmitBarCodeLoading) {
      return (
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
          }}
        >
          {this._screenLoading()}
        </View>
      );
    }
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderBodyView = () => {
    return (
      <KeyboardAwareScrollView enableOnAndroid={true} style={styles.mainContainer}>
        {this._renderNameAddressView()}
        {/* {this._renderFlatlist()} */}
        {this._renderNavigationButton()}
        {this._renderBarcodeScanView()}
        {this._renderNextButton()}
      </KeyboardAwareScrollView>
    );
  };
  _renderNextButton = () => {
    return (
      <TouchableOpacity
        disabled={this.state.btnNextDisabled}
        style={styles.nextButton}
        onPress={() => {
          this.setState({
            btnNextDisabled: true,
          });
          this._onNextPress();
          setTimeout(() => {
            this.setState({
              btnNextDisabled: false,
            });
          }, 1000);
        }}
      >
        <ButtonNext />
      </TouchableOpacity>
    );
  };
  _renderNavigationButton = () => {
    return (
      <View style={styles.navigationViewMainContainer}>
        <View style={styles.navigationViewSubContainer}>
          <View style={styles.navigationTextViewContainer}>
            <Text style={styles.navigationTextStyle}>1</Text>
          </View>
          <Text
            style={{ color: Constants.COLOR.BUTTON_BG, paddingHorizontal: 10 }}
          >
            -------------
          </Text>
          <View style={styles.navigationCircleView}>
            <Text
              style={[
                styles.navigationTextStyle,
                { color: Constants.COLOR.FONT_COLOR_DEFAULT },
              ]}
            >
              2
            </Text>
          </View>
        </View>
        <Text style={[styles.nameAddressRightNameText, { top: 10 }]}>
          {" "}
          Sample Collection
        </Text>
      </View>
    );
  };
  _renderNameAddressView = () => {
    const bookingDetail = this.props.route.params.bookingDetail;
    return (
      <View style={styles.nameAddressView}>
        <View style={styles.nameAddressLeftView}>
          <View style={styles.profileImageView}>
            <Text style={styles.profileImageText}>
              {bookingDetail.Pt_Name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.nameAddressRightView}>
          <View style={styles.nameAddressRightNameAgeView}>
            <Text
              style={[styles.nameAddressRightNameText, { fontWeight: "bold" }]}
            >
              {bookingDetail.Pt_Name},{" "}
            </Text>
            <Text style={styles.nameAddressRightNameAgeText}>
              {bookingDetail.First_Age}
            </Text>
          </View>
          {/* {console.log("service details", bookingDetail.Service_Detail)} */}
          {/* <FlatList
            data={bookingDetail.Service_Detail}
            renderItem={({ item }, idx) => {
              console.log('renderitem serv det', item);
              this._renderTestList({ item, idx });
            }}
            keyExtractor={(item) => item.id}
            listKey={(_, index) => `_key${index.toString()}`}
          /> */}
          {
            typeof bookingDetail.Service_Detail === 'object'
            && bookingDetail.Service_Detail?.length > 0
            && bookingDetail.Service_Detail.map((dt, idx) => this._renderTestList({ item: dt, idx }))
          }
        </View>
      </View>
    );
  };

  _renderTestList = ({ item, idx }) => {
    return <Text key={idx} style={[styles.testListText, { marginTop: 10 }]}>
        {item.Service_Name}
      </Text>
    ;
  };

  renderItem = ({ item, index }) => {
    console.log('render item scanbarcodeview :', item, index);
    return <ScanBarcodeView
          data={item}
          key={index}
          index={index}
          onSubmitClick={(scanValue, index) => {
            this._onBarCodeSubmit(scanValue, index);
          }}
          onBarCodeChange={(scanValue, index) => {
            console.log("on barcode changed ", scanValue, index);
            updateBarCode = this.state.barCodeData;
            updateBarCode[index].scannedValue = scanValue;
            this.setState({
              barCodeData: updateBarCode,
            });
          }}
          onResetBarCode={(index) => {
            console.log("on bar code reset: ", index, this.state.barCodeData);
            updateBarCode = this.state.barCodeData;
            updateBarCode[index].isVerifiedBarCode = false;
            updateBarCode[index].scannedValue = "";
            this.setState({
              barCodeData: updateBarCode,
            });
          }}
        />;
  };

  _onBarCodeSubmit = (scanValue, index) => {
    console.log("submit btn clicked: ", scanValue, index);
    if (scanValue !== "") {
      const newArray = [];
      this.state.barCodeData.forEach((obj) => {
        if (obj.scannedValue !== "") {
          newArray.push(obj.scannedValue);
        }
      });
      let map = {};
      let result = false;
      for (let i = 0; i < newArray.length; i++) {
        if (map[newArray[i]]) {
          result = true;
          break;
        }
        map[newArray[i]] = true;
      }
      if (!result) {
        let postData = { Barcode: scanValue };
        this.props.invokeCheckBarCode(postData, (isSuccess) => {
          if (isSuccess) {
            updateBarCode = this.state.barCodeData;
            updateBarCode[index].isVerifiedBarCode = true;
            this.setState({
              barCodeData: updateBarCode,
            });
          }
        });
      } else {
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.DUPLICATE_BARCODE
        );
      }
    } else {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_BARCODE
      );
    }
  };

  _renderBarcodeScanView = () => {
    console.log("barcodedata:", this.state.barCodeData);
    try {

      return (
        <View style={{ marginBottom: 10 }}>
        {
          typeof this.state.barCodeData === 'object'
          && this.state.barCodeData.length > 0
          && this.state.barCodeData.map((dt, idx) => this.renderItem({ item: dt, index: idx }))
          // && <>
          //   <FlatList
          //     extraData={this.state.barCodeData}
          //     data={this.state.barCodeData}
          //     renderItem={this.renderItem}
          //     keyExtractor={(item) => item.id}
          //     listKey={(_, index) => `_key${index.toString()}`}
          //   />
          // </>
        }
        </View>
      );
    } catch (error) {
      console.log('sample collection error', error);
      return <><Text>Error</Text></>
    }
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    configState: { collectorCode },
    sampleCollectionState: { isSubmitBarCodeLoading },
  } = state;
  return {
    isSubmitBarCodeLoading,
    collectorCode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { invokeCheckBarCode, invokeUpdateSampleCollection },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SampleCollectionScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    flexDirection: "column",
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },

  nameAddressView: { flexDirection: "row", marginTop: 20 },
  nameAddressLeftView: {
    flex: 1,
    justifyContent: "flex-start",
  },
  nameAddressRightView: { flex: 3, marginStart: 10 },
  profileImageView: {
    justifyContent: "center",
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
    overflow: "hidden",
    borderColor: "#4F4F4F",
    borderWidth: 2,
  },
  profileImageText: {
    alignItems: "center",
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
    textAlignVertical: "center",
    color: "black",
    fontSize: Constants.FONT_SIZE.XXL,
  },
  nameAddressRightNameText: {
    // marginStart: 30,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.M,
  },
  testListText: {
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
  nextButton: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    marginRight: 0,
    marginTop: 10,
    marginBottom: 30,
  },
  barcodeListItemContainer: { flexDirection: "row" },
  barcodeListItemText: {
    fontSize: Constants.FONT_SIZE.SM,
    color: "#878789",
  },
  navigationViewMainContainer: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationViewSubContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  navigationTextViewContainer: {
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: Constants.COLOR.BUTTON_BG,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationTextStyle: {
    // paddingHorizontal: 5,
    // paddingVertical: 5,
    color: Constants.COLOR.WHITE_COLOR,
    alignSelf: "center",
  },
  navigationCircleView: {
    width: 25,
    height: 25,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Constants.COLOR.FONT_COLOR_DEFAULT,
    borderWidth: 0.5,
  },
  nameAddressRightNameAgeView: { flexDirection: "row" },
  nameAddressRightNameAgeText: {
    // marginStart: 30,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.M,
  },
});

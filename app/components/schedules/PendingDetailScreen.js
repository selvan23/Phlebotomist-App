/*************************************************
 * SukraasLIS - Phlebotomist
 * PendingDetailScreen.js
 * Created by Abdul on 16/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

"use strict";
import React, { Component } from "react";

import {
  Dimensions,
  Text,
  View,
  Platform,
  Linking,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Button,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LoadingScreen from "../common/LoadingScreen";
import Constants from "../../util/Constants";
import Utility from "../../util/Utility";
import {
  getPendingDetail,
  getPdfReport,
} from "../../actions/PendingDetailAction";
import { getPendingList } from "../../actions/PendingScreenAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserDetails from "../common/UserDetails";
import TestListView from "../common/TestListView";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps"; // remove PROVIDER_GOOGLE import if not using Google Maps
import { FlatList, ScrollView } from "react-native-gesture-handler";
import ButtonBack from "../common/ButtonBack";
import { getInstallerPackageNameSync } from "react-native-device-info";
const currentScene = "pendingDetailScreen";
import moment from "moment";
import { nativationPop, navigate, navigationRef } from "../../rootNavigation";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;

function isEmpty(arg) {
  for (var item in arg) {
    return false;
  }
  return true;
}

class PendingDetailScreen extends Component {
  static propTypes = {
    collectorCode: PropTypes.string,
    isPendingLoading: PropTypes.bool,
    isPdfLoading: PropTypes.bool,
    bookingDetail: PropTypes.object,
    pdfReport: PropTypes.object,

    getPendingDetail: PropTypes.func,
    getPdfReport: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const rowData = this.props.route.params.rowData;
    this.state = {
      showModal: false,
      isCancelBtnClicked: false,
      isDenyBtnClicked: false,
      isCloseScreen: false,

      firmNo: rowData.Firm_No,
      bookingNo: rowData.Booking_No,
      collectorCode: rowData.Collector_Code,
      bookingDate: rowData.Booking_Date,
      bookingType: rowData.Booking_Type,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isCloseScreen !== prevState.isCloseScreen) {
      if (nextProps.isCloseScreen === true) {
        // Actions.pop();
        nativationPop();
      }
    }
  }

  componentDidMount() {
    this._loadBookingDetail();
  }

  _loadBookingDetail() {
    let dictInfo = {
      Firm_No: this.state.firmNo,
      Booking_No: this.state.bookingNo,
      Collector_Code: this.props.collectorCode,
      Booking_Date: this.state.bookingDate,
      Booking_Type: this.state.bookingType,
    };
    this.props.getPendingDetail(dictInfo, (isSuccess) => {});
  }

  _loadBookingList(filterType) {
    if (filterType && filterType.length) {
      let postData = {
        Collector_Code: this.state.collectorCode,
        Schedule_Date: this.state.bookingDate,
        Filter_Type: filterType,
      };
  
      // const filterArry = [
      //   "P",
      //   "C",
      //   "R"
      // ];
      this.props.getPendingList(postData);
    }

    // filterArry.forEach((item) => {
    //   const payload = postData;
    //   payload.Filter_Type = item;
    // });
  }

  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    if (this.props.isPendingLoading) {
      return this._screenLoading();
    } else {
      if (
        this.props.bookingDetail !== undefined &&
        !isEmpty(this.props.bookingDetail)
      ) {
        return this._renderBodyView();
      } else {
        return this._renderNoDataView();
      }
    }
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderNoDataView = () => {
    return (
      <View style={styles.noDataMainView}>
        <View style={styles.noDataSubView}>
          <Text style={{ padding: 20, color: "black" }}>No Data Found!</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            // if (Actions.currentScene === currentScene) {
            if (navigationRef.getCurrentRoute().name === currentScene) {
              // Actions.pop();
              nativationPop();
            }
          }}
          style={styles.backBtn}
        >
          <ButtonBack />
        </TouchableOpacity>
      </View>
    );
  };

  _renderBodyView = () => {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.subView}>
          {this._renderUserDetails()}
          {this._renderServiceTest()}
          {this._renderPaymentStatus()}
          {this._renderMapView()}
          {this._renderBookingView()}
          {this._renderBackButton()}
        </View>
      </KeyboardAwareScrollView>
    );
  };

  _callPdf = () => {
    let dictInfo = {
      Firm_No: this.state.firmNo,
      Booking_Type: this.state.bookingType,
      Booking_Date: this.state.bookingDate,
      Booking_No: this.state.bookingNo,
    };
    this.props.getPdfReport(dictInfo, (isSuccess) => {
      if (isSuccess === true) {
        this._selectPdfFile();
      }
    });
  };

  _selectPdfFile = () => {
    if (
      this.props.pdfReport.Prescription_File1 !== null &&
      this.props.pdfReport.Prescription_File1 !== "" &&
      this.props.pdfReport.Prescription_File2 !== null &&
      this.props.pdfReport.Prescription_File2 !== ""
    ) {
      Alert.alert(
        "View Prescription",
        "kindly select the prescriptions to View",
        [
          {
            text: "Cancel",
            onPress: () => {},
          },
          {
            text: "View Prescription 2",
            onPress: () => {
              // Actions.pdfReport({ pdf: this.props.pdfReport.Prescription_File2 });
              navigate("pdfReport", {
                pdf: this.props.pdfReport.Prescription_File2,
              });
            },
          },
          {
            text: "View Prescription 1",
            onPress: () => {
              // Actions.pdfReport({ pdf: this.props.pdfReport.Prescription_File1 });
              navigate("pdfReport", {
                pdf: this.props.pdfReport.Prescription_File1,
              });
            },
          },
        ],
        { cancelable: false }
      );
    } else if (
      this.props.pdfReport.Prescription_File1 !== null &&
      this.props.pdfReport.Prescription_File1 !== ""
    ) {
      // Actions.pdfReport({ pdf: this.props.pdfReport.Prescription_File1 });
      navigate("pdfReport", {
        pdf: this.props.pdfReport.Prescription_File1,
      });
    } else {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_DATA_FOUND
      );
    }
  };

  _renderUserDetails = () => {
    return (
      <View style={{ marginHorizontal: 10 }}>
        <UserDetails
          arrUserDetails={this.props.bookingDetail}
          pdfReport={this.props.pdfReport}
          callPdf={this._callPdf}
          isShowPDF={true}
        />
      </View>
    );
  };

  _renderServiceTest = () => {
    return (
      <View style={styles.testView}>
        <TestListView bookingDetail={this.props.bookingDetail} />
      </View>
    );
  };

  _renderPaymentStatus = () => {
    let dueAmount = this.props.bookingDetail.Due_Amount;
    if (
      this.props.bookingDetail.Payment_Full_Desc !== undefined &&
      this.props.bookingDetail.Payment_Full_Desc !== ""
    ) {
      return (
        <View style={styles.paymentStatusMain}>
          <Text
            style={[
              styles.paymentStatusOnline,
              {
                backgroundColor:
                  dueAmount !== null && dueAmount === 0
                    ? Constants.COLOR.PAYMENT_STATUS_ONLINE
                    : Constants.COLOR.CASH_ON_HAND,
              },
            ]}
          >
            {this.props.bookingDetail.Payment_Full_Desc}
          </Text>
        </View>
        // <View style={{backgroundColor:Constants.COLOR.CASH_ON_HAND, paddingVertical:5, marginTop:5, width:deviceWidth/2.7, paddingHorizontal:10, borderRadius:5}}>
        // <Text style={{ color: Constants.COLOR.WHITE_COLOR,
        //    fontSize: Constants.FONT_SIZE.SM,}}>
        //            Cash to be collected
        //            </Text>
        //      </View>
      );
    }
    // } else if (
    //   this.props.bookingDetail.Payment_Desc !== undefined &&
    //   this.props.bookingDetail.Payment_Desc !== 'Cash'
    // ) {
    //   return (
    //     <View style={styles.paymentStatusMain}>
    //       <Text style={styles.paymentStatusOnline}>
    //         Payment completed - UPI
    //       </Text>
    //     </View>
    //   );
    // } else {
    //   return (
    //     <View style={[styles.paymentStatusMain]}>
    //       <Text style={styles.paymentStatusCash}>Cash to be collected</Text>
    //     </View>
    //   );
    // }
  };

  _renderPaymentStatus1 = () => {
    if (
      this.props.bookingDetail.Report_Status_Desc !== undefined &&
      this.props.bookingDetail.Report_Status_Desc.trim().length > 0
    ) {
      return (
        <TouchableOpacity onPress={() => {}} style={styles.paymentStatusBtn}>
          <Text style={styles.paymentText}>
            {this.props.bookingDetail.Report_Status_Desc}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }
  };

  _renderMapView = () => {
    if (
      this.props.bookingDetail.Latitude !== undefined &&
      this.props.bookingDetail.Latitude.trim().length > 0 &&
      this.props.bookingDetail.Longitude !== undefined &&
      this.props.bookingDetail.Longitude.trim().length > 0
    ) {
      return (
        <View>
          <MapView
            // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(this.props.bookingDetail.Latitude),
              longitude: parseFloat(this.props.bookingDetail.Longitude),
              latitudeDelta: 0.0922 * 8,
              longitudeDelta: 0.0421 * 8,
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(this.props.bookingDetail.Latitude),
                longitude: parseFloat(this.props.bookingDetail.Longitude),
              }}
              title={this.props.bookingDetail.Pt_Name}
              // description={marker.description}
            />
          </MapView>
          <TouchableOpacity
            onPress={() => {
              if (navigationRef.getCurrentRoute().name === currentScene) {
                this.openGps(
                  parseFloat(this.props.bookingDetail.Latitude),
                  parseFloat(this.props.bookingDetail.Longitude)
                );
              }
            }}
            style={styles.getDirectionBtn}
          >
            <Image
              source={require("../../images/get-directions.png")}
              style={styles.mapDirectionImage}
            />
            <Text style={styles.getDirectionText}>Get Direction</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <View />;
    }
  };

  openGps = (lat, lng) => {
    if (Platform.OS === "android") {
      var url =
        "https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=" +
        `${lat},${lng}`;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            console.log("Can't handle url: " + url);
            return Linking.openURL(url);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    } else {
      var scheme = Platform.OS === "ios" ? "maps:" : "geo:";
      var url = scheme + `${lat},${lng}`;
      Linking.openURL(url);
    }
  };

  _renderBookingView = () => {
    return (
      <ScrollView horizontal={true} style={styles.cancelDenyBookingView}>
        <TouchableOpacity
          onPress={() => {
            // if (Actions.currentScene === currentScene) {
            if (navigationRef.getCurrentRoute().name === currentScene) {
              // Actions.cancelBookingView({
              //   isFromCancel: false,
              //   arrBookingDetail: this.props.bookingDetail,
              // });
              navigate("cancelBookingView", {
                isFromCancel: false,
                arrBookingDetail: this.props.bookingDetail,
                collectorCode: this.props.collectorCode,
                onGoBack: this._loadBookingList.bind(this),
                cancelBookingStatusSuccess: this.props.route.params.cancelBookingStatusSuccess
              });
            }
          }}
          style={styles.denyBookingBtn}
        >
          <Text style={styles.denyBookingText}>Deny</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // if (Actions.currentScene === currentScene) {
            if (navigationRef.getCurrentRoute().name === currentScene) {
              // Actions.cancelBookingView({
              //   isFromCancel: true,
              //   arrBookingDetail: this.props.bookingDetail,
              // });
              navigate("cancelBookingView", {
                isFromCancel: true,
                arrBookingDetail: this.props.bookingDetail,
                onGoBack: this._loadBookingList.bind(this),
                cancelBookingStatusSuccess: this.props.route.params.cancelBookingStatusSuccess

              });
            }
          }}
          style={styles.cancelBookingBtn}
        >
          <Text style={styles.cancelBookingText}>Cancel Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // if (Actions.currentScene === currentScene) {
            if (navigationRef.getCurrentRoute().name === currentScene) {
              let currentDate = moment(new Date(), "YYYY/MM/DD").format(
                "YYYY-MM-DDTHH: mm: ss"
              );
              let bookingDate = moment(
                this.props.bookingDetail.Visit_Date,
                "YYYY/MM/DD"
              ).format("YYYY-MM-DDTHH: mm: ss");

              if (bookingDate < currentDate) {
                // Actions.sampleCollectionDetail({
                //   bookingDetail: this.props.bookingDetail,
                // });
                navigate("sampleCollectionDetail", {
                  bookingDetail: this.props.bookingDetail,
                });
              } else {
                Utility.showAlert(
                  Constants.ALERT.TITLE.INFO,
                  "Sample collection cannot be allowed for future date bookings from the current system date"
                );
              }
            }
          }}
          style={styles.sampleCollectionBtn}
        >
          <Text style={styles.sampleCollectionText}>
            Begin Sample Collection
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  _renderBackButton = () => {
    return (
      <TouchableOpacity
        style={styles.backButtonView}
        onPress={() => {
          // if (Actions.currentScene === currentScene) {
          if (navigationRef.getCurrentRoute().name === currentScene) {
            // Actions.pop();
            nativationPop();
          }
        }}
      >
        <ButtonBack />
      </TouchableOpacity>
    );
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps

  const {
    configState: { collectorCode },
    pendingDetailState: {
      bookingDetail,
      isPendingLoading,
      isPdfLoading,
      pdfReport,
    },
  } = state;

  return {
    collectorCode,
    isPendingLoading,
    bookingDetail,
    pdfReport,
    isPdfLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getPendingDetail,
      getPendingList,
      getPdfReport,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingDetailScreen);

const styles = StyleSheet.create({
  mainView: { marginHorizontal: 0 },
  subView: {
    flex: 1,
    marginVertical: 10,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
  },
  map: {
    height: 200,
  },
  testView: {
    paddingHorizontal: 5,
  },
  closeImage: {
    marginTop: 0,
    width: deviceHeight / 30,
    height: deviceHeight / 30,
    alignSelf: "flex-end",
    marginRight: 5,
    tintColor: "black",
  },
  modalHeaderText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 10,
    color: "#858484",
  },
  btnCloseImage: {
    marginTop: 50,
    alignSelf: "flex-end",
    backgroundColor: "white",
  },
  backButtonView: {
    alignSelf: "flex-start",
    marginStart: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  paymentStatusBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Constants.COLOR.PAYMENT_STATUS_ONLINE,
    borderRadius: 8,
    marginHorizontal: deviceWidth / 5,
    marginVertical: 5,
    alignSelf: "center",
    padding: 4,
  },
  paymentText: {
    fontSize: 15,
    color: Constants.COLOR.WHITE_COLOR,
    marginHorizontal: 5,
    paddingHorizontal: 20,
  },

  cancelBookingBtn: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "red",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    padding: 7,
    marginVertical: 10,
  },
  denyBookingBtn: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Constants.COLOR.BOOK_PENDING_BG,
    alignItems: "center",
    justifyContent: "center",
    padding: 7,
    marginVertical: 10,
  },
  denyBookingText: {
    fontSize: 12,
    color: Constants.COLOR.BOOK_PENDING_BG,
    marginHorizontal: 10,
  },
  cancelBookingText: {
    fontSize: 12,
    color: "red",
    marginHorizontal: 10,
  },
  sampleCollectionText: {
    fontSize: 12,
    color: "green",
    marginHorizontal: 10,
  },
  sampleCollectionBtn: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "green",
    alignItems: "center",
    justifyContent: "center",
    padding: 7,
    marginVertical: 10,
  },
  cancelDenyBookingView: {
    flexDirection: "row",
    marginHorizontal: 5,
  },
  mapDirectionImage: {
    width: 18,
    height: 18,
    alignSelf: "center",
    tintColor: "blue",
  },
  getDirectionBtn: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    alignSelf: "flex-end",
    padding: 5,
    marginTop: 10,
  },
  getDirectionText: {
    fontSize: 12,
    color: "blue",
    marginHorizontal: 10,
  },
  noDataMainView: {
    flex: 1,
  },
  noDataSubView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 10,
    marginLeft: 10,
  },

  paymentStatusMain: {
    marginTop: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentStatusCash: {
    color: Constants.COLOR.WHITE_COLOR,
    fontSize: Constants.FONT_SIZE.SM,
    backgroundColor: Constants.COLOR.CASH_ON_HAND,
    paddingHorizontal: 20,
    borderRadius: 5,
    paddingVertical: 2,
  },
  paymentStatusOnline: {
    color: Constants.COLOR.WHITE_COLOR,
    fontSize: Constants.FONT_SIZE.SM,
    backgroundColor: Constants.COLOR.PAYMENT_STATUS_ONLINE,
    paddingHorizontal: 5,
    borderRadius: 5,
    paddingVertical: 2,
  },
});

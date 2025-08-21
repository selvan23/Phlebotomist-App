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
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import LoadingScreen from "../common/LoadingScreen";
import Utility from "../../util/Utility";
import Constants from "../../util/Constants";
const deviceWidth = Dimensions.get("window").width;
import RatingsView from "./RatingsView";
import PostReviews from "./PostReviews";
import ButtonBack from "../common/ButtonBack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PropTypes from "prop-types";
import SwitchToggle from "react-native-switch-toggle";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import SummaryRow from "../schedules/SummaryRow";
import SummaryBottom from "./SummaryBottom";
import HTML from "react-native-render-html";
import { getCompletedDetail } from "../../actions/CancelBookingDetailAction";
import {
  getSubmitRating,
  getSubmitReview,
  getSubmitOrderData,
  invokeUpdateSampleCollection,
} from "../../actions/SampleCollectionSummaryAction";
import moment from "moment";
import { nativationPop, navigate, navigationRef } from "../../rootNavigation";
import RiyalPrice from "../common/RiyalPrice";
import { getPendingList } from "../../actions/PendingScreenAction";
import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import LinearGradient from "react-native-linear-gradient";

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;

function isEmpty(arg) {
  for (var item in arg) {
    return false;
  }
  return true;
}

let currentScene = "sampleCollectionSummary";
class SampleCollectionSummary extends Component {
  static propTypes = {
    data: PropTypes.array,

    isNetworkConnectivityAvailable: PropTypes.bool,
    isSampleCollectionSummaryLoading: PropTypes.bool,
    getSubmitRating: PropTypes.func,
    getSubmitReview: PropTypes.func,
    getSubmitOrderData: PropTypes.func,
    invokeUpdateSampleCollection: PropTypes.func,

    // completed  Detail props
    isCompletedDetailLoading: PropTypes.bool,
    // bookingDetail: PropTypes.object,
    getCompletedDetail: PropTypes.func,
  };

  constructor() {
    super();

    this.state = {
      cashSwitchValue: false,
      ratingValue: 0,
      reviewValue: "",
      isCommentsAdded: false,
      phonepePaymentValue: false,
      transactionNumber: "",
    };
  }

  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    if (
      this.props.isSampleCollectionSummaryLoading ||
      this.props.isCompletedDetailLoading
    ) {
      return this._screenLoading();
    } else {
      if (
        this.props.route.params.bookingDetail !== undefined &&
        !isEmpty(this.props.route.params.bookingDetail)
      ) {
        return this._renderBodyView();
      } else {
        return (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>no data available! </Text>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignSelf: "flex-start",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  // Actions.pop();
                  nativationPop();
                }}
              >
                <ButtonBack />
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    }
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderPDFImageView = () => {
    return (
      <View
        style={{
          alignSelf: "flex-end",
          flexDirection: "row",
        }}
      >
        <View style={styles.bookingDateRightViewPrescription}>
          <TouchableOpacity
            onPress={() => {
              // this._selectPdf();
            }}
            style={styles.bookingIdRightInnerView}
          >
            <IconOutline
              name="file-pdf"
              size={deviceHeight / 15}
              color="red"
              style={styles.bookingIdReportImage}
            />
            <Text style={styles.bookingIdReportLink}>View Prescription</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderBodyView = () => {
    console.log('render body view:: ', this.props.route.params.bookingDetail);
    return (
      <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={200} style={styles.mainContainer}>
        {this._renderNameView()}
        {this._renderNavigationButton()}
        {this._renderTickAmountView()}
        {this._renderPaymentStatusView()}
        {this._renderAddressView()}
        {this._renderLocationView()}
        {this._renderSummaryView()}
        {this._renderRatingsView()}
        {this._renderPostReviewsView()}
        {this._renderNavigationView()}
      </KeyboardAwareScrollView>
    );
  };

  _renderNameView = () => {
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
              style={[styles.nameAddressRightNameText, { fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD }]}
            >
              {bookingDetail.Pt_Name},{" "}
            </Text>
            <Text style={styles.nameAddressRightNameAgeText}>
              {bookingDetail.First_Age}
            </Text>
          </View>
          <FlatList
            data={bookingDetail.Service_Detail}
            renderItem={({ item }) => this._renderTestList({ item })}
          />
        </View>
      </View>
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
            style={{ color: Constants.COLOR.PRIMARY_COLOR, paddingHorizontal: 10, fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR }}
          >
            -------------
          </Text>
          <View style={styles.navigationTextViewContainer}>
            <Text style={styles.navigationTextStyle}>2</Text>
          </View>
        </View>
      </View>
    );
  };

  _renderTestList = ({ item }) => {
    return (
      <Text style={[styles.testListText, { marginTop: 5 }]}>
        {item.Service_Name?.trim() !== "" ? item.Service_Name : "Loading..."}
      </Text>
    );
  };

  _renderTickAmountView = () => {
    const bookingDetail = this.props.route.params.bookingDetail;
    if (bookingDetail.Due_Amount !== null && bookingDetail.Due_Amount !== "") {
      return (
        <View style={styles.tickImageContainer}>
          <IconFill name="check-circle" size={90} color={Constants.COLOR.GREEN_COLOR} />

          <Text style={styles.tickTitle}>Collect Payment</Text>
        <View style ={styles.ticAmountVal}>
          <RiyalPrice amount={(bookingDetail?.Patient_Due?.toFixed(2))} dynamicHeight={0.05} />
        </View>
        </View>
      );
    }
  };

  _renderPaymentStatusView = () => {
    const bookingDetail = this.props.route.params.bookingDetail;
    console.log("renderpaymentstatusview:: ", bookingDetail);
    if (bookingDetail.IsDue !== "False") {
      // if (
      //   bookingDetail.Due_Amount !== null &&
      //   bookingDetail.Due_Amount !== "" &&
      //   bookingDetail.Due_Amount !== "0" &&
      //   bookingDetail.Due_Amount !== 0
      // ) {
      if (
        bookingDetail.Patient_Due !== null &&
        bookingDetail.Patient_Due !== "" &&
        bookingDetail.Patient_Due !== "0" &&
        bookingDetail.Patient_Due !== 0
      ) {
        return (
          <View>
            <View style={styles.paymentStatusMainContainer}>
              <Text style={styles.paymentStatusText}>Cash Received</Text>
              <View style={{ bottom: 8 }}>
                <SwitchToggle
                  containerStyle={styles.SwitchToggleContainer}
                  circleStyle={styles.CircleStyle}
                  switchOn={this.state.cashSwitchValue}
                  onPress={this.cashSwitchOnPress}
                  duration={500}
                  buttonStyle={{ backgroundColor: Constants.COLOR.GREEN_COLOR }}
                />
              </View>
            </View>
            <View style={styles.paymentStatusMainContainer}>
              <Text style={styles.paymentStatusText}>UPI Payment Received</Text>
              <View style={{ bottom: 8 }}>
                <SwitchToggle
                  containerStyle={styles.SwitchToggleContainer}
                  circleStyle={styles.CircleStyle}
                  switchOn={this.state.phonepePaymentValue}
                  onPress={this.phonepeSwitchOnPress}
                  duration={500}
                  buttonStyle={{ backgroundColor: Constants.COLOR.GREEN_COLOR }}
                />
              </View>
            </View>
            {this.state.phonepePaymentValue ? (
              <TextInput
                style={styles.inputs}
                placeholder="Enter the Transaction Number"
                placeholderTextColor={Constants.COLOR.FONT_HINT}
                value={this.state.transactionNumber}
                editable={true}
                maxLength={15}
                keyboardType="default"
                underlineColorAndroid="transparent"
                returnKeyType={"done"}
                onChangeText={(transactionNumber) =>
                  this.setState({
                    transactionNumber: transactionNumber,
                  })
                }
              />
            ) : null}
          </View>
        );
      } else {
        return <View />;
      }
    } else {
      return <View />;
    }
  };

  _renderAddressView = () => {
    const bookingDetail = this.props.route.params.bookingDetail;
    return (
      <View
        style={{
          backgroundColor: Constants.COLOR.LIGHT_GREY,
          padding: 10,
          marginTop: 10,
          borderRadius: 5
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.nameAddressRightNameText,
              {
                fontSize: Constants.FONT_SIZE.M,
                flex: 1,
                width: (deviceWidth * 2) / 3,
                fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD,
              },
            ]}
          >
            {bookingDetail.Pt_Name}
          </Text>
          <View style={styles.bookingDateRightView}>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.bookingDateRightInnerView}
            >
              <Image
                style={styles.bookingDateReportImage}
                resizeMode="contain"
                source={require("../../images/placeholder.png")}
              />
              <Text
                style={[styles.bookingDateReportLink, { marginStart: 0 }]}
                numberOfLines={1}
              >
                {bookingDetail.Branch_Name}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "column", paddingVertical: 5 }}>
          <Text
            style={{
              color: Constants.COLOR.FONT_COLOR_DEFAULT,
              fontSize: Constants.FONT_SIZE.SM,
              fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
            }}
          >
            {bookingDetail.Full_Address}
          </Text>
          {this._renderLandmarkView()}
        </View>
        <Text
          style={{
            color: Constants.COLOR.FONT_COLOR_DEFAULT,
            fontSize: Constants.FONT_SIZE.SM,
            paddingVertical: 5,
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
          }}
        >
          {bookingDetail.Mobile_No}
        </Text>
      </View>
    );
  };

  _renderLandmarkView = () => {
    const bookingDetail = this.props.route.params.bookingDetail;
    if (bookingDetail.Pt_Landmark.length > 0) {
      return (
        <Text
          style={{
            color: Constants.COLOR.FONT_COLOR_DEFAULT,
            fontSize: Constants.FONT_SIZE.SM,
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
          }}
        >
          Landmark: {bookingDetail.Pt_Landmark}
        </Text>
      );
    } else {
      return <View />;
    }
  };

  cashSwitchOnPress = () => {
    this.setState({
      cashSwitchValue: !this.state.cashSwitchValue,
      phonepePaymentValue: false,
    });
  };

  phonepeSwitchOnPress = () => {
    this.setState({
      phonepePaymentValue: !this.state.phonepePaymentValue,
      cashSwitchValue: false,
    });
  };

  _renderLocationView = () => {
    const bookingDetail = this.props.route.params.bookingDetail;
    return (
      <View style={styles.locationView}>
        <Text
          style={{
            color: Constants.COLOR.FONT_COLOR_DEFAULT,
            fontSize: Constants.FONT_SIZE.S,
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
          }}
        >
          {bookingDetail.Booking_Type === "H" ? "HOME" : "WALK IN"}
        </Text>
        <Text
          style={{
            color: Constants.COLOR.FONT_COLOR_DEFAULT,
            fontSize: Constants.FONT_SIZE.S,
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
          }}
        >
          {moment(bookingDetail.Visit_Date, "YYYY/MM/DD").format("DD/MM/YYYY")}
          {/* {this.props.route.params.bookingDetail.Visit_Date} */}
        </Text>
        <Text
          style={{
            color: Constants.COLOR.FONT_COLOR_DEFAULT,
            fontSize: Constants.FONT_SIZE.S,
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
          }}
        >
          {bookingDetail.Visit_Time}
        </Text>
      </View>
    );
  };

  _renderSummaryView = () => {
    const bookingDetail = this.props.route.params.bookingDetail;
    if (
      bookingDetail.Service_Detail !== undefined &&
      bookingDetail.Service_Detail !== null &&
      bookingDetail.Service_Detail.length > 0
    ) {
      return (
        <View style={{ marginTop: 16, backgroundColor: Constants.COLOR.LIGHT_GREY, borderRadius: 5 }}>
          <FlatList
            style={{ marginTop: 8 }}
            data={bookingDetail.Service_Detail}
            renderItem={this._renderSummaryRow}
            keyExtractor={this._keyExtractor}
          />
          {bookingDetail.Sample_Collection_Charge !== undefined &&
          bookingDetail.Sample_Collection_Charge !== 0 ? (
            <FlatList
              style={{ marginTop: 0 }}
              data={[
                {
                  Service_Name: "Sample Collection Charges",
                  Service_Amount: bookingDetail.Sample_Collection_Charge,
                },
              ]}
              renderItem={this._renderSummaryRow}
              keyExtractor={this._keyExtractor}
            />
          ) : null}
          <SummaryBottom
            currency={this.props.currency}
            data={bookingDetail.Service_Detail}
            serviceDetail={bookingDetail}
            collectionCharge={bookingDetail.Sample_Collection_Charge}
          />
        </View>
      );
    } else {
      return <View />;
    }
  };

  _renderSummaryRow = ({ item }) => {
    return (
      <SummaryRow
        rowData={item}
        isHeaderBackground={Constants.COLOR.WHITE_COLOR}
        isShowDivider={false}
        currency={this.props.currency}
      />
    );
  };

  _renderRatingsView = () => {
    const bookingDetail = this.props.route.params.bookingDetail;
    if (
      bookingDetail.Rating_Code !== "" &&
      bookingDetail.Rating_Code !== undefined &&
      bookingDetail.Rating_Code !== 0
    ) {
      return (
        <View style={styles.ratingPhlebotomist}>
          <RatingsView isRatingValue={bookingDetail.Rating_Code} />
        </View>
      );
    } else {
      return (
        <View style={styles.ratingPhlebotomist}>
          <RatingsView
            isServiceRating={true}
            isRatingValue={this.state.ratingValue}
            onPressRating={(Rating_No) => {
              if (this.props.isNetworkConnectivityAvailable) {
                this.setState(
                  {
                    ratingValue: Rating_No,
                  },
                  () => {
                    this._onSubmitRating(this.state.ratingValue);
                  }
                );
              } else {
                Utility.showAlert(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.NO_INTERNET
                );
              }
            }}
          />
        </View>
      );
    }
  };

  _renderPostReviewsView = () => {
    const bookingDetail = this.props.route.params.bookingDetail;
    if (
      bookingDetail.Post_Review !== "" &&
      bookingDetail.Post_Review !== undefined
    ) {
      return (
        <View style={{ padding: 10 }}>
          <Text
            style={{
              marginTop: 10,
              fontSize: Constants.FONT_SIZE.L,
              color: Constants.COLOR.FONT_COLOR,
              fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
            }}
          >
            Feedback:
          </Text>
          <Text
            style={{
              marginTop: 5,
              marginBottom: 30,
              fontSize: Constants.FONT_SIZE.SM,
              color: Constants.COLOR.FONT_COLOR,
              fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
            }}
          >
            {bookingDetail.Post_Review}
          </Text>
        </View>
      );
    } else {
      let postData = {
        Collector_Code: this.props.collectorCode,
        Firm_No: bookingDetail.Firm_No,
        Booking_Date: bookingDetail.Booking_Date,
        Booking_No: bookingDetail.Booking_No,
        Post_Review: this.state.reviewValue,
      };
      return (
        <View style={styles.postReviewsView}>
          <PostReviews
            postReviewValue={this.state.reviewValue}
            Editable={!this.state.isCommentsAdded}
            btnDisabled={this.state.isCommentsAdded}
            onPostClick={() => {
              if (this.state.reviewValue !== "") {
                if (this.props.isNetworkConnectivityAvailable) {
                  this.props.getSubmitReview(postData, (isSuccess) => {
                    if (isSuccess) {
                      this.setState({
                        isCommentsAdded: true,
                      });
                    }
                  });
                } else {
                  Utility.showAlert(
                    Constants.ALERT.TITLE.FAILED,
                    Constants.VALIDATION_MSG.NO_INTERNET
                  );
                }
              }
            }}
            onPostChangeText={(value) => {
              this.setState({
                reviewValue: value,
              });
            }}
          />
        </View>
      );
    }
  };

  _onSubmitRating = (Rating_No) => {
    const bookingDetail = this.props.route.params.bookingDetail;
    let postData = {
      Collector_Code: this.props.collectorCode,
      Firm_No: bookingDetail.Firm_No,
      Booking_Date: bookingDetail.Booking_Date,
      Booking_No: bookingDetail.Booking_No,
      Rating_No: Rating_No,
    };

    this.props.getSubmitRating(postData, (isSuccess) => {
      if (isSuccess) {
      }
    });
  };

  _renderNavigationView = () => {
    return (
      <View style={styles.navigationView}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            {
              // if (Actions.currentScene === currentScene) {
              if (navigationRef.getCurrentRoute().name === currentScene) {
                this._callFinish();
              }
            }
          }}
        >
          <LinearGradient
            colors={["#1E3989", "#9B71AA", "#87C699"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.homeView}
          >
            <Text style={styles.homeText}>{"Finish"}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  _callHome = () => {
    // Actions.homeTabBar();
    navigate("homeTabBar");
  };

  _callFinish = () => {
    let postData = this.props.route.params.updateCollectionData;
    const bookingDetail = this.props.route.params.bookingDetail;

    if (this.state.cashSwitchValue) {
      postData.Pay_Mode = 'C';
    } else if (this.state.phonepePaymentValue) {
      postData.Pay_Mode = 'F';
      postData.Pay_Ref_No = this.state.transactionNumber;
    }
    if (this.props.route.params.bookingDetail.IsDue === 'true') {
      if (
        bookingDetail.Patient_Due !== null &&
        bookingDetail.Patient_Due !== "" &&
        bookingDetail.Patient_Due !== "0" &&
        bookingDetail.Patient_Due !== 0
      ) {
        if (this.state.cashSwitchValue || this.state.phonepePaymentValue) {
          console.log({postData})
          this._callOrderAPI(postData);
        } else {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            'Kindly collect the payment and turn on the cash received or UPI payment received button to proceed',
          );
        }
      } else {
        this._callOrderAPI(postData);
      }
    } else {
      this._callOrderAPI(postData);
    }
  };

  _getAsyncAndAPICall(postData) {
    let pendingRequest = {
      Collector_Code: this.props.collectorCode,
      Filter_Type: "P",
      Schedule_Date: postData.Booking_Date
        ? postData.Booking_Date
        : moment().utcOffset("+05:30").format("YYYY/MM/DD"),
    };
    this.props.getPendingList(pendingRequest, (isSuccess) => {});
  }

  _callOrderAPI = (postData) => {
    this.props.invokeUpdateSampleCollection(postData, (isSuccess, message) => {
      if (isSuccess) {
        Alert.alert(
          Constants.ALERT.TITLE.SUCCESS,
          message,
          [
            {
              text: "OK",
              onPress: () => {
                navigate("homeTabBar");
                this._getAsyncAndAPICall(postData);
              },
            },
          ],
          { cancelable: false }
        );
      }
    });
  };
}

const mapStateToProps = (state, props) => {
  const {
    configState: { collectorCode, currency },
    sampleCollectionSummaryState: { isSampleCollectionSummaryLoading },
    cancelBookingDetailState: { isCompletedDetailLoading, bookingDetail },
    deviceState: { isNetworkConnectivityAvailable },
  } = state;
  return {
    currency,
    collectorCode,
    isSampleCollectionSummaryLoading,
    isNetworkConnectivityAvailable,
    isCompletedDetailLoading,
    // bookingDetail
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getSubmitRating,
      getSubmitReview,
      getSubmitOrderData,
      invokeUpdateSampleCollection,
      // completed Detail screen Api
      getCompletedDetail,
      getPendingList
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SampleCollectionSummary);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
    flexDirection: "column",
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  bookingIdView: { flexDirection: "row" },
  bookingIdLeftView: { alignSelf: "center", flex: 3 },
  bookingIdRightView: {
    alignSelf: "center",
    // flex: 1,
  },
  bookingDateRightViewPrescription: {
    flex: 2,
    flexDirection: "column",
    alignItems: "flex-end",
    alignSelf: "center",
  },
  bookingIdRightInnerView: { flexDirection: "row", alignItems: "center" },
  bookingIdText: {
    fontWeight: "bold",
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.M,
  },
  bookingIdTime: {
    marginTop: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
  bookingIdReportImage: {
    width: deviceHeight / 15,
    height: deviceHeight / 15,
    alignSelf: "flex-end",
  },
  bookingIdReportLink: {
    marginTop: 5,
    color: Constants.COLOR.FONT_LINK_COLOR,
    alignSelf: "flex-end",
    fontSize: Constants.FONT_SIZE.S,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  nameAddressView: { flexDirection: "row", marginTop: 0 },
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
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
  locationView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 1,
    // paddingBottom: 10,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    // backgroundColor: 'green',
    paddingVertical: 10,
    marginTop: 15,
    borderRadius: 5
  },
  nameAddressRightNameText: {
    // marginStart: 30,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.M,
  },
  testListText: {
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  nameAddressRightAgePhoneView: { flexDirection: "row", marginTop: 10 },
  nameAddressRightAgeImage: {
    width: deviceHeight / 40,
    height: deviceHeight / 40,
    alignSelf: "center",
  },
  nameAddressRightAgeText: {
    marginLeft: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
  ratingPhlebotomist: { marginTop: 30 },

  postReviewsView: { marginTop: 20 },
  navigationView: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  paymentStatusMainContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  paymentStatusText: {
    fontSize: Constants.FONT_SIZE.S,
    paddingHorizontal: 5,
    borderRadius: 5,
    paddingVertical: 2,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    alignSelf: "center",
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  SwitchToggleContainer: {
    marginTop: 16,
    width: 35,
    height: 12,
    borderRadius: 15,
    padding: 0,
  },
  CircleStyle: {
    width: 20,
    height: 20,
    borderRadius: 19,
  },

  tickImageContainer: {
    marginTop: 10,
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tickImage: {
    width: 80,
    height: 80,
  },
  tickTitle: {
    marginTop: 20,
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.GREEN_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  ticAmountVal: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: Constants.FONT_SIZE.XXXL,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: Constants.COLOR.BLACK_COLOR,
  },
  homeImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    marginLeft: 8,
    marginRight: 4,
    alignSelf: "center",
  },
  homeView: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '100%'
  },
  homeText: {
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.WHITE_COLOR,
    paddingHorizontal: 8,
    alignSelf: "center",
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
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
    backgroundColor: Constants.COLOR.PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationTextStyle: {
    // paddingHorizontal: 5,
    // paddingVertical: 5,
    color: Constants.COLOR.WHITE_COLOR,
    alignSelf: "center",
    justifyContent: "center",
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
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  bookingDateReportImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    alignSelf: "flex-end",
  },
  bookingDateReportLink: {
    fontSize: Constants.FONT_SIZE.S,
    marginStart: 5,
    color: "black",
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
  bookingDateRightInnerView: { flexDirection: "row", alignItems: "center" },
  inputs: {
    height: 50,
    marginLeft: 0,
    marginRight: 0,
    overflow: "hidden",
    borderWidth: 2,
    marginBottom: 20,
    paddingLeft: 10,
    color: Constants.COLOR.BLACK_COLOR,
    fontSize: Constants.FONT_SIZE.SM,
    flexDirection: "row",
    alignItems: "center",
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
});

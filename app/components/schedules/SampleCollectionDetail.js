/*************************************************
 * SukraasLIS - Phlebotomist
 * AboutScreen.js
 * Created by Abdul on 16/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

"use strict";
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import Constants from "../../util/Constants";
import Utility from "../../util/Utility";
import ButtonBack from "../common/ButtonBack";
import ButtonNext from "../common/ButtonNext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import HTML from 'react-native-render-html';
import LoadingScreen from "../common/LoadingScreen";
import UserDetails from "../common/UserDetails";
import TestListView from "../common/TestListView";
import { promptForEnableLocationIfNeeded } from "react-native-android-location-enabler";
import Geolocation from "@react-native-community/geolocation";
import {
  invokeUploadPrescription,
  uploadLocation,
  OTPBookingResend,
  OTPBookingSubmit,
} from "../../actions/SampleCollectionDetailAction";
import PropTypes from "prop-types";
import SummaryRow from "../schedules/SummaryRow";
import SummaryBottom from "./SummaryBottom";
import { nativationPop, navigate } from "../../rootNavigation";
import { IconOutline } from "@ant-design/icons-react-native";

const deviceWidth = Dimensions.get("window").width;

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;

class SampleCollectionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowBodyView: false,
      imgData: [],
      latLng: "",
      OTPCode: "",
      isOTPSubmit: false,
      isGPSSubmit: false,
      btnBackDisabled: false,
      btnNextDisabled: false,
      btnUploadPrescDisabled: false,
      isGPSLoading: false,
    };
  }
  static propTypes = {
    collectorOTPMandatory: PropTypes.bool,
    collectorCode: PropTypes.string,
    invokeUploadPrescription: PropTypes.func,
    uploadLocation: PropTypes.func,

    OTPBookingResend: PropTypes.func,
    OTPBookingSubmit: PropTypes.func,

    isSampleCollectionDetailLoading: PropTypes.bool,
    isLocationLoading: PropTypes.bool,
    isUploadFilesLoading: PropTypes.bool,
    isOTPResentLoading: PropTypes.bool,
    isOTPSubmitLoading: PropTypes.bool,
    isDeliveryDetailScreenLoading: PropTypes.bool,
    currency: PropTypes.string,
  };

  enableLocationAlert() {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Constants.ALERT.MESSAGE.ENABLE_LOCATION,
      [
        {
          text: Constants.ALERT.BTN.YES,
          onPress: () => {
            Linking.openURL("app-settings:");
          },
        },
        { text: Constants.ALERT.BTN.NO, onPress: () => {} },
      ],
      { cancelable: false }
    );
  }

  componentDidMount() {
    this.setState({ isOTPSubmit: false });
    this.setState({ isGPSSubmit: false });
    this._resendClick(false);
  }

  componentWillReceiveProps(nextProps) {
    // Any time props.fileUri changes, update state.
    if (this.props.fileUri !== nextProps.fileUri) {
      if (nextProps.fileUri !== "") {
        this.setState(
          {
            imgData: [...this.state.imgData, nextProps.fileData],
          },
          () => {
            // this.props.saveBase64Format(this.state.imgData);
            console.log("Selected File Data   ", this.state.imgData);
          }
        );
      }
    }
  }

  _setFileStateFromUploadScreen(fileData) {
    this.setState(
      {
        imgData: [...this.state.imgData, fileData.fileData],
      },
      () => {
        console.log("Selected File Data   ", this.state.imgData);
      }
    );
  }

  render() {
    if (this.props.isUploadFilesLoading) {
      return <LoadingScreen />;
    } else {
      return (
        <View style={styles.container}>
          <KeyboardAwareScrollView enableOnAndroid={true} style={styles.subContainer}>
            {this._renderUserInfo()}
            {this._renderServiceTest()}
            {this._renderNamePhoneView()}
            {this._renderUploadPrescriptionView()}
            {this._renderSummaryView()}
            {this._renderVerificationCodeView()}
            {this._renderUpdateLocationView()}
            {this._renderButtonsView()}
          </KeyboardAwareScrollView>
        </View>
      );
    }
  }
  _renderUserInfo = () => {
    return (
      <View>
        <UserDetails
          arrUserDetails={this.props.route.params.bookingDetail}
          isShowPDF={false}
          isShowCashStatus={true}
        />
      </View>
    );
  };

  _renderServiceTest = () => {
    return (
      <View style={styles.testView}>
        <TestListView bookingDetail={this.props.route.params.bookingDetail} />
      </View>
    );
  };

  _renderNamePhoneView = () => {
    if (
      this.props.route.params.bookingDetail.Pt_Name !== undefined &&
      this.props.route.params.bookingDetail.Pt_Name.length > 0 &&
      this.props.route.params.bookingDetail.Mobile_No !== undefined &&
      this.props.route.params.bookingDetail.Mobile_No.length > 0
    ) {
      return (
        <View>
          <TouchableOpacity
            style={styles.contactMainView}
            onPress={() => {
              this.setState({
                isShowBodyView: !this.state.isShowBodyView,
              });
            }}
          >
            <View style={styles.contactImageView}>
              {this._showCollectorProfile()}
            </View>
            <Text style={styles.contactName} numberOfLines={2}>
              {this.props.route.params.bookingDetail.Pt_Name}
            </Text>
            {this._renderArrowView()}
          </TouchableOpacity>
          {this.state.isShowBodyView ? (
            <TouchableOpacity
              style={styles.contactMobileView}
              onPress={() => {
                this.dialCall();
              }}
            >
              <View style={styles.contactMobileImageView}>
                <Image
                  source={require("../../images/callBlack.png")}
                  style={styles.contactMobileImage}
                />
              </View>
              <Text style={styles.contactMobileText}>
                {this.props.route.params.bookingDetail.Mobile_No}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    } else {
      return null;
    }
  };

  dialCall() {
    let phoneNumber = "";
    let number = this.props.route.params.bookingDetail.Mobile_No;
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  }

  _showCollectorProfile = () => {
    if (
      this.props.route.params.bookingDetail.Pt_Profile_Picture_Url !==
        undefined &&
      this.props.route.params.bookingDetail.Pt_Profile_Picture_Url !== ""
    ) {
      return (
        <Image
          source={{
            uri: this.props.route.params.bookingDetailData
              .Collector_Profile_Picture_Url,
          }}
          style={styles.contactImage}
        />
      );
    } else {
      return (
        <Image
          source={require("../../images/userBook.png")}
          style={styles.contactImage}
        />
      );
    }
  };
  _renderArrowView = () => {
    if (this.state.isShowBodyView !== true) {
      return (
        <View style={styles.contactArrowView}>
          <Image
            source={require("../../images/arrowDown.png")}
            style={styles.contactArrow}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.contactArrowView}>
          <Image
            source={require("../../images/arrowUp.png")}
            style={styles.contactArrow}
          />
        </View>
      );
    }
  };

  _renderUploadPrescriptionView = () => {
    return (
      <View>
        <FlatList
          style={{ alignSelf: "flex-end", marginTop: 10 }}
          data={this.state.imgData}
          extraData={this.state.imgData}
          keyExtractor={(item, index) => item}
          renderItem={this.imageList}
          horizontal={true}
        />
        {this.state.imgData.length < 2 ? (
          <TouchableOpacity
            style={styles.uploadButtonView}
            disabled={this.state.btnUploadPrescDisabled}
            onPress={() => {
              this.setState({
                btnUploadPrescDisabled: true,
              });
              // Actions.UploadPrescription();
              navigate("UploadPrescription", {
                onGoBack: this._setFileStateFromUploadScreen.bind(this),
              });
              setTimeout(() => {
                this.setState({
                  btnUploadPrescDisabled: false,
                });
              }, 1000);
            }}
          >
            <IconOutline name="arrow-up" size={deviceHeight / 30} color={Constants.COLOR.THEME_COLOR} />
            <Text style={styles.uploadLabel}>Upload Prescription</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    );
  };

  imageList = ({ item, index }) => {
    return (
      <View>
        {this._showImageIcon(item)}
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 5,
            top: 0,
            bottom: 0,
          }}
          onPress={() => {
            this.deleteItemByIndex(index, item);
          }}
        >
          <Image
            style={{
              width: 15,
              height: 15,
              overflow: "visible",
            }}
            source={require("../../images/closeImageSmall.png")}
          />
        </TouchableOpacity>
      </View>
    );
  };
  _showImageIcon = (item) => {
    console.log("item ", item);
    if (
      item.type === "image/jpeg" ||
      item.type === "image/png" ||
      item.type === "image/jpg" ||
      item.type === "jpeg" ||
      item.type === "png" ||
      item.type === "jpg"
    ) {
      return (
        <Image
          style={{
            width: 50,
            height: 50,
            alignContent: "flex-end",
            alignSelf: "flex-end",
            marginRight: 10,
          }}
          source={{ uri: item.fileUri }}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <IconOutline
              name="file-pdf"
              size={50}
              color="red"
              style={styles.bookingIdReportImage}
            />
      );
    }
  };

  deleteItemByIndex = (index, item) => {
    const filteredData = this.state.imgData.filter((fitem) => fitem !== item);
    this.setState(
      {
        imgData: filteredData,
      },
      () => {
        console.log("Delete Item  ", this.state.imgData);
      }
    );
  };

  _renderSummaryView = () => {
    if (
      this.props.route.params.bookingDetail.Service_Detail !== undefined &&
      this.props.route.params.bookingDetail.Service_Detail !== null &&
      this.props.route.params.bookingDetail.Service_Detail.length > 0
    ) {
      return (
        <View style={{ marginTop: 16 }}>
          <View style={{borderTopLeftRadius: 5, borderTopRightRadius: 5, overflow: 'hidden', backgroundColor: Constants.COLOR.LIGHT_GREY}}>
          <FlatList
            style={{ marginTop: 8 }}
            data={this.props.route.params.bookingDetail.Service_Detail}
            renderItem={this._renderSummaryRow}
            keyExtractor={this._keyExtractor}
          />
          </View>
          {this.props.route.params.bookingDetail.Sample_Collection_Charge !==
            undefined &&
          this.props.route.params.bookingDetail.Sample_Collection_Charge !==
            0 ? (
            <FlatList
              style={{ marginTop: 0 }}
              data={[
                {
                  Service_Name: "Sample Collection Charges",
                  Service_Amount:
                    this.props.route.params.bookingDetail
                      .Sample_Collection_Charge,
                },
              ]}
              renderItem={this._renderSummaryRow}
              keyExtractor={this._keyExtractor}
            />
          ) : null}
          <SummaryBottom
            currency={this.props.currency}
            data={this.props.route.params.bookingDetail.Service_Detail}
            serviceDetail={this.props.route.params.bookingDetail}
            collectionCharge={
              this.props.route.params.bookingDetail.Sample_Collection_Charge
            }
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

  _renderVerificationCodeView = () => {
    return (
      <View style={styles.locationMain}>
        <View style={styles.locationTitleMain}>
          <Text style={styles.locationTitle}>Enter your verification code</Text>
        </View>

        <View style={styles.locationContentMain}>
          <View style={styles.locationTextImageMain}>
            <TextInput
              returnKeyType={"done"}
              onSubmitEditing={() => {
                this._onPressSubmitOTP();
              }}
              maxLength={4}
              numberOfLines={1}
              editable={!this.state.isOTPSubmit}
              style={styles.locationTextEdit}
              blurOnSubmit={false}
              value={this.state.OTPCode}
              keyboardType="number-pad"
              onChangeText={(OTPCode) => {
                const numericValue = OTPCode.replace(/[^0-9]/g, '');
                if (numericValue === OTPCode) {
                  this.setState({ OTPCode: numericValue });
                }
              }}
            />
            <TouchableOpacity
              disabled={this.state.isOTPSubmit}
              onPress={() => {
                this._resendClick(true);
              }}
            >
              {this._renderResendImg()}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            disabled={this.state.isOTPSubmit}
            style={styles.locationUpdateClick}
            onPress={() => {
              this._onPressSubmitOTP();
            }}
          >
            {this._renderResendCodeText()}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderResendImg = () => {
    if (this.props.isOTPResentLoading) {
      return (
        <ActivityIndicator color={Constants.COLOR.THEME_COLOR} style={styles.locationIconImg} />
      );
    } else {
      return (
        <IconOutline name="sync" style={{alignItems: 'center', justifyContent: 'center'}} color={Constants.COLOR.BLACK_COLOR} size={25} />
      );
    }
  };

  _onPressSubmitOTP = () => {
    if (
      this.state.OTPCode !== null &&
      this.state.OTPCode !== undefined &&
      this.state.OTPCode.trim().length > 0
    ) {
      let postData = {
        Firm_No: this.props.route.params.bookingDetail.Firm_No,
        Booking_Date: this.props.route.params.bookingDetail.Booking_Date,
        Booking_No: this.props.route.params.bookingDetail.Booking_No,
        Collector_Code: this.props.collectorCode,
        Otp_Code: this.state.OTPCode,
      };
      this.props.OTPBookingSubmit(postData, (isSuccess) => {
        if (isSuccess === true) {
          this.setState({ isOTPSubmit: true });
        }
      });
    } else {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        "Kindly enter the verification code"
      );
    }
  };

  // _renderVerificationCodeView1 = () => {
  //   return (
  //     <View style={styles.verificationMain}>
  //       <View style={styles.verificationTitleView}>
  //         <Text style={styles.verificationTitle}>
  //           Enter your verification code
  //         </Text>
  //       </View>

  //       <View style={styles.verificationSubView}>
  //         <TextInput

  //           style={styles.verificationEditText}
  //           value={this.state.OTPCode}
  //           onChangeText={(OTPCode) =>
  //             this.setState({
  //               OTPCode: OTPCode,
  //             })
  //           }
  //         />
  //         <TouchableOpacity
  //           style={styles.verificationResendClick}
  //           onPress={() => {
  //             this._resendClick();
  //           }}>
  //           {this._renderResendCodeText()}
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // };

  _renderResendCodeText = () => {
    if (this.props.isOTPSubmitLoading) {
      return (
        <ActivityIndicator
          color={Constants.COLOR.THEME_COLOR}
          style={[styles.verificationResendText, { marginLeft: 10 }]}
        />
      );
    } else {
      return <Text style={styles.verificationResendText}>Submit</Text>;
    }
  };

  _resendClick = (isFromResend) => {
    let postData = {
      Firm_No: this.props.route.params.bookingDetail.Firm_No,
      Booking_Date: this.props.route.params.bookingDetail.Booking_Date,
      Booking_No: this.props.route.params.bookingDetail.Booking_No,
      Collector_Code: this.props.collectorCode,
    };
    this.props.OTPBookingResend(
      postData,
      isFromResend,
      (isSuccess, message) => {
        console.log(' sms link before ', AsyncStorage.configUri.sm_gw_li,this.props.route.params.bookingDetail.Mobile_No ,message)
        if (isSuccess) {
          let smsLink = AsyncStorage.configUri.sm_gw_li
            .replace(
              "$MOBILE_NO$",
              this.props.route.params.bookingDetail.Mobile_No
            )
            .replace("$MESSAGE$", message);

          fetch(smsLink, {
            method: "GET",
          })
            .then((response) => {
              console.log('fetch json resp', smsLink, response.body)
              return response.json()
            })
            .then((responseJson) => {
              console.log('sms link');
              console.log(smsLink);
              console.log(responseJson);
            })
            //If response is not in json then in error
            .catch((error) => {
              console.error(error);
            });
        }
      }
    );
  };

  _renderUpdateLocationView = () => {
    return (
      <View style={styles.locationMain}>
        <View style={styles.locationTitleMain}>
          <Text style={styles.locationTitle}>Update Location</Text>
        </View>

        <View style={styles.locationContentMain}>
          <TouchableOpacity
            disabled={this.props.isLocationLoading}
            style={styles.locationTextImageMain}
            onPress={() => {
              this._onPressLocateMe();
            }}
          >
            <Text style={styles.locationText}>
              {this.state.latLng.length > 0
                ? this.state.latLng
                : "Update Location"}
            </Text>
            {this._renderLocationImg()}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.isGPSLoading}
            style={styles.locationUpdateClick}
            onPress={() => {
              this._onPressUpdateLocateMe();
            }}
          >
            {this._renderUpdateCodeText()}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderUpdateCodeText = () => {
    if (this.props.isLocationLoading) {
      return (
        <ActivityIndicator
          color={Constants.COLOR.PRIMARY_COLOR}
          style={[styles.verificationResendText, { marginLeft: 10 }]}
        />
      );
    } else {
      return <Text style={styles.locationUpdateText}>Update</Text>;
    }
  };

  _renderLocationImg = () => {
    if (this.state.isGPSLoading) {
      return (
        <ActivityIndicator color={Constants.COLOR.THEME_COLOR} style={styles.locationIconImg} />
      );
    } else {
      return (
        <IconOutline style={{marginHorizontal: 5,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',}} name="environment"  color={Constants.COLOR.BLACK_COLOR} size={deviceHeight / 40} />
      );
    }
  };

  _onPressUpdateLocateMe = () => {
    if (
      this.state.latLng !== null &&
      this.state.latLng !== undefined &&
      this.state.latLng.trim().length > 0
    ) {
      var latLang = this.state.latLng.split(",");
      let updateLocationInfo = {
        Firm_No: this.props.route.params.bookingDetail.Firm_No,
        Booking_Date: this.props.route.params.bookingDetail.Booking_Date,
        Booking_No: this.props.route.params.bookingDetail.Booking_No,
        Collector_Code: this.props.collectorCode,
        Latitude: latLang[0],
        Longitude: latLang[1],
      };
      this.props.uploadLocation(updateLocationInfo, (isSuccess) => {
        this.setState({ isGPSSubmit: true });
      });
    } else {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        "Kindly update the location"
      );
    }
  };

  _onPressLocateMe = () => {
    this.setState({ isGPSLoading: true });
    if (Platform.OS === "android") {
      promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then((data) => {
          this._getCurrentLocationHandler();
        })
        .catch((err) => {
          this.setState({ isGPSLoading: false });
          console.log(err);
        });
    } else {
      Geolocation.requestAuthorization();
      this._getCurrentLocationHandler();
    }
  };

  _onNextPress = () => {
    if (this.props.collectorOTPMandatory === true) {
      if (this.state.isOTPSubmit === true) {
        return this._uploadApiValidation();
      } else {
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          "Kindly validate the verification code to proceed"
        );
      }
    } else {
      return this._uploadApiValidation();
    }
  };

  _uploadApiValidation = () => {
    if (Object.keys(this.state.imgData).length > 0) {
      let dicUploadInfo = {
        Firm_No: this.props.route.params.bookingDetail.Firm_No,
        Booking_Date: this.props.route.params.bookingDetail.Booking_Date,
        Booking_No: this.props.route.params.bookingDetail.Booking_No,
        Booking_Type: this.props.route.params.bookingDetail.Booking_Type,
        Prescription_File1:
          Object.keys(this.state.imgData).length > 0
            ? this.state.imgData[0].fileUri
            : "",
        File_Extension1:
          Object.keys(this.state.imgData).length > 0
            ? this.state.imgData[0].type
            : "",
        Prescription_FileName1:
          Object.keys(this.state.imgData).length > 0
            ? this.state.imgData[0].fileName
            : "",
        Prescription_File2:
          Object.keys(this.state.imgData).length > 1
            ? this.state.imgData[1].fileUri
            : "",
        File_Extension2:
          Object.keys(this.state.imgData).length > 1
            ? this.state.imgData[1].type
            : "",
        Prescription_FileName2:
          Object.keys(this.state.imgData).length > 1
            ? this.state.imgData[1].fileName
            : "",
      };

      let body = new FormData();
      if (dicUploadInfo.Prescription_File1.length > 0) {
        body.append("File1_Name", {
          uri: dicUploadInfo.Prescription_File1,
          name: "file1",
          filename: dicUploadInfo.Prescription_FileName1,
          type: dicUploadInfo.File_Extension1,
        });
        body.append(
          "File1_Extension",
          dicUploadInfo.File_Extension1.includes("/")
            ? dicUploadInfo.File_Extension1.split("/")[1]
            : dicUploadInfo.File_Extension1
        );
      }
      if (dicUploadInfo.Prescription_File2 !== "") {
        body.append("File2_Name", {
          uri: dicUploadInfo.Prescription_File2,
          name: "file2",
          filename: dicUploadInfo.Prescription_FileName2,
          type: dicUploadInfo.File_Extension2,
        });
        body.append(
          "File2_Extension",
          dicUploadInfo.File_Extension2.includes("/")
            ? dicUploadInfo.File_Extension2.split("/")[1]
            : dicUploadInfo.File_Extension2
        );
      }
      body.append("Booking_Type", dicUploadInfo.Booking_Type);
      body.append("Firm_No", dicUploadInfo.Firm_No);
      body.append("Booking_Date", dicUploadInfo.Booking_Date);
      body.append("Booking_No", dicUploadInfo.Booking_No);

      console.log("this are params", this.props);

      this.props.invokeUploadPrescription(body, (isSuccess, message) => {
        if (isSuccess === true) {
          if (
            this.props.route.params.bookingDetail.Barcode_Detail !== null &&
            this.props.route.params.bookingDetail.Barcode_Detail !==
              undefined &&
            this.props.route.params.bookingDetail.Barcode_Detail.length > 0
          ) {
            // Actions.sampleCollectionScreen({
            //   barCodeDetail: this.props.route.params.bookingDetail.Barcode_Detail,
            //   bookingDetail: this.props.route.params.bookingDetail,
            // });
            navigate("sampleCollectionScreen", {
              barCodeDetail:
                this.props.route.params.bookingDetail.Barcode_Detail,
              bookingDetail: this.props.route.params.bookingDetail,
            });
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.BAR_CODE_EMPTY
            );
          }
          // Alert.alert(
          //   Constants.ALERT.TITLE.SUCCESS,
          //   message,
          //   [
          //     {
          //       text: 'OK',
          //       onPress: () => {
          //         if (
          //           this.props.route.params.bookingDetail.Barcode_Detail !== null &&
          //           this.props.route.params.bookingDetail.Barcode_Detail !== undefined &&
          //           this.props.route.params.bookingDetail.Barcode_Detail.length > 0
          //         ) {
          //           // Actions.sampleCollectionScreen({
          //           //   barCodeDetail: this.props.route.params.bookingDetail.Barcode_Detail,
          //           //   bookingDetail: this.props.route.params.bookingDetail,
          //           // });
          //         } else {
          //           Utility.showAlert(
          //             Constants.ALERT.TITLE.ERROR,
          //             Constants.VALIDATION_MSG.BAR_CODE_EMPTY,
          //           );
          //         }
          //       },
          //     },
          //   ],
          //   {cancelable: false},
          // );
        }
      });
    } else {
      if (
        this.props.route.params.bookingDetail.Barcode_Detail !== null &&
        this.props.route.params.bookingDetail.Barcode_Detail !== undefined &&
        this.props.route.params.bookingDetail.Barcode_Detail.length > 0
      ) {
        // Actions.sampleCollectionScreen({
        //   barCodeDetail: this.props.route.params.bookingDetail.Barcode_Detail,
        //   bookingDetail: this.props.route.params.bookingDetail,
        // });
        navigate("sampleCollectionScreen", {
          barCodeDetail: this.props.route.params.bookingDetail.Barcode_Detail,
          bookingDetail: this.props.route.params.bookingDetail,
        });
      } else {
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.BAR_CODE_EMPTY
        );
      }
    }
  };

  // getCurrent Location
  _getCurrentLocationHandler = () => {
    Geolocation.getCurrentPosition(
      (pos) => {
        this.setState({ isGPSLoading: false });
        this.setState({
          latLng: pos.coords.latitude + "," + pos.coords.longitude,
        });
      },
      (err) => {
        this.setState({ isGPSLoading: false });
        console.log(err);
        //Check enable Location on IOS
        if (Platform.OS === "ios") {
          if (err.code === 2) {
            this.enableLocationAlert();
          }
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 200000,
        maximumAge: 1000,
      }
    );
  };

  _renderButtonsView = () => {
    return (
      <View style={styles.navigationButtonsMain}>
        {/* <TouchableOpacity
          disabled={this.state.btnBackDisabled}
          onPress={() => {
            this.setState({
              btnBackDisabled: true,
            });
            // Actions.pop();
            nativationPop();
            setTimeout(() => {
              this.setState({
                btnBackDisabled: false,
              });
            }, 1000);
          }}
        >
          <ButtonBack />
        </TouchableOpacity> */}

        <TouchableOpacity
          disabled={this.state.btnNextDisabled}
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
      </View>
    );
  };
}
const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    configState: { collectorCode, currency, collectorOTPMandatory },
    sampleCollectionDetailState: {
      isSampleCollectionDetailLoading,
      isLocationLoading,
      isUploadFilesLoading,
    },
    deliveryDetailScreenState: {
      isOTPResentLoading,
      isOTPSubmitLoading,
      isDeliveryDetailScreenLoading,
    },
  } = state;
  return {
    collectorOTPMandatory,
    currency,
    collectorCode,
    isSampleCollectionDetailLoading,
    isLocationLoading,
    isUploadFilesLoading,
    isOTPResentLoading,
    isOTPSubmitLoading,
    isDeliveryDetailScreenLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      invokeUploadPrescription,
      uploadLocation,
      OTPBookingResend,
      OTPBookingSubmit,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SampleCollectionDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
  },
  subContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  verificationMain: { flex: 1, flexDirection: "column", marginTop: 20 },
  verificationTitleView: { flex: 1, flexDirection: "row" },
  verificationTitle: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#4C4C4C",
    color: Constants.COLOR.WHITE_COLOR,
  },
  verificationSubView: { flex: 1, flexDirection: "row", marginTop: 10 },
  verificationEditText: {
    flex: 4,
    borderRadius: 5,
    backgroundColor: "#F8F5F5",
    color: "black",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: Constants.FONT_SIZE.SM,
  },
  verificationResendClick: {
    flex: 2,
    alignSelf: "center",
    alignItems: "flex-start",
  },
  verificationResendText: {
    margin: 10,
    color: Constants.COLOR.THEME_COLOR,
    textAlign: "center",
    fontSize: Constants.FONT_SIZE.M,
  },
  locationMain: { flex: 1, flexDirection: "column", marginTop: 20 },
  locationTitleMain: { flex: 1, flexDirection: "row" },
  locationContentMain: { 
    flex: 1,
    flexDirection: "row",
    marginTop: 10 
  },
  locationTitle: {
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    color: Constants.COLOR.THEME_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD,
  },
  locationTextImageMain: {
    flex: 4,
    borderRadius: 5,
    backgroundColor: Constants.COLOR.LIGHT_GREY,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: 'center'
  },
  locationUpdateClick: {
    flex: 2,
    alignSelf: "center",
    alignItems: "flex-start",
  },
  locationText: {
    flex: 8,
    color: "black",
    fontSize: Constants.FONT_SIZE.M,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  locationTextEdit: {
    flex: 8,
    color: "black",
    fontSize: Constants.FONT_SIZE.M,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  locationIconImg: {
    flex: 1,
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },

  locationUpdateText: {
    margin: 10,
    color: Constants.COLOR.THEME_COLOR,
    textAlign: "left",
    fontSize: Constants.FONT_SIZE.M,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_ANEK_LATIN_REGULAR
  },

  navigationButtonsMain: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 40,
    marginHorizontal: 0,
    flexDirection: "row",
  },

  uploadButtonView: {
    marginTop: 20,
    padding: 15,
    borderColor: "#E8ECF2",
    borderRadius: 25,
    backgroundColor: "#E8ECF2",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
  },
  uploadImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    alignSelf: "center",
  },
  uploadLabel: {
    color: "#2C579F",
    marginLeft: 10,
    alignSelf: "center",
    fontSize: Constants.FONT_SIZE.SM,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },

  contactMainView: {
    flex: 1,
    marginTop: 15,
    flexDirection: "row",
    backgroundColor: Constants.COLOR.LIGHT_GREY,
    // width: deviceWidth / 2.957,
    borderRadius: 7,
    alignItems: "center",
    paddingVertical: 7,
  },
  contactImageView: { flex: 1 },
  contactImage: {
    height: deviceHeight / 20,
    width: deviceHeight / 20,
    borderRadius: deviceHeight / 20,
    alignSelf: "center",
  },
  contactName: {
    flex: 3,
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.FONT_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },

  contactArrowView: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  contactArrow: {
    marginRight: 10,
    textAlign: "right",
    height: deviceHeight / 30,
    width: deviceHeight / 30,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  contactMobileView: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderBottomEndRadius: 7,
    alignItems: "center",
    paddingVertical: 10,
  },
  contactMobileImageView: { flex: 1 },
  contactMobileImage: {
    height: deviceHeight / 30,
    width: deviceHeight / 30,
    alignSelf: "center",
  },
  contactMobileText: {
    flex: 4,
    alignSelf: "center",
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.FONT_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  testView: {
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
});

/*************************************************
 * SukraasLIS
 * @exports
 * @class BookingDetailsScreen.js
 * @extends Component
 * Created by Sankar on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert,
  BackHandler,
} from 'react-native';
import LoadingScreen from '../common/LoadingScreen';
import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
const deviceWidth = Dimensions.get('window').width;
import RatingsView from './RatingsView';
import PostReviews from './PostReviews';
import ButtonBack from '../common/ButtonBack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import SwitchToggle from 'react-native-switch-toggle';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SummaryRow from '../schedules/SummaryRow';
import SummaryBottom from './SummaryBottom';
import HTML from 'react-native-render-html';
import { getCompletedDetail } from '../../actions/CancelBookingDetailAction';
import {
  getSubmitRating,
  getSubmitReview,
  getSubmitOrderData,
} from '../../actions/SampleCollectionSummaryAction';
import { getPdfReport } from '../../actions/PendingDetailAction';
import moment from 'moment';
import { nativationPop, navigate, navigationRef } from '../../rootNavigation';
import RiyalPrice from '../common/RiyalPrice';
import { IconFill, IconOutline } from '@ant-design/icons-react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomAlert from '../common/CustomAlert';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

function isEmpty(arg) {
  for (var item in arg) {
    return false;
  }
  return true;
}

let currentScene = 'completedBookingDetailScreen';
class CompletedBookingDetailScreen extends Component {
  static propTypes = {
    isSampleCollectionSummaryLoading: PropTypes.bool,
    getSubmitRating: PropTypes.func,
    getSubmitReview: PropTypes.func,
    getSubmitOrderData: PropTypes.func,
    invokeUpdateSampleCollection: PropTypes.func,
    // completed  Detail props
    isCompletedDetailLoading: PropTypes.bool,
    bookingDetail: PropTypes.object,
    getCompletedDetail: PropTypes.func,
    pdfReport: PropTypes.object,

    getPdfReport: PropTypes.func,
  };

  constructor() {
    super();

    this.state = {
      cashSwitchValue: false,
      ratingValue: 0,
      reviewValue: '',
      isCommentsAdded: false,
    };
  }
  componentDidMount() {
    const {
      Firm_No,
      Booking_No,
      Collector_Code,
      Booking_Date,
      Booking_Type,
    } = this.props.route.params.rowData;
    let dictInfo = {
      Firm_No,
      Booking_No,
      Collector_Code,
      Booking_Date,
      Booking_Type,
    };
    this.props.getCompletedDetail(dictInfo, (isSuccess) => {
      if (isSuccess === true) {
        if (
          this.props.bookingDetail.Post_Review !== '' &&
          this.props.bookingDetail.Post_Review !== undefined
        ) {
          this.setState({
            isCommentsAdded: true,
          });
        }
      }
    });
  }

  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    if (
      this.props.isCompletedDetailLoading ||
      this.props.isPdfLoading ||
      this.props.isSampleCollectionSummaryLoading
    ) {
      return this._screenLoading();
    } else {
      if (
        this.props.bookingDetail !== '' &&
        this.props.bookingDetail !== undefined &&
        !isEmpty(this.props.bookingDetail)
      ) {
        return (
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            {this._renderBodyView()}
          </View>
        );
      } else {
        return (
          <View style={styles.noDataMainView}>
            <View style={styles.noDataSubView}>
              <Text style={{ textAlign: 'center' }}>No Data Found! </Text>
            </View>
            <TouchableOpacity
              style={styles.backBtn}
              disabled={this.state.btnBackDisabled}
              onPress={() => {
                {
                  this.setState({
                    btnBackDisabled: true,
                  });
                }
                // Actions.pop();
                nativationPop();
                setTimeout(() => {
                  {
                    this.setState({
                      btnBackDisabled: false,
                    });
                  }
                }, 1000);
              }}>
              <ButtonBack />
            </TouchableOpacity>
          </View>
        );
      }
    }
  };

  _screenLoading = () => {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <LoadingScreen />
      </View>
    );
  };

  _renderPDFImageView = () => {
    if (this.props.bookingDetail.IsPrescription === 'True') {
      return (
        // <View style = {styles.bookingIdDateMainView}>
        // <View style = {styles.bookingIdReportSubView}>
        <View style={styles.bookingIdRightView}>
          <TouchableOpacity
            onPress={() => {
              let dictInfo = {
                Firm_No: this.props.bookingDetail.Firm_No,
                Booking_Type: this.props.bookingDetail.Booking_Type,
                Booking_Date: this.props.bookingDetail.Booking_Date,
                Booking_No: this.props.bookingDetail.Booking_No,
              };
              this.props.getPdfReport(dictInfo, (isSuccess) => {
                if (isSuccess === true) {
                  this._selectPdfFile();
                }
              });
            }}
            style={styles.bookingIdRightInnerView}
          >
            <IconOutline
              name="file-pdf"
              size={30}
              color="red"
              style={styles.bookingIdReportImage}
            />
            <Text style={styles.bookingIdReportLink} numberOfLines={2}>
              View Prescription
            </Text>
          </TouchableOpacity>
        </View>
        // </View>
        // </View>
      );
    } else {
      return null;
    }
  };

  _selectPdfFile = () => {
    if (
      this.props.pdfReport.Prescription_File1 !== null &&
      this.props.pdfReport.Prescription_File1 !== '' &&
      this.props.pdfReport.Prescription_File2 !== null &&
      this.props.pdfReport.Prescription_File2 !== ''
    ) {
      Alert.alert(
        'View Prescription',
        'kindly select the prescriptions to View',
        [
          {
            text: 'Cancel',
            onPress: () => { },
          },
          {
            text: 'View Prescription 2',
            onPress: () => {
              // Actions.pdfReport({ pdf: this.props.pdfReport.Prescription_File2 });
              navigate('pdfReport', { pdf: this.props.pdfReport.Prescription_File2 });
            },
          },
          {
            text: 'View Prescription 1',
            onPress: () => {
              // Actions.pdfReport({ pdf: this.props.pdfReport.Prescription_File1 });
              navigate('pdfReport', { pdf: this.props.pdfReport.Prescription_File1 });
            },
          },
        ],
        { cancelable: false },
      );
    } else if (
      this.props.pdfReport.Prescription_File1 !== null &&
      this.props.pdfReport.Prescription_File1 !== ''
    ) {
      // Actions.pdfReport({ pdf: this.props.pdfReport.Prescription_File1 });
      navigate('pdfReport', { pdf: this.props.pdfReport.Prescription_File1 });
    } else {
      this.props.dispatch({
        type: Constants.ACTIONS.SHOW_CUSTOM_ALERT,
        payload: {
          title: Constants.ALERT.TITLE.ERROR,
          message: Constants.VALIDATION_MSG.NO_DATA_FOUND,
        },
      });
    }
  };

  _renderBodyView = () => {
    return (
      <View style={styles.mainContainer}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={200}
          style={styles.subContainer}
        >
          {this._renderPDFImageView()}
          {this._renderNameView()}
          {this._renderTickAmountView()}
          {this._renderAddressView()}
          {this._renderLocationView()}
          {this._renderSummaryView()}
          {this._renderRatingsView()}
          {this._renderPostReviewsView()}
          {this._renderNavigationView()}
          <CustomAlert
            visible={!!this.props.customAlert}
            title={this.props.customAlert?.title}
            message={this.props.customAlert?.message}
            onClose={() => {
                this.props.dispatch({
                  type: Constants.ACTIONS.HIDE_CUSTOM_ALERT
                });
              
            }}
        />
        </KeyboardAwareScrollView>
      </View>
    );
  };

  _renderNameView = () => {
    return (
      <View style={styles.nameAddressView}>
        <View style={styles.nameAddressLeftView}>
          <View style={styles.profileImageView}>
            <Text style={styles.profileImageText}>
              {this.props.bookingDetail.Pt_Name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.nameAddressRightView}>
          <View style={styles.nameAddressRightNameAgeView}>
            <Text
              style={[styles.nameAddressRightNameText, { fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD }]}>
              {this.props.bookingDetail.Pt_Name},{' '}
            </Text>
            <Text style={styles.nameAddressRightNameAgeText}>
              {this.props.bookingDetail.First_Age}
            </Text>
          </View>

          <FlatList
            data={this.props.bookingDetail.Service_Detail}
            renderItem={({ item }) => this._renderTestList({ item })}
          />
        </View>
      </View>
    );
  };

  _renderTestList = ({ item }) => {
    return (
      <Text style={[styles.testListText, { marginTop: 10 }]}>
        {item.Service_Name}
      </Text>
    );
  };

  _renderTickAmountView = () => {
    if (
      this.props.bookingDetail.Due_Amount !== '' &&
      this.props.bookingDetail.Due_Amount !== null
    ) {
      return (
        <View style={[styles.tickImageContainer, { marginBottom: 20 }]}>
          <IconFill name={'check-circle'} size={90} color={Constants.COLOR.GREEN_COLOR} />
          <Text
            style={[
              styles.tickTitle,
              { color: Constants.COLOR.GREEN_COLOR, marginTop: 10, marginBottom: 10 },
            ]}>
            {this.props.bookingDetail.Payment_Full_Desc !== '' &&
              this.props.bookingDetail.Payment_Full_Desc !== undefined &&
              this.props.bookingDetail.Due_Amount === 0
              ? this.props.bookingDetail.Payment_Full_Desc
              : 'Collected Payment '}
          </Text>
          <RiyalPrice amount={this.props?.bookingDetail?.Paid_Amount?.toFixed(2)} dynamicHeight={0.042} />
        </View>
      );
    }
  };

  _renderAddressView = () => {
    return (
      <View style={styles.addressMainView}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={[
              styles.nameAddressRightNameText,
              {
                fontSize: Constants.FONT_SIZE.M,
                flex: 1,
                width: (deviceWidth * 2) / 3,
                fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
              },
            ]}>
            {this.props.bookingDetail.Pt_Name}
          </Text>
          <View style={styles.bookingDateRightView}>
            <TouchableOpacity
              onPress={() => { }}
              style={styles.bookingDateRightInnerView}>
              <IconOutline
                  name="environment"  
                  color={Constants.COLOR.BLACK_COLOR} 
                  size={deviceHeight / 40} />
              <Text style={[styles.bookingDateReportLink, { marginStart: 0 }]}>
                {this.props.bookingDetail.Branch_Name}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.fullAddressView}>
          <Text
            style={{
              color: Constants.COLOR.FONT_COLOR_DEFAULT,
              fontSize: Constants.FONT_SIZE.SM,
              fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
            }}>
            {this.props.bookingDetail.Full_Address}
          </Text>
          {this._renderLandmarkView()}
        </View>
        <Text
          style={{
            color: Constants.COLOR.FONT_COLOR_DEFAULT,
            fontSize: Constants.FONT_SIZE.SM,
            paddingVertical: 5,
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
          }}>
          {this.props.bookingDetail.Mobile_No}
        </Text>
        {
            this.props.bookingDetail?.Physician !== ''
            && <>
            <View style={styles.nameAddressRightAgePhoneView}>
              <Text style={[styles.nameAddressRightNameAgeText, { fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD }]}>
                Physician: {this.props.bookingDetail.Physician}
              </Text>
            </View>
            </>
          }
          {
            this.props.bookingDetail?.Ref_Name !== ''
            && <>
              <View style={styles.nameAddressRightAgePhoneView}>
                <Text style={[styles.nameAddressRightNameAgeText, { fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD }]}>
                  Payer: {this.props.bookingDetail.Ref_Name === 'Self' ? 'Private' : this.props.bookingDetail.Ref_Name}
                </Text>
              </View>
            </>
          }
      </View>
    );
  };

  _renderLandmarkView = () => {
    if (this.props.bookingDetail.Pt_Landmark.length > 0) {
      return (
        <Text
          style={{
            color: Constants.COLOR.FONT_COLOR_DEFAULT,
            fontSize: Constants.FONT_SIZE.SM,
          }}>
          Landmark: {this.props.bookingDetail.Pt_Landmark}
        </Text>
      );
    } else {
      return <View />;
    }
  };
  _renderLocationView = () => {
    return (
      <View style={styles.locationView}>
        <Text
          style={{
            color: Constants.COLOR.FONT_COLOR_DEFAULT,
            fontSize: Constants.FONT_SIZE.S,
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
          }}>
          {this.props.bookingDetail.Booking_Type === 'H' ? 'HOME' : 'WALK IN'}
        </Text>
        <Text
          style={{
            color: Constants.COLOR.FONT_COLOR_DEFAULT,
            fontSize: Constants.FONT_SIZE.S,
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
          }}>
          {moment(this.props.bookingDetail.Visit_Date, 'YYYY/MM/DD').format(
            'DD/MM/YYYY',
          )}
        </Text>
        <Text
          style={{
            color: Constants.COLOR.FONT_COLOR_DEFAULT,
            fontSize: Constants.FONT_SIZE.S,
            fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
          }}>
          {this.props.bookingDetail.Visit_Time}
        </Text>
      </View>
    );
  };

  _renderSummaryView = () => {
    console.log('completed summary view:: ', this.props.bookingDetail);
    if (this.props.isCompletedDetailLoading) {
      return <View />;
    } else {
      if (
        this.props.bookingDetail.Service_Detail !== undefined &&
        this.props.bookingDetail.Service_Detail !== null &&
        this.props.bookingDetail.Service_Detail.length > 0
      ) {
        return (
          <View style={{ marginTop: 16 }}>
            <FlatList
              style={{ marginTop: 8 }}
              data={this.props.bookingDetail.Service_Detail}
              renderItem={this._renderSummaryRow}
              keyExtractor={this._keyExtractor}
            />
            {this.props.bookingDetail.Sample_Collection_Charge !== undefined
              && this.props.bookingDetail.Sample_Collection_Charge !== 0
              ? <FlatList
                style={{ marginTop: 0 }}
                data={[{
                  "Service_Name": "Sample Collection Charges",
                  "Service_Amount": this.props.bookingDetail.Sample_Collection_Charge
                }]}
                renderItem={this._renderSummaryRow}
                keyExtractor={this._keyExtractor}
              />
              : null}
            { console.log('completedbottom:: ', this.props.bookingDetail) }
            <SummaryBottom
              currency={this.props.currency}
              data={this.props.bookingDetail.Service_Detail}
              serviceDetail={this.props.bookingDetail}
              collectionCharge={this.props.bookingDetail.Sample_Collection_Charge}
            />
          </View>
        );
      } else {
        return <View />;
      }
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
    if (
      this.props.bookingDetail.Rating_Code !== '' &&
      this.props.bookingDetail.Rating_Code !== undefined &&
      this.props.bookingDetail.Rating_Code !== 0
    ) {
      return (
        <View style={styles.ratingPhlebotomist}>
          <RatingsView isRatingValue={this.props.bookingDetail.Rating_Code} />
        </View>
      );
    } else {
      return (
        <View style={styles.ratingPhlebotomist}>
          <RatingsView
            isRatingValue={this.state.ratingValue}
            onPressRating={(Rating_No) => {
              if (this.props.isNetworkConnectivityAvailable) {
                this.setState(
                  {
                    ratingValue: Rating_No,
                  },
                  () => {
                    this._onSubmitRating(this.state.ratingValue);
                  },
                );
              } else {
                Utility.showAlertWithPopAction(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.NO_INTERNET,
                );
              }
            }}
          />
        </View>
      );
    }
  };

  _renderPostReviewsView = () => {
    if (
      this.props.bookingDetail.Post_Review !== '' &&
      this.props.bookingDetail.Post_Review !== undefined &&
      this.state.isCommentsAdded
    ) {
      return (
        <View style={{ padding: 10 }}>
          <Text style={{
              marginTop: 10,
              fontSize: Constants.FONT_SIZE.L,
              color: Constants.COLOR.FONT_COLOR_DEFAULT ,
              fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
            }}>
            Feedback:
          </Text>
          <Text
            style={{
              color: Constants.COLOR.FONT_COLOR_DEFAULT,
              marginTop: 5,
              marginBottom: 30,
              fontSize: Constants.FONT_SIZE.SM,
              fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
            }}>
            {this.props.bookingDetail.Post_Review}
          </Text>
        </View>
      );
    } else {
      let postData = {
        Collector_Code: this.props.collectorCode,
        Firm_No: this.props.bookingDetail.Firm_No,
        Booking_Date: this.props.bookingDetail.Booking_Date,
        Booking_No: this.props.bookingDetail.Booking_No,
        Post_Review: this.state.reviewValue,
      };

      return (
        <View style={styles.postReviewsView}>
          <PostReviews
            // Editable={this.state.isCommentsAdded === true ? false : true}
            btnDisabled={this.state.isCommentsAdded}
            Editable={!this.state.isCommentsAdded}
            isShowFeedBack={false}
            postReviewValue={this.state.reviewValue}
            onPostClick={() => {
              if (this.state.reviewValue.length > 0) {
                if (this.props.isNetworkConnectivityAvailable) {
                  this.props.getSubmitReview(postData, (isSuccess) => {
                    if (isSuccess) {
                      this.setState({
                        isCommentsAdded: true,
                      });
                    }
                  });
                } else {
                  Utility.showAlertWithPopAction(
                    Constants.ALERT.TITLE.FAILED,
                    Constants.VALIDATION_MSG.NO_INTERNET,
                  );
                }
              }
            }}
            onPostChangeText={(value) => {
              this.setState({
                reviewValue: value,
                // isCommentsAdded: true,
              });
            }}
          />
        </View>
      );
    }
  };

  _onSubmitRating = (Rating_No) => {
    if (this.props.isNetworkConnectivityAvailable) {
      let postData = {
        Collector_Code: this.props.collectorCode,
        Firm_No: this.props.bookingDetail.Firm_No,
        Booking_Date: this.props.bookingDetail.Booking_Date,
        Booking_No: this.props.bookingDetail.Booking_No,
        Rating_No: Rating_No,
      };
      this.props.getSubmitRating(postData, (isSuccess) => {
        if (isSuccess) {
        }
      });
    } else {
      Utility.showAlertWithPopAction(
        Constants.ALERT.TITLE.FAILED,
        Constants.VALIDATION_MSG.NO_INTERNET,
      );
    }
  };

  _renderNavigationView = () => {
    return (
      <View style={styles.navigationView}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            // Actions.currentScene === currentScene;
            if (navigationRef.getCurrentRoute().name === currentScene) {
              this._callHome();
            }
          }}
        >
          <LinearGradient
            colors={["#1E3989", "#9B71AA", "#87C699"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.homeView}
          >
            <IconOutline name='home' color={Constants.COLOR.WHITE_COLOR} size={deviceHeight/40} />
            <Text style={styles.homeText}>Home</Text>
          </LinearGradient>
          {/* <View style={styles.homeView}>
            <IconOutline name='home' color={Constants.COLOR.WHITE_COLOR} size={deviceHeight/40} />
            <Text style={styles.homeText}>Home</Text>
          </View> */}
        </TouchableOpacity>
      </View>
    );
  };

  _callHome = () => {
    // Actions.homeTabBar();
    navigate('homeTabBar');
  };
}

const mapStateToProps = (state, props) => {
  const {
    configState: { collectorCode, currency },
    sampleCollectionSummaryState: { isSampleCollectionSummaryLoading },
    cancelBookingDetailState: { isCompletedDetailLoading, bookingDetail },
    pendingDetailState: { isPdfLoading, pdfReport },
    deviceState: { isNetworkConnectivityAvailable, customAlert },

  } = state;
  return {
    currency,
    collectorCode,
    isSampleCollectionSummaryLoading,
    isPdfLoading,
    pdfReport,
    isNetworkConnectivityAvailable,
    isCompletedDetailLoading,
    bookingDetail,
    customAlert
    // bookingDetail
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        getSubmitRating,
        getSubmitReview,
        getSubmitOrderData,
        // completed Detail screen Api
        getPdfReport,
        getCompletedDetail,
      },
      dispatch,
    )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompletedBookingDetailScreen);

const styles = StyleSheet.create({
  noDataMainView: {
    flex: 1,
  },
  noDataSubView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 10,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
    // backgroundColor: 'white'
  },
  subContainer: {
    padding: 10,
    marginBottom: 10,
  },

  bookingIdRightView: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  bookingIdRightInnerView: { flexDirection: 'row', alignSelf: 'flex-end' },
  bookingIdDateMainView: { flex: 1, flexDirection: 'column' },

  bookingDateRightInnerView: { flexDirection: 'row', alignItems: 'center' },
  bookingIdReportImage: {
    width: deviceHeight / 25,
    height: deviceHeight / 25,
    alignSelf: 'flex-start',
  },
  bookingIdReportLink: {
    alignSelf: 'center',
    textAlign: 'center',
    color: Constants.COLOR.FONT_LINK_COLOR,
    fontSize: Constants.FONT_SIZE.S,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  nameAddressView: { flexDirection: 'row', marginTop: 20 },
  nameAddressLeftView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  nameAddressRightView: { flex: 3, marginStart: 10 },
  profileImageView: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
    overflow: 'hidden',
    borderColor: '#4F4F4F',
    borderWidth: 2,
  },
  profileImageText: {
    alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    color: 'black',
    fontSize: Constants.FONT_SIZE.XXL,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
  bookingDateReportImage: {
    width: deviceHeight / 30,
    height: deviceHeight / 30,
    alignSelf: 'flex-end',
  },
  bookingDateRightView: {
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
  bookingIdReportSubView: { flex: 1, flexDirection: 'row' },
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
  nameAddressRightAgePhoneView: { flexDirection: 'row', marginTop: 10 },
  nameAddressRightAgeImage: {
    width: deviceHeight / 40,
    height: deviceHeight / 40,
    alignSelf: 'center',
  },
  nameAddressRightAgeText: {
    marginLeft: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
  nameAddressRightMobileImage: {
    marginLeft: 10,
    width: deviceHeight / 40,
    height: deviceHeight / 40,
    alignSelf: 'center',
  },
  nameAddressRightMobileText: {
    marginLeft: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
  nameAddressRightAddressView: { flexDirection: 'row', marginTop: 10 },
  nameAddressRightAddressImage: {
    width: deviceHeight / 40,
    height: deviceHeight / 40,
  },
  nameAddressRightAddressText: {
    marginLeft: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
  ratingPhlebotomist: { marginTop: 30 },
  ratingService: { marginTop: 10 },
  postReviewsView: { marginTop: 20 },
  navigationView: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingDateReportLink: {
    fontSize: Constants.FONT_SIZE.S,
    marginStart: 5,
    color: 'black',
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
  backButton: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 5,
  },

  locationView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    elevation: 1,
    paddingBottom: 10,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    paddingVertical: 10,
    marginTop: 15,
    borderRadius: 5
  },
  tickImageContainer: {
    marginTop: 10,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickImage: {
    width: 70,
    height: 70,
  },
  tickTitle: { marginTop: 10, fontSize: Constants.FONT_SIZE.M, fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR },
  ticAmountVal: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: Constants.FONT_SIZE.XXXL,
    color: 'black',
  },
  homeImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    marginLeft: 8,
    marginRight: 4,
    alignSelf: 'center',
  },
  homeView: {
    flexDirection: 'row',
    backgroundColor: '#313131',
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  homeText: {
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.WHITE_COLOR,
    paddingHorizontal: 8,
    alignSelf: 'center',
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  subView: {
    flex: 1,
    backgroundColor: 'white',
  },

  addressMainView: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 5
  },
  fullAddressView: {
    flexDirection: 'column',
    paddingVertical: 5,
  },
  nameAddressRightNameAgeView: { flexDirection: 'row' },
  nameAddressRightNameAgeText: {
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.M,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
});

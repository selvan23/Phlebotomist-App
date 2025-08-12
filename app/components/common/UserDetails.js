import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import PropTypes from 'prop-types';

const deviceWidth = Dimensions.get('window').width;

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

export default class UserDetails extends Component {
  static propTypes = {
    arrUserDetails: PropTypes.object,
    pdfReport: PropTypes.object,
  };
  render() {
    return (
      <View style={styles.mainView}>
        {this._renderBookingIdDateView()}
        {this._renderNameAddressView()}
      </View>
    );
  }

  _renderBookingIdDateView = () => {
    console.log('this.props.arrBookingDetail', this.props.arrUserDetails);
    return (
      <View style={styles.bookingIdDateMainView}>
        <View style={styles.bookingIdReportSubView}>
          <View style={styles.bookingIdLeftView}>
            <Text style={styles.bookingIdText}>
              BOOKING ID: {this.props.arrUserDetails.Booking_No}
            </Text>
          </View>

          {this._renderViewPrescription()}
        </View>

        <View style={styles.bookingDateLocationSubView}>
          <View style={styles.bookingDateLeftView}>
            <Text style={styles.bookingDateText}>
              {this.props.arrUserDetails.Visit_Date_Desc}
            </Text>
          </View>

          <View style={styles.bookingDateRightView}>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.bookingDateRightInnerView}>
              <Image
                style={styles.bookingDateReportImage}
                resizeMode="contain"
                source={require('../../images/placeholder.png')}
              />
              <Text style={styles.bookingDateReportLink}>
                {this.props.arrUserDetails.Branch_Name}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  _renderViewPrescription = () => {
    if (
      this.props.arrUserDetails.IsPrescription === 'True' &&
      this.props.isShowPDF === true
    ) {
      return this._renderPDFImageView();
    } else {
      return <View />;
    }
  };

  _renderPDFImageView = () => {
    return (
      <View style={styles.bookingIdRightView}>
        <TouchableOpacity
          onPress={() => {
            this._selectPdf();
          }}
          style={styles.bookingIdRightInnerView}>
          <Image
            style={styles.bookingIdReportImage}
            resizeMode="contain"
            source={require('../../images/pdficon.png')}
          />
          <Text style={styles.bookingIdReportLink}>View Prescription</Text>
        </TouchableOpacity>
      </View>
    );
  };
  _selectPdf = () => {
    this.props.callPdf();
  };

  _renderNameAddressView = () => {
    return (
      <View style={styles.nameAddressView}>
        <View style={styles.nameAddressLeftView}>
          <View style={styles.profileImageView}>
            <Text style={styles.profileImageText}>
              {this.props.arrUserDetails.Pt_Name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.nameAddressRightView}>
          <View style={styles.nameAddressRightNameAgeView}>
            <Text style={styles.nameAddressRightNameText}>
              {this.props.arrUserDetails.Pt_Name},{' '}
            </Text>
            <Text style={styles.nameAddressRightNameAgeText}>
              {this.props.arrUserDetails.First_Age}
            </Text>
          </View>
          <View style={styles.nameAddressRightAgePhoneView}>
            <Image
              style={styles.nameAddressRightAgeImage}
              resizeMode="contain"
              source={require('../../images/gender.png')}
            />
            <Text style={styles.nameAddressRightAgeText}>
              {this.props.arrUserDetails.Gender_Code}
            </Text>
            <Image
              style={styles.nameAddressRightMobileImage}
              resizeMode="contain"
              source={require('../../images/mobile.png')}
            />
            <Text style={styles.nameAddressRightMobileText}>
              {this.props.arrUserDetails.Mobile_No}
            </Text>
          </View>

          {this._renderPatientAddress()}

          {
            this.props.arrUserDetails?.Physician !== ''
            && <>
            <View style={styles.nameAddressRightAgePhoneView}>
              <Text style={[styles.nameAddressRightNameAgeText, { fontWeight: 'bold' }]}>
                Physician: {this.props.arrUserDetails.Physician}
              </Text>
            </View>
            </>
          }
          {
            this.props.arrUserDetails?.Ref_Name !== ''
            && <>
              <View style={styles.nameAddressRightAgePhoneView}>
                <Text style={[styles.nameAddressRightNameAgeText, { fontWeight: 'bold' }]}>
                  Payer: {this.props.arrUserDetails.Ref_Name}
                </Text>
              </View>
            </>
          }
        </View>
      </View>
    );
  };

  _renderPatientAddress = () => {
    if (
      this.props.arrUserDetails.Full_Address !== undefined &&
      this.props.arrUserDetails.Full_Address !== ''
    ) {
      return (
        <View style={styles.nameAddressRightAddressView}>
          <Image
            style={styles.nameAddressRightAddressImage}
            resizeMode="contain"
            source={require('../../images/location.png')}
          />
          <View>
            <Text style={styles.nameAddressRightAddressText}>
              {this.props.arrUserDetails.Full_Address}
            </Text>
            {this._renderLandmarkView()}
          </View>
        </View>
      );
    } else {
      <View />;
    }
  };

  _renderLandmarkView = () => {
    if (this.props.arrUserDetails.Pt_Landmark.length > 0) {
      return (
        <Text style={styles.nameAddressRightAddressText}>
          Landmark: {this.props.arrUserDetails.Pt_Landmark}
        </Text>
      );
    } else {
      return <View />;
    }
  };
}

const styles = StyleSheet.create({
  mainView: {marginVertical: 5},
  bookingIdDateMainView: {flex: 1, flexDirection: 'column'},
  bookingIdReportSubView: {flex: 1, flexDirection: 'row'},
  bookingIdLeftView: {flex: 3, alignSelf: 'center'},
  bookingIdRightView: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  bookingIdRightInnerView: {flexDirection: 'row', alignItems: 'center'},
  bookingIdText: {
    alignContent: 'center',
    alignItems: 'center',
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
  },
  bookingIdReportImage: {
    width: deviceHeight / 20,
    height: deviceHeight / 20,
    alignSelf: 'flex-start',
  },
  bookingIdReportLink: {
    fontSize: Constants.FONT_SIZE.S,
    marginStart: 5,
    color: Constants.COLOR.FONT_LINK_COLOR,
  },

  bookingDateLocationSubView: {flex: 1, flexDirection: 'row', marginTop: 10},
  bookingDateLeftView: {
    flex: 5,
    alignSelf: 'center',
  },
  bookingDateRightView: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
  bookingDateRightInnerView: {flexDirection: 'row', alignItems: 'center'},
  bookingDateText: {
    alignContent: 'center',
    alignItems: 'center',
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
  },
  bookingDateReportImage: {
    width: deviceHeight / 30,
    height: deviceHeight / 30,
    alignSelf: 'flex-start',
  },
  bookingDateReportLink: {
    fontSize: Constants.FONT_SIZE.S,
    marginStart: 5,
    color: 'black',
    fontWeight: 'bold',
  },

  nameAddressView: {flexDirection: 'row', marginTop: 10},
  nameAddressLeftView: {
    flex: 1,
    justifyContent: 'center',
  },
  nameAddressRightView: {flex: 3, marginStart: 10},
  profileImageView: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
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
  },
  nameAddressRightNameAgeView: {flexDirection: 'row'},
  nameAddressRightNameText: {
    // marginStart: 30,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.M,
    fontWeight: 'bold',
  },
  nameAddressRightNameAgeText: {
    // marginStart: 30,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.M,
  },
  nameAddressRightAgePhoneView: {flexDirection: 'row', marginTop: 10},
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
  nameAddressRightAddressView: {flexDirection: 'row', marginTop: 10},
  nameAddressRightAddressImage: {
    width: deviceHeight / 40,
    height: deviceHeight / 40,
  },
  nameAddressRightAddressText: {
    marginLeft: 5,
    marginRight: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
});

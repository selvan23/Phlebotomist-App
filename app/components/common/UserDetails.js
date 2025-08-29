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
import { IconOutline } from '@ant-design/icons-react-native';

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
            {this._renderViewPrescription()}
          </View>
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
              style={styles.bookingDateRightInnerView}
            >
              <IconOutline
                name="environment"
                color="black"
                size={deviceHeight / 35}
              />
              <Text numberOfLines={1} style={styles.bookingDateReportLink}>
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
          <IconOutline name='file-pdf' size={30} color='red' style={styles.bookingIdReportImage} />
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
            <IconOutline name={`${this.props.arrUserDetails.Gender_Code === 'M' ? 'man' : 'woman'}`} size={deviceHeight/45} color={Constants.COLOR.FONT_COLOR_DEFAULT} />
            <Text style={styles.nameAddressRightAgeText}>
              {this.props.arrUserDetails.Gender_Desc}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
          <IconOutline color={Constants.COLOR.FONT_COLOR_DEFAULT} size={deviceHeight / 40} name='phone' />
            <Text style={styles.nameAddressRightMobileText}>
              {this.props.arrUserDetails.Mobile_No}
            </Text>
          </View>

          {this._renderPatientAddress()}

          {
            this.props.arrUserDetails?.Physician !== ''
            && <>
            <View style={styles.nameAddressRightAgePhoneView}>
              <Text style={[styles.nameAddressRightNameAgeText, { fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD }]}>
                Physician: {this.props.arrUserDetails.Physician}
              </Text>
            </View>
            </>
          }
          {
            this.props.arrUserDetails?.Ref_Name !== ''
            && <>
              <View style={styles.nameAddressRightAgePhoneView}>
                <Text style={[styles.nameAddressRightNameAgeText, { fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD }]}>
                  Payer: {this.props.arrUserDetails.Ref_Name === 'Self' ? 'Private' : this.props.arrUserDetails.Ref_Name}
                </Text>
              </View>
            </>
          }
          {this.props.isShowCashStatus ? (
            <View
              style={{
                paddingVertical: 2,
                paddingHorizontal: 5,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Constants.COLOR.GREEN_COLOR,
                backgroundColor: "#F0FFF0",
                width: "50%",
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  color: Constants.COLOR.GREEN_COLOR,
                  fontFamily:
                    Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD,
                  fontSize: Constants.FONT_SIZE.S,
                }}
              >
                {this.props.arrUserDetails.Payment_Full_Desc}
              </Text>
            </View>
          ) : null}
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
          <IconOutline  name="environment"  color={Constants.COLOR.FONT_COLOR_DEFAULT} size={deviceHeight / 40} />
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
  bookingIdDateMainView: { flexDirection: 'column'},
  bookingIdReportSubView: { flexDirection: 'row'},
  bookingIdLeftView: {alignItems: 'center', flexDirection: 'row', width: '100%', justifyContent: 'space-between'},
  bookingIdRightView: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginLeft: 15
  },
  bookingIdRightInnerView: {flexDirection: 'row', alignItems: 'center'},
  bookingIdText: {
    alignContent: 'center',
    alignItems: 'center',
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  bookingIdReportImage: {
    alignSelf: 'flex-start',
  },
  bookingIdReportLink: {
    fontSize: Constants.FONT_SIZE.S,
    marginStart: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  bookingDateLocationSubView: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  bookingDateLeftView: {
    alignSelf: 'center',
    width: '65%',
  },
  bookingDateRightView: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    alignSelf: 'center',
    width: '35%',
    paddingLeft: 10
  },
  bookingDateRightInnerView: {flexDirection: 'row', alignItems: 'center'},
  bookingDateText: {
    alignContent: 'center',
    alignItems: 'center',
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
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
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
  nameAddressView: {flexDirection: 'row', marginTop: 10},
  nameAddressLeftView: {
    justifyContent: 'center',
  },
  nameAddressRightView: {marginStart: 10},
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
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
  nameAddressRightNameAgeView: {flexDirection: 'row'},
  nameAddressRightNameText: {
    // marginStart: 30,
    color: Constants.COLOR.BLACK_COLOR,
    fontSize: Constants.FONT_SIZE.M,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD
  },
  nameAddressRightNameAgeText: {
    // marginStart: 30,
    color: Constants.COLOR.BLACK_COLOR,
    fontSize: Constants.FONT_SIZE.M,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  nameAddressRightAgePhoneView: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  nameAddressRightAgeImage: {
    width: deviceHeight / 40,
    height: deviceHeight / 40,
    alignSelf: 'center',
  },
  nameAddressRightAgeText: {
    marginLeft: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
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
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: 5
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
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
});
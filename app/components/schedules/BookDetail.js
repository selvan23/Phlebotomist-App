'use strict';
import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Constants from '../../util/Constants';

class BookDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this._renderAddressView()}
        <View style={styles.dateTimeView}>
          <Text style={styles.dateTimeText}> {this.props.bookingType}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.dateTimeText}> {this.props.bookingDate}</Text>
            <Text style={styles.dateTimeText}> {this.props.bookingTime}</Text>
          </View>
        </View>
      </View>
    );
  }

  _renderAddressView = () => {
    if (this.props.bookingType !== 'Walkin') {
      return (
        <View>
          <Text style={[styles.addressText, {fontWeight: 'bold'}]}>
            {this.props.patientDetails.Pt_Name}
          </Text>
        </View>
      );
    } else {
      const {
        // Address_Type_Desc,
        Street,
        Place,
        City,
        State,
        PinCode,
        Landmark,
      } = this.props.bookData;
      const {Pt_Name, Pt_Mobile_No} = this.props.patientDetails;
      return (
        <View style={styles.addressView}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.addressText, {fontWeight: 'bold'}]}>
              {Pt_Name}
            </Text>
            <View style={{flexDirection: 'row', marginRight: 10}}>
              <Image
                style={styles.bookingDateReportImage}
                resizeMode="contain"
                source={require('../../images/placeholder.png')}
              />
              <Text style={{alignSelf: 'center'}}>New York</Text>
            </View>
          </View>
          <Text style={styles.addressText}>
            {`${Street} ${','} ${Place} ${','} ${City} ${','}${State} ${','} ${PinCode} `}
          </Text>
          <Text style={styles.addressText}>{Pt_Mobile_No}</Text>
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Constants.COLOR.LAB_PAY_SUMMARY_BG,
    marginVertical: 8,
  },
  addressView: {
    marginVertical: 4,
    elevation: 0.2,
    justifyContent: 'space-around',
  },
  addressText: {
    fontSize: Constants.FONT_SIZE.SM,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 20,
    color: Constants.COLOR.LAB_SUMMARY_TEXT,
  },
  dateTimeView: {
    flexDirection: 'row',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: Constants.FONT_SIZE.SM,
    paddingHorizontal: 8,
    paddingVertical: 16,
    color: Constants.COLOR.LAB_SUMMARY_TEXT,
  },
  bookingDateReportImage: {
    // width: deviceHeight / 32,
    // height: deviceHeight / 32,
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginRight: 10,
  },
});

export default BookDetails;

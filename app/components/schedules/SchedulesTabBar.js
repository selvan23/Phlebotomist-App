/*************************************************
 * SukraasLIS - Phlebotomist
 * SchedulesTabBar.js
 * Created by Abdul on 16/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';

import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  Platform,
  alert,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  getPendingList,
  gpsLocationChange,
} from '../../actions/PendingScreenAction';
import {getNotificationCount} from '../../actions/NotificationAction';
import moment from 'moment';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import {updateGPSLocation, setLocationMessage} from '../../actions/GpsAction';
import GPSState from 'react-native-gps-state';
import { navigate } from '../../rootNavigation';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class SchedulesTabBar extends Component {
  static propTypes = {
    collectorCode: PropTypes.string,
    pendingCount: PropTypes.number,
    completedCount: PropTypes.number,
    cancelledCount: PropTypes.number,

    getPendingList: PropTypes.func,
    getNotificationCount: PropTypes.func,
    userName: PropTypes.string,
    gpsLocationChange: PropTypes.func,
    setLocationMessage: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      // date: moment().utcOffset('+05:30').format('YYYY/MM/DD'),
      Latitude: '',
      Longitude: '',
      oneTimeLocationPermission: true,
      pendingBtnClick: false,
      completedBtnClick: false,
      cancelledBtnClick: false,
      collectorCode: this.props.collectorCode,
      pendingDate:
        this.props.isCalenderDateSelected === true
          ? this.props.pendingDate
          : moment().utcOffset('+05:30').format('YYYY/MM/DD'),
    };
  }

  componentDidMount() {
    this.getNotificationCountAPI();

    this.checkGpsState();
    if (this.timer === undefined) {
      this.timer = setInterval(() => this.getNotificationCountAPI(), 1000 * 30);
    } else {
      clearInterval(this.timer);
    }
    if (this.timerLocation === undefined) {
      this.timerLocation = setInterval(
        () => this._getCurrentLocationHandler(),
        5000 * 60,
      );
    } else {
      clearInterval(this.timerLocation);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.timerLocation);
    GPSState.removeListener();
  }

  async getNotificationCountAPI() {
    if (this.props.isLoggedIn) {
      this.props.getNotificationCount(this.props.userName);
    }
  }

  checkGpsState = () => {
    GPSState.addListener((status) => {
      switch (status) {
        case GPSState.NOT_DETERMINED:
          console.log('NOT_DETERMINED');
          break;

        case GPSState.RESTRICTED:
          this.props.gpsLocationChange(false);
          this.props.setLocationMessage('Kindly enable location');
          if (this.state.oneTimeLocationPermission) {
            this.getLocationPermission();
            this.setState({oneTimeLocationPermission: false});
          }
          break;

        case GPSState.DENIED:
          this.props.gpsLocationChange(false);
          this.props.setLocationMessage(
            'Location permission denied - Enable it in settings',
          );
          GPSState.requestAuthorization(GPSState.AUTHORIZED_ALWAYS);
          break;
        case GPSState.AUTHORIZED:
          this.props.gpsLocationChange(true);
          this.getLocationPermission();
          break;
        case GPSState.AUTHORIZED_ALWAYS:
          this.props.gpsLocationChange(true);
          break;

        case GPSState.AUTHORIZED_WHENINUSE:
          this.props.gpsLocationChange(true);
          break;
      }
    });
    GPSState.requestAuthorization(GPSState.AUTHORIZED_ALWAYS);
  };

  getLocationPermission() {
    if (this.props.isLoggedIn) {
      if (!GPSState.isDenied()) {
        if (Platform.OS === 'android') {
          promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
          })
            .then((data) => {
              this._getCurrentLocationHandler();
            })
            .catch((err) => {
              console.log('Location Error 1', err);
              this.props.gpsLocationChange(false);
            });
        } else {
          Geolocation.requestAuthorization();
          this._getCurrentLocationHandler();
        }
      } else {
        this.props.gpsLocationChange(false);
        this.props.setLocationMessage(
          'Location permission denied - Enable it in settings',
        );
      }
    }
  }

  // getCurrent Location
  _getCurrentLocationHandler = () => {
    if (GPSState.isAuthorized()) {
      Geolocation.getCurrentPosition(
        (pos) => {
          this.setState({
            Latitude: pos.coords.latitude,
            Longitude: pos.coords.longitude,
          });
          this.props.gpsLocationChange(true);
          this._updateGCSLocationApi();
        },
        (err) => {
          if (err.code === 2) {
            this.props.gpsLocationChange(false);
            this.props.setLocationMessage(
              'Location permission denied - Enable it in settings',
            );
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 200000,
          maximumAge: 1000,
        },
      );
    } else {
      if (GPSState.isDenied()) {
        this.props.gpsLocationChange(false);
        this.props.setLocationMessage(
          'Location permission denied - Enable it in settings',
        );
      }
    }
  };

  _updateGCSLocationApi = () => {
    let postValue = {
      Collector_Code: this.props.collectorCode,
      Latitude: this.state.Latitude,
      Longitude: this.state.Longitude,
    };
    this.props.updateGPSLocation(postValue);
  };

  render() {
    const {state} = this.props;
    const activeTabIndex = state.index;
    return (
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.subContainer}
          disabled={this.state.pendingBtnClick}
          onPress={() => {
            this.setState({
              pendingBtnClick: true,
            });
            let postData = {
              Collector_Code: this.state.collectorCode,
              Schedule_Date:
                this.props.isCalenderDateSelected === true
                  ? this.props.pendingDate
                  : moment().utcOffset('+05:30').format('YYYY/MM/DD'),
              Filter_Type: 'P',
            };
            this.props.getPendingList(postData, (callBack) => {
              if (callBack) {
                // Actions.pendingTab();
                navigate('pendingTab');
              }
            });
            setTimeout(() => {
              this.setState({
                pendingBtnClick: false,
              });
            }, 1000);
          }}>
          <View style={styles.bodyContainer}>
            <Text
              style={{
                color: Constants.COLOR.PENDING_TAB,
                alignSelf: 'center',
                fontSize: Constants.FONT_SIZE.SM,
              }}>
              Pending
            </Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: Constants.COLOR.PENDING_TAB,
                borderWidth: 1.5,
                width: 25,
                height: 25,
                borderRadius: 25 / 2,
                marginLeft: 5,
              }}>
              <Text style={{fontSize: 10, color: Constants.COLOR.PENDING_TAB}}>
                {this.props.pendingCount}
              </Text>
            </View>
          </View>
          {this._displayPendingIndicator(activeTabIndex)}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.subContainer}
          disabled={this.state.completedBtnClick}
          onPress={() => {
            this.setState({
              completedBtnClick: true,
            });
            let postData = {
              Collector_Code: this.state.collectorCode,
              Schedule_Date:
                this.props.isCalenderDateSelected === true
                  ? this.props.pendingDate
                  : moment().utcOffset('+05:30').format('YYYY/MM/DD'),
              Filter_Type: 'C',
            };
            this.props.getPendingList(postData, (callBack) => {
              if (callBack) {
                // Actions.completedTab();
                navigate('completedTab');
              }
            });
            setTimeout(() => {
              this.setState({
                completedBtnClick: false,
              });
            }, 1000);
          }}>
          <View style={styles.bodyContainer}>
            <Text
              style={{
                color: Constants.COLOR.COMPLETED_TAB,
                alignSelf: 'center',
                fontSize: Constants.FONT_SIZE.SM,
              }}>
              Completed
            </Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: Constants.COLOR.COMPLETED_TAB,
                borderWidth: 1.5,
                width: 25,
                height: 25,
                borderRadius: 25 / 2,
                marginLeft: 5,
              }}>
              <Text
                style={{fontSize: 10, color: Constants.COLOR.COMPLETED_TAB}}>
                {this.props.completedCount}
              </Text>
            </View>
          </View>
          {this._displayCompletedIndicator(activeTabIndex)}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.subContainer}
          disabled={this.state.cancelledBtnClick}
          onPress={() => {
            this.setState({
              cancelledBtnClick: true,
            });
            let postData = {
              Collector_Code: this.state.collectorCode,
              Schedule_Date:
                this.props.isCalenderDateSelected === true
                  ? this.props.pendingDate
                  : moment().utcOffset('+05:30').format('YYYY/MM/DD'),
              Filter_Type: 'R',
            };
            this.props.getPendingList(postData, (callBack) => {
              if (callBack) {
                // Actions.cancelledTab();
                navigate('cancelledTab');
              }
            });
            this.setState({
              cancelledBtnClick: false,
            });
          }}>
          <View style={styles.bodyContainer}>
            <Text
              style={{
                color: Constants.COLOR.CANCELED_TAB,
                alignSelf: 'center',
                fontSize: Constants.FONT_SIZE.SM,
              }}>
              Cancelled
            </Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: Constants.COLOR.CANCELED_TAB,
                borderWidth: 1.5,
                width: 25,
                height: 25,
                borderRadius: 25 / 2,
                marginLeft: 5,
              }}>
              <Text style={{fontSize: 10, color: Constants.COLOR.CANCELED_TAB}}>
                {this.props.cancelledCount}
              </Text>
            </View>
          </View>
          {this._displayCancelledIndicator(activeTabIndex)}
        </TouchableOpacity>
      </View>
    );
  }
  _displayPendingIndicator = (index) => {
    return index === 0 ? (
      <View
        style={[
          styles.indicator,
          {backgroundColor: Constants.COLOR.PENDING_TAB},
        ]}
      />
    ) : (
      <View style={{marginTop: 10}} />
    );
  };
  _displayCompletedIndicator = (index) => {
    return index === 1 ? (
      <View
        style={[
          styles.indicator,
          {backgroundColor: Constants.COLOR.COMPLETED_TAB},
        ]}
      />
    ) : (
      <View style={{marginTop: 10}} />
    );
  };
  _displayCancelledIndicator = (index) => {
    return index === 2 ? (
      <View
        style={[
          styles.indicator,
          {backgroundColor: Constants.COLOR.CANCELED_TAB},
        ]}
      />
    ) : (
      <View style={{marginTop: 10}} />
    );
  };
}

const mapStateToProps = (state, props) => {
  const {
    pendingState: {
      bookingLists,
      isPendingLoading,
      pendingCount,
      completedCount,
      cancelledCount,
      pendingDate,
      canceledDate,
      completedDate,
      isCalenderDateSelected,
    },
    configState: {collectorCode, userName},
    deviceState: {isLocationEnable, isLoggedIn},
  } = state;

  return {
    userName,
    bookingLists,
    isPendingLoading,
    pendingCount,
    completedCount,
    cancelledCount,
    collectorCode,
    pendingDate,
    canceledDate,
    completedDate,
    isLocationEnable,
    isLoggedIn,
    isCalenderDateSelected,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getPendingList,
      getNotificationCount,
      gpsLocationChange,
      updateGPSLocation,
      setLocationMessage,
    },
    dispatch,
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(SchedulesTabBar);

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  bodyContainer: {
    flexDirection: 'row',
    // paddingTop: 30,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
  imageBackground: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'center',
  },
  avatar: {
    width: deviceHeight / 25,
    height: deviceHeight / 25,
  },
  label: {
    alignSelf: 'center',
    padding: 8,
    fontSize: Constants.FONT_SIZE.L,
  },
  indicator: {
    width: '90%',
    height: 2,
    marginTop: 10,
    marginHorizontal: 3,
  },
});

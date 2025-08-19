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
  Dimensions,
  Platform,
  AppState,
  PermissionsAndroid,
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
import Geolocation from '@react-native-community/geolocation';
import {updateGPSLocation, setLocationMessage} from '../../actions/GpsAction';
import { navigate } from '../../rootNavigation';
import DeviceInfo from 'react-native-device-info';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const INTERVALS = {
  NOTIFICATION: 30 * 1000, // 30 seconds
  LOCATION_UPDATE: 5 * 60 * 1000, // 5 minutes
  LOCATION_STATUS: 5 * 1000, // 5 seconds
};

const FILTER_TYPES = {
  PENDING: 'P',
  COMPLETED: 'C',
  CANCELLED: 'R',
};

const TAB_INDICES = {
  PENDING: 0,
  COMPLETED: 1,
  CANCELLED: 2,
};

class SchedulesTabBar extends Component {
  static propTypes = {
    collectorCode: PropTypes.string,
    pendingCount: PropTypes.number,
    completedCount: PropTypes.number,
    cancelledCount: PropTypes.number,
    getPendingList: PropTypes.func.isRequired,
    getNotificationCount: PropTypes.func.isRequired,
    userName: PropTypes.string,
    gpsLocationChange: PropTypes.func.isRequired,
    setLocationMessage: PropTypes.func.isRequired,
    updateGPSLocation: PropTypes.func.isRequired,
    isCalenderDateSelected: PropTypes.bool,
    pendingDate: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    state: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      pendingBtnClick: false,
      completedBtnClick: false,
      cancelledBtnClick: false,
      pendingDate:
        this.props.isCalenderDateSelected === true
          ? this.props.pendingDate
          : moment().utcOffset('+05:30').format('YYYY/MM/DD'),
      isLocationEnabled: null,
      isLocationPermissionGranted: null,
    };

    // Bind methods to avoid creating new functions on each render
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.getLocationStatus = this.getLocationStatus.bind(this);
    this.getNotificationCountAPI = this.getNotificationCountAPI.bind(this);
    this.getCurrentLocationHandler = this.getCurrentLocationHandler.bind(this);
  }

  componentDidMount() {
    this.initializeComponent();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.state.index !== this.props.state.index) {
      this._getAsyncAndAPICall()
    }
    this.handleLocationStateChanges(prevState);
  }

  componentWillUnmount() {
    this.cleanup();
  }

  getFilterType = () => {
    const activeIndex = this.props.state.index

    return activeIndex === TAB_INDICES.PENDING ? 'P' : activeIndex === TAB_INDICES.COMPLETED ? 'C' : 'R';
  }

  _getAsyncAndAPICall() {
    let postData = {
      Collector_Code: this.props.collectorCode,
      Filter_Type: this.getFilterType(),
      Schedule_Date: this.props.isCalenderDateSelected
        ? this.props.pendingDate
        : moment().utcOffset("+05:30").format("YYYY/MM/DD"),
    };
    this.props.getPendingList(postData, (isSuccess) => {});
  }

  initializeComponent = () => {
    this.getNotificationCountAPI();
    this.checkGpsEnabled();
    this.handleAppStateChange();
    
    // Add app state listener
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
    
    this.checkGpsState();
    this.setupIntervals();
  };

  setupIntervals = () => {
    // Clear existing intervals
    this.clearIntervals();

    // Setup notification interval
    this.notificationTimer = setInterval(
      this.getNotificationCountAPI, 
      INTERVALS.NOTIFICATION
    );

    // Setup location update interval
    this.locationTimer = setInterval(
      this.getCurrentLocationHandler,
      INTERVALS.LOCATION_UPDATE
    );

    // Setup location status check interval
    this.locationStatusInterval = setInterval(
      this.getLocationStatus, 
      INTERVALS.LOCATION_STATUS
    );
  };

  clearIntervals = () => {
    if (this.notificationTimer) {
      clearInterval(this.notificationTimer);
      this.notificationTimer = null;
    }
    if (this.locationTimer) {
      clearInterval(this.locationTimer);
      this.locationTimer = null;
    }
    if (this.locationStatusInterval) {
      clearInterval(this.locationStatusInterval);
      this.locationStatusInterval = null;
    }
  };

  cleanup = () => {
    this.clearIntervals();
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
  };

  handleLocationStateChanges = (prevState) => {
    const { isLocationEnabled, isLocationPermissionGranted } = this.state;
    
    if (
      prevState.isLocationEnabled !== null &&
      !isLocationEnabled &&
      isLocationPermissionGranted
    ) {
      this.props.gpsLocationChange(false);
      this.props.setLocationMessage("Kindly enable location");
    } else if (
      prevState.isLocationEnabled !== null &&
      isLocationEnabled &&
      isLocationPermissionGranted
    ) {
      this.props.gpsLocationChange(true);
    }
  };

  handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active') {
      // await this.checkGpsEnabled();
      console.log('Trigger here')
      this.checkGpsState();
    }
    console.log('AppState changed:', nextAppState);
    this.getLocationStatus();
    this.setState({ appState: nextAppState });
  };

  getLocationStatus = () => {
    DeviceInfo.isLocationEnabled()
      .then((enabled) => {
        this.setState({ isLocationEnabled: enabled });
      })
      .catch((err) => {
        console.warn('Error checking location:', err);
      });
  };

  async getNotificationCountAPI() {
    if (this.props.isLoggedIn && this.props.userName) {
      try {
        await this.props.getNotificationCount(this.props.userName);
      } catch (error) {
        console.warn('Error fetching notification count:', error);
      }
    }
  }

  requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        console.log({'permissionRequestLoss': granted})
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Location permission error:', err);
        return false;
      }
    }
    return true; // iOS permissions handled differently
  };

  checkGpsState = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      const result = await check(permission);
      console.log('resultHere:', result);
      
      if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        this.setState({ isLocationPermissionGranted: false });
        this.props.gpsLocationChange(false);
        this.props.setLocationMessage('Location permission denied - Enable it in settings');
      } else {
        this.setState({ isLocationPermissionGranted: true });
        this.props.gpsLocationChange(true);
      }
    } catch (error) {
      console.warn('Error checking GPS state:', error);
    }
  };

  checkGpsEnabled = async () => {
    try {
      const permissionGranted = await this.requestLocationPermission();

      if (!permissionGranted) {
        console.warn("Location permission not granted");
        return;
      }

      const isEnabled = await DeviceInfo.isLocationEnabled();
      console.log("GPS Enabled:", isEnabled);
    } catch (error) {
      console.warn('Error checking GPS enabled state:', error);
    }
  };

  getCurrentLocationHandler = async () => {
    try {
      const permissionGranted = await this.requestLocationPermission();

      if (permissionGranted) {
        Geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            this.props.gpsLocationChange(true);
            this.updateGCSLocationApi();
          },
          (error) => {
            console.warn('Geolocation error:', error);
            if (error.code === 2) {
              this.props.gpsLocationChange(false);
              this.props.setLocationMessage(
                'Location permission denied - Enable it in settings',
              );
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 60000,
          },
        );
      } else {
        this.props.gpsLocationChange(false);
        this.props.setLocationMessage(
          'Location permission denied - Enable it in settings',
        );
      }
    } catch (error) {
      console.warn('Error getting current location:', error);
    }
  };

  updateGCSLocationApi = () => {
    if (!this.props.collectorCode || !this.state.latitude || !this.state.longitude) {
      return;
    }

    const postValue = {
      Collector_Code: this.props.collectorCode,
      Latitude: this.state.latitude,
      Longitude: this.state.longitude,
    };
    
    try {
      this.props.updateGPSLocation(postValue);
    } catch (error) {
      console.warn('Error updating GPS location:', error);
    }
  };

  handleTabPress = async (tabName) => {
    navigate(tabName)
  };

  renderTabButton = (title, count, color, filterType, tabName, stateKey, tabIndex) => {
    const { state } = this.props;
    const activeTabIndex = state.index;
    const isDisabled = this.state[stateKey];

    return (
      <TouchableOpacity
        style={styles.subContainer}
        disabled={isDisabled}
        onPress={() => this.handleTabPress(tabName)}
        activeOpacity={0.7}>
        <View style={styles.bodyContainer}>
          <Text style={[styles.tabTitle, { color }]}>
            {title}
          </Text>
          <View style={[styles.countBadge, { borderColor: color }]}>
            <Text style={[styles.countText, { color }]}>
              {count || 0}
            </Text>
          </View>
        </View>
        {this.renderTabIndicator(activeTabIndex, tabIndex, color)}
      </TouchableOpacity>
    );
  };

  renderTabIndicator = (activeIndex, tabIndex, color) => {
    return activeIndex === tabIndex ? (
      <View style={[styles.indicator, { backgroundColor: color }]} />
    ) : (
      <View style={styles.inactiveIndicator} />
    );
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.renderTabButton(
          'Pending',
          this.props.pendingCount,
          Constants.COLOR.PRIMARY_COLOR,
          FILTER_TYPES.PENDING,
          'pendingTab',
          'pendingBtnClick',
          TAB_INDICES.PENDING
        )}
        
        {this.renderTabButton(
          'Completed',
          this.props.completedCount,
          Constants.COLOR.PRIMARY_COLOR,
          FILTER_TYPES.COMPLETED,
          'completedTab',
          'completedBtnClick',
          TAB_INDICES.COMPLETED
        )}
        
        {this.renderTabButton(
          'Cancelled',
          this.props.cancelledCount,
          Constants.COLOR.PRIMARY_COLOR,
          FILTER_TYPES.CANCELLED,
          'cancelledTab',
          'cancelledBtnClick',
          TAB_INDICES.CANCELLED
        )}
      </View>

    );
  }
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
    configState: { collectorCode, userName },
    deviceState: { isLocationEnable, isLoggedIn },
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
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    paddingVertical: 10,
  },
  bodyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
  },
  tabTitle: {
    alignSelf: 'center',
    fontSize: Constants.FONT_SIZE.SM,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  countBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginLeft: 5,
  },
  countText: {
    fontSize: 10,
  },
  indicator: {
    width: '90%',
    height: 2,
    marginTop: 10,
    marginHorizontal: 3,
  },
  inactiveIndicator: {
    marginTop: 10,
    height: 2,
  },
  // Removed unused styles
});
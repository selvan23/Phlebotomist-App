/*************************************************
 * SukraaLIS
 * @exports
 * @class NetworkAction.js
 * Created by Sankar on 15/07/2020
 * Copyright © 202 SukraaLIS. All rights reserved.
 *************************************************/
'use strict';

import {Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import store from '../store';

import Constants from '../util/Constants';
import Utility from '../util/Utility';
// import { checkMinimumVersion } from './SplashAction';
import { OneSignal } from 'react-native-onesignal';
import { navigate } from '../rootNavigation';

/**
 * Checks the internet connection and sets the status in the state of the store
 */
export const checkNetworkConnection = (callback) => {
  return (dispatch, getState) => {
    dispatch(initPushNotification());
    NetInfo.addEventListener((state) => {
      const {
        ACTIONS: {NETWORK_STATUS_CHANGED},
      } = Constants;
      if (getState().deviceState.isNetworkConnectivityAvailable === undefined) {
        showSpinner();
        dispatch({
          type: NETWORK_STATUS_CHANGED,
          isNetworkConnectivityAvailable: state.isConnected,
        });
        callback(true, state.isConnected);
        // dispatch(checkMinimumVersion());
        setTimeout(() => {
          // Actions.LoginScreen();
        }, 0);
      } else {
        hideSpinner();
        dispatch({
          type: NETWORK_STATUS_CHANGED,
          isNetworkConnectivityAvailable: state.isConnected,
        });
      }
    });
  };
};

/**
 * Checks the internet connection and sets the status in the state of the store
 */
export const initPushNotification = () => {
  return (dispatch, getState) => {
    OneSignal.initialize('20efcdc5-25c5-4981-bdec-984a8f89b849');
    OneSignal.Notifications.requestPermission(true);
    OneSignal.Notifications.addEventListener('received', (notification) => {
      console.log('Notification received*******: ', notification);
      try {
        if (notification.isAppInFocus) {
          Utility.showAlert(
            notification.payload.title,
            notification.payload.body,
          );
        } else {
        }
      } catch (error) {
        console.log('Notification received Error*******: ', error);
      }
    });

    OneSignal.Notifications.addEventListener('opened', (notification) => {
      /*
       * navigate to notification screen if type_id = 1: notification, type_id = 2: post
       * else navigate to home screen tab and move to message screen.
       */
      OneSignal.clearOneSignalNotifications();
      if (notification.notification.payload.additionalData) {
        if (
          notification.notification.payload.additionalData.Navigate_Type ===
          'Booking_Detail'
        ) {
          let notificationData = {
            Firm_No: notification.notification.payload.additionalData.Firm_No,
            Booking_No:
              notification.notification.payload.additionalData.Booking_No,
            Collector_Code:
              notification.notification.payload.additionalData.Collector_Code,
            Booking_Date:
              notification.notification.payload.additionalData.Booking_Date,
            Booking_Type:
              notification.notification.payload.additionalData.Booking_Type,
          };

          // Actions.splashScreen({
          //   isFromNotification: true,
          //   notificationData: notificationData,
          // });
          navigate('splashScreen', {
            isFromNotification: true,
            notificationData: notificationData,
          })
        }
      }
    });

    OneSignal.Notifications.addEventListener('ids', (device) => {
      dispatch({
        type: Constants.ACTIONS.UPDATE_ONE_SIGNAL_DETAILS,
        oneSignalId: device.userId,
      });
    });
    // OneSignal.inFocusDisplaying(0);
  };
};

/**
 * Checks the internet connection and sets the status in the state of the store
 */
export const handleError = (error, showAlert = true) => {
  return (dispatch, getState) => {
    try {
      if (error) {
        if (
          error.status === Constants.HTTP_CODE.AUTHENTICATION_FAILURE ||
          error.status === Constants.HTTP_CODE.REQUIRED_MISSING
        ) {
          Alert.alert(
            Constants.ALERT.TITLE.EXPIRED,
            Constants.VALIDATION_MSG.EXPIRED,
            [
              {
                text: Constants.ALERT.BTN.OK,
                onPress: () => {
                  // call logout action
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          if (showAlert) {
            if (!getState().deviceState.isNetworkConnectivityAvailable) {
              Utility.showAlert(
                Constants.ALERT.TITLE.FAILED,
                Constants.VALIDATION_MSG.NO_INTERNET,
              );
            } else if (error.status && error.status === 422) {
              Utility.showAlert(
                Constants.ALERT.TITLE.FAILED,
                'Permission denied.',
              );
            } else if (error.message) {
              if (error.message.includes('Network Error')) {
                Utility.showAlert(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.NO_INTERNET,
                );
              } else if (error.message.includes('timeout of')) {
                Utility.showAlert(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.TIME_OUT_ERROR_MESSAGE,
                );
              } else {
                Utility.showAlert(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.REQ_FAILED,
                );
              }
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.FAILED,
                Constants.VALIDATION_MSG.REQ_FAILED,
              );
            }
          }
        }
      } else {
        Utility.showAlert(
          Constants.ALERT.TITLE.FAILED,
          Constants.VALIDATION_MSG.NO_INTERNET,
        );
      }
    } catch (e) {
      Utility.showAlert(
        Constants.ALERT.TITLE.WENT_WRONG,
        Constants.VALIDATION_MSG.WENT_WRONG,
      );
    }
  };
};

export const handleErrorPop = (error, showAlert = true) => {
  return (dispatch, getState) => {
    try {
      if (error) {
        if (
          error.status === Constants.HTTP_CODE.AUTHENTICATION_FAILURE ||
          error.status === Constants.HTTP_CODE.REQUIRED_MISSING
        ) {
          Alert.alert(
            Constants.ALERT.TITLE.EXPIRED,
            Constants.VALIDATION_MSG.EXPIRED,
            [
              {
                text: Constants.ALERT.BTN.OK,
                onPress: () => {
                  // call logout action
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          if (showAlert) {
            if (!getState().deviceState.isNetworkConnectivityAvailable) {
              Utility.showAlertWithExitApp(
                Constants.ALERT.TITLE.FAILED,
                Constants.VALIDATION_MSG.NO_INTERNET,
              );
            } else if (error.status && error.status === 422) {
              Utility.showAlertWithExitApp(
                Constants.ALERT.TITLE.FAILED,
                'Permission denied.',
              );
            } else if (error.message) {
              if (error.message.includes('Network Error')) {
                Utility.showAlertWithExitApp(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.NO_INTERNET,
                );
              } else if (error.message.includes('timeout of')) {
                Utility.showAlertWithExitApp(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.TIME_OUT_ERROR_MESSAGE,
                );
              } else if (error.message.includes('Request failed')) {
                Utility.showAlertWithExitApp(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.NO_INTERNET,
                );
              } else {
                Utility.showAlertWithExitApp(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.REQ_FAILED,
                );
              }
            } else {
              Utility.showAlertWithExitApp(
                Constants.ALERT.TITLE.FAILED,
                Constants.VALIDATION_MSG.REQ_FAILED,
              );
            }
          }
        }
      } else {
        Utility.showAlertWithExitApp(
          Constants.ALERT.TITLE.FAILED,
          Constants.VALIDATION_MSG.NO_INTERNET,
        );
      }
    } catch (e) {
      Utility.showAlertWithExitApp(
        Constants.ALERT.TITLE.WENT_WRONG,
        Constants.VALIDATION_MSG.WENT_WRONG,
      );
    }
  };
};

export const showSpinner = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SPLASH_SHOW_LOADING,
    });
  };
};

export const hideSpinner = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SPLASH_HIDE_LOADING,
    });
  };
};

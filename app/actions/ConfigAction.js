/*************************************************
 * SukraasLIS
 * ConfigAction.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleErrorPop} from './NetworkAction';

export const configAPICall = (callback) => {
  return (dispatch, getState) => {
    dispatch(showConfigLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.ap_se, {}, 0)
        .then((response) => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            callback(true, response.Message[0]);
            // dispatch(hideConfigLoading());
          } else {
            dispatch(hideConfigLoading());
            Utility.showAlert(
              Constants.ALERT.TITLE.INFO,
              Constants.VALIDATION_MSG.ERROR_CATCH,
            );
          }
        })
        .catch((error) => {
          dispatch(handleErrorPop(error));
          dispatch(hideConfigLoading());
        });
    }, 500);
  };
};

export const showConfigLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SHOW_LOADING,
    });
  };
};

export const hideConfigLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_HIDE_LOADING,
    });
  };
};

export const setCurrency = (currency) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_CURRENCY,
      currency: currency,
    });
  };
};

export const setUploadSize = (uploadSize) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_UPLOAD_SIZE,
      uploadSize: uploadSize,
    });
  };
};

export const setProfileImage = (url) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.USER_PROFILE_IMAGE,
      url: url,
    });
  };
};

export const setProfileUploadSize = (uploadSize) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_PROFILE_UPLOAD_SIZE,
      profileUploadSize: uploadSize,
    });
  };
};

export const setUserName = (userName) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_USER_NAME,
      userName: userName,
    });
  };
};

export const setCollectorCode = (collectorCode) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_COLLECTOR_CODE,
      collectorCode: collectorCode,
    });
  };
};

export const setCollectorOTPMandatory = (value) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_COLLECTOR_OTP_MANDATORY,
      collectorOTPMandatory: value,
    });
  };
};

export const setDeviceInfo = (deviceInfoData) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_DEVICE_INFO_DATA,
      deviceInfoData: deviceInfoData,
    });
  };
};

export const setLoginConformation = (isLoggedIn) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.LOGIN_SUCCESS_CHECK,
      isLoggedIn: isLoggedIn,
    });
  };
};

export const setPhonepeUrl = (phonepeUrl) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_PHONEPE_URL,
      phonepeUrl: phonepeUrl,
    });
  };
};


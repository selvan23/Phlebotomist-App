'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleError} from './NetworkAction';

export const submitPassword = (
  userName,
  otp,
  password,
  device_id,
  oneSignalId,
  os_version,
  device_type,
  device_info,
  app_version,
  callback,
) => {
  return (dispatch) => {
    dispatch(showSubmitPasswordLoading());

    HttpBaseClient.post(
      AsyncStorage.configUri.se_pw,
      {
        UserName: userName,
        Otp_Code: otp,
        Password: password,
        Device_ID: device_id,
        Token_ID: oneSignalId,
        OS_Type: os_version,
        Device_Type: device_type,
        Model_Type: device_info,
        App_Version: app_version,
      },
      0,
    )
      .then((response) => {
        dispatch(hideSubmitPasswordLoading());
        if (response.Code === 200) {
          callback(true, response.Message[0]);
        } else {
          if (response.Message[0].Message != null) {
            dispatch({
              type: Constants.ACTIONS.SHOW_CUSTOM_ALERT,
              payload: {
                title: Constants.ALERT.TITLE.ERROR,
                message: response.Message[0].Message,
              },
            });
          } else {
            dispatch({
              type: Constants.ACTIONS.SHOW_CUSTOM_ALERT,
              payload: {
                title: Constants.ALERT.TITLE.ERROR,
                message: Constants.VALIDATION_MSG.SETPASSWORD_FAILED,
              },
            });
          }
        }
      })
      .catch((error) => {
        dispatch(hideSubmitPasswordLoading());
        dispatch(handleError(error));
      });
  };
};

export const showSubmitPasswordLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SET_PASSWORD_SHOW_LOADING,
    });
  };
};

export const hideSubmitPasswordLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SET_PASSWORD_HIDE_LOADING,
    });
  };
};

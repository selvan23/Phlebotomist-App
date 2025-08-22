/*************************************************
 * SukraaLIS
 * @exports
 * @class LoginAction.js
 * Created by Sankar on 15/07/2020
 * Copyright © 202 SukraaLIS. All rights reserved.
 *************************************************/
'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
import CustomAlert from '../components/common/CustomAlert';
import {handleError} from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OneSignal from 'react-native-onesignal';

export const loginOnSubmit = (dicLoginInfo, callback) => {
  return (dispatch, getState) => {
    dispatch(showLoginLoading());
    console.log('login on submit');
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.st_lo, dicLoginInfo, 0)
        .then((response) => {
          console.log('login response', response);
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(hideLoginLoading());
            callback(true, response.Message[0]);
            // OneSignal.setExternalUserId(dicLoginInfo.username);
          } else {
            dispatch(hideLoginLoading());
              // Dispatch global custom alert action
              dispatch({
                type: Constants.ACTIONS.SHOW_CUSTOM_ALERT,
                payload: {
                  title: Constants.ALERT.TITLE.INFO,
                  message: Constants.VALIDATION_MSG.INPUT_VALIDATION_ERROR,
                },
              });
          }
        })
        .catch((error) => {
          dispatch(hideLoginLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showLoginLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.LOGIN_SHOW_LOADING,
    });
  };
};

export const hideLoginLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.LOGIN_HIDE_LOADING,
    });
  };
};

export const showForgetPasswordLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.FORGET_PWD_SHOW_LOADING,
    });
  };
};

export const hideForgetPasswordLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.FORGET_PWD_HIDE_LOADING,
    });
  };
};

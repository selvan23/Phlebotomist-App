'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleError} from './NetworkAction';
import { navigate } from '../rootNavigation';

export const verifyOTPSubmit = (userName, phoneNumber, otp) => {
  return (dispatch) => {
    dispatch(showVerificationLoading());

    setTimeout(function () {
      HttpBaseClient.post(
        AsyncStorage.configUri.ot_ve,
        {UserName: userName, Otp_Code: otp},
        0,
      )
        .then((response) => {
          dispatch(hideVerificationLoading());
          if (response.Code === 200) {
            AsyncStorage.setItem(Constants.ASYNC.ASYNC_OTP, otp);
            AsyncStorage.setItem(Constants.ASYNC.ASYNC_USER_NAME, userName);
            // Actions.SetPasswordScreen();
            navigate('SetPasswordScreen');
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
                  message: Constants.VALIDATION_MSG.OTP_VERIFY_FAILED,
                },
              });
            }
          }
        })
        .catch((error) => {
          dispatch(hideVerificationLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};

export const verifyOTPResend = (phoneNumber, userName, isResent, callback) => {
  return (dispatch) => {
    dispatch(showOTPResendLoading());

    HttpBaseClient.post(
      AsyncStorage.configUri.ot_se,
      {UserName: userName, Mobile_No: phoneNumber},
      0,
    )
      .then((response) => {
        dispatch(hideOTPResendLoading());
        if (response.Code === 200) {
          dispatch({
            type: Constants.ACTIONS.SHOW_CUSTOM_ALERT,
            payload: {
              title: Constants.ALERT.TITLE.SUCCESS,
              message: 'OTP sent successfully',
            },
          });
          callback(true, response.Message[0].OTP_Message);
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
                message: Constants.VALIDATION_MSG.OTP_RESEND_FAILED,
              },
            });
          }
        }
      })
      .catch((error) => {
        dispatch(hideOTPResendLoading());
        dispatch(handleError(error));   
      });
  };
};

export const showVerificationLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.OTP_VERIFY_SHOW_LOADING,
    });
  };
};

export const hideVerificationLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.OTP_VERIFY_HIDE_LOADING,
    });
  };
};

export const showOTPResendLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.OTP_RESEND_SHOW_LOADING,
    });
  };
};

export const hideOTPResendLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.OTP_RESEND_HIDE_LOADING,
    });
  };
};

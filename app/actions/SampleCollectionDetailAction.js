/*************************************************
 * SukraaLIS
 * @exports
 * @class SampleCollectionDetailAction.js
 * Created by Shiva Sankar on 29/07/2020
 * Copyright © 202 SukraaLIS. All rights reserved.
 *************************************************/
'use strict';

import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Utility from '../util/Utility';
import {handleError} from './NetworkAction';

export const invokeUploadPrescription = (dicUploadInfo, callback) => {
  return (dispatch) => {
    dispatch(showUploadLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.pr_uo, dicUploadInfo, 4)
        .then((response) => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(hideUploadLoading());
            callback(true, response.Message[0].Message);
          } else {
            dispatch(hideUploadLoading());
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.REQ_FAILED,
              );
            }
          }
        })
        .catch((error) => {
          dispatch(hideUploadLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

//Upload location
export const uploadLocation = (updateLocationInfo, callback) => {
  return (dispatch) => {
    dispatch(showUploadLocationLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.up_lo, updateLocationInfo, 0)
        .then((response) => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(hideUploadLocationLoading());
            callback(true);
            Utility.showAlert(
              Constants.ALERT.TITLE.SUCCESS,
              response.Message[0].Message,
            );
          } else {
            dispatch(hideUploadLocationLoading());
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.REQ_FAILED,
              );
            }
          }
        })
        .catch((error) => {
          dispatch(hideUploadLocationLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

//OTP Resend
export const OTPBookingResend = (postData, isFromResend, callback) => {
  return (dispatch) => {
    if (isFromResend) {
      dispatch(showOTPResendLoading());
    }
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.re_bo_ot, postData, 0)
        .then((response) => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            if (isFromResend) {
              dispatch(hideOTPResendLoading());
            }
            callback(true, response.Message[0].Otp_Message);
            if (isFromResend) {
              Utility.showAlert(
                Constants.ALERT.TITLE.SUCCESS,
                'Verification code sent successfully',
              );
            }
          } else {
            if (isFromResend) {
              dispatch(hideOTPResendLoading());
            }
            if (response.Message[0].Message != null) {
              if (isFromResend) {
                Utility.showAlert(
                  Constants.ALERT.TITLE.ERROR,
                  response.Message[0].Message,
                );
              }
            } else {
              if (isFromResend) {
                Utility.showAlert(
                  Constants.ALERT.TITLE.ERROR,
                  Constants.VALIDATION_MSG.REQ_FAILED,
                );
              }
            }
          }
        })
        .catch((error) => {
          if (isFromResend) {
            dispatch(hideOTPResendLoading());
          }
          dispatch(handleError(error));
        });
    }, 500);
  };
};

//OTP SUBMIT
export const OTPBookingSubmit = (postData, callback) => {
  return (dispatch) => {
    dispatch(showOTPSubmitLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.bp_ot_ve, postData, 0)
        .then((response) => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(hideOTPSubmitLoading());
            callback(true);
            Utility.showAlert(
              Constants.ALERT.TITLE.SUCCESS,
              response.Message[0].Message,
            );
          } else {
            dispatch(hideOTPSubmitLoading());
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.REQ_FAILED,
              );
            }
          }
        })
        .catch((error) => {
          dispatch(hideOTPSubmitLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showUploadLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_UPLOAD_PRESCRIPTION_LOADING,
    });
  };
};

export const hideUploadLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_UPLOAD_PRESCRIPTION_LOADING,
    });
  };
};

export const showUploadLocationLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_UPLOAD_LOCATION_LOADING,
    });
  };
};

export const hideUploadLocationLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_UPLOAD_LOCATION_LOADING,
    });
  };
};

export const showOTPResendLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_VERIFICATION_CODE_RESEND_LOADING,
    });
  };
};

export const hideOTPResendLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_VERIFICATION_CODE_RESEND_LOADING,
    });
  };
};

export const showOTPSubmitLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_VERIFICATION_CODE_SUBMIT_LOADING,
    });
  };
};

export const hideOTPSubmitLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_VERIFICATION_CODE_SUBMIT_LOADING,
    });
  };
};

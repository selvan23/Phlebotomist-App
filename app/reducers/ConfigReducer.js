/*************************************************
 * SukraasLIS
 * ConfigReducer.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';
const { ACTIONS } = Constants;

let initialState = {
  isLoginLoading: false,
  currency: '',
  firmName: '',
  firmNo: '',
  uploadSize: '',
  mobileNo: '',
  isShowConfigLoading: false,
  userName: '',
  profileUploadSize: '',
  collectorCode: '',
  collectorOTPMandatory: false,
  deviceInfoData: {},
  phonepeUrl: ''
};

export const configState = (state = initialState, action) => {
  const {
    currency,
    firmName,
    firmNo,
    uploadSize,
    mobileNo,
    userName,
    profileUploadSize,
    collectorCode,
    collectorOTPMandatory,
    deviceInfoData,
    phonepeUrl
  } = action;
  switch (action.type) {
    case ACTIONS.CONFIG_SET_CURRENCY:
      return { ...state, currency: currency };
    case ACTIONS.CONFIG_SET_FIRM_NAME:
      return { ...state, firmName: firmName };
    case ACTIONS.CONFIG_SET_FIRM_NO:
      return { ...state, firmNo: firmNo };
    case ACTIONS.CONFIG_SET_UPLOAD_SIZE:
      return { ...state, uploadSize: uploadSize };
    case ACTIONS.CONFIG_SET_PROFILE_UPLOAD_SIZE:
      return { ...state, profileUploadSize: profileUploadSize };
    case ACTIONS.CONFIG_SET_MOBILE_NO:
      return { ...state, mobileNo: mobileNo };
    case ACTIONS.CONFIG_SET_USER_NAME:
      return { ...state, userName: userName };
    case ACTIONS.CONFIG_SHOW_LOADING:
      return { ...state, isShowConfigLoading: true };
    case ACTIONS.CONFIG_HIDE_LOADING:
      return { ...state, isShowConfigLoading: false };
    case ACTIONS.CONFIG_SET_COLLECTOR_CODE:
      return { ...state, collectorCode: collectorCode };
    case ACTIONS.CONFIG_SET_COLLECTOR_OTP_MANDATORY:
      return { ...state, collectorOTPMandatory: collectorOTPMandatory };
    case ACTIONS.CONFIG_SET_DEVICE_INFO_DATA:
      return { ...state, deviceInfoData: deviceInfoData };
    case ACTIONS.CONFIG_PHONEPE_URL:
      return { ...state, phonepeUrl: phonepeUrl };
    default:
      return state;
  }
};

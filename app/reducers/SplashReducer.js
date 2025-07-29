/*************************************************
 * SukraasLIS
 * SplashReducer.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';

import Constants from '../util/Constants';

let initialState = {
  isLoading: true, //Shows spinner when the version api is being called.
  oneSignalId: '',
  errorMessage: '', //Error message of the internet check and version api failure error
};
const {
  ACTIONS: {
    SPLASH_SHOW_LOADING,
    SPLASH_HIDE_LOADING,
    SPLASH_ERROR_UPDATE,
    UPDATE_ONE_SIGNAL_DETAILS,
  },
} = Constants;

export const splashState = (state = initialState, action) => {
  const {type, oneSignalId} = action;
  switch (type) {
    case SPLASH_SHOW_LOADING:
      return {...state, isLoading: true};
    case SPLASH_HIDE_LOADING:
      return {...state, isLoading: false};
    case UPDATE_ONE_SIGNAL_DETAILS:
      return {...state, oneSignalId: oneSignalId};
    case SPLASH_ERROR_UPDATE:
      return {...state, isLoading: false, errorMessage: action.message};
    default:
      return state;
  }
};

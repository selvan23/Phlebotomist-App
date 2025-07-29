/*************************************************
 * SukraaLIS
 * @exports
 * @class SplashAction.js
 * Created by Sankar on 15/07/2020
 * Copyright © 202 SukraaLIS. All rights reserved.
 *************************************************/
'use strict';

import {NetInfo, Alert} from 'react-native';

import Constants from '../util/Constants';
import Utility from '../util/Utility';

export const checkMinimumVersion = () => {
  return (dispatch) => {
    dispatch(showSpinner());
  };
};

export const showSpinner = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SPLASH_SHOW_LOADING,
    });
  };
};

/*************************************************
 * Sukraas
 * @exports
 * @class LogoutAction.js
 * Created by Sankar on 09/06/2020
 * Copyright © 2020 Sukraas. All rights reserved.
 *************************************************/
'use strict';
import Constants from '../util/Constants';
import {handleError} from './NetworkAction';
import Utility from '../util/Utility';

export const clearAllStates = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.LOGOUT_USER,
    });
  };
};

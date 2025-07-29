/*************************************************
 * SukraasLIS
 * @exports
 * @class SampleCollectionReducer.js
 * Created by Shiva Sankar on 09/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isSubmitBarCodeLoading: false,
};

export const sampleCollectionState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_SUBMIT_BAR_CODE_LOADING:
      return {...state, isSubmitBarCodeLoading: true};
    case ACTIONS.HIDE_SUBMIT_BAR_CODE_LOADING:
      return {...state, isSubmitBarCodeLoading: false};
    default:
      return state;
  }
};

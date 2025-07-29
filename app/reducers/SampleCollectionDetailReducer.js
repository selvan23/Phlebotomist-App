/*************************************************
 * SukraasLIS
 * @exports
 * @class SampleCollectionDetailReducer.js
 * Created by Shiva Sankar on 09/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isSampleCollectionDetailLoading: false,
  isLocationLoading: false,
  isUploadFilesLoading: false,
};

export const sampleCollectionDetailState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_UPLOAD_PRESCRIPTION_LOADING:
      return {...state, isUploadFilesLoading: true};
    case ACTIONS.HIDE_UPLOAD_PRESCRIPTION_LOADING:
      return {...state, isUploadFilesLoading: false};
    case ACTIONS.SHOW_UPLOAD_LOCATION_LOADING:
      return {...state, isLocationLoading: true};
    case ACTIONS.HIDE_UPLOAD_LOCATION_LOADING:
      return {...state, isLocationLoading: false};
    default:
      return state;
  }
};

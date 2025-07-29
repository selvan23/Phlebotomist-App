/*************************************************
 * SukraasLIS
 * CollectionScreenReducer.js
 * Created by Kishore on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  iscollectionScreenLoading: false,
  arrPaymentDetails: [],
};

export const collectionScreenState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.COLLECTION_SCREEN_SHOW_LOADING:
      return {...state, iscollectionScreenLoading: true};
    case ACTIONS.COLLECTION_SCREEN_HIDE_LOADING:
      return {...state, iscollectionScreenLoading: false};
    case ACTIONS.GET_CASH_COLLECTED_USER_DETAILS:
      return {...state, arrPaymentDetails: action.payload};
    default:
      return state;
  }
};

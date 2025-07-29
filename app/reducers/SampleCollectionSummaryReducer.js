/*************************************************
 * SukraasLIS
 * PendingScreenReducer.js
 * Created by Abdul on 28/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';

const {ACTIONS} = Constants;

let initialState = {
  isSampleCollectionSummaryLoading: false,
  sampleCollectionSummaryData: {},
};

export const sampleCollectionSummaryState = (state = initialState, action) => {
  const {bookingLists} = action;
  switch (action.type) {
    case ACTIONS.SHOW_SAMPLE_COLLECTION_SUMMARY_SCREEN_LOADING:
      return {...state, isSampleCollectionSummaryLoading: true};
    case ACTIONS.HIDE_SAMPLE_COLLECTION_SUMMARY_SCREEN_LOADING:
      return {...state, isSampleCollectionSummaryLoading: false};
    case ACTIONS.SET_SAMPLE_COLLECTION_SUMMARY:
      return {...initialState};
    default:
      return state;
  }
};

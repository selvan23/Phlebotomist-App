/*************************************************
 * SukraasLIS
 * PendingScreenReducer.js
 * Created by Abdul on 28/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isPendingLoading: false,
  isPdfLoading: false,
  bookingDetail: {},
  pdfReport: {},
};

export const pendingDetailState = (state = initialState, action) => {
  const {bookingDetail, pdfReport} = action;
  switch (action.type) {
    case ACTIONS.SHOW_PENDING_DETAIL_SCREEN_LOADING:
      return {...state, isPendingLoading: true};
    case ACTIONS.HIDE_PENDING_DETAIL_SCREEN_LOADING:
      return {...state, isPendingLoading: false};
    case ACTIONS.GET_BOOKING_DETAIL:
      return {...state, bookingDetail};
    case ACTIONS.SHOW_PDF_LOADING:
      return {...state, isPdfLoading: true};
    case ACTIONS.HIDE_PDF_LOADING:
      return {...state, isPdfLoading: false};
    case ACTIONS.GET_PDF_REPORT:
      return {...state, pdfReport};
    default:
      return state;
  }
};

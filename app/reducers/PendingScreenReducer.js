/*************************************************
 * SukraasLIS
 * PendingScreenReducer.js
 * Created by Abdul on 28/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from "../util/Constants";
const { ACTIONS } = Constants;

let initialState = {
  isPendingLoading: false,
  isCalenderDateSelected: false,
  ispdfLoading: false,
  bookingLists: [],
  completedBookingList: [],
  pendingBookingList: [],
  cancelledBookingList: [],
  bookingDetail: {},
  pdfReport: {},
  pendingDate: "",
  canceledDate: "",
  completedDate: "",
  pendingCount: 0,
  completedCount: 0,
  cancelledCount: 0,
};

export const pendingState = (state = initialState, action) => {
  const {
    bookingLists,
    bookingDetail,
    pdfReport,
    pendingCount,
    completedCount,
    cancelledCount,
  } = action;
  switch (action.type) {
    case ACTIONS.SHOW_PENDING_SCREEN_LOADING:
      return { ...state, isPendingLoading: true };
    case ACTIONS.HIDE_PENDING_SCREEN_LOADING:
      return { ...state, isPendingLoading: false };
    case ACTIONS.SHOW_PDF_LOADING:
      return { ...state, ispdfLoading: true };
    case ACTIONS.HIDE_PDF_LOADING:
      return { ...state, ispdfLoading: false };
    case ACTIONS.GET_BOOKING_LISTS:
      // return {...state, bookingLists};
      if (action.filterType === 'P') {
        return { ...state, pendingBookingList: bookingLists };
      } else if (action.filterType === 'C') {
        return { ...state, completedBookingList: bookingLists };
      } else if (action.filterType === 'R') {
        return { ...state, cancelledBookingList: bookingLists };
      }
    case ACTIONS.GET_BOOKING_DETAIL:
      return { ...state, bookingDetail };
    case ACTIONS.GET_PDF_REPORT:
      return { ...state, pdfReport };
    case ACTIONS.SET_PENDING_DATE:
      return {
        ...state,
        pendingDate: action.payload,
        isCalenderDateSelected: true,
      };
    // case ACTIONS.SET_COMPLETED_DATE:
    //   return {...state, completedDate: action.payload};
    // case ACTIONS.SET_CANCELED_DATE:
    //   return {...state, canceledDate: action.payload};
    case ACTIONS.GET_TABBAR_COUNT:
      return { ...state, pendingCount, completedCount, cancelledCount };
    case ACTIONS.SET_BOOKING_TO_INITIAL:
      return { ...initialState };
    default:
      return state;
  }
};

/*************************************************
 * SukraasLIS
 * @exports
 * @class PendingScreenAction.js
 * Created by Abdul on 25/7/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

"use strict";
// import _ from 'lodash';
import Constants from "../util/Constants";
import Utility from "../util/Utility";
import HttpBaseClient from "../util/HttpBaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleError } from "./NetworkAction";

export const getPendingList = (postData, callBack) => {
  return async (dispatch) => {
    dispatch(showPendingScreenLoading());
    HttpBaseClient.post(AsyncStorage.configUri.bo_su_st_co, postData, 0)
      .then((response) => {
        dispatch(HidePendingScreenLoading());
        if (response.Code === 200) {
          dispatch({
            type: Constants.ACTIONS.GET_BOOKING_LISTS,
            bookingLists: response.Message[0],
            filterType: postData.Filter_Type,
          });

          if (response.Message[0].Pending_Count != null) {
            dispatch({
              type: Constants.ACTIONS.GET_TABBAR_COUNT,
              pendingCount: response.Message[0].Pending_Count,
              completedCount: response.Message[0].Completed_Count,
              cancelledCount: response.Message[0].Cancelled_Count,
            });
          }
        } else {
          dispatch({
            type: Constants.ACTIONS.GET_TABBAR_COUNT,
            pendingCount: 0,
            completedCount: 0,
            cancelledCount: 0,
          });
          dispatch({
            type: Constants.ACTIONS.GET_BOOKING_LISTS,
            bookingLists: [],
            filterType: postData.Filter_Type,
          });
          if (response.Message[0].Message != null) {
            if (response.Message[0].Message === "No data found.") {
              // dispatch({
              //   type: Constants.ACTIONS.GET_BOOKING_LISTS,
              //   bookingLists: [],
              // });
            }
            // Utility.showAlert(
            //   Constants.ALERT.TITLE.ERROR,
            //   response.Message[0].Message,
            // );
          } else {
            // Utility.showAlert(
            //   Constants.ALERT.TITLE.ERROR,
            //   Constants.VALIDATION_MSG.NO_DATA_FOUND,
            // );
          }
        }
        callBack(true);
      })
      .catch((error) => {
        dispatch(HidePendingScreenLoading());
        dispatch(handleError(error));
      });
  };
};

export const getPendingDetail = (dictInfo, callBack) => {
  return (dispatch) => {
    dispatch(showPendingScreenLoading());
    HttpBaseClient.post(AsyncStorage.configUri.or_bo_de, dictInfo, 0)
      .then((response) => {
        dispatch(HidePendingScreenLoading());
        if (response.Code === 200) {
          dispatch({
            type: Constants.ACTIONS.GET_BOOKING_DETAIL,
            bookingDetail: response.Message[0],
          });
          callBack(true);
        } else {
          if (response.Message[0].Message != null) {
            if (response.Message[0].Message === "No data found.") {
              dispatch({
                type: Constants.ACTIONS.GET_BOOKING_DETAIL,
                bookingDetail: [],
              });
            }
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              response.Message[0].Message
            );
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.NO_DATA_FOUND
            );
          }
        }
      })
      .catch((error) => {
        dispatch(HidePendingScreenLoading());
        dispatch(handleError(error));
      });
  };
};

export const getPdfReport = (dictInfo, callBack) => {
  return (dispatch) => {
    dispatch(showPdfLoading());
    HttpBaseClient.post(AsyncStorage.configUri.vi_pr, dictInfo, 0)
      .then((response) => {
        dispatch(HidePdfLoading());
        if (response.Code === 200) {
          dispatch({
            type: Constants.ACTIONS.GET_PDF_REPORT,
            pdfReport: response.Message[0],
          });
          callBack(true);
        } else {
          if (response.Message[0].Message != null) {
            if (response.Message[0].Message === "No data found.") {
              dispatch({
                type: Constants.ACTIONS.GET_PDF_REPORT,
                pdfReport: [],
              });
            }
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              response.Message[0].Message
            );
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.NO_DATA_FOUND
            );
          }
        }
      })
      .catch((error) => {
        dispatch(HidePdfLoading());
        dispatch(handleError(error));
      });
  };
};

export const gpsLocationChange = (isLocationEnable) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.GPS_LOCATION_CHANGE,
      isLocationEnable: isLocationEnable,
    });
  };
};

export const showPendingScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_PENDING_SCREEN_LOADING,
    });
  };
};

export const HidePendingScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_PENDING_SCREEN_LOADING,
    });
  };
};
export const showPdfLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_PDF_LOADING,
    });
  };
};

export const HidePdfLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_PDF_LOADING,
    });
  };
};

export const setPendingDate = (date) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SET_PENDING_DATE,
      payload: date,
    });
  };
};
export const setCompletedDate = (date) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SET_COMPLETED_DATE,
      payload: date,
    });
  };
};

export const setCancelledDate = (date) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SET_CANCELED_DATE,
      payload: date,
    });
  };
};

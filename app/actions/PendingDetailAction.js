/*************************************************
 * SukraasLIS
 * @exports
 * @class PendingScreenAction.js
 * Created by Abdul on 25/7/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {handleError} from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPendingDetail = (dictInfo, callBack) => {
  return (dispatch) => {
    dispatch(showPendingDetailScreenLoading());
    HttpBaseClient.post(AsyncStorage.configUri.or_bo_de, dictInfo, 0)
      .then((response) => {
        console.log('getpendingDetails request: ', response);
        dispatch(HidePendingDetailScreenLoading());
        if (response.Code === 200) {
          dispatch({
            type: Constants.ACTIONS.GET_BOOKING_DETAIL,
            bookingDetail: response.Message[0],
          });
          callBack(true);
        } else {
          if (response.Message[0].Message != null) {
            if (response.Message[0].Message === 'No data found.') {
              dispatch({
                type: Constants.ACTIONS.GET_BOOKING_DETAIL,
                bookingDetail: [],
              });
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
            }
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.NO_DATA_FOUND,
            );
          }
        }
      })
      .catch((error) => {
        dispatch(HidePendingDetailScreenLoading());
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
            if (response.Message[0].Message === 'No data found.') {
              dispatch({
                type: Constants.ACTIONS.GET_PDF_REPORT,
                pdfReport: [],
              });
            }
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              response.Message[0].Message,
            );
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.NO_DATA_FOUND,
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

export const showPendingDetailScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_PENDING_DETAIL_SCREEN_LOADING,
    });
  };
};

export const HidePendingDetailScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_PENDING_DETAIL_SCREEN_LOADING,
    });
  };
};
export const showPdfLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_PENDING_DETAIL_SCREEN_LOADING,
    });
  };
};

export const HidePdfLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_PENDING_DETAIL_SCREEN_LOADING,
    });
  };
};

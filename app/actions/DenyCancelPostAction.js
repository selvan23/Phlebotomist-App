'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleError} from './NetworkAction';

export const DenyBookingPostMessage = (dictInfo, callback) => {
  return (dispatch) => {
    dispatch(showpostMessageloading());

    HttpBaseClient.post(AsyncStorage.configUri.ac_on_bo, dictInfo, 0)
      .then((response) => {
        if (response.Code === 200) {
          dispatch(hidepostMessageloading());
          callback(true, response.Message[0].Message);
        } else {
          dispatch(hidepostMessageloading());
          if (response.Message[0].Message != null) {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              response.Message[0].Message,
            );
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.REQ_FAILED,
            );
          }
        }
      })
      .catch((error) => {
        dispatch(hidepostMessageloading());
        dispatch(handleError(error));
      });
  };
};
export const cancelBookingPostMessage = (dictInfo, callback) => {
  return (dispatch) => {
    dispatch(showpostMessageloading());

    HttpBaseClient.post(AsyncStorage.configUri.ac_on_bo, dictInfo, 0)
      .then((response) => {
        if (response.Code === 200) {
          dispatch(hidepostMessageloading());
          callback(true, response.Message[0].Message);
        } else {
          dispatch(hidepostMessageloading());
          if (response.Message[0].Message != null) {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              response.Message[0].Message,
            );
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.REQ_FAILED,
            );
          }
        }
      })
      .catch((error) => {
        dispatch(hidepostMessageloading());
        dispatch(handleError(error));
      });
  };
};
export const showpostMessageloading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_POSTMESSAGE_LOADING,
    });
  };
};

export const hidepostMessageloading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_POSTMESSAGE_LOADING,
    });
  };
};

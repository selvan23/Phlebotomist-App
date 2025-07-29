'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleError} from './NetworkAction';

export const getcalenderDate = () => {
  return (dispatch, getState) => {
    dispatch(showCalenderLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.sc_bo_da, {}, 0)
        .then((response) => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(hideCalenderLoading());
            dispatch({
              type: Constants.ACTIONS.GET_CALENDER_DATE,
              payload: response.Message[0],
            });
          } else {
            dispatch(hideCalenderLoading());

            if (response.Message[0].Message != null) {
              if (response.Message[0].Message === 'No data found.') {
                dispatch({
                  type: Constants.ACTIONS.GET_CALENDER_DATE,
                  payload: [],
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
          dispatch(hideCalenderLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showCalenderLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_CALENDER_LOADING,
    });
  };
};

export const hideCalenderLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_CALENDER_LOADING,
    });
  };
};

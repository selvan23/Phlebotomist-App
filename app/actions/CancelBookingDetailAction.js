import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {handleError} from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCancelBookingDetail = (dictInfo, callBack) => {
  return (dispatch) => {
    dispatch(showCancelDetailScreenLoading());
    HttpBaseClient.post(AsyncStorage.configUri.or_bo_de, dictInfo, 0)
      .then((response) => {
        dispatch(hideCancelDetailScreenLoading());
        if (response.Code === 200) {
          dispatch({
            type: Constants.ACTIONS.GET_CANCEL_BOOKING_DETAIL,
            payload: response.Message[0],
          });
          callBack(true);
        } else {
          if (response.Message[0].Message != null) {
            if (response.Message[0].Message === 'No data found.') {
              dispatch({
                type: Constants.ACTIONS.GET_CANCEL_BOOKING_DETAIL,
                payload: [],
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
        dispatch(hideCancelDetailScreenLoading());
        dispatch(handleError(error));
      });
  };
};

export const getCompletedDetail = (dictInfo, callBack) => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.GET_COMPLETED_BOOKING_DETAIL,
      payload: [],
    });
    dispatch(showCompletedDetailLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.or_bo_de, dictInfo, 0)
        .then((response) => {
          dispatch(hideCompletedDetailLoading());
          if (response.Code === 200) {
            dispatch({
              type: Constants.ACTIONS.GET_COMPLETED_BOOKING_DETAIL,
              payload: response.Message[0],
            });
            callBack(true);
          } else {
            dispatch({
              type: Constants.ACTIONS.GET_COMPLETED_BOOKING_DETAIL,
              payload: [],
            });
            if (response.Message[0].Message != null) {
              if (response.Message[0].Message === 'No data found.') {
                dispatch({
                  type: Constants.ACTIONS.GET_COMPLETED_BOOKING_DETAIL,
                  payload: [],
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
          dispatch({
            type: Constants.ACTIONS.GET_COMPLETED_BOOKING_DETAIL,
            payload: [],
          });
          dispatch(hideCompletedDetailLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showCancelDetailScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_CANCEL_DETAIL_SCREEN_LOADING,
    });
  };
};

export const hideCancelDetailScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_CANCEL_DETAIL_SCREEN_LOADING,
    });
  };
};
export const showCompletedDetailLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_COMPLETED_DETAIL_SCREEN_LOADING,
    });
  };
};

export const hideCompletedDetailLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_COMPLETED_DETAIL_SCREEN_LOADING,
    });
  };
};

'use strict';

import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleError } from './NetworkAction';

export const updateSOSAlert = (postData, callback) => {
  return dispatch => {
    setTimeout(function () {
      HttpBaseClient.post(
        AsyncStorage.configUri.so_al,
        postData,
        0,
      ).then(response => {
          dispatch(hideSosLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch({
              type: Constants.ACTIONS.SHOW_CUSTOM_ALERT,
              payload: {
                title: Constants.ALERT.TITLE.SUCCESS,
                message: response.Message[0].Message,
              },
            });
            callback(true, response.Message[0])
          } else {
            if (response.Message[0].Message != null) {
              dispatch({
                type: Constants.ACTIONS.SHOW_CUSTOM_ALERT,
                payload: {
                  title: Constants.ALERT.TITLE.ERROR,
                  message: response.Message[0].Message,
                },
              });
            } else {
              dispatch({
                type: Constants.ACTIONS.SHOW_CUSTOM_ALERT,
                payload: {
                  title: Constants.ALERT.TITLE.ERROR,
                  message: Constants.VALIDATION_MSG.NO_DATA_FOUND,
                },
              });
            }
          }
        })
        .catch(error => {
          dispatch(hideSosLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showSosLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SOS_SHOW_LOADING,
    });
  };
};

export const hideSosLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SOS_HIDE_LOADING,
    });
  };
};

/*************************************************
 * SukraasLIS
 * CollectionscreenAction.js
 * Created by Kishore on 20/08/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
import {handleError} from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCashCollectionList = (postData) => {
  return (dispatch, getState) => {
    dispatch(showCollectionscreenLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.st_pa_cp, postData, 0)
        .then((response) => {
          dispatch(hideCollectionscreenLoading());
          console.log('RESPONSE', response);
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch({
              type: Constants.ACTIONS.GET_CASH_COLLECTED_USER_DETAILS,
              payload: response.Message,
            });
          } else {
            if (response.Message[0].Message != null) {
              dispatch({
                type: Constants.ACTIONS.GET_CASH_COLLECTED_USER_DETAILS,
                payload: [],
              });
              if (response.Message[0].Message === 'No data found.') {
                dispatch({
                  type: Constants.ACTIONS.GET_CASH_COLLECTED_USER_DETAILS,
                  payload: [],
                });
              }
            } else {
              dispatch({
                type: Constants.ACTIONS.GET_CASH_COLLECTED_USER_DETAILS,
                payload: [],
              });
            }
          }
        })
        .catch((error) => {
          dispatch(handleError(error));
          dispatch(hideCollectionscreenLoading());
        });
    }, 500);
  };
};

export const showCollectionscreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.COLLECTION_SCREEN_SHOW_LOADING,
    });
  };
};

export const hideCollectionscreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.COLLECTION_SCREEN_HIDE_LOADING,
    });
  };
};

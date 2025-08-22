/*************************************************
 * SukraasLIS
 * @exports
 * @class SampleCollectionSummaryAction.js
 * Created by Sankar on 11/8/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
// import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleError} from './NetworkAction';

export const getSubmitRating = (postData, callBack) => {
  return (dispatch) => {
    dispatch(showScreenLoading());
    HttpBaseClient.post(AsyncStorage.configUri.up_ra, postData, 0)
      .then((response) => {
        dispatch(HideScreenLoading());
        if (response.Code === 200) {
          dispatch({
            type: Constants.ACTIONS.SHOW_CUSTOM_ALERT,
            payload: {
              title: Constants.ALERT.TITLE.SUCCESS,
              message: response.Message[0].Message,
            },
          });
          callBack(true);
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
      .catch((error) => {
        dispatch(HideScreenLoading());
        dispatch(handleError(error));
      });
  };
};

export const getSubmitReview = (postData, callBack) => {
  return (dispatch) => {
    dispatch(showScreenLoading());
    HttpBaseClient.post(AsyncStorage.configUri.ps_re, postData, 0)
      .then((response) => {
        dispatch(HideScreenLoading());
        if (response.Code === 200) {
          dispatch({
            type: Constants.ACTIONS.SHOW_CUSTOM_ALERT,
            payload: {
              title: Constants.ALERT.TITLE.SUCCESS,
              message: response.Message[0].Message,
            },
          });
          callBack(true);
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
      .catch((error) => {
        dispatch(HideScreenLoading());
        dispatch(handleError(error));
      });
  };
};

export const getSubmitOrderData = (postData, callBack) => {
  return (dispatch) => {
    dispatch(showScreenLoading());
    HttpBaseClient.post(AsyncStorage.configUri.sa_co_up, postData, 0)
      .then((response) => {
        dispatch(HideScreenLoading());
        if (response.Code === 200) {
          Utility.showAlert(Constants.ALERT.TITLE.SUCCESS, response.Message[0]);
          callBack(true);
        } else {
          if (response.Message[0].Message != null) {
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
        dispatch(HideScreenLoading());
        dispatch(handleError(error));
      });
  };
};

export const invokeUpdateSampleCollection = (
  dicSampleCollectionInfo,
  callback,
) => {
  return (dispatch) => {
    dispatch(showScreenLoading());
    setTimeout(function () {
      HttpBaseClient.post(
        AsyncStorage.configUri.sa_co_up,
        dicSampleCollectionInfo,
        0,
      )
        .then((response) => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(HideScreenLoading());
            callback(true, response.Message[0].Description);
          } else {
            dispatch(HideScreenLoading());
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
          dispatch(HideScreenLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_SAMPLE_COLLECTION_SUMMARY_SCREEN_LOADING,
    });
  };
};

export const HideScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_SAMPLE_COLLECTION_SUMMARY_SCREEN_LOADING,
    });
  };
};

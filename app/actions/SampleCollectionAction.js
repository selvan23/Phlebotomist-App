/*************************************************
 * SukraaLIS
 * @exports
 * @class SampleCollectionAction.js
 * Created by Shiva Sankar on 11/08/2020
 * Copyright © 202 SukraaLIS. All rights reserved.
 *************************************************/
'use strict';

import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
import {handleError} from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const invokeCheckBarCode = (dicBarCodeInfo, callback) => {
  return (dispatch) => {
    dispatch(showSampleCollectionLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.Ch_Ba, dicBarCodeInfo, 0)
        .then((response) => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(hideSampleCollectionLoading());
            callback(true);
            Utility.showAlert(
              Constants.ALERT.TITLE.SUCCESS,
              response.Message[0].Message,
            );
          } else {
            dispatch(hideSampleCollectionLoading());
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
          dispatch(hideSampleCollectionLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const invokeUpdateSampleCollection = (
  dicSampleCollectionInfo,
  callback,
) => {
  return (dispatch) => {
    dispatch(showSampleCollectionLoading());
    setTimeout(function () {
      HttpBaseClient.post(
        AsyncStorage.configUri.sa_co_up,
        dicSampleCollectionInfo,
        0,
      )
        .then((response) => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(hideSampleCollectionLoading());
            callback(true);
            Utility.showAlert(
              Constants.ALERT.TITLE.SUCCESS,
              response.Message[0].Description,
            );
          } else {
            dispatch(hideSampleCollectionLoading());
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
          dispatch(hideSampleCollectionLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showSampleCollectionLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_SUBMIT_BAR_CODE_LOADING,
    });
  };
};

export const hideSampleCollectionLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_SUBMIT_BAR_CODE_LOADING,
    });
  };
};

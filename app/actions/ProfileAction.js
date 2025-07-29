'use strict';

import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleError} from './NetworkAction';

export const getProfileDetails = (userName) => {
  return (dispatch) => {
    dispatch(showProfileLoading());

    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.st_pr, {Username: userName}, 0)
        .then((response) => {
          dispatch(hideProfileLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch({
              type: Constants.ACTIONS.GET_PROFILE_DETAILS,
              payload: response.Message[0],
            });
            dispatch({
              type: Constants.ACTIONS.USER_PROFILE_IMAGE,
              url: response.Message[0].Collector_Profile_Image_Url,
            });
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
          dispatch(hideProfileLoading());
          dispatch(handleError(error));
        });
    }, 2000);
  };
};

export const updateProfileDetails = (post, callback) => {
  return (dispatch) => {
    dispatch(showProfileLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.co_pr_up, post, 4)
        .then((response) => {
          dispatch(hideProfileLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            callback(true, response.Message[0].Collector_Profile_Image_Url);
            dispatch({
              type: Constants.ACTIONS.GET_PROFILE_DETAILS,
              payload: response.Message[0],
            });
            dispatch({
              type: Constants.ACTIONS.USER_PROFILE_IMAGE,
              url: response.Message[0].Collector_Profile_Image_Url,
            });
            Utility.showAlert(
              Constants.ALERT.TITLE.SUCCESS,
              Constants.VALIDATION_MSG.PROFILE_UPDATE_SUCCESS,
            );
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
          dispatch(hideProfileLoading());
          dispatch(handleError(error));
        });
    }, 2000);
  };
};

export const showProfileLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.PROFILE_SHOW_LOADING,
    });
  };
};

export const hideProfileLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.PROFILE_HIDE_LOADING,
    });
  };
};

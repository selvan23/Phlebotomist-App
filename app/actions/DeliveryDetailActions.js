/*************************************************
 * SukraasLIS
 * @exports
 * @class DeliveryDetailAction.js
 * @extends Component
 * Created by ShivaSankar on 20/7/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {handleError} from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDeliveryDetails = (postData, callback) => {
  return (dispatch) => {
    dispatch(showDeliveryDetailScreenLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.sa_de_de, postData, 0)
        .then((response) => {
          dispatch(hideDeliveryDetailScreenLoading());
          if (response.Code === 200) {
            dispatch({
              type: Constants.ACTIONS.GET_DELIVERY_DETAIL_INFO,
              payload: response.Message[0],
            });
            callback(true);
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
          dispatch(hideDeliveryDetailScreenLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};
export const updateDeliveryDetails = (postData, callback) => {
  return (dispatch) => {
    dispatch(showDeliveryDetailScreenLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.sa_de_up, postData, 0)
        .then((response) => {
          dispatch(hideDeliveryDetailScreenLoading());
          if (response.Code === 200) {
            Utility.showAlertWithPopAction(
              Constants.ALERT.TITLE.SUCCESS,
              response.Message[0].Description,
            );
            callback(true);
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
          dispatch(hideDeliveryDetailScreenLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};

export const showDeliveryDetailScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_DELIVERY_DETAIL_LOADING,
    });
  };
};

export const hideDeliveryDetailScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_DELIVERY_DETAIL_LOADING,
    });
  };
};

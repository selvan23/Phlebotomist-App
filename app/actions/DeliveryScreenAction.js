/*************************************************
 * SukraasLIS
 * @exports
 * @class DeliverScreenAction.js
 * @extends Component
 * Created by Kishore on 9/7/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {handleError} from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPendingDeliveryList = (postData, callback) => {
  return (dispatch) => {
    dispatch(showPendingDeliveryScreenLoading());

    console.log('getpendingdeliverylist urlll :: ', AsyncStorage.configUri.sa_de_st_co, postData);

    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.sa_de_st_co, postData, 0)
        .then((response) => {
          dispatch(HidePendingDeliveryScreenLoading());
          if (response.Code === 200) {
            callback(true);
            dispatch({
              type: Constants.ACTIONS.GET_PENDING_DELIVERY_LIST,
              payload: response.Message[0].Booking_Detail,
            });
          } else {
            dispatch({
              type: Constants.ACTIONS.GET_PENDING_DELIVERY_LIST,
              payload: [],
            });
          }
        })
        .catch((error) => {
          dispatch(HidePendingDeliveryScreenLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};

export const getDeliveryList = (postData, callback) => {
  return (dispatch) => {
    dispatch(showPendingDeliveryScreenLoading());

    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.sa_de_st_co, postData, 0)
        .then((response) => {
          dispatch(HidePendingDeliveryScreenLoading());
          if (response.Code === 200) {
            callback(true);
            dispatch({
              type: Constants.ACTIONS.GET_DELIVERY_LIST,
              payload: response.Message[0].Booking_Detail,
            });
          } else {
            dispatch({
              type: Constants.ACTIONS.GET_DELIVERY_LIST,
              payload: [],
            });
          }
        })
        .catch((error) => {
          dispatch(HidePendingDeliveryScreenLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};

export const showPendingDeliveryScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.SHOW_PENDINGDELIVERY_LOADING,
    });
  };
};

export const HidePendingDeliveryScreenLoading = () => {
  return (dispatch) => {
    dispatch({
      type: Constants.ACTIONS.HIDE_PENDINGDELIVERY_LOADING,
    });
  };
};

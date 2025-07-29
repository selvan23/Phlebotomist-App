'use strict';

import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import { handleError } from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateGPSLocation = (postData) => {
    return dispatch => {
        setTimeout(function () {
            HttpBaseClient.post(
                AsyncStorage.configUri.u_cgs,
                postData,
                0,
            ).then(response => {
                if (response.Code === Constants.HTTP_CODE.SUCCESS) {
                    console.log(" Update GPS Success ")
                } else {
                    console.log(" Update GPS Failure ")

                }
            }).catch(error => {
                console.log("Gps Error ", error)
            });
        }, 500);
    };
};

export const setLocationMessage = (locationAlert) => {
    return (dispatch) => {
      dispatch({
        type: Constants.ACTIONS.GPS_LOCATION_MESSAGE,
        locationAlert:locationAlert
      });
    };
  };

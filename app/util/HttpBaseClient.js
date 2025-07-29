/*************************************************
 * SukraasLIS
 * HttpBaseClient.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
import store from '../store';
import axios from 'axios';

import Constants from './Constants';
import {OAUTH, BASE_URL} from './URL';
import Utility from './Utility';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class HttpBaseClient {
  /**
   * isAccessToken 0 defalut
   * isAccessToken 1 Is Access token Required
   * isAccessToken 2 oathu service
   * @param {*} isAccessToken
   */
  static httpHeader(isAccessToken) {
    let headers = {
      'Content-Type': 'application/json',
      'cache-control': 'no-cache',
    };
    if (isAccessToken === 2) {
      headers = {
        ...headers,
        Authorization: 'Basic YWNtZTphY21lc2VjcmV0',
      };
    } else if (isAccessToken === 3) {
      headers = {
        ...headers,
        Authorization: 'Basic YWNtZTphY21lc2VjcmV0',
      };
    } else if (isAccessToken === 4) {
      headers = {
        'cache-control': 'no-cache',
        "Content-Type": "multipart/form-data",
        // Authorization: 'Basic YWNtZTphY21lc2VjcmV0',
      };
    } else {
      headers = {
        ...headers,
        // Authorization: `${
        //   store.getState().loggedInUserDetailsState.loggedInUserToken.token_type
        // } ${
        //   store.getState().loggedInUserDetailsState.loggedInUserToken
        //     .access_token
        // }`,
      };
    }
    return headers;
  }

  /**
   * GET method
   * @param {*} url
   * @param {*} params
   * @param {*} isAccessToken
   */
  static get(url, params, isAccessToken) {
    if (!store.getState().deviceState.isNetworkConnectivityAvailable) {
      return new Promise((success, failed) => {
        failed(CatchErrorHandler(Constants.VALIDATION_MSG.NO_INTERNET));
      });
    }
    return new Promise(function (success, failed) {
      const config = {
        method: 'GET',
        url,
        params,
        headers: HttpBaseClient.httpHeader(isAccessToken),
      };

      axios
        .create({
          baseURL: AsyncStorage.configUri.bu,
        })(config)
        .then((response) => {
          if (response.status === Constants.HTTP_CODE.SUCCESS) {
            try {
              return response.data;
            } catch (e) {
              throw {
                status: response.status,
                message: Constants.VALIDATION_MSG.REQ_FAILED,
              };
            }
          } else {
            throw {
              status: response.status,
              message: Constants.VALIDATION_MSG.REQ_FAILED,
            };
          }
        })
        .then((response) => {
          success(response);
        })
        .catch((err) => {
          failed(CatchErrorHandler(err.message));
        });
    });
  }

  /**
   * POST method
   * @param {*} url
   * @param {*} data
   * @param {*} isAccessToken
   */ 
  static post(url, data, isAccessToken) {
    console.log('http post');
    console.log('=====url', url);
    console.log('=====data', data);
    console.log('=====isAccessToken', isAccessToken);
    // AsyncStorage.configUri.bu = 'http://110.44.126.145:9090/SamyakApp_Stage/API/Collector/';
    // AsyncStorage.configUri.bu = 'https://product.sukraa.in/MobileApp/App_Config/Stage_Phlebotomist/'
    Utility.myLog(url);
    Utility.myLog(data);
    if (!store.getState().deviceState.isNetworkConnectivityAvailable) {
      return new Promise((success, failed) => {
        console.log('=====ifffff');

        failed(CatchErrorHandler(Constants.VALIDATION_MSG.NO_INTERNET));
      });
    }
    return new Promise(function (success, failed) {
      let config = {
        method: 'POST',
        url,
        headers: HttpBaseClient.httpHeader(isAccessToken),
        data,
      };
      console.log('=====config', config);

      // if (isAccessToken === 2) {
      //   config = {
      //     ...config,
      //     params: data,
      //   };
      // } else {
      //   config = {
      //     ...config,
      //     data,
      //   };
      // }

      axios
        .create({
          baseURL: AsyncStorage.configUri.bu,
        })(config)
        .then((response) => {
          console.log('********** response **********:', response);

          if (response.status === Constants.HTTP_CODE.SUCCESS) {
            try {
              return response.data;
            } catch (e) {
              throw {
                status: response.status,
                message: Constants.VALIDATION_MSG.REQ_FAILED,
              };
            }
          } else {
            throw {
              status: response.status,
              message: Constants.VALIDATION_MSG.REQ_FAILED,
            };
          }
        })
        .then((response) => {
          console.log('********** POST RESPONSE **********: ', response);
          console.log('post success', response);
          success(response);
        })
        .catch((err) => {
          console.log('********** POST RESPONSE err **********:', err);

          // Utility.myLog(JSON.parse(err.request._response).Message[0].Message);
          try {
            console.log('post json parse', err.request);
            success(JSON.parse(err.request._response));
          } catch (e) {
            console.log('********** POST RESPONSE e **********:', e);
            console.log('post failed', e);
            failed(CatchErrorHandler(err.message, url));
          }
        });
    });
  }

  /**
   * PUT method
   * @param {*} url
   * @param {*} data
   * @param {*} isAccessToken
   */
  static put(url, data, isAccessToken) {
    if (!store.getState().deviceState.isNetworkConnectivityAvailable) {
      return new Promise((success, failed) => {
        failed(CatchErrorHandler(Constants.VALIDATION_MSG.NO_INTERNET));
      });
    }
    return new Promise(function (success, failed) {
      const config = {
        method: 'PUT',
        url,
        data,
        headers: HttpBaseClient.httpHeader(isAccessToken),
      };
      axios
        .create({
          baseURL: AsyncStorage.configUri.bu,
        })(config)
        .then((response) => {
          if (response.status === Constants.HTTP_CODE.SUCCESS) {
            try {
              return response.data;
            } catch (e) {
              throw {
                status: response.status,
                message: Constants.VALIDATION_MSG.REQ_FAILED,
              };
            }
          } else {
            throw {
              status: response.status,
              message: Constants.VALIDATION_MSG.REQ_FAILED,
            };
          }
        })
        .then((response) => {
          success(response);
        })
        .catch((err) => {
          failed(CatchErrorHandler(err.message));
        });
    });
  }

  /**
   * DELETE method
   * @param {*} url
   * @param {*} params
   * @param {*} isAccessToken
   */
  static delete(url, params, isAccessToken) {
    if (!store.getState().deviceState.isNetworkConnectivityAvailable) {
      return new Promise((success, failed) => {
        failed(CatchErrorHandler(Constants.VALIDATION_MSG.NO_INTERNET));
      });
    }
    return new Promise(function (success, failed) {
      const config = {
        method: 'DELETE',
        url,
        params,
        headers: HttpBaseClient.httpHeader(isAccessToken),
      };
      axios
        .create({
          baseURL: AsyncStorage.configUri.bu,
        })(config)
        .then((response) => {
          if (response.status === Constants.HTTP_CODE.SUCCESS) {
            try {
              return response.data;
            } catch (e) {
              throw {
                status: response.status,
                message: Constants.VALIDATION_MSG.REQ_FAILED,
              };
            }
          } else {
            throw {
              status: response.status,
              message: Constants.VALIDATION_MSG.REQ_FAILED,
            };
          }
        })
        .then((response) => {
          success(response);
        })
        .catch((err) => {
          failed(CatchErrorHandler(err.message));
        });
    });
  }
}

/**
 * Catch error handel method check with error code and error message.
 * @param {*} error
 */
function CatchErrorHandler(error, methodName) {
  if (error.includes(Constants.VALIDATION_MSG.NO_INTERNET)) {
    return {
      status: Constants.HTTP_CODE.NO_INTERNET,
      message: Constants.VALIDATION_MSG.NO_INTERNET,
    };
  }
  if (error.includes(Constants.HTTP_CODE.AUTHENTICATION_FAILURE)) {
    return {
      status: Constants.HTTP_CODE.AUTHENTICATION_FAILURE,
      message: Constants.VALIDATION_MSG.AUTH_FAILED,
    };
  }
  if (error.includes(Constants.HTTP_CODE.INPUT_VALIDATION_ERROR)) {
    if (methodName === OAUTH) {
      return {
        status: Constants.HTTP_CODE.INPUT_VALIDATION_ERROR,
        message: Constants.VALIDATION_MSG.AUTH_FAILED,
      };
    }
    return {
      status: Constants.HTTP_CODE.INPUT_VALIDATION_ERROR,
      message: Constants.VALIDATION_MSG.AUTH_FAILED,
    };
  }
  if (error.includes(Constants.HTTP_CODE.REQUIRED_MISSING)) {
    return {
      status: Constants.HTTP_CODE.REQUIRED_MISSING,
      message: Constants.VALIDATION_MSG.AUTH_FAILED,
    };
  }
  if (error.includes(Constants.HTTP_CODE.REQUEST_TIMED_OUT_FAILURE)) {
    return {
      status: Constants.HTTP_CODE.REQUEST_TIMED_OUT_FAILURE,
      message: Constants.VALIDATION_MSG.REQ_FAILED,
    };
  }
  if (error.includes(Constants.HTTP_CODE.NO_DATA_FOUND)) {
    return {
      status: Constants.HTTP_CODE.NO_DATA_FOUND,
      message: Constants.VALIDATION_MSG.NO_DATA_FOUND,
    };
  }
  if (error.includes('Network Error')) {
    return {
      status: Constants.HTTP_CODE.REQUEST_TIMED_OUT_FAILURE,
      message: Constants.VALIDATION_MSG.REQ_FAILED,
    };
  }
  return {
    status: Constants.HTTP_CODE.REQUEST_TIMED_OUT_FAILURE,
    message: Constants.VALIDATION_MSG.REQ_FAILED,
  };
}

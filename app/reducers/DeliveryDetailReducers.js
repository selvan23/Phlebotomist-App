/*************************************************
 * SukraasLIS
 * @exports
 * @class DeliveryReducers.js
 * @extends Component
 * Created by ShivaSankar on 20/7/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isDeliveryDetailScreenLoading: true,
  deliveryData: {},
  isOTPResentLoading: false,
  isOTPSubmitLoading: false,
};

export const deliveryDetailScreenState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_DELIVERY_DETAIL_LOADING:
      return {...state, isDeliveryDetailScreenLoading: true};
    case ACTIONS.HIDE_DELIVERY_DETAIL_LOADING:
      return {...state, isDeliveryDetailScreenLoading: false};

    case ACTIONS.SHOW_VERIFICATION_CODE_SUBMIT_LOADING:
      return {...state, isOTPSubmitLoading: true};
    case ACTIONS.HIDE_VERIFICATION_CODE_SUBMIT_LOADING:
      return {...state, isOTPSubmitLoading: false};

    case ACTIONS.SHOW_VERIFICATION_CODE_RESEND_LOADING:
      return {...state, isOTPResentLoading: true};
    case ACTIONS.HIDE_VERIFICATION_CODE_RESEND_LOADING:
      return {...state, isOTPResentLoading: false};

    case ACTIONS.GET_DELIVERY_DETAIL_INFO:
      return {...state, deliveryData: action.payload};
    default:
      return state;
  }
};

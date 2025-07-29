'use strict';

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isPendingDeliveryScreenLoading: false,
  pendingListData: {},
  deliveryListData: {},
};

export const pendingDeliveryScreenState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_PENDINGDELIVERY_LOADING:
      return {...state, isPendingDeliveryScreenLoading: true};
    case ACTIONS.HIDE_PENDINGDELIVERY_LOADING:
      return {...state, isPendingDeliveryScreenLoading: false};
    case ACTIONS.GET_PENDING_DELIVERY_LIST:
      return {...state, pendingListData: action.payload};
    case ACTIONS.GET_DELIVERY_LIST:
      return {...state, deliveryListData: action.payload};
    default:
      return state;
  }
};

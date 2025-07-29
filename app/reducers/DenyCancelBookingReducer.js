'use strict';

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  ispostMessageLoading: false,
};

export const denyCancelBookingPendingState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_POSTMESSAGE_LOADING:
      return {
        ...state,
        ispostMessageLoading: true,
      };
    case ACTIONS.HIDE_POSTMESSAGE_LOADING:
      return {
        ...state,
        ispostMessageLoading: false,
      };
    default:
      return state;
  }
};

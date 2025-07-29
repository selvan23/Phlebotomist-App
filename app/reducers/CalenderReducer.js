import Constants from '../util/Constants';
import {act} from 'react-test-renderer';
const {ACTIONS} = Constants;

let initialState = {
  isCalenderLoading: false,
  calenderDate: {},
};

export const calenderState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_CALENDER_LOADING:
      return {...state, isCalenderLoading: true};
    case ACTIONS.HIDE_CALENDER_LOADING:
      return {...state, isCalenderLoading: false};
    case ACTIONS.GET_CALENDER_DATE:
      return {...state, calenderDate: action.payload};
    default:
      return state;
  }
};

import Constants from '../util/Constants';
const { ACTIONS } = Constants;

let initialState = {
  isCancelDetailLoading: false,
  isCompletedDetailLoading: false,
  cancelBookingDetail: {},
  bookingDetail: {}
};

export const cancelBookingDetailState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_CANCEL_DETAIL_SCREEN_LOADING:
      return { ...state, isCancelDetailLoading: true };
    case ACTIONS.HIDE_CANCEL_DETAIL_SCREEN_LOADING:
      return { ...state, isCancelDetailLoading: false };
    case ACTIONS.GET_CANCEL_BOOKING_DETAIL:
      return { ...state, cancelBookingDetail: action.payload };

// completed Detail screen
    case ACTIONS.SHOW_COMPLETED_DETAIL_SCREEN_LOADING:
      return { ...state, isCompletedDetailLoading: true };
    case ACTIONS.HIDE_COMPLETED_DETAIL_SCREEN_LOADING:
      return { ...state, isCompletedDetailLoading: false };
    case ACTIONS.GET_COMPLETED_BOOKING_DETAIL:
      return { ...state, bookingDetail: action.payload };

    default:
      return state;
  }
};

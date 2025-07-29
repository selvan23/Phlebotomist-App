/*************************************************
 * SukraasLIS
 * index.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';

import {combineReducers} from 'redux';

import {deviceState} from './DeviceReducer';
import {splashState} from './SplashReducer';
import {loginState} from './LoginReducer';
import {aboutScreenState} from './AboutScreenReducer';
import {contactScreenState} from './ContactScreenReducer';
import {profileState} from './ProfileReducers';
import {collectionScreenState} from './CollectionScreenReducer';
import {verificationState} from './VerificationReducer';
import {setPasswordState} from './SetPasswordReducer';
import {configState} from './ConfigReducer';
import {pendingState} from './PendingScreenReducer';
import {pendingDetailState} from './PendingDetailReducer';
import {denyCancelBookingPendingState} from './DenyCancelBookingReducer';
import {calenderState} from './CalenderReducer';
import {pendingDeliveryScreenState} from './DeliveryScreenReducer';
import {sampleCollectionDetailState} from './SampleCollectionDetailReducer';
import {sampleCollectionState} from './SampleCollectionReducers';
import {sampleCollectionSummaryState} from './SampleCollectionSummaryReducer';
import {deliveryDetailScreenState} from './DeliveryDetailReducers';
import {notificationState} from './NotificationReducer';
import {cancelBookingDetailState} from './CancelBookingDetailReducer';
import Constants from '../util/Constants';
import { sosState } from './SosReducer'

//Combines all the reducer for the store and exports to it
const rootReducer = combineReducers({
  deviceState,
  splashState,
  loginState,
  aboutScreenState,
  contactScreenState,
  profileState,
  collectionScreenState,
  verificationState,
  setPasswordState,
  configState,
  pendingState,
  denyCancelBookingPendingState,
  calenderState,
  pendingDetailState,
  cancelBookingDetailState,
  pendingDeliveryScreenState,
  sampleCollectionDetailState,
  sampleCollectionState,
  sampleCollectionSummaryState,
  deliveryDetailScreenState,
  notificationState,
  sosState
});

const appReducers = (state, action) => {
  if (action.type === Constants.ACTIONS.LOGOUT_USER) {
    state = undefined;
  }
  return rootReducer(state, action);
};

export default appReducers;

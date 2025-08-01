/*************************************************
 * SukraasLIS
 * @exports
 * @class App.js
 * @extends Component
 * Created by Jagadish Sellamuthu on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import Store from './app/store';
import RouteNavigator from './app/index';
import {KEY} from './app/util/Constants';
import Utility from './app/util/Utility';
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import {LogBox} from 'react-native';

/**
 * Gets the store and registered scenes and sets that to provider
 */
import {YellowBox} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
YellowBox.ignoreWarnings(['']);
class App extends Component {
  // constructor(properties) {
  //   super(properties);
  //   OneSignal.init('fbd81856-6ca1-4f71-8d7a-bf854415432d', {
  //     kOSSettingsKeyAutoPrompt: true,
  //   }); // set kOSSettingsKeyAutoPrompt to false prompting manually on iOS

  //   OneSignal.addEventListener('received', this.onReceived);
  //   OneSignal.addEventListener('opened', this.onOpened);
  //   OneSignal.addEventListener('ids', this.onIds);
  // }

  // componentWillUnmount() {
  //   OneSignal.removeEventListener('received', this.onReceived);
  //   OneSignal.removeEventListener('opened', this.onOpened);
  //   OneSignal.removeEventListener('ids', this.onIds);
  // }

  // onReceived(notification) {
  //   console.log('Notification received: ', notification);
  // }

  // onOpened(openResult) {
  //   console.log('Message: ', openResult.notification.payload.body);
  //   console.log('Data: ', openResult.notification.payload.additionalData);
  //   console.log('isActive: ', openResult.notification.isAppInFocus);
  //   console.log('openResult: ', openResult);
  // }

  // onIds(device) {
  //   console.log('Device info: ', device);
  //   Utility.storeData(KEY.ONE_SIGNAL_ID, device.userId);
  // }

  render() {
    return (
      <Provider store={Store}>
        <SafeAreaProvider>
          <SafeAreaView style={{flex: 1}}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RouteNavigator />
            </GestureHandlerRootView>
          </SafeAreaView>
        </SafeAreaProvider>
      </Provider>
    );
  }
}

export default App;

// // To see all the requests in the chrome Dev tools in the network tab.
// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//     GLOBAL.originalXMLHttpRequest :
//     GLOBAL.XMLHttpRequest;

//   // fetch logger
// global._fetch = fetch;
// global.fetch = function (uri, options, ...args) {
//   return global._fetch(uri, options, ...args).then((response) => {
//     console.log('Fetch', { request: { uri, options, ...args }, response });
//     return response;
//   });
// };

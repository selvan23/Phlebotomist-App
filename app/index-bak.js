/*************************************************
 * SukraasLIS
 * index.js
 * Created by Sankar on 8/07/2020
 * Copyright Â© 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';

import React, {Component} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Router, Scene, ActionConst, Actions} from 'react-native-router-flux';
import Constants from './util/Constants';
import TabIcon from './util/TabIcon';

import SetPasswordScreen from './components/SetPasswordScreen';
import VerificationScreen from './components/VerificationScreen';

import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import OfflineNotice from '../app/components/common/OfflineNotice';
import NavBar from './components/common/NavigationBar';
import SettingsScreen from './components/settings/SettingsScreen';
import ViewProfileScreen from './components/settings/ViewProfileScreen';
import ContactUsScreen from './components/settings/ContactUsScreen';
import PendingScreen from './components/schedules/PendingScreen';
import CompletedScreen from './components/schedules/CompletedScreen';
import CancelledScreen from './components/schedules/CancelledScreen';
import cancelBookingDetail from './components/schedules/CancelBookingDetailScreen';
import CollectionScreen from './components/collection/CollectionScreen';
import PendingDeliveryScreen from './components/delivery/PendingDeliveryScreen';
import DeliveredScreen from './components/delivery/DeliveredScreen';
import DeliveryDetailsScreen from './components/delivery/DeliveryDetailsScreen';
import AboutScreen from './components/settings/AboutScreen';
import SchedulesTabBar from './components/schedules/SchedulesTabBar';
import DeliveryTabs from './components/delivery/DeliveryTabs';

import SampleCollectionScreen from './components/schedules/SampleCollectionScreen';
import QRScanner from './components/schedules/QRScanner';
import SampleCollectionSummary from './components/schedules/SampleCollectionSummary';

import SampleCollectionDetail from './components/schedules/SampleCollectionDetail';
import PendingDetailScreen from './components/schedules/PendingDetailScreen';

import UploadPrescription from './components/schedules/UploadPrescription';
import PdfReport from './components/schedules/PdfReport';
import CancelBookingView from './components/schedules/CancelBookingView';
import NotificationListScreen from './components/NotificationListScreen';
import CompletedBookingDetailScreen from './components/schedules/CompletedBookingDetailScreen';
import SOSScreen from './components/SOSScreen'

/**
 * Registeres all the components used in the application for navigation
 */
class Main extends Component {
  onBackPress = () => {
    if (Actions.state.index === 0) {
      return false;
    }
    Actions.pop();
    return true;
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Router backAndroidHandler={this.onBackPress}>
          <Scene key="root" hideNavBar>
            <Scene key={'splashScreen'} component={SplashScreen} initial />
            <Scene
              key={'LoginScreen'}
              component={LoginScreen}
              type={ActionConst.RESET}
            />
            <Scene
              key={'SetPasswordScreen'}
              component={SetPasswordScreen}
              type={ActionConst.RESET}
            />
            <Scene
              key={'VerificationScreen'}
              component={VerificationScreen}
              panHandlers={null}
              // type={ActionConst.RESET}
            />
            <Scene
              key={'SOSScreen'}
              component={SOSScreen}
              hideNavBar={true}
              isShowNavBar={false}
              navBar={NavBar}
            />

            <Scene
              key={'homeTabBar'}
              type={ActionConst.RESET}
              tabs={true}
              tabBarPosition={'bottom'}
              activeTintColor={Constants.COLOR.THEME_COLOR}
              inactiveTintColor={'#000000'}
              activeBackgroundColor={'white'}
              inactiveBackgroundColor={'white'}
              tabBarStyle={{height: 55}}
              showLabel={true}
              navBar={NavBar}
              isShowNavBar={true}>
              <Scene
                initial
                key={'schedulesTab'}
                image={require('./images/bottomTabIcons/bookings_0.png')}
                activeImage={require('./images/bottomTabIcons/bookings_1.png')}
                icon={TabIcon}
                tabBarLabel={'Schedules'}
                title={'Schedules'}
                hideNavBar={false}
                // isShowLocation={true}
              >
                <Scene
                  tabBarStyle={{backgroundColor: Constants.COLOR.THEME_COLOR}}
                  cardStyle={{backgroundColor: Constants.COLOR.THEME_COLOR}}
                  key={'schedulesTabBar'}
                  type={ActionConst.RESET}
                  tabs={true}
                  swipeEnabled={false}
                  tabBarPosition={'top'}
                  activeTintColor={'white'}
                  inactiveTintColor={'#000000'}
                  activeBackgroundColor={'white'}
                  inactiveBackgroundColor={'white'}
                  showLabel={true}
                  title={'Schedules'}
                  tabBarComponent={SchedulesTabBar}
                  hideNavBar={false}
                  isShowLocation={false}>
                  <Scene
                    key={'pendingTab'}
                    icon={TabIcon}
                    tabBarLabel={'Pending'}
                    hideNavBar>
                    <Scene key={'pendingScreen'} component={PendingScreen} />
                  </Scene>

                  <Scene
                    key={'completedTab'}
                    icon={TabIcon}
                    tabBarLabel={'Completed'}
                    hideNavBar>
                    <Scene
                      key={'completedScreen'}
                      component={CompletedScreen}
                    />
                  </Scene>

                  <Scene
                    key={'cancelledTab'}
                    icon={TabIcon}
                    tabBarLabel={'Cancelled'}
                    hideNavBar>
                    <Scene
                      key={'cancelledScreen'}
                      component={CancelledScreen}
                    />
                  </Scene>
                </Scene>
              </Scene>

              {/* {} */}
              <Scene
                key={'collectionTab'}
                image={require('./images/bottomTabIcons/lab_0.png')}
                activeImage={require('./images/bottomTabIcons/lab_1.png')}
                icon={TabIcon}
                tabBarLabel={'Collection'}
                title={'Collection'}
                hideNavBar={false}
                isShowLocation={true}>
                <Scene key={'collectionScreen'} component={CollectionScreen} />
              </Scene>

              <Scene
                key={'deliveryTab'}
                image={require('./images/bottomTabIcons/trends_0.png')}
                activeImage={require('./images/bottomTabIcons/trends_1.png')}
                icon={TabIcon}
                tabBarLabel={'Delivery'}
                title={'Delivery'}
                hideNavBar={false}
                isShowLocation={true}>
                <Scene
                  tabBarStyle={{backgroundColor: Constants.COLOR.THEME_COLOR}}
                  key={'deliveryTab'}
                  type={ActionConst.RESET}
                  tabs={true}
                  tabBarPosition={'top'}
                  activeTintColor={'white'}
                  inactiveTintColor={'#000000'}
                  activeBackgroundColor={'white'}
                  inactiveBackgroundColor={'white'}
                  showLabel={true}
                  title={'Deliver Samples'}
                  tabBarComponent={DeliveryTabs}
                  hideNavBar={false}
                  isShowLocation={false}>
                  <Scene
                    key={'pendingDeliveryTab'}
                    icon={TabIcon}
                    tabBarLabel={'Pending Delivery'}
                    hideNavBar>
                    <Scene
                      key={'pendingDeliveryScreen'}
                      component={PendingDeliveryScreen}
                    />
                  </Scene>

                  <Scene
                    key={'deliveredScreenTab'}
                    icon={TabIcon}
                    tabBarLabel={'Delivered'}
                    hideNavBar>
                    <Scene
                      key={'deliveredScreen'}
                      component={DeliveredScreen}
                    />
                  </Scene>
                </Scene>
              </Scene>

              <Scene
                key={'SettingsTab'}
                image={require('./images/bottomTabIcons/settings_0.png')}
                activeImage={require('./images/bottomTabIcons/settings_1.png')}
                icon={TabIcon}
                tabBarLabel={'Settings'}
                hideNavBar={false}
                isShowLocation={true}>
                <Scene
                  key={'settingsScreen'}
                  component={SettingsScreen}
                  hideNavBar={false}
                  isShowNavBar={true}
                  title="Settings"
                  navBar={NavBar}
                />

                <Scene
                  key={'contactUsScreen'}
                  component={ContactUsScreen}
                  hideNavBar={false}
                  isShowLocation={false}
                  title="Contact Us"
                />
                <Scene
                  key={'aboutScreen'}
                  component={AboutScreen}
                  hideNavBar={false}
                  isShowLocation={false}
                  title="About Us"
                />
              </Scene>
            </Scene>

            <Scene key={'UploadPrescription'} component={UploadPrescription} />
            <Scene key={'pdfReport'} component={PdfReport} />
            <Scene key={'cancelBookingView'} component={CancelBookingView} />
            <Scene key={'QRScanner'} component={QRScanner} />
            <Scene key={'DashboardScreen'} component={DashboardScreen} />
            <Scene
              key={'notificationListScreen'}
              component={NotificationListScreen}
            />

            <Scene
              key={'viewProfileScreen'}
              component={ViewProfileScreen}
              hideNavBar={true}
              isShowNavBar={false}
            />
            <Scene
              key={'contactUsScreen'}
              component={ContactUsScreen}
              hideNavBar={false}
              isShowNavBar={true}
              title="Contact Us"
              navBar={NavBar}
            />

            <Scene
              key={'deliveryDetails'}
              component={DeliveryDetailsScreen}
              hideNavBar={false}
              isShowNavBar={true}
              title="Deliver Samples"
              navBar={NavBar}
            />

            <Scene
              key={'sampleCollectionDetail'}
              component={SampleCollectionDetail}
              hideNavBar={false}
              isShowNavBar={true}
              title="Bookings"
              navBar={NavBar}
            />
            <Scene
              key={'pendingDetailScreen'}
              component={PendingDetailScreen}
              hideNavBar={false}
              isShowNavBar={true}
              title="Bookings"
              navBar={NavBar}
            />
            <Scene
              key={'completedBookingDetailScreen'}
              component={CompletedBookingDetailScreen}
              hideNavBar={false}
              isShowNavBar={true}
              title="Bookings"
              navBar={NavBar}
            />
            <Scene
              key={'cancelBookingDetail'}
              component={cancelBookingDetail}
              hideNavBar={false}
              isShowNavBar={true}
              title="Bookings"
              navBar={NavBar}
            />

            <Scene
              key={'sampleCollectionSummary'}
              component={SampleCollectionSummary}
              hideNavBar={false}
              isShowNavBar={true}
              title="Sample Collections"
              type={ActionConst.RESET}
              navBar={NavBar}
            />
            <Scene
              key={'sampleCollectionScreen'}
              component={SampleCollectionScreen}
              hideNavBar={false}
              isShowNavBar={true}
              title="Sample Collections"
              type={ActionConst.RESET}
              navBar={NavBar}
            />
          </Scene>
        </Router>

        <View style={{position: 'absolute', top: 0, left: 0, right: 0}}>
          <OfflineNotice />
        </View>
      </SafeAreaView>
    );
  }
}

export default Main;

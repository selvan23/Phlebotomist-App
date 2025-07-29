/*************************************************
 * SukraasLIS
 * SplashScreen.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
  BackHandler,
  Alert,
} from 'react-native';
import RNExitApp from 'react-native-exit-app';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {checkNetworkConnection} from '../actions/NetworkAction';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import Spinner from 'react-native-spinkit';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {S3URL} from '../util/URL';
import OneSignal from 'react-native-onesignal';
let deviceCountry = DeviceInfo.getBuildNumber();
let androidStoreUrl =
  'https://play.google.com/store/apps/details?id=com.diagnofirm.phlebotomist';
let iosStoreUrl = 'https://apps.apple.com/in/app/castro/id440506317';

import {
  setCurrency,
  setUploadSize,
  configAPICall,
  setUserName,
  setProfileUploadSize,
  setCollectorOTPMandatory,
  setProfileImage,
  setCollectorCode,
  setDeviceInfo,
  setLoginConformation,
  setPhonepeUrl,
} from '../actions/ConfigAction';
import { navigate, navigationReplace } from '../rootNavigation';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const deviceWidth = Dimensions.get('window').width;

class SplashScreen extends Component {
  static propTypes = {
    isNetworkConnectivityAvailable: PropTypes.bool,
    checkNetworkConnection: PropTypes.func,
    showSpinner: PropTypes.func,
    isLoading: PropTypes.bool,
    errorMessage: PropTypes.string,

    configAPICall: PropTypes.func,

    setCurrency: PropTypes.func,
    setUploadSize: PropTypes.func,
    setProfileUploadSize: PropTypes.func,
    setCollectorOTPMandatory: PropTypes.func,
    setUserName: PropTypes.func,
    setCollectorCode: PropTypes.func,
    setDeviceInfo: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: 'false',
      isShowMaintenance: false,
      isOptionalUpdate: false,
      isForceUpdate: false,
    };
  }

  componentWillMount() {
    NetInfo.addEventListener((networkResponse) => {
      // this.props.setNetworkStatus(networkResponse.isConnected);
    });

    this.props.checkNetworkConnection((isSuccess, isNetwork) => {
      //URLs
      if (isSuccess === true) {
      }
    });

    setTimeout(async () => {
      let device_id = await DeviceInfo.getUniqueId();
      let device_type = Platform.OS === 'ios' ? 'iOS' : 'Android';
      let os_version = DeviceInfo.getSystemVersion();
      let app_version = DeviceInfo.getVersion();
      let device_info = DeviceInfo.getModel();

      let deviceInfoArray = {
        device_id: device_id,
        device_type: device_type,
        os_version: os_version,
        app_version: app_version,
        device_info: device_info,
      };
      console.log('Device Info', deviceInfoArray);
      this.props.setDeviceInfo(deviceInfoArray);

      if (this.props.isNetworkConnectivityAvailable) {
        this._getUrlFromConfig();
      } else {
        this._renderNoInternetAlert();
      }
    }, 100);
  }

  getMyObject = () => {
    this.props.checkNetworkConnection((isSuccess, isNetwork) => {
      //URLs
      if (isSuccess === true) {
        if (isNetwork) {
          this._getUrlFromConfig();
        } else {
          this._renderNoInternetAlert();
        }
      }
    });

    // this._callAppConfigAPI();
  };

  _callAppConfigAPI = () => {
    this.props.configAPICall((isSuccess, dataJSON) => {
      if (isSuccess) {
        this.props.setCurrency(dataJSON.Default_Currency);
        this.props.setUploadSize(dataJSON.Presc_Upload_File_Size);
        this.props.setProfileUploadSize(dataJSON.User_Profile_File_Size);
        this.props.setCollectorOTPMandatory(
          dataJSON.Collector_Otp_Verify_Mandatory,
        );
        this.props.setPhonepeUrl(dataJSON.FonePe_Payment_Url);
        this._settingDataFromAsync();
      }
    });
  };

  /**
   * Get app url from config
   */
  _getUrlFromConfig() {
    if (this.props.isNetworkConnectivityAvailable) {
      console.log('s3url ', S3URL);
      fetch(S3URL, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        },
      })
        .then((response) => {
          console.log('res ', response);
          return response.json();
        })
        .then((responseJson) => {
          console.log('response', responseJson);
          this._validate_Maintenance(responseJson);
        })
        .catch((error) => {
          console.log('erro ', error, JSON.stringify(error));
          Alert.alert(Constants.ALERT.WENT_WRONG + ' 001');
        });
    } else {
      this._renderNoInternetAlert();
    }
  }

  /**
   * Get app url from config
   */
  _validate_Maintenance(responseJson) {
    if (responseJson.mnt === 0) {
      AsyncStorage.configDetails = responseJson;
      this._checkVersionCompatibility();
    } else {
      this.setState({
        isShowLoading: false,
        isShowMaintenance: true,
      });
    }
  }

  _checkVersionCompatibility() {
    let appVersion = DeviceInfo.getVersion();
    let uri = AsyncStorage.configDetails.vr[appVersion];
    let latestVersion = AsyncStorage.configDetails.vr.lver;
    console.log('uri ', uri, appVersion, AsyncStorage.configDetails.vr)
    this._configureUri(uri);
    // if (AsyncStorage.configDetails.vru[appVersion]) {
    //   this.setState({isForceUpdate: true});
    // } else {
    //   this.setState({isForceUpdate: false});
    //   if (appVersion === latestVersion) {
    //     this.setState({isOptionalUpdate: false});
    //     this._configureUri(uri);
    //   } else {
    //     this.setState({isOptionalUpdate: true});
    //   }
    // }
  }

  _configureUri(uri = "0.0.1.json") {
    console.log('config init uri ', AsyncStorage.configDetails.vbu + uri);
    if (this.props.isNetworkConnectivityAvailable) {
      fetch(AsyncStorage.configDetails.vbu + uri, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseJson) => {
          console.log('config uri', responseJson);
          AsyncStorage.configUri = responseJson;
          setTimeout(() => {
            this._callAppConfigAPI();
          }, 100);
        })
        .catch((error) => {
          Alert.alert(Constants.ALERT.WENT_WRONG + ' 001');
        });
    } else {
      this._renderNoInternetAlert();
    }
  }

  _settingDataFromAsync = async () => {
    //Check for LOGIN SUCCESS
    const isLoggedInValue = await AsyncStorage.getItem(
      Constants.ASYNC.ASYNC_LOGIN_SUCCESS,
    );
    if (isLoggedInValue !== null) {
      this.setState({isLoggedIn: isLoggedInValue});
      if (isLoggedInValue === 'true') {
        this.props.setLoginConformation(true);
      } else {
        this.props.setLoginConformation(false);
      }

      //USER NAME
      const userName = await AsyncStorage.getItem(
        Constants.ASYNC.ASYNC_USER_NAME,
      );
      if (isLoggedInValue !== null) {
        this.props.setUserName(userName);
      } else {
        this.props.setUserName('');
      }
    } else {
      this.setState({isLoggedIn: 'false'});
      this.props.setLoginConformation(false);
    }

    //USER PROFILE IMAGE
    const url = await AsyncStorage.getItem(
      Constants.ASYNC.ASYNC_USER_IMAGE_URL,
    );

    if (url !== null) {
      this.props.setProfileImage(url);
    } else {
      this.props.setProfileImage('');
    }
    //Collector_Code
    const dataCcode = await AsyncStorage.getItem(
      Constants.ASYNC.ASYNC_COLLECTOR_CODE,
    );
    if (dataCcode !== null) {
      this.props.setCollectorCode(dataCcode);
    } else {
      this.props.setCollectorCode('');
    }
    if (this.state.isLoggedIn === 'true') {
      // Actions.homeTabBar();
      navigationReplace('homeTabBar');
      if (this.props.route.params.isFromNotification) {
        // Actions.pendingDetailScreen({
        //   rowData: this.props.route.params.notificationData,
        // });
        navigationReplace('pendingDetailScreen', {
          rowData: this.props.route.params.notificationData,
        });
      }
    } else {
      // Actions.LoginScreen();
      navigate('LoginScreen');
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  /**
   * Renders activity indicator when version api is being invoked
   */
  _renderAcitvityIndicator = () => {
    if (true) {
      return (
        <Spinner
          style={{marginTop: deviceHeight / 10}}
          isVisible={true}
          size={40}
          type={'Wave'}
          color={Constants.COLOR.THEME_COLOR}
        />
      );
    } else {
      return (
        <View style={{paddingTop: 100 * (2 / 5), alignItems: 'center'}}>
          <Text
            key={'0001'}
            style={{
              textAlign: 'center',
              fontSize: Constants.FONT_SIZE.M,
              // fontFamily: 'Lato-Medium',
            }}>
            {this.props.errorMessage}
          </Text>
          <TouchableOpacity
            style={{marginTop: deviceHeight / 40}}
            key={'0002'}
            onPress={() => {}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: Constants.FONT_SIZE.L,
                // fontFamily: 'Lato-Bold',
                color: Constants.COLOR.THEME_COLOR,
              }}>
              Tap to Reload
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  showMaintenanceAlert = () => {
    Alert.alert(
      '',
      `We are currently undergoing maintenance. This won't take long`,
      [
        {
          text: 'EXIT',
          onPress: () => {
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
              BackHandler.exitApp();
            } else {
              RNExitApp.exitApp();
              RNExitApp.exitApp();
            }
          },
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  /**
   * Renders Splash Screen Design
   */
  render() {
    if (this.state.isShowMaintenance) {
      return <View>{this.showMaintenanceAlert()}</View>;
      // <View style={styles.container}>
      //   <Image
      //     resizeMode={'contain'}
      //     source={require('../images/Splash_Logo.png')}
      //     style={styles.backgroundImage}
      //   />
      // </View>
    } else {
      return (
        <View style={styles.containerMain}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              source={require('../images/Splash_Logo_Phlebotomist.png')}
              style={styles.image}
            />
          </View>
          {this._renderAcitvityIndicator()}
          {this._renderScreenContent()}
        </View>
      );
    }
  }

  _renderScreenContent() {
    if (this.state.isForceUpdate) {
      return (
        <View style={styles.updateBackgroundView}>
          <View style={styles.updateView}>
            <Text style={styles.updateHeaderTxt}>New Version Available</Text>
            <Text style={styles.updateDescTxt}>
              There is a new version available for download! Please update the
              app
            </Text>
            <View style={styles.updateBtnView}>
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={async () =>
                  Linking.openURL(
                    Platform.OS === 'ios' ? iosStoreUrl : androidStoreUrl,
                  )
                }>
                <Text style={styles.btnTxt}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else if (this.state.isOptionalUpdate) {
      return (
        <View style={styles.updateBackgroundView}>
          <View style={styles.updateView}>
            <Text style={styles.updateHeaderTxt}>New Version Available</Text>
            <Text style={styles.updateDescTxt}>
              There is a new version available for download! Please update the
              app
            </Text>
            <View style={styles.updateBtnView}>
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={() => {
                  this.setState({isOptionalUpdate: false});
                  this._configureUri(
                    AsyncStorage.configDetails.vr[DeviceInfo.getVersion()],
                  );
                }}>
                <Text style={styles.noThanksBtnTxt}>No Thanks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={async () =>
                  Linking.openURL(
                    Platform.OS === 'ios' ? iosStoreUrl : androidStoreUrl,
                  )
                }>
                <Text style={styles.btnTxt}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  }

  _renderNoInternetAlert = () => {
    Alert.alert(
      Constants.ALERT.TITLE.NO_INTERNET,
      Constants.VALIDATION_MSG.NO_INTERNET,
      [
        {
          text: 'Ok',
          onPress: () => {
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
            } else {
              RNExitApp.exitApp();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    splashState: {isLoading, errorMessage},
    deviceState: {isNetworkConnectivityAvailable},
  } = state;

  return {
    isLoading,
    errorMessage,
    isNetworkConnectivityAvailable,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      checkNetworkConnection,
      setCurrency,
      setUploadSize,
      setUserName,
      configAPICall,
      setProfileUploadSize,
      setCollectorOTPMandatory,
      setProfileImage,
      setCollectorCode,
      setDeviceInfo,
      setLoginConformation,
      setPhonepeUrl,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

// define your styles
const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    height: deviceHeight,
    width: deviceWidth,
    resizeMode: 'cover', // or 'stretch'
  },
  imageContainer: {
    alignItems: 'center',
  },
  updateBackgroundView: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  updateView: {
    backgroundColor: 'white',
    margin: 40,
    borderRadius: 10,
  },
  updateHeaderTxt: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: deviceWidth / 20,
    textAlign: 'center',
    padding: 10,
  },
  updateDescTxt: {
    color: Constants.COLOR.TEXT_GRAY_COLOR,
    fontSize: deviceWidth / 25,
    textAlign: 'center',
    padding: 10,
    paddingTop: 0,
  },
  updateBtnView: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Constants.COLOR.LIGHT_GRAY_COLOR,
  },
  btnTxt: {
    color: Constants.COLOR.THEME,
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: deviceWidth / 22,
  },
  updateBtn: {
    padding: 10,
    flex: 1,
  },
  noThanksBtnTxt: {
    color: 'black',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: deviceWidth / 22,
  },
});

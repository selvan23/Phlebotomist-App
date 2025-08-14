/*************************************************
 * SukraasLIS
 * @exports
 * @class SOSScreen.js
 * @extends Component
 * Created by Sankar on 18/09/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import LoadingScreen from './common/LoadingScreen';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import store from '../store'
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateSOSAlert, showSosLoading, hideSosLoading } from '../actions/SosAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class SOSScreen extends Component {
  static propTypes = {
    isSosLoading: PropTypes.bool,
    collectorCode: PropTypes.string,
    updateSOSAlert: PropTypes.func,
    showSosLoading: PropTypes.func,
    hideSosLoading: PropTypes.func,
  };

  constructor(props) {
    super(props)
    this.state = {
      formatAddress: '',
      latitude: '',
      longitude: '',
      isYesButtonClicked: false,
      isNoButtonClicked: false,
    }
  }

  enableLocationAlert() {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Constants.ALERT.MESSAGE.ENABLE_LOCATION,
      [
        {
          text: Constants.ALERT.BTN.YES,
          onPress: () => {
            Linking.openURL('app-settings:');
          },
        },
        { text: Constants.ALERT.BTN.NO, onPress: () => { } },
      ],
      { cancelable: false },
    );
  }

  enableLocationPermissionAlert(Message) {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => { },
        },
       
      ],
      { cancelable: false },
    );
  }

  internetAlert(Message, isClose) {
    Alert.alert(
      Constants.ALERT.TITLE.FAILED,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => {
            if (isClose) {
              this.props.navigation.goBack(); 
            }
          },
        },
      ],
      { cancelable: false },
    );
  }

  componentDidMount() {
    //Init Geocoder with Api key...
    Geocoder?.init('AIzaSyC5NYjd063ybuLVcVreJ7Up9PSH1q8CHdA', {
      language: 'en',
    });
  }

  render() {
    if (this.props.isSosLoading) {
      return this._screenLoading()
    } else {
      return this._renderBodyView();
    }
  }

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderBodyView = () => {
    return (
      <View style={styles.mainContainer}>
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack(null)}
        >
          <Image
            style={styles.headerRightImage}
            resizeMode="contain"
            source={require('../images/black_cross.png')}
          />
        </TouchableOpacity>

        <View style={styles.innerContainer}>
          <Text style={styles.startText}> SOS ALERT </Text>

          <Text style={styles.centerText}>
            Are you sure you want to send an emergency alert message to our
            Customer Service?
          </Text>

          <TouchableOpacity
            disabled={this.state.isYesButtonClicked}
            style={styles.yesButton}
            onPress={() => this._onPressLocateMe()}>
            <Text style={styles.buttonText}> Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={this.state.isNoButtonClicked}
            style={styles.noButton}
            onPress={() => {
              this.setState({ isNoButtonClicked: true });
              this.props.navigation.goBack();
              setTimeout(() => {
                this.setState({ isNoButtonClicked: false });
              }, 2000);
            }}>
            <Text style={styles.buttonText}> No </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _onPressLocateMe = async () => {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      if (this.props.isLocationEnable) {
        this.setState({ isYesButtonClicked: true });

        try {
          if (Platform.OS === 'android') {
            promptForEnableLocationIfNeeded({
              interval: 10000,
              fastInterval: 5000,
            });
          } else {
            Geolocation.requestAuthorization();
          }
          await this._getCurrentLocationHandler();
        } catch (err) {
          console.error('Location enabling error:', err);
          Utility.showSnackBar(this.props.locationAlert);
        } finally {
          setTimeout(() => {
            this.setState({ isYesButtonClicked: false });
          }, 2000);
        }
      } else {
        Utility.showSnackBar(this.props.locationAlert);
      }
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET, false);
    }
  };

  _getCurrentLocationHandler = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: false,
            timeout: 200000,
            maximumAge: 10000,
          },
        );
      });
      this.props.showSosLoading();
      await this.getAddress(position.coords.latitude, position.coords.longitude);
    } catch (err) {
      console.error('Error getting location or address:', err);
      this.props.hideSosLoading();

      if (Platform.OS === 'ios' && err.code === 2) {
        this.enableLocationAlert();
      }
    }
  };

  getAddress = async (lat, lng) => {
    const apiKey = 'AIzaSyCR_Jh0VwkkEprAsYZb-g0FFTzpcNff_5c';
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(geocodeUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const responseJson = await response.json();

      if (responseJson.results && responseJson.results.length > 0) {
        const formattedAddress = responseJson.results[0].formatted_address;

        this.setState({
          formatAddress: formattedAddress,
          latitude: lat.toString(),
          longitude: lng.toString(),
        });

        if (formattedAddress) {
          const postData = {
            Collector_Code: this.props.collectorCode,
            Latitude: lat.toString(),
            Longitude: lng.toString(),
            Full_Address: formattedAddress,
          };

          this.props.updateSOSAlert(postData, async (isSuccess, responseData) => {
            if (isSuccess) {
              const configUri = await AsyncStorage.getItem('configUri');
              if (!configUri) {
                throw new Error('Config URI not found in AsyncStorage');
              }

              const parsedConfigUri = JSON.parse(configUri);
              const smsLinkTemplate = parsedConfigUri.sm_gw_li;
              const smsLink = smsLinkTemplate
                .replace('XXXMOBILE_NOXXX', encodeURIComponent(responseData.Alert_Receive_Numbers))
                .replace('XXXMESSAGEXXX', encodeURIComponent(responseData.Alert_Content));

              const smsResponse = await fetch(smsLink, { method: 'GET' });
              if (!smsResponse.ok) {
                throw new Error('Network response was not ok ' + smsResponse.statusText);
              }

              const smsResponseJson = await smsResponse.json();
            } else {
              console.error('Update SOS Alert failed');
            }
          });
        }

      } else {
        this.setState({
          formatAddress: '',
          latitude: lat.toString(),
          longitude: lng.toString(),
        });
      }

    } catch (error) {
      console.error('Error in getAddress:', error);
      this.props.hideSosLoading();
      Utility.showAlert(
        Constants.ALERT.TITLE.FAILED,
        Constants.VALIDATION_MSG.ADDRESS_ALERT,
      );
    }
  };

}
const mapStateToProps = (state, props) => {
  const {
    sosState: { isSosLoading },
    configState: { collectorCode },
    deviceState: { isLocationEnable, locationAlert}

  } = state;

  return {
    isSosLoading,
    collectorCode,
    isLocationEnable,
    locationAlert
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { updateSOSAlert, showSosLoading, hideSosLoading },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SOSScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#eef3fd',
    padding: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  innerContainer: {
    backgroundColor: '#e1ebf9',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 5,
    marginVertical: 40,
  },

  startText: {
    color: 'black',
    fontSize: Constants.FONT_SIZE.XXXL,
    paddingTop: 25,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_SEMI_BOLD,
  },

  centerText: {
    color: 'black',
    fontSize: Constants.FONT_SIZE.M,
    paddingTop: 50,
    marginHorizontal: 10,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_LIGHT,
  },

  yesButton: {
    backgroundColor: '#58afff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: deviceWidth / 1.3,
    marginTop: 50,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 1.0,
    elevation: 6,
    shadowRadius: 15,
  },

  noButton: {
    backgroundColor: '#fc464f',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: deviceWidth / 1.3,
    marginTop: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 1.0,
    elevation: 6,
    shadowRadius: 15,
  },

  buttonText: {
    fontSize: Constants.FONT_SIZE.L,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_LIGHT,
  },

  headerRightImage: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: deviceHeight / 40,
    height: deviceHeight / 40,
    marginTop: 10,
    marginRight: 15,
  },
});

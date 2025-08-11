import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  View,
  ImageBackground,
  Platform,
  BackHandler,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constants, {ACTIONS} from '../util/Constants';
import Utility from '../util/Utility';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {verifyOTPSubmit, verifyOTPResend} from '../actions/VerificationAction';
import LoadingScreen from './common/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { nativationPop } from '../rootNavigation';
import CustomInput from './common/CustomInput';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class VerificationScreen extends Component {
  static propTypes = {
    isVerificationLoading: PropTypes.bool,
    verifyOTPSubmit: PropTypes.func,
    verifyOTPResend: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      userName: '',
      otp: '',
      isResetPassword: this.props.route.params.isResetPassword,
      isOTPGenerated: this.props.route.params.isResetPassword === true ? false : true,
    };
  }

  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    if (this.props.isVerificationLoading) {
      return this._screenLoading();
    } else {
      if (Platform.OS === 'ios') {
        return this._renderVerificationMainViewIos();
      } else {
        return this._renderVerificationMainViewAndroid();
      }
    }
  };
  _renderVerificationMainViewIos = () => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        {this._renderSwipeBackGesture()}
      </SafeAreaView>
    );
  };
  _renderSwipeBackGesture = () => {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    if (this.state.isOTPGenerated === false) {
      return (
        <GestureRecognizer
          onSwipe={(direction) => this.onSwipe(direction)}
          config={config}
          style={{flex: 1}}>
          <KeyboardAwareScrollView enableOnAndroid={true}>
            <View style={styles.bodyContainerTop}>
              <View style={styles.titleView}>
                {this._renderBackButton()}
                <Text style={styles.title}>Reset Password </Text>
              </View>
            </View>
            <View
              style={[
                styles.bodyContainerBottom,
                this.state.isOTPGenerated ? {height: 500} : {height: 400},
              ]}></View>
            {this._renderVerificationView()}
          </KeyboardAwareScrollView>
        </GestureRecognizer>
      );
    } else {
      return (
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.bodyContainerTop}>
            <View style={styles.titleView}>
              {this._renderBackButton()}
              <Text style={styles.title}>Reset Password </Text>
            </View>
          </View>
          <View
            style={[
              styles.bodyContainerBottom,
              this.state.isOTPGenerated ? {height: 500} : {height: 400},
            ]}></View>
          {this._renderVerificationView()}
        </KeyboardAwareScrollView>
      );
    }
  };
  _renderVerificationMainViewAndroid = () => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.bodyContainerTop}>
            <View style={styles.titleView}>
              {this._renderBackButton()}
              <Text style={styles.title}>Reset Password </Text>
            </View>
          </View>
          <View
            style={[
              styles.bodyContainerBottom,
              this.state.isOTPGenerated ? {height: 520} : {height: 400},
            ]}></View>
          {this._renderVerificationView()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  };

  _renderBackButton = () => {
    if (this.state.isOTPGenerated) {
      return null;
    } else {
      return (
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => {
            // Actions.pop();
            nativationPop();
          }}>
          <Image
            resizeMode="contain"
            source={require('../images/backArrowBlack.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>
      );
    }
  };

  _renderVerificationView = () => {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginInnerView}>
          <View style={{marginHorizontal: 10}}>
            <Image
              resizeMode="contain"
              source={require('../images/Phlebotomist_Logo.png')}
              style={styles.image}
            />
            <Text style={styles.placeholder}>Username</Text>
            <CustomInput
              placeholder={'Enter the Username'}
              value={this.state.userName}
              onChangeText={(userName) => this.setState({ userName })}
              selectedLanguage={'en'}
            />
            <Text style={styles.placeholder}>Mobile Number</Text>
            <CustomInput
              placeholder={'Enter the Mobile Number'}
              value={this.state.phoneNumber}
              onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
              selectedLanguage={'en'}
              keyboardType="number-pad"
            />
            {this._renderOtpView()}
            {this._renderButtonView()}
            {this._renderLinkView()}
          </View>
        </View>
      </View>
    );
  };

  onSwipe = (directions) => {
    console.log('swipe', directions);
    console.log('SWIPE DIRECTIONS', swipeDirections);
    if (directions === 'SWIPE_RIGHT') {
      // Actions.pop();
      nativationPop();
    }
  };
  _setTitle = () => {
    return <Text style={styles.title}>Reset Password</Text>;
  };

  _renderOtpView = () => {
    if (this.state.isOTPGenerated) {
      {
        Platform.OS === 'android'
          ? BackHandler.addEventListener(
              'hardwareBackPress',
              this.onHandleBackButton,
            )
          : null;
      }
      return (
        <View>
          <Text style={styles.placeholder}>Enter OTP</Text>
          <TextInput
            style={styles.inputs}
            placeholder="Enter OTP"
            placeholderTextColor={Constants.COLOR.FONT_HINT}
            keyboardType="numeric"
            autoCapitalize={'none'}
            returnKeyType={'done'}
            maxLength={4}
            underlineColorAndroid="transparent"
            onChangeText={(otp) => {
              const numericValue = otp.replace(/[^0-9]/g, "");
              if (numericValue === otp) {
                this.setState({ otp: numericValue });
              }
            }}
            onSubmitEditing={() => {
              this._validateInputs();
            }}
          />
          <TouchableOpacity
            style={styles.linkView}
            onPress={() => {
              this._resendOTP({isResent: true});
            }}>
            <Text style={styles.link}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  _renderButtonView = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this._validateInputs();
        }}>
        <Text style={styles.button}>
          {/* {this.state.isResetPassword === true ? (<Text>Reset</Text>) : (<Text>Verify</Text>)} */}
          {this.state.isResetPassword === true ? (
            this.state.isOTPGenerated === true ? (
              <Text>Reset</Text>
            ) : (
              <Text>Get OTP</Text>
            )
          ) : (
            <Text>Verify</Text>
          )}
        </Text>
      </TouchableOpacity>
    );
  };

  _renderLinkView = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          // Actions.pop();
          nativationPop();
        }}>
        <Text style={styles.linkRegister}>Back to Login</Text>
      </TouchableOpacity>
    );
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _validateInputs() {
    let a = this.state.userName.trim().length < 3;
    let b = this.state.userName.trim().length > 15;
    if (this.state.userName.trim().length < 3) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.USER_NAME_ERROR,
      );
    } else if (this.state.userName.trim().length > 20) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.USER_NAME_ERROR,
      );
    } else if (this.state.phoneNumber.trim().length < 8) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_MOBILE_NO,
      );
    } else if (this.state.phoneNumber.trim().length > 15) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_MOBILE_NO,
      );
    } else if (
      this.state.isOTPGenerated === true
        ? this.state.otp.trim().length < 3
        : false
    ) {
      // } else if (this.state.otp.trim().length < 3 || !this.state.isOTPGenerated) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_OTP,
      );
    } else {
      this.state.isOTPGenerated === true
        ? this._submitButtonClick()
        : this._resendOTP({isResent: false});
    }
  }

  _submitButtonClick() {
    this.props.verifyOTPSubmit(
      this.state.userName,
      this.state.phoneNumber,
      this.state.otp,
    );
  }
  _resendOTP(isResent) {
    console.log('this.state.userName', this.state.userName);
    this.props.verifyOTPResend(
      this.state.phoneNumber,
      this.state.userName,
      isResent,
      (isSuccess, message) => {
        if (isSuccess === true) {
          this.setState({isOTPGenerated: true});
          let smsLink = AsyncStorage.configUri.sm_gw_li
            .replace('$MOBILE_NO$', this.state.phoneNumber)
            .replace('$MESSAGE$', message);

          fetch(smsLink, {
            method: 'GET',
          })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(smsLink);
              console.log(responseJson);
            })
            //If response is not in json then in error
            .catch((error) => {
              console.error(error);
            });
        }
      },
    );
  }
  onHandleBackButton = () => {
    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onHandleBackButton,
    );
  }
}

const mapStateToProps = (state, props) => {
  const {
    verificationState: {isVerificationLoading},
  } = state;

  return {
    isVerificationLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      verifyOTPSubmit,
      verifyOTPResend,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(VerificationScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  bodyContainerTop: {
    height: deviceHeight / 3,
    backgroundColor: Constants.COLOR.THEME_COLOR,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  bodyContainerBottom: {
    backgroundColor: '#fefefe',
    height: 400,
  },
  loginContainer: {
    position: 'absolute',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    top: 80,
    left: 20,
    right: 20,
    bottom: 20,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1.0,
    elevation: 6,
  },
  loginInnerView: {
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 40,
  },
  titleView: {
    flexDirection: 'row',
    margin: 20,
  },
  title: {
    fontSize: Constants.FONT_SIZE.XXL,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 10,
    fontSize: Constants.FONT_SIZE.SM,
    color: '#404040',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  inputs: {
    height: 50,
    marginLeft: 0,
    marginRight: 0,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    overflow: 'hidden',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    color: 'black',
    fontSize: Constants.FONT_SIZE.SM,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: Constants.FONT_SIZE.L,
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: Constants.COLOR.THEME_COLOR,
    borderColor: Constants.COLOR.THEME_COLOR,
    width: '100%',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 15,
    borderBottomWidth: 0,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  image: {
    marginTop: 0,
    marginBottom: 30,
    alignSelf: 'center',
    width: deviceHeight * (8 / 10),
    height: deviceHeight * (4 / 28),
  },
  link: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    marginVertical: 5,
  },
  linkView: {
    alignItems: 'flex-end',
  },
  backImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  linkRegister: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    marginVertical: 10,
  },
});

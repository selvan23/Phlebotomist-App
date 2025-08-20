import React, { Component } from "react";
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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "../util/Constants";
import Utility from "../util/Utility";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import LoadingScreen from "./common/LoadingScreen";
import { loginOnSubmit } from "../actions/LoginAction";
import {
  setProfileUploadSize,
  setUploadSize,
  setProfileImage,
  setCollectorCode,
  setUserName,
  setLoginConformation,
} from "../actions/ConfigAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate, navigationRef, navigationReplace } from "../rootNavigation";
import CustomInput from "./common/CustomInput";

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;

let currentScene = "LoginScreen";
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { userName: "", password: "", oneSignalId: "", showPassword: false };
  }

  static propTypes = {
    isNetworkConnectivityAvailable: PropTypes.bool,
    isLoginLoading: PropTypes.bool,
    deviceInfoData: PropTypes.object,
    oneSignalId: PropTypes.string,

    loginOnSubmit: PropTypes.func,
    setProfileUploadSize: PropTypes.func,
    setUploadSize: PropTypes.func,

    setProfileImage: PropTypes.func,
    setUserName: PropTypes.func,
    setCollectorCode: PropTypes.func,
    setLoginConformation: PropTypes.func,
  };

  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    if (this.props.isLoginLoading) {
      return this._screenLoading();
    } else {
      return this._renderLoginMainView();
    }
  };

  _renderLoginMainView = () => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View style={styles.bodyContainerTop}>
            <View style={styles.titleView}>
              <Text style={styles.title}>Login </Text>
            </View>
          </View>
          <View style={styles.bodyContainerBottom}></View>
          {this._renderLoginView()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  };

  _renderLoginView = () => {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginInnerView}>
          <View style={{ marginHorizontal: 10 }}>
            <Image
              resizeMode="contain"
              source={require("../images/Logo.png")}
              style={styles.image}
            />
            <Text style={styles.placeholder}>Username</Text>
            <CustomInput
              placeholder={'Enter the Username'}
              value={this.state.userName}
              onChangeText={(userName) => this.setState({ userName })}
              selectedLanguage={'en'}
              icon={'user'}
            />
            <Text style={styles.placeholder}>Password</Text>
            <CustomInput
              placeholder={'Enter the Password'}
              value={this.state.password}
              onChangeText={(password) => this.setState({ password })}
              secureTextEntry={!this.state.showPassword}
              showPassword={this.state.showPassword}
              setShowPassword={(show) => {
                console.log({show})
                this.setState({showPassword: show})}}
              selectedLanguage={'en'}
              icon={'lock'}
            />
            <TouchableOpacity
              style={styles.linkView}
              onPress={() => {
                this._forgotPassword();
              }}
            >
              <Text style={styles.link}>Forgot Password ?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this._validateInputs();
              }}
            >
              <Text style={styles.button}>Login</Text>
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.version}>Version: 1.1.0</Text>
              <Text style={styles.version}>Powered by SUKRAA</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _validateInputs() {
    if (this.state.userName.trim().length < 1) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.LOGIN_VALIDATION
      );
    } else if (this.state.password.trim().length < 1) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.LOGIN_VALIDATION
      );
    } else {
      this._submitClick();
    }
  }

  _submitClick() {
    const { userName, password } = this.state;
    let dicLoginInfo = {
      username: userName,
      password: password,
      Device_ID: this.props.deviceInfoData.device_id,
      Token_ID: this.props.oneSignalId,
      OS_Type: this.props.deviceInfoData.os_version,
      Device_Type: this.props.deviceInfoData.device_type,
      Model_Type: this.props.deviceInfoData.device_info,
      App_Version: this.props.deviceInfoData.app_version,
    };
    this.props.loginOnSubmit(dicLoginInfo, (isSuccess, response) => {
      if (isSuccess === true) {
        this.props.setProfileImage(response.Collector_Profile_Image_Url);
        this.props.setUserName(response.UserName);
        this.props.setCollectorCode(response.Collector_Code);
        this.props.setLoginConformation(true);
        AsyncStorage.setItem(
          Constants.ASYNC.ASYNC_USER_NAME,
          this.state.userName
        );
        AsyncStorage.setItem(
          Constants.ASYNC.ASYNC_PASSWORD,
          this.state.password
        );
        AsyncStorage.setItem(Constants.ASYNC.ASYNC_LOGIN_SUCCESS, "true");
        AsyncStorage.setItem(
          Constants.ASYNC.ASYNC_USER_IMAGE_URL,
          response.Collector_Profile_Image_Url
        );
        AsyncStorage.setItem(
          Constants.ASYNC.ASYNC_COLLECTOR_CODE,
          response.Collector_Code
        );
        // Actions.homeTabBar();
        navigationReplace("homeTabBar");
      } else {
        this.props.setLoginConformation(false);
        // Actions.LoginScreen();
        navigationReplace("LoginScreen");
      }
    });
  }
  _forgotPassword() {
    // if (Actions.currentScene === currentScene) {
    if (navigationRef.getCurrentRoute().name === currentScene) {
      // Actions.VerificationScreen({
      //   isResetPassword: true,
      // });
      navigate("VerificationScreen", {
        isResetPassword: true,
      });
    }
  }
  _navigateRegistrationScreen() {
    // Actions.RegisterScreen();
    navigate("RegisterScreen");
  }
}

const mapStateToProps = (state, props) => {
  const {
    loginState: { isLoginLoading },
    deviceState: { isNetworkConnectivityAvailable },
    configState: { deviceInfoData },
    splashState: { oneSignalId },
  } = state;

  return {
    isLoginLoading,
    isNetworkConnectivityAvailable,
    deviceInfoData,
    oneSignalId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      loginOnSubmit,
      setProfileUploadSize,
      setUploadSize,
      setProfileImage,
      setUserName,
      setCollectorCode,
      setLoginConformation,
      // setFirmName,
      // setFirmNo,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  bodyContainerTop: {
    height: deviceHeight / 3,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  bodyContainerBottom: {
    backgroundColor: "#fefefe",
    height: 400,
  },
  loginContainer: {
    position: "absolute",
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    top: 80,
    left: 20,
    right: 20,
    bottom: 20,
    borderRadius: 10,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1.0,
    elevation: 6,
  },
  loginInnerView: {
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 40,
  },
  title: {
    fontSize: Constants.FONT_SIZE.XXL,
    color: "black",
    textAlign: "center",
    flex: 1,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_BOLD,
  },
  placeholder: {
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 10,
    fontSize: Constants.FONT_SIZE.SM,
    color: "#404040",
    textAlign: "left",
    fontWeight: "bold",
  },
  inputs: {
    height: 50,
    marginLeft: 0,
    marginRight: 0,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#e0e0e0",
    borderRadius: 25,
    overflow: "hidden",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    color: "black",
    fontSize: Constants.FONT_SIZE.SM,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    textAlign: "center",
    fontSize: Constants.FONT_SIZE.L,
    color: "white",
    fontWeight: "bold",
    backgroundColor: Constants.COLOR.THEME_COLOR,
    borderColor: Constants.COLOR.THEME_COLOR,
    width: "100%",
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 15,
    borderBottomWidth: 0,
    alignSelf: "center",
    overflow: "hidden",
  },
  image: {
    marginTop: 0,
    marginBottom: 20,
    alignSelf: "center",
    width: deviceHeight * (7 / 10),
    height: deviceHeight * (4 / 28),
  },
  linkView: {
    alignItems: "flex-end",
  },
  link: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: "right",
    marginVertical: 10,
  },
  linkRegister: {
    fontSize: Constants.FONT_SIZE.SM,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 0,
    marginRight: 0,
  },
  titleView: {
    flexDirection: "row",
    margin: 20,
  },
  version: {
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: "center",
    marginVertical: 5,
  },
});

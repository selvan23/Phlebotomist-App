/*************************************************
 * SukraasLIS
 * @exports
 * @class SettingsScreen.js
 * @extends Component
 * Created by Monisha on 20/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

"use strict";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "../../util/Constants";
import Utility from "../../util/Utility";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearAllStates } from "../../actions/LogoutAction";
import PropTypes from "prop-types";
import store from "../../store";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  navigate,
  navigationRef,
  navigationReset,
  navigationSetParams,
} from "../../rootNavigation";
import { IconOutline } from "@ant-design/icons-react-native";
import CustomAlert from "../common/CustomAlert";
import CustomeAlertLogout from "../common/CustomeAlertLogout";

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;
// const deviceWidth = Dimensions.get('window').width;
const currentScene = "SettingsTab";

const clearAppData = async function () {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    // Actions.splashScreen();
    // navigate('splashScreen');
    navigationReset({
      index: 0,
      routes: [
        {
          name: "splashScreen",
        },
      ],
    });
  } catch (error) {
    console.log("Error clearing app data.", error);
  }
};

class SettingsScreen extends Component {
  static propTypes = {
    clearAllStates: PropTypes.func,
  };

  internetAlert(Message) {
    Alert.alert(
      Constants.ALERT.TITLE.FAILED,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  }

  logoutButtonClicked() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.props.dispatch({
        type: Constants.ACTIONS.SHOW_LOG_OUT_CUSTOM_ALERT,
        payload: {
          title: 'Logout',
          message: Constants.ALERT.MESSAGE.LOGOUT_MESSAGE,
        },
      });
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <TouchableOpacity
            style={[styles.subContainer, { marginTop: 15 }]}
            onPress={() => {
              // if (Actions.currentScene === currentScene) {
              if (navigationRef.getCurrentRoute().name === currentScene) {
                // Actions.viewProfileScreen();
                navigate("viewProfileScreen");
              }
            }}
          >
            <View style={[styles.contentViewContainer]}>
              <View
                style={[
                  styles.profileImageView,
                  { backgroundColor: Constants.COLOR.LIGHT_BACKGROUND_COLOR },
                ]}
              >
                <IconOutline size={deviceHeight/30} name="user" color={Constants.COLOR.PRIMARY_COLOR} />
              </View>
              <Text style={[styles.textStyle]}>View Profile</Text>
              <IconOutline name="right" size={deviceHeight/30} color={Constants.COLOR.BLACK_COLOR} />
              </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subContainer}
            onPress={() => {
              // if (Actions.currentScene === currentScene) {
              if (navigationRef.getCurrentRoute().name === currentScene) {
                // Actions.aboutScreen();
                navigate("aboutScreen");
              }
            }}
          >
            <View style={[styles.contentViewContainer]}>
              <View
                style={[
                  styles.profileImageView,
                  { backgroundColor: Constants.COLOR.LIGHT_BACKGROUND_COLOR },
                ]}
              >
                <IconOutline size={deviceHeight/30} name="info" color={Constants.COLOR.PRIMARY_COLOR} />
              </View>
              <Text style={[styles.textStyle]}>About Us</Text>
              <IconOutline name="right" size={deviceHeight/30} color={Constants.COLOR.BLACK_COLOR} />
              </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subContainer}
            onPress={() => {
              if (navigationRef.getCurrentRoute().name === currentScene) {
                // if (Actions.currentScene === currentScene) {
                // Actions.contactUsScreen();
                navigate("contactUsScreen");
              }
            }}
          >
            <View style={[styles.contentViewContainer]}>
              <View
                style={[
                  styles.profileImageView,
                  { backgroundColor: Constants.COLOR.LIGHT_BACKGROUND_COLOR },
                ]}
              >
                <IconOutline size={deviceHeight/30} name="customer-service" color={Constants.COLOR.PRIMARY_COLOR} />
              </View>
              <Text style={[styles.textStyle]}>Contact Us</Text>
              <IconOutline name="right" size={deviceHeight/30} color={Constants.COLOR.BLACK_COLOR} />
              </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subContainer}
            onPress={() => this.logoutButtonClicked()}
          >
            <View style={[styles.contentViewContainer]}>
              <View
                style={[
                  styles.profileImageView,
                  { backgroundColor: Constants.COLOR.LIGHT_BACKGROUND_COLOR },
                ]}
              >
                <IconOutline size={deviceHeight/30} name="logout" color={Constants.COLOR.PRIMARY_COLOR} />
              </View>
              <Text style={[styles.textStyle]}>Logout</Text>
                <IconOutline name="right" size={deviceHeight/30} color={Constants.COLOR.BLACK_COLOR} />
              </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        <CustomeAlertLogout
          visible={!!this.props.customLogAlert}
          title={this.props.customLogAlert?.title}
          message={this.props.customLogAlert?.message}
          buttons={[
            {
              text: Constants.ALERT.BTN.NO,
              onPress: () => {
                this.props.dispatch({
                  type: Constants.ACTIONS.HIDE_LOG_OUT_CUSTOM_ALERT,
                });
              },
            },
            {
              text: Constants.ALERT.BTN.YES,
              onPress: () => {
                this.props.clearAllStates();
                clearAppData();
                this.props.dispatch({
                  type: Constants.ACTIONS.HIDE_LOG_OUT_CUSTOM_ALERT,
                });
              },
            },
          ]}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  const {
    deviceState: { customLogAlert },

  } = state;

  return {
    customLogAlert
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        clearAllStates,
      },
      dispatch
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  subContainer: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    flexDirection: "row",
  },
  avatar: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  profileImageView: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  contentViewContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: Constants.FONT_SIZE.L,
    color: Constants.COLOR.BLACK_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
});

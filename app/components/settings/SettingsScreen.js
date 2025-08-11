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
      Alert.alert(
        Constants.ALERT.TITLE.INFO,
        Constants.ALERT.MESSAGE.LOGOUT_MESSAGE,
        [
          {
            text: Constants.ALERT.BTN.YES,
            onPress: () => {
              // navigationSetParams({
              //   action: "logout",
              // });
              this.props.clearAllStates();
              clearAppData();
            },
          },
          { text: Constants.ALERT.BTN.NO, onPress: () => {} },
        ],
        { cancelable: false }
      );
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
                  { backgroundColor: "#1E564A" },
                ]}
              >
                <Image
                  style={[styles.avatar, {}]}
                  resizeMode="contain"
                  source={require("../../images/user1.png")}
                />
              </View>
              <Text style={[styles.textStyle]}>View Profile</Text>
              <Image
                style={[styles.avatar]}
                resizeMode="contain"
                source={require("../../images/rightArrow.png")}
              />
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
                  { backgroundColor: "#172073" },
                ]}
              >
                <Image
                  style={[styles.avatar, {}]}
                  resizeMode="contain"
                  source={require("../../images/info.png")}
                />
              </View>
              <Text style={[styles.textStyle]}>About Us</Text>
              <Image
                style={[styles.avatar]}
                resizeMode="contain"
                source={require("../../images/rightArrow.png")}
              />
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
                  { backgroundColor: "#EF9724" },
                ]}
              >
                <Image
                  style={[styles.avatar, {}]}
                  resizeMode="contain"
                  source={require("../../images/phone1.png")}
                />
              </View>
              <Text style={[styles.textStyle]}>Contact Us</Text>
              <Image
                style={[styles.avatar]}
                resizeMode="contain"
                source={require("../../images/rightArrow.png")}
              />
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
                  { backgroundColor: "#E92E40" },
                ]}
              >
                <Image
                  style={[styles.avatar, {}]}
                  resizeMode="contain"
                  source={require("../../images/sign-out.png")}
                />
              </View>
              <Text style={[styles.textStyle]}>Logout</Text>
              <Image
                style={[styles.avatar]}
                resizeMode="contain"
                source={require("../../images/rightArrow.png")}
              />
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  const {} = state;

  return {};
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      clearAllStates,
    },
    dispatch
  );
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
    color: "black",
  },
});

import React, { Component } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Utility from "../../util/Utility";
import Constants from "../../util/Constants";
import { getNotificationCount } from "../../actions/NotificationAction";

import store from "../../store";
import { navigate } from "../../rootNavigation";

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get("window").height;

const deviceWidth = Dimensions.get("window").width;

// let currentScene = 'pendingScreen';
class NavigationBar extends Component {
  static propTypes = {
    userName: PropTypes.string,
    userImageURL: PropTypes.string,
    isNotificationListLoading: PropTypes.bool,
    count: PropTypes.string,
    getNotificationCount: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // if (store.getState().deviceState.isNetworkConnectivityAvailable) {
    //   // this.getNotificationCountAPI();
    //   if (this.timer === undefined) {
    //     this.timer = setInterval(
    //       () => this.getNotificationCountAPI(),
    //       1000 * 30,
    //     );
    //   } else {
    //     clearInterval(this.timer);
    //   }
    // }
  }

  componentWillUnmount() {
    // clearInterval(this.timer);
  }

  async getNotificationCountAPI() {
    // this.props.getNotificationCount(this.props.userName);
  }

  render() {
    return (
      <View
        style={{ backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN }}
      >
        {this.props.isShowNavBar == true ? (
          <View style={styles.container}>
            <View style={styles.leftView}>
              <Text style={styles.headingText}>{this.props.title}</Text>
            </View>
            {this.props.isHideImages == true ? null : (
              <View style={styles.rightView}>
                <TouchableOpacity
                  onPress={() => {
                    this._navigateSOSScreen();
                  }}
                >
                  <Image
                    style={[
                      styles.headerRightImage,
                      {
                        width: deviceHeight / 25,
                        height: deviceHeight / 25,
                        marginBottom: 8,
                      },
                    ]}
                    source={require("../../images/alarm.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // Actions.pdfReport({pdf: this.props.phonepeUrl});
                    navigate("pdfReport", {
                      pdf: this.props.phonepeUrl,
                    });
                  }}
                >
                  <Image
                    style={[
                      styles.headerRightImage,
                      {
                        width: deviceHeight / 25,
                        height: deviceHeight / 25,
                      },
                    ]}
                    source={{
                      uri: this.props.phonepeUrl,
                    }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this._navigateNotificationScreen();
                  }}
                >
                  <View>
                    <Image
                      style={[
                        styles.headerRightImage,
                        { width: deviceHeight / 30, height: deviceHeight / 30 },
                      ]}
                      source={require("../../images/bellwhite.png")}
                    />
                    {this._renderNotificationCount()}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this._navigateProfileScreen();
                  }}
                >
                  {this._showProfileIcon()}
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null}
      </View>
    );
  }

  _renderNotificationCount = () => {
    if (
      this.props.count !== undefined &&
      this.props.count !== null &&
      this.props.count !== 0 &&
      this.props.count !== ""
    ) {
      return (
        <View
          style={{
            backgroundColor: Constants.COLOR.THEME_COLOR,
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 15,
            position: "absolute",
            left: -15,
            bottom: 9,
            marginLeft: 25,
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: Constants.FONT_SIZE.XXS,
              alignItems: "center",
              textAlign: "center",
              alignContent: "center",
              justifyContent: "center",
              textAlignVertical: "center",
              color: "white",
            }}
          >
            {this.props.count < 10 ? this.props.count : this.props.count}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  };

  _showProfileIcon = () => {
    if (this.props.userImageURL !== "") {
      return (
        <Image
          style={[
            styles.headerRightImage,
            {
              width: deviceHeight / 30,
              height: deviceHeight / 30,
              borderRadius: deviceHeight / 30,
              marginEnd: 5,
            },
          ]}
          source={{ uri: this.props.userImageURL }}
        />
      );
    } else {
      return (
        <Image
          style={[
            styles.headerRightImage,
            {
              width: deviceHeight / 35,
              height: deviceHeight / 35,
              marginEnd: 5,
            },
          ]}
          source={require("../../images/user_white.png")}
        />
      );
    }
  };
  _navigateSOSScreen = () => {
    // console.log('Current Scene', Actions.currentScene);
    // Actions.SOSScreen();
    navigate("SOSScreen");
  };
  _navigateNotificationScreen = () => {
    // console.log('Current Scene', Actions.currentScene);
    // // if (Actions.currentScene === currentScene) {
    // Actions.notificationListScreen();
    // // }
    navigate("notificationListScreen");
  };
  _navigateProfileScreen = () => {
    // console.log('Current Scene', Actions.currentScene);
    // // if (Actions.currentScene === currentScene) {
    // Actions.viewProfileScreen();
    // // }
    navigate("viewProfileScreen");
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    profileState: { userImageURL },
    configState: { userName, phonepeUrl },
    notificationState: { isNotificationListLoading, count },
  } = state;

  return {
    userName,
    userImageURL,
    isNotificationListLoading,
    count,
    phonepeUrl,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getNotificationCount }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: "center",
    width: "100%",
    height: Platform.OS === "ios" ? 64 : 54,
    flexDirection: "row",
    backgroundColor: Constants.COLOR.THEME_COLOR,
    borderBottomWidth: 2,
    borderBottomColor: Constants.COLOR.THEME_COLOR,
    // flex: 1,
    // gap: 15,
    // rowGap: 10,
  },

  leftView: {
    flex: 1,
  },
  rightView: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
  headingText: {
    color: "#FFFFFF",
    fontSize: Constants.FONT_SIZE.XL,
  },
  headerRightImage: {
    // marginLeft: 25,
    width: deviceHeight / 25,
    height: deviceHeight / 25,
  },
  locationNameView: {
    paddingVertical: 15,
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});

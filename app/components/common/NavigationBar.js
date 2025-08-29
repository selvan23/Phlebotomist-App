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
import { IconOutline } from "@ant-design/icons-react-native";
import SosIcon from "../../assets/images/SosIcon";

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
    count: PropTypes.any,
    getNotificationCount: PropTypes.func,
    showOnBackNavigation: PropTypes.bool
  };

  constructor(props) {
    super(props);
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
          style={styles.badge}
        >
          <Text
            style={styles.badgeText}
          >
            {this.props.count < 10 ? this.props.count : this.props.count}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  };

  render() {
    const {showOnBackNavigation} = this.props
    return (
      <View style={{ backgroundColor: Constants.COLOR.WHITE_COLOR }}>
        {this.props.isShowNavBar ? (
          <View style={styles.container}>
            <TouchableOpacity
              disabled={!showOnBackNavigation}
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={styles.leftView}
            >
              {showOnBackNavigation ? (
                <IconOutline
                  style={{ marginBottom: 2 }}
                  name="arrow-left"
                  size={22}
                />
              ) : null}
              <Text style={styles.headingText}>{this.props.title}</Text>
            </TouchableOpacity>
            {this.props.isHideImages ? null : (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    this._navigateSOSScreen();
                  }}
                  style={styles.iconWrapper}
                >
                  <SosIcon width={50} height={50} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // Actions.pdfReport({pdf: this.props.phonepeUrl});
                    navigate("pdfReport", {
                      pdf: this.props.phonepeUrl,
                    });
                  }}
                >
                  <HeaderIcon icon={"qrcode"} width={40} height={40} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._navigateNotificationScreen();
                  }}
                >
                  <View>
                  <HeaderIcon icon={"bell"} width={40} height={40} />
                    {this._renderNotificationCount()}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._navigateProfileScreen();
                  }}
                >
                  <HeaderIcon icon={"user"} width={40} height={40} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null}
      </View>
    );
  }

  _navigateSOSScreen = () => {
    navigate("SOSScreen");
  };
  _navigateNotificationScreen = () => {
    navigate("notificationListScreen");
  };
  _navigateProfileScreen = () => {
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

const HeaderIcon = ({ icon, width, height }) => (
  <View style={styles.iconWrapper}>
    <IconOutline color={Constants.COLOR.PRIMARY_COLOR} size={25} name={icon} />
  </View>
);

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getNotificationCount }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderBottomWidth: 2,
    borderBottomColor: Constants.COLOR.WHITE_COLOR,
    // flex: 1,
    // gap: 15,
    // rowGap: 10,
  },

  leftView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightView: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
  headingText: {
    color: Constants.COLOR.BLACK_COLOR,
    fontSize: Constants.FONT_SIZE.XL,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 5
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
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF2F5",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeCart: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#1e3989",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: Constants.COLOR.WHITE_COLOR,
    fontSize: 10,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_ANEK_LATIN_SEMI_BOLD,
    textAlign: "center",
  },
});

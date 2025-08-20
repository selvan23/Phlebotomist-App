/*************************************************
 * SukraasLIS - Phlebotomist
 * AboutScreen.js
 * Created by Abdul on 16/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import ButtonBack from '../common/ButtonBack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { callAboutInfo } from '../../actions/AboutScreenAction';
import HTML from 'react-native-render-html';
import PropTypes from 'prop-types';
import LoadingScreen from '../common/LoadingScreen';
import { nativationPop } from '../../rootNavigation';
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class AboutScreen extends Component {
  static propTypes = {
    isAboutScreenLoading: PropTypes.bool,
    arrAboutInfo: PropTypes.object,
    callAboutInfo: PropTypes.func,
  };
  constructor() {
    super();
    this.state = {
      id: '',
      fileUri: [],
      imgData: [],
      btnBackDisabled: false,
    };
  }

  _renderContentView() {
    return (
      <View style={{ marginHorizontal: 10 }}>
        <HTML
        baseStyle={{ color: 'black', fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR }}
        source={{
          html: this.props.arrAboutInfo.Client_Description
        }} />
        <Text style={[styles.textView, { marginTop: 5 }]}>
          {this.props.arrAboutInfo.Client_Location}
        </Text>
        <Text style={styles.textView}>
          {this.props.arrAboutInfo.Client_Email_Id}
        </Text>
        <TouchableOpacity onPress={() => this.__callWebUrl()}>
          <Text style={[styles.textViewLink]}>
            {this.props.arrAboutInfo.Client_Web_Address}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  __callWebUrl = () => {
    var url = this.props.arrAboutInfo.Client_Web_Address.includes('http')
      ? this.props.arrAboutInfo.Client_Web_Address
      : 'https://' + this.props.arrAboutInfo.Client_Web_Address;
    console.log("about url", url);  
    Linking.canOpenURL(url).then((supported) => {
      console.log("supported:",supported);
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(url); // Need to investigate why support is coming false
        // Utility.showAlert(Constants.VALIDATION_MSG.NO_DATA_FOUND);
      }
    });
  };

  _renderButton = () => {
    return (
      <TouchableOpacity
        // style={styles.backButton}
        disabled={this.state.btnBackDisabled}
        onPress={() => {
          this.setState({
            btnBackDisabled: true,
          });
          // Actions.pop();
          nativationPop();
          setTimeout(() => {
            this.setState({
              btnBackDisabled: false,
            });
          }, 1000);
        }}>
        <ButtonBack />
      </TouchableOpacity>
    );
  };

  _renderScreens = () => {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          {this._renderMainLogo()}
          <Text
            style={{ fontSize: Constants.FONT_SIZE.XXXL, textAlign: 'center', color: 'black', fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR }}>
            {this.props.arrAboutInfo.Client_Name}
          </Text>
          {this._renderContentView()}
        </KeyboardAwareScrollView>
        <View style={styles.backButtonView}>{this._renderButton()}</View>
      </View>
    );
  };


  _renderMainLogo = () => {
    if (this.props.arrAboutInfo.Client_Logo !== '') {
      return (
        <Image
          source={{ uri: this.props.arrAboutInfo.Client_Logo }}
          resizeMode={'contain'}
          style={styles.imageLogo}
        />
      )
    }
    else {
      return <View />
    }

  }


  componentDidMount() {
    this.props.callAboutInfo();
  }


  render() {
    if (this.props.isAboutScreenLoading) {
      return <LoadingScreen />;
    } else {
      if (this.props.arrAboutInfo.hasOwnProperty('Client_Description')) {
        return this._renderScreens();
      } else {
        return (
          <View style={styles.container}>
            <Text style={[styles.textContentStyle, { top: 20 }]}>
              The application allows the Patient to confirm the bookings for
              various tests and complete an Online payment.
            </Text>

            <Text style={[styles.textContentStyle, { top: 40 }]}>
              The Phlebotomist application helps the Sample Collectors to
              receive the Patient information with all of the details of the
              Tests, reach the Patient’s location and collect the samples in a
              safe and sound environment.
            </Text>
            <TouchableOpacity style={styles.emailContainer}>
              <Text
                style={{
                  alignSelf: 'center',
                  color: Constants.COLOR.WHITE_COLOR,
                }}>
                W W W . s u k r a a l i s . c o m
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              disabled={this.state.btnBackDisabled}
              onPress={() => {
                this.setState({
                  btnBackDisabled: true,
                });
                // Actions.pop();
                nativationPop();
                setTimeout(() => {
                  this.setState({
                    btnBackDisabled: false,
                  });
                }, 1000);
              }}>
              <ButtonBack />
            </TouchableOpacity>
          </View>
        );
      }
    }
  }
}

const mapStateToProps = (state, props) => {
  const {
    aboutScreenState: { isAboutScreenLoading, arrAboutInfo },
  } = state;

  return {
    isAboutScreenLoading,
    arrAboutInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      callAboutInfo,
    },
    dispatch,
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(AboutScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: Constants.COLOR.WHITE_COLOR
  },
  textContentStyle: {
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.M,
  },
  emailContainer: {
    top: 100,
    paddingVertical: 10,
    backgroundColor: Constants.COLOR.THEME_COLOR,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    bottom: 15,
  },
  textView: {
    paddingTop: 5,
    fontSize: Constants.FONT_SIZE.SM,
    color: 'black',
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  textViewLink: {
    flex: 1,
    width: '100%',
    textAlign: 'center',
    backgroundColor: Constants.COLOR.THEME_COLOR,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
    fontSize: Constants.FONT_SIZE.L,
    padding: 20,
    color: Constants.COLOR.WHITE_COLOR,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR
  },
  imageLogo: {
    alignSelf: 'center',
    width: deviceHeight * (5 / 15),
    // height: deviceHeight * (3 / 20),
    height: deviceHeight * (1 / 5),
  },
  backButtonView: {
    alignSelf: 'flex-start',
    marginVertical: 20,
    marginLeft: 10,
  },
});
